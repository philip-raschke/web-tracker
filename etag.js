const express = require("express");
const app = express();
const { v4: uuidv4 } = require("uuid");
const UAParser = require('ua-parser-js');

app.get("/", (req, res) => {
  const userAgent = req.get('User-Agent');
  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  let etag = req.headers['if-none-match'];
  if (!etag) {
    etag = uuidv4();
  }

  console.log(
    etag, 
    req.headers.referer,
    result.browser.name,
    result.browser.version,
    result.os.name,
    req.ip
  )
  
  res.set("ETag", etag);
  res.send();
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
