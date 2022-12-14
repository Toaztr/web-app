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
import { CaseSummaryLoans } from './caseSummaryLoans';
import { Address } from './address';
import { AcquisitionNature } from './acquisitionNature';


/**
 * Résumé du dossier client à destination des factures
 */
export interface CaseSummary { 
    /**
     * Liste des emprunteurs, personnes physiques ou morales
     */
    actors?: Array<object>;
    /**
     * Liste des prêts accordés pour ce projet.
     */
    loans?: Array<CaseSummaryLoans>;
    project_address?: Address;
    /**
     * Date de signature de l\'acte.
     */
    signature_date?: string;
    project_nature?: AcquisitionNature;
    /**
     * Nom du dossier
     */
    case_name?: string;
    /**
     * Numéro du dossier
     */
    case_id?: string;
}

