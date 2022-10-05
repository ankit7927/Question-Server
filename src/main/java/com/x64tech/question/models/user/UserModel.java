package com.x64tech.question.models.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document("User")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class UserModel {
    @Id
    String id;
    String name, email, password;
    String[] voted_ans;
    List<UserModel.Answer> answered;

    @Setter
    @Getter
    static class Answer {
        String questionID, question;
    }

}
