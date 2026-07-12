# Splitwise

1. Requirement
- Split a payment among friends
- Create a group, add people and split payments.
- Simplify debt
Error
- SplitException
Out of scope
- auth
- db

2. Core entities
- User
- Group
- Payment Split record
- SimplifyDebtRecord

class User{
    id;
    name;
}

class Group
{
    id;
    members: User[];
    simplifyDebtRecord: SimplifyDebtRecord; // Goes through multiple paymentsplits

    public:
        AddUser()
}

class PaymentSplit{
    totalAmount: number;
    paidBy: User;
    groupId: string;

    splitType: Percentage | Equally | DiffAmount;
    splitAmongUsers: Map<User, Amount>

    setSplit(split: Map<User, Amount>)
    {
        splitAmongUsers = split;
    }
}

interface Split{
    Map<User, Amount> split(totalAmount);
}

class EqualSplit()
{
    Map<User, Amount> split(totalAmount);
}

class PercentageSplit()
{
    addPercentage(user, percentage);
    Map<User, Amount> split(totalAmount);

    Map<User, Amount> split;
}

class DiffAmountSplit()
{
    addAmount(user, percentage);
    Map<User, Amount> split(totalAmount);

    Map<User, Amount> split;
}

class SimplifyDebtRecord
{
    creditor: User;
    borrower: User;
    Amount;
}

class SplitwiseService
{
    addUser(user);
    addUserToGroup(groupId, userId);
    addPaymentSplits();

    resolveSimplifiedDebt(groupId)
    {
        const group = groups.filter(x => x.id === groupId);
        const paymentSplitsForGroup = paymentSplits.filter(x => x.groupId = groupId);


    }

    paymentSplits: PaymentSplit[];
    groups: Group[];
    users: User[];
}

const user1 = new User('John');
const user2 = new User('Doe');
const user3 = new User('Sam');

const group = new Group();
group.addUser(user1);
group.addUser(user2);
group.addUser(user3);


const paymentsplit1 = new PaymentSplit(100, user1, group.id);
const splitter = new PercentageSplit();
splitter(user2, 80);
splitter(user3, 10);
payment.setSplit(splitter.split());

paymentsplit2, paymentsplit3...








