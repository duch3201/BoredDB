const fs = require('fs');
const { v4: uuidv4 } = require("uuid");

class JsonDB {
  constructor(filename) {
    this.filename = filename;
    this.data = {};

    try {
      const fileData = fs.readFileSync(filename, 'utf8');
      this.data = JSON.parse(fileData) || {}; // Handle potential parsing errors
    } catch (error) {
      // Handle errors gracefully, e.g., create an empty database
      console.error(`Error reading database file: ${error.message}`);
      this.data = {};
    }
  }

  get(tableName, query = {}) {
    if (!this.data.hasOwnProperty(tableName)) {
      return []; // Return empty array if table doesn't exist
    }

    if (query === "*") {
      return this.data[tableName]; // Return all entries if query is "*"
    }

    // Filter entries based on query object
    return this.data[tableName].filter((entry) => {
      // Check if all properties in the query match the entry
      return Object.keys(query).every((key) => entry[key] === query[key]);
    });
  }

  getAllTables() {
    return Object.keys(this.data);
  }

  set(key, value) {
    this.data[key] = value;
    this.#saveData();
  }

  delete(key) {
    if (this.data.hasOwnProperty(key)) {
      delete this.data[key];
      this.#saveData();
    }
  }

  createTable(tableName) {
    if (!this.data.hasOwnProperty(tableName)) {
      this.data[tableName] = [];
      this.#saveData();
    }
  }

  insert(tableName, data) {
    if (!this.data.hasOwnProperty(tableName)) {
      throw new Error(`Table '${tableName}' does not exist.`);
    }
    const newData = { ...data };
    newData.id = uuidv4();
    this.data[tableName].push(newData);
    this.#saveData();
    return newData.id;
  }

  #saveData() {
    try {
      fs.writeFileSync(this.filename, JSON.stringify(this.data, null, 2)); // Pretty-printed JSON
    } catch (error) {
      console.error(`Error saving database file: ${error.message}`);
    }
  }

  static getConfig() {
    try {
      const configData = fs.readFileSync('configDB.json', 'utf8');
      return JSON.parse(configData) || {};
    } catch (error) {
      console.error(`Error reading config file: ${error.message}`);
      return {"ERROR":`Error reading config file: ${error.message}`};
    }
  }

  static initConfig(configData) {
    try {
      fs.writeFileSync('configDB.json', JSON.stringify(configData, null, 2));
    } catch (error) {
      console.error(`Error saving config file: ${error.message}`);
    }
  }

  static createDatabase(dbName) {
    const dbPath = path.join(__dirname, 'db', `${dbName}.json`); // Construct file path
    if (fs.existsSync(dbPath)) {
      throw new Error(`Database '${dbName}' already exists.`);
    }
    try {
      fs.writeFileSync(dbPath, '{}'); // Create an empty JSON file
    } catch (error) {
      console.error(`Error creating database file: ${error.message}`);
      throw error; // Re-throw the error for handling
    }
  }

}

module.exports = JsonDB;
