import { TestBed } from '@angular/core/testing';
import { PinelPDFExportService } from './pinel-pdf-export.service';
import { FundingParameters, FundingResults, PinelParameters, PinelResults } from 'src/app/_api';

describe('PinelPDFExportService', () => {

  let aPinelPDFExportService: PinelPDFExportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    aPinelPDFExportService = TestBed.inject(PinelPDFExportService);
  });


  it('Pinel summary must be correctly formatted', () => {

    const pinelParams: PinelParameters = { funding_fees: { broker_fees: 100, file_management_fees: 200}, loans: [], project: { type: 'PINEL', pinel_duration: 9, monthly_rent_value: 500} };
    const pinelResults: PinelResults = {maximum_rent: 852.56, income_information: {average_rate: 0.16, remaining_capacity_in_slice: 38917, slice_number: 3, cehr: 0, family_coefficient: 3, income_tax: 17194}, notary_fees: 5411.96, funding_plan: { status: 'OPTIMAL', summary: { zone: 'A'} }, pinel_table:  {price_evolution: [200000, 200600, 201201.8, 201805.41, 202410.82, 203018.05, 203627.11, 204237.99, 204850.7, 205465.26, 206081.65, 206699.9, 207320, 207941.96, 208565.78, 209191.48, 209819.05, 210448.51, 211079.86, 211713.1], renting_evolution: [800, 803.2, 806.41, 809.64, 812.88, 816.13, 819.39, 822.67, 825.96, 829.27, 832.58, 835.91, 839.26, 842.61, 845.98, 849.37, 852.77, 856.18, 859.6, 863.04], renting_received: [9600, 9638.4, 9676.95, 9715.66, 9754.52, 9793.54, 9832.72, 9872.05, 9911.54, 9951.18, 9990.99, 10030.95, 10071.07, 10111.36, 10151.8, 10192.41, 10233.18, 10274.11, 10315.21, 10356.47], interests: [2004.6, 1911.25, 1816.95, 1721.71, 1625.51, 1528.35, 1430.21, 1331.08, 1230.96, 1129.83, 1027.69, 924.52, 820.31, 715.06, 608.75, 501.37, 392.91, 283.36, 172.72, 60.96], deductible_charges: [1152, 1156.61, 1161.23, 1165.88, 1170.54, 1175.23, 1179.93, 1184.65, 1189.38, 1194.14, 1198.92, 1203.71, 1208.53, 1213.36, 1218.22, 1223.09, 1227.98, 1232.89, 1237.83, 1242.78], renting_result: [6443.4, 6570.54, 6698.77, 6828.07, 6958.47, 7089.97, 7222.58, 7356.32, 7491.19, 7627.21, 7764.38, 7902.72, 8042.23, 8182.94, 8324.84, 8467.95, 8612.29, 8757.86, 8904.67, 9052.74], tax_on_renting_result: [0, 1971.16, 2009.63, 2048.42, 2087.54, 2126.99, 2166.77, 2206.9, 2247.36, 2288.16, 2329.31, 2370.82, 2412.67, 2454.88, 2497.45, 2540.39, 2583.69, 2627.36, 2671.4, 2715.82], tax_reduction: [0, -4188.24, -4188.24, -4188.24, -4188.24, -4188.24, -4188.24, -4188.24, -4188.24, -4188.24, -2094.12, -2094.12, -2094.12, 0, 0, 0, 0, 0, 0, 0], resulting_tax_impact: [0, -2217.08, -2178.61, -2139.82, -2100.7, -2061.25, -2021.47, -1981.34, -1940.88, -1900.08, 235.19, 276.7, 318.55, 2454.88, 2497.45, 2540.39, 2583.69, 2627.36, 2671.4, 2715.82], treasury: [7849.5, 598.64, 603.18, 607.9, 612.82, 617.94, 623.25, 628.76, 634.47, 640.39, 2740.63, 2746.96, 2753.51, 4854.39, 4861.37, 4868.57, 4875.99, 4883.64, 4891.52, 4899.63]}};

    aPinelPDFExportService.aParams = pinelParams;
    aPinelPDFExportService.aFundingPDFExportService.aParams = pinelParams;
    aPinelPDFExportService.aPinelResults = pinelResults;

    // console.log(JSON.stringify(aPinelPDFExportService.summaryPinel()));
    const expectedResult = JSON.stringify([{style:'h2',text:'Paramètres du dispositif Pinel',alignment:'center',pageOrientation:'landscape',pageBreak:'before'},[{columns:[{width:'50%',text:'Durée du dispositif:'},{width:'25%',style:'caseStyleBold',text:'9 ans',alignment:'right'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Loyer mensuel:'},{width:'25%',style:'caseStyleBold',text:'500,00 €',alignment:'right'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Évolution annuelle du loyer:'},{width:'25%',style:'caseStyleBold',text:'%',alignment:'right'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Évolution annuelle du prix:'},{width:'25%',style:'caseStyleBold',text:'%',alignment:'right'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Charges locatives (en % du loyer):'},{width:'25%',style:'caseStyleBold',text:'%',alignment:'right'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Régime d\'imposition:'},{width:'25%',style:'caseStyleBold',alignment:'right'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Limite de loyer:'},{width:'25%',style:'caseStyleBold',text:'852,56 €',alignment:'right'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Zone:'},{width:'25%',style:'caseStyleBold',text:'A',alignment:'right'},{width:'25%',style:'caseStyleBold',text:''}]}],{style:'h2',text:'Détail du dispositif Pinel année après année',alignment:'center',pageOrientation:'landscape'},{style:'table',headerRows:1,widths:['100%'],table:{body:[[{style:'thead',text:'Année',alignment:'center'},{style:'thead',text:'Évolution du prix',alignment:'center'},{style:'thead',text:'Évolution du loyer',alignment:'center'},{style:'thead',text:'Loyer perçus',alignment:'center'},{style:'thead',text:'Intérêt d\'emprunt',alignment:'center'},{style:'thead',text:'Charges locatives',alignment:'center'},{style:'thead',text:'Résultat locatif',alignment:'center'},{style:'thead',text:'Impôts sur le résultat locatif',alignment:'center'},{style:'thead',text:'Impact Pinel sur l\'impot',alignment:'center'},{style:'thead',text:'Réduction d\'impot',alignment:'center'},{style:'thead',text:'Besoin de trésorerie',alignment:'center'}],[1,'200 000,00','800,00','9 600,00','2 004,60','1 152,00','6 443,40','0,00','0,00','0,00','7 849,50'],[2,'200 600,00','803,20','9 638,40','1 911,25','1 156,61','6 570,54','1 971,16','-4 188,24','-2 217,08','598,64'],[3,'201 201,80','806,41','9 676,95','1 816,95','1 161,23','6 698,77','2 009,63','-4 188,24','-2 178,61','603,18'],[4,'201 805,41','809,64','9 715,66','1 721,71','1 165,88','6 828,07','2 048,42','-4 188,24','-2 139,82','607,90'],[5,'202 410,82','812,88','9 754,52','1 625,51','1 170,54','6 958,47','2 087,54','-4 188,24','-2 100,70','612,82'],[6,'203 018,05','816,13','9 793,54','1 528,35','1 175,23','7 089,97','2 126,99','-4 188,24','-2 061,25','617,94'],[7,'203 627,11','819,39','9 832,72','1 430,21','1 179,93','7 222,58','2 166,77','-4 188,24','-2 021,47','623,25'],[8,'204 237,99','822,67','9 872,05','1 331,08','1 184,65','7 356,32','2 206,90','-4 188,24','-1 981,34','628,76'],[9,'204 850,70','825,96','9 911,54','1 230,96','1 189,38','7 491,19','2 247,36','-4 188,24','-1 940,88','634,47'],[10,'205 465,26','829,27','9 951,18','1 129,83','1 194,14','7 627,21','2 288,16','-4 188,24','-1 900,08','640,39'],[11,'206 081,65','832,58','9 990,99','1 027,69','1 198,92','7 764,38','2 329,31','-2 094,12','235,19','2 740,63'],[12,'206 699,90','835,91','10 030,95','924,52','1 203,71','7 902,72','2 370,82','-2 094,12','276,70','2 746,96'],[13,'207 320,00','839,26','10 071,07','820,31','1 208,53','8 042,23','2 412,67','-2 094,12','318,55','2 753,51'],[14,'207 941,96','842,61','10 111,36','715,06','1 213,36','8 182,94','2 454,88','0,00','2 454,88','4 854,39'],[15,'208 565,78','845,98','10 151,80','608,75','1 218,22','8 324,84','2 497,45','0,00','2 497,45','4 861,37'],[16,'209 191,48','849,37','10 192,41','501,37','1 223,09','8 467,95','2 540,39','0,00','2 540,39','4 868,57'],[17,'209 819,05','852,77','10 233,18','392,91','1 227,98','8 612,29','2 583,69','0,00','2 583,69','4 875,99'],[18,'210 448,51','856,18','10 274,11','283,36','1 232,89','8 757,86','2 627,36','0,00','2 627,36','4 883,64'],[19,'211 079,86','859,60','10 315,21','172,72','1 237,83','8 904,67','2 671,40','0,00','2 671,40','4 891,52'],[20,'211 713,10','863,04','10 356,47','60,96','1 242,78','9 052,74','2 715,82','0,00','2 715,82','4 899,63'],['TOTAL','','','199 474,11','21 238,10','23 936,90','154 299,14','44 356,72','-43 976,52','380,20','55 793,06']],widths:['*','*','*','*','*','*','*','*','*','*','*']}}]);
    expect(JSON.stringify(aPinelPDFExportService.summaryPinel())).toBe(expectedResult);
  });


});