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
import { CustomerBillingParameters } from './customerBillingParameters';
import { CustomerBillingParametersByIds } from './customerBillingParametersByIds';
import { PartnerBillingParameters } from './partnerBillingParameters';
import { FundingResults } from './fundingResults';
import { PartnerBillingParametersByIds } from './partnerBillingParametersByIds';
import { Partner } from './partner';
import { Case } from './case';


/**
 * Objet contenant les paramètres de facturation par valeur ou par IDs.
 */
/**
 * @type BillingParameters
 * Objet contenant les paramètres de facturation par valeur ou par IDs.
 * @export
 */
export type BillingParameters = CustomerBillingParameters | CustomerBillingParametersByIds | PartnerBillingParameters | PartnerBillingParametersByIds;
