import { BaseModel } from "./BaseModel";

export default class Group extends BaseModel {
    static  tableName = '360_groups'
    static fields = [
        "name",
        "members"
    ]
}