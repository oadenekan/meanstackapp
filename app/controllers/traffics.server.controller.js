'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Traffic = mongoose.model('Traffic'),
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
	var traffic = req.traffic ;

	traffic = _.extend(traffic , req.body);

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
	var traffic = req.traffic ;

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
	Traffic.find().sort('-created').populate('user', 'displayName').exec(function(err, traffics) {
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
 * Traffic middleware
 */
exports.trafficByID = function(req, res, next, id) { 
	Traffic.findById(id).populate('user', 'displayName').exec(function(err, traffic) {
		if (err) return next(err);
		if (! traffic) return next(new Error('Failed to load Traffic ' + id));
		req.traffic = traffic ;
		next();
	});
};

/**
 * Traffic authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.traffic.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

exports.addComment = function(req, res) {
    var post = req.traffic;
    var comment = req.body;
    comment.commOwner = req.user;
    post.comments.unshift(comment);

    post.save(function(err) {
        if (err) {
            return res.send(400, {
                message: errorHandler.getErrorMessage(err)
            });
        }   
        else {
            res.jsonp(post);
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
        }   
        else {
            res.jsonp(traffic);
        }
    });

	// id = req.traffic._id;
	// var commentsArray = _.map(req.traffic.comments, function(items) {
	// 	console.log('item: ' + items._id);
	//     Traffic.findById(id, function (err, post) {
	// 	  if (!err) {
	// 	    post.comments.id(items._id).remove();
	// 	    post.save(function (err) {
	// 	    	if (err) {
	// 	    		return res.send(400, {
	// 	    			message: errorHandler.getErrorMessage(err)
	// 	    		});
	// 	    	} else{
	// 	    		res.jsonp(post);
	// 	    	}
	// 	    });
	// 	  }
	// 	});
	// });
};

exports.commentByID = function(req, res, next, id) {
	req.comment = req.traffic.comments.id(id);
	next();
};

