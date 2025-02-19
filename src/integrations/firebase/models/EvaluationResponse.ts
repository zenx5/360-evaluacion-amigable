import { BaseModel } from "./BaseModel";

export default class EvaluationResponse extends BaseModel {
    static  tableName = '360_evaluation_responses'
    static fields = [
        "evaluation_id",
        "question_text",
        "response",
        "score"
    ]
}