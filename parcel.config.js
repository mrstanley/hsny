const Bundler = require('parcel-bundler');
const {
    rm,
    cp,
    mkdir,
    exec,
    echo
} = require('shelljs');
const chalk = require('chalk');
const Path = require('path');
const glob = require("glob");

const isPrd = process.env.NODE_ENV === 'production';

// 打包文件输出目录
let dir = isPrd ? '/prd' : '/dev';
let outDir = './dist' + dir;

// 打包配置
const options = {
    outDir: outDir + '/pages',
    publicURL: '../',
    watch: true,
    hmr: false,
    cache: false,
    sourceMaps: false
};

// 遍历打包目录函数
function entries(globPath) {
    let files = [];
    globPath.forEach(function(item) {
        [].forEach.call(glob.sync(item), function(filePath) {
            files.push(filePath);
        });
    });
    return files;
}

// 遍历需要打包的页面目录
const pages = entries(["./src/app/**/*.html"]);

const bundler = new Bundler(pages, options);

async function bundle() {
    await bundler.bundle();
}

// 开始打包
bundle().then((data) => {

    console.log(chalk.yellow("\n拷贝 /unpackage"));
    mkdir('-p', outDir + "/unpackage/res");
    cp("-r", "unpackage/res/*", outDir + "/unpackage/res");

    console.log(chalk.yellow("拷贝 /manifest.json"));
    cp("-r", "manifest.json", outDir);

    console.log(chalk.green("执行完成 \n"));

});