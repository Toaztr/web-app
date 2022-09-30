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
import { LMNPOldProperty } from './lMNPOldProperty';
import { LMNPHouseConstruction } from './lMNPHouseConstruction';
import { LMNPNewProperty } from './lMNPNewProperty';


/**
 * Projet d\'investissement dans le cadre du dispositif LMNP.
 */
export interface LightLMNP { 
    type: LightLMNP.TypeEnum;
    /**
     * Régime d\'imposition.
     */
    tax_mode?: LightLMNP.TaxModeEnum;
    /**
     * Le meublé est une chambre d\'hôte ou un meublé de tourisme classé.
     */
    guestroom_or_classified?: boolean;
    /**
     * Loyer mensuel.
     */
    monthly_rent_value: number;
    /**
     * Prévision de l\'évolution annuelle du loyer (en pourcentage: mettre 0.5 pour 0.5%, -10 pour -10%, ...).
     */
    monthly_rent_value_yearly_evolution_rate?: number;
    /**
     * Prévision de l\'évolution annuelle du prix du bien (en pourcentage: mettre 0.5 pour 0.5%, -10 pour -10%, ...).
     */
    price_yearly_evolution_rate?: number;
    /**
     * Charges locatives (en pourcentage du loyer: mettre 13 pour 13% par exemple).
     */
    renting_charges_rate?: number;
    /**
     * Durée du dispositif LMNP.
     */
    duration: number;
    property?: LMNPNewProperty | LMNPOldProperty | LMNPHouseConstruction;
}
export namespace LightLMNP {
    export type TypeEnum = 'LMNP';
    export const TypeEnum = {
        Lmnp: 'LMNP' as TypeEnum
    };
    export type TaxModeEnum = 'REAL' | 'MICRO_BIC';
    export const TaxModeEnum = {
        Real: 'REAL' as TaxModeEnum,
        MicroBic: 'MICRO_BIC' as TaxModeEnum
    };
}

