(function() {
  var ExViewModel, Input, ViewModel, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('./view-model'), ViewModel = _ref.ViewModel, Input = _ref.Input;

  module.exports = ExViewModel = (function(_super) {
    __extends(ExViewModel, _super);

    function ExViewModel(exCommand) {
      this.exCommand = exCommand;
      this.confirm = __bind(this.confirm, this);
      this.decreaseHistoryEx = __bind(this.decreaseHistoryEx, this);
      this.increaseHistoryEx = __bind(this.increaseHistoryEx, this);
      ExViewModel.__super__.constructor.call(this, this.exCommand, {
        "class": 'command'
      });
      this.historyIndex = -1;
      atom.commands.add(this.view.editorElement, 'core:move-up', this.increaseHistoryEx);
      atom.commands.add(this.view.editorElement, 'core:move-down', this.decreaseHistoryEx);
    }

    ExViewModel.prototype.restoreHistory = function(index) {
      return this.view.editorElement.getModel().setText(this.history(index).value);
    };

    ExViewModel.prototype.history = function(index) {
      return this.exState.getExHistoryItem(index);
    };

    ExViewModel.prototype.increaseHistoryEx = function() {
      if (this.history(this.historyIndex + 1) != null) {
        this.historyIndex += 1;
        return this.restoreHistory(this.historyIndex);
      }
    };

    ExViewModel.prototype.decreaseHistoryEx = function() {
      if (this.historyIndex <= 0) {
        this.historyIndex = -1;
        return this.view.editorElement.getModel().setText('');
      } else {
        this.historyIndex -= 1;
        return this.restoreHistory(this.historyIndex);
      }
    };

    ExViewModel.prototype.confirm = function(view) {
      this.value = this.view.value;
      this.exState.pushExHistory(this);
      return ExViewModel.__super__.confirm.call(this, view);
    };

    return ExViewModel;

  })(ViewModel);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvZGF2aWQvLmF0b20vcGFja2FnZXMvZXgtbW9kZS9saWIvZXgtdmlldy1tb2RlbC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsbUNBQUE7SUFBQTs7bVNBQUE7O0FBQUEsRUFBQSxPQUFxQixPQUFBLENBQVEsY0FBUixDQUFyQixFQUFDLGlCQUFBLFNBQUQsRUFBWSxhQUFBLEtBQVosQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixrQ0FBQSxDQUFBOztBQUFhLElBQUEscUJBQUUsU0FBRixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsWUFBQSxTQUNiLENBQUE7QUFBQSwrQ0FBQSxDQUFBO0FBQUEsbUVBQUEsQ0FBQTtBQUFBLG1FQUFBLENBQUE7QUFBQSxNQUFBLDZDQUFNLElBQUMsQ0FBQSxTQUFQLEVBQWtCO0FBQUEsUUFBQSxPQUFBLEVBQU8sU0FBUDtPQUFsQixDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxZQUFELEdBQWdCLENBQUEsQ0FEaEIsQ0FBQTtBQUFBLE1BR0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLElBQUMsQ0FBQSxJQUFJLENBQUMsYUFBeEIsRUFBdUMsY0FBdkMsRUFBdUQsSUFBQyxDQUFBLGlCQUF4RCxDQUhBLENBQUE7QUFBQSxNQUlBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixJQUFDLENBQUEsSUFBSSxDQUFDLGFBQXhCLEVBQXVDLGdCQUF2QyxFQUF5RCxJQUFDLENBQUEsaUJBQTFELENBSkEsQ0FEVztJQUFBLENBQWI7O0FBQUEsMEJBT0EsY0FBQSxHQUFnQixTQUFDLEtBQUQsR0FBQTthQUNkLElBQUMsQ0FBQSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQXBCLENBQUEsQ0FBOEIsQ0FBQyxPQUEvQixDQUF1QyxJQUFDLENBQUEsT0FBRCxDQUFTLEtBQVQsQ0FBZSxDQUFDLEtBQXZELEVBRGM7SUFBQSxDQVBoQixDQUFBOztBQUFBLDBCQVVBLE9BQUEsR0FBUyxTQUFDLEtBQUQsR0FBQTthQUNQLElBQUMsQ0FBQSxPQUFPLENBQUMsZ0JBQVQsQ0FBMEIsS0FBMUIsRUFETztJQUFBLENBVlQsQ0FBQTs7QUFBQSwwQkFhQSxpQkFBQSxHQUFtQixTQUFBLEdBQUE7QUFDakIsTUFBQSxJQUFHLDJDQUFIO0FBQ0UsUUFBQSxJQUFDLENBQUEsWUFBRCxJQUFpQixDQUFqQixDQUFBO2VBQ0EsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsSUFBQyxDQUFBLFlBQWpCLEVBRkY7T0FEaUI7SUFBQSxDQWJuQixDQUFBOztBQUFBLDBCQWtCQSxpQkFBQSxHQUFtQixTQUFBLEdBQUE7QUFDakIsTUFBQSxJQUFHLElBQUMsQ0FBQSxZQUFELElBQWlCLENBQXBCO0FBRUUsUUFBQSxJQUFDLENBQUEsWUFBRCxHQUFnQixDQUFBLENBQWhCLENBQUE7ZUFDQSxJQUFDLENBQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFwQixDQUFBLENBQThCLENBQUMsT0FBL0IsQ0FBdUMsRUFBdkMsRUFIRjtPQUFBLE1BQUE7QUFLRSxRQUFBLElBQUMsQ0FBQSxZQUFELElBQWlCLENBQWpCLENBQUE7ZUFDQSxJQUFDLENBQUEsY0FBRCxDQUFnQixJQUFDLENBQUEsWUFBakIsRUFORjtPQURpQjtJQUFBLENBbEJuQixDQUFBOztBQUFBLDBCQTJCQSxPQUFBLEdBQVMsU0FBQyxJQUFELEdBQUE7QUFDUCxNQUFBLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFmLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsYUFBVCxDQUF1QixJQUF2QixDQURBLENBQUE7YUFFQSx5Q0FBTSxJQUFOLEVBSE87SUFBQSxDQTNCVCxDQUFBOzt1QkFBQTs7S0FEd0IsVUFIMUIsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/david/.atom/packages/ex-mode/lib/ex-view-model.coffee
