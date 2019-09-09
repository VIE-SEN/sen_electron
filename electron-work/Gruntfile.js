//module.exports = function(grunt) {
//grunt.initConfig({
//  'electron_work': {
//    ia32: {
//      appDirectory: './',
//      outputDirectory: './dist',
//      name: 'SFY-PACS',
//      description: 'A SFY_Electron Desktop Frame',
//      authors: 'SFY',
//      exe: '神飞云pacs_setup_1.0.0'
//    }
//  }
//});
//
//grunt.loadNpmTasks('grunt-electron-installer');
//};

var grunt=require('grunt');

//配置
grunt.config.init({
    pkg: grunt.file.readJSON('gruntPackage.json'),
    'create-windows-installer': {
      ia32: {
        appDirectory: './build/win-unpacked',
        outputDirectory: './dist',
        name: 'SFY-PACS',
        description: 'A SFY_Electron Desktop Frame',
        authors: 'SFY',
        exe: 'sfypacs',
        noMsi:true
      },
//    x64:{
//        version:'1.0.0',
//        authors:'JXB-XL',
//        projectUrl:'',
//        appDirectory:'./OutApp/Client-win32-x64',//要打包的输入目录
//        outputDirectory:'./OutPut',//grunt打包后的输出目录
//        exe:'Client.exe',
//        description:'Client',
//        setupIcon:"./app/assets/icon/jxb.ico",
//        noMsi:true
//    }
    }
});

//加载任务
grunt.loadNpmTasks('grunt-electron-installer');

//设置为默认
grunt.registerTask('default', ['create-windows-installer']);
