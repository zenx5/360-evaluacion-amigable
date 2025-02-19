import { BaseModel } from "./BaseModel";

export default class Evaluation extends BaseModel {
    static  tableName = '360_evaluations'
    static fields = [
        "evaluator_id",
        "evaluated_id",
        "status",
        "group_id"
    ]

    static async create(evaluator_id, evaluated_id, group_id) {
        const timeMark = Date.now().toString()
        await this.post({
            evaluator_id,
            evaluated_id,
            status:timeMark,
            group_id,
        })

        const evaluations = await this.search("status", timeMark) as { evaluator_id:string, evaluated_id:string, group_id:string, id:string, status:string }[]
        const evaluation = evaluations.find( evaluation => evaluation.evaluator_id==evaluator_id && evaluation.evaluated_id==evaluated_id && evaluation.group_id==group_id )
        
        if( evaluation ) {
            const data = {
                ...evaluation,
                status:"not-completed"
            }
            await this.put(evaluation.id, data)
            return {
                data, 
                error: null
            }
        }
        return {
            data: null,
            error: "No se pudo crear la evaluación"
        }

    }
}