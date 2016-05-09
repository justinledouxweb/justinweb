const technologies = require('../../../data/technologies.json');

class TechnologiesController {
	constructor() {
		this.sectionTitle = 'Technologies';
		this.windowTitle = 'Technologies.js';
		this.technologies = technologies.technologies;
		this.lineNumber = this.getNumberOfLines(this.technologies);
	}

	getNumberOfLines(obj) {
		const lineNumber = angular.copy(this.technologies);
		lineNumber.push('');
		return lineNumber;
	}
}

export default TechnologiesController;
