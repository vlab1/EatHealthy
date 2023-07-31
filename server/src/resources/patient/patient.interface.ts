import { Document } from 'mongoose';

interface FindPatients {
    data: Array<Patient>;
    total: number
}

interface Patient extends Document {
    firstName: string;
    lastName: string;
    patronymic: string;
    sex: string;
    phone: string;
    birthDate: Date;
}

export default Patient;

export {FindPatients}