# lenz
project for senior's web accessibility

<Github 사용법> - Curated and Refined by gemini-1.5-pro-api-0514 at https://chat.lmsys.org/


0. Git 다운로드 및 설치
   - https://git-scm.com/ 에서 본인의 운영체제에 맞는 Git을 다운로드 후 설치합니다.

1. 디렉토리 탐색
   - 윈도우: 
      - cd 명령어를 사용하여 원하는 디렉토리로 이동합니다.
      - dir 명령어로 현재 디렉토리의 파일 및 폴더 목록을 확인합니다.
   - 리눅스/맥:
      - cd 명령어를 사용하여 원하는 디렉토리로 이동합니다.
      - pwd 명령어로 현재 디렉토리 경로를 확인합니다.
      - tree 명령어로 현재 디렉토리의 트리 구조를 확인합니다. (설치 필요할 수 있음)
      - ls -al 명령어로 현재 디렉토리의 파일 및 폴더 목록을 자세히 확인합니다.

2. Git Bash 실행
   - 윈도우: 탐색기에서 원하는 폴더를 우클릭 후 "Git Bash Here"를 선택합니다.
   - 리눅스/맥: 터미널을 실행합니다.

3. Git 저장소 초기화
   - git init 명령어를 실행하여 현재 디렉토리를 Git 저장소로 초기화합니다.

4. 파일 스테이징 (Staging)
   - git add . : 현재 디렉토리의 모든 변경 사항을 스테이징합니다.
   - git add -A : 현재 디렉토리 및 하위 디렉토리의 모든 변경 사항을 스테이징합니다.
   - git add <파일명> : 특정 파일을 스테이징합니다. 
   - 주의: 이 단계에서는 변경 사항이 아직 커밋되지 않습니다.

5. 기존 프로젝트 복제 (Cloning)
   - git clone <프로젝트 링크> 명령어를 사용하여 기존 프로젝트를 복제합니다. 
   - 이 경우, 3번 (git init) 단계는 건너뜁니다.

6. 사용자 정보 설정
   - git config --global user.name "사용자 이름": 커밋할 사용자 이름을 설정합니다.
   - git config --global user.email "사용자 이메일": 커밋할 사용자 이메일을 설정합니다.
   - 
   - git congit config --global --unset user.name "사용자 이름" : 선택한 사용자 이름을 삭제합니다.
   - git config --global --unset-all user.name : 전체 사용자 이름을 삭제합니다
   - git congit config --global --unset user.email "사용자 이메일" : 선택한 사용자 이메일을 삭제합니다.
   - git config --global --unset-all user.email : 전체 사용자 이메일을 삭제합니다
  
   - git config --global --list : 사용자 이메일과 이름의 목록을 보여줍니다.

7. 원격 저장소 설정
   - git remote add origin <원격 저장소 주소>: 원격 저장소를 추가합니다. 
      - 일반적으로 origin이라는 변수명을 사용하지만, 다른 이름을 사용해도 무방합니다.
   - git remote -v: 설정된 원격 저장소 목록을 확인합니다.

8. 변경 사항 커밋 (Commit)
   - git commit -m "커밋 메시지": 스테이징된 변경 사항들을 메시지와 함께 커밋합니다. 
   - 커밋 메시지는 변경 사항에 대한 간략한 설명을 담고 있어야 합니다.

9. 원격 저장소와 동기화
   - git pull origin master: 원격 저장소의 최신 변경 사항을 로컬 저장소로 가져옵니다. (일반적으로 master 브랜치에서)
   - git push origin master: 로컬 저장소의 커밋들을 원격 저장소로 전송합니다. (일반적으로 master 브랜치로)

10. 브랜치 (Branch) 다루기
   - git branch: 현재 저장소의 브랜치 목록을 보여줍니다.
   - git branch <브랜치 이름>: 새로운 브랜치를 생성합니다.
   - git checkout <브랜치 이름>: 특정 브랜치로 이동합니다.
   - git checkout -b <브랜치 이름>: 새로운 브랜치를 생성하고 해당 브랜치로 이동합니다.
   - git branch -d <브랜치 이름>: 브랜치를 삭제합니다.

11. 병합 (Merge) 하기
   - git checkout <메인 브랜치>: 변경 사항을 병합할 메인 브랜치로 이동합니다. (예: master)
   - git merge <병합할 브랜치>:  특정 브랜치의 변경 사항을 현재 브랜치로 병합합니다. 
   - 충돌 발생 시, 충돌 부분을 해결하고 git add 와 git commit 으로 병합을 완료합니다. 


✨ 추가 정보
브랜치 전략: 효과적인 협업을 위해 다양한 브랜치 전략 (Git Flow, GitHub Flow 등)을 활용할 수 있습니다.

Git 공식 사이트: https://git-scm.com/
GitHub 공식 사이트: https://github.com/
생활코딩 Git: https://opentutorials.org/course/2708

* 브랜치 전략: 효과적인 협업을 위해 다양한 브랜치 전략 (Git Flow, GitHub Flow 등)을 활용할 수 있습니다.

* Git 공식 사이트: https://git-scm.com/
* GitHub 공식 사이트: https://github.com/
* 생활코딩 Git: https://opentutorials.org/course/2708
