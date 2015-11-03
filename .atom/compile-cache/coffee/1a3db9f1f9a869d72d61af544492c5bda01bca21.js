(function() {
  var Command, CommandError, CompositeDisposable, Disposable, Emitter, ExState, _ref;

  _ref = require('event-kit'), Emitter = _ref.Emitter, Disposable = _ref.Disposable, CompositeDisposable = _ref.CompositeDisposable;

  Command = require('./command');

  CommandError = require('./command-error');

  ExState = (function() {
    function ExState(editorElement, globalExState) {
      this.editorElement = editorElement;
      this.globalExState = globalExState;
      this.emitter = new Emitter;
      this.subscriptions = new CompositeDisposable;
      this.editor = this.editorElement.getModel();
      this.opStack = [];
      this.history = [];
      this.registerOperationCommands({
        open: (function(_this) {
          return function(e) {
            return new Command(_this.editor, _this);
          };
        })(this)
      });
    }

    ExState.prototype.destroy = function() {
      return this.subscriptions.dispose();
    };

    ExState.prototype.getExHistoryItem = function(index) {
      return this.globalExState.commandHistory[index];
    };

    ExState.prototype.pushExHistory = function(command) {
      return this.globalExState.commandHistory.unshift(command);
    };

    ExState.prototype.registerOperationCommands = function(commands) {
      var commandName, fn, _results;
      _results = [];
      for (commandName in commands) {
        fn = commands[commandName];
        _results.push((function(_this) {
          return function(fn) {
            var pushFn;
            pushFn = function(e) {
              return _this.pushOperations(fn(e));
            };
            return _this.subscriptions.add(atom.commands.add(_this.editorElement, "ex-mode:" + commandName, pushFn));
          };
        })(this)(fn));
      }
      return _results;
    };

    ExState.prototype.onDidFailToExecute = function(fn) {
      return this.emitter.on('failed-to-execute', fn);
    };

    ExState.prototype.onDidProcessOpStack = function(fn) {
      return this.emitter.on('processed-op-stack', fn);
    };

    ExState.prototype.pushOperations = function(operations) {
      this.opStack.push(operations);
      if (this.opStack.length === 2) {
        return this.processOpStack();
      }
    };

    ExState.prototype.clearOpStack = function() {
      return this.opStack = [];
    };

    ExState.prototype.processOpStack = function() {
      var command, e, input, _ref1;
      _ref1 = this.opStack, command = _ref1[0], input = _ref1[1];
      if (input.characters.length > 0) {
        this.history.unshift(command);
        try {
          command.execute(input);
        } catch (_error) {
          e = _error;
          if (e instanceof CommandError) {
            atom.notifications.addError("Command error: " + e.message);
            this.emitter.emit('failed-to-execute');
          } else {
            throw e;
          }
        }
      }
      this.clearOpStack();
      return this.emitter.emit('processed-op-stack');
    };

    return ExState;

  })();

  module.exports = ExState;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvZGF2aWQvLmF0b20vcGFja2FnZXMvZXgtbW9kZS9saWIvZXgtc3RhdGUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDhFQUFBOztBQUFBLEVBQUEsT0FBNkMsT0FBQSxDQUFRLFdBQVIsQ0FBN0MsRUFBQyxlQUFBLE9BQUQsRUFBVSxrQkFBQSxVQUFWLEVBQXNCLDJCQUFBLG1CQUF0QixDQUFBOztBQUFBLEVBRUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxXQUFSLENBRlYsQ0FBQTs7QUFBQSxFQUdBLFlBQUEsR0FBZSxPQUFBLENBQVEsaUJBQVIsQ0FIZixDQUFBOztBQUFBLEVBS007QUFDUyxJQUFBLGlCQUFFLGFBQUYsRUFBa0IsYUFBbEIsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLGdCQUFBLGFBQ2IsQ0FBQTtBQUFBLE1BRDRCLElBQUMsQ0FBQSxnQkFBQSxhQUM3QixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLEdBQUEsQ0FBQSxPQUFYLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEsQ0FBQSxtQkFEakIsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFDLENBQUEsYUFBYSxDQUFDLFFBQWYsQ0FBQSxDQUZWLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxPQUFELEdBQVcsRUFIWCxDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsT0FBRCxHQUFXLEVBSlgsQ0FBQTtBQUFBLE1BTUEsSUFBQyxDQUFBLHlCQUFELENBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUMsQ0FBRCxHQUFBO21CQUFXLElBQUEsT0FBQSxDQUFRLEtBQUMsQ0FBQSxNQUFULEVBQWlCLEtBQWpCLEVBQVg7VUFBQSxFQUFB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

//# sourceURL=/home/david/.atom/packages/ex-mode/lib/ex-state.coffee
