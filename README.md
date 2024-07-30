


개발자를 위한 블로그 서비스 웹 “블로밋(Blomit)”
=====================================
SeSAC 영등포 6기 웹 개발자 양성 과정 1차 팀 프로젝트 대상 수상작 [대상 - B조.pdf](https://github.com/user-attachments/files/16372912/-.B.pdf)

<img width="1708" alt="blomit_mainPage" src="https://github.com/user-attachments/assets/23a22ff0-3e0a-433e-9445-cb2b156db8bb">

- 배포 URL: http://223.130.147.143:8080/
- Test ID: sesac1
- Test PW: sesac1234!


프로젝트 개요
---------
- Blomit은 개발자를 주 사용자로 타겟팅하여, 마크다운을 통한 블로깅이 가능하도록 한 서비스입니다.
- 개발 기간: 2024.07.10 ~ 2024.07.23


팀원 구성
------
||김어진|김지민|박성환|박은경|이유나|
|---|---|---|---|---|---|
|Profile|
|Role|[팀장] BE|[팀원] FE, BE, DevOps|[팀원] FE, BE, DevOps||[팀원] FE|
|GitHub|[qldirr][qldirr]|[cmkoi1][cmkoi1]|[aixion1506][aixion1506]|[eungyeong0927][eungyeong0927]|[youna99][youna99]|

[cmkoi1]: https://github.com/cmkoi1
[youna99]: https://github.com/youna99
[qldirr]: https://github.com/qldirr
[aixion1506]: https://github.com/aixion1506
[eungyeong0927]: https://github.com/eungyeong0927

## 1. 개발 환경 
#### Programming Languages
<img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white"> <img src="https://img.shields.io/badge/css3-1572B6?style=for-the-badge&logo=css3&logoColor=white"> <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=white">


#### Frameworks
<img src="https://img.shields.io/badge/nodedotjs-5FA04E?style=for-the-badge&logo=nodedotjs&logoColor=white"> <img src="https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white"> <img src="https://img.shields.io/badge/ejs-B4CA65?style=for-the-badge&logo=ejs&logoColor=white">

#### Libraries
<img src="https://img.shields.io/badge/tailwindcss-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white"> <img src="https://img.shields.io/badge/axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white"> <img src="https://img.shields.io/badge/chartdotjs-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white"> <img src="https://img.shields.io/badge/sequelize-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white">

#### Databases
<img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white">

#### Development Environment and Tool
<img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white"> <img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white"> <img src="https://img.shields.io/badge/postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white"> <img src="https://img.shields.io/badge/figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white"> <img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white">

#### Communication Tools
<img src="https://img.shields.io/badge/slack-4A154B?style=for-the-badge&logo=slack&logoColor=white"> <img src="https://img.shields.io/badge/notion-000000?style=for-the-badge&logo=notion&logoColor=white">

## 2. 브랜치 전략
<pre><code>  
   Main branch
      └── dev
	    ├── F-dev
	    |  ├── F-Login
	    |  ├── F-Register
	    |  └── F-Post
	    |  └── F-Search
	    |  └── F-Comment
	    ├── B-dev
	    |  ├── B-Login
	    |  ├── B-Register
	    |  └── B-Post
	    |  └── B-Search
	    |  └── B-Comment</code></pre>
## 3. 프로젝트 구조 - 트리 형태로 출력
<pre><code>app.js
├── config
├── controller
|  ├── comment
|  ├── post
|  └── user
├── middlewares
├── models
|  ├── comment
|  ├── post
|  ├── user
|  └── index.js
├── package-lock.json
├── package.json
├── .env
├── .gitignore
├── .prettierrc
├── postcss.config.js
├── tailwind.config.js
├── routes
|  ├── comment
|  ├── post
|  ├── user
|  └── index.js
├── static
|  ├── css
|  └── image
├── uploads
├── utils
└── views
   ├── includes
   ├── posts
   ├── search
   └── user</code></pre>
   
## 4. 역할 분담
## 5. 개발 기간과 협업 관리

## 6. 프로젝트 설계 
 - [명명법](https://github.com/SeSAC-1st/SeSAC-1st/wiki/%EB%AA%85%EB%AA%85%EB%B2%95)
 - [DB 설계](https://github.com/SeSAC-1st/SeSAC-1st/wiki/DB-%EC%84%A4%EA%B3%84)
 - [요구분석 정의서/명세서](https://github.com/SeSAC-1st/SeSAC-1st/wiki/%EC%9A%94%EA%B5%AC-%EB%B6%84%EC%84%9D-%EC%A0%95%EC%9D%98%EC%84%9C-%EB%AA%85%EC%84%B8%EC%84%9C)
 - [git 규칙](https://github.com/SeSAC-1st/SeSAC-1st/wiki/git-%EA%B7%9C%EC%B9%99)
   
## 7. 구현 기능(기능별)
 - 회원가입/로그인
   
	https://github.com/user-attachments/assets/987a4a03-f986-4334-81ed-23c5dcf68f0b

 - 댓글, 검색, 페이지네이션
   
	https://github.com/user-attachments/assets/c637be72-6484-42ab-94cf-9e3edebbe6ef

 - 게시글 CRUD
   
	https://github.com/user-attachments/assets/fd3e2784-0c50-4606-afa0-67202f794366

## 8. 트러블 슈팅
## 9. 성능 테스트
## 10. 차후 목표(개선점) - 리더님 피드백, 구현 후 아쉬웠던 점


