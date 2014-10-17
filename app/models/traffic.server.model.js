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
        trim: true,
        required: 'Make a comment',
    },
    created: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    username: {
        type: String,
        trim: true
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
    comments: [{
        type: Schema.ObjectId,
        ref: 'Comment'
    }],

});
mongoose.model('Comment', CommentSchema);
mongoose.model('Traffic', TrafficSchema);
