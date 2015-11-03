(function() {
  var VimOption,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  VimOption = (function() {
    function VimOption() {
      this.nonu = __bind(this.nonu, this);
      this.nonumber = __bind(this.nonumber, this);
      this.nu = __bind(this.nu, this);
      this.number = __bind(this.number, this);
      this.nolist = __bind(this.nolist, this);
      this.list = __bind(this.list, this);
    }

    VimOption.singleton = function() {
      return VimOption.option || (VimOption.option = new VimOption);
    };

    VimOption.prototype.list = function() {
      return atom.config.set("editor.showInvisibles", true);
    };

    VimOption.prototype.nolist = function() {
      return atom.config.set("editor.showInvisibles", false);
    };

    VimOption.prototype.number = function() {
      return atom.config.set("editor.showLineNumbers", true);
    };

    VimOption.prototype.nu = function() {
      return this.number();
    };

    VimOption.prototype.nonumber = function() {
      return atom.config.set("editor.showLineNumbers", false);
    };

    VimOption.prototype.nonu = function() {
      return this.nonumber();
    };

    return VimOption;

  })();

  module.exports = VimOption;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvZGF2aWQvLmF0b20vcGFja2FnZXMvZXgtbW9kZS9saWIvdmltLW9wdGlvbi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsU0FBQTtJQUFBLGtGQUFBOztBQUFBLEVBQU07Ozs7Ozs7O0tBQ0o7O0FBQUEsSUFBQSxTQUFDLENBQUEsU0FBRCxHQUFZLFNBQUEsR0FBQTthQUNWLFNBQUMsQ0FBQSxXQUFELFNBQUMsQ0FBQSxTQUFXLEdBQUEsQ0FBQSxXQURGO0lBQUEsQ0FBWixDQUFBOztBQUFBLHdCQUdBLElBQUEsR0FBTSxTQUFBLEdBQUE7YUFDSixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsdUJBQWhCLEVBQXlDLElBQXpDLEVBREk7SUFBQSxDQUhOLENBQUE7O0FBQUEsd0JBTUEsTUFBQSxHQUFRLFNBQUEsR0FBQTthQUNOLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix1QkFBaEIsRUFBeUMsS0FBekMsRUFETTtJQUFBLENBTlIsQ0FBQTs7QUFBQSx3QkFTQSxNQUFBLEdBQVEsU0FBQSxHQUFBO2FBQ04sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHdCQUFoQixFQUEwQyxJQUExQyxFQURNO0lBQUEsQ0FUUixDQUFBOztBQUFBLHdCQVlBLEVBQUEsR0FBSSxTQUFBLEdBQUE7YUFDRixJQUFDLENBQUEsTUFBRCxDQUFBLEVBREU7SUFBQSxDQVpKLENBQUE7O0FBQUEsd0JBZUEsUUFBQSxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix3QkFBaEIsRUFBMEMsS0FBMUMsRUFEUTtJQUFBLENBZlYsQ0FBQTs7QUFBQSx3QkFrQkEsSUFBQSxHQUFNLFNBQUEsR0FBQTthQUNKLElBQUMsQ0FBQSxRQUFELENBQUEsRUFESTtJQUFBLENBbEJOLENBQUE7O3FCQUFBOztNQURGLENBQUE7O0FBQUEsRUFzQkEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0F0QmpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/david/.atom/packages/ex-mode/lib/vim-option.coffee
