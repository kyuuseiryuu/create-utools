const Generator = require('yeoman-generator');
const defaultConfig = require('./templates/plugin.json');
const glob = require('glob');
const fs = require('fs');
const repository = 'https://github.com/kyuuseiryuu/utools-types';

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
      },
      {
        name: 'install',
        type: 'confirm',
        message: '安装 utools-types 使 IDE 智能提示 uTools API',
        default: true,
      },
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
    delete config.install;
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
  install() {
    if (this.answers.install) {
      this.yarnInstall([repository], { dev: true });
    }
  }
}

module.exports = UToolsGenerator;