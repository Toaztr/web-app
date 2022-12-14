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
import { SimulationObjective } from './simulationObjective';


/**
 * Paramètres spécifiques du plan de financement d\'un investissement Pinel.
 */
export interface SpecificPinelPlanParameters { 
    objective?: SimulationObjective;
    /**
     * Permet de ne pas tenir compte des contraintes maximal_monthly_payment et maximal_debt_ratio et de renvoyer un plan de financement dans tous les cas, en mode MINIMIZE_INSTALMENT.
     */
    bypass_instalment_constraints?: boolean;
}

