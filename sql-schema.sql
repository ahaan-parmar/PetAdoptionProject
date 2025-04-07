-- Pet Adoption Database Schema (SQL Version)

-- Users Table
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Hashed password
    role ENUM('user', 'shelter', 'admin') NOT NULL DEFAULT 'user',
    contact VARCHAR(50),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_role (role)
);

-- Pets Table
CREATE TABLE Pets (
    pet_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    breed VARCHAR(100) NOT NULL,
    age VARCHAR(20) NOT NULL,
    gender ENUM('Male', 'Female') NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(255) NOT NULL,
    category ENUM('dog', 'cat', 'other') NOT NULL,
    size ENUM('Small', 'Medium', 'Large', 'Extra Large'),
    adoption_status ENUM('Available', 'Pending', 'Adopted') NOT NULL DEFAULT 'Available',
    shelter_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (shelter_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    INDEX idx_pet_category (category),
    INDEX idx_pet_status (adoption_status),
    INDEX idx_pet_breed (breed),
    FULLTEXT INDEX ft_pet_search (name, breed, description)
);

-- Adoptions Table
CREATE TABLE Adoptions (
    adoption_id INT AUTO_INCREMENT PRIMARY KEY,
    pet_id INT NOT NULL,
    user_id INT NOT NULL,
    status ENUM('Pending', 'Approved', 'Rejected') NOT NULL DEFAULT 'Pending',
    application_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approval_date TIMESTAMP NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (pet_id) REFERENCES Pets(pet_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    INDEX idx_adoption_status (status),
    UNIQUE KEY unique_pet_user (pet_id, user_id)
);

-- Pet Categories Table (for normalization)
CREATE TABLE PetCategories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pet Breeds Table (for normalization)
CREATE TABLE PetBreeds (
    breed_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category_id INT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES PetCategories(category_id),
    UNIQUE KEY unique_breed_category (name, category_id)
);

-- PetTags Junction Table (Many-to-Many relationship)
CREATE TABLE PetTags (
    pet_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (pet_id, tag_id),
    FOREIGN KEY (pet_id) REFERENCES Pets(pet_id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES Tags(tag_id) ON DELETE CASCADE
);

-- Tags Table
CREATE TABLE Tags (
    tag_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shelter Reviews Table
CREATE TABLE ShelterReviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    shelter_id INT NOT NULL,
    user_id INT NOT NULL,
    rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shelter_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_shelter_user_review (shelter_id, user_id)
);

-- Sample Stored Procedure for Getting Adoption Statistics
DELIMITER //
CREATE PROCEDURE GetAdoptionStatsByCategory()
BEGIN
    SELECT 
        p.category,
        COUNT(*) as total_adoptions,
        AVG(CASE 
            WHEN p.age LIKE '%year%' THEN CAST(SUBSTRING_INDEX(p.age, ' ', 1) AS UNSIGNED)
            WHEN p.age LIKE '%month%' THEN CAST(SUBSTRING_INDEX(p.age, ' ', 1) AS UNSIGNED) / 12
            ELSE 0
        END) as average_age
    FROM 
        Adoptions a
    JOIN 
        Pets p ON a.pet_id = p.pet_id
    WHERE 
        a.status = 'Approved'
    GROUP BY 
        p.category
    ORDER BY 
        total_adoptions DESC;
END //
DELIMITER ;

-- Sample Views for Reporting
CREATE VIEW PetAdoptionStats AS
SELECT
    p.category,
    p.size,
    p.gender,
    COUNT(*) AS adoption_count,
    MONTH(a.approval_date) AS adoption_month,
    YEAR(a.approval_date) AS adoption_year
FROM
    Adoptions a
JOIN
    Pets p ON a.pet_id = p.pet_id
WHERE
    a.status = 'Approved'
GROUP BY
    p.category, p.size, p.gender, 
    MONTH(a.approval_date), YEAR(a.approval_date);

-- Sample Trigger to Update Pet Status on Adoption Approval
DELIMITER //
CREATE TRIGGER update_pet_status
AFTER UPDATE ON Adoptions
FOR EACH ROW
BEGIN
    IF NEW.status = 'Approved' AND OLD.status != 'Approved' THEN
        UPDATE Pets
        SET adoption_status = 'Adopted'
        WHERE pet_id = NEW.pet_id;
    END IF;
END //
DELIMITER ; 