import packageJson from "../../package.json";
export const environment = {
  version: packageJson.version + '-dev',
  production: false,
  apiKey: 'biukop-is-helping-superforex',
  apiBaseUrl: 'http://192.168.1.30:3000',
  wss: "wss://wss.webtradepay.au/meeting-dev",
  appLocal: "biukop-meeting-webtradepay-au",
  jaasAppId: "vpaas-magic-cookie-35408203be1646ac811594fa79ddb6ce"
}; // this is the same as environment.dev.ts ---
