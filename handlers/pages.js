'use strict';

const path = require('path');

exports.downloadCV = (req, res) => {
  const pdf = `cv-web-${req.query.lang}.pdf`;

  console.log(path.resolve(`${__dirname}/../public/${pdf}`));

  res.attachment(`data/${pdf}`);
  res.setHeader('Content-Type', 'application/pdf');
  res.sendFile(path.resolve( __dirname + `/../public/${pdf}`));
};
