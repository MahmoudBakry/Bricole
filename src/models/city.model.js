import mongoose, { Schema } from "mongoose";
import autoIncrement from 'mongoose-auto-increment';

const CitySchema = new Schema({
    name: {
        type: String,
        required: true
    }

})

CitySchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

autoIncrement.initialize(mongoose.connection);
CitySchema.plugin(autoIncrement.plugin, {
    model: 'city',
    startAt: 1,
});

export default mongoose.model("city", CitySchema);