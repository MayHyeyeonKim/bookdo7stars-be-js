# 🌌 BookDo7Stars-TS Backend

## Table of Contents
- [Introduction](#introduction)
- [Git Flow](#git-flow)
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Testing](#testing)

## Introduction
This project is an extension of the existing [Book Store Backend Project](https://github.com/7CodeCrew/book-store-be) using different technologies to enhance security and other aspects.

## Git Flow
The `develop` branch is the default branch. Each feature branch is always created from the develop branch. Feature branches are created per task and follow the naming convention `feature/<<team-member-name>>-<<task-keyword>>`. For example, if Joon is working on the login feature, the branch would be named `feature/joon-login`.

## Features
- User registration, login (including SNS login), logout, account deletion, and profile update
- CRUD operations for managing resources
- Input validation and error handling
- Secure with JWT and password hashing using passport.js
- Environment-based configuration
- 

## Technologies
- Framework: Node.js
- Language: JavaScript
- Database: PostgreSQL
- Security Library: passport.js
- Unit-Testing: jest

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/nodejs-backend-project.git
2. Navigate to the project directory:
   `cd bookdo7star_be`
3. Install the dependencies:
   `npm install`
4. Set up environment variables:
   copy `.env.default` file in the root of the project and fill the informations

## Usage
1. Start the development server:
   `npm run dev`
2. The API will be available at `http://localhost:4000`.

## API Documentation
TODO

## Testing
For testing the testing library `jest` will be used.
Tests can be run via:
   `npm test`
 
