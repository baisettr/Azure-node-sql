var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var bodyParser = require('body-parser');
var express = require('express');
var async = require('async');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function (request, response) {
    response.render('pages/index');
});

// Create connection to database
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
var config =
    {
        userName: '', // update me
        password: '', // update me
        server: '', // update me
        options:
            {
                database: 'osu' //update 
                , encrypt: true
            }
    }

var connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
app.post("/valUser", function (req, res) {
    //console.log(req.body.userId);

    res.contentType('application/json');
    selectDatabase(req.body.userId, (err, results) => {
        if (err) {
            console.log(err);
            var user = { "error": "Internal Error. \n       Please Try Again" };
            var peopleJSON = JSON.stringify(user);
            res.send(user);
        }
        //console.log(results + "here");
        //results.forEach(function (result) {

        //console.log(result);
        //});
        if (results == 0) {
            var user = { "error": "Invalid Credentials. \n       Please Try Again" };
            var peopleJSON = JSON.stringify(user);
            res.send(user);
        }
        else {
            if (req.body.password == results[1]["value"]) {
                var user = { "success": results };
            }
            else {
                var user = { "error": "Wrong Password. \n       Please Try Again" };
            }
            var peopleJSON = JSON.stringify(user);

            res.send(peopleJSON);
        }
        //res.contentType('application/json');
        //res.send(results);

        /* if (results.length != 0) {
             var user = { "success": "You logged in. " + req.body.userId }
         }
         else {
             var user = { "error": "Invalid Credentials. \n       Please Try Again" }
         }
         console.log(user);
         console.log(results);*/
        //console.log(user);

    });
});

app.post("/regUser", function (req, res) {
    res.contentType('application/json');
    if (!req.body.userSkills) {
        //console.log("2");
        req.body.userSkills = null;
    }
    if (!req.body.userMajor) {
        req.body.userMajor = null;
    }
    if (!req.body.userPhone) {
        req.body.userPhone = null;
    }
    if (!req.body.studyYear) {
        req.body.studyYear = null;
    }

    insertDatabase(req.body.userId, req.body.userPassword, req.body.userFirstName, req.body.userLastName, req.body.userEmail, req.body.userSkills, req.body.userMajor, req.body.userPhone, req.body.studyYear, (err, results) => {
        if (err) {
            var user = { "error": "Internal Error. \n       Please Try Again" };
            var peopleJSON = JSON.stringify(user);
            res.send(user);
        }


        if (results == 1) {
            var user = { "success": "You are registered. \n         Please login" }
        }
        else {
            var user = { "error": "Try with new UserName" }
        }
        //console.log(user);
        //console.log(results);

        var peopleJSON = JSON.stringify(user);

        res.send(peopleJSON);
    });
});


app.post("/updateUser", function (req, res) {
    res.contentType('application/json');
    if (!req.body.userSkills) {
        //console.log("2");
        req.body.userSkills = null;
    }
    if (!req.body.userMajor) {
        req.body.userMajor = null;
    }
    if (!req.body.userPhone) {
        req.body.userPhone = null;
    }
    if (!req.body.studyYear) {
        req.body.studyYear = null;
    }

    updateDatabase(req.body.userId, req.body.userPassword, req.body.userFirstName, req.body.userLastName, req.body.userEmail, req.body.userSkills, req.body.userMajor, req.body.userPhone, req.body.studyYear, (err, results) => {
        if (err) {
            var user = { "error": "Internal Error. \n       Please Try Again" };
            var peopleJSON = JSON.stringify(user);
            res.send(user);
        }


        if (results == 1) {
            var user = { "success": "Details Updated. \n         Please login" }
        }
        else {
            var user = { "error": "Incorrect UserName" }
        }
        //console.log(user);
        //console.log(results);

        var peopleJSON = JSON.stringify(user);

        res.send(peopleJSON);
    });
});

//  add user location in userslocation Table
/*app.post("/addUserLocation", function (req, res) {
    res.contentType('application/json');
    insertUserLocation(req.body.userId, req.body.latitude, req.body.longitude, req.body.userActive, req.body.userStatus, (err, results) => {
        if (err) {
            var user = { "error": "Internal Error. \n       Please Try Again" };
            var peopleJSON = JSON.stringify(user);
            res.send(user);
        }
        else if (results == 1) {
            var user = { "success": "Location Inserted" }
        }
        else {
            var user = { "error": "Location not Inserted" }
        }
        var peopleJSON = JSON.stringify(user);
        res.send(peopleJSON);
    });
});*/


