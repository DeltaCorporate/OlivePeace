import { Schema, model } from 'mongoose';

const ConfigSchema = new Schema({
    key: {
        type: String,
        required: true,
    },
    value: {
        type: Schema.Types.Mixed,
        required: true
    }
}, {
    timestamps: true
});

const Config = model('Config', ConfigSchema);

export default Config;