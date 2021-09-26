# Lendesk Coding Challenge

This application is a simple REST API server that allows user account management (i.e.: user registration, login, etc.), and saves its data in a local redis store.

## **How to run the application:**

To run the application on your local machine, execute the following command:

`npm run env NODE_ENV=development -- npm run start`

...or if you use nodemon:

`npm run env NODE_ENV=development -- nodemon --exec npm run start`