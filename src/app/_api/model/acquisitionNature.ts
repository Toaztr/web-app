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
 * Nature de l\'acquisition.
 */
export type AcquisitionNature = 'FLAT' | 'HOUSE' | 'LAND' | 'LAND_AND_CONSTRUCTION_PROJECT' | 'CONSTRUCTION_PROJECT' | 'PARKING' | 'COMMERCIAL_PREMISES' | 'OFFICES' | 'SCPI';

export const AcquisitionNature = {
    Flat: 'FLAT' as AcquisitionNature,
    House: 'HOUSE' as AcquisitionNature,
    Land: 'LAND' as AcquisitionNature,
    LandAndConstructionProject: 'LAND_AND_CONSTRUCTION_PROJECT' as AcquisitionNature,
    ConstructionProject: 'CONSTRUCTION_PROJECT' as AcquisitionNature,
    Parking: 'PARKING' as AcquisitionNature,
    CommercialPremises: 'COMMERCIAL_PREMISES' as AcquisitionNature,
    Offices: 'OFFICES' as AcquisitionNature,
    Scpi: 'SCPI' as AcquisitionNature
};

