package com.learnhub.config;
import com.learnhub.model.Category;
import com.learnhub.model.User;
import com.learnhub.repository.CategoryRepository;
import com.learnhub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
@Component
public class DataInitializer implements CommandLineRunner {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @Override
    public void run(String... args) throws Exception {
        // Create admin user if not exists
        if (!userRepository.findByEmail("admin@learnhub.com").isPresent()) {
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

            User admin = new User();
            admin.setName("Admin");
            admin.setEmail("admin@learnhub.com");
            admin.setPassword(encoder.encode("admin123"));
            admin.setRole("ADMIN");
            admin.setActive(true);
            admin.setCreatedAt(LocalDateTime.now());
            userRepository.save(admin);
        }
        // Create default categories
        createCategoryIfNotExists("Web Development", "Learn web development with HTML, CSS, JavaScript, and modern frameworks", "🌐");
        createCategoryIfNotExists("Mobile Development", "Build iOS and Android apps with React Native, Flutter, and more", "📱");
        createCategoryIfNotExists("Data Science", "Master data analysis, machine learning, and AI", "📊");
        createCategoryIfNotExists("Business & Entrepreneurship", "Learn business skills and start your own company", "💼");
        createCategoryIfNotExists("Design", "Master UI/UX design, graphic design, and design tools", "🎨");
        createCategoryIfNotExists("Marketing", "Learn digital marketing, SEO, social media, and content marketing", "📢");
        createCategoryIfNotExists("Photography", "Master photography techniques and photo editing", "📷");
        createCategoryIfNotExists("Music", "Learn music production, instruments, and music theory", "🎵");
        createCategoryIfNotExists("Health & Fitness", "Get fit with workout routines and nutrition guides", "💪");
        createCategoryIfNotExists("Personal Development", "Improve your skills and boost your career", "🌟");
    }
    private void createCategoryIfNotExists(String name, String description, String icon) {
        if (!categoryRepository.findByName(name).isPresent()) {
            Category category = new Category();
            category.setName(name);
            category.setDescription(description);
            category.setIcon(icon);
            category.setCreatedAt(LocalDateTime.now());
            categoryRepository.save(category);
        }
    }
}