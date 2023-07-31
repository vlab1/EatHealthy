import Dish from '@/resources/dish/dish.interface';
import DishModel from '@/resources/dish/dish.model';
import { Schema } from 'mongoose';
import { Languages, Ingredient } from '@/resources/dish/dish.interface';
import FileService from '@/resources/file/file.service';

class DishService {
    private dish = DishModel;
    private FileService = new FileService();

    public async create(
        name: string,
        price: number,
        files: Express.Multer.File[],
        description: Languages,
        userId: Schema.Types.ObjectId,
        ingredients: Array<Ingredient>
    ): Promise<Dish | Error> {
        try {
            const dish = await this.dish.create({
                name,
                price,
                images: [],
                description,
                userId,
                ingredients,
            });

            if (!dish) {
                throw new Error('Unable to create dish profile');
            }

            const path = this.FileService.generatePathDish('Dishes', userId, dish._id);

            const filesPaths = await this.FileService.createFilesSetDocument(
                files,
                path
            );

            const resultDish = await this.dish.findByIdAndUpdate(
                dish._id,
                {
                    images: filesPaths,
                },
                { new: true }
            );

            if (!resultDish) {
                throw new Error('Unable to create dish profile');
            }

            return resultDish;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async update(
        _id: Schema.Types.ObjectId,
        name: string,
        price: number,
        images: Array<string>,
        description: Languages,
        userId: Schema.Types.ObjectId,
        ingredients: Array<Ingredient>,
        files: Express.Multer.File[],
        updatesUserId: Schema.Types.ObjectId
    ): Promise<Dish | Error> {
        try {
            const update = {} as {
                [key: string]: any;
            };

            if (description) {
                if (description.en) {
                    update['description.en'] = description.en;
                }
                if (description.uk) {
                    update['description.uk'] = description.uk;
                }
            }
            const dishExists = await this.dish.findById(_id);

            if (!dishExists) {
                throw new Error('Unable to find dish');
            }

            if (dishExists.userId.toString() !== updatesUserId.toString()) {
                throw new Error('No access');
            }

            const path = this.FileService.generatePathDish(
                'Dishes',
                dishExists.userId as Schema.Types.ObjectId,
                dishExists._id
            );

            const filesPaths = await this.FileService.updateFilesSetDocument(
                files,
                images,
                dishExists.images,
                path
            );

            const dish = await this.dish.findByIdAndUpdate(
                _id,
                {
                    name,
                    price,
                    images: filesPaths,
                    userId,
                    ingredients,
                    ...update,
                },
                { new: true }
            );

            if (!dish) {
                throw new Error('Unable to update dish with that data');
            }

            return dish;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async find(searchOptions: {
        [key: string]: any;
    }): Promise<Array<Dish> | Error> {
        try {
            if (searchOptions.minPrice && searchOptions.maxPrice) {
                searchOptions.price = {
                    $gte: searchOptions.minPrice,
                    $lte: searchOptions.maxPrice,
                };
            }

            searchOptions['$or'] = [];
            const searchOptionsEatingPlace = {} as {
                [key: string]: any;
            };
            const searchOptionsUser = {} as {
                [key: string]: any;
            };
            searchOptionsEatingPlace['$or'] = [];
            if (searchOptions.description) {
                searchOptions['$or'].push(
                    ...[
                        {
                            'description.en': {
                                $regex: new RegExp(searchOptions.description),
                                $options: 'i',
                            },
                        },
                        {
                            'description.uk': {
                                $regex: new RegExp(searchOptions.description),
                                $options: 'i',
                            },
                        },
                    ]
                );
                delete searchOptions['description'];
            }
            if (searchOptions.name) {
                searchOptions.name = {
                    $regex: new RegExp(searchOptions.name),
                    $options: 'i',
                };
            }

            // if (searchOptions.ingredients) {
            //     const ingredientNames = Array.isArray(searchOptions.ingredients)
            //         ? searchOptions.ingredients
            //         : [searchOptions.ingredients];
            //     searchOptions['$or'].push(
            //         ...[
            //             {
            //                 'ingredients.name.en': {
            //                     $in: ingredientNames.map(
            //                         (name: string) => new RegExp(name, 'i')
            //                     ),
            //                 },
            //             },
            //             {
            //                 'ingredients.name.uk': {
            //                     $in: ingredientNames.map(
            //                         (name: string) => new RegExp(name, 'i')
            //                     ),
            //                 },
            //             },
            //         ]
            //     );
            //     delete searchOptions['ingredients'];
            // }
            if (searchOptions.ingredients) {
                const ingredientNames = Array.isArray(searchOptions.ingredients)
                    ? searchOptions.ingredients
                    : [searchOptions.ingredients];
                searchOptions['$or'] = [
                    {
                        'ingredients.name.en': {
                            $all: ingredientNames.map(
                                (name: string) => new RegExp(name, 'i')
                            ),
                        },
                    },
                    {
                        'ingredients.name.uk': {
                            $all: ingredientNames.map(
                                (name: string) => new RegExp(name, 'i')
                            ),
                        },
                    },
                ];
                delete searchOptions['ingredients'];
            }
            if (searchOptions.country) {
                searchOptionsEatingPlace['$or'].push(
                    ...[
                        {
                            'country.en': {
                                $regex: new RegExp(searchOptions.country),
                                $options: 'i',
                            },
                        },
                        {
                            'country.uk': {
                                $regex: new RegExp(searchOptions.country),
                                $options: 'i',
                            },
                        },
                    ]
                );
                delete searchOptions['country'];
            }
            if (searchOptions.region) {
                searchOptionsEatingPlace['$or'].push(
                    ...[
                        {
                            'region.en': {
                                $regex: new RegExp(searchOptions.region),
                                $options: 'i',
                            },
                        },
                        {
                            'region.uk': {
                                $regex: new RegExp(searchOptions.region),
                                $options: 'i',
                            },
                        },
                    ]
                );
                delete searchOptions['region'];
            }
            if (searchOptions.city) {
                searchOptionsEatingPlace['$or'].push(
                    ...[
                        {
                            'city.en': {
                                $regex: new RegExp(searchOptions.city),
                                $options: 'i',
                            },
                        },
                        {
                            'city.uk': {
                                $regex: new RegExp(searchOptions.city),
                                $options: 'i',
                            },
                        },
                    ]
                );
                delete searchOptions['city'];
            }
            if (searchOptions.eatingPlaceName) {
                searchOptionsEatingPlace['$or'].push(
                    ...[
                        {
                            name: {
                                $regex: new RegExp(
                                    searchOptions.eatingPlaceName
                                ),
                                $options: 'i',
                            },
                        },
                        {
                            name: {
                                $regex: new RegExp(
                                    searchOptions.eatingPlaceName
                                ),
                                $options: 'i',
                            },
                        },
                    ]
                );
                delete searchOptions['eatingPlaceName'];
            }
            if (searchOptions.userUserId) {
                searchOptionsUser['_id'] = searchOptions.userUserId;
                delete searchOptions['userId'];
            }
            if (searchOptions.eatingPlaceId) {
                searchOptionsEatingPlace['_id'] = searchOptions.eatingPlaceId;
                delete searchOptions['eatingPlaceId'];
            }
            if (searchOptionsEatingPlace['$or'].length === 0) {
                delete searchOptionsEatingPlace['$or'];
            }
            if (searchOptions['$or'].length === 0) {
                delete searchOptions['$or'];
            }
            const dishes = await this.dish
                .find(searchOptions, null, {
                    sort: { createdAt: -1 },
                })
                .populate({
                    path: 'userId',
                    populate: {
                        path: 'profileId',
                        match: searchOptionsEatingPlace,
                        select: 'name country region city address postcode images description',
                    },
                    match: searchOptionsUser,
                    select: 'profileId profileModel',
                })
                .exec();

            return dishes.filter(
                (dish) =>
                    dish.userId &&
                    !(dish.userId instanceof Schema.Types.ObjectId) &&
                    dish.userId.profileId
            );
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async delete(
        _id: Schema.Types.ObjectId,
        userId: Schema.Types.ObjectId
    ): Promise<Dish | Error> {
        try {
            const dishExists = await this.dish.findById(_id);

            if (!dishExists) {
                throw new Error('Unable to find dish');
            }

            if (dishExists.userId.toString() !== userId.toString()) {
                throw new Error('No access');
            }

            const dish = await this.dish.findByIdAndDelete(_id);
            this.FileService.deleteDirectory(
                this.FileService.generateDirectoryDish('Dishes', userId, _id)
            );
            if (!dish) {
                throw new Error('Unable to update dish with that data');
            }

            return dish;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async adminUpdate(
        _id: Schema.Types.ObjectId,
        name: string,
        price: number,
        images: Array<string>,
        description: Languages,
        userId: Schema.Types.ObjectId,
        ingredients: Array<Ingredient>,
        files: Express.Multer.File[]
    ): Promise<Dish | Error> {
        try {
            const update = {} as {
                [key: string]: any;
            };

            if (description) {
                if (description.en) {
                    update['description.en'] = description.en;
                }
                if (description.uk) {
                    update['description.uk'] = description.uk;
                }
            }
            const dishExists = await this.dish.findById(_id);

            if (!dishExists) {
                throw new Error('Unable to find dish');
            }

            const path = this.FileService.generatePathDish(
                'Dishes',
                dishExists.userId as Schema.Types.ObjectId,
                dishExists._id
            );

            const filesPaths = await this.FileService.updateFilesSetDocument(
                files,
                images,
                dishExists.images,
                path
            );

            const dish = await this.dish.findByIdAndUpdate(
                _id,
                {
                    name,
                    price,
                    images: filesPaths,
                    userId,
                    ingredients,
                    ...update,
                },
                { new: true }
            );

            if (!dish) {
                throw new Error('Unable to update dish with that data');
            }

            return dish;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async adminDelete(
        _id: Schema.Types.ObjectId
    ): Promise<Dish | Error> {
        try {
            const dish = await this.dish.findByIdAndDelete(_id);
    
            if (!dish) {
                throw new Error('Unable to update dish with that data');
            }
            this.FileService.deleteDirectory(
                this.FileService.generateDirectoryDish('Dishes', dish.userId as Schema.Types.ObjectId, _id)
            );
            return dish;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}

export default DishService;
