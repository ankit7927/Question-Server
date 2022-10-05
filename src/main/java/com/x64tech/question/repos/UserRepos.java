package com.x64tech.question.repos;

import com.x64tech.question.models.user.UserModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepos extends MongoRepository<UserModel, String> {
}
