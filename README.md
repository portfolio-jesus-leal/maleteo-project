# Maleteo Project (Back End)

In this repository you will find the code created to develop the back end of the Maletero project.

This project has been created during the Full Stack Developer bootcamp at [Upgrade Hub](https://www.upgrade-hub.com/) and is based on the design made by Sergio Ganacho (UX/UI Design Bootcamp).

More information about the conceptualization of this project in:

> [MALETEO | UX/UI Design en Upgrade Hub](https://medium.com/@sergio.garnacho/maleteo-ux-ui-design-en-upgrade-hub-99f29380bccd)

## API

It is available in Heroku:

> [https://maleteo-app.herokuapp.com/](https://maleteo-app.herokuapp.com/)

And uses a MongoDB database stored in [MongoDB Atlas](https://www.mongodb.com/atlas).

Also uses [Cloudinary](https://cloudinary.com/) to stored images.

It uses 5 different collections: 
* Users
* Rates
* Chats
* Bookings
* Lockers

### Routes

| **Method** | **Route** | **Description** |
|--------|------|-------------| 
| **/users** | 
| POST | /login | User authentication | 
| POST | /logout | User logout | 
| GET | / | Get all users | 
| GET | /:id | Get a user by Id | 
| POST | / | Create a new user | 
| PUT | /:id | Update a user (by Id) | 
| PATCH | /password/:id | Update a user password (by Id) | 
| PATCH | /image/:id | Update a profile image (by Id) |
| PATCH | /address/:id | Update a user address (by Id) |
| PATCH | /status/:id | Update a user status (by Id) |
| PATCH | /guardian/:id | Set/Unset an user as 'Guardian' (by Id) |
| PATCH | /search/:id | Update searches done by user  (by Id) |
| PATCH | /marketing/:id | Update a user marketing indicator (by Id) |
| DELETE | /:id | Delete a user by Id | 
| **/rates** |
| ... |
| **/chats** |
| ... |
| **/bookings** |
| ... |
| **/lockers** |
| ... |





### Config Variables

It is necessary to include the following configuration variables in a file **.env**:

```bash
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb+srv://...
JWT_SECRET=...
```
_Cloudinary_
```bash
CLOUD_NAME=...
API_KEY=...
API_SECRET=...
```



