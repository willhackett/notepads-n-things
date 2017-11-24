/*
  Graceful error catching
*/

const errorCatcher = (error) => {
  /* eslint-disable */
  console.error(error.message);
  console.log([
    `How to use the Notepad 'n' Things query application.`,
    '--state <string> :: Apply a filter by state',
    '--centre <string> :: Apply a filter by state',
    '--best <psm|area|totalSales> :: Limit result to highest psm, area or totalSales',
    '--totals :: Display the total sales, area and Sales PSM for the query set'
  ].join('\n'))
  if (process.env.NODE_ENV === 'development') {
    console.trace(error);
  }
  process.exit(1);
  /* eslint-enable */
};
module.exports = errorCatcher;
