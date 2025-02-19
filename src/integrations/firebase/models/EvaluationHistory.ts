import { BaseModel } from "./BaseModel";

export default class EvaluationHistory extends BaseModel {
    static  tableName = '360_evaluation_histories'
    static fields = [
        "user_id",
        "evaluation_id",
        "evaluation_type"
    ]
}