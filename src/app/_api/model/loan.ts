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
import { ComputedGuaranty } from './computedGuaranty';
import { GracePeriod } from './gracePeriod';
import { ComputedInsurance } from './computedInsurance';


/**
 * Caractéristiques de la ligne de crédit incluse dans le plan de financement.
 */
export interface Loan { 
    /**
     * Type de prêt: libre, prêt à taux zéro, relais...
     */
    type: Loan.TypeEnum;
    /**
     * Taux d\'intérêt annuel en %.
     */
    yearly_rate?: number;
    /**
     * Taux d\'intérêt annuels en %.
     */
    yearly_rates?: Array<number>;
    /**
     * Durée du prêt en mois.
     */
    duration_months: number;
    /**
     * Montant du prêt.
     */
    amount: number;
    guaranty?: ComputedGuaranty;
    grace_period?: GracePeriod;
    /**
     * Représente les amortissements au cours du temps.
     */
    amortizations: Array<number>;
    /**
     * Représente les intérêts au cours du temps.
     */
    interests: Array<number>;
    /**
     * Représente les détails des assurances, ainsi que les primes mensuelles.
     */
    insurances: Array<ComputedInsurance>;
    /**
     * Représente les tranches de déblocage, depuis la première tranche jusqu\'au déblocage complet du prêt.
     */
    released_amounts: Array<number>;
    /**
     * Représente le capital restant dû au cours du temps.
     */
    remaining_capital: Array<number>;
    /**
     * Intérêts capitalisés, dans le cadre d\'un différé total.
     */
    capitalized_interests?: Array<number>;
    /**
     * Compteur de pré-amortissement: représente les remboursements des intérêts capitalisés au cours du temps, dans le cas d\'un différé partiel supérieur à 12 mois.
     */
    preamortizations: Array<number>;
    /**
     * Coût total des intérêts du prêt.
     */
    interests_cost: number;
    /**
     * Coût total des primes d\'assurance du prêt.
     */
    insurance_cost: number;
    /**
     * Montant du compteur d\'intérêts (ou de pré-amortissement), dans le cadre d\'un différé total.
     */
    preamortization_cost: number;
    /**
     * Coût total des intérêts capitalisés du prêt, dans le cadre d\'un différé total.
     */
    capitalized_interests_cost?: number;
    /**
     * Nom du prêt: tout type d\'identification (appellation marketing, etc...)
     */
    loan_name?: string;
}
export namespace Loan {
    export type TypeEnum = 'FREE_LOAN' | 'PTZ_LOAN' | 'BOSS_LOAN' | 'BRIDGE_LOAN' | 'SMOOTHABLE_CHARGE';
    export const TypeEnum = {
        FreeLoan: 'FREE_LOAN' as TypeEnum,
        PtzLoan: 'PTZ_LOAN' as TypeEnum,
        BossLoan: 'BOSS_LOAN' as TypeEnum,
        BridgeLoan: 'BRIDGE_LOAN' as TypeEnum,
        SmoothableCharge: 'SMOOTHABLE_CHARGE' as TypeEnum
    };
}


