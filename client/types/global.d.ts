import '@total-typescript/ts-reset';

declare global {
  type ID = number | string;
  const REVISION: string;

  interface Window {
    API_URL: string;
  }
  const API_URL: string;
}
