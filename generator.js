const Generator = require('yeoman-generator');
const defaultConfig = require('./templates/plugin.json');
const glob = require('glob');
const fs = require('fs');


class UToolsGenerator extends Generator {
  constructor(props) {
    super(props);
    this.name = props.name;
  }
  prompting() {
    if (this.env.useDefault) {
      return;
    }
    return this.prompt([
      {
        name: 'pluginName',
        type: 'string',
        message: '插件名称',
        default: this.name || 'hello-uTools',
      },
      {
        name: 'development',
        type: 'confirm',
        message: '启用开发者模式',
        default: true,
      }
    ]).then(answers => {
      this.answers = answers;
    });
  }
  writing() {
    const config = { ...defaultConfig, ...this.answers };
    if (config.development) {
      config.development = defaultConfig.development;
    } else {
      delete config.development;
    }
    glob.sync('**/*', {
      cwd: this.templatePath(),
      dot: true
    }).forEach(file => {
      const filePath = this.templatePath(file);
      if (fs.statSync(filePath).isFile() && !/^plugin.json$/.test(file)) {
        this.fs.copyTpl(
          this.templatePath(filePath),
          this.destinationPath(file)
        );
      }
    });
    this.fs.writeJSON(this.destinationPath('plugin.json'), config);
  }
}

module.exports = UToolsGenerator;