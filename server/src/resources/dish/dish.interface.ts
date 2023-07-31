import { Document, Schema } from 'mongoose';
import User from '@/resources/user/user.interface';

interface Languages extends Object {
    en: string;
    uk: string;
}

interface Ingredient extends Object {
    name: Languages;
    weight: string;
}

interface Dish extends Document {
    name: string;
    price: string;
    images: Array<string>;
    description: Languages;
    userId: Schema.Types.ObjectId | User;
    ingredients: Array<Ingredient>;
}

export default Dish;

export {Languages, Ingredient}