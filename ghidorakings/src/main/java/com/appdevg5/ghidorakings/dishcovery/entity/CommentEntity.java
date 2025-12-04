package com.appdevg5.ghidorakings.dishcovery.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "comment")
public class CommentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_id")
    private Integer commentId;

    @Column(name = "content", length = 2000)
    private String content;

    @Column(name = "datetime_created_at")
    private LocalDateTime datetimeCreatedAt;

    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "recipe_id")
    private Integer recipeId;

    public CommentEntity() {}

    @PrePersist
    protected void onCreate() {
        if (this.datetimeCreatedAt == null) {
            this.datetimeCreatedAt = LocalDateTime.now();
        }
    }

    public Integer getCommentId() {
        return commentId;
    }

    public void setCommentId(Integer commentId) {
        this.commentId = commentId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getDatetimeCreatedAt() {
        return datetimeCreatedAt;
    }

    public void setDatetimeCreatedAt(LocalDateTime datetimeCreatedAt) {
        this.datetimeCreatedAt = datetimeCreatedAt;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getRecipeId() {
        return recipeId;
    }

    public void setRecipeId(Integer recipeId) {
        this.recipeId = recipeId;
    }
}
