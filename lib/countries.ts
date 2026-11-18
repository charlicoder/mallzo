// [ISO code, dial code, English name]. The flag is derived from the ISO code.
export const COUNTRIES: [string, string, string][] = [
  ["AE", "971", "United Arab Emirates"], ["SA", "966", "Saudi Arabia"], ["QA", "974", "Qatar"], ["KW", "965", "Kuwait"],
  ["BH", "973", "Bahrain"], ["OM", "968", "Oman"], ["EG", "20", "Egypt"], ["JO", "962", "Jordan"], ["LB", "961", "Lebanon"],
  ["IQ", "964", "Iraq"], ["MA", "212", "Morocco"], ["DZ", "213", "Algeria"], ["TN", "216", "Tunisia"], ["PS", "970", "Palestine"],
  ["US", "1", "United States"], ["CA", "1", "Canada"], ["GB", "44", "United Kingdom"], ["IE", "353", "Ireland"],
  ["DE", "49", "Germany"], ["FR", "33", "France"], ["IT", "39", "Italy"], ["ES", "34", "Spain"], ["NL", "31", "Netherlands"],
  ["SE", "46", "Sweden"], ["CH", "41", "Switzerland"], ["TR", "90", "Türkiye"], ["IN", "91", "India"], ["PK", "92", "Pakistan"],
  ["BD", "880", "Bangladesh"], ["LK", "94", "Sri Lanka"], ["PH", "63", "Philippines"], ["ID", "62", "Indonesia"],
  ["MY", "60", "Malaysia"], ["SG", "65", "Singapore"], ["TH", "66", "Thailand"], ["VN", "84", "Vietnam"], ["CN", "86", "China"],
  ["HK", "852", "Hong Kong"], ["JP", "81", "Japan"], ["KR", "82", "South Korea"], ["AU", "61", "Australia"], ["NZ", "64", "New Zealand"],
  ["ZA", "27", "South Africa"], ["NG", "234", "Nigeria"], ["KE", "254", "Kenya"], ["BR", "55", "Brazil"], ["MX", "52", "Mexico"],
  ["AR", "54", "Argentina"], ["CO", "57", "Colombia"], ["CL", "56", "Chile"], ["RU", "7", "Russia"], ["UA", "380", "Ukraine"],
  ["PL", "48", "Poland"],
];

export const flag = (iso: string) => String.fromCodePoint(...[...iso].map((c) => 127397 + c.charCodeAt(0)));
