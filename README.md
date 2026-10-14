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

## 일정 비서 (챗봇)

화면 오른쪽 아래 "일정 비서" 버튼으로 엽니다. 내 일정 목록과 오늘 날짜를 함께 보내 일정에 맞춰 답합니다.

- Vercel: `api/chat.js`가 OpenRouter로 중계합니다. 키는 서버에만 있습니다.
  - `OPENROUTER_API_KEY` (필수)
  - `OPENROUTER_MODEL` (선택, 기본값 `nvidia/nemotron-3-super-120b-a12b:free`)
- Artifact: 외부 요청이 막혀 있어 Artifact의 `sample` 기능으로 Claude에게 묻습니다.
