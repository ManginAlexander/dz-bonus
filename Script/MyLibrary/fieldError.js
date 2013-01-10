(function (toExport) {
    "use strict";
    /**
     * @class класс ошибок возникающих в полях объекта
     * @param field {String} имя поля
     * @param message {String} сообщение
     * @param isCritical {Boolean} возможна ли дальнейшая работа?
     * @constructor
     */
    var FieldsError = function (field, message, isCritical) {
        this.field = field;
        this.message = message;
        this.isCritical = isCritical;
    };
    FieldsError.prototype.toString = function () {
        return "Field: " + this.field + "\n\rMessage: [" + this.message + "]\n\rIsCritical: " + this.isCritical;
    };
    toExport.FieldsError = FieldsError;
}(window));