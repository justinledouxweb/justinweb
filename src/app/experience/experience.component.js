import ExperienceController from './experience.controller';

class ExperienceComponent {
	constructor() {
		this.template = require('./experience.html');
		this.controller = ExperienceController;
	}
}

export default ExperienceComponent;