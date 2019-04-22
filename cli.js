#!/usr/bin/env node

const { resolve } = require('path');
const yParser = require('yargs-parser');
const UToolsGenerator = require('./generator');

const args = yParser(process.argv.splice(2));

if (args.v || args.version) {
  console.log(require('./package').version);
  process.exit(0);
}

const useDefault = Boolean(args.y);
if (useDefault) {
  console.log('使用默认配置...');
}

const name = args._[0] || '';
const templatePath = resolve(__dirname, 'template');
const projectPath = resolve(process.cwd(), name);

const g = new UToolsGenerator({
  name,
  env: {
    useDefault,
    projectPath,
    cwd: projectPath,
  },
  resolved: templatePath,
});

g.run(() => {
  console.log('✨ Done!');
  console.log('更多 uTools 插件配置请参阅：https://u.tools/docs/developer/config.html');
}).then();


