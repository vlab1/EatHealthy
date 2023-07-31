import { Schema, model } from 'mongoose';
import Payment from '@/resources/payment/payment.interface';
import { PaymentKeys } from '@/resources/payment/payment.interface';
const PaymentSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        payments: {
            type: Array<PaymentKeys>,
            default: [],
            required: true,
        },
        paymentsAttempts: {
            type: Array<PaymentKeys>,
            default: [],
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default model<Payment>('Payments', PaymentSchema);
