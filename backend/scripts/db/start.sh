#!/bin/bash

docker run --rm --name chatdb -p 5432:5432 -e POSTGRES_PASSWORD=${POSTGRES_PASSWORD} -d postgres
