/**
 * Created by omar on 7/1/17.
 */
import * as Engine from "./GenEngine";
export namespace MainClass {
    export function BaseTypes() {
        var bs = new CJavaBS();
        bs.suppressName = true;
        bs.pushPair("string", "String").pushPair("number", "Double").pushPair("boolean", "Boolean").pushPair("date", "Date").pushPair("void", "void").pushPair("ObjectId", "ObjectId");
        return bs;
    }

    class CJavaBS extends Engine.TypeDeterminer.BatchStringTypeDefinition {
        Parse(data, name) {
            for(var map of this.map) {
                if(map.Source == data) {
                    var getter = `public ${map.Target} get${name}() { return (${map.Target}) this.doc.get("${name}"); }
                    `;
                    var setter = `public void set${name}(${map.Target} obj) { 
                        this.doc.put("${name}", (Object) obj);
                        this.keyUpdated("${name}", (Object) obj);
                    }
                    `;
                    return getter+setter;
                }
            }
        }
    }

    export function ArrayType() {
        var i = new CArrayType();
        return i;
    }

    export function ObjectType() {
        var i = new CObjectType();
        return i;
    }

    export function FunctionType() {
        var i = new CFunctionType();
        return i;
    }

    export function CustomType() {
        var i = new CCustomType();
        return i;
    }

    export function ExpandedBaseType() {
        var i = new CExpandedBasicObject();
        return i;
    }

    class CCustomType extends Engine.TypeDeterminer.TypeDefinition {
        weight = 9990;

        Validator(data) {
            if (typeof data == "object" && !Array.isArray(data)) {
                if (typeof data["_Custom"] != "undefined") {
                    return true;
                }
            }
            return false;
        }

        Parse(data, name) {
            var type = data.JavaType || "Object";
            var getter = `
                public ${type} get${name}() { return (${type}) this.doc.get("${name}"); }
            `;
            var setter = `
                public void set${name}(${type} obj) {
                    this.doc.put("${name}", (Object) obj); 
                    this.keyUpdated("${name}", (Object) obj);
                }
            `
            return getter+setter;
        }
    }

    class CArrayType extends Engine.TypeDeterminer.TypeDefinition {
        weight = 9999;

        Validator(data) {
            return Array.isArray(data);
        }

        Parse(data, name) {
            var getter = `
                public Document[] get${name}() { return (Document[]) this.doc.get("${name}"); }
            `;
            return getter;
        }
    }

    class CObjectType extends Engine.TypeDeterminer.TypeDefinition {
        weight = 10000;

        Validator(data) {
            if (typeof data == "object" && !Array.isArray(data)) {
                return true;
            }
            return false;
        }

        Parse(data, name) {
            var getter = `
                public SubDoc_${name} get${name}() { 
                    if(this.Instance_SubDoc_${name} == null) {
                        this.Instance_SubDoc_${name} = new SubDoc_${name}(this, "${name}", (Document) this.doc.get("${name}")); 
                    } 
                    return this.Instance_SubDoc_${name};
                }
            `
            var setter = `
                public void set${name}(SubDoc_${name} obj) { }
            `

            var subDoc = [];
            for(var d in data) {
                subDoc.push(this.types.determineType(data[d], d));
            }
            var sd = subDoc.join("");
            var clas = `
                public class SubDoc_${name} extends SubDoc{ 
                    SubDoc_${name}(ModelType_JavaClass parent, String name, Document doc) {
                        super(parent, name, doc);
                    }
                    SubDoc_${name}(SubDoc parent, String name, Document doc) {
                        super(parent, name, doc);
                    }
                   ${sd}
                }
                protected SubDoc_${name} Instance_SubDoc_${name};
            `
            return getter + setter + clas;
            //return this.nn(name, name + ":") + out;
        }
    }

    class CFunctionType extends Engine.TypeDeterminer.TypeDefinition {
        weight = 9998;

        Validator(data) {
            if (typeof data == "object") {
                if (data.Function) return true;
                else return false;
            }
        }

