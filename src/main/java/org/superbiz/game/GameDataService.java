package org.superbiz.game;

import com.github.davidmoten.rtree.Entry;
import com.github.davidmoten.rtree.RTree;
import com.github.davidmoten.rtree.geometry.Circle;
import com.github.davidmoten.rtree.geometry.Point;
import com.github.davidmoten.rtree.geometry.Rectangle;
import io.netty.buffer.Unpooled;
import org.superbiz.game.model.Part;
import org.superbiz.game.model.SnakeData;
import org.superbiz.game.proto.Msg;
import rx.Observable;

import javax.inject.Inject;
import java.util.*;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import static com.github.davidmoten.rtree.geometry.Geometries.point;
import static java.util.concurrent.TimeUnit.MILLISECONDS;

public class GameDataService {
    private final int radius;
    private final int powerRadius;
    private final SnakePositions snakePositions;
    private final Observable<String> snakesInterval;
    private final Observable<Msg.SnakesUpdate> snakeUpdate;
    @Inject
    private Logger logger;

    private final int width;
    private final int height;
    private final Random random;
    private final int widthDouble;
    private final int heightDouble;
    private final int colorCount;
    private final int levelCount;

    private final WorldGeometry worldGeometry;

    private RTree<Dot, Point> dotTree;

    @Inject
    public GameDataService(WorldGeometry worldGeometry, SnakePositions snakePositions) {
        this.worldGeometry = worldGeometry;
        this.snakePositions = snakePositions;
        this.dotTree = RTree.maxChildren(5).create();

        this.radius = 3000;
        this.powerRadius = this.radius * this.radius;

        this.width = radius;
        this.height = radius;
        this.widthDouble = radius * 2;
        this.heightDouble = radius * 2;
        this.colorCount = 11;
        this.levelCount = 4;
        this.random = new Random();
        this.generate(1000);

        this.snakesInterval = Observable.interval(100, MILLISECONDS).map(x -> "S" + x);
        //this.observablePosition.subscribe(this::onPositionChanged);
        this.snakeUpdate = this.snakesInterval.map(timer -> snakePositions.getUpdateMessage());
//
//        this.snakeUpdate.subscribe(update -> {
//            logger.info(String.format("%s", update));
//        });
    }

    public Observable<Msg.SnakesUpdate> getSnakeUpdate() {
        return snakeUpdate;
    }

    private void generate(int count) {
        for (int i = 0; i < count; i++) {
            final Dot dot = generateDot();
            dotTree = dotTree.add(dot, dot.getPoint());
            //dots.put(dot.getKey(), dot);
        }
    }

    private Dot generateDot() {
        Dot dot;
        while (true) {
            int x = random.nextInt(widthDouble) - width;
            int y = random.nextInt(heightDouble) - height;
            if (x * x + y * y > powerRadius) {
                continue;
            }
            int color = random.nextInt(colorCount);
            int level = random.nextInt(levelCount);
            dot = Dot.create(x, y, color, level);
            break;
        }
        return dot;
    }

/*    public static void main(String[] args) throws JsonProcessingException {
        final GameDataService dotService = new GameDataService(512, 512);
        dotService.generate(10);
        // System.out.println(dotService.dots);
        String all = dotService.getDotsUpdate();
        System.out.println(all);
    }*/

    public Msg.DotsUpdate getDotsUpdate(Player player/*, Point position*/) {
        Rectangle viewport = player.getViewport(/*position*/);
        //logger.info(String.format("Viewport: %s", viewport));
        Observable<Entry<Dot, Point>> search = dotTree.search(viewport);
        Observable<List<Dot>> list = search.map(entry -> entry.value()).toList().single();
        List<Dot> values = list.toBlocking().first();
        List<Msg.Dot> dots = values.stream().map(dot -> dot.getProtoDot())
                .collect(Collectors.toList());
        Msg.DotsUpdate dotsUpdate = Msg.DotsUpdate.newBuilder().addAllDots(dots).build();
        return dotsUpdate;
    }

