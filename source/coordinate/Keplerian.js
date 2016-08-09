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
        let pi = Math.cos(this.Ω) * Math.cos(this.ω) - Math.sin(this.Ω) * Math.cos(this.i) * Math.sin(this.ω),
            pj = Math.sin(this.Ω) * Math.cos(this.ω) + Math.cos(this.Ω) * Math.cos(this.i) * Math.sin(this.ω),
            pk = Math.sin(this.i) * Math.sin(this.ω);

        let qi = -Math.cos(this.Ω) * Math.sin(this.ω) - Math.sin(this.Ω) * Math.cos(this.i) * Math.cos(this.ω),
            qj = -Math.sin(this.Ω) * Math.sin(this.ω) + Math.cos(this.Ω) * Math.cos(this.i) * Math.cos(this.ω),
            qk = Math.sin(this.i) * Math.cos(this.ω);

        let wi = Math.sin(this.i) * Math.sin(this.Ω),
            wj = -Math.sin(this.i) * Math.cos(this.Ω),
            wk = Math.cos(this.i);

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