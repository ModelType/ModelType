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
import * as Engine from "./GenEngine";

export function BaseTypes() {
    var bs = new Engine.TypeDeterminer.BatchStringTypeDefinition();
    bs.pushPair("string", "string").pushPair("number", "number").pushPair("boolean", "boolean").pushPair("date", "Date").pushPair("void", "void").pushPair("ObjectId", "mongoose.Types.ObjectId");
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
        if(!name) return data.TSType;
        var ret = "";
        ret+=name;
        if(typeof data.Required != "undefined") {
            if(!data.Required) ret+="?";
        }
        ret+=":";
        ret+=data.TSType;
        return ret;
    }
}

class CArrayType extends Engine.TypeDeterminer.TypeDefinition {
    weight = 9999;
    Validator(data) {
        return Array.isArray(data);
    }
    Parse(data, name) {
        var out= "Array<";
        var innerTypes: Array<string> = [];
        for(var d of data) {
            innerTypes.push(this.types.determineType(d));
        }
        out+=innerTypes.join(",");
        out+=">";
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
            if(typeof sig.Required != "undefined") {
                if(!sig.Required) m+="?";
            }
            m+=(":");
            m+=(this.types.determineType(sig.Type));
            lines.push(m);
        }
        var retType;
        if(typeof data.Return != undefined) retType = this.types.determineType(data.Return);
        else retType = "void";
        return this.nn(name, name+":")+"(" + lines.join(",")+")=>"+retType;
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
            if(!data.Required) ret+="?";
        }
        ret+=":";
        ret+=this.types.determineType(data.Type);
        return ret;
    }
}