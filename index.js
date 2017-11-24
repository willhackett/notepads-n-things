const error = require('./lib/error');
const checkEnvironment = require('./lib/environment');
const loadData = require('./lib/loadData');
const constants = require('./constants');
const {
  isNotArg,
  isEmptyObject,
} = require('./lib/utils');
const {
  findIndex,
  findAll,
  findHighest
} = require('./lib/find');

try {
  /*
    Setup the environment
  */
  checkEnvironment();
  let data = loadData();

  // --state VIC
  // --centre Chadstone
  // --best totalSales
  // --best psm

  let filters = {};
  let totals = { sales: 0, area: 0, psm: 0 };
  let calculateTotals = process.argv.indexOf('--totals') > -1;
  let best = process.argv.indexOf('--best') > -1 ? process.argv.indexOf('--best') : false;

  constants.fields.forEach(field => {
    const fieldIndex = findIndex(process.argv, a => a === `--${field}`)
    if (fieldIndex > -1) {
      if (!isNotArg(fieldIndex + 1)) throw new Error(`${field} is missing a value.`)
      filters = { ...filters, [field]: process.argv[fieldIndex + 1]}
    }
  });

  if (!isEmptyObject(filters)) {
    data = findAll(data, filters);
  }

  // Calculate PSM & Tally the totals
  data = data.map(store => {
    const psm = Math.round(store.totalSales / store.area, 2);
    if (calculateTotals) {
      totals.sales += store.totalSales;
      totals.area += store.area;
      totals.psm += psm;
    }
    return {
      ...store,
      psm,
    };
  });

  if (best) {
    if (!isNotArg(best + 1)) throw new Error('Please specify either totalSales, area or psm when sorting by best');
    data = findHighest(data, process.argv[best + 1]);
  }

  /* eslint-disable */
  if (calculateTotals) {
    console.log(`
      Total Sales:\t${totals.sales}
      Total Area: \t${totals.area}
      Total Sales PSM:\t${totals.psm}
    `);
  } else {
    console.table(
      data.map(store => ({
        State: store.state,
        Centre: store.centre,
        'Total Sales': store.totalSales,
        Unit: store.unit,
        Area: store.area,
        'Sales PSM': store.psm,
      }))
    );
  }

  /* eslint-enable */

} catch (err) {
  error(err);
}
