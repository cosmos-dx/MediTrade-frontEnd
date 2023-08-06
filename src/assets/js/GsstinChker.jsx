import React from 'react';

const GstinChker = (gnumber) => {
 
  const posdict = {
        '01':'Jammu And Kashmir',
        '02':'Himachal Pradesh',
        '03':'Punjab',
        '04':'Chandigarh',
        '05':'Uttarakhand',
        '06':'Haryana',
        '07':'Delhi',
        '08':'Rajasthan',
        '09':'Uttar Pradesh',
        '10':'Bihar',
        '11':'Sikkim',
        '12':'Arunachal Pradesh',
        '13':'Nagaland',
        '14':'Manipur',
        '15':'Mizoram',
        '16':'Tripura',
        '17':'Meghalaya',
        '18':'Assam',
        '19':'West Bengal',
        '20':'Jharkhand',
        '21':'Odisa',
        '22':'Chattisgarh',
        '23':'Madhya Pradesh',
        '24':'Gujarat',
        '25':'Daman and Diu',
        '26':'Dadar and Nagar Haveli',
        '27':'Maharashtra',
        '28':'Andra Pradesh',
        '29':'Karanataka',
        '30':'Goa',
        '31':'Lakshwadeep',
        '32':'Kerala',
        '33':'Tamil Nadu',
        '34':'Punducherry',
        '35':'Andaman and Nicobar Island',
        '36':'Telangana',
        '37':'Andra Pradesh(New)', 
        '15':true,
        'C': 'COMPANY',
        'P': 'PERSON',
        'H': 'HUF',
        'F': 'FIRM',
        'A': '(AOP)',
        'T': 'AOP(TRUST)',
        'B': '(BOI)',
        'L': 'LOCAL AUTHORITY',
        'J': 'JURIDICAL PERSON',
        'G': 'GOVERNMENT',
        'true': ['Writing..', 'blue'],
        'false': ['Wrong Input', 'red'],
    }

  let gstVal = gnumber.toUpperCase();
  let firstmess = "";
  let secondmess = "";
  let eMMessage = "No Errors";
  let statecode = gstVal.substring(0, 2);
  let cpfind = gstVal.substring(5, 6); // company person firm finder
  let patternstatecode = /^[0-9]{2}$/;
  let threetoseven = gstVal.substring(2, 7);
  let patternthreetoseven = /^[A-Z]{5}$/;
  let seventoten = gstVal.substring(7, 11);
  let patternseventoten = /^[0-9]{4}$/;
  let Twelveth = gstVal.substring(11, 12);
  let patternTwelveth = /^[A-Z]{1}$/;
  let Thirteen = gstVal.substring(12, 13);
  let patternThirteen = /^[1-9A-Z]{1}$/;
  let fourteen = gstVal.substring(13, 14);
  let patternfourteen = /^Z$/;
  let fifteen = gstVal.substring(14, 15);
  let patternfifteen = /^[0-9A-Z]{1}$/;

  if (isNaN(statecode)) {
    firstmess = '[WRONG - First Two Characters Must be numbers 01 to 37]';
    eMMessage = "[ Wrong ]";
  } else {
    firstmess = posdict[statecode] || 'N.A';
  }

  if (cpfind !== '') {
    secondmess = posdict[cpfind] || '[ Wrong ]';
  }

  if (gstVal.length !== 15) {
    eMMessage = '...';
  } else if (!patternstatecode.test(statecode)) {
    eMMessage = '[ WRONG ]';
  } else if (!patternthreetoseven.test(threetoseven)) {
    eMMessage = '[ Third to seventh characters of GSTIN should be alphabets ]';
  } else if (!patternseventoten.test(seventoten)) {
    if (isNaN(seventoten)) {
      eMMessage = '[ 8 to 11 characters Must be Numbers Only ]';
    } else {
      eMMessage = '';
    }
  } else if (!patternTwelveth.test(Twelveth)) {
    if (isNaN(Twelveth)) {
      eMMessage = ' [ 12th characters should be alphabet ] ';
    } else {
      eMMessage = '';
    }
  } else if (!patternThirteen.test(Thirteen)) {
    eMMessage = '[ Wrong ]';
  } else if (!patternfourteen.test(fourteen)) {
    eMMessage = '[ Wrong ]';
  } else if (!patternfifteen.test(fifteen)) {
    eMMessage = 'fifteen characters of GSTIN can be either alphabet or numeric';
  }

  if (seventoten !== '') {
    if (isNaN(seventoten)) {
      eMMessage = '[ 8 to 11 characters Must be Numbers Only ]';
    } else {
      eMMessage = '';
    }
  }

  if (Twelveth !== '') {
    if (isNaN(Twelveth)) {
      eMMessage = '';
    } else {
      eMMessage = '[ Wrong ]';
    }
  }

  return `${firstmess} - ${secondmess} - ${eMMessage}`;
};

export default GstinChker;
