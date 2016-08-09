/**
 * Perifocal geocentric cartesian coordiante system.
 *
 * @see https://en.wikipedia.org/wiki/Perifocal_coordinate_system
 */
class Perifocal {

    /**
     * @constructor
     *
     * @param p Vector directed towards periapsis.
     * @param k Vector having true anomaly 90 degrees passed periapsis.
     * @param w Angular momentum vector directed orthogonal to plane of orbit (w = p x q).
     */
    constructor(p, k, w) {
        this.p = p;
        this.k = k;
        this.w = w;
    }

}