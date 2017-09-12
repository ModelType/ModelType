"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//#GeneratedOn:2017-09-12T03:28:24.878Z
//#ETAG:69b13ea3f38d9206a74330b5f31e79c0
var mongoose = require("mongoose");
var UserSchema = new mongoose.Schema({ Name: { First: String, Last: String }, Created: Date, LastLogin: Date, Email: String, Password: String, FavoriteStore: { type: mongoose.Schema.Types.ObjectId, ref: "Store" } });
exports.User = mongoose.model("User", UserSchema);
exports.User.Static = {};
var StoreSchema = new mongoose.Schema({ Name: String, Address: String, Users: [{ Name: String, Hooray: String }] });
exports.Store = mongoose.model("Store", StoreSchema);
exports.Store.Static = {};
