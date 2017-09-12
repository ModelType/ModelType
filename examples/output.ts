//#GeneratedOn:2017-09-12T03:28:24.878Z
//#ETAG:69b13ea3f38d9206a74330b5f31e79c0
import * as mongoose from "mongoose";
// This is the head for the mongoose file
import * as crypto from "crypto";
export namespace _Data { export interface User {Name:{First:string,Last:string},Created:Date,LastLogin:Date,Email:string,Password:string,FavoriteStore:mongoose.Types.ObjectId | _Model.Store}}
export namespace _Model { export interface User extends _Data.User, mongoose.Document {}}
var UserSchema = new mongoose.Schema({Name:{First:String,Last:String},Created:Date,LastLogin:Date,Email:String,Password:String,FavoriteStore:{type: mongoose.Schema.Types.ObjectId, ref: "Store"}});
export namespace _Static { export interface User { Static?:{}}}

export const User : mongoose.Model<_Model.User> & _Static.User = mongoose.model<_Model.User>("User", UserSchema);
User.Static = {}
export namespace _Data { export interface Store {Name:string,Address:string,Users:Array<{Name:string,Hooray:string}>}}
export namespace _Model { export interface Store extends _Data.Store, mongoose.Document {}}
var StoreSchema = new mongoose.Schema({Name:String,Address:String,Users:[{Name:String,Hooray:String}]});
export namespace _Static { export interface Store { Static?:{}}}

export const Store : mongoose.Model<_Model.Store> & _Static.Store = mongoose.model<_Model.Store>("Store", StoreSchema);
Store.Static = {}