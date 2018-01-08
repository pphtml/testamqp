package org.superbiz.game.proto;

import com.google.protobuf.InvalidProtocolBufferException;
import org.junit.Test;
import org.superbiz.game.BaseTest;
import org.superbiz.game.Dot;

import java.util.Arrays;
import java.util.Collection;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

public class DotsUpdateTest extends BaseTest {
    @Test
    public void toProtobufAndBack() throws InvalidProtocolBufferException {
        Collection<Msg.Dot> dots = Arrays.asList(Dot.create(30, 20, 3, 3).getProtoDot(),
                Dot.create(40, 30, 4, 4).getProtoDot());
        final Msg.DotsUpdate dotsUpdate = Msg.DotsUpdate.newBuilder().addAllDots(dots).build();
        byte[] bytesMessage = Msg.Message.newBuilder().setDotsUpdate(dotsUpdate).build().toByteArray();

        Msg.Message decodedMessage = Msg.Message.parseFrom(bytesMessage);
        assertTrue(decodedMessage.hasDotsUpdate());
        assertNotNull(decodedMessage.getDotsUpdate());
        final Msg.DotsUpdate dotsUpdateResult = decodedMessage.getDotsUpdate();
        assertNotNull(dotsUpdateResult);

        List<Msg.Dot> resultList = dotsUpdateResult.getDotsList();
        assertEquals(2, resultList.size());
        final Msg.Dot dot = resultList.get(0);
        assertEquals(30, dot.getX(), ACCEPTABLE_DELTA);
        assertEquals(20, dot.getY(), ACCEPTABLE_DELTA);
        assertEquals(3, dot.getColor());
        assertEquals(3, dot.getSize());
    }
}
