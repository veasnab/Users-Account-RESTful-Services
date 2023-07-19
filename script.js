// Veasna Bun

// add event listener for the signup-button-model
// Get the <span> element that closes the modal
var span = $(".close")[0];
// When the user clicks on the signup-model button, open the signup-modal-content
$("#signup-model").click(function () {
    $(".signup-model-container").css("display", "block");
});
// When the user clicks on <span> (x), close the modal
$(span).click(function () {
    $(".signup-model-container").css("display", "none");
});
// When the user clicks anywhere outside of the modal, close it
$(window).click(function (event) {
    if (event.target == $(".signup-model-container")[0]) {
        $(".signup-model-container").css("display", "none");
    }
});


const localURL = "http://127.0.0.1:3000";

// route "/" (method:GET)
// setInterval call the server ever (set secound) sec to make sure its live
// it uses the / route to get the state of the browser
setInterval(function () {
    $(document).ready(function () {
        // Check if the browser is online
        $.ajax({
            url: `${localURL}/`,
            type: 'GET',
            success: function (response) {
                console.log(response);
                $(".created").html(response);
            },
            error: function (xhr, status, error) {
                $(".created").html("Error: connection lost");
                console.log('Request failed.  Returned status of ' + xhr);
            }
        });
    })
}, 10000); // execute every 10 second that passes

//route "/signup" (method:POST)
// when the sign-button located in the module is click
// get the value in the signup-model-container form
// send them to the route /signup to create an account
$('#signup-button').click(function (event) {
    event.preventDefault();
    const userData = {
        username: $("#signup-username").val(),
        email: $("#signup-email").val(),
        password: $("#signup-password").val()
    };
    $.ajax({
        url: `${localURL}/signup`,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(userData),
        dataType: 'json',
        success: function (response) {
            console.log('Success:', response);
            $("#alert-success-1").html(response);
            $("#alert-success-1").css("display", "block");
            // Fade out the success after 1 second
            setTimeout(function () {
                $("#alert-success-1").fadeOut();
            }, 1500);
        },
        error: function (xhr, status, error) {
            console.log('Error:', xhr);
            $("#alert-fail-1").html(xhr.responseJSON.error);
            $("#alert-fail-1").css("display", "block");
            // Fade out the success after 1 second
            setTimeout(function () {
                $("#alert-fail-1").fadeOut();
            }, 1500);
        }
    });
});

//route "/login" (method:POST)
// when the log-in button is click
// get the value in the login-container form
// send the to the route /login to get the token
// token need be used to access protect metho in the server.
// store token
var token = "";
$('#login-button').click(function (event) {
    event.preventDefault();
    const userData = {
        username: $("#login-username").val(),
        password: $("#login-password").val()
    };
    $.ajax({
        url: `${localURL}/login`,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(userData),
        dataType: 'json',
        success: function (response) {
            console.log(response);
            token = response.message;
            $("#alert-success").html("Success: login...");
            $("#alert-success").css("display", "block");
            // Fade out the success after 1 second
            setTimeout(function () {
                $("#alert-success").fadeOut();
                $(".web-title_login-container_signup-model-container").fadeOut();
                $(".user-nav_user-profile-container").fadeIn();
            }, 1000);
            getUserData();
        },
        error: function (xhr, status, error) {
            console.log('Error:', xhr);;
            $("#alert-fail").html(xhr.responseJSON.error);
            $("#alert-fail").css("display", "block");
            // Fade out the success after 2 second
            setTimeout(function () {
                $("#alert-fail").fadeOut();
            }, 1000);
        }
    });
});

