
import { v2 } from 'cloudinary';
import { CLOUDINARY_KEY, CLOUDINARY_NAME, CLOUDINARY_SECRET } from 'src/config';
import { CLOUDINARY } from 'src/constant';

export const CloudinaryProvider = {
    provide: CLOUDINARY,
    useFactory: () => {
        return v2.config({
            cloud_name: CLOUDINARY_NAME,
            api_key: CLOUDINARY_KEY,
            api_secret: CLOUDINARY_SECRET,
        });
    },
};