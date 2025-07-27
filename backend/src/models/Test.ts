import mongoose from 'mongoose';

const testSchema = new mongoose.Schema({
    baslik: {
        type: String,
        required: true
    },
    ogretmenId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    soruListesi: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    }],
    atananSiniflar: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class'
    }],
    yayinDurumu: {
        type: Boolean,
        default: false
    },
    yayinZamani: {
        type: Date
    }
}, { timestamps: true });

export default mongoose.model('Test', testSchema);
