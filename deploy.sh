#!/bin/bash

ssh $USER@$IP <<EOF
    cd $DEPLOY_DIR
    git pull
    docker-compose -f docker-compose-prod.yml up --build -d
EOF
