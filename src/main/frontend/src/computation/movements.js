let PI_HALF = Math.PI / 2;
let PI_DOUBLE = Math.PI * 2;

if (typeof module == 'undefined') {
    var module = {exports: {}}
}

function withinPiBounds(angle) {
    return angle < 0.0 ? angle + PI_DOUBLE :
        angle >= PI_DOUBLE ? angle - PI_DOUBLE : angle;
}

module.exports.withinPiBounds = withinPiBounds;

module.exports.move = function(orientation, distance, parts) {
    const resultParts = JSON.parse(JSON.stringify(parts));
    let illegalMove = false;

    // const xStep = Math.cos(angle) * distance;
    // const yStep = Math.sin(angle) * distance;
    const frontPart = resultParts[0];
    const axisHalfLength = frontPart.axisHalfLength * frontPart.scale;

    const frontOrientationCos = Math.cos(frontPart.orientation);
    const frontOrientationSin = Math.sin(frontPart.orientation);

    const frontAxisRatio = frontPart.frontAxis * axisHalfLength;
    const frontAxisCentre = {x: frontAxisRatio * frontOrientationCos + frontPart.x,
        y: frontAxisRatio * frontOrientationSin + frontPart.y};

    const rearAxisRatio = frontPart.rearAxis * axisHalfLength;
    const rearAxisCentre = {x: rearAxisRatio * frontOrientationCos + frontPart.x,
        y: rearAxisRatio * frontOrientationSin + frontPart.y};

    // naves
    if (parts.length >= 2 && distance > 0) {
        orientation = allowedAngle(orientation, parts[1].orientation, Math.PI / 2 * 1.28);
        // if (or2 != orientation) {
        //     console.info(or2, orientation, parts[0].orientation, parts[1].orientation);
        // }
    }

    const xStep = Math.cos(orientation) * distance;
    const yStep = Math.sin(orientation) * distance;

    const newFrontAxisCentre = {x: frontAxisCentre.x + xStep,
        y: frontAxisCentre.y + yStep
    };

    const xDiff = newFrontAxisCentre.x - rearAxisCentre.x, yDiff = newFrontAxisCentre.y - rearAxisCentre.y;
    let angleDiff = -Math.atan2(xDiff, yDiff) + PI_HALF;
    if (angleDiff < 0) {
        angleDiff += PI_DOUBLE;
    }

    //const axesDistance = (frontPart.frontAxis - frontPart.rearAxis) * axisHalfLength;
    // const newRearAxisCentre = {x: newFrontAxisCentre.x - Math.cos(angleDiff) * axesDistance,
    //     y: newFrontAxisCentre.y - Math.sin(angleDiff) * axesDistance};

    const newPartCentre = {x: newFrontAxisCentre.x - Math.cos(angleDiff) * frontAxisRatio,
        y: newFrontAxisCentre.y - Math.sin(angleDiff) * frontAxisRatio};

    //[{"axisHalfLength":100,"orientation":0,"frontAxis":0.8,"rearAxis":-0.6,"x":0,"y":0}]
    frontPart.x = newPartCentre.x;
    frontPart.y = newPartCentre.y;
    frontPart.orientation = angleDiff;

    for (let index = 1; index < resultParts.length; index++) {
        const previousPart = resultParts[index - 1];
        const trailingPart = resultParts[index];
        const axisHalfLength = trailingPart.axisHalfLength * trailingPart.scale;

        const previousRearAxisRatio = previousPart.rearAxis * previousPart.axisHalfLength * previousPart.scale;
        //console.info(rearAxisRatio);
        const frontAxisCentre = {x: previousPart.x + Math.cos(previousPart.orientation) * previousRearAxisRatio,
            y: previousPart.y + Math.sin(previousPart.orientation) * previousRearAxisRatio};
        // console.info(JSON.stringify(previousPart));
        //console.info(JSON.stringify(frontAxisCentre));

        const trailingOrientationCos = Math.cos(trailingPart.orientation);
        const trailingOrientationSin = Math.sin(trailingPart.orientation);

        const frontAxisRatio = trailingPart.frontAxis * axisHalfLength;
        const rearAxisRatio = trailingPart.rearAxis * axisHalfLength;
        const rearAxisCentre = {x: rearAxisRatio * trailingOrientationCos + trailingPart.x,
            y: rearAxisRatio * trailingOrientationSin + trailingPart.y};
        //console.info(JSON.stringify(rearAxisCentre));

        const xDiff = frontAxisCentre.x - rearAxisCentre.x, yDiff = frontAxisCentre.y - rearAxisCentre.y;
        let angleDiff = -Math.atan2(xDiff, yDiff) + PI_HALF;
        if (angleDiff < 0) {
            angleDiff += PI_DOUBLE;
        }

        const newPartCentre = {x: frontAxisCentre.x - Math.cos(angleDiff) * frontAxisRatio,
            y: frontAxisCentre.y - Math.sin(angleDiff) * frontAxisRatio};

        //[{"axisHalfLength":100,"orientation":0,"frontAxis":0.8,"rearAxis":-0.6,"x":0,"y":0}]
        trailingPart.x = newPartCentre.x;
        trailingPart.y = newPartCentre.y;
        trailingPart.orientation = angleDiff;

        const legalAngle = allowedAngle(previousPart.orientation, trailingPart.orientation, Math.PI / 2);
        if (legalAngle != previousPart.orientation && distance < 0) {
            illegalMove = true;
        }
    }

    // const calculationSteps = {
    //     frontAxisRatio,
    //     frontAxisCentre,
    //     rearAxisRatio,
    //     rearAxisCentre,
    //     newFrontAxisCentre,
    //     newRearAxisCentre,
    //     newPartCentre
    // };
    // console.info(calculationSteps);

    return illegalMove ? parts : resultParts;
}
//     // returns path, xStep, yStep
//     const path = JSON.parse(JSON.stringify(snakePath));
//
//     const xStep = Math.cos(angle) * distance;
//     const yStep = Math.sin(angle) * distance;
//
//     //console.info(`angle: ${angle}, speed: ${speed}, xStep: ${xStep}, y_step: ${y_step}`);
//
//     const head = path[0];
//     head.x += xStep;
//     head.y += yStep;
//     head.r = angle;
//
//     //console.info(JSON.stringify(path));
//
//     for (let index = 0; index < path.length - 1; index++) {
//         const previous = path[index], current = path[index + 1];
//         const xDiff = previous.x - current.x, yDiff = previous.y - current.y;
//         let angleDiff = -Math.atan2(xDiff, yDiff) + PI_HALF;
//         if (angleDiff < 0) {
//             angleDiff += PI_DOUBLE;
//         }
//         current.x = previous.x - Math.cos(angleDiff) * partDistance;
//         current.y = previous.y - Math.sin(angleDiff) * partDistance;
//         current.r = angleDiff;
//     }
//
//     return {path: path, x: path[0].x, y: path[0].y};
//     //return {path: path, x: xStep, y: yStep};
// };

