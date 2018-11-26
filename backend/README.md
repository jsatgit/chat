## Prerequisites

* [docker](https://www.docker.com/)

## Install

```
npm install -D
```

## Config

```
mkdir config 
touch loc.json
touch prod.json
```

For each environment add the following configuration:
```
{
    "jwtSecret": <secret-goes-here>,
    "db": {
        "host": <>,
        "port": <>,
        "database": <>,
        "user": <>,
        "password": <> 
    }
}
```

## Database

Configure the database in `database.json`:

```
{
    "local": {
        "driver": <>,
        "user": <>,
        "password": <>,
        "host": <>,
        "database": <> 
    },
    "prod": {
        "driver": <>,
        "user": <>,
        "password": <>,
        "host": <>,
        "database": <> 
    }
}
```

Start the local database: `./scripts/db/start.sh`

## Development

```
npm run dev
```

## Production

```
docker-compose up
```
