DROP TABLE User;
DROP TABLE Module;
DROP TABLE Course;
DROP TABLE Class;
DROP TABLE Test;
DROP TABLE Grade;

CREATE TABLE User(
    id VARCHAR(50),
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
    id VARCHAR(50),
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
    id VARCHAR(50),
    testName VARCHAR(50),
    testDate DATE,
    testResult float(4),
    FOREIGN KEY(mID) REFERENCES Module(mID),
    FOREIGN KEY (id) REFERENCES User(id)
);

CREATE TABLE Grade(
    mID VARCHAR(50),
    id VARCHAR(50),
    finalGrade FLOAT(4),
    FOREIGN KEY(mID) REFERENCES Module(mID),
    FOREIGN KEY (id) REFERENCES User(id)
);

INSERT INTO User (id, name, email, password, role) VALUES("A123456", "Donald Duck", "donaldduck@tudublin.ie", "letmeinplz", "ROLE.ADMIN");
INSERT INTO User (id, name, email, password, role) VALUES("T123456", "Goofy", "goofy@tudublin.ie", "letmeinplz", "ROLE.TEACHER");
INSERT INTO User (id, name, email, password, role) VALUES("S123456", "Micky", "micky@tudublin.ie", "letmeinplz", "ROLE.STUDENT");