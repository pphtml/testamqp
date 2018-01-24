package org.superbiz.game;

import io.netty.buffer.Unpooled;
import org.superbiz.game.map.MapParser;
import org.superbiz.game.model.VehicleData;
import org.superbiz.game.proto.Msg;
import rx.Observable;

import javax.inject.Inject;
import java.util.Map;
import java.util.Optional;
import java.util.logging.Logger;

import static com.github.davidmoten.rtree.geometry.Geometries.point;
import static java.util.concurrent.TimeUnit.MILLISECONDS;

public class GameDataService {
    private final VehiclePositions vehiclePositions;
    private final Observable<String> snakesInterval;
    private final Observable<Msg.PeriodicVehiclesUpdate> snakeUpdate;
    @Inject
    private Logger logger;


    private final WorldGeometry worldGeometry;

    private final Map<String, Msg.SectorData> sectorDataMap = new MapParser().read();


    //private RTree<Dot, Point> dotTree;

    @Inject
    public GameDataService(WorldGeometry worldGeometry, VehiclePositions vehiclePositions) {
        this.worldGeometry = worldGeometry;
        this.vehiclePositions = vehiclePositions;
//        this.dotTree = RTree.maxChildren(5).create();

//        this.radius = 3000;
//        this.powerRadius = this.radius * this.radius;
//
//        this.width = radius;
//        this.height = radius;
//        this.widthDouble = radius * 2;
//        this.heightDouble = radius * 2;
//        this.colorCount = 11;
//        this.levelCount = 4;
//        this.random = new Random();
//        this.generate(1000);

        this.snakesInterval = Observable.interval(100, MILLISECONDS).map(x -> "S" + x);
        //this.observablePosition.subscribe(this::onPositionChanged);
        this.snakeUpdate = this.snakesInterval.map(timer -> vehiclePositions.getUpdateMessage());
//
//        this.snakeUpdate.subscribe(update -> {
//            logger.info(String.format("%s", update));
//        });
    }

    public Observable<Msg.PeriodicVehiclesUpdate> getSnakeUpdate() {
        return snakeUpdate;
    }

//    private void generate(int count) {
//        for (int i = 0; i < count; i++) {
//            final Dot dot = generateDot();
//            dotTree = dotTree.add(dot, dot.getPoint());
//            //dots.put(dot.getKey(), dot);
//        }
//    }

//    private Dot generateDot() {
//        Dot dot;
//        while (true) {
//            int x = random.nextInt(widthDouble) - width;
//            int y = random.nextInt(heightDouble) - height;
//            if (x * x + y * y > powerRadius) {
//                continue;
//            }
//            int color = random.nextInt(colorCount);
//            int level = random.nextInt(levelCount);
//            dot = Dot.create(x, y, color, level);
//            break;
//        }
//        return dot;
//    }

//    public Msg.DotsUpdate getDotsUpdate(Player player/*, Point position*/) {
//        Rectangle viewport = player.getViewport(/*position*/);
//        //logger.info(String.format("Viewport: %s", viewport));
//        Observable<Entry<Dot, Point>> search = dotTree.search(viewport);
//        Observable<List<Dot>> list = search.map(entry -> entry.value()).toList().single();
//        List<Dot> values = list.toBlocking().first();
//        List<Msg.Dot> dots = values.stream().map(dot -> dot.getProtoDot())
//                .collect(Collectors.toList());
//        Msg.DotsUpdate dotsUpdate = Msg.DotsUpdate.newBuilder().addAllDots(dots).build();
//        return dotsUpdate;
//    }

