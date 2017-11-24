/*
  Make sure the correct version of node is running for this applet.
*/
require('console.table');
const checkEnvironment = () => {
  const versionRequirement = new RegExp('^v8.[6-9].[\\d]$');

  if (versionRequirement.test(process.version) === false) {
    throw new Error('Invalid NodeJS version, please use 8.6.x or higher.');
    process.exit(1);
  }
};
module.exports = checkEnvironment;
