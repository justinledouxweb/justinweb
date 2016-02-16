/**************************************
 * THIS FUNCTION DRIVES THE SIDE MENU *
 **************************************/
function SideMenu () {
	this._init = function () {
		this.button = document.getElementById( 'hamburger' );
		this.pusher = document.getElementById( 'pusher' );
		this.sideMenu = document.getElementById( 'menu' );
		this.navBar = document.getElementById( 'nav-bar' );
		this.curtain = document.getElementById( 'content-curtain__menu' );
		this.roadMapValidation = ( document.getElementsByClassName( 'roadmap__link' )[0] ) ? new PageLeaveValidation() : null;

		this._initEvents();
	};

	// ACTIVATE THE ACTIVE STATE OF THE CURRENT SECTION LINK
	// AND AD A CLICK EVENT TO EACH LINK.
	this._initEvents = function () {
		var self = this;

		_c.click( this.button, function () {
			self._open();
		});

		var links = document.getElementsByClassName( 'roadmap__link' );

		if ( links[0] ) {
			[].forEach.call( links, function ( link ) {
				_c.click( link, function ( e ) {
					e.preventDefault();

					if ( !_c.hasClass( this, 'create-roadmap-link' ) ) {
						self._getLinkAnchors( this );
					}
							
					return;
				});
			});
		}
		
		var footerLinks = document.getElementsByClassName( 'options__links' );

		if ( footerLinks ) {
			[].forEach.call( footerLinks, function ( link ) {
				_c.click( link, function ( e ) {
					e.preventDefault();
					menu._close();
					self._getLinkAnchors( this );
				});
			});
		}
	};

	// THIS FUNCTION ANIMATES THE SIDE MENU BEFORE FORWARDING THE USER TO THE RIGHT LINK.
	this._getLinkAnchors = function ( elem ) {
		var anchor = elem.getAttribute( 'href' );

		if ( anchor != '#' ) {
			menu._close();
			
			if ( this.roadMapValidation ) {
				if ( this.roadMapValidation._doCheck() ) {
					setTimeout( function () {
						window.location.href = anchor;
					}, 510);
				}
			} else {
				setTimeout( function () {
					window.location.href = anchor;
				}, 510);
			}
		}
	};

	// OPEN THE SIDE MENU
	this._open = function () {
		var self = this;

		_c.addClass( this.sideMenu, 'open' );
		_c.addClass( [this.navBar, this.pusher, this.curtain], 'open-side-menu' );
		_c.addClass( [this.button, this.curtain], 'active' );

		setTimeout( function () {
			_c.css( document.body, {
				'overflow-x': 'hidden',
				'overflow-y': 'hidden'
			});
		}, 310 );

		_c.click( this.curtain, function () {
			self._close();
		});
	};

	// CLOSE THE SIDE MENU
	this._close = function () {
		_c.removeClass( this.sideMenu, 'open' );
		_c.removeClass( [this.navBar, this.pusher, this.curtain], 'open-side-menu' );
		_c.removeClass( this.button, 'active' );
		_c.removeClass( this.curtain, 'active', 10 );
		
		setTimeout( function () {
			_c.css( document.body, {
				'overflow-x': '',
				'overflow-y': ''
			});
		}, 360);
	};
}

/***********************************************************
 * THIS FUNCTION DRIVES THE TOOLBOX, MULTI LAYER INTERFACE *
 ***********************************************************/
function Toolbox () {
	this._toolboxPush = function ( elem, trigger, options ) {
		this.toolbox = elem;
		this.trigger = trigger;
		this.options = this.extend( this.defaults, options );
		this._init();
	};

	this.toolboxAPI = function ( elem, options ) {
		this.toolbox = elem;
		this.options = this.extend( this.defaults, options );
		this._init();
	};

	this.extend = function ( a, b ) {
		for( var key in b ) { 
			if( b.hasOwnProperty( key ) ) {
				a[key] = b[key];
			}
		}
		return a;
	};

	this.defaults = {
		levelSpacing : 50, // SPACE BETWEEN THE LEVELS IN PIXELS
		backClass : 'toolbox-back' // CLASS NAME FOR THE CLOSE BUTTON INSIDE EACH LEVEL
	};
	
	// returns the depth of the element "elem" relative to element with id=id
	// for this calculation only parents with classname = waypoint are considered
	this.getLevelDepth = function( elem, id, waypoint, cnt ) {
		cnt = cnt || 0;

		if ( elem.id.indexOf( id ) >= 0 ) {
			return cnt;
		}

		if ( _c.hasClass( elem, waypoint ) ) {
			++cnt;
		}

		return elem.parentNode && this.getLevelDepth( elem.parentNode, id, waypoint, cnt );
	};
	
	// returns the closest element to 'elem' that has class "cName"
	this.closest = function( elem, cName ) {
		if ( _c.hasClass( elem, cName ) ) {
			return elem;
		}

		return elem.parentNode && this.closest( elem.parentNode, cName );
	};

	this._init = function() {
		var self = this;

		this.open = false; // IF MENU IS OPEN OF NOT
		this.level = 0; // LEVEL DEPTH
		this.wrapper = document.getElementById( 'pusher' ); // THE PAGE CONTENT THAT MOVES WITH THE TOOLBOX
		this.levels = Array.prototype.slice.call( this.toolbox.querySelectorAll( 'div.toolbox-level' ) ); // THE TOOLBOX-LEVEL ELEMENTS
		this.nav = document.getElementById( 'nav-bar' ); // THE NAVIGATION BAR
		this.curtain = document.getElementById( 'content-curtain__toolbox' ); // THE CONTENT AREA CURTAIN

		// SAVE THE DEPTH OF EACH OF THE TOOLBOX-LEVEL ELEMENTS
		this.levels.forEach( function( elem ) {
			elem.setAttribute( 'data-level', self.getLevelDepth( elem, self.toolbox.id, 'toolbox-level' ) );
		});

		this.toolboxItems = Array.prototype.slice.call( this.toolbox.querySelectorAll( 'li' ) ); // THE TOOLBOX ITEMS
		this.levelBack = Array.prototype.slice.call( this.toolbox.querySelectorAll( '.' + this.options.backClass ) ); // EACH LEVEL WILL SERVE AS HOOKS TO MOVE BACK TO THE PREVIOUS LEVEL

		// INITIALIZE ALL EVENTS
		this._initEvents();
	};

	this._initEvents = function() {
		var self = this;

		// the menu should close if clicking somewhere on the body
		self.bodyClickFn = function( elem ) {
			self._resetMenu();
			elem.removeEventListener( _c.eventType(), self.bodyClickFn );
		};

		// OPEN OR CLOSE THE TOOLBOX
		this._registerTrigger( this.trigger );

		// OPENING A SUB-LEVEL TOOLBOX
		this.toolboxItems.forEach( function( elem ) {
			var subLevel = elem.querySelector( 'div.toolbox-level' );
			
			// CHECK IF IT HAS A SUB-LEVEL
			if ( subLevel ) {
				_c.click( elem.querySelector( 'a' ), function ( e ) {
					e.preventDefault();

					var level = self.closest( elem, 'toolbox-level' ).getAttribute( 'data-level' );

					if ( self.level <= level ) {
						e.stopPropagation();
						_c.addClass( self.closest( elem, 'toolbox-level' ), 'toolbox-level--overlay' );
						self._openMenu( subLevel );
					}
				});
			}
		});

		// CLOSING A SUB-LEVEL BY CLICKING ON THE VISIBLE PART OF THE LEVEL ELEMENT
		this.levels.forEach( function( elem ) {
			_c.click( elem, function ( e ) {
				e.stopPropagation();

				var level = elem.getAttribute( 'data-level' );

				if ( self.level > level ) {
					self.level = level;
					self._closeMenu();
				}
			});
		});

		// CLOSING A SUB-LEVEL BY CLICKING ON A SPECIFIC SUB-LEVEL ELEMENT
		this.levelBack.forEach( function( elem ) {
			_c.click( elem, function ( e ) {
				e.preventDefault();

				var level = self.closest( elem, 'toolbox-level' ).getAttribute( 'data-level' );
				
				if ( self.level <= level ) {
					e.stopPropagation();
					self.level = level - 1;
					self.level === 0 ? self._resetMenu() : self._closeMenu();
				}
			});
		});
	};

	this._registerTrigger = function( elem ) {
		var self = this;
		
		self.trigger = elem;

		// OPEN OR CLOSE THE TOOLBOX
		_c.click( this.trigger, function ( e ) {
			var triggerTarget = e.target;

			e.stopPropagation();
			e.preventDefault();

			if ( self.open ) {
				self._resetMenu();
			} else {
				self._openMenu();

				// THE TOOLBOX SHOULD CLOSE IF CLICKING SOMEWHERE ON THE BODY
				// EXCLUDING CLICKS ON THE TOOLBOX
				_c.click( document, function ( e ) {
					var t = e.target;

					if ( !_c.hasParent( t, 'video-tutorial__viewer' ) ) {
						if ( self.open && ( !_c.hasParent( triggerTarget, self.toolbox.id ) || t.id !== 'video-tutorial__close-viewer' ) ) {
							self.bodyClickFn( this );
						}
					}
					
				});
			}
		});
	};

	this._openMenu = function( subLevel ) {
		++this.level; // INCREMENT LEVEL DEPTH

		// MOVE THE CONTENT
		if ( this.level === 1 ) {
			this.open = true;
			_c.addClass( [this.wrapper, this.nav, this.curtain], 'level-1' );
			_c.addClass( this.curtain, 'active' );
		}

		if ( this.level === 2 ) {
			_c.addClass( [this.wrapper, this.nav, this.curtain], 'level-2' );
		}

		if ( this.level === 3 ) {
			_c.addClass( [this.wrapper, this.nav, this.curtain, this.toolbox], 'level-3' );
		}

		if ( this.level === 4 ) {
			_c.addClass( [this.wrapper, this.nav, this.curtain, this.toolbox], 'level-4' );
		}

		setTimeout( function () {
			document.body.style.overflowY = 'hidden';
			document.body.style.overflowX = 'hidden';
		}, 300);

		// ADD CLASS TOOLBOX-LEVEL--OPEN TO THE OPENING LEVEL ELEMENT
		_c.addClass( subLevel || this.levels[0], 'toolbox-level--open' );
	};

	this._resetMenu = function() {
		var self = this;

		// REMOVING ALL THE TOOLBOX CLASSES WILL RESET THE POSITION
		// OF ALL ELEMENTS THAT MOVED
		_c.removeClass( [this.wrapper, this.nav, this.curtain, this.toolbox], ['level-1', 'level-2', 'level-3', 'level-4'] );
		_c.removeClass( this.curtain, 'active' );

		setTimeout( function () {

			// IF A NOTE IS BEING EDITED, CANCEL THE EDIT
			if ( document.getElementsByClassName( 'toolbox__notes' )[0] ) {
				notes._cancelEdit();
			}

			document.body.style.overflowY = '';
			document.body.style.overflowX = '';
		}, 310);

		this.level = 0;
		this._toggleLevels();
		this.open = false;
	};

	this._closeMenu = function( levelParam ) {
		if ( levelParam ) {
			this.level = levelParam;
		}

		var level = parseInt( this.level );

		// CLOSING ONE LEVEL AT A TIME
		if ( level === 1 ) {
			_c.removeClass( [this.wrapper, this.nav, this.curtain, this.toolbox], ['level-2', 'level-3', 'level-4'] );
		}

		if ( level === 2  ) {
			_c.removeClass( [this.wrapper, this.nav, this.curtain, this.toolbox], ['level-3', 'level-4'] );
		}

		if ( level === 3  ) {
			_c.removeClass( [this.wrapper, this.nav, this.curtain, this.toolbox], 'level-4' );
		}

		// IF A NOTE IS BEING EDITED, CANCEL THE EDIT
		if ( document.getElementsByClassName( 'notes-tool__edit-controls' )[0] ) {
			notes._cancelEdit();
		}

		this._toggleLevels();
	};
	this._toggleLevels = function() {

		// REMOVES CLASSES TOOLBOX-LEVEL--OPEN AND TOOLBOX-LEVEL--OVERLAY
		// FROM CLOSING LEVELS
		for( var i = 0; i < this.levels.length; ++i ) {
			var levelEl = this.levels[i];

			if ( levelEl.getAttribute( 'data-level' ) >= this.level + 1 ) {
				_c.removeClass( levelEl, ['toolbox-level--open', 'toolbox-level--overlay'] );
			} else if ( Number( levelEl.getAttribute( 'data-level' ) ) == this.level ) {
				_c.removeClass( levelEl, 'toolbox-level--overlay' );
			}
		}
	};
}

/**************************************
 * CREATE AN IBR
 **************************************/
function CreateIBR ( state ) {
	var disable = document.getElementById( 'disable-create-ibr-button' ),
			createMessage = document.getElementsByClassName( 'create-message' )[0];

	switch( state ) {
		case 'on':

			// CREATE IBR CODE HERE FOR THE BACKEND
			// DISPLAY A MESSAGE WHEN CLICKING THE CREATE BUTTON
			// _c.show( this.createMessage );
			// _c.addClass( this.createMessage, 'active', 10 );

			// DISABLE THE CREATE BUTTON
			_c.show( disable );
			_c.addClass( disable, 'active', 50 );
			break;

		case 'off':
		
			// CREATE IBR CODE HERE FOR THE BACKEND
			// DISPLAY A MESSAGE WHEN CLICKING THE CREATE BUTTON
			_c.removeClass( createMessage, 'active' );
			_c.hide( createMessage, 550 );

			// DISABLE THE CREATE BUTTON
			_c.removeClass( disable, 'active' );
			_c.hide( disable, 550 );
			break;
	}
	
}

/*******************************************************
 * INITIALIZE DOCUMENT UPLOAD MANIPULATION & VALIDATION
 *******************************************************/
function UploadFile () {
	this._init = function ( index ) {
		this.myIndex = index;
		this.uploadForm = document.getElementsByClassName( 'file-upload-form' )[this.myIndex];

		if ( document.getElementsByClassName( 'document-upload__browse-' + this.myIndex )[0] ) {
			this.browseFileBtn = document.getElementsByClassName( 'document-upload__browse-' + this.myIndex )[0];
			this.file = document.getElementsByClassName( 'file-upload-input-' + this.myIndex )[0];
			this.fileHint = document.getElementsByClassName( 'document-upload__hint-' + this.myIndex )[0];
		}

		if ( document.getElementsByClassName( 'link-upload-fields__link-' + this.myIndex )[0] ) {
			this.url = document.getElementsByClassName( 'link-upload-fields__link-' + this.myIndex )[0];	
		}
		
		this.title = document.getElementsByClassName( 'document-upload-fields__title' )[this.myIndex];
		this.description = document.getElementsByClassName( 'document-upload-fields__description' )[this.myIndex];
		this.submit = document.getElementsByClassName( 'submit-document-form' )[this.myIndex];

		if ( document.getElementById( 'file-upload-tab-' + this.myIndex ) ) {
			this.toggle = document.getElementById( 'file-upload-tab-' + this.myIndex );
		}

		if ( document.getElementById( 'test-url-button-' + this.myIndex ) ) {
			this.testUrlBtn = document.getElementById( 'test-url-button-' + this.myIndex );
		}
		
		this.alerts = {
			file: document.getElementsByClassName( 'file-upload__file-label-' + this.myIndex )[0],
			url: document.getElementsByClassName( 'file-upload__url-label-' + this.myIndex )[0],
			title: document.getElementsByClassName( 'file-upload__title-label-' + this.myIndex )[0],
			description: document.getElementsByClassName( 'file-upload__description-label-' + this.myIndex )[0]
		};
		this.links = document.getElementsByClassName( 'roadmap__link' );

		if ( document.getElementsByClassName( 'link-upload-fields__link-' + this.myIndex )[0] ) {
			if ( this.url.value ) {
				_c.addClass( this.testUrlBtn, 'active' );
			}
		}

		this._initEvents();
	};

	this._getState = function () {

		if ( document.getElementById( 'file-upload-upload-a-file-' + this.myIndex ) ) {
			if ( document.getElementById( 'file-upload-upload-a-file-' + this.myIndex ).style.display === 'block' ) {
				return 'file';
			}
		}

		// RETURN THE FILE UPLOAD STATE
		return ( document.getElementById( 'file-upload-upload-a-file-' + this.myIndex ).getAttribute( 'data-has-file' ) === 'true' ) ? 'file' : 'url';
	};

	this._getCurrentPageCheckbox = function () {
		for ( var i = 0, len = this.links.length; i < len; i++ ) {
			if ( _c.hasClass( this.links[i], 'active' ) ) {
				return this.links[i].previousSibling;
			}
		}
	};

	this._initEvents = function () {
		var self = this;

		if ( document.getElementsByClassName( 'document-upload__browse-' + this.myIndex )[0] ) {
			_c.click( this.browseFileBtn, function ( e ) {
				e.preventDefault();

				self.file.click();
			}, false );
		}
		
		// VALIDATE THE FORM ON SUBMIT
		_c.click( this.submit, function ( e ) {

			// PASS THE STATE OF THE FORM TO THE VALIDATEFORM FUNCTION
			if ( self._validateForm( self._getState() ) ) {
				return true;
			}

			e.preventDefault();
			return false;
		});

		if ( document.getElementsByClassName( 'file-upload-input-' + this.myIndex )[0] ) {

			// VALIDATE THE FILE WHEN IT IS SELECTED
			this.file.addEventListener( 'change', function () {
				self._validateFile();
				this.setAttribute( 'data-has-file', 'true' );
			}, false );
		}

		if ( document.getElementById( 'file-upload-tab-' + this.myIndex ) ) {
			_c.click( this.toggle, function ( e ) {
				if ( e.target.tagName === 'A' ) {
					self.file.value = '';
					self.url.value = '';
					self.title.value = '';
					self.description.value = '';
					self._dismissAlert( 'all' );
				}
			});
		}

		if ( document.getElementsByClassName( 'link-upload-fields__link-' + this.myIndex )[0] ) {
			this.url.addEventListener( 'keyup', function () {
				if ( self.url.value ) {
					_c.addClass( self.testUrlBtn, 'active' );
				} else {
					_c.removeClass( self.testUrlBtn, 'active' );
				}
			}, false );
		}

		if ( document.getElementById( 'test-url-button-' + this.myIndex ) ) {
			_c.click( this.testUrlBtn, function() {
				self._testUrl();
			});
		}
	};

	this._testUrl = function () {
		var url = this.url.value,
				httpRegex = new RegExp( 'http://' ),
				httpsRegex = new RegExp( 'https://' ),
				ftpRegex = new RegExp( 'ftp://' );

		if ( httpRegex.test( url ) || httpsRegex.test( url ) || ftpRegex.test( url ) ) {
			window.open( url, '_blank' );
		} else {
			window.open( 'http://' + url, '_blank' );
		}
	};

	this._validateForm = function ( formState ) {
		var isValid = false;

		isValid = ( formState === 'file' ) ? this._validateFile() : this._validateURL();
		isValid &= this._validateTitle();
		isValid &= this._validateDescription();

		return isValid;
	};

	this._validateURL = function () {
		if ( this.url.value ) {
			this._dismissAlert( 'url' );
			return true;
		}
		this._alert( 'url' );
		return false;
	};

	this._validateTitle = function () {
		var value = this.title.value,
				validate = validation( 'text', true, value );

		if ( validate ) {
			this._dismissAlert( 'title' );
			return true;
		} else {
			this._alert( 'title' );
		}
		return false;
	};

	this._validateDescription = function () {
		var value = this.description.value,
				validate = validation( 'text', true, value );

		if ( validate ) {
			this._dismissAlert( 'description' );
			return true;
		} else {
			this._alert( 'description' );
		}
		return false;
	};

	this._validateFile = function () {

		if ( document.getElementById( 'file-upload-upload-a-file-' + this.myIndex ) ) {
			if ( document.getElementById( 'file-upload-upload-a-file-' + this.myIndex ).getAttribute( 'data-has-file' ) === 'true' ) {
				return true;
			}
		}

		// THE FILE NEEDS TO BE OF TYPE: PDF, PNG, JPEG, JPG, BMP, GIF
		// AND OF SIZE <= 10MB OR 10,485,760 BYTES
		if ( this.file.value ) {
			var fileType = ['pdf', 'png', 'jpeg', 'jpg', 'bmp', 'gif'],
					maxFileSize = 10485760,
					file = {
						name: this.file.value,
						extension: this.file.value.substr( (this.file.value.lastIndexOf( '.' ) + 1 ) ).toLowerCase(),
						size: this.file.files[0].size,
						readableSize: ( ( this.file.files[0].size / 1048576 ) ).toFixed(2)
					},
					validExtension = false,
					validSize = false;
			
			// IF THE FILE IS NOT VALID, TRIGGER PROPER ALERT
			// ELSE DISMISS IT
			for ( var i = 0; i < fileType.length; i++ ) {
				if ( file.extension === fileType[i] ) {
					validExtension = true;
					break;
				}
			}

			if ( file.size <= maxFileSize ) {
				validSize = true;
			}

			if ( !validExtension || !validSize ) {
				this._alert( 'file' );
				this.fileHint.textContent = this.file.value.substr( this.file.value.lastIndexOf('\\') + 1 ) + ' - ' + file.readableSize + 'MB';
				return false;

			} else if ( validExtension && validSize ) {
				this._dismissAlert( 'file' );
				this.fileHint.textContent = this.file.value.substr( this.file.value.lastIndexOf('\\') + 1 ) + ' - ' + file.readableSize + 'MB';

				return true;
			}

		} else {
			this.fileHint.textContent = _c.translator( 'noFileChosen' );
			this._alert( 'file' );
		}

		return false;
	};

	this._alert = function ( alertType ) {
		switch( alertType ) {
			case 'file':
				_c.addClass( this.alerts.file, 'alert' );

				// this.fileUp
				this.alerts.file.innerHTML = _c.translator( 'fileTypeAndSize', {
					fileTypes: 'pdf, png, jpeg, jpg, bmp, gif',
					size: 10
				});

				break;

			case 'url':
				_c.addClass( this.alerts.url, 'alert' );
				break;

			case 'title':
				_c.addClass( this.alerts.title, 'alert' );
				break;

			case 'description':
				_c.addClass( this.alerts.description, 'alert' );
				break;
		}
	};

	this._dismissAlert = function ( alertType ) {
		switch( alertType ) {
			case 'all':
				_c.removeClass( [this.alerts.file, this.alerts.url, this.alerts.title, this.alerts.description], 'alert' );

				this.alerts.file.innerHTML = _c.translator( 'supportedFilesAndSize', {
					fileTypes: 'pdf, png, jpeg, jpg, bmp and gif',
					size: '10'
				});

				break;

			case 'file':
				_c.removeClass( this.alerts.file, 'alert' );

				this.alerts.file.innerHTML = _c.translator( 'supportedFilesAndSize', {
					fileTypes: 'pdf, png, jpeg, jpg, bmp et gif',
					size: '10'
				});

				break;

			case 'url':
				_c.removeClass( this.alerts.url, 'alert' );
				break;

			case 'title':
				_c.removeClass( this.alerts.title, 'alert' );
				break;

			case 'description':
				_c.removeClass( this.alerts.description, 'alert' );
				break;
		}
	};
}


