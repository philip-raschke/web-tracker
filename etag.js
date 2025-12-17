const express = require('express');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const UAParser = require('ua-parser-js');

const app = express();
const port = 3021;

app.set('trust proxy', true);

app.use((req, res, next) => {

  if (req.url != '/pixel.png') {;
    return next();
  }

  let id = (req.headers['if-none-match']) ? req.headers['if-none-match'] : uuidv4();
  const userAgent = req.get('User-Agent');
  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  if (!req.headers['if-none-match']) {
    console.log('New user, assign ID: ' + id);
  }
  res.set('ETag', id);

  console.log(
    id, 
    req.headers.referer,
    result.browser.name,
    result.browser.version,
    result.os.name,
    req.ip
  )
  next();
});

app.use(express.static(path.join(__dirname, 'img')));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
