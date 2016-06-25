class NavBarController {
  constructor($translate, $location, language) {
    this.$translate = $translate;
    this.$location = $location;
    this.language = language;
  }

  $onInit() {
    this.changeLanguage(this.language.getCurrentLanguage());
  }

  changeLanguage(languageKey) {
    this.$translate.use(languageKey);
    this.currentLanguage = this.language.getCurrentLanguage();
    this.isEnglish = this.currentLanguage === 'en';
    this.isFrench = this.currentLanguage === 'fr';
  }
}

NavBarController.$inject = [
  '$translate',
  '$location',
  'language',
];

export default NavBarController;
