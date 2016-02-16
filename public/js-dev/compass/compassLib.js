/***********************************************************************
CompassLib.js is a library that allows you to manipulate the DOM
as well as use / interact with Compass UI objects.

Import this file at the bottom of the <body> tag then initialize it
in your main javascript file.

i.e.:
var _c = new CompassLib();

Then you can use it accross all your web application.

i.e.:

var elem = document.getElementById( 'id' ),
	 html = '<p>Hello World!</p>';

_c.add( elem, html );

Every Compass UI Object needs to be initialized in the same way before
being used.

i.e.:
var sideMenu = new SideMenu();
sideMenu._init();

All objects are structure following this principle:
		* this._init() contains all the variables you need in the object.
	* this._init() then calls this._initEvents() which applies all the
	  event listeners.
	* Then it contains the functions it needs to perform it's tasks.

i.e.:

function UiObject () {
	this._init = function () {
		this.abc = document.getElementById( 'id' );
		this.options = {
			option1: 1,
			option2: 'option2'
		};

		this._initEvents();
	};

	this._initEvents = function () {
		var self = this;

		_c.click( this.abc, function () {
			self._innerFunction( 'on' );
			console.log( 'You clicked ' + this );
		});
	};

	this._innerFunction = function ( state ) {
		// do something here...
	};
}
****************************************************************************/

