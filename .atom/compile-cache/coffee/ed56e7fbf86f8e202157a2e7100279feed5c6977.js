(function() {
  var CompositeDisposable, disposables, linter;

  linter = require("./linter");

  CompositeDisposable = require('atom').CompositeDisposable;

  disposables = new CompositeDisposable;

  module.exports = {
    config: {
      jslintVersion: {
        title: "JSLint version:",
        description: "Atom needs a reload for this setting to take effect",
        type: "string",
        "default": "latest",
        "enum": ["latest", "2015-05-08", "2014-07-08", "2014-04-21", "2014-02-06", "2014-01-26", "2013-11-23", "2013-09-22", "2013-08-26", "2013-08-13", "2013-02-03"]
      },
      validateOnSave: {
        title: "Validate on save",
        type: "boolean",
        "default": true
      },
      validateOnChange: {
        title: "Validate while typing",
        type: "boolean",
        "default": false
      },
      hideOnNoErrors: {
        title: "Hide panel if no errors was found",
        type: "boolean",
        "default": false
      },
      useFoldModeAsDefault: {
        title: "Use fold mode as default",
        type: "boolean",
        "default": false
      }
    },
    activate: function() {
      var editor, subscriptions;
      editor = atom.workspace.getActiveTextEditor();
      subscriptions = {
        onSave: null,
        onChange: null
      };
      atom.commands.add("atom-workspace", "jslint:lint", linter);
      return disposables.add(atom.workspace.observeTextEditors(function(editor) {
        var buff;
        buff = editor.getBuffer();
        disposables.add(buff.onDidSave(function() {
          if (atom.config.get("jslint.validateOnSave") === true) {
            return linter();
          }
        }));
        return disposables.add(buff.onDidStopChanging(function() {
          if (atom.config.get("jslint.validateOnChange") === true) {
            return linter();
          }
        }));
      }));
    },
    deactivate: function() {
      return disposables.dispose();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvZGF2aWQvLmF0b20vcGFja2FnZXMvanNsaW50L2xpYi9tYWluLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3Q0FBQTs7QUFBQSxFQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUixDQUFULENBQUE7O0FBQUEsRUFDQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBREQsQ0FBQTs7QUFBQSxFQUdBLFdBQUEsR0FBYyxHQUFBLENBQUEsbUJBSGQsQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsYUFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8saUJBQVA7QUFBQSxRQUNBLFdBQUEsRUFBYSxxREFEYjtBQUFBLFFBRUEsSUFBQSxFQUFNLFFBRk47QUFBQSxRQUdBLFNBQUEsRUFBUyxRQUhUO0FBQUEsUUFJQSxNQUFBLEVBQU0sQ0FBQyxRQUFELEVBQVcsWUFBWCxFQUF5QixZQUF6QixFQUF1QyxZQUF2QyxFQUFxRCxZQUFyRCxFQUFtRSxZQUFuRSxFQUFpRixZQUFqRixFQUErRixZQUEvRixFQUE2RyxZQUE3RyxFQUEySCxZQUEzSCxFQUF5SSxZQUF6SSxDQUpOO09BREY7QUFBQSxNQU1BLGNBQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLGtCQUFQO0FBQUEsUUFDQSxJQUFBLEVBQU0sU0FETjtBQUFBLFFBRUEsU0FBQSxFQUFTLElBRlQ7T0FQRjtBQUFBLE1BVUEsZ0JBQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLHVCQUFQO0FBQUEsUUFDQSxJQUFBLEVBQU0sU0FETjtBQUFBLFFBRUEsU0FBQSxFQUFTLEtBRlQ7T0FYRjtBQUFBLE1BY0EsY0FBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sbUNBQVA7QUFBQSxRQUNBLElBQUEsRUFBTSxTQUROO0FBQUEsUUFFQSxTQUFBLEVBQVMsS0FGVDtPQWZGO0FBQUEsTUFrQkEsb0JBQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLDBCQUFQO0FBQUEsUUFDQSxJQUFBLEVBQU0sU0FETjtBQUFBLFFBRUEsU0FBQSxFQUFTLEtBRlQ7T0FuQkY7S0FERjtBQUFBLElBd0JBLFFBQUEsRUFBVSxTQUFBLEdBQUE7QUFDUixVQUFBLHFCQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVQsQ0FBQTtBQUFBLE1BQ0EsYUFBQSxHQUNFO0FBQUEsUUFBQSxNQUFBLEVBQVEsSUFBUjtBQUFBLFFBQ0EsUUFBQSxFQUFVLElBRFY7T0FGRixDQUFBO0FBQUEsTUFLQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DLGFBQXBDLEVBQW1ELE1BQW5ELENBTEEsQ0FBQTthQU9BLFdBQVcsQ0FBQyxHQUFaLENBQWdCLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWYsQ0FBa0MsU0FBQyxNQUFELEdBQUE7QUFDaEQsWUFBQSxJQUFBO0FBQUEsUUFBQSxJQUFBLEdBQU8sTUFBTSxDQUFDLFNBQVAsQ0FBQSxDQUFQLENBQUE7QUFBQSxRQUNBLFdBQVcsQ0FBQyxHQUFaLENBQWdCLElBQUksQ0FBQyxTQUFMLENBQWUsU0FBQSxHQUFBO0FBQzdCLFVBQUEsSUFBWSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsdUJBQWhCLENBQUEsS0FBNEMsSUFBeEQ7bUJBQUEsTUFBQSxDQUFBLEVBQUE7V0FENkI7UUFBQSxDQUFmLENBQWhCLENBREEsQ0FBQTtlQUdBLFdBQVcsQ0FBQyxHQUFaLENBQWdCLElBQUksQ0FBQyxpQkFBTCxDQUF1QixTQUFBLEdBQUE7QUFDckMsVUFBQSxJQUFZLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix5QkFBaEIsQ0FBQSxLQUE4QyxJQUExRDttQkFBQSxNQUFBLENBQUEsRUFBQTtXQURxQztRQUFBLENBQXZCLENBQWhCLEVBSmdEO01BQUEsQ0FBbEMsQ0FBaEIsRUFSUTtJQUFBLENBeEJWO0FBQUEsSUF1Q0EsVUFBQSxFQUFZLFNBQUEsR0FBQTthQUNWLFdBQVcsQ0FBQyxPQUFaLENBQUEsRUFEVTtJQUFBLENBdkNaO0dBTkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/david/.atom/packages/jslint/lib/main.coffee
