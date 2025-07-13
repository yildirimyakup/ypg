import { Schema, model, Document } from 'mongoose';

export interface IQuestion extends Document {
    tip: 'coktan_secmeli' | 'dogru_yanlis';
    icerik: string;
    secenekler?: string[];
    cevap: string;
}

const questionSchema = new Schema<IQuestion>({
    tip: { type: String, enum: ['coktan_secmeli', 'dogru_yanlis'], required: true },
    icerik: { type: String, required: true },
    secenekler: [String],
    cevap: { type: String, required: true }
});

export const Question = model<IQuestion>('Question', questionSchema);
