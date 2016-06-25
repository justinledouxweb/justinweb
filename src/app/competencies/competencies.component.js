import CompetenciesController from './competencies.controller';

class CompetenciesComponent {
	constructor() {
		this.template = require('./competencies.html');
		this.controller = CompetenciesController;
	}
}

export default CompetenciesComponent;
