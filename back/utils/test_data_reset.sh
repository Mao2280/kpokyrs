# Restore data from fixtures.
python manage.py reset_db --noinput
python manage.py migrate

python manage.py loaddata --app=core User Site
