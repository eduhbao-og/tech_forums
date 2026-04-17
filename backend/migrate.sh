#!/bin/sh

python manage.py makemigrations app
python manage.py sqlmigrate app 0001
python manage.py migrate
