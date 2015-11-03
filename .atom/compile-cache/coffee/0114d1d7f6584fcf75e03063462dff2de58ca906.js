(function() {
  var LineMessageView, MessagePanelView, PlainMessageView, config, content, editor, jsLint, jsLinter, messages, result, _ref;

  _ref = require("atom-message-panel"), MessagePanelView = _ref.MessagePanelView, PlainMessageView = _ref.PlainMessageView, LineMessageView = _ref.LineMessageView;

  config = require("./config");

  jsLint = require("jslint").load(atom.config.get("jslint.jslintVersion"));

  jsLinter = require("jslint").linter.doLint;

  messages = new MessagePanelView({
    title: "<span class=\"icon-bug\"></span> JSLint report",
    rawTitle: true,
    closeMethod: "destroy"
  });

  editor = null;

  content = null;

  result = null;

  module.exports = function() {
    var error, _i, _len, _ref1;
    editor = atom.workspace.getActiveTextEditor();
    if (!editor) {
      return;
    }
    if (editor.getGrammar().name !== "JavaScript") {
      return;
    }
    content = editor.getText();
    result = jsLinter(jsLint, content, config());
    messages.clear();
    messages.attach();
    if (atom.config.get("jslint.useFoldModeAsDefault") && messages.summary.css("display") === "none") {
      messages.toggle();
    }
    if (result.errors.length === 0) {
      atom.config.observe("jslint.hideOnNoErrors", function(value) {
        if (value === true) {
          return messages.close();
        } else {
          return messages.add(new PlainMessageView({
            message: "No errors were found!",
            className: "text-success"
          }));
        }
      });
    } else {
      _ref1 = result.errors;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        error = _ref1[_i];
        if (!error) {
          continue;
        }
        messages.add(new LineMessageView({
          message: error.reason,
          line: error.line,
          character: error.character,
          preview: error.evidence ? error.evidence.trim() : void 0,
          className: "text-error"
        }));
      }
    }
    return atom.workspace.onDidChangeActivePaneItem(function() {
      return messages.close();
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvZGF2aWQvLmF0b20vcGFja2FnZXMvanNsaW50L2xpYi9saW50ZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNIQUFBOztBQUFBLEVBQUEsT0FBd0QsT0FBQSxDQUFRLG9CQUFSLENBQXhELEVBQUMsd0JBQUEsZ0JBQUQsRUFBbUIsd0JBQUEsZ0JBQW5CLEVBQXFDLHVCQUFBLGVBQXJDLENBQUE7O0FBQUEsRUFDQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVIsQ0FEVCxDQUFBOztBQUFBLEVBRUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSLENBQWlCLENBQUMsSUFBbEIsQ0FBdUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHNCQUFoQixDQUF2QixDQUZULENBQUE7O0FBQUEsRUFHQSxRQUFBLEdBQVcsT0FBQSxDQUFRLFFBQVIsQ0FBaUIsQ0FBQyxNQUFNLENBQUMsTUFIcEMsQ0FBQTs7QUFBQSxFQUlBLFFBQUEsR0FBZSxJQUFBLGdCQUFBLENBQ2I7QUFBQSxJQUFBLEtBQUEsRUFBTyxnREFBUDtBQUFBLElBQ0EsUUFBQSxFQUFVLElBRFY7QUFBQSxJQUVBLFdBQUEsRUFBYSxTQUZiO0dBRGEsQ0FKZixDQUFBOztBQUFBLEVBUUEsTUFBQSxHQUFTLElBUlQsQ0FBQTs7QUFBQSxFQVNBLE9BQUEsR0FBVSxJQVRWLENBQUE7O0FBQUEsRUFVQSxNQUFBLEdBQVMsSUFWVCxDQUFBOztBQUFBLEVBWUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQSxHQUFBO0FBQ2YsUUFBQSxzQkFBQTtBQUFBLElBQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFULENBQUE7QUFFQSxJQUFBLElBQUEsQ0FBQSxNQUFBO0FBQUEsWUFBQSxDQUFBO0tBRkE7QUFHQSxJQUFBLElBQWMsTUFBTSxDQUFDLFVBQVAsQ0FBQSxDQUFtQixDQUFDLElBQXBCLEtBQTRCLFlBQTFDO0FBQUEsWUFBQSxDQUFBO0tBSEE7QUFBQSxJQUtBLE9BQUEsR0FBVSxNQUFNLENBQUMsT0FBUCxDQUFBLENBTFYsQ0FBQTtBQUFBLElBTUEsTUFBQSxHQUFTLFFBQUEsQ0FBUyxNQUFULEVBQWlCLE9BQWpCLEVBQTBCLE1BQUEsQ0FBQSxDQUExQixDQU5ULENBQUE7QUFBQSxJQVFBLFFBQVEsQ0FBQyxLQUFULENBQUEsQ0FSQSxDQUFBO0FBQUEsSUFTQSxRQUFRLENBQUMsTUFBVCxDQUFBLENBVEEsQ0FBQTtBQVdBLElBQUEsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNkJBQWhCLENBQUEsSUFBbUQsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFqQixDQUFxQixTQUFyQixDQUFBLEtBQW1DLE1BQXpGO0FBQ0UsTUFBQSxRQUFRLENBQUMsTUFBVCxDQUFBLENBQUEsQ0FERjtLQVhBO0FBY0EsSUFBQSxJQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBZCxLQUF3QixDQUEzQjtBQUNFLE1BQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLHVCQUFwQixFQUE2QyxTQUFDLEtBQUQsR0FBQTtBQUMzQyxRQUFBLElBQUcsS0FBQSxLQUFTLElBQVo7aUJBQ0UsUUFBUSxDQUFDLEtBQVQsQ0FBQSxFQURGO1NBQUEsTUFBQTtpQkFHRSxRQUFRLENBQUMsR0FBVCxDQUFpQixJQUFBLGdCQUFBLENBQ2Y7QUFBQSxZQUFBLE9BQUEsRUFBUyx1QkFBVDtBQUFBLFlBQ0EsU0FBQSxFQUFXLGNBRFg7V0FEZSxDQUFqQixFQUhGO1NBRDJDO01BQUEsQ0FBN0MsQ0FBQSxDQURGO0tBQUEsTUFBQTtBQVNFO0FBQUEsV0FBQSw0Q0FBQTswQkFBQTtBQUNFLFFBQUEsSUFBWSxDQUFBLEtBQVo7QUFBQSxtQkFBQTtTQUFBO0FBQUEsUUFFQSxRQUFRLENBQUMsR0FBVCxDQUFpQixJQUFBLGVBQUEsQ0FDZjtBQUFBLFVBQUEsT0FBQSxFQUFTLEtBQUssQ0FBQyxNQUFmO0FBQUEsVUFDQSxJQUFBLEVBQU0sS0FBSyxDQUFDLElBRFo7QUFBQSxVQUVBLFNBQUEsRUFBVyxLQUFLLENBQUMsU0FGakI7QUFBQSxVQUdBLE9BQUEsRUFBa0MsS0FBSyxDQUFDLFFBQS9CLEdBQUEsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFmLENBQUEsQ0FBQSxHQUFBLE1BSFQ7QUFBQSxVQUlBLFNBQUEsRUFBVyxZQUpYO1NBRGUsQ0FBakIsQ0FGQSxDQURGO0FBQUEsT0FURjtLQWRBO1dBaUNBLElBQUksQ0FBQyxTQUFTLENBQUMseUJBQWYsQ0FBeUMsU0FBQSxHQUFBO2FBQ3ZDLFFBQVEsQ0FBQyxLQUFULENBQUEsRUFEdUM7SUFBQSxDQUF6QyxFQWxDZTtFQUFBLENBWmpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/david/.atom/packages/jslint/lib/linter.coffee
