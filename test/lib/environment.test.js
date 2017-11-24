const checkEnvironment = require('../../lib/environment');

describe('environment check', () => {
  it('should pass', (done) => {
    checkEnvironment();
    done();
  });
});
