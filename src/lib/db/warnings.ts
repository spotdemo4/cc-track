import { getAccountsWithTotals } from "$lib/db/accounts";
import { formatCurrency } from "$lib/utils";

export async function getWarnings(user_id: number) {
    const warnings = [];

    const limits = await getWarningLimits(user_id);
    warnings.push(...limits);

    const funding = await getWarningFunding(user_id);
    warnings.push(...funding);

    warnings.sort((a, b) => {
        if (a.type == "error" && b.type == "warning") {
            return -1;
        } else if (a.type == "warning" && b.type == "error") {
            return 1;
        } else {
            return 0;
        }
    });

    return warnings;
}

async function getWarningLimits(user_id: number) {
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

async function getWarningFunding(user_id: number) {
    const accounts = await getAccountsWithTotals(user_id);

    const total_debts: { id: string, total: number }[] = [];
    for (let account of accounts) {
        if (account.funding_account_id) {
            const funding_account = accounts.find((a) => a.id == account.funding_account_id);
            if (funding_account) {
                const total = total_debts.find((t) => t.id == account.funding_account_id);
                if (total) {
                    total.total += account.balance_current ? Number(account.balance_current) : 0;
                } else {
                    total_debts.push({
                        id: account.funding_account_id,
                        total: account.balance_current ? Number(account.balance_current) : 0
                    });
                }
            }
        }
    }

    const warnings = [];
    for (let total_debt of total_debts) {
        const account = accounts.find((a) => a.id == total_debt.id);
        if (account && account.balance_current && total_debt.total > (account.balance_current ? Number(account.balance_current) : 0)) {
            warnings.push({ type: "error", title: "funding", message: `${account.name} is underfunded! Total debt (${formatCurrency(total_debt.total)}) is greater than balance ${formatCurrency(account.balance_current)}` });
        } else if (account && account.balance_current && total_debt.total > (account.balance_current ? Number(account.balance_current) : 0) * 0.9) {
            warnings.push({ type: "warning", title: "funding", message: `${account.name} is almost underfunded! Total debt (${formatCurrency(total_debt.total)}) is almost greater than balance ${formatCurrency(account.balance_current)}` });
        }
    }

    return warnings;
}