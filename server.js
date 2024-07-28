const express = require('express');
const JsonDB = require('./jsonDB');
const fs = require('fs');
var md5 = require('js-md5');

const config = JsonDB.getConfig();

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function generatePassword() {
    var length = 45,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

if (!fs.existsSync("configDB.json")) {
  const lol = generatePassword()
  const data = {
    "port":3000,
    "users": [
      {
        "username": "admin",
        "password": md5(lol), //Yes im aware that this should not be an md5 hash, but 1) i don't realy care rn to make this proper, 2) it's not like anyone's going to use this in prod :P 
        "perms": [
          {"*": "*"}
        ]
      }
    ]
  }
  
  console.log(`\n\n ---------- \n THIS IS YOUR DEFAULT ACCOUNT'S RANDOM GENERATED PASSWORD!!! \n THIS WILL ONLY BE SHOWN ONCE, KEEP THIS SAFE! \n ${lol} \n\n`)
  JsonDB.initConfig(data)
}

const test = function (req, res, next) {
  const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
  if(b64auth == '') {
    res.status(401).json({"err":"b64authheaderempty"})
  }
  const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')
  console.log(login, password);
  let result = config.users.filter(obj => {
    return obj.username === login
  })

  console.log(result, "\n", result[0].password, "\n", md5(password), "\n", result[0].perms[0], "\n",typeof result[0].perms[0], "\n", typeof {"*":"*"})
  if (result[0].password == md5(password)) {
    console.log("test5");
    if (result[0].perms[0] == {"*":"*"}) {
      console.log("test");
      return next();
    }
  } else {
    // RangeError: Uncaught RangeError: Maximum call stack size exceeded in ~N/A?${}? at (weirdscript.js:5:13)
    let num = getRandomInt(10);
    console.log(num)
    if (num == 1) {
      res.status(500).json({"err":"RangeError: Uncaught RangeError: Maximum call stack size exceeded in undefined at (resource.js:5:13)"})
    } else {
      res.status(401).json({"err":"unauthorized"})
    }
  }
  
}


const app = express();

const port = config.port || 3001;
app.use(express.json());
app.use(test);


app.get('/tables', (req, res) => {
  const db = new JsonDB(`./dbs/${req.body.db}.json`);
  const tables = db.getAllTables();
  res.json(tables);
});

app.get('/getData', (req, res) => {
  const db = new JsonDB(`./dbs/${req.body.db}.json`)
  const data = db.get(req.body.table, req.body.query);
  console.log(data, req.body.table, req.body.db, req.body.query);

  res.status(200).json(data);
})

app.delete('/delete', (req, res) => {
  const db = new JsonDB(`./dbs/${req.body.db}.json`);
  let resp;
  try{ 
    resp = db.delete(req.body.tableName, req.body.query);
  } catch {
    res.status(500);
  }
  
  res.status(200).json(resp);
})

app.put('/update', (req, res) => {
  const db = new JsonDB(`./dbs/${req.body.db}.json`);
  let resp;
  try {
    resp = db.update(req.body.tableName, req.body.what, req.body.where);
  } catch {
    res.status(500);
  }
  res.status(200).json(resp);
})

app.put('/insert', (req, res) => {
  const db = new JsonDB(`./dbs/${req.body.db}.json`);
  const returnID = db.insert(req.body.table, req.body.data);

  res.status(200).json(returnID);
})

app.put('/createTable', (req, res) => {
  const db = new JsonDB(`./dbs/${req.body.db}.json`);
  db.createTable(req.body.tableName);
  res.status(200).json(req.body.tableName)
})

app.put('/createDatabase', (req, res) => {
  if (!fs.existsSync(`./dbs/${req.body.db}.json`)) {
    const db = new JsonDB(`./dbs/${req.body.db}.json`);
    res.status(200)
  }
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
