## Proyecto Fullstack Nestjs, Typescript, y Vue 3 con Quasar v2 

Servicio de Acceso a la Base de Datos (backend-db):
– Es el único servicio que conecta directamente con la base de datos, utilizando un ORM (TypeORM) en NestJS.
– Expone endpoints para registrar clientes, recargar billetera, iniciar el proceso de pago (generando un token y una sesión) y confirmar el pago, además de consultar el saldo.

Servicio Intermediario o Gateway (backend-gateway):
– Es el único punto de entrada para el cliente.
– No accede directamente a la base de datos, solo consume internamente el servicio del backend-db mediante HTTP.

Frontend:
– Se construye en Vue 3 con la estructura del framework Quasar v2 
– En el se podrá realizar registro de cliente, recarga de billetera, generación y confirmación de pago, y consulta de saldo.
– Se utilizá Axios para consumir el Gateway REST y ademas se utilizó [Pinia] https://pinia.vuejs.org/ para el uso de estados globales
