# 'member-api

### Description
'member is a to-do list. Create a user and add any tasks you would like with a due date. You will also be able to view, update or delete them as you like.

### Technologies Used
- ExpressAPI
- MongoDB
- Mongoose
- Passport

### Development Process
The goal of the application is to be able to perform the following:
- POST /sign-up (sign up new user)
- POST /sign-in (sign in existing user)
- PATCH /change-password (change users password)
- DELETE /sign-out (sign out user)
- POST /tasks (create a new task)
- GET /tasks (view all tasks)
- PATCH /tasks (update specific task)
- DELETE /tasks (delete specific task)

The application also has a client side. Below is my developement process for the front end:
- Have a new user sign up and create hashed password on backend
- Have an existing user sign in and generate new randomized token
- Have user be able to create a new task with required authentication token
- Have user be able to view all created tasks that they own with required authentication token
- Have user be able to update a task that they own with required authentication token
- Have a user be able to delete a task that they own with required authentication token
- User must be able to sign out with required authentication token
- Unauthenticated user can not have access to authenticated functions such as change password, create new task, view all tasks, update task, or delete task
- Have all forms clear on submit success

### Unsolved Problems
- Update 'isComplete' when task is marked as completed

### ERD
![Imgur](https://i.imgur.com/xxKA7VJ.png "ERD for Fullstack Project")

### Links to Repo for Client Side of App and the Deployed Sites of Client and API
'member-client deployed site:
https://senoralikz.github.io/member-client/

'member-client repo:
https://github.com/senoralikz/member-client

'member-api deployed site:
https://dashboard.heroku.com/apps/protected-brushlands-52398
