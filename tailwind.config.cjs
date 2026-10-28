/* Build-time Tailwind config for `npm run build:css`.
   The theme lives in js/tailwind.config.js (one source of truth); this file
   reads it and adds the content paths the CLI scans for class names. */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const sandbox = { tailwind: {} };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, 'js/tailwind.config.js'), 'utf8'), sandbox);

module.exports = {
  ...sandbox.tailwind.config,
  content: ['./*.html', './src/pages/*.html', './js/**/*.js'],
};
