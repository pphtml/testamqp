package ratpack.websocket.internal;

import io.netty.buffer.ByteBuf;
import ratpack.websocket.WebSocket;
import ratpack.websocket.WebSocketMessage;

public class WebSocketBinaryMessage<T> implements WebSocketMessage<T> {
    private final WebSocket webSocket;
    private final ByteBuf content;
    private final T openResult;

    public WebSocketBinaryMessage(WebSocket webSocket, ByteBuf content, T openResult) {
        this.webSocket = webSocket;
        this.content = content;
        this.openResult = openResult;
    }

    @Override
    public WebSocket getConnection() {
        return null;
    }

    @Override
    public String getText() {
        throw new UnsupportedOperationException("this is a binary stream");
    }

    @Override
    public T getOpenResult() {
        return openResult;
    }

    public ByteBuf getContent() {
        return content;
    }
}
