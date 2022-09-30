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
import { BillingTiersPerLoan } from './billingTiersPerLoan';


/**
 * Régles de facturation.
 */
export interface BillingRules { 
    tiers_per_loan: Array<BillingTiersPerLoan>;
    /**
     * Montant maximum du commissionnement de ce partenaire.
     */
    maximum_bill_amount?: number;
}
