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
var JavaEngine = require("./JavaEngine");
var ParseEngine = require("./Parser");
var Parser = (function (_super) {
    __extends(Parser, _super);
    function Parser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Parser.prototype.compile = function () {
        var out = "";
        out += this.generateETAG();
        if (this.data.Heads) {
            if (this.data.Heads.Java)
                out += this.data.Heads.Java;
        }
        out += exports.Head;
        for (var modelName in this.data.Models) {
            var model = this.data.Models[modelName];
            out += exports.Engine.process(modelName, model);
        }
        out += exports.Tail;
        return out;
    };
    return Parser;
}(ParseEngine.Parser));
exports.Parser = Parser;
exports.Engine = new GenEngine.GenEngine();
exports.Head = "\n    import org.bson.types.ObjectId;\n    import org.bson.Document;\n    import java.util.Date;\n    import com.mongodb.BasicDBObject;\n    public class Models {\n    private static Models Models_Singleton;\n    abstract class ModelType_JavaClass { \n        protected Document doc;\n        protected BasicDBObject update;\n        protected void keyUpdated(String key, Object val) { \n            this.update.append(key, val); \n        }\n        public ModelType_JavaClass(Document doc) {\n            this.doc = doc;\n            this.update = new BasicDBObject();\n        }\n     }\n     abstract class SubDoc {\n        protected ModelType_JavaClass parentDoc;\n        protected SubDoc parentSubDoc;\n        protected Document doc;\n        protected String name;\n        public SubDoc(ModelType_JavaClass parent, String name, Document doc) {\n            this.doc = doc;\n            this.parentDoc = parent;\n            this.name = name;\n        }\n        public SubDoc(SubDoc parent, String name, Document doc) {\n            this.doc = doc;\n            this.parentSubDoc = parent;\n            this.name = name;\n        }\n        protected void keyUpdated(String key, Object val) {\n            if(this.parentDoc != null) {\n                this.parentDoc.keyUpdated(name + \".\" + key, val);\n            }\n            if(this.parentSubDoc != null) {\n                this.parentSubDoc.keyUpdated(name +\".\"+key, val);\n            }\n        }\n        \n     }";
exports.Tail = "}";
var MainClass = (function (_super) {
    __extends(MainClass, _super);
    function MainClass() {
        var _this = _super.call(this) || this;
        _this.types = new GenEngine.TypeDeterminer.Determiner();
        _this.types.declareType(JavaEngine.MainClass.BaseTypes());
        _this.types.declareType(JavaEngine.MainClass.ArrayType());
        _this.types.declareType(JavaEngine.MainClass.FunctionType());
        _this.types.declareType(JavaEngine.MainClass.ObjectType());
        _this.types.declareType(JavaEngine.MainClass.ExpandedBaseType());
        _this.types.declareType(JavaEngine.MainClass.CustomType());
        _this.methodTypes = new GenEngine.TypeDeterminer.Determiner();
        _this.methodTypes.declareType(JavaEngine.MainClassMethods.CustomType());
        _this.methodTypes.declareType(JavaEngine.MainClassMethods.ArrayType());
        _this.methodTypes.declareType(JavaEngine.MainClassMethods.FunctionType());
        _this.methodTypes.declareType(JavaEngine.MainClassMethods.ObjectType());
        _this.methodTypes.declareType(JavaEngine.MainClassMethods.ExpandedBaseType());
        _this.methodTypes.declareType(JavaEngine.MainClassMethods.BaseTypes());
        return _this;
    }
    MainClass.prototype.process = function (name, data) {
        var out = "public class " + name + " extends ModelType_JavaClass {\n        public " + name + "(Document mongodbDocument) { \n            super(mongodbDocument);\n        }\n        public BasicDBObject update() {\n            return new BasicDBObject().append(\"$set\", this.update);\n        }\n        ";
        var innerLines = [];
        for (var d in data.Schema) {
            var i = data.Schema[d];
            var type = this.types.determineType(i, d);
            var ret = this.methodTypes.determineType(i, d);
            innerLines.push(type);
        }
        out += innerLines.join("");
        out += "\n        }\n        public static " + name + " cast" + name + "(Document doc) {\n            if(Models_Singleton == null) Models_Singleton = new Models();\n            return Models_Singleton.new " + name + "(doc);\n        }\n        ";
        return out;
    };
    return MainClass;
}(GenEngine.Engine));
exports.Engine.registerEngine(new MainClass());
