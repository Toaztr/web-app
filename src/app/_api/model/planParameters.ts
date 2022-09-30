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
import { StandalonePinelPlanParameters } from './standalonePinelPlanParameters';
import { StandaloneBudgetPlanParameters } from './standaloneBudgetPlanParameters';
import { MonthlyVaryingProfile } from './monthlyVaryingProfile';
import { AvailableLoan } from './availableLoan';
import { CustomProfile } from './customProfile';
import { SimulationObjective } from './simulationObjective';
import { StandaloneFundingPlanParameters } from './standaloneFundingPlanParameters';
import { YearlyVaryingProfile } from './yearlyVaryingProfile';
import { FundingFees } from './fundingFees';
import { StandaloneDebtConsolidationPlanParameters } from './standaloneDebtConsolidationPlanParameters';
import { ActivePartner } from './activePartner';


/**
 * Paramètres conservés isolément.
 */
/**
 * @type PlanParameters
 * Paramètres conservés isolément.
 * @export
 */
export type PlanParameters = StandaloneBudgetPlanParameters | StandaloneDebtConsolidationPlanParameters | StandaloneFundingPlanParameters | StandalonePinelPlanParameters;
