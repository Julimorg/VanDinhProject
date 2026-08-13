package com.example.service;

import com.example.common.dto.ImportExcelFile.Request.ImportColumnReq;
import com.example.common.dto.color.request.ColorImportItemReq;
import com.example.common.enums.ErrorCode;
import com.example.common.exception.AppException;
import com.example.common.interfaces.ImportExcelFile.ImportableExcel;
import com.example.common.interfaces.supplier.SupplierQueryInternalService;
import com.example.common.interfaces.supplier.SupplierServiceInterface;
import com.example.persistence.entity.Album;
import com.example.persistence.entity.Color;
import com.example.persistence.entity.Supplier;
import com.example.repository.AlbumRepository;
import com.example.repository.ColorRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.*;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class ColorImportHandler implements ImportableExcel<ColorImportItemReq> {

    private final ColorRepository colorRepository;

    private final AlbumRepository albumRepository;

    private final SupplierQueryInternalService supplierInternalService;

    private static final Pattern HEX_PATTERN = Pattern.compile("^#[0-9A-Fa-f]{6}$");

    private static final String COL_COLOR_NAME       = "Tên màu";
    private static final String COL_COLOR_CODE       = "Mã màu";
    private static final String COL_HEX_CODE         = "Mã Hex";
    private static final String COL_COLOR_FAMILY     = "Dòng màu";
    private static final String COL_COLOR_COLLECTION = "Bộ sưu tập";
    private static final String COL_FINISH_TYPE      = "Kiểu hoàn thiện";
    private static final String COL_IS_ACTIVE        = "Kích hoạt";
    private static final String COL_SUPPLIER_ID      = "Mã NCC";
    private static final String COL_ALBUM_ID         = "Mã Album";

    @Override
    public List<ImportColumnReq> getColumns() {
        return List.of(
                ImportColumnReq.builder()
                        .field(COL_COLOR_NAME).header(COL_COLOR_NAME).required(true)
                        .note("Tên hiển thị của màu")
                        .sample("Trắng tinh khôi")
                        .build(),

                ImportColumnReq.builder()
                        .field(COL_COLOR_CODE).header(COL_COLOR_CODE).required(true)
                        .note("Mã màu duy nhất, không được trùng trong hệ thống")
                        .sample("VD-001")
                        .build(),

                ImportColumnReq.builder()
                        .field(COL_HEX_CODE).header(COL_HEX_CODE).required(true)
                        .note("Định dạng #RRGGBB, không được trùng trong hệ thống")
                        .sample("#FFFFFF")
                        .build(),

                ImportColumnReq.builder()
                        .field(COL_COLOR_FAMILY).header(COL_COLOR_FAMILY).required(false)
                        .note("Dòng màu / nhóm màu")
                        .sample("White")
                        .build(),

                ImportColumnReq.builder()
                        .field(COL_COLOR_COLLECTION).header(COL_COLOR_COLLECTION).required(false)
                        .note("Bộ sưu tập màu")
                        .sample("Premium 2026")
                        .build(),

                ImportColumnReq.builder()
                        .field(COL_FINISH_TYPE).header(COL_FINISH_TYPE).required(false)
                        .note("Kiểu hoàn thiện bề mặt sơn")
                        .sample("Matte")
                        // finishType đang là String tự do trong entity, mình để options minh hoạ —
                        // nếu bạn có enum/danh sách cố định thì thay list này cho đúng
                        .options(List.of("Matte", "Glossy", "Semi-Gloss"))
                        .build(),

                ImportColumnReq.builder()
                        .field(COL_IS_ACTIVE).header(COL_IS_ACTIVE).required(false)
                        .note("Để trống = mặc định true (kích hoạt)")
                        .sample("true")
                        .options(List.of("true", "false"))
                        .build(),

                ImportColumnReq.builder()
                        .field(COL_SUPPLIER_ID).header(COL_SUPPLIER_ID).required(true)
                        .note("Copy ID từ sheet 'Danh mục NCC' đính kèm trong file mẫu")
                        .sample("sup-uuid-xxx")
                        .build(),

                ImportColumnReq.builder()
                        .field(COL_ALBUM_ID).header(COL_ALBUM_ID).required(false)
                        .note("Để trống nếu màu không thuộc album nào. Album phải cùng NCC với cột 'Mã NCC'")
                        .sample("album-uuid-yyy")
                        .build()
        );
    }
    private ImportColumnReq col(String header, boolean required) {
        return ImportColumnReq.builder().field(header).header(header).required(required).build();
    }

    @Override
    public ColorImportItemReq mapRow(Map<String, String> rawRow, int rowNumber) {
        return ColorImportItemReq.builder()
                .colorName(rawRow.get(COL_COLOR_NAME))
                .colorCode(rawRow.get(COL_COLOR_CODE))
                .hexCode(rawRow.get(COL_HEX_CODE))
                .colorFamily(rawRow.get(COL_COLOR_FAMILY))
                .colorCollection(rawRow.get(COL_COLOR_COLLECTION))
                .finishType(rawRow.get(COL_FINISH_TYPE))
                .isActive(parseActive(rawRow.get(COL_IS_ACTIVE)))
                .supplierId(rawRow.get(COL_SUPPLIER_ID))
                .albumId(rawRow.get(COL_ALBUM_ID))
                .build();
    }

    @Override
    public List<String> validateRow(ColorImportItemReq data, int rowNumber) {
        List<String> errors = new ArrayList<>();
        String prefix = "Dòng " + rowNumber + ": ";

        if (!StringUtils.hasText(data.getColorName())) {
            errors.add(prefix + "Tên màu không được để trống");
        }

        if (!StringUtils.hasText(data.getColorCode())) {
            errors.add(prefix + "Mã màu không được để trống");
        } else if (colorRepository.existsByColorCode(data.getColorCode())) {
            errors.add(prefix + "Mã màu '" + data.getColorCode() + "' đã tồn tại trong hệ thống");
        }

        if (!StringUtils.hasText(data.getHexCode())) {
            errors.add(prefix + "Mã Hex không được để trống");
        } else if (!HEX_PATTERN.matcher(data.getHexCode()).matches()) {
            errors.add(prefix + "Mã Hex '" + data.getHexCode() + "' sai định dạng (VD: #FFFFFF)");
        } else if (colorRepository.existsByHexCode(data.getHexCode())) {
            errors.add(prefix + "Mã Hex '" + data.getHexCode() + "' đã tồn tại trong hệ thống");
        }

        if (!StringUtils.hasText(data.getSupplierId())) {
            errors.add(prefix + "Mã NCC không được để trống");
        } else {
            try {
                supplierInternalService.getSupplierById(data.getSupplierId());
                if (StringUtils.hasText(data.getAlbumId())) {
                    validateAlbum(data.getAlbumId(), data.getSupplierId(), prefix, errors);
                }
            } catch (Exception e) {
                errors.add(prefix + "Không tìm thấy NCC với ID: " + data.getSupplierId());
            }
        }

        return errors;
    }

    private void validateAlbum(String albumId, String supplierId, String prefix, List<String> errors) {
        Album album = albumRepository.findById(albumId).orElse(null);
        if (album == null) {
            errors.add(prefix + "Không tìm thấy Album với ID: " + albumId);
        } else if (!album.getSupplier().getSupplierId().equals(supplierId)) {
            errors.add(prefix + "Album không thuộc về NCC đã chọn");
        }
    }

    @Override
    @Transactional
    public void saveAll(List<ColorImportItemReq> validData) {
        checkDuplicateInFile(validData); // duplicate trong-file không detect được ở validateRow (không có state giữa các dòng)

        List<Color> colors = validData.stream().map(this::toEntity).toList();
        colorRepository.saveAll(colors);
    }

    private Color toEntity(ColorImportItemReq item) {
        Supplier supplier = supplierInternalService.getSupplierById(item.getSupplierId());
        Album album = StringUtils.hasText(item.getAlbumId())
                ? albumRepository.getReferenceById(item.getAlbumId())
                : null;

        return Color.builder()
                .colorName(item.getColorName())
                .colorCode(item.getColorCode())
                .hexCode(item.getHexCode())
                .colorFamily(item.getColorFamily())
                .colorCollection(item.getColorCollection())
                .finishType(item.getFinishType())
                .isActive(item.getIsActive() != null ? item.getIsActive() : true)
                .supplier(supplier)
                .album(album)
                .build();
    }

    private void checkDuplicateInFile(List<ColorImportItemReq> items) {
        Set<String> seenCodes = new HashSet<>();
        Set<String> seenHex = new HashSet<>();
        for (ColorImportItemReq item : items) {
            if (!seenCodes.add(item.getColorCode()) || !seenHex.add(item.getHexCode())) {
                throw new AppException(ErrorCode.COLOR_IMPORT_DUPLICATE_IN_FILE);
            }
        }
    }

    private Boolean parseActive(String raw) {
        if (!StringUtils.hasText(raw)) return true;
        String v = raw.trim().toLowerCase();
        return !(v.equals("false") || v.equals("0") || v.equals("không") || v.equals("no"));
    }
}
