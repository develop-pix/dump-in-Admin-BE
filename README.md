![Image](https://github.com/develop-pix/dump-in-Admin-BE/assets/96982072/26fc155b-4a01-433e-9643-cbc1beefeadf)

## Dump'in Admin Server

[API 문서 링크](https://admin.dump-in.co.kr/api/swagger)  
[API 문서 링크2](https://dump-in-admin-server.onrender.com/api/swagger)

<br>

## 목차 :clipboard:

- [Dump'in Admin Server](#dumpin-admin-server)
- [목차 :clipboard:](#목차-clipboard)
- [개요](#개요)
- [사용 기술](#사용-기술)
- [프로젝트 진행 및 이슈 관리](#프로젝트-진행-및-이슈-관리)
- [구현 과정 및 설명](#구현-과정-및-설명)
- [Did You Know](#did-you-know)
- [API Endpoint](#api-endpoint)
- [API Reference](#api-reference)

<br/>

## 개요

덤핀 어플리케이션은 사용자 주변의 다양한 포토부스를 소개하고 프레임 및 진행 중인 이벤트 정보를 제공하는 플랫폼입니다.
사용자들은 덤핀 어플을 통해 지역 내 포토부스의 다양한 특징과 프레임을 확인할 수 있으며, 현재 진행 중인 이벤트에 참여할 수 있습니다.

덤핀 어드민은 어플리케이션의 관리 백오피스로서, 포토부스 정보의 업데이트, 이벤트 관리, 사용자 데이터 분석 등을 수행합니다.
어드민을 통해 쉽게 어플리케이션의 콘텐츠를 관리하고 최신 정보를 반영할 수 있습니다.

이를 통해 사용자들은 항상 다양하고 흥미로운 포토부스 경험을 즐길 수 있으며,
어플리케이션은 지속적인 업데이트와 새로운 이벤트를 통해 사용자들을 유지하고 확장할 수 있습니다.

<br/>

## 사용 기술

<br/>

![NestJS][NestJS] ![TypeScript][TypeScript] ![TypeORM][TypeORM]
![PostgreSQL][PostgreSQL] ![Swagger][Swagger]
![GitHubActions][GitHubActions] ![EC2][AWS-EC2] ![Route53][AWS-Route53]

<br/>

## 프로젝트 진행 및 이슈 관리

[![GitHub][GitHub]](https://github.com/orgs/develop-pix/projects/1/views/1)

<br/>

<!-- ## 모델링 -->

## 구현 과정 및 설명

- **세션 인증 및 인가**

- **API 요청 횟수 제한하기**

- **대시보드 기능**

- **포토부스 관리 기능**

- **이벤트 관리 기능**

- **리뷰 관리 기능**

- **유저 관리 기능**

- **로깅**

<!-- - **알림 관리 기능** -->
<br/>

## Did You Know

[API 요청 시도 횟수 제한하기](https://zamoca.space/js-ts/nest-js/rate-limit.html)

<br/>

## API Endpoint

![API-endpoint-notion](https://github.com/develop-pix/dump-in-Admin-BE/assets/96982072/3f00682c-1bd0-4d52-b2fb-52ea5910b5bd)

<br/>

## API Reference

<https://admin.dump-in.co.kr/api/swagger>

<details>

<summary>Swagger 이미지</summary>

![1](https://github.com/develop-pix/dump-in-Admin-BE/assets/96982072/beecf55a-de66-4722-b237-17f46f78bc27)
![2](https://github.com/develop-pix/dump-in-Admin-BE/assets/96982072/13fd5bec-4412-4d05-adb9-9c90dad679a9)

</details>

<br/>

[NestJS]: https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white
[TypeScript]: https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white
[TypeORM]: https://img.shields.io/badge/TypeORM-%2334567c.svg?style=for-the-badge&logo=adminer&logoColor=white
[PostgreSQL]: https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white
[Swagger]: https://img.shields.io/badge/swagger-%23Clojure.svg?style=for-the-badge&logo=swagger&logoColor=white
[GitHubActions]: https://img.shields.io/badge/GitHub%20Actions-%232088ff.svg?style=for-the-badge&logo=githubactions&logoColor=white
[GitHub]: https://img.shields.io/badge/GitHub%20Project-%23181717.svg?style=for-the-badge&logo=github&logoColor=white
[AWS-EC2]: https://img.shields.io/badge/AWS%20EC2-%23FF9900.svg?style=for-the-badge&logo=amazonec2&logoColor=white
[AWS-Route53]: https://img.shields.io/badge/AWS%20Route53-%238C4FFF.svg?style=for-the-badge&logo=amazonroute53&logoColor=white
