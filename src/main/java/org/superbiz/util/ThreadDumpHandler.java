package org.superbiz.util;

import ratpack.handling.Context;
import ratpack.handling.Handler;

import javax.inject.Inject;
import java.lang.management.ManagementFactory;
import java.lang.management.ThreadInfo;
import java.lang.management.ThreadMXBean;
import java.util.logging.Logger;

public class ThreadDumpHandler implements Handler {
    @Inject
    Logger logger;

    @Override
    public void handle(Context ctx) {
        dumpAllThreads();
        ctx.render("Hello world");
    }

    public void dumpAllThreads() {
        ThreadMXBean threadMxBean = ManagementFactory.getThreadMXBean();
        for (ThreadInfo ti : threadMxBean.dumpAllThreads(true, true)) {
            logger.info(ti.toString());
        }
    }
}
