# Parcel boxes project

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