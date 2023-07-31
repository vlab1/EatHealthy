import { Schema } from 'mongoose';

interface PaymentKeys extends Object {
    key: string;
    product: string;
    createdAt: Date;
}

interface Payment extends Object {
    userId: Schema.Types.ObjectId;
    payments: Array<PaymentKeys>;
    paymentsAttempts: Array<PaymentKeys>;
}

export default Payment;

export { PaymentKeys };
