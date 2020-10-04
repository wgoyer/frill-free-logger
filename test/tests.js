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
      sinon.assert.calledWithExactly(log, sinon.match(/^\[INFO\] {4}\d{4}:\d{2}:\d{2} \d{2}:\d{2}:\d{2} lumberJack - Sup$/))
    })
    it('WARNING log format', () => {
      lumberJack.logWarning('what a woild')
      sinon.assert.calledWithExactly(log, sinon.match(/^\[WARNING\] \d{4}:\d{2}:\d{2} \d{2}:\d{2}:\d{2} lumberJack - what a woild$/))
    })
    it('ERROR log format', () => {
      lumberJack.logError('kapow')
      sinon.assert.calledWithExactly(log, sinon.match(/^\[ERROR\] {3}\d{4}:\d{2}:\d{2} \d{2}:\d{2}:\d{2} lumberJack - kapow$/))
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
    it('will objectify, stringify and prettify an error object', () => {
      lumberJack.logError('err', new Error('I have made a huge mistake'))
      const lineCount = log.getCall(0).firstArg.split('\n').length
      assert(lineCount > 6, `Expected there to be more than 6 lines in the log output, but there were only ${lineCount}`)
    })
  })
  describe('zero settings', () => {
    let lumberJill = new Logger()
    it('INFO log format', () => {
      lumberJill.logInfo('Excellent')
      sinon.assert.calledWithExactly(log, sinon.match(/^\[INFO\] {4}\d{4}:\d{2}:\d{2} \d{2}:\d{2}:\d{2} - Excellent$/))
    })
    it('WARNING log format', () => {
      lumberJill.logWarning('Not so good')
      sinon.assert.calledWithExactly(log, sinon.match(/^\[WARNING\] \d{4}:\d{2}:\d{2} \d{2}:\d{2}:\d{2} - Not so good$/))
    })
    it('ERROR log format', () => {
      lumberJill.logError('turrible')
      sinon.assert.calledWithExactly(log, sinon.match(/^\[ERROR\] {3}\d{4}:\d{2}:\d{2} \d{2}:\d{2}:\d{2} - turrible$/))
    })
  })
})
