function channel(socket, resource) {
    var connection = null;
    var r = require('rethinkdb');
    var config = require('config');
    var rules = require('../rules')();
    var Q = require('q');

    var that = {}


    r.connect(config.rethinkdb, function(error, conn) {
        if (error) {
            handleError(res, error);
        } else {
            connection = conn; //running condition
        }
    });

    function socketConnect(socket) {
        //console.log("connection",connection);
        socket.on("message", function(message) {
            if (socket.user) {
                message.owner = socket.user;
            }
            checkpermissions(message);
            r.db("test").table('chat').insert(message).run(connection, function(error, cursor) {
                //console.log(arguments);
            });

        })
        r.db("test").table('chat').changes().run(connection, function(error, feed) {
            if (error) {
                console.log(error);
            }
            feed.on("data", function(newMessage) {
                socket.emit("message", newMessage)
                if (newMessage.new_val) {
                    var resource = newMessage.new_val.resource;
                    console.log("resource", resource);
                    rules.resource(resource);
                }
            })
        })
        socket.on("disconnect", function() {
            // i want this socket data always displayed...
            // but first-connected-client doesn't fire this event ..
            console.log("ddicsponet", socket.user);
        })


        function checkpermissions(message) {

        }

    };

    return {
        init: function(socket) {
            //that.user=theuser;
            //console.log("TATATA",that.user);
            console.log("SOCKET", socket.user);
            socketConnect(socket); //one db connection per user - thats not good
        },
        getUser: function(id) {
            var q = Q.defer();
            r.db("passport_rethinkdb_tutorial").table('users').get(id).run(connection, function(error, cursor) {
                q.resolve(cursor);
            });
            return q.promise;
        },
        insert: function(message) {
            message.created = (new Date()).getTime()
            message.modified = (new Date()).getTime()
            var q = Q.defer();
            if (message.owner) {
                if (connection) {
                    r.db("test").table('chat').insert(message).run(connection, function(error, cursor) {
                        console.log("inserted", error, cursor);
                        q.resolve(cursor);
                    });
                } else {
                    q.reject("no connection");
                }
            } else {
                q.reject("not logged in");
            }
            return q.promise;
        },
        list: function(path, skip, limit) {
            var q = Q.defer();
            if (connection) {
                if (!skip) skip = 0;
                if (!limit) limit = 10;
                r.db("test").table('chat').orderBy(r.desc("created")).filter(function(user) {
                    return (user('resource').match("^" + path + "$"))
                }).skip(skip).limit(limit).run(connection, function(error, cursor) {
                    q.resolve(cursor.toArray());
                });
            } else {
                q.reject("no connection");
            }
            return q.promise;
        },
        update: function(path, data) {
            var q = Q.defer();
            var id = path.split("/").pop();
            delete data.created; //do not overwrite creation date
            data.modified = (new Date()).getTime()
            r.db("test").table("chat").get(id).update(data).run(connection, function(error, cursor) {
                q.resolve(cursor);
            });
            return q.promise;
        },
        delete: function(path) {
            var q = Q.defer();
            console.log("delete", path);
            var id = path.split("/").pop();
            console.log("id", id);
            r.db("test").table("chat").get(id).delete().run(connection, function(error, cursor) {
                q.resolve(cursor);
            });
            return q.promise;
        }
    }

}


module.exports = channel;
