package com.x64tech.question.models.question;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.util.Date;
import java.util.List;

@Document("Question")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class QuestionModel {
    @MongoId
    String id;
    String question;
    String asked_by;
    Date asked_date;
    String[] tags;
    List<AnswerModel> answers;
}
