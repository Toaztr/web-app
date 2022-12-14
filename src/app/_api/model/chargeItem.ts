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
import { WeightedPositiveFigure } from './weightedPositiveFigure';


/**
 * Charge mensuelle, ainsi que sa pondération pour le calcul de l\'endettement.
 */
export interface ChargeItem { 
    /**
     * Type de charge.
     */
    type: ChargeItem.TypeEnum;
    monthly_amount: WeightedPositiveFigure;
    /**
     * Persiste pendant le projet ?.
     */
    continue_after_project?: boolean;
    /**
     * Mois de départ du paiement de la charge.
     */
    start_month?: number;
    /**
     * Mois de fin du paiement de la charge.
     */
    end_month?: number;
    /**
     * Charge lissable: si la charge est lissable, elle sera intégrée au plan de financement, et les lignes de crédit seront lissées sur celle-ci.
     */
    smoothable?: boolean;
    /**
     * Nom de la charge: désignation, type, etc...
     */
    comment?: string;
}
export namespace ChargeItem {
    export type TypeEnum = 'RENT' | 'MAINTENANCE' | 'CONDOMINIUM_FEES' | 'SCHEDULED_SAVING' | 'LOA' | 'TAX' | 'OTHER';
    export const TypeEnum = {
        Rent: 'RENT' as TypeEnum,
        Maintenance: 'MAINTENANCE' as TypeEnum,
        CondominiumFees: 'CONDOMINIUM_FEES' as TypeEnum,
        ScheduledSaving: 'SCHEDULED_SAVING' as TypeEnum,
        Loa: 'LOA' as TypeEnum,
        Tax: 'TAX' as TypeEnum,
        Other: 'OTHER' as TypeEnum
    };
}


