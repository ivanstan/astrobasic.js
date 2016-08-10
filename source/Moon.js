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

        //ToDo: check if correct

        let D        = time.toJD(true) - (Date.J2010 - 5.0),
            sun      = new Sun(),
            ecliptic = sun.position(time),
            sunM     = sun.M.toRadians(),
            sunλ     = ecliptic.λ.toRadians(),
            l        = (13.1763966 * D + Moon.l0) % 360,
            Mm       = (l - 0.1114041 * D - Moon.P0) % 360,
            N        = (Moon.N0 - 0.0529539 * D) % 360,
            C        = l - sunλ,
            Ev       = 1.2739 * Math.sin(Number(2 * C - Mm).toRadians()),
            Ae       = 0.1858 * Math.sin(sunM),
            A3       = 0.37 * Math.sin(sunM);

        Mm = Mm + Ev - Ae - A3;

        let Ec = 6.2886 * Math.sin(Mm.toRadians()),
            A4 = 0.214 * Math.sin(2 * Mm.toRadians()),
            l1 = l + Ev + Ec - Ae + A4,
            V  = 0.6583 * Math.sin(2 * Number(l1 - sunλ).toRadians()),
            l2 = l1 + V,
            N1 = N - 0.16 * Math.sin(sunM),
            y  = Math.sin(Number(l2 - N1).toRadians()) * Math.cos(Moon.i.toNumber('rad')),
            x  = Math.cos(Number(l2 - N1).toRadians()),
            λ  = Math.atan2((Math.sin(l2 - N1) * Math.cos(Moon.i.toNumber('rad'))), (Math.cos(l2 - N1))) + N1,
            β  = Math.cos(Math.sin(l2 - N1) * Math.sin(Moon.i.toNumber('rad'))),
            Δ  = 385001 - 20905 * Math.cos(Mm.toRadians());

        return new Ecliptic(λ, β, Δ);
    }

}