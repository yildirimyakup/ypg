import { Schema, model, Document, Types } from 'mongoose';

export interface IClass extends Document {
    ad: string;
    ogretmenId: Types.ObjectId;
    ogrenciIdListesi: Types.ObjectId[];
}

const classSchema = new Schema<IClass>({
    ad: { type: String, required: true },
    ogretmenId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    ogrenciIdListesi: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

export const ClassModel = model<IClass>('Class', classSchema);
