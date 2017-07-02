"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//#GeneratedOn:2017-07-02T17:32:58.948Z
//#ETAG:33bcaab97e022742b408cbc92e24720d
var mongoose = require("mongoose");
var UserSchema = new mongoose.Schema({ Name: { First: String, Last: String }, Created: Date, LastLogin: Date, Email: String, Password: String });
exports.User = mongoose.model("User", UserSchema);
exports.User.Static = {};
var StoreSchema = new mongoose.Schema({ Name: String, Address: String });
exports.Store = mongoose.model("Store", StoreSchema);
exports.Store.Static = {};