app.post("/updateUserLocation", function (req, res) {
    console.log(req.body);
    res.contentType('application/json');
    checkUserIdLocation(req.body.userId, (err, valid) => {
        if (err) { console.log(err) };
        if (valid == 0) {
            insertUserLocation(req.body.userId, req.body.latitude, req.body.longitude, req.body.userActive, (err, results) => {
                if (err) {
                    var user = { "error": "Internal Error. \n       Please Try Again" };
                    var peopleJSON = JSON.stringify(user);
                    res.send(user);
                }
                else if (results == 1) {
                    var user = { "success": "Location Inserted" }
                }
                else {
                    var user = { "error": "Location not Inserted" }
                }
                var peopleJSON = JSON.stringify(user);
                res.send(peopleJSON);
            });
        }
        else {
            updateUserLocation(req.body.userId, req.body.latitude, req.body.longitude, req.body.userActive, (err, results) => {
                console.log(err + "___" + results);
                if (err) {
                    var user = { "error": "Internal Error. \n       Please Try Again" };
                    var peopleJSON = JSON.stringify(user);
                    res.send(user);
                }
                else if (results == 1) {
                    var user = { "success": "Location Updated" }
                }
                else {
                    var user = { "error": "Location not Updated" }
                }
                var peopleJSON = JSON.stringify(user);
                res.send(peopleJSON);
            });
        }
    });
});


app.post("/listLocations", function (req, res) {

    selectLocations(req.body.userId, (err, results) => {

        if (err) {
            console.log(err);
            var user = { "error": "Internal Error. \n       Please Try Again" };
            var peopleJSON = JSON.stringify(user);
            //console.log(peopleJSON);
            res.send(peopleJSON);
        }
        if (results == 0) {
            var user = { "error": "No Users Found. \n       Please Try Again" };
            var peopleJSON = JSON.stringify(user);
            //console.log(peopleJSON);
            res.send(peopleJSON);
        }
        else {
            if (req.body.userId) {
                res.contentType('application/json');
                return res.send(user = { "success": results });
            }
            else {
                var user = { "error": "Not a valid user. \n       Please Try Again" };
            }
            var peopleJSON = JSON.stringify(user);

            //res.send(peopleJSON);
        }
    });
});


app.post("/getUserDetails", function (req, res) {
    //console.log(req.body.userId);

    res.contentType('application/json');
    selectDatabase(req.body.userId, (err, results) => {
        if (err) {
            console.log(err);
            var user = { "error": "Internal Error. \n       Please Try Again" };
            var peopleJSON = JSON.stringify(user);
            res.send(user);
        }
        if (results == 0) {
            var user = { "error": "Invalid Credentials. \n       Please Try Again" };
            var peopleJSON = JSON.stringify(user);
            res.send(user);
        }
        else {
            var user = { "success1": results };
            var peopleJSON = JSON.stringify(user);

            res.send(peopleJSON);
        }
    });
});


app.post("/requestUser", function (req, res) {
    console.log(req.body.userId + "__" + req.body.user);

    res.contentType('application/json');
    insertUserStatus(req.body.userId, req.body.user, 'red', (err, results) => {
        console.log(err + "___" + results);
        if (err) {
            var user = { "error": "Internal Error. \n       Please Try Again" };
            var peopleJSON = JSON.stringify(user);
            res.send(user);
        }
        else if (results == 1) {
            insertUserStatus(req.body.user, req.body.userId, 'yellow', (err, results) => {
                console.log(err + "___" + results);
                if (err) {
                    var user = { "error": "Internal Error. \n       Please Try Again" };
                    var peopleJSON = JSON.stringify(user);
                    res.send(user);
                }
                else if (results == 1) {
                    var user = { "success": "Requested" }
                    var peopleJSON = JSON.stringify(user);
                    res.send(peopleJSON);
                }
                else {
                    var user = { "error": "Request Not Performed" }
                    var peopleJSON = JSON.stringify(user);
                    res.send(peopleJSON);
                }
            });
        }
        else {
            var user = { "error": "Request Not Performed" }
            var peopleJSON = JSON.stringify(user);
            res.send(peopleJSON);
        }
    });
});


