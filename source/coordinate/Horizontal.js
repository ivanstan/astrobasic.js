class Horizontal {

    /**
     * Horizontal topocentric coordinate system.
     *
     * @param A Azimuth [degrees]
     * @param a Altitude [degrees]
     * @param Δ Distance [Unit]
     */
    constructor(A, a, Δ = 0) {
        this.A = A;
        this.a = a;
        this.Δ = Δ;
    }

    /**
     * Returns azimuth.
     *
     * @returns {Number} [degrees]
     */
    get azimuth() {
        return this.A;
    }

    /**
     * Returns altitude.
     *
     * @returns {Number} [degrees]
     */
    get altitude() {
        return this.a;
    }

    /**
     * Returns distance.
     *
     * @returns {Number}
     */
    get distance() {
        return this.Δ;
    }

}