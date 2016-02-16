var _c = new CompassLib();

_c.featureDetection( ['transform'] );

var menu = new SideMenu();
menu._init();

if ( document.getElementsByClassName( 'chart' )[0] ) {
	var loadCharts = new LoadCharts();
	loadCharts._init();
}

if ( document.getElementsByClassName( 'tabulation' )[0] ) {
	var tabs = document.getElementsByClassName( 'tabulation' ),
			tabulation = new Tabulation();

	[].forEach.call( tabs, function ( tab ) {
		tabulation._init( tab );
	});
}

// INITIALIZE FILTERS ON ONLINE PLACEMENT TABLE
if ( document.getElementById( 'placement-online-table' ) ) {
	var validateOnlinePlacementTableUrl = new ValidateTableURL();
	validateOnlinePlacementTableUrl._init( 'placement-online-table', 'online-table-alert' );

	var onlinePlacementFilter = new Filter();
	onlinePlacementFilter._init( 'online-filter-box', 'online-filter-button', 'placement-online-table' );

	if ( document.getElementById( 'online-market-filter-button' ) ) {
		var onlineMarketFilterSearch = new ListSearch();
		onlineMarketFilterSearch._init( 'online-market-filter-search', 'online-market-list' );
	}

	if ( document.getElementById( 'online-heading-filter-button' ) ) {
		var onlineHeadingFilterSearch = new ListSearch();
		onlineHeadingFilterSearch._init( 'online-heading-filter-search', 'online-heading-list' );
	}
	
	if ( document.getElementById( 'online-product-filter-button' ) ) {
		var onlineProductFilterSearch = new ListSearch();
		onlineProductFilterSearch._init( 'online-product-filter-search', 'online-product-list' );
	}
}

// INITIALIZE FILTERS ON MOBILE PLACEMENT TABLE
if ( document.getElementById( 'placement-mobile-table' ) ) {
	var validateMobilePlacementTableUrl = new ValidateTableURL();
	validateMobilePlacementTableUrl._init( 'placement-mobile-table', 'mobile-table-alert' );

	var mobilePlacementFilter = new Filter();
	mobilePlacementFilter._init( 'mobile-filter-box', 'mobile-filter-button', 'placement-mobile-table' );

	if ( document.getElementById( 'mobile-market-filter-button' ) ) {
		var mobileMarketFilterSearch = new ListSearch();
		mobileMarketFilterSearch._init( 'mobile-market-filter-search', 'mobile-market-list' );
	}

	if ( document.getElementById( 'mobile-market-filter-button' ) ) {
		var mobileHeadingFilterSearch = new ListSearch();
		mobileHeadingFilterSearch._init( 'mobile-heading-filter-search', 'mobile-heading-list' );
	}
	
	if ( document.getElementById( 'mobile-product-filter-button' ) ) {
		var mobileProductFilterSearch = new ListSearch();
		mobileProductFilterSearch._init( 'mobile-product-filter-search', 'mobile-product-list' );
	}
}

// INITIALIZE FILTERS ON PRINT TABLE
if ( document.getElementById( 'print-table' ) ) {
	var printFilter = new Filter();
	printFilter._init( 'print-filter-box', 'print-filter-button', 'print-table' );

	if ( document.getElementById( 'print-directory-filter-button' ) ) {
		var printMarketFilterSearch = new ListSearch();
		printMarketFilterSearch._init( 'print-directory-filter-search', 'print-directory-list' );
	}

	if ( document.getElementById( 'print-heading-filter-button' ) ) {
		var printHeadingFilterSearch = new ListSearch();
		printHeadingFilterSearch._init( 'print-heading-filter-search', 'print-heading-list' );
	}

	if ( document.getElementById( 'print-product-filter-button' ) ) {
		var printProductFilterSearch = new ListSearch();
		printProductFilterSearch._init( 'print-product-filter-search', 'print-product-list' );
	}
}

if ( document.getElementsByClassName( 'map' )[0] ) {
	var googleMaps = new GoogleMaps(),
			mapPlaceholder = document.getElementsByClassName( 'map' )[0],
			mapObj = {
				placeholder: mapPlaceholder,
				latitude: mapPlaceholder.getAttribute( 'data-latitude' ),
				longitude: mapPlaceholder.getAttribute( 'data-longitude' ),
				polygonURL: mapPlaceholder.getAttribute( 'data-polygon-url' ),
				errorMessage: mapPlaceholder.getAttribute( 'data-error-message' )
			};

	googleMaps._init( mapObj );
}

