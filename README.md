# Online Story Application - Backend

## Overview
The backend of the Online Story Application is built using **Node.js** and **Express.js**, with **MongoDB** as the database. It provides APIs for managing stories, user subscriptions, and notifications. The backend uses several design patterns to ensure maintainability and scalability.

## Technologies Used

The backend of the Online Story Application is built using the following technologies:

- **Node.js**: A JavaScript runtime for building server-side applications.
- **Express.js**: A web framework for building RESTful APIs.
- **MongoDB**: A NoSQL database for storing story, chapter, and user data.
- **Mongoose**: An ODM (Object Data Modeling) library for MongoDB.
- **JWT (JSON Web Token)**: Used for user authentication and session management.
- **dotenv**: A module for managing environment variables.
- **Socket.IO**: (Optional) For real-time notifications when new chapters are added.

## Features
- CRUD operations for stories.
- Notify users when new chapters are added (Observer Pattern).
- Create stories based on genres (Factory Pattern).
- Ensure a single reading session (Singleton Pattern).

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/long-vux/online-story-app-backend.git
   ```
2. Install dependencies:
   ```bash
   npm install 
   ```
3. Start the server:
   ```bash
   npm start
   ```

## Environment Variables:
Create a .env file in the be folder with the following content:
    ```
    MONGO_URI=<mongodb-uri>
    PORT=<port-number>
    JWT_SECRET=<jwt-secret>
    ```

## API Endpoints

### Stories
- `GET /api/stories`: Get all stories.
- `POST /api/stories`: Create a new story.
- `GET /api/stories/:id`: Get a story by ID.
- `PUT /api/stories/:id`: Update a story.
- `DELETE /api/stories/:id`: Delete a story.

### Chapters
- `POST /api/chapters`: Add a new chapter (Admin only).
- `GET /api/chapters/:id`: Get a chapter by ID.
- `PUT /api/chapters/:id`: Update a chapter (Admin only).
- `DELETE /api/chapters/:id`: Delete a chapter (Admin only).

### Comments and Ratings
- `POST /api/stories/:storyId/comment`: Add a comment to a story.
- `PUT /api/stories/:storyId/comment/:commentId`: Update a comment.
- `DELETE /api/stories/:storyId/comment/:commentId`: Delete a comment.
- `POST /api/stories/:storyId/rate`: Add a rating to a story.

### Subscriptions
- `POST /api/stories/:storyId/subscribe`: Subscribe to a story.
- `DELETE /api/stories/:storyId/unsubscribe`: Unsubscribe from a story.
- `GET /api/stories/:storyId/isSubscribed`: Check if a user is subscribed to a story.

### Users
- `POST /api/user/login`: Login a user.
- `POST /api/user/register`: Register a new user.
- `GET /api/user/`: Get all users (Admin only).
- `GET /api/user/:id`: Get a user by ID.
- `PUT /api/user/:id`: Update a user.
- `DELETE /api/user/:id`: Delete a user (Admin only).
- `PUT /api/user/change-password/:id`: Change a user's password.
- `PUT /api/user/:id/avatar`: Update a user's avatar.

### Reading Progress
- `GET /api/progress/:userId/:storyId`: Get reading progress for a user and story.
- `POST /api/progress`: Update reading progress.
- `DELETE /api/progress`: Delete reading progress.

### Genres
- `GET /api/genres`: Get all genres.
- `POST /api/genres`: Add a new genre (Admin only).
- `PUT /api/genres/:id`: Update a genre (Admin only).
- `DELETE /api/genres/:id`: Delete a genre (Admin only).

### Notifications
- `GET /api/notifications`: Get all notifications for a user.
- `POST /api/notifications`: Create a new notification.
- `DELETE /api/notifications/:id`: Delete a notification.

