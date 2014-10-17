'use strict';

module.exports = function(app) {
    var users = require('../../app/controllers/users');
    var traffics = require('../../app/controllers/traffics');
    var comments = require('../../app/controllers/traffics');
    // Traffics Routes
    app.route('/traffics')
        .get(traffics.list)
        .post(users.requiresLogin, traffics.create);

    // app.route('/comments')
    //     .get(comments.list)

    app.route('/traffics/:trafficId')
        .get(traffics.read)
        .put(users.requiresLogin, traffics.hasAuthorization, traffics.update)
        .delete(users.requiresLogin, traffics.hasAuthorization, traffics.delete);

    app.route('/traffics/:trafficId/comments')
        .get(traffics.commentList)
        .post(users.requiresLogin, traffics.addComment);

    app.route('/traffics/:trafficId/comments/:commentId')
        .put(users.requiresLogin, traffics.hasAuthorization, traffics.update)
        .delete(users.requiresLogin, traffics.hasAuthorization, traffics.deleteComment);


    // Finish by binding the Traffic middleware
    app.param('trafficId', traffics.trafficByID);

    // Finish by binding the Comment middleware
    app.param('commentId', comments.commentByID);
};
