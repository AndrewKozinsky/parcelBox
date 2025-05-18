# Parcel boxes project

## In a nutshell
This is a server and a website where a user can be either an administrator or a regular user. An administrator can create parcel boxes and set up their location and working hours. A regular user can rent a free cell to store their belongings. A user's money is debited from their account. There are no payments in this iteration.

## Start the project
1. Clone project from GitHub. 
2. Switch to the project folder.
3. Create a .env file and copy text from .env-example to it. Put correct values.

### Starting the Docker project in development mode
1. Run Docker Desktop.
2. Run
```docker compose -f docker-compose.dev.yml up```
to run all containers.
4. Now you need to apply migrations. Go inside the container of the server:
```docker exec -it parcels-server sh```
5. Inside the container run a command to apply all migrations
```yarn run migrate:dev```
Last two steps you need to run only when new migrations appear.

The client will work on http://localhost.

### Starting the Docker project in testing mode
In testing mode emails don't send in the server. Use it in auto tests.
1. Run Docker Desktop.
2. Run
   ```docker compose -f docker-compose.test.yml up```
   to run all containers.
4. Now you need to apply migrations. Go inside the container of the server:
   ```docker exec -it parcels-server sh```
5. Inside the container run a command to apply all migrations
   ```yarn run migrate:dev```
   Last two steps you need to run only when new migrations appear.

The client will work on http://localhost.

### Starting the Docker project in production mode
1. Run Docker Desktop.
2. Run
   ```docker compose -f docker-compose.server.yml up```
   to run all containers.
4. Now you need to apply migrations. Go inside the container of the server:
   ```docker exec -it parcels-server sh```
5. Inside the container run a command to apply all migrations
   ```yarn run migrate:deploy```
   Last two steps you need to run only when new migrations appear.

## Updating the project 
1. Switch to the project folder.
2. Pull the latest version from GitHub.
   ```git pull```
