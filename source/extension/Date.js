/**
 * Julian date Jan 1900 0.5
 *
 * @type {number}
 */
Date.J1900 = 2415020.0;

/**
 * Julian date Jan 2000 0.5
 *
 * @type {number}
 */
Date.J2000 = 2451545.0;

/**
 * Julian date Jan 2100 0.5
 *
 * @type {number}
 */
Date.J2100 = 2488070.0;

/**
 * Julian date on 2010 0.5
 *
 * @type {number}
 */
Date.J2010 = 2455197.0;

/**
 * Start of Gregorian epoch.
 *
 * @type {Date}
 */
Date.gregorianEpoch = new Date('Oct 15 1582');

/**
 * Returns local Julian date.
 *
 * @returns {number} Julian date
 */
Date.prototype.toJD = function (utc = false) {
    let y      = utc ? this.getUTCFullYear() : this.getFullYear(),
        m      = utc ? this.getUTCMonth() + 1 : this.getMonth() + 1,
        d      = utc ? this.getUTCDate() : this.getDate(),
        hour   = utc ? this.getUTCHours() : this.getHours(),
        minute = utc ? this.getUTCMinutes() : this.getMinutes(),
        second = utc ? this.getUTCSeconds() : this.getSeconds(),
        A      = 0,
        B      = 0,
        C      = 0,
        D      = 0;

    d += (hour / 24) + (minute / (24 * 60)) + (second / (24 * 60 * 60));

    if (m < 3) {
        y = y - 1;
        m = m + 12;
    }

    if (Date.gregorianEpoch.getDate() < this.getDate()) {
        A = parseInt(y / 100);
        B = 2 - A + parseInt(A / 4);
    }

    if (y < 0) {
        C = parseInt(365.25 * y - 0.75);
    } else {
        C = parseInt(365.25 * y);
    }

    D = parseInt(30.6001 * (m + 1));

    return B + C + D + d + 1720994.5;
};

/**
 * Creates new Date object from Julian date.
 *
 * @param julian Julian date.
 * @returns {Date} Date object.
 */
Date.fromJD = function (julian) {
    julian += .5;

    let I = parseInt(julian),
        F = julian - I,
        A = 0,
        B = I;

    if (I > 2299160) {
        A = parseInt((I - 1867216.25) / 36524.25);
        B = I + A - parseInt(A / 4) + 1;
    }

    let C = B + 1524,
        D = parseInt((C - 122.1) / 365.25),
        E = parseInt(365.25 * D),
        G = parseInt((C - E) / 30.6001),
        d = C - E + F - parseInt(30.6001 * G);

    var month = G - 13;
    if (G < 13.5) {
        month = G - 1;
    }

    var year = D - 4715;
    if (month > 2.5) {
        year = D - 4716;
    }

    var day         = parseInt(d);
    var fraction    = d - day;
    var hour        = parseInt(fraction * 24);
    fraction        = (fraction * 24) - hour;
    var minute      = parseInt(fraction * 60);
    fraction        = (fraction * 60) - minute;
    var second      = parseInt(fraction * 60);
    fraction        = fraction * 60 - second;
    var millisecond = parseInt(fraction * 1000);

    return new Date(year, month - 1, day, hour, minute, second, millisecond);
};

/**
 * Returns Greenwich mean sidereal time.
 *
 * @returns {number}
 */
Date.prototype.toGMST = function () {
    let hour   = this.getUTCHours(),
        minute = this.getUTCMinutes(),
        second = this.getUTCSeconds(),
        JD     = this.toJD(true),

        tsec   = hour * 3600 + minute * 60 + second,

        //gmst at 0:00
        T      = (JD - Date.J2000) / 36525,
        gmst0  = (24110.5484 + 8640184.812866 * T + 0.093104 * Math.pow(T, 2) + 0.0000062 * Math.pow(T, 3)) / 3600;

    if (gmst0 > 24) gmst0 = gmst0 % 24;

    //gmst at target time
    let gmst  = gmst0 + (tsec * 1.00273790925) / 3600,
        ε     = Ecliptic.obliquity(JD),
        ψ     = Ecliptic.nutation(JD),
        long1 = 280.4665 + 36000.7698 * T,
        long2 = 218.3165 + 481267.8813 * T,
        φ     = -17.20 * Math.sin(ψ.toRadians()) - (-1.32 * Math.sin(2 * long1.toRadians())) - 0.23 * Math.sin(2 * long2.toRadians()) + 0.21 * Math.sin(2 * ψ.toRadians());

    gmst = gmst + ((φ / 15) * (Math.cos(ε.toRadians()))) / 3600;
    if (gmst < 0) gmst = gmst % 24 + 24;
    if (gmst > 24) gmst = gmst % 24;

    return gmst;
};

// ToDo: check if this method is correct
Date.prototype.toGST = function () {
    let date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);

    let JD = date.toJD(true),
        S  = JD - Date.J2000,
        T  = S / 36525.0,
        T0 = 6.697374558 + (2400.051336 * T) + (0.000025862 * Math.pow(T, 2));

    T0 = T0.mod(24);
    if (T0 < 0) T0 += 24;

    let UT = (((this.getUTCMilliseconds() / 1000 + this.getUTCSeconds()) / 60) + this.getUTCMinutes()) / 60 + this.getUTCHours(),
        A  = UT * 1.002737909;

    T0 += A;

    let GST = T0 % 24;

    if (GST < 0) GST += 24;

    return GST;

};