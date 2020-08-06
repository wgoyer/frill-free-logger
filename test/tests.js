let assert = require('assert')
let sinon = require('sinon')
let Logger = require('../Logger.js')

describe('Log output', () => {
  let lumberJack, log
  beforeEach(() => {
    if (log && log.restore) { log.restore() }
    lumberJack = new Logger({name: 'lumberJack'})
    log = sinon.spy(console, 'log')
  })
  describe('log types', () => {
    it('INFO log format', () => {
      lumberJack.logInfo('Sup')
      sinon.assert.calledWithExactly(log, sinon.match(/^\[INFO\] {4}lumberJack \d{4}:\d{2}:\d{2} \d{2}:\d{2}:\d{2} - Sup$/))
    })
    it('WARNING log format', () => {
      lumberJack.logWarning('what a woild')
      sinon.assert.calledWithExactly(log, sinon.match(/^\[WARNING\] lumberJack \d{4}:\d{2}:\d{2} \d{2}:\d{2}:\d{2} - what a woild$/))
    })
    it('ERROR log format', () => {
      lumberJack.logError('kapow')
      sinon.assert.calledWithExactly(log, sinon.match(/^\[ERROR\] {3}lumberJack \d{4}:\d{2}:\d{2} \d{2}:\d{2}:\d{2} - kapow$/))
    })
  })
  describe('Log JSON', () => {
    const prettyJSON = '\t{\n\t  "pretty": "json"\n\t}'
    it('will log prettified JSON from object', () => {
      lumberJack.logInfo('x', {'pretty': 'json'})
      sinon.assert.calledWith(log, sinon.match(prettyJSON))
    })
    it('will log prettified JSON from string', () => {
      lumberJack.logInfo('y', '{"pretty": "json"}')
      sinon.assert.calledWith(log, sinon.match(prettyJSON))
    })
    it('will log plain text string when not JSON', () => {
      lumberJack.logInfo('z', 'not even json')
      sinon.assert.calledWith(log, sinon.match('\tnot even json'))
    })
  })
})
