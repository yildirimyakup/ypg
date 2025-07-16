import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    icerik: {
        type: String,
        required: true
    },
    secenekler: {
        type: [String],
        required: true
    },
    cevap: {
        type: String,
        required: true
    },
    tip: {
        type: String,
        enum: ['coktan_secmeli', 'dogru_yanlis'],
        required: true
    }
}, { timestamps: true });

export default mongoose.model('Question', questionSchema);
