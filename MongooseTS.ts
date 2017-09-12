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
import * as GenEngine from "./GenEngine";
import * as TSEngine from "./TSEngine";
import * as MongooseEngine from "./MongooseEngine";
import * as ParseEngine from "./Parser";
export const Engine = new GenEngine.GenEngine();

export class Parser extends ParseEngine.Parser {
    public compile() {
        var out = "";
        out+= this.generateETAG();
        out+= "import * as mongoose from \"mongoose\";\n"
        if(this.data.Heads) {
            if(this.data.Heads.MongooseTS) out+=this.data.Heads.MongooseTS;
        }

        if(this.data.CustomTypes) {
            for(var typeName in this.data.CustomTypes) {
                var type = this.data.CustomTypes[typeName];
                var iout = "export type I"+typeName+" = ";
                var oout = "export var "+typeName+"= {";
                var iStrs: Array<string> = [];
                var oStrs: Array<string> = [];
                for(var i of type) {
                    if(typeof i == "string") {
                        iStrs.push(`"${i}"`);
                        oStrs.push(`"${i}":("${i}" as I${typeName})`);
                    }
                    if(typeof i == "object") {
                        var tO: Array<string> = [];
                        for(var t of i.Keys) {
                            iStrs.push(`"${i.Name}.${t}"`);
                            tO.push(`"${t}":"${t}"`);
                        }
                        oStrs.push(` "${i.Name}" : {${tO.join(",")}}`);
                    }
                }
                iout += iStrs.join("|") + ";\n";
                oout += oStrs.join(",") + "}\n";
                out+=iout+oout;
            }

        }

        for(var modelName in this.data.Models) {
            var model = this.data.Models[modelName];
            out+=Engine.process(modelName, model);
        }

        return out;
    }
}



class DataInterface extends GenEngine.Engine {
    public types: GenEngine.TypeDeterminer.Determiner;
    constructor() {
        super();
        this.types = new GenEngine.TypeDeterminer.Determiner();
        this.types.declareType(TSEngine.BaseTypes());
        this.types.declareType(TSEngine.ArrayType());
        this.types.declareType(TSEngine.FunctionType());
        this.types.declareType(TSEngine.ObjectType());
        this.types.declareType(TSEngine.ExpandedBaseType());
        this.types.declareType(TSEngine.CustomType());
        this.types.declareType(TSEngine.ReferenceType());
    }
    process(name, data) {
        var out = "export namespace _Data { export interface "+name+" {";
        var innerLines : Array<string> = [];
        for(var d in data.Schema) {
            var i = data.Schema[d];
            innerLines.push(this.types.determineType(i, d));
        }
        out+=innerLines.join(",");
        out+="}}";
        return out;
    }
}

var idata = new DataInterface();
Engine.registerEngine(idata);

class ModelInterface extends GenEngine.Engine {
    public types: GenEngine.TypeDeterminer.Determiner;
    constructor() {
        super();
        this.types = new GenEngine.TypeDeterminer.Determiner();
        this.types.declareType(TSEngine.BaseTypes());
        this.types.declareType(TSEngine.ArrayType());
        this.types.declareType(TSEngine.FunctionType());
        this.types.declareType(TSEngine.ObjectType());
        this.types.declareType(TSEngine.ExpandedBaseType());
        this.types.declareType(TSEngine.CustomType());
        this.types.declareType(TSEngine.ReferenceType());
    }
    process(name, data) {
        var out = "export namespace _Model { export interface "+name+" extends _Data."+name+", mongoose.Document {";
        var innerLines : Array<string> = [];
        for(var d in data.Methods) {
            var i = data.Methods[d];
            if(typeof i.Static != "undefined") {
                if(i.Static) continue;
            }
            i.Function = true;
            innerLines.push(this.types.determineType(i, d));
        }
        out+=innerLines.join(",");

        out+="}}";
        return out;
    }
}


var imodel = new ModelInterface();
Engine.registerEngine(imodel);



var mschema = new MongooseEngine.MongooseSchema();
Engine.registerEngine(mschema);



class SchemaStatic extends GenEngine.Engine {
    public types: GenEngine.TypeDeterminer.Determiner;
    constructor() {
        super();
        this.types = new GenEngine.TypeDeterminer.Determiner();
        this.types.declareType(TSEngine.BaseTypes());
        this.types.declareType(TSEngine.ArrayType());
        this.types.declareType(TSEngine.FunctionType());
        this.types.declareType(TSEngine.ObjectType());
        this.types.declareType(TSEngine.ExpandedBaseType());
        this.types.declareType(TSEngine.CustomType());
    }
    process(name, data) {
        var out = "export namespace _Static { export interface "+name+" { Static?:{";
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

        out+="}}}";
        return out;
    }
}

class MongooseObject extends GenEngine.Engine {
    public types: GenEngine.TypeDeterminer.Determiner;
    constructor() {
        super();
        this.types = new GenEngine.TypeDeterminer.Determiner();
        this.types.declareType(TSEngine.BaseTypes());
        this.types.declareType(TSEngine.ArrayType());
        this.types.declareType(TSEngine.FunctionType());
        this.types.declareType(TSEngine.ObjectType());
        this.types.declareType(TSEngine.ExpandedBaseType());
        this.types.declareType(TSEngine.CustomType());
    }
    process(name, data) {
        var out = "export const "+name+" : mongoose.Model<_Model."+name+"> & _Static."+name+" = mongoose.model<_Model."+name+">(\""+name+"\", "+name+"Schema);";
        return out;
    }
}

var schemaS = new SchemaStatic();
Engine.registerEngine(schemaS);

var schemaF = new MongooseEngine.SchemaFunction();
Engine.registerEngine(schemaF);

var mo = new MongooseObject();
Engine.registerEngine(mo);

var mstaticfunc = new MongooseEngine.StaticFunctions();
Engine.registerEngine(mstaticfunc);