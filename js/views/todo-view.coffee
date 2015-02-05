{ todofilter } = lib = require '../lib.coffee'

module.exports = class TodoView extends Backbone.View
 
  tagName: 'li'

  template: _.template($('#item-template').html())
  
  events:
    'click .toggle': 'toggleCompleted'
    'dblclick label': 'edit'
    'click .destroy': 'clear'
    'keypress .edit': 'updateOnEnter'
    'keydown .edit': 'revertOnEscape'
    'blur .edit': 'close'
  
  initialize: ->
    @listenTo @model, 'change', @render
    @listenTo @model, 'destroy', @remove
    @listenTo @model, 'visible', @toggleVisible
    return
  
  render: ->
    # Backbone LocalStorage is adding `id` attribute instantly after
    # creating a model.  This causes our TodoView to render twice. Once
    # after creating a model and once on `id` change.  We want to
    # filter out the second redundant render, which is caused by this
    # `id` change.  It's known Backbone LocalStorage bug, therefore
    # we've to create a workaround.
    # https://github.com/tastejs/todomvc/issues/469
    if @model.changed.id != undefined
      return
    @$el.html @template(@model.toJSON())
    @$el.toggleClass 'completed', @model.get('completed')
    @toggleVisible()
    @$input = @$('.edit')
    this
  
  toggleVisible: ->
    @$el.toggleClass 'hidden', @isHidden()
    return
  
  isHidden: ->
    if @model.get('completed') then lib.todofilter == 'active' else lib.todofilter == 'completed'
  
  toggleCompleted: ->
    @model.toggle()
    return
  
  edit: ->
    @$el.addClass 'editing'
    @$input.focus()
    return
  
  close: ->
    value = @$input.val()
    trimmedValue = value.trim()
    # We don't want to handle blur events from an item that is no
    # longer being edited. Relying on the CSS class here has the
    # benefit of us not having to maintain state in the DOM and the
    # JavaScript logic.
    if !@$el.hasClass('editing')
      return
    if trimmedValue
      @model.save title: trimmedValue
      if value != trimmedValue
        # Model values changes consisting of whitespaces only are
        # not causing change to be triggered Therefore we've to
        # compare untrimmed version with a trimmed one to check
        # whether anything changed
        # And if yes, we've to trigger change event ourselves
        @model.trigger 'change'
    else
      @clear()
    @$el.removeClass 'editing'
    return
  
  updateOnEnter: (e) ->
    if e.which == ENTER_KEY
      @close()
    return
  
  revertOnEscape: (e) ->
    if e.which == ESC_KEY
      @$el.removeClass 'editing'
      # Also reset the hidden input back to the original value.
      @$input.val @model.get('title')
    return
  
  clear: ->
    @model.destroy()
    return