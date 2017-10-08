
/*global requirejs,define,fs*/
define([
  'superagent',
  'cli-table',
  '../../lib/config'
], function (request, Table, config) {

  var ls = {
    project: null,
    query: null,
    type: null,
    users: null,
    table: null,

    getUsers: function () {
      var that = this,
        i = 0;
      request
        .get(config.auth.url + this.query)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Basic ' + config.auth.token)
        .end(function (res) {
          if (!res.ok) {
            return console.log((res.body.errorMessages || [res.error]).join('\n'));
          }

          that.users = res.body;
          that.table = new Table({
            head: ['Name', 'Email']
          });

          for (i = 0; i < that.users.length; i += 1) {
            that.table.push([
              that.users[i].name,
              that.users[i].emailAddress,
            ]);
          }

          if (that.users.length > 0) {
            console.log(that.table.toString());
          } else {
            console.log('No Users');
          }

        });
    },

    list: function () {
      this.query = 'rest/api/latest/user/search?startAt=0&maxResults=1000&username=%'
      return this.getUsers();
    },

  };

  return ls;

});
