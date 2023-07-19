// users account data collection REST Service
// Veasna Bun

//import external module Express
var express = require("express");
var app = express();
// internal module from node.js
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
app.use(express.json());

// CORS policy: Response to preflight request doesn't pass access control check:
// to fix allow access: 
// allow access from all domain 
// allow access to the all following method
// allow to access the  all hearder
app.use(function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', '*');
        res.header('Access-Control-Allow-Headers', '*');
        next();
});
// allow access to all route 
app.options('*', function (req, res) {
        res.sendStatus(200);
});

// Load the existing user data from the JSON file
var userData = JSON.parse(fs.readFileSync('users.json'));
// keeping track of number of users in json data
var userCount = 0;
if (userData.users === undefined || userData.users === null) {
        userCount = 0;
} else { userCount = userData.users.length; };
// Map to store tokens
const tokensData = {};

// define a route using a callback funtion what will be invoked
// when the user makes a HTTP request to the root of the folder(URL)
// http:(some_ip_address):3000/
// display some information about the REST Service
app.get('/', function (req, res) {
        res.status(200);
        res.send("Connection Live: API Users-Account-Services uses Node.js to Collect User Data");
});

// helper functions
// signup helper function for login validation
function isUsernameTaken(username) {
        return userData.users.some(user => user.username === username);
}
function isEmailTaken(email) {
        return userData.users.some(user => user.email === email);
}

// helper functions
// Middleware to protect routes use mainly for login route 
var protectRoute = (req, res, next) => {
        var token = req.headers.authorization;
        // Verify the token
        var username = tokensData[token];
        if (username) {
                // Store the username on the request object
                req.username = username;
                // Call the next middleware function
                next();
        } else {
                res.status(401).send('Invalid token');
        }
};

// signup route is use to create users
// check if email and/or password is already in data
app.post('/signup', (req, res) => {
        const { username, email, password } = req.body;
        // Do validation and create user object
        if (!(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))) {
                return res.status(400).send({ error: "Email is not valid" });
        } else if (!((/^[a-zA-Z0-9]{5,}$/.test(username)))) {
                return res.status(400).send({ error: "Username: must not contain space or symbol. At least 5 character long" });
        }
        else if (!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{5,}$/.test(password))) {
                return res.status(400).send({
                        error: "Password must have: one lowercase, one upper case, and at least one digit. At least 5 character long."
                });
        }
        else {
                // Check if the username or email is already being used
                if (userCount > 0) {
                        if (isUsernameTaken(username) || isEmailTaken(email)) {
                                return res.status(409).json({ error: 'Username or Email is already taken' });
                        }
                }
                // add new user to the users.json with default
                const user = {
                        username,
                        email,
                        password,
                        userIcon: ""
                };

                // check to see the number of users if its 0 we must add the default
                // if greater we must add to the array. 
                if (userCount > 0) { userData.users.push(user); userCount = userCount + 1; }
                else {
                        userData = {
                                "users": [{
                                        username,
                                        email,
                                        password,
                                        userIcon: ""
                                }]
                        };
                        userCount = 1;
                };
                // Save the updated user data back to the JSON file
                fs.writeFile('users.json', JSON.stringify(userData, null, 2), err => {
                        if (err) { console.log(err) }
                        else {
                                res.json("Success: signup for an Account");
                        };
                });
        };
});

// POST/login: is used to authenticate a user with a username and password. 
// The server verifies the user's credentials and returns an access token if the authentication is successful.
app.post('/login', (req, res) => {
        const { username, password } = req.body;
        // Find the user with the given username
        const user = userData.users.find(user => user.username === username); // var exist = user ? user.username : false;

        // If the user doesn't exist or the password is incorrect, return an error
        if (!user) {
                return res.status(401).json({ error: "Fail: username does not exist" });
        }
        else if (user.password !== password) {
                return res.status(401).json({ error: "Fail: incorrect password" });
        } else if (password === undefined || user === undefined) {
                return res.status(401).json({ error: "Fail: undefined, please enter a username and password" });
        } else {
                // If the user exists and the password is correct, generate a token and store it
                const token = crypto.randomBytes(32).toString('hex');
                tokensData[token] = username;
                // Send the token back to the client
                res.set('Authorization', token).status(200).json({ message: token });
        }

});

// GET /user 
// route get the user data and return an json. 
app.use(protectRoute);
app.get('/user', function (req, res) {
        var user = req.username;
        var userFound = false;
        userData.users.forEach(findUsers => {
                if (findUsers.username === user) {
                        res.status(200).send(findUsers);
                        userFound = true;
                }
        });
        if (!userFound) {
                res.status(201).send('not a user');
        }
});

