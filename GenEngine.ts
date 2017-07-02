/**
 * Created by Omar on 4/26/2017.
 */

export class GenEngine {
    protected engines: Array<Engine> = [];
    public registerEngine(eng:Engine) {
        this.engines.push(eng);
    }
    public process(name: string, data: any) {
        var out = "";
        for(var eng of this.engines) {
            out+=eng.process(name, data)+"\n";
        }
        return out;
    }
}

export namespace TypeDeterminer {
    export class Determiner {
        protected types: Array<TypeDefinition> = [];
        public declareType(definition: TypeDefinition) {
            this.types.push(definition);
            definition.types = this;
            this.types.sort(function(a, b) {
                return a.weight > b.weight ? 1.0 : -1.0;
            });
        }
        public determineType(data: any,name?: string) : string {
            for(var typeName in this.types) {
                var type = this.types[typeName];
                if(type.Validator(data)) {
                    return type.Parse(data, name);
                }
            }
        }
    }

    export class TypeDefinition {
        public types: Determiner;
        public weight: number = 1;
        public suppressName: boolean = false;
        Validator(data: any): boolean {
            return false
        }
        Parse(data:any, name: string): string {
            return "";
        }
        protected nn(name:string, def:string) : string {
            if(this.suppressName) return "";
            var out =  (typeof name != "undefined")  ? (def) : "";
            return out;
        }
    }

    export class BatchStringTypeDefinition extends TypeDefinition{
        protected map: Array<{
            Source: string,
            Target: string
        }> = [];
        Validator(data) {
            if(typeof data == "string") {
                for(var map of this.map) {
                    if(map.Source == data) return true;
                }
            }
            return false;
        }
        Parse(data, name) {
            for(var map of this.map) {
                if(map.Source == data) return this.nn(name, name+":")+map.Target;
            }
        }
        pushPair(source: string, target: string) : BatchStringTypeDefinition {
            this.map.push({
                Source: source,
                Target: target
            });
            return this;
        }

    }


}


export abstract class Engine{
    constructor() {
    }
    public process(name: string, data: any): string {
        return "";
    }
}

