import mongoose, { Schema } from "mongoose";
import autoIncrement from 'mongoose-auto-increment';

const BidSchema = new Schema({
    user: {
        type: Number,
        required: true,
        ref: 'user'
    },
    bricol: {
        type: Number,
        ref: 'bricol',
        required: true
    },
    offerDescription: {
        type: String,
        required: true
    },
    cost: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pendding', 'accepted', 'refused'],
        default: 'pendding'
    },
    creationDate: {
        type: Date,
        default: Date.now
    }
})

BidSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

autoIncrement.initialize(mongoose.connection);
BidSchema.plugin(autoIncrement.plugin, {
    model: 'bid',
    startAt: 1,
});

export default mongoose.model("bid", BidSchema);