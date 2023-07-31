import PaymentModel from '@/resources/payment/payment.model';
import { Schema } from 'mongoose';
import Payment from '@/resources/payment/payment.interface';
import { generateRandomString } from '@/utils/functions/functions';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class PaymentService {
    private payment = PaymentModel;

    public async buyAttempt(
        userId: Schema.Types.ObjectId,
        price: number,
        product: string
    ): Promise<string | Error> {
        try {
            const key = generateRandomString(100);
            const clientURL = `${process.env.CLIENT_URL}`;
            const paymentExists = await this.payment.findOne({ userId });

            if (!paymentExists) {
                await this.payment.create({ userId });
            }

            await this.payment.findOneAndUpdate(
                { userId: userId },
                {
                    $push: {
                        paymentsAttempts: {
                            key: key,
                            product: product,
                            createdAt: new Date(Date.now()),
                        },
                    },
                }
            );

            const line_items = [
                {
                    price_data: {
                        currency: 'uah',
                        product_data: {
                            name: product,
                        },
                        unit_amount: price * 100,
                    },
                    quantity: 1,
                },
            ];

            const session = await stripe.checkout.sessions.create({
                line_items,
                mode: 'payment',
                success_url: `${clientURL}/success/${key}/${product}`,
                cancel_url: `${clientURL}/canceled/${key}/${product}`,
            });

            return session.url;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async deleteOldPaymentAttempts(): Promise<void | Error> {
        try {
            const thirtyMinutesAgo = new Date(
                Date.now() - eval(`${process.env.PAYMENT_ATTEMPTS_LIFETIME}`)
            );

            await this.payment.updateMany(
                {
                    paymentsAttempts: {
                        $elemMatch: { createdAt: { $lt: thirtyMinutesAgo } },
                    },
                },
                {
                    $pull: {
                        paymentsAttempts: {
                            createdAt: { $lt: thirtyMinutesAgo },
                        },
                    },
                },
                { multi: true }
            );
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async get(userId: Schema.Types.ObjectId): Promise<Payment | Error> {
        try {
            let payment = await this.payment.findOne({ userId });

            if (!payment) {
                throw new Error('Incorrect payment');
            }

            return payment;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async pushPayment(
        userId: Schema.Types.ObjectId,
        key: string,
        product: string
    ): Promise<Payment | Error> {
        try {
            const payment = await this.payment.findOneAndUpdate(
                { userId: userId },
                {
                    $push: {
                        payments: {
                            key: key,
                            product: product,
                            createdAt: new Date(Date.now()),
                        },
                    },
                },
                { new: true }
            );

            if (!payment) {
                throw new Error('Incorrect payment');
            }

            return payment;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async adminDelete(
        _id: Schema.Types.ObjectId,
    ): Promise<Payment | Error> {
        try {
            const payment = await this.payment.findByIdAndDelete(_id);

            if (!payment) {
                throw new Error('Failed to delete payment');
            }

            return payment;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    
    public async adminFind(searchOptions: {
        [key: string]: any;
    }): Promise<Array<Payment> | Error> {
        try {
            const payment = await this.payment.find(searchOptions);

            return payment;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}

export default PaymentService;
