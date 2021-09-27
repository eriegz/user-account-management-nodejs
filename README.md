# Lendesk Coding Challenge

This application is a simple REST API server that allows user account management (i.e.: user registration, login, etc.), and saves its data in a local redis store.

## **Setup:**

This application persists all of its data inside of a redis store, which it expects to find at runtime. To spin up a redis instance on your own machine, follow these steps:

Windows:

- First, install [Docker Desktop](https://www.docker.com/products/docker-desktop)
- Next, at the time of writing you'll then need to [manually update WSL to version 2](https://docs.microsoft.com/en-us/windows/wsl/install-manual#step-4---download-the-linux-kernel-update-package)
- Then, pull and run the [official redis Docker image](https://hub.docker.com/_/redis)
- Finally, you can run the Docker image via the following command:
  - `docker run --name redis-container --publish=6379:6379 -d redis`

macOS:

- You're on your own here ;)

## **How to run the application:**

To run the application on your local machine, execute the following command:

`npm run env NODE_ENV=development -- npm run start`

...or if you use nodemon:

`npm run env NODE_ENV=development -- nodemon --exec npm run start`