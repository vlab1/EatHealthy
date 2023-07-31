import { Document, Schema } from 'mongoose';
import Dish from '@/resources/dish/dish.interface';
import User from '@/resources/user/user.interface';
import DietitianMeasurement from '@/resources/dietitianMeasurement/dietitianMeasurement.interface';
interface AllowedDish extends Document {
    _id: Schema.Types.ObjectId | Dish;

}


interface DietitianAppointment extends Document {
    recommendations: string;
    patientId: Schema.Types.ObjectId | User;
    dietitianId: Schema.Types.ObjectId | User;
    measurementId: Schema.Types.ObjectId | DietitianMeasurement;
    alowedDishes: Array<AllowedDish>;
}

interface StatisticsDietitianAppointment extends Object {
    averageTotalCholesterol?: number;
    averageHDLCholesterol?: number;
    averageVLDLCholesterol?: number;
    averageLDLCholesterol?: number;
    dietitianAppointment: Array<DietitianAppointment>
}

export default DietitianAppointment;

export {AllowedDish, StatisticsDietitianAppointment}