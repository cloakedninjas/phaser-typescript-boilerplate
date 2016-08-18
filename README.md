# Phaser Typescript Boilerplate

Unopinionated (mostly) package containing bare bones Phaser game, containing:

* Phaser (2.6.1)
* Typescript
* Grunt build process
* Basic game
  * Preload State, with loading bar
  * Game State

## Installing

`bower install phaser-typescript-boilerplate`

Or clone from Git:

`git clone https://github.com/cloakedninjas/phaser-typescript-boilerplate.git`

An install script is provided which will perform the following:

- Install npm dependencies
- Install bower dependencies
- Ask you for a namespace for your project
- Set the namespace for the base files provided

You can run it with `bin/install` 

## Building

`grunt dev` for single build or `grunt watch` to compile as you make changes.

## Running

Built files are placed into the `public/` directory. Point a webserver at it, and you're away!

`http-server public`