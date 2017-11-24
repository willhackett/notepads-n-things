/*
  Graceful error catching
*/

const errorCatcher = (error) => {
  console.error(error.message);
  if (process.env.NODE_ENV !== 'PRODUCTION') {
    console.trace(error);
  }
  process.exit(1);
};
module.exports = errorCatcher;
