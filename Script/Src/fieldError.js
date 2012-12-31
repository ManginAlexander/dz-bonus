(function(toExport) {
    var FieldsError = function (field, message, isCritical) {
        this.field = field;
        this.message = message;
        this.isCritical = isCritical;
    };
    FieldsError.prototype.toString = function () {
        return "Field: " + this.field + "\n\rMessage: [" + this.message + "]\n\rIsCritical: " +this.isCritical;
    };
    toExport.FieldsError = FieldsError;
}(window));