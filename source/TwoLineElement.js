/**
 * Implementation of satellite two line element set.
 *
 * @see https://www.mmto.org/obscats/tle.html
 */
class TwoLineElement {

    /**
     * @constructor
     *
     * @param name
     * @param line1
     * @param line2
     */
    constructor(name, line1, line2) {

        if (typeof name != 'undefined' || typeof line1 != 'undefined' || typeof line2 != 'undefined') {
            this.parse(name, line1, line2);
        }

    }

    parse(name, line1, line2) {
        this.bstar_mantissa = Number(line1.substring(53, 59)) * 1e-5;
        this.bstar_exponent = Number("1e" + Number(line1.substring(59, 61)));
        this.bstar = this.bstar_mantissa * this.bstar_exponent;

        this.lineNum1 = Number(line1.slice(0, 0));
        this.designator1 = Number(line1.slice(2, 6));
        this.classification = Number(line1.slice(7, 7));
        this.identification = Number(line1.slice(9, 17));
        this.day = Number(line1.substring(20, 32));
        this.year = Number(line1.slice(18, 20));

        // first derivative of mean motion
        this.Δ1n = Number(line1.substring(33, 43));

        // second derivative of mean motion
        this.Δ2n = Number(line1.substring(44, 52));

        this.ephemeris_type = Number(line1.substring(62, 63));
        this.element_number = Number(line1.substring(64, 68));
        this.checkSum1 = Number(line1.substring(69, 69));
        this.lineNum2 = Number(line1.slice(0, 0));
        this.designator2 = Number(line2.slice(2, 7));

        this.designator = Number(line2.slice(2, 7));

        // inclination
        this.i = Number(line2.substring(8, 16));

        // right ascension
        this.Ω = Number(line2.substring(17, 25));

        // eccentricity
        this.e = Number('.000' + Number(line2.substring(26, 33)));

        // argument of periapsis
        this.ω = Number(line2.substring(34, 42));

        // mean anomaly at epoch
        this.M0 = Number(line2.substring(43, 51));

        // mean motion
        this.n = Number(line2.substring(52, 63));

        // revolution number at epoch
        this.N = Number(line2.substring(64, 68));

        // second line checksum
        let checkSum2 = Number(line1.substring(68, 69));

        // orbital period in seconds
        this.T = 86400 / this.n;

        this.year = (this.year < 57) ? this.year + 2000 : this.year + 1900;

        // epoch date
        this.epoch = moment(TwoLineElement.epoch2Date(this.year, this.day));
    }

    /**
     * Converts TLE year, day fraction to Date object.
     *
     * @param year
     * @param fraction
     * @returns {Date}
     */
    static epoch2Date(year, fraction) {
        year -= 1;
        let milliseconds = parseInt(Date.UTC(year, 11, 31, 0, 0, 0) + (fraction * 24 * 60 * 60 * 1000));

        return new Date(milliseconds);
    }

    toString() {
        //ToDo: implement in reverse
    }

}