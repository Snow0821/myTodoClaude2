# 내 일정 수첩

- 문제: 내 일정을 잘 관리하기가 어렵다
- 해결: 내 일정을 기록한다
- 완료 조건: 일정이 기록되고, 완료한 일정을 체크할 수 있다

배포: https://claude.ai/artifact/NwN5JXLL6Vk2kexn6Ze94L

`index.html` 한 파일로 된 Artifact 페이지입니다. 로그인한 사용자의 일정은 Artifact db(`data/users/<id>`)에 비공개로 저장되고, 저장소를 쓸 수 없을 때는 브라우저 localStorage에 저장됩니다.
