define(["exports", "aurelia-dependency-injection", "aurelia-templating"], function (exports, _aureliaDependencyInjection, _aureliaTemplating) {
  "use strict";

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var Container = _aureliaDependencyInjection.Container;
  var Behavior = _aureliaTemplating.Behavior;
  var CompositionEngine = _aureliaTemplating.CompositionEngine;
  var ViewSlot = _aureliaTemplating.ViewSlot;
  var ViewResources = _aureliaTemplating.ViewResources;

  var Compose = exports.Compose = (function () {
    function Compose(container, compositionEngine, viewSlot, viewResources) {
      _classCallCheck(this, Compose);

      this.container = container;
      this.compositionEngine = compositionEngine;
      this.viewSlot = viewSlot;
      this.viewResources = viewResources;
    }

    _prototypeProperties(Compose, {
      metadata: {
        value: function metadata() {
          return Behavior.customElement("compose").withProperty("model").withProperty("view").withProperty("viewModel").noView();
        },
        writable: true,
        configurable: true
      },
      inject: {
        value: function inject() {
          return [Container, CompositionEngine, ViewSlot, ViewResources];
        },
        writable: true,
        configurable: true
      }
    }, {
      bind: {
        value: function bind(executionContext) {
          this.executionContext = executionContext;
          processInstruction(this, { view: this.view, viewModel: this.viewModel, model: this.model });
        },
        writable: true,
        configurable: true
      },
      modelChanged: {
        value: function modelChanged(newValue, oldValue) {
          var vm = this.currentViewModel;

          if (vm && typeof vm.activate === "function") {
            vm.activate(newValue);
          }
        },
        writable: true,
        configurable: true
      },
      viewChanged: {
        value: function viewChanged(newValue, oldValue) {
          processInstruction(this, { view: newValue, viewModel: this.currentViewModel || this.viewModel, model: this.model });
        },
        writable: true,
        configurable: true
      },
      viewModelChanged: {
        value: function viewModelChanged(newValue, oldValue) {
          processInstruction(this, { viewModel: newValue, view: this.view, model: this.model });
        },
        writable: true,
        configurable: true
      }
    });

    return Compose;
  })();

  function processInstruction(composer, instruction) {
    composer.compositionEngine.compose(Object.assign(instruction, {
      executionContext: composer.executionContext,
      container: composer.container,
      viewSlot: composer.viewSlot,
      viewResources: composer.viewResources,
      currentBehavior: composer.currentBehavior
    })).then(function (next) {
      composer.currentBehavior = next;
      composer.currentViewModel = next ? next.executionContext : null;
    });
  }
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});