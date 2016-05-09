class NavBarController {
	constructor($translate, $location) {
		this.$translate = $translate;
		this.$location = $location;

		this.changeLanguage(this.getCurrentLanguage());
	}

	getCurrentLanguage() {
		return this.$translate.use().substring(0, 2);
	}

	changeLanguage(languageKey) {
		this.$translate.use(languageKey)
		this.currentLanguage = this.getCurrentLanguage();
		this.isEnglish = this.currentLanguage === 'en';
		this.isFrench = this.currentLanguage === 'fr';
	}
}

NavBarController.$inject = [
	'$translate',
	'$location'
];

export default NavBarController;
