package com.x64tech.question.services;


import com.x64tech.question.models.RequestModels.AnswerRequest;
import com.x64tech.question.models.RequestModels.QuestionRequest;
import com.x64tech.question.models.question.AnswerModel;
import com.x64tech.question.models.question.QuestionModel;

import com.x64tech.question.repos.QuestionRepos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class QuestionService {
    @Autowired
    QuestionRepos questionRepos;

    public List<QuestionModel> getAllQuestions(){
        return questionRepos.findAll();
    }

    public QuestionModel getQuestionByID(String id){
        Optional<QuestionModel> optional = questionRepos.findById(id);
        return optional.orElse(null);
    }

    public ResponseEntity<?> addQuestion(QuestionRequest questionRequest){
        QuestionModel questionModel = new QuestionModel();
        questionModel.setQuestion(questionRequest.getQuestion());
        questionModel.setAsked_by(questionRequest.getAsked_by());
        questionModel.setAsked_date(new Date());
        questionModel.setTags(questionRequest.getTags().split(","));

        QuestionModel save = questionRepos.save(questionModel);
        return ResponseEntity.ok(save);
    }

    public void deleteQuestion(String id){
        questionRepos.deleteById(id);
    }

    public ResponseEntity<?> addAnswer(AnswerRequest answerRequest){
        AnswerModel answerModel = new AnswerModel();
        answerModel.setId(UUID.randomUUID().toString());
        answerModel.setAnswer(answerRequest.getAnswer());
        answerModel.setAnswered_by(answerRequest.getAnswered_by());
        QuestionModel questionModel;
        Optional<QuestionModel> optional = questionRepos.findById(answerRequest.getQuestionID());
        if (optional.isPresent()){
            questionModel=optional.get();
            List<AnswerModel> temp = questionModel.getAnswers();
            if (temp==null){
                questionModel.setAnswers(List.of(answerModel));
            }else {
                temp.add(answerModel);
                questionModel.setAnswers(temp);
            }
            questionRepos.save(questionModel);
            return ResponseEntity.ok(questionModel);
        }else{
            return ResponseEntity.ok("question not found");
        }
    }

    //public void voteAnswer()
}
