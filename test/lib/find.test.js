const { find, findAll, findHighest } = require('../../lib/find')

const testCollection = [
  { a: 'one', two: 'three', x: 1 },
  { b: 'two', three: 'two', x: 2 },
  { c: 'three', four: 'eight', x: 4 },
  { c: 'three', four: 'ten', x: 4 }
]

describe('lib/find.find', () => {
  it('should return the correct index', done => {
    expect(find(testCollection, { a: 'one' })).to.deep.equal({ a: 'one', two: 'three', x: 1 })
    expect(find(testCollection, { b: 'two' })).to.deep.equal({ b: 'two', three: 'two', x: 2 })
    expect(find(testCollection, { four: 'eight' })).to.deep.equal({ c: 'three', four: 'eight', x: 4 })
    done()
  })
  it('should return false for incorrect searches', done => {
    expect(find(testCollection, { x: 'one' })).to.be.an('undefined')
    expect(find(testCollection, { y: 'two' })).to.be.an('undefined')
    expect(find(testCollection, { z: 'eight' })).to.be.an('undefined')
    done()
  })
})
describe('lib/find.findAll', () => {
  it ('should return an array of collections matching the predicate', (done) => {
    expect(findAll(testCollection, { c: 'three' })).to.deep.equal([{ c: 'three', four: 'eight', x: 4 }, { c: 'three', four: 'ten', x: 4 }])
    done();
  })
})
describe('lib/find.findHighest', () => {
  it ('should return the highest values', (done) => {
    expect(findHighest(testCollection, 'x')).to.deep.equal([{ c: 'three', four: 'eight', x: 4 }, { c: 'three', four: 'ten', x: 4 }])
    done();
  })
})
