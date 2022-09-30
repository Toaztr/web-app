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
import { GrandiozProfile } from './grandiozProfile';
import { MonthlyVaryingProfile } from './monthlyVaryingProfile';
import { AvailableLoan } from './availableLoan';
import { CustomProfile } from './customProfile';
import { YearlyVaryingProfile } from './yearlyVaryingProfile';
import { FundingFees } from './fundingFees';
import { ActivePartner } from './activePartner';


/**
 * Paramètres communs.
 */
export interface CommonParameters { 
    /**
     * Mensualité maximale, à ne pas dépasser.
     */
    maximal_monthly_payment?: number;
    /**
     * Pourcentage d\'endettement à ne pas dépasser. En général égal à 33% des revenus de l\'emprunteur.
     */
    maximal_debt_ratio?: number;
    funding_fees?: FundingFees;
    /**
     * Type(s) de prêt à considérer pour la simulation. L\'ajout d\'un élément dans cette liste ne garanti pas qu\'il sera utilisé dans le plan de financement final, si le plan peut être satisfait avec un sous ensemble des lignes, ou si l\'emprunteur n\'est pas elligible à certain de ces prêts (PTZ...).
     */
    loans: Array<AvailableLoan>;
    profile?: GrandiozProfile | MonthlyVaryingProfile | YearlyVaryingProfile | CustomProfile;
    bank?: ActivePartner;
}

