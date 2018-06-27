import mongoose, { Schema } from "mongoose";
import autoIncrement from 'mongoose-auto-increment';

const HistorySchema = new Schema({
    serviceType: {
        type: String,
        enum: ['bricol', 'bricol-bt-cities', 'special-request',]
    },
    service: {
        type: Number,
        refPath: 'serviceType',
        required: true
    },

    bricoler: {
        type: Number,
        ref: "user"
    },
    user: {
        type: Number,
        ref: 'user'
    },
    status: {
        type: String,
        enum: ['pendding', 'inProgress', 'assigned', 'accepted', 'ignored', 'done'],
        default : 'pendding'
    },
    creationDate: {
        type: Date,
        default: Date.now
    }

})

HistorySchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

autoIncrement.initialize(mongoose.connection);
HistorySchema.plugin(autoIncrement.plugin, {
    model: 'history',
    startAt: 1,
});

export default mongoose.model("history", HistorySchema);