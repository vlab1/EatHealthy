import { Document } from 'mongoose';


export default interface Admin extends Document {
    email: string;
    password: string;

    getUpdate(): Promise<Error | Object>;
    setUpdate(obj: Object): Promise<Error | boolean>;
    isValidPassword(password: string): Promise<Error | boolean>;
}
