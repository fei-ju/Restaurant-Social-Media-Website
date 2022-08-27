#!/bin/bash

python3 -m venv env

source env/bin/activate

pip install -r restify-back/requirements.txt

python3 restify-back/manage.py migrate

# Install dependencies from node
cd restify-front/
npm install 
cd ..