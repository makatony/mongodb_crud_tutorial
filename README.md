source: https://www.youtube.com/watch?v=CyTWPr_WwdI


# docker stuff:

docker volume create --name=mongo_crud_data
docker run --name mongo_crud -v mongo_crud_data:/data/db -d -p 27017:27017 mongo



## Adding some data:

### open the mongo container with a shell
docker exec -it mongo_crud bash

### go into mongo interactive CLI and add stuff

mongo

use crud_mongodb

db.todo.insert({todo: "clean room"})

db.todo.insert({todo: "clean garage"})


# GUI Stuff:

getbootstrap.com 
- copy the starter part
- search for "form-group"
- search for unordered list