/********************************************************
 * THIS OBJECT INITIALIZES THE TABLE TOGGLES
 *********************************************************/
function Toggles() {
	this._init = function ( tabsID ) {
		// THESE ARRAY VARIABLES HAVE TO BE INITIALIZED OUTSIDE THE TOGGLES() FUNCTION 
		tabLinks[tabsID] = [];
		contentDivs[tabsID] = [];
		
		// STORE THE TOGGLES AND TABS LINK
		var tabListItems = document.getElementById( tabsID ).childNodes,
				i;
		// STORE ALL THE REQUIRED ELEMENTS IN THE PROPER ARRAY AND KEY
		for ( i = 0; i < tabListItems.length; i++ ) {
			if ( tabListItems[i].nodeName === 'LI' ) {
				var ID = getHash( this._getFirstChildWithTagName( tabListItems[i], 'A' ).getAttribute( 'href' ) );

				tabLinks[tabsID][ID] = this._getFirstChildWithTagName( tabListItems[i], 'A' );
				contentDivs[tabsID][ID] = document.getElementById( ID );
			}
		}

		// DECLARE CLICK EVENTS TO THE TOGGLE AND TAB LINK,
		// AND ACTIVATE THE FIRST TOGGLE OR TAB OF EACH SET
		i = 0;
		for ( ID in tabLinks[tabsID] ) {
			_c.click( tabLinks[tabsID][ID], this._showTab );
			i++;
		}

		// Show <div> related to active tabs, and hide the other ones.
		i = 0;
		for ( ID in contentDivs[tabsID] ) {
			if ( !_c.hasClass( tabLinks[tabsID][ID], 'active' ) ) {
				if ( contentDivs[tabsID][ID] ) {
					_c.hide( contentDivs[tabsID][ID] );
				}
			} else {
				if ( contentDivs[tabsID][ID] ) {
					_c.show( contentDivs[tabsID][ID] );
				}
			}
			i++;
		}
	};

	this._showTab = function (e) {
		e.preventDefault();
		var selectedId = getHash( this.getAttribute( 'href' ) );
		
		// FIND THE SET OF TOGGLES OR TABS THAT THIS TOGGLE OR TAB IS IN
		outer:
		for ( var tabsID in tabLinks ) {
			if ( tabLinks.hasOwnProperty( tabsID ) ) {
				for ( var ID in tabLinks[tabsID] ) {
					if ( ID == selectedId )
						break outer;
				}
			}
		}
		
		// HIGHLIGHT THE SELECTED TOGGLE OR TAB, AND DE-ACTIVATE ALL OFTHERS
		// SHOW THE SELECTED CONTENT DIV, AND HIDE ALL OTHERS IN THE SET.
		for ( ID in contentDivs[tabsID] ) {
			if ( ID === selectedId ) {
				_c.addClass( tabLinks[tabsID][ID], 'active' );
				if ( contentDivs[tabsID][ID] ) {
					_c.show( contentDivs[tabsID][ID] );
				}
			} else {
				if ( typeof tabLinks[tabsID][ID] !== 'undefined' ) {
					_c.removeClass( tabLinks[tabsID][ID], 'active' );
					if ( contentDivs[tabsID][ID] ) {
						_c.hide( contentDivs[tabsID][ID] );
					}
				}
			}
		}
		
		// STOP THE BROWSER FOLLOWING THE LINK (SCROLLING TO THE LINK)
		return false;
	};
	this._getFirstChildWithTagName = function ( element, tagName ) {
		for ( var i = 0; i < element.childNodes.length; i++ ) {
			if ( element.childNodes[i].nodeName === tagName ) {
				return element.childNodes[i];
			}
		}
		return false;
	};
}

// THIS FUNCTION IS NEEDED FOR THE TOGGLES() FUNCTION
//Â BUT CANNOT BE INCLUDED IN THE OBJECT.
function getHash( url ) {
	var hashPos = url.lastIndexOf ( '#' );
	return url.substring( hashPos + 1 );
}

/**************************************
 * INITIALIZE NOTES TOOL
 **************************************/
function Notes () {
	this._init = function () {
		this.selectedNote = false;
		this.noteList = document.getElementsByClassName( 'notes-list' );
		this.addBtn = document.getElementsByClassName( 'notes-submit' )[0];
		this.editControls = document.getElementsByClassName( 'notes-form-controls-inner' )[0];
		this.saveBtn = document.getElementsByClassName( 'notes-save' )[0];
		this.cancelBtn = document.getElementsByClassName( 'notes-cancel' )[0];
		this.deleteBtn = document.getElementsByClassName( 'notes-delete' )[0];
		this.confirmDeleteBtn = document.getElementsByClassName( 'notes-confirm-delete' )[0];
		this.cancelDeleteBtn = document.getElementsByClassName( 'notes-cancel-delete' )[0];
		this.textArea = document.getElementsByClassName( 'notes-textarea' )[0];
		this.alert = document.getElementById( 'alert-box' );

		this._initEvents();
	};
	this._initDataNote = function () {
		var notes = document.querySelectorAll( '.notes-list li a' );

		// ADD DATA-NOTE ATTRIBUTE TO ALL NOTES
		for ( var i = 0; i < notes.length; i++ ) {
			notes[i].setAttribute( 'data-note', ( i + 1 ).toString() );
		}
	};
	this._initEvents = function () {
		var self = this;

		// EACH CLICK EVENTS ON THE NOTES CONTROLS ( ADD, DELETE, CANCEL, CONFIRM, ETC )
		// REMOVES FOCUS FROM THE TEXTAREA
		_c.click( this.addBtn, function ( e ) {
			e.preventDefault();
			self.textArea.blur();
			self._addNote();
		});

		_c.click( this.deleteBtn, function ( e ) {
			e.preventDefault();
			self.textArea.blur();
			self._openAlert();
		});

		_c.click( this.cancelBtn, function ( e ) {
			e.preventDefault();
			self.textArea.blur();
			self._cancelEdit();
		});

		_c.click( this.saveBtn, function ( e ) {
			e.preventDefault();
			self.textArea.blur();
			self._saveNote();
		});

		_c.click( this.confirmDeleteBtn, function ( e ) {
			e.preventDefault();
			self.textArea.blur();
			self._deleteNote();
		});

		_c.click( this.cancelDeleteBtn, function ( e ) {
			e.preventDefault();
			self.textArea.blur();
			self._closeAlert();
		});

		// EVERY TIME THE NOTE LIST IS MANIPULATED WITH,
		// WE NEED TO INITDATANOTE() AND INITEDITNOTE()
		this._initDataNote();
		this._initEditNote();
	};

	this._addNote = function () {

		// IF THERE IS A VALUE IN THE TEXT AREA, CREATE THE NOTE
		// HTML BEFORE APPENDING IT TO THE TOP OF THE LIST
		if ( this.textArea.value ) {
			var html =  '<li>' + 
							'<a href="#">' +
								'<p class="note-title">' + this.textArea.value + '</p>' + 
								'<p class="note-timestamp">' + _c.timestamp( true, true ) + '</p>' +
							'</a>' +
						'</li>';

			// APPEND THE NOTE HTML TO THE TOP OF THE LIST
			_c.add( this.noteList[0], html );

			// TO PERFORM THE NEW NOTE ANIMATION, WE NEED TO REMOVE
			// THE 'NEW-NOTE' CLASS FROM THE PREVIOUS NEW NOTE
			// AND ADD IT TO THE ACTUAL NEW NOTE.
			// THIS CLASS CONTAINS CSS3 ANIMATION
			var notes = document.querySelectorAll( '.notes-list li' );

			for ( var i = 0; i < notes.length; i++ ) {
				_c.removeClass( notes[i], 'new-note' );
			}

			_c.addClass( notes[0], 'new-note' );

			// CLEAR THE TEXT IN THE TEXTAREA
			this.textArea.value = '';
		}

		// EVERY TIME THE NOTE LIST IS MANIPULATED WITH,
		// WE NEED TO INITDATANOTE() AND INITEDITNOTE()
		this._initEditNote();
		this._initDataNote();
	};

	this._editNote = function ( text ) {

		// INSERT THE NOTE TEXT INSIDE THE TEXTAREA
		this.textArea.value = text;

		// ANIMATE THE NOTES CONTROLS
		_c.transform( this.editControls, 'translate3d( -330px, 0, 0 )' );
	};

	this._initEditNote = function () {
		var self = this,
				noteContainer = document.querySelectorAll( '.notes-list li a' );

		// FOR EVERY NOTE IN THE LIST,
		// WHEN I CLICK ON IT, SET THE NOTE TEXT IN THE TEXTBOX
		// SET THE SELECTEDNOTE VARIABLE TO THE DATA-NOTE VALUE OF THE CLICKED NOTE
		// AND PUT A CHECKMARK ON THE CLICKED NOTE.
		for ( var i = 0; i < noteContainer.length; i++ ) {
			_c.click( noteContainer[i], function () {
				self._editNote( this.querySelectorAll( 'p' )[0].innerHTML );
				self.selectedNote = this.getAttribute( 'data-note' );

				for ( var j = 0; j < noteContainer.length; j++ ) {
					_c.removeClass( noteContainer[j], 'active' );
				}

				_c.addClass( this, 'active' );
			}, false );
		}
	};

	this._cancelEdit = function () {
		var notes = document.querySelectorAll( '.notes-list li a' );

		// CLEAR THE TEXTBOX
		this.textArea.value = '';

		// RESET THE NOTES CONTROLS
		_c.transform( this.editControls, 'translate3d( 0, 0, 0 )' );

		// REMOVE ANY CHECKBOX IN THE NOTES LIST
		for ( var i = 0; i < notes.length; i++ ) {
			_c.removeClass( notes[i], 'active' );
		}
	};

	this._deleteNote = function () {
		var	self = this,
				notes = document.querySelectorAll( '.notes-list li' ),
				noteID = this.selectedNote - 1;

		// CLEAR THE TEXTBOX
		this.textArea.value = '';

		// ADD CLASS 'SAVE-NOTE' TO THE NOTE YOU ARE DELETING
		// SINCE IT CONTAINS A CSS3 ANIMATION
		_c.addClass( notes[noteID], 'save-note' );

		// RESET THE NOTES CONTROLS
		_c.transform( this.editControls, 'translate3d( 0, 0, 0 )' );
		
		// AFTER THE ANIMATION, REMOVE THE NOTE FROM THE DOM
		// RUN THE CANCELEDIT() AND INITDATANOTE() FUNCTIONS
		setTimeout( function () {
			notes[noteID].remove();
			self._cancelEdit();
			self._initDataNote();
		}, 490);
	};

	this._saveNote = function () {
		var self = this,
				html =  '<li>' + 
									'<a href="#">' +
										'<p class="note-title">' + this.textArea.value + '</p>' + 
										'<p class="note-timestamp">' + _c.timestamp( true, true ) + '</p>' +
									'</a>' +
								'</li>';

		// WHEN SAVING A NOTE, DELETE IT TO REPLACE IT ON TOP OF THE LIST
		this._deleteNote();		

		setTimeout( function () {

			// AFTER DELETING THE NOTE, ADD THE SAVED HTML TO THE TOP OF THE LIST
			_c.add( self.noteList[0], html );

			// TO PERFORM THE NEW NOTE ANIMATION, WE NEED TO REMOVE
			// THE 'NEW-NOTE' CLASS FROM THE PREVIOUS NEW NOTE
			// AND ADD IT TO THE ACTUAL NEW NOTE.
			// THIS CLASS CONTAINS CSS3 ANIMATION
			var notes = document.querySelectorAll( '.notes-list li' );

			for ( var i = 0; i < notes.length; i++ ) {
				_c.removeClass( notes[i], 'new-note' );
			}

			_c.addClass( notes[0], 'new-note' );

			self._cancelEdit();
			self._initEditNote();
			self._initDataNote();
		}, 510);
	};
	this._openAlert = function () {

		// OPEN DELETE CONFIRMATION CONTROLS
		_c.transform( this.editControls, 'translate3d( -660px, 0, 0 )' );
	};
	this._closeAlert = function() {
		
		// CLOSE DELETE CONFIRMATION CONTROLS
		_c.transform( this.editControls, 'translate3d( -330px, 0, 0 )' );
	};
}

/***********************************************************
 * LIST SEARCH ENGINE
 * THIS FUNCTION ALLOWS YOU TO SEARCH A LONG LIST OF ITEMS
 ***********************************************************/
function ListSearch () {

	// PROVIDE THE ID OF THE SEARCH FIELD
	// THE ID OF THE LIST YOU WANT TO SEARCH IN
	this._init = function ( searchFieldID, listID ) {
		this.searchField = document.getElementById( searchFieldID );
		this.listID = listID;
		this._initListItems();

		this._initEvents();
	};

	this._initEvents = function () {
		var self = this;

		// PERFORM THE FILTERING ON KEY UP
		this.searchField.addEventListener( 'keyup', function () {
			self._filter( this.value );
		}, false );
	};

	this._filter = function ( searchValue ) {

		// THE SEARCH PERFORMS NEEDS TO IGNORE ANY SPECIAL CHARACTERS
		// THIS IS WHY WE BUILD A REGEX WITH ALL THE SPECIAL CHARATERS WE WANT
		// TO ESPACE.
		var specialCharacterRegex = /[Ã Ã¢Ã¤Ã©Ã¨ÃªÃ«Ã¯Ã®Ã¶Ã´Ã»Ã¹Ã¼Ã§]/g,

				// THEN PROVIDE AN OBJECT WITH WHAT WE WANT EACH SPECIAL CHARACTERS
				// TO BE REPLACED WITH
				specialCharacters = {
					"Ã ": "a",
					"Ã¢": "a",
					"Ã¤": "a",
					"Ã©": "e",
					"Ã¨": "e",
					"Ãª": "e",
					"Ã«": "e",
					"Ã¯": "i",
					"Ã®": "i",
					"Ã¶": "o",
					"Ã´": "o",
					"Ã»": "u",
					"Ã¹": "u",
					"Ã¼": "u",
					"Ã§": "c"
				},

				// THEN WE REPLACE ALL THE SPECIAL CHARACTERS IN THE SEARCH STRING
				modifiedString = searchValue.replace( specialCharacterRegex, function ( match ) {
					return specialCharacters[match];
				}),

				// THEN CREATE A REGULAR EXPRESSIONS WITH THAT MODIFIED STRING
				// AND MAKE SURE IT IGNORES CAPITALIZATION ( THE 'i' )
				regex = new RegExp( modifiedString, 'i' );

		// FOR EACH LIST ELEMENTS THAT DOES NOT MATCH THE REGULAR EXPRESSION
		// HIDE IT.
		for ( var i = 0; i < this.listItem.length; i++ ) {

			// USE THE SAME METHOD TO ESCAPE ALL SPECIAL CHARACTERS IN THE 
			// LIST ITEM TEXT IN ORDER TO COMPARE IT WITH THE REGULAR EXPRESSION
			// CREATED ABOVE.
			var listItem = this.listItem[i].innerHTML.replace( specialCharacterRegex, function ( match ) {
						return specialCharacters[match];
					});

			if ( !regex.test( listItem ) ) {
				_c.hide( this.listItem[i].parentNode );
			} else {
				_c.show( this.listItem[i].parentNode );
			}
		}
	};

	this._initListItems = function() {
		this.list = document.getElementsByClassName( this.listID )[0];
		this.listItem = this.list.querySelectorAll( 'li a' );
	};

	this._updateListItems = function( choices, classesToAdd ) {
		var oldItems = this.list.getElementsByClassName( 'filter-item' ),
				oldItemsCopy = [];
		
		for (var i = 0; i < oldItems.length; i++) {
			oldItemsCopy[i] = oldItems[i];
		}
		
		oldItemsCopy.forEach(function ( elem ) {
			this.removeChild(elem.parentElement);
		}, this.list);
		
		choices.forEach( function ( elem ) {
			var li = document.createElement( 'li' ),
					a = document.createElement( 'a' ),
					text = document.createTextNode( elem );
			
			li.appendChild( a );
			a.appendChild( text );
			a.setAttribute( 'href', '#' );
			
			_c.addClass( a, 'filter-item' );

			if ( classesToAdd ) {
				if ( classesToAdd instanceof Array ) {
					for ( var i = 0; i < classesToAdd.length; i++ ) {
						_c.addClass( a, classesToAdd[i] );
					}
				} else {
					_c.addClass( a, classesToAdd );
				}
			}
			
			this.appendChild( li );
		}, this.list );
		
		this.listItem = this.list.querySelectorAll( 'li a' );
	};
}

/***************************************************************
 * INITIALIZE FILTERS
 ***************************************************************/
