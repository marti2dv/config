(function() {
  module.exports = {
    findInBuffer: function(buffer, pattern) {
      var found;
      found = [];
      buffer.scan(new RegExp(pattern, 'g'), function(obj) {
        return found.push(obj.range);
      });
      return found;
    },
    findNextInBuffer: function(buffer, curPos, pattern) {
      var found, i, more;
      found = this.findInBuffer(buffer, pattern);
      more = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = found.length; _i < _len; _i++) {
          i = found[_i];
          if (i.compare([curPos, curPos]) === 1) {
            _results.push(i);
          }
        }
        return _results;
      })();
      if (more.length > 0) {
        return more[0].start.row;
      } else if (found.length > 0) {
        return found[0].start.row;
      } else {
        return null;
      }
    },
    findPreviousInBuffer: function(buffer, curPos, pattern) {
      var found, i, less;
      found = this.findInBuffer(buffer, pattern);
      less = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = found.length; _i < _len; _i++) {
          i = found[_i];
          if (i.compare([curPos, curPos]) === -1) {
            _results.push(i);
          }
        }
        return _results;
      })();
      if (less.length > 0) {
        return less[less.length - 1].start.row;
      } else if (found.length > 0) {
        return found[found.length - 1].start.row;
      } else {
        return null;
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvZGF2aWQvLmF0b20vcGFja2FnZXMvZXgtbW9kZS9saWIvZmluZC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FBaUI7QUFBQSxJQUNmLFlBQUEsRUFBZSxTQUFDLE1BQUQsRUFBUyxPQUFULEdBQUE7QUFDYixVQUFBLEtBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxFQUFSLENBQUE7QUFBQSxNQUNBLE1BQU0sQ0FBQyxJQUFQLENBQWdCLElBQUEsTUFBQSxDQUFPLE9BQVAsRUFBZ0IsR0FBaEIsQ0FBaEIsRUFBc0MsU0FBQyxHQUFELEdBQUE7ZUFBUyxLQUFLLENBQUMsSUFBTixDQUFXLEdBQUcsQ0FBQyxLQUFmLEVBQVQ7TUFBQSxDQUF0QyxDQURBLENBQUE7QUFFQSxhQUFPLEtBQVAsQ0FIYTtJQUFBLENBREE7QUFBQSxJQU1mLGdCQUFBLEVBQW1CLFNBQUMsTUFBRCxFQUFTLE1BQVQsRUFBaUIsT0FBakIsR0FBQTtBQUNqQixVQUFBLGNBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxJQUFDLENBQUEsWUFBRCxDQUFjLE1BQWQsRUFBc0IsT0FBdEIsQ0FBUixDQUFBO0FBQUEsTUFDQSxJQUFBOztBQUFRO2FBQUEsNENBQUE7d0JBQUE7Y0FBc0IsQ0FBQyxDQUFDLE9BQUYsQ0FBVSxDQUFDLE1BQUQsRUFBUyxNQUFULENBQVYsQ0FBQSxLQUErQjtBQUFyRCwwQkFBQSxFQUFBO1dBQUE7QUFBQTs7VUFEUixDQUFBO0FBRUEsTUFBQSxJQUFHLElBQUksQ0FBQyxNQUFMLEdBQWMsQ0FBakI7QUFDRSxlQUFPLElBQUssQ0FBQSxDQUFBLENBQUUsQ0FBQyxLQUFLLENBQUMsR0FBckIsQ0FERjtPQUFBLE1BRUssSUFBRyxLQUFLLENBQUMsTUFBTixHQUFlLENBQWxCO0FBQ0gsZUFBTyxLQUFNLENBQUEsQ0FBQSxDQUFFLENBQUMsS0FBSyxDQUFDLEdBQXRCLENBREc7T0FBQSxNQUFBO0FBR0gsZUFBTyxJQUFQLENBSEc7T0FMWTtJQUFBLENBTko7QUFBQSxJQWdCZixvQkFBQSxFQUF1QixTQUFDLE1BQUQsRUFBUyxNQUFULEVBQWlCLE9BQWpCLEdBQUE7QUFDckIsVUFBQSxjQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVEsSUFBQyxDQUFBLFlBQUQsQ0FBYyxNQUFkLEVBQXNCLE9BQXRCLENBQVIsQ0FBQTtBQUFBLE1BQ0EsSUFBQTs7QUFBUTthQUFBLDRDQUFBO3dCQUFBO2NBQXNCLENBQUMsQ0FBQyxPQUFGLENBQVUsQ0FBQyxNQUFELEVBQVMsTUFBVCxDQUFWLENBQUEsS0FBK0IsQ0FBQTtBQUFyRCwwQkFBQSxFQUFBO1dBQUE7QUFBQTs7VUFEUixDQUFBO0FBRUEsTUFBQSxJQUFHLElBQUksQ0FBQyxNQUFMLEdBQWMsQ0FBakI7QUFDRSxlQUFPLElBQUssQ0FBQSxJQUFJLENBQUMsTUFBTCxHQUFjLENBQWQsQ0FBZ0IsQ0FBQyxLQUFLLENBQUMsR0FBbkMsQ0FERjtPQUFBLE1BRUssSUFBRyxLQUFLLENBQUMsTUFBTixHQUFlLENBQWxCO0FBQ0gsZUFBTyxLQUFNLENBQUEsS0FBSyxDQUFDLE1BQU4sR0FBZSxDQUFmLENBQWlCLENBQUMsS0FBSyxDQUFDLEdBQXJDLENBREc7T0FBQSxNQUFBO0FBR0gsZUFBTyxJQUFQLENBSEc7T0FMZ0I7SUFBQSxDQWhCUjtHQUFqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/david/.atom/packages/ex-mode/lib/find.coffee
