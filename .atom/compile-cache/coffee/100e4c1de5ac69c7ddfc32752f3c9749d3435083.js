(function() {
  var GlobalExState;

  GlobalExState = (function() {
    function GlobalExState() {}

    GlobalExState.prototype.commandHistory = [];

    GlobalExState.prototype.setVim = function(vim) {
      this.vim = vim;
    };

    return GlobalExState;

  })();

  module.exports = GlobalExState;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvZGF2aWQvLmF0b20vcGFja2FnZXMvZXgtbW9kZS9saWIvZ2xvYmFsLWV4LXN0YXRlLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxhQUFBOztBQUFBLEVBQU07K0JBQ0o7O0FBQUEsNEJBQUEsY0FBQSxHQUFnQixFQUFoQixDQUFBOztBQUFBLDRCQUNBLE1BQUEsR0FBUSxTQUFFLEdBQUYsR0FBQTtBQUFRLE1BQVAsSUFBQyxDQUFBLE1BQUEsR0FBTSxDQUFSO0lBQUEsQ0FEUixDQUFBOzt5QkFBQTs7TUFERixDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsYUFKakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/david/.atom/packages/ex-mode/lib/global-ex-state.coffee
