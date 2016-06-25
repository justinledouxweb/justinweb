import angular from 'angular';
import LanguageService from './language.service';

const core = angular
  .module('code', [])
  .service('language', LanguageService)
  .name;

export default core;
