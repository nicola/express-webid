# express-webid

Log in users using WebID+TLS (soon WebID+RSA)

# Install

```bash
$ npm install --save express-webid
```

# Usage

```javascript
var app = require('express')()
var webid = require('express-webid');
var session = require('express-session');

// IMPORTANT - you need to have session
app.use(session({
  secret: ldp.secret || uuid.v1(),
  saveUninitialized: false,
  resave: false
}));

app.get('/needsAuth', webid('tls'), function(req, res) {
  // console.log(req.session.webid.uri);
  // console.log(req.session.webid.identified);
})
```

# History

Originally from [linkeddata/ldnode](https://github.com/linkeddata/ldnode)

# License

MIT
