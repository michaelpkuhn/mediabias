#!/usr/bin/env python
import os
import sys

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'webpage/static'),
)

if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project2_heroku.settings")

    from django.core.management import execute_from_command_line

    execute_from_command_line(sys.argv)
