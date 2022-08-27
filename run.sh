#!/bin/bash

# Run backend
python3 -d restify-back/manage.py runserver 0.0.0.0:8000 &

# Run frontend
cd restify-front/ && npm start &