class Horizontal {

    /**
     * Horizontal topocentric coordinate system.
     *
     * @param A Azimuth [degrees]
     * @param a Altitude [degrees]
     */
    constructor(A, a) {
        this.A = A;
        this.a = a;
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

}