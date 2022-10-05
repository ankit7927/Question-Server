package com.x64tech.question.repos;

import com.x64tech.question.models.question.QuestionModel;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface QuestionRepos extends MongoRepository<QuestionModel, String> {
}
