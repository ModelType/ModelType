"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by omar on 7/1/17.
 */
/// <reference path="../typings/index.d.ts" />
var fs = require("fs");
var ModelType = require("../index");
var parserJava = ModelType.Parser.loadFile("testModel.yml", ModelType.Parsers.Java);
fs.writeFileSync("output.java", parserJava.compile());
var parserMTS = ModelType.Parser.loadFile("testModel.yml", ModelType.Parsers.MongooseTS);
fs.writeFileSync("output.ts", parserMTS.compile());
