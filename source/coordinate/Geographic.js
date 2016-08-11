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
            y = Math.sin(Δφ) * Math.cos(λ2),
            x = Math.cos(λ1) * Math.sin(λ2) - Math.sin(λ1) * Math.cos(λ2) * Math.cos(Δφ),
            θ = Math.atan2(y, x);

        return θ.toDegrees();
    }

    /**
     * Returns distance expressed in meters between two geographic points (Haverstine).
     * @see http://www.movable-type.co.uk/scripts/latlong.html
     *
     * @param {Geographic} geographic
     * @returns {number}
     */
    distanceTo(geographic) {
        if (!(geographic instanceof Geographic)) throw new Error('Point is not Geographic object');

        let R = Earth.R.toNumber(),
            λ1 = this.latitude.toRadians(),
            φ1 = this.longitude.toRadians(),
            λ2 = geographic.latitude.toRadians(),
            φ2 = geographic.longitude.toRadians(),
            Δλ = λ2 - λ1,
            Δφ = φ2 - φ1,

            a = Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
                + Math.cos(λ1) * Math.cos(λ2)
                * Math.sin(Δφ / 2) * Math.sin(Δφ / 2),
            c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)),
            d = R * c;

        return d;
    }

    /**
     * Transforms geographic coordinates to equatorial geocentric cartesian coordinates at given time.
     *
     * @param time
     * @returns {Cartesian}
     */
    toCartesian(time) {
        let λ = this.λ,
            φ = this.φ,
            lst = time.toGMST() * 15 + φ,
            f = math.number(WGS84.f),
            a = WGS84.a.toNumeric('km'),
            sinλ = Math.sin(λ.toRadians()),
            c = 1 / Math.sqrt(1 + f * (f - 2) * Math.pow(sinλ, 2)),
            s = Math.pow((1 - f), 2) * c,
            x = a * c * Math.cos(λ.toRadians()) * Math.cos(lst.toRadians()),
            y = a * c * Math.cos(λ.toRadians()) * Math.sin(lst.toRadians()),
            z = a * s * Math.sin(λ.toRadians());

        return new Cartesian(x, y, z);
    }

}