// route "/user" (method:GET)
// when the user successful login
// a type 'GET' method will need to call to the route /user
// updating the webpage to the user data
// this will be call many time from other route to keep the web updated
// 'Authorization': token will need to be set to access user data
// have to keep track of username, email, and password to access profile setting. 
var trackusername = "";
var trackemail = "";
var trackpassword = "";
function getUserData() {
    $.ajax({
        url: `${localURL}/user`,
        type: 'GET',
        headers: {
            'Authorization': token
        },
        success: function (response) {
            console.log(response);
            //keep track of current infor
            trackusername = response.username;
            trackemail = response.email;
            trackpassword = response.password;
            $("#profile-username, #profile-username-1").html(response.username);
            $("#profile-email").html(response.email);
            $("#profile-password").html(response.password);
            getUserIcon();
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
    });
}

// route "/user/:username" (method:PUT)
// update username name button when click update the username in memory
// the user must successful login for data to be save in json
$('#update-username-button').on('click', function (event) {
    event.preventDefault();
    var newUsername = $('#update-username').val().trim();
    if (newUsername === "") {
        newUsername = null;
    }
    $.ajax({
        url: `${localURL}/user/${newUsername}`,
        type: 'PUT',
        data: newUsername,
        headers: {
            'Authorization': token
        },
        success: function (response) {
            getUserData();
            $("#alert-success-2").html(response);
            $("#alert-success-2").css("display", "block");
            setTimeout(function () {
                $("#alert-success-2").fadeOut();
            }, 2000);
            return false;
        },
        error: function (xhr, status, error) {
            $("#alert-fail-2").html(xhr.responseJSON.error);
            $("#alert-fail-2").css("display", "block");
            setTimeout(function () {
                $("#alert-fail-2").fadeOut();
            }, 2000)
        }
    });
});

// route "/user/:username/:password/:email" (method:PUT)
// update email button when click update the email in memory
// // the user must successful login for data to be save in json
$('#update-email-button').on('click', function (event) {
    event.preventDefault();
    var newEmail = $('#update-email').val();
    if (newEmail === "") {
        newEmail = null;
    }
    $.ajax({
        url: `${localURL}/user/${trackusername}/${trackpassword}/${newEmail}`,
        type: 'PUT',
        data: trackusername, trackpassword, newEmail,
        headers: {
            'Authorization': token
        },
        success: function (response) {
            getUserData();
            $("#alert-success-2").html(response);
            $("#alert-success-2").css("display", "block");
            setTimeout(function () {
                $("#alert-success-2").fadeOut();
            }, 2000);
            return false;
        },
        error: function (xhr, status, error) {
            $("#alert-fail-2").html(xhr.responseJSON.error);
            $("#alert-fail-2").css("display", "block");
            setTimeout(function () {
                $("#alert-fail-2").fadeOut();
            }, 2000)
        }
    });
});

// route "/user/:username/:password" (method:PUT)
// update passwprd button when click update the the password in memory
// the user must successful login for data to be save in json
$('#update-password-button').on('click', function (event) {
    event.preventDefault();
    var newPassword = $('#update-password').val().trim();
    if (newPassword === "") {
        newPassword = null;
    }
    $.ajax({
        url: `${localURL}/user/${trackusername}/${newPassword}`,
        type: 'PUT',
        data: trackusername, trackpassword,
        headers: {
            'Authorization': token
        },
        success: function (response) {
            getUserData();
            $("#alert-success-2").html(response);
            $("#alert-success-2").css("display", "block");
            setTimeout(function () {
                $("#alert-success-2").fadeOut();
            }, 2000);
            return false;
        },
        error: function (xhr, status, error) {
            $("#alert-fail-2").html(xhr.responseJSON.error);
            $("#alert-fail-2").css("display", "block");
            setTimeout(function () {
                $("#alert-fail-2").fadeOut();
            }, 2000)
        }
    });
});


// route "/user" (method:DELETE)
// this button will delete the current login user 
// will than be sent back to the home screen
// remove all token associate with this account
$('#delete-button').on('click', function (event) {
    $.ajax({
        url: `${localURL}/user`,
        type: 'DELETE',
        headers: {
            'Authorization': token
        },
        success: function (response) {
            console.log(response);
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
    });
});

// route "/signout" (method:DELETE)
// this button will signout the user and 
// update any changes they made to there account the current login user 
// will than be sent back to the home screen
// remove all token associate with this account
$('#signout-button').on('click', function () {
    $.ajax({
        url: `${localURL}/signout`,
        type: 'DELETE',
        headers: {
            'Authorization': token
        },
        success: function (response) {
            console.log(response);
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
    });
});


// warning button for userIcon
$('#upload-form').mouseover(function() {
    $("#alert-warning-2").html("Warning: uploading a new image will automatically sign out user and any changes that were made will be save to JSON.");
    $("#alert-warning-2").css("display", "block");
    // Fade out the success after 1 second
    setTimeout(function () {
        $("#alert-warning-2").fadeOut();
    }, 5000);
});


// route "/userIcon" (method:POST)
var base64String ="";
var fileName ="";
// Add an event listener to the input element for profile image
// when a new files is uploading extract the file to 64 byte
$('#image-input').on('change', function(event) {
    event.preventDefault();
    fileName = $(this).val().split('\\').pop();
    // Get the input element
    const imageInput = $('#image-input');
    // Get the selected file
    const file = imageInput[0].files[0];
    // Create a file reader
    const reader = new FileReader();
    // Set up the file reader to convert the file to a base64 string
    reader.readAsDataURL(file);
    reader.onload = function() {
        base64String = reader.result.split(',')[1];
    };
});
// when the profile image submit is click
// continue to route "userIcon"
// this will cause the user to automatically sign out
// any changes will be save to JSON on the server side
$('#upload-form').on( "submit", function(e) {
    e.preventDefault(); 
    const userData = {
        image: base64String,
        filename: fileName 
    }
    $.ajax({
        url: `${localURL}/userIcon`,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(userData),
        dataType: 'json',
        headers: {
            'Authorization': token
        },
        success: function (response) {
            console.log(response);
            return false; 
        },
        error: function (xhr, status, error) {
            console.log('Error:', xhr);;
        }
    });   
    
});

// route "/userIcon" (method:GET)
// this is call whe the route "/login is call"
// display server image.
function getUserIcon() {
    $.ajax({
        url: `${localURL}/userIcon`,
        type: 'GET',
        headers: {
            'Authorization': token
        },
        success: function (response) {
             // Get the image element by its ID
            const img = $('#profile-image');
            // Set the src attribute of the image element to the base64-encoded image data
            img.attr('src', `data:image/jpeg;base64,${response.image}`)
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
    });
}
