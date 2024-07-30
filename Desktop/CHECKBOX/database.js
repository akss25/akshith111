const database = require('./app/db');

const fetchCheckboxStates = () => {
  return new Promise((resolve, reject) => {
    database.get('SELECT state FROM checkbox_states WHERE id = 1', (error, result) => {
      if (error) {
        reject(error);
      } else if (result) {
        resolve(JSON.parse(result.state));
      } else {
        resolve(new Array(100).fill(false)); 
      }
    });
  });
};

const storeCheckboxStates = (states) => {
  return new Promise((resolve, reject) => {
    const serializedState = JSON.stringify(states);
    database.run(
      'INSERT OR REPLACE INTO checkbox_states (id, state) VALUES (1, ?)',
      [serializedState],
      (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      }
    );
  });
};

module.exports = {
  fetchCheckboxStates,
  storeCheckboxStates,
};
