import os

os.system('conda install --file project_env.txt')
os.system('pip install gunicorn==20.0.4 psycopg2-binary==2.8.4')