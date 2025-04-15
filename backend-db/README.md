## Epayco DB API

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
# requirements
mysql dabase
email service (gmail, sendgrid, mailtrap, etc)
node version >= 18.0.0

# Create a .env file in the root directory and add the variables located in the .env.example file
touch .env

# database connection
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=wallet_epayco

# email service
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USER=tu_email@example.com
MAIL_PASS=tu_contraseña
MAIL_FROM="Billetera Virtual <epayco@example.com>"

# install dependencies
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start:dev
```