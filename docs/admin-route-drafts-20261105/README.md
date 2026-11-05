# 관리자 경로 초안 — 2026-11-05

## 완료 범위
- 기준 main 7184ed6c0d3a97027894498c084676700f61f0ff, 별도 quality/admin-route-drafts-20261105 브랜치.
- 관리자 → 경로 초안: 승인된 코스 선택, GPX/GeoJSON 불러오기, 분리 구간·좌표·합산 거리·첫/마지막 좌표, 명시적 지도 미리보기, 자료 출처/라이선스 근거/확인일/코스 형태/검토 상태/수정 사유 저장, 이전 버전 조회, 검토용 JSON 내려받기.
- 비공개 초안만 저장한다. verified·published 상태나 공개 적용 버튼은 없다. 라이선스·코스 일치 검토 뒤 공개 파이프라인 연결은 후속 범위다.
- 원본 파일/고도/시간은 서버 업로드하지 않고, 브라우저에서 읽은 2D 좌표와 명시한 근거만 저장한다. 원본 경로를 단순화하거나 구간 사이를 연결하지 않는다.

## DB 및 권한
- private.course_route_drafts 추가. 기존 courses/시설/회원/권한/GPS/찜 테이블과 기존 함수는 변경하지 않았다.
- (course_id, revision)별 append-only 이력, 기존 코스명 스냅샷과 관리자 UUID/서버 시각 기록. API 응답에는 관리자 UUID를 내보내지 않는다.
- public RPC는 INVOKER 래퍼, private 핵심 함수는 빈 search_path DEFINER + auth.uid/is_admin 서버 확인. 저장은 기존 account_can_write도 확인.
- 일반 역할에 테이블 권한 없음, RLS 활성화 및 직접 접근 deny 정책. anon/PUBLIC RPC 실행 권한 없음. authenticated RPC는 서버 관리자 검사 통과 시만 실행.
- 과정에서 새 테이블 RLS 정책 누락 INFO가 발견되어 rpc_only deny 정책 추가. 최종 advisor에 새 경로 기능 관련 finding 없음. 기존 프로젝트 다른 경고는 이 작업에서 변경하지 않았다.
- 50구간/10,000점/600KB payload 제한, 한국 좌표 범위·숫자·HTTPS URL·확인일·초안 상태 서버 검사. 코드 인젝션/외부 URL fetch 없음.
- advisory transaction lock + expected revision으로 중복·경합 방지, 최대250버전. 오래된 버전을 읽어 수정해도 최신 revision에 새 이력으로 추가.
- 배포된 마이그레이션 이름 admin_route_drafts_private_history / route_drafts_deny_direct_access. 복구는 데이터 삭제 대신 database_sql/admin-route-drafts-disable.sql의 신규 RPC 실행 중지만 사용. 해당 중지 스크립트는 실행하지 않았다.

## 검증
- 로컬 전체 379/379 통과 (사용자 미추적 offline-shell 1개 포함). 최초 1개는 관리자 lazy 자산 수 기대값10→12를 반영하지 않은 검사로, 추가 모듈 격리 assertion과 함께 수정.
- 실제 DB 검사: 비회원 권한 없음, authenticated 비관리자 read/save 42501, private table 직접 접근 불가, RLS 활성화. 양의 저장/경합/불량 좌표는 전체 롤백한 임시 pg_temp 복제 함수에서 검사했으며 운영 보안 함수는 변경하지 않았다.
- 이후 로그인된 실제 관리자 브라우저에서 진짜 RPC 저장/재조회/이전1차 열기/최신2차/지도 미리보기 성공.
- c361 기존 공개 course-routes.js GPX 590점을 그대로 비공개 초안1·2차로 등록했다. 두 버전 모두 공개 GPX와 JSON 좌표 완전 일치(true) 확인. 테스트용 가짜 장소나 가짜 경로를 저장하지 않았다. review_state=evidence_missing, 재사용 조건 추가 대조 필요.
- 기존 DB courses.path는 500점, 공개 상세 GPX는590점이라는 기존 차이도 확인. 기존 DB 좌표는 수정하지 않았다. DB500점과 초안을 같다고 보고하면 안 된다.
- 브라우저: 로그인된 localhost:9013 관리자, 360/390/430/768/1440px, document/panel 넘침없음, 버튼44px 이상. 실제 GPX 좌표를 GeoJSON으로 불러와서 검사(파일 선택 도구는 매우 오래 대기했으나 성공). GPX 파서는 DTD거절·namespace/구간·혼합형 거절 자동검사, 실제 브라우저에서 GPX 파일 불러오기 자체는 미검증.
- outputs/admin-route-drafts-20261105/browser.json 및 preview-mobile.jpg/preview-pc.jpg 참고. 실제 iPhone Safari/Galaxy·GPS·외부 앱은 미검증.

## 서울 경로 근거 후속 조사
- 안산자락길 공식 https://gil.seoul.go.kr/trail/view.do?key=2405200007&sc_trailSn=132&sc_trailSeCd=SE001 에서 7km,150분,목줄 착용 반려견 출입·경유지와 스마트서울맵 연결 확인.
- 코스자료 다운로드는 application/octet-stream으로 텍스트 브라우저에서 열리지 않았다. 원문 좌표 일치/해당 파일의 재사용 조건은 확인되지 않았다.
- https://www.seoul.go.kr/helper/copyright.do 는 표시된 자료별 공공누리 범위를 따르고 미표시 자료는 협의하도록 안내. 해당 개별 좌표 파일의 자유 재사용 근거가 확보된 것은 아니다.
- 서울숲 sc_trailSn=152 공식 소개 URL은 텍스트 도구에서 접근 실패. 임의로 GPX/공식 좌표 검증 완료로 승격하지 않는다.

## 남은 통합 프로젝트
1. 초안 → 자료 근거·코스 일치 검토 → 명시적 공개 승인 → 정적 생성기·홈/지도 동일 경로 반영. 현재 초안 저장만으로 공개하지 않는 것이 의도된 상태다.
2. 서울숲·안산자락길 등115개 좌표 근거/재사용 범위 대조.
3. 장소 유형별 추가 상세 디자인 고도화. 기존22,317 상세 템플릿 검사는 유지하지만 이번에 새 디자인을 전체 적용한 것은 아님.
4. 최종 GitHub/Pages 운영 확인 결과는 outputs release에 저장.

## 운영 첫 진입에서 발견한 경합 보완
- PR18 초기 운영 확인 중 코스 비동기 로딩이 끝나기 전에 관리자 창을 열면, 처음 읽은 빈 목록이 고정되는 문제를 발견했다. 서버 초안/RPC 오류는 아니다.
- 코스를 배열 스냅샷 대신 provider 함수로 읽고, 선택창 포커스 및 '코스 목록 다시 확인' 버튼에서 최신 공개 자료를 읽도록 보완. 편집 중 일시적으로 자료가 비면 기존 선택을 유지한다. 추가 네트워크 폴링이나 회원 데이터 조회 없음.
- localhost 실제 로그인 관리자에서 복구 버튼으로 공개412개(빈 선택 포함413 option) 확인. 늦은 데이터 provider 회귀 검사 포함 전체380/380통과.
- admin-loader 캐시 버전 route-drafts2 / SW v237로 갱신해 이전 배열 인자 코드와 새 provider 모델이 혼합되지 않도록 처리. 후속 PR/배포까지 확인해야 최종 완료다.
