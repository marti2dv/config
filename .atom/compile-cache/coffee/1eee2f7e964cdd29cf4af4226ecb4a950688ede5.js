(function() {
  var mouseEvent, objectCenterCoordinates, touchEvent;

  mouseEvent = function(type, properties) {
    var defaults, k, v;
    defaults = {
      bubbles: true,
      cancelable: type !== "mousemove",
      view: window,
      detail: 0,
      pageX: 0,
      pageY: 0,
      clientX: 0,
      clientY: 0,
      ctrlKey: false,
      altKey: false,
      shiftKey: false,
      metaKey: false,
      button: 0,
      relatedTarget: void 0
    };
    for (k in defaults) {
      v = defaults[k];
      if (properties[k] == null) {
        properties[k] = v;
      }
    }
    return new MouseEvent(type, properties);
  };

  touchEvent = function(type, touches) {
    var e, firstTouch, properties;
    firstTouch = touches[0];
    properties = {
      bubbles: true,
      cancelable: true,
      view: window,
      ctrlKey: false,
      altKey: false,
      shiftKey: false,
      metaKey: false,
      relatedTarget: void 0
    };
    e = new Event(type, properties);
    e.pageX = firstTouch.pageX;
    e.pageY = firstTouch.pageY;
    e.clientX = firstTouch.clientX;
    e.clientY = firstTouch.clientY;
    e.touches = e.targetTouches = e.changedTouches = touches;
    return e;
  };

  objectCenterCoordinates = function(obj) {
    var height, left, top, width, _ref;
    _ref = obj.getBoundingClientRect(), top = _ref.top, left = _ref.left, width = _ref.width, height = _ref.height;
    return {
      x: left + width / 2,
      y: top + height / 2
    };
  };

  module.exports = {
    objectCenterCoordinates: objectCenterCoordinates,
    mouseEvent: mouseEvent
  };

  ['mousedown', 'mousemove', 'mouseup', 'click'].forEach(function(key) {
    return module.exports[key] = function(obj, _arg) {
      var btn, cx, cy, x, y, _ref, _ref1;
      _ref = _arg != null ? _arg : {}, x = _ref.x, y = _ref.y, cx = _ref.cx, cy = _ref.cy, btn = _ref.btn;
      if (!((x != null) && (y != null))) {
        _ref1 = objectCenterCoordinates(obj), x = _ref1.x, y = _ref1.y;
      }
      if (!((cx != null) && (cy != null))) {
        cx = x;
        cy = y;
      }
      return obj.dispatchEvent(mouseEvent(key, {
        pageX: x,
        pageY: y,
        clientX: cx,
        clientY: cy,
        button: btn
      }));
    };
  });

  module.exports.mousewheel = function(obj, deltaX, deltaY) {
    if (deltaX == null) {
      deltaX = 0;
    }
    if (deltaY == null) {
      deltaY = 0;
    }
    return obj.dispatchEvent(mouseEvent('mousewheel', {
      deltaX: deltaX,
      deltaY: deltaY
    }));
  };

  ['touchstart', 'touchmove', 'touchend'].forEach(function(key) {
    return module.exports[key] = function(obj, _arg) {
      var cx, cy, x, y, _ref, _ref1;
      _ref = _arg != null ? _arg : {}, x = _ref.x, y = _ref.y, cx = _ref.cx, cy = _ref.cy;
      if (!((x != null) && (y != null))) {
        _ref1 = objectCenterCoordinates(obj), x = _ref1.x, y = _ref1.y;
      }
      if (!((cx != null) && (cy != null))) {
        cx = x;
        cy = y;
      }
      return obj.dispatchEvent(touchEvent(key, [
        {
          pageX: x,
          pageY: y,
          clientX: cx,
          clientY: cy
        }
      ]));
    };
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvZGF2aWQvLmF0b20vcGFja2FnZXMvbWluaW1hcC9zcGVjL2hlbHBlcnMvZXZlbnRzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUNBO0FBQUEsTUFBQSwrQ0FBQTs7QUFBQSxFQUFBLFVBQUEsR0FBYSxTQUFDLElBQUQsRUFBTyxVQUFQLEdBQUE7QUFDWCxRQUFBLGNBQUE7QUFBQSxJQUFBLFFBQUEsR0FBVztBQUFBLE1BQ1QsT0FBQSxFQUFTLElBREE7QUFBQSxNQUVULFVBQUEsRUFBYSxJQUFBLEtBQVUsV0FGZDtBQUFBLE1BR1QsSUFBQSxFQUFNLE1BSEc7QUFBQSxNQUlULE1BQUEsRUFBUSxDQUpDO0FBQUEsTUFLVCxLQUFBLEVBQU8sQ0FMRTtBQUFBLE1BTVQsS0FBQSxFQUFPLENBTkU7QUFBQSxNQU9ULE9BQUEsRUFBUyxDQVBBO0FBQUEsTUFRVCxPQUFBLEVBQVMsQ0FSQTtBQUFBLE1BU1QsT0FBQSxFQUFTLEtBVEE7QUFBQSxNQVVULE1BQUEsRUFBUSxLQVZDO0FBQUEsTUFXVCxRQUFBLEVBQVUsS0FYRDtBQUFBLE1BWVQsT0FBQSxFQUFTLEtBWkE7QUFBQSxNQWFULE1BQUEsRUFBUSxDQWJDO0FBQUEsTUFjVCxhQUFBLEVBQWUsTUFkTjtLQUFYLENBQUE7QUFpQkEsU0FBQSxhQUFBO3NCQUFBO1VBQStDO0FBQS9DLFFBQUEsVUFBVyxDQUFBLENBQUEsQ0FBWCxHQUFnQixDQUFoQjtPQUFBO0FBQUEsS0FqQkE7V0FtQkksSUFBQSxVQUFBLENBQVcsSUFBWCxFQUFpQixVQUFqQixFQXBCTztFQUFBLENBQWIsQ0FBQTs7QUFBQSxFQXNCQSxVQUFBLEdBQWEsU0FBQyxJQUFELEVBQU8sT0FBUCxHQUFBO0FBQ1gsUUFBQSx5QkFBQTtBQUFBLElBQUEsVUFBQSxHQUFhLE9BQVEsQ0FBQSxDQUFBLENBQXJCLENBQUE7QUFB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

//# sourceURL=/home/david/.atom/packages/minimap/spec/helpers/events.coffee
