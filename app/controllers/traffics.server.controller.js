'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    Traffic = mongoose.model('Traffic'),
    Comment = mongoose.model('Comment'),
    _ = require('lodash');


/**
 * Create a Traffic
 */
exports.create = function(req, res) {
    var traffic = new Traffic(req.body);
    traffic.user = req.user;

    traffic.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(traffic);
        }
    });
};

/**
 * Show the current Traffic
 */
exports.read = function(req, res) {
    res.jsonp(req.traffic);
};

/**
 * Update a Traffic
 */
exports.update = function(req, res) {
    var traffic = req.traffic;

    traffic = _.extend(traffic, req.body);

    traffic.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(traffic);
        }
    });
};

/**
 * Delete an Traffic
 */
exports.delete = function(req, res) {
    var traffic = req.traffic;

    traffic.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(traffic);
        }
    });
};

/**
 * List of Traffics
 */
exports.list = function(req, res) {
    var query = {};

    if(req.query.location && req.query.location !== '') {
        query.location = req.query.location;
    }

    Traffic.find(query).populate('user', 'displayName').exec(function(err, traffics) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(traffics);
        }
    });
};

/**
 * List of Traffic comments
 */
exports.commentList = function(req, res) {
    Comment.find({traffic: req.traffic._id}).sort('-created').populate('user').populate('traffic').exec(function(err, comment) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(comment);
        }
    });
};

/**
 * Traffic middleware
 */
exports.trafficByID = function(req, res, next, id) {
    Traffic.findById(id).populate('user', 'displayName').populate('comments', 'body').exec(function(err, traffic) {
        if (err) return next(err);
        if (!traffic) return next(new Error('Failed to load Traffic ' + id));
        req.traffic = traffic;
        next();
    });
};


/**
 * Adding a comment
 */
exports.addComment = function(req, res) {
    var comment = new Comment(req.body);
    comment.traffic = req.traffic;
    comment.user = req.user;
    comment.username = req.user.displayName;
    req.traffic.comments.unshift(comment);
    
    comment.save(function(err) {
        if(!err) {
            req.traffic.save(function(err) {
                if (err) {
                    return res.send(400, {
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.jsonp(req.traffic);
                }
            });
        }
    });   
};


/**
 * Delete a comment
 */
exports.deleteComment = function(req, res) {
    
    var traffic = req.traffic;

    traffic.comments.id(req.params.commentId).remove();
    
    traffic.save(function(err) {
        if (err) {
            return res.send(400, {
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(traffic);
        }
    });
};

exports.commentByID = function(req, res, next, id) {
    req.comment = req.traffic.comments.id(id);
    next();
};


exports.hasAuthorization = function(req, res, next) {
    if (req.traffic.user._id !== req.traffic.user) {
        return res.status(403).send({
            message: 'You are not authorized'
        });
    }
    next();
};
