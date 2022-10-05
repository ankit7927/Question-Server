package com.x64tech.question.models.RequestModels;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class SignupRequest {
    String name, email, password;
}