function allowedAngle(askedAngle, lastAngle/*orientation*/, wheelDeflection) {
    //let allowedDiff = Math.PI / 4200 * time * speed / baseSpeed;

    const allowedDiff = wheelDeflection;
    const lower = lastAngle - allowedDiff;
    const upper = lastAngle + allowedDiff;
    //console.info(lower, upper, askedAngle);
    let asked2 = askedAngle - Math.PI * 2;
    let asked3 = askedAngle + Math.PI * 2;
    if ((lower <= askedAngle && upper >= askedAngle) || (lower <= asked2 && upper >= asked2) || (lower <= asked3 && upper >= asked3)) {
        return askedAngle;
    } else {
        let fromLower = Math.min(Math.abs(lower - askedAngle), Math.abs(lower - asked2), Math.abs(lower - asked3));
        let fromUpper = Math.min(Math.abs(upper - askedAngle), Math.abs(upper - asked2), Math.abs(upper - asked3))
        if (fromLower < fromUpper) {
            return withinPiBounds(lower);
        } else {
            return withinPiBounds(upper);
        }
    }
}
module.exports.allowedAngle = allowedAngle;

module.exports.computeAllowedAngle = function(orientationRequested, orientationLast, time, speedMultiplier) {
    let allowedDiff = Math.PI / 4200 * time * speedMultiplier;
    let lower = orientationLast - allowedDiff;
    let upper = orientationLast + allowedDiff;
    //console.info(lower, upper, askedAngle);
    let asked2 = orientationRequested - Math.PI * 2;
    let asked3 = orientationRequested + Math.PI * 2;
    //gameContext.gameInfo.message.text = `lower: ${lower.toFixed(2)}, upper: ${upper.toFixed(2)}, asked: ${askedAngle.toFixed(2)}, a2: ${asked2.toFixed(2)}, a3: ${asked3.toFixed(2)}`;
    if ((lower <= orientationRequested && upper >= orientationRequested) || (lower <= asked2 && upper >= asked2) || (lower <= asked3 && upper >= asked3)) {
        return orientationRequested;
    } else {
        let fromLower = Math.min(Math.abs(lower - orientationRequested), Math.abs(lower - asked2), Math.abs(lower - asked3));
        let fromUpper = Math.min(Math.abs(upper - orientationRequested), Math.abs(upper - asked2), Math.abs(upper - asked3))
        //gameContext.gameInfo.message.text = `fromLower: ${fromLower.toFixed(2)}, fromUpper: ${fromUpper.toFixed(2)}`;
        if (fromLower < fromUpper) {
            return withinPiBounds(lower);
        } else {
            return withinPiBounds(upper);
        }
    }
    // let lower = Controls.withinPiBounds(lastAngle - allowedDiff);
    // let upper = Controls.withinPiBounds(lastAngle + allowedDiff);
    // if (lower < upper) {
    //     if (lower <= askedAngle && upper >= askedAngle) {
    //         return askedAngle;
    //     } else {
    //
    //     }
    // } else {
    //
    // }
}

function moveJava(jsonArgs) {
    const args = JSON.parse(jsonArgs);
    // orientation, distance, parts
    const result = module.exports.move(args.orientation, args.distance, args.parts);
    return JSON.stringify({parts: result});
};

//orientationRequested, orientationLast, time, speedMultiplier
function computeAllowedAngleJava(jsonArgs) {
    const args = JSON.parse(jsonArgs);
    const result = module.exports.computeAllowedAngle(args.orientationRequested, args.orientationLast, args.time, args.speedMultiplier);
    return JSON.stringify(result);
};
