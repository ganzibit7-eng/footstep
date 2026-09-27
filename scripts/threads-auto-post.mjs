import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const POSTS_FILE = process.env.THREADS_POSTS_FILE || path.join(ROOT, 'data/threads-posts.json');
const STATE_FILE = process.env.THREADS_POST_STATE_FILE || path.join(ROOT, 'data/threads-post-state.json');
const API_BASE = 'https://graph.threads.net/v1.0';
const SITE = 'https://balzaguk.com';
const DRY_RUN = process.argv.includes('--dry-run');

function kstDate(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(now);
  const get = type => parts.find(part => part.type === type)?.value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}

function postForDate(posts, date) {
  if (!Array.isArray(posts) || posts.length < 2) throw new Error('게시물 목록에는 2개 이상의 글이 필요합니다.');
  const start = Date.UTC(2026, 0, 1);
  const today = Date.parse(`${date}T00:00:00Z`);
  const dayIndex = Math.floor((today - start) / 86_400_000);
  const index = ((dayIndex % posts.length) + posts.length) % posts.length;
  const item = posts[index];
  const url = new URL(item.path, SITE);
  url.searchParams.set('utm_source', 'threads');
  url.searchParams.set('utm_medium', 'social');
  url.searchParams.set('utm_campaign', 'organic');
  url.searchParams.set('utm_content', `${item.key}-${date}`);
  return { ...item, url: url.toString(), text: `${item.text}\n\n${url}` };
}

async function apiRequest(pathname, { token, method = 'GET', params = {} }) {
  const url = new URL(`${API_BASE}/${pathname.replace(/^\/+/, '')}`);
  if (method === 'GET') {
    for (const [key, value] of Object.entries(params)) url.searchParams.set(key, String(value));
  }
  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(method !== 'GET' ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {}),
    },
    ...(method !== 'GET' ? { body: new URLSearchParams(params) } : {}),
    signal: AbortSignal.timeout(30_000),
  });
  const raw = await response.text();
  let data;
  try { data = raw ? JSON.parse(raw) : {}; } catch { data = {}; }
  if (!response.ok || data.error) {
    const message = data.error?.message || `Threads API 요청 실패 (${response.status})`;
    throw new Error(message);
  }
  return data;
}

async function readRecentPosts({ token, userId }) {
  const data = await apiRequest(`${encodeURIComponent(userId)}/threads`, {
    token,
    params: { fields: 'id,text,timestamp,permalink', limit: 25 },
  });
  return Array.isArray(data.data) ? data.data : [];
}

async function waitForContainer({ token, containerId }) {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const status = await apiRequest(encodeURIComponent(containerId), {
      token,
      params: { fields: 'status,error_message' },
    });
    if (status.status === 'FINISHED') return;
    if (status.status === 'ERROR' || status.status === 'EXPIRED') {
      throw new Error(status.error_message || `Threads 게시물 준비 실패 (${status.status})`);
    }
    await new Promise(resolve => setTimeout(resolve, 1_000));
  }
  throw new Error('Threads 게시물 준비 상태 확인 시간이 초과됐습니다.');
}

async function publish({ token, userId, text }) {
  const container = await apiRequest(`${encodeURIComponent(userId)}/threads`, {
    token,
    method: 'POST',
    params: { media_type: 'TEXT', text },
  });
  if (!container.id) throw new Error('Threads 게시물 컨테이너 ID를 받지 못했습니다.');
  await waitForContainer({ token, containerId: container.id });
  const result = await apiRequest(`${encodeURIComponent(userId)}/threads_publish`, {
    token,
    method: 'POST',
    params: { creation_id: container.id },
  });
  if (!result.id) throw new Error('Threads 게시물 ID를 받지 못했습니다.');
  return result.id;
}

async function main() {
  const date = kstDate();
  const posts = JSON.parse(await readFile(POSTS_FILE, 'utf8'));
  const selected = postForDate(posts, date);
  const state = JSON.parse(await readFile(STATE_FILE, 'utf8').catch(() => '{"lastRunDate":null}'));
  if (state.lastRunDate === date) {
    console.log(`이미 ${date} 게시를 완료해 건너뜁니다.`);
    return;
  }
  if (DRY_RUN) {
    console.log(JSON.stringify({ date, key: selected.key, text: selected.text }, null, 2));
    return;
  }

  const token = process.env.THREADS_ACCESS_TOKEN?.trim();
  const userId = process.env.THREADS_USER_ID?.trim();
  if (!token || !userId) throw new Error('THREADS_ACCESS_TOKEN과 THREADS_USER_ID가 필요합니다.');

  const recent = await readRecentPosts({ token, userId });
  const duplicate = recent.find(post => post.text?.trim() === selected.text.trim());
  if (duplicate) {
    state.lastRunDate = date;
    state.lastPostId = duplicate.id;
    state.lastPostKey = selected.key;
    state.lastPermalink = duplicate.permalink || null;
    await writeFile(STATE_FILE, `${JSON.stringify(state, null, 2)}\n`);
    console.log(`같은 글이 이미 게시되어 있어 중복 게시를 막았습니다 (${date}).`);
    return;
  }

  const postId = await publish({ token, userId, text: selected.text });
  let permalink = null;
  try {
    const published = await apiRequest(encodeURIComponent(postId), {
      token,
      params: { fields: 'permalink' },
    });
    permalink = published.permalink || null;
  } catch (error) {
    console.warn(`게시물 링크를 불러오지 못했습니다: ${error.message}`);
  }
  await writeFile(STATE_FILE, `${JSON.stringify({
    lastRunDate: date,
    lastPostId: postId,
    lastPostKey: selected.key,
    lastPermalink: permalink,
  }, null, 2)}\n`);
  console.log(`Threads 게시 완료: ${date} · ${selected.key}${permalink ? ` · ${permalink}` : ''}`);
}

main().catch(error => {
  console.error(`Threads 자동 게시 실패: ${error.message}`);
  process.exitCode = 1;
});
