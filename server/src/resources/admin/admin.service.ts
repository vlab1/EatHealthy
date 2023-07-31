import AdminModel from '@/resources/admin/admin.model';
import token from '@/utils/token';
import Admin from '@/resources/admin/admin.interface';
import { Schema } from 'mongoose';
import { exec } from 'child_process';
import fs from 'fs';
import FileService from '@/resources/file/file.service';
const path = require('path');

class AdminService {
    private admin = AdminModel;
    private FileService = new FileService();

    private executeCommand = (command: string): Promise<void> => {
        return new Promise<void>((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    };

    public async create(
        email: string,
        password: string
    ): Promise<Admin | Error> {
        try {
            const adminExists = await this.admin.findOne({ email });

            if (adminExists) {
                throw new Error('Admin already exists');
            }

            const admin = await this.admin.create({
                email,
                password,
            });

            return admin;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async login(
        email: string,
        password: string
    ): Promise<string | Error> {
        try {
            let admin = await this.admin.findOne({ email });

            if (!admin && email === process.env.FIRST_ADMIN_EMAIL) {
                admin = await this.admin.create({
                    email: email,
                    password: password,
                });
            }

            if (!admin) {
                throw new Error('Unable to find admin with that data');
            }

            if (await admin.isValidPassword(password)) {
                const accessToken = token.createAccessToken(admin._id);

                return accessToken;
            } else {
                throw new Error('Wrong credentials given');
            }
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async delete(
        adminId: Schema.Types.ObjectId,
        _id: Schema.Types.ObjectId
    ): Promise<Admin | Error> {
        try {
            if (adminId.toString() === _id.toString()) {
                throw new Error('You cannot delete your account');
            }

            const admin = await this.admin
                .findByIdAndDelete(_id)
                .select(['-password'])
                .exec();

            if (!admin) {
                throw new Error('Unable to delete admin with that data');
            }

            return admin;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async find(properties: {
        [key: string]: any;
    }): Promise<Array<Admin> | Error> {
        try {
            const admins = await this.admin
                .find(properties)
                .select(['-password'])
                .exec();

            if (!admins) {
                throw new Error('Unable to find admins with that data');
            }

            return admins;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async createBackup(): Promise<void | Error> {
        try {
            const currentDate = new Date().toISOString().split('T')[0];
            const backupPath = `./${process.env.BACKUP_MONGODB_FOLDER_NAME}/${currentDate}/`;
            //locale
            //const command = `"${process.env.MONGODUMP_EXE}" --uri "${process.env.MONGO_URI}" --out ${backupPath}`;
            //cloud
            const connectionString = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}${process.env.MONGO_PATH}/${process.env.MONGODB_DB_CLOUD_NAME}`;
            const command = `"${process.env.MONGODUMP_EXE}" --uri="${connectionString}" --out="${backupPath}"`;
            //
            await this.FileService.copyAndPasteFolder(
                `./${process.env.UPLOADED_FILES_FOLDER_NAME}`,
                `${backupPath}public`
            );
            await this.executeCommand(command);
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async restoreData(backupDate: Date): Promise<void | Error> {
        try {
            const dateString = backupDate.toString();
            //locale
            //const backupPath = `./${process.env.BACKUP_MONGODB_FOLDER_NAME}/${dateString}/${process.env.MONGODB_DB_NAME}`;
            //cloud
            const backupPath = `./${process.env.BACKUP_MONGODB_FOLDER_NAME}/${dateString}/${process.env.MONGODB_DB_CLOUD_NAME}`;
            //
            const filesPath = `./${process.env.BACKUP_MONGODB_FOLDER_NAME}/${dateString}/public`;

            try {
                await fs.promises.access(backupPath, fs.constants.F_OK);
                //locale
                //const command = `"${process.env.MONGORESTORE_EXE}" --uri "${process.env.MONGO_URI}" --drop --dir ${backupPath}`;
                //cloud
                const connectionString = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}${process.env.MONGO_PATH_BACKUP}${process.env.MONGODB_DB_CLOUD_NAME}`;
                const command = `"${process.env.MONGORESTORE_EXE}" --uri="${connectionString}" --drop --dir ${backupPath}`;  
                //
                await this.executeCommand(command);
                await this.FileService.copyAndPasteFolder(
                    filesPath,
                    `./${process.env.UPLOADED_FILES_FOLDER_NAME}`
                );
            } catch (error: any) {
                if (error.code === 'ENOENT') {
                    throw new Error(`${backupPath} does not exist.`);
                } else {
                    throw new Error(error.message);
                }
            }
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async getAllBackups(): Promise<any | Error> {
        try {
            const backupsDir = `./${process.env.BACKUP_MONGODB_FOLDER_NAME}`;
            const backupFolders = fs.readdirSync(backupsDir);

            const backupDates = backupFolders.map((folder) => {
                return folder;
            });

            return backupDates;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}

export default AdminService;