    public void processMessage(Msg.Message message, Player player) {
        if (message.hasResize()) {
            player.setViewSize(point(message.getResize().getWidth(), message.getResize().getHeight()));
            //Msg.DotsUpdate response = getDotsUpdate(player);
            //byte[] msgBytes = Msg.Message.newBuilder().setDotsUpdate(response).build().toByteArray();
            //player.getWebSocket().send(Unpooled.wrappedBuffer(msgBytes));
        } else if (message.hasPlayerStartRequest()) {
            Msg.PlayerStartRequest playerStartRequest = message.getPlayerStartRequest();
            player.setName(playerStartRequest.getName());

//            final VehicleData vehicle = new VehicleFactory(playerStartRequest.getVehicleType(),
//                    playerStartRequest.getVehicleDesign(),
//                    -14820f, 8200f, 0.0f).createVehicle();
//            final VehicleData vehicle = new VehicleFactory(playerStartRequest.getVehicleType(),
//                    playerStartRequest.getVehicleDesign(),
//                    -17200f, -7800f, 0.0f).createVehicle();
            final VehicleData vehicle = new VehicleFactory(playerStartRequest.getVehicleType(),
                    playerStartRequest.getVehicleDesign(),
                    420.0f, -3900.0f, 0.0f).createVehicle();
//            final VehicleData vehicle = new VehicleFactory(playerStartRequest.getVehicleType(),
//                    playerStartRequest.getVehicleDesign(),
//                    0.0f, 0.0f, 0.0f).createVehicle();
            vehiclePositions.registerVehicle(player.getId(), vehicle);
            Msg.PlayerStartResponse response = makeCreationResponse(vehicle, playerStartRequest);
            byte[] msgBytes = Msg.Message.newBuilder().setPlayerStartResponse(response).build().toByteArray();
            player.getWebSocket().send(Unpooled.wrappedBuffer(msgBytes));
        } else if (message.hasPlayerUpdateRequest()) {
            Msg.PlayerUpdateRequest playerUpdateRequest = message.getPlayerUpdateRequest();
            Optional<VehicleData> vehicleData = vehiclePositions.moveVehicleByPlayerUpdate(player.getId(), playerUpdateRequest);
            if (vehicleData.isPresent()) {
//                Part head = vehicleData.get().getPath().iterator().next();
//                Point position = point(head.getX(), head.getY());
//                player.setPosition(position); TODO set position?
                Msg.PlayerUpdateResponse.Builder response = makePlayerUpdateResponse(vehicleData.get(), playerUpdateRequest);
                byte[] msgBytes = Msg.Message.newBuilder().setPlayerUpdateResponse(response).build().toByteArray();
                player.getWebSocket().send(Unpooled.wrappedBuffer(msgBytes));
            }
        } else {
            logger.info(String.format("UNIMPLEMENTED %s",  message));
        }
    }

//    private Collection<Msg.Dot> eatFood(Player player, Point position) {
//        if (position != null) {
//            Collection<Msg.Dot> matchingDots = new ArrayList<>();
//            Circle foodCircle = player.getEatingCircle(position);
//            Observable<Entry<Dot, Point>> foodSearch = dotTree.search(foodCircle);
//            foodSearch.forEach(food -> {
//                //logger.info(String.format("Food is at: %s", food.value()));
//                dotTree = dotTree.delete(food.value(), food.geometry());
//                matchingDots.add(food.value().getProtoDot());
//            });
//            return matchingDots;
//        } else {
//            return Collections.emptyList();
//        }
//    }

//    public void processPeriodicUpdate(Player player) {
//        //logger.info(String.format("Player %s, update at position %s",  player.getId(), position));
//        Msg.DotsUpdate response = getDotsUpdate(player);
//        byte[] msg = Msg.Message.newBuilder().setDotsUpdate(response).build().toByteArray();
//        //String jsonMsg = MessageBuilder.create().setDotsUpdate(response).toJson();
//        //logger.info(String.format("TODO: %s", jsonMsg));
//        //player.getWebSocket().send(Unpooled.wrappedBuffer(msg));
//    }

    private Msg.PlayerStartResponse makeCreationResponse(VehicleData vehicle, Msg.PlayerStartRequest request) {
        Msg.PlayerStartResponse.Builder response = Msg.PlayerStartResponse.newBuilder()
//                .setBirthLocationX(0.0f)
//                .setBirthLocationY(0.0f)
//                .setBirthOrientation(0.0f)

                .setWorldWidth(worldGeometry.getWorldWidth())
                .setWorldHeight(worldGeometry.getWorldHeight())
                .setSectorWidth(worldGeometry.getSectorWidth())
                .setSectorHeight(worldGeometry.getSectorHeight())
                .setBaseSpeed(worldGeometry.getBaseSpeed())
                .setTimeInfo(Msg.TimeInfo.newBuilder().setInitiated(request.getInitiated()).setProcessing(0L));

        final Msg.VehicleData vehicleData = vehicle.asProtobufFull();
        response.setVehicleData(vehicleData);
        response.putAllSectorMap(sectorDataMap);

        return response.build();
    }

    private Msg.PlayerUpdateResponse.Builder makePlayerUpdateResponse(VehicleData vehicleData, Msg.PlayerUpdateRequest updateReq) {
        Msg.PlayerUpdateResponse.Builder response = Msg.PlayerUpdateResponse.newBuilder();
        response.setVehicleData(vehicleData.asProtobuf())
                .setTimeInfo(Msg.TimeInfo.newBuilder().setInitiated(updateReq.getInitiated()).setProcessing(0L));
        return response;
    }
}
