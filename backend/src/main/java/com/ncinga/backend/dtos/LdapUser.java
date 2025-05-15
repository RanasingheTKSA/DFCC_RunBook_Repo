package com.ncinga.backend.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class LdapUser {

    private String email;
    private String displayName;
}
