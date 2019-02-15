rm -rf menu/migrations;
python3 manage.py makemigrations menu;
python3 manage.py migrate --fake menu zero;
python3 manage.py migrate;

