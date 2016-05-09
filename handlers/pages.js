'use strict'

const path = require( 'path' );

exports.downloadCV = ( req, res ) => {
	const pdf = req.query.lang === 'eng'
		? 'cv-web-eng.pdf'
		: 'cv-web-fr.pdf';

	res.attachment(`data/${pdf}`);
	res.setHeader('Content-Type', 'application/pdf');
	res.sendFile(path.resolve( __dirname + `/../public/${pdf}`));
}