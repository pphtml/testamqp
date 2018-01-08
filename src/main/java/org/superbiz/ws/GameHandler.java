package org.superbiz.ws;

import com.google.protobuf.InvalidProtocolBufferException;
import io.netty.buffer.ByteBuf;
import io.netty.buffer.PooledByteBufAllocator;
import io.netty.buffer.Unpooled;
import org.superbiz.game.GameDataService;
import org.superbiz.game.Player;
import org.superbiz.game.SnakePositions;
import org.superbiz.game.proto.Msg;
import ratpack.handling.Context;
import ratpack.handling.Handler;
import ratpack.server.ServerConfig;
import ratpack.websocket.WebSocket;
import ratpack.websocket.WebSocketClose;
import ratpack.websocket.WebSocketHandler;
import ratpack.websocket.WebSocketMessage;
import ratpack.websocket.internal.MyWebSocketEngine;
import ratpack.websocket.internal.WebSocketBinaryMessage;

import javax.inject.Inject;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

public class GameHandler implements Handler {
    private static final Logger logger = Logger.getLogger(GameHandler.class.getName());

    private final SnakePositions snakePositions;

    private GameDataService gameDataService;

    @Inject
    public GameHandler(GameDataService gameDataService, SnakePositions snakePositions) {
        this.gameDataService = gameDataService;
        this.snakePositions = snakePositions;
        logger.info(String.format("STREAM: %s", gameDataService.getSnakeUpdate()));
        gameDataService.getSnakeUpdate().subscribe(snakesUpdate -> {
            byte[] msg = Msg.Message.newBuilder().setSnakesUpdate(snakesUpdate).build().toByteArray();
            sendToAllPlayers(msg);
        });
    }

    // List of all currently connected clients
    private final Map<String, Player> players = new HashMap<>();

//    // Subject that all clients subscribe to for events
//    private final PublishSubject<ByteBuf> events = PublishSubject.create();

    // Mapping of client to subscription to the events subject
    //private final Map<String, Subscription> subscriptions = new HashMap<>();

    @Override
    public void handle(Context ctx) {
        // ChannelPipeline pipeline = ctx.getDirectChannelAccess().getChannel().pipeline();

        MyWebSocketEngine.connect(ctx, "/", ctx.get(ServerConfig.class).getMaxContentLength(), //handler);


        /*WebSockets.websocket(ctx,*/ new WebSocketHandler<ByteBuf>() {

            @Override
            public ByteBuf onOpen(WebSocket webSocket) {
                String playerId = ctx.getRequest().getQueryParams().get("id");

                logger.info(String.format("Websocket opened for player: %s", playerId));

                if (playerId == null || playerId.isEmpty()) {
                    webSocket.close(500, "Client id is required");
                } else if (players.containsKey(playerId)) {
                    webSocket.close(500, "Client is already connected");
                } else {
                    Player player = new Player(playerId, webSocket);
                    players.put(playerId, player);

                    // dots update so far...
                    player.getPeriodicUpdate().subscribe(player1 -> { // TODO mozna zjednodusit
                        gameDataService.processPeriodicUpdate(player1);
                    });

                    Msg.WorldInfo.Builder worldInfo = Msg.WorldInfo.newBuilder().setRadius(3000);
                    byte[] msgBytes = Msg.Message.newBuilder().setWorldInfo(worldInfo).build().toByteArray();
                    webSocket.send(Unpooled.wrappedBuffer(msgBytes));

//                    final Subscription subscription = events.subscribe(webSocket::send);
//                    subscriptions.put(playerId, subscription);

                    logger.info(String.format("Client %s subscribed to event stream", playerId));
                    //logger.info(String.format("Subscription map: %s", subscriptions));
                }

                return null; //Unpooled.wrappedBuffer("abcdef".getBytes());
            }

            @Override
            public void onClose(WebSocketClose<ByteBuf> close) {
                String playerId = ctx.getRequest().getQueryParams().get("id");

                players.remove(playerId);
                snakePositions.remove(playerId);

                byte[] msg = Msg.Message.newBuilder().setClientDisconnect(
                        Msg.ClientDisconnect.newBuilder().setId(playerId)).build().toByteArray();
                //logger.info(String.format("Sending DisconnectClient: %s", Bytes.asList(msg)));
                sendToAllPlayers(msg);

//                final Subscription subscription = subscriptions.remove(playerId);
//                if (subscription != null) {
//                    subscription.unsubscribe();
//                } else {
//                    logger.info(String.format("Missing subscription for player %s.", playerId));;
//                }

                logger.info(String.format("Websocket closed for player: %s", playerId));
            }

            @Override
            public void onMessage(WebSocketMessage<ByteBuf> frame) {
                WebSocketBinaryMessage binaryFrame = (WebSocketBinaryMessage)frame;
                String playerId = ctx.getRequest().getQueryParams().get("id");
                Player player = players.get(playerId);
                if (player == null) {
                    logger.warning(String.format("Player '%s' cannot be found.", playerId));
                } else {
                    //logger.info(String.format("Incoming frame -->: %s", frame));
                    try {
                        ByteBuf buf = binaryFrame.getContent();
                        byte[] bytes;
                        int length = buf.readableBytes();

                        if (buf.hasArray()) {
                            bytes = buf.array();
                        } else {
                            bytes = new byte[length];
                            buf.getBytes(buf.readerIndex(), bytes);
                        }
                                
                        Msg.Message message = Msg.Message.parseFrom(bytes);
                        //logger.info(String.format("Incoming message -->: %s", bytes));
                        gameDataService.processMessage(message, player);
                    } catch (InvalidProtocolBufferException e) {
                        logger.log(Level.SEVERE, e.getMessage(), e);
                    }
                }
            }
        });
    }

    private void sendToAllPlayers(byte[] msg) {
        players.values().forEach(player -> {
            ByteBuf buf = PooledByteBufAllocator.DEFAULT.buffer(msg.length);
            buf.writeBytes(msg);

            player.getWebSocket().send(buf);
        });
    }
}
