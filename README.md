<!-- PROJECT LOGO -->
<p align="center">
  <a href="https://github.com/shindeamul76/rbac-in-infigon">
   <img src="https://media.licdn.com/dms/image/v2/C4D0BAQFXgqA1XJO9yA/company-logo_200_200/company-logo_200_200/0/1677563696019/infigon_futures_logo?e=2147483647&v=beta&t=tbTMokO31rg-z5PQhRyzl3R4V_Ka8YancsWb0NJbWq0" alt="Logo">
  </a>

  <h3 align="center">Role Based Access Control</h3>

  <p align="center">
    Become a Certified Career Planner.
    <br />
    <a href="https://www.infigonfutures.com/"><strong>Learn more »</strong></a>
    <br />
    <br />
    <a href="https://github.com/shindeamul76/rbac-in-infigon">Discussions</a>
    ·
    <a href="https://www.infigonfutures.com/">Website</a>
    ·
    <a href="https://github.com/shindeamul76/rbac-in-infigon/issues">Issues</a>
    ·
    <a href="https://www.infigonfutures.com/">Roadmap</a>
  </p>
</p>


## About the Project

# Role-Based Access Control (RBAC) System for Your Applications

To manage user roles, permissions, and access with simplicity and flexibility.

Most systems require a robust role-based access control mechanism for managing data access, workflows, and operations. Existing solutions can be restrictive, complicated, or not customizable enough for specific business needs.

That’s where this RBAC system comes in. Built with NestJS, Prisma, and PostgreSQL, it offers complete control over role management, user permissions, and data security while being highly customizable and easy to integrate.


### Built With

- [Nest.js]
- [PostgreSql]
- [Prisma.io]
- [Swagger]

## Getting Started

To get a local copy up and running, please follow these simple steps.

### Prerequisites

Here is what you need to be able to run Cal.com.

- Node.js (Version: >=18.x)
- PostgreSQL (Version: >=13.x)
- Yarn _(recommended)


## Development

### Setup

1. Clone the repo into a public GitHub repository (or fork https://github.com/shindeamul76/rbac-in-infigon.git/fork).

   ```sh
   git clone https://github.com/shindeamul76/rbac-in-infigon.git
   ```

2. Go to the project folder

   ```sh
   cd rbac-in-infigon
   ```

3. Install packages with yarn

   ```sh
   yarn
   ```

4. Set up your `.env` file

   - Duplicate `.env.example` to `.env`
   - Use `openssl rand -base64 32` to generate a key and add it under `ACCESS_TOKEN_SECRET` in the `.env` file.
   - Use `openssl rand -base64 32` to generate a key and add it under `REFRESH_TOKEN_SECRET` in the `.env` file.

5. Run Prisma migration

   ```sh
   yarn run prisma:migrate-deploy
   ```


5. Seed data In database

   ```sh
   yarn run prisma:seed
   ```

6. Start Server Locally

   ```sh
   yarn run start:dev
   ```


#### Quick start with `yarn:quick`

> - **Requires Docker and Docker Compose to be installed**
> - Will start a local Postgres instance with a few test users - the credentials will be logged in the console

```sh
yarn run yarn:quick
```
##### Approach 2

Seed the local db by running

```sh
cd packages/prisma
yarn prisma:seed
```

Run Prisma studio to see data

```sh
npx prisma studio
```


Open Swagger in 

```sh
http://localhost:3000/api
```

