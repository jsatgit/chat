## Prerequisites

* [docker](https://www.docker.com/)

## Install

```
npm install -D
```

## Config

```
cp -r config.template config
```

## Database

```
cp database.template.json database.json
```

Start the local database: `./scripts/db/start.sh`

## Development

To start the server

```
npm run dev
```

Go to `localhost:3000`

## Frontend  

To run the frontend as well, copy the frontend build to the `public` directory

## Production

```
docker-compose up
```

Go to `localhost:3000`
