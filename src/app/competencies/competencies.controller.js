import competenciesEng from '../../../data/competencies-eng.json';
import competenciesFr from '../../../data/competencies-fr.json';

class CompetenciesController {
  constructor($rootScope, language) {
    this.$rootScope = $rootScope;
    this.language = language;
  }

  $onInit() {
    this.competencies = this.getLanguageData(this.language.getCurrentLanguage());
    this.lineNumber = this.getLineNumber(this.competencies);
    this.$rootScope.$on('$translateChangeStart', (event, data) => {
      this.competencies = this.getLanguageData(data.language);
    });
  }

  getLanguageData(language) {
    return this.language.getCurrentLanguageData(
      language,
      competenciesEng.competencies,
      competenciesFr.competencies);
  }

  getLineNumber(obj) {
    const lineNumber = angular.copy(obj);
    lineNumber.push('');
    return lineNumber;
  }
}

CompetenciesController.$inject = [
  '$rootScope',
  'language',
];

export default CompetenciesController;
