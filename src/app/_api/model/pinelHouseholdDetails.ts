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
import { LightFinanceDetails } from './lightFinanceDetails';
import { PinelPerson } from './pinelPerson';


/**
 * Détail relatifs au ménage.
 */
export interface PinelHouseholdDetails { 
    type: PinelHouseholdDetails.TypeEnum;
    /**
     * Nombre de personnes au total dans le ménage.
     */
    people_count?: number;
    /**
     * Nombre d\'enfants dans le ménage.
     */
    children_count?: number;
    /**
     * Nombre de personnes à charge dans le ménage, hors enfants.
     */
    dependent_persons_count?: number;
    persons?: Array<PinelPerson>;
    finance?: LightFinanceDetails;
}
export namespace PinelHouseholdDetails {
    export type TypeEnum = 'HOUSEHOLD';
    export const TypeEnum = {
        Household: 'HOUSEHOLD' as TypeEnum
    };
}


