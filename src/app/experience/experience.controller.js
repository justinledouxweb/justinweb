const experiencesEng = require('../../../data/experiences-eng.json');
const experiencesFr = require('../../../data/experiences-fr.json');

class ExperienceController {
	constructor($translate) {
		this.experiences = $translate.use().substring(0, 2) === 'en'
			? experiencesEng.experiences
			: experiencesFr.experiences;
	}
}

ExperienceController.$inject = [
	'$translate'
]

export default ExperienceController;
