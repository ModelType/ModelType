/**
 * Created by Omar on 5/1/2017.
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
import * as Engine from "./GenEngine";

export function BaseTypes() {
    var bs = new Engine.TypeDeterminer.BatchStringTypeDefinition();
    bs.pushPair("string", "String").pushPair("number", "Number").pushPair("boolean", "Boolean").pushPair("date", "Date").pushPair("void", "Void").pushPair("ObjectId", "mongoose.Schema.Types.ObjectId");
    return bs;
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
        if(typeof data == "object" && !Array.isArray(data)) {
            if(typeof data["_Custom"] != "undefined") {
                return true;
            }
        }
        return false;
    }
    Parse(data, name) {
        if(!name) return data.MongooseType;
        var ret = "";
        ret+=name;
        if(typeof data.Required != "undefined") {
            if(!data.Required) ret+="?";
        }
        ret+=":";
        ret+=data.MongooseType;
        return ret;
    }
}

class CArrayType extends Engine.TypeDeterminer.TypeDefinition {
    weight = 9999;
    Validator(data) {
        return Array.isArray(data);
    }
    Parse(data, name) {
        var out= "[";
        var innerTypes: Array<string> = [];
        for(var d of data) {
            innerTypes.push(this.types.determineType(d));
        }
        out+=innerTypes.join(",");
        out+="]";
        return this.nn(name, name+":")+out;
    }
}

class CObjectType extends Engine.TypeDeterminer.TypeDefinition {
    weight = 10000;
    Validator(data) {
        if(typeof data == "object" && !Array.isArray(data)) {
            return true;
        }
        return false;
    }
    Parse(data, name) {
        var out = "{";
        var innerTypes: Array<string> = [];
        for(var d in data) {
            innerTypes.push(this.types.determineType(data[d], d));
        }
        out+= innerTypes.join(",");
        out+="}";
        return this.nn(name, name+":")+out;
    }
}

class CFunctionType extends Engine.TypeDeterminer.TypeDefinition {
    weight =9998;
    Validator(data) {
        if(typeof data == "object") {
            if(data.Function) return true;
            else return false;
        }
    }
    Parse(data, name) {
        var lines: Array<string> = [];

        for(var sig of data.Signature) {
            var m = "";
            m+=(sig.Name);
            lines.push(m);
        }
        var retType;
        return this.nn(name, name+":")+"function (" + lines.join(",")+") {" + data.Body + "}";
    }
}

export class CExpandedBasicObject extends Engine.TypeDeterminer.TypeDefinition {
    weight = 9995;
    Validator(data) {
        if(typeof data == "object" && !Array.isArray(data)) {
            if(typeof data.Type != "undefined") {
                return true;
            }
            else return false;
        }
    }
    Parse(data, name) {
        if(!name) return this.types.determineType(data.Type);
        var ret = "";
        ret+=name;
        if(typeof data.Required != "undefined") {
            // TODO proper required check
            //if(!data.Required) ret+="?";
        }
        ret+=":";
        ret+=this.types.determineType(data.Type);
        return ret;
    }
}


export class MongooseSchema extends Engine.Engine {
    public types: Engine.TypeDeterminer.Determiner;
    constructor() {
        super();
        this.types = new Engine.TypeDeterminer.Determiner();
        this.types.declareType(BaseTypes());
        this.types.declareType(ArrayType());
        this.types.declareType(FunctionType());
        this.types.declareType(ObjectType());
        this.types.declareType(ExpandedBaseType());
        this.types.declareType(CustomType());
    }
    process(name, data) {
        var out = "var "+name+"Schema = new mongoose.Schema({";
        var innerLines : Array<string> = [];
        for(var d in data.Schema) {
            var i = data.Schema[d];
            innerLines.push(this.types.determineType(i, d));
        }
        out+=innerLines.join(",");
        out+="});";
        return out;
    }
}


export class StaticFunctions extends Engine.Engine {
    public types: Engine.TypeDeterminer.Determiner;
    constructor() {
        super();
        this.types = new Engine.TypeDeterminer.Determiner();
        this.types.declareType(BaseTypes());
        this.types.declareType(ArrayType());
        this.types.declareType(FunctionType());
        this.types.declareType(ObjectType());
        this.types.declareType(ExpandedBaseType());
        this.types.declareType(CustomType());
    }
    process(name, data) {
        var out = name+".Static = {";
        var innerLines : Array<string> = [];
        for(var d in data.Methods) {
            var i = data.Methods[d];
            if(typeof i.Static == "undefined") {
                continue;
            } else {
                if(!i.Static) continue;
            }
            i.Function = true;
            innerLines.push(this.types.determineType(i, d));
        }
        out+=innerLines.join(",");
        out+="}";
        return out;
    }
}

export class SchemaFunction extends Engine.Engine {
    public types: Engine.TypeDeterminer.Determiner;
    constructor() {
        super();
        this.types = new Engine.TypeDeterminer.Determiner();
        this.types.declareType(BaseTypes());
        this.types.declareType(ArrayType());
        this.types.declareType(FunctionType());
        this.types.declareType(ObjectType());
        this.types.declareType(ExpandedBaseType());
        this.types.declareType(CustomType());
    }
    process(name, data) {
        var out = ``;
        var innerLines : Array<string> = [];
        for(var d in data.Methods) {
            var i = data.Methods[d];
            if(typeof i.Static != "undefined") {
                continue;
            } else {
                if(i.Static) continue;
            }
            i.Function = true;
            innerLines.push(d+"="+this.types.determineType(i));
        }
        out = innerLines.map((line)=>{
            return `${name}Schema.methods.${line}`
        }).join("\n");
        return out;
    }
}