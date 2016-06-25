import experiencesEng from '../../../data/experiences-eng.json';
import experiencesFr from '../../../data/experiences-fr.json';

class ExperienceController {
  constructor($translate, $rootScope, language) {
    this.$translate = $translate;
    this.$rootScope = $rootScope;
    this.language = language;
  }

  $onInit() {
    this.experiences = this.getLanguageData(this.language.getCurrentLanguage());
    this.$rootScope.$on('$translateChangeStart', (event, data) => {
      this.experiences = this.getLanguageData(data.language);
    });
  }

  getLanguageData(language) {
    return this.language.getCurrentLanguageData(
      language,
      experiencesEng.experiences,
      experiencesFr.experiences);
  }
}

ExperienceController.$inject = [
  '$translate',
  '$rootScope',
  'language',
];

export default ExperienceController;
