#!/bin/bash

cd $(dirname $0)
npm run build
mkdir -p ../../backend/public/
cp ../dist/* ../../backend/public/
cp ../favicon.ico ../../backend/public/
