(function() {
  var Delete, Join, LowerCase, Mark, Operator, OperatorError, OperatorWithInput, Point, Range, Repeat, ToggleCase, UpperCase, Utils, ViewModel, Yank, settings, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore-plus');

  _ref = require('atom'), Point = _ref.Point, Range = _ref.Range;

  ViewModel = require('../view-models/view-model').ViewModel;

  Utils = require('../utils');

  settings = require('../settings');

  OperatorError = (function() {
    function OperatorError(message) {
      this.message = message;
      this.name = 'Operator Error';
    }

    return OperatorError;

  })();

  Operator = (function() {
    Operator.prototype.vimState = null;

    Operator.prototype.motion = null;

    Operator.prototype.complete = null;

    function Operator(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      this.complete = false;
    }

    Operator.prototype.isComplete = function() {
      return this.complete;
    };

    Operator.prototype.isRecordable = function() {
      return true;
    };

    Operator.prototype.compose = function(motion) {
      if (!motion.select) {
        throw new OperatorError('Must compose with a motion');
      }
      this.motion = motion;
      return this.complete = true;
    };

    Operator.prototype.canComposeWith = function(operation) {
      return operation.select != null;
    };

    Operator.prototype.setTextRegister = function(register, text) {
      var type, _ref1;
      if ((_ref1 = this.motion) != null ? typeof _ref1.isLinewise === "function" ? _ref1.isLinewise() : void 0 : void 0) {
        type = 'linewise';
        if (text.slice(-1) !== '\n') {
          text += '\n';
        }
      } else {
        type = Utils.copyType(text);
      }
      if (text !== '') {
        return this.vimState.setRegister(register, {
          text: text,
          type: type
        });
      }
    };

    return Operator;

  })();

  OperatorWithInput = (function(_super) {
    __extends(OperatorWithInput, _super);

    function OperatorWithInput(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      this.editor = this.editor;
      this.complete = false;
    }

    OperatorWithInput.prototype.canComposeWith = function(operation) {
      return (operation.characters != null) || (operation.select != null);
    };

    OperatorWithInput.prototype.compose = function(operation) {
      if (operation.select != null) {
        this.motion = operation;
      }
      if (operation.characters != null) {
        this.input = operation;
        return this.complete = true;
      }
    };

    return OperatorWithInput;

  })(Operator);

  Delete = (function(_super) {
    __extends(Delete, _super);

    Delete.prototype.register = null;

    function Delete(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      this.complete = false;
      this.register = settings.defaultRegister();
    }

    Delete.prototype.execute = function(count) {
      var cursor, _base, _i, _len, _ref1;
      if (_.contains(this.motion.select(count), true)) {
        this.setTextRegister(this.register, this.editor.getSelectedText());
        this.editor.transact((function(_this) {
          return function() {
            var selection, _i, _len, _ref1, _results;
            _ref1 = _this.editor.getSelections();
            _results = [];
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              selection = _ref1[_i];
              _results.push(selection.deleteSelectedText());
            }
            return _results;
          };
        })(this));
        _ref1 = this.editor.getCursors();
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          cursor = _ref1[_i];
          if (typeof (_base = this.motion).isLinewise === "function" ? _base.isLinewise() : void 0) {
            cursor.skipLeadingWhitespace();
          } else {
            if (cursor.isAtEndOfLine() && !cursor.isAtBeginningOfLine()) {
              cursor.moveLeft();
            }
          }
        }
      }
      return this.vimState.activateNormalMode();
    };

    return Delete;

  })(Operator);

  ToggleCase = (function(_super) {
    __extends(ToggleCase, _super);

    function ToggleCase(editor, vimState, _arg) {
      this.editor = editor;
      this.vimState = vimState;
      this.complete = (_arg != null ? _arg : {}).complete;
    }

    ToggleCase.prototype.execute = function(count) {
      if (this.motion != null) {
        if (_.contains(this.motion.select(count), true)) {
          this.editor.replaceSelectedText({}, function(text) {
            return text.split('').map(function(char) {
              var lower;
              lower = char.toLowerCase();
              if (char === lower) {
                return char.toUpperCase();
              } else {
                return lower;
              }
            }).join('');
          });
        }
      } else {
        this.editor.transact((function(_this) {
          return function() {
            var cursor, cursorCount, lineLength, point, _i, _len, _ref1, _results;
            _ref1 = _this.editor.getCursors();
            _results = [];
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              cursor = _ref1[_i];
              point = cursor.getBufferPosition();
              lineLength = _this.editor.lineTextForBufferRow(point.row).length;
              cursorCount = Math.min(count != null ? count : 1, lineLength - point.column);
              _results.push(_.times(cursorCount, function() {
                var char, range;
                point = cursor.getBufferPosition();
                range = Range.fromPointWithDelta(point, 0, 1);
                char = _this.editor.getTextInBufferRange(range);
                if (char === char.toLowerCase()) {
                  _this.editor.setTextInBufferRange(range, char.toUpperCase());
                } else {
                  _this.editor.setTextInBufferRange(range, char.toLowerCase());
                }
                if (!(point.column >= lineLength - 1)) {
                  return cursor.moveRight();
                }
              }));
            }
            return _results;
          };
        })(this));
      }
      return this.vimState.activateNormalMode();
    };

    return ToggleCase;

  })(Operator);

  UpperCase = (function(_super) {
    __extends(UpperCase, _super);

    function UpperCase(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      this.complete = false;
    }

    UpperCase.prototype.execute = function(count) {
      if (_.contains(this.motion.select(count), true)) {
        this.editor.replaceSelectedText({}, function(text) {
          return text.toUpperCase();
        });
      }
      return this.vimState.activateNormalMode();
    };

    return UpperCase;

  })(Operator);

  LowerCase = (function(_super) {
    __extends(LowerCase, _super);

    function LowerCase(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      this.complete = false;
    }

    LowerCase.prototype.execute = function(count) {
      if (_.contains(this.motion.select(count), true)) {
        this.editor.replaceSelectedText({}, function(text) {
          return text.toLowerCase();
        });
      }
      return this.vimState.activateNormalMode();
    };

    return LowerCase;

  })(Operator);

  Yank = (function(_super) {
    __extends(Yank, _super);

    Yank.prototype.register = null;

    function Yank(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      this.register = settings.defaultRegister();
    }

    Yank.prototype.execute = function(count) {
      var i, newPositions, oldLastCursorPosition, oldLeft, oldTop, originalPosition, originalPositions, position, startPositions, text;
      oldTop = this.editor.getScrollTop();
      oldLeft = this.editor.getScrollLeft();
      oldLastCursorPosition = this.editor.getCursorBufferPosition();
      originalPositions = this.editor.getCursorBufferPositions();
      if (_.contains(this.motion.select(count), true)) {
        text = this.editor.getSelectedText();
        startPositions = _.pluck(this.editor.getSelectedBufferRanges(), "start");
        newPositions = (function() {
          var _base, _i, _len, _results;
          _results = [];
          for (i = _i = 0, _len = originalPositions.length; _i < _len; i = ++_i) {
            originalPosition = originalPositions[i];
            if (startPositions[i]) {
              position = Point.min(startPositions[i], originalPositions[i]);
              if (this.vimState.mode !== 'visual' && (typeof (_base = this.motion).isLinewise === "function" ? _base.isLinewise() : void 0)) {
                position = new Point(position.row, originalPositions[i].column);
              }
              _results.push(position);
            } else {
              _results.push(originalPosition);
            }
          }
          return _results;
        }).call(this);
      } else {
        text = '';
        newPositions = originalPositions;
      }
      this.setTextRegister(this.register, text);
      this.editor.setSelectedBufferRanges(newPositions.map(function(p) {
        return new Range(p, p);
      }));
      if (oldLastCursorPosition.isEqual(this.editor.getCursorBufferPosition())) {
        this.editor.setScrollLeft(oldLeft);
        this.editor.setScrollTop(oldTop);
      }
      return this.vimState.activateNormalMode();
    };

    return Yank;

  })(Operator);

  Join = (function(_super) {
    __extends(Join, _super);

    function Join(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      this.complete = true;
    }

    Join.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      this.editor.transact((function(_this) {
        return function() {
          return _.times(count, function() {
            return _this.editor.joinLines();
          });
        };
      })(this));
      return this.vimState.activateNormalMode();
    };

    return Join;

  })(Operator);

  Repeat = (function(_super) {
    __extends(Repeat, _super);

    function Repeat(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      this.complete = true;
    }

    Repeat.prototype.isRecordable = function() {
      return false;
    };

    Repeat.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      return this.editor.transact((function(_this) {
        return function() {
          return _.times(count, function() {
            var cmd;
            cmd = _this.vimState.history[0];
            return cmd != null ? cmd.execute() : void 0;
          });
        };
      })(this));
    };

    return Repeat;

  })(Operator);

  Mark = (function(_super) {
    __extends(Mark, _super);

    function Mark(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      Mark.__super__.constructor.call(this, this.editor, this.vimState);
      this.viewModel = new ViewModel(this, {
        "class": 'mark',
        singleChar: true,
        hidden: true
      });
    }

    Mark.prototype.execute = function() {
      this.vimState.setMark(this.input.characters, this.editor.getCursorBufferPosition());
      return this.vimState.activateNormalMode();
    };

    return Mark;

  })(OperatorWithInput);

  module.exports = {
    Operator: Operator,
    OperatorWithInput: OperatorWithInput,
    OperatorError: OperatorError,
    Delete: Delete,
    ToggleCase: ToggleCase,
    UpperCase: UpperCase,
    LowerCase: LowerCase,
    Yank: Yank,
    Join: Join,
    Repeat: Repeat,
    Mark: Mark
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvZGF2aWQvLmF0b20vcGFja2FnZXMvdmltLW1vZGUvbGliL29wZXJhdG9ycy9nZW5lcmFsLW9wZXJhdG9ycy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsaUtBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FBSixDQUFBOztBQUFBLEVBQ0EsT0FBaUIsT0FBQSxDQUFRLE1BQVIsQ0FBakIsRUFBQyxhQUFBLEtBQUQsRUFBUSxhQUFBLEtBRFIsQ0FBQTs7QUFBQSxFQUVDLFlBQWEsT0FBQSxDQUFRLDJCQUFSLEVBQWIsU0FGRCxDQUFBOztBQUFBLEVBR0EsS0FBQSxHQUFRLE9BQUEsQ0FBUSxVQUFSLENBSFIsQ0FBQTs7QUFBQSxFQUlBLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUixDQUpYLENBQUE7O0FBQUEsRUFNTTtBQUNTLElBQUEsdUJBQUUsT0FBRixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsVUFBQSxPQUNiLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxJQUFELEdBQVEsZ0JBQVIsQ0FEVztJQUFBLENBQWI7O3lCQUFBOztNQVBGLENBQUE7O0FBQUEsRUFVTTtBQUNKLHVCQUFBLFFBQUEsR0FBVSxJQUFWLENBQUE7O0FBQUEsdUJBQ0EsTUFBQSxHQUFRLElBRFIsQ0FBQTs7QUFBQSx1QkFFQSxRQUFBLEdBQVUsSUFGVixDQUFBOztBQUlhLElBQUEsa0JBQUUsTUFBRixFQUFXLFFBQVgsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLFNBQUEsTUFDYixDQUFBO0FBQUEsTUFEcUIsSUFBQyxDQUFBLFdBQUEsUUFDdEIsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxLQUFaLENBRFc7SUFBQSxDQUpiOztBQUFBLHVCQVVBLFVBQUEsR0FB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

//# sourceURL=/home/david/.atom/packages/vim-mode/lib/operators/general-operators.coffee
