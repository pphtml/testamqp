package org.superbiz.game;

//import com.google.inject.Singleton;

import org.superbiz.game.ai.AIService;
import org.superbiz.game.computation.Movement;
import org.superbiz.game.computation.MovementJavascript;
import org.superbiz.game.model.MoveVehicleResult;
import org.superbiz.game.model.VehicleData;
import org.superbiz.game.proto.Msg;

import javax.inject.Inject;
import javax.inject.Singleton;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;
import java.util.logging.Logger;

@Singleton
public class VehiclePositions {
    @Inject
    Logger logger;

    @Inject
    private AIService aiService;


//    private long snakeUpdateTimestamp = System.currentTimeMillis();

    //private AtomicInteger countAISnakes;

    public VehiclePositions() {
    }

//    private final PublishSubject<Msg.SnakesUpdate> observableSnakes = PublishSubject.create();
//
//    public PublishSubject<Msg.SnakesUpdate> getObservableSnakes() {
//        return observableSnakes;
//    }

    private Map<String, VehicleData> map = new LinkedHashMap<>();

    private Movement movement = new MovementJavascript();

//    public void update(Player player, Msg.PlayerMoved playerMoved) {
//        Msg.SnakeInfo snakeInfo = Msg.SnakeInfo.newBuilder()
//                .addAllPath(playerMoved.getPartsList())
//                .setSkin(playerMoved.getSkin())
//                .setRotation(playerMoved.getRotation())
//                .setSpeed(playerMoved.getSpeed())
//                .setId(player.getId())
//                .build();
//        //Msg.SnakeInfo snakeInfo = new SnakeInfo(playerMoved.getPath(), playerMoved.getSkin(), playerMoved.getRotation(), playerMoved.getSpeed());
//        map.put(player.getId(), snakeInfo);
//        Msg.SnakesUpdate snakesUpdate = Msg.SnakesUpdate.newBuilder().addAllSnakes(map.values()).build();
//        observableSnakes.onNext(snakesUpdate);
//    }


    public void remove(String playerId) {
        logger.info(String.format("Removing player: %s", playerId));
        map.remove(playerId);
    }

//    public SnakeData createSnake(String skin, float x, float y) {
//        final List path = new ArrayList<>();
//        for (int index = 0, lengthIndex = 1; lengthIndex <= INITIAL_DEFAULT_LENGTH; index++, lengthIndex += LENGTH_PER_PART) {
//            path.add(Part.create(x - index * INITIAL_PART_DISTANCE, y, 0.0f));
//        }
//
//        final SnakeData snakeData = new SnakeData();
//        return snakeData
//                .setX(0.0f)
//                .setY(0.0f)
//                .setSpeed(SPEED_CONSTANT)
//                .setRotation(0.0f)
//                .setRotationAsked(0.0f)
//                .setLength(150)
//                .setPath(path)
//                .setSkin(skin)
//                .setLastProcessed(System.currentTimeMillis());
//    }

//    public SnakeData createAndRegisterSnake(Player player) {
//        final SnakeData snakeData = createSnake(player.getSkin(), 0.0f, 0.0f);
//        this.map.put(player.getId(), snakeData);
//        return snakeData;
//    }

//    public Optional<SnakeData> moveSnakeByPlayerUpdate(String id, Msg.PlayerUpdateRequest updateReq) {
//        SnakeData snakeData = this.map.get(id);
//        if (snakeData == null) {
//            logger.severe(String.format("Couldn't find snake with id: %s", id));
//            return Optional.empty();
//        } else {
//            long now = System.currentTimeMillis();
//            long elapsedTime = now - snakeData.getLastProcessed();
//
//            float baseSpeed = 1.0f;
//
//            float speed = SPEED_CONSTANT * updateReq.getSpeedMultiplier();   // * elapsedTime * 0.06;
//
//            float newRotation = this.movement.computeAllowedAngle(updateReq.getRotationAsked(), // askedAngle
//                    snakeData.getRotation(), // lastAngle
//                    elapsedTime, // time
//                    baseSpeed, // baseSpeed
//                    speed); //speed
//            MoveSnakeResult movedSnake = this.movement.moveSnake(snakeData.getPath(), // snakePath
//                    newRotation, // angle
//                    speed, // distance
//                    INITIAL_PART_DISTANCE); // partDistance
//
//            snakeData.setLastProcessed(now)
//                .setRotation(newRotation)
//                .setRotationAsked(updateReq.getRotationAsked())
//                .setX(movedSnake.getX())
//                .setY(movedSnake.getY())
//                .setPath(movedSnake.getPath());
//            return Optional.of(snakeData);
//        }
//    }
//
//    private void moveSnakeByServer(SnakeData snakeData) {
//        long now = System.currentTimeMillis();
//        long elapsedTime = now - snakeData.getLastProcessed();
//        float baseSpeed = 1.0f;
//        float speed = SPEED_CONSTANT;   // * elapsedTime * 0.06;
//        float distance = (float)(speed * 0.06 * elapsedTime);
//
//        float newRotation = this.movement.computeAllowedAngle(snakeData.getRotationAsked(), // askedAngle
//                snakeData.getRotation(), // lastAngle
//                elapsedTime, // time
//                baseSpeed, // baseSpeed
//                speed); //speed
//        //List<Part> snakePath, float angle, float distance, float partDistance
//        MoveSnakeResult movedSnake = this.movement.moveSnake(snakeData.getPath(), // snakePath
//                newRotation, // angle
//                distance, // distance
//                INITIAL_PART_DISTANCE); // partDistance
//
//        snakeData.setLastProcessed(now)
//                .setRotation(newRotation)
//                .setRotationAsked(snakeData.getRotationAsked())
//                .setX(movedSnake.getX())
//                .setY(movedSnake.getY())
//                .setPath(movedSnake.getPath());
//    }

