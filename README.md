# Cubbit training repository 

Hi **${name}**, and welcome to the **Cubbit** training repository's level 1.

## Goals of the level
Main goal of the level is to **install typescript**, **create your first project** and run a very basic **FizzBuzz example**.

### Initialization

- Launch `npm install` to automatically install all the dependencies. **No additional dependencies are needed to solve the level**
- Initialize a brand new typescript repository creating a new `tsconfig.json` file. Infos about this kind of file can be gathered [here](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html).
- **Configure the project to output the compiled files to the `build` folder** (*Hint: maybe the `outDir` property of the `tsconfig.json` could do the trick*).
- Create an `src` folder under root
- Create a new `index.ts` file in the brand new `src` folder
- Compile typescript typing `tsc` in the terminal or running `npm run build` (*have you installed it globally right?* :P)
- Run `npm test` to launch the tests. **They must all fail**.

### Hello typescript 
Define (in Typescript) a `Challenge` class which implements a public method called `buzz` which **take a number** as input and **return a Promise** that resolves respectively: 

- the string `"fizz"` if the number is **multiple of 3**
- the string `"buzz"` if the number is **multiple of 5**
- The string `"fizzbuzz"` if the number is **multiple both of 3 and 5**
- The same input number otherwise

*Don't know what a Promise is*? Refer to [this guide](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Promise) to make it more clear.

![Screenshot](screenshot.png)

## Info and help
For info about this repository please write on the #help channel on slack or to:

- [marco.moschettini@cubbit.net](mailto:marco.moschettini@cubbit.net)
- [alessio.paccoia@cubbit.net](alessio.paccoia@cubbit.net)
