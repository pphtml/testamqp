package org.superbiz.game.computation;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.superbiz.game.model.MoveVehicleResult;
import org.superbiz.game.model.VehicleData;
import org.superbiz.game.model.VehiclePart;

import javax.script.Invocable;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

public class MovementJavascript implements Movement {
    private static final Logger logger = Logger.getLogger(MovementJavascript.class.getName());

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    private static final Invocable NASHORN_INVOCABLE;

    static {
        System.setProperty("nashorn.args", "--language=es6");
        ScriptEngine engine = new ScriptEngineManager().getEngineByName("nashorn");
        NASHORN_INVOCABLE = (Invocable) engine;

        try {
            String content = new String(Files.readAllBytes(Paths.get("src/main/frontend/src/computation/movements.js")));
            engine.eval(content);

        } catch (IOException | ScriptException e) {
            logger.log(Level.SEVERE, e.getMessage(), e);
            throw new RuntimeException(e);
        }
    }

//    @Override
//    public MoveSnakeResult moveSnake(Collection<Part> snakePath, float angle, float distance, float partDistance) {
//        final Map<String, Object> map = new HashMap<>();
//        map.put("snakePath", snakePath);
//        map.put("angle", angle);
//        map.put("distance", distance);
//        map.put("partDistance", partDistance);
//        try {
//            final String json = OBJECT_MAPPER.writeValueAsString(map);
//            final String result = (String) NASHORN_INVOCABLE.invokeFunction("moveSnakeJava", json);
//            return OBJECT_MAPPER.readValue(result, MoveSnakeResult.class);
//        } catch (IOException | NoSuchMethodException | ScriptException e) {
//            logger.log(Level.SEVERE, e.getMessage(), e);
//            throw new RuntimeException(e);
//        }
//    }

//    @Override
//    public float computeAllowedAngle(float askedAngle, float lastAngle, long time, float baseSpeed, float speed) {
//        final Map<String, Object> map = new HashMap<>();
//        map.put("askedAngle", askedAngle);
//        map.put("lastAngle", lastAngle);
//        map.put("time", time);
//        map.put("baseSpeed", baseSpeed);
//        map.put("speed", speed);
//        try {
//            final String json = OBJECT_MAPPER.writeValueAsString(map);
//            final String result = (String) NASHORN_INVOCABLE.invokeFunction("computeAllowedAngleJava", json);
//            return Float.parseFloat(result);
//        } catch (IOException | NoSuchMethodException | ScriptException e) {
//            logger.log(Level.SEVERE, e.getMessage(), e);
//            throw new RuntimeException(e);
//        }
//    }

    @Override
    public float computeAllowedAngle(float orientationRequested, float orientationLast, long time, float speedMultiplier) {
        final Map<String, Object> map = new HashMap<>();
        map.put("orientationRequested", orientationRequested);
        map.put("orientationLast", orientationLast);
        map.put("time", time);
        map.put("speedMultiplier", speedMultiplier);
        try {
            final String json = OBJECT_MAPPER.writeValueAsString(map);
            final String result = (String) NASHORN_INVOCABLE.invokeFunction("computeAllowedAngleJava", json);
            return Float.parseFloat(result);
        } catch (IOException | NoSuchMethodException | ScriptException e) {
            logger.log(Level.SEVERE, e.getMessage(), e);
            throw new RuntimeException(e);
        }
    }

    @Override
    public MoveVehicleResult moveVehicle(float orientation, float distance, Collection<VehiclePart> parts) {
        final Map<String, Object> map = new HashMap<>();
        map.put("orientation", orientation);
        map.put("distance", distance);
        map.put("parts", parts);
        try {
            final String json = OBJECT_MAPPER.writeValueAsString(map);
            final String result = (String) NASHORN_INVOCABLE.invokeFunction("moveJava", json);
            return OBJECT_MAPPER.readValue(result, MoveVehicleResult.class);
        } catch (IOException | NoSuchMethodException | ScriptException e) {
            logger.log(Level.SEVERE, e.getMessage(), e);
            throw new RuntimeException(e);
        }
    }

//    final static private Pattern REGEX = Pattern.compile("(module\\.)?exports\\.(\\w+)");
//    private String handleExports(String content) {
//        Matcher m = REGEX.matcher(content);
//        StringBuffer sb = new StringBuffer();
//        while (m.find()) {
//            m.appendReplacement(sb, String.format("var %s", m.group(2)));
//        }
//        m.appendTail(sb);
//        return sb.toString();
//    }
}
