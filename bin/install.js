#!/usr/bin/env node

var exec = require('child_process').exec,
    fs = require('fs');

console.log('Installing npm dependencies...');

exec('npm install', function (error) {
  if (!error) {
    console.log('Installing bower dependencies...');
    exec('bower install', function (error) {
      if (!error) {
        promptForNamespace();
      }
    });
  }
});

function promptForNamespace() {
  var prompt = require('prompt');

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
          .replace(/Namespace/g, namespace);

      fs.writeFile(path, data);
      rewriteCount++;

      if (rewriteCount === fileList.length) {
        console.log('Updated namespace in .ts files');
        console.log('Install complete!');
      }
    });
  });
}