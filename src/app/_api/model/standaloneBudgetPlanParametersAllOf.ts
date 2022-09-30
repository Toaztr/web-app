/**
 * Toaztr API
 * # Introduction  Les API **Toaztr** sont documentées au format [OpenAPI](https://www.openapis.org/). Elles sont **accessibles depuis n\'importe quel site ou serveur**, toutes les réponses incluant un header Cross-Origin Resource Sharing adapté, comme spécifié sur la [spécification W3C](https://fetch.spec.whatwg.org/).
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface StandaloneBudgetPlanParametersAllOf { 
    /**
     * Type du jeu de paramètres.
     */
    type: StandaloneBudgetPlanParametersAllOf.TypeEnum;
    /**
     * Nom des paramètres
     */
    name?: string;
}
export namespace StandaloneBudgetPlanParametersAllOf {
    export type TypeEnum = 'BUDGET_PLAN_PARAMETERS';
    export const TypeEnum = {
        BudgetPlanParameters: 'BUDGET_PLAN_PARAMETERS' as TypeEnum
    };
}


