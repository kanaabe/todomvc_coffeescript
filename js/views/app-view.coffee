Todos = require '../collections/todos.coffee'
TodoView  = require './todo-view.coffee'
{ todos, todofilter } = lib = require '../lib.coffee'

module.exports = class AppView extends Backbone.View
  
  el: '#todoapp'
  
  statsTemplate: _.template($('#stats-template').html())
  
  events:
    'keypress #new-todo': 'createOnEnter'
    'click #clear-completed': 'clearCompleted'
    'click #toggle-all': 'toggleAllComplete'
  
  initialize: ->
    @allCheckbox = @$('#toggle-all')[0]
    @$input = @$('#new-todo')
    @$footer = @$('#footer')
    @$main = @$('#main')
    @$list = $('#todo-list')
    @listenTo todos, 'add', @addOne
    @listenTo todos, 'reset', @addAll
    @listenTo todos, 'change:completed', @filterOne
    @listenTo todos, 'filter', @filterAll
    @listenTo todos, 'all', @render
    # Suppresses 'add' events with {reset: true} and prevents the app view
    # from being re-rendered for every model. Only renders when the 'reset'
    # event is triggered at the end of the fetch.
    todos.fetch reset: true
    return
  
  render: ->
    completed = todos.completed().length
    remaining = todos.remaining().length
    if todos.length
      @$main.show()
      @$footer.show()
      @$footer.html @statsTemplate(
        completed: completed
        remaining: remaining)
      @$('#filters li a').removeClass('selected').filter('[href="#/' + (lib.todofilter or '') + '"]').addClass 'selected'
    else
      @$main.hide()
      @$footer.hide()
    @allCheckbox.checked = !remaining
    return
  
  addOne: (todo) ->
    view = new TodoView(model: todo)
    @$list.append view.render().el
    return
  
  addAll: ->
    @$list.html ''
    todos.each @addOne, this
    return
  
  filterOne: (todo) ->
    todo.trigger 'visible'
    return
  
  filterAll: ->
    todos.each @filterOne, this
    return
  
  newAttributes: ->
    {
      title: @$input.val().trim()
      order: todos.nextOrder()
      completed: false
    }
  
  createOnEnter: (e) ->
    if e.which == ENTER_KEY and @$input.val().trim()
      todos.create @newAttributes()
      @$input.val ''
    return
  
  clearCompleted: ->
    _.invoke todos.completed(), 'destroy'
    false
  
  toggleAllComplete: ->
    completed = @allCheckbox.checked
    todos.each (todo) ->
      todo.save completed: completed
      return
    return
