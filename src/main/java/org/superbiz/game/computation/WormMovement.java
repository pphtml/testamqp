package org.superbiz.game.computation;

import org.superbiz.game.model.MoveSnakeResult;
import org.superbiz.game.model.Part;

import java.util.Collection;

public interface WormMovement {
    MoveSnakeResult moveSnake(Collection<Part> snakePath, float angle, float distance, float partDistance);

    float computeAllowedAngle(float askedAngle, float lastAngle, long time, float baseSpeed, float speed);
}
