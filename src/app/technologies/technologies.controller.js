const technologies = require('../../../data/technologies.json');

class TechnologiesController {
  constructor() {
    this.technologies = technologies.technologies;
    this.lineNumber = this.getNumberOfLines(this.technologies);
  }

  getNumberOfLines(obj) {
    const lineNumber = angular.copy(obj);
    lineNumber.push('');
    return lineNumber;
  }
}

export default TechnologiesController;
