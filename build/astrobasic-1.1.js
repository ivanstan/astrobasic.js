class Astro {

    static get G() {
        return 6.674E-11;
    }

    static rightAscension2hourAngle(α, time) {
        let UT = α.toDec(),
            GST = time.toGST();

        console.log(GST);
    }

}
/**
 * Earth planetary class.
 *
 * @see http://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html
 */
class Earth extends WGS84 {

    /**
     * Volumetric mean radius
     *
     * @returns {Unit}
     */
    static get R() {
        return math.unit(6371008, 'm');
    }

    /**
     * Mass
     *
     * @returns {Unit}
     */
    static get M() {
        return math.unit(5.97219E24, 'kg');
    }

    /**
     * Astronomical Unit, Sun to Earth distance.
     *
     * @see http://neo.jpl.nasa.gov/glossary/au.html
     * @returns {Unit}
     */
    static get AU() {
        return math.unit(149597870700, 'm');
    }

    // J2000

    static get e() {
        return 0.01671;
    }

    static get i() {
        return math.unit(0.000, 'deg');
    }

    static get ω() {
        return math.unit(288.064, 'deg');
    }

    static get Ω() {
        return math.unit(174.873, 'deg');
    }

    static get M0() {
        return math.unit(357.529, 'deg');
    }

}
class Moon extends Orbit {

    /**
     * Mean longitude at the epoch 2010.0.
     * @returns {Unit}
     */
    static get l0() {
        return math.unit(91.929336, 'deg');
    }

    /**
     * Mean longitude of the perigee at the epoch 2010.0.
     * @returns {Unit}
     */
    static get P0() {
        return math.unit(130.143076, 'deg');
    }

    /**
     * Mean longitude of the node at the epoch 2010.0.
     * @returns {Unit}
     */
    static get N0() {
        return math.unit(291.682547, 'deg');
    }

    /**
     * Moon’s angular diameter at distance a from the Earth at the epoch 2010.0
     * @returns {Unit}
     */
    static get θ0() {
        return math.unit(0.5181, 'deg');
    }

    /**
     * Moon’s angular diameter at distance a from the Earth at the epoch 2010.0
     * @returns {Unit}
     */
    static get π0() {
        return math.unit(0.9507, 'deg');
    }

    /**
     * Inclination of Moon’s orbit
     * @returns {Unit}
     */
    static get i() {
        return math.unit(5.145396, 'deg');
    }

    /**
     * Eccentricity of the Moon’s orbit
     * @returns {Unit}
     */
    static get e() {
        return 0.0549;
    }

    /**
     * Semi-major axis of Moon’s orbit
     * @returns {Unit}
     */
    static get a() {
        return math.unit(384401000, 'm');
    }

    /**
     * @constructor
     */
    constructor() {
        super();
    }

    position(time) {

        //ToDo: calculate Moon's position.

        let D = (Date.J2010 - 5.0) - time.toJD();

        let l = (13.1763966 * D + Moon.l0) % 360,
            Mm = (l - 0.1114041 * D - Moon.P0) % 360,
            N = (Moon.N0 - 0.0529539 * D) % 360;


    }

}
class Orbit extends TwoLineElement {

    /**
     * Orbit implementation. Kepler problem solver.
     *
     * @param name
     * @param line1
     * @param line2
     */
    constructor(name, line1, line2) {
        super(name, line1, line2);
    }

    static mu() {
        return 3.986004418E14;
    }

    /**
     * Length of Semi major axis in kilometers.
     *
     * @constructor
     */
    get a() {
        let mu = 398600,
            n  = (this.n * 2 * Math.PI / (24 * 3600)),
            a3 = mu / Math.pow(n, 2),
            a  = Math.cbrt(a3);

        return a;
    }

    /**
     * Semi minor axis
     *
     * @returns {number}
     */
    get b() {
        let a = this.a,
            e = this.e,
            b = a * Math.sqrt((1 - Math.pow(e, 2)));

        return b;
    }

    /**
     * Distance from center to foci
     *
     * @returns {number}
     */
    get c() {
        let a = this.a,
            b = this.b,
            c = Math.sqrt(Math.pow(a, 2) - Math.pow(b, 2));

        return c;
    }

    /**
     * Semi latus rectum ℓ
     *
     * @returns {number}
     */
    get ℓ() {
        let a = this.a,
            e = this.e,
            l = a * (1 - Math.pow(e, 2));

        return l;
    }

    /**
     * Apoapsis radius
     *
     * @returns {number}
     */
    get Ra() {
        let a  = this.a,
            e  = this.e,
            Ra = a * (1 + e);

        return Ra;
    }

    /**
     * Periapsis radius
     *
     * @returns {number}
     */
    get Rp() {
        let a  = this.a,
            e  = this.e,
            Rp = a * (1 - e);

        return Rp;
    }

    /**
     * Velocity
     *
     * @param r
     * @returns {number}
     */
    v(r) {
        let mu = Earth.M.toNumeric('kg') * Astro.G,
            a  = this.a,
            v  = Math.sqrt(((2 * mu) / r) - (mu / a));

        return v;
    }

    /**
     * Flight path angle
     *
     * @returns {number}
     */
    γ() {
        let e = this.e,
            ν = this.ν,
            γ = Math.atan((e * Math.sin(ν)) / (1 + (e * Math.cos(ν))));

        return γ;
    }

