import { Schema } from 'mongoose';
import UserModel from '@/resources/user/user.model';
import EatingPlaceModel from '@/resources/eatingPlace/eatingPlace.model';
import EatingPlace from '@/resources/eatingPlace/eatingPlace.interface';
import { FindEatingPlaces } from '@/resources/eatingPlace/eatingPlace.interface';
import User from '@/resources/user/user.interface';
import FileService from '@/resources/file/file.service';
import { Languages } from '@/resources/eatingPlace/eatingPlace.interface';

class EatingPlaceService {
    private eatingPlace = EatingPlaceModel;
    private user = UserModel;
    private FileService = new FileService();

    public async create(): Promise<EatingPlace | Error> {
        try {
            const eatingPlace = await this.eatingPlace.create({});
            if (!eatingPlace) {
                throw new Error('Unable to create eating place profile');
            }
            return eatingPlace;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async update(
        userPorfileId: Schema.Types.ObjectId,
        userId: Schema.Types.ObjectId,
        _id: Schema.Types.ObjectId,
        contactFirstName: string,
        contactLastName: string,
        contactPatronymic: string,
        contactSex: string,
        contactPhone: string,
        country: Languages,
        region: Languages,
        city: Languages,
        address: Languages,
        postcode: string,
        images: Array<string>,
        name: string,
        description: Languages,
        dailyViews: number,
        files: Express.Multer.File[],
        contactBirthDate: Date
    ): Promise<EatingPlace | Error> {
        try {
            const update = {} as {
                [key: string]: any;
            };

            if (country) {
                if (country.en) {
                    update['country.en'] = country.en;
                }
                if (country.uk) {
                    update['country.uk'] = country.uk;
                }
            }

            if (region) {
                if (region.en) {
                    update['region.en'] = region.en;
                }
                if (region.uk) {
                    update['region.uk'] = region.uk;
                }
            }

            if (city) {
                if (city.en) {
                    update['city.en'] = city.en;
                }
                if (city.uk) {
                    update['city.uk'] = city.uk;
                }
            }

            if (address) {
                if (address.en) {
                    update['address.en'] = address.en;
                }
                if (address.uk) {
                    update['address.uk'] = address.uk;
                }
            }

            if (description) {
                if (description.en) {
                    update['description.en'] = description.en;
                }
                if (description.uk) {
                    update['description.uk'] = description.uk;
                }
            }

            const eatingPlaceExists = await this.eatingPlace.findById(_id);
            if (!eatingPlaceExists) {
                throw new Error('Unable to find eating place');
            }

            if (eatingPlaceExists._id.toString() !== userPorfileId.toString()) {
                throw new Error('No Access');
            }

            const path = this.FileService.generatePath(
                eatingPlaceExists.constructor.modelName,
                userId
            );
            const filesPaths = await this.FileService.updateFilesSetDocument(
                files,
                images,
                eatingPlaceExists.images,
                path
            );

            const eatingPlace = await this.eatingPlace.findByIdAndUpdate(
                _id,
                {
                    contactFirstName,
                    contactLastName,
                    contactPatronymic,
                    contactSex,
                    contactPhone,
                    contactBirthDate,
                    postcode,
                    images: filesPaths,
                    name,
                    dailyViews,
                    ...update,
                },
                { new: true }
            );

            if (!eatingPlace) {
                throw new Error('Unable to update eating place with that data');
            }

            return eatingPlace;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async find(searchOptions: {
        [key: string]: any;
    }): Promise<Array<EatingPlace> | Error> {
        try {
            searchOptions['$or'] = [];
            if (searchOptions.country) {
                searchOptions['$or'].push(
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
                searchOptions['$or'].push(
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
                searchOptions['$or'].push(
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
            if (searchOptions.address) {
                searchOptions['$or'].push(
                    ...[
                        {
                            'address.en': {
                                $regex: new RegExp(searchOptions.address),
                                $options: 'i',
                            },
                        },
                        {
                            'address.uk': {
                                $regex: new RegExp(searchOptions.address),
                                $options: 'i',
                            },
                        },
                    ]
                );
                delete searchOptions['address'];
            }
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
            if (searchOptions['$or'].length === 0) {
                delete searchOptions['$or'];
            }
            const eatingPlace = await this.eatingPlace.find(
                searchOptions,
                null,
                {
                    sort: { createdAt: -1 },
                }
            );

            if (eatingPlace && eatingPlace.length > 0) {
                this.dailyViewsIncrement(eatingPlace[0]._id);
            }

            return eatingPlace;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    private async dailyViewsIncrement(
        _id: Schema.Types.ObjectId
    ): Promise<void | Error> {
        try {
            const eatingPlace = await this.eatingPlace.findById(_id);

            if (!eatingPlace) {
                throw new Error('Unable to find eating place profile');
            }

            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);

            const dailyViewIndex = eatingPlace.dailyViews.findIndex(
                (view) => view.date.getTime() === currentDate.getTime()
            );
            if (dailyViewIndex !== -1) {
                eatingPlace.dailyViews[dailyViewIndex].count += 1;
            } else {
                eatingPlace.dailyViews.push({ date: currentDate, count: 1 });
            }
            await this.eatingPlace.findByIdAndUpdate(_id, {
                dailyViews: eatingPlace.dailyViews,
            });
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async dailyViews(searchOptions: { [key: string]: any }): Promise<
        | Array<{
              [key: string]: any;
          }>
        | Error
    > {
        try {
            const query = {
                _id: searchOptions._id,
                dailyViews: {
                    $elemMatch: {
                        date: {
                            $gte: searchOptions.from,
                            $lt: searchOptions.to,
                        },
                    },
                },
            };

            const eatingPlace = await this.eatingPlace.findOne(query);

            if (eatingPlace) {
                const dailyViews = [] as Array<{
                    [key: string]: any;
                }>;
                eatingPlace.dailyViews.forEach((item, index) => {
                    dailyViews.push({
                        date: new Date(eatingPlace.dailyViews[index].date)
                            .toISOString()
                            .split('T')[0],
                        count: eatingPlace.dailyViews[index].count,
                    });
                });

                return dailyViews;
            } else {
                return [];
            }
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async adminDelete(
        _id: Schema.Types.ObjectId
    ): Promise<EatingPlace | Error> {
        try {
            const user = await this.user.findOneAndDelete({profileId: _id});
            if (!user) {
                throw new Error('Unable to delete patient profile');
            }
            const eatingPlace = user?.profileId as EatingPlace;
            return eatingPlace;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async adminProfileIsExists(
        _id: Schema.Types.ObjectId
    ): Promise<boolean | Error> {
        try {
            const eatingPlace = await this.eatingPlace.findById(_id);
            if (!eatingPlace) {
                return false;
            }
            return true;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async adminUpdate(
        _id: Schema.Types.ObjectId,
        contactFirstName: string,
        contactLastName: string,
        contactPatronymic: string,
        contactSex: string,
        contactPhone: string,
        country: Languages,
        region: Languages,
        city: Languages,
        address: Languages,
        postcode: string,
        images: Array<string>,
        name: string,
        description: Languages,
        viewsNumber: number,
        files: Express.Multer.File[],
        contactBirthDate: Date
    ): Promise<EatingPlace | Error> {
        try {
            const update = {} as {
                [key: string]: any;
            };

            if (country) {
                if (country.en) {
                    update['country.en'] = country.en;
                }
                if (country.uk) {
                    update['country.uk'] = country.uk;
                }
            }

            if (region) {
                if (region.en) {
                    update['region.en'] = region.en;
                }
                if (region.uk) {
                    update['region.uk'] = region.uk;
                }
            }

            if (city) {
                if (city.en) {
                    update['city.en'] = city.en;
                }
                if (city.uk) {
                    update['city.uk'] = city.uk;
                }
            }

            if (address) {
                if (address.en) {
                    update['address.en'] = address.en;
                }
                if (address.uk) {
                    update['address.uk'] = address.uk;
                }
            }

            if (description) {
                if (description.en) {
                    update['description.en'] = description.en;
                }
                if (description.uk) {
                    update['description.uk'] = description.uk;
                }
            }

            const eatingPlaceExists = await this.eatingPlace.findById(_id);
            if (!eatingPlaceExists) {
                throw new Error('Unable to find eating place');
            }

            const user = (await this.user.find({
                profileId: _id,
            })) as Array<User>;

            if (!user || user.length <= 0) {
                throw new Error('Unable to find eating place');
            }

            const userId = user[0]._id;

            const path = this.FileService.generatePath(
                eatingPlaceExists.constructor.modelName,
                userId
            );
            const filesPaths = await this.FileService.updateFilesSetDocument(
                files,
                images,
                eatingPlaceExists.images,
                path
            );

            const eatingPlace = await this.eatingPlace.findByIdAndUpdate(
                _id,
                {
                    contactFirstName,
                    contactLastName,
                    contactPatronymic,
                    contactSex,
                    contactPhone,
                    contactBirthDate,
                    postcode,
                    images: filesPaths,
                    name,
                    viewsNumber,
                    ...update,
                },
                { new: true }
            );

            if (!eatingPlace) {
                throw new Error('Unable to update eating place with that data');
            }

            return eatingPlace;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async adminCreate(
        contactFirstName: string,
        contactLastName: string,
        contactPatronymic: string,
        contactSex: string,
        contactPhone: string,
        country: Languages,
        region: Languages,
        city: Languages,
        address: Languages,
        postcode: string,
        name: string,
        description: Languages,
        viewsNumber: number,
        contactBirthDate: Date
    ): Promise<EatingPlace | Error> {
        try {
            const eatingPlace = await this.eatingPlace.create({
                contactFirstName,
                contactLastName,
                contactPatronymic,
                contactSex,
                contactPhone,
                country,
                region,
                city,
                address,
                postcode,
                name,
                description,
                viewsNumber,
                contactBirthDate,
            });

            if (!eatingPlace) {
                throw new Error('Failed to create eating place');
            }

            return eatingPlace;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async adminFind(searchOptions: {
        [key: string]: any;
    }): Promise<FindEatingPlaces | Error> {
        try {
            searchOptions['$or'] = [];
            if (searchOptions.country) {
                searchOptions['$or'].push(
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
                searchOptions['$or'].push(
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
                searchOptions['$or'].push(
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
            if (searchOptions['$or'].length === 0) {
                delete searchOptions['$or'];
            }
            const userSearchOptions = { profileModel: 'EatingPlaces' } as {
                [key: string]: any;
            };

            if (searchOptions.email) {
                userSearchOptions.email = {
                    $regex: new RegExp(searchOptions.email),
                    $options: 'i',
                };
            }

            if (searchOptions.userId) {
                userSearchOptions._id = searchOptions.userId;
            }

            const users = await this.user
                .find(userSearchOptions, null)
                .populate({
                    path: 'profileId',
                    match: searchOptions,
                })
                .exec();

            const eatingPlaces = users
                .map((item) => item.profileId)
                .filter((item) => item) as Array<EatingPlace>;

            const total = await this.eatingPlace.countDocuments(searchOptions);

            return { data: eatingPlaces, total };
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}

export default EatingPlaceService;
