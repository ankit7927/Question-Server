package com.x64tech.question.controllers;

import com.x64tech.question.models.RequestModels.AnswerRequest;
import com.x64tech.question.models.RequestModels.QuestionRequest;
import com.x64tech.question.models.question.QuestionModel;
import com.x64tech.question.services.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("qna")
public class QuestionCont {

    @Autowired
    QuestionService questionService;


    @GetMapping("/question")
    public List<QuestionModel> getAllQuestion(){
        return questionService.getAllQuestions();
    }

    @GetMapping("/question/{quesID}")
    public QuestionModel getQuestionByID(@PathVariable("quesID") String id){
        return questionService.getQuestionByID(id);
    }

    @PostMapping("/question")
    public ResponseEntity<?> addQuestion(@RequestBody QuestionRequest questionRequest){
        return questionService.addQuestion(questionRequest);
    }

    @DeleteMapping("/question/{quesID}")
    public ResponseEntity<?> deleteQuestion(@PathVariable("quesID") String id){
        questionService.deleteQuestion(id);
        return ResponseEntity.ok("question deleted");
    }

    @PostMapping("/answer")
    public ResponseEntity<?> addAnswer(@RequestBody AnswerRequest answerRequest){
        return questionService.addAnswer(answerRequest);
    }

}
