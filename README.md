## Description

Backend service Brain agriculture  
Used to manager famers, farms and harvests.

## Running local
#### .env
Set configs to connect on postgresql database, service port and log level 

##### Installation

```plaintext
$ yarn install
```

##### Database

You can create a database postgresql using docker:

```plaintext
$ yarn docker:run
```

Create tables:

```plaintext
$ yarn run typeorm -- -d src/database/data-source.ts migration:run
```

##### Start service

```plaintext
$ yarn start
```

## Running with docker-compose

docker-compose.yaml is configurated to create database, run migrations and start service

```plaintext
# remove container
$ docker-compose down

# build and run
$ docker-compose up --build
```

## Testes unitários
```plaintext
# Unitários
$ yarn test:unit

# Unitários com report de cobertura
$ yarn test:unit:coverage
```

## Testes Integrados
```plaintext
# integrados
$ yarn test:integrated

# integrados com report de cobertura
$ yarn test:integrated:coverage
```
### Configs to run in
.env.test

## Swagger

http://localhost:3000/api-docs/


## Collections Postman in
doc/postman collection

## Technologies

*   Nodejs
*   Express
*   Routing-controllers
*   Jest
*   Typescript
*   Docker
*   Postgresql
*   TypeORM
