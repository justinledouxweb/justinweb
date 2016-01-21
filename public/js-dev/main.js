( function ( window, $ ) {
	var $hamburger 				= $( '#hamburger' ),
			$sideMenu 				= $( '#side-menu' ),
			$sideMenuCurtain 	= $( '#side-menu-curtain' )

	function toggleSideMenu ( e ) {
		$sideMenu.toggleClass( 'open' )
		$sideMenuCurtain.toggleClass( 'active' )
	}

	$hamburger.on( 'click', toggleSideMenu )
	$sideMenuCurtain.on( 'click', toggleSideMenu )
	
})( window, jQuery )