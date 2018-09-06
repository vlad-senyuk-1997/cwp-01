/**
 * Created by vlads on 06.09.2018.
 */

const url = process.argv[2];

if (url == undefined){
    return;
}

const fs = require("fs");
const path = require('path');

fs.exists(url, function (err) {
    if (err){
        return;
    }
});

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

// 01

fs.writeFile(url + "/summary.js", scriptString, function(error){
 if(error) throw error;
});

// 02
var copyright = require("./config.json");
var newFolderPath = url + "/" + url.split("/").pop();

function makeDir(path){
    fs.mkdir(path, function(error){
        if(error) throw error;
    });
}

function fillTxtList(nPath, fn){
    fs.readdir(nPath, function(err, fileNames){
        if (err)
            return done(err);

        var list = [];

        for(let i = 0; i < fileNames.length; i++) {
            let fileName = fileNames[i];

            if(path.extname(fileName) === ".txt") {
                list.push(nPath + "/" + fileName);
            }
        }

        fn(list);
    });
}

function addCopyright(str, fUrl) {
    fs.readFile(fUrl, 'utf8', function(err, contents) {
        if (err) {
            return console.log(err);
        }

        let text = str + contents + str;

        fs.writeFile(fUrl, text, function(err) {
            if(err) {
                return console.log(err);
            }

            console.log("The file was saved!");
        });
    });
}

fs.exists(newFolderPath, function (error){
    if (error){
        throw error;
    }

    makeDir(newFolderPath);
});



fillTxtList(url, function (list) {
    var files = list;

    files.forEach(function (item) {
        fs.copyFile(item, newFolderPath + "/" + item.split("/").pop(), function(error){
            if (error)
                console.log(error);

            addCopyright(copyright["copyright"], newFolderPath + "/" + item.split("/").pop());

            fs.watchFile(newFolderPath + "/" + item.split("/").pop(), function(curr, prev){
                console.log(newFolderPath + "/" + item.split("/").pop() + " is EDIT!");
            });
        });
    });
});






