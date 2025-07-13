import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            throw new Error('MONGO_URI .env içinde tanımlı değil!');
        }

        await mongoose.connect(uri);
        console.log('✅ MongoDB bağlantısı başarılı');
    } catch (error) {
        console.error('❌ MongoDB bağlantı hatası:', error);
        process.exit(1);
    }
};

export default connectDB;
