class LanguageService {
  constructor($translate) {
    this.$translate = $translate;
  }

  getCurrentLanguage() {
    return this.$translate.use().substr(0, 2);
  }

  getCurrentLanguageData(language, engData, frData) {
    return language === 'en'
      ? engData
      : frData;
  }
}

LanguageService.$inject = [
  '$translate',
];

export default LanguageService;
