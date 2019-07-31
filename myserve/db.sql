SET NAMES UTF8;
DROP DATABASE IF EXISTS clock;
CREATE DATABASE clock CHARSET=UTF8;
USE clock;
#用户列表
CREATE TABLE userList(
    uid INT PRIMARY KEY AUTO_INCREMENT,
    openId VARCHAR(128),
    pname VARCHAR(32),
    purl VARCHAR(256),
    age INT,
    uadress VARCHAR(128)
);
INSERT INTO `userlist` (`uid`, `openId`, `pname`, `purl`, `age`, `uadress`) VALUES
(1, 'oWIim5FvsyyOukAcpxsoOYGuzPac', '土肥圆', 'https://wx.qlogo.cn/mmopen/vi_32/4zyIHHMzURfThdBhzWWxibHicW4NxbODhmgsFhEt2NYmJj0TCsAVfuCiamckMHylspBm1Lp7OxcVlWibYqzQ2JKf6w/132', 1, 'Hunan');

#评论列表
CREATE TABLE plList(
    pid INT PRIMARY KEY AUTO_INCREMENT,
    uid INT,
    ptime BIGINT,
    ptext VARCHAR(1024),
    place VARCHAR(64),
    state INT,
    FOREIGN KEY(uid) REFERENCES userList(uid)
);
INSERT INTO `pllist` (`pid`, `uid`, `ptime`, `ptext`, `place`, `state`) VALUES
(1, 1, 1564542094301, '今天天气不错', '', 0);
#图片
CREATE TABLE clockImg(
    cid INT PRIMARY KEY AUTO_INCREMENT,
    pid INT,
    cimgUrl VARCHAR(64),
    FOREIGN KEY(pid) REFERENCES plList(pid)
);
INSERT INTO `clockimg` (`cid`, `pid`, `cimgUrl`) VALUES
(1, 1, '/upload/15645420943996054.png'),
(2, 1, '/upload/15645420944482615.png');
#视频
CREATE TABLE clockVideo(
    cid INT PRIMARY KEY AUTO_INCREMENT,
    pid INT,
    cvideoUrl VARCHAR(64),
    FOREIGN KEY(pid) REFERENCES plList(pid)
);
#音频
CREATE TABLE clockAudio(
    cid INT PRIMARY KEY AUTO_INCREMENT,
    pid INT,
    caudioUrl VARCHAR(64),
    duration INT,
    FOREIGN KEY(pid) REFERENCES plList(pid)
);
#获赞列表
CREATE TABLE fabList(
    fid INT PRIMARY KEY AUTO_INCREMENT,
    pid INT,
    uid INT,
    ftime BIGINT,
    FOREIGN KEY(pid) REFERENCES plList(pid),
    FOREIGN KEY(uid) REFERENCES userList(uid)
);
#回复列表
CREATE TABLE replyList(
    rid INT PRIMARY KEY AUTO_INCREMENT,
    pid INT,
    uid INT,
    rtime BIGINT,
    ptext VARCHAR(1024),
    pimgUrl VARCHAR(256),
    pvideoUrl VARCHAR(64),
    paudioUrl  VARCHAR(64),
    FOREIGN KEY(pid) REFERENCES plList(pid),
    FOREIGN KEY(uid) REFERENCES userList(uid)
);
