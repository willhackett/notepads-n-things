const NotepadsNThings = require('../../NotepadsNThings');
const NT = new NotepadsNThings(false)

const checkEnvironment = NT.checkEnvironment;

describe('environment check', () => {
  it('should pass', (done) => {
    checkEnvironment();
    done();
  });
});
