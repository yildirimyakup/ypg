import { Schema, model, Document, Types } from 'mongoose';

export interface IResult extends Document {
    ogrenciId: Types.ObjectId;
    testId: Types.ObjectId;
    cevaplar: string[];
    puan: number;
    geribildirim: string;
    tarih: Date;
}

const resultSchema = new Schema<IResult>({
    ogrenciId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    testId: { type: Schema.Types.ObjectId, ref: 'Test', required: true },
    cevaplar: [String],
    puan: Number,
    geribildirim: String,
    tarih: { type: Date, default: Date.now }
});

export const Result = model<IResult>('Result', resultSchema);
