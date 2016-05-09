'use strict';

import angular from 'angular';
import 'angular-ui-router';
import 'angular-translate';
import 'angular-sanitize';
import appConfig from './app.config';

import HeaderComponnet from './header/header.component';
import ExperienceComponent from './experience/experience.component';
import NavBarComponent from './nav-bar/nav-bar.component';
import TechnologiesComponent from './technologies/technologies.component';
import CompetenciesComponent from './competencies/competencies.component';

const modules = [
	'ui.router',
	'pascalprecht.translate',
	'ngSanitize'
];

class AppController {}

AppController.$inject = [
	'$translate'
];

class AppComponent {
	constructor() {
		this.template = require('./app.html');
		this.controller = AppController;
	}
}

function bootstrap() {
	angular.bootstrap(document, ['app'], {
		strictDi: true
	});
}

angular
	.element(document)
	.ready(bootstrap);

export default angular
	.module('app', modules)
	.config(appConfig)
	.component('app', new AppComponent())
	.component('navBar', new NavBarComponent())
	.component('appHeader', new HeaderComponnet())
	.component('experience', new ExperienceComponent())
	.component('technologies', new TechnologiesComponent())
	.component('competencies', new CompetenciesComponent());