function Filter () {
	this._init = function ( filterListsClass, filterButtonClass, tableID ) {
		var i;

		this.wrapper = document.getElementById( 'pusher' ); // CONTENT WRAPPER
		this.nav = document.getElementById('nav-bar'); // NAVIGATION BAR
		this.curtain = document.getElementById('content-curtain__filter'); // CONTENT CURTAIN
		
		// FILTER BUTTON
		this.triggers = document.getElementsByClassName( filterButtonClass );
		for ( i = 0; i < this.triggers.length; i++ ) {
			
			// SET A DATA-BUTTON-INDEX ATTRIBUTE TO ALL FILTER TRIGGERS
			// TO TRACK WHICH ONE WAS CLICKED
			this.triggers[i].setAttribute( 'data-button-index', ( i ).toString() );
		}
		this.filterIndex = 0; // FILTER BUTTON INDEX
		this.filterContainers = document.getElementsByClassName( filterListsClass ); // FILTER CONTAINER
		this.listContainer = []; // FILTER LIST CONTAINER
		this.back = []; // FILTER LIST BACK BUTTON
		this.search = []; // FILTER SEARCH FIELD
		this.filterKeyword = []; // FILTER KEYWORD
		this.filterColumn = []; // COLUMN ASSOCIATED TO THE FILTER
		this.reset = []; // RESET FILTER BUTTON

		// PUSH ALL ELEMENTS IN THE PROPER ARRAY
		// THIS WILL ALLOW US TO FILTER THE PROPER TABLE COLUMNS
		// DEPENDING ON WHICH FILTER IS SELECTED
		for ( i = 0; i < this.filterContainers.length; i++ ) {
			var filterContainers = this.filterContainers[i];

			this.listContainer.push( filterContainers.getElementsByClassName( 'list' )[0] );
			this.back.push( filterContainers.querySelectorAll( '.toolbox-back' )[0] );
			this.search.push( filterContainers.getElementsByClassName( 'list-search' )[0] );
			
			// INITIALLY, ALL KEYWORDS ARE UNDEFINED
			this.filterKeyword.push( undefined );

			//Â PUSH THE COLUMN ASSOCIATED TO EACH FILTER
			this.filterColumn.push( parseInt( this.triggers[i].getAttribute( 'data-column' ) ) - 1 );
			this.reset.push( filterContainers.getElementsByClassName( 'list' )[0].getElementsByClassName( 'reset-filter' )[0] );
		}

		this.table = document.getElementById( tableID ); // TABLE YOU WANT TO FILTER
		this.tableRows = this.table.querySelectorAll( 'tbody' )[0].children; // TABLE ROWS
		
		// CREATE AN ARRAY TO STORE THE STATE OF THE OPENED FILTER
		this.open = [];
		for ( i = 0; i < this.filterContainers.length; i++ ) {
			
			// INITIALLY THEY ARE ALL CLOSED
			this.open.push( false );
		}

		this._initEvents();
	};

	this._initEvents = function () {
		var self = this,
				bodyClick = function ( index ) {
					self._closeFilter( index );
					document.removeEventListener( _c.eventType(), bodyClick, false );
				},
				backClick = function ( index ) {
					self._closeFilter( index );
					self.back[index].removeEventListener( _c.eventType(), backClick, false );
				};

		// SET CLICK/TOUCH EVENT TO ALL FILTER BUTTONS
		for ( var i = 0; i < this.triggers.length; i++ ) {
			_c.click( this.triggers[i], function ( e ) {
				e.stopPropagation();
				e.preventDefault();

				// SET THE FILTER INDEX == TO THAT OF THE CLICKED BUTTON FOR TRACKING OF WHICH BUTTON WAS CLICKED.
				self.filterIndex = this.getAttribute( 'data-button-index' );

				// OPEN THE APPROPRIATE FILTER BASEDON THE FILTER INDEX
				self._openFilter( self.filterIndex );

				// SET A CLICK/TOUCH EVENT TO THE WHOLE BODY, EXCEPT FOR THE OPENED FILTER
				// BASED ON THE FILTER EVENT.
				_c.click( document, function ( e ) {
					if ( self.open[self.filterIndex] && !_c.hasParent( e.target, self.filterContainers[self.filterIndex].id ) ) {
						bodyClick( self.filterIndex );
					}
				});

				// SET CLICK/TOUCH EVENT TO EACH LIST ELEMENTS OF EACH FILTER LIST
				// SO THAT THEY SELECT THE CLICKED LIST ITEM, FILTER THE TABLE, AND CLOSE
				// THE FILTER.
				_c.click( self.listContainer[self.filterIndex], function ( e ) {
					e.preventDefault();

					var t = e.target;

					if ( t.tagName === 'A' ) {
						if ( _c.hasClass( t, 'active' ) ) {
							return;
						}
						if ( _c.hasClass( t, 'reset-filter' ) ) {
							self._select( self.filterIndex, t );
							self._resetFilter( self.filterIndex );
							bodyClick( self.filterIndex );
							return;
						}

						self.filterKeyword[self.filterIndex] = t.textContent;
						self._select( self.filterIndex, t );
						self._filter( self.triggers.length );
						bodyClick( self.filterIndex );
					}
				});
			});

			// SET CLICK/TOUCH EVENT TO THE CLOSE BUTTON OF THE SELECTED FILTER
			_c.click( self.back[i], function () {
				backClick( self.filterIndex );
			});

			_c.click( this.curtain, function () {
				bodyClick( self.filterIndex );
			});
		}
	};

	this._openFilter = function( index ) {
		this.open[index] = true;
		_c.addClass( [this.wrapper, this.nav, this.curtain], 'level-1' );
		_c.addClass( this.curtain, 'active' );
		_c.addClass( this.filterContainers[index].children[0], 'toolbox-level--open' );

		setTimeout( function () {
			document.body.style.overflowY = 'hidden';
		}, 310 );
	};

	this._closeFilter = function ( index ) {
		_c.removeClass( [this.wrapper, this.nav, this.curtain], 'level-1' );
		_c.removeClass( this.curtain, 'active' );
		_c.removeClass( this.filterContainers[index].children[0], 'toolbox-level--open' );

		setTimeout( function () {
			document.body.style.overflowY = '';
		}, 310 );

		var self = this;
		setTimeout( function () {
			
			// IF THERE IS A SEARCH FIELD IN THE LIST, CLEAR THE SEARCH FIELD
			if ( self.search[index] ) {
				self.search[index].value = '';
				
				// CLEAR THE SEARCH FILTER BY SHOWING ALL LIST ELEMENTS
				for ( var i = 0; i < self.listContainer[index].children.length; i++ ) {
					_c.show( self.listContainer[index].children[i] );
				}
			}
		}, 510);
		
		this.open[index] = false;
	};

	this._select = function ( index, selectedAnchor ) {

		// REMOVE ALL 'ACTIVE' CLASSES TO ALL LIST ANCHORS
		for ( var i = 0; i < this.listContainer[index].children.length; i++ ) {
			_c.removeClass( this.listContainer[index].children[i].children[0], 'active' );
		}
		
		// ADD AN 'ACTIVE' CLASS TO THE CLICKED ANCHOR
		_c.addClass( selectedAnchor, 'active');
		
		// SET THE SELECTED ANCHOR TEXT TO THE APPROPRIATE FILTER BUTTON
		this.triggers[index].textContent = selectedAnchor.textContent;
	};

	this._resetFilter = function ( index ) {
		
		// REMOVE APPROPRIATE KEYWORD FROM THE FILTERKEYWORD
		if (index) {
			this.filterKeyword[index] = undefined;
			this.triggers[index].textContent = this.reset[index].textContent;
		} else {
			for (var i = 0; i < this.filterColumn.length; i++) {
				this.filterKeyword[i] = undefined;
				this.triggers[i].textContent = this.reset[i].textContent;
			}
		}
		
		// RUN FILTER FUNCTION TO UPDATE TABLE WITH NEW KEYWORD
		this._filter();
	};

	this._filter = function () {
		var i;
		
		// CHECKS THROUGH THE FILTERKEYWORK TO SHOW OF HIDE TABLE ROWS
		if ( this.filterKeyword[0] && this.filterKeyword[1] && this.filterKeyword[2] ) {
			for ( i = 0; i < this.tableRows.length; i++ ) {
				var row = this.tableRows[i];
				if ( row.children[ this.filterColumn[0] ].textContent.trim() === this.filterKeyword[0] && row.children[ this.filterColumn[1] ].textContent.trim() === this.filterKeyword[1] && row.children[ this.filterColumn[2] ].textContent.trim() === this.filterKeyword[2] ) {
					_c.showTableRow( row );
				} else {
					_c.hide( row );
				}
			}
		} else if ( this.filterKeyword[0] && this.filterKeyword[1] ) {
			for ( i = 0; i < this.tableRows.length; i++ ) {
				var row = this.tableRows[i];
				if ( row.children[ this.filterColumn[0] ].textContent.trim() === this.filterKeyword[0] && row.children[ this.filterColumn[1] ].textContent.trim() === this.filterKeyword[1] ) {
					_c.showTableRow( row );
				} else {
					_c.hide( row );
				}
			}
		} else if ( this.filterKeyword[0] && this.filterKeyword[2] ) {
			for ( i = 0; i < this.tableRows.length; i++ ) {
				var row = this.tableRows[i];
				if ( row.children[ this.filterColumn[0] ].textContent.trim() === this.filterKeyword[0] && row.children[ this.filterColumn[2] ].textContent.trim() === this.filterKeyword[2] ) {
					_c.showTableRow( row );
				} else {
					_c.hide( row );
				}
			}
		} else if ( this.filterKeyword[1] && this.filterKeyword[2] ) {
			for ( i = 0; i < this.tableRows.length; i++ ) {
				var row = this.tableRows[i];
				if ( row.children[ this.filterColumn[1] ].textContent.trim() === this.filterKeyword[1] && row.children[ this.filterColumn[2] ].textContent.trim() === this.filterKeyword[2] ) {
					_c.showTableRow( row );
				} else {
					_c.hide( row );
				}
			}
		} else if ( this.filterKeyword[0] ) {
			for ( i = 0; i < this.tableRows.length; i++ ) {
				var row = this.tableRows[i];
				if ( row.children[ this.filterColumn[0] ].textContent.trim() === this.filterKeyword[0] ) {
					_c.showTableRow( row );
				} else {
					_c.hide( row );
				}
			}
		}  else if ( this.filterKeyword[1] ) {
			for ( i = 0; i < this.tableRows.length; i++ ) {
				var row = this.tableRows[i];
				if ( row.children[ this.filterColumn[1] ].textContent.trim() === this.filterKeyword[1] ) {
					_c.showTableRow( row );
				} else {
					_c.hide( row );
				}
			}
		}  else if ( this.filterKeyword[2] ) {
			for ( i = 0; i < this.tableRows.length; i++ ) {
				var row = this.tableRows[i];
				if ( row.children[ this.filterColumn[2] ].textContent.trim() === this.filterKeyword[2] ) {
					_c.showTableRow( row );
				} else {
					_c.hide( row );
				}
			}
		} else if ( !this.filterKeyword[0] ) {
			for ( i = 0; i < this.tableRows.length; i++ ) {
				_c.showTableRow( this.tableRows[i] );
			}
		} else if ( !this.filterKeyword[1] ) {
			for ( i = 0; i < this.tableRows.length; i++ ) {
				_c.showTableRow( this.tableRows[i] );
			}
		} else if ( !this.filterKeyword[2] ) {
			for ( i = 0; i < this.tableRows.length; i++ ) {
				_c.showTableRow( this.tableRows[i] );
			}
		}
	};

	this._readFilterColumnValues = function ( index ) {
		var columnIndex = this.filterColumn[index],
				columnValues = [];
		
		for ( var j = 0; j < this.tableRows.length; j++ ) {
			var row = this.tableRows[j],
					column = row.children[columnIndex],
					value = column == undefined ? undefined : column.textContent.trim();
			
			if ( value && columnValues.indexOf( value ) == -1 ) {
				columnValues.push( value );
			}
		}

		return columnValues;
	};
}

/****************************************************
 * VALIDATION ENGINE
 ****************************************************/
function validation( validationType, required, value ) {
	var regExp = {
				email: /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/ig,
				url: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/ig
			};

	switch( validationType ) {
		case 'email':
			if ( !required && value ) {
				return regExp.email.test( value )
			} else if ( required ) {
				if ( !value ) {
					return false;
				} else {
					return regExp.email.test( value )
				}
			}
			return false;
			break;

		case 'url':
			if ( !required && value ) {
				return regExp.url.test( value )
			} else if ( required ) {
				if ( !value ) {
					return false;
				} else {
					return regExp.url.test( value )
				}
			}
			return false;
			break;

		case 'text':
			if ( required ) {
				if ( !value ) {
					return false;
				} else {
					return true;
				}
			}
			return false;
			break;
	}
	return false;
}


/********************************************
 * EMAIL ARCHIVE FUNCTION
 * INCLUDES FORM VALIDATION
 ********************************************/
function EmailArchive () {
	this._init = function () {
		this.inputs = document.querySelectorAll( '.archive-email-form fieldset input' );
		this.textArea = document.querySelectorAll( '.archive-email-form fieldset textarea' )[0];
		this.archiveSelected = document.querySelectorAll( '.email-archive-list input[type="hidden"]' )[0];
		this.cancelBtn = document.getElementById( 'email-archive-cancel' );

		this._initEvents();
	};

	this._initEvents = function () {
		var self = this;

		_c.click( this.cancelBtn, function() {
			self._cancelEmailArchive();
			toolbox._closeMenu( 1 );
		});
	};

	this._cancelEmailArchive = function () {
		[].forEach.call( this.inputs, function ( input ) {
			input.value = '';
		});
		this.textArea.value = '';
		this.archiveSelected.value = '';

		cancelArchiveEmail();
	};
}

/**************************************
 * SAVE HIGHLIGHTS
 **************************************/
function SaveHighlight () {
	this._init = function () {
		this.highlights = document.getElementsByClassName( 'highlights' );
		this.saveMarker = document.querySelectorAll( '.highlights .save-marker' );
		this.textareas = document.querySelectorAll( '.highlights textarea' );
		this.highlightsTextarea = [];

		for ( var i = 0; i < this.textareas.length; i++ ) {
			this.highlightsTextarea.push( this.textareas[i] );
		}
		
		this._initEvents();
	};

	this._initEvents = function () {
		var self = this;

		this.highlightsTextarea.forEach( function ( elem, i ) {
			elem.addEventListener( 'keyup', function () {
				self._save(i);
			}, false );
		});
	};

	this._save = function ( index ) {

		// REPLACE THESE TWO LINE WITH THE AJAX SAVE FUNCTION.
		_c.show( this.saveMarker[index], 1000 );
		_c.hide( this.saveMarker[index], 2000 );
	};
}

/**************************************
 * ADD MEDIATIVE VALUE TO GRAPH IN PROGRAM OVERVIEW
 **************************************/
function Mediative () {
	this._init = function () {
		this.input = document.getElementsByClassName( 'mediative-value__input' )[0];
		this._initEvents();
	};

	this._initEvents = function () {
		var self = this;
		this.input.addEventListener( 'keyup', function ( e ) {
			self._filterInput( this, e );
		}, false );
	};

	this._updateGraph = function ( value ) {
		this.graph.series[1].setData(
			[ 1230, 867, 582, 449, 312, 72, 56, parseInt(value) ]
		);
	};

	this._filterInput = function ( self, event ) {
		var key = window.event.keyCode,
				cursorPosition = self.selectionStart - 1;

		// because of the nature of the .replace() method, we need to reposition the cursor in the text input on every keystroke.
		if ( key === 37 || key === 39 || key === 8 || key === 46 || ( key > 95 && key < 106 ) || key === 110 || key === 13 ) {

			// this statement makes sure that if the user inputs a comma from the num pad with a french canadian
			// keyboard, the comma will be filtered and the karet will remain at the same place.
			if ( /[,]/g.test( self.value ) ) {
				if ( key === 110 ) {
					cursorPosition = self.selectionStart - 1;
				}
				self.value = self.value.toString().replace( /[,]/g, '' );
				self.setSelectionRange( cursorPosition, cursorPosition );
			}
		} else {
			cursorPosition = self.selectionStart - 1;

			if ( ( key < 58 && key > 47 ) || key === 190 || key === 46 ) {
				cursorPosition = self.selectionStart;
			}

			self.value = self.value.toString().replace( /[^0-9.]/g, '' );
			self.setSelectionRange( cursorPosition, cursorPosition );
		}
	};
}

/**************************************
 * URL VALIDATION ON PRIORITY PLACEMENT
 **************************************/
function ValidateTableURL() {
	this._init = function ( tableID ) {
		this.table = document.getElementById( tableID );
		this._initEvents();
	};

	this._initEvents = function () {
		var self = this;

		this.table.addEventListener( 'keyup', function ( e ) {
			if ( e.target.tagName === 'INPUT' ) {
				if ( e.target.value ) {
					_c.addClass( e.target, 'active' );
				} else {
					_c.removeClass( e.target, 'active' );
				}
			}
		}, false );

		_c.click( this.table, function ( e ) {
			if ( e.target.tagName === 'A' && _c.hasClass( e.target, 'test-url-button' ) ) {
				var url = e.target.previousElementSibling.value,
						httpRegex = new RegExp( 'http://' ),
						httpsRegex = new RegExp( 'https://' ),
						ftpRegex = new RegExp( 'ftp://' );

				if ( httpRegex.test( url ) || httpsRegex.test( url ) || ftpRegex.test( url ) ) {
					window.open( url, '_blank' );
				} else {
					window.open( 'http://' + url, '_blank' );
				}
			}
		});
	}
}

/**************************************
 * INITIALIZE GOOGLE MAPS WITH KML FILE
 **************************************/
function GoogleMap () {
	this._init = function () {
		this.placeholder = document.getElementsByClassName( 'map' )[0];
		this.map = new google.maps.Map( this.placeholder );
		this.kml = new google.maps.KmlLayer({

			// CHANGE KML FILE HERE
			url: 'http://www.justinweb.pro/compass/473809435.kml'
		});

		this._initEvents();
	};
	this._initEvents = function () {
		this.kml.setMap( this.map );
	};
}

/*************************************
 * VALIDATES PAGE TO MAKE SURE NO 	 *
 * UN-SAVED DATA WHEN LEAVING PAGE.  *
 *************************************/
function PageLeaveValidation() {
	this._doCheck = function () {
		var isValid = false;

		if ( document.getElementsByClassName( 'recommendation-textbox' )[0] ) {
			isValid = this._recommendationCheck();
		}

		if ( document.getElementsByClassName( 'highlight-textbox' )[0] ) {
			isValid &= this._highlightCheck();
		}

		if ( !document.getElementsByClassName( 'recommendation-textbox' )[0] && !document.getElementsByClassName( 'highlight-textbox' )[0] ) {
			isValid = true;
		}

		if ( isValid ) {
			this._leavePage();
			return true;
		}

		return false;
	};

	this._leavePage = function () {
		_c.loadingCurtain( 'on' );
	};
	
	this._recommendationCheck = function () {
		var recommendations = document.getElementsByClassName( 'recommendation-textbox' ),
				isValid = true;

		if ( recommendations.length === 0 ) {
			return true;
		}

		for ( var i = 0, len = recommendations.length; i < len; i++ ) {
			if ( recommendations[i].value.length > 300 ) {

				alert( _c.translator( 'characterLimitRecommendations', {
					limit: 300
				}));
				
				isValid = false;
			}
		}

		return isValid;
	};

	this._highlightCheck = function () {
		var highlights = document.getElementsByClassName( 'highlight-textbox' ),
				isValid = true;

		if ( highlights.length === 0 ) {
			return true;
		}

		for ( var i = 0, len = highlights.length; i < len; i++ ) {
			if ( highlights[i].value.length > 300 ) {

				alert( _c.translator( 'characterLimitHighlights', {
					limit: 300
				}));
				
				isValid = false;
			}
		}

		return isValid;
	};
}

/****************************
 * COOKIE HANDLING METHOD
 ****************************/
function Cookies() {
	this._createCookie = function ( name, value, days ) {
		var expires = undefined;

		if ( days ) {
			var date = new Date();

			date.setTime( date.getTime() + ( days * 24 * 60 * 60 * 1000 ) );

			expires = '; expires=' + date.toGMTString();
		} else {
			expires = '';
		}

		document.cookie = name + '=' + value + expires + '; path=/';
	};

	this._readCookie = function ( name ) {
		var nameEQ = name + '=',
				ca = document.cookie.split( ';' );

		for ( var i = 0; i < ca.length; i++ ) {
			var c = ca[i];

			while ( c.charAt( 0 ) == ' ' ) {
				c = c.substring( 1, c.length );
			}

			if ( c.indexOf( nameEQ ) == 0 ) {
				return c.substring( nameEQ.length, c.length );
			}
		}
		return null;
	};

	this._eraseCookie = function ( name ) {
		createCookie( name, '', -1 );
	};
}

/****************************
 * RETINA IMAGE REPLACEMENTS
 ****************************/
function RetinaImages() {
	this._init = function () {
		this.images = document.getElementsByTagName( 'img' );

		this._initEvents();
	};

	this._initEvents = function () {
		var self = this;
		for ( var i = 0; i < this.images.length; i++ ) {
			var rootURL = window.location.origin,
					imageURL = this.images[i].getAttribute( 'src' ),
					imageType = imageURL.substr( -4 ),
					imageName = imageURL.substr( 0, imageURL.length - 4 ),
					ajax = new XMLHttpRequest();

			ajax.addEventListener( 'readystatechange', function() {
				if ( ajax.readyState === 4 ) {
					if ( ajax.status == 404 ) {
						console.log( imageName + imageType + ' could not be found.' );
					} else {
						self.images[i].setAttribute( 'src', imageName + '@2x' + imageType );
					}
				}
			}, false );

			ajax.open( 'GET', rootURL + imageName + '@2x' + imageType, false );
			ajax.send();
		}
	}
}

/****************************
 * NOTIFICATION MESSAGE
 ****************************/
