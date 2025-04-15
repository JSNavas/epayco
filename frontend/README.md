## Epayco Frontend

[Quasar](https://quasar.dev/start/how-to-use-vue) framework to Vue 3.

## Project setup

```bash
# requirements
- running backend-db on http://localhost:3001
- running backend-gateway on http://localhost:3000
node version >= 18.0.0

# Create a .env file in the root directory and add the variables located in the .env.example file
touch .env

# Url where the backend-gateway is running
VITE_API_URL=http://localhost:3000/api

```bash
# install dependencies
$ npm install

# If you encounter an error, install the Quasar CLI globally
$ npm install -g @quasar/cli
```

## Compile and run frontend

```bash
# development
$ quasar dev
- running complete app on http://localhost:9001
```