    /**
     * eccentricAnomaly - E
     * Solve Kepler's equation
     * @returns {number} Eccentric anomaly in degrees
     */
    get E() {
        let precision    = 8,
            m            = 2.0 * Math.PI * (this.M / 360.0 - Math.floor(this.M / 360.0)),
            Δ            = Math.pow(10, -precision),
            E            = this.e < 0.8 ? m : Math.PI,
            F            = E - this.e * Math.sin(m) - m,
            maxIteration = 30,
            i            = 0;

        while ((Math.abs(F) > Δ) && (i < maxIteration)) {
            E = E - F / (1.0 - this.e * Math.cos(E));
            F = E - this.e * Math.sin(E) - m;

            i++;
        }

        return Math.round(E.toDegrees() * Math.pow(10, precision)) / Math.pow(10, precision);
    }

    /**
     * trueAnomaly ν
     *
     * @returns {number} True anomaly in degrees
     */
    get ν() {
        let precision = 8,
            E         = this.E.toRadians(),
            fak       = Math.sqrt(1.0 - Math.pow(this.e, 2)),
            ν         = Math.atan2(fak * Math.sin(E), Math.cos(E) - this.e).toDegrees();

        return Math.round(ν * Math.pow(10, precision)) / Math.pow(10, precision);

    }

    /**
     * Recalculate Mean anomaly M, for given time if mean anomaly at epoch M0 is known.
     *
     * @param time
     * @returns {*}
     */
    calcM(time) {
        var date = moment(time);
        var ΔT   = parseInt(moment.duration(date.diff(this.epoch)).asSeconds()) / this.T;

        let M0 = this.M0,
            n  = this.n,
            M  = M0 + n * ΔT;

        this.M = M;

        return M;
    }

    // ToDo: time of periapsis passage

    /**
     * Area A1 = ab / 2 (E - e sin(E))
     *
     */
    funct() {
        let E  = this.E,
            a  = this.a,
            b  = this.b,
            e  = this.e,
            A1 = a * b / 2 * (E - e * Math.sin(E));

    }

}
class Sun extends Orbit {

    /**
     * @constructor
     *
     * http://nssdc.gsfc.nasa.gov/planetary/factsheet/sunfact.html
     */
    constructor() {
        super();
    }

    /**
     * Ecliptic longitude at epoch 2010.0
     *
     * @returns {Unit}
     */
    static get εg0() {
        return math.unit(279.557208, 'deg');
    }

    /**
     * Ecliptic longitude of perigee at epoch 2010.0
     *
     * @returns {Unit}
     */
    static get ϖg0() {
        return math.unit(283.112438, 'deg');
    }

    /**
     * Eccentricity of orbit at epoch 2010.0
     *
     * @returns {Number}
     */
    static get e0() {
        return 0.016705;
    }

    /**
     * Semi major axis of Sun Earth orbit
     *
     * @type {Unit}
     */
    static get r0() {
        return math.unit(1.495985e8, 'km');
    }

    /**
     * Routine calculates position and distance of Sun. Distance is expressed in kilometers.
     *
     * @param {Date} time
     */
    position(time) {
        // julian centuries since 1900 January 0.5
        let JD = time.toJD(),

            T  = (JD - Date.J1900) / 36525,

            // ecliptic longitude (degrees)
            εg = (279.6966778 + (36000.76892 * T) + (0.0003025 * Math.pow(T, 2)) % 360),

            // ecliptic longitude of perigee (degrees)
            ϖg = (281.2208444 + (1.719175 * T) + (0.000452778 * Math.pow(T, 2)) % 360),

            // eccentricity of Sun - Earth orbit
            e  = 0.01675104 - (0.0000418 * T) - (0.000000126 * Math.pow(T, 2)),

            // mean anomaly
            M  = εg - ϖg;

        // calculate true anomaly
        this.M = M;
        this.e = e;
        let ν  = this.ν,
            f  = (1 + e * Math.cos(ν)) / (1 - Math.pow(e, 2)),

            // distance
            Δ  = Sun.r0.toNumeric('km') / f,

            // geocentric ecliptic longitude
            λ  = ν + ϖg,

            // geocentric ecliptic latitude
            β  = 0;

        if (ν < 0) ν += 360;
        if (λ > 360) λ -= 360;

        return new Ecliptic(λ, β, Δ);
    }

    /**
     * Routine calculates
     */
    times(time) {
        let position = this.position(time).toEquatorial();

    }

}


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
/**
 * Implementation of The World Geodetic System (WGS84)
 *
 * @see https://confluence.qps.nl/pages/viewpage.action?pageId=29855173
 */
class WGS84 {

    /**
     * Semi-major Axis expressed in meters [m]
     *
     * @returns {number}
     */
    static get a() {
        return math.unit(6378137.0, 'm');
    }

    /**
     * Flattening Factor of the Earth
     *
     * @returns {number}
     */
    static get f() {
        return 1 / 298.257223563;
    }

    /**
     * Nominal Mean Angular Velocity expressed in radians per second [rad/s]
     *
     * @returns {number}
     */
    static get ω() {
        return math.unit(7292115e-11, 'rad/s');
    }

    /**
     * Geocentric Gravitational Constant GM or μ expressed in cube meters per square seconds [m^3/s^2]
     *
     * @returns {number}
     */
    static get μ() {
        return math.unit(3986004.418E8, 'm^3/s^2');
    }

}
//# sourceMappingURL=astrobasic-1.1.js.map
