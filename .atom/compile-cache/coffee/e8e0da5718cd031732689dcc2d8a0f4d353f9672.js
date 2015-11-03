(function() {
  var ExNormalModeInputElement, Input, ViewModel;

  ExNormalModeInputElement = require('./ex-normal-mode-input-element');

  ViewModel = (function() {
    function ViewModel(command, opts) {
      var _ref;
      this.command = command;
      if (opts == null) {
        opts = {};
      }
      _ref = this.command, this.editor = _ref.editor, this.exState = _ref.exState;
      this.view = new ExNormalModeInputElement().initialize(this, opts);
      this.editor.normalModeInputView = this.view;
      this.exState.onDidFailToExecute((function(_this) {
        return function() {
          return _this.view.remove();
        };
      })(this));
      this.done = false;
    }

    ViewModel.prototype.confirm = function(view) {
      this.exState.pushOperations(new Input(this.view.value));
      return this.done = true;
    };

    ViewModel.prototype.cancel = function(view) {
      if (!this.done) {
        this.exState.pushOperations(new Input(''));
        return this.done = true;
      }
    };

    return ViewModel;

  })();

  Input = (function() {
    function Input(characters) {
      this.characters = characters;
    }

    return Input;

  })();

  module.exports = {
    ViewModel: ViewModel,
    Input: Input
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvZGF2aWQvLmF0b20vcGFja2FnZXMvZXgtbW9kZS9saWIvdmlldy1tb2RlbC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMENBQUE7O0FBQUEsRUFBQSx3QkFBQSxHQUEyQixPQUFBLENBQVEsZ0NBQVIsQ0FBM0IsQ0FBQTs7QUFBQSxFQUVNO0FBQ1MsSUFBQSxtQkFBRSxPQUFGLEVBQVcsSUFBWCxHQUFBO0FBQ1gsVUFBQSxJQUFBO0FBQUEsTUFEWSxJQUFDLENBQUEsVUFBQSxPQUNiLENBQUE7O1FBRHNCLE9BQUs7T0FDM0I7QUFBQSxNQUFBLE9BQXNCLElBQUMsQ0FBQSxPQUF2QixFQUFDLElBQUMsQ0FBQSxjQUFBLE1BQUYsRUFBVSxJQUFDLENBQUEsZUFBQSxPQUFYLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxJQUFELEdBQVksSUFBQSx3QkFBQSxDQUFBLENBQTBCLENBQUMsVUFBM0IsQ0FBc0MsSUFBdEMsRUFBeUMsSUFBekMsQ0FGWixDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsTUFBTSxDQUFDLG1CQUFSLEdBQThCLElBQUMsQ0FBQSxJQUgvQixDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsT0FBTyxDQUFDLGtCQUFULENBQTRCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQUcsS0FBQyxDQUFBLElBQUksQ0FBQyxNQUFOLENBQUEsRUFBSDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTVCLENBSkEsQ0FBQTtBQUFBLE1BS0EsSUFBQyxDQUFBLElBQUQsR0FBUSxLQUxSLENBRFc7SUFBQSxDQUFiOztBQUFBLHdCQVFBLE9BQUEsR0FBUyxTQUFDLElBQUQsR0FBQTtBQUNQLE1BQUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxjQUFULENBQTRCLElBQUEsS0FBQSxDQUFNLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBWixDQUE1QixDQUFBLENBQUE7YUFDQSxJQUFDLENBQUEsSUFBRCxHQUFRLEtBRkQ7SUFBQSxDQVJULENBQUE7O0FBQUEsd0JBWUEsTUFBQSxHQUFRLFNBQUMsSUFBRCxHQUFBO0FBQ04sTUFBQSxJQUFBLENBQUEsSUFBUSxDQUFBLElBQVI7QUFDRSxRQUFBLElBQUMsQ0FBQSxPQUFPLENBQUMsY0FBVCxDQUE0QixJQUFBLEtBQUEsQ0FBTSxFQUFOLENBQTVCLENBQUEsQ0FBQTtlQUNBLElBQUMsQ0FBQSxJQUFELEdBQVEsS0FGVjtPQURNO0lBQUEsQ0FaUixDQUFBOztxQkFBQTs7TUFIRixDQUFBOztBQUFBLEVBb0JNO0FBQ1MsSUFBQSxlQUFFLFVBQUYsR0FBQTtBQUFlLE1BQWQsSUFBQyxDQUFBLGFBQUEsVUFBYSxDQUFmO0lBQUEsQ0FBYjs7aUJBQUE7O01BckJGLENBQUE7O0FBQUEsRUF1QkEsTUFBTSxDQUFDLE9BQVAsR0FBaUI7QUFBQSxJQUNmLFdBQUEsU0FEZTtBQUFBLElBQ0osT0FBQSxLQURJO0dBdkJqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/david/.atom/packages/ex-mode/lib/view-model.coffee
