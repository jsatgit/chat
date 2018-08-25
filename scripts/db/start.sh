#!/bin/bash

docker run --name chatdb -p 5432:5432 -e POSTGRES_PASSWORD=pass -d postgres
