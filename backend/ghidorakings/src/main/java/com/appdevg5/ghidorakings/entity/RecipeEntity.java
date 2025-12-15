package com.appdevg5.ghidorakings.entity;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;

@Entity
@Table(name = "recipe")

public class RecipeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "recipe_id")
    private Integer recipeId;

    @Column(name = "title")
    private String title;

    @Column(name = "description", length = 5000, columnDefinition = "VARCHAR(5000)")
    private String description;

    @Column(name = "steps", length = 5000, columnDefinition = "VARCHAR(5000)")
    private String steps;

    @Column(name = "user_id")
    private Integer userId;

    // legacy storage; kept to preserve schema but not used by API payload
    @JsonIgnore
    @Column(name = "ingredients", columnDefinition = "TEXT")
    private String ingredientsJson;

    // Transient list to receive/send ingredients via IngredientEntity payloads
    @Transient
    private List<IngredientEntity> ingredients;

    @Column(name = "category")
    private String category;

    @Column(name = "difficulty")
    private String difficulty;

    @JsonProperty("cookTimeMinutes")
    @Column(name = "cook_time_minutes")
    private Integer cookTimeMinutes;

    @Column(name = "image", columnDefinition = "LONGTEXT")
    private String image;

    @Column(name = "estimated_price")
    private Double estimatedPrice;

    @Column(name = "is_approved")
    private boolean isApproved = false;

    public RecipeEntity() {
        super();
    }

    public Integer getRecipeId() {
        return recipeId;
    }

    public void setRecipeId(Integer recipeId) {
        this.recipeId = recipeId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSteps() {
        return steps;
    }

    public void setSteps(String steps) {
        this.steps = steps;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getIngredientsJson() {
        return ingredientsJson;
    }

    public void setIngredientsJson(String ingredientsJson) {
        this.ingredientsJson = ingredientsJson;
    }

    @JsonProperty("ingredients")
    public List<IngredientEntity> getIngredients() {
        if (ingredients != null) {
            return ingredients;
        }
        if (ingredientsJson != null) {
            return convertToIngredientList(ingredientsJson);
        }
        return null;
    }

    @JsonProperty("ingredients")
    public void setIngredients(Object ingredients) {
        this.ingredients = convertToIngredientList(ingredients);
        if (ingredients instanceof String) {
            this.ingredientsJson = (String) ingredients;
        }
    }

    private List<IngredientEntity> convertToIngredientList(Object raw) {
        if (raw == null) {
            return null;
        }

        List<IngredientEntity> result = new ArrayList<>();

        if (raw instanceof List<?>) {
            for (Object item : (List<?>) raw) {
                if (item == null) continue;
                if (item instanceof IngredientEntity) {
                    result.add((IngredientEntity) item);
                } else if (item instanceof String) {
                    IngredientEntity ing = new IngredientEntity();
                    ing.setName(((String) item).trim());
                    result.add(ing);
                } else if (item instanceof Map<?, ?>) {
                    Map<?, ?> mapItem = (Map<?, ?>) item;
                    IngredientEntity ing = new IngredientEntity();
                    Object name = mapItem.get("name");
                    Object qty = mapItem.get("quantity");
                    if (name != null) {
                        ing.setName(name.toString().trim());
                    }
                    if (qty != null) {
                        ing.setQuantity(qty.toString());
                    }
                    result.add(ing);
                }
            }
            return result;
        }

        if (raw instanceof String) {
            String rawJson = (String) raw;
            // Simple JSON array parsing for ingredients ["item1", "item2"]
            if (rawJson.trim().startsWith("[") && rawJson.trim().endsWith("]")) {
                String content = rawJson.trim().substring(1, rawJson.trim().length() - 1);
                if (!content.trim().isEmpty()) {
                    String[] parts = content.split(",");
                    for (String part : parts) {
                        String cleaned = part.trim().replaceAll("^\"|\"$", "");
                        if (!cleaned.isEmpty()) {
                            IngredientEntity ing = new IngredientEntity();
                            ing.setName(cleaned);
                            result.add(ing);
                        }
                    }
                }
            }
            return result.isEmpty() ? null : result;
        }

        return result.isEmpty() ? null : result;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public Integer getCookTimeMinutes() {
        return cookTimeMinutes;
    }

    public void setCookTimeMinutes(Integer cookTimeMinutes) {
        this.cookTimeMinutes = cookTimeMinutes;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Double getEstimatedPrice() {
        return estimatedPrice;
    }

    public void setEstimatedPrice(Double estimatedPrice) {
        this.estimatedPrice = estimatedPrice;
    }

    public boolean isApproved() {
        return isApproved;
    }

    public void setApproved(boolean isApproved) {
        this.isApproved = isApproved;
    }
}