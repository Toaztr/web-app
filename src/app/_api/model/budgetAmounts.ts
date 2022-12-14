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


/**
 * Montants maximums des différents postes de dépense. Le budget total étant égal à la sommes de tous les autres postes de dépense.
 */
export interface BudgetAmounts { 
    /**
     * Part du budget dédiée aux frais de courtage.
     */
    broker_fees: number;
    /**
     * Part du budget dédiée aux frais de dossier.
     */
    file_management_fees: number;
    /**
     * ¨Part du budget dédiée aux frais de garantie des prêts.
     */
    guaranties_fees: number;
    /**
     * Part du budget dédiée à l\'achat du bien, frais d\'agence inclus mais frais de notaire exclus.
     */
    maximal_price: number;
    /**
     * Part du budget dédiée aux frais de notaire.
     */
    notary_fees: number;
    /**
     * Autres dépenses.
     */
    other_expenses: number;
    /**
     * Budget total: montant empruntable + apport personnel
     */
    total_budget: number;
}

