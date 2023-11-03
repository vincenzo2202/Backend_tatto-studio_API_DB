<h1 align="center"> 🕹️Backend Tattoo Studio🕹️</h1>
<h3 align="center"> By Vincenzo Donnarumma</h3>

<p align="center"><a href="https://vincenzo2202.github.io/MasterMind-GH-project2/">https://github.com/vincenzo2202/Backend_tatto-studio_API_DB.git</a></p>

<br>
Developed as part of the fourth project in the Full Stack Developer Bootcamp at Geekshubs Academy.

# Welcome to my backend app

<details>
  <summary>Contents 📝</summary>
<ol>
  <li><a href="#objetive">Objective</a></li>
  <li><a href="#about-the-project">About the Project</a></li>
  <li><a href="#deploy-🚀">Deploy</a></li>
  <li><a href="#stack">Stack</a></li>
  <li><a href="#diagrama-bd">Database Diagram</a></li>
  <li><a href="#instalación-en-local">Local Installation</a></li>
  <li><a href="#endpoints">Endpoints</a></li>
  <li><a href="#futuras-funcionalidades">Future Functionalities</a></li>
  <li><a href="#contribuciones">Contributions</a></li>
  <li><a href="#licencia">License</a></li>
  <li><a href="#webgrafia">References</a></li>
  <li><a href="#desarrollo">Development</a></li>
  <li><a href="#agradecimientos">Acknowledgments</a></li>
  <li><a href="#contacto">Contact</a></li>
</ol>

</details>

## Objetive
Este proyecto requería una API funcional conectada a una base de datos con al menos una relación de uno a muchos y una relación de muchos a muchos.

## About the project
I have decided to develop a backend system to support a tattoo shop. This system will allow the shop to register and manage users, making the login process easier for both customers and employees. Additionally, the system will enable the creation and tracking of new appointments for customers and artists, thus improving efficiency in tattoo scheduling.

The system will also include advanced features for the superadministrator, who will have the ability to manage roles, delete users, and track all active appointments in the shop. This solution will provide a more organized and effective workflow for the management of appointments and users, enhancing the experience for both shop staff and customers.  

## Stack
Tecnologías utilizadas:
<div align="center">
<a href="https://www.mongodb.com/">
    <img src= "https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white"/>
</a>
<a href="https://www.expressjs.com/">
    <img src= "https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB"/>
</a>
<a href="https://nodejs.org/es/">
    <img src= "https://img.shields.io/badge/node.js-026E00?style=for-the-badge&logo=node.js&logoColor=white"/>
</a>
<a href="https://developer.mozilla.org/es/docs/Web/JavaScript">
    <img src= "https://img.shields.io/badge/javascipt-EFD81D?style=for-the-badge&logo=javascript&logoColor=black"/>
</a>
 </div>

## Diagrama BD
!['imagen-db'](./assets/db_diagram.png)

## Instalación en local

<details>
<summary>Instalacion</summary>

1. Clonar el repositorio.

2. Instalamos las que vamos a utilizar en el proyecto. 

    - ` $ npm install ` 
    
    o en su defecto se ejecuta la instalación con todas las dependencias:

    - ` $ npm i express typescript nodemon ts-node @types/express @types/node mysql2 reflect-metadata typeorm bcrypt @types/bcrypt jsonwebtoken @types/jsonwebtoken dotenv` 


2. Conectamos nuestro repositorio con la base de datos creando el archivo .env y colocando las credenciales correspondientes a la DB

``` js
        // DB Credentials
        PORT =   
        DB_HOST= 
        DB_USERNAME= ""
        DB_PASSWORD= ""
        DB_NAME=""
        DB_PORT=   
        //  JWT Secret  
        JWT_SECRET= ""

```  
4.  Ejecutamos las migraciones 

     - `$ npx typeorm-ts-node-commonjs migration:run -d ./src/db.ts`

5. $ Ejecutamos los seeders 

6. ``` $ npm run dev ``` 
7. ...
</details>

## Endpoints
<details>
<summary>USERS ENDPOINTS</summary>

- USERS
    - REGISTER

            POST http://localhost:4000/user/register
        body:
        ``` js
            {
                "user": "NewUser",
                "email": "NewUser@NewUser.com",
                "password": "princes1234@"
            }
        ```

    - LOGIN

            POST http://localhost:4000/user/login
        body:
        ``` js
            {
                "email": "NewUser@NewUser.com",
                "password": "princes1234@" 
            }
        ```

    - PROFILE

            GET http://localhost:4000/user/profile

        - Auth: ` Introduce el token para acceder al perfil`

    - UPDATE

            PUT http://localhost:4000/user/update
        body:
        ``` js
            {
                "full_name": "NewUserNew  ", 
                "password": "NewPrinces1234@",
                "phone_number": 55555559
            }
        ```
        - Auth: ` Introduce el token para actualizar`

    - GET ALL WORKER

            GET http://localhost:4000/user/AllWorkers?skip=5&page=1
        
        - Auth: ` Introduce el token para obtener la lista de trabajadores`

</details>
<details>
<summary>APPOINTMENTS ENDPOINTS</summary>

