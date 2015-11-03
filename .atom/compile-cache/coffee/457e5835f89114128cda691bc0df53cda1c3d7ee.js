(function() {
  var ExCommandModeInputElement,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ExCommandModeInputElement = (function(_super) {
    __extends(ExCommandModeInputElement, _super);

    function ExCommandModeInputElement() {
      return ExCommandModeInputElement.__super__.constructor.apply(this, arguments);
    }

    ExCommandModeInputElement.prototype.createdCallback = function() {
      this.className = "command-mode-input";
      this.editorContainer = document.createElement("div");
      this.editorContainer.className = "editor-container";
      return this.appendChild(this.editorContainer);
    };

    ExCommandModeInputElement.prototype.initialize = function(viewModel, opts) {
      var _ref;
      this.viewModel = viewModel;
      if (opts == null) {
        opts = {};
      }
      if (opts["class"] != null) {
        this.editorContainer.classList.add(opts["class"]);
      }
      if (opts.hidden) {
        this.editorContainer.style.height = "0px";
      }
      this.editorElement = document.createElement("atom-text-editor");
      this.editorElement.classList.add('editor');
      this.editorElement.getModel().setMini(true);
      this.editorElement.setAttribute('mini', '');
      this.editorContainer.appendChild(this.editorElement);
      this.singleChar = opts.singleChar;
      this.defaultText = (_ref = opts.defaultText) != null ? _ref : '';
      this.panel = atom.workspace.addBottomPanel({
        item: this,
        priority: 100
      });
      this.focus();
      this.handleEvents();
      return this;
    };

    ExCommandModeInputElement.prototype.handleEvents = function() {
      if (this.singleChar != null) {
        this.editorElement.getModel().getBuffer().onDidChange((function(_this) {
          return function(e) {
            if (e.newText) {
              return _this.confirm();
            }
          };
        })(this));
      } else {
        atom.commands.add(this.editorElement, 'editor:newline', this.confirm.bind(this));
      }
      atom.commands.add(this.editorElement, 'core:confirm', this.confirm.bind(this));
      atom.commands.add(this.editorElement, 'core:cancel', this.cancel.bind(this));
      return atom.commands.add(this.editorElement, 'blur', this.cancel.bind(this));
    };

    ExCommandModeInputElement.prototype.confirm = function() {
      this.value = this.editorElement.getModel().getText() || this.defaultText;
      this.viewModel.confirm(this);
      return this.removePanel();
    };

    ExCommandModeInputElement.prototype.focus = function() {
      return this.editorElement.focus();
    };

    ExCommandModeInputElement.prototype.cancel = function(e) {
      this.viewModel.cancel(this);
      return this.removePanel();
    };

    ExCommandModeInputElement.prototype.removePanel = function() {
      atom.workspace.getActivePane().activate();
      return this.panel.destroy();
    };

    return ExCommandModeInputElement;

  })(HTMLDivElement);

  module.exports = document.registerElement("ex-command-mode-input", {
    "extends": "div",
    prototype: ExCommandModeInputElement.prototype
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvZGF2aWQvLmF0b20vcGFja2FnZXMvZXgtbW9kZS9saWIvZXgtbm9ybWFsLW1vZGUtaW5wdXQtZWxlbWVudC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEseUJBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFNO0FBQ0osZ0RBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHdDQUFBLGVBQUEsR0FBaUIsU0FBQSxHQUFBO0FBQ2YsTUFBQSxJQUFDLENBQUEsU0FBRCxHQUFhLG9CQUFiLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxlQUFELEdBQW1CLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBRm5CLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxlQUFlLENBQUMsU0FBakIsR0FBNkIsa0JBSDdCLENBQUE7YUFLQSxJQUFDLENBQUEsV0FBRCxDQUFhLElBQUMsQ0FBQSxlQUFkLEVBTmU7SUFBQSxDQUFqQixDQUFBOztBQUFBLHdDQVFBLFVBQUEsR0FBWSxTQUFFLFNBQUYsRUFBYSxJQUFiLEdBQUE7QUFDVixVQUFBLElBQUE7QUFBQSxNQURXLElBQUMsQ0FBQSxZQUFBLFNBQ1osQ0FBQTs7UUFEdUIsT0FBTztPQUM5QjtBQUFBLE1BQUEsSUFBRyxxQkFBSDtBQUNFLFFBQUEsSUFBQyxDQUFBLGVBQWUsQ0FBQyxTQUFTLENBQUMsR0FBM0IsQ0FBK0IsSUFBSSxDQUFDLE9BQUQsQ0FBbkMsQ0FBQSxDQURGO09BQUE7QUFHQSxNQUFBLElBQUcsSUFBSSxDQUFDLE1BQVI7QUFDRSxRQUFBLElBQUMsQ0FBQSxlQUFlLENBQUMsS0FBSyxDQUFDLE1BQXZCLEdBQWdDLEtBQWhDLENBREY7T0FIQTtBQUFBLE1BTUEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsa0JBQXZCLENBTmpCLENBQUE7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

//# sourceURL=/home/david/.atom/packages/ex-mode/lib/ex-normal-mode-input-element.coffee
