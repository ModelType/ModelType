//#GeneratedOn:2017-07-02T17:32:58.948Z
//#ETAG:33bcaab97e022742b408cbc92e24720d
import * as mongoose from "mongoose";
// This is the head for the mongoose file
import * as crypto from "crypto";
export namespace _Data { export interface User {Name:{First:string,Last:string},Created:Date,LastLogin:Date,Email:string,Password:string}}
export namespace _Model { export interface User extends _Data.User, mongoose.Document {}}
var UserSchema = new mongoose.Schema({Name:{First:String,Last:String},Created:Date,LastLogin:Date,Email:String,Password:String});
export namespace _Static { export interface User { Static?:{}}}

export const User : mongoose.Model<_Model.User> & _Static.User = mongoose.model<_Model.User>("User", UserSchema);
User.Static = {}
export namespace _Data { export interface Store {Name:string,Address:string}}
export namespace _Model { export interface Store extends _Data.Store, mongoose.Document {}}
var StoreSchema = new mongoose.Schema({Name:String,Address:String});
export namespace _Static { export interface Store { Static?:{}}}

export const Store : mongoose.Model<_Model.Store> & _Static.Store = mongoose.model<_Model.Store>("Store", StoreSchema);
Store.Static = {}
