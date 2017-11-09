var database = require('../index');


database.selectDatabase('--', (err, results) => {
    if (err) {
        console.log("test1 : Error Occured")
    };
    if (results == 0) {
        console.log("test2 : Invalid User")
    };
    if (results.length != 0) {
        console.log("test3 : Valid User")
    };
    if (results[0].ID == '--') {
        console.log("test4 : correct username");
    }
})