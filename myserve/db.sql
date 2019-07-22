SET NAMES UTF8;
DROP DATABASE IF EXISTS clock;
CREATE DATABASE clock CHARSET=UTF8;
USE clock;
#用户列表
CREATE TABLE userList(
    uid INT PRIMARY KEY AUTO_INCREMENT,
    pname VARCHAR(32),
    purl VARCHAR(64),
    age INT,
    uadress VARCHAR(128)
);
#评论列表
CREATE TABLE plList(
    pid INT PRIMARY KEY AUTO_INCREMENT,
    uid INT,
    ptext VARCHAR(1024),
    pimgUrl VARCHAR(64),
    pvideoUrl VARCHAR(64),
    paudioUrl  VARCHAR(64),
    FOREIGN KEY(uid) REFERENCES userList(uid)
);
#获赞列表
CREATE TABLE fabList(
    fid INT PRIMARY KEY AUTO_INCREMENT,
    pid INT,
    uid INT,
    FOREIGN KEY(pid) REFERENCES plList(pid),
    FOREIGN KEY(uid) REFERENCES userList(uid)
);
#回复列表
CREATE TABLE replyList(
    rid INT PRIMARY KEY AUTO_INCREMENT,
    pid INT,
    uid INT,
    ptext VARCHAR(1024),
    pimgUrl VARCHAR(64),
    pvideoUrl VARCHAR(64),
    paudioUrl  VARCHAR(64),
    FOREIGN KEY(pid) REFERENCES plList(pid),
    FOREIGN KEY(uid) REFERENCES userList(uid)
);
