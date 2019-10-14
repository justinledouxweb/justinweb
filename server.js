module.exports = (app) => {
  app.listen(process.env.PORT || 3000, () => {
    console.log(
      'App listening at http://%s:%s',
      process.env.NODE_ENV,
      process.env.PORT,
    );
  });
};
