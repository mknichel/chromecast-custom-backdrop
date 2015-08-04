# Custom Chromecast Backdrop: Show tweets while you wait

## Overview 

This project provides application to show a custom Chromecast backdrop
displaying random tweets on the screen when nothing else is playing. The tweets
will cycle through random topics every so often and show a handful of tweets
per topic.

## Usage

This project requires a Twitter consumer application key and secret to be
set up.

Visit https://apps.twitter.com and click on the 'Create New App' button. Fill
out the details.

Once the application is created, click on the "manage keys and access tokens"
link from the application screen. This page will list a Consumer Key and
Consumer Secret.

Create a `secret.js` file in the root directory of your project and copy these
values into there. Then create a config object and export this from the file.

```
var config = {
    "consumerKey": CONSUMER_KEY,
    "consumerSecret": CONSUMER_SECRET,
}

module.exports = config;
```

After all this is done, run:

```
node index.js
```

and then visit `http://localhost:3000` in your browser. If you have a ChromeCast
active, then a dialog should appear asking you to cast this tab.
