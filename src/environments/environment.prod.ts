import packageJson from "../../package.json";

export const environment = {
  version: packageJson.version ,
  production: true,
  apiKey: 'biukop-is-helping-superforex',
  apiBaseUrl: 'https://api.webtradepay.au/v1',
  wss: "wss://wss.webtradepay.au/meeting-prod",
  storageKeyMachine: "biukop-meeting-webtradepay-au-prod",
  storageKeyToken:"biukop-user-webtradepay-au-prod",
  jaasAppId: "vpaas-magic-cookie-35408203be1646ac811594fa79ddb6ce",
  meetingDomain:"https://meet.webtradepay.au/"
};
