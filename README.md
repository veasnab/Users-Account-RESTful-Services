# User Account Interface RESTful Services
-- Author: Veasna Bun
-- Clone the repository from GitHub: `git clone https://github.com/veasnab/User-Account-Interface-RESTful-Services.git`
-- Project Repository Web Address: https://github.com/veasnab/User-Account-Interface-RESTful-Services/tree/main

## Project Description:
This project is a client-server web application that demonstrates the use of RESTful services through a custom user-account-interface-service API.
The application was developed using HTML, JavaScript, CSS, Bootstrap, Node.js, and jQuery. 
The application allows users to create an account, log in, and perform various actions such as updating their profile user icon, and changing and updating profile setting. 
The application also features real-time updates using websockets, allowing users to see changes to the application in real-time. The purpose of this project is to showcase the use of RESTful services in a real-world application and to demonstrate the use of websockets for real-time updates.
	
## Instructions for Running Frontend and Backend (Locally on Window Visual Studio): 
1. Download the folder: "veasanb-a3" or clone it from github.
2. In Visual Studio, navigate to the "File" tab (uppder right corner), within the tab click on "Add Folder to Workspace". 
Locate the folder containing the files you just downloaded: Folder "veasanb-a3"; select the folder and then click the "add" button in the UI. 
Go to the EXPLORER section on the left side of the screen in Visual studio or (short-cut: Ctrl+Shift+E). 
In the EXPLORER UI under WORKSPACE you should now see the follow:
	- files name: A3.pdf, app.js, index.html, package-lock.json, package.json, script.css, styles.css, users.json
	- folder name: html-img, node_modules, userIcon   
3. Within Visual Studio, navigate to the "Terminal" tab, with this tab click on "New Terminal" or (short-cut: Ctrl+Shift+`). 
In the terminal UI, ensure that the directory is within the working workspace. 
For example: PS C:\Users\Veasna Bun\OneDrive\Desktop\veasnab-a3>, 
where "veasnab-a3" indicated that I am within directory where the files in step 2 is located.
4. (Note: Make sure you have the necessary software installed: Node.js, Express, and any other dependencies required to run Node.js Appications).
In the "Terminal" UI, write the follow command in qoute: "node app.js". This will start the server locally on your computer.
To verify that your Front-end Node.js application server is live, go to one of the follow web address from your favorite brownser: 
http://localhost:3000/ or http://127.0.0.1:3000/
The browser should display something along the line: "Connection Live: API Users-Account-Services uses Node.js to Collect User Data".
5. If you do not have the "Live-Server" extensions install. You can find and download the extensions in Visual Studio. 
Navigate to the "Extensions" section in Visual Studio (short-cut: Ctrl+Shift+X) and search up "Live Server". I am using Live Server by Ritwick Dey. 
Install the extensions. You might have to reset Visual Studio and complete step #3 again.
6. Under the "WORKSPACE" UI located the "index.html" file. Open the file in Visual Studio by click on the file. 
A index.html tab center of Visual Studio should automatically open up with the files details. 
In the files that just open up "right-click" mouse within the file and click on "Open with Live Server" or (shortcut: Alt+L (then) Alt+O).   
A browser window should automatically open up with the contain of the index.html.
7. Within the content of the index.html, in the center and the bottom. 
The text should display: Connection Live: API Users-Account-Services uses Node.js to Collect User Data. 
If it display anything else there might be a connection fault with the server.
8. In the Login/Create an Account: 
You may use my default login to test out the webpage out the features:
Username: veasna Password: Test1 or You can Create an Account and customize your own profile setting.
9. Done.


	
	 
	
	
	 

