package com.appdevg5.ghidorakings.service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdevg5.ghidorakings.entity.CommentEntity;
import com.appdevg5.ghidorakings.entity.UserEntity;
import com.appdevg5.ghidorakings.repository.CommentRepository;

@Service
public class CommentService {

    @Autowired
    CommentRepository commentRepository;

    @Autowired
    UserService userService;

    private void attachUsername(CommentEntity comment) {
        if (comment == null || comment.getUserId() == null) {
            return;
        }

        UserEntity user = userService.getUserById(comment.getUserId());
        if (user != null) {
            comment.setUsername(user.getUsername());
        }
    }

    public CommentEntity createComment(CommentEntity comment) {
        // clear id to avoid accidental update if client sends an id
        comment.setCommentId(null);
        CommentEntity saved = commentRepository.save(comment);
        attachUsername(saved);
        return saved;
    }

    public List<CommentEntity> getAllComments() {
        List<CommentEntity> comments = commentRepository.findAll();
        comments.forEach(this::attachUsername);
        return comments;
    }
    
    // Get comment by ID
    public CommentEntity getCommentById(int commentId) {
        CommentEntity comment = commentRepository.findById(commentId).orElse(null);
        attachUsername(comment);
        return comment;
    }

    public CommentEntity updateComment(int commentId, CommentEntity newCommentDetails) {
        try {
            CommentEntity comment = commentRepository.findById(commentId).orElseThrow(() -> new NoSuchElementException("Comment with ID " + commentId + " not found."));
            comment.setContent(newCommentDetails.getContent());
            CommentEntity updated = commentRepository.save(comment);
            attachUsername(updated);
            return updated;
        } catch (NoSuchElementException e) {
            throw e;
        }
    }

    public String deleteComment(int commentId) {
        if (commentRepository.findById(commentId).isPresent()) {
            commentRepository.deleteById(commentId);
            return "Comment with ID " + commentId + " has been deleted.";
        } else {
            return "Comment with ID " + commentId + " not found.";
        }
    }
}
