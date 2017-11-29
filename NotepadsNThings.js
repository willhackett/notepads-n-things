require('console.table');
const path = require('path')
const fields = ['state', 'centre']
const minimumNodeVersion = new RegExp('^v8.[6-9].[\\d]$');

class NTError extends Error {
  constructor(message) {
    super(message)

    Error.captureStackTrace(this, this.constructor)

    /* eslint-disable */
    console.error(message);
    console.log([
      `How to use the Notepad 'n' Things query application.`,
      '--state <string> :: Apply a filter by state',
      '--centre <string> :: Apply a filter by state',
      '--best <psm|area|totalSales> :: Limit result to highest psm, area or totalSales',
      '--totals :: Display the total sales, area and Sales PSM for the query set'
    ].join('\n'))
    if (process.env.NODE_ENV === 'development') {
      console.trace(this);
    }
    /* eslint-enable */
    process.exit(1);

  }
}

class NotepadsNThings {
  constructor(autorun) {
    this.checkEnvironment();


    this.filters = {}
    this.totals = { sales: 0, area: 0, psm: 0 }
    this.calculateTotals = process.argv.indexOf('--totals') > -1;
    this.best = process.argv.indexOf('--best') > -1 ? process.argv.indexOf('--best') : false;

    this.find = this.find.bind(this)
    this.findAll = this.findAll.bind(this)
    this.compareObjects = this.compareObjects.bind(this)
    this.findHighest = this.findHighest.bind(this)
    this.objectContains = this.objectContains.bind(this)

    if (autorun === true) {
      this.data = this.loadData();
      this.calculate();
    }
  }
  calculate() {
    fields.forEach(field => {
      const fieldIndex = this.findIndex(process.argv, a => a === `--${field}`)
      if (fieldIndex > -1) {
        if (!this.isNotArg(fieldIndex + 1)) throw new NTError(`${field} is missing a value.`)
        this.filters = { ...this.filters, [field]: process.argv[fieldIndex + 1]}
      }
    });

    if (!this.isEmptyObject(this.filters)) {
      this.data = this.findAll(this.data, this.filters);
    }

    // Calculate PSM & Tally the totals
    this.data = this.data.map(store => {
      const psm = Math.round(store.totalSales / store.area, 2);
      if (this.calculateTotals) {
        this.totals.sales += store.totalSales;
        this.totals.area += store.area;
        this.totals.psm += psm;
      }
      return {
        ...store,
        psm,
      };
    });

    if (this.best) {
      if (!this.isNotArg(this.best + 1)) throw new NTError('Please specify either totalSales, area or psm when sorting by best');
      this.data = this.findHighest(this.data, process.argv[this.best + 1]);
    }

    /* eslint-disable */
    if (this.calculateTotals) {
      console.log(`
        Total Sales:\t${totals.sales}
        Total Area: \t${totals.area}
        Total Sales PSM:\t${totals.psm}
      `);
    } else {
      console.table(
        this.data.map(store => ({
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
  }
  loadData() {
    try {
      const dataSetPath = this.find(process.argv, value => new RegExp('^.*\\.json$').test(value));
      if (!dataSetPath) throw new NTError('Please provide a JSON dataset in your command arguments.');
      // Conveniently we can require JSON instead of using fs.read
      const dataSet = require(path.join(__dirname, dataSetPath));
      if (!this.isArray(dataSet))
        throw new NTError('The imported dataset must be an array.');
      if (Object.keys(dataSet).length <= 0)
        throw new NTError('The imported dataset contains no records.');
      return dataSet;
    } catch (fileReadError) {
      // Graceful error for occasions when the path to the dataset is incorrect
      throw new NTError(
        fileReadError.code === 'MODULE_NOT_FOUND'
         ? 'Unable to resolve path to the JSON dataset.'
         : fileReadError.message
       );
    }
  }
  checkEnvironment() {
    if (minimumNodeVersion.test(process.version) === false) {
      throw new NTError('Invalid NodeJS version, please use 8.6.x or higher.');
    }
  }
  findIndex(set, predicate, startIndex = 0) {
    if (this.isArray(set) === false) {
      throw new NTError('Please provide a valid array of values to compare.');
    }

    const finder = typeof predicate === 'function' ? predicate : collection => this.objectContains(collection, predicate);

    let iterate = startIndex;

    while (iterate < set.length) {
      const value = set[iterate];
      if (finder(value, predicate) === true) return iterate;
      iterate = iterate + 1;
    }
    return -1;
  }

  find(set, predicate) {
    const index = this.findIndex(set, predicate);
    return index > -1 ? set[index] : undefined;
  }

  findAll(set, predicate) {
    let results = [];
    let iterate = 0;
    while (iterate < set.length) {
      const match = this.findIndex(set, predicate, iterate);
      if (match > -1) {
        iterate = match + 1;
        results.push(set[match]);
      } else {
        return results;
      }
    }
    return results;
  }

  findHighest(data, field) {
    const max = data.map(data => data[field]).reduce((a, c) => Math.max(a, c));
    return this.findAll(data, { [field]: max });
  }

  isNotArg(value) {
    return new RegExp('^--.*').test(value) === false
  }

  isArray(value) {
    return !!value && typeof value !== 'function' && typeof value.length === 'number' && value.length >= -1;
  }

  isEmptyObject(object) {
    for (let key in object) {
      if (object.hasOwnProperty(key)) return false;
    }
    return true;
  }

  compareObjects(objectOne, objectTwo) {
    for (let key in objectOne) {
      if (objectTwo.hasOwnProperty(key) === false) return false;

      switch (typeof objectOne[key]) {
        case 'object':
          if (this.compareObjects(objectOne[key], objectTwo[key]) === false) return false;
          break;
        case 'function':
          if (typeof objectTwo[key] === 'undefined' || objectOne[key].toString() !== objectTwo[key].toString()) return false;
          break;
        default:
          if (objectOne[key] !== objectTwo[key]) return false;
      }
    }
    // Check object two against objectOne
    for (let key in objectTwo) {
      if (objectOne.hasOwnProperty(key) === false) return false;
    }
    // If everything works out nicely, return true.
    return true;
  }

  objectContains(baseObject, comparisonObject) {
    for (let key in comparisonObject) {
      if (baseObject.hasOwnProperty(key) === true) {
        switch (typeof comparisonObject[key]) {
          case 'object':
            if (this.compareObjects(comparisonObject[key], baseObject[key]) === true) return true;
            break;
          case 'function':
            if (typeof baseObject[key] !== 'undefined' && comparisonObject[key].toString() === baseObject[key].toString()) return true;
            break;
          default:
            if (baseObject[key] === comparisonObject[key]) return true;
        }
      }
    }
    return false;
  }

}

module.exports = NotepadsNThings;
