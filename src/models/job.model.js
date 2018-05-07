import mongoose, { Schema } from "mongoose";
import autoIncrement from 'mongoose-auto-increment';

const JobSchema = new Schema({
    name: {
        type: String,
        required: true
    }

})

JobSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

autoIncrement.initialize(mongoose.connection);
JobSchema.plugin(autoIncrement.plugin, {
    model: 'job',
    startAt: 1,
});

export default mongoose.model("job", JobSchema);