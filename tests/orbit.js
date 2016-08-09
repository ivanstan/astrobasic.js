describe('Orbit', function () {

    it('should calculate true anomaly', function () {
        let orbit = new Orbit();
        orbit.e = 0.5;
        orbit.M = 27;

        expect(orbit.ν).toBe(75.83971718);
    });

    it('should solve Kepler equation (Eccentric anomaly)', function () {
        let orbit = new Orbit();
        orbit.e = 0.5;
        orbit.M = 27;

        expect(orbit.E).toBe(48.43417991);
    });

});