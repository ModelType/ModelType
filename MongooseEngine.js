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
 * Created by Omar on 5/1/2017.
 */
/**
 * Created by Omar on 4/26/2017.
 */
var Engine = require("./GenEngine");
function BaseTypes() {
    var bs = new Engine.TypeDeterminer.BatchStringTypeDefinition();
    bs.pushPair("string", "String").pushPair("number", "Number").pushPair("boolean", "Boolean").pushPair("date", "Date").pushPair("void", "Void").pushPair("ObjectId", "mongoose.Schema.Types.ObjectId");
    return bs;
}
exports.BaseTypes = BaseTypes;
function ArrayType() {
    var i = new CArrayType();
    return i;
}
exports.ArrayType = ArrayType;
function ObjectType() {
    var i = new CObjectType();
    return i;
}
exports.ObjectType = ObjectType;
function FunctionType() {
    var i = new CFunctionType();
    return i;
}
exports.FunctionType = FunctionType;
function CustomType() {
    var i = new CCustomType();
    return i;
}
exports.CustomType = CustomType;
function ExpandedBaseType() {
    var i = new CExpandedBasicObject();
    return i;
}
exports.ExpandedBaseType = ExpandedBaseType;
var CCustomType = (function (_super) {
    __extends(CCustomType, _super);
    function CCustomType() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.weight = 9990;
        return _this;
    }
    CCustomType.prototype.Validator = function (data) {
        if (typeof data == "object" && !Array.isArray(data)) {
            if (typeof data["_Custom"] != "undefined") {
                return true;
            }
        }
        return false;
    };
    CCustomType.prototype.Parse = function (data, name) {
        if (!name)
            return data.MongooseType;
        var ret = "";
        ret += name;
        if (typeof data.Required != "undefined") {
            if (!data.Required)
                ret += "?";
        }
        ret += ":";
        ret += data.MongooseType;
        return ret;
    };
    return CCustomType;
}(Engine.TypeDeterminer.TypeDefinition));
var CArrayType = (function (_super) {
    __extends(CArrayType, _super);
    function CArrayType() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.weight = 9999;
        return _this;
    }
    CArrayType.prototype.Validator = function (data) {
        return Array.isArray(data);
    };
    CArrayType.prototype.Parse = function (data, name) {
        var out = "[";
        var innerTypes = [];
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var d = data_1[_i];
            innerTypes.push(this.types.determineType(d));
        }
        out += innerTypes.join(",");
        out += "]";
        return this.nn(name, name + ":") + out;
    };
    return CArrayType;
}(Engine.TypeDeterminer.TypeDefinition));
var CObjectType = (function (_super) {
    __extends(CObjectType, _super);
    function CObjectType() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.weight = 10000;
        return _this;
    }
    CObjectType.prototype.Validator = function (data) {
        if (typeof data == "object" && !Array.isArray(data)) {
            return true;
        }
        return false;
    };
    CObjectType.prototype.Parse = function (data, name) {
        var out = "{";
        var innerTypes = [];
        for (var d in data) {
            innerTypes.push(this.types.determineType(data[d], d));
        }
        out += innerTypes.join(",");
        out += "}";
        return this.nn(name, name + ":") + out;
    };
    return CObjectType;
}(Engine.TypeDeterminer.TypeDefinition));
var CFunctionType = (function (_super) {
    __extends(CFunctionType, _super);
    function CFunctionType() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.weight = 9998;
        return _this;
    }
    CFunctionType.prototype.Validator = function (data) {
        if (typeof data == "object") {
            if (data.Function)
                return true;
            else
                return false;
        }
    };
    CFunctionType.prototype.Parse = function (data, name) {
        var lines = [];
        for (var _i = 0, _a = data.Signature; _i < _a.length; _i++) {
            var sig = _a[_i];
            var m = "";
            m += (sig.Name);
            lines.push(m);
        }
        var retType;
        return this.nn(name, name + ":") + "function (" + lines.join(",") + ") {" + data.Body + "}";
    };
    return CFunctionType;
}(Engine.TypeDeterminer.TypeDefinition));
var CExpandedBasicObject = (function (_super) {
    __extends(CExpandedBasicObject, _super);
    function CExpandedBasicObject() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.weight = 9995;
        return _this;
    }
    CExpandedBasicObject.prototype.Validator = function (data) {
        if (typeof data == "object" && !Array.isArray(data)) {
            if (typeof data.Type != "undefined") {
                return true;
            }
            else
                return false;
        }
    };
    CExpandedBasicObject.prototype.Parse = function (data, name) {
        if (!name)
            return this.types.determineType(data.Type);
        var ret = "";
        ret += name;
        if (typeof data.Required != "undefined") {
            // TODO proper required check
            //if(!data.Required) ret+="?";
        }
        ret += ":";
        ret += this.types.determineType(data.Type);
        return ret;
    };
    return CExpandedBasicObject;
}(Engine.TypeDeterminer.TypeDefinition));
exports.CExpandedBasicObject = CExpandedBasicObject;
var MongooseSchema = (function (_super) {
    __extends(MongooseSchema, _super);
    function MongooseSchema() {
        var _this = _super.call(this) || this;
        _this.types = new Engine.TypeDeterminer.Determiner();
        _this.types.declareType(BaseTypes());
        _this.types.declareType(ArrayType());
        _this.types.declareType(FunctionType());
        _this.types.declareType(ObjectType());
        _this.types.declareType(ExpandedBaseType());
        _this.types.declareType(CustomType());
        return _this;
    }
    MongooseSchema.prototype.process = function (name, data) {
        var out = "var " + name + "Schema = new mongoose.Schema({";
        var innerLines = [];
        for (var d in data.Schema) {
            var i = data.Schema[d];
            innerLines.push(this.types.determineType(i, d));
        }
        out += innerLines.join(",");
        out += "});";
        return out;
    };
    return MongooseSchema;
}(Engine.Engine));
exports.MongooseSchema = MongooseSchema;
var StaticFunctions = (function (_super) {
    __extends(StaticFunctions, _super);
    function StaticFunctions() {
        var _this = _super.call(this) || this;
        _this.types = new Engine.TypeDeterminer.Determiner();
        _this.types.declareType(BaseTypes());
        _this.types.declareType(ArrayType());
        _this.types.declareType(FunctionType());
        _this.types.declareType(ObjectType());
        _this.types.declareType(ExpandedBaseType());
        _this.types.declareType(CustomType());
        return _this;
    }
    StaticFunctions.prototype.process = function (name, data) {
        var out = name + ".Static = {";
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
        out += "}";
        return out;
    };
    return StaticFunctions;
}(Engine.Engine));
exports.StaticFunctions = StaticFunctions;
var SchemaFunction = (function (_super) {
    __extends(SchemaFunction, _super);
    function SchemaFunction() {
        var _this = _super.call(this) || this;
        _this.types = new Engine.TypeDeterminer.Determiner();
        _this.types.declareType(BaseTypes());
        _this.types.declareType(ArrayType());
        _this.types.declareType(FunctionType());
        _this.types.declareType(ObjectType());
        _this.types.declareType(ExpandedBaseType());
        _this.types.declareType(CustomType());
        return _this;
    }
    SchemaFunction.prototype.process = function (name, data) {
        var out = "";
        var innerLines = [];
        for (var d in data.Methods) {
            var i = data.Methods[d];
            if (typeof i.Static != "undefined") {
                continue;
            }
            else {
                if (i.Static)
                    continue;
            }
            i.Function = true;
            innerLines.push(d + "=" + this.types.determineType(i));
        }
        out = innerLines.map(function (line) {
            return name + "Schema.methods." + line;
        }).join("\n");
        return out;
    };
    return SchemaFunction;
}(Engine.Engine));
exports.SchemaFunction = SchemaFunction;
