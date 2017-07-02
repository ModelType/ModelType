/**
 * Created by omar on 7/1/17.
 */
/// <reference path="../typings/index.d.ts" />
import * as fs from "fs";
import * as ModelType from "../index";

var parserJava = ModelType.Parser.loadFile("testModel.yml", ModelType.Parsers.Java);

fs.writeFileSync("output.java", parserJava.compile());

var parserMTS = ModelType.Parser.loadFile("testModel.yml", ModelType.Parsers.MongooseTS);

fs.writeFileSync("output.ts", parserMTS.compile());