# Server-side Application

## Env variables

All of them are listed in `.env.sample`. To start local app you have to define them in `.env.local`.

## Docker

### Build

```sh
REVISION=$(date '+%Y.%m.%d-%H.%M.%S')
docker build --build-arg REVISION=${REVISION} -t boonya/listock-server:${REVISION} -t boonya/listock-server:latest -f ./server/Dockerfile .
```

### Run

```sh
docker run --rm -p 31235:31235 --env-file=server/.env.docker.local boonya/listock-server:latest
```

Open [http://localhost:31235/]
