# Chat-E backend

This document describes the structure of this project's backend, its components and connections.

For a more general documentation of the **project** visit the [root](https://github.com/PaulBueckhard/Chat-E).

For a more in-depth documentation on the **frontend** visit the [frontend](https://github.com/PaulBueckhard/Chat-E/tree/master/frontend).

## Architecture

![architecure](../diagrams/architecture.png)

## Functionality

The backend is this project's server, handling all API requests using [ExpressJS](https://expressjs.com), storing data in a [MongoDB](https://www.mongodb.com) database and builds a connection between frontend, backend and database using [NodeJS](https://nodejs.org/en). It consists of:

### Controllers

- **Chat controller**, which handles requests to access chats, retrieve all chats the user is involved in, creating and renaming group chats, as well as adding and removing people to group chats
- **Message controller**, which handles finding all messages in a chat identified by ID and populating sender and chat and sending messages, populating those by sender, chat and user
- **User controller**, which handles retrieving all users from the database, registering new users and authenticating users

### Models

- **Chat model**, which defines the structure of a chat by the chatname, if it's a groupchat, the users, the latest message and the group admin
- **Message model**, which defines the structure of a message by sender, content, chat and reader
- **User model**, which defines the structure of a user by name, e-mail, password, profile picture and whether they are a group admin and is responsible for encrypting and saving user passwords

### Routes

- **Chat routes**, which handle API requests for creating and fetching one on one chats, creating groupchats, adding and removing members in a groupchat and renaming a groupchat
- **Message routes**, which handle API requests for sending and reading messages protected by authorization middleware
- **User routes**, which handle API requests for users registering or logging in protected by authorization middleware

### Middleware

- **Authorization middleware** is responsible for protecting certain API requests based on the user's authorization and authentication using their JSON Web Token
- **Error middleware** is responsible for handling all failed API requests

### Configuration

The configuration generates the JSON Web Token for each user and enables the connection to the project's database.

## Security

To ensure the user's security all generated tokens consist of a variable that is stored in an inaccessible secret environment. Additionally, every password that is submitted by a user is encrypted using [bcrypt](https://www.npmjs.com/package/bcryptjs) before being stored in the database.

## Request flow

![request](../diagrams/request.png)
When the user makes a request on the client to e.g. access their chats, the frontend sends this request to the web framework, which interprets the request and redirects it to the webserver. The webserver makes a query to the database to receive every chat.

The database compiles the query and sends the data back to the webserver, which redirects it to the web framework, which then sends it to the frontend in the form of JSON data. The frontend interprets the data and displays it to the user.
