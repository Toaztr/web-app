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
 * Taux Annuel Effectif Global (TAEG) et confrontation aux taux d\'usure.
 */
export interface Taeg { 
    /**
     * TAEG, à l\'exclusion du ou des prêt(s) relais.
     */
    free_taeg: number;
    /**
     * Comparaison du TAEG avec le taux d\'usure en vigueur.
     */
    free_taeg_above_wear_rate: boolean;
    /**
     * TAEG du ou des prêts relais.
     */
    bridge_taeg: number;
    /**
     * Comparaison du TAEG du ou des prêt(s) relais avec le taux d\'usure en vigueur.
     */
    bridge_taeg_above_wear_rate: boolean;
}

