import User from '@/resources/user/user.interface';
import Admin from '@/resources/admin/admin.interface';

declare global {
    namespace Express {
        export interface Request {
            user: User;
        }
    }
}

declare global {
    namespace Express {
        export interface Request {
            admin: Admin;
        }
    }
}

declare global {
    interface Function {
        modelName: string;
    }
}

declare global {
    namespace Express {
        interface Request {
            properties: {
                [key: string]: any;
            };
        }
    }
}
