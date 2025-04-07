# Pet Adoption Backend API

This is the backend API for the Pet Adoption application. It provides endpoints for managing pets, users, and adoption applications.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/pet-adoption
   JWT_SECRET=your_jwt_secret_should_be_very_long_and_secure
   JWT_EXPIRE=30d
   JWT_COOKIE_EXPIRE=30
   ```

3. Start MongoDB:
   Make sure you have MongoDB installed and running.

4. Start the server:
   ```
   npm run dev
   ```

## API Endpoints

### Pets

- **GET /api/pets** - Get all pets with filtering and pagination options
  - Query parameters: category, status, search, gender, size, page, limit
- **GET /api/pets/:id** - Get a single pet by ID
- **POST /api/pets** - Create a new pet (Shelter/Admin only)
- **PUT /api/pets/:id** - Update a pet (Owner Shelter/Admin only)
- **DELETE /api/pets/:id** - Delete a pet (Owner Shelter/Admin only)

### Users

- **POST /api/users/register** - Register a new user
- **POST /api/users/login** - Login user
- **GET /api/users/me** - Get current logged in user (protected)
- **PUT /api/users/profile** - Update user profile (protected)
- **PUT /api/users/updatepassword** - Update password (protected)
- **POST /api/users/forgotpassword** - Forgot password
- **GET /api/users/favorites** - Get user's favorite pets (protected)
- **PUT /api/users/favorites/:petId** - Add pet to favorites (protected)
- **DELETE /api/users/favorites/:petId** - Remove pet from favorites (protected)

### Adoptions

- **POST /api/adoptions** - Submit adoption application (protected)
- **GET /api/adoptions/shelter** - Get all shelter's applications (Shelter/Admin only)
- **GET /api/adoptions/user** - Get user's applications (protected)
- **GET /api/adoptions/:id** - Get a single application (Owner/Target Shelter/Admin only)
- **PUT /api/adoptions/:id** - Update application status (Shelter/Admin only)
- **PUT /api/adoptions/:id/success-story** - Add/Update success story (Adopter only)
- **GET /api/adoptions/success-stories** - Get published success stories

## Authentication

This API uses JWT (JSON Web Tokens) for authentication. To access protected routes, include the JWT token in the request header:

```
Authorization: Bearer <token>
```

## Roles and Permissions

- **User**: Can browse pets, add favorites, submit adoption applications, and add success stories.
- **Shelter**: Can create/update/delete their own pets and manage adoption applications.
- **Admin**: Has full access to all resources.

## Data Models

### Pet

- name (String, required)
- breed (String, required)
- age (String, required)
- gender (String, required, enum: ['Male', 'Female'])
- description (String, required)
- image (String, required)
- category (String, required, enum: ['dog', 'cat', 'other'])
- size (String, enum: ['Small', 'Medium', 'Large', 'Extra Large'])
- adoptionStatus (String, required, enum: ['Available', 'Pending', 'Adopted'])
- shelter (ObjectId, ref: 'User')

### User

- name (String, required)
- email (String, required, unique)
- password (String, required)
- role (String, enum: ['user', 'shelter', 'admin'], default: 'user')
- address (Object)
- phone (String)
- avatar (String)
- favorites (Array of ObjectIds, ref: 'Pet')
- shelterInfo (Object, for shelter accounts)

### Adoption

- pet (ObjectId, ref: 'Pet', required)
- user (ObjectId, ref: 'User', required)
- shelter (ObjectId, ref: 'User', required)
- status (String, enum: ['Pending', 'Approved', 'Rejected', 'Completed'])
- applicationDetails (Object, required)
- reviewedBy (ObjectId, ref: 'User')
- reviewDate (Date)
- reviewNotes (String)
- adoptionDate (Date)
- successStory (Object) 