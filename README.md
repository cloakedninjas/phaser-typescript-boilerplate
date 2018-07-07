# Phaser Typescript Boilerplate

Unopinionated (mostly) package containing bare bones Phaser game, containing:

* Phaser 2 or CE
* Typescript
* Grunt build process
* Basic game
  * Preload State, with loading bar
  * Game State

## Installing

`git clone --depth 1 https://github.com/cloakedninjas/phaser-typescript-boilerplate.git`

An install script is provided which will perform the following:

- Install npm dependencies
- Ask which version of Phaser you want to install (latest official 2.x or Community Edition)
- Ask you for a namespace for your project
- Set the namespace for the base files provided

You can run it with `bin/install` 

## Building

- `grunt dev` for single build or `grunt watch` to compile as you make changes.
- `grunt prod` for production (minified) build

## Running

Built files are placed into the `public/` directory. Point a webserver at it, and you're away!

`http-server public`
