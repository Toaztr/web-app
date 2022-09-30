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
 * Catégorie socioprofessionnelle des retraités.
 */
export interface SocioProfessionalGroupRetraites { 
    type: SocioProfessionalGroupRetraites.TypeEnum;
    /**
     * Catégorie socio-profesionnelle.
     */
    category?: SocioProfessionalGroupRetraites.CategoryEnum;
}
export namespace SocioProfessionalGroupRetraites {
    export type TypeEnum = 'RETRAITES';
    export const TypeEnum = {
        Retraites: 'RETRAITES' as TypeEnum
    };
    export type CategoryEnum = 'ANCIENS_AGRICULTEURS_EXPLOITANTS' | 'ANCIENS_ARTISANS_COMMERCANTS_CHEFS_DENTREPRISE' | 'ANCIENS_CADRES' | 'ANCIENNES_PROFESSIONS_INTERMEDIAIRES' | 'ANCIENS_EMPLOYES' | 'ANCIENS_OUVRIERS';
    export const CategoryEnum = {
        AnciensAgriculteursExploitants: 'ANCIENS_AGRICULTEURS_EXPLOITANTS' as CategoryEnum,
        AnciensArtisansCommercantsChefsDentreprise: 'ANCIENS_ARTISANS_COMMERCANTS_CHEFS_DENTREPRISE' as CategoryEnum,
        AnciensCadres: 'ANCIENS_CADRES' as CategoryEnum,
        AnciennesProfessionsIntermediaires: 'ANCIENNES_PROFESSIONS_INTERMEDIAIRES' as CategoryEnum,
        AnciensEmployes: 'ANCIENS_EMPLOYES' as CategoryEnum,
        AnciensOuvriers: 'ANCIENS_OUVRIERS' as CategoryEnum
    };
}

