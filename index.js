require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dns = require("dns");

const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const urls = [];

app.post("/api/shorturl", (req, res) => {
  console.log("req.body: ", req.body);
  const url = req.body.url;

  if (!url) {
    return res.json({ error: "invalid url" })
  }

  const isValid = isValidUrl(url)
  if (!isValid) {
    return res.json({ error: "invalid url" })
  }

  // dns.lookup(url, (error, address, family) => {
  //   // if an error occurs, eg. the hostname is incorrect!
  //   if (error) {
  //     console.error(error);
  //     return res.json({ error: "invalid url" });
  //   } else {
  //     // if no error exists
  //     console.log(
  //       `The ip address is ${address} and the ip version is ${family}`
  //     );
  //   }
  // });

  const id = urls.length === 0 ? 1 : urls[urls.length - 1].short_url + 1
  const newUrlObj = {
    short_url: id,
    original_url: url
  }

  urls.push(newUrlObj)
  res.json(newUrlObj)
});

app.get("/api/shorturl/:short_url", (req, res) => {
  const find = urls.find(item => String(item.short_url) === req.params.short_url)
  if (!find) {
    return res.json({ error: "invalid url"})
  }

  res.redirect(find.original_url)
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
}
