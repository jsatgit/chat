#!/bin/bash

cd $(dirname $0)
npm run build
cp ../dist/* ../../backend/public/
