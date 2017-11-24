/*
  Graceful error catching
*/

const errorCatcher = (error) => {
  console.error(error.message); //eslint-disable-line
  if (process.env.NODE_ENV !== 'PRODUCTION') {
    console.trace(error); //eslint-disable-line
  }
  process.exit(1);
};
module.exports = errorCatcher;
