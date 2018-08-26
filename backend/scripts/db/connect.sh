#!/bin/bash

docker run -it --rm --link chatdb:postgres postgres psql chatdb -h postgres -U postgres
