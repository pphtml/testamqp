package org.superbiz;

import org.superbiz.game.SnakePositions;
import org.superbiz.util.LoggingConfig;
import org.superbiz.util.RxWebpackProcess;
import org.superbiz.util.ThreadDumpHandler;
import org.superbiz.ws.GameHandler;
import ratpack.guice.Guice;
import ratpack.server.RatpackServer;

import java.util.logging.Logger;

public class GusanosServer {
    static {
        System.setProperty("java.util.logging.config.class", LoggingConfig.class.getName());
        System.setProperty("org.jooq.no-logo", "true");
    }

    private static final Logger logger = Logger.getLogger(GusanosServer.class.getName());

    public static void main(String[] args) throws Exception {
        // Registry.builder().add(FileRenderer.TYPE, FileRenderer.NON_CACHING);
//        final Runnable task = () -> watchResourcesDirectory();
//        new Thread(task).start();

        RatpackServer.start(server -> server
                .serverConfig(config -> config
                        .findBaseDir())
                        //.sysProps()) // not needed
                .registry(Guice.registry(bindings -> bindings
                        .bind(SnakePositions.class)
                        .bind(ThreadDumpHandler.class)
                        .bind(GameHandler.class)))
//                        .moduleConfig(ApplicationModule.class, bindings.getServerConfig().get("/user", ApplicationModule.Config.class))
//                        .moduleConfig(HikariModule.class, getHikariConfig())
//                        .module(JooqModule.class)
//                        .module(SessionModule.class, cfg -> cfg.expires(Duration.ofDays(7)).idName("BLE"))
//                        .module(ClientSideSessionModule.class, cfg -> {
//                            cfg.setSessionCookieName("rp_session");
//                            cfg.setSecretToken(Double.valueOf(Math.floor(System.currentTimeMillis() / 10000)).toString());
//                            cfg.setSecretKey("fsoiure!#478Fr?$");
//                            cfg.setMacAlgorithm("HmacSHA1");
//                            cfg.setCipherAlgorithm("AES/CBC/PKCS5Padding");
//                            cfg.setMaxSessionCookieSize(1932);
//                            cfg.setMaxInactivityInterval(Duration.ofHours(24));
//                        })
//                        .bindInstance(ClientErrorHandler.class, new CustomErrorHandler())
//                        //.bindInstance(FileRenderer.class, (FileRenderer) FileRenderer.NON_CACHING)
//                        .bind(EmployeeChainAction.class)
//                        .bind(ApiChainAction.class)
//                        .bind(SessionChainAction.class)
//                        .bindInstance(new Service() {
//                            @Override
//                            public void onStart(StartEvent event) throws Exception {
//                                RxRatpack.initialize();
//                            }
//                        })
//                ))
                .handlers(chain -> chain
                                .get("dump", ThreadDumpHandler.class)
                                .get("cores", ctx -> {
                                    int cores = Runtime.getRuntime().availableProcessors();
                                    ctx.render(String.format("cores: %d", cores));
                                })
                                .get("dot", GameHandler.class)
                                .files(f -> f.dir("static"))
                                .all(ctx -> ctx.render(ctx.file("static/index.html")))
                ));

        if (getDevMode()) {
            final Runnable task = () -> RxWebpackProcess.runWebpack();
            // final Runnable task = () -> WebpackProcess.copyResources();
            task.run();
        }
    }

    private static boolean getDevMode() {
        String devMode = System.getProperty("devMode", "true");
        return "true".equalsIgnoreCase(devMode);
    }


//    private static HikariConfig getHikariConfig() {
//        final String url = System.getenv("JDBC_DATABASE_URL");;
//        if (url == null) {
//            throw new RuntimeException("Environment variable or property JDBC_DATABASE_URL not set");
//        }
//        final HikariConfig config = new HikariConfig();
//        config.setJdbcUrl(url);
//        return config;
//    }
}
