import multer from 'multer';
import OperationalError from "../middleware/OperationalError";

const storage = multer.memoryStorage();

const fileSizeLimit = 10 * 1024 * 1024;

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Add allowed mime types
    const allowedMimes = [
        'application/pdf',
    ];

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new OperationalError(`File type ${file.mimetype} is not allowed`, 400));
    }
};

export const upload = multer({
    storage,
    limits: {
        fileSize: fileSizeLimit, // 10 MB
        files: 1 // Maximum number of files
    },
    fileFilter
});