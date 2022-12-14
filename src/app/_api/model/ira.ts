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


/**
 * Indemnités de remboursement anticipé. Si le type est LEGAL, le calcul est fait automatiquement.
 */
export interface Ira { 
    /**
     * Type d\'indemnités de remboursement anticipé (IRA): calcul légal, ou valeur spécifique (négociée par exemple).
     */
    type: Ira.TypeEnum;
    /**
     * Montant des indemnités de remboursement anticipé (IRA).
     */
    value?: number;
}
export namespace Ira {
    export type TypeEnum = 'LEGAL' | 'NEGOCIATED';
    export const TypeEnum = {
        Legal: 'LEGAL' as TypeEnum,
        Negociated: 'NEGOCIATED' as TypeEnum
    };
}


