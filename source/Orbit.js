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