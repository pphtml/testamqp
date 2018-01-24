const expect = require("chai").expect;
const move = require('../src/computation/movements').move;

describe("Movements with Trailer", () => {
    describe("Step Update Calculations", () => {
        it("move vehicle a bit to the east", () => {
            const frontPart = {
                axisHalfLength: 100,
                scale: 1.0,
                orientation: 0.0,
                frontAxis: 0.8,
                rearAxis: -0.6,
                x: 0.0,
                y: 0.0
            };
            const rearPart = {
                axisHalfLength: 100,
                scale: 1.0,
                orientation: 0.0,
                frontAxis: 0.75,
                rearAxis: -0.5,
                x: -200.0,
                y: 0.0
            };
            const orientation = 0.0;
            const distance = 1000.0;

            const movedVehicleParts = move(orientation, distance, [frontPart, rearPart]);
            //console.info(JSON.stringify(movedVehicleParts));

            //expect(distanceCheck(newPath, distance)).to.equal(true);
            expect(movedVehicleParts.length).to.equal(2);

            const frontPartResult = movedVehicleParts[0];
            expect(frontPartResult.x).to.be.closeTo(1000, 0.000001);
            expect(frontPartResult.y).to.be.closeTo(0, 0.000001);
            expect(frontPartResult.orientation).to.be.closeTo(0, 0.000001);

            const trailerPartResult = movedVehicleParts[1];
            expect(trailerPartResult.x).to.be.closeTo(865, 0.000001);
            expect(trailerPartResult.y).to.be.closeTo(0, 0.000001);
            expect(trailerPartResult.orientation).to.be.closeTo(0, 0.000001);
        });

        // it("move vehicle a bit to the west", () => {
        //     const frontPart = {
        //         axisHalfLength: 100,
        //         orientation: Math.PI,
        //         frontAxis: 0.8,
        //         rearAxis: -0.6,
        //         x: 0.0,
        //         y: 0.0
        //     };
        //     const orientation = Math.PI;
        //     const distance = 1000.0;
        //
        //     const movedVehicleParts = move(orientation, distance, [frontPart]);
        //     //console.info(JSON.stringify(movedVehicleParts));
        //
        //     //expect(distanceCheck(newPath, distance)).to.equal(true);
        //     expect(movedVehicleParts.length).to.equal(1);
        //     const frontPartResult = movedVehicleParts[0];
        //     expect(frontPartResult.x).to.be.closeTo(-1000, 0.000001);
        //     expect(frontPartResult.y).to.be.closeTo(0, 0.000001);
        //     expect(frontPartResult.orientation).to.be.closeTo(Math.PI, 0.000001);
        // });
        //
        // it("move vehicle a bit to the south", () => {
        //     const frontPart = {
        //         axisHalfLength: 100,
        //         orientation: Math.PI / 2,
        //         frontAxis: 0.8,
        //         rearAxis: -0.6,
        //         x: 0.0,
        //         y: 0.0
        //     };
        //     const orientation = Math.PI / 2;
        //     const distance = 1000.0;
        //
        //     const movedVehicleParts = move(orientation, distance, [frontPart]);
        //     //console.info(JSON.stringify(movedVehicleParts));
        //
        //     //expect(distanceCheck(newPath, distance)).to.equal(true);
        //     expect(movedVehicleParts.length).to.equal(1);
        //     const frontPartResult = movedVehicleParts[0];
        //     expect(frontPartResult.x).to.be.closeTo(0, 0.000001);
        //     expect(frontPartResult.y).to.be.closeTo(1000, 0.000001);
        //     expect(frontPartResult.orientation).to.be.closeTo(Math.PI / 2, 0.000001);
        // });
        //
        // it("move vehicle a bit to the north", () => {
        //     const frontPart = {
        //         axisHalfLength: 100,
        //         orientation: Math.PI / 2 * 3,
        //         frontAxis: 0.8,
        //         rearAxis: -0.6,
        //         x: 0.0,
        //         y: 0.0
        //     };
        //     const orientation = Math.PI / 2 * 3;
        //     const distance = 1000.0;
        //
        //     const movedVehicleParts = move(orientation, distance, [frontPart]);
        //     //console.info(JSON.stringify(movedVehicleParts));
        //
        //     //expect(distanceCheck(newPath, distance)).to.equal(true);
        //     expect(movedVehicleParts.length).to.equal(1);
        //     const frontPartResult = movedVehicleParts[0];
        //     expect(frontPartResult.x).to.be.closeTo(0, 0.000001);
        //     expect(frontPartResult.y).to.be.closeTo(-1000, 0.000001);
        //     expect(frontPartResult.orientation).to.be.closeTo(Math.PI / 2 * 3, 0.000001);
        // });
        //
        // it("move vehicle a small bit to the south-east", () => {
        //     const frontPart = {
        //         axisHalfLength: 100,
        //         orientation: 0.0,
        //         frontAxis: 0.8,
        //         rearAxis: -0.6,
        //         x: 0.0,
        //         y: 0.0
        //     };
        //     const orientation = Math.PI / 2 / 2;
        //     const distance = 10.0;
        //
        //     const movedVehicleParts = move(orientation, distance, [frontPart]);
        //     //console.info(JSON.stringify(movedVehicleParts));
        //
        //     //expect(distanceCheck(newPath, distance)).to.equal(true);
        //     expect(movedVehicleParts.length).to.equal(1);
        //     const frontPartResult = movedVehicleParts[0];
        //     expect(frontPartResult.x).to.be.closeTo(7.163372415070981, 0.000001);
        //     expect(frontPartResult.y).to.be.closeTo(3.2291651096737755, 0.000001);
        //     expect(frontPartResult.orientation).to.be.closeTo(0.04804226237391673, 0.000001);
        // });
    });
});
