const fs = require('fs')

module.exports = {
    random() {
        return new Promise((resolve, reject) => {
            fs.readFile("names.txt", "utf8", (err, data) => {
                if (err) {
                    return console.log(err);
                }
                let names = data.split("\n").map((x) => x.trim());
                resolve(names[Math.floor(Math.random() * names.length)]);

            })
        });
    }
}



