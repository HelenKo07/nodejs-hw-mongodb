import mongoose from 'mongoose';
import { getEnvVar } from '../utils/getEnvVar.js';

export const initMongoConnection = async () => {

        const MONGODB_USER = getEnvVar('MONGODB_USER');
        const MONGODB_PASSWORD = getEnvVar('MONGODB_PASSWORD');
        const MONGODB_DB = getEnvVar('MONGODB_DB');
        const MONGODB_URL = getEnvVar('MONGODB_URL');
    try {
        await mongoose.connect(`mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`);
    } catch (error) {
       console.error('Error while setting up mongo connection', error.message);
    }
};

