const express = require('express');
const JsonDB = require('./jsonDB')

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

const config = JsonDB.getConfig();

app.get('/tables', (req, res) => {
  const db = new JsonDB(`./dbs/${req.body.db}.json`);
  const tables = db.getAllTables();
  res.json(tables);
});

app.get('/getData', (req, res) => {

})

app.put('/insert', (req, res) => {
  const db = new JsonDB(`./dbs/${req.body.db}.json`);
  const returnID = db.insert(req.body.table, req.body.data);

  res.json(returnID);
})

app.put('/createTable', (req, res) => {
  const db = new JsonDB(`./dbs/${req.body.db}.json`);
  db.createTable(req.body.tableName);
  res.status(200).json(req.body.tableName)
})



app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