        Parse(data, name) {
            var lines: Array<string> = [];

            for (var sig of data.Signature) {
                var m = "";
                m += (sig.Name);
                if (typeof sig.Required != "undefined") {
                    if (!sig.Required) m += "?";
                }
                m += (":");
                m += (this.types.determineType(sig.Type));
                lines.push(m);
            }
            var retType;
            if (typeof data.Return != undefined) retType = this.types.determineType(data.Return);
            else retType = "void";
            return this.nn(name, name + ":") + "(" + lines.join(",") + ")=>" + retType;
        }
    }

    export class CExpandedBasicObject extends Engine.TypeDeterminer.TypeDefinition {
        weight = 9995;

        Validator(data) {
            if (typeof data == "object" && !Array.isArray(data)) {
                if (typeof data.Type != "undefined") {
                    return true;
                }
                else return false;
            }
        }

        Parse(data, name) {
            return this.types.determineType(data.Type, name);
        }
    }
}


export namespace MainClassMethods {
    export function BaseTypes() {
        var bs = new CJavaBS();
        bs.suppressName = true;
        bs.pushPair("string", "String").pushPair("number", "double").pushPair("boolean", "boolean").pushPair("date", "Date").pushPair("void", "void").pushPair("ObjectId", "ObjectId");
        return bs;
    }

    class CJavaBS extends Engine.TypeDeterminer.BatchStringTypeDefinition {
        Parse(data, name) {
            for(var map of this.map) {
                if(map.Source == data) return `(${map.Target}) this.doc.get("${name}")`
            }
        }
    }

    export function ArrayType() {
        var i = new CArrayType();
        return i;
    }

    export function ObjectType() {
        var i = new CObjectType();
        return i;
    }

    export function FunctionType() {
        var i = new CFunctionType();
        return i;
    }

    export function CustomType() {
        var i = new CCustomType();
        return i;
    }

    export function ExpandedBaseType() {
        var i = new CExpandedBasicObject();
        return i;
    }

    class CCustomType extends Engine.TypeDeterminer.TypeDefinition {
        weight = 9990;

        Validator(data) {
            if (typeof data == "object" && !Array.isArray(data)) {
                if (typeof data["_Custom"] != "undefined") {
                    return true;
                }
            }
            return false;
        }

        Parse(data, name) {
            return `(${(data.JavaType || "Object")}) this.doc.get("${name}")`
        }
    }

    class CArrayType extends Engine.TypeDeterminer.TypeDefinition {
        weight = 9999;

        Validator(data) {
            return Array.isArray(data);
        }

        Parse(data, name) {
            return this.types.determineType(data[0], name) + "[]";

        }
    }

    class CObjectType extends Engine.TypeDeterminer.TypeDefinition {
        weight = 10000;

        Validator(data) {
            if (typeof data == "object" && !Array.isArray(data)) {
                return true;
            }
            return false;
        }

        Parse(data, name) {
            return `new SubDoc_${name}(this, (Document) this.doc.get("${name}"))`;
            //return this.nn(name, name + ":") + out;
        }
    }

    class CFunctionType extends Engine.TypeDeterminer.TypeDefinition {
        weight = 9998;

        Validator(data) {
            if (typeof data == "object") {
                if (data.Function) return true;
                else return false;
            }
        }

        Parse(data, name) {
            var lines: Array<string> = [];

            for (var sig of data.Signature) {
                var m = "";
                m += (sig.Name);
                if (typeof sig.Required != "undefined") {
                    if (!sig.Required) m += "?";
                }
                m += (":");
                m += (this.types.determineType(sig.Type));
                lines.push(m);
            }
            var retType;
            if (typeof data.Return != undefined) retType = this.types.determineType(data.Return);
            else retType = "void";
            return this.nn(name, name + ":") + "(" + lines.join(",") + ")=>" + retType;
        }
    }

    export class CExpandedBasicObject extends Engine.TypeDeterminer.TypeDefinition {
        weight = 9995;

        Validator(data) {
            if (typeof data == "object" && !Array.isArray(data)) {
                if (typeof data.Type != "undefined") {
                    return true;
                }
                else return false;
            }
        }

        Parse(data, name) {
            return this.types.determineType(data.Type, name);
        }
    }
}