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
 * Created by omar on 7/1/17.
 */
var Engine = require("./GenEngine");
var MainClass;
(function (MainClass) {
    function BaseTypes() {
        var bs = new CJavaBS();
        bs.suppressName = true;
        bs.pushPair("string", "String").pushPair("number", "Double").pushPair("boolean", "Boolean").pushPair("date", "Date").pushPair("void", "void").pushPair("ObjectId", "ObjectId");
        return bs;
    }
    MainClass.BaseTypes = BaseTypes;
    var CJavaBS = (function (_super) {
        __extends(CJavaBS, _super);
        function CJavaBS() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CJavaBS.prototype.Parse = function (data, name) {
            for (var _i = 0, _a = this.map; _i < _a.length; _i++) {
                var map = _a[_i];
                if (map.Source == data) {
                    var getter = "public " + map.Target + " get" + name + "() { return (" + map.Target + ") this.doc.get(\"" + name + "\"); }\n                    ";
                    var setter = "public void set" + name + "(" + map.Target + " obj) { \n                        this.doc.put(\"" + name + "\", (Object) obj);\n                        this.keyUpdated(\"" + name + "\", (Object) obj);\n                    }\n                    ";
                    return getter + setter;
                }
            }
        };
        return CJavaBS;
    }(Engine.TypeDeterminer.BatchStringTypeDefinition));
    function ArrayType() {
        var i = new CArrayType();
        return i;
    }
    MainClass.ArrayType = ArrayType;
    function ObjectType() {
        var i = new CObjectType();
        return i;
    }
    MainClass.ObjectType = ObjectType;
    function FunctionType() {
        var i = new CFunctionType();
        return i;
    }
    MainClass.FunctionType = FunctionType;
    function CustomType() {
        var i = new CCustomType();
        return i;
    }
    MainClass.CustomType = CustomType;
    function ExpandedBaseType() {
        var i = new CExpandedBasicObject();
        return i;
    }
    MainClass.ExpandedBaseType = ExpandedBaseType;
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
            var type = data.JavaType || "Object";
            var getter = "\n                public " + type + " get" + name + "() { return (" + type + ") this.doc.get(\"" + name + "\"); }\n            ";
            var setter = "\n                public void set" + name + "(" + type + " obj) {\n                    this.doc.put(\"" + name + "\", (Object) obj); \n                    this.keyUpdated(\"" + name + "\", (Object) obj);\n                }\n            ";
            return getter + setter;
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
            var getter = "\n                public Document[] get" + name + "() { return (Document[]) this.doc.get(\"" + name + "\"); }\n            ";
            return getter;
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
            var getter = "\n                public SubDoc_" + name + " get" + name + "() { \n                    if(this.Instance_SubDoc_" + name + " == null) {\n                        this.Instance_SubDoc_" + name + " = new SubDoc_" + name + "(this, \"" + name + "\", (Document) this.doc.get(\"" + name + "\")); \n                    } \n                    return this.Instance_SubDoc_" + name + ";\n                }\n            ";
            var setter = "\n                public void set" + name + "(SubDoc_" + name + " obj) { }\n            ";
            var subDoc = [];
            for (var d in data) {
                subDoc.push(this.types.determineType(data[d], d));
            }
            var sd = subDoc.join("");
            var clas = "\n                public class SubDoc_" + name + " extends SubDoc{ \n                    SubDoc_" + name + "(ModelType_JavaClass parent, String name, Document doc) {\n                        super(parent, name, doc);\n                    }\n                    SubDoc_" + name + "(SubDoc parent, String name, Document doc) {\n                        super(parent, name, doc);\n                    }\n                   " + sd + "\n                }\n                protected SubDoc_" + name + " Instance_SubDoc_" + name + ";\n            ";
            return getter + setter + clas;
            //return this.nn(name, name + ":") + out;
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
            return this.types.determineType(data.Type, name);
        };
        return CExpandedBasicObject;
    }(Engine.TypeDeterminer.TypeDefinition));
    MainClass.CExpandedBasicObject = CExpandedBasicObject;
})(MainClass = exports.MainClass || (exports.MainClass = {}));
var MainClassMethods;
(function (MainClassMethods) {
    function BaseTypes() {
        var bs = new CJavaBS();
        bs.suppressName = true;
        bs.pushPair("string", "String").pushPair("number", "double").pushPair("boolean", "boolean").pushPair("date", "Date").pushPair("void", "void").pushPair("ObjectId", "ObjectId");
        return bs;
    }
    MainClassMethods.BaseTypes = BaseTypes;
    var CJavaBS = (function (_super) {
        __extends(CJavaBS, _super);
        function CJavaBS() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CJavaBS.prototype.Parse = function (data, name) {
            for (var _i = 0, _a = this.map; _i < _a.length; _i++) {
                var map = _a[_i];
                if (map.Source == data)
                    return "(" + map.Target + ") this.doc.get(\"" + name + "\")";
            }
        };
        return CJavaBS;
    }(Engine.TypeDeterminer.BatchStringTypeDefinition));
    function ArrayType() {
        var i = new CArrayType();
        return i;
    }
    MainClassMethods.ArrayType = ArrayType;
    function ObjectType() {
        var i = new CObjectType();
        return i;
    }
    MainClassMethods.ObjectType = ObjectType;
    function FunctionType() {
        var i = new CFunctionType();
        return i;
    }
    MainClassMethods.FunctionType = FunctionType;
    function CustomType() {
        var i = new CCustomType();
        return i;
    }
    MainClassMethods.CustomType = CustomType;
    function ExpandedBaseType() {
        var i = new CExpandedBasicObject();
        return i;
    }
    MainClassMethods.ExpandedBaseType = ExpandedBaseType;
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
            return "(" + (data.JavaType || "Object") + ") this.doc.get(\"" + name + "\")";
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
            return this.types.determineType(data[0], name) + "[]";
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
            return "new SubDoc_" + name + "(this, (Document) this.doc.get(\"" + name + "\"))";
            //return this.nn(name, name + ":") + out;
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
            return this.types.determineType(data.Type, name);
        };
        return CExpandedBasicObject;
    }(Engine.TypeDeterminer.TypeDefinition));
    MainClassMethods.CExpandedBasicObject = CExpandedBasicObject;
})(MainClassMethods = exports.MainClassMethods || (exports.MainClassMethods = {}));
