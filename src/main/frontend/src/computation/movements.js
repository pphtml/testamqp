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

// module.exports.moveSnake = function(snakePath, angle, distance, partDistance) {
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

module.exports.computeAllowedAngle = function(askedAngle, lastAngle, time, baseSpeed, speed) {
    let allowedDiff = Math.PI / 4200 * time * speed / baseSpeed;
    let lower = lastAngle - allowedDiff;
    let upper = lastAngle + allowedDiff;
    //console.info(lower, upper, askedAngle);
    let asked2 = askedAngle - Math.PI * 2;
    let asked3 = askedAngle + Math.PI * 2;
    //gameContext.gameInfo.message.text = `lower: ${lower.toFixed(2)}, upper: ${upper.toFixed(2)}, asked: ${askedAngle.toFixed(2)}, a2: ${asked2.toFixed(2)}, a3: ${asked3.toFixed(2)}`;
    if ((lower <= askedAngle && upper >= askedAngle) || (lower <= asked2 && upper >= asked2) || (lower <= asked3 && upper >= asked3)) {
        return askedAngle;
    } else {
        let fromLower = Math.min(Math.abs(lower - askedAngle), Math.abs(lower - asked2), Math.abs(lower - asked3));
        let fromUpper = Math.min(Math.abs(upper - askedAngle), Math.abs(upper - asked2), Math.abs(upper - asked3))
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

// function moveSnakeJava(jsonArgs) {
//     const args = JSON.parse(jsonArgs);
//     const result = module.exports.moveSnake(args.snakePath, args.angle, args.distance, args.partDistance);
//     return JSON.stringify(result);
// };

//module.exports.computeAllowedAngle = function(askedAngle, lastAngle, time, baseSpeed, speed) {
function computeAllowedAngleJava(jsonArgs) {
    const args = JSON.parse(jsonArgs);
    const result = module.exports.computeAllowedAngle(args.askedAngle, args.lastAngle, args.time, args.baseSpeed, args.speed);
    return JSON.stringify(result);
};