app.post("/acceptUser", function (req, res) {
    //console.log(req.body.userId);

    res.contentType('application/json');
    updateUserStatus(req.body.userId, req.body.user, 'orange', (err, results) => {
        console.log(err + "___" + results);
        if (err) {
            var user = { "error": "Internal Error. \n       Please Try Again" };
            var peopleJSON = JSON.stringify(user);
            res.send(user);
        }
        else if (results == 1) {
            updateUserStatus(req.body.user, req.body.userId, 'orange', (err, results) => {
                console.log(err + "___" + results);
                if (err) {
                    var user = { "error": "Internal Error. \n       Please Try Again" };
                    var peopleJSON = JSON.stringify(user);
                    res.send(user);
                }
                else if (results == 1) {
                    var user = { "success": "Accepted" }
                    var peopleJSON = JSON.stringify(user);
                    res.send(peopleJSON);
                }
                else {
                    var user = { "error": "Accept Not Performed" }
                    var peopleJSON = JSON.stringify(user);
                    res.send(peopleJSON);
                }
            });
        }
        else {
            var user = { "error": "Accept Not Performed" }
            var peopleJSON = JSON.stringify(user);
            res.send(peopleJSON);
        }
    });
});



app.get('/val', function (req, res) {

    //connection.on('connect', function (err) {
    //  if (err) {
    //    console.log(err)
    //}
    //else {
    //queryDatabase()
    console.log("in");
    //selectDatabase();
    res.send("Done")
    //insertDatabase()
    //         res.send("Done");
    //}
    //});

});


function queryDatabase(callback) {
    //var connection = new Connection(config);
    console.log('Reading rows from the Table...');
    connection.on('connect', function (err) {
        if (err) {
            console.log(err)
        }
    });
    // Read all rows from table
    request = new Request(
        "SELECT * FROM [users]",
        function (err, rowCount, rows) {
            console.log(rowCount + ' row(s) returned');
            process.exit();
        }
    );

    request.on('row', function (columns) {
        columns.forEach(function (column) {
            console.log("%s\t%s", column.metadata.colName, column.value);
        });
    });
    connection.execSql(request);
}

function selectDatabase(userId, callback) {
    //var connection = new Connection(config);
    connection.on('connect', function (err) {
        if (err) {
            callback(err)
        }
    });
    var TYPES = require('tedious').TYPES;

    var sql = 'select * from users where UserId = @name';
    var request = new Request(sql, function (err, rowCount, row) {
        if (err) {
            console.log(err);
            callback(err);
        };
        if (rowCount == 0) {
            callback(false, rowCount);
        };
        //process.exit();
    });

    request.addParameter('name', TYPES.VarChar, userId);
    //request.addParameter('id', TYPES.Int, 1);
    var array = [];
    request.on('row', function (columns) {
        //console.log(columns);
        columns.forEach(function (column) {
            var title1 = column.metadata.colName;
            var value1 = column.value;
            var user = {
                title: title1,
                value: value1
            }
            array.push(user);
            //console.log("%s\t%s", column.metadata.colName, column.value);
        });
        //console.log(array);
        //console.log("here1");
        callback(false, array);
    });

    connection.execSql(request);
}

//  validating the user in usersLocations Table.
function checkUserIdLocation(userId, callback) {
    connection.on('connect', function (err) {
        if (err) {
            callback(err)
        }
    });
    var TYPES = require('tedious').TYPES;

    var sql = 'select userId from usersLocation where userId = @name';
    var request = new Request(sql, function (err, rowCount, row) {
        callback(err, rowCount);
        //process.exit();
    });

    request.addParameter('name', TYPES.VarChar, userId);
    connection.execSql(request);
}

