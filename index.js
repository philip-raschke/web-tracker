const express = require("express")
const cookieParser = require("cookie-parser");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const UAParser = require('ua-parser-js');

const app = express()
const port = 3020

app.set("trust proxy", true);

app.use(cookieParser());

app.use((req, res, next) => {
  let id = (req.cookies.id) ? req.cookies.id : uuidv4();
  const userAgent = req.get('User-Agent');
  const parser = new UAParser(userAgent);
  const result = parser.getResult();
  if (!req.cookies.id) {
    res.cookie("id", id, {
      secure: true,
      sameSite: "None",
    });

    console.log("New user, assign ID: " + id);
  }

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

app.use(express.static(path.join(__dirname, "img")));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
