package org.superbiz.game.proto;

import com.google.common.primitives.Bytes;
import com.google.protobuf.InvalidProtocolBufferException;
import org.junit.Test;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

public class ClientDisconnectTest {
    @Test
    public void toProtobufAndBack() throws InvalidProtocolBufferException {
        Msg.ClientDisconnect.Builder clientDisconnect = Msg.ClientDisconnect.newBuilder().setId("H1nOGvj7G");
        byte[] msgBytes = Msg.Message.newBuilder().setClientDisconnect(clientDisconnect).build().toByteArray();

        //List<Byte> list = Bytes.asList(msgBytes);
        //System.out.println(list);

        Msg.Message message = Msg.Message.parseFrom(msgBytes);
        assertNotNull(message.getClientDisconnect());
        assertEquals("H1nOGvj7G", message.getClientDisconnect().getId());
    }

    @Test
    public void decodeFromBytes() throws InvalidProtocolBufferException {
        // new Int8Array(e.data);
        //final List<Integer> integers = Arrays.asList(10, 9, 72, 49, 110, 79, 71, 118, 106, 55, 71);
        final List<Integer> integers = Arrays.asList(58, 11, 10, 9, 72, 49, 110, 79, 71, 118, 106, 55, 71);
        //final List<Integer> integers = Arrays.asList(58, 11, 10, 9, 83, 121, 117, 65, 50, 118, 111, 81, 77);
        final List<Byte> bytes = integers.stream().map(i -> Byte.valueOf(i.byteValue())).collect(Collectors.toList());
        //System.out.println(bytes);
        byte[] msgBytes = Bytes.toArray(bytes);

        Msg.Message message = Msg.Message.parseFrom(msgBytes);
        assertNotNull(message.getClientDisconnect());
        assertEquals("H1nOGvj7G", message.getClientDisconnect().getId());

    }
}
