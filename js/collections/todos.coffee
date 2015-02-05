Todo = require '../models/todo.coffee'

module.exports = class Todos extends Backbone.Collection
  
  model: Todo

  localStorage: new (Backbone.LocalStorage)('todos-backbone')
  
  completed: ->
    @where completed: true
  
  remaining: ->
    @where completed: false
  
  nextOrder: ->
    if @length then @last().get('order') + 1 else 1
  
  comparator: 'order'