    public void processMessage(Msg.Message message, Player player) {
//        if (message.hasPlayerUpdateReq()) {
//        if (message.hasPlayerMoved()) {
//            final long processingStart = System.nanoTime();
//            final Point position = point(message.getPlayerMoved().getX(), message.getPlayerMoved().getY());
//            player.getObservablePosition().onNext(position);
//
//            snakePositions.update(player, message.getPlayerMoved());
//
//            Optional<Msg.EatenFood.Builder> eatenFood = eatFood(player, position);
//            if (eatenFood.isPresent()) {
//                //logger.info(String.format("TODO: %s", jsonMsg));
//                final long processingEnd = System.nanoTime();
//                final Msg.TimeInfo timeInfo = Msg.TimeInfo.newBuilder()
//                        .setInitiated(message.getPlayerMoved().getInitiated())
//                        .setProcessing(processingEnd - processingStart)
//                        .build();
//                eatenFood.get().setTimeInfo(timeInfo);
//                byte[] msgBytes = Msg.Message.newBuilder().setEatenFood(eatenFood.get().build()).build().toByteArray();
//                //String jsonMsg = MessageBuilder.create().setEatenFood(eatenFood).toJson();
//                player.getWebSocket().send(Unpooled.wrappedBuffer(msgBytes));
//            }
        if (message.hasResize()) {
            player.setViewSize(point(message.getResize().getWidth(), message.getResize().getHeight()));
            Msg.DotsUpdate response = getDotsUpdate(player);
            //String jsonMsg = MessageBuilder.create().setDotsUpdate(response).toJson();
            byte[] msgBytes = Msg.Message.newBuilder().setDotsUpdate(response).build().toByteArray();
            //logger.info(String.format("TODO: %s", jsonMsg));
            player.getWebSocket().send(Unpooled.wrappedBuffer(msgBytes));
        } else if (message.hasPlayerStartReq()) {
            final Msg.PlayerStartReq playerStartReq = message.getPlayerStartReq();
            player.setSkin(playerStartReq.getSkin());
            final SnakeData snakeData = snakePositions.createAndRegisterSnake(player);
            Msg.PlayerResp response = makeCreationResponse(snakeData, playerStartReq);
            byte[] msgBytes = Msg.Message.newBuilder().setPlayerResp(response).build().toByteArray();
            player.getWebSocket().send(Unpooled.wrappedBuffer(msgBytes));
        } else if (message.hasPlayerUpdateReq()) {
            Msg.PlayerUpdateReq updateReq = message.getPlayerUpdateReq();
            Optional<SnakeData> snakeData = snakePositions.moveSnakeByPlayerUpdate(player.getId(), updateReq);
            if (snakeData.isPresent()) {
                Part head = snakeData.get().getPath().iterator().next();
                Point position = point(head.getX(), head.getY());
                player.setPosition(position);
                Msg.PlayerResp.Builder response = makePlayerUpdateResponse(snakeData.get(), updateReq);
                Collection<Msg.Dot> eatenFood = eatFood(player, position);
                if (!eatenFood.isEmpty()) {
                    //logger.info(String.format("Je tu zradlo @%s", position));
                    response.addAllEatenFood(eatenFood);
                }

                byte[] msgBytes = Msg.Message.newBuilder().setPlayerResp(response).build().toByteArray();
                player.getWebSocket().send(Unpooled.wrappedBuffer(msgBytes));
            }
        } else {
            logger.info(String.format("UNIMPLEMENTED %s",  message));
        }
    }

    private Collection<Msg.Dot> eatFood(Player player, Point position) {
        if (position != null) {
            Collection<Msg.Dot> matchingDots = new ArrayList<>();
            Circle foodCircle = player.getEatingCircle(position);
            Observable<Entry<Dot, Point>> foodSearch = dotTree.search(foodCircle);
            foodSearch.forEach(food -> {
                //logger.info(String.format("Food is at: %s", food.value()));
                dotTree = dotTree.delete(food.value(), food.geometry());
                matchingDots.add(food.value().getProtoDot());
            });
            return matchingDots;
        } else {
            return Collections.emptyList();
        }
    }

    public void processPeriodicUpdate(Player player) {
        //logger.info(String.format("Player %s, update at position %s",  player.getId(), position));
        Msg.DotsUpdate response = getDotsUpdate(player);
        byte[] msg = Msg.Message.newBuilder().setDotsUpdate(response).build().toByteArray();
        //String jsonMsg = MessageBuilder.create().setDotsUpdate(response).toJson();
        //logger.info(String.format("TODO: %s", jsonMsg));
        player.getWebSocket().send(Unpooled.wrappedBuffer(msg));
    }

    private Msg.PlayerResp makeCreationResponse(SnakeData snakeData, Msg.PlayerStartReq request) {
        // string id = 1;
        // float x = 2;
        // float y = 3;
        // float rotation = 4;
        // float rotationAsked = 5;
        // uint32 length = 6;
        // repeated Part parts = 7;
        // float speed = 8;
        // string skin = 9;
        // uint64 lastProcessedOnServer = 10;

        // TimeInfo timeInfo = 1;
        // float x = 2;
        // float y = 3;
        // float rotation = 4;
        // //float rotationAsked = 5;
        // uint32 length = 6;
        // repeated Part parts = 7;

        Msg.PlayerResp response = Msg.PlayerResp.newBuilder()
                .setX(snakeData.getX())
                .setY(snakeData.getY())
                .setRotation(snakeData.getRotation())
                .setSpeed(snakeData.getSpeed())
                // asked rotation ???
                .setLength(snakeData.getLength())
                .addAllParts(snakeData.getPathAsProtobuf())
                .setTimeInfo(Msg.TimeInfo.newBuilder().setInitiated(request.getInitiated()).setProcessing(0L))
                .build();
        return response;
    }

    private Msg.PlayerResp.Builder makePlayerUpdateResponse(SnakeData snakeData, Msg.PlayerUpdateReq updateReq) {
        Msg.PlayerResp.Builder response = Msg.PlayerResp.newBuilder()
                .setX(snakeData.getX())
                .setY(snakeData.getY())
                .setRotation(snakeData.getRotation())
                .setSpeed(snakeData.getSpeed())
                // asked rotation ???
                .setLength(snakeData.getLength())
                .addAllParts(snakeData.getPathAsProtobuf()) // TODO nechat pocitat klienta
                .setTimeInfo(Msg.TimeInfo.newBuilder().setInitiated(updateReq.getInitiated()).setProcessing(0L));
        return response;
    }
}
