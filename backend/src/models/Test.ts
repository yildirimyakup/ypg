import { Schema, model, Document, Types } from 'mongoose';

export interface ITest extends Document {
    baslik: string;
    ogretmenId: Types.ObjectId;
    soruListesi: Types.ObjectId[];
    atananSinifId: Types.ObjectId;
    tarih: Date;
}

const testSchema = new Schema<ITest>({
    baslik: { type: String, required: true },
    ogretmenId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    soruListesi: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
    atananSinifId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
    tarih: { type: Date, default: Date.now }
});

export const Test = model<ITest>('Test', testSchema);
