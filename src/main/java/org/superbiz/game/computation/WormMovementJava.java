package org.superbiz.game.computation;

public class WormMovementJava {
    private static final float PI_HALF = (float) (Math.PI / 2);
    private static final float PI_DOUBLE = (float) (Math.PI * 2);

    public float withinPiBounds(float angle) {
        return angle < 0.0 ? angle + PI_DOUBLE :
                angle >= PI_DOUBLE ? angle - PI_DOUBLE : angle;
    }
}
