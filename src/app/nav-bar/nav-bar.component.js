import NavBarController from './nav-bar.controller';

class NavBarComponent {
	constructor() {
		this.template = require('./nav-bar.html');
		this.controller = NavBarController;
	}
}

export default NavBarComponent;
