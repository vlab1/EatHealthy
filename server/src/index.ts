import 'dotenv/config';
import 'module-alias/register';
import validateEnv from '@/utils/validateEnv';
import App from './app';
import UserController from '@/resources/user/user.controller';
import RefreshTokenController from '@/resources/refreshToken/refreshToken.controller';
import MailerController from '@/resources/mailer/mailer.controller';
import AdminController from '@/resources/admin/admin.controller';
import PaymentController from '@/resources/payment/payment.controller';
import EatingPlaceController from '@/resources/eatingPlace/eatingPlace.controller';
import DietitianController from '@/resources/dietitian/dietitian.controller';
import PatientController from '@/resources/patient/patient.controller';
import DishController from '@/resources/dish/dish.controller';
import DietitianAppointmentController from '@/resources/dietitianAppointment/dietitianAppointment.controller';
import DietitianMeasurementController from '@/resources/dietitianMeasurement/dietitianMeasurement.controller';

validateEnv();

const app = new App(
    [
        new UserController(),
        new RefreshTokenController(),
        new MailerController(),
        new AdminController(),
        new PaymentController(),
        new EatingPlaceController(),
        new DietitianController(),
        new PatientController(),
        new DishController(),
        new DietitianAppointmentController(),
        new DietitianMeasurementController()
    ],
    Number(process.env.PORT)
);

app.listen();
