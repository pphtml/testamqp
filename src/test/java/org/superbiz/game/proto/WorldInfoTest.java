package org.superbiz.game.proto;

import com.google.protobuf.InvalidProtocolBufferException;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

public class WorldInfoTest {
    @Test
    public void toProtobufAndBack() throws InvalidProtocolBufferException {
        Msg.WorldInfo.Builder worldInfo = Msg.WorldInfo.newBuilder().setRadius(3000);
        byte[] msgBytes = Msg.Message.newBuilder().setWorldInfo(worldInfo).build().toByteArray();

        Msg.Message message = Msg.Message.parseFrom(msgBytes);
        assertNotNull(message.getWorldInfo());
        assertEquals(3000, message.getWorldInfo().getRadius());
    }
}
