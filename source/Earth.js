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