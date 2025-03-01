# Parcel boxes project

## In a nutshell
This is a server and a website where a user can be either an administrator or a regular user. An administrator can create parcel boxes and set up their location and working hours. A regular user can rent a free cell to store their belongings. A user's money is debited from their account. There are no payments in this iteration. An administrator can manually increase a user's balance. 

## Start the project
1. Clone project from GitHub. 
2. Switch to the project folder.

### Starting the database
1. Run Docker Desktop.
2. Run
```docker compose -f docker-compose.dev.yml up```
3. Go to the server folder:
```cd server```
4. Apply migrations:
```yarn run migrate:dev```

### Starting the server
1. In the server folder run the server:
```yarn run start:dev```

### Starting the client
1. Go to the client folder:
```cd client```
2. Run the client:
```npm run dev```