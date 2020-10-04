# frill-free-logger
If you're looking for the best logging mechanism created for nodejs, you should probably keep looking because this ain't it.

Do you want your log messages to look like this?
```
[INFO]    2020:08:05 18:41:40 HTTPRequests - what a woild
  {
    "data": "this would be some important data, or not, I'm not the data police"
  }
[WARNING] 2020:08:05 18:41:40 HTTPRequests - what a woild
[ERROR]   2020:08:05 18:41:40 HTTPRequests - what a woild
```
Then here's how to use this thing:

This very basic logger is constructed with a settings object, or not:
```
const logSettings = {
  name: "HTTPRequests",
  fileName: "./httpRequests.log",
  stdout: false
}
```

Using the logger works like this:

```
let FFL = require('@orphaneater/frill-free-logger')
const logSettings = { // .. see above }
httpLog = new FFL(logSettings)

httpLog.info(`Making request to ${someUrl}`)

makeARequest(someUrl).then((jsonBody) => {
  httpLog.info(`Received HTTP response from ${someUrl}`, jsonBody)
  if (jsonBody.accountBalance < -20.00') {
    httpLog.warning(`Does the ${jsonBody.accountBalance} include the money you owe me?`)
  }
}).catch((err) => {
  httpLog.error(`Damn. ${someUrl} responded with an error`, err)
})
```
And would output similar to this if each scenario were hit:
```
[INFO]    2020:08:05 18:40:40 HTTPRequests - Making request to https://example.com
[INFO]    2020:08:05 18:40:42 HTTPRequests - Received HTTP response from https://example.com
  {
    "accountBalance": -31,
    "deadBeat": true
  }
[WARNING] 2020:08:05 18:40:43 HTTPRequests - Does the -31 include the money you owe me?
[ERROR]   2020:08:05 18:40:46 HTTPRequests - Damn. https://example.com responded with an error
  {
    "type": "Failure",
    "msg": "An error has occurred",
    "helpful": false
  }
```

### Install
`npm install @orphaneater/frill-free-logger`

### Settings
`name`: Added to your log messages. You can use it, or not. Ideal for cases where you might want multiple loggers. When it's not added, it's simply omitted from the logs.

`fileName`: Full path to the filename you want to write a log to. This doesn't do anything fancy like create the path to the file if it doesn't already exist. In fact, it's so low brow that if this is defined and the path isn't valid it will throw an exception. If it's not set, no file gets written.

`stdout`: Determines whether or not to print the log messages to the terminal. Defaults to true.

### Dependencies
Nope.

### Testing
Right. Because your use of a module someone else wrote hinges on whether or not the tests, they also wrote, pass.

### Contributing
- [Click here](https://raw.githubusercontent.com/wgoyer/frill-free-logger/master/Logger.js)
- Copy the entire contents of this file and paste it into an editor of your choice.
- Make whatever changes you would like.
- Push it to your own repository.
- Publish your own module.
