/**
 * Created by vlads on 06.09.2018.
 */

const url = process.argv[2];
const fs = require("fs");
const path = require('path');

const scriptString = `function filewalker(dir, done) {
const fs = require("fs");
const path = require('path');
let results = [];

fs.readdir(dir, function(err, list) {
    if (err) return done(err);

    var pending = list.length;

    if (!pending) return done(null, results);

    list.forEach(function(file){
        file = path.resolve(dir, file);

        fs.stat(file, function(err, stat){
            if (stat && stat.isDirectory()) {
                results.push(path.relative("${url}", file));

                filewalker(file, function(err, res){
                    results = results.concat(res);
                    if (!--pending) done(null, results);
                });
            } else {
                results.push(path.relative("${url}", file));
                if (!--pending) done(null, results);
            }
        });
    });
});
};

filewalker("${url}", function(err, data){
    if(err){
        throw err;
    }

    console.log(data);
});`;

fs.writeFile(url + "/summary.js", scriptString, function(error){
 if(error) throw error;
});




