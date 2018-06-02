import mongoose, { Schema } from "mongoose";
import autoIncrement from 'mongoose-auto-increment';

const BricolBtCitiesSchema = new Schema({
    user: {
        type: Number,
        ref: 'user',
        required: true
    },
    from : {
        type : String, 
        required : true
    },
    to : {
        type : String, 
        required : true
    },
    typeOfBricole: {
        type: String,
        enum: ['inCity', 'betweenCity'],
        default: 'betweenCity'
    },
    title: {
        type: String,
        required: true
    },
    descripption: {
        type: String,
        required: true
    },
    bricolerGender: {
        type: String,
        enum: ['male', 'female', 'both'],
        required: true
    },
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
    budget: {
        type: Number
    },
    tripType : {
        type : String, 
        enum : ['one way', 'two way'],
        default : 'one way'
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

BricolBtCitiesSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

autoIncrement.initialize(mongoose.connection);
BricolBtCitiesSchema.plugin(autoIncrement.plugin, {
    model: 'bricol-bt-cities',
    startAt: 1,
});

export default mongoose.model("bricol-bt-cities", BricolBtCitiesSchema);