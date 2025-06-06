# Book Review API

A RESTful API for managing book reviews, built with Node.js, Express, and MongoDB.

## Features

- User authentication with JWT
- Book management (CRUD operations)
- Review system with ratings
- Search functionality
- Pagination support
- Soft delete for reviews

## Tech Stack

- Node.js with Express.js
- MongoDB with Mongoose
- JWT for authentication
- Joi for request validation
- bcrypt for password hashing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/book-review
JWT_SECRET=your_jwt_secret_key
```

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd book-review-server
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The server will start running on `http://localhost:3000`

## API Documentation


## 📊 Database Schema

### User
```javascript
{
  username: String (required),
  emailId: String (required, unique),
  password: String (required, hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Book
```javascript
{
  ISBN: String (required, unique),
  title: String (required),
  author: String (required),
  genre: String (required),
  created_by: ObjectId (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

### Review
```javascript
{
  review_text: String (required),
  rating: Number (required),
  user_id: ObjectId (ref: 'User'),
  book_id: ObjectId (ref: 'Book'),
  is_deleted: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔍 Design Decisions

1. **Soft Delete for Reviews**: Instead of permanently deleting reviews, we use a soft delete approach with an `is_deleted` flag. This maintains data integrity and allows for potential recovery.

2. **Pagination**: All list endpoints support pagination to handle large datasets efficiently.

3. **JWT Authentication**: Using JWT for stateless authentication, making the API scalable and secure.

4. **Input Validation**: Using Joi for request validation to ensure data integrity.

5. **Error Handling**: Consistent error responses with appropriate HTTP status codes.
