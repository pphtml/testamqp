package org.superbiz.game.proto;

import com.google.protobuf.InvalidProtocolBufferException;
import org.junit.Test;
import org.superbiz.game.BaseTest;
import org.superbiz.game.proto.Msg.Part;

import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

public class PlayerMovedTest extends BaseTest {
//    @Test
//    public void toProtobufAndBack() throws InvalidProtocolBufferException {
//        List<Part> path = Arrays.asList(
//                Part.newBuilder().setX(10.6f).setY(30.5f).setRotation(3.14f).build(),
//                Part.newBuilder().setX(10.8f).setY(30.4f).setRotation(1.67f).build(),
//                Part.newBuilder().setX(10.1f).setY(30.2f).setRotation(-3.14f).build());
//
//        Msg.PlayerMoved.Builder playerMovedSource = Msg.PlayerMoved.newBuilder()
//                .setX(10.6f)
//                .setY(30.5f)
//                .setRotation(3.14f)
//                .setSpeed(20f)
//                .setSkin("red")
//                .setInitiated(9876543210L)
//                .addAllParts(path);
//
//        byte[] bytesMessage = Msg.Message.newBuilder().setPlayerMoved(playerMovedSource).build().toByteArray();
//
//        Msg.Message decodedMessage = Msg.Message.parseFrom(bytesMessage);
//        assertNotNull(decodedMessage.getPlayerMoved());
//        Msg.PlayerMoved playerMoved = decodedMessage.getPlayerMoved();
//
//        assertEquals(10.6, playerMoved.getX(), ACCEPTABLE_DELTA);
//        assertEquals(30.5, playerMoved.getY(), ACCEPTABLE_DELTA);
//        List<Part> partsList = playerMoved.getPartsList();
//        assertNotNull(partsList);
//        assertEquals(3, partsList.size());
//        Part part = partsList.iterator().next();
//        assertNotNull(part);
//        assertEquals(10.6, part.getX(), ACCEPTABLE_DELTA);
//        assertEquals(30.5, part.getY(), ACCEPTABLE_DELTA);
//        assertEquals(3.14, part.getRotation(), ACCEPTABLE_DELTA);
//    }
}
