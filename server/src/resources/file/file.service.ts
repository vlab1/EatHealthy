import * as fs from 'fs';
import { Schema } from 'mongoose';
import { generateRandomString } from '@/utils/functions/functions';
import * as path from 'path';

class FileService {
    private UPLOADED_FILES_FOLDER_NAME = `${process.env.UPLOADED_FILES_FOLDER_NAME}`;

    private getFileExtension(filename: string) {
        var ext = /^.+\.([^.]+)$/.exec(filename);
        return ext == null ? '' : ext[1];
    }

    public generateDirectory(modelName: string, userId: Schema.Types.ObjectId) {
        return `./${
            this.UPLOADED_FILES_FOLDER_NAME
        }/files/${modelName}/images/${userId.toString()}`;
    }

    public generateDirectoryDish(modelName: string, userId: Schema.Types.ObjectId, dishId: Schema.Types.ObjectId) {
        return `./${
            this.UPLOADED_FILES_FOLDER_NAME
        }/files/${modelName}/images/${userId.toString()}/${dishId.toString()}`;
    }

    public generatePath(modelName: string, userId: Schema.Types.ObjectId) {
        return `files/${modelName}/images/${userId.toString()}`;
    }

    public generatePathDish(modelName: string, userId: Schema.Types.ObjectId, dishId: Schema.Types.ObjectId) {
        return `files/${modelName}/images/${userId.toString()}/${dishId.toString()}`;
    }

    public async updateFilesSetDocument(
        newFiles: Express.Multer.File[],
        editedFiles: Array<string>,
        currentFiles: Array<string>,
        path: string
    ): Promise<Array<string> | Error> {
        try {
            await fs.promises.mkdir(
                `./${this.UPLOADED_FILES_FOLDER_NAME}/${path}`,
                {
                    recursive: true,
                }
            );

            const updatedFiles: Array<string> = [];

            if (editedFiles) {
                updatedFiles.push(...editedFiles);
            } else {
                updatedFiles.push(...currentFiles);
            }

            if (newFiles && newFiles.length + updatedFiles.length > 10) {
                throw new Error('Maximum number of files 10');
            }

            if (newFiles && newFiles.length > 0) {
                for (let i = 0; i < newFiles.length; i++) {
                    if (newFiles[i].buffer.length > 10000000) {
                        throw new Error('Maximum file size 10 MB');
                    }
                }

                await Promise.all(
                    newFiles.map(async (item) => {
                        const fileExtension = this.getFileExtension(
                            item.originalname
                        );
                        const randString = generateRandomString(24);
                        const fileName = randString + '.' + fileExtension;

                        await fs.promises.writeFile(
                            `./${this.UPLOADED_FILES_FOLDER_NAME}/${path}/${fileName}`,
                            item.buffer,
                            'binary'
                        );
                        const fullPath = `${path}/${fileName}`;
                        updatedFiles.push(fullPath);
                    })
                );
            }

            this.deleteMissingFiles(
                `./${this.UPLOADED_FILES_FOLDER_NAME}/${path}`,
                path,
                updatedFiles
            );

            return updatedFiles;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async deleteDirectory(directory: string): Promise<void> {
        try {
            const filesInDirectory = await fs.promises.readdir(directory);
            await Promise.all(
                filesInDirectory.map(async (file) => {
                    try {
                        await fs.promises.access(directory, fs.constants.F_OK);
                        await fs.promises.unlink(`${directory}/${file}`);
                    } catch (error: any) {
                        if (error.code === 'ENOENT') {
                            console.log(
                                `File ${`${directory}/${file}`} does not exist.`
                            );
                        } else {
                            throw new Error(error.message);
                        }
                    }
                })
            );
            await fs.promises.access(directory, fs.constants.F_OK);
            await fs.promises.rmdir(directory);
        } catch (error: any) {
            if (error.code === 'ENOENT') {
                console.log(`File ${`${directory}`} does not exist.`);
            } else {
                throw new Error(error.message);
            }
        }
    }

    public async createFilesSetDocument(
        newFiles: Express.Multer.File[],
        path: string
    ): Promise<Array<string> | Error> {
        try {
            await fs.promises.mkdir(
                `./${this.UPLOADED_FILES_FOLDER_NAME}/${path}`,
                {
                    recursive: true,
                }
            );
            const updatedFiles: Array<string> = [];

            if (newFiles && newFiles.length > 10) {
                throw new Error('Maximum number of files 10');
            }

            if (newFiles && newFiles.length > 0) {
                for (let i = 0; i < newFiles.length; i++) {
                    if (newFiles[i].buffer.length > 10000000) {
                        throw new Error('Maximum file size 10 MB');
                    }
                }

                await Promise.all(
                    newFiles.map(async (item) => {
                        const fileExtension = this.getFileExtension(
                            item.originalname
                        );
                        const randString = generateRandomString(24);
                        const fileName = randString + '.' + fileExtension;

                        await fs.promises.writeFile(
                            `./${this.UPLOADED_FILES_FOLDER_NAME}/${path}/${fileName}`,
                            item.buffer,
                            'binary'
                        );
                        const fullPath = `${path}/${fileName}`;
                        updatedFiles.push(fullPath);
                    })
                );
            }

            return updatedFiles;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async copyAndPasteFolder(
        sourcePath: string,
        destinationPath: string
    ) {
        try {
            const destinationExists = await this.folderExists(destinationPath);

            if (destinationExists) {
                await this.deleteFolder(destinationPath);
            }

            const sourcePathExists = await this.folderExists(sourcePath);

            if (!sourcePathExists) {
                await fs.promises.mkdir(sourcePath, {
                    recursive: true,
                });
            }

            await this.copyFolder(sourcePath, destinationPath);
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    private async deleteMissingFiles(
        directory: string,
        path: string,
        files: string[]
    ): Promise<void> {
        try {
 
            const filesInDirectory = await fs.promises.readdir(directory);
            await Promise.all(
                filesInDirectory.map(async (file) => {
                    const filePath = `${path}/${file}`;
                    if (!files.includes(filePath)) {
                        try {
                            await fs.promises.access(
                                directory,
                                fs.constants.F_OK
                            );
                            await fs.promises.unlink(`${directory}/${file}`);
                        } catch (error: any) {
                            if (error.code === 'ENOENT') {
                                console.log(
                                    `File ${`${directory}/${file}`} does not exist.`
                                );
                            } else {
                                throw new Error(error.message);
                            }
                        }
                    }
                })
            );
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    private async folderExists(folderPath: string) {
        try {
            const stats = await fs.promises.stat(folderPath);

            return stats.isDirectory();
        } catch (error: any) {
            if (error.code === 'ENOENT') {
                return false;
            }
            throw new Error(error.message);
        }
    }

    private async deleteFolder(folderPath: string) {
        try {
            await fs.promises.rm(folderPath, { recursive: true });
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    private async copyFolder(sourcePath: string, destinationPath: string) {
        try {
            await fs.promises.mkdir(destinationPath, {
                recursive: true,
            });

            const files = await fs.promises.readdir(sourcePath);

            for (const file of files) {
                const sourceFile = path.join(sourcePath, file);
                const destinationFile = path.join(destinationPath, file);

                const stats = await fs.promises.stat(sourceFile);
                if (stats.isDirectory()) {
                    await this.copyFolder(sourceFile, destinationFile);
                } else {
                    await fs.promises.copyFile(sourceFile, destinationFile);
                }
            }
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}

export default FileService;
