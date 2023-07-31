import { Schema, model } from 'mongoose';
import Dish from '@/resources/dish/dish.interface';
import FileService from '@/resources/file/file.service';

const DishSchema = new Schema(
    {
        name: {
            type: String ,
            trim: true
        },
        price: {
            type: String,
        },
        images: {
            type: Array<String>,
            default: [],
        },
        description: {
            en: { type: String, trim: true },
            uk: { type: String, trim: true },
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'Users',
        },
        ingredients: [
            {
                name: {
                    en: { type: String, trim: true },
                    uk: { type: String, trim: true },
                },
                weight: { type: String },
            },
        ],
    },
    {
        timestamps: true,
    }
);

export default model<Dish>('Dishes', DishSchema);
