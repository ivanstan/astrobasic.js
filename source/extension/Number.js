Number.prototype.toRadians = function () {
    return this * Math.PI / 180;
};

Number.prototype.toDegrees = function () {
    return this * (180 / Math.PI);
};

/**
 * Return Hour minute second from decimal hours
 *
 * @returns {*}
 */
Number.prototype.toHMS = function () {
    let hour, minute, second, f;

    hour   = parseInt(this);
    f      = this - hour;
    f      = f * 60;
    minute = parseInt(f);
    f      = f - parseInt(f);
    second = parseInt(f * 60);

    return `${hour}h ${minute}m ${second}s`;
};

Number.prototype.mod = function (n) {
    return ((this % n) + n) % n;
};