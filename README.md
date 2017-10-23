# Cubbit training repository - Level 2

Hi **${name}**, and welcome to the **Cubbit** training repository's **level 2**. Please refer to the repository [main branch](https://github.com/cubbit/interns-training#structure-of-this-repository) to major information about this repositories and about the rules.

## Goals of the level
Main goal of this level is to write tests in order to validate code.

### Initialization
- Launch `npm install` to automatically install all the dependencies.
- Create a `test` folder under root.
- Create typescript tests in the folder you've just created.
- Launch `npm test` in your terminal.

### Unit testing
Now it's time to write some **useful** tests.

[`mocha`](https://mochajs.org/) is the test framework choosen in this tutorial.

[`chai`](http://chaijs.com/) is an assertion library that could be paired with any testing framework. It provides several interfaces that allow to write code in a more readable and expressive style. We usually use the **expect** one.

[`sinon`](http://sinonjs.org/) will be your best friend. *How could be useful*? Refer to [this guide](https://semaphoreci.com/community/tutorials/best-practices-for-spies-stubs-and-mocks-in-sinon-js).

[`supertest`](https://github.com/visionmedia/supertest) an high level abstraction for testing HTTP.

### Code to test
The code to test is located in the `src` folder.  
- **Calculator:** This class emulates a very basic calculator.
- **Webpage:** This class expose methods to get a webpage and save its content on a file.

## Info and help
For info about this repository please write on the #help channel on slack or to:

- [marco.moschettini@cubbit.net](mailto:marco.moschettini@cubbit.net)
- [alessio.paccoia@cubbit.net](mailto:alessio.paccoia@cubbit.net)
