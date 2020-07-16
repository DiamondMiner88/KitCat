var {
  db
} = require("./db.js");

module.exports = {
  checkForProfile(user) {
    db.run("INSERT OR IGNORE INTO currency (user) VALUES(?)", [user.id], (err) => {
      if (err) console.log("Error trying to add currency profile for user: " + err);
    });
  }
}
