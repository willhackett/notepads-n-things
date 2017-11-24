const { isArray, objectContains } = require('./utils');

const findIndex = (set, predicate, startIndex = 0) => {
  if (isArray(set) === false) {
    throw new Error('Please provide a valid array of values to compare.');
  }

  const finder = typeof predicate === 'function' ? predicate : collection => objectContains(collection, predicate);

  let iterate = startIndex;

  while (iterate < set.length) {
    const value = set[iterate];
    if (finder(value, predicate) === true) return iterate;
    iterate = iterate + 1;
  }
  return -1;
};

const find = (set, predicate) => {
  const index = findIndex(set, predicate);
  return index > -1 ? set[index] : undefined;
};

const findAll = (set, predicate) => {
  let results = [];
  let iterate = 0;
  while (iterate < set.length) {
    const match = findIndex(set, predicate, iterate);
    if (match > -1) {
      iterate = match + 1;
      results.push(set[match]);
    } else {
      return results;
    }
  }
  return results;
};

const findHighest = (data, field) => {
  const max = data.map(data => data[field]).reduce((a, c) => Math.max(a, c));
  return findAll(data, { [field]: max });
};

module.exports = {
  find,
  findIndex,
  findAll,
  findHighest,
};
