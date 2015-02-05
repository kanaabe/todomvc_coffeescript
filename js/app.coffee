TodoRouter = require './routers/router.coffee'
AppView = require './views/app-view.coffee'

ENTER_KEY = 13
ESC_KEY = 27
$ ->
  new TodoRouter
  new AppView
  Backbone.history.start()
  