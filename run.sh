#!/bin/bash

# change dir to script location
cd "$(dirname "$0")"

docker-compose up --build
