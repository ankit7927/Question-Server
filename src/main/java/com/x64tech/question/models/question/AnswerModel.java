package com.x64tech.question.models.question;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("Answer")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class AnswerModel {
    @Id
    String id;
    String answer;
    String answered_by;
    String[] vote;
}
