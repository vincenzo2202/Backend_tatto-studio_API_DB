###### 

<h1 align="center"> 💥 Backend Tattoo Studio 💥</h1>

<div style="text-align: center;"><img src= "./assets/tattoo_logo.jpg" width="600"/></div>

<br>
<p align="center"><a href="https://vincenzo2202.github.io/MasterMind-GH-project2/">https://github.com/vincenzo2202/Backend_tatto-studio_API_DB.git</a></p> 

# Welcome to my  backend app
Developed as part of the fourth project in the Full Stack Developer Bootcamp at Geekshubs Academy.

<div style="text-align: center;">
    <img src="./assets/GeeksHubs-Academy-Card.png" style="max-height: 120px; width: 600;" />
</div>


<br>

## Project content 

<details>
  <summary>Contents 📝</summary>
<ol>
  <a href="#"></a></li>
  <li><a href="#💡-objetive">Objective</a></li>
  <li><a href="#📑-about-the-project">About the Project</a></li> 
  <li><a href="#💻-stack">Stack</a></li>
  <li><a href="#📐-diagrama-db">Diagram Database</a></li>
  <li><a href="#📜-local-installation">Local Installation</a></li>
  <li><a href="#🚀-endpoints">Endpoints</a></li>
  <li><a href="#🔜-future-functionalities">Future Functionalities</a></li>
  <li><a href="#💁-contributions">Contributions</a></li>
  <li><a href="#⚖️-license">License</a></li>  
  <li><a href="#👏-acknowledgments">Acknowledgments</a></li>
  <li><a href="#📧-contact">Contact</a></li>
  <li><a href="#📷-images">Imagenes</a></li>
</ol>

</details>

## 💡 Objetive
Este proyecto requería una API funcional conectada a una base de datos con al menos una relación de uno a muchos y una relación de muchos a muchos.

<div style="text-align: center;">
    <img src="./assets/diagram.png" style="width: 500;" />
</div>

## 📑 About the project
I have decided to develop a backend system to support a tattoo shop. This system will allow the shop to register and manage users, making the login process easier for both customers and employees. Additionally, the system will enable the creation and tracking of new appointments for customers and artists, thus improving efficiency in tattoo scheduling.

The system will also include advanced features for the superadministrator, who will have the ability to manage roles, delete users, and track all active appointments in the shop. This solution will provide a more organized and effective workflow for the management of appointments and users, enhancing the experience for both shop staff and customers.  

<div style="text-align: center;"><img src= "./assets/vs_index_json.png"/></div>



## 💻 Stack
<div align="center">

<img src= "https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white"/>
<img src= "https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white"/>
<img src= "https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white"/>
<img src= "https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white"/>
<img src= "https://img.shields.io/badge/node.js-026E00?style=for-the-badge&logo=node.js&logoColor=white"/>
<img src= "https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB"/>
<img src= "https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens"/>
<img src= "https://img.shields.io/badge/NODEMON-%23323330.svg?style=for-the-badge&logo=nodemon&logoColor=%BBDEAD"/>
<img src= "./assets/typeorm.png" style="height: 28"/>
<img src= "https://img.shields.io/badge/markdown-%23000000.svg?style=for-the-badge&logo=markdown&logoColor=white"/>

 </div>

## 📐 Diagrama DB 
In the diagram, we can observe that each user can only have one role, including 'user' for store customers, 'admin' for employees, and 'superadmin' for those who acquire the role of managing the application, possibly the store manager.

On the other hand, each customer can make a reservation, and thanks to the validations, it has been ensured that they do not overlap with any other customer if the tattoo artist already has a reservation for that date or time, preventing the reservation system from becoming overloaded.

The tattoo artist can track the appointments assigned to them, with the ability to paginate them and view detailed information for each appointment.

<div style="text-align: center;">
 <img src= "./assets/db_diagram.png" style="height: 600"/>
</div>

## 📜 Local Installation

<details>
<summary>Installation</summary>

1. Clone the repository.

2. Install the dependencies required for the project. 

    - ` $ npm install ` 
    
    Alternatively, you can install all the dependencies with the following command:

    - ` $ npm i express typescript nodemon ts-node @types/express @types/node mysql2 reflect-metadata typeorm bcrypt @types/bcrypt jsonwebtoken @types/jsonwebtoken dotenv` 


3. Connect your repository to the database by creating the .env file and adding the appropriate database credentials:

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
4.  Run the migrations:
    - `$ npx typeorm-ts-node-commonjs migration:run -d ./src/db.ts`
5. $ Run the seeders 
6. Execute the application with the following command: 
    - ` $ npm run dev ` 
</details>

