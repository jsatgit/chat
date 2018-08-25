#!/bin/bash

docker run -it --rm --link chatdb:postgres postgres psql -h postgres -U postgres
