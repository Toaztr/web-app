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
import { BridgeLoan } from './bridgeLoan';
import { SmoothableCharge } from './smoothableCharge';
import { Insurance } from './insurance';
import { PtzLoan } from './ptzLoan';
import { Guaranty } from './guaranty';
import { FreeLoan } from './freeLoan';
import { BossLoan } from './bossLoan';
import { GracePeriod } from './gracePeriod';
import { RatePeriod } from './ratePeriod';


/**
 * Prêt à inclure dans le plan de financement.  L\'inclusion d\'un prêt le plan de financement dépendra de son utilité, ou du résultat de calcul d\'élligibilité dans le cas de prêts réglementés.
 */
/**
 * @type AvailableLoan
 * Prêt à inclure dans le plan de financement.  L\'inclusion d\'un prêt le plan de financement dépendra de son utilité, ou du résultat de calcul d\'élligibilité dans le cas de prêts réglementés.
 * @export
 */
export type AvailableLoan = BossLoan | BridgeLoan | FreeLoan | PtzLoan | SmoothableCharge;

