import { BaseModel } from "./BaseModel";
import Group from "./Group";

export default class Profile extends BaseModel {
    static  tableName = '360_profiles'
    static fields = [
        "full_name",
        "email",
        "password",
        "role", // admin | manager | employee
        "groups"
    ]
    static async signInWithPassword(email, password) {
        const [user] = await this.search("email", email) as any[]
        if( user ) {
            if( user.password === password) {
                return {
                    data: {
                        ...user,
                        password: undefined
                    },
                    error: null
                }
            }
            return {
                data: null,
                error: "El password es invalido"
            }            
        }
        return {
            data: null,
            error: "El email no pertenece a ningun usuario"
        }
    }

    static async register(email, password, full_name){
        const [user] = await this.search("email", email) as any[]
        if( user ) {
            return {
                data:null,
                error: "El email ya esta siendo usado"
            }
        }

        await this.post({ email, password, role:'employee', full_name, groups: [] })
        return {
            data: { email, password, role:'employee', full_name, groups: [] },
            error: null
        }
    }

    static async onSnapDetailed(callback:any, id:string|null=null) {
        this.onSnap( async (data) => {
            console.log('onSnap data', data)
            const groups = []
            for(const groupId of data.groups) {
                const group = await Group.get(groupId)
                groups.push( group )
            }
            callback({
                ...data,
                groups
            })
        }, id)
    }
}