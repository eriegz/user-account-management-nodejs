# **User Account Management (Node.js)**

This application is a simple backend REST API server that facilitates user account management (i.e.: user registration, login, etc.), and saves its data into a redis store.

## **Setup:**

This application requires a redis server to communicate with in order to store data. To spin up a redis instance on your local machine, follow these steps:

Windows:

- First, install [Docker Desktop](https://www.docker.com/products/docker-desktop)
- Next, at the time of writing you'll then need to [manually update WSL to version 2](https://docs.microsoft.com/en-us/windows/wsl/install-manual#step-4---download-the-linux-kernel-update-package)
- Then, pull and run the [official redis Docker image](https://hub.docker.com/_/redis)
  - `docker pull redis`
- Finally, you can run the Docker image via the following command *(6379 is redis' default port)*:
  - `docker run --name redis-container --publish=6379:6379 -d redis`

macOS / Linux:

- Coming soon.

## **How to run the application:**

As usual, first install all Node modules:

`npm i`

Then, to run the application on your local machine, execute the following command:

`npm run env NODE_ENV=local -- npm run start`

...or if you use nodemon:

`npm run env NODE_ENV=local -- nodemon --exec npm run start`

## **Design Approach:**

This REST API was designed to be as full-featured, secure, and production-ready as possible, while using the fewest lines of code possible (without sacrificing readability). And in order to avoid reinventing the wheel and / or introducing security vulnerabilities at various stages, the following open-source Node modules were leveraged to provide various functionality, listed below:
- redis "ORM" functionality is handled by [ioredis](https://www.npmjs.com/package/ioredis)
- password hashing / verification is handled by [bcrypt](https://www.npmjs.com/package/bcrypt)
- request validation is handled by [express-validator](https://www.npmjs.com/package/express-validator)
- password complexity validation is handled by [password-validator](https://www.npmjs.com/package/password-validator)
- JWT creation / verification is handled by [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)

Code-wise, this REST API application follows a typical architecture, i.e.:
- **routes / endpoints** are defined inside controllers, grouped by category (e.g.: version, user, authentication)
- **storage / authentication operations** are encapsulated inside of separate services
- **runtime-related settings** are placed inside of environment-specific config files
- and lastly, various other code / files are also organized into separate folders in anticipation of more being added alongside them in future development, namely:
  - **middleware**
  - **validation**
  - **security** (i.e.: SSL certificates, etc.)

## **HTTPS Communication:**

In order to demonstrate secure communication over HTTPS, a self-signed certificate was created locally and is included in this repo and referenced by the application when running locally. But note that all endpoints in the server can be accessed over *either HTTP or HTTPS protocols*.

> **Important:** If you are using Postman to test out any of the endpoints over HTTPS, make sure that you've turned off "SSL certificate verification" in Postman's settings!

## **Missing Security Features:**
The following features were intentionally omitted from the final submission as they were deemed of scope for this task:
- CORS configuration
- SSL certificates *signed by a signing authority*
- valid "config" files for other environments (e.g.: staging, preprod, production)

We would obviously need to add these features before deploying to any real-world environments.