import mongoose, { Schema } from "mongoose";
import autoIncrement from 'mongoose-auto-increment';

const BricolSchema = new Schema({
    user: {
        type: Number,
        ref: 'user',
        required: true
    },
    typeOfBricole: {
        type: String,
        enum: ['inCity', 'betweenCity'],
        default: 'inCity'
    },
    title: {
        type: String,
        required: true
    },
    descripption: {
        type: String,
        required: true
    },
    location: {
        type: [Number], // Don't forget [0=>longitude,1=>latitude]
        required: true,
        index: '2d'
    },
    bricolerGender: {
        type: String,
        enum: ['male', 'female', 'both'],
        required: true
    },
    completedOnline: {
        type: Boolean,
        default: false
    },
    job: [{
        type: Number,
        ref: "job",
    }],
    vehicleToWork: [{
        type: String,
        required: true
    }],
    numberOfBricolers: {
        type: Number,
    },
    imgs: [{
        type: String,
    }],
    dueDate: {
        type: Date,
        required: true
    },
    expiredAfter: {
        type: Number
    },
    typeOfexpiredAfter: {
        type: String,
        enum: ['day', 'houre', 'week', 'month']
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
        enum: ['pendding', 'assigned', 'inProgress', 'done'],
        default: 'pendding'
    },
    creationDate: {
        type: Date,
        default: Date.now
    }
})

BricolSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

autoIncrement.initialize(mongoose.connection);
BricolSchema.plugin(autoIncrement.plugin, {
    model: 'bricol',
    startAt: 1,
});

export default mongoose.model("bricol", BricolSchema);