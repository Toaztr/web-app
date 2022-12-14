import { Injectable } from '@angular/core';
import { Case, Budget, BudgetParameters, BudgetResults, Individual, LegalPerson, Partner, ActivePartner, FundingResults, Taeg, SmoothableCharge, BridgeLoan, AvailableLoan, Loan, FundingParameters } from '../../_api/model/models';
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
export class AdvicePDFExportService extends PDFExportService {

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


    exportToPDF(caseId: string, caseName: string, aCaseForm: CaseFormService, totalCost, loansAmountToFund, aPartners: ActivePartner[], params: any, results: FundingResults, iconUser: any): any {

        this.aCase = aCaseForm.asCase();
        this.aCaseForm = aCaseForm;
        this.caseId = caseId;
        this.caseName = caseName;
        this.iconUser = iconUser;
        this.aPartners = aPartners;
        this.totalCost = totalCost;
        this.loansAmountToFund = loansAmountToFund;
        this.summary = results.summary;
        this.aParams = params;
        this.aResults = results;

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


    // Encode the contact section into PDF format
    encodeAdviceHeader(title: any, iconUser: any) {
      const aBrokerPartner = this.extractPartnerContact('BROKER', this.aPartners);
      const aBrokerRepresenting = this.extractPartnerContact('BROKER', this.aPartners, true);
      const aDestinationContact = this.generateDestinationContact()

      // Format broker name depending if we have or not the courtesy
      const brokerName = this.formatContactName(aBrokerPartner);;
      // Format broker name depending if we have or not the courtesy
      const representantName = this.formatContactName(aBrokerRepresenting);;

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
        {style: 'h3bold', text: 'Le(s) Emprunteur(s):'},
        {style: 'bigLineBreak', text: ''},
        ...aDestinationContact,
        {style: 'bigLineBreak', text: ''},
        {text: 'Ci-apr??s indiff??remment d??nomm??s conjointement le Client ou Mandant.', style: 'bold'},
        {style: 'bigLineBreak', text: ''},

        {style: 'h3bold', text: 'Votre Mandataire:'},
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


    encodeChargesBeforeAfter() {
        const decodedPersons = this.decodePersons(this.aCase, false);

        const chargesInfo = [];
        if (this.aCase && this.aCase.actor && this.aCase.actor.finance) {
            const charges = this.formatChargesTable(this.aCase.actor.finance.charges);
            const noCharges = charges ? '' : 'Aucunes';
            chargesInfo.push({style: 'bigLineBreak', text: ''});

            // ACTOR
            if (this.aCase.actor && this.aCase.actor.type === 'LEGAL_PERSON') {
              chargesInfo.push({style: 'h3', text: 'Charges financi??re de la Personne morale avant projet: ' + noCharges});
            }
            if (this.aCase.actor && this.aCase.actor.type === 'HOUSEHOLD') {
              chargesInfo.push({style: 'h3', text: 'Charges financi??re du M??nage avant projet: ' + noCharges});
            }

            chargesInfo.push({style: 'smallLineBreak', text: ''});
            if (charges) {
              chargesInfo.push(this.formatChargesTable(this.aCase.actor.finance.charges));
            }
            chargesInfo.push({style: 'bigLineBreak', text: ''});
          }

          // PERSONS
          if (this.aCase && this.aCase.actor && this.aCase.actor.persons) {
            this.aCase.actor.persons.forEach( (person, index) => {
                if (this.aCase.actor.type === 'LEGAL_PERSON' || (this.aCase.actor.type === 'HOUSEHOLD' && person.is_borrower === true && person.finance)) {
                  chargesInfo.push({style: 'h3', text: 'Charges financi??res de ' + decodedPersons[index].courtesy + ' ' + decodedPersons[index].firstName + ' ' + decodedPersons[index].lastName + ' avant projet:'});
                  chargesInfo.push({style: 'smallLineBreak', text: ''});
                  chargesInfo.push((this.formatChargesTable(person.finance.charges) === null ? {text: 'Aucune.'} : this.formatChargesTable(person.finance.charges)));
                  chargesInfo.push({style: 'bigLineBreak', text: ''});
                }
              });
          }

        return chargesInfo;
    }


    encodeBrokerFees() {
      const aContent = [
            {text: '', pageOrientation: 'portrait', pageBreak: 'after'},
            {style: 'h3bold', text: 'R??mun??ration du mandataire'},
            {style: 'bigLineBreak', text: ''},
            {text: 'Le Mandant reconna??t devoir au Mandataire, en r??mun??ration de sa mission, la somme de _______________ euros sous forme de frais de dossier. Cette somme ne devra ??tre vers??e au Mandataire qu\'apr??s le d??blocage des fonds conform??ment ?? la r??glementation en vigueur (frais de dossier exon??r??s de TVA).', alignment: 'justify'},
            {style: 'smallLineBreak', text: ''},
            {text: 'Loi MURCEF : Article L 321-2 de la loi n??2001-1168 du 11 D??cembre 2001: "Aucun versement, de quelque nature que ce soit, ne peut ??tre exig?? d\'un particulier, avant l\'obtention d\'un ou plusieurs pr??ts d\'argent"', alignment: 'justify'},
            {text: 'Par ailleurs la banque versera au Mandataire une commission bancaire fix??e suivant la convention de partenariat sign??e.', alignment: 'justify'}
       ];

       return aContent;
    }



    encodeChargesRecap() {
      const aPlanSummary = LoanUtils.generateFundingSummary(this.aParams, this.aResults);
      const aContent = [
            {style: 'h3bold', text: 'R??capitulatif des d??penses mensuelles du (ou des) emprunteur(s)'},
            ...this.encodeChargesBeforeAfter(),
            {style: 'bigLineBreak', text: ''},
            {style: 'h3', text: 'Auxquelles s\'ajoute apr??s projet une mensualit?? maximale de: ' + this.formatMonetaryNbr(this.summary.effective_maximal_monthly_payment) + ', ?? r??partir entre les diff??rents emprunteurs.'},
            {style: 'smallLineBreak', text: ''},
            {style: 'h3', text: 'Pour un reste ?? vivre minimal de: ' + this.formatMonetaryNbr(aPlanSummary.remaining_for_living) + ', ?? partager entre les diff??rents emprunteurs.'},
       ];

       return aContent;
    }


    encodeClientAgreement() {
      const aContent = [
            {style: 'h3bold', text: 'Accord du Mandant sur la proposition obtenue'},
            {style: 'bigLineBreak', text: ''},
            {style: 'h3', text: 'Le Mandant reconna??t que le Mandataire lui a fourni toutes les informations n??cessaires ?? la compr??hension et la comparaison des diff??rents types de contrats disponibles sur le march??.', alignment: 'justify'},
            {style: 'smallLineBreak', text: ''},
            {text: 'Le Mandant certifie qu\'un nombre suffisant de simulations lui ont ??t?? pr??sent??es pour fonder un choix ??clair??.', alignment: 'justify'},
            {style: 'smallLineBreak', text: ''},
            {text: 'Le Mandant reconna??t avoir dispos?? de toutes les informations n??cessaires pour faire son choix de financement et d??clare conna??tre et accepter les caract??ristiques de l\'accord de pr??t(s) obtenu.', alignment: 'justify'},
            {style: 'smallLineBreak', text: ''},
            {text: 'Le Mandant reconna??t avoir ??t?? inform?? des r??gles applicables aux op??rations de banque et de l\'??tendue de ses devoirs et obligations en tant qu\'emprunteur(s).', alignment: 'justify'},
            {style: 'smallLineBreak', text: ''},
            {text: 'Le Mandant autorise le Mandataire ?? informer le vendeur ou son interm??diaire de l\'accord de pr??t obtenu.', alignment: 'justify'},
            {style: 'smallLineBreak', text: ''},
            {text: 'Un cr??dit vous engage et doit ??tre rembours??. V??rifiez vos capacit??s de remboursement avant de vous engager. Les impay??s aff??rents au(x) cr??dit(s) sollicit??(s) peuvent avoir de graves cons??quences sur votre patrimoine et vous pourriez ??tre redevable(s), ?? l\'??gard de la banque, du capital restant d??, major?? d\'int??r??ts de retard, ainsi que d\'une indemnit??.', alignment: 'justify'}
       ];
       return aContent;
    }


    encodeInsuranceAnnex(annex) {

        const aPreparedInsuranceSummary = {
            style: 'table',
            margin: [0, 0, 0, 0],
            headerRows: 1,
            widths: ['auto'],
            table: {
                body: [
                    LoanUtils.summaryInsuranceTableHeader.map(
                        v => ({style: 'thead', text: v, alignment: 'center'})
                    )
                ]
            }
        };

        const insurancesRecap = (this.aResults && this.aResults.loans) ? LoanUtils.generateInsurancesRecap(this.aResults.loans) : [];

        let aInsuranceSummary = null;
        if (insurancesRecap.length) {
          aInsuranceSummary = aPreparedInsuranceSummary;
          aInsuranceSummary.table.body.push(...insurancesRecap);
        }

      const aContent = [
            {text: '', pageOrientation: 'portrait', pageBreak: 'after'},
            {style: 'h3centerbold', text: 'Annexe ' +  annex + ': ASSURANCES'},
            {style: 'bigLineBreak', text: ''},
            { columns: [ {...this.generateSquare('black'), alignment: 'right', width:'5%'}, {text: 'Le Client n\'a pas recours au service d\'interm??diation en assurances qui lui a ??t?? propos??. Il fait le choix de prendre en charge seul la recherche d\'une solution d\'assurance. Il est inform?? que l\'??tablissement de cr??dit est tenu de lui remettre une fiche standardis??e d\'information portant sur les crit??res de couverture exig??s par l\'??tablissement de cr??dit, le taux annuel effectif de l\'assurance (TAEA) applicable, le montant de la cotisation et le co??t total de la protection, lui permettant ainsi de comparer les diff??rentes offres du march??.', alignment: 'justify', width:'95%', margin: [ 5, 0, 0, 0 ] } ] },
            {style: 'bigLineBreak', text: ''},
            this.generateSignatureSection(false),
            {style: 'bigLineBreak', text: ''},
            {style: 'bold', text: 'La solution d\'assurance que vous envisagez :', alignment: 'justify'},
            {style: 'bigLineBreak', text: ''},
            {text: 'Compte tenu des besoins exprim??s par le Client, nous vous proposons le contrat d\'Assurance avec les caract??ristiques suivantes :', alignment: 'justify'},
            {style: 'smallLineBreak', text: ''},
            { columns: [ aInsuranceSummary ] },

            {text: '', pageOrientation: 'portrait', pageBreak: 'after'},

            {text: 'Le Client reconna??t avoir re??u et pris connaissance d\'une fiche standardis??e d\'information portant sur les crit??res de couverture exig??s par l\'??tablissement de cr??dit, le taux annuel effectif de l\'assurance (TAEA) applicable, le montant de la cotisation et le co??t total de la protection, lui permettant ainsi de comparer les diff??rentes offres du march??.', alignment: 'justify'},
            {style: 'smallLineBreak', text: ''},
            {text: 'Aussi pr??cis que soient les informations et les conseils donn??s, il est tr??s important que vous lisiez attentivement la notice de votre contrat d\'assurance emprunteur qui vous sera remise au moment de votre adh??sion/souscription. Cette notice constitue le document juridique contractuel exprimant les droits et obligations de l\'assur?? et de l\'assureur.', alignment: 'justify'},
            {style: 'smallLineBreak', text: ''},
            {text: 'Nous attirons votre attention sur les paragraphes de la notice consacr??s notamment aux risques exclus, ?? la dur??e d\'adh??sion/souscription de votre contrat, aux d??lais de carence (p??riode durant laquelle l\'assur?? ne peut pas demander la mise en ??uvre de la garantie), de franchise (p??riode durant laquelle le sinistre reste ?? la charge de l\'assur??), aux d??finitions des garanties, les risques assur??s et les dates d\'expirations de ces garanties date d\'expiration.', alignment: 'justify'},
            {style: 'smallLineBreak', text: ''},
            {text: 'Nous insistons sur l\'importance de la pr??cision et de la sinc??rit?? des r??ponses apport??es au questionnaire d\'adh??sion/ souscription au contrat d\'assurance emprunteur, y compris la partie questionnaire m??dical. Une fausse d??claration intentionnelle entra??nerait la nullit?? du contrat et la d??ch??ance de la garantie.', alignment: 'justify'},
            {style: 'smallLineBreak', text: ''},
            {style: 'bold', text: 'La cotisation de(s) l\'assurance(s) est:', alignment: 'justify', decoration: 'underline'},
            {style: 'smallLineBreak', text: ''},
            { columns: [
              {...this.generateSquare('black'), alignment: 'right', width:'5%'}, {text: 'Constante', alignment: 'justify', width:'20%', margin: [ 5, 0, 0, 0 ] },
              {...this.generateSquare('black'), alignment: 'right', width:'5%'}, {text: 'Non constante', alignment: 'justify', width:'20%', margin: [ 5, 0, 0, 0 ] },
              {...this.generateSquare('black'), alignment: 'right', width:'5%'}, {text: 'D??gressive', alignment: 'justify', width:'20%', margin: [ 5, 0, 0, 0 ] },
              {...this.generateSquare('black'), alignment: 'right', width:'5%'}, {text: 'Progressive', alignment: 'justify', width:'20%', margin: [ 5, 0, 0, 0 ] },
            ] },
            {style: 'smallLineBreak', text: ''},
            { columns:  [
              {...this.generateSquare('black'), alignment: 'right', width:'5%'}, {text: 'Garantie sur toute la dur??e du pr??t', alignment: 'justify', width:'95%', margin: [ 5, 0, 0, 0 ] }
            ] },
            {style: 'smallLineBreak', text: ''},
            { columns:  [
              {...this.generateSquare('black'), alignment: 'right', width:'5%'}, {text: 'R??visable dans les conditions suivantes', alignment: 'justify', width:'95%', margin: [ 5, 0, 0, 0 ] }
            ] },
            {style: 'smallLineBreak', text: ''},
            { columns:  [
              {...this.generateSquare('black'), alignment: 'right', width:'15%' }, {text: 'Suite ?? une reprise de la consommation du tabac', alignment: 'justify', width:'75%', margin: [ 5, 0, 0, 0 ] }
            ] },
            {style: 'smallLineBreak', text: ''},
            { columns:  [
              {...this.generateSquare('black'), alignment: 'right', width:'15%' }, {text: 'Suite ?? un changement de situation', alignment: 'justify', width:'75%', margin: [ 5, 0, 0, 0 ] }
            ] },
            {style: 'smallLineBreak', text: ''},
            { columns:  [
              {...this.generateSquare('black'), alignment: 'right', width:'15%' }, {text: 'Suite ?? un changement de domicile', alignment: 'justify', width:'75%', margin: [ 5, 0, 0, 0 ] }
            ] },
            {style: 'smallLineBreak', text: ''},
            { columns:  [
              {...this.generateSquare('black'), alignment: 'right', width:'15%' }, {text: 'Suite ?? la pratique de nouvelles activit??s (professionelles ou sportives)', alignment: 'justify', width:'75%', margin: [ 5, 0, 0, 0 ] }
            ] },
            {style: 'smallLineBreak', text: ''},
            { columns:  [
              {...this.generateSquare('black'), alignment: 'right', width:'15%' }, {text: 'En cas de d??ficit du contrat groupe (r??ajustement tarifaire)', alignment: 'justify', width:'75%', margin: [ 5, 0, 0, 0 ] }
            ] },
            {style: 'smallLineBreak', text: ''},
            {text: 'Le co??t total de l\'assurance emprunteur sur la dur??e du pr??t est pr??cis?? ci-dessus. Il inclue le montant des ??ventuels frais annexes li??s ?? l\'assurance (frais de dossier, ???). Il s\'agit d\'un tarif indicatif avant examen du dossier et du questionnaire m??dical par le service m??dical de l\'assureur et hors cas de surprime. Lorsqu\'une personne pr??sente un risque aggrav?? de sant??, les garanties et le tarif doivent ??tre adapt??s. Dans ce cas, les dispositions de la convention AERAS, s\'Assurer et Emprunter avec un Risque Aggrav?? de Sant??, sont appliqu??es (cf. www.aeras-infos.fr)', alignment: 'justify'},

            {text: '', pageOrientation: 'portrait', pageBreak: 'after'},

            {style: 'bold', text: 'Le Client d??clare et reconna??t: ', alignment: 'justify', decoration: 'underline'},
            {style: 'smallLineBreak', text: ''},
            {
              ul: [
                { text: 'Que la prestation d\'assurance propos??e correspond ?? ses exigences et besoins au regard des informations re??ues et fournies,'},
                {style: 'smallLineBreak', text: ''},
                { text: 'Avoir re??ue une information sur l\'??tendue et la d??finition des garanties propos??es,'},
                {style: 'smallLineBreak', text: ''},
                { text: 'Avoir pris connaissance et ??tre en possession des conditions g??n??rales d\'assurance de pr??t.'},
              ]
            },
            {style: 'bigLineBreak', text: ''},
            {text: 'Il reconna??t avoir pris connaissance du contenu du pr??sent document pr??alablement ?? la signature du contrat d\'assurance propos?? ci-dessus et en avoir re??u un exemplaire.'},
            this.generateSignatureSection(true, 'Bon pour accord'),
       ];
       return aContent;
    }


    encodeBody() {
        const aSummary = {
            style: 'table',
            margin: [0, 0, 0, 0],
            headerRows: 1,
            widths: ['auto'],
            table: {
                body: [
                    LoanUtils.summaryTableHeader.map(
                        v => ({style: 'thead', text: v, alignment: 'center'})
                    )
                ]
            }
        };

        const aPreparedInsuranceSummary = {
            style: 'table',
            margin: [0, 0, 0, 0],
            headerRows: 1,
            widths: ['auto'],
            table: {
                body: [
                    LoanUtils.summaryInsuranceTableHeader.map(
                        v => ({style: 'thead', text: v, alignment: 'center'})
                    )
                ]
            }
        };

        const loansRecap = LoanUtils.generateLoanRecap(this.aResults.loans).loansRecap;
        const insurancesRecap = LoanUtils.generateInsurancesRecap(this.aResults.loans);
        const taegs = this.generateTaegSection(this.aResults.taegs);


        aSummary.table.body.push(...loansRecap);

        let aInsuranceSummary = null;
        if (insurancesRecap.length) {
          aInsuranceSummary = aPreparedInsuranceSummary;
          aInsuranceSummary.table.body.push(...insurancesRecap);
        }

        const aContent = [
            {text: '', pageOrientation: 'landscape', pageBreak: 'after'},
            {style: 'h3centerbold', text: 'Proposition de financement obtenue'},
            {style: 'smallLineBreak', text: ''},

            {text: 'Le Mandant reconna??t avoir obtenu par l\'interm??diaire du Mandataire l\'accord de principe de la banque ??BanqueRaison?? pour la r??alisation du plan de financement suivant: '},
            {style: 'bigLineBreak', text: ''},
            { columns: [ { width: '15%', text: '' }, aSummary, { width: '*', text: '' } ] },
            {style: 'smallLineBreak', text: ''},
            {text: 'Note: la caution (ou garantie) permet au pr??teur d\'obtenir le remboursement partiel ou complet du montant du cr??dit en cas de d??faut de paiement de l\'emprunteur.'},
            {style: 'bigLineBreak', text: ''},
            { columns: [ { width: '20%', text: '' }, aInsuranceSummary, { width: '*', text: '' } ] },
            {style: 'bigLineBreak', text: ''},
            ...taegs,
            {style: 'bigLineBreak', text: ''},
            {text: 'Les ??l??ments indiqu??s sont susceptibles d\'??tre modifi??s par l\'??tablissement bancaire. Ils seront mentionn??s de mani??re d??finitive dans l\'offre de pr??t.'},


            {text: '', pageOrientation: 'portrait', pageBreak: 'after'},
            {style: 'h3bold', text: 'Conditions de validit?? de l\'accord de principe de la banque'},
            {style: 'smallLineBreak', text: ''},

            {text: 'L\'accord de principe de la banque a ??t?? ??mis pour une dur??e de _________ jours et sous r??serve de satisfaire les conditions suivantes :'},
            {style: 'smallLineBreak', text: ''},
            { columns: [ {...this.generateSquare('black'), alignment: 'right', width:'5%'}, {text: 'Ouverture de compte', alignment: 'center', width:'25%'}, {...this.generateSquare('black'), alignment: 'right', width:'5%'}, {text: 'Domiciliation des revenus', alignment: 'center', width:'25%'} ] },
            {style: 'smallLineBreak', text: ''},
            {
              ul: [
                { text: '_______________________________________________________________________________________________________________'},
                {style: 'smallLineBreak', text: ''},
                { text: '_______________________________________________________________________________________________________________'},
                {style: 'smallLineBreak', text: ''},
                { text: '_______________________________________________________________________________________________________________'},
                {style: 'smallLineBreak', text: ''},
                { text: '_______________________________________________________________________________________________________________'},
              ]
            },
            {style: 'bigLineBreak', text: ''},
            {text: 'En cas de remboursement anticip?? du ou des cr??dit(s) sollicit??(s), le Mandant pourra ??tre redevable ?? l\'??gard de la banque, d\'une indemnit?? d??crite dans l\'offre de pr??t(s).'},

            {style: 'bigLineBreak', text: ''},
            {style: 'bigLineBreak', text: ''},
            {style: 'bigLineBreak', text: ''},

            ...this.encodeChargesRecap(),

            {style: 'bigLineBreak', text: ''},
            {style: 'bigLineBreak', text: ''},
            {style: 'bigLineBreak', text: ''},

            ...this.encodeBrokerFees(),

            {style: 'bigLineBreak', text: ''},
            {style: 'bigLineBreak', text: ''},

            ...this.encodeClientAgreement(),

            {style: 'bigLineBreak', text: ''},
            {style: 'bigLineBreak', text: ''},

            this.generateSignatureSection(true, 'Bon pour accord')

        ];
        return aContent;
    }



    content(): any {
        return [
            ...this.encodeAdviceHeader('Fiche conseil', this.iconUser),
            ...this.encodeBody(),
            ...this.encodeInsuranceAnnex('1')
        ];
    }



}
