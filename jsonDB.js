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
      if (!fs.existsSync(filename)) {
        if (fs.existsSync(filename)) {
          throw new Error(`Database '${filename}' already exists.`);
        }
        try {
          fs.writeFileSync(filename, '{}'); // Create an empty JSON file
          return filename
        } catch (error) {
          console.error(`Error creating database file: ${error.message}`);
          throw error; // Re-throw the error for handling
        }
      }
      console.error(`Error reading database file: ${error.message}`);
      this.data = {};
    }
  }

  get(tableName, ...query) {
    if (!this.data.hasOwnProperty(tableName)) {
      return []; // Return empty array if table doesn't exist
    }
  
    if (query[0] === "*") {
      return this.data[tableName]; // Return all entries if query is "*"
    }
  
    // Combine query objects using spread operator
    const combinedQuery = Object.assign({}, ...query);
  
    // Filter entries based on combined query
    return this.data[tableName].filter((entry) => {
      return Object.keys(combinedQuery).every((key) => entry[key] === combinedQuery[key]);
    });
  }

  getAllTables() {
    return Object.keys(this.data);
  }

  set(key, value) {
    this.data[key] = value;
    this.#saveData();
  }

  update(tableName, what, ...query) {
    if (!this.data.hasOwnProperty(tableName)) {
      return "Table doesn't exist";
    }
  
    const combinedQuery = Object.assign({}, ...query);
    const keysToUpdate = Object.keys(combinedQuery);
  
    let updatedCount = 0;
  
    this.data[tableName].forEach((entry) => {
      if (keysToUpdate.every((key) => entry[key] === combinedQuery[key])) {
        Object.assign(entry, what);
        updatedCount++;
      }
    });
  
    this.#saveData(); // Assuming this saves the modified data
    return `${updatedCount} Updated`;
  }

  
  delete(tableName, ...query) {
    if (!this.data.hasOwnProperty(tableName)) {
      return "Table doesn't exist";
    }
  
    const combinedQuery = Object.assign({}, ...query);
    const keysToDelete = Object.keys(combinedQuery);
    const originalLength = this.data[tableName].length;
  
    // Filter for entries matching both conditions
    this.data[tableName] = this.data[tableName].filter(
      (entry) => !keysToDelete.every((key) => entry[key] === combinedQuery[key])
    );
    
    const deletedCount = originalLength - this.data[tableName].length;


    this.#saveData(); // Assuming this saves the modified data
    return `${deletedCount} Deleted`
  }
  

  deleteTable(key) {
    if (this.data.hasOwnProperty(key)) {
      delete this.data[key];
      this.#saveData();
      return "ok"
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
