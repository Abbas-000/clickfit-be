import express, { Request, Response } from 'express';
import cors from 'cors';
import { connection } from './database';
import { MulterFile, StorageCallback, FilenameCallback } from './definitions';
import fs from "fs";
import path from "path";
import multer from "multer";
import { databaseOperations } from './utils';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const UPLOAD_DIR = path.join(process.cwd(), "upload_images");

if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR);
}

const storage = multer.diskStorage({
    destination: (req: Request, file: MulterFile, cb: StorageCallback) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req: Request, file: MulterFile, cb: FilenameCallback) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

app.get('/', (req: Request, res: Response) => {
    res.send('Server is running');
});

app.post('/upload', upload.array('file', 5), (req: Request, res: Response) => {
    const files = req.files as MulterFile[] | undefined;
    if (!files || files.length === 0) {
        res.status(400).send('No files uploaded.');
        return;
    }
    res.json({ message: 'File uploaded successfully', file: files });
    return;
});

app.listen(3000, async () => {
    console.log(`Server started on port:${3000}`);
    try {
        await new Promise((resolve, reject) => {
            connection.connect((err) => {
                if (err) {
                    console.error('error connecting: ' + err.stack);
                    reject(err);
                    return;
                }
                console.log('connected as id ' + connection.threadId);
                resolve(true);
            });
        });
        await databaseOperations(connection);
    } catch (err) {
        console.error('Database initialization failed:', err);
        process.exit(1);
    }
})