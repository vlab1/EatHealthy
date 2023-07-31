import { Document } from 'mongoose';

interface DailyViews extends Object {
    date: Date;
    count: number;
}

interface Languages extends Object {
    en: string;
    uk: string;
}

interface FindEatingPlaces {
    data: Array<EatingPlace>;
    total: number
}


interface EatingPlace extends Document {
    contactFirstName: string;
    contactLastName: string;
    contactPatronymic: string;
    contactSex: string;
    contactPhone: string;
    contactBirthDate: Date;
    country: Languages;
    region: Languages;
    city: Languages;
    address: Languages;
    postcode: string;
    images: Array<string>;
    name: string;
    description: Languages;
    dailyViews: Array<DailyViews>;
}

export default EatingPlace;

export { DailyViews, Languages, FindEatingPlaces };
