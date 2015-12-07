module.exports = {
  github: {
    clientID: '01f174d6d8e4573f0224', // Go to github.com, create an application and add clientID
    clientSecret: '3ec056f3f13341290b186404df9780c847a68de6' // Go to github.com, create an application and add clientSecret
  },
  url: '127.0.0.1',
  ports: {
    http: 8001
  },
  rethinkdb: {
    host: 'localhost',
    port: 28015,
    db: 'passport_rethinkdb_tutorial'
  }
};
