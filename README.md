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

npm run typeorm migration:run

npm run start:dev
```
