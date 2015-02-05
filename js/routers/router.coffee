{ todos } = lib = require '../lib.coffee'

module.exports = class TodoRouter extends Backbone.Router
  
  routes: '*filter': 'setFilter'
  
  setFilter: (param) ->
    # Set the current filter to be used
    lib.todofilter = param or ''
    # Trigger a collection filter event, causing hiding/unhiding
    # of Todo view items
    todos.trigger 'filter'