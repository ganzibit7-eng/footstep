# 발자국 Threads 자동 게시 설정

GitHub Actions가 매일 오전 9시 10분(한국 시간)에 발자국 공식 사이트 정보로 작성한 게시물 한 개를 Threads에 올립니다. 12개 주제를 순환하고, 게시 링크에는 `utm_source=threads`를 붙여 유입 통계를 구분합니다.

## 현재 포함된 안전 장치

- API 연결 정보가 없거나 `THREADS_AUTO_POST_ENABLED`가 `true`가 아니면 게시하지 않습니다.
- 같은 날 다시 실행해도 한 번만 게시합니다.
- 최근 게시물에서 동일한 본문을 확인해 중복 게시를 막습니다.
- 토큰은 GitHub Actions Secrets에서만 읽으며 파일·로그·게시물에 기록하지 않습니다.
- 사진이나 위치 데이터 없이 텍스트와 발자국 링크만 게시합니다.

## 최초 연결

1. Meta for Developers에서 Threads API가 활성화된 앱을 준비하고 발자국 운영 Threads 계정으로 인증합니다.
2. 게시 권한 `threads_content_publish`와 사용자 기본 권한 `threads_basic`이 포함된 장기 액세스 토큰을 발급합니다.
3. GitHub 저장소 `ganzibit7-eng/footstep`의 **Settings → Secrets and variables → Actions → New repository secret**에서 아래 세 값을 등록합니다.

| Secret 이름 | 값 |
| --- | --- |
| `THREADS_ACCESS_TOKEN` | Threads 사용자 장기 액세스 토큰 |
| `THREADS_USER_ID` | 인증된 Threads 계정 사용자 ID |
| `THREADS_AUTO_POST_ENABLED` | 처음에는 `false`; 게시를 시작할 때 `true` |

4. **Actions → Threads API connection check → Run workflow**를 실행해 계정 연결을 테스트합니다. 이 테스트는 프로필을 읽기만 하며 게시물을 올리지 않습니다.
5. 연결 확인이 성공하면 `THREADS_AUTO_POST_ENABLED`를 `true`로 바꾸세요. 매일 자동 게시가 시작되고, **Threads daily post → Run workflow**를 직접 실행하면 오늘 글이 즉시 올라갑니다.

## Meta 공식 안내\n\n- [Threads API 앱 설정 및 권한](https://developers.facebook.com/docs/threads/get-started/create-an-app/)\n- [게시물 만들기·게시하기](https://developers.facebook.com/docs/threads/posts/)\n- [장기 토큰 갱신](https://developers.facebook.com/documentation/threads/get-started/long-lived-tokens)\n\n## 토큰 관리

Threads 장기 토큰은 만료 전에 Meta의 공식 토큰 갱신 절차로 교체해야 합니다. 새 토큰을 발급받으면 GitHub Actions의 `THREADS_ACCESS_TOKEN` Secret을 갱신하세요. 토큰이 만료되면 게시 작업은 실패하고, 기존 게시 상태는 유지됩니다.

## 게시물 수정

`data/threads-posts.json`에서 게시 문구와 연결할 검증된 사이트 경로를 수정할 수 있습니다. `key` 값은 각 글마다 고유해야 합니다. 테스트 미리보기는 저장소에서 아래 명령으로 확인합니다.

```bash
node scripts/threads-auto-post.mjs --dry-run
```
