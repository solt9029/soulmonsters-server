# soulmonsters-server

## environment

- prisma: 1.34.6
- node: 10.16.3

## setup

```sh
git clone git@github.com:solt9029/soulmonsters-client.git
cd soulmonsters-client

git submodules init

npm install

docker-compose up -d

cp .env.example .env
vi .env

npm run typeorm migration:run

npm run start:dev
```
