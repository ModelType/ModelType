"use strict";
/**
 * Created by Omar on 4/26/2017.
 */
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
var GenEngine = (function () {
    function GenEngine() {
        this.engines = [];
    }
    GenEngine.prototype.registerEngine = function (eng) {
        this.engines.push(eng);
    };
    GenEngine.prototype.process = function (name, data) {
        var out = "";
        for (var _i = 0, _a = this.engines; _i < _a.length; _i++) {
            var eng = _a[_i];
            out += eng.process(name, data) + "\n";
        }
        return out;
    };
    return GenEngine;
}());
exports.GenEngine = GenEngine;
var TypeDeterminer;
(function (TypeDeterminer) {
    var Determiner = (function () {
        function Determiner() {
            this.types = [];
        }
        Determiner.prototype.declareType = function (definition) {
            this.types.push(definition);
            definition.types = this;
            this.types.sort(function (a, b) {
                return a.weight > b.weight ? 1.0 : -1.0;
            });
        };
        Determiner.prototype.determineType = function (data, name) {
            for (var typeName in this.types) {
                var type = this.types[typeName];
                if (type.Validator(data)) {
                    return type.Parse(data, name);
                }
            }
        };
        return Determiner;
    }());
    TypeDeterminer.Determiner = Determiner;
    var TypeDefinition = (function () {
        function TypeDefinition() {
            this.weight = 1;
            this.suppressName = false;
        }
        TypeDefinition.prototype.Validator = function (data) {
            return false;
        };
        TypeDefinition.prototype.Parse = function (data, name) {
            return "";
        };
        TypeDefinition.prototype.nn = function (name, def) {
            if (this.suppressName)
                return "";
            var out = (typeof name != "undefined") ? (def) : "";
            return out;
        };
        return TypeDefinition;
    }());
    TypeDeterminer.TypeDefinition = TypeDefinition;
    var BatchStringTypeDefinition = (function (_super) {
        __extends(BatchStringTypeDefinition, _super);
        function BatchStringTypeDefinition() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.map = [];
            return _this;
        }
        BatchStringTypeDefinition.prototype.Validator = function (data) {
            if (typeof data == "string") {
                for (var _i = 0, _a = this.map; _i < _a.length; _i++) {
                    var map = _a[_i];
                    if (map.Source == data)
                        return true;
                }
            }
            return false;
        };
        BatchStringTypeDefinition.prototype.Parse = function (data, name) {
            for (var _i = 0, _a = this.map; _i < _a.length; _i++) {
                var map = _a[_i];
                if (map.Source == data)
                    return this.nn(name, name + ":") + map.Target;
            }
        };
        BatchStringTypeDefinition.prototype.pushPair = function (source, target) {
            this.map.push({
                Source: source,
                Target: target
            });
            return this;
        };
        return BatchStringTypeDefinition;
    }(TypeDefinition));
    TypeDeterminer.BatchStringTypeDefinition = BatchStringTypeDefinition;
})(TypeDeterminer = exports.TypeDeterminer || (exports.TypeDeterminer = {}));
var Engine = (function () {
    function Engine() {
    }
    Engine.prototype.process = function (name, data) {
        return "";
    };
    return Engine;
}());
exports.Engine = Engine;
