"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by Omar on 4/26/2017.
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
var GenEngine = require("./GenEngine");
var TSEngine = require("./TSEngine");
var MongooseEngine = require("./MongooseEngine");
var ParseEngine = require("./Parser");
exports.Engine = new GenEngine.GenEngine();
var Parser = (function (_super) {
    __extends(Parser, _super);
    function Parser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Parser.prototype.compile = function () {
        var out = "";
        out += this.generateETAG();
        out += "import * as mongoose from \"mongoose\";\n";
        if (this.data.Heads) {
            if (this.data.Heads.MongooseTS)
                out += this.data.Heads.MongooseTS;
        }
        if (this.data.CustomTypes) {
            for (var typeName in this.data.CustomTypes) {
                var type = this.data.CustomTypes[typeName];
                var iout = "export type I" + typeName + " = ";
                var oout = "export var " + typeName + "= {";
                var iStrs = [];
                var oStrs = [];
                for (var _i = 0, type_1 = type; _i < type_1.length; _i++) {
                    var i = type_1[_i];
                    if (typeof i == "string") {
                        iStrs.push("\"" + i + "\"");
                        oStrs.push("\"" + i + "\":(\"" + i + "\" as I" + typeName + ")");
                    }
                    if (typeof i == "object") {
                        var tO = [];
                        for (var _a = 0, _b = i.Keys; _a < _b.length; _a++) {
                            var t = _b[_a];
                            iStrs.push("\"" + i.Name + "." + t + "\"");
                            tO.push("\"" + t + "\":\"" + t + "\"");
                        }
                        oStrs.push(" \"" + i.Name + "\" : {" + tO.join(",") + "}");
                    }
                }
                iout += iStrs.join("|") + ";\n";
                oout += oStrs.join(",") + "}\n";
                out += iout + oout;
            }
        }
        for (var modelName in this.data.Models) {
            var model = this.data.Models[modelName];
            out += exports.Engine.process(modelName, model);
        }
        return out;
    };
    return Parser;
}(ParseEngine.Parser));
exports.Parser = Parser;
var DataInterface = (function (_super) {
    __extends(DataInterface, _super);
    function DataInterface() {
        var _this = _super.call(this) || this;
        _this.types = new GenEngine.TypeDeterminer.Determiner();
        _this.types.declareType(TSEngine.BaseTypes());
        _this.types.declareType(TSEngine.ArrayType());
        _this.types.declareType(TSEngine.FunctionType());
        _this.types.declareType(TSEngine.ObjectType());
        _this.types.declareType(TSEngine.ExpandedBaseType());
        _this.types.declareType(TSEngine.CustomType());
        _this.types.declareType(TSEngine.ReferenceType());
        return _this;
    }
    DataInterface.prototype.process = function (name, data) {
        var out = "export namespace _Data { export interface " + name + " {";
        var innerLines = [];
        for (var d in data.Schema) {
            var i = data.Schema[d];
            innerLines.push(this.types.determineType(i, d));
        }
        out += innerLines.join(",");
        out += "}}";
        return out;
    };
    return DataInterface;
}(GenEngine.Engine));
var idata = new DataInterface();
exports.Engine.registerEngine(idata);
var ModelInterface = (function (_super) {
    __extends(ModelInterface, _super);
    function ModelInterface() {
        var _this = _super.call(this) || this;
        _this.types = new GenEngine.TypeDeterminer.Determiner();
        _this.types.declareType(TSEngine.BaseTypes());
        _this.types.declareType(TSEngine.ArrayType());
        _this.types.declareType(TSEngine.FunctionType());
        _this.types.declareType(TSEngine.ObjectType());
        _this.types.declareType(TSEngine.ExpandedBaseType());
        _this.types.declareType(TSEngine.CustomType());
        _this.types.declareType(TSEngine.ReferenceType());
        return _this;
    }
    ModelInterface.prototype.process = function (name, data) {
        var out = "export namespace _Model { export interface " + name + " extends _Data." + name + ", mongoose.Document {";
        var innerLines = [];
        for (var d in data.Methods) {
            var i = data.Methods[d];
            if (typeof i.Static != "undefined") {
                if (i.Static)
                    continue;
            }
            i.Function = true;
            innerLines.push(this.types.determineType(i, d));
        }
        out += innerLines.join(",");
        out += "}}";
        return out;
    };
    return ModelInterface;
}(GenEngine.Engine));
var imodel = new ModelInterface();
exports.Engine.registerEngine(imodel);
var mschema = new MongooseEngine.MongooseSchema();
exports.Engine.registerEngine(mschema);
var SchemaStatic = (function (_super) {
    __extends(SchemaStatic, _super);
    function SchemaStatic() {
        var _this = _super.call(this) || this;
        _this.types = new GenEngine.TypeDeterminer.Determiner();
        _this.types.declareType(TSEngine.BaseTypes());
        _this.types.declareType(TSEngine.ArrayType());
        _this.types.declareType(TSEngine.FunctionType());
        _this.types.declareType(TSEngine.ObjectType());
        _this.types.declareType(TSEngine.ExpandedBaseType());
        _this.types.declareType(TSEngine.CustomType());
        return _this;
    }
    SchemaStatic.prototype.process = function (name, data) {
        var out = "export namespace _Static { export interface " + name + " { Static?:{";
        var innerLines = [];
        for (var d in data.Methods) {
            var i = data.Methods[d];
            if (typeof i.Static == "undefined") {
                continue;
            }
            else {
                if (!i.Static)
                    continue;
            }
            i.Function = true;
            innerLines.push(this.types.determineType(i, d));
        }
        out += innerLines.join(",");
        out += "}}}";
        return out;
    };
    return SchemaStatic;
}(GenEngine.Engine));
var MongooseObject = (function (_super) {
    __extends(MongooseObject, _super);
    function MongooseObject() {
        var _this = _super.call(this) || this;
        _this.types = new GenEngine.TypeDeterminer.Determiner();
        _this.types.declareType(TSEngine.BaseTypes());
        _this.types.declareType(TSEngine.ArrayType());
        _this.types.declareType(TSEngine.FunctionType());
        _this.types.declareType(TSEngine.ObjectType());
        _this.types.declareType(TSEngine.ExpandedBaseType());
        _this.types.declareType(TSEngine.CustomType());
        return _this;
    }
    MongooseObject.prototype.process = function (name, data) {
        var out = "export const " + name + " : mongoose.Model<_Model." + name + "> & _Static." + name + " = mongoose.model<_Model." + name + ">(\"" + name + "\", " + name + "Schema);";
        return out;
    };
    return MongooseObject;
}(GenEngine.Engine));
var schemaS = new SchemaStatic();
exports.Engine.registerEngine(schemaS);
var schemaF = new MongooseEngine.SchemaFunction();
exports.Engine.registerEngine(schemaF);
var mo = new MongooseObject();
exports.Engine.registerEngine(mo);
var mstaticfunc = new MongooseEngine.StaticFunctions();
exports.Engine.registerEngine(mstaticfunc);