- APPOINTMENTS
    - CREATE

            POST http://localhost:4000/appointment/createAppointment
        body:
        ``` js
            {
                "date": "2023-12-10",
                "shift": "afternoon",
                "email": "worker3@mail.com", 
                "name": "dragon"
            }
        ```
        - Auth: `Introduce el token para crear la cita`

    - UPDATE

            PUT http://localhost:4000/appointment/updateAppointment
        body:
        ``` js
            {
               "id": 60,
                "date": "2024-11-05",
                "shift": "morning",
                "email":"worker1@mail.com",
                "name":"tattoo2"
            }
        ```
         - Auth: `Introduce el token para actualizar la cita`

    - DELETE

            DELETE http://localhost:4000/appointment/deleteAppointment
        body:
        ``` js
            {
               "id": 60 
            }
        ```
         - Auth: `Introduce el token para borrar la cita`

    - GET ALL APPOINTMENTS BY USER

            GET http://localhost:4000/appointment/getAllAppointment?skip=10&page=1
        
         - Auth: `Introduce el token para obtener la cita`

    - GET ALL APPOINTMENTS BY WORKER

            GET http://localhost:4000/appointment/getAllArtist?skip=5&page=1
        
         - Auth: `Introduce el token para obtener la cita`
    
    - APPOINTMENT DETAIL

            GET http://localhost:4000/appointment/appointmentDetail
        body:
        ``` js
            {
               "id": 60 
            }
        ```
         - Auth: `Introduce el token para obtener la cita detallada`

    - APPOINTMENT VALIDATION

            GET http://localhost:4000/appointment/validation
        body:
        ``` js
            {  
                "email":"worker1@mail.com",
                "shift":"morning",
                "date":"2023-12-05"
            }
        ```
         - Auth: `Introduce el token para validar la cita`

</details>

<details>
<summary>SUPER ADMIN ENDPOINTS</summary>

- SUPER ADMIN
    - GET ALL USERS

            GET http://localhost:4000/user/all?skip=5&page=1
        body:
        ``` js
            {
                "user": "NewUser",
                "email": "NewUser@NewUser.com",
                "password": "princes1234@"
            }
        ```
         - Auth: ` Introduce el token para obtener todos los usuarios`

    - CREATE WORKER

            POST http://localhost:4000/user/createWorker
        body:
        ``` js
            {
               "full_name": "worker4",
                "email": "worker4@gmail.com",
                "password": "Aa1234@",
                "phone_number": 24364066 
            }
        ```
         - Auth: `Introduce el token para crear el worker`

    - DELETE USERS BY SUPER ADMIN

            DELETE http://localhost:4000/user/createWorker
        body:
        ``` js
            {
               "id": 34
            }
        ```
         - Auth: `Introduce el token para borrar cualquier usuario`

    - GET ALL APPOINTMENT BY SUPER ADMIN

            GET http://localhost:4000/appointment/AllAppointmentsSuper?skip=5&page=1
         
        ```
         - Auth: `Introduce el token para borrar cualquier usuario`

    - CHANGE ROLE BY SUPER ADMIN

            PUT http://localhost:4000/user/assignRole
        body:
        ``` js
            {
             "id":45, 
             "role_id": 2 
            }
        ```
         - Auth: `Introduce el token para cambiar el role`

    

</details>

## Futuras funcionalidades

<details>
[ ] Añadir create book  
[ ] Añadir logs  con winston  
[ ] Validaciones de la solicitud con express-validator  
[ ] ...
</details>

## Contribuciones
Las sugerencias y aportaciones son siempre bienvenidas.  

Puedes hacerlo de dos maneras:

1. Abriendo una issue
2. Crea un fork del repositorio
    - Crea una nueva rama  
        ```
        $ git checkout -b feature/nombreUsuario-mejora
        ```
    - Haz un commit con tus cambios 
        ```
        $ git commit -m 'feat: mejora X cosa'
        ```
    - Haz push a la rama 
        ```
        $ git push origin feature/nombreUsuario-mejora
        ```
    - Abre una solicitud de Pull Request

## ⚖️ Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para obtener más información.


## Webgrafia:
Para conseguir mi objetivo he recopilado información de:
- link a repositorios 
- link a documentacion de librerias externas
- ...

## Desarrollo:

``` js
 const developer = "datata";

 console.log("Desarrollado por: " + datata);
```  




## 👏 Agradecimientos

Este proyecto ha sido posible gracias al arduo trabajo de mis profesores Daniel Tarazona y David Ochando, quienes no solo comparten sus conocimientos, sino que también nos inculcan y generan entusiasmo en lo que estamos desarrollando.

      
<div>

 **Daniel**   
<a href="https://github.com/datata">
    <img src= "https://img.shields.io/badge/github-24292F?style=for-the-badge&logo=github&logoColor=red"/>
</a>

 **David**  
<a href="https://github.com/Dave86dev">
    <img src= "https://img.shields.io/badge/github-24292F?style=for-the-badge&logo=github&logoColor=white"/>
</a>
 </div>
 
## 📝 Autor

- **Vincenzo Donnarumma Veitia**

## Contacto

<a href = "mailto:vincenzodonnarumma22@gmail.com"><img src="https://img.shields.io/badge/Gmail-C6362C?style=for-the-badge&logo=gmail&logoColor=white" target="_blank"></a>
<a href="https://www.linkedin.com/in/vincenzo2202/" target="_blank"><img src="https://img.shields.io/badge/-LinkedIn-%230077B5?style=for-the-badge&logo=linkedin&logoColor=white" target="_blank"></a> 
 
