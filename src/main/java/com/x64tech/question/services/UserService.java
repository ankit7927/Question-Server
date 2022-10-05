package com.x64tech.question.services;

import com.x64tech.question.models.RequestModels.SignupRequest;
import com.x64tech.question.models.user.UserModel;
import com.x64tech.question.repos.UserRepos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    UserRepos userRepos;

    public ResponseEntity<UserModel> signup(SignupRequest signupRequest){
        UserModel userModel = new UserModel();
        userModel.setName(signupRequest.getName());
        userModel.setEmail(signupRequest.getEmail());
        userModel.setPassword(signupRequest.getPassword());

        UserModel save = userRepos.save(userModel);

        return ResponseEntity.ok(save);

    }

}
