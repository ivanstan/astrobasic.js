describe('Sun', function () {

    it('should calculate ecliptic position of Sun', function () {
        let sun = new Sun(),
            ecliptic = sun.position(2447369.5);

        expect(ecliptic.λ).toBe(124.18695503565735);
        expect(ecliptic.β).toBe(0);
        expect(ecliptic.Δ).toBe(149323584.34674093);



    });

});