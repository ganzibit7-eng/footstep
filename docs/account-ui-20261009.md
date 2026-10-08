# Account UI — 2026-10-09 (Asia/Seoul)

References were selected for relevance rather than claiming a measured site ranking:

| Site | Verified reference | Adaptation |
| --- | --- | --- |
| Airbnb | https://www.airbnb.co.kr/login — shared login/sign-up entry, concise verification instructions, alternative methods | One login/sign-up dialog, concise purpose and provider choices |
| AllTrails | https://support.alltrails.com/hc/en-us/articles/37207530248980-How-to-create-an-AllTrails-account — free account, email/social entry; https://www.alltrails.com/ — activity recording and saved trail discovery | Three account benefits related to walks, saved courses and pet profile |
| PetFriends | https://m.pet-friends.co.kr/auth/signin and /auth/signup/email — login and structured membership fields; live sign-in page exposes limited text to retrieval | Reviewed as pet-domain reference; no pixel-level layout or ranking claim |

The resulting layout is original Balzaguk styling: forest/cream palette, a compact welcome, membership benefit chips and 100P first-join information, Kakao/Google buttons, collapsible passwordless-email entry, explicit consent and a browse-without-signing-in option. Desktop and small-screen sizing use dynamic viewport bounds and internal scrolling; inputs use 16px to avoid iOS focus zoom. Dark mode and reduced-motion preferences are handled.

Profile inputs are grouped into profile, pet, neighborhood and account-management cards. Existing IDs and handlers are preserved. Profile has an explicit close control. Account deletion UI remains accessible.

Presentation adds in-dialog feedback, required email validation, aria-busy states, overlapping request prevention, focus trapping/return, Escape close, background inert/scroll lock and closing the login dialog when opening legal pages. Existing provider names, Kakao scopes, redirect URLs, Auth session handling and database code are unchanged. No email was sent and no provider sign-in was submitted during validation. tests/auth-ui.cjs uses mocks and passes; tests/account-deletion.mjs passes, including all inline JavaScript syntax. The broader pre-existing tests/feature-quality.cjs harness fails because its browser fixture lacks navigator (and after temporarily providing navigator also lacks walkDraftOwner); that harness and unrelated features were left unchanged. HTML parsing confirms unique IDs and four correctly nested profile sections.
