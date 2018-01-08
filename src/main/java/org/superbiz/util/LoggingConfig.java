package org.superbiz.util;

import java.io.InputStream;
import java.util.logging.LogManager;

public class LoggingConfig {
    public LoggingConfig() {
        try {
            final LogManager logManager = LogManager.getLogManager();
            final boolean herokuLogging = System.getProperty("herokuLogging", "").equals("true");
            final String propertyFile = !herokuLogging ? "/logging.properties" : "/logging.heroku.properties";
            try (final InputStream is = getClass().getResourceAsStream(propertyFile)) {
                logManager.readConfiguration(is);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
