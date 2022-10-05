package com.x64tech.question.models.RequestModels;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class QuestionRequest {
    String question;
    String asked_by;
    String tags;
}
