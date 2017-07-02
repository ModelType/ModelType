"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by omar on 7/2/17.
 */
var fs = require("fs");
var yaml = require("yamljs");
var crypto = require("crypto");
function loadFile(fileName, parser) {
    var data = fs.readFileSync(fileName, "utf-8");
    if (parser) {
        return new parser({
            YAML: true,
            Data: data
        });
    }
}
exports.loadFile = loadFile;
var Parser = (function () {
    function Parser(options) {
        if (!options)
            throw new Error("No Options");
        if (options.YAML) {
            this.data = yaml.parse(options.Data);
        }
        else {
            this.data = JSON.parse(options.Data);
        }
        this.options = options;
    }
    Parser.prototype.generateETAG = function () {
        var out = "";
        out += "//#GeneratedOn:" + (new Date()).toISOString() + "\n";
        out += "//#ETAG:" + (crypto.createHash("md5").update(this.options.Data).digest("hex")) + "\n";
        return out;
    };
    return Parser;
}());
exports.Parser = Parser;
