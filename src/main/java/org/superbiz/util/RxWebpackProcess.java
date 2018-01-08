package org.superbiz.util;

import rx.Observable;
import rx.functions.Action1;
import rx.subjects.PublishSubject;

import java.io.*;
import java.math.BigDecimal;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class RxWebpackProcess {
    static {
        System.setProperty("java.util.logging.config.class", LoggingConfig.class.getName());
    }

    private static final Logger logger = Logger.getLogger(RxWebpackProcess.class.getName());

    interface Node {
        String getText();
    }

    static class NodeInterval implements Node {
        private final Long ordinal;

        private NodeInterval(Long ordinal) {
            this.ordinal = ordinal;
        }

        public static NodeInterval of(Long ordinal) {
            return new NodeInterval(ordinal);
        }

        @Override
        public String toString() {
            final StringBuilder sb = new StringBuilder("NodeInterval{");
            sb.append("ordinal=").append(ordinal);
            sb.append('}');
            return sb.toString();
        }

        @Override
        public String getText() {
            throw new UnsupportedOperationException();
        }
    }

    static class NodeText implements Node {
        private final String text;

        private NodeText(String text) {
            this.text = text;
        }

        public static NodeText of(String text) {
            return new NodeText(text);
        }

        @Override
        public String toString() {
            final StringBuilder sb = new StringBuilder("NodeText{");
            sb.append("text='").append(text).append('\'');
            sb.append('}');
            return sb.toString();
        }

        @Override
        public String getText() {
            return this.text;
        }
    }

    public static void main(String[] args) throws IOException, InterruptedException {
        //dummyExample();
        runWebpack();
    }

//    private static void dummyExample() throws InterruptedException {
//        final Observable<Node> observableInterval = Observable
//                .interval(1, TimeUnit.SECONDS)
//                .map(l -> NodeInterval.of(l));
//        final Observable<Node> observableText = Observable
//                .interval(200, TimeUnit.MILLISECONDS)
//                .map(l -> NodeText.of(l.toString()));
//        final Observable<Node> observableCombined = observableInterval.mergeWith(observableText);
//
//        final Action1<Node> subscriber = subscriber();
//        //observableCombined.subscribe(l -> System.out.println(l));
//        observableCombined.subscribe(subscriber);
//        Thread.sleep(5000);
//    }

    private static Action1<Node> subscriber() {
        return new Action1<Node>() {
                private long lastUpdateText = -1;
                private long lastUpdateInterval = -1;
                private StringBuilder stringBuilder = new StringBuilder();
                private boolean emptyBuilder = true;

                @Override
                public void call(Node node) {
                    if (node instanceof NodeInterval) {
                        this.lastUpdateInterval = System.currentTimeMillis();
                        if (lastUpdateText > -1) {
                            if (!emptyBuilder && lastUpdateInterval - lastUpdateText > 75) {
                                log(stringBuilder.toString());
                                this.stringBuilder = new StringBuilder();
                                this.emptyBuilder = true;
                            }
                        }
                    } else if (node instanceof NodeText) {
                        if (!emptyBuilder) {
                            this.stringBuilder.append('\n');
                        } else {
                            this.emptyBuilder = false;
                        }
                        this.stringBuilder.append(node.getText());
                        this.lastUpdateText = System.currentTimeMillis();
                    }
                }
            };
    }

    // Version:\s*.+ ([0-9\.]+)\s*Time:\s*(\d+)ms[\s\S]*?build\.js\s*([0-9\.]+)\s*MB[\s\S]*?($|ERROR[\s\S]*)
    private static final Pattern PATTERN = Pattern.compile("Version:\\s*.+ ([0-9\\.]+)\\s*" +
            "Time:\\s*(\\d+)ms[\\s\\S]*?" +
            "build\\.js\\s*([0-9\\.]+)\\s*MB[\\s\\S]*?" +
            "($|ERROR[\\s\\S]*)");

    private static void log(final String webpackChunk) {
        if (webpackChunk.indexOf("is watching") != -1) {
            logger.info("Webpack background process started");
        } else {
            final Matcher matcher = PATTERN.matcher(webpackChunk);
            if (matcher.find()) {
                // final String version = matcher.group(1);
                final int time = Integer.parseInt(matcher.group(2));
                final BigDecimal size = new BigDecimal(matcher.group(3));
                final String error = matcher.group(4);
                if (error == null || error.isEmpty()) {
                    logger.info(String.format("Webpack build: %d ms, %s MB", time, size));
                } else {
                    logger.info(String.format("Webpack build: %d ms, %s MB\n%s", time, size, error));
                }
            } else {
                logger.warning(String.format("Unrecognized Webpack text chunk: %s", webpackChunk));
            }
        }
    }

    public static void runWebpack() {
        logger.info("Starting Webpack process");

        try {
            PublishSubject<Node> observableText = PublishSubject.create();
            final Observable<Node> observableInterval = Observable
                    .interval(50, TimeUnit.MILLISECONDS)
                    .map(l -> NodeInterval.of(l));

            final Observable<Node> observableCombined = observableText.mergeWith(observableInterval);

            final Process process = new ProcessBuilder()
                    .command("node/node",
                            "node_modules/webpack/bin/webpack.js",
                            "--watch",
                            "--color=false")
                    .redirectInput(ProcessBuilder.Redirect.PIPE)
                    .redirectErrorStream(true)
                    //.redirectError(ProcessBuilder.Redirect.PIPE)
                    .directory(new File("src/main/frontend"))
                    .start();

            new Thread(() -> {
                try (final InputStream stdOut = process.getInputStream();
                     final InputStreamReader isr = new InputStreamReader(stdOut);
                     final BufferedReader br = new BufferedReader(isr)) {
                    String line;
                    while ((line = br.readLine()) != null) {
                        // logger.info(String.format("-> %s", line));
                        observableText.onNext(NodeText.of(line));
                    }
                } catch (IOException e) {
                    logger.log(Level.SEVERE, null, e);
                }
            }).start();

//            new Thread(() -> {
//                try (final InputStream stdErr = process.getErrorStream();
//                     final InputStreamReader isr = new InputStreamReader(stdErr);
//                     final BufferedReader br = new BufferedReader(isr)) {
//                    String line;
//                    while ((line = br.readLine()) != null) {
//                        logger.info(String.format("STDERR -> %s", line));
//                        //observableText.onNext(NodeText.of(line));
//                    }
//                } catch (IOException e) {
//                    logger.log(Level.SEVERE, null, e);
//                }
//            }).start();

            observableCombined.subscribe(subscriber());

            process.waitFor();
        } catch (IOException | InterruptedException e) {
            logger.log(Level.SEVERE, "Webpack process stopped", e);
        }

        logger.info("Exiting Webpack process");
    }
}
