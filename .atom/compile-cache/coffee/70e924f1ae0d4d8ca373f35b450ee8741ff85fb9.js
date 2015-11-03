(function() {
  var CommandError, Ex, VimOption, fs, getFullPath, path, replaceGroups, saveAs, trySave,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice;

  path = require('path');

  CommandError = require('./command-error');

  fs = require('fs-plus');

  VimOption = require('./vim-option');

  trySave = function(func) {
    var deferred, error, errorMatch, fileName, _ref;
    deferred = Promise.defer();
    try {
      func();
      deferred.resolve();
    } catch (_error) {
      error = _error;
      if (error.message.endsWith('is a directory')) {
        atom.notifications.addWarning("Unable to save file: " + error.message);
      } else if (error.path != null) {
        if (error.code === 'EACCES') {
          atom.notifications.addWarning("Unable to save file: Permission denied '" + error.path + "'");
        } else if ((_ref = error.code) === 'EPERM' || _ref === 'EBUSY' || _ref === 'UNKNOWN' || _ref === 'EEXIST') {
          atom.notifications.addWarning("Unable to save file '" + error.path + "'", {
            detail: error.message
          });
        } else if (error.code === 'EROFS') {
          atom.notifications.addWarning("Unable to save file: Read-only file system '" + error.path + "'");
        }
      } else if ((errorMatch = /ENOTDIR, not a directory '([^']+)'/.exec(error.message))) {
        fileName = errorMatch[1];
        atom.notifications.addWarning("Unable to save file: A directory in the " + ("path '" + fileName + "' could not be written to"));
      } else {
        throw error;
      }
    }
    return deferred.promise;
  };

  saveAs = function(filePath) {
    var editor;
    editor = atom.workspace.getActiveTextEditor();
    return fs.writeFileSync(filePath, editor.getText());
  };

  getFullPath = function(filePath) {
    filePath = fs.normalize(filePath);
    if (path.isAbsolute(filePath)) {
      return filePath;
    } else if (atom.project.getPaths().length === 0) {
      return path.join(fs.normalize('~'), filePath);
    } else {
      return path.join(atom.project.getPaths()[0], filePath);
    }
  };

  replaceGroups = function(groups, string) {
    var char, escaped, group, replaced;
    replaced = '';
    escaped = false;
    while ((char = string[0]) != null) {
      string = string.slice(1);
      if (char === '\\' && !escaped) {
        escaped = true;
      } else if (/\d/.test(char) && escaped) {
        escaped = false;
        group = groups[parseInt(char)];
        if (group == null) {
          group = '';
        }
        replaced += group;
      } else {
        escaped = false;
        replaced += char;
      }
    }
    return replaced;
  };

  Ex = (function() {
    function Ex() {
      this.vsp = __bind(this.vsp, this);
      this.s = __bind(this.s, this);
      this.sp = __bind(this.sp, this);
      this.xit = __bind(this.xit, this);
      this.wq = __bind(this.wq, this);
      this.w = __bind(this.w, this);
      this.e = __bind(this.e, this);
      this.tabp = __bind(this.tabp, this);
      this.tabn = __bind(this.tabn, this);
      this.tabc = __bind(this.tabc, this);
      this.tabclose = __bind(this.tabclose, this);
      this.tabnew = __bind(this.tabnew, this);
      this.tabe = __bind(this.tabe, this);
      this.tabedit = __bind(this.tabedit, this);
      this.q = __bind(this.q, this);
    }

    Ex.singleton = function() {
      return Ex.ex || (Ex.ex = new Ex);
    };

    Ex.registerCommand = function(name, func) {
      return Ex.singleton()[name] = func;
    };

    Ex.prototype.quit = function() {
      return atom.workspace.getActivePane().destroyActiveItem();
    };

    Ex.prototype.q = function() {
      return this.quit();
    };

    Ex.prototype.tabedit = function(range, args) {
      if (args.trim() !== '') {
        return this.edit(range, args);
      } else {
        return this.tabnew(range, args);
      }
    };

    Ex.prototype.tabe = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.tabedit.apply(this, args);
    };

    Ex.prototype.tabnew = function(range, args) {
      if (args.trim() === '') {
        return atom.workspace.open();
      } else {
        return this.tabedit(range, args);
      }
    };

    Ex.prototype.tabclose = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.quit.apply(this, args);
    };

    Ex.prototype.tabc = function() {
      return this.tabclose();
    };

    Ex.prototype.tabnext = function() {
      var pane;
      pane = atom.workspace.getActivePane();
      return pane.activateNextItem();
    };

    Ex.prototype.tabn = function() {
      return this.tabnext();
    };

    Ex.prototype.tabprevious = function() {
      var pane;
      pane = atom.workspace.getActivePane();
      return pane.activatePreviousItem();
    };

    Ex.prototype.tabp = function() {
      return this.tabprevious();
    };

    Ex.prototype.edit = function(range, filePath) {
      var editor, force, fullPath;
      filePath = filePath.trim();
      if (filePath[0] === '!') {
        force = true;
        filePath = filePath.slice(1).trim();
      } else {
        force = false;
      }
      editor = atom.workspace.getActiveTextEditor();
      if (editor.isModified() && !force) {
        throw new CommandError('No write since last change (add ! to override)');
      }
      if (filePath.indexOf(' ') !== -1) {
        throw new CommandError('Only one file name allowed');
      }
      if (filePath.length !== 0) {
        fullPath = getFullPath(filePath);
        if (fullPath === editor.getPath()) {
          return editor.getBuffer().reload();
        } else {
          return atom.workspace.open(fullPath);
        }
      } else {
        if (editor.getPath() != null) {
          return editor.getBuffer().reload();
        } else {
          throw new CommandError('No file name');
        }
      }
    };

    Ex.prototype.e = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.edit.apply(this, args);
    };

    Ex.prototype.enew = function() {
      var buffer;
      buffer = atom.workspace.getActiveTextEditor().buffer;
      buffer.setPath(void 0);
      return buffer.load();
    };

    Ex.prototype.write = function(range, filePath) {
      var deferred, editor, force, fullPath, saved;
      if (filePath[0] === '!') {
        force = true;
        filePath = filePath.slice(1);
      } else {
        force = false;
      }
      filePath = filePath.trim();
      if (filePath.indexOf(' ') !== -1) {
        throw new CommandError('Only one file name allowed');
      }
      deferred = Promise.defer();
      editor = atom.workspace.getActiveTextEditor();
      saved = false;
      if (filePath.length !== 0) {
        fullPath = getFullPath(filePath);
      }
      if ((editor.getPath() != null) && ((fullPath == null) || editor.getPath() === fullPath)) {
        trySave(function() {
          return editor.save();
        }).then(deferred.resolve);
        saved = true;
      } else if (fullPath == null) {
        fullPath = atom.showSaveDialogSync();
      }
      if (!saved && (fullPath != null)) {
        if (!force && fs.existsSync(fullPath)) {
          throw new CommandError("File exists (add ! to override)");
        }
        trySave(function() {
          return saveAs(fullPath);
        }).then(deferred.resolve);
      }
      return deferred.promise;
    };

    Ex.prototype.w = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.write.apply(this, args);
    };

    Ex.prototype.wq = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.write.apply(this, args).then((function(_this) {
        return function() {
          return _this.quit();
        };
      })(this));
    };

    Ex.prototype.xit = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.wq.apply(this, args);
    };

    Ex.prototype.wa = function() {
      return atom.workspace.saveAll();
    };

    Ex.prototype.split = function(range, args) {
      var file, filePaths, newPane, pane, _i, _len, _results;
      args = args.trim();
      filePaths = args.split(' ');
      if (filePaths.length === 1 && filePaths[0] === '') {
        filePaths = void 0;
      }
      pane = atom.workspace.getActivePane();
      if ((filePaths != null) && filePaths.length > 0) {
        newPane = pane.splitUp();
        _results = [];
        for (_i = 0, _len = filePaths.length; _i < _len; _i++) {
          file = filePaths[_i];
          _results.push((function() {
            return atom.workspace.openURIInPane(file, newPane);
          })());
        }
        return _results;
      } else {
        return pane.splitUp({
          copyActiveItem: true
        });
      }
    };

    Ex.prototype.sp = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.split.apply(this, args);
    };

    Ex.prototype.substitute = function(range, args) {
      var args_, buffer, delim, delimRE, e, i, notDelimRE, pattern, spl;
      args = args.trimLeft();
      delim = args[0];
      if (/[a-z]/i.test(delim)) {
        throw new CommandError("Regular expressions can't be delimited by letters");
      }
      delimRE = new RegExp("[^\\\\]" + delim);
      spl = [];
      args_ = args.slice(1);
      while ((i = args_.search(delimRE)) !== -1) {
        spl.push(args_.slice(0, +i + 1 || 9e9));
        args_ = args_.slice(i + 2);
      }
      if (args_.length === 0 && spl.length === 3) {
        throw new CommandError('Trailing characters');
      } else if (args_.length !== 0) {
        spl.push(args_);
      }
      if (spl.length > 3) {
        throw new CommandError('Trailing characters');
      }
      if (spl[1] == null) {
        spl[1] = '';
      }
      if (spl[2] == null) {
        spl[2] = '';
      }
      notDelimRE = new RegExp("\\\\" + delim, 'g');
      spl[0] = spl[0].replace(notDelimRE, delim);
      spl[1] = spl[1].replace(notDelimRE, delim);
      try {
        pattern = new RegExp(spl[0], spl[2]);
      } catch (_error) {
        e = _error;
        if (e.message.indexOf('Invalid flags supplied to RegExp constructor') === 0) {
          throw new CommandError("Invalid flags: " + e.message.slice(45));
        } else if (e.message.indexOf('Invalid regular expression: ') === 0) {
          throw new CommandError("Invalid RegEx: " + e.message.slice(27));
        } else {
          throw e;
        }
      }
      buffer = atom.workspace.getActiveTextEditor().buffer;
      return atom.workspace.getActiveTextEditor().transact(function() {
        var line, _i, _ref, _ref1, _results;
        _results = [];
        for (line = _i = _ref = range[0], _ref1 = range[1]; _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; line = _ref <= _ref1 ? ++_i : --_i) {
          _results.push(buffer.scanInRange(pattern, [[line, 0], [line, buffer.lines[line].length]], function(_arg) {
            var match, matchText, range, replace, stop;
            match = _arg.match, matchText = _arg.matchText, range = _arg.range, stop = _arg.stop, replace = _arg.replace;
            return replace(replaceGroups(match.slice(0), spl[1]));
          }));
        }
        return _results;
      });
    };

    Ex.prototype.s = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.substitute.apply(this, args);
    };

    Ex.prototype.vsplit = function(range, args) {
      var file, filePaths, newPane, pane, _i, _len, _results;
      args = args.trim();
      filePaths = args.split(' ');
      if (filePaths.length === 1 && filePaths[0] === '') {
        filePaths = void 0;
      }
      pane = atom.workspace.getActivePane();
      if ((filePaths != null) && filePaths.length > 0) {
        newPane = pane.splitLeft();
        _results = [];
        for (_i = 0, _len = filePaths.length; _i < _len; _i++) {
          file = filePaths[_i];
          _results.push((function() {
            return atom.workspace.openURIInPane(file, newPane);
          })());
        }
        return _results;
      } else {
        return pane.splitLeft({
          copyActiveItem: true
        });
      }
    };

    Ex.prototype.vsp = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.vsplit.apply(this, args);
    };

    Ex.prototype["delete"] = function(range) {
      range = [[range[0], 0], [range[1] + 1, 0]];
      return atom.workspace.getActiveTextEditor().buffer.setTextInRange(range, '');
    };

    Ex.prototype.set = function(range, args) {
      var option, options, _i, _len, _results;
      args = args.trim();
      if (args === "") {
        throw new CommandError("No option specified");
      }
      options = args.split(' ');
      _results = [];
      for (_i = 0, _len = options.length; _i < _len; _i++) {
        option = options[_i];
        _results.push((function() {
          var nameValPair, optionName, optionProcessor, optionValue;
          if (option.includes("=")) {
            nameValPair = option.split("=");
            if (nameValPair.length !== 2) {
              throw new CommandError("Wrong option format. [name]=[value] format is expected");
            }
            optionName = nameValPair[0];
            optionValue = nameValPair[1];
            optionProcessor = VimOption.singleton()[optionName];
            if (optionProcessor == null) {
              throw new CommandError("No such option: " + optionName);
            }
            return optionProcessor(optionValue);
          } else {
            optionProcessor = VimOption.singleton()[option];
            if (optionProcessor == null) {
              throw new CommandError("No such option: " + option);
            }
            return optionProcessor();
          }
        })());
      }
      return _results;
    };

    return Ex;

  })();

  module.exports = Ex;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvZGF2aWQvLmF0b20vcGFja2FnZXMvZXgtbW9kZS9saWIvZXguY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtGQUFBO0lBQUE7c0JBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0EsWUFBQSxHQUFlLE9BQUEsQ0FBUSxpQkFBUixDQURmLENBQUE7O0FBQUEsRUFFQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FGTCxDQUFBOztBQUFBLEVBR0EsU0FBQSxHQUFZLE9BQUEsQ0FBUSxjQUFSLENBSFosQ0FBQTs7QUFBQSxFQUtBLE9BQUEsR0FBVSxTQUFDLElBQUQsR0FBQTtBQUNSLFFBQUEsMkNBQUE7QUFBQSxJQUFBLFFBQUEsR0FBVyxPQUFPLENBQUMsS0FBUixDQUFBLENBQVgsQ0FBQTtBQUVBO0FBQ0UsTUFBQSxJQUFBLENBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxRQUFRLENBQUMsT0FBVCxDQUFBLENBREEsQ0FERjtLQUFBLGNBQUE7QUFJRSxNQURJLGNBQ0osQ0FBQTtBQUFBLE1BQUEsSUFBRyxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLENBQUg7QUFDRSxRQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBbkIsQ0FBK0IsdUJBQUEsR0FBdUIsS0FBSyxDQUFDLE9BQTVELENBQUEsQ0FERjtPQUFBLE1BRUssSUFBRyxrQkFBSDtBQUNILFFBQUEsSUFBRyxLQUFLLENBQUMsSUFBTixLQUFjLFFBQWpCO0FBQ0UsVUFBQSxJQUFJLENBQUMsYUFDSCxDQUFDLFVBREgsQ0FDZSwwQ0FBQSxHQUEwQyxLQUFLLENBQUMsSUFBaEQsR0FBcUQsR0FEcEUsQ0FBQSxDQURGO1NBQUEsTUFHSyxZQUFHLEtBQUssQ0FBQyxLQUFO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

//# sourceURL=/home/david/.atom/packages/ex-mode/lib/ex.coffee
