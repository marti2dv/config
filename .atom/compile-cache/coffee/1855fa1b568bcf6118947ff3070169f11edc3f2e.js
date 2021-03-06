(function() {
  var DOMStylesReader, Mixin, rotate,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Mixin = require('mixto');

  module.exports = DOMStylesReader = (function(_super) {
    __extends(DOMStylesReader, _super);

    function DOMStylesReader() {
      return DOMStylesReader.__super__.constructor.apply(this, arguments);
    }


    /* Public */

    DOMStylesReader.prototype.retrieveStyleFromDom = function(scopes, property, shadowRoot, cache) {
      var filter, key, node, parent, scope, style, value, _base, _i, _len, _ref;
      if (shadowRoot == null) {
        shadowRoot = true;
      }
      if (cache == null) {
        cache = true;
      }
      this.ensureCache();
      key = scopes.join(' ');
      if (cache && (((_ref = this.constructor.domStylesCache[key]) != null ? _ref[property] : void 0) != null)) {
        return this.constructor.domStylesCache[key][property];
      }
      this.ensureDummyNodeExistence(shadowRoot);
      if ((_base = this.constructor.domStylesCache)[key] == null) {
        _base[key] = {};
      }
      parent = this.dummyNode;
      for (_i = 0, _len = scopes.length; _i < _len; _i++) {
        scope = scopes[_i];
        node = document.createElement('span');
        node.className = scope.replace(/\.+/g, ' ');
        if (parent != null) {
          parent.appendChild(node);
        }
        parent = node;
      }
      style = getComputedStyle(parent);
      filter = style.getPropertyValue('-webkit-filter');
      value = style.getPropertyValue(property);
      if (filter.indexOf('hue-rotate') !== -1) {
        value = this.rotateHue(value, filter);
      }
      this.dummyNode.innerHTML = '';
      if (value !== "") {
        this.constructor.domStylesCache[key][property] = value;
      }
      return value;
    };


    /* Internal */

    DOMStylesReader.prototype.ensureDummyNodeExistence = function(shadowRoot) {
      if (this.dummyNode == null) {
        this.dummyNode = document.createElement('span');
        this.dummyNode.style.visibility = 'hidden';
      }
      return this.getDummyDOMRoot(shadowRoot).appendChild(this.dummyNode);
    };

    DOMStylesReader.prototype.ensureCache = function() {
      var _base;
      return (_base = this.constructor).domStylesCache != null ? _base.domStylesCache : _base.domStylesCache = {};
    };

    DOMStylesReader.prototype.invalidateCache = function() {
      return this.constructor.domStylesCache = {};
    };

    DOMStylesReader.prototype.invalidateIfFirstTokenization = function() {
      if (this.constructor.hasTokenizedOnce) {
        return;
      }
      this.invalidateCache();
      return this.constructor.hasTokenizedOnce = true;
    };

    DOMStylesReader.prototype.rotateHue = function(value, filter) {
      var a, b, g, hue, r, _, _ref, _ref1, _ref2, _ref3;
      _ref = value.match(/rgb(a?)\((\d+), (\d+), (\d+)(, (\d+(\.\d+)?))?\)/), _ = _ref[0], _ = _ref[1], r = _ref[2], g = _ref[3], b = _ref[4], _ = _ref[5], a = _ref[6];
      _ref1 = filter.match(/hue-rotate\((\d+)deg\)/), _ = _ref1[0], hue = _ref1[1];
      _ref2 = [r, g, b, a, hue].map(Number), r = _ref2[0], g = _ref2[1], b = _ref2[2], a = _ref2[3], hue = _ref2[4];
      _ref3 = rotate(r, g, b, hue), r = _ref3[0], g = _ref3[1], b = _ref3[2];
      if (isNaN(a)) {
        return "rgb(" + r + ", " + g + ", " + b + ")";
      } else {
        return "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
      }
    };

    return DOMStylesReader;

  })(Mixin);

  rotate = function(r, g, b, angle) {
    var B, G, R, clamp, cos, hueRotateB, hueRotateG, hueRotateR, lumB, lumG, lumR, matrix, sin;
    clamp = function(num) {
      return Math.ceil(Math.max(0, Math.min(255, num)));
    };
    matrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    lumR = 0.2126;
    lumG = 0.7152;
    lumB = 0.0722;
    hueRotateR = 0.143;
    hueRotateG = 0.140;
    hueRotateB = 0.283;
    cos = Math.cos(angle * Math.PI / 180);
    sin = Math.sin(angle * Math.PI / 180);
    matrix[0] = lumR + (1 - lumR) * cos - (lumR * sin);
    matrix[1] = lumG - (lumG * cos) - (lumG * sin);
    matrix[2] = lumB - (lumB * cos) + (1 - lumB) * sin;
    matrix[3] = lumR - (lumR * cos) + hueRotateR * sin;
    matrix[4] = lumG + (1 - lumG) * cos + hueRotateG * sin;
    matrix[5] = lumB - (lumB * cos) - (hueRotateB * sin);
    matrix[6] = lumR - (lumR * cos) - ((1 - lumR) * sin);
    matrix[7] = lumG - (lumG * cos) + lumG * sin;
    matrix[8] = lumB + (1 - lumB) * cos + lumB * sin;
    R = clamp(matrix[0] * r + matrix[1] * g + matrix[2] * b);
    G = clamp(matrix[3] * r + matrix[4] * g + matrix[5] * b);
    B = clamp(matrix[6] * r + matrix[7] * g + matrix[8] * b);
    return [R, G, B];
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvZGF2aWQvLmF0b20vcGFja2FnZXMvbWluaW1hcC9saWIvbWl4aW5zL2RvbS1zdHlsZXMtcmVhZGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw4QkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxPQUFSLENBQVIsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixzQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUE7QUFBQSxnQkFBQTs7QUFBQSw4QkFhQSxvQkFBQSxHQUFzQixTQUFDLE1BQUQsRUFBUyxRQUFULEVBQW1CLFVBQW5CLEVBQW9DLEtBQXBDLEdBQUE7QUFDcEIsVUFBQSxxRUFBQTs7UUFEdUMsYUFBVztPQUNsRDs7UUFEd0QsUUFBTTtPQUM5RDtBQUFBLE1BQUEsSUFBQyxDQUFBLFdBQUQsQ0FBQSxDQUFBLENBQUE7QUFBQSxNQUVBLEdBQUEsR0FBTSxNQUFNLENBQUMsSUFBUCxDQUFZLEdBQVosQ0FGTixDQUFBO0FBSUEsTUFBQSxJQUFHLEtBQUEsSUFBVSwyRkFBYjtBQUNFLGVBQU8sSUFBQyxDQUFBLFdBQVcsQ0FBQyxjQUFlLENBQUEsR0FBQSxDQUFLLENBQUEsUUFBQSxDQUF4QyxDQURGO09BSkE7QUFBQSxNQU9BLElBQUMsQ0FBQSx3QkFBRCxDQUEwQixVQUExQixDQVBBLENBQUE7O2FBUTRCLENBQUEsR0FBQSxJQUFRO09BUnBDO0FBQUEsTUFVQSxNQUFBLEdBQVMsSUFBQyxDQUFBLFNBVlYsQ0FBQTtBQVdBLFdBQUEsNkNBQUE7MkJBQUE7QUFDRSxRQUFBLElBQUEsR0FBTyxRQUFRLENBQUMsYUFBVCxDQUF1QixNQUF2QixDQUFQLENBQUE7QUFBQSxRQUdBLElBQUksQ0FBQyxTQUFMLEdBQWlCLEtBQUssQ0FBQyxPQUFOLENB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

//# sourceURL=/home/david/.atom/packages/minimap/lib/mixins/dom-styles-reader.coffee
