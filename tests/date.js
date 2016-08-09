describe('Astro', function () {

    it('should convert radians to degrees', function () {
        var value = Math.PI;
        expect(value.toDegrees()).toBe(180);
    });

    it('should convert degrees to radians', function () {
        var value = 180;
        expect(value.toRadians()).toBe(Math.PI);
    });

    it('should convert hours, minutes, seconds to decimal hours', function () {
        var value = '18h 31m 27s';
        expect(value.toDec().toPrecision(8)).toBe('18.524167');
    });

    it('should convert decimal hours to hours, minutes, seconds', function () {
        var value = 18.524167;
        expect(value.toHMS()).toBe('18h 31m 27s');
    });

    it('should convert tle date format to date', function () {
        var year = 2016,
            fraction = 45.08461514,
            date = new Date(2016, 2, 14, 2, 1, 50),
            date2 = TwoLineElement.epoch2Date(year, fraction);

        expect(date2.toUTCString()).toBe(date.toUTCString());
    });

});

describe('Date', function () {

    it('should convert to Julian date', function () {
        let date;

        date = new Date("June 19 2009 18:00:00");
        expect(date.toJD()).toBe(2455002.25);

        date = new Date("June 19 2009 18:30:30");
        expect(date.toJD()).toBe(2455002.2711805557);

        expect(Date.fromJD(2455002.2711805557).toDateString()).toBe(date.toDateString());
    });

    it('should convert from Julian date', function () {
        date = new Date("June 19 2009 18:30:52");
        expect(Date.fromJD(2455002.2711805557).toDateString()).toBe(date.toDateString());
    });

    it('should convert Date to Greenwich sidereal time ', function () {
        date = new Date("April 22 1980 14:36:52");
        expect(date.toGST().toDateString()).toBe(date.toDateString());
    });

});

