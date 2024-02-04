import { Configuration, PlaidApi, PlaidEnvironments, Products, CountryCode } from 'plaid';
import { PLAID_CLIENT_ID, PLAID_SECRET, PLAID_ENVIRONMENT } from '$env/static/private';

const configuration = new Configuration({
    basePath: PLAID_ENVIRONMENT == 'development' ? PlaidEnvironments.development : PlaidEnvironments.sandbox,
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