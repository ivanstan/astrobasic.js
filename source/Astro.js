class Astro {

    static get G() {
        return 6.674E-11;
    }

    static rightAscension2hourAngle(α, time) {
        let UT = α.toDec(),
            GST = time.toGST();

        console.log(GST);
    }

}