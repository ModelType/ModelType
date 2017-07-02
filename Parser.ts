/**
 * Created by omar on 7/2/17.
 */
import * as fs from "fs";
import * as yaml from "yamljs";
import * as ModelType from "./index";
import * as crypto from "crypto";
export function loadFile(fileName: string, parser: typeof Parser) : Parser {
    var data = fs.readFileSync(fileName, "utf-8");
    if(parser) {
        return new (parser as any)({
            YAML: true,
            Data: data
        });
    }
}

export interface IParserOptions {
    /**
     * Is the data YAML or JSON?
     * True for YAML, False for JSON
     */
    YAML: boolean;
    /**
     * The Raw schema data
     */
    Data: string;
}
export abstract class Parser {
    protected options: IParserOptions;
    protected data: any;
    constructor(options: IParserOptions) {
        if(!options) throw new Error("No Options");
        if(options.YAML) {
            this.data = yaml.parse(options.Data)
        } else {
            this.data = JSON.parse(options.Data);
        }
        this.options = options;
    }
    protected generateETAG() : string {
        var out = "";
        out+="//#GeneratedOn:"+(new Date()).toISOString()+"\n";
        out+="//#ETAG:"+(crypto.createHash("md5").update(this.options.Data).digest("hex"))+"\n";
        return out;
    }
    public abstract compile() : string;
}

