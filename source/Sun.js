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

