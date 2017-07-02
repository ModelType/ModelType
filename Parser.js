"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by omar on 7/2/17.
 * Copyright (C) 2017  Omar Zouai <omar@omarzouai.com>

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as published
 by the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
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
