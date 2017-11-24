const path = require('path');
const { find } = require('./find');
const { isArray } = require('./utils');

const loadData = () => {
  try {
    const dataSetPath = find(process.argv, value => new RegExp('^.*\\.json$').test(value));
    if (!dataSetPath) throw new Error('Please provide a JSON dataset in your command arguments.');
    // Conveniently we can require JSON instead of using fs.read
    const dataSet = require(path.join(__dirname, '..', dataSetPath));
    if (!isArray(dataSet))
      throw new Error('The imported dataset must be an array.');
    if (Object.keys(dataSet).length <= 0)
      throw new Error('The imported dataset contains no records.');
    return dataSet;
  } catch (fileReadError) {
    // Graceful error for occasions when the path to the dataset is incorrect
    throw new Error(
      fileReadError.code === 'MODULE_NOT_FOUND'
       ? 'Unable to resolve path to the JSON dataset.'
       : fileReadError.message
     );
  }
};
module.exports = loadData;
