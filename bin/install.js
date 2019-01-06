#!/usr/bin/env node

var fs = require('fs'),
    spawn = require('child_process').spawn,
    packageJson = require('../package.json'),
    prompt;

console.log(styleText('Beginning Installation Process'));
console.log('=============================');

installNpmDeps();

function installNpmDeps() {
  var npmInstall = spawn('npm', ['install']);
  console.log(styleText('Installing npm dependencies...'));

  npmInstall.stdout.on('data', function (data) {
    pipeOutput(data);
  });

  npmInstall.stderr.on('data', function (data) {
    pipeOutput(data);
  });

  npmInstall.on('exit', function (code) {
    if (code === 0) {
      prompt = require('prompt');
      promptForPhaserBuild();
    }
    else {
      console.error(styleText('Failed to install npm dependencies', 'red'));
    }
  });
}

function promptForPhaserBuild() {
  prompt = require('prompt');
  prompt.start();

  prompt.message = '';
  prompt.delimiter = '';

  prompt.get([{
    name: 'build',
    description: 'Phaser CE or 2 final? (CE | 2)',
    type: 'string',
    required: true
  }], function (err, result) {
    if (!err) {
      if (result.build === 'ce' || result.build === 'CE') {
        // Update refs.d.ts to use CE

        var filename = 'src/refs.d.ts';

        fs.readFile(filename, 'utf8', function (err, data) {
          if (err) {
            console.warn(styleText('Failed to open refs.d.ts\nYou will need to update refs.d.ts manually to point to phaser-ce', 'yellow'));
            console.warn(err);
          } else {
            var result = data.replace(/\/phaser\//, '\/phaser-ce\/');

            fs.writeFile(filename, result, 'utf8', function (err) {
              if (err) {
                console.warn(styleText('Failed to update refs.d.ts\nYou will need to update refs.d.ts manually to point to phaser-ce', 'yellow'));
                console.warn(err);
              }
            });
          }
        });

        filename = 'gruntfile.js';

        fs.readFile(filename, 'utf8', function (err, data) {
          if (err) {
            console.warn(styleText('Failed to open gruntfile.js\nYou will need to update it manually to point to phaser-ce', 'yellow'));
            console.warn(err);
          } else {
            var result = data.replace(/node_modules\/phaser\//, 'node_modules\/phaser-ce\/');

            fs.writeFile(filename, result, 'utf8', function (err) {
              if (err) {
                console.warn(styleText('Failed to update gruntfile.js\nYou will need to update it manually to point to phaser-ce', 'yellow'));
                console.warn(err);
              }
            });
          }
        });

        setPhaserDep('phaser-ce');
      } else {
        setPhaserDep('phaser');
      }
    }
  });
}

function setPhaserDep(build) {
  var npmInstall = spawn('npm', ['install', build, '--save']);

  console.log(styleText('Installing ' + build + '...'));

  npmInstall.stdout.on('data', function (data) {
    pipeOutput(data);
  });

  npmInstall.stderr.on('data', function (data) {
    pipeOutput(data);
  });

  npmInstall.on('exit', function (code) {
    if (code === 0) {
      promptForNamespace()
    }
    else {
      console.error(styleText('Failed to install Phaser', 'red'));
    }
  });
}

function promptForNamespace() {
  prompt.start();

  prompt.message = '';
  prompt.delimiter = '';

  prompt.get([{
    name: 'namespace',
    description: 'What will your namespace be?',
    type: 'string',
    required: true
  }], function (err, result) {
    if (!err) {
      updateNamespace(result.namespace);
    }
  });
}

function updateNamespace(namespace) {
  var fileList = [
        'src/scripts/entity/preload-bar.ts',
        'src/scripts/state/game.ts',
        'src/scripts/state/preloader.ts',
        'src/scripts/game.ts'
      ],
      rewriteCount = 0;

  fileList.forEach(function (path) {
    fs.readFile(path, function (err, data) {
      data = data.toString()
          .replace(/Namespace/g, namespace);

      fs.writeFile(path, data);
      rewriteCount++;

      if (rewriteCount === fileList.length) {
        console.log('Updated namespace in .ts files');
        promptForCleanup();
      }
    });
  });
}

function promptForCleanup() {
  prompt.start();

  prompt.message = '';
  prompt.delimiter = '';

  prompt.get([{
    name: 'cleanup',
    description: 'Initialize Git? (Y / N)',
    type: 'string',
    default: 'Y',
    required: true
  }], function (err, result) {
    if (!err && (result.cleanup === 'Y' || result.cleanup === 'y')) {
      cleanupGit();
    }
    else {
      cleanupNode();
    }
  });
}

function cleanupGit() {
  var rmrf = require('rimraf');

  rmrf('.git', function (error) {
    if (!error) {
      gitInit = spawn('git', ['init']);

      gitInit.stdout.on('data', function (data) {
        pipeOutput(data);
      });

      gitInit.stderr.on('data', function (data) {
        pipeOutput(data);
      });

      gitInit.on('exit', function () {
        cleanupNode();
      });
    }
  });
}

function cleanupNode() {
  var npmRm = spawn('npm', ['rm', '-D'].concat(Object.keys(packageJson.devDependencies)));

  console.log(styleText('Removing build dependencies...'));

  npmRm.stdout.on('data', function (data) {
    pipeOutput(data);
  });

  npmRm.stderr.on('data', function (data) {
    pipeOutput(data);
  });

  npmRm.on('exit', function () {
    cleanupBin();
  });
}

function cleanupBin() {
  var exec = require('child_process').exec;

  exec('rm bin/* && rmdir bin/', function () {
    showInstallSuccess();
  });
}

function showInstallSuccess() {
  console.log('==============================');
  console.log(styleText('Install completed successfully') + '\n');
  console.log('It is recommended to run: `npm init` to define your own package settings');
  console.log('==============================');
}

function pipeOutput(data) {
  process.stdout.write(data.toString());
}

function styleText(text, colour) {
  if (!colour) {
    colour = 'green';
  }

  var colours = {
        green: 32,
        red: 31,
        yellow: 33
      },
      c = colours[colour];

  return '\u001b[' + c + 'm' + text + '\u001b[39m';
}
