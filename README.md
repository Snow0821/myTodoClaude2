# 내 일정 수첩

- 문제: 내 일정을 잘 관리하기가 어렵다
- 해결: 내 일정을 기록한다
- 완료 조건: 일정이 기록되고, 완료한 일정을 체크할 수 있다

배포: https://claude.ai/artifact/NwN5JXLL6Vk2kexn6Ze94L

## 구조

- `app.html` — 앱 본문. Artifact로 그대로 배포합니다.
- `scripts/build.sh` — `app.html`을 완전한 HTML 문서로 감싸 `public/index.html`을 만듭니다.
- `vercel.json` — Vercel이 위 스크립트로 빌드하고 `public/`을 서빙하도록 설정합니다.

## 저장 방식

Artifact에서는 로그인한 사용자의 일정은 Artifact db(`data/users/<id>`)에 비공개로 저장되고, 저장소를 쓸 수 없을 때와 Vercel에서는 브라우저 localStorage에 저장됩니다.
