(function() {
  var Ex, fs, helpers, os, path, uuid;

  fs = require('fs-plus');

  path = require('path');

  os = require('os');

  uuid = require('node-uuid');

  helpers = require('./spec-helper');

  Ex = require('../lib/ex').singleton();

  describe("the commands", function() {
    var dir, dir2, editor, editorElement, exState, keydown, normalModeInputKeydown, projectPath, submitNormalModeInputText, vimState, _ref;
    _ref = [], editor = _ref[0], editorElement = _ref[1], vimState = _ref[2], exState = _ref[3], dir = _ref[4], dir2 = _ref[5];
    projectPath = function(fileName) {
      return path.join(dir, fileName);
    };
    beforeEach(function() {
      var exMode, vimMode;
      vimMode = atom.packages.loadPackage('vim-mode');
      exMode = atom.packages.loadPackage('ex-mode');
      exMode.activate();
      return waitsForPromise(function() {
        return vimMode.activate().then(function() {
          return helpers.activateExMode().then(function() {
            dir = path.join(os.tmpdir(), "atom-ex-mode-spec-" + (uuid.v4()));
            dir2 = path.join(os.tmpdir(), "atom-ex-mode-spec-" + (uuid.v4()));
            fs.makeTreeSync(dir);
            fs.makeTreeSync(dir2);
            atom.project.setPaths([dir, dir2]);
            return helpers.getEditorElement(function(element) {
              atom.commands.dispatch(element, 'ex-mode:open');
              keydown('escape');
              editorElement = element;
              editor = editorElement.getModel();
              vimState = vimMode.mainModule.getEditorState(editor);
              exState = exMode.mainModule.exStates.get(editor);
              vimState.activateNormalMode();
              vimState.resetNormalMode();
              return editor.setText("abc\ndef\nabc\ndef");
            });
          });
        });
      });
    });
    afterEach(function() {
      fs.removeSync(dir);
      return fs.removeSync(dir2);
    });
    keydown = function(key, options) {
      if (options == null) {
        options = {};
      }
      if (options.element == null) {
        options.element = editorElement;
      }
      return helpers.keydown(key, options);
    };
    normalModeInputKeydown = function(key, opts) {
      if (opts == null) {
        opts = {};
      }
      return editor.normalModeInputView.editorElement.getModel().setText(key);
    };
    submitNormalModeInputText = function(text) {
      var commandEditor;
      commandEditor = editor.normalModeInputView.editorElement;
      commandEditor.getModel().setText(text);
      return atom.commands.dispatch(commandEditor, "core:confirm");
    };
    describe(":write", function() {
      describe("when editing a new file", function() {
        beforeEach(function() {
          return editor.getBuffer().setText('abc\ndef');
        });
        it("opens the save dialog", function() {
          spyOn(atom, 'showSaveDialogSync');
          keydown(':');
          submitNormalModeInputText('write');
          return expect(atom.showSaveDialogSync).toHaveBeenCalled();
        });
        it("saves when a path is specified in the save dialog", function() {
          var filePath;
          filePath = projectPath('write-from-save-dialog');
          spyOn(atom, 'showSaveDialogSync').andReturn(filePath);
          keydown(':');
          submitNormalModeInputText('write');
          expect(fs.existsSync(filePath)).toBe(true);
          return expect(fs.readFileSync(filePath, 'utf-8')).toEqual('abc\ndef');
        });
        return it("saves when a path is specified in the save dialog", function() {
          spyOn(atom, 'showSaveDialogSync').andReturn(void 0);
          spyOn(fs, 'writeFileSync');
          keydown(':');
          submitNormalModeInputText('write');
          return expect(fs.writeFileSync.calls.length).toBe(0);
        });
      });
      return describe("when editing an existing file", function() {
        var filePath, i;
        filePath = '';
        i = 0;
        beforeEach(function() {
          i++;
          filePath = projectPath("write-" + i);
          editor.setText('abc\ndef');
          return editor.saveAs(filePath);
        });
        it("saves the file", function() {
          editor.setText('abc');
          keydown(':');
          submitNormalModeInputText('write');
          expect(fs.readFileSync(filePath, 'utf-8')).toEqual('abc');
          return expect(editor.isModified()).toBe(false);
        });
        describe("with a specified path", function() {
          var newPath;
          newPath = '';
          beforeEach(function() {
            newPath = path.relative(dir, "" + filePath + ".new");
            editor.getBuffer().setText('abc');
            return keydown(':');
          });
          afterEach(function() {
            submitNormalModeInputText("write " + newPath);
            newPath = path.resolve(dir, fs.normalize(newPath));
            expect(fs.existsSync(newPath)).toBe(true);
            expect(fs.readFileSync(newPath, 'utf-8')).toEqual('abc');
            expect(editor.isModified()).toBe(true);
            return fs.removeSync(newPath);
          });
          it("saves to the path", function() {});
          it("expands .", function() {
            return newPath = path.join('.', newPath);
          });
          it("expands ..", function() {
            return newPath = path.join('..', newPath);
          });
          return it("expands ~", function() {
            return newPath = path.join('~', newPath);
          });
        });
        it("throws an error with more than one path", function() {
          keydown(':');
          submitNormalModeInputText('write path1 path2');
          return expect(atom.notifications.notifications[0].message).toEqual('Command error: Only one file name allowed');
        });
        return describe("when the file already exists", function() {
          var existsPath;
          existsPath = '';
          beforeEach(function() {
            existsPath = projectPath('write-exists');
            return fs.writeFileSync(existsPath, 'abc');
          });
          afterEach(function() {
            return fs.removeSync(existsPath);
          });
          it("throws an error if the file already exists", function() {
            keydown(':');
            submitNormalModeInputText("write " + existsPath);
            expect(atom.notifications.notifications[0].message).toEqual('Command error: File exists (add ! to override)');
            return expect(fs.readFileSync(existsPath, 'utf-8')).toEqual('abc');
          });
          return it("writes if forced with :write!", function() {
            keydown(':');
            submitNormalModeInputText("write! " + existsPath);
            expect(atom.notifications.notifications).toEqual([]);
            return expect(fs.readFileSync(existsPath, 'utf-8')).toEqual('abc\ndef');
          });
        });
      });
    });
    describe(":quit", function() {
      var pane;
      pane = null;
      beforeEach(function() {
        return waitsForPromise(function() {
          pane = atom.workspace.getActivePane();
          spyOn(pane, 'destroyActiveItem').andCallThrough();
          return atom.workspace.open();
        });
      });
      it("closes the active pane item if not modified", function() {
        keydown(':');
        submitNormalModeInputText('quit');
        expect(pane.destroyActiveItem).toHaveBeenCalled();
        return expect(pane.getItems().length).toBe(1);
      });
      return describe("when the active pane item is modified", function() {
        beforeEach(function() {
          return editor.getBuffer().setText('def');
        });
        return it("opens the prompt to save", function() {
          spyOn(pane, 'promptToSaveItem');
          keydown(':');
          submitNormalModeInputText('quit');
          return expect(pane.promptToSaveItem).toHaveBeenCalled();
        });
      });
    });
    describe(":tabclose", function() {
      return it("acts as an alias to :quit", function() {
        var _ref1;
        spyOn(Ex, 'tabclose').andCallThrough();
        spyOn(Ex, 'quit').andCallThrough();
        keydown(':');
        submitNormalModeInputText('tabclose');
        return (_ref1 = expect(Ex.quit)).toHaveBeenCalledWith.apply(_ref1, Ex.tabclose.calls[0].args);
      });
    });
    describe(":tabnext", function() {
      var pane;
      pane = null;
      beforeEach(function() {
        return waitsForPromise(function() {
          pane = atom.workspace.getActivePane();
          return atom.workspace.open().then(function() {
            return atom.workspace.open();
          }).then(function() {
            return atom.workspace.open();
          });
        });
      });
      it("switches to the next tab", function() {
        pane.activateItemAtIndex(1);
        keydown(':');
        submitNormalModeInputText('tabnext');
        return expect(pane.getActiveItemIndex()).toBe(2);
      });
      return it("wraps around", function() {
        pane.activateItemAtIndex(pane.getItems().length - 1);
        keydown(':');
        submitNormalModeInputText('tabnext');
        return expect(pane.getActiveItemIndex()).toBe(0);
      });
    });
    describe(":tabprevious", function() {
      var pane;
      pane = null;
      beforeEach(function() {
        return waitsForPromise(function() {
          pane = atom.workspace.getActivePane();
          return atom.workspace.open().then(function() {
            return atom.workspace.open();
          }).then(function() {
            return atom.workspace.open();
          });
        });
      });
      it("switches to the previous tab", function() {
        pane.activateItemAtIndex(1);
        keydown(':');
        submitNormalModeInputText('tabprevious');
        return expect(pane.getActiveItemIndex()).toBe(0);
      });
      return it("wraps around", function() {
        pane.activateItemAtIndex(0);
        keydown(':');
        submitNormalModeInputText('tabprevious');
        return expect(pane.getActiveItemIndex()).toBe(pane.getItems().length - 1);
      });
    });
    describe(":wq", function() {
      beforeEach(function() {
        spyOn(Ex, 'write').andCallThrough();
        return spyOn(Ex, 'quit');
      });
      it("writes the file, then quits", function() {
        spyOn(atom, 'showSaveDialogSync').andReturn(projectPath('wq-1'));
        keydown(':');
        submitNormalModeInputText('wq');
        expect(Ex.write).toHaveBeenCalled();
        return waitsFor((function() {
          return Ex.quit.wasCalled;
        }), "the :quit command to be called", 100);
      });
      it("doesn't quit when the file is new and no path is specified in the save dialog", function() {
        var wasNotCalled;
        spyOn(atom, 'showSaveDialogSync').andReturn(void 0);
        keydown(':');
        submitNormalModeInputText('wq');
        expect(Ex.write).toHaveBeenCalled();
        wasNotCalled = false;
        setImmediate((function() {
          return wasNotCalled = !Ex.quit.wasCalled;
        }));
        return waitsFor((function() {
          return wasNotCalled;
        }), 100);
      });
      return it("passes the file name", function() {
        keydown(':');
        submitNormalModeInputText('wq wq-2');
        expect(Ex.write).toHaveBeenCalled();
        expect(Ex.write.calls[0].args[1].trim()).toEqual('wq-2');
        return waitsFor((function() {
          return Ex.quit.wasCalled;
        }), "the :quit command to be called", 100);
      });
    });
    describe(":xit", function() {
      return it("acts as an alias to :wq", function() {
        spyOn(Ex, 'wq');
        keydown(':');
        submitNormalModeInputText('xit');
        return expect(Ex.wq).toHaveBeenCalled();
      });
    });
    describe(":edit", function() {
      describe("without a file name", function() {
        it("reloads the file from the disk", function() {
          var filePath;
          filePath = projectPath("edit-1");
          editor.getBuffer().setText('abc');
          editor.saveAs(filePath);
          fs.writeFileSync(filePath, 'def');
          keydown(':');
          submitNormalModeInputText('edit');
          return waitsFor((function() {
            return editor.getText() === 'def';
          }), "the editor's content to change", 100);
        });
        it("doesn't reload when the file has been modified", function() {
          var filePath, isntDef;
          filePath = projectPath("edit-2");
          editor.getBuffer().setText('abc');
          editor.saveAs(filePath);
          editor.getBuffer().setText('abcd');
          fs.writeFileSync(filePath, 'def');
          keydown(':');
          submitNormalModeInputText('edit');
          expect(atom.notifications.notifications[0].message).toEqual('Command error: No write since last change (add ! to override)');
          isntDef = false;
          setImmediate(function() {
            return isntDef = editor.getText() !== 'def';
          });
          return waitsFor((function() {
            return isntDef;
          }), "the editor's content not to change", 50);
        });
        it("reloads when the file has been modified and it is forced", function() {
          var filePath;
          filePath = projectPath("edit-3");
          editor.getBuffer().setText('abc');
          editor.saveAs(filePath);
          editor.getBuffer().setText('abcd');
          fs.writeFileSync(filePath, 'def');
          keydown(':');
          submitNormalModeInputText('edit!');
          expect(atom.notifications.notifications.length).toBe(0);
          return waitsFor((function() {
            return editor.getText() === 'def';
          }), "the editor's content to change", 50);
        });
        return it("throws an error when editing a new file", function() {
          editor.getBuffer().reload();
          keydown(':');
          submitNormalModeInputText('edit');
          expect(atom.notifications.notifications[0].message).toEqual('Command error: No file name');
          atom.commands.dispatch(editorElement, 'ex-mode:open');
          submitNormalModeInputText('edit!');
          return expect(atom.notifications.notifications[1].message).toEqual('Command error: No file name');
        });
      });
      return describe("with a file name", function() {
        beforeEach(function() {
          spyOn(atom.workspace, 'open');
          return editor.getBuffer().reload();
        });
        it("opens the specified path", function() {
          var filePath;
          filePath = projectPath('edit-new-test');
          keydown(':');
          submitNormalModeInputText("edit " + filePath);
          return expect(atom.workspace.open).toHaveBeenCalledWith(filePath);
        });
        it("opens a relative path", function() {
          keydown(':');
          submitNormalModeInputText('edit edit-relative-test');
          return expect(atom.workspace.open).toHaveBeenCalledWith(projectPath('edit-relative-test'));
        });
        return it("throws an error if trying to open more than one file", function() {
          keydown(':');
          submitNormalModeInputText('edit edit-new-test-1 edit-new-test-2');
          expect(atom.workspace.open.callCount).toBe(0);
          return expect(atom.notifications.notifications[0].message).toEqual('Command error: Only one file name allowed');
        });
      });
    });
    describe(":tabedit", function() {
      it("acts as an alias to :edit if supplied with a path", function() {
        var _ref1;
        spyOn(Ex, 'tabedit').andCallThrough();
        spyOn(Ex, 'edit');
        keydown(':');
        submitNormalModeInputText('tabedit tabedit-test');
        return (_ref1 = expect(Ex.edit)).toHaveBeenCalledWith.apply(_ref1, Ex.tabedit.calls[0].args);
      });
      return it("acts as an alias to :tabnew if not supplied with a path", function() {
        var _ref1;
        spyOn(Ex, 'tabedit').andCallThrough();
        spyOn(Ex, 'tabnew');
        keydown(':');
        submitNormalModeInputText('tabedit  ');
        return (_ref1 = expect(Ex.tabnew)).toHaveBeenCalledWith.apply(_ref1, Ex.tabedit.calls[0].args);
      });
    });
    describe(":tabnew", function() {
      return it("opens a new tab", function() {
        spyOn(atom.workspace, 'open');
        keydown(':');
        submitNormalModeInputText('tabnew');
        return expect(atom.workspace.open).toHaveBeenCalled();
      });
    });
    describe(":split", function() {
      return it("splits the current file upwards", function() {
        var filePath, pane;
        pane = atom.workspace.getActivePane();
        spyOn(pane, 'splitUp').andCallThrough();
        filePath = projectPath('split');
        editor.saveAs(filePath);
        keydown(':');
        submitNormalModeInputText('split');
        return expect(pane.splitUp).toHaveBeenCalled();
      });
    });
    describe(":vsplit", function() {
      return it("splits the current file to the left", function() {
        var filePath, pane;
        pane = atom.workspace.getActivePane();
        spyOn(pane, 'splitLeft').andCallThrough();
        filePath = projectPath('vsplit');
        editor.saveAs(filePath);
        keydown(':');
        submitNormalModeInputText('vsplit');
        return expect(pane.splitLeft).toHaveBeenCalled();
      });
    });
    describe(":delete", function() {
      beforeEach(function() {
        editor.setText('abc\ndef\nghi\njkl');
        return editor.setCursorBufferPosition([2, 0]);
      });
      it("deletes the current line", function() {
        keydown(':');
        submitNormalModeInputText('delete');
        return expect(editor.getText()).toEqual('abc\ndef\njkl');
      });
      it("deletes the lines in the given range", function() {
        var processedOpStack;
        processedOpStack = false;
        exState.onDidProcessOpStack(function() {
          return processedOpStack = true;
        });
        keydown(':');
        submitNormalModeInputText('1,2delete');
        expect(editor.getText()).toEqual('ghi\njkl');
        waitsFor(function() {
          return processedOpStack;
        });
        editor.setText('abc\ndef\nghi\njkl');
        editor.setCursorBufferPosition([1, 1]);
        atom.commands.dispatch(editorElement, 'ex-mode:open');
        submitNormalModeInputText(',/k/delete');
        return expect(editor.getText()).toEqual('abc\n');
      });
      return it("undos deleting several lines at once", function() {
        keydown(':');
        submitNormalModeInputText('-1,.delete');
        expect(editor.getText()).toEqual('abc\njkl');
        atom.commands.dispatch(editorElement, 'core:undo');
        return expect(editor.getText()).toEqual('abc\ndef\nghi\njkl');
      });
    });
    describe(":substitute", function() {
      beforeEach(function() {
        editor.setText('abcaABC\ndefdDEF\nabcaABC');
        return editor.setCursorBufferPosition([0, 0]);
      });
      it("replaces a character on the current line", function() {
        keydown(':');
        submitNormalModeInputText(':substitute /a/x');
        return expect(editor.getText()).toEqual('xbcaABC\ndefdDEF\nabcaABC');
      });
      it("doesn't need a space before the arguments", function() {
        keydown(':');
        submitNormalModeInputText(':substitute/a/x');
        return expect(editor.getText()).toEqual('xbcaABC\ndefdDEF\nabcaABC');
      });
      it("respects modifiers passed to it", function() {
        keydown(':');
        submitNormalModeInputText(':substitute/a/x/g');
        expect(editor.getText()).toEqual('xbcxABC\ndefdDEF\nabcaABC');
        atom.commands.dispatch(editorElement, 'ex-mode:open');
        submitNormalModeInputText(':substitute/a/x/gi');
        return expect(editor.getText()).toEqual('xbcxxBC\ndefdDEF\nabcaABC');
      });
      it("replaces on multiple lines", function() {
        keydown(':');
        submitNormalModeInputText(':%substitute/abc/ghi');
        expect(editor.getText()).toEqual('ghiaABC\ndefdDEF\nghiaABC');
        atom.commands.dispatch(editorElement, 'ex-mode:open');
        submitNormalModeInputText(':%substitute/abc/ghi/ig');
        return expect(editor.getText()).toEqual('ghiaghi\ndefdDEF\nghiaghi');
      });
      it("can't be delimited by letters", function() {
        keydown(':');
        submitNormalModeInputText(':substitute nanxngi');
        expect(atom.notifications.notifications[0].message).toEqual("Command error: Regular expressions can't be delimited by letters");
        return expect(editor.getText()).toEqual('abcaABC\ndefdDEF\nabcaABC');
      });
      return describe("capturing groups", function() {
        beforeEach(function() {
          return editor.setText('abcaABC\ndefdDEF\nabcaABC');
        });
        it("replaces \\1 with the first group", function() {
          keydown(':');
          submitNormalModeInputText(':substitute/bc(.{2})/X\\1X');
          return expect(editor.getText()).toEqual('aXaAXBC\ndefdDEF\nabcaABC');
        });
        it("replaces multiple groups", function() {
          keydown(':');
          submitNormalModeInputText(':substitute/a([a-z]*)aA([A-Z]*)/X\\1XY\\2Y');
          return expect(editor.getText()).toEqual('XbcXYBCY\ndefdDEF\nabcaABC');
        });
        return it("replaces \\0 with the entire match", function() {
          keydown(':');
          submitNormalModeInputText(':substitute/ab(ca)AB/X\\0X');
          return expect(editor.getText()).toEqual('XabcaABXC\ndefdDEF\nabcaABC');
        });
      });
    });
    return describe(":set", function() {
      it("throws an error without a specified option", function() {
        keydown(':');
        submitNormalModeInputText(':set');
        return expect(atom.notifications.notifications[0].message).toEqual('Command error: No option specified');
      });
      it("sets multiple options at once", function() {
        atom.config.set('editor.showInvisibles', false);
        atom.config.set('editor.showLineNumbers', false);
        keydown(':');
        submitNormalModeInputText(':set list number');
        expect(atom.config.get('editor.showInvisibles')).toBe(true);
        return expect(atom.config.get('editor.showLineNumbers')).toBe(true);
      });
      return describe("the options", function() {
        beforeEach(function() {
          atom.config.set('editor.showInvisibles', false);
          return atom.config.set('editor.showLineNumbers', false);
        });
        it("sets (no)list", function() {
          keydown(':');
          submitNormalModeInputText(':set list');
          expect(atom.config.get('editor.showInvisibles')).toBe(true);
          atom.commands.dispatch(editorElement, 'ex-mode:open');
          submitNormalModeInputText(':set nolist');
          return expect(atom.config.get('editor.showInvisibles')).toBe(false);
        });
        return it("sets (no)nu(mber)", function() {
          keydown(':');
          submitNormalModeInputText(':set nu');
          expect(atom.config.get('editor.showLineNumbers')).toBe(true);
          atom.commands.dispatch(editorElement, 'ex-mode:open');
          submitNormalModeInputText(':set nonu');
          expect(atom.config.get('editor.showLineNumbers')).toBe(false);
          atom.commands.dispatch(editorElement, 'ex-mode:open');
          submitNormalModeInputText(':set number');
          expect(atom.config.get('editor.showLineNumbers')).toBe(true);
          atom.commands.dispatch(editorElement, 'ex-mode:open');
          submitNormalModeInputText(':set nonumber');
          return expect(atom.config.get('editor.showLineNumbers')).toBe(false);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvZGF2aWQvLmF0b20vcGFja2FnZXMvZXgtbW9kZS9zcGVjL2V4LWNvbW1hbmRzLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLCtCQUFBOztBQUFBLEVBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBQUwsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFFQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FGTCxDQUFBOztBQUFBLEVBR0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxXQUFSLENBSFAsQ0FBQTs7QUFBQSxFQUlBLE9BQUEsR0FBVSxPQUFBLENBQVEsZUFBUixDQUpWLENBQUE7O0FBQUEsRUFNQSxFQUFBLEdBQUssT0FBQSxDQUFRLFdBQVIsQ0FBb0IsQ0FBQyxTQUFyQixDQUFBLENBTkwsQ0FBQTs7QUFBQSxFQVFBLFFBQUEsQ0FBUyxjQUFULEVBQXlCLFNBQUEsR0FBQTtBQUN2QixRQUFBLGtJQUFBO0FBQUEsSUFBQSxPQUF3RCxFQUF4RCxFQUFDLGdCQUFELEVBQVMsdUJBQVQsRUFBd0Isa0JBQXhCLEVBQWtDLGlCQUFsQyxFQUEyQyxhQUEzQyxFQUFnRCxjQUFoRCxDQUFBO0FBQUEsSUFDQSxXQUFBLEdBQWMsU0FBQyxRQUFELEdBQUE7YUFBYyxJQUFJLENBQUMsSUFBTCxDQUFVLEdBQVYsRUFBZSxRQUFmLEVBQWQ7SUFBQSxDQURkLENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLGVBQUE7QUFBQSxNQUFBLE9BQUEsR0FBVSxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQWQsQ0FBMEIsVUFBMUIsQ0FBVixDQUFBO0FBQUEsTUFDQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFk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

//# sourceURL=/home/david/.atom/packages/ex-mode/spec/ex-commands-spec.coffee
