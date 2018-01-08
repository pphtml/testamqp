package org.superbiz.util;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

import static java.nio.file.StandardWatchEventKinds.*;

public class WatchResources {
    // http://www.baeldung.com/java-nio2-watchservice

    static {
        System.setProperty("java.util.logging.config.class", LoggingConfig.class.getName());
    }

    private static final Logger logger = Logger.getLogger(WatchResources.class.getName());

    public static void main(String[] args) throws IOException, InterruptedException {
        watchResourcesDirectory();
    }

    private static Stream<Path> listDirectories(Path path) {
        final Stream<Path> currentDirectory = Stream.of(path);
        try {
            final DirectoryStream<Path> ds = Files.newDirectoryStream(path, filterPath -> Files.isDirectory(filterPath));
            final Stream<Path> subdirectories = StreamSupport.stream(ds.spliterator(), false);
            final Stream<Path> subdirectoriesFlat = subdirectories.flatMap(d -> listDirectories(d));
            return Stream.concat(currentDirectory, subdirectoriesFlat);
        } catch (IOException e) {
            logger.log(Level.SEVERE, e.getMessage(), e);
            return currentDirectory;
        }
    }

    public static void watchResourcesDirectory() {
        final Path resourcesPath = Paths.get("src/main/resources");
        final Stream<Path> paths = listDirectories(resourcesPath);
        try {
            WatchService watchService = FileSystems.getDefault().newWatchService();
            for (Path directoryPath : paths.collect(Collectors.toList())) {
                directoryPath.register(watchService, ENTRY_MODIFY, ENTRY_CREATE, ENTRY_DELETE, OVERFLOW);
                logger.info(String.format("Started watching %s", directoryPath.toAbsolutePath()));
            }
            while (true) {
                final WatchKey watchKey = watchService.take();
                for (WatchEvent<?> pollEvent : watchKey.pollEvents()) {
                    logger.info(String.format("%s, %s", pollEvent, pollEvent.kind()));
                }
                copyResources();
            }
        } catch (IOException | InterruptedException e) {
            logger.log(Level.SEVERE, e.getMessage(), e);
        }
    }

    private static void copyResources() {
        logger.info("Starting CopyResources process");
        final Path source = Paths.get("src/main/resources");
        final Path destination = Paths.get("target/classes");

        try {
            new ProcessBuilder()
                    .command("cp", "-R", "--no-target-directory",
                            source.toAbsolutePath().toString(),
                            destination.toAbsolutePath().toString())
                    .inheritIO()
                    .directory(new File("."))
                    .start()
                    .waitFor();
        } catch (InterruptedException | IOException e) {
            e.printStackTrace();
            logger.log(Level.SEVERE, "CopyResources process stopped", e);
        }

        logger.info("CopyResources process ended");
    }
}
