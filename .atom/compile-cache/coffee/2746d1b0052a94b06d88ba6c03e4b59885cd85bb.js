(function() {
  var CompositeDisposable, Disposable, Ex, ExMode, ExState, GlobalExState, _ref;

  GlobalExState = require('./global-ex-state');

  ExState = require('./ex-state');

  Ex = require('./ex');

  _ref = require('event-kit'), Disposable = _ref.Disposable, CompositeDisposable = _ref.CompositeDisposable;

  module.exports = ExMode = {
    activate: function(state) {
      this.globalExState = new GlobalExState;
      this.disposables = new CompositeDisposable;
      this.exStates = new WeakMap;
      return this.disposables.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          var element, exState;
          if (editor.mini) {
            return;
          }
          element = atom.views.getView(editor);
          if (!_this.exStates.get(editor)) {
            exState = new ExState(element, _this.globalExState);
            _this.exStates.set(editor, exState);
            return _this.disposables.add(new Disposable(function() {
              return exState.destroy();
            }));
          }
        };
      })(this)));
    },
    deactivate: function() {
      return this.disposables.dispose();
    },
    provideEx: function() {
      return {
        registerCommand: Ex.registerCommand.bind(Ex)
      };
    },
    consumeVim: function(vim) {
      this.vim = vim;
      return this.globalExState.setVim(vim);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvZGF2aWQvLmF0b20vcGFja2FnZXMvZXgtbW9kZS9saWIvZXgtbW9kZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEseUVBQUE7O0FBQUEsRUFBQSxhQUFBLEdBQWdCLE9BQUEsQ0FBUSxtQkFBUixDQUFoQixDQUFBOztBQUFBLEVBQ0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSxZQUFSLENBRFYsQ0FBQTs7QUFBQSxFQUVBLEVBQUEsR0FBSyxPQUFBLENBQVEsTUFBUixDQUZMLENBQUE7O0FBQUEsRUFHQSxPQUFvQyxPQUFBLENBQVEsV0FBUixDQUFwQyxFQUFDLGtCQUFBLFVBQUQsRUFBYSwyQkFBQSxtQkFIYixDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsTUFBQSxHQUNmO0FBQUEsSUFBQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7QUFDUixNQUFBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEsQ0FBQSxhQUFqQixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsV0FBRCxHQUFlLEdBQUEsQ0FBQSxtQkFEZixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsUUFBRCxHQUFZLEdBQUEsQ0FBQSxPQUZaLENBQUE7YUFJQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBZixDQUFrQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxNQUFELEdBQUE7QUFDakQsY0FBQSxnQkFBQTtBQUFBLFVBQUEsSUFBVSxNQUFNLENBQUMsSUFBakI7QUFBQSxrQkFBQSxDQUFBO1dBQUE7QUFBQSxVQUVBLE9BQUEsR0FBVSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsTUFBbkIsQ0FGVixDQUFBO0FBSUEsVUFBQSxJQUFHLENBQUEsS0FBSyxDQUFBLFFBQVEsQ0FBQyxHQUFWLENBQWMsTUFBZCxDQUFQO0FBQ0UsWUFBQSxPQUFBLEdBQWMsSUFBQSxPQUFBLENBQ1osT0FEWSxFQUVaLEtBQUMsQ0FBQSxhQUZXLENBQWQsQ0FBQTtBQUFBLFlBS0EsS0FBQyxDQUFBLFFBQVEsQ0FBQyxHQUFWLENBQWMsTUFBZCxFQUFzQixPQUF0QixDQUxBLENBQUE7bUJBT0EsS0FBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQXFCLElBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtxQkFDOUIsT0FBTyxDQUFDLE9BQVIsQ0FBQSxFQUQ4QjtZQUFBLENBQVgsQ0FBckIsRUFSRjtXQUxpRDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxDLENBQWpCLEVBTFE7SUFBQSxDQUFWO0FBQUEsSUFxQkEsVUFBQSxFQUFZLFNBQUEsR0FBQTthQUNWLElBQUMsQ0FBQSxXQUFXLENBQUMsT0FBYixDQUFBLEVBRFU7SUFBQSxDQXJCWjtBQUFBLElBd0JBLFNBQUEsRUFBVyxTQUFBLEdBQUE7YUFDVDtBQUFBLFFBQUEsZUFBQSxFQUFpQixFQUFFLENBQUMsZUFBZSxDQUFDLElBQW5CLENBQXdCLEVBQXhCLENBQWpCO1FBRFM7SUFBQSxDQXhCWDtBQUFBLElBMkJBLFVBQUEsRUFBWSxTQUFDLEdBQUQsR0FBQTtBQUNWLE1BQUEsSUFBQyxDQUFBLEdBQUQsR0FBTyxHQUFQLENBQUE7YUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLE1BQWYsQ0FBc0IsR0FBdEIsRUFGVTtJQUFBLENBM0JaO0dBTkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/david/.atom/packages/ex-mode/lib/ex-mode.coffee
