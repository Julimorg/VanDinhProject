package com.example.common.dto.color.request;

import com.example.common.dto.color.response.SupplierInColorDetailRes;
import jakarta.mail.event.MailEvent;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateAlbumReq {

    @NotBlank(message = "Album name can not be blank!")
    private String albumName;

    @NotBlank(message = "Supplier Can not be blank!")
    private String supplierId;

    private String description;

}
