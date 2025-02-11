# clot_userUpdate_service# Clot_UserUpdate_Service Microservice

## Overview
The **Clot_UserUpdate_Service** microservice is responsible for updating user information stored in the MySQL database. It connects to the existing database from `clot_userCreate_service` and implements the **Command** design pattern for executing update operations in a structured manner.

---

## Features
- Updates user details such as `name`, `email`, and `password`.
- Uses MySQL as the relational database.
- Implements the **Command** design pattern for better structuring of update operations.
- Fully containerized with Docker.
- Implements a retry mechanism (`connectWithRetry`) to handle potential connection delays.

---

## Technologies Used
- **Node.js**: JavaScript runtime for backend development.
- **Express.js**: Lightweight framework for API handling.
- **MySQL**: Relational database for user data storage.
- **Docker**: Containerization for service deployment.
- **dotenv**: Environment variable management.
- **Body-parser**: Parses incoming request bodies.

---

## API Endpoints
### Update User
**Endpoint**: `/api/users/:id`

**Method**: `PUT`

**Request Example**:
```
PUT http://localhost:3002/api/users/1
```

**Body (JSON format)**:
```json
{
  "name": "John Updated",
  "email": "john.updated@example.com",
  "password": "newpassword"
}
```

**Response Examples**:
- **200 OK**:
  ```json
  {
    "message": "User updated successfully"
  }
  ```
- **404 Not Found**:
  ```json
  {
    "message": "User not found or no changes made"
  }
  ```
- **500 Internal Server Error**:
  ```json
  {
    "message": "Error updating user"
  }
  ```

---

## Environment Variables
This microservice requires a `.env` file in the root directory with the following variables:

```env
PORT=3002
DB_HOST=clot_usercreate_service-db-1
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=clot_users
```

---

## Project Structure
```
clot_userUpdate_service
├── src/
│   ├── app.js                # Main application file
│   ├── routes/
│   │   └── index.js          # API routes
│   ├── controllers/
│   │   └── userController.js # Business logic for updating users
│   ├── models/
│   │   └── userModel.js      # Database queries
├── .env                      # Environment variables
├── Dockerfile                # Docker build file
├── docker-compose.yml        # Docker Compose configuration
├── README.md                 # Documentation
└── package.json              # Node.js dependencies
```

---

## Docker Setup
1. **Build the Docker Image**:
   ```bash
   docker build -t clot_userupdate_service:latest .
   ```
2. **Run the Docker Container**:
   ```bash
   docker run -p 3002:3002 --env-file .env clot_userupdate_service:latest
   ```
3. **Using Docker Compose**:
   ```bash
   docker-compose up --build
   ```

---

## Retry Mechanism (`connectWithRetry`)
Since the connection might not always be available immediately, this microservice implements a **retry mechanism** that attempts to connect to MySQL 5 times with 5-second intervals before failing.

Example implementation:
```javascript
const connectWithRetry = async (db) => {
  let attempts = 5;
  while (attempts > 0) {
    try {
      await db.getConnection();
      console.log("Database connected successfully");
      return;
    } catch (error) {
      console.error("Database connection failed. Retrying in 5 seconds...");
      attempts--;
      await new Promise(res => setTimeout(res, 5000));
    }
  }
  throw new Error("Could not connect to the database after multiple attempts");
};
```
This ensures that temporary unavailability does not cause immediate service failure.

---

## Testing the API
Use **Postman** or **curl** to test the API.

Example using `curl` to update a user:
```bash
curl -X PUT http://localhost:3002/api/users/1 \
-H "Content-Type: application/json" \
-d '{"name": "John Updated", "email": "john.updated@example.com", "password": "newpassword"}'
```

Expected Response:
```json
{
  "message": "User updated successfully"
}
```

---

## Notes
- Ensure `clot_userCreate_service` is running before starting this microservice.
- This service **does not create users**, it only updates existing ones.

---

## License
This project is licensed under the MIT License. See the LICENSE file for details.

