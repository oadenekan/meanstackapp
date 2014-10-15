'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/*Comments schema*/
var CommentSchema = new Schema({
    body: {
        type: String,
        date: Date,
        trim: true,
        required: 'Make a comment',
    },
    updated: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    traffic: {
        type: Schema.ObjectId,
        ref: 'Traffic'
    },
});

/**
 * Traffic Schema
 */
var TrafficSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    location: {
        type: String
    },
    question: {
        type: String,
        default: '',
        trim: true
    }
    // comments: [{
    //     type: Schema.ObjectId,
    //     ref: 'Comment'
    // }],

});
mongoose.model('Comment', CommentSchema);
mongoose.model('Traffic', TrafficSchema);
