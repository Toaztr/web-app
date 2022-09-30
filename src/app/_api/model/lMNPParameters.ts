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
import { MonthlyVaryingProfile } from './monthlyVaryingProfile';
import { CustomProfile } from './customProfile';
import { YearlyVaryingProfile } from './yearlyVaryingProfile';
import { LMNPPlanParameters } from './lMNPPlanParameters';
import { FundingFees } from './fundingFees';
import { ActivePartner } from './activePartner';
import { GrandiozProfile } from './grandiozProfile';
import { LightCaseLMNP } from './lightCaseLMNP';
import { LightLMNP } from './lightLMNP';
import { AvailableLoan } from './availableLoan';
import { SimulationObjective } from './simulationObjective';
import { LightLegalPerson } from './lightLegalPerson';
import { RentalInvestmentHouseholdDetails } from './rentalInvestmentHouseholdDetails';


/**
 * Paramètres de la simulation d\'un dispositif LMNP.
 */
export interface LMNPParameters { 
    objective?: SimulationObjective;
    /**
     * Permet de ne pas tenir compte des contraintes maximal_monthly_payment et maximal_debt_ratio et de renvoyer un plan de financement dans tous les cas, en mode MINIMIZE_INSTALMENT.
     */
    bypass_instalment_constraints?: boolean;
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
    project?: LightLMNP;
    actor?: RentalInvestmentHouseholdDetails | LightLegalPerson;
}

