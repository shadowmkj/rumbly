"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFromFile = void 0;
var fs_1 = require("fs");
var path_1 = require("path");
var filePath = path_1.default.join(__dirname, 'main.asm');
console.log(filePath);
var readFromFile = function () {
    var mainAsmContent = "";
    fs_1.default.readFile(filePath, 'utf8', function (err, data) {
        if (err) {
            console.error('Error reading the file:', err);
            return;
        }
        mainAsmContent = data;
    });
    return mainAsmContent;
};
exports.readFromFile = readFromFile;
