import mongoose, { Schema } from "mongoose";
import autoIncrement from 'mongoose-auto-increment';

const specialRequest = new Schema({
    user: {
        type: Number,
        ref: 'user',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: [Number], // Don't forget [0=>longitude,1=>latitude]
        required: true,
        index: '2d'
    },
    imgs: [{
        type: String,
    }],
    dueDate: {
        type: Date,
        required: true
    },
    budget: {
        type: Number
    },
    typeOfBudget: {
        type: String,
        enum: ['fixed', 'monthly', 'weekly']
    },
    bricoler: {
        type: Number,
        ref: 'user'
    },
    status: {
        type: String,
        enum: ['pendding', 'accepted', 'ignored', 'done'],
        default: 'pendding'
    },
    creationDate: {
        type: Date,
        default: Date.now
    }
})

specialRequest.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

autoIncrement.initialize(mongoose.connection);
specialRequest.plugin(autoIncrement.plugin, {
    model: 'special-request',
    startAt: 1,
});

export default mongoose.model("special-request", specialRequest);