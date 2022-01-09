## A web application to find the proximity of a place from the default location set by admin

### For Local Setup -

- Latest node.js stable version should be installed on your system
- MongoDB should be configured

#### npm install

- Install all the required packages for setting up and running in local environment

### npm run dev

- Run the project in development mode (using nodemon)

### npm start

- Run the project using node

### Sign up

- Create a user. A user can be admin or normal user.
- You can create multiple users

### Sign in

- Sign in as an admin or an general user

### Application flow

- Create a admin profile first. Without admin, no default city will be used
- Sign in as admin and set default city
- Create a user profile. Sign in as user
- In user page, enter city name and click on 'Check proximity' button
- If place is valid, its distance from default city will be displayed in the table
