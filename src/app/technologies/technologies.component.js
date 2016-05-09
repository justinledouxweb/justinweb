import TechnologiesController from './technologies.controller';

class TechnologiesComponent {
	constructor() {
		this.template = require('./technologies.html');
		this.controller = TechnologiesController;
	}
}

export default TechnologiesComponent;
