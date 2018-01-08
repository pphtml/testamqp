package org.superbiz.game.proto;

import com.google.protobuf.InvalidProtocolBufferException;
import org.junit.Test;
import org.superbiz.game.BaseTest;
import org.superbiz.game.proto.Msg.Part;

import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

public class SnakeUpdateTest extends BaseTest {
//    @Test
//    public void toProtobufAndBack() throws InvalidProtocolBufferException {
//        final List<Part> pathA = Arrays.asList(
//                Part.newBuilder().setX(10.6f).setY(30.5f).setRotation(3.14f).build(),
//                Part.newBuilder().setX(10.8f).setY(30.4f).setRotation(1.67f).build(),
//                Part.newBuilder().setX(10.1f).setY(30.2f).setRotation(-3.14f).build());
//        final Msg.SnakeInfo snakeInfoA = Msg.SnakeInfo.newBuilder()
//                .setId("snakeA").addAllPath(pathA).setSkin("blue").setRotation(0.0f).setSpeed(10.0f).build();
//
//        final List<Part> pathB = Arrays.asList(
//                Part.newBuilder().setX(10.7f).setY(30.9f).setRotation(3.15f).build(),
//                Part.newBuilder().setX(10.9f).setY(30.8f).setRotation(1.68f).build(),
//                Part.newBuilder().setX(10.2f).setY(30.7f).setRotation(-3.15f).build());
//        final Msg.SnakeInfo snakeInfoB = Msg.SnakeInfo.newBuilder()
//                .setId("snakeB").addAllPath(pathB).setSkin("red").setRotation(3.15f).setSpeed(20.0f).build();
//
//        final Msg.SnakesUpdate snakesUpdate = Msg.SnakesUpdate.newBuilder().addAllSnakes(Arrays.asList(snakeInfoA, snakeInfoB)).build();
//
//        byte[] bytesMessage = Msg.Message.newBuilder().setSnakesUpdate(snakesUpdate).build().toByteArray();
//
//        Msg.Message decodedMessage = Msg.Message.parseFrom(bytesMessage);
//        assertTrue(decodedMessage.hasSnakesUpdate());
//        Msg.SnakesUpdate snakesUpdateResult = decodedMessage.getSnakesUpdate();
//        assertNotNull(snakesUpdateResult);
//
//        final List<Msg.SnakeInfo> snakes = snakesUpdateResult.getSnakesList();
//        assertEquals(2, snakes.size());
//
//        Msg.SnakeInfo snakeA = snakes.get(0);
//        assertNotNull(snakeA);
//        assertEquals("snakeA", snakeA.getId());
//        assertEquals(3, snakeA.getPathList().size());
//        assertEquals(-3.14f, snakeA.getPathList().get(2).getRotation(), ACCEPTABLE_DELTA);
//        assertEquals("blue", snakeA.getSkin());
//        assertEquals(0.0, snakeA.getRotation(), ACCEPTABLE_DELTA);
//        assertEquals(10.0, snakeA.getSpeed(), ACCEPTABLE_DELTA);
//
//
//    }
}
