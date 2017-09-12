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
var Engine = require("./GenEngine");
function BaseTypes() {
    var bs = new Engine.TypeDeterminer.BatchStringTypeDefinition();
    bs.pushPair("string", "string").pushPair("number", "number").pushPair("boolean", "boolean").pushPair("date", "Date").pushPair("void", "void").pushPair("ObjectId", "mongoose.Types.ObjectId");
    return bs;
}
exports.BaseTypes = BaseTypes;
function ReferenceType() {
    var i = new CReferenceType();
    return i;
}
exports.ReferenceType = ReferenceType;
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
            return data.TSType;
        var ret = "";
        ret += name;
        if (typeof data.Required != "undefined") {
            if (!data.Required)
                ret += "?";
        }
        ret += ":";
        ret += data.TSType;
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
        var out = "Array<";
        var innerTypes = [];
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var d = data_1[_i];
            console.log(d);
            innerTypes.push(this.types.determineType(d));
        }
        out += innerTypes.join(",");
        out += ">";
        return this.nn(name, name + ":") + out;
    };
    return CArrayType;
}(Engine.TypeDeterminer.TypeDefinition));
var CReferenceType = (function (_super) {
    __extends(CReferenceType, _super);
    function CReferenceType() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.weight = 1000;
        return _this;
    }
    CReferenceType.prototype.Validator = function (data) {
        if (typeof data == "object" && !Array.isArray(data)) {
            if (typeof data["___Reference"] != "undefined") {
                return true;
            }
        }
        return false;
    };
    CReferenceType.prototype.Parse = function (data, name) {
        var out = "mongoose.Types.ObjectId | _Model." + data.___Reference;
        return this.nn(name, name + ":") + out;
    };
    return CReferenceType;
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
            if (typeof sig.Required != "undefined") {
                if (!sig.Required)
                    m += "?";
            }
            m += (":");
            m += (this.types.determineType(sig.Type));
            lines.push(m);
        }
        var retType;
        if (typeof data.Return != undefined)
            retType = this.types.determineType(data.Return);
        else
            retType = "void";
        return this.nn(name, name + ":") + "(" + lines.join(",") + ")=>" + retType;
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
            if (!data.Required)
                ret += "?";
        }
        ret += ":";
        ret += this.types.determineType(data.Type);
        return ret;
    };
    return CExpandedBasicObject;
}(Engine.TypeDeterminer.TypeDefinition));
exports.CExpandedBasicObject = CExpandedBasicObject;
