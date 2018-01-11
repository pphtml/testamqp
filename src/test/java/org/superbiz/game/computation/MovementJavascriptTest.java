package org.superbiz.game.computation;

import org.junit.Test;
import org.superbiz.game.BaseTest;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

public class MovementJavascriptTest extends BaseTest {
    private Movement movement = new MovementJavascript();

//    @Test
//    @Ignore
//    public void moveSnake() {
//        List<Part> path = Arrays.asList(Part.create(20.0f, 10.0f, 0.0f), Part.create(30.0f, 10.0f, 0.0f));
//        MoveSnakeResult result = movement.moveSnake(path, 1.67f, 10.0f, 20.0f);
//        assertNotNull(result);
//        assertEquals(2, result.getPath().size());
//        assertEquals(-0.99041f, result.getX(), ACCEPTABLE_DELTA_FLOATS);
//        assertEquals(9.9508333f, result.getY(), ACCEPTABLE_DELTA_FLOATS);
//        final Part firstPart = result.getPath().get(0);
//        assertEquals(19.95083236694336f, firstPart.getY(), ACCEPTABLE_DELTA_FLOATS);
//    }

    @Test
    public void computeAllowedAngle() {
        Float allowedAngle = movement.computeAllowedAngle(1.23f, 1.2f, 20, 1.0f);
        assertNotNull(allowedAngle);
        assertEquals(1.21496, allowedAngle.floatValue(), ACCEPTABLE_DELTA_FLOATS);
    }
}
