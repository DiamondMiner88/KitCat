// Based on which Region the Google Datacenter is located in

// https://cloud.google.com/about/locations#regions
// https://en.wikipedia.org/wiki/List_of_tz_database_time_zones

// Commented out zones are unsure of
export const regions = {
  // 'brazil': 'America/Sao_Paulo',
  // 'europe': '',
  'hongkong': 'Asia/Hong_Kong',
  'india': 'Asia/Kolkata',
  'japan': 'Asia/Tokyo',
  // 'russia': '',
  'singapore': 'Asia/Singapore',
  // 'southafrica': '',
  'sydney': 'Australia/Sydney',
  // 'us-central': 'America/Matamoros',
  'us-east': 'America/New_York',
  // 'us-south': '', // DFW
  'us-west': 'America/Los_Angeles'
};

export function regionToTimezone(region: keyof typeof regions): string | undefined {
  return regions[region];
}

[
  'us-west',
  'us-east',
  'us-central',
  'us-south',
  'singapore',
  'southafrica',
  'sydney',
  'europe',
  'brazil',
  'hongkong',
  'russia',
  'japan',
  'india',
  'dubai',
  'amsterdam',
  'london',
  'frankfurt',
  'eu-central',
  'eu-west'
];
