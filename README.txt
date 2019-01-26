# TeamProject2019_01

MAKE SURE TO BRANCH BEFORE DOING ANY COMMITS:
git clone 'project name'
git checkout -b 'branch name'

please install the dependencies.

running the server on localhost:

make a postgresql database named 'team1' and a user named 'team1user' and password 'password'
the username , password and database name can be altered in the TeamProject1/settings file

make sure you are in the environment when running the server run:
source venv/bin/activate (for linux users)
not sure how to do this on other devices

if you do not have the venv directory find out how to make a python venv directory online
or pycharm makes one for you if you go to project settings -> interpreter -> click + on the dropdown

once in the eviroment and the database active e.t.c. run the following:
(from the directory with manage.py)
(not sure in which order the two bellow should be run, try both orders :D)
python3 manage.py makemygrations
ptyhon3 manage.py migrate

python3 manage.py runserver

server will be running on localhost:8000
debugging is on, 
the url's available will be displayed bellow.