// PUT /user/: username: 
// take in a new username tp update the username
app.put('/user/:username', (req, res) => {
        var user = req.username;
        var newUsername = req.params.username;
        if (isUsernameTaken(newUsername)) {
                return res.status(401).json({ error: "Fail: username taken" });
        } else if (!((/^[a-zA-Z0-9]{5,}$/.test(newUsername))) || undefined) {
                return res.status(400).json({ error: "Username: must not contain space or symbol. At least 5 character long" });
        } else {
                userData.users.forEach(findUsers => {
                        if (findUsers.username === user) {
                                findUsers.username = newUsername;
                                // update each username token with new username
                                for (let token in tokensData) {
                                        if (tokensData[token] === user) {
                                                tokensData[token] = newUsername;
                                        }
                                }
                                return res.status(200).send("Success: Please sign out to save your changes.");
                        }
                });
        }

});

// PUT /user/: username/: password' 
// user must first verify there username and after this will update the password
app.put('/user/:username/:password', (req, res) => {
        var user = req.username;
        const { username, password } = req.params;
        if (!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{5,}$/.test(password))) {
                return res.status(400).send({
                        error: "Password must have: one lowercase, one upper case, and at least one digit. At least 5 character long."
                });
        }
        else {
                if (user !== username) {
                        return res.status(201).send('not a user');
                }
                // Update the user password
                userData.users.forEach(findUsers => {
                        if (findUsers.username === username && username === user) {
                                findUsers.password = password;
                                return res.status(200).send("Success: Please sign out to save your changes.");
                        }
                });
        };
});

// PUT /user/: username/: password /:email' 
// need current username and password then will update the email
app.put('/user/:username/:password/:email', (req, res) => {
        var user = req.username;
        const { username, password, email } = req.params;
        console.log(username);
        console.log(password);
        console.log(email);
        if (!(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))) {
                return res.status(400).send({ error: "Email is not valid" });
        } else if (isEmailTaken(email)) {
                return res.status(401).json({ error: "Fail: email are used by another user" });

        }
        else {
                userData.users.forEach(findUsers => {
                        if (findUsers.username === username && username === user) {
                                if (findUsers.password = password) {
                                        findUsers.email = email;
                                        return res.status(200).send("Success: Please sign out to save your changes.");
                                }
                        }
                });

        };

});

// DELETE/user: This route is used to delete the user's login information and account.
app.delete('/user', (req, res) => {
        // Read the JSON file
        var user = req.username;
        for (let i = 0; i < userData.users.length; i++) {
                if (userData.users[i].username === user) {
                        userData.users.splice(i, 1);
                        break;
                }
        }
        fs.writeFile('users.json', JSON.stringify(userData, null, 2), function (err) {
                if (err) {
                        res.status(404).json({ err });
                } else {
                        // Return a success response
                        // delete the active token relativate to username
                        for (let token in tokensData) {
                                if (tokensData[token] === user) {
                                        delete tokensData[token];
                                }
                        }
                        res.status(200).json({ message: 'User deleted' });
                };
        });
});

// DELETE/signout: remove any active token relate to the user
app.delete('/signout', (req, res) => {
        // Read the JSON file
        var user = req.username;
        // delete the active token relativate to username
        for (let token in tokensData) {
                if (tokensData[token] === user) {
                        delete tokensData[token];
                }
        }
        //update the json file to the current log
        fs.writeFile('users.json', JSON.stringify(userData, null, 2), function (err) {
                if (err) {
                        res.status(404).json({ err });
                } else {
                        // Return a success response
                        res.status(200).json({ message: 'You have successful signout' });
                };
        });
});

// POST /userIcon: upload userIcon
app.post('/userIcon', (req, res) => {
        var user = req.username;
        const { image, filename } = req.body;
        // Convert the base64 image data to a buffer
        const imageBuffer = Buffer.from(image, 'base64');
        // Save the buffer to the server's file system
        // set to only png file so they overwrite each other 
        // when user upload a new image
        fs.writeFileSync("userIcon/" + user + ".png", imageBuffer, { flag: 'w' }, (err) => {
                if (err) {
                        res.status(500).send('Error saving file');
                } else {
                        userData.users.forEach(findUsers => {
                                if (findUsers.username === user) {
                                        //update the userIcon title   
                                        findUsers.userIcon = user + ".png";
                                }
                        });
                        //update the json file to the current log
                        fs.writeFile('users.json', JSON.stringify(userData, null, 2), function (err) {
                                if (err) {
                                        res.status(404).json({ err });
                                } else {
                                        
                                }
                        });
                }
        });
});

// GET /userIcon: get the userIcon image
app.get('/userIcon', function (req, res) {
        var user = req.username;
        var fileName = "";
        for (let i = 0; i < userData.users.length; i++) {
                if (userData.users[i].username === user) {
                        fileName = userData.users[i].userIcon;
                        break;
                }
        }
        var filePath = path.join(__dirname, 'userIcon', fileName);
        fs.access(filePath, fs.constants.F_OK, (err) => {
                if (err) {
                        // If the file does not exist, send a default image
                        filePath = path.join(__dirname, 'userIcon', 'default.png');
                }
        });
        // Read the image file from the server
        var imagePath = filePath;
        var imageData = fs.readFileSync(imagePath);
        var base64Image = imageData.toString('base64');
        res.json({ image: base64Image });
});

// enable a port to listen to incoming to HTTP requests
app.listen(3000, function () {
        console.log("API version 1.0.0 is running on port 3000");
});
