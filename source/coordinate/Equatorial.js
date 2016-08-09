class Equatorial {

    /**
     * Equatorial geocentric polar coordinate system.
     *
     * @param α Right ascension [degrees]
     * @param δ Declination [degrees]
     * @param Δ Distance [length unit]
     */
    constructor(α, δ, Δ = 0) {
        this.α = α;
        this.δ = δ;
        this.Δ = Δ;
    }

    get rightAscension() {
        return this.α;
    }

    get declination() {
        return this.δ;
    }

    get distance() {
        return this.Δ;
    }

    /**
     * Transforms equatorial geocentric polar coordinates to equatorial geocentric cartesian coordinates.
     *
     * @returns {Cartesian}
     */
    toCartesian() {
        let x = this.Δ * Math.cos(this.δ.toRadians()) * Math.cos(this.α.toRadians()),
            y = this.Δ * Math.cos(this.δ.toRadians()) * Math.sin(this.α.toRadians()),
            z = this.Δ * Math.sin(this.δ.toRadians());

        return new Cartesian(x, y, z);
    }

}