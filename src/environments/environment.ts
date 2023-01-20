import packageJson from '../../package.json';
export const environment = {
  version: packageJson.version + '-dev',
  production: false,
  apiKey: 'biukop-is-helping-superforex',
  apiBaseUrl: 'http://192.168.1.35:3000',
  wss: "wss://wss.webtradepay.au/meeting-dev"
}; // this is the same as environment.dev.ts ---
