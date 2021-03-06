package org.superbiz.game.ai;

import org.superbiz.game.VehiclePositions;
import org.superbiz.game.computation.MovementJava;

import javax.inject.Inject;
import java.util.logging.Logger;

public class AIService {
    public static final int TARGET_DISTANCE = 300;

    @Inject
    Logger logger;

    @Inject
    MovementJava wormMovement;

    private long id = 0;

    private String generateNewId() {
        return String.format("ai-%07d", ++id);
    }

    private static final float PI_HALF = (float) (Math.PI / 2);
    private static final float PI_DOUBLE = (float) (Math.PI * 2);

    public void update(VehiclePositions vehiclePositions, long elapsedTime) {
//        Collection<SnakeData> allAISnakes = vehiclePositions.getAllAISnakes();
//        if (allAISnakes.size() == 0) {
//            SnakeData snake = vehiclePositions.createSnake("14338485", 0, TARGET_DISTANCE);
//            snake.setAiDriven(true);
//            vehiclePositions.registerSnake(generateNewId(), snake);
//        } else {
//            for (SnakeData snakeData : allAISnakes) {
//
//                float angle = angle(snakeData);
//                //snakeData.setRotation(angle);
//                snakeData.setRotationAsked(angle);
//            }
//        }
    }

//    private float angle(SnakeData snakeData) {
//        float diffX = snakeData.getX();
//        float diffY = snakeData.getY();
//        float angle = -((float)Math.atan2(diffX, diffY)) + PI_HALF;
//        if (angle < 0) {
//            angle += PI_DOUBLE;
//        }
//        float distance = (float) Math.sqrt(snakeData.getX() * snakeData.getX() + snakeData.getY() * snakeData.getY());
//
//        float tooFarRatio = distance / TARGET_DISTANCE;
//        if (tooFarRatio > 1.0f) {
//            angle -= 0.05 * tooFarRatio;
//        }
//        float result = wormMovement.withinPiBounds(angle) - PI_HALF;
//        //logger.info(String.format("distance: %s, tooFarRatio: %s", distance, tooFarRatio));
//        //logger.info(String.format("Angle: %s, Rotation: %s, x: %s, y: %s", angle, snakeData.getRotationAsked(), snakeData.getX(), snakeData.getY()));
//        return result;
//    }

//
//    public static void main(String[] args) {
//        System.out.println(new AIService().generateNewId());
//    }
}
