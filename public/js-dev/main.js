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

	// $( 'input[type=file]' ).fileUpload( '.dropzone' )

	$( '.dropzone' )
		.find( 'a' )
			.on( 'click', function ( e ) {
				$( '.form input[type="file"]' ).trigger( 'click' )
			})

	$( '.form' )
		.on( 'change', function ( e ) {
			var $this 		= $( this ),
					$target  	= $( e.target ),
					csrf 			= $this.find( '#csrf' ).val(),
					projectId = $this.find( '#id' ).val(),
					method 		= projectId ? 'PATCH' : 'POST',
					formData 	= new FormData()

			// This is required to make sure you are not accessing the POST url from
			// outside the page
			formData.append( '_csrf', csrf )

			// If there is an ID in the hiddent input, add the ID to the payload
			if ( method === 'PATCH' )
				formData.append( 'id', projectId )

			// If it is not a file input, append the value
			if ( $target.attr( 'type' ) !== 'file' )
				formData.append( $target.attr( 'name' ), $target.val() )

			// If the input is a file input, add the file Object to the formData
			// Instead of its val()
			else {
				var files = $target.get(0).files

				for ( var i = 0, l = files.length; i < l; i++ ) {
					formData.append( 'images[]', files[i], files[i].name )
				}
			}

			$.ajax({
				url: '/projects/new',
				method: method,
				data: formData,
				processData: false,
				contentType: false,
			})

			.success( function ( res ) {
				if ( res.data && res.data.id )
					$this.find( '#id' ).val( res.data.id )
			})

			.fail( function ( err ) {
				debugger
			})
		})
})( window, jQuery )