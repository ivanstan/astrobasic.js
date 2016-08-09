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