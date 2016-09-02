/**
 * Geographic coordinate system.
 *
 * http://www.movable-type.co.uk/scripts/latlong.html
 *
 * PLEASE NOTE: Charts used in ocean navigation often use the OPPOSITE notation λ for LONGITUDE and φ for
 * LATITUDE. The convention followed here resembles the one used by mathematicians in 3 dimensions for spherical
 * polar coordinates.
 */
class Geographic {

    /**
     * @constructor
     *
     * @param latitude λ [degrees]
     * @param longitude φ [degrees]
     * @param altitude h [degrees]
     */
    constructor(latitude, longitude, altitude = 0) {
        this.λ = latitude;
        this.φ = longitude;
        this.h = altitude;
    }

    /**
     * Latitude
     *
     * @returns {Number} [degrees]
     */
    get latitude() {
        return this.λ;
    }

    /**
     * Longitude
     *
     * @returns {Number} [degrees]
     */
    get longitude() {
        return this.φ;
    }

    /**
     * Transforms Geographic object to google maps LatLng object.
     *
     * @returns {LatLng}
     */
    toGoogleMap() {
        if (typeof google != 'undefined' && typeof google.maps != 'undefined') {
            return new google.maps.LatLng(parseFloat(this.λ), parseFloat(this.φ));
        }
    }

    /**
     * Returns bearing between two geographic points.
     *
     * @param {Geographic} geographic
     * @returns {Number} [degrees]
     */
    bearingTo(geographic) {
        let λ1 = this.latitude,
            φ1 = this.longitude,
            λ2 = geographic.latitude,
            φ2 = geographic.longitude,
            Δφ = φ2 - φ1,
            y  = Math.sin(Δφ) * Math.cos(λ2),
            x  = Math.cos(λ1) * Math.sin(λ2) - Math.sin(λ1) * Math.cos(λ2) * Math.cos(Δφ),
            θ  = Math.atan2(y, x);

        return θ.toDegrees();
    }

    /**
     * Returns distance expressed in meters between two geographic points (Haverstine).
     * @see http://www.movable-type.co.uk/scripts/latlong.html
     *
     * @param {Geographic} geographic
     * @returns {number}
     */
    distanceHaverstine(geographic) {
        if (!(geographic instanceof Geographic)) throw new Error('Point is not Geographic object');

        let R  = Earth.R.toNumber(),
            λ1 = this.latitude.toRadians(),
            φ1 = this.longitude.toRadians(),
            λ2 = geographic.latitude.toRadians(),
            φ2 = geographic.longitude.toRadians(),
            Δλ = λ2 - λ1,
            Δφ = φ2 - φ1,

            a  = Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
                + Math.cos(λ1) * Math.cos(λ2)
                * Math.sin(Δφ / 2) * Math.sin(Δφ / 2),
            c  = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)),
            d  = R * c;

        return d;
    }

    /**
     * Returns distance expressed in meters between two geographic points (Vincenty).
     * @see https://gist.github.com/dotMorten/067cb50d86ece1c47e77
     *
     * @param geographic
     * @returns {number}
     */
    distanceVincenty(geographic) {
        var a     = WGS84.a,
            b     = WSG84.b,
            f     = WSG84.f,
            L     = (geographic.longitude - this.longitude).toRadians(),
            U1    = Math.atan((1 - f) * Math.tan(this.longitude.toRadians())),
            U2    = Math.atan((1 - f) * Math.tan(geographic.longitude.toRadians())),
            sinU1 = Math.sin(U1),
            cosU1 = Math.cos(U1),
            sinU2 = Math.sin(U2),
            cosU2 = Math.cos(U2),
            λ     = L,
            λP,
            cosσ, cosSqα, sinσ, cos2σM, σ, sinλ, cosλ, sinα;

        var iMax = 100;
        do {
            sinλ = Math.sin(λ);
            cosλ = Math.cos(λ);
            sinσ = Math.sqrt((cosU2 * sinλ) * (cosU2 * sinλ) + (cosU1 * sinU2 - sinU1 * cosU2 * cosλ) * (cosU1 * sinU2 - sinU1 * cosU2 * cosλ));

            if (sinσ == 0) {
                return 0;
            }

            cosσ   = sinU1 * sinU2 + cosU1 * cosU2 * cosλ;
            σ      = Math.atan2(sinσ, cosσ);
            sinα   = cosU1 * cosU2 * sinλ / sinσ;
            cosSqα = 1 - sinα * sinα;
            cos2σM = cosσ - 2 * sinU1 * sinU2 / cosSqα;
            if (Number.isNaN(cos2σM)) {
                cos2σM = 0;  // equatorial line: cosSqα=0
            }

            var C = f / 16 * cosSqα * (4 + f * (4 - 3 * cosSqα));
            λP    = λ;
            λ     = L + (1 - C) * f * sinα * (σ + C * sinσ * (cos2σM + C * cosσ * (-1 + 2 * cos2σM * cos2σM)));
        } while (Math.abs(λ - λP) > 1e-12 && --iMax > 0);

        if (iMax == 0) { // formula failed to converge
            return NaN;
        }

        var uSq = cosSqα * (a * a - b * b) / (b * b),
            A   = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq))),
            B   = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq))),
            Δσ  = B * sinσ * (cos2σM + B / 4 * (cosσ * (-1 + 2 * cos2σM * cos2σM) - B / 6 * cos2σM * (-3 + 4 * sinσ * sinσ) * (-3 + 4 * cos2σM * cos2σM))),
            d   = b * A * (σ - Δσ);

        return d;
    }

    /**
     * Transforms geographic coordinates to equatorial geocentric cartesian coordinates at given time.
     *
     * @param time
     * @returns {Cartesian}
     */
    toCartesian(time) {
        let λ    = this.λ,
            φ    = this.φ,
            lst  = time.toGMST() * 15 + φ,
            f    = math.number(WGS84.f),
            a    = WGS84.a.toNumeric('km'),
            sinλ = Math.sin(λ.toRadians()),
            c    = 1 / Math.sqrt(1 + f * (f - 2) * Math.pow(sinλ, 2)),
            s    = Math.pow((1 - f), 2) * c,
            x    = a * c * Math.cos(λ.toRadians()) * Math.cos(lst.toRadians()),
            y    = a * c * Math.cos(λ.toRadians()) * Math.sin(lst.toRadians()),
            z    = a * s * Math.sin(λ.toRadians());

        return new Cartesian(x, y, z);
    }

}