    public Msg.PeriodicVehiclesUpdate getUpdateMessage() {
        long now = System.currentTimeMillis();
//        long elapsedTime = now - snakeUpdateTimestamp;
//        this.snakeUpdateTimestamp = now;
//
//        for (SnakeData snakeData : this.map.values()) {
//            if (snakeData.isAiDriven()) { // TODO rozsirit
//                moveSnakeByServer(snakeData);
//            }
//        }
//
//        this.aiService.update(this, elapsedTime);
//
//        List<Msg.SnakeInfo> snakeInfos = this.map.entrySet().stream().map(snakeEntry -> {
//            String id = snakeEntry.getKey();
//            SnakeData snakeData = snakeEntry.getValue();
//            Part head = snakeData.getPath().iterator().next();
//            Msg.SnakeInfo snakeInfo = Msg.SnakeInfo.newBuilder()
//                    .setId(id)
//                    .setX(head.getX())
//                    .setY(head.getY())
//                    .setRotation(snakeData.getRotation())
//                    .setRotationAsked(snakeData.getRotationAsked())
//                    .setLength(snakeData.getLength())
//                    .addAllPath(snakeData.getPathAsProtobuf())
//                    .setSpeed(snakeData.getSpeed())
//                    .setSkin(snakeData.getSkin())
//                    .setLastProcessedOnServer(snakeData.getLastProcessed())
//                    .build();
//            return snakeInfo;
//        }).collect(Collectors.toList());

        return Msg.PeriodicVehiclesUpdate.newBuilder().build();
    }

//    public int getCountAISnakes() {
//        return countAISnakes.get();
//    }

//    public Collection<SnakeData> getAllAISnakes() {
//        return this.map.values().stream().filter(SnakeData::isAiDriven).collect(Collectors.toList());
//    }

    public void registerVehicle(String id, VehicleData vehicle) {
        this.map.put(id, vehicle);
    }

    public Optional<VehicleData> moveVehicleByPlayerUpdate(String playerId, Msg.PlayerUpdateRequest playerUpdateRequest) {
//     float orientationRequested = 1;
//    float speedMultiplier = 2;
//    int64 initiated = 3;
        VehicleData vehicleData = this.map.get(playerId);
        if (vehicleData == null) {
            logger.severe(String.format("Couldn't find vehicle for playerId: %s", playerId));
            return Optional.empty();
        } else {
            long now = System.currentTimeMillis();
            long elapsedTime = now - vehicleData.getLastProcessedOnServer();
            float newOrientation = this.movement.computeAllowedAngle(playerUpdateRequest.getOrientationRequested(), // askedAngle
                    vehicleData.getOrientation(),
                    elapsedTime, // time
                    playerUpdateRequest.getSpeedMultiplier()); //speed
            vehicleData.setLastProcessedOnServer(now)
                    .setOrientation(newOrientation)
                    .setOrientationRequested(playerUpdateRequest.getOrientationRequested());

            MoveVehicleResult movedVehicle = this.movement.moveVehicle(vehicleData);

            return Optional.of(vehicleData);
        }
    }
}