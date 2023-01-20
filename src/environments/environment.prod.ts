import packageJson from "../../package.json";

export const environment = {
  version: packageJson.version ,
  production: true,
  apiKey: 'biukop-is-helping-superforex',
  apiBaseUrl: 'https://api.webtradepay.au/v1',
  wss: "wss://wss.webtradepay.au/meeting-prod"
};
