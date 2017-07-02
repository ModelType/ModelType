/**
 * Created by omar on 7/2/17.
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

