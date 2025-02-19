import { actionDelete, actionGet, actionGetAll, actionSave, actionSearch, onSnap } from "../action";

export class BaseModel {
    static  tableName = ""
    static fields = [];

    static async get( id:string|null=null ) {
        if( id ) return await actionGet(this.tableName, id)
        return await actionGetAll(this.tableName)
    }

    static async delete(id:string) {
        return await actionDelete(this.tableName, id)
    }

    static async post(data:any) {
        return await actionSave(this.tableName, data)
    }

    static async put(id:string, data:any ) {
        return await actionSave(this.tableName, data, id)
    }

    static async search(key:string, value:string) {
        return await actionSearch(this.tableName, key, "==", value)
    }

    static onSnap(callback:any, id:string|null=null) {
        onSnap(this.tableName, callback, id)
    }
}