/**
 * Return decimal hours of Hour minute second formatted string.
 *
 * @returns {*}
 */
String.prototype.toDec = function () {
    let hour   = this.match(/(\d{1,2})h/)[1] != 'undefined' ? parseFloat(this.match(/(\d{1,2})h/)[1]) : 0,
        minute = this.match(/(\d{1,2})m/)[1] != 'undefined' ? parseFloat(this.match(/(\d{1,2})m/)[1]) : 0,
        second = this.match(/(\d{1,2})s/)[1] != 'undefined' ? parseFloat(this.match(/(\d{1,2})s/)[1]) : 0,
        dec    = hour + (((second / 60) + minute) / 60);

    return dec;
};