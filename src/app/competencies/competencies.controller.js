const competencies = require('../../../data/competencies.json');

class CompetenciesController {
	constructor() {
		this.sectionTitle = 'Competencies';
		this.windowTitle = 'competencies.html';
		this.competencies = competencies.competencies;
		this.lineNumber = this.getLineNumber(this.competencies);
	}

	getLineNumber(obj) {
		const lineNumber = angular.copy(obj);
		lineNumber.push('');
		return lineNumber;
	}
}

export default CompetenciesController;
