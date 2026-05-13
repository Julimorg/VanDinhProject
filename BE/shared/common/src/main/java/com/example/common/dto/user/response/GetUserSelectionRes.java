package com.example.common.dto.user.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GetUserSelectionRes {
    private String id;
    private String userName;
    private String firstName;
    private String lastName;
}
