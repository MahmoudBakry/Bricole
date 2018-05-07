import config from '../config';
import ApiError from '../helpers/ApiError';
import * as cloudinary from 'cloudinary';


cloudinary.config(config.cloudinary);


// Convert Local Upload To Cloudinary Url
export async function toImgUrl(multerObject) {
  try {
    let result = await cloudinary.v2.uploader.upload(multerObject.path);

    console.log('imgUrl: ', result.secure_url);
    return result.secure_url;
  }
  catch (err) {
    console.log('Cloudinary Error: ', err);
    throw new ApiError(500, 'Failed To Upload Image due to network issue! Retry again...');
  }
}
