var {
  db
} = require("./db.js");

module.exports = {
  checkForProfile(user) {
    db.run("INSERT OR IGNORE INTO currency (user) VALUES(?)", [user.id], (err) => {
      if (err) console.log("Error trying to add currency profile for user: " + err);
    });
  },

  interest() {
    // adding bank*0.00286 every day for 7 days adds up to a 2% interest rate per week
    db.run("UPDATE currency SET bank = bank + bank*0.00286", [], (err) => {
      if (err) console.log("Error trying to add interest to bank: " + err);
    });
  }
}
