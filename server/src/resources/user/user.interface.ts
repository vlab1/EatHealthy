import { Document, Model, Schema } from 'mongoose';
import { ObjectId } from 'mongoose';
import Dietitian from '@/resources/dietitian/dietitian.interface';
import EatingPlace from '@/resources/eatingPlace/eatingPlace.interface';
import Patient from '@/resources/patient/patient.interface';

interface FindUsers {
    data: Array<User>;
    total: number
}

export default interface User extends Document {
    email: string;
    password: string;
    emailActivationLink: string;
    emailIsActivated: boolean;
    profileModel: string;
    profileId: ObjectId | Dietitian | EatingPlace | Patient;
    passwordGoogle: string;

    getUpdate(): Promise<Error | Object>;
    setUpdate(obj: Object): Promise<Error | boolean>;
    getQuery(): Promise<Error | Object>;
    isValidPassword(password: string): Promise<Error | boolean>;
    isValidPasswordGoogle(passwordGoogle: string): Promise<Error | boolean>;
}

export {FindUsers}