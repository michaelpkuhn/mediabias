import os

os.environ['PYTHONPATH'] = "/d/misc_projects_d/mediabias"
os.system('conda install --file project_env.txt')
os.system('pip install gunicorn==20.0.4 psycopg2-binary==2.8.4 pytest==6.2.3')