const sqlite3 = require('sqlite3');
const dbpath =  __dirname+"\\member.db";

const memdb = new sqlite3.Database(dbpath, (err) => {
           if (err) {
        console.error("Erro opening database " + err.message);
    } else {
      
        memdb.run('CREATE TABLE member( \
            `mid` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,\
            `name`  TEXT NOT NULL,\
            `lastname`  TEXT,\
            `username`  TEXT,\
            `phone` INTEGER,\
            `password`  TEXT,\
            `serverid` INTEGER\
        )', (err) => {
            if (err) {
            }
            //console.log("member.db Table Created....");
            //let insert = 'INSERT INTO member (`name`, `lastname`, `username`, `phone`, `password`, `serverid`) VALUES (?,?,?,?,?,?)';
            //memdb.run(insert, ["demouser", "demouser", "demouser", "1234567890", "demouser", 1]);
        });
      }
    });

module.exports = memdb;