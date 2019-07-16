# Auto Mart [![Build Status](https://travis-ci.com/Oliver-ke/Auto_Mart.svg?branch=develop)](https://travis-ci.com/Oliver-ke/Auto_Mart) [![Coverage Status](https://coveralls.io/repos/github/Oliver-ke/Auto_Mart/badge.svg?branch=develop)](https://coveralls.io/github/Oliver-ke/Auto_Mart?branch=develop) [![Maintainability](https://api.codeclimate.com/v1/badges/76e40428656938787e5e/maintainability)](https://codeclimate.com/github/Oliver-ke/Auto_Mart/maintainability)

Auto Mart is an online market place for auto-mobile of different kinds such as trucks, vehicles, vans etc, auto mart allows user(sellers) post car sale adverts for users(buyers) to place order for there adverts. [Visit Auto Mart](https://oliver-ke.github.io/Auto_Mart) or you can also [View API documentation](https://app.swaggerhub.com/apis-docs/Oliver-ke/Api/v1)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Side note
- project still under development, released features and badges are currently hosted on the develop branch of this repository

### Prerequisites

This project is built using node and express for backend and just html, css and vanilla javascript for frontend

```
Node express npm nodemon
```

### Installing

To get the project up and running, fork this repositry

### Install project dependencies stated in package.json

```
npm install
```

Also install nodemon for development

```
npm install nodemon
```
Configure environmental variables for jwt and cloudinary by creating a .env file on your root, past the following and replace your own parameters such as api keys

```
JWT_SECRET = 'your jwt secret'
CLOUD_NAME = 'your cloud name for cloudinary'
API_SECRET = 'your api secret from cloudinary'
API_KEY = 'your api key from cloudinary'

```
Run the dev script to startup node server
```
npm run dev
```
Setup an account with Travis and coverall for continious integration and code coverage
* [Travis](https://travis-ci.com)
* [Coverall](https://coveralls.io)


## Built With
* [node](http://www.nodejs.org) -  An open-source, cross-platform JavaScript run-time environment that executes JavaScript code outside of a browser
* [express](https://maven.apache.org/) - A web framework for node
* [mocha](https://michajs.org/) - A test framework


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* [Andela Nigeria](https://andela.com/)
* Developers cycles Port Harcourt
* [Traversymedia](https://www.traversymedia.com/)