//  insert a new user to users table
function insertDatabase(userId, userPassword, userFirstName, userLastName, userEmail, userSkills, userMajor, userPhone, studyYear, callback) {
    //var connection = new Connection(config);
    connection.on('connect', function (err) {
        if (err) {
            callback(err);
        }
    });
    var TYPES = require('tedious').TYPES;

    var sql = 'insert into users(userId,userPassword,userFirstName,userLastName,userEmail,userSkills,userMajor,userPhone,studyYear) values(@id,@pwd,@fname,@lname,@email,@skill,@major,@phone,@year)';
    var request = new Request(sql, function (err, rowCount, row) {
        //console.log(err);
        callback(false, rowCount);
        //process.exit();
    });
    //request.addParameter('id', TYPES.Int, 2);
    //console.log("1" + userSkills);
    request.addParameter('id', TYPES.VarChar, userId);
    request.addParameter('pwd', TYPES.VarChar, userPassword);
    request.addParameter('fname', TYPES.VarChar, userFirstName);
    request.addParameter('lname', TYPES.VarChar, userLastName);
    request.addParameter('email', TYPES.VarChar, userEmail);
    request.addParameter('skill', TYPES.VarChar, userSkills);
    request.addParameter('major', TYPES.VarChar, userMajor);
    request.addParameter('phone', TYPES.BigInt, userPhone);
    request.addParameter('year', TYPES.Int, studyYear);

    connection.execSql(request);
}

function updateDatabase(userId, userPassword, userFirstName, userLastName, userEmail, userSkills, userMajor, userPhone, studyYear, callback) {
    //var connection = new Connection(config);
    connection.on('connect', function (err) {
        if (err) {
            callback(err);
        }
    });
    var TYPES = require('tedious').TYPES;

    var sql = 'update users set userPassword = @pwd,userFirstName=@fname,userLastName=@lname,userEmail=@email,userSkills=@skill,userMajor=@major,userPhone=@phone,studyYear=@year where userId=@id';
    var request = new Request(sql, function (err, rowCount, row) {
        //console.log(err);
        callback(false, rowCount);
        //process.exit();
    });
    //request.addParameter('id', TYPES.Int, 2);
    //console.log("1" + userSkills);
    request.addParameter('id', TYPES.VarChar, userId);
    request.addParameter('pwd', TYPES.VarChar, userPassword);
    request.addParameter('fname', TYPES.VarChar, userFirstName);
    request.addParameter('lname', TYPES.VarChar, userLastName);
    request.addParameter('email', TYPES.VarChar, userEmail);
    request.addParameter('skill', TYPES.VarChar, userSkills);
    request.addParameter('major', TYPES.VarChar, userMajor);
    request.addParameter('phone', TYPES.BigInt, userPhone);
    request.addParameter('year', TYPES.Int, studyYear);

    connection.execSql(request);
}

function insertUserLocation(userId, latitude, longitude, userActive, callback) {
    //var connection = new Connection(config);
    connection.on('connect', function (err) {
        if (err) {
            callback(err);
        }
    });
    var TYPES = require('tedious').TYPES;

    var sql = 'insert into usersLocation(userId,latitude,longitude,userActive) values(@id,@lat,@lon,@act)';
    var request = new Request(sql, function (err, rowCount, row) {
        //console.log(err);
        callback(false, rowCount);
        //process.exit();
    });
    //request.addParameter('id', TYPES.Int, 2);
    //console.log("1" + userSkills);
    request.addParameter('id', TYPES.VarChar, userId);
    request.addParameter('lat', TYPES.Float, latitude);
    request.addParameter('lon', TYPES.Float, longitude);
    request.addParameter('act', TYPES.Int, userActive);
    //request.addParameter('stat', TYPES.VarChar, userStatus);

    connection.execSql(request);
}

function updateUserLocation(userId, latitude, longitude, userActive, callback) {
    //var connection = new Connection(config);
    connection.on('connect', function (err) {
        if (err) {
            callback(err);
        }
    });
    var TYPES = require('tedious').TYPES;

    var sql = 'update usersLocation set latitude=@lat,longitude=@lon,userActive=@act where userId=@id';
    var request = new Request(sql, function (err, rowCount, row) {
        console.log(err);
        callback(err, rowCount);
        //process.exit();
    });
    //request.addParameter('id', TYPES.Int, 2);
    //console.log("1" + userSkills);
    request.addParameter('id', TYPES.VarChar, userId);
    request.addParameter('lat', TYPES.Float, latitude);
    request.addParameter('lon', TYPES.Float, longitude);
    request.addParameter('act', TYPES.Int, userActive);
    //request.addParameter('stat', TYPES.VarChar, userStatus);

    connection.execSql(request);
}

