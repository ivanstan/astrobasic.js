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