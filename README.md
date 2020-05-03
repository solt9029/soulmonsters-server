# soulmonsters-server

## environment

- prisma: 1.34.6
- node: 10.16.3

## setup

```sh
npm install

docker-compose up -d

cp .env.example .env
vi .env

prisma deploy # generates prisma/generated/*, prisma/schema.graphql, src/prisma/prisma.binding.ts

npm run start:dev
```
