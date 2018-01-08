package org.superbiz.util;

import java.util.logging.Formatter;
import java.util.logging.LogRecord;

public class LoggingFormatter extends Formatter {
    @Override
    public String format(LogRecord lr) {
        final String threadName = Thread.currentThread().getName();
        return String.format("%1$tY-%1$tm-%1$td %1$tH:%1$tM:%1$tS.%1$tL %4$-4s [%7$s] %2$s %5$s %6$s%n",
                lr.getMillis(), lr.getSourceClassName(), lr.getThreadID(), lr.getLevel(), lr.getSourceMethodName(),
                lr.getMessage(), threadName);
    }
}
