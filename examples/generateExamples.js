"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by omar on 7/1/17.
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
/// <reference path="../typings/index.d.ts" />
var fs = require("fs");
var ModelType = require("../index");
var parserJava = ModelType.Parser.loadFile("testModel.yml", ModelType.Parsers.Java);
fs.writeFileSync("output.java", parserJava.compile());
var parserMTS = ModelType.Parser.loadFile("testModel.yml", ModelType.Parsers.MongooseTS);
fs.writeFileSync("output.ts", parserMTS.compile());
