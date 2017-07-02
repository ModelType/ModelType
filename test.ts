/**
 * Created by omar on 7/1/17.
 */
/// <reference path="typings/index.d.ts" />
import * as fs from "fs";
import * as ModelType from "./index";

var parser = ModelType.Parser.loadFile("testModel.yml", ModelType.Parsers.MongooseTS);

fs.writeFileSync("output.ts", parser.compile());
