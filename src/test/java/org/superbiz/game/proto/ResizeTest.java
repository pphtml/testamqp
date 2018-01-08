package org.superbiz.game.proto;

import com.google.protobuf.InvalidProtocolBufferException;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

public class ResizeTest {
    @Test
    public void toProtobufAndBack() throws InvalidProtocolBufferException {
        Msg.Resize.Builder resize = Msg.Resize.newBuilder().setWidth(800).setHeight(600);
        byte[] msgBytes = Msg.Message.newBuilder().setResize(resize).build().toByteArray();

        Msg.Message message = Msg.Message.parseFrom(msgBytes);
        assertNotNull(message.hasResize());
        assertEquals(800, message.getResize().getWidth());
        assertEquals(600, message.getResize().getHeight());
    }
}
