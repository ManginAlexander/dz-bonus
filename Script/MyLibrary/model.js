(function (toExport) {
    "use strict";
    /**
     * Базовый класс всех моих классов
     * @param data {Object} - объект, играющий роль коллекции значений будущего объекта
     * @constructor
     */
    var Model = function (data) {
        var key;
        for (key in data) {
            if (data.hasOwnProperty(key)) {
                this[key] = data[key];
            }
        }
    };
    /**
     * Функция ищет ошибки в объекте и возвращает их
     * @return {Array} массив содержащий {FieldsError}
     */
    Model.prototype.getAllError = function () {
        return [];
    };
    /**
     * Функция проверяет валиден ли объект
     * @return {Boolean}
     */
    Model.prototype.isValidate = function () {
        return this.getAllError().every(function (error) {
            return error.isCritical === false;
        });
    };
    toExport.Model = Model;
}(window));