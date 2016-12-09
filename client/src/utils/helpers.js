import Data from './Data';

export const stateNames = [
  { value: 'AL', text: 'Alabama' },
  { value: 'AK', text: 'Alaska' },
  { value: 'AZ', text: 'Arizona' },
  { value: 'AR', text: 'Arkansas' },
  { value: 'CA', text: 'California' },
  { value: 'CO', text: 'Colorado' },
  { value: 'CT', text: 'Connecticut' },
  { value: 'DE', text: 'Delaware' },
  { value: 'DC', text: 'District Of Columbia' },
  { value: 'FL', text: 'Florida' },
  { value: 'GA', text: 'Georgia' },
  { value: 'HI', text: 'Hawaii' },
  { value: 'ID', text: 'Idaho' },
  { value: 'IL', text: 'Illinois' },
  { value: 'IN', text: 'Indiana' },
  { value: 'IA', text: 'Iowa' },
  { value: 'KS', text: 'Kansas' },
  { value: 'KY', text: 'Kentucky' },
  { value: 'LA', text: 'Louisiana' },
  { value: 'ME', text: 'Maine' },
  { value: 'MD', text: 'Maryland' },
  { value: 'MA', text: 'Massachusetts' },
  { value: 'MI', text: 'Michigan' },
  { value: 'MN', text: 'Minnesota' },
  { value: 'MS', text: 'Mississippi' },
  { value: 'MO', text: 'Missouri' },
  { value: 'MT', text: 'Montana' },
  { value: 'NE', text: 'Nebraska' },
  { value: 'NV', text: 'Nevada' },
  { value: 'NH', text: 'New Hampshire' },
  { value: 'NJ', text: 'New Jersey' },
  { value: 'NM', text: 'New Mexico' },
  { value: 'NY', text: 'New York' },
  { value: 'NC', text: 'North Carolina' },
  { value: 'ND', text: 'North Dakota' },
  { value: 'OH', text: 'Ohio' },
  { value: 'OK', text: 'Oklahoma' },
  { value: 'OR', text: 'Oregon' },
  { value: 'PA', text: 'Pennsylvania' },
  { value: 'RI', text: 'Rhode Island' },
  { value: 'SC', text: 'South Carolina' },
  { value: 'SD', text: 'South Dakota' },
  { value: 'TN', text: 'Tennessee' },
  { value: 'TX', text: 'Texas' },
  { value: 'UT', text: 'Utah' },
  { value: 'VT', text: 'Vermont' },
  { value: 'VA', text: 'Virginia' },
  { value: 'WA', text: 'Washington' },
  { value: 'WV', text: 'West Virginia' },
  { value: 'WI', text: 'Wisconsin' },
  { value: 'WY', text: 'Wyoming' },
];

export const formattedStates = (statesData) => {
  if (!statesData) return stateNames;

  const stateOptions = [];

  for (const stateName of stateNames) {
    statesData.forEach((stateData) => {
      if (stateData._id === stateName.value) {
        const newState = {
          value: stateName.value,
          text: stateName.text,
          content: `${stateName.text} - ${String(stateData.count)} venues`
        };
        stateOptions.push(newState);
      }
    });
  }

  return stateOptions;
};

export const Zipcodes = {
  lookup(zip) {
    Data.get('zipcodes', `zip=${zip.toUpperCase()}`, res => res);
  },

  byState(state) {
    Data.get('zipcodes', `state=${state.toUpperCase()}`, res => res);
  },

  byCity(city, state) {
    const ret = [];

    this.byState(state).forEach((item) => {
      if (city.toUpperCase() === item.city.toUpperCase()) {
        ret.push(item);
      }
    });

    return ret;
  },

  dist(zipA, zipB) {
    const zipAData = this.lookup(zipA);
    const zipBData = this.lookup(zipB);

    if (zipAData.error || zipBData.error) return null;

    const zipALatitudeRadians = this.deg2rad(zipAData.latitude);
    const zipBLatitudeRadians = this.deg2rad(zipBData.latitude);

    let distance =
      ((Math.sin(zipALatitudeRadians) * Math.sin(zipBLatitudeRadians))
      + ((Math.cos(zipALatitudeRadians) * Math.cos(zipBLatitudeRadians))
      * Math.cos(this.deg2rad(zipAData.longitude - zipBData.longitude))));

    distance = Math.acos(distance) * 3958.56540656;
    return Math.round(distance);
  },

  radius(zip, miles) {
    const zipData = this.lookup(zip);
    if (zipData.error) return null;
    const allZipcodes = Data.get('zipcodes', 'all=true', res => res);
    const ret = [];

    for (const z of allZipcodes) {
      if (this.dist(zip, z) <= parseInt(miles)) {
        ret.push(z);
      }
    }

    return ret;
  },

  deg2rad(value) {
    return value * 0.017453292519943295;
  },

  toMiles(kilos) {
    return Math.round(kilos / 1.609344);
  },

  toKilometers(miles) {
    return Math.round(miles * 1.609344);
  }
};

export const colors = [
  { key: 'firetruck-red', val: '#FF0000' },
  { key: 'dodger-blue', val: '#1E90FF' },
  { key: 'lime-green', val: '#32CD32' },
  { key: 'dark-orange', val: '#FF8C00' },
  { key: 'dark-violet', val: '#9400D3' },
  { key: 'electric-yellow', val: '#FFFF00' },
  { key: 'cherry-red', val: '#DB3069' },
  { key: 'yale-blue', val: '#1446A0' },
  { key: 'forest-green', val: '#228B22' },
  { key: 'orioles-orange', val: '#FF5714' },
  { key: 'turquoise', val: '#40E0D0' },
  { key: 'fire-rose', val: '#FF5376' },
  { key: 'gold-yellow', val: '#FFDF00' },
  { key: 'meridian-red', val: '#ff3232' },
  { key: 'malachite-green', val: '#33EA52' },
  { key: 'coral-orange', val: '#FF7F50' },
  { key: 'orchid-purple', val: '#BA55D3' },
  { key: 'wizard-blue', val: '#9ED5FF' },
  { key: 'crimson-red', val: '#DC143C' },
  { key: 'deep-orange', val: '#FFA500' },
  { key: 'spring-green', val: '#00FF7F' },
  { key: 'giant-blue', val: '#0000FF' },
  { key: 'slate-purple', val: '#8E0999' },
  { key: 'lemon-yellow', val: '#FFEC00' },
];