function Notification () {
	this._init = function () {
		this.curtain = document.getElementById( 'notification-curtain' );
		this.messageContainer = document.getElementById( 'notification-message' );
		this.message = document.getElementById( 'notification-text' );
		this.button = document.getElementById( 'notification-button' );
		this.content = document.getElementsByClassName( 'pusher' )[0];
	};

	this._initEvents = function ( reloadPage ) {
		var self = this;
		
		_c.click( this.button, function () {
			self._dismissNotification();
			
			if ( reloadPage )	{
				location.reload();
			}
		});
	};

	this._activateNotification = function ( infoMessage ) {
		this._activateProcess( false, infoMessage );
	};

	this._activateJSONNotification = function ( data ) {
		var obj = JSON.parse( data );

		if ( obj.relaodPage ) {
			this._activateProcess( obj.relaodPage, obj.infoMessage );
		} else {
			this._activateProcess( false, data );
		}
	};
	
	this._activateProcess = function( reloadPage, infoMessage ) {
		var self = this,
				infoMessage = infoMessage.replace( /(\\\')+/g, "'" );

		this._initEvents( reloadPage );
		this.message.innerHTML = infoMessage;

		setTimeout( function () {
			_c.addClass( self.curtain, 'active' );
			_c.addClass( self.content, 'notification-active' );
		}, 10 );
	}
	
	this._dismissNotification = function () {
		var self = this;

		_c.removeClass( this.curtain, 'active' );
		_c.removeClass( this.content, 'notification-active' );

		setTimeout( function () {
			self.message.innerHTML = '';
		}, 500 );
	};
}

/****************************
 * CACHE MANIFEST
 ****************************/

// Check if a new cache is available on page load.
function SoftwareUpdate () {
	var cache = window.applicationCache;

	window.applicationCache.addEventListener( 'updateready', function( e ) {
		if ( window.applicationCache.status == window.applicationCache.UPDATEREADY ) {
			
			// Browser downloaded a new app cache.
			window.location.reload();
		}
	}, false );
}

SoftwareUpdate();

/****************************
 * SUPPORT FORM
 ****************************/
function SupportForm() {
	this._init = function() {
		this.trigger = document.getElementById( 'support-button' );
		this.toggles = document.getElementById( 'support-form-tab' );
		this.support = {
			curtain: document.getElementById( 'content-curtain__support' ),
			curtainInner: document.getElementById( 'support-inner-curtain' ),
			lightbox: document.getElementById( 'support' ),
			lightboxInner: document.getElementById( 'support__inner' ),
			closeBtn: document.getElementById( 'close-support-button' ),
			sendSupportBtn: document.getElementsByClassName( 'support__send-button' )[0],
			sendChangeBtn: document.getElementsByClassName( 'change__send-button' )[0],
			header: document.getElementsByClassName( 'support__header' )[0]
		};
		this.selector = {
			where: document.getElementById( 'where-did-take-place-button' ),
			what: document.getElementById( 'what-was-issue-button' )
		};
		this.toolbox = {
			where: document.getElementById( 'support-toolbox-where' ),
			what: document.getElementById( 'support-toolbox-what' ),
			closeBtn: document.getElementsByClassName( 'toolbox-back' )
		};
		this.supportFormInput = {
			description: document.getElementsByClassName( 'support__description' )[0],
			alert: document.getElementById( 'support__alert' ),
			browseFileBtn: document.getElementById( 'support__browse' ),
			browseFileHint: document.getElementById( 'support__hint' ),
			fileUpload: document.getElementsByClassName( 'support__file-upload' )[0]
		};
		this.changeFormInput = {
			description: document.getElementsByClassName( 'change__description' )[0]
		};
		this.alerts = {
			what: document.getElementById( 'support-what-alert' ),
			description: document.getElementById( 'support-description-alert' ),
			file: document.getElementById( 'support-file-alert' )
		};
		this.hiddenInputs = {
			where: document.getElementsByClassName( 'where-input' )[0],
			what: document.getElementsByClassName( 'what-input' )[0]
		};

		this.section = ( this.support.lightbox.getAttribute( 'data-location' ) ) ? this.support.lightbox.getAttribute( 'data-location' ) : 'Search page';

		var whereList = this.toolbox.where.querySelectorAll( '.toolbox__content #where-list li a' );

		for ( var i = 0; i < whereList.length; i++ ) {
			if ( whereList[i].textContent === this.section ) {
				_c.addClass( whereList[i], 'active' );
			}
		}

		// Put the current section title in the where selector
		this.selector.where.textContent = this.section;

		this._init_events();
	};

	this._init_events = function () {
		var self = this;

		_c.click( this.trigger, function ( e ) {
			e.preventDefault();
			self._openSupportLightbox();
		});

		_c.click( this.toggles, function ( e ) {
			var t = e.target;

			if ( t.tagName === 'A' ) {
				self._clearSupportLightbox();

				if ( t.getAttribute( 'href' ) === '#support-form-support' ) {
					_c.removeClass( self.support.lightbox, 'support--change-tab' );
					_c.addClass( self.support.lightbox, 'support--support-tab' );
					self.supportFormInput.browseFileHint.textContent = _c.translator( 'noFileChosen' );
					description.updateCounter(); //to reset the description letters counter
				}

				if ( t.getAttribute( 'href' ) === '#support-form-request-change' ) {
					_c.removeClass( self.support.lightbox, 'support--support-tab' );
					_c.addClass( self.support.lightbox, 'support--change-tab' );
					change_description.updateCounter(); //to reset the description letters counter
				}
			}
		});

		_c.click( this.selector.where, function ( e ) {
			e.preventDefault();
			self._openToolbox( self.toolbox.where );
		});

		_c.click( this.toolbox.where, function ( e ) {
			var listItems = self.toolbox.where.querySelectorAll( '.toolbox__content ul li a' ),
					t = e.target;

			if ( t.tagName === 'A' ) {
				for ( var i = 0; i < listItems.length; i++ ) {
					_c.removeClass( listItems[i], 'active' );
				}

				_c.addClass( t, 'active' );
				self.selector.where.textContent = t.textContent;
				self.hiddenInputs.where.value = self.selector.where.textContent;
				self._closeToolbox();
			}
		});

		_c.click( this.toolbox.what, function ( e ) {
			var listItems = self.toolbox.what.querySelectorAll( '.toolbox__content ul li a' ),
					t = e.target;

			if ( e.target.tagName === 'A' ) {
				for ( var i = 0; i < listItems.length; i++ ) {
					_c.removeClass( listItems[i], 'active' );
				}

				_c.addClass( t, 'active' );
				self.selector.what.textContent = t.textContent;
				self.hiddenInputs.what.value = self.selector.what.textContent;
				self._closeToolbox();
			}
		});

		_c.click( this.selector.what, function ( e ) {
			e.preventDefault();
			self._openToolbox( self.toolbox.what );
		});

		[].forEach.call( this.toolbox.closeBtn, function ( close ) {
			_c.click( close, function ( e ) {
				e.preventDefault();
				self._closeToolbox();
			});
		});

		_c.click( this.support.curtainInner, function () {
			self._closeToolbox();
		});

		_c.click( this.support.sendSupportBtn, function ( e ) {
			if ( self._validate( 'support' ) ) {
				self._closeSupportLightbox();

				setTimeout( function () {
					self._clearSupportLightbox();
				}, 600 );

				return true;
			} else {
				e.preventDefault();
				return false;
			}
		});

		_c.click( this.support.sendChangeBtn, function ( e ) {
			if ( self._validate( 'change' ) ) {
				self._closeSupportLightbox();

				setTimeout( function () {
					self._clearSupportLightbox();
				}, 600 );

				return true;
			} else {
				e.preventDefault();
				return false;
			}
		});

		_c.click( this.support.closeBtn, function ( e ) {
			e.preventDefault();
			self._closeSupportLightbox();

			setTimeout( function () {
				self._clearSupportLightbox();
			}, 500 );
		});

		this.supportFormInput.fileUpload.addEventListener( 'change', function () {
			if ( this.value ===  '' ) {
				self.supportFormInput.browseFileHint.textContent = _c.translator( 'noFileChosen' );
			} else {
				self.supportFormInput.browseFileHint.textContent = this.value.substr( this.value.lastIndexOf('\\') + 1 ) + ' - ' + ( this.files[0].size / 1048576 ).toFixed( 2 ) + _c.translator( 'megaByte' );
			}

			if ( self.supportFormInput.fileUpload.value ) {
				_c.fileValidation( ['pdf', 'png', 'jpeg', 'jpg', 'bmp', 'gif'], 10485760, self.supportFormInput.fileUpload, self.supportFormInput.alert );
			} else {
				self.supportFormInput.fileUpload.value = '';
			}
		}, false );

		_c.click( this.supportFormInput.browseFileBtn, function ( e ) {
			e.preventDefault();
			self.supportFormInput.fileUpload.click();
		});
	};

	this.delayEvent = function ( e ) {
		if ( e.suspend() ) {
			this.rememberEvent( e );
			return true;
		} else {
			return false;
		}
	};

	this._openSupportLightbox = function () {
		_c.show( this.support.lightbox );
		_c.addClass( [this.support.lightbox, this.support.curtain], 'active' );
		this.hiddenInputs.where.value = this.section;
	};

	this._closeSupportLightbox = function () {
		_c.removeClass( [this.support.lightbox, this.support.curtain], 'active' );
	};

	this._clearSupportLightbox = function () {
		var listItems = {
			where: this.toolbox.what.querySelectorAll( '#support-toolbox-where .toolbox__content ul li a' ),
			what: this.toolbox.what.querySelectorAll( '#support-toolbox-what .toolbox__content ul li a' )
		};

		this.selector.where.textContent = this.section;
		this.hiddenInputs.where.value = this.section;
		this.supportFormInput.description.value = '';
		this.changeFormInput.description.value = '';
		this.supportFormInput.fileUpload.value = '';

		this.selector.what.textContent = _c.translator( 'selectAnIssue' );
		this.supportFormInput.alert.textContent = _c.translator( 'fileTypeAndSize', {
			fileTypes: 'pdf, png, jpeg, jpg, bmp, gif',
			size: 10
		});

		_c.removeClass( this.supportFormInput.hint, 'alert' );

		this._dismissAlerts( 'support', 'all' );
		this._dismissAlerts( 'change', 'all' );

		for ( var i = 0; i < listItems.where.length; i++ ) {
			if ( listItems.where[i].textContent !== this.section ) {
				_c.addClass( listItems.where[i], 'active' );
			} else {
				_c.removeClass( listItems.where[i], 'active' );
			}
		}

		for ( var j = 0; j < listItems.what.length; j++ ) {
			_c.removeClass( listItems.what[j], 'active' );
		}
	};

	this._openToolbox = function ( toolboxID ) {
		_c.addClass( [toolboxID, this.support.curtainInner], 'active' );
		_c.addClass( [this.support.lightboxInner, this.support.header, this.support.curtainInner], 'support-toolbox-open' );
	};

	this._closeToolbox = function () {
		_c.removeClass( [this.toolbox.where, this.toolbox.what, this.support.curtainInner], 'active' );
		_c.removeClass( [this.support.lightboxInner, this.support.header, this.support.curtainInner], 'support-toolbox-open' );
	};

	this._validate = function ( form ) {
		if ( form === 'support' ) {
			var isValid = false;

			isValid = this._validateWhat();
			isValid &= this._validateDescription( 'support' );
			
			if ( this.supportFormInput.fileUpload.value ) {
				isValid &= _c.fileValidation( ['pdf', 'png', 'jpeg', 'jpg', 'bmp', 'gif'], 10485760, this.supportFormInput.fileUpload );
			}

			return isValid === 0 ? false : true;
		} else if ( form === 'change' ) {
			return this._validateDescription( 'change' );
		}
	};

	this._validateWhat = function () {
		var selector = this.selector.what.textContent;

		if ( selector === _c.translator( 'selectAnIssue' ) ) {
			this._formAlert( 'support', 'what' );
			return false;
		}

		this._dismissAlerts( 'support', 'what' );
		return true;
	};

	this._validateDescription = function ( type ) {
		var description = undefined;

		if ( type === 'support' ) {
			description = this.supportFormInput.description;
		} else if ( type === 'change' ) {
			description = this.changeFormInput.description;
		}
		
		if ( description.value ) {
			this._dismissAlerts( type, 'description' );
			return true;
		}

		this._formAlert( type, 'description' );
		return false;
	};

	this._formAlert = function ( form, type ) {
		if ( form === 'support' ) {
			switch( type ) {
				case 'what':
					_c.addClass( document.getElementById( 'support-what-alert' ), 'alert' );
					break;

				case 'description':
					_c.addClass( document.getElementById( 'support-description-alert' ), 'alert' );
					break;

				case 'file':
					_c.addClass( document.getElementById( 'support-file-alert' ), 'alert' );
					break;
			}
		}

		if ( form === 'change' ) {
			switch( type ) {
				case 'description':
					_c.addClass( document.getElementById( 'change-description-alert' ), 'alert' );
					break;
			}
		}
	};

	this._dismissAlerts = function ( form, type ) {
		if ( form ===  'support' ) {
			switch( type ) {
				case 'all':
					_c.removeClass( [document.getElementById( 'support-what-alert' ), document.getElementById( 'support-description-alert' ), document.getElementById( 'support-file-alert' )], 'alert' );
					break;

				case 'what':
					_c.removeClass( document.getElementById( 'support-what-alert' ), 'alert' );
					break;

				case 'description':
					_c.removeClass( document.getElementById( 'support-description-alert' ), 'alert' );
					break;

				case 'file':
					_c.removeClass( document.getElementById( 'support-file-alert' ), 'alert' );
					break;
			}
		}

		if ( form === 'change' ) {
			switch( type ) {
				case 'all':
					_c.removeClass( document.getElementById( 'change-description-alert' ), 'alert' );
					break;

				case 'description':
					_c.removeClass( document.getElementById( 'change-description-alert' ), 'alert' );
					break;
			}
		}
	};
}

/***************
 * SORT TABLES *
 ***************/
function SortTable () {
	this._init = function ( tableID, checkbox ) {
		this.table = tableID;
		this.tableHeader = this.table.querySelectorAll( 'thead tr' )[0];
		this.tableBody = this.table.querySelectorAll( 'tbody' )[0];
		this.tableContent = this._storeTable( tableID, this.columnTypes );
		this.checkbox = checkbox;

		this._initEvents();
	};

	this._initEvents = function () {
		var self = this,
				sortBtns = this.tableHeader.children,
				checkbox = ( self.checkbox === undefined ) ? false : self.checkbox;

		for ( var i = 1, l = sortBtns.length; i < l; i++ ) {
			_c.click( sortBtns[i], function ( e ) {
				var sort = this.getAttribute( 'data-sorting' );

				if ( sort === 'ASC' ) {
					self._resetTableHeader();
					_c.addClass( this.children[0], 'DESC' );
					this.setAttribute( 'data-sorting', 'DESC' );
				} else if ( sort === 'DESC' ) {
					self._resetTableHeader();
					_c.addClass( this.children[0], 'ASC' );
					this.setAttribute( 'data-sorting', 'ASC' );
				} else {
					self._resetTableHeader();
					_c.addClass( this.children[0], 'ASC' );
					this.setAttribute( 'data-sorting', 'ASC' );
				}

				var column = [ this.getAttribute( 'data-key' ) ],
						sort = this.getAttribute( 'data-sorting' ),
						newTable = self._sort( self.tableContent, column, [sort] );

				self._rebuildTable( newTable );
				self.tableContent = newTable;
			});
		}
	};

	this._resetTableHeader = function () {
		var sortBtns = this.tableHeader.children,
				sortIcons = this.tableHeader.querySelectorAll( 'th .sort' );

		for ( var i = 1, l = sortBtns.length; i < l; i++ ) {
			sortBtns[i].setAttribute( 'data-sorting', 'false' );
		}

		for ( var i = 0, l = sortIcons.length; i < l; i++ ) {
			sortIcons[i].className = 'sort';
		}
	};

	this._setDefaultSort = function ( columnIndex, sortDir ) {
		var sortBtn = this.tableHeader.children,
				column = [ columnIndex ],
				sort = [ sortDir ],
				newTable = this._sort( this.tableContent, column, sort );

		sortBtn[ columnIndex ].children[0].classList.add( sortDir );
		this._rebuildTable( newTable );
		this.tableContent = newTable;
	};

	this._storeTable = function ( tableID ) {
		var tableRows = tableID.querySelectorAll( 'tbody tr' ),
				content = [];

		[].forEach.call( tableRows, function ( tableRow ) {
			var row = {};
		
			for ( var i = 0; i < tableRow.children.length; i++ ) {
				row[i] = tableRow.children[i].innerHTML;
			}

			content.push( row );
		});
		
		return content;
	};

	this._sort = function ( tableContent, columns, order_by ) {
		if ( typeof columns == 'undefined' ) {
			columns = [];
			for ( var x = 0; x < tableContent[0].length; x++ ) {
				columns.push( x );
			}
		}

		if ( typeof order_by == 'undefined' ) {
			order_by = [];
			for ( var x = 0; x < tableContent[0].length; x++ ) {
				order_by.push( 'ASC' );
			}
		}

		function multisort_recursive( a, b, columns, order_by, index ) {
			var direction = order_by[index] == 'DESC' ? 1 : 0,
					is_numeric = !isNaN( +a[columns[index]].replace( /(<([^>]+)>)/ig, '' ).replace( /(\W)?/g, '' ) - +b[columns[index]].replace( /(<([^>]+)>)/ig, '' ).replace( /(\W)?/g, '' ) ),
					x = is_numeric ? +a[columns[index]].replace( /(<([^>]+)>)/ig, '' ).replace( /(\W)?/g, '' ) : a[columns[index]].replace( /(<([^>]+)>)/ig, '' ).replace( /(\W)?/g, '' ).toLowerCase(),
					y = is_numeric ? +b[columns[index]].replace( /(<([^>]+)>)/ig, '' ).replace( /(\W)?/g, '' ) : b[columns[index]].replace( /(<([^>]+)>)/ig, '' ).replace( /(\W)?/g, '' ).toLowerCase();

			if ( x < y ) {
				return direction == 0 ? -1 : 1;
			}

			if ( x == y ) {
				return columns.length - 1 > index ? multisort_recursive( a, b, columns, order_by, index + 1 ) : 0;
			}

			return direction == 0 ? 1 : -1;
		}

		return tableContent.sort( function ( a, b ) {
			return multisort_recursive( a, b, columns, order_by, 0 );
		});
	};

	this._rebuildTable = function ( arr ) {
		this.tableBody.innerHTML = '';

		for ( var i = 0; i < arr.length; i++ ) {
			var innerRow = '',
					rowID = '';

			for ( var key in arr[i] ) {
				if ( key == ( _c.objLength( arr[i] ) ) ) {
					rowID = arr[i][key];
					break;
				}

				innerRow += '<td>' + arr[i][key] + '</td>';
			}

			this.tableBody.innerHTML += '<tr>' + innerRow + '</tr>';
		}
	};
}

/********************************
 * AGENDA DRAG AND DROP REORDER *
 ********************************/
function SortAgenda () {
	this._init = function () {
		this.container = document.getElementsByClassName( 'roadmap--edit' )[0];
		this.list = document.querySelectorAll( '.roadmap--drag li' );
		this.sectionType = document.querySelectorAll( '.roadmap--edit li a span' );

		this._initEvents();
	};

	this._initEvents = function () {
		var self = this;

		$( '.sortable-1 > .ui-datalist-content' ).sortable({
			handle: '.drag-handle'
		}).bind( 'sortupdate', function() {
			saveOverview( self._returnSortOrder( this ) );
		});

		$( '.sortable-2 > .ui-datalist-content' ).sortable({
			handle: '.drag-handle'
		}).bind( 'sortupdate', function() {
			saveAgenda( self._returnSortOrder( this ) );
		});

		$( '.sortable-3 > .ui-datalist-content' ).sortable({
			handle: '.drag-handle'
		}).bind( 'sortupdate', function() {
			saveConclusion( self._returnSortOrder( this ) );
		});

		_c.click( this.container, function ( e ) {
			var t = e.target;

			if ( t.tagName === 'INPUT' ) {
				if ( t.getAttribute( 'checked' ) ) {
					t.removeAttribute( 'checked' );
				} else {
					t.setAttribute( 'checked', 'checked' );
				}
			}
		});
	};

	this._returnSortOrder = function ( elem ) {
		var list = elem.querySelectorAll( 'li a' ),
				newList = [];

		for ( var i = 0; i < list.length; i++ ) {
			if ( list[i].getAttribute( 'data-section-type' ) ) {
				newList.push( list[i].getAttribute( 'data-section-type' ) );
			}
		}

		return [{
			"name" : "agenda",
			"value" : newList
		}];
	};
}

/*************************************
 * BILLING OVERVIEW TABLE NAVIGATION *
 *************************************/
function TableNavigation () {
	this._init = function ( data ) {
		this.table1 = {};
		this.table1.container = document.getElementsByClassName( 'billing-overview__table-1-container' )[0];
		this.table1.table = this.table1.container.querySelectorAll( 'table' )[0];
		this.table1.header = this.table1.container.querySelectorAll( 'table thead tr th' );
		this.table1.curtain = this.table1.container.querySelectorAll( '.billing-overview__table-curtain' )[0];
		this.table1.height = undefined;
		this.table1.checkboxes = {
			master: document.getElementsByClassName( 'billing-overview__master-checkbox' )[0],
			slaves: document.getElementsByClassName( 'billing-overview__checkbox' )
		};

		this.table2 = {};
		this.table2.container = document.getElementsByClassName( 'billing-overview__table-2-container' )[0],
		this.table2.table = this.table2.container.querySelectorAll( 'table' )[0];
		this.table2.backBtns = document.getElementsByClassName( 'back-table-1' );
		this.table2.breadcrumb = document.getElementsByClassName( 'back-table-1__breadcrumb' );
		this.table2.curtain = this.table2.container.querySelectorAll( '.billing-overview__table-curtain' )[0];
		this.table2.height = undefined;
		this.table2.filters = document.getElementsByClassName( 'push-filter-header-circle' )[0];
		this.table2.circles = {
			monthlyTotal: document.getElementById( 'billing-overview__monthly-total-circle' ),
			totalChange: document.getElementById( 'billing-overview__total-change-circle' )
		};

		this.table3 = {};
		this.table3.container = document.getElementsByClassName( 'billing-overview__table-3-container' )[0],
		this.table3.table = this.table3.container.querySelectorAll( 'table' )[0];
		this.table3.breadcrumb = document.getElementsByClassName( 'back-table-2__breadcrumb' )[0];
		this.table3.backBtn = document.getElementsByClassName( 'back-table-2' )[0];
		this.table3.filters = document.getElementsByClassName( 'push-filter-header-circle' )[1];
		this.table3.height = undefined;

		var tableData = JSON.parse( data );
		this.data1 = tableData.table1data;
		this.data2 = tableData.table2data;
		this.data3 = tableData.table3data;

		this.selectedDate = undefined;

		this.sort = [ new SortTable(), new SortTable(), new SortTable() ];

		this._buildTable({
			data: this.data1,
			container: this.table1.container,
			checkbox: true
		});

		this.sort[0]._init( this.table1.table, true );
		this._initTable1();
		this._initTable2();
		this._initEvents();

		_c.css( [this.table2.container, this.table3.container], {
			'height': '100%',
			'min-height': this.table1.container.clientHeight + 'px'
		});
	};

	this._exportTableSelection = function () {
		var input = document.getElementsByClassName( 'export-selection-array' )[0],
				rows = this.table1.table.querySelectorAll( 'tbody tr' ),
				list = [];

		for ( var i = 0, l = rows.length; i < l; i++ ) {
			if ( rows[i].children[0].children[0].checked ) {
				list.push( rows[i].children[1].textContent );
			}
		}

		input.value = JSON.stringify( list );
	};

	this._toggleMasterCheckbox = function ( state ) {
		var check = state === 'on' ? true : false;

		for ( var i = 0, l = this.table1.checkboxes.slaves.length; i < l; i++ ) {
			this.table1.checkboxes.slaves[i].checked = check;
		}
	};

	this._toggleSlaveCheckboxes = function ( targetedElem ) {
		if ( !_c.hasClass( targetedElem, 'billing-overview__master-checkbox' ) ) {
			if ( this.table1.checkboxes.master.checked ) {
				this.table1.checkboxes.master.checked = false;
			} else {
				if ( this._allSlaveChecked() ) {
					this.table1.checkboxes.master.checked = true;
				}
			}
		}
	};

	this._allSlaveChecked = function () {
		var allChecked = true;

		for ( var i = 0, l = this.table1.checkboxes.slaves.length; i < l; i++ ) {
			if ( !this.table1.checkboxes.slaves[i].checked ) {
				allChecked = false;
				break;
			}
		}

		return allChecked;
	};

	this._initTable1 = function () {
		var self = this,
				thead = false;

		_c.click( this.table1.checkboxes.master, function () {
			if ( this.checked ) {
				self._toggleMasterCheckbox( 'on' );
			} else {
				self._toggleMasterCheckbox( 'off' );
			}
		});

		_c.click( this.table1.table, function ( e ) {
			var t = e.target;

			if ( t.tagName === 'INPUT' ) {
				self._toggleSlaveCheckboxes( t );
				self._exportTableSelection();
				return;
			}

			while ( t.tagName !== 'TR' ) {
				t = t.parentNode;

				if ( t.tagName === 'TBODY' ) {
					return;
				}
			}

			if ( t.parentNode.tagName === 'THEAD' ) {
				return;
			}

			t = t.children;

			for ( var key in self.data2 ) {
				var d = self.data2[key];

				if ( d.id === t[1].innerText ) {
					if ( d.data.length === 0 ) {
						self._tableNoData( self.table2.table );
					} else {
						self.selectedDate = d.id;
						self._buildTable({
							data: d.data,
							container: self.table2.container
						});
						if ( d.data.length > 1 ) {
							self._toggleFilters( 'visible', self.table2.container.querySelectorAll( 'table' )[0], 2 );
						} else {
							self._toggleFilters( 'hidden', self.table2.container.querySelectorAll( 'table' )[0], 2 );
						}
					}
				}
			}

			self.table2.breadcrumb[0].textContent = t[1].innerText;
			self.table2.breadcrumb[1].textContent = t[1].innerText;
			self._updateCircles( t[2].innerText, t[3].innerText, t[3].children[0].className );
			categoryFilter._init( 'category-filter-box', 'billing-category-filter-button', 'billing-overview__table-2' );
			categoryFilterSearch._updateListItems( categoryFilter._readFilterColumnValues(0), 'billing-category-item' );
			categoryFilter._resetFilter( 0 );
			self._forward( 2 );
		});
	};

	this._initTable2 = function () {
		var self = this;

		_c.click( this.table2.table, function ( e ) {
			var t = e.target;

			while ( t.tagName !== 'TR' ) {
				t = t.parentNode;

				if ( t.tagName === 'TBODY' ) {
					return;
				}
			}

			if ( t.className === 'not-clickable' || t.parentNode.tagName === 'THEAD' ) {
				return;
			}

			t = t.children;
			
			for ( var key in self.data3 ) {
				var d = self.data3[key];

				if ( ( d.id.date === self.selectedDate ) && ( d.id.phone === t[0].innerText.replace( /\W/g, '' ) ) && ( d.id.category === t[3].innerText ) ) {
					if ( d.data.length === 0 ) {
						self._tableNoData( self.table3.table );
					} else {
						self._buildTable({
							data: d.data,
							container: self.table3.container
						});
						if ( d.data.length > 1 ) {
							self._toggleFilters( 'visible', self.table3.container.querySelectorAll( 'table' )[0], 3 );
						} else {
							self._toggleFilters( 'hidden', self.table3.container.querySelectorAll( 'table' )[0], 3 );
						}
					}
				}
			}

			self.table3.breadcrumb.textContent = t[0].innerText;
			productMarketHeadingFilter._init( 'billing-overview-table-2-filter-box', 'billing-overview-table-2-filter-button', 'billing-overview__table-3' );
			productFilterSearch._updateListItems( productMarketHeadingFilter._readFilterColumnValues(0), 'billing-product-item' );
			marketFilterSearch._updateListItems( productMarketHeadingFilter._readFilterColumnValues(1), 'billing-market-item' );
			headingFilterSearch._updateListItems( productMarketHeadingFilter._readFilterColumnValues(2), 'heading-product-item' );
			productMarketHeadingFilter._resetFilter();
			self._forward( 3 );
		});
	};

	this._initEvents = function () {
		var self = this;

		// If you click on the "full timeframe" button on table 2 and 3,
		// it will bring you to table 1
		_c.click( this.table2.backBtns[0], function ( e ) {
			e.preventDefault();
			self._back( 1 );
			self._destroyTable( self.table2.table );
		});

		_c.click( this.table2.backBtns[1], function ( e ) {
			e.preventDefault();
			self._back( 1 );
			self._destroyTable( self.table2.table );
			self._destroyTable( self.table3.table );
		});

		// If you click on the "2012-10" button on table 3 it will
		// bring you to table 2
		_c.click( this.table3.backBtn, function ( e ) {
			e.preventDefault();
			self._back( 2 );
			self._destroyTable( self.table3.table );
		});

		// If you click on the previous table ( the one off the screen ),
		// if will bring you to that table
		_c.click( this.table1.curtain, function () {
			self._back( 1 );
			self._destroyTable( self.table2.table );
		});

		// If you click on the previous table ( the one off the screen ),
		// if will bring you to that table
		_c.click( this.table2.curtain, function () {
			self._back( 2 );
			self._destroyTable( self.table3.table );
		});
	};

	this._forward = function ( level ) {
		var t1 = this.table1.container,
				t2 = this.table2.container,
				t3 = this.table3.container;

		// brings you to the specified level
		if ( level === 2 ) {
			_c.css( t1, { 'margin-bottom': -t1.clientHeight + 'px' } );
			_c.css( [t2, this.table1.curtain], { 'display': 'block' } );
			_c.addClass( [t1, t2, t3] , 'level-2', 50 );
			_c.addClass( this.table1.curtain, 'active', 10 );
			this.position = 2;
		}

		// brings you to the specified level
		if ( level === 3 ) {
			_c.css( t2, { 'margin-bottom': -t2.clientHeight + 'px' } );
			_c.css( [t3, this.table2.curtain], { 'display': 'block' } );
			_c.addClass( [t1, t2, t3] , 'level-3', 50 );
			_c.addClass( this.table2.curtain, 'active', 10 );
			this.position = 3;
		}
	};

	this._back = function ( level ) {
		var t1 = this.table1.container,
				t2 = this.table2.container,
				t3 = this.table3.container;

		// brings you to the specified level
		if ( level === 1 ) {
			_c.removeClass( [t1, t2, t3], ['level-3', 'level-2'] );
			_c.removeClass( [this.table1.curtain, this.table2.curtain], 'active' );
			_c.css( [t1, t2], { 'margin-bottom': '' }, 510 );
			_c.css( [t2, t3, this.table1.curtain, this.table2.curtain], { 'display': 'none' }, 510 );
		}

		// brings you to the specified level
		if ( level === 2 ) {
			_c.removeClass( [t1, t2, t3], 'level-3' );
			_c.removeClass( this.table2.curtain, 'active' );
			_c.css( t2, { 'margin-bottom': '' }, 510 );
			_c.css( [t3, this.table2.curtain], { 'display': 'none' }, 510 );
		}
	};

	this._buildTable = function ( options ) {
		if ( !options.hasOwnProperty( 'data' ) && options.data === null ) {
			return false;
		}

		var tbody = document.createElement( 'tbody' );

		options.data.forEach( function ( row ) {
			var cells = '',
					content = '';

			for ( var key in row ) {
				switch( key ) {
					case 'change':
						var direction = 'zero';
					
						if ( row[key] < 0 ) {
							direction = 'down';
						} else if ( row[key] > 0 ) {
							direction = 'up';
						}

						var n = _c.translator( 'dollarFormat', {
									amount: _c.cleanNumber( row[key], 2 )
								});

						content = n + '<span class="' + direction + '"></span>';
						break;

					case 'phone':
						content = row[key].replace( /(\d{3})(\d{3})(\d{4})/, '($1) $2-$3' );
						break;

					case 'price':
					case 'total':
						var n = _c.translator( 'dollarFormat', {
									amount: _c.cleanNumber( row[key], 2 )
								});

						content = ( row[key] < 0 ) ? '- ' + n : n;
						break;

					case 'quantity':
						content = _c.cleanNumber( row[key] );
						break;

					default:
						content = row[key];
						break;
				}

				cells += '<td>' + content + '</td>';
			}

			if ( options.hasOwnProperty( 'checkbox' ) ) {
				if ( options.checkbox ) {
					tbody.innerHTML += '<tr>' + 
																'<td><input type="checkbox" class="billing-overview__checkbox" /></td>' +
																cells +
														'</tr>';
				} else {
					tbody.innerHTML += '<tr>' + cells + '</tr>';
				}
			} else {
				tbody.innerHTML += '<tr>' + cells + '</tr>';
			}
		});

		options.container.querySelectorAll( 'table' )[0].appendChild( tbody );
	};

	this._toggleFilters = function ( state, table, level ) {
		var filter = (level === 2) ? this.table2.filters : this.table3.filters;

		switch ( state ) {
			case 'visible':
				this._initSortTable( table, level );
				_c.css( filter, {
					'visibility': 'visible'
				});
				break;

			case 'hidden':
				_c.css( filter, {
					'visibility': 'hidden'
				});
				break;
		}
	};

	this._tableNoData = function ( tableID ) {
		var columnNumber = tableID.querySelectorAll( 'thead tr th' ).length;

		tableID.innerHTML += '<tr class="not-clickable"><td colspan="' + ( columnNumber + 1 ) + '">' + _c.translator( 'noDataAvailable' ) + '</td></tr>';
	};

	this._destroyTable = function ( tableID ) {
		var tbody = tableID.querySelectorAll( 'tbody' )[0];

		setTimeout( function () {
			tbody.parentNode.removeChild( tbody );
		}, 600 );
	};

	this._initSortTable = function ( tableID, level ) {
		this.sort[(level - 1)]._init( tableID );
		this.sort[(level - 1)]._setDefaultSort( 0, 'DESC' );
	};

	this._updateCircles = function ( monthlyTotalVal, totalChangeVal, totalChangeDirection ) {
		var arrow = document.getElementById( 'billing-overview__circle-arrow' ),
				monthlyTotal = parseInt( monthlyTotalVal.replace( /[$,\s]/g, '' ) ),
				totalChange = parseInt( totalChangeVal.replace( /[$,\s]/g, '' ) ),
				fMontly = _c.cleanNumber( monthlyTotal, 2 ),
				fChange = _c.cleanNumber( totalChange, 2 );

		// Remove the change class before putting the proper one.
		_c.removeClass( arrow, ['circle__arrow--up', 'circle__arrow--down', 'circle__arrow--no-change'] );

		switch ( totalChangeDirection ) {
			case 'zero':
				_c.addClass( arrow, 'circle__arrow--no-change' );
				break;

			case 'down':
				_c.addClass( arrow, 'circle__arrow--down' );
				break;

			case 'up':
				_c.addClass( arrow, 'circle__arrow--up' );
				break;
		}

		if ( monthlyTotal < 0 ) {
			this.table2.circles.monthlyTotal.textContent = '- ' + _c.translator( 'dollarFormat', {
				amount: fMontly
			});
		} else {
			this.table2.circles.monthlyTotal.textContent = _c.translator( 'dollarFormat', {
				amount: fMontly
			});
		}

		this.table2.circles.totalChange.textContent = _c.translator( 'dollarFormat', {
			amount: fChange
		});

		this._adjustCircleFontSize( monthlyTotal, totalChange );
	};

	this._adjustCircleFontSize = function ( circle1, circle2 ) {
		var monthlyTotalLength = circle1.toString().length,
				totalChangeLength = circle2.toString().length;

		if ( monthlyTotalLength < 3 ) {
			_c.css( this.table2.circles.monthlyTotal, {
				'font-size': '1.66667em'
			});
		}

		if ( totalChangeLength < 3 ) {
			_c.css( this.table2.circles.totalChange, {
				'font-size': '1.66667em'
			});
		}

		if ( monthlyTotalLength === 3 ) {
			_c.css( this.table2.circles.monthlyTotal, {
				'font-size': '1.46667em',
				'margin-bottom': '6px'
			});
		}

		if ( totalChangeLength === 3 ) {
			_c.css( this.table2.circles.totalChange, {
				'font-size': '1.46667em',
				'margin-bottom': '6px'
			});
		}
				
		if ( monthlyTotalLength === 4 ) {
			_c.css( this.table2.circles.monthlyTotal, {
				'font-size': '1.16667em',
				'margin-bottom': '6px'
			});
		}

		if ( totalChangeLength === 4 ) {
			_c.css( this.table2.circles.totalChange, {
				'font-size': '1.16667em',
				'margin-bottom': '6px'
			});
		}

		if ( monthlyTotalLength === 5 ) {
			_c.css( this.table2.circles.monthlyTotal, {
				'font-size': '1.06667em',
				'margin-bottom': '10px'
			});
		}

		if ( totalChangeLength === 5 ) {
			_c.css( this.table2.circles.totalChange, {
				'font-size': '1.06667em',
				'margin-bottom': '10px'
			});
		}
	};
}

/**********************************
 * BILLING TOTAL TABLE PERCENTAGE *
 **********************************/
function TablePercentage () {
	this._init = function () {
		this.elems = document.getElementsByClassName( 'table-row-percentage' );
		this._initEvents();
	};

	this._initEvents = function () {
		[].forEach.call( this.elems, function ( elem ) {
			_c.css( elem, {
				"width": elem.getAttribute( 'data-percentage' ) + '%'
			});
		});
	};
}

/*********************
 * ACCOUNT SWITCHING *
 *********************/
function AccountSwitching () {
	this._init = function () {
		this.accountList = document.getElementsByClassName( 'accounts-list' )[0];
		this._initEvents();
	};

	this._initEvents = function () {
		var self = this;

		_c.click( this.accountList, function ( e ) {
			var t = e.target;

			while ( t.tagName !== 'A' ) {
				t = t.parentNode;

				if ( t.tagName === 'LI' ) {
					return;
				}
			}

			_c.checkmark( this, t );
			toolbox._resetMenu();
		});
	};

	this._checkmark = function ( elem ) {
		[].forEach.call( this.accountList, function ( account ) {
			_c.removeClass( account, 'active' );
		});

		_c.addClass( elem, 'active' );
	};
}

/******************************
 * BILLING REPPORT EMAIL FORM *
 ******************************/
function EmailBillingReport () {
	this._init = function () {
		this.emailForm = {
			toEmail: document.getElementsByClassName( 'email-billing-report-to' )[0],
			ccEmail: document.getElementsByClassName( 'email-billing-report-cc' )[0],
			subject: document.getElementsByClassName( 'email-billing-report-subject' )[0],
			message: document.getElementsByClassName( 'email-billing-report-message' )[0]
		};

		this.alerts = {
			toEmail: document.getElementById( 'to-billing-report-alert' ),
			ccEmail: document.getElementById( 'cc-billing-report-alert' ),
			subject: document.getElementById( 'subject-billing-report-alert' ),
			message: document.getElementById( 'message-billing-report-alert' )
		};

		this.submit = document.getElementsByClassName( 'email-billing-report-send' )[0];
		this.cancel = document.getElementsByClassName( 'email-billing-report-cancel' )[0];

		this._initEvents();
	};

	this._initEvents = function () {
		var self = this;

		_c.click( this.submit, function () {
			var valid = false;

			valid = self._validate( self.emailForm.toEmail, 'email', true, self.alerts.toEmail );
			valid &= self._validate( self.emailForm.ccEmail, 'email', false, self.alerts.ccEmail );
			valid &= self._validate( self.emailForm.subject, 'text', true, self.alerts.subject );
			valid &= self._validate( self.emailForm.message, 'textarea', true, self.alerts.message );

			if ( valid ) {
				toolbox._resetMenu();

				setTimeout( function () {
					self._clearForm();
				}, 510 );
			}
		});

		_c.click( this.cancel, function () {
			toolbox._resetMenu();
			
			setTimeout( function () {
				self._clearForm();
			}, 510 );
		});
	};

	this._clearForm = function () {
		for ( var key in this.emailForm ) {
			this.emailForm[key].value = '';
		}

		for ( var key in this.alerts ) {
			_c.hide( this.alerts[key] );
		}
	};

	this._validate = function ( input, type, required, alertElem ) {
		switch( type ) {
			case 'text':
			case 'textarea':
				if ( required ) {
					if ( input.value ) {
						this._dismissAlert( alertElem );
						return true;
					}
					this._alert( alertElem );
					return false;
				} else {
					return true;
				}
				break;

			case 'email':
				var emailRegex = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/ig;

				if ( required ) {
					if ( input.value ) {
						if ( emailRegex.test( input.value ) ) {
							this._dismissAlert( alertElem );
							return true;
						}
						this._alert( alertElem );
						return false;
					}
					this._alert( alertElem );
					return false;
				} else if ( !required ) {
					if ( input.value ) {
						if ( emailRegex.test( input.value ) ) {
							this._dismissAlert( alertElem );
							return true;
						}
						this._alert( alertElem );
						return false;
					} else {
						this._dismissAlert( alertElem );
						return true;
					}
				}
				break;
		}
	};

	this._alert = function ( alertElem ) {
		_c.show( alertElem );
	};

	this._dismissAlert = function ( alertElem ) {
		_c.hide( alertElem );
	};
}

/*****************************
 * RECOMMENDATION VALIDATION *
 *****************************/
function TextboxCharacterCount () {
	this._init = function ( textbox, counter, charLimit ) {
		this.textbox = textbox;
		this.characterCount = counter;
		this.limit = charLimit;
		this.characterCount.textContent = ( this.limit - this.textbox.value.length ) + ' ' + _c.translator( 'characters' );

		if ( this.textbox.value.length > this.limit ) {
			_c.addClass( this.characterCount, 'alert' );
		}

		this._initEvents();
	};

	this._initEvents = function () {
		var self = this;

		this.textbox.addEventListener( 'keyup', function () {
			self.characterCount.textContent = ( self.limit - self.textbox.value.length ) + ' ' + _c.translator( 'characters' );

			if ( self.textbox.value.length <= self.limit ) {
				_c.removeClass( self.characterCount, 'alert' );
			} else {
				_c.addClass( self.characterCount, 'alert' );
			}
		}, false );

		this.textbox.addEventListener( 'blur', function ( e ) {
			if ( self.textbox.value.length > self.limit ) {
				e.preventDefault();
				e.stopPropagation();
				return false;
			}

			return true;
		}, false );
	};

	this._validate = function ( value ) {
		if ( value > this.limit ) {
			return false;
		}
	};
}

/************************
 * BILLING TOTAL CHARTS *
 ************************/
function BillingTotalTable () {
	this._init = function () {
		this.options = {
				//Boolean - Whether we should show a stroke on each segment
				segmentShowStroke : true,
				
				//String - The colour of each segment stroke
				segmentStrokeColor : '#fff',
				
				//Number - The width of each segment stroke
				segmentStrokeWidth : 1,
				
				//The percentage of the chart that we cut out of the middle.
				percentageInnerCutout : 80,
				
				//Boolean - Whether we should animate the chart
				animation : true,
				
				//Number - Amount of animation steps
				animationSteps : 100,
				
				//String - Animation easing effect
				animationEasing : 'easeOutBounce',
				
				//Boolean - Whether we animate the rotation of the Doughnut 
				animateRotate : true
			};

		this.donutCharts = document.querySelectorAll( '.table-row-percentage canvas' );

		this._initEvents();
	};

	this._initEvents = function () {
		for ( var i = 0, len = this.donutCharts.length; i < len; i++ ) {
			if ( parseInt( this.donutCharts[i].getAttribute( 'data-percentage' ) ) !== 0 ) {
				var ctx = this.donutCharts[i].getContext( '2d' ),
						data = [
							{
								value: 100 - parseInt( this.donutCharts[i].getAttribute( 'data-percentage' ) ),
								color: '#cccccc'
							},
							{
								value: parseInt( this.donutCharts[i].getAttribute( 'data-percentage' ) ),
								color: '#96C867'
							}
						];

				new Chart( ctx ).Doughnut( data, this.options );
			}
		}
	};
}

/********************
 * CUSTOM TIMEFRAME *
 ********************/
window.CustomTimeframe = function ( currentTimeframe ) {
	var self = this,
			timeframe = currentTimeframe || null,
			triggers = {
				custom: document.getElementById( 'timeframe-trigger__custom' ),
				hint: {
					container: document.getElementById( 'timeframe-custom__hint' ),
					fromYear: document.getElementById( 'timeframe-hint__from-year' ),
					fromMonth: document.getElementById( 'timeframe-hint__from-month' ),
					toYear: document.getElementById( 'timeframe-hint__to-year' ),
					toMonth: document.getElementById( 'timeframe-hint__to-month' )
				},
				fromYear: document.getElementById( 'timeframe-trigger__from-year' ),
				fromMonth: document.getElementById( 'timeframe-trigger__from-month' ),
				toYear: document.getElementById( 'timeframe-trigger__to-year' ),
				toMonth: document.getElementById( 'timeframe-trigger__to-month' )
			},
			lists = {
				defaults: document.getElementById( 'timeframe-list' ),
				fromYear: document.getElementById( 'timeframe-list__from-year' ),
				fromMonth: document.getElementById( 'timeframe-list__from-month' ),
				toYear: document.getElementById( 'timeframe-list__to-year' ),
				toMonth: document.getElementById( 'timeframe-list__to-month' )
			},
			submit = {
				button: document.getElementsByClassName( 'timeframe-custom__button' )[0],
				hiddenInput: document.getElementsByClassName( 'custom-timeframe-hidden-input' )[0]
			};

	this._init = function () {
		if ( timeframe !== null ) {
			this._applyTimeframe( timeframe );
		} else {
			submit.button.setAttribute( 'disabled', 'disabled' );
			timeframe = {
				from: {
					year: undefined,
					month: undefined
				},
				to: {
					year: undefined,
					month: undefined
				}
			};
		}

		_c.click( lists.fromYear,  function ( e ) {
			e.preventDefault();

			if ( e.target.tagName === 'A' ) {
				var text = e.target.innerText;

				triggers.fromYear.textContent = text;
				triggers.hint.fromYear.textContent = text.toString().substring(2);
				timeframe.from.year = text;
				self._checkList( this, e.target );
				self._filterChoices();
				self._activateSubmit();
			}

			toolbox._closeMenu( 3 );
		});

		_c.click( lists.fromMonth, function ( e ) {
			e.preventDefault();

			if ( e.target.tagName === 'A' ) {
				var text = e.target.innerText;

				triggers.fromMonth.textContent = text;
				triggers.hint.fromMonth.textContent = text.substring(5, 8);
				timeframe.from.month = ( parseInt( text ) < 10 ) ? '0' + parseInt( text ) : parseInt( text );
				self._checkList( this, e.target );
				self._filterChoices();
				self._activateSubmit();
			}

			toolbox._closeMenu( 3 );
		});

		_c.click( lists.toYear, function ( e ) {
			e.preventDefault();

			if ( e.target.tagName === 'A' ) {
				var text = e.target.innerText;

				triggers.toYear.textContent = text;
				triggers.hint.toYear.textContent = text.toString().substring(2);
				timeframe.to.year = text;
				self._checkList( this, e.target );
				self._filterChoices();
				self._activateSubmit();
			}

			toolbox._closeMenu( 3 );
		});

		_c.click( lists.toMonth, function ( e ) {
			e.preventDefault();

			if ( e.target.tagName === 'A' ) {
				var text = e.target.innerText;

				triggers.toMonth.textContent = text;
				triggers.hint.toMonth.textContent = text.substring(5, 8);
				timeframe.to.month = ( parseInt( text ) < 10 ) ? '0' + parseInt( text ) : parseInt( text );
				self._checkList( this, e.target );
				self._activateSubmit();
			}

			toolbox._closeMenu( 3 );
		});

		_c.click( submit.button, function () {
			_c.addClass( triggers.custom, 'active' );
			self._applyHint();
			toolbox._closeMenu( 2 );Ã 
		});
	};

	this._activateSubmit = function () {
		var t = timeframe;

		if ( t.from.year !== undefined && t.from.month !== undefined && t.to.year !== undefined && t.to.month !== undefined ) {
			submit.hiddenInput.value = JSON.stringify( t );
			submit.button.removeAttribute( 'disabled' );
		}
	};

	this._applyHint = function () {
		var defaultElem = lists.defaults.querySelectorAll( 'li a' ),
				global_months = _c.translator( 'monthAbbreviation' );

		for ( var i = 0, len = defaultElem.length; i < len; i++ ) {
			_c.removeClass( defaultElem[i], 'active' );
		}

		triggers.hint.fromYear.textContent = timeframe.from.year.toString().substring( 2 );
		triggers.hint.fromMonth.textContent = global_months[parseInt( timeframe.from.month ) - 1];
		triggers.hint.toYear.textContent = timeframe.to.year.toString().substring( 2 );
		triggers.hint.toMonth.textContent = global_months[parseInt( timeframe.to.month ) - 1];
	};

	this._applyTimeframe = function ( t ) {
		var fY = lists.fromYear.querySelectorAll( 'li a' ),
				fM = lists.fromMonth.querySelectorAll( 'li a' ),
				tY = lists.toYear.querySelectorAll( 'li a' ),
				tM = lists.toMonth.querySelectorAll( 'li a' ),
				i = 0;

		for ( i, len = fY.length; i < len; i++ ) {
			if ( parseInt( fY[i].innerText ) === parseInt( t.from.year ) ) {
				_c.addClass( fY[i], 'active' );
				triggers.fromYear.textContent = fY[i].innerText;
			}
		}

		i = 0;
		for ( i, len = fM.length; i < len; i++ ) {
			if ( parseInt( fM[i].innerText ) === parseInt( t.from.month ) ) {
				_c.addClass( fM[i], 'active' );
				triggers.fromMonth.textContent = fM[i].innerText;
			}
		}

		i = 0;
		for ( i, len = tY.length; i < len; i++ ) {
			if ( parseInt( tY[i].innerText ) === parseInt( t.to.year ) ) {
				_c.addClass( tY[i], 'active' );
				triggers.toYear.textContent = tY[i].innerText;
			}
		}

		i = 0;
		for ( i, len = tM.length; i < len; i++ ) {
			if ( parseInt( tM[i].innerText ) === parseInt( t.to.month ) ) {
				_c.addClass( tM[i], 'active' );
				triggers.toMonth.textContent = tM[i].innerText;
			}
		}

		this._filterChoices();
		_c.addClass( triggers.custom, 'active' );
		this._applyHint();
	};

	this._checkList = function ( listID, selectedElem ) {
		var listElem = listID.querySelectorAll( 'li a' );

		for ( var i = 0, len = listElem.length; i < len; i++ ) {
			_c.removeClass( listElem[i], 'active' );
		}

		_c.addClass( selectedElem, 'active' );
	};

	this._filterChoices = function () {
		if ( timeframe.from.month !== undefined ) {
			var listToYear = lists.toYear.querySelectorAll( 'li a' ),
					listToMonth = lists.toMonth.querySelectorAll( 'li a' );

			if ( timeframe.from.year === timeframe.to.year ) {
				for ( var i = 0, len = listToYear.length; i < len; i++ ) {
					if ( parseInt( listToYear[i].innerText ) < parseInt( timeframe.from.year ) ) {
						_c.hide( listToYear[i].parentNode );
					}
				}

				if ( timeframe.to.month < timeframe.from.month ) {
					for ( var i = 0, len = listToMonth.length; i < len; i++ ) {
						if ( parseInt( listToMonth[i].innerText ) < parseInt( timeframe.from.month ) ) {
							_c.removeClass( listToMonth[i], 'active' );
							_c.hide( listToMonth[i].parentNode );
							triggers.toMonth.textContent = _c.capitalizeFirstLetter( _c.translator( 'month' ) );
							triggers.hint.toMonth.textContent = 'MM';
							timeframe.to.month = undefined;
						}
					}
				} else {
					for ( var i = 0, len = listToMonth.length; i < len; i++ ) {
						if ( parseInt( listToMonth[i].innerText ) < parseInt( timeframe.from.month ) ) {
							_c.removeClass( listToMonth[i], 'active' );
							_c.hide( listToMonth[i].parentNode );
						}
					}
				}
			} else if ( timeframe.from.year > timeframe.to.year ) {
				for ( var i = 0, len = listToYear.length; i < len; i++ ) {
					if ( parseInt( listToYear[i].innerText ) < parseInt( timeframe.from.year ) ) {
						_c.hide( listToYear[i].parentNode );

						triggers.toYear.textContent = _c.capitalizeFirstLetter( _c.translator( 'year' ) );
						triggers.toMonth.textContent = _c.capitalizeFirstLetter( _c.translator( 'month' ) );
						triggers.hint.toYear.textContent = _c.capitalizeFirstLetter( _c.translator( 'YYYY' ) );
						triggers.hint.toMonth.textContent = 'MM';
					}

					if ( parseInt( listToYear[i].innerText ) > parseInt( timeframe.from.year ) ) {
						_c.show( listToYear[i].parentNode );
					}
				}

				for ( var j = 0, len = listToMonth.length; j < len; j++ ) {
					_c.removeClass( listToMonth[j], 'active' );
					_c.show( listToMonth[j].parentNode );
				}
			} else if ( timeframe.from.year < timeframe.to.year ) {
				for ( var i = 0, len = listToYear.length; i < len; i++ ) {
					if ( parseInt( listToYear[i].innerText ) < parseInt( timeframe.from.year ) ) {
						_c.removeClass( listToYear[i], 'active' );
						_c.hide( listToYear[i].parentNode );
					} else {
						_c.show( listToYear[i].parentNode );
					}
				}

				for ( var j = 0, len = listToMonth.length; j < len; j++ ) {
					_c.show( listToMonth[j].parentNode );
				}
			}
		}
	};
}

/****************************
 * BRANCH CREATION DIALOGS
 ****************************/
function BranchDialog () {
	this._init = function () {
		this.curtain = document.getElementById( 'dialog-curtain' );
		this.createBtn = document.getElementsByClassName( 'create-ibr-button' )[0];
		this.disable = document.getElementById( 'disable-create-ibr-button' );
		this.list = document.getElementsByClassName( 'dialog-list-branches' )[0];
		this.createMessage = document.getElementsByClassName( 'create-message' )[0];
		this.buttons = {
			cancel: document.getElementsByClassName( 'dialog-cancel' )[0],
			submit: document.getElementsByClassName( 'dialog-submit' )[0]
		};
		this.ibrHome = document.getElementsByClassName( 'ibr-home' )[0];
	};

	this._buildDialog = function ( data ) {
		var row = '',

		obj = JSON.parse( data );
		
		for ( var i = 0, len = obj.length; i < len; i++ ) {
			row += '<li>' +
								'<div class="list-elem branch-info">' +
									'<p class="branch-name">' + obj[i].name + '</p>' +
									'<p class="branch-phone">' + obj[i].phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3") + '</p>' +
									'<p class="branch-last-created">' + obj[i].creationDate + '</p>' +
								'</div>' +
							'</li>';
		}

		this.list.innerHTML = row;
		this._initEvents();
		this._init();
		this._openDialog();
	};

	this._initEvents = function () {
		var self = this;

		_c.click( this.buttons.submit, function ( e ) {
			e.preventDefault();
			self._closeDialog();
			self._createIBR();
		});

		_c.click( this.buttons.cancel, function () {
			self._closeDialog();
		});
	};

	this._createIBR = function () {
		// _c.show( this.createMessage );
		// _c.addClass( this.createMessage, 'active', 10 );
		// _c.show( this.disable );
		// _c.addClass( this.disable, 'active' );
	};

	this._openDialog = function () {
		_c.addClass( this.ibrHome, 'dialog-active' );
		_c.addClass( this.curtain, 'active', 0.5 );
	};

	this._closeDialog = function () {
		_c.removeClass( this.curtain, 'active' );
		_c.removeClass( this.ibrHome, 'dialog-active', 0.4 );
	};
}

function validateFile ( fileObj ) {
	var fName = (fileObj.input !== undefined) ? fileObj.input.value : fileObj.name,
			fType = fileObj.typeArray,
			fMaxSize = fileObj.maxSize,
			fExtension = ( fName ) ? fName.substr( ( fName.lastIndexOf('.') + 1 ) ).toLowerCase() : undefined,
			fSize = ( fileObj.input !== undefined ) ? fileObj.input.files[0].size : fileObj.size,
			fReadableSize = ( fileObj.input !== undefined ) ? ( ( fileObj.input.files[0].size / 1048576 ) ).toFixed( 2 ) : ( fileObj.size / 1048576 ).toFixed( 2 ),
			fValidExtension = false,
			fValidSize = false,
			fHint = ( fileObj.hint.substring( 0, 1 ) === '#' ) ? document.getElementById( fileObj.hint.replace( /#/, '' ) ) : document.getElementsByClassName( fileObj.hint.replace( /\./, '' ) )[0];

	for ( var i = 0; i < fType.length; i++ ) {
		if ( fExtension === fType[i] ) {
			fValidExtension = true;
		}
	}

	if ( fMaxSize !== undefined || fMaxSize !== null ) {
		if ( fSize < fMaxSize )Â {
			fValidSize = true;
		}
	}

	if ( fValidExtension && fValidSize ) {
		_c.hide( fHint );
		_c.removeClass( fHint, 'alert' );
		return true;
	}

	if ( !fValidExtension && !fValidSize ) {
		_c.addClass( fHint, 'alert' );

		fHint.textContent = _c.translator( 'fileTypeAndSize', {
			fileTypes: fType.join( ', ' ),
			size: fReadableSize
		});
	} else if ( !fValidExtension ) {
		_c.addClass( fHint, 'alert' );

		fHint.textContent = _c.translator( 'fileType', {
			fileTypes: fType.join( ', ' )
		});
	} else if ( !fValidSize ) {
		_c.addClass( fHint, 'alert' );

		fHint.textContent = _c.translator( 'fileSize', {
			size: fReadableSize
		});
	}

	return false;
};

/***************
 * IMAGE UPLOAD *
 ***************/
function ImageUpload () {
	this._init = function ( parameters ) {
		this.options = parameters || {}; // dashboard, maxWidth, maxHeight
		this.dashboard = this.options.hasOwnProperty( 'dashboard' ) ? true : false;
		this.cropper = this.options.hasOwnProperty( 'cropper' ) ? true : false;

		if ( this.dashboard ) {
			this.dashboardControls = document.getElementsByClassName( 'dashboard-controls' )[0];
		}

		if ( this.cropper ) {
			$.fn.cropper;
			this.croppingSection = document.getElementsByClassName( 'cropper' )[0];
		} else {
			this.imagePreviewSection = document.getElementsByClassName( 'image-preview' )[0];
		}

		this.dropZone = document.getElementsByClassName( 'upload-image__drop-zone' )[0];
		this.buttons = {
			container: document.getElementsByClassName( 'upload-image__buttons' )[0],
			cancelBtn: document.getElementsByClassName( 'upload-image__cancel-crop' )[0],
			submitBtn: document.getElementsByClassName( 'upload-image__save-crop' )[0],
			deleteBtn: document.getElementsByClassName( 'delete-image-btn' )[0],
			browse: document.getElementById( 'upload-image__manual-upload' )
		};
		this.fileInput = document.getElementsByClassName( 'upload-image__input' )[0];
		this.hint = document.getElementsByClassName( 'upload-image__hint' )[0];
		this.hiddenInput = document.getElementsByClassName( 'image-editor__object' )[0];
		
		this._initEvents();
	};

	this._initEvents = function () {
		var self = this;

		if ( this.dropZone ) {
			this.dropZone.addEventListener( 'dragover', function ( e ) {
				var evt = e;
				self._handleDragOver( evt );
			}, false );

			this.dropZone.addEventListener( 'dragenter', function ( e ) {
				_c.addClass( self.dropZone, 'dragover' );
			}, false );

			this.dropZone.addEventListener( 'dragleave', function ( e ) {
				_c.removeClass( self.dropZone, 'dragover' );
			}, false );

			this.dropZone.addEventListener( 'drop', function ( e ) {
				var evt = e;
				self._selectFile( 'drop', evt );
				_c.removeClass( self.dropZone, 'dragover' );
			}, false );

			_c.click( this.buttons.cancelBtn, function () {
				self._cancelCrop();
			});

			_c.click( this.buttons.submitBtn, function () {
				loadingCurtain( 'on' );
			});

			_c.click( this.buttons.browse, function () {
				self.fileInput.click();
			});

			this.fileInput.addEventListener( 'change', function ( e ) {
				self._selectFile( 'browse', e );
			}, false );
		} else {
			_c.click( this.buttons.deleteBtn, function () {
				loadingCurtain( 'on' );
			});
		}
	};

	this._handleDragOver = function ( e ) {
		e.stopPropagation();
		e.preventDefault();
		e.dataTransfer.dropEffect = 'copy';
	};

	this._selectFile = function ( method, e ) {
		e.stopPropagation();
		e.preventDefault();
		
		var files, file;

		if ( method === 'drop' ) {
			files = e.dataTransfer.files;
		} else {
			files = e.target.files
		}

		if ( this.fileInput.value ) {
			_c.hide( this.dropZone );
		}

		for ( var i = 0; file = files[i]; i++ ) {
			file.typeArray = [ 'jpeg', 'jpg', 'png', 'gif' ];
			file.maxSize = 1024 * 1024 * 5;
			file.hint = 'upload-image__hint';
			file.minWidth = 280;
			file.minHeight = 140;

			if ( validateFile( file ) ) {
				this._readImage( file );

				if ( this.dashboard ) {
					_c.hide( this.dashboardControls );
				}
			} else {
				_c.show( this.dropZone );
			}
		}
	};
 
	this._readImage = function ( image ) {
		var reader = new FileReader(),
				self = this;

		reader.onerror = this._errorHandler;

		reader.addEventListener( 'load', function ( e ) {
			self._loadImage( e );
		}, false );

		if ( self.cropper ) {
			reader.addEventListener( 'loadend', function () {
				self._loadImageEditor();
			}, false );
		}

		reader.readAsDataURL( image );
	};

	this._errorHandler = function ( e ) {
		var error = e.target.error;

		switch ( error.code ) {
			case error.NOT_FOUND_ERR:
				this.hint.textContent = _c.translator( 'fileNotFound' );				
				_c.addClass( this.hint, 'alert' );
				break;

			case error.NOT_READABLE_ERR:
				this.hint.textContent = _c.translator( 'fileNotReadable' );
				_c.addClass( this.hint, 'alert' );
				break;

			case error.ABORT_ERR:
				break; // noop

			default:
				this.hint.textContent = _c.translator( 'errorReadingFile' );
				_c.addClass( this.hint, 'alert' );
		}
	};

	this._loadImage = function ( file ) {
		var img = document.createElement( 'img' ),
				div = document.createElement( 'div' );

		img.className = 'upload-image__preview';

		if ( this.cropper ) {
			img.src = file.target.result;
			div.appendChild( img );
			this.croppingSection.appendChild( div );
		} else {

			// Copy the image temporarily in the browser
			img.src = file.target.result
			div.appendChild( img );
			this.imagePreviewSection.appendChild( div );
			this.hiddenInput.value = file.target.result;
			_c.hide( this.dropZone );
		}

		_c.show( this.buttons.container );
	};

	this._loadImageEditor = function () {
		var self = this;

		$( '.upload-image__preview' ).cropper({
			aspectRatio: 'auto',
			done: function( data ) {
				var img = document.getElementsByClassName( 'upload-image__preview' )[0],
						cropData = document.getElementsByClassName( 'image-editor__object' )[0];

				data.imageURI = img.src;
				data.naturalHeight = img.naturalHeight;
				data.naturalWidth = img.naturalWidth;
				data.finalWidth = self.options.maxWidth;
				data.finalHeight = self.options.maxHeight;
				cropData.value = JSON.stringify( data );
			}
		});
	};

	this._cancelCrop = function () {
		_c.hide( this.buttons.container );

		if ( this.dashboard ) {
			_c.show( this.dashboardControls );
		}

		_c.show( [this.dropZone, this.hint] );
		this.hiddenInput.value = '';

		if ( this.cropper ) {
			this.croppingSection.innerHTML = '';
		} else {
			this.imagePreviewSection.innerHTML = '';
		}
	};
}

function resizeLogo ( image, maxWidth, maxHeight ) {
	var image = image,
			naturalWidth = image.naturalWidth,
			naturalHeight = image.naturalHeight;

	if ( ( naturalWidth === maxWidth && naturalHeight >= maxHeight ) || ( naturalHeight === maxHeight && naturalWidth <= maxWidth ) ) {
		_c.css( image, {
			'width': 'auto',
			'height': '100%'
		});
	}

	if ( ( naturalWidth === maxWidth && naturalHeight <= maxHeight ) || ( naturalHeight === maxHeight && naturalWidth >= maxWidth ) ) {
		_c.css( image, {
			'width': '100%',
			'height': 'auto'
		});
	}
}

/*********************
 * PRELOADER CURTAIN *
 *********************/
function loadingCurtain ( state, elem ) {
	var preloader = elem || document.getElementById( 'preloader--page' );

	if ( state === 'on' ) {
		_c.show( preloader )
		_c.addClass( preloader, 'active', 10 );
	} else {
		_c.removeClass( preloader, 'active' );
		_c.show( preloader, 210 );
	}
}

/***************************
 * SUB SECTION LAZY LOADER *
 ***************************/
function lazyLoad ( state, elem ) {
	var lazyLoaderContainer = document.getElementById( elem ),
			lazyloader = document.getElementById( elem ).querySelectorAll( '.preloader' )[0];

	if ( state === 'on' ) {
		_c.show( lazyLoaderContainer )
		_c.addClass( lazyLoaderContainer, 'active' );
		_c.addClass( lazyloader, 'active', 10 );
	} else {
		_c.removeClass( lazyloader, 'active' );
		_c.removeClass( lazyLoaderContainer, 'active' );
		_c.hide( lazyLoaderContainer, 210 );
	}
}

/******************************
 * RECOMMENDATION SHOW & HIDE *
 ******************************/
function ShowHideRecommendations () {
	this._init = function () {
		this.recommendationsContainer = document.getElementsByClassName( 'recommendations--presentation' );
		this.disclosureTriangles = document.querySelectorAll( '.recommendations--presentation .recommendations__title' );
		this.recommendationContent = document.querySelectorAll( '.recommendations--presentation .recommendations__content' );
		this.recommendations = document.getElementsByClassName( 'recommendation-textbox' );

		this._activateRecommendations();
		this._initEvents();
	};

	this._initEvents = function () {
		var self = this;

		[].forEach.call( this.disclosureTriangles, function ( d ) {
			_c.click( d, function () {
				if ( _c.hasClass( this.parentNode, 'active' ) ) {
					_c.removeClass( this.parentNode, 'active' );
				} else {
					_c.addClass( this.parentNode, 'active' );
				}
			});
		});
	};

	this._activateRecommendations = function () {
		for ( var i = 0, l = this.recommendations.length; i < l; i++ ) {
			if ( this.recommendations[i].value ) {
				_c.addClass( this.recommendationsContainer[i], 'active' );
			}
		}
	}
}

/*************************
 * CREATE A NEW SECTIONS *
 *************************/
function AddNewSection () {
	this._init = function () {
		this.list = document.getElementsByClassName( 'roadmap--edit' )[0];
		this._initEvents();
	};

	this._initEvents = function () {
		var self = this;

		_c.click( this.list, function ( e ) {
			var t = e.target;

			if ( t.tagName === 'INPUT' && _c.hasClass( t, 'roadmap__link--new-section' ) ) {
				e.preventDefault();
			}
		});
	};
}

/**************
 * POC TOGGLE *
 **************/
function pocToggle ( toggleID, json ) {
	this._init = function () {
		this.toggles = toggleID;
		this.toggleLinks = this.toggles.querySelectorAll( 'li a' );
		this.toggleActive = this.toggles.querySelectorAll( 'li a.active' )[0];
		this.valuePlaceholder = document.getElementById( 'InvestmentChange_total' );
		this.labelPlaceholder = document.getElementsByClassName( 'InvestmentChange_total_direction' )[0];
		this.unitType = this.toggleActive.getAttribute( 'data-key' );
		this.data = JSON.parse( json );

		this._direction( this.data[ this.unitType ].extra.total_change_direction );

		this._initEvents();
	};
	
	this._initEvents = function () {
		var self = this;
		
		[].forEach.call( this.toggleLinks, function ( t ) {
			_c.click( t, function ( e ) {
				e.preventDefault();
				self._toggle( this );
			});
		});
	};

	this._toggle = function ( activeElem ) {
		var unit = activeElem.getAttribute( 'data-key' ) === 'CURRENCY' ? '$ ' + _c.translator( 'dollar' ) : '% ' + _c.translator( 'percent' );

		[].forEach.call( this.toggleLinks, function ( t ) {
			_c.removeClass( t, 'active' );
		});

		_c.addClass( activeElem, 'active' );
		_c.removeClass( this.labelPlaceholder, ['circle__arrow--down', 'circle__arrow--up'] );

		this.unitType = activeElem.getAttribute( 'data-key' );
		this._direction( this.data[ this.unitType ].extra.total_change_direction );

		if ( this.unitType === 'CURRENCY' ) {
			this.valuePlaceholder.textContent = _c.translator( 'dollarFormat', {
				amount: this.data.CURRENCY.extra.total_change
			});
			
			setupMultiBarChartFromData( this.data.CURRENCY, 'investment-change-po-chart', [colors.green], unit, false );
		} else {
			this.valuePlaceholder.textContent = this.data.PERCENT.extra.total_change + '%';
			setupMultiBarChartFromData( this.data.PERCENT, 'investment-change-po-chart', [colors.green], unit, false );
		}
	};

	this._direction = function ( direction ) {
		_c.addClass( this.labelPlaceholder, 'circle__arrow' );

		if ( direction !== '' || direction !== null || direction !== undefined ) {
			_c.addClass( this.labelPlaceholder, 'circle__arrow--' + direction );
			this.labelPlaceholder.textContent = direction;
		} else {
			_c.addClass( this.labelPlaceholder, 'circle__arrow--up' );
			this.labelPlaceholder.textContent = 'Up';
		}
	};
}

/******************************
 * WEB FONT RENDERING BUG FIX *
 ******************************/
function WebFontToggle () {
	var userAgentString = navigator.userAgent,
		browser = userAgentString.match( /(Chrome\/\d{2})/g ),
		version = browser[0].match( /(\d)+/g ),
		webFont = document.getElementById( 'web-font' );

	if ( version <= 30 ) {
		webFont.parentNode.removeChild( webFont );
	}
}

/********************
 * PRODUCT TIMELINE *
 ********************/
function ProductTimeline () {
	this._init = function ( jsonData ) {
		this.categoriesData = jsonData;
		this.categoriesTimelineContainer = document.getElementById( 'category-timeline__wrapper' );
		this.productsTimelineContainer = document.getElementById( 'product-timeline__wrapper' );
		this.categoriesTimeline = document.getElementById( 'category-timeline' );
		this.productsTimeline = document.getElementById( 'product-timeline' );
		this.backBtn = document.getElementById( 'product-timeline__back-btn' );

		this._buildTimelineWrapper( this.categoriesTimeline, this.categoriesData, 'category' );
		this._buildTimelineWrapper( this.productsTimeline, this.categoriesData, 'product' );
		this._buildTimeline( this.categoriesData.categories, this.categoriesData.timeframe, this.categoriesTimeline, 'categories', 'category' );
		this._initEvents();
	}

	this._initEvents = function ( productData ) {
		var self = this;

		window.addEventListener( 'resize', function () {
			self._resizeTimelineWrapper( self.categoriesTimeline, self.categoriesData, 'category' );
			self._resizeTimelineWrapper( self.productsTimeline, self.categoriesData, 'product' );
			self._resizeTimeline( self.categoriesData.categories, self.categoriesData.timeframe, 'categories', 'category', self.categoriesTimeline );
			
			if ( productData ) {
				self._resizeTimeline( productData, self.categoriesData.timeframe, 'products', 'product', self.productsTimeline );
			}
		});

		_c.click( this.backBtn, function () {
			self._navigate( 1 );
			setTimeout( function () {
				self._destroyProductTimeline();
			}, 760 );
		});
	};

	this._initTimelineEvents = function ( type ) {
		var self = this,
				categoriesItem = document.getElementsByClassName( 'timeline-category' );

		[].forEach.call( categoriesItem, function ( c ) {
			_c.click( c, function () {
				var product = this.querySelectorAll( 'p' )[0].textContent;

				for ( var i = 0, l = self.categoriesData.categories.length; i < l; i++ ) {
					if ( self.categoriesData.categories[i].category === product ) {
						var data = self.categoriesData.categories[i];
						break;
					}
				}

				self.backBtn.innerHTML = '<span></span>' + product;
				self._buildTimeline( data, self.categoriesData.timeframe, self.productsTimeline, 'products', 'product' );
				self._navigate( 2 );
			});
		});
	};

	this._buildTimelineWrapper = function ( containerID, data, timelineType ) {
		var scale = document.createElement( 'ul' ),
				timeframe = data.timeframe,
				wrapperWidth = containerID.offsetWidth,
				separatorDistance = (wrapperWidth / timeframe.length);

		scale.id = timelineType + '-timeline__scale';
		scale.className = timelineType + '-timeline__scale';

		for ( var i = 0, l = timeframe.length; i < l; i++ ) {
			var line = document.createElement( 'li' ),
					label = document.createElement( 'p' );

			if ( timelineType === 'product' ) {
				var investment = document.createElement( 'p' );

				investment.className = 'timeline-investment';
				line.appendChild( investment );
			}

			label.innerText = timeframe[i];
			line.appendChild( label );
			scale.appendChild( line );
		}

		containerID.appendChild( scale );

		this._resizeTimelineWrapper( containerID, data, timelineType );
		this._initTimelineEvents( 'category' );
	};

	this._buildTimeline = function ( timelineData, timeframe, timelineID, dataType, timelineType ) {
		var data = timelineData,
				container = document.createElement( 'ul' ),
				investmentLabel = document.getElementsByClassName( 'timeline-investment' ),
				wrapperWidth = timelineID.offsetWidth,
				monthWidth = ( wrapperWidth / ( timeframe.length ) ).toFixed( 2 );

		container.id = timelineType + '-timeline__' + dataType;
		container.className = timelineType + '-timeline__' + dataType;

		if ( timelineType === 'product' ) {
			var productData = data.data.products;

			for ( var i = 0, l = productData.length; i < l; i++ ) {
				var row = document.createElement( 'li' ),
						rowContainer = document.createElement( 'ul' );

				for ( var j = 0, k = productData[i].series.length; j < k; j++ ) {
					var rowItem = document.createElement( 'li' ),
							itemTitle = document.createElement( 'p' ),
							itemPrice = document.createElement( 'p' );

					rowContainer.className = 'product-timeline__product clearfix';
					rowItem.className = 'timeline-product';

					itemTitle.innerText = productData[i].series[j].name + ' - (' + productData[i].series[j].udac + ')';

					var price = productData[i].series[j].price.replace( /\$/, '' );

					itemPrice.innerText = _c.translator( 'dollarFormat', {
						amount: price
					});

					rowItem.appendChild( itemTitle );
					rowItem.appendChild( itemPrice );
					rowContainer.appendChild( rowItem );
				}

				row.appendChild( rowContainer );
				container.appendChild( row );
			}

			// Check what is the highest and lowest investment for each products
			var investmentData = data.data.investment,
					highest = 0,
					lowest = 999999999;

			for ( var j = 0, k = investmentData.length; j < k; j++ ) {
				if ( highest < investmentData[j] ) {
					highest = investmentData[j];
				}

				if ( lowest >= investmentData[j] ) {
					lowest = investmentData[j];
				}
			}

			// Print the investment labels for each month
			for ( var i = 0, l = investmentLabel.length; i < l; i++ ) {

				if ( investmentData[i] < 0 ) {
					investmentLabel[i].textContent = '- ' + _c.translator( 'dollarFormat', {
						amount: _c.cleanNumber( investmentData[i], 0 )
					});
				} else {
					investmentLabel[i].textContent = _c.translator( 'dollarFormat', {
						amount: _c.cleanNumber( investmentData[i], 0 )
					});
				}

				if ( investmentData[i] === highest ) {
					_c.addClass( investmentLabel[i], 'highest' );
				}

				if ( investmentData[i] === lowest ) {
					_c.addClass( investmentLabel[i], 'lowest' );
				}
			}
		} else {
			for ( var i = 0, l = data.length; i < l; i++ ) {
				var row = document.createElement( 'li' ),
						rowContainer = document.createElement( 'ul' );

				for ( var j = 0, k = data[i].series.length; j < k; j++ ) {
					var rowItem = document.createElement( 'li' ),
							itemTitle = document.createElement( 'p' ),
							itemPrice = document.createElement( 'p' );

					rowContainer.className = 'category-timeline__category clearfix';
					rowItem.className = 'timeline-category';

					itemTitle.innerText = data[i].series[j].name;
					rowItem.appendChild( itemTitle );

					rowContainer.appendChild( rowItem );
				}

				row.appendChild( rowContainer );
				container.appendChild( row );
			}
		}

		timelineID.appendChild( container );

		if ( timelineType === 'category' ) {
			this._resizeTimeline( timelineData, timeframe, 'categories', 'category', this.categoriesTimeline );
			this._initTimelineEvents( timelineType );
		}

		if ( timelineType === 'product' ) {
			this._initEvents( timelineData.data.products );
			this._resizeTimeline( timelineData.data.products, timeframe, 'products', 'product', this.productsTimeline );
		}
	};

	this._resizeTimelineWrapper = function ( containerID, data, timelineType ) {
		var lines = document.querySelectorAll( '#' + timelineType + '-timeline__scale li' ),
				timeframe = data.timeframe.length,
				wrapperWidth = containerID.offsetWidth,
				separatorDistance = ( wrapperWidth / timeframe );

		for ( var i = 0, l = lines.length; i < l; i ++ ) {
			lines[i].style.left = ( ( separatorDistance * i ) + ( separatorDistance / 2 ) ).toFixed( 2 ) + 'px';
		}
	};

	this._resizeTimeline = function ( data, timeframe, dataType, timelineType, containerID ) {
		var timelineData = data,
				container = document.getElementById( timelineType + '-timeline__' + dataType ),
				itemContainer = document.getElementsByClassName( timelineType + '-timeline__' + timelineType ),
				timeframe = timeframe,
				wrapperWidth = containerID.offsetWidth,
				monthWidth = ( wrapperWidth / ( timeframe.length ) ).toFixed( 2 );

		if ( container ) {
			container.style.width = ( wrapperWidth - monthWidth ) + 'px';
			container.style.left = monthWidth / 2 + 'px';
		
			for ( var i = 0, l = timelineData.length; i < l; i++ ) {
				var item = itemContainer[i].querySelectorAll( 'li' );

				for ( var j = 0, k = timelineData[i].series.length; j < k; j++ ) {
					item[j].style.width = ( monthWidth * ( timelineData[i].series[j].months.length - 1 ) ) + 'px';

					for ( var m = 0, n = timeframe.length; m < n; m++ ) {
						if ( timelineData[i].series[j].months[0] === timeframe[m] ) {
							item[j].style.left = monthWidth * m + 'px';
							break;
						}
					}
				}
			}
		}
	};

	this._destroyProductTimeline = function () {
		var investmentLabel = document.getElementsByClassName( 'timeline-investment' );

		if ( document.getElementById( 'product-timeline__products' ) ) {
			this.productsTimeline.removeChild( document.getElementById( 'product-timeline__products' ) );
		}

		for ( var i = 0, l = investmentLabel.length; i < l; i++ ) {
			investmentLabel[i].textContent = '';
			_c.removeClass( investmentLabel[i], ['highest', 'lowest'] );
		}	
	};

	this._navigate = function ( level ) {
		switch ( level ) {
			case 1:
				_c.removeClass( this.categoriesTimelineContainer, 'level-2' );
				_c.removeClass( this.productsTimelineContainer, 'level-2' );
				_c.removeClass( this.productsTimelineContainer, 'ready', 760 );
				break;

			case 2:
				this.productsTimelineContainer.style.top = - this.categoriesTimelineContainer.scrollHeight + 30 + 'px';
				_c.addClass( this.productsTimelineContainer, 'ready' );
				_c.addClass( this.categoriesTimelineContainer, 'level-2' );
				_c.addClass( this.productsTimelineContainer, 'level-2' );
				break;
		}
	}
}

/******************
 * ROI CALCULATOR *
 ******************/
function ROICalculator () {
	this._init = function ( calculator, isInline ) {
		this.calculator = calculator;
		this.isInline = isInline;

		this.totals = {
			contacts: this.calculator.querySelectorAll( '.roi-calculator__contacts header h1' )[0],
			percentage: this.calculator.querySelectorAll( '.roi-calculator__percentages header h1' )[0],
			revenue: this.calculator.querySelectorAll( '.roi-calculator__revenue header h1' )[0]
		};

		this.estimatedCallsContainer = this.calculator.querySelectorAll( '.roi-calculator__estimated-calls' )[0];
		this.callsPlaceholder = ( this.isInline ) ? this.calculator.querySelectorAll( '.roi-calculator__contacts ul li h2' )[0] : this.calculator.querySelectorAll( '.roi-calculator__contacts ul li h2' )[1];

		this.inputs = {
			contacts: {
				all: ( this.isInline ) ? this.calculator.querySelectorAll( '.roi-calculator__contacts input.roi-calculator__inline-checkbox' ) : this.calculator.querySelectorAll( '.roi-calculator__contacts input.roi-calculator__toolbox-checkbox' ), // exclude estimated calls checkbox
				estimatedCalls: this.calculator.querySelectorAll( '.roi-calculator__estimated-calls input' )[0],
				calls: this.calculator.querySelectorAll( '.roi-calculator__calls' )[0],
				walkIns: this.calculator.querySelectorAll( '.roi-calculator__walk-ins' )[0],
				digitalContacts: this.calculator.querySelectorAll( '.roi-calculator__digital-contacts' )[0]
			},
			percentages: {
				all: this.calculator.querySelectorAll( '.roi-calculator__percentages input' ),
				calls: this.calculator.querySelectorAll( '.roi-calculator__calls--percentage' )[0],
				walkIns: this.calculator.querySelectorAll( '.roi-calculator__walk-ins--percentage' )[0],
				digitalContacts: this.calculator.querySelectorAll( '.roi-calculator__digital-contacts--percentage' )[0]
			},
			customerValue: this.calculator.querySelectorAll( '.roi-calculator__customer-value' )[0]
		};

		this.resetBtns = this.calculator.querySelectorAll( '.reset-btn' );

		var self = this;

		[].forEach.call( this.inputs.contacts.all, function ( input ) {
			self._toggleContacts( input, input.getAttribute( 'data-value' ) );
		});

		this._updateContacts();
		this._loadPercentages();
		this._updatePercentages();
		this._loadCustomerValue();
		this._calculateRevenue();
		this._initEvents();
	};

	this._initEvents = function () {
		var self = this;

		[].forEach.call( this.inputs.contacts.all, function ( input ) {
			_c.click( input, function ( e ) {
				var t = e.target;

				if ( _c.hasClass( t, 'roi-calculator__calls' ) ) {
					if ( this.checked ) {
						_c.removeClass( self.estimatedCallsContainer, 'disabled' );
						console.log( 'Test' );
						self.inputs.contacts.estimatedCalls.disabled = false;
					} else {
						_c.addClass( self.estimatedCallsContainer, 'disabled' );
						self.inputs.contacts.estimatedCalls.disabled = true;
					}
				}

				self._toggleContacts( this, this.getAttribute( 'data-value' ) );
				self._updateContacts();
				self._updatePercentages();
				self._calculateRevenue();
			});
		});

		for ( var i = 0, l = this.inputs.percentages.all.length; i < l; i++ ) {
			this.inputs.percentages.all[i].addEventListener( 'keydown', function ( e ) {
				var k = e.keyCode,
						codes = {
							48: 0,
							49: 1,
							50: 2,
							51: 3,
							52: 4,
							53: 5,
							54: 6,
							55: 7,
							56: 8,
							57: 9,
							96: 0,
							97: 1,
							98: 2,
							99: 3,
							100: 4,
							101: 5,
							102: 6,
							103: 7,
							104: 8,
							105: 9,
						};

				// Allow the user to do Select-All from their keyboard
				if ( e.ctrlKey && ( k === 65 ) || e.metaKey && ( k === 65 ) ) {
					return;
				}

				// if the user press CMD + R ( on a Mac ) the window will refresh
				// if the user press control + R ( on a PC ) the window will refresh
				if ( e.ctrlKey && ( k === 82 ) || e.metaKey && ( k === 82 ) ) {
					window.location.reload();
				}

				if ( ( e.shiftKey && ( k > 47 || k < 58 ) ) || (( k < 37 || k > 40 ) && ( k < 48 || k > 57 ) && ( k < 96 || k > 105 ) ) ) {
					if ( k !== 8 && k !== 9 && k !== 35 && k !== 36 && k !== 46 ) {
						e.preventDefault();
					}
				}

				// Prevent the user to type a number bigger than 100
				if ( this.value + codes[ k ] > 100 ) {
					e.preventDefault();
				}
			}, false );

			this.inputs.percentages.all[i].addEventListener( 'keyup', function ( e ) {
				self._updatePercentages();
				self._calculateRevenue();
			}, false );

			this.inputs.percentages.all[i].addEventListener( 'focus', function () {
				this.value = this.value.replace( /(,)+/g, '' );
			}, false );

			this.inputs.percentages.all[i].addEventListener( 'blur', function () {
				this.value = _c.cleanNumber( this.value, 0 );
			}, false );
		}

		this.inputs.customerValue.addEventListener( 'keydown', function ( e ) {
			var k = e.keyCode,
					codes = {
							48: 0,
							49: 1,
							50: 2,
							51: 3,
							52: 4,
							53: 5,
							54: 6,
							55: 7,
							56: 8,
							57: 9,
							96: 0,
							97: 1,
							98: 2,
							99: 3,
							100: 4,
							101: 5,
							102: 6,
							103: 7,
							104: 8,
							105: 9,
						};

			// Allow the user to do Select-All from their keyboard
			if ( e.ctrlKey && ( k === 65 ) || e.metaKey && ( k === 65 ) ) {
				return;
			}

			// if the user press CMD + R ( on a Mac ) the window will refresh
			// if the user press control + R ( on a PC ) the window will refresh
			if ( e.ctrlKey && ( k === 82 ) || e.metaKey && ( k === 82 ) ) {
				window.location.reload();
			}

			if ( ( e.shiftKey && ( k > 47 || k < 58 ) ) || (( k < 37 || k > 40 ) && ( k < 48 || k > 57 ) && ( k < 96 || k > 105 ) ) ) {
				if ( k !== 8 && k !== 9 && k !== 35 && k !== 36 && k !== 46 ) {
					e.preventDefault();
				}
			}

			// Prevent the user to type a number bigger than 1,000,000,000
			if ( this.value + codes[ k ] > 1000000000 ) {
				e.preventDefault();
			}
		}, false );

		this.inputs.customerValue.addEventListener( 'keyup', function () {
			self._calculateRevenue();
		}, false );

		this.inputs.customerValue.addEventListener( 'focus', function () {
			this.value = this.value.replace( /(,)+/g, '' );
		}, false );

		this.inputs.customerValue.addEventListener( 'blur', function () {
			this.value = _c.cleanNumber( this.value, 0 );
		}, false );

		for ( var i = 0, l = this.resetBtns.length; i < l; i++ ) {
			this.resetBtns[i].addEventListener( 'click', function () {
				self._resetValue( this, this.getAttribute( 'data-value' ) );
			}, false );
		}

		_c.click( this.inputs.contacts.estimatedCalls, function () {
			self._updateContacts();
			self._updatePercentages();
			self._calculateRevenue();
		});
	};

	// updates the total contacts in the contacts header
	this._updateContacts = function () {
		var totalContacts = 0;

		if ( this.inputs.contacts.estimatedCalls.checked ) {
			var realCalls = parseInt( this.inputs.contacts.calls.getAttribute( 'data-original' ).replace( /\D/, '' ) ),
					estimatedCalls = parseInt( this.inputs.contacts.estimatedCalls.getAttribute( 'data-contacts' ).replace( /\D/, '' ) );

			this.inputs.contacts.calls.setAttribute( 'data-contacts', realCalls + estimatedCalls );
		} else {
			var realCalls = parseInt( this.inputs.contacts.calls.getAttribute( 'data-original' ).replace( /\D/, '' ) );

			this.inputs.contacts.calls.setAttribute( 'data-contacts', realCalls );
		}

		for ( var i = 0, l = this.inputs.contacts.all.length; i < l; i++ ) {
			if ( this.inputs.contacts.all[i].checked ) {
				totalContacts += parseInt( this.inputs.contacts.all[i].getAttribute( 'data-contacts' ).replace( /\D/, '' ) );
			}
		}

		if ( this.inputs.contacts.calls.checked ) {
			var calls = parseInt( this.inputs.contacts.calls.getAttribute( 'data-contacts' ).replace( /\D/, '' ) );

			if ( this.isInline ) {
				this.callsPlaceholder.textContent = _c.cleanNumber( calls, 0 );
			}
		}

		this.totals.contacts.textContent = _c.cleanNumber( totalContacts, 0 );
	};

	// load the data-percentage data in each percentage input
	this._loadPercentages = function () {
		for ( var i = 0, l = this.inputs.percentages.all.length; i < l; i++ ) {
			this.inputs.percentages.all[i].value = this.inputs.percentages.all[i].getAttribute( 'data-percentage' );
		}
	};

	// updates the total percentage in the Overall percentage of contacts... header
	this._updatePercentages = function () {
		var contacts = [],
				percentContacts = [],
				percent = 0;

		// push all active contacts value to the contacts array
		// calculate the percentage of all contacts and push it in the percentContacts array
		for ( var i = 0, l = this.inputs.contacts.all.length; i < l; i++ ) {
			if ( this.inputs.contacts.all[i].checked ) {
				var contact = parseInt( this.inputs.contacts.all[i].getAttribute( 'data-contacts' ).replace( /\D/, '' ) ),
						percentage = parseFloat( ( this.inputs.percentages.all[i].value / 100 ).toFixed( 2 ) );

				contacts[i] = contact;
				percentContacts[i] = contact * percentage;
			} else {
				contacts[i] = 0;
				percentContacts[i] = 0;
			}
		}

		var totalContacts = 0;

		// sum all values of contacts[]
		contacts.forEach( function ( c ) {
			totalContacts += c;
		});

		var calculatedContacts = 0;

		// sum all values of percentContacts[]
		percentContacts.forEach( function ( c ) {
			calculatedContacts += c;
		});

		calculatedContacts = parseFloat( ( calculatedContacts.toFixed( 1 ) ) );

		// calculate the overall percentage
		if ( calculatedContacts !== 0 && totalContacts !== 0 ) {
			percent = ( calculatedContacts / totalContacts ) * 100;
		} else {
			percent = 0;
		}

		// print the result to the percentage column
		this.totals.percentage.textContent = _c.cleanNumber( percent ) + ' %';
	};

	// load the data-customer-value data in the customer value input
	this._loadCustomerValue = function () {
		this.inputs.customerValue.value = _c.cleanNumber( this.inputs.customerValue.getAttribute( 'data-customer-value' ) );
	};

	// calculates the revenue
	this._calculateRevenue = function () {
		var total = parseInt( this.totals.contacts.innerText.replace( /\D/g, '' ) ),
				total = total * ( parseFloat( this.totals.percentage.innerText.replace( /\D/g, '' ) ) / 100 ).toFixed(3);

		if ( this.inputs.customerValue.value === '' ) {
			total = total * 0;
		} else {
			total = total * parseInt( this.inputs.customerValue.value.replace( /\D/g, '' ) );
		}

		if ( total < 0 ) {
			this.totals.revenue.textContent = '- ' + _c.translator( 'dollarFormat', {
				amount: _c.cleanNumber( total, 0 )
			});
		} else {
			this.totals.revenue.textContent = _c.translator( 'dollarFormat', {
				amount: _c.cleanNumber( total, 0 )
			});
		}
	};

	this._toggleContacts = function ( elem, value ) {
		var percentage = undefined;

		switch ( value ) {
			case 'calls':
				percentage = this.inputs.percentages.calls;

				if ( elem.checked ) {
					percentage.disabled = false;
					_c.removeClass( elem.parentNode, 'disabled' );
					_c.removeClass( percentage.parentNode, 'disabled' );
				} else {
					percentage.disabled = true;
					_c.addClass( elem.parentNode, 'disabled' );
					_c.addClass( percentage.parentNode, 'disabled' );
				}
				break;

			case 'walk-ins':
				percentage = this.inputs.percentages.walkIns;

				if ( elem.checked ) {
					percentage.disabled = false;
					_c.removeClass( elem.parentNode, 'disabled' );
					_c.removeClass( percentage.parentNode, 'disabled' );
				} else {
					percentage.disabled = true;
					_c.addClass( elem.parentNode, 'disabled' );
					_c.addClass( percentage.parentNode, 'disabled' );
				}
				break;

			case 'digital-contacts':
				percentage = this.inputs.percentages.digitalContacts;

				if ( elem.checked ) {
					percentage.disabled = false;
					_c.removeClass( elem.parentNode, 'disabled' );
					_c.removeClass( percentage.parentNode, 'disabled' );
				} else {
					percentage.disabled = true;
					_c.addClass( elem.parentNode, 'disabled' );
					_c.addClass( percentage.parentNode, 'disabled' );
				}
				break;
		}
	};

	this._resetValue = function ( elem, value ) {
		_c.addClass( elem, 'rotate' );
		_c.removeClass( elem, 'rotate', 510 );

		switch ( value ) {
			case 'all-percentages':
				for ( var i = 0, l = this.inputs.percentages.all.length; i < l; i++ ) {
					this.inputs.percentages.all[i].value = _c.cleanNumber( this.inputs.percentages.all[i].getAttribute( 'data-original' ), 0 );
				}
				break;

			case 'calls':
				this.inputs.percentages.calls.value = _c.cleanNumber( this.inputs.percentages.calls.getAttribute( 'data-original' ), 0 );
				break;

			case 'walk-ins':
				this.inputs.percentages.walkIns.value = _c.cleanNumber( this.inputs.percentages.walkIns.getAttribute( 'data-original' ), 0 );
				break;

			case 'digital-contacts':
				this.inputs.percentages.digitalContacts.value = _c.cleanNumber( this.inputs.percentages.digitalContacts.getAttribute( 'data-original' ), 0 );
				break;

			case 'customer-value':
				this.inputs.customerValue.value = _c.cleanNumber( this.inputs.customerValue.getAttribute( 'data-original' ), 0 );
				break;
		}

		this._updatePercentages();
		this._calculateRevenue();
	}
}

/************
 * SETTINGS *
 ************/
function Settings () {
	this._init = function () {
		this.buttons = {
			open: document.getElementById( 'settings-btn' ),
			close: document.getElementsByClassName( 'settings__close' )[0]
		};
		this.settings = document.getElementById( 'settings' );
		this.curtain = document.getElementById( 'content-curtain__settings' );

		this._initEvents();
	};

	this._initEvents = function () {
		var self = this;
		
		_c.click( this.buttons.open, function ( e ) {
			e.preventDefault();
			self._toggleSettingsPanel( 'open' );
		});

		_c.click( this.buttons.close, function () {
			self._toggleSettingsPanel( 'close' );
		});
	};

	this._toggleSettingsPanel = function ( state ) {
		switch ( state ) {
			case 'open':
				_c.addClass( [this.settings, this.curtain], 'active' );
				break;

			case 'close':
				_c.removeClass( [this.settings, this.curtain], 'active' );
				break;
		}
	};
}

/******************
 * CONFIRM DIALOG *
 ******************/
function ConfirmDialog () {
	this._init = function ( trigger, dialogID ) {
		this.trigger = trigger;
		this.dialog = dialogID;
		this.curtain = document.getElementById( 'confirm-dialog__curtain' );
		this.buttons = {
			confirm: this.dialog.querySelectorAll( '.confirm-dialog__cancel' )[0],
			cancel: this.dialog.querySelectorAll( '.confirm-dialog__confirm' )[0]
		};
		this.content = document.getElementById( 'pusher' );

		this._initEvents();
	};

	this._initEvents = function () {
		var self = this;

		if(this.trigger) {
			_c.click( this.trigger, function () {
				self._toggleDialog( 'on' );
			});
		}

		_c.click( this.buttons.confirm, function () {
			self._toggleDialog( 'off' );
			self._onConfirm();
		});

		_c.click( this.buttons.cancel, function () {
			self._toggleDialog( 'off' );
			self._onCancel();
		});
	};

	this._toggleDialog = function ( state ) {
		switch ( state ) {
			case 'on':
				_c.addClass( this.curtain, 'active' );
				_c.addClass( this.content, 'dialog-active' );
				break;

			case 'off':
				_c.removeClass( this.curtain, 'active' );
				_c.removeClass( this.content, 'dialog-active' );
				break;
		}
	};

	// Cancel and Confirm callbacks
	this._onConfirm = function () {
		if(this.onConfirm){
			this.onConfirm();
		}
	}

	this._onCancel = function () {
		if(this.onCancel){
			this.onCancel();
		}
	}

	this._openDialog = function ( config ) {
		if (config) {
			if (config.boxTitle) {
				this.dialog.querySelectorAll('.confirm-dialog__title')[0].innerText = config.boxTitle;
			}
			
			if (config.boxDescription) {
				this.dialog.querySelectorAll('.confirm-dialog__description')[0].innerText = config.boxDescription;
			}
			if (config.OKBtnTitle) {
				this.buttons.confirm.innerText = config.OKBtnTitle;
			}
			if (config.cancelBtnTitle) {
				this.buttons.cancel.innerText = config.cancelBtnTitle;
			}
			if (config.onConfirm) {
				this.onConfirm = config.onConfirm;
			}
			if (config.onCancel) {
				this.onCancel = config.onCancel;
			}
		}
		this._toggleDialog('on');
	};
}


/******************
 * decision DIALOG *
 ******************/
function DecisionDialog () {
	this._init = function ( trigger, dialogID ) {
		this.trigger = trigger;
		this.dialog = dialogID;
		this.curtain = document.getElementById( 'decision-dialog__curtain' );
		this.buttons = {
			cancel: this.dialog.querySelectorAll( '.decision-dialog__cancel' )[0],
			op1: this.dialog.querySelectorAll( '.decision-dialog__op_1' )[0],
			op2: this.dialog.querySelectorAll( '.decision-dialog__op_2' )[0]
		};
		this.content = document.getElementById( 'pusher' );

		this._initEvents();
	};

	this._initEvents = function () {
		var self = this;

		if(this.trigger) {
			_c.click( this.trigger, function () {
				self._toggleDialog( 'on' );
			});
		}

		_c.click( this.buttons.op1, function () {
			self._toggleDialog( 'off' );
			self._onOp1();
		});

		_c.click( this.buttons.op2, function () {
			self._toggleDialog( 'off' );
			self._onOp2();
		});

		_c.click( this.buttons.cancel, function () {
			self._toggleDialog( 'off' );
			self._onCancel();
		});
	};

	this._toggleDialog = function ( state ) {
		switch ( state ) {
			case 'on':
				_c.addClass( this.curtain, 'active' );
				_c.addClass( this.content, 'dialog-active' );
				break;

			case 'off':
				_c.removeClass( this.curtain, 'active' );
				_c.removeClass( this.content, 'dialog-active' );
				break;
		}
	};

	// Cancel and Confirm callbacks
	this._onOp1 = function () {
		if(this.onOp1){
			this.onOp1();
		}
	}

	this._onOp2 = function () {
		if(this.onOp2){
			this.onOp2();
		}
	}

	this._onCancel = function () {
		if(this.onCancel){
			this.onCancel();
		}
	}

	this._openDialog = function ( config ) {
		if (config) {
			if (config.boxTitle) {
				this.dialog.querySelectorAll('.confirm-dialog__title')[0].innerText = config.boxTitle;
			}
			
			if (config.boxDescription) {
				this.dialog.querySelectorAll('.confirm-dialog__description')[0].innerText = config.boxDescription;
			}
			if (config.OP1_BtnTitle) {
				this.buttons.op1.innerText = config.OP1_BtnTitle;
			}
			if (config.OP2_BtnTitle) {
				this.buttons.op2.innerText = config.OP2_BtnTitle;
			}
			if (config.cancelBtnTitle) {
				this.buttons.cancel.innerText = config.cancelBtnTitle;
			}
			if (config.onCancel) {
				this.onCancel = config.onCancel;
			}
			if (config.onOp1) {
				this.onOp1 = config.onOp1;
			}
			if (config.onOp2) {
				this.onOp2 = config.onOp2;
			}
		}
		this._toggleDialog('on');
	};
}

/****************
 * DOWNLOAD PDF *
 ****************/
function DownloadPDF () {
	this._init = function () {
		//this.list = document.getElementById( 'timeframe-list__download-pdf' );
		this.downloadBtnOld = document.getElementById( 'generate-pdf-tool' );
		this.downloadBtn = document.getElementsByClassName( 'download-pdf-btn' )[0];
		this.notificationMessage = message = document.getElementById( 'generate-pdf-tool' ).getAttribute( 'data-notification-message' );

		this._initEvents();
	};

	this._initEvents = function () {
		var self = this;

		/*_c.click( this.downloadBtnOld, function ( e ) {
			generatePDF();
		});*/
		
		/*_c.click( this.list, function ( e ) {
			var t = e.target;

			if ( t.tagName === 'A' ) {
				e.preventDefault();
				_c.checkmark( this, t );
			}
		});*/

		_c.click( this.downloadBtnOld, function () {
			toolbox._resetMenu();
			 generatePDF();

			setTimeout( function () {
				notifications._activateNotification( self.notificationMessage );
			}, 350 );
		});
	}
}

/************************
 * PLAY TUTORIAL VIDEOS *
 ************************/
function PlayTutorial () {
	this._init = function () {
		this.videoList = document.getElementsByClassName( 'video-tutorial__list' )[0];
		this.viewer = document.getElementById( 'video-tutorial__viewer' );
		this.viewerIsOn = false;
		this.viewerTitle = document.getElementById( 'video-tutorial__viewer-title' );
		this.viewerVideo = document.getElementById( 'video-tutorial__video-container' );
		this.viewerVideoSources = this.viewerVideo.children;
		this.videoExtensions = [ 'mp4' ];
		this.videoTypes = [ 'mp4' ];
		this.videoLoader = document.getElementById( 'preloader--video' );
		this.closeBtn = document.getElementById( 'video-tutorial__close-viewer' );

		console.log( this.videoLoader );

		_c.css( this.viewer, {
			'top': window.innerHeight - 312 + 'px',
			'left': '-9999%'
		}, 210 );

		this._initEvents();
	};

	this._initEvents = function () {
		var self = this;

		_c.click( this.videoList, function ( e ) {
			e.preventDefault();

			var t = e.target;

			while ( t.tagName !== 'LI' ) {
				t = t.parentNode;
			}

			t = t.children;

			var videoTitle = t[0].getAttribute( 'data-video-title' ),
					videoID = t[0].getAttribute( 'data-video-id' );

			self._toggleViewer( 'on', videoTitle, videoID );
		});

		_c.click( this.closeBtn, function () {
			self._toggleViewer( 'off' );
			self._destroyVideoViewer();
			this.viewerIsOn = false;
		});

		window.addEventListener( 'resize', function () {
			if ( _c.hasClass( self.viewer, 'active' ) ) {
				self._resize();
			}
		}, false );
	};

	this._loadVideo = function ( videoTitle, videoID ) {
		var self = this;

		if ( this.viewerIsOn ) {
			this._destroyVideoViewer();
		}

		console.log( this.videoLoader );
		
		this.viewerVideo.appendChild( this._buildVideoViewer( videoTitle, videoID ) );
		this._toggleLoad( 'on' );

		var video = document.getElementById( 'video-tutorial__video' );

		video.addEventListener( 'waiting', function ( e ) {
			self._toggleLoad( 'on' );
		}, false );

		video.addEventListener( 'loadeddata', function ( e ) {
			self._toggleLoad( 'off' );
		}, false );

		video.addEventListener( 'stalled', function ( e ) {
			self._toggleLoad( 'on' );
		}, false );

		video.addEventListener( 'canplay', function ( e ) {
			self._toggleLoad( 'off' );
		}, false );

		video.addEventListener( 'load', function ( e ) {
			self._toggleLoad( 'off' );
			console.log( 'loadend' );
		}, false );
	};

	this._toggleLoad = function ( state ) {
		switch ( state ) {
			case 'on':
				_c.addClass( this.videoLoader, 'active' );
				break;

			case 'off':
				_c.removeClass( this.videoLoader, 'active' );
				break;
		}
	};

	this._buildVideoViewer = function ( videoTitle, videoURL ) {
		var video = document.createElement( 'video' );

		this.viewerTitle.textContent = videoTitle;
		this.viewerTitle.title = videoTitle;
		
		video.id = 'video-tutorial__video';
		video.controls = 'true';
		video.poster = '';
		video.preload = 'auto';
		video.width = '1280';

		for ( var i = 0, l = this.videoExtensions.length; i < l; i++ ) {
			var source = document.createElement( 'source' );

			source.src = videoURL + '.' + this.videoExtensions[i];
			source.type = 'video/' + this.videoTypes[i];
			video.appendChild( source );
		}

		return video;
	};

	this._destroyVideoViewer = function () {
		var self = this;

		if ( this.viewerIsOn ) {
			this.viewerVideo.innerHTML = '';
		} else {
			setTimeout( function () {
				self.viewerVideo.innerHTML = '';
			}, 300 );
		}
	};

	this._toggleViewer = function ( state, videoTitle, videoID ) {
		var self = this;

		switch ( state ) {
			case 'on':
				this._loadVideo( videoTitle, videoID );

				this.viewerIsOn = true;

				_c.css( this.viewer, {
					'top': window.innerHeight - 312 + 'px',
					'left': window.innerWidth - 420 + 'px'
				});

				_c.addClass( this.viewer, 'ready' );
				_c.addClass( this.viewer, 'active', 0 );
				_c.removeClass( this.viewer, 'ready', 210 );
				break;

			case 'off':
				this.viewerIsOn = false;

				_c.addClass( this.viewer, 'ready' );
				_c.removeClass( this.viewer, 'active', 0 );
				_c.removeClass( this.viewer, 'ready', 210 );

				_c.css( this.viewer, {
					'top': window.innerHeight - 312 + 'px',
					'left': '-9999%'
				}, 210 );

				setTimeout( function () {
					self.viewerVideo.removeAttribute( 'src' );
				}, 210 );
				break;
		}
	};

	this._resize = function () {
		var thisBox = this.viewer.getBoundingClientRect();

		if ( thisBox.right > window.innerWidth && window.innerWidth > 430 ) {
			_c.css( this.viewer, {
				'left': ( window.innerWidth - ( thisBox.width + 20 ) ) + 'px'
			});
		}

		if ( thisBox.bottom > window.innerHeight && window.innerHeight > 320 ) {
			_c.css( this.viewer, {
				'top': ( window.innerHeight - ( thisBox.height + 20 ) ) + 'px'
			});
		}

		if ( thisBox.top < 20 && window.innerHeight < 320 ) {
			_c.css( this.viewer, {
				'top': '20px'
			});
		}

		if ( thisBox.left < 20 && window.innerWidth < 430 ) {
			_c.css( this.viewer, {
				'left': '20px'
			});
		}
	};
}

/************
 * CHARTING *
 ************/
function LoadChart () {
	this._init = function ( dataInputID, placeholderID ) {
		this.data = JSON.parse( document.getElementById( dataInputID ).value );
		this.chart = document.getElementById( placeholderID );
		this.legend = ( this.data.values.length > 1 ) ? true : false;

		this._loadChart();
	};

	this._loadChart = function () {
		new Highcharts.Chart({
			chart: {
				renderTo: this.chart,
				type: this.data.extra.chartType.toLowerCase(),
				spacingBottom: ( this.legend ) ? 45 : 0
			},

			xAxis: {
				categories: this.data.labels
			},

			yAxis: {
				title: {
					text: this.data.labelY
				}
			},

			series: this.data.values,

			legend: {
				enabled: this.legend
			}
		});
	};
}