(function() {
  var Command, CommandError, Ex, ExViewModel, Find;

  ExViewModel = require('./ex-view-model');

  Ex = require('./ex');

  Find = require('./find');

  CommandError = require('./command-error');

  Command = (function() {
    function Command(editor, exState) {
      this.editor = editor;
      this.exState = exState;
      this.viewModel = new ExViewModel(this);
    }

    Command.prototype.parseAddr = function(str, curPos) {
      var addr, mark, _ref;
      if (str === '.') {
        addr = curPos.row;
      } else if (str === '$') {
        addr = this.editor.getBuffer().lines.length - 1;
      } else if ((_ref = str[0]) === "+" || _ref === "-") {
        addr = curPos.row + this.parseOffset(str);
      } else if (!isNaN(str)) {
        addr = parseInt(str) - 1;
      } else if (str[0] === "'") {
        if (this.vimState == null) {
          throw new CommandError("Couldn't get access to vim-mode.");
        }
        mark = this.vimState.marks[str[1]];
        if (mark == null) {
          throw new CommandError("Mark " + str + " not set.");
        }
        addr = mark.bufferMarker.range.end.row;
      } else if (str[0] === "/") {
        addr = Find.findNextInBuffer(this.editor.buffer, curPos, str.slice(1, -1));
        if (addr == null) {
          throw new CommandError("Pattern not found: " + str.slice(1, -1));
        }
      } else if (str[0] === "?") {
        addr = Find.findPreviousInBuffer(this.editor.buffer, curPos, str.slice(1, -1));
        if (addr == null) {
          throw new CommandError("Pattern not found: " + str.slice(1, -1));
        }
      }
      return addr;
    };

    Command.prototype.parseOffset = function(str) {
      var o;
      if (str.length === 0) {
        return 0;
      }
      if (str.length === 1) {
        o = 1;
      } else {
        o = parseInt(str.slice(1));
      }
      if (str[0] === '+') {
        return o;
      } else {
        return -o;
      }
    };

    Command.prototype.execute = function(input) {
      var addr1, addr2, addrPattern, address1, address2, args, cl, command, curPos, func, lastLine, m, match, matching, name, off1, off2, range, val, _ref, _ref1, _ref2;
      this.vimState = (_ref = this.exState.globalExState.vim) != null ? _ref.getEditorState(this.editor) : void 0;
      cl = input.characters;
      cl = cl.replace(/^(:|\s)*/, '');
      if (!(cl.length > 0)) {
        return;
      }
      if (cl[0] === '"') {
        return;
      }
      lastLine = this.editor.getBuffer().lines.length - 1;
      if (cl[0] === '%') {
        range = [0, lastLine];
        cl = cl.slice(1);
      } else {
        addrPattern = /^(?:(\.|\$|\d+|'[\[\]<>'`"^.(){}a-zA-Z]|\/.*?[^\\]\/|\?.*?[^\\]\?|[+-]\d*)((?:\s*[+-]\d*)*))?(?:,(\.|\$|\d+|'[\[\]<>'`"^.(){}a-zA-Z]|\/.*?[^\\]\/|\?.*?[^\\]\?|[+-]\d*)((?:\s*[+-]\d*)*))?/;
        _ref1 = cl.match(addrPattern), match = _ref1[0], addr1 = _ref1[1], off1 = _ref1[2], addr2 = _ref1[3], off2 = _ref1[4];
        curPos = this.editor.getCursorBufferPosition();
        if (addr1 != null) {
          address1 = this.parseAddr(addr1, curPos);
        } else {
          address1 = curPos.row;
        }
        if (off1 != null) {
          address1 += this.parseOffset(off1);
        }
        if (address1 === -1) {
          address1 = 0;
        }
        if (address1 < 0 || address1 > lastLine) {
          throw new CommandError('Invalid range');
        }
        if (addr2 != null) {
          address2 = this.parseAddr(addr2, curPos);
        }
        if (off2 != null) {
          address2 += this.parseOffset(off2);
        }
        if (address2 < 0 || address2 > lastLine) {
          throw new CommandError('Invalid range');
        }
        if (address2 < address1) {
          throw new CommandError('Backwards range given');
        }
        range = [address1, address2 != null ? address2 : address1];
        cl = cl.slice(match != null ? match.length : void 0);
      }
      cl = cl.trimLeft();
      if (cl.length === 0) {
        this.editor.setCursorBufferPosition([range[1], 0]);
        return;
      }
      if (cl.length === 2 && cl[0] === 'k' && /[a-z]/i.test(cl[1])) {
        command = 'mark';
        args = cl[1];
      } else if (!/[a-z]/i.test(cl[0])) {
        command = cl[0];
        args = cl.slice(1);
      } else {
        _ref2 = cl.match(/^(\w+)(.*)/), m = _ref2[0], command = _ref2[1], args = _ref2[2];
      }
      if ((func = Ex.singleton()[command]) != null) {
        return func(range, args);
      } else {
        matching = (function() {
          var _ref3, _results;
          _ref3 = Ex.singleton();
          _results = [];
          for (name in _ref3) {
            val = _ref3[name];
            if (name.indexOf(command) === 0) {
              _results.push(name);
            }
          }
          return _results;
        })();
        matching.sort();
        command = matching[0];
        func = Ex.singleton()[command];
        if (func != null) {
          return func(range, args);
        } else {
          throw new CommandError("Not an editor command: " + input.characters);
        }
      }
    };

    return Command;

  })();

  module.exports = Command;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvZGF2aWQvLmF0b20vcGFja2FnZXMvZXgtbW9kZS9saWIvY29tbWFuZC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNENBQUE7O0FBQUEsRUFBQSxXQUFBLEdBQWMsT0FBQSxDQUFRLGlCQUFSLENBQWQsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsTUFBUixDQURMLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLFFBQVIsQ0FGUCxDQUFBOztBQUFBLEVBR0EsWUFBQSxHQUFlLE9BQUEsQ0FBUSxpQkFBUixDQUhmLENBQUE7O0FBQUEsRUFLTTtBQUNTLElBQUEsaUJBQUUsTUFBRixFQUFXLE9BQVgsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLFNBQUEsTUFDYixDQUFBO0FBQUEsTUFEcUIsSUFBQyxDQUFBLFVBQUEsT0FDdEIsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFNBQUQsR0FBaUIsSUFBQSxXQUFBLENBQVksSUFBWixDQUFqQixDQURXO0lBQUEsQ0FBYjs7QUFBQSxzQkFHQSxTQUFBLEdBQVcsU0FBQyxHQUFELEVBQU0sTUFBTixHQUFBO0FBQ1QsVUFBQSxnQkFBQTtBQUFBLE1BQUEsSUFBRyxHQUFBLEtBQU8sR0FBVjtBQUNFLFFBQUEsSUFBQSxHQUFPLE1BQU0sQ0FBQyxHQUFkLENBREY7T0FBQSxNQUVLLElBQUcsR0FBQSxLQUFPLEdBQVY7QUFFSCxRQUFBLElBQUEsR0FBTyxJQUFDLENBQUEsTUFBTSxDQUFDLFNBQVIsQ0FBQSxDQUFtQixDQUFDLEtBQUssQ0FBQyxNQUExQixHQUFtQyxDQUExQyxDQUZHO09BQUEsTUFHQSxZQUFHLEdBQUksQ0FBQSxDQUFBLEVBQUosS0FBVyxHQUFYLElBQUEsSUFBQSxLQUFnQixHQUFuQjtBQUNILFFBQUEsSUFBQSxH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

//# sourceURL=/home/david/.atom/packages/ex-mode/lib/command.coffee
