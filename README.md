# Project-GirzDay-react-repo

### 🌿 브랜치 전략 / Branch Strategy

우리 프로젝트는 **안정성과 협업의 효율성**을 위해 `main`, `dev` 브랜치를 아래와 같은 방식으로 운영합니다.

---

### ✅ 브랜치 종류와 역할

| 브랜치 이름 | 역할 설명 |
|-------------|------------|
| `main`      | **완성된 기능만 모아놓는 최종 배포 브랜치**입니다. 실제 서비스에 반영되는 안정적인 코드만 포함됩니다. |
| `dev`       | 모든 팀원이 함께 작업하는 **개발 브랜치**입니다. 새로운 기능, 수정 작업 등은 모두 여기에서 진행됩니다. |

---

### 🔧 브랜치 사용 방법

#### 1. 프로젝트 시작하기
```bash
git clone [레포지터리 주소]     # 프로젝트 처음 받을 때
git checkout dev               # 항상 dev 브랜치에서 작업 시작
git pull origin dev            # 최신 dev 내용 가져오기
```

2. **개발 작업 수행**
- 파일 수정, 커밋, 로컬 테스트 등

3. **작업 완료 후**
```bash
git add .
gitmoji -c 
git push origin dev
```
🔗 참고 자료
[Git 커밋 메시지 이모지 가이드 (Gitmoji)](https://inpa.tistory.com/entry/GIT-%E2%9A%A1%EF%B8%8F-Gitmoji-%EC%82%AC%EC%9A%A9%EB%B2%95-Gitmoji-cli)

### 🧠 전략 요약
```
main  ←  dev
          ↑
    (모든 팀원이 작업)
```

- 모든 작업은 dev 브랜치에서만 진행합니다.
- main 브랜치는 절대 직접 수정하지 않습니다.
- 중요한 변경 전에는 git pull로 항상 최신 코드를 받고 충돌을 방지합니다.

### 📝 협업 팁
- 커밋 전에는 항상 git pull origin dev로 다른 사람의 작업을 먼저 반영해 주세요.
- 충돌(conflict)이 생겼다면 팀원에게 알리고 같이 해결하면 됩니다.

