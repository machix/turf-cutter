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
