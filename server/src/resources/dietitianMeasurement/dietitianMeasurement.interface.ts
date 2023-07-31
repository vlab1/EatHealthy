import { Document, Schema } from 'mongoose';

interface Languages extends Object {
    en: string;
    uk: string;
}

interface Warning extends Object {
    description: string;
}

interface CholesterolNorms extends Object {
    totalCholesterolMin: number;
    totalCholesterolMax: number;
    hdlCholesterolMin: number;
    hdlCholesterolMax: number;
    vldlCholesterolMin: number;
    vldlCholesterolMax: number;
    ldlCholesterolMin: number;
    ldlCholesterolMax: number;
}

interface DietitianMeasurement extends Document {
    totalCholesterol: number;
    hdlCholesterol: number;
    vldlCholesterol: number;
    ldlCholesterol: number;
    warnings: Array<Warning>;
    cholesterolNorms: CholesterolNorms;
}

export default DietitianMeasurement;

export { Warning, Languages, CholesterolNorms };
