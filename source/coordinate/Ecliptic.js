class Ecliptic {

    /**
     * Ecliptic coordinate system.
     *
     * @param λ longitude [degrees]
     * @param β latitude [degrees]
     * @param Δ distance [length unit]
     */
    constructor(λ, β, Δ) {
        this.ε = Ecliptic.obliquity(new Date().toJD());
        this.λ = λ;
        this.β = β;
        this.Δ = Δ;
    }

    /**
     * Calculate obliquity of ecliptic for the given Julian date.
     *
     * @param JD
     * @returns {Number}
     */
    static obliquity(JD) {
        let MJD = JD - Date.J2000,
            T = MJD / 36525.0,
            DE = 46.815 * T + (0.0006 * Math.pow(T, 2)) - (0.00181 * Math.pow(T, 3)) / 3600,
            ε = 23.439292 - DE;

        return ε;
    }

    /**
     * Route calculates nutation of longitude for given Julian date.
     *
     * @param JD
     * @returns {number}
     */
    static nutation(JD) {
        let MJD = JD - Date.J2000,
            T = MJD / 36525.0,
            ψ = 125.04452 - 1934.136261 * T + 0.0020708 * Math.pow(T, 2) + Math.pow(T, 3) / 450000;

        return ψ;
    }

    /**
     * Transforms ecliptic geocentric polar coordinates to geocentric equatorial polar coordinates.
     *
     * @returns {Equatorial}
     */
    toEquatorial() {
        let λ = this.λ.toRadians(),
            β = this.β.toRadians(),
            ε = this.ε.toRadians(),
            sinδ = Math.sin(β) * Math.cos(ε) + (Math.cos(β) * Math.sin(ε) * Math.sin(λ)),
            δ = Math.asin(sinδ).toDegrees(),
            y = Math.sin(λ) * Math.cos(ε) - Math.tan(β) * Math.sin(ε),
            x = Math.cos(λ),
            α = Math.atan2(y, x).toDegrees();

        return new Equatorial(α, δ, this.Δ);
    }

}