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
 * Frais relatifs au plan de financement: frais de dossier bancaire et frais de courtage.
 */
export interface FundingFees { 
    /**
     * Frais de courtage.
     */
    broker_fees?: number;
    /**
     * Permet d\'inclure ou d\'exclure les frais de courtage du calcul du TAEG.
     */
    include_broker_fees_in_taeg?: boolean;
    /**
     * Frais de dossier.
     */
    file_management_fees?: number;
}

