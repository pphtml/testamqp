package org.superbiz.game.map;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.superbiz.game.proto.Msg;

import java.io.IOException;
import java.io.InputStream;
import java.util.LinkedHashMap;
import java.util.Map;

public class MapParser {

    public static final int MAX_SECTORS_COUNT_HORIZONTAL = 1024;
    public static final int MAX_SECTORS_COUNT_VERTICAL = 256;
    public static final int SECTOR_SIZE = 3;

    enum Rule {
        NORTH {
            @Override
            void check(int x, int y, Cell cell, Msg.SectorData.Builder builder) {
                if (x == 1 && y == 0) {
                    builder.setNorth(readRoadType(cell));
                }
            }
        },
        EAST {
            @Override
            void check(int x, int y, Cell cell, Msg.SectorData.Builder builder) {
                if (x == 2 && y == 1) {
                    builder.setEast(readRoadType(cell));
                }
            }
        },
        SOUTH {
            @Override
            void check(int x, int y, Cell cell, Msg.SectorData.Builder builder) {
                if (x == 1 && y == 2) {
                    builder.setSouth(readRoadType(cell));
                }
            }
        },
        WEST {
            @Override
            void check(int x, int y, Cell cell, Msg.SectorData.Builder builder) {
                if (x == 0 && y == 1) {
                    builder.setWest(readRoadType(cell));
                }
            }
        };

        abstract void check(int x, int y, Cell cell, Msg.SectorData.Builder builder);

        private static Msg.SectorData.RoadType readRoadType(Cell cell) {
            if (cell.getCellTypeEnum() == CellType.NUMERIC) {
                switch ((int) cell.getNumericCellValue()) {
                    case 1:
                        return Msg.SectorData.RoadType.SINGLE;
                    case 2:
                        return Msg.SectorData.RoadType.DOUBLE;
                    case 3:
                        return Msg.SectorData.RoadType.TRIPLE;
                    default:
                        throw new IllegalArgumentException(String.format("Unexpected cell value: %s at %s",
                                cell, cell.getAddress().formatAsString()));
                }
            } else if (cell.getCellTypeEnum() == CellType.BLANK) {
                return Msg.SectorData.RoadType.NONE;
            } else {
                throw new IllegalArgumentException(String.format("Unexpected cell type: %s at %s",
                        cell.getCellTypeEnum(), cell.getAddress().formatAsString()));
            }
        }

    }

    public static void main(String[] args) throws IOException {
        Map<String, Msg.SectorData> map = new MapParser().read();
    }

    public Map<String, Msg.SectorData> read() {
        try {
            return read("/map/map.xlsx");
        } catch (IOException e) {
            throw new IllegalArgumentException(e);
        }
    }

    private Map<String, Msg.SectorData> read(String location) throws IOException {
        Map<String, Msg.SectorData> result = new LinkedHashMap<>();
        final InputStream inputStream = MapParser.class.getResourceAsStream(location);
        Workbook workbook = new XSSFWorkbook(inputStream);

        Sheet sheet = workbook.getSheetAt(0);
        int width = extractWidth(sheet) / SECTOR_SIZE;
        int height = extractHeight(sheet) / SECTOR_SIZE;

        for (int y = 0; y < height; y++) {
            for (int x = 0; x < width; x++) {
                result.put(composeKey(x, y), readSectorData(sheet, x, y));
            }
        }
        return result;
    }

    private Msg.SectorData readSectorData(Sheet sheet, int sectorX, int sectorY) {
        int baseX = sectorX * SECTOR_SIZE, baseY = sectorY * SECTOR_SIZE;
        Msg.SectorData.Builder result = Msg.SectorData.newBuilder();
        for (int y = 0; y < SECTOR_SIZE; y++) {
            Row row = sheet.getRow(baseY + y);
            for (int x = 0; x < SECTOR_SIZE; x++) {
                final Cell cell = row.getCell(baseX + x);
                for (Rule rule : Rule.values()) {
                    rule.check(x, y, cell, result);
                }
            }
        }
        return result.build();
    }

    private String composeKey(int x, int y) {
        return String.format("%d,%d", x, y);
    }

    private int extractWidth(Sheet sheet) {
        final Row row = sheet.getRow(0);
        for (int columnIndex = 0; columnIndex < MAX_SECTORS_COUNT_HORIZONTAL * SECTOR_SIZE; columnIndex++) {
            final Cell cell = row.getCell(columnIndex);
            if (cell.getCellTypeEnum() == CellType.STRING && "EOL".equals(cell.getStringCellValue())) {
                return columnIndex;
            }
        }
        throw new IllegalArgumentException("Missing EOL in first row");
    }

    private int extractHeight(Sheet sheet) {
        for (int rowIndex = 0; rowIndex < MAX_SECTORS_COUNT_VERTICAL * SECTOR_SIZE; rowIndex++) {
            final Row row = sheet.getRow(rowIndex);
            final Cell cell = row.getCell(0);
            if (cell.getCellTypeEnum() == CellType.STRING && "EOC".equals(cell.getStringCellValue())) {
                return rowIndex;
            }
        }
        throw new IllegalArgumentException("Missing EOC in first column");
    }
}
