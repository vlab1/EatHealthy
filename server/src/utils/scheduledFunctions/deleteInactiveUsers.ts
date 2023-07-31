import * as cron from 'node-cron';
import UserService from '@/resources/user/user.service';

export default class CronDeleteInactiveUsers {
    public static UserService: UserService;

    private static getUserService() {
        this.UserService ||= new UserService();
        return this.UserService;
    }

    static deleteInactiveUsers = () => {
        cron.schedule(`${process.env.NODE_CRON_INTERVAL}`, async () => {
            await this.getUserService().deleteInactiveUsers();
        });
    };
}
