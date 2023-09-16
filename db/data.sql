CREATE TABLE stakeholder (
	id VARCHAR(255) PRIMARY KEY UNIQUE,
	fullName VARCHAR(100), 
	email VARCHAR(85),
    phone VARCHAR(12),
    company VARCHAR(80),
    role VARCHAR(20),
    password VARCHAR(255)
);

CREATE TABLE project (
    id VARCHAR(255) PRIMARY KEY UNIQUE,
    name VARCHAR(80) NOT NULL,
    description VARCHAR(255), 
    createdDate DATE NOT NULL,
    startDate DATE, 
    estimatedEndDate DATE,
    endDate DATE,
    country VARCHAR(80) NOT NULL,
    province VARCHAR(80),
    city VARCHAR(80) NOT NULL,
    district VARCHAR(80),
    sector VARCHAR(80),
    address VARCHAR(80),
    dimensions INTEGER,
    typeOfBuilding VARCHAR(80) NOT NULL,
    ownerId VARCHAR(255),
    ownerName VARCHAR(80),
    ownerEmail VARCHAR(80),
    consultantId VARCHAR(255) NOT NULL,
    consultantName VARCHAR(80) NOT NULL,
    consultantEmail VARCHAR(80) NOT NULL,

);

CREATE TABLE material (
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    name VARCHAR(80) NOT NULL,
    description: VARCHAR(255),
    type VARCHAR(80) NOT NULL,
    quantity INTEGER NOT NULL,
    unitPrice INTEGER,
    totalPrice INTEGER,
    sprint VARCHAR(255),
    project VARCHAR(255) NOT NULL
);


CREATE TABLE issue (
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    name VARCHAR(80) NOT NULL,
    createDate DATE NOT NULL,
    startDate DATE,
    endDate DATE,
    duration INTEGER,
    status VARCHAR(10) NOT NULL,
    progress INTEGER NOT NULL
);

CONST TABLE sprint (
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    name VARCHAR(80) NOT NULL,
    description VARCHAR(255),
    createDate DATE NOT NULL,
    startDate DATE,
    endDate DATE,
    duration INTEGER,
    status VARCHAR(10) NOT NULL,
    progress INTEGER NOT NULL,
    issues VARCHAR(255),
);

sprint      material      