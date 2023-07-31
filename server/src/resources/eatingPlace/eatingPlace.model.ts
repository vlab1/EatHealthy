import { Schema, model } from 'mongoose';
import EatingPlace from '@/resources/eatingPlace/eatingPlace.interface';
import { DailyViews } from '@/resources/eatingPlace/eatingPlace.interface';

const EatingPlaceSchema = new Schema(
    {
        contactFirstName: {
            type: String,
            trim: true,
        },
        contactLastName: {
            type: String,
            trim: true,
        },
        contactPatronymic: {
            type: String,
            trim: true,
        },
        contactSex: {
            type: String,
            trim: true,
        },
        contactPhone: {
            type: String,
            trim: true,
        },
        contactBirthDate: {
            type: Date,
        },
        country: {
            en: { type: String, trim: true },
            uk: { type: String, trim: true },
        },
        region: {
            en: { type: String, trim: true },
            uk: { type: String, trim: true },
        },
        city: {
            en: { type: String, trim: true },
            uk: { type: String, trim: true },
        },
        address: {
            en: { type: String, trim: true },
            uk: { type: String, trim: true },
        },
        postcode: {
            type: String,
            trim: true,
        },
        images: {
            type: Array<String>,
            default: [],
        },
        name: {
            type: String,
            trim: true,
            
        },
        description: {
            en: { type: String, trim: true },
            uk: { type: String, trim: true },
        },
        dailyViews: {
            type: Array<DailyViews>,
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

export default model<EatingPlace>('EatingPlaces', EatingPlaceSchema);
