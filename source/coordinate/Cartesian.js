class Cartesian {

    /**
     * Equatorial geocentric cartesian coordinate system.
     *
     * @param x
     * @param y
     * @param z
     */
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * Returns length of radius vector.
     *
     * @returns {number}
     */
    getRadius() {
        let R = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));

        return R;
    }

    /**
     * Transforms equatorial geocentric cartesian coordinates to geographic coordinates.
     *
     * @param time
     * @returns {Geographic}
     */
    toGeographic(time) {
        let x   = this.x,
            y   = this.y,
            z   = this.z,
            f   = math.number(WGS84.f),
            a   = WGS84.a.toNumeric('km'),
            lst = time.toGMST() * 15,
            r   = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)),
            φ   = Math.atan2(y, x).toDegrees() - lst;

        if (φ > 360) φ = φ % 360;
        if (φ < 0) φ = φ % 360 + 360;
        if (φ > 180) φ = φ - 360;

        let λ  = Math.atan2(z, r),
            e2 = f * (2 - f),
            λ1 = 0,
            c  = 1;

        do {
            λ1 = λ;

            let sinλ = Math.sin(λ1);
            c        = 1 / Math.sqrt(1 - e2 * sinλ * sinλ);

            λ = Math.atan2(z + a * c * e2 * (Math.sin(λ1)), r);
        } while (Math.abs(λ - λ1) > 0.0001);

        let h = r / Math.cos(λ) - a * c;

        return new Geographic(λ.toDegrees(), φ, h);
    }

    /**
     * Transforms equatorial geocentric cartesian coordinates to geocentric equatorial polar coordinates.
     *
     * @returns {Equatorial}
     */
    toEquatorial() {
        let Δ = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2)),
            α = Math.atan(this.y / Δ).toDegrees(),
            δ = Math.acos(this.z / Δ).toDegrees();

        return new Equatorial(α, δ, Δ);
    }

    /**
     * Transforms equatorial geocentric cartesian coordinates to topocentric polar coordinates.
     *
     * @param time
     * @param observer
     * @returns {Horizontal}
     */
    toHorizontal(time, observer) {
        let observer_cartesian = observer.toCartesian(time),
            λ                  = observer.latitude,
            φ                  = observer.longitude,
            rx0                = this.x - observer_cartesian.x,
            ry0                = this.y - observer_cartesian.y,
            rz0                = this.z - observer_cartesian.z,
            lst                = time.toGMST() * 15 + φ,
            rs                 = Math.sin(λ.toRadians()) * Math.cos(lst.toRadians()) * rx0 + Math.sin(λ.toRadians()) * Math.sin(lst.toRadians()) * ry0 - Math.cos(λ.toRadians()) * rz0,
            re                 = -Math.sin(lst.toRadians()) * rx0 + Math.cos(lst.toRadians()) * ry0,
            rz                 = Math.cos(λ.toRadians()) * Math.cos(lst.toRadians()) * rx0 + Math.cos(λ.toRadians()) * Math.sin(lst.toRadians()) * ry0 + Math.sin(λ.toRadians()) * rz0,
            range              = Math.sqrt(Math.pow(rs, 2) + Math.pow(re, 2) + Math.pow(rz, 2)),
            a                  = Math.asin(rz / range),
            A                  = Math.atan2(-re, rs);

        A = A.toRadians() + 180;
        if (A > 360) A = A % 360;

        return new Horizontal(A, a);
    }

}