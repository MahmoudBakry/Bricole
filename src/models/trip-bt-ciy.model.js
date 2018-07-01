import mongoose, { Schema } from "mongoose";
import autoIncrement from 'mongoose-auto-increment';

const TripBtCitySchema = new Schema({
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    bricoler: {
        type: Number,
        ref: 'user',
        required: true
    },
    tripType: {
        type: String,
        enum: ['one way', 'two way'],
        default: 'one way'
    },
    duration: {
        type: Number
    },
    typeOfDuration: {
        type: String,
        enum: ['day', 'week', 'month'],
        default: 'day'
    },
    travelingDate: {
        type: Date
    },
    returnDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['prepare', 'onTrip', 'finished'],
        default : 'prepare'
    },
    imgs : [{
        type :String, 
    }],
    creationDate: {
        type: Date,
        default: Date.now
    }
})

TripBtCitySchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

autoIncrement.initialize(mongoose.connection);
TripBtCitySchema.plugin(autoIncrement.plugin, {
    model: 'trip-bt-city',
    startAt: 1,
});

export default mongoose.model("trip-bt-city", TripBtCitySchema);