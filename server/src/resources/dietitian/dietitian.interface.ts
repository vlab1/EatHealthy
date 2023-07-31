import { Document } from 'mongoose';

interface FindDietitians {
    data: Array<Dietitian>;
    total: number
}

interface Dietitian extends Document {
    firstName: string;
    lastName: string;
    patronymic: string;
    sex: string;
    phone: string;
    birthDate: Date;
}

export default Dietitian;

export {FindDietitians}