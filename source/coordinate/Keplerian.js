class Keplerian {

    /**
     * Keplerian (classic orbital) elements.
     *
     * @param e Eccentricity [degrees]
     * @param a Semi major axis [length]
     * @param i Inclination [degrees]
     * @param Ω Right ascension of ascending node [degrees]
     * @param ω Argument of perigee [degrees]
     * @param ν True anomaly [degrees]
     */
    constructor(e, a, i, Ω, ω, ν) {
        this.e = e;
        this.a = a;
        this.i = i;
        this.Ω = Ω;
        this.ω = ω;
        this.ν = ν;
    }

    /**
     * Transforms Keplerian elements to perifocal coordinates.
     *
     * @returns {Perifocal}
     */
    toPerifocal() {
        let e = this.e.toRadians(),
            a = this.a.toRadians(),
            i = this.i.toRadians(),
            Ω = this.Ω.toRadians(),
            ω = this.ω.toRadians(),
            ν = this.ν.toRadians();

        let pi = Math.cos(Ω) * Math.cos(ω) - Math.sin(Ω) * Math.cos(i) * Math.sin(ω),
            pj = Math.sin(Ω) * Math.cos(ω) + Math.cos(Ω) * Math.cos(i) * Math.sin(ω),
            pk = Math.sin(i) * Math.sin(ω);

        let qi = -Math.cos(Ω) * Math.sin(ω) - Math.sin(Ω) * Math.cos(i) * Math.cos(ω),
            qj = -Math.sin(Ω) * Math.sin(ω) + Math.cos(Ω) * Math.cos(i) * Math.cos(ω),
            qk = Math.sin(i) * Math.cos(ω);

        let wi = Math.sin(i) * Math.sin(Ω),
            wj = -Math.sin(i) * Math.cos(Ω),
            wk = Math.cos(i);

        let p = pi + pj + pk,
            q = qi + qj + qk,
            w = wi + wj + wk;

        return new Perifocal(p, q, w);
    }

    /**
     * Transforms Keplerian elements to heliocentric ecliptic cartesian coordinate system.
     *
     * @see http://aa.quae.nl/en/reken/hemelpositie.html 1.4
     * @return {Heliocentric}
     */
    toHeliocentric() {
        let e = this.e,
            a = this.a,
            i = this.i,
            Ω = this.Ω,
            ω = this.ω,
            ν = this.ν,
            r = (a * (1 - Math.pow(e))) / (1 + e * Math.cos(ν)),
            x = r * (Math.cos(Ω) * Math.cos(ω + ν) - Math.sin(Ω) * math.cos(i) * Math.sin(ω + ν)),
            y = r * (Math.sin(Ω) * cos(ω + ν) + cos(Ω) * Math.cos(i) * Math.sin(ω + ν)),
            z = r * Math.sin(i) * Math.sin(ω + ν);

        new Heliocentric(x, y, z);
    }

}