function GoogleMaps () {
	this._init = function ( options ) {
		if ( options.polygonURL ) {
			var centerOfville 	= new google.maps.LatLng( options.latitude, options.longitude ),
					map 						= new google.maps.Map( options.placeholder, {
															center: centerOfville,
															mapTypeControl: false,
															mapTypeId: google.maps.MapTypeId.ROADMAP
														}),
					ctaLayer 				= new google.maps.KmlLayer({
															url: options.polygonURL
														});

			ctaLayer.setMap( map );
		} else {
			var p = document.createElement( 'p' );

			_c.addClass( p, 'alert' );
			p.textContent = options.errorMessage;
			options.placeholder.appendChild( p );
		}
	};
}

function Tabulation () {
	this._init = function ( tabulation ) {
		this.tabulation = tabulation;

		if ( this.tabulation.getAttribute( 'data-toggle-divs' ) ) {
			var divs = this.tabulation.getAttribute( 'data-toggle-divs' ).split( ',' );

			for ( var i = 1, l = divs.length; i < l; i++ ) {
				_c.hide( document.getElementById( divs[i] ) );
			}
		}

		this._initEvents();
	};

	this._initEvents = function () {
		var self = this;

		_c.click( this.tabulation, function ( e ) {
			var t = e.target;
			
			e.preventDefault();

			if ( _c.hasClass( t, 'active' ) ) {
				return;
			}

			_c.removeClass( this.querySelector( '.active' ), 'active' );
			_c.addClass( t, 'active' );

			if ( this.hasAttribute( 'data-chart-target' ) ) {
				self._loadChart( this, t );
			}

			if ( this.hasAttribute( 'data-toggle-divs' ) ) {
				self._toggleDiv( this, t );
			}

			if ( this.hasAttribute( 'data-toggle-maps' ) ) {
				self._loadMaps( t );
			}
		});
	};

	this._loadChart = function ( tab, target ) {
		var data 					= window.chartsData,
				chartID 			= target.href.replace( /(\w|\W)+#/g, '' ),
				chartRenderTo = tab.getAttribute( 'data-chart-target' ),
				chart 				= document.getElementById( chartRenderTo ),
				chartType 		= chart.getAttribute( 'data-chart-type' ),
				chartLegend 	= chart.getAttribute( 'data-chart-legend' ) === 'true' ? true : false,
				chartObj 			= {
													chart: {
														renderTo: document.getElementById( chartRenderTo ),
														spacingBottom: chartLegend ? 45 : 10
													},
											
													xAxis: {
														categories: data[chartID].labels
													},
											
													yAxis: {
														title: {
															text: data[chartID].labelY
														}
													},

													plotOptions: {
														series: {
															stacking: null
														}
													},
											
													series: data[chartID].values,
											
													legend: {
														enabled: chartLegend
													}
												};

		if ( chartType === 'stacked' ) {
			chartObj.chart.type = 'column';
			chartObj.plotOptions.series.stacking = 'normal';
		} else {
			chartObj.chart.type = chartType;
			chartObj.plotOptions.series.stacking = null;
		}
		
		chartObj.yAxis.min = ( chartType === 'line' ) ? 0 : null;

		new Highcharts.Chart( chartObj );
	};

	this._toggleDiv = function ( tab, target ) {
		var displayDivID = target.href.replace( /(\w|\W)+#/g, '' ),
				divs = tab.getAttribute( 'data-toggle-divs' ).split( ',' );

		for ( var i = 0, l = divs.length; i < l; i++ ) {
			_c.hide( document.getElementById( divs[i] ) );
		}

		_c.show( document.getElementById( displayDivID ) );
	};

	this._loadMaps = function ( target ) {
		var mapPlaceholder = document.getElementsByClassName( 'map' )[0],
				mapObj = {
					placeholder: mapPlaceholder,
					latitude: target.getAttribute( 'data-latitude' ),
					longitude: target.getAttribute( 'data-longitude' ),
					polygonURL: target.getAttribute( 'data-polygon-url' ),
					errorMessage: target.getAttribute( 'data-error-message' )
				};

		googleMaps._init( mapObj );
	};
}

function LoadCharts() {
	this._init = function () {
		this.charts = document.getElementsByClassName( 'chart' );
		this._getJSON();
	};

	this._getJSON = function () {
		var self = this;

		// _c.ajax({
		// 	type: 'GET',
		// 	url: '/projects/data/charts.json',
		// 	done: function ( data ) {
		// 		window.chartsData = JSON.parse( data );
		// 		self._loadChart();
		// 	}
		// });

		window.chartsData = {
			"contacts": {"labelY":"","labels":["Nov '12","Dec '12","Jan '13","Feb '13","Mar '13","Apr '13","May '13","Jun '13","Jul '13","Aug '13","Sep '13","Oct '13","Nov '13","Dec '13","Jan '14","Feb '14","Mar '14","Apr '14","May '14","Jun '14","Jul '14","Aug '14","Sep '14","Oct '14"],"values":[{"name":"Calls","data":[47,27,55,52,68,77,97,87,132,102,84,52,96,146,248,226,67,35,65,241,272,205,224,192],"index":2,"legendIndex":0,"shadow":true,"enableMouseTracking":true},{"name":"Walk-ins","data":[4,1,5,4,3,4,4,2,5,6,2,0,5,14,46,59,42,25,53,46,25,8,11,8],"index":1,"legendIndex":1,"shadow":true,"enableMouseTracking":true},{"name":"Digital contacts","data":[1,0,0,0,0,1,2,3,5,2,1,0,15,169,497,454,468,415,370,405,505,384,4617,6184],"index":0,"legendIndex":2,"shadow":true,"enableMouseTracking":true}],"extra":{"Walk-ins_total":0.0,"Digital contacts_total":0.0,"Calls_total":0.0}},
			"performance-summary-views": {"labelY":"Views","labels":["Nov '12","","Jan '13","","Mar '13","","May '13","","Jul '13","","Sep '13","","Nov '13","","Jan '14","","Mar '14","","May '14","","Jul '14","","Sep '14",""],"values":[{"name":"","data":[62438,61701,105752,76807,82658,146153,47332,39039,42508,42838,41618,8786,7748,6315,7485,5868,5350,6859,6111,5443,6634,6280,6300,7421],"shadow":true,"enableMouseTracking":true}],"extra":{"visits_total":"17,082","calls_totals":"1,475","impressions_total":"835,444","clicks_total":"25,983","_total":835444.0}},
			"performance-summary-interactions": {"labelY":"Views","labels":["Nov '12","","Jan '13","","Mar '13","","May '13","","Jul '13","","Sep '13","","Nov '13","","Jan '14","","Mar '14","","May '14","","Jul '14","","Sep '14",""],"values":[{"name":"","data":[7297,6164,7797,7169,7551,6007,6139,6141,7835,8620,7431,8786,7748,6315,7485,5868,5350,6859,6111,5443,6634,6280,6300,7421],"shadow":true,"enableMouseTracking":true}],"extra":{"_total":164751.0}},
			"performance-summary-calls-tracked": {"labelY":"Calls tracked","labels":["Nov '12","","Jan '13","","Mar '13","","May '13","","Jul '13","","Sep '13","","Nov '13","","Jan '14","","Mar '14","","May '14","","Jul '14","","Sep '14",""],"values":[{"name":"Answered","data":[41,20,47,50,66,70,87,84,124,95,81,49,32,41,44,42,61,34,59,46,40,44,69,52],"shadow":true,"enableMouseTracking":true},{"name":"Not answered","data":[5,7,8,2,2,7,10,3,8,7,3,3,1,3,0,5,3,0,1,4,3,3,3,5],"shadow":true,"enableMouseTracking":true},{"name":"Busy","data":[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"shadow":true,"enableMouseTracking":true}],"extra":{"Not answered_total":96.0,"Answered_total":1378.0,"Busy_total":1.0}},
			"distribution-of-investments-dollar": {"labelY":"$ Dollars","labels":["Search Engine Optimization","Search Engine Marketing","Print Advertising","Online Priority Placement","Mobile Priority Placement","Website","HD Video","Virtual Business Profile","Smart Digital Display","Mediative"],"values":[{"name":"Committed investment","data":[3000.0,2000.0,0.0,0.0,0.0,200.0,0.0,0.0,1000.0,0.0],"shadow":true,"enableMouseTracking":true},{"name":"Current investment","data":[2314.0,1522.0,771.0,495.0,317.0,200.0,90.0,46.0,0.0,222.0],"shadow":true,"enableMouseTracking":true}],"extra":{"total_investment":"5,755","Current investment_total":5977.0,"Committed investment_total":6200.0}},
			"distribution-of-investments-percentage": {"labelY":"% Percent","labels":["Search Engine Optimization","Search Engine Marketing","Online Priority Placement","Mobile Priority Placement","Print Advertising","Website","HD Video","Virtual Business Profile","Smart Digital Display","Mediative"],"values":[{"name":"Current investment","data":[45.0,30.0,8.0,5.0,4.0,3.0,1.0,1.0,0.0,3.0],"shadow":true,"enableMouseTracking":true}],"extra":{"Current investment_total":100.0}},
			"average-monthly-investment": {"labelY":"$ Dollars","labels":["Search Engine Optimization","Search Engine Marketing","Online Priority Placement","Mobile Priority Placement","Print Advertising","Website","HD Video","Virtual Business Profile","Smart Digital Display"],"values":[{"name":"2 years ago","data":[1139.0,1000.0,489.0,317.0,1093.0,0.0,90.0,43.0,0.0],"shadow":true,"enableMouseTracking":true},{"name":"Last 12 months","data":[3000.0,2000.0,501.0,317.0,267.0,200.0,90.0,43.0,0.0],"shadow":true,"enableMouseTracking":true}],"extra":{"prevPeriod":"4,171","Last 12 months_total":6418.0,"2 years ago_total":4171.0,"inPeriod":"6,418"}},
			"investment-change-over-two-years-dollar": {"labelY":"$ Dollars","labels":["Search Engine Optimization","Search Engine Marketing","Online Priority Placement","Mobile Priority Placement","Print Advertising","Website","HD Video","Virtual Business Profile","Smart Digital Display"],"values":[{"name":"Investment Change","data":[1861.0,1000.0,12.0,0.0,-826.0,200.0,0.0,0.0,0.0],"shadow":true,"enableMouseTracking":true}],"extra":{"total_change_mode":"CURRENCY","total_change_direction":"up","Investment Change_total":0.0,"total_change":"2,247"}},
			"investment-change-over-two-years-percentage": {"labelY":"% Percent","labels":["Search Engine Optimization","Search Engine Marketing","Online Priority Placement","Mobile Priority Placement","Print Advertising","Website","HD Video","Virtual Business Profile","Smart Digital Display"],"values":[{"name":"Investment Change","data":[163.0,100.0,2.0,0.0,-76.0,100.0,0.0,0.0,100.0],"shadow":true,"enableMouseTracking":true}],"extra":{"total_change_mode":"CURRENCY","total_change_direction":"up","Investment Change_total":0.0,"total_change":"54"}},
			"yellow-pages-network-calls-tracked": {"labelY":"Calls tracked","labels":["Nov '12","","Jan '13","","Mar '13","","May '13","","Jul '13","","Sep '13","","Nov '13","","Jan '14","","Mar '14","","May '14","","Jul '14","","Sep '14",""],"values":[{"name":"Answered","data":[null,null,null,10,23,40,36,29,49,41,47,43,28,38,42,40,58,32,45,36,40,42,66,52],"shadow":true,"enableMouseTracking":true},{"name":"Not answered","data":[null,null,null,0,0,4,5,2,3,5,2,3,1,2,0,5,2,0,1,4,2,3,3,5],"shadow":true,"enableMouseTracking":true},{"name":"Busy","data":[null,null,null,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"shadow":true,"enableMouseTracking":true}],"extra":{"Not answered_total":52.0,"Answered_total":837.0,"Busy_total":0.0}},
			"yellow-pages-network-interactions": {"labelY":"Interactions","labels":["Nov '12","","Jan '13","","Mar '13","","May '13","","Jul '13","","Sep '13","","Nov '13","","Jan '14","","Mar '14","","May '14","","Jul '14","","Sep '14",""],"values":[{"name":"","data":[105,96,103,120,108,120,155,110,138,190,215,225,150,173,239,220,290,274,286,219,238,243,386,246],"shadow":true,"enableMouseTracking":true}],"extra":{"_total":4649.0}},
			"yellow-pages-network-visits": {"labelY":"Visits","labels":["Nov '12","","Jan '13","","Mar '13","","May '13","","Jul '13","","Sep '13","","Nov '13","","Jan '14","","Mar '14","","May '14","","Jul '14","","Sep '14",""],"values":[{"data":[93,91,101,104,88,96,114,85,108,131,149,146,104,127,152,157,237,218,199,149,170,164,213,160],"shadow":true,"enableMouseTracking":true}],"extra":{"null_total":0.0}},
			"yellow-pages-network-views": {"labelY":"Views","labels":["Nov '12","","Jan '13","","Mar '13","","May '13","","Jul '13","","Sep '13","","Nov '13","","Jan '14","","Mar '14","","May '14","","Jul '14","","Sep '14",""],"values":[{"name":"","data":[7297,6164,7797,7169,7551,6007,6139,6141,7835,8620,7431,8786,7748,6315,7485,5868,5350,6859,6111,5443,6634,6280,6300,7421],"shadow":true,"enableMouseTracking":true}],"extra":{"_total":164751.0}},
			"how-customers-found-your-vbp": {"values":[{"name":"2 years ago","data":[780,185,102,29,210],"shadow":true,"enableMouseTracking":true},{"name":"Last 12 months","data":[1361,465,62,41,121],"shadow":true,"enableMouseTracking":true}],"labels":["yellowpages.ca","google.ca","Direct","bing.com","Other","yellowpages.ca","google.ca","Direct","bing.com","other-label"],"totalVisits":"2,050","labelY":"Visits"},
			"how-customers-found-your-vbp-over-time": {"labelY":"Visits","labels":["Nov '12","","Jan '13","","Mar '13","","May '13","","Jul '13","","Sep '13","","Nov '13","","Jan '14","","Mar '14","","May '14","","Jul '14","","Sep '14",""],"values":[{"name":"yellowpages.ca","data":[56,54,52,69,64,44,61,35,61,83,94,107,64,93,97,89,161,162,150,98,116,105,128,98],"shadow":true,"enableMouseTracking":true},{"name":"google.ca","data":[8,21,18,9,15,15,19,18,14,15,15,18,26,20,37,47,54,48,32,35,27,38,59,42],"shadow":true,"enableMouseTracking":true},{"name":"Direct","data":[3,3,5,3,0,18,13,17,12,13,9,6,7,5,4,6,12,4,7,3,5,1,4,4],"shadow":true,"enableMouseTracking":true},{"name":"YP.network","data":[0,0,8,2,1,4,5,3,1,4,17,3,1,0,1,4,1,0,1,4,4,2,3,0],"shadow":true,"enableMouseTracking":true},{"name":"canpages.ca","data":[9,6,3,4,2,3,5,0,3,2,4,2,3,1,2,1,0,1,1,0,3,3,0,1],"shadow":true,"enableMouseTracking":true},{"name":"Other","data":[17,7,15,17,6,12,11,12,17,14,10,10,3,8,11,10,9,3,8,9,15,15,19,15],"shadow":true,"enableMouseTracking":true}],"extra":{"yellowpages.ca_total":2141.0,"YP.network_total":69.0,"Other_total":273.0,"Direct_total":164.0,"totalVisits":"3,356","google.ca_total":650.0,"canpages.ca_total":59.0}},
			"what-customers-cliked-on": {"values":[{"data":[3044,439,352,258,221,210,125],"shadow":true,"enableMouseTracking":true}],"labels":["Business details","Website","Other","Calls","View video","Map and direction","View photos"],"totalVisits":"4,649","labelY":"Interactions"},
			"yellow-pages-network-calls-tracking-calls-trend": {"labelY":"Calls tracked","labels":["Nov '12","","Jan '13","","Mar '13","","May '13","","Jul '13","","Sep '13","","Nov '13","","Jan '14","","Mar '14","","May '14","","Jul '14","","Sep '14",""],"values":[{"name":"Answered","data":[null,null,null,10,23,40,36,29,49,41,47,43,28,38,42,40,58,32,45,36,40,42,66,52],"shadow":true,"enableMouseTracking":true},{"name":"Not answered","data":[null,null,null,0,0,4,5,2,3,5,2,3,1,2,0,5,2,0,1,4,2,3,3,5],"shadow":true,"enableMouseTracking":true},{"name":"Busy","data":[null,null,null,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"shadow":true,"enableMouseTracking":true}],"extra":{"Not answered_total":52.0,"Answered_total":837.0,"Busy_total":0.0}},
			"yellow-pages-network-calls-tracking-calls-by-day-of-week": {"labelY":"Calls tracked","labels":["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"values":[{"name":"Answered","data":[9,171,165,164,146,128,54],"shadow":true,"enableMouseTracking":true},{"name":"Not answered","data":[4,15,9,4,10,6,4],"shadow":true,"enableMouseTracking":true},{"name":"Busy","data":[0,0,0,0,0,0,0],"shadow":true,"enableMouseTracking":true}],"extra":{"Not answered_total":52.0,"Answered_total":837.0,"Busy_total":0.0}},
			"yellow-pages-network-calls-tracking-calls-by-time-of-day": {"labelY":"Calls tracked","labels":["0:00","","2:00","","4:00","","6:00","","8:00","","10:00","","12:00","","14:00","","16:00","","18:00","","20:00","","22:00",""],"values":[{"name":"Answered","data":[null,null,null,0,0,1,0,4,25,107,102,99,97,104,103,79,58,25,20,9,4,0,0,0],"shadow":true,"enableMouseTracking":true},{"name":"Not answered","data":[null,null,null,1,0,0,0,0,4,4,6,3,4,2,4,3,3,4,6,3,3,0,1,1],"shadow":true,"enableMouseTracking":true},{"name":"Busy","data":[null,null,null,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"shadow":true,"enableMouseTracking":true}],"extra":{"Not answered_total":52.0,"Answered_total":837.0,"Busy_total":0.0}},
			"visit-trend-visits": {"labelY":"Visits","labels":["Nov '12","","Jan '13","","Mar '13","","May '13","","Jul '13","","Sep '13","","Nov '13","","Jan '14","","Mar '14","","May '14","","Jul '14","","Sep '14",""],"values":[{"name":"VISITS","data":[null,null,null,null,null,null,null,null,null,null,null,132,33,219,1312,1088,1277,1161,1188,1305,1513,1213,1331,1954],"shadow":true,"enableMouseTracking":true}],"extra":{"VISITS_total":13726.0}},
			"visit-trend-unique-visitor": {"labelY":"Visits","labels":["Nov '12","","Jan '13","","Mar '13","","May '13","","Jul '13","","Sep '13","","Nov '13","","Jan '14","","Mar '14","","May '14","","Jul '14","","Sep '14",""],"values":[{"name":"VISITORS","data":[null,null,null,null,null,null,null,null,null,null,null,16,12,157,1161,981,1179,1081,1113,1199,1179,1115,1154,1648],"shadow":true,"enableMouseTracking":true}],"extra":{"VISITORS_total":11995.0}},
			"how-customers-found-your-website": {"labelY":"Visits","labels":["google.ca","Direct","google.com","yellowpages.ca","crowfootvisioncentre.ca","Other"],"values":[{"data":[5822,2537,2482,496,441,1948],"shadow":true,"enableMouseTracking":true}],"extra":{"null_total":13726.0}},
			"how-customers-found-your-website-over-time": {"labelY":"Visits","labels":["Nov '12","","Jan '13","","Mar '13","","May '13","","Jul '13","","Sep '13","","Nov '13","","Jan '14","","Mar '14","","May '14","","Jul '14","","Sep '14",""],"values":[{"name":"google.ca","data":[null,null,null,null,null,null,null,null,null,null,null,0,0,53,649,535,606,567,551,568,589,525,548,631],"shadow":true,"enableMouseTracking":true},{"name":"google.com","data":[null,null,null,null,null,null,null,null,null,null,null,0,0,5,118,130,175,175,248,272,255,221,253,630],"shadow":true,"enableMouseTracking":true},{"name":"Direct","data":[null,null,null,null,null,null,null,null,null,null,null,32,14,95,277,230,264,211,210,239,264,213,223,265],"shadow":true,"enableMouseTracking":true},{"name":"yellowpages.ca","data":[null,null,null,null,null,null,null,null,null,null,null,92,17,29,22,20,14,25,10,10,203,20,17,17],"shadow":true,"enableMouseTracking":true},{"name":"crowfootvisioncentre.ca","data":[null,null,null,null,null,null,null,null,null,null,null,0,0,7,25,30,12,23,19,22,24,40,76,163],"shadow":true,"enableMouseTracking":true},{"name":"Other","data":[null,null,null,null,null,null,null,null,null,null,null,8,2,30,221,143,206,160,150,194,178,194,214,248],"shadow":true,"enableMouseTracking":true}],"extra":{"yellowpages.ca_total":496.0,"Other_total":1948.0,"Direct_total":2537.0,"crowfootvisioncentre.ca_total":441.0,"google.ca_total":5822.0,"google.com_total":2482.0}},
			"what-customers-clicked-on": {"values":[{"data":[14500,2104,836,259,40,33,9],"shadow":true,"enableMouseTracking":true}],"labels":["Contact us","External Links","Map and direction","Calls","Email","Other","Print"],"totalVisits":"17,781","labelY":"Interactions"},
			"paid-click-trend": {"labelY":"Paid interactions","labels":["Nov '12","","Jan '13","","Mar '13","","May '13","","Jul '13","","Sep '13","","Nov '13","","Jan '14","","Mar '14","","May '14","","Jul '14","","Sep '14",""],"values":[{"data":[261,264,317,303,365,388,316,324,356,366,293,null,null,null,null,null,null,null,null,null,null,null,null,null],"shadow":true,"enableMouseTracking":true}],"extra":{"null_total":3553.0,"total_visits":"3,553"}},
			"paid-clicks-details": {"labelY":"Paid interactions","labels":["GOOGLE","BING_YAHOO"],"values":[{"data":[3424,129],"shadow":true,"enableMouseTracking":true}],"extra":{}},
			"search-engine-marketing-call-tracking-calls-trend": {"labelY":"Calls tracked","labels":["Nov '12","","Jan '13","","Mar '13","","May '13","","Jul '13","","Sep '13","","Nov '13","","Jan '14","","Mar '14","","May '14","","Jul '14","","Sep '14",""],"values":[{"name":"Answered","data":[41,20,47,40,43,30,51,55,75,54,34,null,null,null,null,null,null,null,null,null,null,null,null,null],"shadow":true,"enableMouseTracking":true},{"name":"Not answered","data":[5,7,8,2,2,3,5,1,5,2,1,null,null,null,null,null,null,null,null,null,null,null,null,null],"shadow":true,"enableMouseTracking":true},{"name":"Busy","data":[1,0,0,0,0,0,0,0,0,0,0,null,null,null,null,null,null,null,null,null,null,null,null,null],"shadow":true,"enableMouseTracking":true}],"extra":{"Not answered_total":41.0,"Answered_total":490.0,"Busy_total":1.0}},
			"search-engine-marketing-call-tracking-calls-by-day-of-week": {"labelY":"Calls tracked","labels":["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"values":[{"name":"Answered","data":[10,89,107,98,85,63,38],"shadow":true,"enableMouseTracking":true},{"name":"Not answered","data":[6,11,3,6,9,3,3],"shadow":true,"enableMouseTracking":true},{"name":"Busy","data":[0,0,0,0,0,1,0],"shadow":true,"enableMouseTracking":true}],"extra":{"Not answered_total":41.0,"Answered_total":490.0,"Busy_total":1.0}},
			"search-engine-marketing-call-tracking-calls-by-time-of-day": {"labelY":"Calls tracked","labels":["0:00","","2:00","","4:00","","6:00","","8:00","","10:00","","12:00","","14:00","","16:00","","18:00","","20:00","","22:00",""],"values":[{"name":"Answered","data":[null,null,0,1,0,2,4,17,80,86,61,59,47,37,32,38,17,2,4,1,0,0,2,0],"shadow":true,"enableMouseTracking":true},{"name":"Not answered","data":[null,null,1,0,2,2,4,3,5,4,1,3,1,2,1,1,3,2,4,1,0,0,0,1],"shadow":true,"enableMouseTracking":true},{"name":"Busy","data":[null,null,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],"shadow":true,"enableMouseTracking":true}],"extra":{"Not answered_total":41.0,"Answered_total":490.0,"Busy_total":1.0}},
			"print-advertising-call-tracking-calls-trend": {"labelY":"Calls tracked","labels":["Nov '12","","Jan '13","","Mar '13","","May '13","","Jul '13","","Sep '13","","Nov '13","","Jan '14","","Mar '14","","May '14","","Jul '14","","Sep '14",""],"values":[{"name":"Answered","data":[null,null,null,null,null,null,null,null,null,null,null,6,4,3,2,2,3,2,14,10,0,2,3,null],"shadow":true,"enableMouseTracking":true},{"name":"Not answered","data":[null,null,null,null,null,null,null,null,null,null,null,0,0,1,0,0,1,0,0,0,1,0,0,null],"shadow":true,"enableMouseTracking":true},{"name":"Busy","data":[null,null,null,null,null,null,null,null,null,null,null,0,0,0,0,0,0,0,0,0,0,0,0,null],"shadow":true,"enableMouseTracking":true}],"extra":{"Not answered_total":3.0,"Answered_total":51.0,"Busy_total":0.0}},
			"print-advertising-call-tracking-calls-by-day-of-week": {"labelY":"Calls tracked","labels":["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"values":[{"name":"Answered","data":[10,89,107,98,85,63,38],"shadow":true,"enableMouseTracking":true},{"name":"Not answered","data":[6,11,3,6,9,3,3],"shadow":true,"enableMouseTracking":true},{"name":"Busy","data":[0,0,0,0,0,1,0],"shadow":true,"enableMouseTracking":true}],"extra":{"Not answered_total":41.0,"Answered_total":490.0,"Busy_total":1.0}},
			"print-advertising-call-tracking-calls-by-time-of-day": {"labelY":"Calls tracked","labels":["0:00","","2:00","","4:00","","6:00","","8:00","","10:00","","12:00","","14:00","","16:00","","18:00","","20:00","","22:00",""],"values":[{"name":"Answered","data":[null,null,0,1,0,2,4,17,80,86,61,59,47,37,32,38,17,2,4,1,0,0,2,0],"shadow":true,"enableMouseTracking":true},{"name":"Not answered","data":[null,null,1,0,2,2,4,3,5,4,1,3,1,2,1,1,3,2,4,1,0,0,0,1],"shadow":true,"enableMouseTracking":true},{"name":"Busy","data":[null,null,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],"shadow":true,"enableMouseTracking":true}],"extra":{"Not answered_total":41.0,"Answered_total":490.0,"Busy_total":1.0}}
		};

		self._loadChart();
	};

	this._loadChart = function () {
		var data = window.chartsData;

		[].forEach.call( this.charts, function ( chart ) {
			var chartRenderTo = chart.id,
					chartID 			= chart.getAttribute( 'data-chart-id' ),
					chartType 		= chart.getAttribute( 'data-chart-type' ),
					chartLegend 	= chart.getAttribute( 'data-chart-legend' ) === 'true' ? true : false,
					chartObj 			= {
														chart: {
															renderTo: document.getElementById( chartRenderTo ),
															spacingBottom: chartLegend ? 45 : 10
														},
												
														xAxis: {
															categories: data[chartID].labels
														},
												
														yAxis: {
															title: {
																text: data[chartID].labelY
															}
														},

														plotOptions: {
															series: {
																stacking: null
															}
														},
												
														series: data[chartID].values,
												
														legend: {
															enabled: chartLegend
														}
													};

			if ( chartType === 'stacked' ) {
				chartObj.chart.type = 'column';
				chartObj.plotOptions.series.stacking = 'normal';
			} else {
				chartObj.chart.type = chartType;
				chartObj.plotOptions.series.stacking = null;
			}
			
			chartObj.yAxis.min = ( chartType === 'line' ) ? 0 : null;
			
			new Highcharts.Chart( chartObj );
		});
	};
}

var darkBlueHighlight = '#444450',
		darkGray = '#666E78', // LABEL COLOUR
		lightBlue = '#DADAE7', // AXIS COLOUR
		visits = '#FDB755',
		colors = {
			green: '#69B342',
			blue: '#255AA8',
			orange: '#FFA600',
			purple: '#8C42B3',
			turquoise: '#00BBBC',
			coral: '#A15672'
		};

Highcharts.theme = {
	chart: {
		backgroundColor: 'transparent',
		spacing: [30,0,10,0],
		height: 375
	},

	xAxis: {
		lineColor: lightBlue,
		lineWidth: 1,
		tickColor: 'transparent',
		gridLineColor: lightBlue,
		labels: {
			style: {
				fontFamily: 'Open Sans',
				fontSize: '14px',
				fontWeight: 'regular',
				lineHeight: 20
			},
			y: 20
		}
	},

	yAxis: {
		allowDecimals: false,
		lineColor: lightBlue,
		lineWidth: 5,
		tickColor: 'transparent',
		title: {
			// rotation: 0,
			style: {
				fontFamily: 'Open Sans',
				fontSize: '14px',
				fontWeight: 'bold',
				color: darkBlueHighlight
			},
			align: 'middle'
		},
		gridLineColor: lightBlue,
		labels: {
			style: {
				fontFamily: 'Open Sans',
				fontSize: '16px',
				fontWeight: 'regular',
				lineHeight: 20
			}
		}
	},

	tooltip: {
		backgroundColor: '#666E78',
		borderWidth: 0,
		style: {
			color: 'white'
		},
		shadow: false,
		useHTML: true,
		formatter: function () {
			return '<span style="position: relative; display: inline-block; vertical-align: middle; width: 25px; height: 25px; border: 1px solid white; background-color:' + this.series.color + '; margin-right: 10px;"></span><p style=" position: relative; display: inline-block; vertical-align: middle; font-size: 18px; font-weight: 300;">'+ _c.cleanNumber( this.y ) + '</p>';
		}
	},

	title: {
		style: {
			display: 'none'
		}
	},

	plotOptions: {
		line: {
			lineWidth: 5,

			marker: {
				lineColor: null,
				lineWidth: 4,
				fillColor: 'white',
				radius: 8,
				symbol: 'circle',

				states: {
					hover: {
						lineColor: null,
						lineWidth: 10,
						radius: 5
					}
				}
			},

			states: {
				hover: {
					lineWidth: 5
				}
			}
		},

		column: {
			borderColor: null,
			states: {
				hover: {
					brightness: -0.1
				}
			}
		}
	},

	legend: {
		enabled: true,
		floating: true,
		align: 'right',
		itemDistance: 50,
		itemStyle: {
			fontSize: '12px',
			fontWeight: 'regular',
			color: darkGray
		},
		lineHeight: 1.3,
		margin: 20,
		style: {
			align: 'right',
			border: 'none'
		},
		borderWidth: 0,
		y: 30
	},

	navigation: {
		buttonOptions: {
			enabled: false
		}
	},

	credits: {
		enabled: false
	},

	colors: [colors.green, colors.blue, colors.orange, colors.purple, colors.turquoise, colors.coral]
};

// Apply the theme
Highcharts.setOptions( Highcharts.theme );