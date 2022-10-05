package com.x64tech.question.controllers;

import com.x64tech.question.models.RequestModels.SignupRequest;
import com.x64tech.question.models.user.UserModel;
import com.x64tech.question.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("user")
public class UserCont {
    @Autowired
    UserService userService;

    public ResponseEntity<UserModel> signup(@RequestBody SignupRequest signupRequest){
        return userService.signup(signupRequest);
    }
}
