import { getAccountsWithTotals } from "$lib/db/accounts";
import { formatCurrency } from "$lib/utils";

export async function getWarningLimits(user_id: number) {
    const accounts = await getAccountsWithTotals(user_id);

    const warnings = [];
    for (let account of accounts) {
        if (account.total && account.limit) {
            if (Number(account.total) > Number(account.limit)) {
                warnings.push({ type: "error", title: "limit", message: `${account.name} total (${formatCurrency(account.total)}) is greater than limit ${formatCurrency(account.limit)}` });
            } else if (Number(account.total) > Number(account.limit) * 0.9) {
                warnings.push({ type: "warning", title: "limit", message: `${account.name} total (${formatCurrency(account.total)}) is almost greater than limit ${formatCurrency(account.limit)}` });
            }
        }
    }

    return warnings;
}