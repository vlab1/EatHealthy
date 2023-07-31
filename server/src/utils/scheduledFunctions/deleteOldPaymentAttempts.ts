import * as cron from 'node-cron';
import PaymentService from '@/resources/payment/payment.service';

export default class CronDeleteOldPaymentAttempts {
    public static PaymentService: PaymentService;

    private static getPaymentService() {
        this.PaymentService ||= new PaymentService();
        return this.PaymentService;
    }

    static deleteOldPaymentAttempts = () => {
        cron.schedule(`${process.env.NODE_CRON_INTERVAL}`, async () => {
            await this.getPaymentService().deleteOldPaymentAttempts();
        });
    };
}