## 🚀 Endpoints 
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

        - Auth: ` Enter the token to access the profile.`

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
        - Auth: `Enter the token to update.`

    - GET ALL WORKER

            GET http://localhost:4000/user/AllWorkers?skip=5&page=1
        
        - Auth: ` Enter the token to get the list of workers.`

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
        - Auth: `Enter the token to create the appointment.`

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
         - Auth: `Enter the token to update the appointment.`

    - DELETE

            DELETE http://localhost:4000/appointment/deleteAppointment
        body:
        ``` js
            {
               "id": 60 
            }
        ```
         - Auth: `Enter the token to delete the appointment.`

    - GET ALL APPOINTMENTS BY USER

            GET http://localhost:4000/appointment/getAllAppointment?skip=10&page=1
        
         - Auth: `Enter the token to retrieve the appointments.`

    - GET ALL APPOINTMENTS BY WORKER

            GET http://localhost:4000/appointment/getAllArtist?skip=5&page=1
        
         - Auth: `Enter the token to get the appointments.`
    
    - APPOINTMENT DETAIL

            GET http://localhost:4000/appointment/appointmentDetail
        body:
        ``` js
            {
               "id": 60 
            }
        ```
         - Auth: `Enter the token to get the detailed appointment`

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
         - Auth: `Enter the token to validate the appointment.`

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
         - Auth: ` Enter the token to get all the users.`

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
         - Auth: `Enter the token to create the worker.`

    - DELETE USERS BY SUPER ADMIN

            DELETE http://localhost:4000/user/createWorker
        body:
        ``` js
            {
               "id": 34
            }
        ```
        - Auth: `Enter the token to delete any user.`

    - GET ALL APPOINTMENT BY SUPER ADMIN

            GET http://localhost:4000/appointment/AllAppointmentsSuper?skip=5&page=1
         
        ```
    - Auth: ` Enter the token to get all the appointments.`

    - CHANGE ROLE BY SUPER ADMIN

            PUT http://localhost:4000/user/assignRole
        body:
        ``` js
            {
             "id":45, 
             "role_id": 2 
            }
        ```
         - Auth: `Enter the token to change the role.`

</details>

## 🔜 Future functionalities

<input type="checkbox">  Allow the tattoo artist to update appointments.
<br>
<input type="checkbox"> Allow the tattoo artist to update appointments.
<br>
<input type="checkbox"> Allow the tattoo artist to create appointments for clients.
<br>
<input type="checkbox"> Customized portfolio. 
<br>
<input type="checkbox">  Allow multiple products in one appointment.



## 💁 Contributions
Suggestions and contributions are always welcome. 

You can do this in two ways:

1. Opening an issue.
2. Fork the repository
    - Create a new branch.  
        ```
        $ git checkout -b feature/username-improvement
        ```
    - Commit your changes.
        ```
        $ git commit -m 'feat: improve X thing'
        ```
    - Push the branch.
        ```
        $ git push origin feature/username-improvement
        ```
    - Open a Pull Request.

## ⚖️ License

This project is under the MIT License. Please refer to the LICENSE file for more information.

  
## 👏 Acknowledgments

This project has been made possible thanks to the hard work of my teachers Daniel Tarazona and David Ochando, who not only share their knowledge but also instill enthusiasm in us for what we are developing.

<div align="center"> 
<div style="display: inline-block; margin-right: 20px;">
<strong>Daniel Tarazona</strong>
</div>
<div style="display: inline-block;">
<strong>David Ochando</strong>
</div> 

<a href="https://github.com/datata">
<img src="https://img.shields.io/badge/github-24292F?style=for-the-badge&logo=github&logoColor=red" style="margin: 10px;" />
</a>
<a href="https://github.com/Dave86dev">
<img src="https://img.shields.io/badge/github-24292F?style=for-the-badge&logo=github&logoColor=white" style="margin: 10px;" />
</a> 
</div> 

## 📝 Author

- **Vincenzo Donnarumma Veitia**

## 📧 Contact  
<div align="center">
<a href = "mailto:vincenzodonnarumma22@gmail.com"><img src="https://img.shields.io/badge/Gmail-C6362C?style=for-the-badge&logo=gmail&logoColor=white" target="_blank"></a>
<a href="https://www.linkedin.com/in/vincenzo2202/" target="_blank"><img src="https://img.shields.io/badge/-LinkedIn-%230077B5?style=for-the-badge&logo=linkedin&logoColor=white" target="_blank" ></a> 
<a href="https://github.com/vincenzo2202">
    <img src= "	https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"/>
</a>
</div>

[<img src="./assets/top.png" width="60"  align="right"/>](#) 
## 📷 Images
<br>
<br>
<div style="text-align: center;">
    <img src="./assets/img1.png" />
</div>
<br>
<div style="text-align: center;">
    <img src="./assets/img2.png"  />
</div>
<br>
<div style="text-align: center;">
    <img src="./assets/img3.png"  />
</div>

 [<img src="./assets/top.png" width="60"  align="right"/>](#)