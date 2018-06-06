// 创建模板文件
const {
    rm,
    cp,
    mkdir,
    exec,
    echo
} = require('shelljs');
const chalk = require('chalk');

let args = process.argv.slice(2);

if (args && args.length) {
    console.log(chalk.blue("开始创建页面... \n"));
    args.forEach(item => {
        let out = "src/app/" + item;
        console.log(chalk.green("创建模块入口 " + item + ".html"));
        console.log(chalk.green("创建模块代码 " + item + ".tsx"));
        console.log(chalk.green("创建模块样式 " + item + ".scss \n"));
        mkdir('-p', out);
        cp("-r", "src/template/*", "src/app/" + item);
    });
    console.log(chalk.yellow("创建模块完成 \n"));
} else {
    console.log(chalk.red("请输入要创建的页面名称 \n"));
}