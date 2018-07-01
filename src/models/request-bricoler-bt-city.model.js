import mongoose, { Schema } from "mongoose";
import autoIncrement from 'mongoose-auto-increment';

const RequestTripSchema = new Schema({
    title: {
        type: String,
    },
    descripion: {
        type: String,
        
    },
    budget: {
        type: Number
    },
    user: {
        type: Number,
        ref: 'user'
    },
    trip: {
        type: Number,
        ref: 'trip-bt-city'
    },
    status: {
        type: String,
        enum: ['pendding', 'accept', 'ignore', 'done'],
        default: 'pendding'
    },
    creationDate: {
        type: Date,
        default: Date.now
    }
})

RequestTripSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

autoIncrement.initialize(mongoose.connection);
RequestTripSchema.plugin(autoIncrement.plugin, {
    model: 'request-trip-bt-city',
    startAt: 1,
});

export default mongoose.model("request-trip-bt-city", RequestTripSchema);