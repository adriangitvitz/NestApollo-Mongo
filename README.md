### NESTJS - APOLLO - MONGOOSE - JWTFS

This project uses a MongoDB Replica Set, a JWT custom implementation, that you can find in `jwtfs -> jwtfs.service.ts` and a JWT Guard in `jwtfs -> jwtfs.guard.ts` as protection for certain queries or mutations.

#### Steps to run

1. Start the MongoDB Cluster

```shell
docker-compose -f mongo-replicas.yml up -d
```

2. Start the project

```shell
yarn start:dev
```

3. Navigate to the `Apollo Sandbox`

```text
http://localhost:3000/graphql
```
