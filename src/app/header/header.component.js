import HeaderController from './header.controller';

class HeaderComponent {
	constructor() {
		this.template = require('./header.html');
		this.controller = HeaderController;
	}
}

export default HeaderComponent;