function CompassLib() {

	/*
		in order to provide a bilingua javascript, this object was created.
		browserLanguare is the native language that user set their browser in. NOT the language of the website.
		UILang is an object that contains everything you need to test for French or English setup.
	*/
	this.defaults = {
		browserLanguage: window.navigator.language || window.navigator.userLanguage,
		UILang: {}
	};

	this.UILang = this.defaults.UILang;
	this.UILang.code = document.getElementsByTagName( 'html' )[0].getAttribute( 'lang' );
	this.UILang.isEnglish = this.UILang.code === 'en-US';
	this.UILang.isFrench = this.UILang.code === 'fr-CA';

	// add HTML to an element
	this.add = function( elem, html ) {
		elem.innerHTML += html;
	};

	/*
		Adds a class to the targetted element.

		elem = targetted element, or an array of elements
		i.e.: document.getElementsByClassName( 'class' )[0] or [ document.getElementById( 'id1' ), document.getElementById( 'id2' ) ]
		Passing an array of elements allows you to add a class name to all those elements.

		cName = a string or an array of strings
		If you pass an array of class names, they will all be added to the targetted element(s)

		timeout = a timeout in milliseconds
		Sometimes you need to add a class after displaying a element, so this parameter allows you to set the designed timeout.
	*/
	this.addClass = function( elem, cName, timeout ) {
		var timeout = timeout || 0;

		if ( elem instanceof Array ) {
			setTimeout( function () {
				for ( var i = 0; i < elem.length; i++ ) {
					elem[i].classList.add( cName );
				}
			}, timeout );
		} else {
			setTimeout( function () {
				elem.classList.add( cName );
			}, timeout );
		}
	};

	/*
		This function is used to send and receive data using AJAX.
		It also triggers the loading UI on when it is wainting for the data
		and off when it received it successfully.

		$ = an object

		i.e.:
		var param = {
			type: 'POST',
			url: 'http://www.......com/something',
			done: function () {
				// the callback function when the data was successfully downloded of uploaded.
			}
		}

		This function is being tested and expanded for added functionality.
	*/
	this.ajax = function ( $ ) {
		var httpRequest = new XMLHttpRequest();

		// turn on loading UI
		_c.loadingCurtain( 'on' );

		httpRequest.addEventListener( 'readystatechange', function () {
			if ( httpRequest.readyState === 4 ) {
				if ( httpRequest.status === 200 ) {
					$.done( httpRequest.responseText );

					// turn off loading UI
					_c.loadingCurtain( 'off' );
				}
			}
		}, false );

		httpRequest.open( $.type, $.url, true );
		httpRequest.send( null );
	};

	/*
		This function returns a string with it's first letter capitalized.
	*/
	this.capitalizeFirstLetter = function ( string ) {
		var word = string.split(''),
				firstLetter = word[0].toUpperCase();

		word.shift();

		return firstLetter + word.join('');
	};

	/*
		This function is used on a list.

		listID = The list wrapper
		target = the anchor you want to but a checkmark on ( usualy 'this' when it is inside a click event )

		usage:
		_c.click( this.list, function ( e ) {
			var t = e.target;
			
			if ( e.tagName === 'A' ) {
				_c.checkmark( this, t );
			}
		});
	*/
	this.checkmark = function ( listID, target ) {
		var items = listID.querySelectorAll( 'a' );

		for ( var i = 0; i < items.length; i++ ) {
			_c.removeClass( items[i], 'active' );
		}

		_c.addClass( target, 'active' );
	};

	/*
		This function transforms a number in a string, containing the proper
		thousand separator, and decimals

		data = number or string ( e.i.: 1000 or '1,000.00' )
		decimals = number
	*/
	this.cleanNumber = function ( data, decimals ) {
		var d = ( decimals === undefined ) ? 0 : decimals;

		// not sure why you can pass an object... need to
		// verify if this feature is used.
		if ( typeof data === 'object' ) {
			for ( var key in data ) {
				var number = ( data[key] === '' ) ? 0 : data[key],
						number = number.toString().replace( /,/g, '' );

				data[key] = parseFloat( number ).toFixed( d ).toString();
				data[key] = ( /en/g ).test( this.UILang.code )
										? data[key].replace( /\B(?=(\d{3})+(?!\d))/g, ',' )
										: data[key].replace( /\B(?=(\d{3})+(?!\d))/g, ' ' ).replace( /\./g, ',' );
			}

			return data;
		}

		if ( typeof data === 'string' || typeof data === 'number' ) {
			var number = ( data === '' ) ? 0 : data,
					number = number.toString().replace( /[^0-9.]/g, '' );

			number = parseFloat( number ).toFixed( d ).toString();
			number = ( /en/g ).test( this.UILang.code )
								? number.replace( /\B(?=(\d{3})+(?!\d))/g, ',' )
								: number.toString().replace( /\B(?=(\d{3})+(?!\d))/g, ' ' ).replace( /\./g, ',' );

			return number;
		}
	};

	/*
		This function shortens the elem.addEventListener( 'click', function () {}, false );
		way of writting.

		This function could potentially do a lot more, starting with browser compatibility,
		and touch support. To come.

		Usage:

		_c.click( elem, function () {
			// do stuff here
		});
	*/
	this.click = function( elem, func ) {
		elem.addEventListener( 'click', func, false );
	};

	/*
		This function allows you to set multiple css properties
		to an element at one.

		elem = the element(s) you want to target ( element or array )
		objectStyle = an object that contains the css equivallence
		timeout = the delay to apply the styles to the element.

		Usage:

		_c.css( document.getElementById( 'id' ), {
			'display': 'block',
			'width': '100px',
			'opacity': 0.9
		}, 10 );
	*/
	this.css = function ( elem, objectStyle, timeout ) {
		var timeout = timeout || 0;

		if ( elem instanceof Array ) {
			setTimeout( function () {
				for ( var key in objectStyle ) {
					for ( var i = 0, len = elem.length; i < len; i++ ) {
						elem[i].style.setProperty( key, objectStyle[key] );
					}
				}
			}, timeout );
			
		} else {
			setTimeout( function () {
				for ( var key in objectStyle ) {
					elem.style.setProperty( key, objectStyle[key] );
				}
			}, timeout );
		}
	};

	/*
		This function allows an element to be dragged accross the browser window.

		handle = the handle by which you will drag the element
		elem = the element you want to drag
	*/
	this.draggable = function ( handle, elem ) {
		var box,
				initBox = elem.getBoundingClientRect(),
				initX,
				initY,
				finalTop = initBox.top,
				finalRight = initBox.right,
				finalBottom = initBox.bottom,
				finalLeft = initBox.left,

				// this function updates the CSS coordinates
				// and stores them in variables
				move = function ( e ) {
					var x = e.clientX,
							y = e.clientY,
							box = elem.getBoundingClientRect();

					_c.css( elem, {
						'top': ( y - initY ) + 'px',
						'left': ( x - initX ) + 'px'
					});

					finalTop = box.top;
					finalRight = box.right;
					finalBottom = box.bottom;
					finalLeft = box.left;
				},

				// this function saves the initial coordinates when the mouse is
				// clicked. Then it ads a CSS class to prevent highlighting
				// text while dragging the element.
				down = function ( e ) {
					box = elem.getBoundingClientRect();
					initX = e.clientX - box.left;
					initY = e.clientY - box.top;

					_c.addClass( document.body, 'no-highlight' );
					window.addEventListener( 'mousemove', move, true);
				},

				/*
					This function checks if any sides of the element is outside the browser window.
					If it is, it will move it back in full sight.
				*/
				up = function () {
					/*
						the focus class is added to the element before it is moved into full view
						so that it smoothly transitions into place.
					*/
					_c.addClass( elem, 'focus' );

					setTimeout( function () {
						/*
							If the outer top of the element is somehow dragged passed the top of the browser
							window, it will move it down in full view
						*/
						if ( finalTop < 0 ) {
							_c.css( elem, {
								'top': '20px'
							});
						}

						/*
							If the outer right of the element is dragged passed the right of the browser
							window, it will move it left in full view
						*/
						if ( finalRight > window.innerWidth ) {
							_c.css( elem, {
								'left': ( window.innerWidth - ( box.width + 20 ) ) + 'px'
							});
						}

						/*
							If the outer bottom of the element is dragged passed the bottom of the browser
							window, it will move it up in full view
						*/
						if ( finalBottom > window.innerHeight ) {
							_c.css( elem, {
								'top': ( window.innerHeight - ( box.height + 20 ) ) + 'px'
							});
						}

						/*
							If the outer left of the element is dragged passed the left of the browser
							window, it will move it right in full view
						*/
						if ( finalLeft < 0 ) {
							_c.css( elem, {
								'left': '20px'
							});
						}
					}, 10 );

					/*
						Once the element is moved into place, the focus class is removed from the element.
						The reason why it is removed is to provide the best responsiveness when dragging
						the element.
					*/
					setTimeout( function () {
						_c.removeClass( elem, 'focus' );
					}, 210 );

					/*
						Removing the no-highlight class from the body to allow for highlighting text.
					*/
					_c.removeClass( document.body, 'no-highlight' );
					window.removeEventListener( 'mousemove', move, true);
				};

		handle.addEventListener( 'mousedown', down, false );
		handle.addEventListener( 'mouseup', up, false );
	};

	/*
		This function can be run on load to find out which features are supported in your browser.
		It will add a class of supports-*** to the body, so another function can test browser
		features simply by checking for a class on the body.

		Usage:
		_c.featureDetection( ['transform', 'touch'] );

		Result:
		<body class="supports-transform supports-touch"></body>
	*/
	this.featureDetection = function ( features ) {
		var b = document.body,
				s = b.style;

		for ( var i = 0, l = features.length; i < l; i++ ) {
			switch( features[i] ) {
				case 'transform':
					if ( s.transform === ''||
							 s.WebkitTransform === '' ||
							 s.MoxTransform === '' ||
							 s.OTransform === '' ) {
						_c.addClass( b, 'supports-transform' );
					}
					break;

				case 'touch':
					if ( 'ontouchstart' in window ) {
						_c.addClass( b, 'supports-touch' );
					}
					break;
			}
		}
	};

	/*
		This function works in conjunction with the cleanNumber() function to
		shorten numbers to their suffix format.

		n = number
		threshold = number
		decimal = number

		The threshold lets you control when to format the number ( n ). For example, if I want
		numbers 10,000 and over to be shortened to their suffix format, set the threshold to 9,999.

		If n is bellow the threshold, it simply runs through the cleanNumber function.

		Usage:

		_c.formatBigNumber( 100, 999, 0 ) -> '100'
		_c.formatBigNumber( 1000, 999, 0 ) -> '1K'
		_c.formatBigNumber( 1000000, 999, 2 ) -> '1.00M'
	*/
	this.formatBigNumber = function ( n, threshold, decimal ) {
		var ranges = [
					{ divider: 1e18 , suffix: 'P' },
					{ divider: 1e15 , suffix: 'E' },
					{ divider: 1e12 , suffix: 'T' },
					{ divider: 1e9 , suffix: 'G' },
					{ divider: 1e6 , suffix: 'M' },
					{ divider: 1e3 , suffix: 'k' }
				],
				val = Math.abs(n);

		if ( val > threshold ) {
			for ( var i = 0; i < ranges.length; i++ ) {
				if ( val >= ranges[i].divider ) {
					return ( val / ranges[i].divider ).toFixed( decimal ).toString() + ranges[i].suffix;
				}
			}
		}
		
		return this.cleanNumber( val, decimal ).toString();
	};

	this.filterKeys = function ( e, type ) {
		//e.preventDefault();
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

		switch ( type ) {
			case 'phone':
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
			break;
		}
	}

	this.inputFormat = function ( elem, type, format ) {
		switch ( type ) {
			case 'phone':
				if ( format ) {
					// on exit - format
					elem.value = elem.value.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
				} else {
					elem.value = elem.value.replace(/\D/g,'');
				}
			break;
		}
	}

	/*
		This function works similarly to getElementByClassName, but
		instead gets all the elements with a certain attribute.

		The returned value is an array with all the nodes.
	*/
	this.getElementsByAttribute = function ( attribute ) {
		var matchingElements = [],
				allElements = document.getElementsByTagName( '*' );

		if ( allElements.length === 0 ) {
			return false;
		}

		for ( var i = 0, len = allElements.length; i < len; i++) {
			if ( allElements[i].getAttribute( attribute ) ) {

				// Element exists with attribute. Add to array.
				matchingElements.push( allElements[i] );
			}
		}
		
		return matchingElements;
	};

	/*
		This function allows you to choose between click and touchstart
		depending on the device's touch support.

		Usage:

		document.getElementById( 'id' ).addEventListener( _c.eventType, function () {
			// do stuff here.
		}, false );
	*/
	this.eventType = function () {
		return this.mobileCheck() ? 'touchstart' : 'click';
	};

	/*
		This function checks if the element has a certain class.

		It returns true or false.
	*/
	this.hasClass = function( elem, cName ) {
		return elem.classList.contains( cName );
	};

	/*
		This function is used by the toolbox function.
		Not too sure what it does exactly :P
	*/
	this.hasParent = function( elem, id ) {
		if ( !elem ) {
			return false;
		}

		var el = elem.target || elem.srcElement || elem || false;

		while ( el && el.id != id ) {
			el = el.parentNode || false;
		}

		return ( el !== false );
	};

	/*
		This function display: none the element that you pass.
	*/
	this.hide = function( elem, timeout ) {
		var timeout = timeout || 0;

		setTimeout( function() {
			elem.style.setProperty( 'display', 'none' , null );
		}, timeout );
	};

	/*
		This function triggers on and off the lazy loading curtain
		used inside sub-sections.

		state = 'on' or 'off'
		elem = the lazy loader you want to interact with
	*/
	this.lazyLoad = function ( state, elem ) {
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

	/*
		This function triggers on and off the loading curtain.

		state = 'on' or 'off'
		elem = defaults to preloader--page element if no element is passed.
	*/
	this.loadingCurtain = function ( state, elem ) {
		var preloader = elem || document.getElementById( 'preloader--page' );

		switch ( state ) {
			case 'on':
				_c.show( preloader )
				_c.addClass( preloader, 'active', 10 );
				break;

			case 'off':
				_c.removeClass( preloader, 'active' );
				_c.show( preloader, 210 );
				break;
		}
	};

	/*
		This function returns true if it supports touch events.
	*/
	this.mobileCheck = function() {
		return ( 'ontouchstart' in window ) || window.DocumentTouch && document instanceof DocumentTouch;
	};

	/*
		This function return an SVG element.
		This could potentially 
	*/
	this.newSvgElem = function( tag ) {
		return document.createElementNS( 'http://www.w3.org/2000/svg', tag );
	};

	/*
		This function might seems bizard at first, but it may be useful in some scenarios.
		For example, the PCC app returns an object with different merchant IDs as the key.
		In this case, we need to update how many results were return, hence why we need to calculate
		how many merchand ID keys is in the object.
	*/
	this.objLength = function( obj ) {
		var i = 0;

		for ( var keys in obj ) {
			i++;
		}

		return i;
	};

	/*
		This function applies opacity to the element you pass in.
	*/
	this.opacity = function( elem, val, timeout ) {
		var timeout = timeout || 0;

		setTimeout( function() {
			elem.style.setProperty( '-webkit-opacity', val , null );
			elem.style.setProperty( '-moz-opacity', val , null );
			elem.style.setProperty( 'opacity', val , null );
		}, timeout );
	};

	/*
		This function removes HTML from inside an element.
	*/
	this.remove = function( elem ) {
		elem.parentNode.removeChild( elem );
	};

	/*
		This function removes a class ( or multiple classes ) from an element
		( or multiple elements ).

		elem = the element ( document.getElementByClassName( 'class' )[0] )
		cName = string or array of strings
		timeout = number
	*/
	this.removeClass = function( elem, cName, timeout ) {
		var elemIsArr = elem instanceof Array,
				cNameIsArr = cName instanceof Array,
				remove = function ( elem, cName ) {
					if ( elem.classList.contains( cName ) ) {
						elem.classList.remove( cName );
					}
				};

		setTimeout( function () {
			if ( elemIsArr && cNameIsArr ) {
				for ( var i = 0; i < elem.length; i++ ) {
					for ( var j = 0; j < cName.length; j++ ) {
						remove( elem[i], cName[j] );
					}
				}
			} else if ( elemIsArr ) {
				for ( var i = 0; i < elem.length; i++ ) {
					remove( elem[i], cName );
				}
			} else if ( cNameIsArr ) {
				for ( var i = 0; i < cName.length; i++ ) {
					remove( elem, cName[i] );
				}
			} else {
				remove( elem, cName );
			}
		}, timeout );
	};

	/*
		This function can set multiple attributes at once to an element.

		Usage:

		_c.setMultiAttr( document.getElementById( 'id' ), {
			'data-something': 'value',
			'data-foobar': 'value'
		});
	*/
	this.setMultiAttr = function( elem, attributes ) {
		for( var key in attributes ) {
			elem.setAttribute( key, attributes[key] );
		}
	};

	/*
		This function will display block an element. If the table aparameter is
		set to true, the element will display 'table-row'.
	*/
	this.show = function( elem, timeout, table ) {
		var elemIsArr = elem instanceof Array,
				timeout = timeout || 0,
				table = table || false;

		if ( elemIsArr ) {
			setTimeout( function() {
				for ( var i = 0, len = elem.length; i < len; i++ ) {
					if ( table ) {
						elem[i].style.setProperty( 'display', 'table-row', null );
					} else {
						elem[i].style.setProperty( 'display', 'block', null );
					}	
				}
			}, timeout );
		} else {
			setTimeout( function() {
				if ( table ) {
					elem.style.setProperty( 'display', 'table-row', null );
				} else {
					elem.style.setProperty( 'display', 'block', null );
				}		
			}, timeout );
		}
	};

	/*
		This function will display table-row an element.
	*/
	this.showTableRow = function ( elem, timeout ) {
		var timeout = timeout || 0;

		setTimeout( function() {
			elem.style.setProperty( 'display', 'table-row', null );
		}, timeout );
	};

	/*
		 Add a touchmove and touchend event listener to the target element with a callback function.
	*/
	this.swipe = function( elem, callback ) {
		var swipedir,
				startX,
				startY,
				distX,
				distY,
				dist,
				threshold = 150, //required min distance traveled to be considered swipe
				restraint = 100, // maximum distance allowed at the same time in perpendicular direction
				allowedTime = 99999, // maximum time allowed to travel that distance
				elapsedTime,
				startTime,
				handleswipe = callback || function( swipedir ) {};

		elem.addEventListener( 'touchstart', function( e ) {
			var touchObj = e.changedTouches[0];

			swipedir = 'none';
			dist = 0;
			startX = touchObj.pageX;
			startY = touchObj.pageY;
			startTime = new Date().getTime(); // record time when finger first makes contact with surface

			e.preventDefault();
		}, false );

		elem.addEventListener( 'touchmove', function( e ) {
			e.preventDefault(); // prevent scrolling when inside DIV
		}, false );

		elem.addEventListener( 'touchend', function( e ) {
			var touchobj = e.changedTouches[0];

			distX = touchobj.pageX - startX; // get horizontal dist traveled by finger while in contact with surface
			distY = touchobj.pageY - startY; // get vertical dist traveled by finger while in contact with surface
			elapsedTime = new Date().getTime() - startTime; // get time elapsed

			if ( elapsedTime <= allowedTime ) { // first condition for a swipe met
				if ( Math.abs( distX ) >= threshold && Math.abs( distY ) <= restraint ) { // 2nd condition for horizontal swipe met
					swipedir = ( distX < 0 ) ? 'left' : 'right'; // if dist traveled is negative, it indicates left swipe
				}
				else if ( Math.abs( distY ) >= threshold && Math.abs( distX ) <= restraint ) { // 2nd condition for vertical swipe met
					swipedir = ( distY < 0 ) ? 'up' : 'down'; // if dist traveled is negative, it indicates up swipe
				}
			}

			handleswipe( swipedir );
			e.preventDefault();
		}, false );
	};

	this.timestamp = function ( date, time ) {
		var timestamp = new Date();

		// CREATE A TIMESTAMP
		if ( date ) {
			var year = timestamp.getFullYear(),
					month = _c.translator( 'monthAbbreviation' ),
					month = month[timestamp.getMonth()],
					day = timestamp.getDate();

			if ( day < 10 ) {
				day = '0' + day;
			}
		}
		
		if ( time ) {
			var hour = timestamp.getHours(),
					amPM = ['am', 'pm'],
					minute = timestamp.getMinutes();

			if ( hour >= 12 ) {
				amPM = amPM[1];
			} else {
				amPM = amPM[0];
			}

			if ( hour > 12 ) {
				hour = hour - 12;
			}

			if ( minute < 10 ) {
				minute = '0' + minute;
			}
		}

		return _c.translator( 'monthDayYearTime', {
			monthDayYearTime: true,
			month: month,
			day: day,
			year: year,
			hour: hour,
			minute: minute,
			amPM: amPM
		});
	};

	/*
		This function allows you to apply any transform property to an element.

		Usage:

		_c.transfom( document.getElementById( 'id' ), 'translate3d( 10px, 30%, 0 ) scale( 1.1 )', 10 );
	*/
	this.transform = function( elem, val, timeout ) {
		var timeout = timeout || 0;

		setTimeout( function() {
			elem.style.setProperty( '-webkit-transform', val , null );
			elem.style.setProperty( '-moz-transform', val , null );
			elem.style.setProperty( 'transform', val , null );
		}, timeout );
	};

	/*
	
	*/	
	this.translator = function ( key, data ) {
		var language = {},
				extraData = data || null;

		if ( this.UILang.code === 'en-US' ) {
			language = {
				noDataAvailable: 'There is no data available',
				monthAbbreviation: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
				selectAnIssue: 'Select an issue...',
				characters: 'characters',
				month: 'month',
				year: 'year',
				YYYY: 'YYYY',
				fileNotFound: 'File not found.',
				fileNotReadable: 'The file you have selected is not readable.',
				errorReadingFile: 'An error occurred reading this file.',
				noFileChosen: 'No file chosen',
				megaByte: 'Mb',
				percent: 'Percent',
				dollar: 'Dollar',
				calls: 'Calls',
				visits: 'Visits',
				clicks: 'Clicks',
				contacts: 'Contacts'
			};

			if ( extraData !== null ) {
				if ( extraData.fileTypes && extraData.size ) {
					language.fileTypeAndSize 			= 'Please select a supported file (' + extraData.fileTypes + ') under ' + extraData.size + 'MB.';
					language.supportedFilesAndSize = 'Supports ' + extraData.fileTypes + ' files, smaller than ' + extraData.size + 'MB.';
				}

				if ( extraData.fileTypes ) {
					language.fileType = 'Please select a supported file (' + extraData.fileTypes + ').';
				}

				if ( extraData.size ) {
					language.fileSize = 'Please select a file smaller than ' + extraData.size + 'MB.';
				}

				if ( extraData.monthDayYearTime ) {
					language.monthDayYearTime = extraData.month + ' ' + extraData.day + ', ' + extraData.year + ' at ' + extraData.hour + ':' + extraData.minute + extraData.amPM;
				}

				if ( extraData.limit ) {
					language.characterLimitRecommendations = 'You have more than ' + extraData.limit + ' characters in some recommendations.';
					language.characterLimitHighlights = 'You have more than ' + extraData.limit + ' characters in some highlights.';
				}

				if ( extraData.amount ) {
					language.dollarFormat = '$' + extraData.amount;
				}
			}
		}

		if ( this.UILang.code === 'fr-CA' ) {
			language = {
				noDataAvailable: 'Aucune donnÃ©e nâ€™est disponible',
				monthAbbreviation: ['Jan', 'FÃ©v', 'Mar', 'Avr', 'Mai', 'Jui', 'Jul', 'AoÃ»', 'Sep', 'Oct', 'Nov', 'DÃ©c'],
				selectAnIssue: 'SÃ©lectionnez un problÃ¨me',
				characters: 'caractÃ¨res',
				month: 'mois',
				year: 'annÃ©e',
				YYYY: 'AAAA',
				fileNotFound: 'Fichier non trouvÃ©.',
				fileNotReadable: 'Impossible de lire le fichier choisi.',
				errorReadingFile: 'Une erreur est survenue lors de la lecture de ce fichier.',
				noFileChosen: 'Aucun fichier selectionnÃ©',
				megaByte: 'Mo',
				percent: 'Pourcent',
				dollar: 'Dollar',
				calls: 'Appels',
				visits: 'Visites',
				clicks: 'Cliques',
				contacts: 'Contacts'
			};

			if ( extraData !== null ) {
				if ( extraData.fileTypes && extraData.size ) {
					language.fileTypeAndSize 			= 'Choisir un format de fichier appropriÃ© (' + extraData.fileTypes + ') ne dÃ©passant pas ' + extraData.size + 'Mo.';
					language.supportedFilesAndSize = 'Accepte les fichiers ' + extraData.fileTypes + ' de moins de ' + extraData.size + 'Mo.';
				}

				if ( extraData.fileTypes ) {
					language.fileType = 'Veuillez choisir un format de fichier appropriÃ© (' + extraData.fileTypes + ').';
				}

				if ( extraData.size ) {
					language.fileSize = 'Veuillez choisir un fichier ne dÃ©passant pas ' + extraData.size + 'Mo.';
				}

				if ( extraData.monthDayYearTime ) {
					language.monthDayYearTime = extraData.day + ' ' + extraData.month + ' ' + extraData.year + ' Ã  ' + extraData.hour + ':' + extraData.minute + extraData.amPM;
				}

				if ( extraData.limit ) {
					language.characterLimitRecommendations = 'Il y a plus de ' + extraData.limit + ' caractÃ¨res dans certaines recommandations.';
					language.characterLimitHighlights = 'Il y a plus de ' + extraData.limit + ' caractÃ¨res dans certains faits saillants.';
				}

				if ( extraData.amount ) {
					language.dollarFormat = extraData.amount + '$';
				}
			}
		}

		return language[ key ];
	}

	/*
		This function validates any file agains the parameters.

		fileType = Array
		maxSize = number
		fileInput = element

		Usage:

		_c.fileValidation(['pdf', 'jpg', 'gif'], 1000000, document.getElementById( 'id' ) );
	*/
	this.fileValidation = function ( fileType, maxSize, fileInput, alertID ) {
		var file = {
					type: fileType,
					maxSize: maxSize,
					readableMaxSize: ( ( maxSize / 1048576 ) ),
					name: fileInput.value,
					extension: ( fileInput.value ) ? fileInput.value.substr( ( fileInput.value.lastIndexOf('.') + 1 ) ).toLowerCase() : undefined,
					size: ( fileInput.value ) ? fileInput.files[0].size : undefined,
					readableSize: ( fileInput.value ) ? ( ( fileInput.files[0].size / 1048576 ) ).toFixed(2) : undefined,
					validExtension: false,
					validSize: false,
					alert: alertID
				};

		// Checks if the file type matches the accepted file types
		for ( var i = 0; i < file.type.length; i++ ) {
			if ( file.extension === file.type[i] ) {
				file.validExtension = true;
				break;
			}
		}

		// Checks if the size is smaller than the set max file size
		if ( file.size < file.maxSize ) {
			file.validSize = true;
		}

		// if both the file extention and size matches, it returns true and sets the hint text
		// with the file name and it's readable size.
		if ( file.validExtension && file.validSize ) {
			this.removeClass( file.alert, 'alert' );
			file.alert.textContent = _c.translator( 'fileTypeAndSize', {
				fileTypes: file.type.join( ', ' ),
				size: 10
			});
			return true;
		}

		// if the validation fails, the proper alerts are triggered.
		if ( !file.validExtension && !file.validSize ) {
			this.addClass( file.alert, 'alert' );

			file.alert.textContent = _c.translator( 'fileTypeAndSize', {
				fileTypes: file.type.join( ', ' ),
				size: file.readableMaxSize
			});

		} else if ( !file.validExtension ) {
			this.addClass( file.alert, 'alert' );

			file.alert.textContent = _c.translator( 'fileType', {
				fileTypes: file.type.join( ', ' )
			});

		} else if ( !file.validSize ) {
			this.addClass( file.alert, 'alert' );

			file.alert.textContent = _c.translator( 'fileSize', {
				size: file.readableMaxSize
			});

		}

		return false;
	};
}