package com.x64tech.question.models.RequestModels;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class AnswerRequest {
    String questionID;
    String answer;
    String answered_by;
}
