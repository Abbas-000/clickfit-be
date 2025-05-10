interface MulterFile extends Express.Multer.File {
    originalname: string;
}

interface StorageCallback {
    (error: Error | null, destination: string): void;
}

interface FilenameCallback {
    (error: Error | null, filename: string): void;
}

export { MulterFile, StorageCallback, FilenameCallback };