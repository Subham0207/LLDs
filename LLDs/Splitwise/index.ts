type User = {
    id: string;
    name: string;
}

type Transaction = {
    creditor: User;
    borrower: User;
    Amount: number;
}

enum SplitType{
    Percentage,
    Equally,
    DiffAmount
}

class PaymentSplit{
    private totalAmount: number;
    private paidBy: User;
    private groupId: string;
    private splitType: SplitType;
    splitAmongUsers: Map<User, Amount>

    setSplit(split: Map<User, Amount>)
    {
        splitAmongUsers = split;
    }
}

class SplitwiseService {
    paymentSplits: PaymentSplit[] = [];
    groups: Group[] = [];
    users: User[] = [];

    resolveSimplifiedDebt(groupId: string): Transaction[] {
        // 1. Filter splits belonging to this group
        const groupSplits = this.paymentSplits.filter(split => split.groupId === groupId);

        // 2. Map to track the net balance of each user: User ID -> Net Amount
        const netBalances = new Map<string, number>();

        // Initialize all group members with 0 balance
        const group = this.groups.find(g => g.id === groupId);
        if (!group) throw new Error("Group not found");
        group.members.forEach(user => netBalances.set(user.id, 0));

        // 3. Aggregate all expenses
        for (const split of groupSplits) {
            const payer = split.paidBy;
            const totalAmount = split.totalAmount;

            // Payer gets credited the total amount
            netBalances.set(payer.id, (netBalances.get(payer.id) || 0) + totalAmount);

            // Debtors get debited their respective shares
            for (const [borrower, amountOwed] of split.splitAmongUsers.entries()) {
                netBalances.set(borrower.id, (netBalances.get(borrower.id) || 0) - amountOwed);
            }
        }

        // 4. Separate users into Debtors and Creditors
        const debtors: { user: User; amount: number }[] = [];
        const creditors: { user: User; amount: number }[] = [];

        for (const member of group.members) {
            const balance = netBalances.get(member.id) || 0;
            // Using a small epsilon to handle floating point issues
            if (balance < -0.01) {
                debtors.push({ user: member, amount: Math.abs(balance) });
            } else if (balance > 0.01) {
                creditors.push({ user: member, amount: balance });
            }
        }

        const simplifiedTransactions: Transaction[] = [];

        // 5. Greedy matching loop
        let d = 0; // Debtor pointer
        let c = 0; // Creditor pointer

        while (d < debtors.length && c < creditors.length) {
            const debtor = debtors[d];
            const creditor = creditors[c];

            // Find the minimum amount that can be settled right now
            const settledAmount = Math.min(debtor.amount, creditor.amount);

            // Record the transaction
            simplifiedTransactions.push(new Transaction(debtor.user, creditor.user, settledAmount));

            // Deduct the settled amount from both parties
            debtor.amount -= settledAmount;
            creditor.amount -= settledAmount;

            // Move pointers if someone's balance is fully settled
            if (Math.abs(debtor.amount) < 0.01) d++;
            if (Math.abs(creditor.amount) < 0.01) c++;
        }

        return simplifiedTransactions;
    }
}