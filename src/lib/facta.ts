export interface FactaReceipt {
    maskedCardNumber: string;
    amount: string;
    description: string;
    date: string;
    merchant: string;
}

export function generateFactaReceipt(last4: string, amount: number, description: string): FactaReceipt {
    // FACTA Compliance: Mask all but last 5 digits (we usually have last 4 from Stripe)
    // Stripe gives last 4, so we can display "**** **** **** " + last4
    // Or strictly following "no more than last 5", last 4 is safe.

    const maskedCardNumber = `**** **** **** ${last4}`;

    return {
        maskedCardNumber,
        amount: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount),
        description,
        date: new Date().toLocaleDateString(),
        merchant: 'Verbaflow LLC'
    };
}
