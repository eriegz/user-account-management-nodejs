# **Lendesk Coding Challenge**

This application is a simple REST API server that allows user account management (i.e.: user registration, login, etc.), and saves its data in a local redis store.

## **Setup:**

This application persists all of its data inside of a redis store, which it expects to find at runtime on the default port of `6379`. To spin up a redis instance on your own machine, follow these steps:

Windows:

- First, install [Docker Desktop](https://www.docker.com/products/docker-desktop)
- Next, at the time of writing you'll then need to [manually update WSL to version 2](https://docs.microsoft.com/en-us/windows/wsl/install-manual#step-4---download-the-linux-kernel-update-package)
- Then, pull and run the [official redis Docker image](https://hub.docker.com/_/redis)
  - `docker pull redis`
- Finally, you can run the Docker image via the following command:
  - `docker run --name redis-container --publish=6379:6379 -d redis`

macOS / Linux:

- You're on your own here ;)

## **How to run the application:**

To run the application on your local machine, execute the following command:

`npm run env NODE_ENV=local -- npm run start`

...or if you use nodemon:

`npm run env NODE_ENV=local -- nodemon --exec npm run start`

## **Design Approach:**

This REST API was designed to be as full-featured and secure as possible, while using the fewest lines of code possible (without sacrificing readability). And in order to avoid reinventing the wheel and / or introducing security vulnerabilities, the following open-source Node modules were leveraged to provide the various functionality listed below:
- redis "ORM" functionality is handled by [ioredis](https://www.npmjs.com/package/ioredis)
- password hashing / verification is handled by [bcrypt](https://www.npmjs.com/package/bcrypt)
- request validation is handled by [express-validator](https://www.npmjs.com/package/express-validator)
- password complexity validation is handled by [password-validator](https://www.npmjs.com/package/password-validator)
- JWT creation / verification is handled by [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)

Code-wise, the REST API follows a typical architecture, i.e.:
- **routes / endpoints** are defined inside controllers, grouped by category (e.g.: version, user, authentication)
- **"database" / storage operations** are encapsulated into separate services
- **runtime-related settings** are kept inside environment-specific config files
- various other code is also organized into separate folders in anticipation more being added alongside it in future development, namely:
  - **middleware**
  - **validation**

## **Notes:**
The following features were intentionally not implemented, as they were deemed of scope for the task:
  - config files for non-local environments (empty files for other environments are included just as templates)
  - any CORS configuration for Express.js
  - HTTPS communication / SSL certificates