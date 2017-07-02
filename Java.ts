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
import * as GenEngine from "./GenEngine";
import * as JavaEngine from "./JavaEngine";
import * as ParseEngine from "./Parser";
export class Parser extends ParseEngine.Parser {

    public compile() {
        var out = "";
        out+=this.generateETAG();
        if(this.data.Heads) {
            if(this.data.Heads.Java) out+=this.data.Heads.Java;
        }
        out+=Head;
        for(var modelName in this.data.Models) {
            var model = this.data.Models[modelName];
            out+=Engine.process(modelName, model);
        }
        out+=Tail;
        return out;
    }
}

export const Engine = new GenEngine.GenEngine();

export const Head = `
    import org.bson.types.ObjectId;
    import org.bson.Document;
    import java.util.Date;
    import com.mongodb.BasicDBObject;
    public class Models {
    private static Models Models_Singleton;
    abstract class ModelType_JavaClass { 
        protected Document doc;
        protected BasicDBObject update;
        protected void keyUpdated(String key, Object val) { 
            this.update.append(key, val); 
        }
        public ModelType_JavaClass(Document doc) {
            this.doc = doc;
            this.update = new BasicDBObject();
        }
     }
     abstract class SubDoc {
        protected ModelType_JavaClass parentDoc;
        protected SubDoc parentSubDoc;
        protected Document doc;
        protected String name;
        public SubDoc(ModelType_JavaClass parent, String name, Document doc) {
            this.doc = doc;
            this.parentDoc = parent;
            this.name = name;
        }
        public SubDoc(SubDoc parent, String name, Document doc) {
            this.doc = doc;
            this.parentSubDoc = parent;
            this.name = name;
        }
        protected void keyUpdated(String key, Object val) {
            if(this.parentDoc != null) {
                this.parentDoc.keyUpdated(name + "." + key, val);
            }
            if(this.parentSubDoc != null) {
                this.parentSubDoc.keyUpdated(name +"."+key, val);
            }
        }
        
     }`;
export const Tail = "}";
class MainClass extends GenEngine.Engine {
    public types: GenEngine.TypeDeterminer.Determiner;
    public methodTypes: GenEngine.TypeDeterminer.Determiner;
    public subClassTypes: GenEngine.TypeDeterminer.Determiner;
    constructor() {
        super();
        this.types = new GenEngine.TypeDeterminer.Determiner();
        this.types.declareType(JavaEngine.MainClass.BaseTypes());
        this.types.declareType(JavaEngine.MainClass.ArrayType());
        this.types.declareType(JavaEngine.MainClass.FunctionType());
        this.types.declareType(JavaEngine.MainClass.ObjectType());
        this.types.declareType(JavaEngine.MainClass.ExpandedBaseType());
        this.types.declareType(JavaEngine.MainClass.CustomType());

        this.methodTypes = new GenEngine.TypeDeterminer.Determiner();
        this.methodTypes.declareType(JavaEngine.MainClassMethods.CustomType());
        this.methodTypes.declareType(JavaEngine.MainClassMethods.ArrayType());
        this.methodTypes.declareType(JavaEngine.MainClassMethods.FunctionType());
        this.methodTypes.declareType(JavaEngine.MainClassMethods.ObjectType());
        this.methodTypes.declareType(JavaEngine.MainClassMethods.ExpandedBaseType());
        this.methodTypes.declareType(JavaEngine.MainClassMethods.BaseTypes());
    }
    process(name, data) {
        var out = `public class ${name} extends ModelType_JavaClass {
        public ${name}(Document mongodbDocument) { 
            super(mongodbDocument);
        }
        public BasicDBObject update() {
            return new BasicDBObject().append("$set", this.update);
        }
        `;
        var innerLines : Array<string> = [];
        for(var d in data.Schema) {
            var i = data.Schema[d];
            var type = this.types.determineType(i, d);
            var ret = this.methodTypes.determineType(i, d);
            innerLines.push(type);
        }
        out+=innerLines.join("");
        out+=`
        }
        public static ${name} cast${name}(Document doc) {
            if(Models_Singleton == null) Models_Singleton = new Models();
            return Models_Singleton.new ${name}(doc);
        }
        `;
        return out;
    }
}
Engine.registerEngine(new MainClass());