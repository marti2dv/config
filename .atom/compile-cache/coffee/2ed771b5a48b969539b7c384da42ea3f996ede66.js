(function() {
  var ExState, GlobalExState, activateExMode, dispatchKeyboardEvent, dispatchTextEvent, getEditorElement, keydown,
    __slice = [].slice;

  ExState = require('../lib/ex-state');

  GlobalExState = require('../lib/global-ex-state');

  beforeEach(function() {
    return atom.workspace || (atom.workspace = {});
  });

  activateExMode = function() {
    return atom.workspace.open().then(function() {
      atom.commands.dispatch(atom.views.getView(atom.workspace), 'ex-mode:open');
      keydown('escape');
      return atom.workspace.getActivePane().destroyActiveItem();
    });
  };

  getEditorElement = function(callback) {
    var textEditor;
    textEditor = null;
    waitsForPromise(function() {
      return atom.workspace.open().then(function(e) {
        return textEditor = e;
      });
    });
    return runs(function() {
      var element;
      element = atom.views.getView(textEditor);
      return callback(element);
    });
  };

  dispatchKeyboardEvent = function() {
    var e, eventArgs, target;
    target = arguments[0], eventArgs = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    e = document.createEvent('KeyboardEvent');
    e.initKeyboardEvent.apply(e, eventArgs);
    if (e.keyCode === 0) {
      Object.defineProperty(e, 'keyCode', {
        get: function() {
          return void 0;
        }
      });
    }
    return target.dispatchEvent(e);
  };

  dispatchTextEvent = function() {
    var e, eventArgs, target;
    target = arguments[0], eventArgs = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    e = document.createEvent('TextEvent');
    e.initTextEvent.apply(e, eventArgs);
    return target.dispatchEvent(e);
  };

  keydown = function(key, _arg) {
    var alt, canceled, ctrl, element, eventArgs, meta, raw, shift, _ref;
    _ref = _arg != null ? _arg : {}, element = _ref.element, ctrl = _ref.ctrl, shift = _ref.shift, alt = _ref.alt, meta = _ref.meta, raw = _ref.raw;
    if (!(key === 'escape' || (raw != null))) {
      key = "U+" + (key.charCodeAt(0).toString(16));
    }
    element || (element = document.activeElement);
    eventArgs = [true, true, null, key, 0, ctrl, alt, shift, meta];
    canceled = !dispatchKeyboardEvent.apply(null, [element, 'keydown'].concat(__slice.call(eventArgs)));
    dispatchKeyboardEvent.apply(null, [element, 'keypress'].concat(__slice.call(eventArgs)));
    if (!canceled) {
      if (dispatchTextEvent.apply(null, [element, 'textInput'].concat(__slice.call(eventArgs)))) {
        element.value += key;
      }
    }
    return dispatchKeyboardEvent.apply(null, [element, 'keyup'].concat(__slice.call(eventArgs)));
  };

  module.exports = {
    keydown: keydown,
    getEditorElement: getEditorElement,
    activateExMode: activateExMode
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvZGF2aWQvLmF0b20vcGFja2FnZXMvZXgtbW9kZS9zcGVjL3NwZWMtaGVscGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwyR0FBQTtJQUFBLGtCQUFBOztBQUFBLEVBQUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxpQkFBUixDQUFWLENBQUE7O0FBQUEsRUFDQSxhQUFBLEdBQWdCLE9BQUEsQ0FBUSx3QkFBUixDQURoQixDQUFBOztBQUFBLEVBR0EsVUFBQSxDQUFXLFNBQUEsR0FBQTtXQUNULElBQUksQ0FBQyxjQUFMLElBQUksQ0FBQyxZQUFjLElBRFY7RUFBQSxDQUFYLENBSEEsQ0FBQTs7QUFBQSxFQU1BLGNBQUEsR0FBaUIsU0FBQSxHQUFBO1dBQ2YsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQUEsQ0FBcUIsQ0FBQyxJQUF0QixDQUEyQixTQUFBLEdBQUE7QUFDekIsTUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUF4QixDQUF2QixFQUEyRCxjQUEzRCxDQUFBLENBQUE7QUFBQSxNQUNBLE9BQUEsQ0FBUSxRQUFSLENBREEsQ0FBQTthQUVBLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUFBLENBQThCLENBQUMsaUJBQS9CLENBQUEsRUFIeUI7SUFBQSxDQUEzQixFQURlO0VBQUEsQ0FOakIsQ0FBQTs7QUFBQSxFQWFBLGdCQUFBLEdBQW1CLFNBQUMsUUFBRCxHQUFBO0FBQ2pCLFFBQUEsVUFBQTtBQUFBLElBQUEsVUFBQSxHQUFhLElBQWIsQ0FBQTtBQUFBLElBRUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7YUFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBQSxDQUFxQixDQUFDLElBQXRCLENBQTJCLFNBQUMsQ0FBRCxHQUFBO2VBQ3pCLFVBQUEsR0FBYSxFQURZO01BQUEsQ0FBM0IsRUFEYztJQUFBLENBQWhCLENBRkEsQ0FBQTtXQU1BLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFTSCxVQUFBLE9BQUE7QUFBQSxNQUFBLE9BQUEsR0FBVSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsVUFBbkIsQ0FBVixDQUFBO2FBRUEsUUFBQSxDQUFTLE9BQVQsRUFYRztJQUFBLENBQUwsRUFQaUI7RUFBQSxDQWJuQixDQUFBOztBQUFBLEVBaUNBLHFCQUFBLEdBQXdCLFNBQUEsR0FBQTtBQUN0QixRQUFBLG9CQUFBO0FBQUEsSUFEdUIsdUJBQVEsbUVBQy9CLENBQUE7QUFBQSxJQUFBLENBQUEsR0FBSSxRQUFRLENBQUMsV0FBVCxDQUFxQixlQUFyQixDQUFKLENBQUE7QUFBQSxJQUNBLENBQUMsQ0FBQyxpQkFBRixVQUFvQixTQUFwQixDQURBLENBQUE7QUFHQSxJQUFBLElBQTBELENBQUMsQ0FBQyxPQUFGLEtBQWEsQ0FBdkU7QUFBQSxNQUFBLE1BQU0sQ0FBQyxjQUFQLENBQXNCLENBQXRCLEVBQXlCLFNBQXpCLEVBQW9DO0FBQUEsUUFBQSxHQUFBLEVBQUssU0FBQSxHQUFBO2lCQUFHLE9BQUg7UUFBQSxDQUFMO09BQXBDLENBQUEsQ0FBQTtLQUhBO1dBSUEsTUFBTSxDQUFDLGFBQVAsQ0FBcUIsQ0FBckIsRUFMc0I7RUFBQSxDQWpDeEIsQ0FBQTs7QUFBQSxFQXdDQSxpQkFBQSxHQUFvQixTQUFBLEdBQUE7QUFDbEIsUUFBQSxvQkFBQTtBQUFBLElBRG1CLHVCQUFRLG1FQUMzQixDQUFBO0FBQUEsSUFBQSxDQUFBLEdBQUksUUFBUSxDQUFDLFdBQVQsQ0FBcUIsV0FBckIsQ0FBSixDQUFBO0FBQUEsSUFDQSxDQUFDLENBQUMsYUFBRixVQUFnQixTQUFoQixDQURBLENBQUE7V0FFQSxNQUFNLENBQUMsYUFBUCxDQUFxQixDQUFyQixFQUhrQjtFQUFBLENBeENwQixDQUFBOztBQUFBLEVBNkNBLE9BQUEsR0FBVSxTQUFDLEdBQUQsRUFBTSxJQUFOLEdBQUE7QUFDUixRQUFBLCtEQUFBO0FBQUEsMEJBRGMsT0FBdUMsSUFBdEMsZUFBQSxTQUFTLFlBQUEsTUFBTSxhQUFBLE9BQU8sV0FBQSxLQUFLLFlBQUEsTUFBTSxXQUFBLEdBQ2hELENBQUE7QUFBQSxJQUFBLElBQUEsQ0FBQSxDQUFtRCxHQUFBLEtBQU8sUUFBUCxJQUFtQixhQUF0RSxDQUFBO0FBQUEsTUFBQSxHQUFBLEdBQU8sSUFBQSxHQUFHLENBQUMsR0FBRyxDQUFDLFVBQUosQ0FBZSxDQUFmLENBQWlCLENBQUMsUUFBbEIsQ0FBMkIsRUFBM0IsQ0FBRCxDQUFWLENBQUE7S0FBQTtBQUFBLElBQ0EsWUFBQSxVQUFZLFFBQVEsQ0FBQyxjQURyQixDQUFBO0FBQUEsSUFFQSxTQUFBLEdBQVksQ0FDVixJQURVLEVBRVYsSUFGVSxFQUdWLElBSFUsRUFJVixHQUpVLEVBS1YsQ0FMVSxFQU1WLElBTlUsRUFNSixHQU5JLEVBTUMsS0FORCxFQU1RLElBTlIsQ0FGWixDQUFBO0FBQUEsSUFXQSxRQUFBLEdBQVcsQ0FBQSxxQkFBSSxhQUFzQixDQUFBLE9BQUEsRUFBUyxTQUFXLFNBQUEsYUFBQSxTQUFBLENBQUEsQ0FBMUMsQ0FYZixDQUFBO0FBQUEsSUFZQSxxQkFBQSxhQUFzQixDQUFBLE9BQUEsRUFBUyxVQUFZLFNBQUEsYUFBQSxTQUFBLENBQUEsQ0FBM0MsQ0FaQSxDQUFBO0FBYUEsSUFBQSxJQUFHLENBQUEsUUFBSDtBQUNFLE1BQUEsSUFBRyxpQkFBQSxhQUFrQixDQUFBLE9BQUEsRUFBUyxXQUFhLFNBQUEsYUFBQSxTQUFBLENBQUEsQ0FBeEMsQ0FBSDtBQUNFLFFBQUEsT0FBTyxDQUFDLEtBQVIsSUFBaUIsR0FBakIsQ0FERjtPQURGO0tBYkE7V0FnQkEscUJBQUEsYUFBc0IsQ0FBQSxPQUFBLEVBQVMsT0FBUyxTQUFBLGFBQUEsU0FBQSxDQUFBLENBQXhDLEVBakJRO0VBQUEsQ0E3Q1YsQ0FBQTs7QUFBQSxFQWdFQSxNQUFNLENBQUMsT0FBUCxHQUFpQjtBQUFBLElBQUMsU0FBQSxPQUFEO0FBQUEsSUFBVSxrQkFBQSxnQkFBVjtBQUFBLElBQTRCLGdCQUFBLGNBQTVCO0dBaEVqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/david/.atom/packages/ex-mode/spec/spec-helper.coffee
