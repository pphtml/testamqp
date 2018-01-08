exports.rgbDimmer = function(base, ratio) {
    const minRatio = Math.min(ratio, 1.0);

    const red = (base & 0xff0000) >> 16;
    const green = (base & 0x00ff00) >> 8;
    const blue = base & 0x0000ff;

    const newRed = Math.floor(red * minRatio);
    const newGreen = Math.floor(green * minRatio);
    const newBlue = Math.floor(blue * minRatio);

    return newRed << 16 | newGreen << 8 | newBlue;
};
