import { Injectable } from '@angular/core';
import { Case, Budget, BudgetParameters, BudgetResults, Individual, LegalPerson, Partner, ActivePartner, FundingResults, Taeg, SmoothableCharge, BridgeLoan, AvailableLoan, Loan } from '../../_api/model/models';
import { LocaleUtils } from 'src/app/utils/locale-utils';
import { LoanUtils } from 'src/app/utils/loan-utils';
import { IconsSvg } from './icons-svg';
import { PDFExportService } from './pdf-export.service';
import { LegalPersonTypeMap } from 'src/app/utils/strings';
import { CourtesyTypeMap } from 'src/app/utils/strings';
import { ProjectStringMap } from 'src/app/utils/strings';
import { CaseFormService, CaseService } from '../../_services';
import { AcquisitionNatureMap, AcquisitionStateMap, AcquisitionDestinationMap,  } from 'src/app/utils/strings';
import * as palette from 'google-palette';
import { isThisTypeNode } from 'typescript';


@Injectable({
    providedIn: 'root'
})
export class MandatePDFExportService extends PDFExportService {

    currentDate = new Date();
    summary: any;
    iconUser: any;
    totalCost: any;
    loansAmountToFund: any;
    aCaseForm: CaseFormService;

    // Colors for the table
    colormap = palette(['tol-rainbow'], 10);
    yellowCell = '#' + this.colormap[7];
    blueCell = '#' + this.colormap[2];
    greenCell = '#' + this.colormap[4];
    purpleCell = '#' + this.colormap[0];


    exportToPDF(caseId: string, caseName: string, aCaseForm: CaseFormService, totalCost, loansAmountToFund, aPartners: ActivePartner[], iconUser: any): any {

        this.aCase = aCaseForm.asCase();
        this.aCaseForm = aCaseForm;
        this.caseId = caseId;
        this.caseName = caseName;
        this.iconUser = iconUser;
        this.aPartners = aPartners;
        this.totalCost = totalCost;
        this.loansAmountToFund = loansAmountToFund;

        return {
            pageMargins: [40, 60, 40, 60],
            pageSize: 'A4',
            pageOrientation: 'portrait',
            defaultStyle: {
                fontSize: 10
            },
            styles: this.styles(),
            header: this.header(this.caseId, IconsSvg.toaztrLogo),
            footer: this.footer(),
            content: this.content()
        };
    }


    retrieveBankInfo() {
      const decodedPersons = this.decodePersons(this.aCase);
      const aBankInfo = [];
      // Actor level
      if (this.aCase && this.aCase.actor && this.aCase.actor.type === 'HOUSEHOLD' &&  this.aCase.actor.bank_info && (this.aCase.actor.bank_info.current_bank || this.aCase.actor.bank_info.current_agency)) {
        aBankInfo.push({text : this.formatFldAsString(this.aCase.actor.bank_info.current_bank) + ' ' + this.formatFldAsString(this.aCase.actor.bank_info.current_agency) });
      }
      // Persons level
      decodedPersons.forEach( (decodedPerson) => {
          if (decodedPerson && decodedPerson.bank_info && (decodedPerson.bank_info.bank || decodedPerson.bank_info.agency)) {
            aBankInfo.push({text : this.formatFldAsString(decodedPerson.bank_info.bank) + ' ' + this.formatFldAsString(decodedPerson.bank_info.agency) });
          }
        }
      )
      if (aBankInfo.length === 0)
      {
         aBankInfo.push({text : 'Banque actuelle non renseign??e' });
      }
      return aBankInfo;
    }


    // Encode the contact section into PDF format
    encodeMandateHeader(title: any, iconUser: any) {
      const aBrokerPartner = this.extractPartnerContact('BROKER', this.aPartners, false);
      const aBrokerRepresenting = this.extractPartnerContact('BROKER', this.aPartners, true);
      const aDestinationContact = this.generateDestinationContact()

      // Format broker name depending if we have or not the courtesy
      const brokerName = this.formatContactName(aBrokerPartner);
      // Format broker name depending if we have or not the courtesy
      const representantName = this.formatContactName(aBrokerRepresenting);

      const brokerNameFormatted = aBrokerPartner.name ? aBrokerPartner.name + ', ' : '';
      const aContact = [
        {columns: [{ svg: iconUser, width: 75, alignment: 'center'}, {style: 'title', text: title }] },
        {style: 'bigLineBreak', text: ''},
        {text: brokerNameFormatted + this.formatAddress(aBrokerPartner.address.address, aBrokerPartner.address.postal_code, aBrokerPartner.address.city, aBrokerPartner.address.country) },
        {style: 'smallLineBreak', text: ''},
        {text: [ {text : 'Conseiller: ', style: 'bold'},  {text: brokerName}] },
        {text: [ {text : 'T??l??phone: ', style: 'bold'},  {text: aBrokerPartner.contact.contact_phone_number}] },
        {text: [ {text : 'eMail: ', style: 'bold'},  {text: aBrokerPartner.contact.contact_email}] },
        {style: 'bigLineBreak', text: ''},
        {text: [ {text : 'R??f??rence du dossier: ', style: 'bold'},  {text: this.caseId}] },
        {style: 'bigLineBreak', text: ''},

        {canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595 - 2 * 40, y2: 5, lineWidth: 3 }]},

        {style: 'bigLineBreak', text: ''},
        {text: 'Le(s) sousign??(s):'},
        {style: 'bigLineBreak', text: ''},
        ...aDestinationContact,
        {style: 'bigLineBreak', text: ''},
        {text: 'Ci-apr??s indiff??remment d??nomm??s conjointement le Client ou Mandant,', style: 'bold'},
        {style: 'bigLineBreak', text: ''},
        {text: 'Donne(nt) mandat ??:', style: 'bold'},
        {text: brokerNameFormatted + 'courtier en op??rations de banque et services de paiement, courtier en assurances, dont le si??ge social est situ?? au ' +  this.formatAddress(aBrokerPartner.address.address, aBrokerPartner.address.postal_code, aBrokerPartner.address.city, aBrokerPartner.address.country) +  ', inscrit ?? l\'ORIAS sous le num??ro ' + aBrokerPartner.agreement_number + ', repr??sent?? par ' + representantName + ','},
        {style: 'bigLineBreak', text: ''},
        {text: 'Ci-apr??s d??nomm?? le Mandataire.', style: 'bold'},

        {style: 'bigLineBreak', text: ''},

