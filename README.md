# Cubbit training repository 

Hi **${name}**, and welcome to the **Cubbit** training repository's level 4 (**last level**).

# Setting up the project
As usual:
- `npm install` or `yarn`
- `npm start` to start electron (it will fail until you implement the exercise correctly)

# Goals of the level
This **final level** of the training repository will introduce **[Electron](https://electron.atom.io)** and how it can be used to implement a cross-platform desktop application in Node.js, HTML5 and CSS3.

The application is really simple. It consists in a basic file transfer utility. When a user starts the electron app he faces this kind of user interface:

![screenshot1](screenshot1.png)

The displayed form allows the user to select a file and transfer it to another user specifying the address (ip and port) in the inputs.

Basically the application, on the startup, creates a **TCP server** (why TCP instead of UDP?) and listen on a random port (the port is then displayed on the ui). In this way, opening two clients on two different computers (or on the same, for testing purposes), they can communicate with each other and transfer data.

![screenshot2](screenshot2.png)

## The App class
The only class you will need to implement is the `App` class.
It exposes only a `listen` method which starts the TCP server (use the Node.js's `net` [package](https://nodejs.org/api/net.html)). A good place for getting started with Electron could be its [webpage](https://electron.atom.io/docs/) and its [quick start](https://electron.atom.io/docs/tutorial/quick-start/) documentation.
  
## The frontend (HTML + CSS + JS)
On the frontend side we have used the [bulma](https://bulma.io) framework. Bulma is a *flexbox* based css framework (like the more famous [bootstrap](http://getbootstrap.com) by twitter) which is really nice and simple enough to create webpages rapidly. 

Please note that if you are not familiar with HTML5 or if you don't like programming web interfaces with CSS, we can provide you the already implemented HTML page. Just ask on slack.

*Don't worry if the ui doesn't look exactly the same of the one in the screenshot, just make it work :P*.

#### Notes: 
- In this level **no unit tests** will be provided. You are ninja enough. Good luck!
- For simplicity, we won't use Typescript on the frontend side on this exercise. Just stick with **normal ES6** for now.
- On the frontend side **avoid** using frameworks such as **jQuery** to perform DOM operations. Try to just use the javascript standard methods (e.g. `document.getElementById()`, `document.querySelector()`).

## Info and help
For info about this repository please write on the #help channel on slack or to:

- [marco.moschettini@cubbit.net](mailto:marco.moschettini@cubbit.net)
- [alessio.paccoia@cubbit.net](alessio.paccoia@cubbit.net)
