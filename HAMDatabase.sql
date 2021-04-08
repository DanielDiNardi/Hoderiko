-- DROP TABLE Admin;
-- DROP TABLE Student;
-- DROP TABLE Teacher;
DROP TABLE Module;
DROP TABLE Course;
DROP TABLE Class;
DROP TABLE Test;
DROP TABLE Grade;

-- CREATE TABLE Admin(
--     aID INTEGER PRIMARY KEY AUTOINCREMENT,
--     aName VARCHAR(50),
--     aEmail VARCHAR(50),
--     aPassword VARCHAR(500),
--     role VARCHAR(10)
-- );

-- CREATE TABLE Student(
--     studentID VARCHAR(50) PRIMARY KEY,
--     sName VARCHAR(50),
--     sEmail VARCHAR(50),
--     sPassword VARCHAR(50),
--     role VARCHAR(10)
-- );

-- CREATE TABLE Teacher(
--     tID INTEGER PRIMARY KEY AUTOINCREMENT,
--     tName VARCHAR(50),
--     tEmail VARCHAR(50),
--     tPassword VARCHAR(50),
--     role VARCHAR(10)
-- );

CREATE TABLE User(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50),
    email VARCHAR(50),
    password VARCHAR(500),
    role VARCHAR(10)
);

CREATE TABLE Module(
    mID VARCHAR(50) PRIMARY KEY,
    mName VARCHAR(50),
    mDesc VARCHAR(50),
    mYear NUMBER(1),
    id INTEGER,
    FOREIGN KEY (id) REFERENCES User(id)
);

CREATE TABLE Course(
    mID VARCHAR(50),
    id INTEGER,
    cName VARCHAR(50),
    cDesc VARCHAR(50),
    cYear VARCHAR(50),
    FOREIGN KEY(mID) REFERENCES Module(mID),
    FOREIGN KEY (id) REFERENCES User(id)
);

CREATE TABLE Class(
    classDate DATE,
    classStartTime TIME,
    classEndTime TIME,
    attended BOOLEAN
);

CREATE TABLE Test(
    mID VARCHAR(50),
    id INTEGER,
    testName VARCHAR(50),
    testDate VARCHAR(50),
    testResult float(4),
    FOREIGN KEY(mID) REFERENCES Module(mID),
    FOREIGN KEY (id) REFERENCES User(id)
);

CREATE TABLE Grade(
    mID VARCHAR(50),
    id INTEGER,
    finalGrade FLOAT(4),
    FOREIGN KEY(mID) REFERENCES Module(mID),
    FOREIGN KEY (id) REFERENCES User(id)
);

INSERT INTO User (name, email, password, role) VALUES("Donald Duck", "donaldduck@tudublin.ie", "quack123", "admin");