        {text: 'Le fichier des interm??diaires en op??rations de banque et en services de paiement est consultable sur le site de l\'Orias, www.orias.fr.'},
        {style: 'bigLineBreak', text: ''},
        {canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595 - 2 * 40, y2: 5, lineWidth: 3 }]},

     ];
      return aContact;
    }


    encodePreliminary() {
        const aContent = [
            {style: 'bigLineBreak', text: ''},
            {style: 'h3centerbold', text: 'Pr??ambule'},
            {style: 'smallLineBreak', text: ''},

            {text: 'En qualit?? d\'Interm??diaire en Op??rations de Banque et Services de Paiement, le Mandataire :', style: 'bold'},
            {
              ul: [
                { text: 'Est r??gi par les articles L519-1 ?? L519-6 du Code mon??taire et financier et les d??crets et arr??t??s subs??quents qui sont li??s,' },
                { text: 'Respecte les dispositions du Code Mon??taire et Financier, issues du d??cret n??2012-101, relatif au statut des IOBSP, notamment quant ?? l\'ensemble des informations ?? fournir au Mandant ; fait l\'objet d\'une supervision de l\'Autorit?? de Contr??le Prudentiel et de R??solution (ACPR) dont l\'adresse est la suivante : 4 place de Budapest CS 92459 75436 PARIS CEDEX 09 - site : www.acpr.banque-france.fr, tel : 01.49.95.40.00,' },
                { text: 'Certifie n\'??tre soumis ?? aucune obligation contractuelle de travailler avec un ou plusieurs ??tablissements de cr??dits, et d??clare ne pas ??tre d??tenu et ne pas d??tenir de droit de vote ou du capital d\'un ??tablissement de cr??dits,' },
                { text: 'D??clare qu\'aucun ??tablissement de cr??dit ou de paiement ne d??tient plus de 10% de son capital ou de droits de vote,' },
                { text: 'D??clare qu\'il ne d??tient pas plus de 10% du capital ou des droits de vote d\'un ??tablissement de cr??dit ou de paiement,' },
                { text: 'D??clare ne pas avoir enregistr??, avec un ??tablissement de cr??dits, au cours de l\'ann??e pr??c??dente, une part sup??rieure au tiers de son chiffre d\'affaires au titre de l\'activit?? d\'interm??diation,' },
                { text: 'Met ?? disposition la liste des ??tablissements de cr??dits ou de paiement avec lesquels il travaille, ainsi que les conditions de sa r??mun??ration.' },
              ]
            },
        ];

        return aContent;
    }


    encodeArticle1() {
        const projectType = (this.aCase && this.aCase.project && this.aCase.project.type) ? ProjectStringMap.toString(this.aCase.project.type).toLowerCase() : '';
        const projectAddress = (this.aCase && this.aCase.project && this.aCase.project.administrative_information && this.aCase.project.administrative_information.address) ? this.formatAddress(this.aCase.project.administrative_information.address.address, this.aCase.project.administrative_information.address.postal_code, this.aCase.project.administrative_information.address.city, this.aCase.project.administrative_information.address.country) : '';
        const borrowerBanks = this.retrieveBankInfo();

        const totalAskedLoans = (this.aCase && this.aCase.project && this.aCase.project.type && this.aCase.project.type !== 'BUDGET') ? { text: 'Montant total du (des) cr??dit(s) demand??(s): ' + LocaleUtils.toLocale(this.loansAmountToFund, 'EUR')} : {};
        const acquisitionCost = (this.aCase && this.aCase.project && this.aCase.project.type && this.aCase.project.type !== 'BUDGET') ? { text: 'Co??t d\'acquisition (frais ??ventuels d\'agence et de notaire inclus): ' + LocaleUtils.toLocale(this.totalCost, 'EUR') } : {};

        const aContent = [
            {style: 'bigLineBreak', text: ''},
            {style: 'bigLineBreak', text: ''},
            {style: 'bigLineBreak', text: ''},
            {style: 'h3centerbold', text: 'Article 1: Objet du mandat'},
            {style: 'smallLineBreak', text: ''},

            {text: 'Le Mandant conf??re au Mandataire pouvoir de rechercher, au nom et pour le compte du Mandant, un financement bancaire dont les caract??ristiques sont les suivantes: '},
            {style: 'smallLineBreak', text: ''},
            {
              ul: [
                { text: 'Op??ration ?? financer: ' + projectType},
                { text: 'Adresse du bien: ' + projectAddress },
                acquisitionCost,
                totalAskedLoans,
              ]
            },
            {style: 'smallLineBreak', text: ''},
            {text: 'Le montant et les caract??ristiques exactes du (des) cr??dit(s) propos??s pourront varier selon l\'??tablissement bancaire sollicit?? ou en cas de besoin.'},
            {style: 'smallLineBreak', text: ''},
            {text: 'La demande de pr??t est conforme aux volont??s du Client. Elle est formul??e sous sa seule responsabilit??.'},
            {text: 'Aux vues des n??gociations, le Mandataire pourra proposer de modifier les caract??ristiques du pr??t envisag?? afin de r??pondre au mieux au besoin de financement, et ce en diminuant ou augmentant le montant et/ou la dur??e du pr??t sans qu\'il soit n??cessaire, d\'??tablir une nouvelle convention de recherche en capitaux.'},
            {style: 'smallLineBreak', text: ''},
            {text: 'Le Mandant mandate le Mandataire pour solliciter toutes les banques, y compris la ou les propre(s) banque(s) du Mandant, ?? savoir:'},
            {style: 'smallLineBreak', text: ''},
            {
              ul: [
                ...borrowerBanks
              ]
            },
            {style: 'smallLineBreak', text: ''},
            {text: 'Origine du dossier: ' , style: 'h3bold'},
            {style: 'smallLineBreak', text: ''},
            { columns: [ {...this.generateSquare('black'), alignment: 'right', width:'5%'}, {text: 'Direct', alignment: 'left', width:'25%', margin: [ 5, 0, 0, 0 ] },
                         {...this.generateSquare('black'), alignment: 'right', width:'5%'}, {text: 'Publicit??', alignment: 'left', width:'25%', margin: [ 5, 0, 0, 0 ] },
                         {...this.generateSquare('black'), alignment: 'right', width:'5%'}, {text: 'Internet', alignment: 'left', width:'25%', margin: [ 5, 0, 0, 0 ] }
            ]},
            {style: 'smallLineBreak', text: ''},
            { columns: [ {...this.generateSquare('black'), alignment: 'right', width:'5%'}, {text: 'Parrainage', alignment: 'left', width:'18%', margin: [ 5, 0, 0, 0 ] },
                         {...this.generateSquare('white'), alignment: 'right', width:'5%'}, {text: 'Nom:', alignment: 'left', width:'18%', margin: [ 5, 0, 0, 0 ] },
                         {...this.generateSquare('white'), alignment: 'right', width:'5%'}, {text: 'Pr??nom:', alignment: 'left', width:'18%', margin: [ 5, 0, 0, 0 ] },
            ]},
            {style: 'smallLineBreak', text: ''},
            { columns: [ {...this.generateSquare('black'), alignment: 'right', width:'5%'}, {text: 'Apporteur', alignment: 'left', width:'18%', margin: [ 5, 0, 0, 0 ] },
                         {...this.generateSquare('white'), alignment: 'right', width:'5%'}, {text: 'Nom:', alignment: 'left', width:'18%', margin: [ 5, 0, 0, 0 ] },
                         {...this.generateSquare('white'), alignment: 'right', width:'5%'}, {text: 'Pr??nom:', alignment: 'left', width:'18%', margin: [ 5, 0, 0, 0 ] },
                         {...this.generateSquare('white'), alignment: 'right', width:'5%'}, {text: 'Soci??t??:', alignment: 'left', width:'18%', margin: [ 5, 0, 0, 0 ] },
            ]},
            {style: 'smallLineBreak', text: ''},
            { columns: [ {...this.generateSquare('black'), alignment: 'right', width:'5%'}, {text: 'Autre', alignment: 'left', width:'18%', margin: [ 5, 0, 0, 0 ] },
                         {...this.generateSquare('white'), alignment: 'right', width:'5%'}, {text: 'Source:', alignment: 'left', width:'18%', margin: [ 5, 0, 0, 0 ] },

            ]},
        ];
        return aContent;
    }


    encodeArticle2() {
        const aContent = [
            {style: 'bigLineBreak', text: ''},
            {style: 'bigLineBreak', text: ''},
            {style: 'bigLineBreak', text: ''},
            {style: 'h3centerbold', text: 'Article 2: Obligation du Mandant'},
            {style: 'smallLineBreak', text: ''},

            {text: 'Le Mandant d??clare que rien, dans sa situation juridique et dans sa capacit?? bancaire, ne s\'oppose ?? sa demande de financement.'},
            {style: 'smallLineBreak', text: ''},
            {text: 'Afin de permettre au Mandataire de mener ?? bien la mission confi??e aux termes du pr??sent mandat, le Mandant s\'engage ?? :'},

            {style: 'smallLineBreak', text: ''},
            {
              ul: [
                { text: 'Fournir au Mandataire toutes les pi??ces et tous les renseignements n??cessaires ?? l\'instruction de son dossier, portant notamment sur ses ressources, ses charges, ses cr??dits en cours et son patrimoine existant au jour de la demande de financement, et ce aux fins de r??alisation de l\'??tude de solvabilit??,'},
                { text: 'Communiquer au Mandataire pendant toute la dur??e du mandat, toutes informations compl??mentaires et l\'informer de toute modification susceptible d\'affecter sa situation financi??re,'},
                { text: 'garantir l\'exactitude, la conformit?? et l\'authenticit?? des documents et renseignements confi??s,'},
                { text: 'Autoriser l\'??tablissement de cr??dit - partenaire du Mandataire - ?? communiquer toutes les informations le concernant et couvertes par le secret professionnel bancaire au Mandataire, dans le cadre de l\'ex??cution du pr??sent mandat et de la convention entre l\'??tablissement et le Mandataire, et que l\'ensemble des informations constituant son dossier puisse ??tre transmis d\'un service ?? un autre au sein de l\'??tablissement de cr??dit,'},
                { text: 'Autoriser le Mandataire ?? informer le vendeur, l\'agence immobili??re et le notaire, du d??p??t de demande(s) de pr??t(s) et de l\'obtention du ou des accord(s) de financement,'},
                { text: 'Informer le Mandataire s\'il est inscrit dans le Fichier National des Incidents de Remboursement des Cr??dits aux Particuliers (FICP).'},
              ]
            },
        ];
        return aContent;
    }


    encodeArticle3() {
        const aContent = [
            {style: 'bigLineBreak', text: ''},
            {style: 'bigLineBreak', text: ''},
            {style: 'bigLineBreak', text: ''},
            {style: 'h3centerbold', text: 'Article 3: Obligation du Mandataire'},
            {style: 'smallLineBreak', text: ''},

            {text: 'Dans le cadre de son obligation de moyens, le Mandataire s\'engage ?? :'},
            {style: 'smallLineBreak', text: ''},
            {
              ul: [
                { text: 'Etudier avec sinc??rit?? et loyaut?? la demande du Mandant et agir au mieux de ses int??r??ts,'},
                { text: 'S??lectionner l\'??tablissement de cr??dit le plus appropri?? en fonction des int??r??ts et des attentes exprim??s par le Mandant,'},
                { text: 'D??poser le dossier de demande de pr??t, aupr??s d\'au moins un ??tablissement de cr??dit, dans un d??lai de 7 jours suivant sa compl??te constitution.'},
              ]
            },
            {style: 'smallLineBreak', text: ''},
            {text: 'La liste des ??tablissements partenaires du Mandataire est disponible sur demande.'},

        ];
        return aContent;
    }


    encodeArticle4() {
        const aContent = [
            {style: 'bigLineBreak', text: ''},
            {style: 'bigLineBreak', text: ''},
            {style: 'bigLineBreak', text: ''},
            {style: 'h3centerbold', text: 'Article 4: R??mun??ration du mandataire'},
            {style: 'smallLineBreak', text: ''},

            {text: 'En r??mun??ration de la mission confi??e, le Mandant s\'engage ?? verser au Mandataire, la somme de ____________ euros sous forme de frais de dossier.'},
            {style: 'smallLineBreak', text: ''},
            {text: 'Cette somme est exigible le jour o?? l\'op??ration objet du pr??sent mandat sera effectivement r??alis??e. Toutefois, conform??ment aux dispositions de l\'article L.519-6 du Code mon??taire et financier, le Mandataire ne pourra la percevoir avant le d??blocage effectif des fonds par l\'organisme pr??teur.'},
            {style: 'smallLineBreak', text: ''},
            {text: 'Loi MURCEF : Article L 321-2 de la loi n??2001-1168 du 11 D??cembre 2001 : ?? Aucun versement, de quelque nature que ce soit, ne peut ??tre exig?? d\'un particulier, avant l\'obtention d\'un ou plusieurs pr??ts d\'argent ??.'},
        ];
        return aContent;
    }


    encodeArticle5() {
        const aContent = [
            {style: 'bigLineBreak', text: ''},
            {style: 'bigLineBreak', text: ''},
            {style: 'bigLineBreak', text: ''},
            {style: 'h3centerbold', text: 'Article 5: Dur??e du mandat'},
            {style: 'smallLineBreak', text: ''},

            {text: 'Le pr??sent mandat prend effet ?? compter du jour de sa signature pour une dur??e ind??termin??e. Il prend fin d??s l\'acceptation par le Mandant d\'une offre de pr??t ??mise par l\'un des ??tablissements bancaires ou financiers sollicit??s par le Mandataire. Il peut ??tre d??nonc?? par l\'une ou l\'autre des parties avec un pr??avis de quinze jours donn?? par lettre recommand??e avec accus?? de r??ception.'},
        ];
        return aContent;
    }


    encodeArticle6() {
        const aContent = [
            {style: 'bigLineBreak', text: ''},
            {style: 'bigLineBreak', text: ''},
            {style: 'bigLineBreak', text: ''},
            {style: 'h3centerbold', text: 'Article 6: Informations au Mandant'},
            {style: 'smallLineBreak', text: ''},

            {text: 'Le Mandataire informe le Mandant qu\'aucune demande de cr??dit ne pourra ??tre transmise si toutes les pi??ces n??cessaires ?? la constitution du dossier ne lui sont pas remises. A ce titre, le Mandant certifie avoir re??u du Mandataire la liste des pi??ces n??cessaires ?? la constitution de la demande de financement.'},
            {style: 'smallLineBreak', text: ''},

            {text: 'L\'activit?? d\'interm??diaire en cr??dit n\'est constitutive que d\'une obligation de moyen. Seuls les ??tablissements bancaires sollicit??s peuvent d??cider de l\'octroi du ou des cr??dit(s) sollicit??(s) et des conditions aff??rentes, qui peuvent varier selon leur seule volont??. Le mandataire ne garantit pas les d??lais d\'??tude et de r??ponse des ??tablissements bancaires. Le Mandataire n\'est pas tenu par les d??lais impos??s au mandant dans le cadre d\'une promesse d\'achat.'},
            {style: 'smallLineBreak', text: ''},

            {text: 'Le Mandataire ne saurait ??tre d??clar?? responsable de la diff??rence entre le montant inscrit dans le compromis de vente et les conditions du pr??sent mandat.' },
            {style: 'smallLineBreak', text: ''},

            {text: 'L\'obtention du cr??dit suppose de contracter une assurance li??e au cr??dit.' },
            {style: 'smallLineBreak', text: ''},

            {text: 'Un cr??dit vous engage et doit ??tre rembours??. V??rifiez vos capacit??s de remboursement avant de vous engager. Les impay??s aff??rents au(x) cr??dit(s) sollicit??(s) peuvent avoir de graves cons??quences sur votre patrimoine et vous pourriez ??tre redevable(s), ?? l\'??gard de la banque, du capital restant d??, major?? d\'int??r??ts de retard, ainsi que d\'une indemnit??.' },
            {style: 'smallLineBreak', text: ''},

            {text: 'En application des articles L 333-4 et L 333-5 du code de la consommation, les incidents de paiement caract??ris??s font l\'objet d\'une inscription au fichier des incidents de remboursement des cr??dits aux particuliers (FICP) g??r?? par la Banque de France.' },
            {style: 'smallLineBreak', text: ''},

            {text: 'En mati??re de cr??dit immobilier, l\'emprunteur dispose d\'un d??lai de r??flexion de 10 jours apr??s r??ception de l\'offre de pr??t ??mise par l\'??tablissement bancaire pour donner son accord.' },
            {style: 'smallLineBreak', text: ''},

            {text: 'En mati??re de cr??dit ?? la consommation, l\'emprunteur dispose d\'un d??lai de 14 jours calendaires pour revenir sur son engagement vis-??-vis du contrat de cr??dit. La mise ?? disposition des fonds peut ??tre demand??e ?? partir du 8??me jour sans que cela ne r??duise le d??lai de r??tractation.' },
        ];
        return aContent;
    }


    encodeArticle7() {
        const aContent = [
            {style: 'bigLineBreak', text: ''},
            {style: 'bigLineBreak', text: ''},
            {style: 'bigLineBreak', text: ''},
            {style: 'h3centerbold', text: 'Article 7: Traitement des donn??es ?? caract??re personnel - Informations et libert??s'},
            {style: 'smallLineBreak', text: ''},

            {text: 'Les donn??es personnelles concernant le Mandant, recueillies pour les besoins dont la finalit?? est li??e ?? l\'ex??cution du Mandat, font l\'objet d\'un traitement informatique destin?? ?? remplir les obligations issues du pr??sent Mandat. Le destinataire direct de ces donn??es est le Mandataire, notamment tenu de r??pondre sinc??rement aux demandes des ??tablissements de cr??dit contact??s.'},
            {style: 'smallLineBreak', text: ''},

            {text: 'Ces donn??es font l\'objet de communication ext??rieure par le seul Mandataire, pour les seules n??cessit??s d\'ex??cution du pr??sent contrat ou d\'exigences l??gales et r??glementaires (art. L. 561-1 et suivants du Code mon??taire et financier, en particulier), dans le respect du R??glement (UE) 2016/679 du Parlement Europ??en et du Conseil du 27 avril 2016 relatif ?? la protection des personnes physiques ?? l\'??gard du traitement des donn??es ?? caract??re personnel et ?? la libre circulation de ces donn??es (R??glement G??n??ral sur la Protection des Donn??es ou ?? RGPD ??).'},
            {style: 'smallLineBreak', text: ''},

            {text: 'Le Mandant, justifiant de son identit??, b??n??ficie d\'un droit permanent d\'acc??s, de rectification, d\'effacement (droit ?? l\'oubli), d\'opposition, de limitation du traitement, ?? la portabilit?? de ses donn??es personnelles (art. 39, Loi n??78-17 du 6 janvier 1978, modifi??e). Le Mandant souhaitant exercer ce droit et obtenir communication des informations le concernant, s\'adresse au Mandataire, soit par simple courrier ?? l\'adresse postale figurant au d??but de ce document, soit par email, ?? l\'adresse email figurant au d??but de ce document.' },
            {style: 'smallLineBreak', text: ''},

            {text: 'Conform??ment aux dispositions r??gissant la conservation des donn??es ?? caract??re personnel et en regard de la nature des op??rations de banque, ces donn??es personnelles sont conserv??es dix (10) ann??es ?? compter de la date de signature du contrat (articles L. 213-1, R. 213-2 du Code de la consommation).' },
            {style: 'smallLineBreak', text: ''},

            {text: 'Vous pouvez ??galement d??finir des directives relatives ?? la conservation, ?? l\'effacement et ?? la communication de vos donn??es ?? caract??re personnel apr??s votre d??c??s.' },
            {style: 'smallLineBreak', text: ''},

            {text: 'Le Mandant peut, pour des motifs l??gitimes, s\'opposer au traitement des donn??es le concernant.' },
            {style: 'smallLineBreak', text: ''},

            {text: 'Sous r??serve d\'un manquement aux dispositions ci-dessus, le mandant a le droit d\'introduire une r??clamation aupr??s de la CNIL.' },
            {style: 'smallLineBreak', text: ''},

            {text: 'En exprimant son accord au Mandat, le Mandant autorise le Mandataire, ?? collecter, ?? utiliser et ?? conserver les donn??es personnelles transmises par lui, ?? communiquer ?? tout ??tablissement de cr??dit toutes les informations et donn??es personnelles le concernant, m??me celles couvertes par le secret professionnel bancaire, conform??ment aux pr??visions de l\'article L. 511-33 du Code mon??taire et financier et dans le cadre de l\'ex??cution du pr??sent Mandat.' },
        ];
        return aContent;
    }


    encodeArticle8() {
        const aContent = [
            {style: 'bigLineBreak', text: ''},
            {style: 'bigLineBreak', text: ''},
            {style: 'bigLineBreak', text: ''},
            {style: 'h3centerbold', text: 'Article 8: R??clamations, contentieux et attribution de comp??tence'},
            {style: 'smallLineBreak', text: ''},

            {text: 'Pour toute r??clamation, le Mandant peut s\'adresser par courrier ?? l\'adresse postale figurant au d??but de ce document, soit par email, ?? l\'adresse email figurant au d??but de ce document.'},
            {style: 'smallLineBreak', text: ''},

            {text: 'Sauf difficult?? particuli??re li??e ?? la r??clamation, le Mandataire s\'engage ?? r??pondre au Mandant :'},
            {style: 'smallLineBreak', text: ''},
            {
              ul: [
                { text: 'Dans les dix jours ouvrables ?? compter de la r??ception de la r??clamation, pour en accuser r??ception, sauf si la r??ponse elle m??me est apport??e au client dans ce d??lai,'},
                { text: 'Dans les deux mois entre la date de r??ception de la r??clamation et la date d\'envoi de la r??ponse au client.'},
              ]
            },
            {style: 'smallLineBreak', text: ''},
            {text: 'Sans r??ponse satisfaisante, le Mandant pourra avoir recours au M??diateur du cr??dit via le site internet suivant : www.anm-conso.com/, par voie postale : ANM Conso ??? 62, rue Tiquetonne ??? 75002 PARIS, par t??l??phone au 01.42.33.81.03, par mail contact@ANM-MEDIATION.COM. La m??diation est une proc??dure gratuite pour le Mandant.'},
            {style: 'smallLineBreak', text: ''},

            {text: 'Le pr??sent mandat est soumis au droit fran??ais.'},
            {style: 'smallLineBreak', text: ''},

            {text: 'En cas de litige ?? l\'occasion de l\'interpr??tation ou de l\'ex??cution du pr??sent mandat, les parties s\'efforceront de le r??gler ?? l\'amiable pr??alablement ?? toute action en justice.'},
        ];

        return aContent;
    }


    encodeArticle9() {
        const question1 = 'Avez-vous d??j?? souscrit un cr??dit immobilier dans votre vie ?';
        const question2 = 'Avez-vous d??j?? souscrit un autre cr??dit dans votre vie ?';
        const question3 = 'Connaissez-vous la signification de T.A.E.G ?';
        const question4 = 'Connaissez-vous la diff??rence entre un cr??dit ?? taux fixe et ?? taux r??visable ?';
        const question5 = 'Savez-vous ?? quoi sert l\'assurance emprunteur ?';
        const question6 = 'Selon vous, votre connaissance en mati??re de cr??dit est plut??t :';

        const yesNo = 'Oui   Non';
        const lowMediumHigh = 'Faible   Moyenne   Haute';

        const aAnswersVector = [];

        const decodedPersons = this.decodePersons(this.aCase, false);
        decodedPersons.forEach( (decodedPerson) => {
            if (decodedPerson) {
              aAnswersVector.push([decodedPerson.courtesy + ' ' + decodedPerson.firstName + ' ' + decodedPerson.lastName, yesNo, yesNo, yesNo, yesNo, yesNo, lowMediumHigh]);
            }
        });

        const aContent = [
            {style: 'bigLineBreak', text: '', pageOrientation: 'landscape', pageBreak: 'before'},
            {style: 'bigLineBreak', text: ''},
            {style: 'bigLineBreak', text: ''},
            {style: 'h3centerbold', text: 'Article 9: Evaluation de vos connaissances en mati??re de cr??dit'},
            {style: 'smallLineBreak', text: ''},
            {text: 'Entourez la r??ponse que vous choisissez pour chacune des questions.'},
            {style: 'smallLineBreak', text: ''},
            {
              style: 'tablecenter',
              table: {
                body: [
                  ['', question1, question2, question3, question4, question5, question6],
                  ...aAnswersVector
                ]
              }
            },

        ];

        return aContent;
    }



    encodeArticle10(generationDate) {

        const aContent = [
            {style: 'bigLineBreak', text: '', pageOrientation: 'portrait', pageBreak: 'before'},
            {style: 'bigLineBreak', text: ''},
            {style: 'bigLineBreak', text: ''},
            {style: 'h3centerbold', text: 'Article 10: Liste des annexes'},
            {style: 'smallLineBreak', text: ''},
            {text: 'Annexe 1: Informations g??n??rales sur les contrats de cr??dit'},
            {text: 'Annexe 2: Liste des pi??ces ?? fournir par le Mandant'},
            {text: 'Annexe 3: L??xique du cr??dit'},
            {style: 'bigLineBreak', text: ''},
            {style: 'bigLineBreak', text: ''},
            {text: 'Fait en deux exemplaires ?? __________________________________________________________________, le ' + generationDate.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(',', ' ??') + '.'},
            {style: 'bigLineBreak', text: ''},
            this.generateSignatureSection(true, 'Bon pour acceptation du mandat')
        ];

        return aContent;
    }

    encodeMainFirstPart() {
        const aContent = [
          ...this.encodePreliminary(),
          ...this.encodeArticle1(),
          ...this.encodeArticle2(),
          ...this.encodeArticle3(),
          ...this.encodeArticle4(),
          ...this.encodeArticle5(),
          ...this.encodeArticle6(),
          ...this.encodeArticle7(),
          ...this.encodeArticle8(),
          ...this.encodeArticle9(),
          ...this.encodeArticle10(this.currentDate),
        ];

        return aContent;
    }


    generateDefinition(toDefine: any, definition: any) {
        const aDefinition = { text: [
            { text: toDefine, style: 'h4bold', decoration: 'underline' },
            { text: ' ' + definition, style: 'h4'},
        ] };
        return aDefinition;
    }


    encodeCreditLexic(annexNumber) {
        const definitions = [];
        const toDefine1 = 'Amortissement (du capital):';
        const definition1 = 'Pour un emprunt, l\'amortissement est le capital qui est rembours?? ?? chaque ??ch??ance. Par extension, on parle de p??riode d\'amortissement (par exemple apr??s une p??riode de diff??r??) quand le capital du cr??dit commence r??ellement ?? ??tre rembours??.';
        definitions.push([toDefine1, definition1]);

        const toDefine2 = 'Amortissement constant:';
        const definition2 = 'Sur un cr??dit ?? amortissement constant, la m??me somme de capital est rembours??e ?? chaque ??ch??ance. Le montant des ??ch??ances (capital + int??r??ts) diminue donc avec le temps. Au contraire, si le montant de l\'??ch??ance est fixe, il s\'agit d\'un cr??dit ?? ??ch??ances constantes.';
        definitions.push([toDefine2, definition2]);

        const toDefine3 = 'Amortissement n??gatif:';
        const definition3 = 'Se dit lorsque les int??r??ts calcul??s sont sup??rieurs au montant de l\'??ch??ance pay??e. aucun capital n\'est rembours??. Au contraire, la diff??rence entre le montant des int??r??ts et le montant de l\'??ch??ance s\'ajoute au capital restant d??.';
        definitions.push([toDefine3, definition3]);

        const toDefine4 = 'Amortissement in fine:';
        const definition4 = 'cr??dit dont le remboursement du capital est effectu?? seulement sur la derni??re ??ch??ance.';
        definitions.push([toDefine4, definition4]);

        const toDefine5 = 'Assurance emprunteur (ou assurance cr??dit):';
        const definition5 = 'Cette assurance, dont le pr??teur est le b??n??ficiaire, a pour but de garantir le pr??teur en cas de d??c??s ou d\'invalidit?? de l\'emprunteur. Les garanties ?? d??c??s ?? et ?? invalidit?? totale ?? sont pratiquement toujours exig??es par les banques pour un cr??dit immobilier. La garantie ?? invalidit?? partielle temporaire ?? est fortement recommand??e si le pr??t vise l\'acquisition de la r??sidence principale. La ?? garantie ch??mage ??, optionnelle, couvre le remboursement total des ??ch??ances (pour les meilleurs contrats), ou partiel et progressif eu ??gard ?? la d??gressivit?? des ASSEDIC.';
        definitions.push([toDefine5, definition5]);

        const toDefine6 = 'Cap de taux:';
        const definition6 = 'Plafonnement de la hausse du taux d\'int??r??t en cas de cr??dit ?? taux variable. Ce plafonnement peut ??tre exprim?? en valeur absolue (par exemple 4,50 %), ou en valeur relative (par exemple taux initial + 2 %]. Les conditions de ce plafonnement (indice, niveau, dur??e et modalit??s) sont d??finies par le contrat et peuvent inclure ??galement un taux plancher (?? floor ?? ou taux minimum) limitant la variation du taux ?? la baisse. La combinaison d\'un taux plancher et un taux plafond donne un tunnel d\'??volution du taux.';
        definitions.push([toDefine6, definition6]);

        const toDefine7 = 'Capital:';
        const definition7 = 'Montant du cr??dit consenti par le pr??teur. Le capital peut ??tre vers?? en une ou plusieurs fois.';
        definitions.push([toDefine7, definition7]);

        const toDefine8 = 'Capital restant d??:';
        const definition8 = 'Montant du capital restant ?? rembourser par l\'emprunteur ?? une date donn??e. Il sert de base au calcul des int??r??ts de l\'??ch??ance ?? venir. Dans un contrat ?? taux variable, le pr??teur est tenu, une fois par an, de porter ?? la connaissance de l\'emprunteur le montant du capital restant ?? rembourser.';
        definitions.push([toDefine8, definition8]);

        const toDefine9 = 'Charges financi??res:';
        const definition9 = 'Elles comprennent les ??ch??ances de remboursement de pr??ts, les primes d\'assurance obligatoirement li??s, les loyers et les pensions vers??es.';
        definitions.push([toDefine9, definition9]);

        const toDefine10 = 'Cr??dit- relais:';
        const definition10 = 'Cr??dit g??n??ralement in fine accord?? dans l\'attente d\'une rentr??e certaine d\'argent, notamment, lors de la vente d\'un bien immobilier. La banque peut demander ou pas le paiement des int??r??ts pendant la dur??e du cr??dit.';
        definitions.push([toDefine10, definition10]);

        const toDefine11 = 'Diff??r?? partiel (d\'amortissement):';
        const definition11 = 'P??riode pendant laquelle l\'emprunteur ne rembourse aucun capital. Il ne paie que les int??r??ts du pr??t. Les cotisations d\'assurances sont g??n??ralement per??ues pendant la p??riode de diff??r?? d\'amortissement.';
        definitions.push([toDefine11, definition11]);

        const toDefine12 = 'Diff??r?? total (d\'amortissement):';
        const definition12 = 'P??riode pendant laquelle l\'emprunteur ne rembourse ni capital ni int??r??ts. Ces int??r??ts seront ajout??s au capital restant d??. Seules les cotisations d\'assurances sont g??n??ralement per??ues pendant la p??riode de diff??r?? total.';
        definitions.push([toDefine12, definition12]);

        const toDefine13 = 'Dur??e d\'amortissement:';
        const definition13 = 'Dur??e pendant laquelle le cr??dit est rembours?? en capital. Cette dur??e peut ??tre diff??rente de la dur??e du cr??dit si celui-ci comprend une p??riode de diff??r??.';
        definitions.push([toDefine13, definition13]);

        const toDefine14 = 'Ech??ance:';
        const definition14 = 'C\'est le nom de l\'op??ration financi??re consistant ?? rembourser p??riodiquement le cr??dit. Elle est caract??ris??e par sa date et sa p??riodicit??.';
        definitions.push([toDefine14, definition14]);

        const toDefine15 = 'Euribor:';
        const definition15 = 'Taux des d??p??ts interbancaires entre les 57 Banques Europ??ennes les plus repr??sentatives.';
        definitions.push([toDefine15, definition15]);

        const toDefine16 = 'Garantie du pr??t immobilier:';
        const definition16 = 'En cas de d??faillance de paiement des mensualit??s du pr??t immobilier, cette garantie prot??ge la banque qui se fait rembourser le capital restant d??. Les types de garanties les plus fr??quents sont : caution, hypoth??que, privil??ge de pr??teur de deniers (PPD) et nantissement.';
        definitions.push([toDefine16, definition16]);

        const toDefine17 = 'Int??r??ts intercalaires:';
        const definition17 = 'On parle d\'int??r??ts intercalaires par opposition aux int??r??ts d\'une ??ch??ance r??guli??re lorsque ces int??r??ts sont produits, en cas de d??blocage progressifs des fonds, durant la p??riode de d??blocage sur les fonds d??j?? d??bloqu??s. Des int??r??ts intercalaires sont ??galement calcul??s lorsque la dur??e de la premi??re ??ch??ance ne correspond pas exactement ?? la dur??e pr??vue par la p??riodicit?? de remboursement.';
        definitions.push([toDefine17, definition17]);

        const toDefine18 = 'I.R.A. (Indemnit??s de remboursement par anticipation):';
        const definition18 = 'Indemnit??s vers??es ?? la banque, lorsque le cr??dit est rembours?? par l\'emprunteur avant la date pr??vue sur le tableau d\'amortissement, et correspondant ?? 6 mois d\'int??r??ts dus avec un plafond de 3% du capital restant d?? en mati??re de cr??dit immobilier, et 1% en mati??re de cr??dit ?? la consommation.';
        definitions.push([toDefine18, definition18]);

        const toDefine19 = 'Principal:';
        const definition19 = 'Le principal est la partie du capital qui est rembours??e dans une ??ch??ance. C\'est un synonyme peu usit?? de l\'amortissement.';
        definitions.push([toDefine19, definition19]);

        const toDefine20 = 'Remboursement anticip??:';
        const definition20 = 'Possibilit?? pour le client de rembourser partiellement ou totalement un cr??dit avant la fin pr??vue du contrat. Cette possibilit?? peut donner lieu ?? la perception par la banque d\'indemnit??s de remboursement anticip?? (I.R.A).';
        definitions.push([toDefine20, definition20]);

        const toDefine21 = 'Revenus globaux:';
        const definition21 = 'Ils regroupent les revenus salari??s ou assimil??s, les pensions per??ues, les allocations ou revenus sociaux, les revenus locatifs et financiers.';
        definitions.push([toDefine21, definition21]);

        const toDefine22 = 'Tableau d\'amortissement:';
        const definition22 = 'Tableau indiquant le montant d?? par l\'emprunteur ?? chaque ??ch??ance du cr??dit en d??taillant la r??partition du remboursement entre : le capital, les int??r??ts, la prime relative aux assurances (lorsque celles-ci sont obligatoires) et le capital restant d?? apr??s chaque ??ch??ance.';
        definitions.push([toDefine22, definition22]);

        const toDefine23 = 'Taux cap??:';
        const definition23 = 'Taux b??n??ficiant d\'un m??canisme de plafonnement d\'??volution (voir cap de taux).';
        definitions.push([toDefine23, definition23]);

        const toDefine24 = 'Taux actuariel:';
        const definition24 = 'C\'est la technique de taux selon un mod??le actuariel, utilis??e pour transformer le taux annuel en un taux p??riodique.';
        definitions.push([toDefine24, definition24]);

        const toDefine25 = 'Taux annuel effectif global (TAEG):';
        const definition25 = 'Taux annuel actuariel englobant les int??r??ts et l\'ensemble des frais li??s ?? l\'octroi d\'un cr??dit : frais de dossier, de garantie, d\'assurance. Il permet de mesurer le co??t total du cr??dit. Il ne doit jamais d??passer le taux d\'usure en vigueur ?? la date d\'??mission de l\'offre de pr??t. Le TEG, ?? la diff??rence du TAEG, est exprim?? en taux annuel proportionnel et s\'applique principalement aux pr??ts professionnels.';
        definitions.push([toDefine25, definition25]);

        const toDefine26 = 'Taux d\'usure:';
        const definition26 = 'Il correspond au taux maximum que tous les pr??teurs sont autoris??s ?? pratiquer lorsqu\'ils accordent un cr??dit, ces seuils sont fix??s chaque trimestre par la Banque de France.';
        definitions.push([toDefine26, definition26]);

        const toDefine27 = 'Taux d\'endettement:';
        const definition27 = 'Taux exprimant le rapport des charges financi??res sur les revenus globaux.';
        definitions.push([toDefine27, definition27]);

        const toDefine28 = 'Taux proportionnel:';
        const definition28 = 'Technique du taux consistant ?? diviser le taux annuel par le nombre d\'??ch??ances dans l\'ann??e pour obtenir le taux p??riodique.';
        definitions.push([toDefine28, definition28]);

        const toDefine29 = 'Taux p??riodique:';
        const definition29 = 'Taux utilis?? sur le capital restant d?? pour calculer les int??r??ts d\'une ??ch??ance. Le taux p??riodique d??pend de la p??riodicit?? du cr??dit (mensuel, annuel, ...).';
        definitions.push([toDefine29, definition29]);

        const toDefine30 = 'Taux d\'int??r??t (annuel):';
        const definition30 = 'Pourcentage permettant de calculer la r??mun??ration annuelle de la banque sur une somme d\'argent pr??t?? ?? l\'emprunteur.';
        definitions.push([toDefine30, definition30]);

        const toDefine31 = 'Taux nominal ou taux d??biteur (annuel):';
        const definition31 = 'C\'est le taux (annuel) du cr??dit quand celui-ci est calcul?? au taux proportionnel.';
        definitions.push([toDefine31, definition31]);

        const toDefine32 = 'Taux r??visable (ou Taux variable):';
        const definition32 = 'Taux qui peut ??voluer ?? la hausse comme ?? la baisse sur la dur??e du pr??t selon les modalit??s pr??vues dans le contrat de pr??t. L\'??volution du taux d??pend de la variation d\'un ou plusieurs indices et elle peut ??tre mensuelle, trimestrielle, annuelle ou pluriannuelle. Le pr??t ?? taux variable peut comprendre une p??riode ?? taux fixe et des limites de variation.';
        definitions.push([toDefine32, definition32]);

        const aContent = [
            {style: 'smallLineBreak', text: '', pageBreak: 'after'},
            {style: 'h2', text: 'Annexe ' + annexNumber + ': le lexique du cr??dit'},
            {style: 'smallLineBreak', text: ''},
        ];

        const allDefinitions = [];
        definitions.forEach(elem => {
            allDefinitions.push(this.generateDefinition(elem[0], elem[1]));
            allDefinitions.push({style: 'verySmallLineBreak', text: ''});
        })

        aContent.push(...allDefinitions);

        return aContent;
    }


    encodeOfficialDocumentsList(annexNumber) {
        const aContent = [
            {style: 'smallLineBreak', text: '', pageBreak: 'after'},
            {style: 'h2', text: 'Annexe ' + annexNumber + ': listes des pi??ces ?? fournir'},
            {style: 'smallLineBreak', text: ''},

            {text: 'Justificatifs d\'identit?? et de domicile:', style: 'h3bold'},
            {
              ul: [
                'Carte d\'identit??, passeport, titre de s??jour en cours de validit??',
                'Livret de famille et contrat de mariage (??ventuellement jugement de divorce + pension alimentaire)',
                'Derni??re quittance de loyer ou attestation h??bergement ?? titre gratuit',
                'Justificatif EDF ou t??l??phone fixe (moins de 3 mois)'
              ]
            },

            {style: 'bigLineBreak', text: ''},

            {text: 'Si vous ??tes salari??:', style: 'h3bold'},
            {
              ul: [
                '3 derniers bulletins de salaire et bulletin de salaire de d??cembre N-1',
                'Contrat de travail ou attestation de l\'employeur',
                'Justificatif de prime ou bonus sur 3 ans'
              ]
            },

            {style: 'bigLineBreak', text: ''},

            {text: 'Si vous ??tes non salari??:', style: 'h3bold'},
            {
              ul: [
                'Relev??s de comptes bancaires professionnels sur les 3 derniers mois',
                'Bilans et comptes de r??sultat sur les 3 derniers exercices',
                'Extrait K-bis de moins de 3 mois',
                'Statuts de la soci??t?? et compte de r??sultat pr??visionnel'
              ]
            },

            {style: 'bigLineBreak', text: ''},

            {text: 'Justificatifs de votre situation financi??re:', style: 'h3bold'},
            {
              ul: [
                'Avis d\'imposition ou de non imposition N-1 et N-2',
                'Relev??s de comptes bancaires personnels (tous comptes) sur les 3 derniers mois',
                'Si vous avez des cr??dits en cours, tableaux d\'amortissement de l\'offre de pr??t initiale',
                'Tous documents pouvant justifier de votre apport (relev??s de compte-??pargne, etc.)'
              ]
            },

            {style: 'bigLineBreak', text: ''},

            {text: 'Justificatifs relatifs au bien ?? financer:', style: 'h3bold'},
            {
              ul: [
                'Promesse ou compromis de vente, devis travaux ??ventuels, titre de propri??t??',
                'En cas d\'acquisition d\'un bien neuf, contrat de r??servation, devis, plan, permis de construire, assurance',
                'En cas d\'acquisition d\'un bien locatif, estimation des revenus locatifs ?? venir',
                'En cas de constitution d\'une SCI ou d\'achat par une SCI, statuts de la SCI'
              ]
            },

            {style: 'bigLineBreak', text: ''},

            {text: 'Si vous ??tes propri??taire:', style: 'h3bold'},
            {
              ul: [
                'Dernier Avis d\'imposition ?? la Taxe Fonci??re',
                'Estimation de la valeur du bien par une agence immobili??re',
                'En cas de bien locatif, bail de location existant et d??claration 2044 ou 2072 (SCI) relative aux revenus fonciers'
              ]
            },

            {style: 'bigLineBreak', text: ''},

            {text: 'Justificatif de non propri??t?? en cas de Pr??t ?? Taux Z??ro (PTZ):', style: 'h3bold'},
            {
              ul: [
                'Si vous ??tes locataire, bail + une quittance par semestre des 2 derni??res ann??es + derni??re quittance',
                'Si vous ??tes h??berg?? ?? titre gratuit par le locataire des lieux : attestation d\'h??bergement + pi??ce d\'identit?? du locataire + justificatif personnel de domicile + copie du bail',
                'Si vous ??tes h??berg?? ?? titre gratuit par le propri??taire des lieux : attestation d\'h??bergement + pi??ce d\'identit?? du propri??taire + justificatif personnel de domicile + Extrait cadastral en mairie'
              ]
            },

            {style: 'bigLineBreak', text: ''},
            {style: 'bigLineBreak', text: ''},

            {text: 'Cette liste est non exhaustive. Les ??tablissements bancaires peuvent demander des pi??ces compl??mentaires. Si vous estimez que certaines pi??ces non vis??es dans cette liste, sont n??cessaires ?? la compr??hension de votre projet, merci de les communiquer au mandataire.', style: 'h3'},


        ];

        return aContent;
    }



    encodeCreditInformation(annexNumber) {
        const aBrokerPartner = this.extractPartnerContact('BROKER', this.aPartners);

        const aContent = [
            {style: 'smallLineBreak', text: '', pageBreak: 'after'},
            {style: 'h2', text: 'Annexe ' + annexNumber + ': Informations g??n??rale sur les contrats de cr??dit'},
            {style: 'smallLineBreak', text: ''},

            {text: 'L\'Interm??diaire doit assurer la disponibilit?? permanente des informations g??n??rales, claires et compr??hensibles, sur les contrats de cr??dit. Ces derni??res sont d??livr??es sur papier, sur tout autre support durable ou sous forme ??lectronique. Elles sont facilement accessibles et sont fournies gratuitement ?? l\'emprunteur.', style: 'bolditalics'},

            {style: 'bigLineBreak', text: ''},

            {text: 'Les informations sur l\'interm??diaire de cr??dit sont fournies par la soci??t?? ' + aBrokerPartner.name + ', courtier en op??rations de banque et assurance dont le num??ro ORIAS est ' + aBrokerPartner.agreement_number + ', situ??e ?? l\'adresse suivante: ' + this.formatAddress(aBrokerPartner.address.address, aBrokerPartner.address.postal_code, aBrokerPartner.address.city, aBrokerPartner.address.country) + '.'},

            {style: 'bigLineBreak', text: ''},

            {text: 'Ces informations sont g??n??rales et ne s\'appliquent pas forc??ment ?? votre cas particulier. Il s\'agit simplement de vous informer sur ce qui existe en mati??re de cr??dit.', style: 'bold', decoration: 'underline' },

            {style: 'bigLineBreak', text: ''},

            {text: '1. Voici les diff??rents types de cr??dits existants:'},

            {
              style: 'tablecenter',
              table: {
                body: [
                  ['Pr??t libre', 'R??sidence principale ou secondaire ou investissement locatif', ],
                  ['Pr??t 0 % Minist??re du Logement (PTZ+)', 'R??sidence principale \n Neuf ou logements HLM achet??s par leur locataire'],
                  ['Pr??t ?? l\'accession sociale (PAS)', 'R??sidence principale \n Neuf ou ancien'],
                  ['Pr??t Action Logement (Ex. 1% logement)', 'R??sidence principale (location provisoire possible dans certaines conditions) \n Neuf ou ancien'],
                  ['Pr??t conventionn??', 'R??sidence principale ou investissement locatif (si logement neuf devenant r??sidence principale du locataire) \n Neuf ou ancien'],
                  ['Pr??t 0 % des collectivit??s locales', 'R??sidence principale'],
                  ['Pr??t fonctionnaire', 'R??sidence principale ou investissement locatif \n Neuf ou ancien'],
                  ['Plan d\'??pargne logement', 'R??sidence principale neuve ou ancienne \n R??sidence secondaire neuve'],
                ]
              }
            },

            {style: 'bigLineBreak', text: ''},

            { text: [{text: '2. Il est possible de souscrire un cr??dit pour financer '}, {text: 'une r??sidence principale ou secondaire, avec ou sans travaux ; un investissement locatif ; un rachat de pr??t immobilier ; un cr??dit relais ; une restructuration de cr??dits en cours.', style: 'bold'}] },

            {style: 'smallLineBreak', text: ''},

            {text: 'Un cr??dit peut ??tre souscrit sur une dur??e de 5 ?? 30 ans. Le remboursement s\'effectuera mensuellement.'},

            {style: 'bigLineBreak', text: ''},

            {text: '3. Les taux peuvent ??tre fixe, variable ou r??visable:'},
            {
              ul: [
                { text: [{text: 'Un taux fixe ', style: 'bold'}, {text: 'est un taux dont le montant reste inchang?? pendant toute la dur??e d\'un pr??t.'}] },
                { text: [{text: 'Un taux r??visable ou variable ', style: 'bold'}, {text: 'peut ??voluer ?? la hausse comme ?? la baisse sur la dur??e du pr??t selon les modalit??s pr??vues dans l\'offre de pr??t. L\'??volution du taux d??pend de la variation d\'un indice et elle peut ??tre mensuelle, trimestrielle, annuelle ou pluriannuelle. Le pr??t ?? taux variable peut comprendre une p??riode ?? taux fixe et des limites de variation.'}] },
              ]
            },

            {style: 'smallLineBreak', text: ''},

            { text: [{text: 'Les pr??ts en devise ', style: 'bold'}, {text: 'c\'est-??-dire consenti dans une autre monnaie que l\'euro doivent faire l\'objet d\'avertissement particulier par l\'interm??diaire et la banque'}] },

            {style: 'bigLineBreak', text: ''},

            { text: [{text: '4. Il existe plusieurs formes de '}, {text: 's??ret?? r??elle ou personnelle possibles pour garantir le contrat de cr??dit: ', style: 'bold'}] },

            {
              ul: [
                { text: [{text: 'Caution pr??teur ', style: 'bold'}, {text: '(ex. Cr??dit Logement, SACCEF) : Soci??t?? de cautionnement qui s\'engage aupr??s du pr??teur ?? lui r??gler sa cr??ance en cas de d??faillance de l\'emprunteur et prend en charge la proc??dure de recouvrement contre l\'emprunteur. L\'emprunteur doit verser une commission au garant avant la signature du contrat de cr??dit.'}] },

                {style: 'verySmallLineBreak', text: ''},

                { text: [{text: 'Caution Mutuelle: ', style: 'bold'}, {text: 'Mutuelle d\'assurance ou de pr??voyance qui propose un service de cautionnement ?? leurs b??n??ficiaires. Elle s\'engage aupr??s du pr??teur ?? lui r??gler sa cr??ance en cas de d??faillance de l\'emprunteur et prend en charge la proc??dure de recouvrement contre l\'emprunteur. L\'emprunteur doit verser une commission au garant avant la signature du contrat de cr??dit.'}] },

                {style: 'verySmallLineBreak', text: ''},

                { text: [{text: 'Caution personnelle: ', style: 'bold'}, {text: 'La banque demande la signature d\'un acte sous seing priv?? (acte de caution) par l\'emprunteur et le coemprunteur aux termes duquel ils acceptent que leurs biens personnels soient saisis et vendus en cas de d??faillance dans le remboursement du pr??t aux ??ch??ances convenues (Principal, frais et accessoires).'}] },

                {style: 'verySmallLineBreak', text: ''},

                { text: [{text: 'Hypoth??que: ', style: 'bold'}, {text: 'Il s\'agit d\'une garantie immobili??re mat??rialis??e par un acte notari?? par lequel l\'emprunteur et le co-emprunteur acceptent qu\'un bien immobilier soit saisi et vendu par la banque en cas de d??faillance dans le remboursement du pr??t aux ??ch??ances convenues (principale, frais, accessoires).'}] },

                {style: 'verySmallLineBreak', text: ''},

                { text: [{text: 'Privil??ge de pr??teur de deniers (PPD): ', style: 'bold'}, {text: 'Proche de l\'hypoth??que, il est pourtant ?? diff??rencier de celle-ci. Il s\'agit d\'une garantie qui s\'applique sur la partie du financement d??bloqu?? au m??me moment que la signature de l\'acte authentique de vente, lorsque le vendeur a re??u le prix d\'achat. Il fait l\'objet d\'une inscription ?? la conservation des hypoth??ques apr??s la vente et prend rang ?? la date de la vente. Cela signifie que la banque devient prioritaire sur toutes les garanties prises sur le bien immobilier.'}] },

                {style: 'verySmallLineBreak', text: ''},

                { text: [{text: 'Nantissement: ', style: 'bold'}, {text: 'Contrat par lequel un d??biteur remet une chose ?? son cr??ancier afin de garantir la dette. Il peut s\'agir d\'assurancesvie ou de placements. La banque a alors la possibilit?? de vendre ces valeurs pour se faire rembourser en cas de d??faillance de l\'emprunteur au paiement des ??ch??ances convenues du cr??dit.'}] },
              ]
            },

            {style: 'bigLineBreak', text: ''},

            {text: 'Le CLIENT certifie avoir ??t?? inform?? de la n??cessit?? de fournir des ??l??ments exacts et complets afin qu\'il puisse ??tre proc??d?? ?? une ??valuation appropri??e de sa solvabilit??. Un cr??dit ne peut pas ??tre accord?? lorsque la banque ne peut proc??der ?? l\'??valuation de solvabilit?? du fait du refus de l\'emprunteur de communiquer ces informations.', style: 'bold'},

            {style: 'bigLineBreak', text: ''},

            { text: [{text: 'Le CLIENT est inform?? que: '}, {text: 'au plus tard lors de l\'??mission de l\'offre de cr??dit, la banque lui communiquera, par ??crit ou sur un autre support durable, sous la forme d\'une fiche d\'information standardis??e europ??enne (FISE), les informations personnalis??es lui permettant de comparer les diff??rentes offres de cr??dit disponibles sur le march??, d\'??valuer leurs implications et de se d??terminer en toute connaissance de cause sur l\'opportunit?? de conclure un contrat de cr??dit.', style: 'bold'}] },
        ];

        return aContent;
    }


    encodeFinancialDeclaration(annexNumber) {
        const decodedPersons = this.decodePersons(this.aCase, false);

        const financialInfo = []
        if (this.aCase && this.aCase.actor) {

          // ACTOR
          if (this.aCase.actor && this.aCase.actor.type === 'LEGAL_PERSON') {
            financialInfo.push({style: 'h2bold', text: 'Personne morale: apport, revenus, charges et patrimoine'});
            financialInfo.push(...this.prepareFinanceDetails(this.aCase.actor.finance));
          }

          if (this.aCase.actor && this.aCase.actor.type === 'HOUSEHOLD') {
            financialInfo.push({style: 'h2bold', text: 'M??nage: apport, revenus, charges et patrimoine'});
            financialInfo.push(...this.prepareFinanceDetails(this.aCase.actor.finance));
          }

          financialInfo.push({style: 'bigLineBreak', text: ''});

          // PERSONS
          this.aCase.actor.persons.forEach( (person, index) => {
              if (this.aCase.actor.type === 'LEGAL_PERSON' || (this.aCase.actor.type === 'HOUSEHOLD' && person.is_borrower === true)) {
                financialInfo.push({style: 'h2bold', text: decodedPersons[index].courtesy + ' ' + decodedPersons[index].firstName + ' ' + decodedPersons[index].lastName + ': apport, revenus, charges et patrimoine'});
                financialInfo.push(...this.prepareFinanceDetails(person.finance));
                financialInfo.push({style: 'bigLineBreak', text: ''});
              }
            });

          const totalRevenues = this.aCaseForm.computeRevenues();
          const totalCharges = this.aCaseForm.computeCharges();
          financialInfo.push({style: 'h3bold', text: 'Revenus mensuels totaux: ' + LocaleUtils.toLocale(totalRevenues, 'EUR')});
          financialInfo.push({style: 'h3bold', text: 'Charges mensuelles totales: ' + LocaleUtils.toLocale(totalCharges, 'EUR')});
        }

        const aContent = [
            {style: 'smallLineBreak', text: '', pageBreak: 'after'},
            {style: 'h2', text: 'Annexe ' + annexNumber + ': D??claration de situation financi??re'},
            {style: 'smallLineBreak', text: ''},
            ...financialInfo,
            {style: 'smallLineBreak', text: ''},
            {style: '', text: 'Je certifie exacts, sinc??res et exhaustifs les renseignements ci-dessus portant sur mes revenus, charges et cr??dits en cours. Je reconnais avoir ??t?? inform??(e) qu\'en cas de fausse d??claration, je serais constitu??(e) d??biteur/d??bitrice de mauvaise foi et serais susceptible en cons??quence, sous r??serve de l\'appr??ciation des tribunaux, d\'??tre d??chu(e/s/es) du b??n??fice des articles L331-1 ?? L333-8 du Code de la consommation, relatifs au r??glement des situations de surendettement des particuliers et des familles.'},
            {style: 'bigLineBreak', text: ''},
            this.generateSignatureSection(false)
        ];

        return aContent;
    }


    encodeInsuranceQuestions() {
        const question1 = 'D??c??s';
        const question2 = 'PTIA';
        const question3 = 'IPT';
        const question4 = 'IPP';
        const question5 = 'ITT';
        const question6 = 'Perte d\'emploi';

        const aAnswersVector = [];

        const decodedPersons = this.decodePersons(this.aCase, false);
        decodedPersons.forEach( (decodedPerson) => {
            if (decodedPerson) {
              aAnswersVector.push([decodedPerson.courtesy + ' ' + decodedPerson.firstName + ' ' + decodedPerson.lastName + ' (indiquez la quotit??)', '', '', '', '', '', '']);
            }
        });

        const aContent = [
            {style: 'h3', text: 'Compte tenu de votre situation, vous envisagez de souscrire les garanties suivantes:'},
            {style: 'smallLineBreak', text: ''},
            {
              style: 'tablecenter',
              width: '80%',
              table: {
                body: [
                  ['', question1, question2, question3, question4, question5, question6],
                  ...aAnswersVector
                ],
                widths: ['20%', '10%', '10%', '10%', '10%', '10%', '10%',],
              }
            },

        ];

        return aContent;
    }


    encodeInsuranceInformation(annexNumber) {

        const aBrokerPartner = this.extractPartnerContact('BROKER', this.aPartners);
        const yesNo = 'Oui   Non';

        const cellTopLeft = [
          { text: [ { text: 'La'}, {text: ' garantie D??c??s', style: 'bold' }, { text: ' intervient en cas de d??c??s de la personne assur??e. Dans le ou les contrat(s) qui ser(ont) propos??(s), elle cesse ?? une date d\'anniversaire d??finie. La prestation est le remboursement au pr??teur du capital assur??.'} ] },
          {style: 'bigLineBreak', text: ''},
           { text: [ { text: 'La'}, {text: ' garantie Perte totale et irr??versible d\'autonomie (PTIA)', style: 'bold'}, {text: ' intervient lorsque l\'assur?? se trouve dans un ??tat particuli??rement grave, n??cessitant le recours permanent ?? une tierce personne pour exercer les actes ordinaires de la vie. Dans le ou les contrat(s) propos??(s), la garantie PTIA cesse ?? une date d\'anniversaire d??finie. La prestation est le remboursement au pr??teur du capital assur??.'} ] },

          {style: 'bigLineBreak', text: ''},

          { text: [ { text: 'La'}, {text: ' garantie Perte d\'emploi', style: 'bold' }, { text: ' intervient en cas de ch??mage et lorsque l\'assur?? per??oit une allocation de ch??mage vers??e par le P??le Emploi (ex Assedic) ou un organisme assimil??. Elle est accord??e, apr??s une p??riode de franchise, pour une dur??e totale maximale cumul??e qui sera d??finie dans le contrat, quelle que soit la dur??e totale du pr??t. La garantie Perte d\'emploi prend fin en fonction de la date d\'anniversaire pr??vu.'} ] },
          {style: 'bigLineBreak', text: ''},
          {text: 'Vous souhaitez que la prestation soit:', decoration: 'underline'},
          {style: 'bigLineBreak', text: ''},
          { columns: [ {...this.generateSquare('black'), alignment: 'right', width:'5%'}, {text: 'Forfaitaire (le montant qui vous sera vers?? correspond ?? un pourcentage de l\'??ch??ance du pr??t)', alignment: 'left', width:'95%', margin: [ 5, 0, 0, 0 ]} ] },
          { columns: [ {...this.generateSquare('black'), alignment: 'right', width:'5%'}, {text: 'Indemnitaire (le montant qui vous sera vers?? compl??te tout ou partie de votre perte de r??mun??ration)', alignment: 'left', width:'95%', margin: [ 5, 0, 0, 0 ]} ] },
        ];

        const cellTopRight = [
          { text: [ {text: 'ITT: ', style: 'bold' }, { text:'Incapacit?? Temporaire de Travail. Par suite de maladie ou d\'accident survenant pendant la p??riode de garantie, l\'assur?? se trouve dans l\'impossibilit?? compl??te d\'exercer une quelconque activit?? professionnelle. Cet ??tat peut ??tre constat?? par expertise m??dicale de l\'Assureur. La prise en charge au titre de cette garantie est limit??e ?? un nombre de jours d??fini dans le contrat ?? compter de la date d\'arr??t total de travail.'} ] },
          {style: 'bigLineBreak', text: ''},
          { text: [ {text: 'IPP/IPT: ', style: 'bold' }, { text: 'Invalidit?? Permanente Partielle ou Invalidit?? Permanente Totale. L\'assur?? est consid??r?? en ??tat d\'IPP ou d\'ITT lorsque par suite d\'accident ou de maladie son taux d\'invalidit?? est correspond ?? un certain pourcentage permettant de d??finir l\'invalidit?? partielle ou totale'} ] },
          {style: 'bigLineBreak', text: ''},
          {text: 'Vous souhaitez que la prestation ITT soit:', decoration: 'underline'},
          {style: 'bigLineBreak', text: ''},
          { columns: [ {...this.generateSquare('black'), alignment: 'right', width:'5%'}, {text: 'Forfaitaire (le montant qui vous sera vers?? correspond ?? un pourcentage de l\'??ch??ance du pr??t)', alignment: 'left', width:'95%', margin: [ 5, 0, 0, 0 ]} ] },
          { columns: [ {...this.generateSquare('black'), alignment: 'right', width:'5%'}, {text: 'Indemnitaire (le montant qui vous sera vers?? compl??te tout ou partie de votre perte de r??mun??ration)', alignment: 'left', width:'95%', margin: [ 5, 0, 0, 0 ]} ] },
        ];

        const cellBottomLeft = [
          {text: 'Les garanties sont d??taill??es dans la notice du contrat d\'assurance emprunteur qui seule a valeur contractuelle. Lors de nos ??changes, nous avons ??voqu?? les risques li??s au non-remboursement total ou partiel de votre pr??t, en cas de d??c??s/perte totale et irr??versible d\'autonomie (PTIA), ou en cas de probl??me de sant?? vous privant de l\'exercice de votre activit??:'},
          {style: 'smallLineBreak', text: ''},
          { columns: [ {...this.generateSquare('black'), alignment: 'right', width:'5%'}, {text: 'Oui', alignment: 'center', width:'15%'}, {...this.generateSquare('black'), alignment: 'right', width:'5%'}, {text: 'Non', alignment: 'center', width:'15%'} ] },
        ];

        const cellBottomRight = [
          {text: 'Les garanties propos??es, les modalit??s de paiement des cotisations et leur ??volution ??ventuelle ont ??galement ??t?? ??voqu??es:'},
          {style: 'smallLineBreak', text: ''},
          { columns: [ {...this.generateSquare('black'), alignment: 'right', width:'5%'}, {text: 'Oui', alignment: 'center', width:'15%'}, {...this.generateSquare('black'), alignment: 'right', width:'5%'}, {text: 'Non', alignment: 'center', width:'15%'} ] },
        ];


        const aQuestionSection1 = {
          style: 'tablejustify',
          width: '100%',
          alignment: 'justify',
          table: {
            body: [
              [cellTopLeft, cellTopRight]
            ],
            widths: ['*', '*'],
          },
        };

        const aQuestionSection2 = {
          style: 'tablejustify',
          width: '100%',
          alignment: 'justify',
          table: {
            body: [
              [cellBottomLeft, cellBottomRight]
            ],
            widths: ['*', '*'],
          },
        };


        const aContent = [
            {style: 'smallLineBreak', text: '', pageBreak: 'after'},
            {style: 'h2', text: 'Annexe ' + annexNumber + ': Assurance emprunteur'},
            {style: 'smallLineBreak', text: ''},
            {text: 'Le Mandataire, dont l\'adresse est ' + this.formatAddress(aBrokerPartner.address.address, aBrokerPartner.address.postal_code, aBrokerPartner.address.city, aBrokerPartner.address.country)  + ', agit en tant que courtier/mandataire en assurance immatricul?? ?? l\'ORIAS sous le num??ro ' + aBrokerPartner.agreement_number + '.' },
            {style: 'smallLineBreak', text: ''},
            {text: 'Pour toute r??clamation, vous pouvez vous adresser au Mandataire, par courier, ?? l\'adresse figurant ci-dessus.'},
            {style: 'smallLineBreak', text: ''},
            {text: 'L\'assurance emprunteur constitue une garantie ?? la fois pour le pr??teur et l\'emprunteur. Elle est un ??l??ment d??terminant de l\'obtention de votre cr??dit pour certains ??tablissements de cr??dits.'},
            {style: 'smallLineBreak', text: ''},
            {text: 'Le Mandataire ne travaille pas exclusivement avec un ou plusieurs assureurs. Le Client peut obtenir la liste des partenaires assureurs aupr??s du Mandataire et sur demande.'},
            {style: 'bigLineBreak', text: ''},

            {style: 'bolditalics', text: 'Possibilit??s de garanties d\'assurance:', decoration: 'underline'},
            aQuestionSection1,
            {style: 'bigLineBreak', text: ''},
            aQuestionSection2,
            {style: 'bigLineBreak', text: ''},
            this.encodeInsuranceQuestions(),
            {style: 'bigLineBreak', text: ''},
            this.generateSignatureSection(false)
        ];

        return aContent;
    }


    content(): any {
        return [
            ...this.encodeMandateHeader('Mandat d\'interm??diation en op??rations de banque et services de paiement', this.iconUser),
            ...this.encodeMainFirstPart(),
            ...this.encodeCreditInformation('1'),
            ...this.encodeFinancialDeclaration('2'),
            ...this.encodeInsuranceInformation('3'),
            ...this.encodeOfficialDocumentsList('4'),
            ...this.encodeCreditLexic('5'),
        ];
    }



}
