# Pet Adoption Database - ER Diagram Description

## Entity Relationship Diagram

Below is a textual representation of the ER diagram for the Pet Adoption database system:

```
+----------------+       +----------------+       +----------------+
|     Users      |       |      Pets      |       |   Adoptions    |
+----------------+       +----------------+       +----------------+
| user_id (PK)   |<------| shelter_id (FK)|       | adoption_id(PK)|
| name           |       | pet_id (PK)    |<------| pet_id (FK)    |
| email          |       | name           |       | user_id (FK)   |<--+
| password       |       | breed          |       | status         |   |
| role           |       | age            |       | application_date  |
| contact        |       | gender         |       | approval_date  |   |
| address        |       | description    |       | notes          |   |
| created_at     |       | image          |       | created_at     |   |
| updated_at     |       | category       |       | updated_at     |   |
+----------------+       | size           |       +----------------+   |
       ^                 | adoption_status|                            |
       |                 | created_at     |                            |
       |                 | updated_at     |                            |
       |                 +----------------+                            |
       |                         ^                                     |
       |                         |                                     |
       |                 +----------------+                            |
       |                 |    PetTags     |                            |
       |                 +----------------+                            |
       |                 | pet_id (PK,FK) |                            |
       |                 | tag_id (PK,FK) |                            |
       |                 +----------------+                            |
       |                         ^                                     |
       |                         |                                     |
       |                 +----------------+                            |
       |                 |      Tags      |                            |
       |                 +----------------+                            |
       |                 | tag_id (PK)    |                            |
       |                 | name           |                            |
       |                 | created_at     |                            |
       |                 +----------------+                            |
       |                                                              |
       |                 +----------------+                            |
       |                 | ShelterReviews |                            |
       |                 +----------------+                            |
       +---------------->| shelter_id (FK)|                            |
                         | user_id (FK)   |----------------------------+
                         | review_id (PK) |
                         | rating         |
                         | comment        |
                         | created_at     |
                         +----------------+

        +----------------+       +----------------+
        | PetCategories  |       |   PetBreeds    |
        +----------------+       +----------------+
        | category_id(PK)|<------| category_id(FK)|
        | name           |       | breed_id (PK)  |
        | description    |       | name           |
        | created_at     |       | description    |
        +----------------+       | created_at     |
                                 +----------------+
```

## Entity Descriptions

### Users
- Represents all users in the system
- Three roles: regular users (adopters), shelters, and administrators
- Primary key: user_id
- Unique constraint: email

### Pets
- Represents animals available for adoption
- Belongs to a shelter (User with role 'shelter')
- Primary key: pet_id
- Foreign key: shelter_id references Users(user_id)

### Adoptions
- Represents adoption applications
- Links pets with potential adopters
- Primary key: adoption_id
- Foreign keys: 
  - pet_id references Pets(pet_id)
  - user_id references Users(user_id)

### Tags
- Represents descriptive labels for pets (e.g., "friendly", "trained", "special needs")
- Primary key: tag_id

### PetTags (Junction Table)
- Implements many-to-many relationship between Pets and Tags
- Composite primary key: (pet_id, tag_id)
- Foreign keys:
  - pet_id references Pets(pet_id)
  - tag_id references Tags(tag_id)

### ShelterReviews
- Represents user reviews for shelters
- Primary key: review_id
- Foreign keys:
  - shelter_id references Users(user_id) where role='shelter'
  - user_id references Users(user_id)

### PetCategories
- Represents categories of pets (normalized from Pets table)
- Primary key: category_id

### PetBreeds
- Represents breeds of pets (normalized from Pets table)
- Primary key: breed_id
- Foreign key: category_id references PetCategories(category_id)

## Relationships

1. **One-to-Many: Users (shelter) to Pets**
   - A shelter can list many pets
   - Each pet belongs to exactly one shelter

2. **One-to-Many: Users to Adoptions**
   - A user can submit many adoption applications
   - Each adoption application belongs to exactly one user

3. **One-to-Many: Pets to Adoptions**
   - A pet can have multiple adoption applications
   - Each adoption application is for exactly one pet

4. **Many-to-Many: Pets to Tags**
   - A pet can have multiple tags
   - A tag can be associated with many pets
   - Implemented through the PetTags junction table

5. **Many-to-One: PetBreeds to PetCategories**
   - Each breed belongs to one category
   - Each category can have many breeds

6. **Many-to-Many: Users (as shelters) to Users (as adopters) through ShelterReviews**
   - A shelter can be reviewed by many users
   - A user can review many shelters

## Notes on Database Design

1. **Normalization**: The database is designed with normalization principles to reduce redundancy.

2. **Indexing**: Appropriate indexes are created for frequently queried columns.

3. **Constraints**: 
   - Foreign key constraints ensure referential integrity
   - Unique constraints prevent duplicate records
   - Check constraints ensure data validity (e.g., ratings between 1-5)

4. **Timestamps**: Created_at and updated_at fields enable auditing and tracking changes.

5. **ENUM Types**: Used for fields with a fixed set of possible values (e.g., pet gender, adoption status).

6. **Full-Text Search**: Implemented on pet attributes for efficient searching. 