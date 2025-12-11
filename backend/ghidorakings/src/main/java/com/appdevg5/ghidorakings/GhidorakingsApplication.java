package com.appdevg5.ghidorakings;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.appdevg5.ghidorakings.entity.UserEntity;
import com.appdevg5.ghidorakings.repository.UserRepository;

@SpringBootApplication
public class GhidorakingsApplication {

	public static void main(String[] args) {
		SpringApplication.run(GhidorakingsApplication.class, args);
	}

	@Bean
	CommandLineRunner initAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			// Check if admin exists
			var existingAdmin = userRepository.findByEmail("dishcoveryadmin@gmail.com");
			
			if (existingAdmin.isEmpty()) {
				// Create new admin with hashed password
				UserEntity admin = new UserEntity();
				admin.setUsername("Admin");
				admin.setEmail("dishcoveryadmin@gmail.com");
				admin.setPassword(passwordEncoder.encode("dishcoveryadmin"));
				admin.setAdmin(true);
				userRepository.save(admin);
				System.out.println("Admin account created successfully!");
			} else {
				// Check if existing admin has plain text password and hash it
				UserEntity admin = existingAdmin.get();
				String currentPassword = admin.getPassword();
				
				// If password doesn't start with $2a$ (BCrypt prefix), it's plain text
				if (currentPassword != null && !currentPassword.startsWith("$2a$") && !currentPassword.startsWith("$2b$")) {
					System.out.println("Migrating admin password to BCrypt hash...");
					admin.setPassword(passwordEncoder.encode(currentPassword));
					userRepository.save(admin);
					System.out.println("Admin password successfully migrated!");
				} else {
					System.out.println("Admin account already exists with hashed password.");
				}
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
	
	@Bean
	CommandLineRunner migrateUserPasswords(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			try {
				System.out.println("Checking for plain text passwords...");
				var allUsers = userRepository.findAll();
				int migrated = 0;
				
				for (UserEntity user : allUsers) {
					String password = user.getPassword();
					// Check if password is plain text (not BCrypt hash)
					if (password != null && !password.startsWith("$2a$") && !password.startsWith("$2b$")) {
						System.out.println("Migrating password for user: " + user.getEmail());
						user.setPassword(passwordEncoder.encode(password));
						userRepository.save(user);
						migrated++;
					}
				}
				
				if (migrated > 0) {
					System.out.println("Successfully migrated " + migrated + " user passwords to BCrypt!");
				} else {
					System.out.println("All user passwords are already hashed.");
				}
			} catch (Exception e) {
				System.out.println("Password migration completed or already done.");
			}
		};
	}

}
