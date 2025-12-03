package com.appdevg5.ghidorakings.dishcovery.service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdevg5.ghidorakings.dishcovery.entity.CommentEntity;
import com.appdevg5.ghidorakings.dishcovery.repository.CommentRepository;

@Service
public class CommentService {

    @Autowired
    CommentRepository commentRepository;

    public CommentEntity createComment(CommentEntity comment) {
        // clear id to avoid accidental update if client sends an id
        comment.setCommentId(null);
        return commentRepository.save(comment);
    }

    public List<CommentEntity> getAllComments() {
        return commentRepository.findAll();
    }

    public CommentEntity updateComment(int commentId, CommentEntity newCommentDetails) {
        try {
            CommentEntity comment = commentRepository.findById(commentId).orElseThrow(() -> new NoSuchElementException("Comment with ID " + commentId + " not found."));
            comment.setContent(newCommentDetails.getContent());
            return commentRepository.save(comment);
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
