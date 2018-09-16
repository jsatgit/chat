## Prerequisites

* (Docker)[https://www.docker.com/]

## Install

```
npm install -D
```

## Config

```
mkdir config 
touch default.json
```

Configuration:
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

In `database.json`:

```
{
    "dev": {
        "driver": <>,
        "user": <>,
        "password": <>,
        "host": <>,
        "database": <> 
    }
}
```

## Run

```
npm start
```
