const mongoose = require("mongoose");

if (process.argv.length < 3) {
    console.log("give password;");
    process.exit(1);
}

const password = process.argv[2];

const url = ``