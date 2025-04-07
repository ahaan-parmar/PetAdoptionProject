# Pet Adoption Database Schema

## Collections

### Users Collection
- **_id**: ObjectId (Primary Key)
- **name**: String
- **email**: String (Unique)
- **password**: String (Hashed)
- **role**: String (Enum: 'user', 'shelter', 'admin')
- **contact**: String
- **address**: String
- **createdAt**: Date
- **updatedAt**: Date

### Pets Collection
- **_id**: ObjectId (Primary Key)
- **name**: String
- **breed**: String
- **age**: String
- **gender**: String (Enum: 'Male', 'Female')
- **description**: String
- **image**: String (URL)
- **category**: String (Enum: 'dog', 'cat', 'other')
- **size**: String (Enum: 'Small', 'Medium', 'Large', 'Extra Large')
- **adoptionStatus**: String (Enum: 'Available', 'Pending', 'Adopted')
- **shelter**: ObjectId (Foreign Key to Users collection)
- **createdAt**: Date
- **updatedAt**: Date

### Adoptions Collection
- **_id**: ObjectId (Primary Key)
- **pet**: ObjectId (Foreign Key to Pets collection)
- **user**: ObjectId (Foreign Key to Users collection)
- **status**: String (Enum: 'Pending', 'Approved', 'Rejected')
- **applicationDate**: Date
- **approvalDate**: Date (optional)
- **notes**: String (optional)
- **createdAt**: Date
- **updatedAt**: Date

## Relationships

1. **One-to-Many**: User (shelter) to Pets
   - A shelter can list many pets
   - Each pet belongs to one shelter

2. **One-to-Many**: User to Adoptions
   - A user can have many adoption applications
   - Each adoption application belongs to one user

3. **One-to-Many**: Pet to Adoptions
   - A pet can have multiple adoption applications (historical)
   - Each adoption application is for one specific pet

## Indexes
- Text indexes on Pet collection (name, breed, description, category) for search functionality
- Regular indexes on foreign key fields for performance optimization

## Data Flow
1. Shelters add pets to the database
2. Users browse available pets
3. Users submit adoption applications
4. Shelters review and approve/reject applications
5. Pet status is updated accordingly 