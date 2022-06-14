### NESTJS - APOLLO - MONGOOSE - JWTFS

This project uses a MongoDB Replica Set, a JWT custom implementation, that you can find in `jwtfs -> jwtfs.service.ts` and a JWT Guard in `jwtfs -> jwtfs.guard.ts` as protection for certain queries or mutations.

#### ENV EXAMPLE

``` bash
SECRET="SECRET"
JWT_EXP="1h"
MONGODB_URI=mongodb://localhost:27017,localhost:27018,localhost:27019/<database>
REFRESH_ID="<16char>"
REFRESH_IV="<32char>"
```

**NOTE: JWT_EXP Field could be in hours (2h) or minutes (30m)**

#### Steps to run

1. Start the MongoDB Cluster

``` bash
docker-compose -f mongo-replicas.yml up -d
```

2. Local configuration to connect to the MongoDB ReplicaSet

Edit the /etc/hosts file

``` bash
nano /etc/hosts
```

Add the following hosts

``` txt
127.0.0.1 mongo1 mongo2 mongo3
```


3. Start the project

``` bash
yarn start:dev
```

4. Navigate to the `Apollo Sandbox`

```text
http://localhost:3000/graphql
```
