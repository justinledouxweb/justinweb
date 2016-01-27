( function ( window, $ ) {
	$.fileUpload = function ( input, dropzone ) {
		var $input 		= $( input ),
				$dropzone = $( dropzone ),
				$form 		= $input.parents( 'form' ),
				$browse 	= $dropzone.find( 'a' ),
				projectId = $form.find( '#project-id' ).val(),
				csrf 			= $form.find( '#csrf' ).val()

		$browse
			.on( 'click', function ( e ) {
				e.preventDefault()
				$input.trigger( 'click' )
			})

		$input
			.on( 'change', function ( e ) {
				var files = e.originalEvent.target.files,
						form 	= new FormData()

				form.append( 'project-id', projectId )
				form.append( '_csrf', csrf )

				for ( var i = 0, l = files.length; i < l; i++ ) {
					form.append( 'images[]', files[i] )
				}

				$.ajax({
					url: '/projects/new',
					type: 'PATCH',
					data: form,
					async: true,
					processData: false,
					contentType: false,
					xhr: function () {
						var xhr 					= new window.XMLHttpRequest(),
								$progressBar 	= $( '<progress/>' ),
								$progressBar 	= $progressBar.attr( 'max', 100 )

						$( '.form__image-preview' ).append( $progressBar )

				    //Upload progress
						xhr.upload.addEventListener( 'progress', function ( e ) {
							if ( e.lengthComputable ) {
								var percentComplete = e.loaded / e.total

								console.log( Math.floor( percentComplete * 100 ) )

								$progressBar.attr( 'value', Math.floor( percentComplete * 100 ) )
							}
						}, false )

						//Download progress
						// xhr.addEventListener( 'progress', function ( e ) {
						// 	if ( e.lengthComputable ) {
						// 		var percentComplete = Math.floor( e.loaded / e.total )

						// 		$( '.form__image-preview' ).text( percentComplete * 100 + '%' )
						// 	}
						// }, false )

						return xhr
					}
				})

				.success( function ( res ) {
					debugger
				})

				.fail( function ( err ) {
					debugger
				})
			})
	}

	$.fn.fileUpload = function ( dropzone ) {
		this.each( function ( index, node ) {
			$.fileUpload( node, dropzone )
		})

		return this
	}
})( window, jQuery )