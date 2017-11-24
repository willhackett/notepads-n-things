const { isArray, compareObjects, objectContains } = require('../../lib/utils')

const testCollection = [
  { a: 'one', two: 'three' },
  { b: 'two', three: 'two' },
  { c: 'three', four: 'eight' },
]

describe('lib/utils.isArray', () => {
  it ('should return true for an array', done => {
    expect(isArray([1,2,3])).to.be.true
    expect(isArray([])).to.be.true
    done()
  })
  it ('should return false for non-arrays', done => {
    expect(isArray(undefined)).to.be.false
    expect(isArray(false)).to.be.false
    done()
  })
})

describe('lib/utils.compareObjects', () => {
  it('should return true for equal objects', done => {
    expect(compareObjects({ a: 1, b: 2, c: 3 }, { c: 3, a: 1, b: 2 })).to.be.true
    expect(compareObjects({ a: { b: { c: 1 } } }, { a: { b: { c: 1 } } })).to.be.true
    done()
  })
  it('should return false for inequal objects', done => {
    expect(compareObjects({ a: 1, b: 2, c: 3 }, { x: 3, y: 1, z: 2 })).to.be.false
    expect(compareObjects({ a: { b: { c: 1 } } }, { x: { b: { c: 1 } } })).to.be.false
    done()
  })
  it('should accurately compare strings', done => {
    expect(compareObjects('string1', 'string1')).to.be.true
    expect(compareObjects('string1', 'string2')).to.be.false
    done()
  })
  it('should accurately compare functions', done => {
    const function1 = () => 'some result'
    const function2 = () => 'some other result'
    
    expect(compareObjects({ a: function1 }, { a: function1 })).to.be.true
    expect(compareObjects({ a: function1 }, { a: function2 })).to.be.false
    done()
  })
})

describe('lib/utils.objectContains', () => {
  it('should return true for objects containing the definition', done => {
    expect(objectContains(testCollection[0], { a: 'one' })).to.be.true
    expect(objectContains(testCollection[2], { c: 'three' })).to.be.true
    done()
  })
  it('should return false for objects not containing the definition', done => {
    expect(objectContains(testCollection[0], { c: 'one' })).to.be.false
    expect(objectContains(testCollection[2], { x: 'three' })).to.be.false
    done()
  })

})