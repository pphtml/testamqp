package ratpack.websocket.internal;

import io.netty.buffer.ByteBuf;
import io.netty.channel.Channel;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelFutureListener;
import io.netty.handler.codec.http.DefaultFullHttpRequest;
import io.netty.handler.codec.http.FullHttpRequest;
import io.netty.handler.codec.http.HttpMethod;
import io.netty.handler.codec.http.HttpVersion;
import io.netty.handler.codec.http.websocketx.*;
import org.superbiz.ws.GameHandler;
import ratpack.handling.Context;
import ratpack.handling.direct.DirectChannelAccess;
import ratpack.http.Request;
import ratpack.server.PublicAddress;
import ratpack.websocket.WebSocket;
import ratpack.websocket.WebSocketHandler;
import ratpack.websocket.WebSocketMessage;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.logging.Level;
import java.util.logging.Logger;

import static io.netty.handler.codec.http.HttpHeaderNames.SEC_WEBSOCKET_KEY;
import static io.netty.handler.codec.http.HttpHeaderNames.SEC_WEBSOCKET_VERSION;
import static io.netty.handler.codec.http.HttpMethod.valueOf;
import static ratpack.util.Exceptions.toException;
import static ratpack.util.Exceptions.uncheck;

public class MyWebSocketEngine {
    private static final Logger logger = Logger.getLogger(MyWebSocketEngine.class.getName());

    @SuppressWarnings("deprecation")
    public static <T> void connect(final Context context, String path, int maxLength, final WebSocketHandler<T> handler) {
        PublicAddress publicAddress = context.get(PublicAddress.class);
        URI address = publicAddress.get(context);
        URI httpPath = address.resolve(path);

        URI wsPath;
        try {
            wsPath = new URI("ws", httpPath.getUserInfo(), httpPath.getHost(), httpPath.getPort(), httpPath.getPath(), httpPath.getQuery(), httpPath.getFragment());
        } catch (URISyntaxException e) {
            throw uncheck(e);
        }

        WebSocketServerHandshakerFactory factory = new WebSocketServerHandshakerFactory(wsPath.toString(), null, false, maxLength);

        Request request = context.getRequest();
        HttpMethod method = valueOf(request.getMethod().getName());
        FullHttpRequest nettyRequest = new DefaultFullHttpRequest(HttpVersion.HTTP_1_1, method, request.getUri());
        nettyRequest.headers().add(SEC_WEBSOCKET_VERSION, request.getHeaders().get(SEC_WEBSOCKET_VERSION));
        nettyRequest.headers().add(SEC_WEBSOCKET_KEY, request.getHeaders().get(SEC_WEBSOCKET_KEY));
        //nettyRequest.headers().add("responseType", "arraybuffer");

        final WebSocketServerHandshaker handshaker = factory.newHandshaker(nettyRequest);

        final DirectChannelAccess directChannelAccess = context.getDirectChannelAccess();
        final Channel channel = directChannelAccess.getChannel();
        if (!channel.config().isAutoRead()) {
            channel.config().setAutoRead(true);
        }

        handshaker.handshake(channel, nettyRequest).addListener(new HandshakeFutureListener<>(context, handshaker, handler));
    }

    private static class HandshakeFutureListener<T> implements ChannelFutureListener {

        private final Context context;
        private final WebSocketServerHandshaker handshaker;
        private final WebSocketHandler<T> handler;

        private volatile T openResult;
        private final CountDownLatch openLatch = new CountDownLatch(1);

        public HandshakeFutureListener(Context context, WebSocketServerHandshaker handshaker, WebSocketHandler<T> handler) {
            this.context = context;
            this.handshaker = handshaker;
            this.handler = handler;
        }

        public void operationComplete(ChannelFuture future) throws Exception {
            if (future.isSuccess()) {
                final AtomicBoolean open = new AtomicBoolean(true);
                final WebSocket webSocket = new MyDefaultWebSocket(context.getDirectChannelAccess().getChannel(), open, () -> {
                    try {
                        handler.onClose(new DefaultWebSocketClose<>(false, openResult));
                    } catch (Exception e) {
                        logger.log(Level.SEVERE, e.getMessage(), e);
                        throw uncheck(e);
                    }
                });

                final DirectChannelAccess directAccessChannel = context.getDirectChannelAccess();
                final Channel channel = directAccessChannel.getChannel();

//                channel.closeFuture().addListener(fu -> {
//                    try {
//                        handler.onClose(new DefaultWebSocketClose<>(true, openResult));
//                    } catch (Exception e) {
//                        logger.log(Level.SEVERE, e.getMessage(), e);
//                        throw uncheck(e);
//                    }
//                });

                directAccessChannel.takeOwnership(msg -> {
                    openLatch.await();
                    if (channel.isOpen()) {
                        if (msg instanceof WebSocketFrame) {
                            WebSocketFrame frame = (WebSocketFrame) msg;
                            if (frame instanceof CloseWebSocketFrame) {
                                open.set(false);
                                handshaker.close(channel, (CloseWebSocketFrame) frame).addListener(future1 ->
                                {
                                    handler.onClose(new DefaultWebSocketClose<>(true, openResult));
                                });
                                return;
                            }
                            if (frame instanceof PingWebSocketFrame) {
                                channel.write(new PongWebSocketFrame(frame.content()));
                                return;
                            }
                            if (frame instanceof TextWebSocketFrame) {
                                TextWebSocketFrame textWebSocketFrame = (TextWebSocketFrame) frame;
                                handler.onMessage(new DefaultWebSocketMessage<>(webSocket, textWebSocketFrame.text(), openResult));
                                frame.release();
                            }
                            if (frame instanceof BinaryWebSocketFrame) {
                                BinaryWebSocketFrame textWebSocketFrame = (BinaryWebSocketFrame) frame;
                                handler.onMessage(new WebSocketBinaryMessage(webSocket, textWebSocketFrame.content(), openResult));
                                frame.release();
                            }
                        }
                    }
                });

                try {
                    openResult = handler.onOpen(webSocket);
                } catch (Exception e) {
                    handshaker.close(context.getDirectChannelAccess().getChannel(), new CloseWebSocketFrame(1011, e.getMessage()));
                }
                openLatch.countDown();
            } else {
                context.error(toException(future.cause()));
            }
        }
    }
}
