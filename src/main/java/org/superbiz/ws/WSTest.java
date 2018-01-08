package org.superbiz.ws;

import com.google.common.collect.Maps;
import org.reactivestreams.Publisher;
import org.superbiz.util.LoggingConfig;
import ratpack.form.Form;
import ratpack.rx.RxRatpack;
import ratpack.server.BaseDir;
import ratpack.server.RatpackServer;
import ratpack.server.Service;
import ratpack.server.StartEvent;
import ratpack.websocket.WebSockets;
import rx.subjects.PublishSubject;

import java.util.Map;
import java.util.logging.Logger;

public class WSTest {

    static {
        System.setProperty("java.util.logging.config.class", LoggingConfig.class.getName());
    }

    private static final Logger logger = Logger.getLogger(WSTest.class.getName());

    static class StreamContainer implements Service {
        enum StreamType { A, B, C }

        private Map<StreamType, PublishSubject<String>> streamStorage = Maps.newHashMap();

        public void onStart(StartEvent event) {
            for (StreamType t : StreamType.values()) {
                streamStorage.put(t, PublishSubject.<String>create());
            }
        }

        public void publish(StreamType type, String message) {
            streamStorage.get(type).onNext(message);
        }

        public Publisher<String> getStream(StreamType t) {
            return RxRatpack.publisher(streamStorage.get(t));
        }
    }

    public static void main(String[] args) throws Exception {
        RatpackServer.start(spec -> spec
                .serverConfig(sbuild -> sbuild
                        .baseDir(BaseDir.find())
                )
                .registryOf(rspec -> rspec
                        .add(new StreamContainer())
                )
                .handlers(chain -> chain
                        .post("message", ctx -> {
                            StreamContainer container = ctx.get(StreamContainer.class);
                            ctx.parse(Form.class).then(form -> {
                                String type = form.get("type");
                                String message = form.get("message");
                                logger.info(String.format("For type %s received: %s", type, message));
                                StreamContainer.StreamType st = StreamContainer.StreamType.valueOf(type);
                                container.publish(st, message);
                                ctx.getResponse().send();
                            });
                        })
                        .get("ws/:type?", ctx -> {
                            StreamContainer container = ctx.get(StreamContainer.class);
                            StreamContainer.StreamType type = StreamContainer.StreamType.valueOf(ctx.getPathTokens().getOrDefault("type", "A"));
                            logger.info(String.format("Creating type: %s", type));
                            WebSockets.websocketBroadcast(ctx, container.getStream(type));
                        })
                        .files(fspec -> fspec
                                .dir("static").indexFiles("ws-index.html")
                        )
                )
        );
    }
}
