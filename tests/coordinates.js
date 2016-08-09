describe('Coordinates', function () {

    it('should calculate obliquity of ecliptic', function () {
        expect(Ecliptic.obliquity(2455018.5)).toBe(23.43805531);
    });

    it('should convert from ecliptic to equatorial', function () {
        var λ        = 139.686111,
            β        = 4.875278,
            ε        = 23.438055,
            ecliptic = new Ecliptic(λ, β);

        ecliptic.ε     = ε;
        var equatorial = ecliptic.toEquatorial();

        expect(equatorial.α).toBe(143.72217252363424);
        expect(equatorial.δ).toBe(19.535003195629777);
    });
});