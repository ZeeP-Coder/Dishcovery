package com.appdevg5.ghidorakings.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.appdevg5.ghidorakings.entity.CommentEntity;
import com.appdevg5.ghidorakings.service.CommentService;

@RestController
@RequestMapping("/comment") 
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class CommentController {

    @Autowired
    CommentService commentService;

    @PostMapping("/insertComment")
    public CommentEntity insertComment(@RequestBody CommentEntity commentEntity) {
        return commentService.createComment(commentEntity);
    }

    @GetMapping("/getAllComments")
    public List<CommentEntity> getAllComments() {
        return commentService.getAllComments();
    }

    @PutMapping("/updateComment")
    public CommentEntity updateComment(@RequestParam int commentId, @RequestBody CommentEntity newCommentDetails) {
        return commentService.updateComment(commentId, newCommentDetails);
    }

    @DeleteMapping("/deleteComment/{commentId}")
    public String deleteComment(@PathVariable int commentId) {
        return commentService.deleteComment(commentId);
    }
}
