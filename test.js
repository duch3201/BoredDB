const JsonDB = require('./jsonDB')

// const db = new JsonDB("./dbs/db2.json");
const db = new JsonDB('../testt.json');

// Usage examples
// db.set('name', 'Alice');
// db.set('age', 30);

// db.createTable('Users')
// db.createTable('test')

// const newUser = {
//   name:"Alice",
//   age:'30'
// }

// const test = {
//   "type": "lambda",
//   "byUser": "b2272e1c-05b4-4192-a995-66319f49dee9abcdgó",
//   "containerIds": {
//     "0": {
//       "id": "df784548666d"
//     }
//   },
//   "id": "b4fd9b5a-a0f8-430a-9745-49eab29ce2c0"
// }

// let i = 0;

// while (i < 25) {
//   console.log(db.insert('test', test));
//   i++
// }

// const newService = {
//   "type":"s3",
//   "byUser":"79d20128-fd36-4274-b559-3af5e26398ad",
//   "path":"{somepath}"
// }

// const newNewService = {
  // "type":"lambda",
  // "byUser":"b2272e1c-05b4-4192-a995-66319f49dee9",
  // "containerIds": {
    // "0":{
      // "id":"df784548666d",
    // }
  // }
// }

// console.log(db.insert('Services', newNewService))

// const newUser2 = {
//   name:"bob",
//   age:'35'
// }


// console.log(db.insert('Users', newUser), db.insert('Users', newUser2), db.insert('Services', newService))
// const users = db.get("users", { name: "Alice" });
// const allServices = db.get("Services", { "type": "lambda" }, { "byUser": "b2272e1c-05b4-4192-a995-66319f49dee9a" });
// console.log(users, allServices)



// const name = db.get('name');
// const age = db.get('age')
// console.log(name, age); // Output: Alice

// console.log(db.deleteTable('test'));
// console.log(db.delete("test", {"type":"lambda"}, {"byUser":"b2272e1c-05b4-4192-a995-66319f49dee9abcdgół"}))

db.update("test", {"type":"s3"}, {"id":"9c26ebe5-0f04-4145-b01e-12633af00bf1"})

// console.log(db.getAllTables())

// const user = db.get("Users", {id:"b2272e1c-05b4-4192-a995-66319f49dee9"})

// console.log(user[0].id)
// const userservices = db.get("Services", {byUser:user[0].id})
// // const obj = JSON.parse(userservices)
// console.log(userservices[1])

// const dddata = {
//   name:"lol",
//   age:"17"
// }

// console.log(db.insert("tableName", dddata))

// console.log(db.createTable("tableName"))
