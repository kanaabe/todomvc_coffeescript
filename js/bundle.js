(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/kanaabe/Development/projects/todo_coffee/js/app.coffee":[function(require,module,exports){
var AppView, ENTER_KEY, ESC_KEY, TodoRouter;

TodoRouter = require('./routers/router.coffee');

AppView = require('./views/app-view.coffee');

ENTER_KEY = 13;

ESC_KEY = 27;

$(function() {
  new TodoRouter;
  new AppView;
  return Backbone.history.start();
});



},{"./routers/router.coffee":"/Users/kanaabe/Development/projects/todo_coffee/js/routers/router.coffee","./views/app-view.coffee":"/Users/kanaabe/Development/projects/todo_coffee/js/views/app-view.coffee"}],"/Users/kanaabe/Development/projects/todo_coffee/js/collections/todos.coffee":[function(require,module,exports){
var Todo, Todos,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __hasProp = {}.hasOwnProperty;

Todo = require('../models/todo.coffee');

module.exports = Todos = (function(_super) {
  __extends(Todos, _super);

  function Todos() {
    return Todos.__super__.constructor.apply(this, arguments);
  }

  Todos.prototype.model = Todo;

  Todos.prototype.localStorage = new Backbone.LocalStorage('todos-backbone');

  Todos.prototype.completed = function() {
    return this.where({
      completed: true
    });
  };

  Todos.prototype.remaining = function() {
    return this.where({
      completed: false
    });
  };

  Todos.prototype.nextOrder = function() {
    if (this.length) {
      return this.last().get('order') + 1;
    } else {
      return 1;
    }
  };

  Todos.prototype.comparator = 'order';

  return Todos;

})(Backbone.Collection);



},{"../models/todo.coffee":"/Users/kanaabe/Development/projects/todo_coffee/js/models/todo.coffee"}],"/Users/kanaabe/Development/projects/todo_coffee/js/lib.coffee":[function(require,module,exports){
var Todos;

Todos = require('./collections/todos.coffee');

module.exports.todos = new Todos;

module.exports.todofilter = '';



},{"./collections/todos.coffee":"/Users/kanaabe/Development/projects/todo_coffee/js/collections/todos.coffee"}],"/Users/kanaabe/Development/projects/todo_coffee/js/models/todo.coffee":[function(require,module,exports){
var Todo,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __hasProp = {}.hasOwnProperty;

module.exports = Todo = (function(_super) {
  __extends(Todo, _super);

  function Todo() {
    return Todo.__super__.constructor.apply(this, arguments);
  }

  Todo.prototype.defaults = {
    title: '',
    completed: false
  };

  Todo.prototype.toggle = function() {
    return this.save({
      completed: !this.get('completed')
    });
  };

  return Todo;

})(Backbone.Model);



},{}],"/Users/kanaabe/Development/projects/todo_coffee/js/routers/router.coffee":[function(require,module,exports){
var TodoRouter, lib, todos,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __hasProp = {}.hasOwnProperty;

todos = (lib = require('../lib.coffee')).todos;

module.exports = TodoRouter = (function(_super) {
  __extends(TodoRouter, _super);

  function TodoRouter() {
    return TodoRouter.__super__.constructor.apply(this, arguments);
  }

  TodoRouter.prototype.routes = {
    '*filter': 'setFilter'
  };

  TodoRouter.prototype.setFilter = function(param) {
    lib.todofilter = param || '';
    return todos.trigger('filter');
  };

  return TodoRouter;

})(Backbone.Router);



},{"../lib.coffee":"/Users/kanaabe/Development/projects/todo_coffee/js/lib.coffee"}],"/Users/kanaabe/Development/projects/todo_coffee/js/views/app-view.coffee":[function(require,module,exports){
var AppView, TodoView, Todos, lib, todofilter, todos, _ref,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __hasProp = {}.hasOwnProperty;

Todos = require('../collections/todos.coffee');

TodoView = require('./todo-view.coffee');

_ref = lib = require('../lib.coffee'), todos = _ref.todos, todofilter = _ref.todofilter;

module.exports = AppView = (function(_super) {
  __extends(AppView, _super);

  function AppView() {
    return AppView.__super__.constructor.apply(this, arguments);
  }

  AppView.prototype.el = '#todoapp';

  AppView.prototype.statsTemplate = _.template($('#stats-template').html());

  AppView.prototype.events = {
    'keypress #new-todo': 'createOnEnter',
    'click #clear-completed': 'clearCompleted',
    'click #toggle-all': 'toggleAllComplete'
  };

  AppView.prototype.initialize = function() {
    this.allCheckbox = this.$('#toggle-all')[0];
    this.$input = this.$('#new-todo');
    this.$footer = this.$('#footer');
    this.$main = this.$('#main');
    this.$list = $('#todo-list');
    this.listenTo(todos, 'add', this.addOne);
    this.listenTo(todos, 'reset', this.addAll);
    this.listenTo(todos, 'change:completed', this.filterOne);
    this.listenTo(todos, 'filter', this.filterAll);
    this.listenTo(todos, 'all', this.render);
    todos.fetch({
      reset: true
    });
  };

  AppView.prototype.render = function() {
    var completed, remaining;
    completed = todos.completed().length;
    remaining = todos.remaining().length;
    if (todos.length) {
      this.$main.show();
      this.$footer.show();
      this.$footer.html(this.statsTemplate({
        completed: completed,
        remaining: remaining
      }));
      this.$('#filters li a').removeClass('selected').filter('[href="#/' + (lib.todofilter || '') + '"]').addClass('selected');
    } else {
      this.$main.hide();
      this.$footer.hide();
    }
    this.allCheckbox.checked = !remaining;
  };

  AppView.prototype.addOne = function(todo) {
    var view;
    view = new TodoView({
      model: todo
    });
    this.$list.append(view.render().el);
  };

  AppView.prototype.addAll = function() {
    this.$list.html('');
    todos.each(this.addOne, this);
  };

  AppView.prototype.filterOne = function(todo) {
    todo.trigger('visible');
  };

  AppView.prototype.filterAll = function() {
    todos.each(this.filterOne, this);
  };

  AppView.prototype.newAttributes = function() {
    return {
      title: this.$input.val().trim(),
      order: todos.nextOrder(),
      completed: false
    };
  };

  AppView.prototype.createOnEnter = function(e) {
    if (e.which === ENTER_KEY && this.$input.val().trim()) {
      todos.create(this.newAttributes());
      this.$input.val('');
    }
  };

  AppView.prototype.clearCompleted = function() {
    _.invoke(todos.completed(), 'destroy');
    return false;
  };

  AppView.prototype.toggleAllComplete = function() {
    var completed;
    completed = this.allCheckbox.checked;
    todos.each(function(todo) {
      todo.save({
        completed: completed
      });
    });
  };

  return AppView;

})(Backbone.View);



},{"../collections/todos.coffee":"/Users/kanaabe/Development/projects/todo_coffee/js/collections/todos.coffee","../lib.coffee":"/Users/kanaabe/Development/projects/todo_coffee/js/lib.coffee","./todo-view.coffee":"/Users/kanaabe/Development/projects/todo_coffee/js/views/todo-view.coffee"}],"/Users/kanaabe/Development/projects/todo_coffee/js/views/todo-view.coffee":[function(require,module,exports){
var TodoView, lib, todofilter,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __hasProp = {}.hasOwnProperty;

todofilter = (lib = require('../lib.coffee')).todofilter;

module.exports = TodoView = (function(_super) {
  __extends(TodoView, _super);

  function TodoView() {
    return TodoView.__super__.constructor.apply(this, arguments);
  }

  TodoView.prototype.tagName = 'li';

  TodoView.prototype.template = _.template($('#item-template').html());

  TodoView.prototype.events = {
    'click .toggle': 'toggleCompleted',
    'dblclick label': 'edit',
    'click .destroy': 'clear',
    'keypress .edit': 'updateOnEnter',
    'keydown .edit': 'revertOnEscape',
    'blur .edit': 'close'
  };

  TodoView.prototype.initialize = function() {
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.remove);
    this.listenTo(this.model, 'visible', this.toggleVisible);
  };

  TodoView.prototype.render = function() {
    if (this.model.changed.id !== void 0) {
      return;
    }
    this.$el.html(this.template(this.model.toJSON()));
    this.$el.toggleClass('completed', this.model.get('completed'));
    this.toggleVisible();
    this.$input = this.$('.edit');
    return this;
  };

  TodoView.prototype.toggleVisible = function() {
    this.$el.toggleClass('hidden', this.isHidden());
  };

  TodoView.prototype.isHidden = function() {
    if (this.model.get('completed')) {
      return lib.todofilter === 'active';
    } else {
      return lib.todofilter === 'completed';
    }
  };

  TodoView.prototype.toggleCompleted = function() {
    this.model.toggle();
  };

  TodoView.prototype.edit = function() {
    this.$el.addClass('editing');
    this.$input.focus();
  };

  TodoView.prototype.close = function() {
    var trimmedValue, value;
    value = this.$input.val();
    trimmedValue = value.trim();
    if (!this.$el.hasClass('editing')) {
      return;
    }
    if (trimmedValue) {
      this.model.save({
        title: trimmedValue
      });
      if (value !== trimmedValue) {
        this.model.trigger('change');
      }
    } else {
      this.clear();
    }
    this.$el.removeClass('editing');
  };

  TodoView.prototype.updateOnEnter = function(e) {
    if (e.which === ENTER_KEY) {
      this.close();
    }
  };

  TodoView.prototype.revertOnEscape = function(e) {
    if (e.which === ESC_KEY) {
      this.$el.removeClass('editing');
      this.$input.val(this.model.get('title'));
    }
  };

  TodoView.prototype.clear = function() {
    this.model.destroy();
  };

  return TodoView;

})(Backbone.View);



},{"../lib.coffee":"/Users/kanaabe/Development/projects/todo_coffee/js/lib.coffee"}]},{},["/Users/kanaabe/Development/projects/todo_coffee/js/app.coffee"]);
