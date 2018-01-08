let expect = require("chai").expect;
let rgbColor = require("../src/computation/rgbColor");

describe("Color RGB Dimmer", () => {
    describe("RGB to Hex conversion", () => {
        it("converts the white color", () => {
            const white80 = rgbColor.rgbDimmer(0xffffff, 0.8);
            expect(white80).to.equal(0xcccccc);
        });

        it("converts complex color", () => {
            const complex80 = rgbColor.rgbDimmer(0xfaff98, 0.8);
            expect(complex80).to.equal(0xC8CC79);
        });

        it("converts the white color", () => {
            const white105 = rgbColor.rgbDimmer(0xffffff, 1.05);
            expect(white105).to.equal(0xffffff);
        });
    });
});
