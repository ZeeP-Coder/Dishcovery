package com.appdevg5.ghidorakings;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;
import com.appdevg5.ghidorakings.entity.UserEntity;
import com.appdevg5.ghidorakings.repository.UserRepository;

@SpringBootApplication
public class GhidorakingsApplication {

	public static void main(String[] args) {
		SpringApplication.run(GhidorakingsApplication.class, args);
	}

	@Bean
	CommandLineRunner initAdmin(UserRepository userRepository) {
		return args -> {
			// Check if admin already exists
			if (userRepository.findByEmail("jnfranzadin@gmail.com").isEmpty()) {
				UserEntity admin = new UserEntity();
				admin.setUsername("Admin");
				admin.setEmail("jnfranzadin@gmail.com");
				admin.setPassword("dishcoveryadmin");
				admin.setAdmin(true);
				userRepository.save(admin);
				System.out.println("Admin account created successfully!");
			} else {
				System.out.println("Admin account already exists.");
			}
		};
	}

	@Bean
	CommandLineRunner migrateImageData(JdbcTemplate jdbcTemplate) {
		return args -> {
			try {
				// Migrate data from image_url to image column
				int updated = jdbcTemplate.update(
					"UPDATE recipe SET image = image_url WHERE image IS NULL AND image_url IS NOT NULL"
				);
				System.out.println("Migrated " + updated + " recipe images from image_url to image column.");
				
				// Drop the old image_url column
				try {
					jdbcTemplate.execute("ALTER TABLE recipe DROP COLUMN image_url");
					System.out.println("Successfully dropped image_url column.");
				} catch (Exception dropException) {
					System.out.println("image_url column already dropped or doesn't exist.");
				}
			} catch (Exception e) {
				System.out.println("Image migration completed or already done.");
			}
		};
	}

}
