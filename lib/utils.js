const isNotArg = value => new RegExp('^--.*').test(value) === false;

const isArray = (value) => {
  return !!value && typeof value !== 'function' && typeof value.length === 'number' && value.length >= -1;
};

const isEmptyObject = (object) => {
  for (let key in object) {
    if (object.hasOwnProperty(key)) return false;
  }
  return true;
};

const compareObjects = (objectOne, objectTwo) => {
  // Match object one against object two
  for (let key in objectOne) {
    if (objectTwo.hasOwnProperty(key) === false) return false;

    switch (typeof objectOne[key]) {
      case 'object':
        if (compareObjects(objectOne[key], objectTwo[key]) === false) return false;
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
};

const objectContains = (baseObject, comparisonObject) => {
  for (let key in comparisonObject) {
    if (baseObject.hasOwnProperty(key) === true) {
      switch (typeof comparisonObject[key]) {
        case 'object':
          if (compareObjects(comparisonObject[key], baseObject[key]) === true) return true;
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
};

module.exports = {
  isArray,
  compareObjects,
  objectContains,
  isNotArg,
  isEmptyObject,
};
