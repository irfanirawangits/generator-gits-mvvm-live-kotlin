'use-strict';

// Require dependencies
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');

module.exports = yeoman.generators.Base.extend({
    initializing: function() {
        this.pkg = require('../package.json');
        this.templateDirectory = templateDirectory.bind(this);
    },

    prompting: function() {
        var done = this.async();

        // Have yeoman great the user
        this.log(yosay(
            'GITS MVVM Live Kotlin is Building...'
        ));

        var prompts = [{
            name: 'name',
            message: 'Masukan nama project: ',
            store: true,
            default: this.appName
        }, {
            name: 'package',
            message: 'Masukan nama package <Mis: id.co.gits.androidloremipsum>: ',
            store: true
        }, {
            name: 'targetSdk',
            message: 'Masukan target SDK <max>: ',
            store: true,
            default: 27
        }, {
            name: 'minSdk',
            message: 'Masukan target SDK <min>: ',
            default: 16   
        }];

        this.prompt(prompts, function(props) {
            this.appName = props.name;
            this.appPackage = props.package;
            this.androidTargetSdkVersion = props.targetSdk;
            this.androidMinSdkVersion = props.minSdk;

            done();
        }.bind(this));

        this.log(yosay(
            'GITS MVVM Live Kotlin is ready!!!'
        ));
    },

    configuring: {
        saveSettings: function(){
            this.config.set('appPackage', this.appPackage);
        }
    },

    writing: {
        projectfiles: function() {
            this.copy('gitignore', '.gitignore');
            this.copy('_build.gradle', 'build.gradle');
            this.copy('gradle.properties', 'gradle.properties');
            this.copy('gradlew', 'gradlew');
            this.copy('gradlew.bat', 'gradlew.bat');
            this.copy('settings.gradle', 'settings.gradle');
            this.template('_README.md', 'README.md');
            this.directory('gradle', 'gradle');
        },

        app: function() {
            var packageDirectory = this.appPackage.replace(/\./g, '/');

            this.mkdir('app');
            this.copy('app/gitignore', 'app/.gitignore');
            this.copy('app/proguard-rules.pro', 'app/proguard-rules.pro');
            this.template('app/_build.gradle', 'app/build.gradle');

            this.mkdir('app/src/androidTest/java' + packageDirectory);
            this.templateDirectory('app/src/androidTest/java', 'app/src/androidTest/java' + packageDirectory);
            this.templateDirectory('app/src/androidTest/res', 'app/src/androidTest/res');

            // this.mkdir('app/src/env_prod/java/' + packageDirectory);
            // this.templateDirectory('app/src/env_prod', 'app/src/env_prod/res' + packageDirectory);
            
            // this.mkdir('app/src/env_test/java/' + packageDirectory);
            // this.templateDirectory('app/src/env_test/java' + 'app/src/env_test/java/' + packageDirectory);
            // this.templateDirectory('app/src/env_test/res' + 'app/src/env_test/res');

            this.mkdir('app/src/main/assets');
            this.mkdir('app/src/main/java/' + packageDirectory);
            this.directory('app/src/main/assets', 'app/src/main/assets');
            this.template('app/src/main/_AndroidManifest.xml', 'app/src/main/AndroidManifest.xml');
            this.templateDirectory('app/src/main/java', 'app/src/main/java/' + packageDirectory);
            this.templateDirectory('app/src/main/res', 'app/src/main/res');

            this.mkdir('app/src/debug');
            this.template('app/src/debug/_AndroidManifest.xml', 'app/src/debug/AndroidManifest.xml')
        }
    }
});