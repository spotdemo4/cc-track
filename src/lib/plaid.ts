import { Configuration, PlaidApi, PlaidEnvironments, Products, CountryCode } from 'plaid';
import { PLAID_CLIENT_ID, PLAID_SECRET } from '$env/static/private';

const configuration = new Configuration({
    basePath: PlaidEnvironments.development,
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': PLAID_CLIENT_ID || '',
            'PLAID-SECRET': PLAID_SECRET || '',
        },
    },
});

export const plaidClient = new PlaidApi(configuration);
export const plaidProducts = [Products.Transactions];
export const plaidCountryCodes = [CountryCode.Us];