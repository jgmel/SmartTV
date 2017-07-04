(function () {
    "use strict";

    window.KeypadInput = function ($scope, $element, $attrs, controller) {

        var self = this;

        this.modifierKeyListener = null;
        this.keyListener = null;
        this.element = $element;
        this.active = false;
        this.model = null;

        function init() {
            if (!$attrs.ngModel) {
                throw new Error("KeypadInput requires the use of ng-model on this element", $element);
            }
            clearSelectedElement();

            self.active = true;
            self.keyListener = $scope.$on(Keypad.KEY_PRESSED, handleKeyPressed);
            self.modifierKeyListener = $scope.$on(Keypad.MODIFIER_KEY_PRESSED, handleModifierKeyPressed);


            KeypadInput.selectedInput = self;
            $scope.$on('destroy', destroy);
        }


        function clearSelectedElement() {
            if (KeypadInput.selectedInput) {
                KeypadInput.selectedInput.active = false;
                KeypadInput.selectedInput.keyListener();
                KeypadInput.selectedInput = null;
            }
        }


        function handleKeyPressed(event, key) {
            var value = controller.$viewValue;

            if (!value) {
                value = "";
            }

            value += key;

            controller.$setViewValue(value);
            $scope.$apply();
        }

        function handleModifierKeyPressed(event, key) {
            if (self.active) {
                switch (key) {
                    case "Backspace":
                        var value = controller.$viewValue;
                        console.log('value', value);
                        value = value.substr(0, value.length-1);
                        console.log('value', value);
                        controller.$setViewValue(value);
                        $scope.$apply();
                        break;
                    case "Clear":
                        controller.$setViewValue("");
                        $scope.$apply();
                        break;
                    case "CapsLock":
                        break;
                }
            }
        }

        function destroy() {
            $element.off('click');
        }

        init();
    };

    KeypadInput.selectedInput = null;

    app.directive('ngKeypadInput', function () {
        return {
            restrict: 'A',
            require: '^ngModel',
            link: function ($scope, $element, $attrs, controller) {
                new KeypadInput($scope, $element, $attrs, controller);
            }
        }
    });
})();