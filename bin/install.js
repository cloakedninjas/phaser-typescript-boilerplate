#!/usr/bin/env node

var spawn = require('child_process').spawn,
    prompt = require('prompt'),
    fs = require('fs');

console.log('Installing npm dependencies...');

var child = spawn('npm', ['install']);

child.on('close', function (code) {
  if (code === 0) {
    console.log('Installing bower dependencies...');
    child = spawn('bower', ['install']);

    child.on('close', function (code) {
      if (code === 0) {
        promptForNamespace();
      }
    });
  }
});

function promptForNamespace() {
  prompt.start();

  prompt.message = '';
  prompt.delimiter = '';

  prompt.get([{
    name: 'namespace',
    description: 'What will your namespace be?'.green,
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
          .replace('module Namespace', 'module ' + namespace);

      fs.writeFile(path, data);
      rewriteCount++;

      if (rewriteCount === fileList.length) {
        console.log('Updated namespace in .ts files');
        console.log('Install complete!');
      }
    });
  });
}