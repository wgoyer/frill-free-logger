let fs = require('fs')

class Logger {
  constructor(settings = {}) {
    this.name = settings.name || false
    this.fileName = settings.fileName || false
    this.stdout = settings.stdout || true
    if (this.fileName) {
      this.fileStream = fs.createWriteStream(this.fileName, {flags: 'a'})
    }
  }
  logError(message, data) {
    const msg = buildMessage(this.name, 'ERROR', message, data)
    printMessage(msg, this.stdout, this.fileStream)
  }
  logWarning(message, data) {
    const msg = buildMessage(this.name, 'WARNING', message, data)
    printMessage(msg, this.stdout, this.fileStream)
  }
  logInfo(message, data) {
    const msg = buildMessage(this.name, 'INFO', message, data)
    printMessage(msg, this.stdout, this.fileStream)
  }
}

function getTimeStamp() {
  let date = new Date(),
      year = date.getFullYear().toString(),
      month = (date.getMonth() + 1).toString(),
      day = date.getDate().toString(),
      hours = date.getHours().toString(),
      minutes = date.getMinutes().toString(),
      seconds = date.getSeconds().toString()

  month = month.length > 1 ? month : `0${month}`
  day = day.length > 1 ? day : `0${day}`
  minutes = minutes.length > 1 ? minutes : `0${minutes}`
  hours = hours.length > 1 ? hours : `0${hours}`
  seconds = seconds.length > 1 ? seconds : `0${seconds}`
  return `${year}:${month}:${day} ${hours}:${minutes}:${seconds}`
}

function buildMessage(logName, level, message, data) {
  formattedLevel = `[${level}]`.padEnd(9) // length of "WARNING" plus brackets
  if (logName) {
    logMessage = `${formattedLevel} ${logName} ${getTimeStamp()} - ${message}`
  } else {
    logMessage = `${formattedLevel} ${getTimeStamp()} - ${message}`
  }
  if (data) {
    logMessage = `${logMessage}\n${handleJson(data)}`
  }
  return logMessage
}

function handleJson(data) {
  let processedData = ''
  // Try to prettify any JSON passed in
  if (typeof data == 'object') {
    processedData = indentJson(JSON.stringify(data, objectifyError, 2))
  } else {
    // If data is a string, see if it's stringified json and prettify it
    try {
      processedData = indentJson(JSON.stringify(JSON.parse(data), null, 2))
    } catch(err) {
      processedData = `\t${data}`
    }
  }
  return processedData
}

// This creates an object from an error that can be stringified.
// If it's not an error, return original value. Stack overflow FTW.
function objectifyError(key, value) {
  if (value instanceof Error) {
    let error = {}
    Object.getOwnPropertyNames(value).forEach((key) => {
      error[key] = value[key]
    })
    return error
  }
  return value
}

function indentJson(jsonString) {
  let splitIndented = []
  // Stringification escapes new line characters. We set them back so stack traces are legible
  jsonString = jsonString.split('\\n').join('\n')
  jsonString.split('\n').forEach((line) => { splitIndented.push(`\t${line}`) })
  return splitIndented.join('\n')
}

function printMessage(message, stdout, fileStream) {
  if (stdout) {
    console.log(message)
  }
  if (fileStream) {
    fileStream.write(`${message}\n`)
  }
}

module.exports = Logger
