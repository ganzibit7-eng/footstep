const userId = process.env.THREADS_USER_ID?.trim();
const token = process.env.THREADS_ACCESS_TOKEN?.trim();

if (!userId || !token) {
  throw new Error('THREADS_USER_ID와 THREADS_ACCESS_TOKEN을 GitHub Actions Secret에 등록해 주세요.');
}

const response = await fetch(`https://graph.threads.net/v1.0/${encodeURIComponent(userId)}?fields=id,username`, {
  headers: { Authorization: `Bearer ${token}` },
  signal: AbortSignal.timeout(30_000),
});
const data = await response.json().catch(() => ({}));

if (!response.ok || data.error || !data.id || !data.username) {
  const code = data.error?.code ? ` (${data.error.code})` : ` (${response.status})`;
  throw new Error(`Threads 프로필 인증에 실패했습니다${code}. 권한, 사용자 ID, 토큰 만료를 확인해 주세요.`);
}

console.log(`Threads API 연결 확인 완료: @${data.username}. 게시물은 발행하지 않았습니다.`);