function insertUserStatus(userId, user, status, callback) {
    //var connection = new Connection(config);
    connection.on('connect', function (err) {
        if (err) {
            callback(err);
        }
    });
    var TYPES = require('tedious').TYPES;

    var sql = 'insert into usersStatus(userId,friendId,userStatus) values(@id,@id1,@stat)';
    var request = new Request(sql, function (err, rowCount, row) {
        //console.log(err);
        callback(err, rowCount);
        //process.exit();
    });
    //request.addParameter('id', TYPES.Int, 2);
    //console.log("1" + userSkills);
    request.addParameter('id', TYPES.VarChar, user);
    request.addParameter('id1', TYPES.VarChar, userId);
    request.addParameter('stat', TYPES.VarChar, status);
    //request.addParameter('stat', TYPES.VarChar, userStatus);

    connection.execSql(request);
}

function updateUserStatus(userId, user, status, callback) {
    //var connection = new Connection(config);
    connection.on('connect', function (err) {
        if (err) {
            callback(err);
        }
    });
    var TYPES = require('tedious').TYPES;

    var sql = 'update usersStatus set userStatus=@stat where userId=@id and friendId=@id1';
    var request = new Request(sql, function (err, rowCount, row) {
        console.log(err);
        callback(err, rowCount);
        //process.exit();
    });
    //request.addParameter('id', TYPES.Int, 2);
    //console.log("1" + userSkills);
    request.addParameter('id', TYPES.VarChar, user);
    request.addParameter('id1', TYPES.VarChar, userId);
    request.addParameter('stat', TYPES.VarChar, status);

    connection.execSql(request);
}


//  test
app.get('/check', function (req, res) {
    selectLocations('rk1', (err, result) => {
        console.log(result);
        res.send(result);
    })
})

//var rowCnt = 0;

function selectLocations(userId, callback) {
    //var connection = new Connection(config);
    connection.on('connect', function (err) {
        if (err) {
            callback(err)
        }
    });
    var TYPES = require('tedious').TYPES;

    var sql = 'select ul.userId,ul.latitude,ul.longitude,ul.userActive,ISNULL((select userStatus from usersStatus where userId=@id and friendId=ul.userId),@status) as userStatus from usersLocation ul where ul.userId !=@id';
    var rowCnt = 0;
    var array = [];
    var request = new Request(sql, function (err, rowCount, row) {
        if (err) {
            console.log(err);
            callback(err);
        };
        if (rowCount == 0) {
            callback(false, rowCount);
        };
        rowCnt = rowCount;
        console.log(rowCnt + "__" + rowCount);
        if (array.length == rowCnt * 5) {
            callback(false, array);
        }
        //process.exit();
    });
    request.addParameter('id', TYPES.VarChar, userId);
    request.addParameter('status', TYPES.VarChar, 'green');
    //request.addParameter('name', TYPES.VarChar, userId);
    //request.addParameter('id', TYPES.Int, 1);

    request.on('row', function (columns) {
        //console.log(columns);
        /*var i = 0;
        columns.forEach(function (column) {
            var title1 = column.metadata.colName;
            var value1 = column.value;
            var user = {
                title: title1,
                value: value1
            }
            array.push(user);
            i = i + 1;
            //console.log("%s\t%s", column.metadata.colName, column.value);
        });
        //console.log(array);
        //console.log("here1");
        if (array.length == 10) {
            callback(false, array);
        }*/
        //var array = [];
        async.each(columns,
            function (column, next) {
                var title1 = column.metadata.colName;
                var value1 = column.value;
                var user = {
                    title: title1,
                    value: value1
                }
                array.push(user);
                //console.log("here 1");
                next();
            },
            function () {
                //console.log("here 2");
                returnArray(array);
            }
        );
    });
    function returnArray(arr) {
        //console.log("here 3");
        //console.log(arr.length);
        //console.log(rowCnt);
        if (arr.length == rowCnt) {
            callback(false, arr);
        }
    }
    connection.execSql(request);
}


app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});

module.exports = {
    selectDatabase: selectDatabase,
    queryDatabase: queryDatabase,
    insertDatabase: insertDatabase
}