Drop table users
CREATE TABLE users (
userId   NVARCHAR(128) PRIMARY KEY,
userPassword   NVARCHAR(128) NOT NULL,
userFirstName NVARCHAR(128) NOT NULL,
userLastName NVARCHAR(128) NOT NULL,
userEmail NVARCHAR(128) NOT NULL,
userSkills   NVARCHAR(256) ,
userMajor   NVARCHAR(256) ,
userPhone   BIGINT ,
studyYear   INT
)

Drop table usersLocation
CREATE TABLE usersLocation (
userId   NVARCHAR(128) PRIMARY KEY,
latitude FLOAT,
longitude FLOAT,
userActive   INT
CONSTRAINT FK_usersLocation_userId FOREIGN KEY (userId) 
    REFERENCES users (userId)
)

Drop table usersStatus
CREATE TABLE usersStatus (
userId   NVARCHAR(128),
friendId   NVARCHAR(128),
userStatus NVARCHAR(128) NOT NULL
CONSTRAINT FK_usersStatus_userId FOREIGN KEY (userId) 
    REFERENCES users (userId),
CONSTRAINT FK_usersStatus_friendId FOREIGN KEY (friendId) 
    REFERENCES users (userId)
)
alter table usersStatus add constraint pk_userId_friendId primary key (userId, friendId);

Drop table usersMailBox
create table usersMailBox (
   recv_id 	NVARCHAR(20) not null default '',
   send_id	 NVARCHAR(20) not null default '',
   date_sent  dateTime not null default current_timestamp,
   message_content NVARCHAR(256),
   primary key(recv_id,send_id, date_sent) 
);