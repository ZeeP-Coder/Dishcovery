# 🍽️ Dishcovery - Recipe Sharing & Discovery Platform

![Dishcovery Banner](https://img.shields.io/badge/Dishcovery-Recipe%20Platform-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-green)
![React](https://img.shields.io/badge/React-18.x-blue)
![MySQL](https://img.shields.io/badge/MySQL-8.x-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Installation Guide](#installation-guide)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Database Configuration](#database-configuration)
- [API Documentation](#api-documentation)
- [User Guide](#user-guide)
- [Admin Guide](#admin-guide)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)
- [License](#license)
- [Contact](#contact)

---

## 🌟 Overview

**Dishcovery** is a comprehensive recipe sharing and discovery platform designed to bring food enthusiasts together. The platform allows users to explore, share, and manage their favorite recipes while providing administrators with powerful tools to moderate content and manage the community.

### Mission Statement

Our mission is to create a vibrant community where culinary creativity meets technology, enabling users worldwide to share their cooking experiences and discover new flavors.

### Key Highlights

- **User-Friendly Interface**: Intuitive design for seamless recipe browsing and creation
- **Advanced Search**: Find recipes by ingredients, categories, and price range
- **Social Features**: Rate, comment, and favorite recipes
- **Admin Dashboard**: Comprehensive management tools for platform oversight
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Image Support**: Upload and display high-quality recipe images
- **Real-Time Updates**: Dynamic content updates without page refresh

---

## ✨ Features

### For Users

#### Recipe Management
- **Create Recipes**: Add detailed recipes with ingredients, steps, images, and pricing
- **Edit & Delete**: Full control over your recipe submissions
- **Image Upload**: Support for device image selection with base64 encoding
- **Category Organization**: Organize recipes by cuisine type (Filipino, Japanese, Italian, etc.)
- **Price Estimation**: Add estimated cost for ingredient budgeting

#### Discovery & Interaction
- **Browse Recipes**: Explore approved recipes from the community
- **Search & Filter**: Advanced search by ingredients, category, and price range
- **Favorites**: Save recipes to your personal collection
- **Rating System**: Rate recipes from 1 to 5 stars
- **Comments**: Share feedback and cooking tips
- **User Profiles**: Manage your account and view your contributions

#### Personalization
- **My Recipes**: View all your submitted recipes (pending and approved)
- **Dashboard**: Quick access to your favorites and recent activity
- **Theme Toggle**: Switch between light and dark modes
- **Profile Customization**: Update username, email, and password

### For Administrators

#### Platform Management
- **Admin Dashboard**: Comprehensive overview with statistics and analytics
- **Recipe Moderation**: Review, approve, or reject recipe submissions
- **Bulk Actions**: Approve, reject, or delete multiple recipes at once
- **User Management**: View users, promote to admin, or remove accounts
- **Content Moderation**: Monitor and moderate user comments
- **Analytics**: View platform statistics and engagement metrics

#### Advanced Features
- **Quick Actions**: Fast access to pending approvals and management tools
- **Data Export**: Download complete platform backup in JSON format
- **Role Management**: Promote users to admin or demote admins
- **Top Contributors**: Track most active recipe creators
- **Category Analytics**: View recipe distribution by category
- **Engagement Metrics**: Monitor user activity and platform health

---

## 🛠️ Technology Stack

### Backend Technologies

#### Core Framework
- **Spring Boot 3.x**: Enterprise-grade Java framework
- **Spring Data JPA**: Object-relational mapping and database operations
- **Hibernate**: ORM implementation for MySQL integration
- **Spring Web**: RESTful API development
- **Maven**: Dependency management and build automation

#### Database
- **MySQL 8.x**: Relational database management system
- **JDBC**: Database connectivity
- **SQL**: Query language for data operations

#### Key Libraries
- **Jakarta Persistence**: JPA implementation
- **Lombok**: Reduce boilerplate code
- **Spring Boot DevTools**: Development-time features

### Frontend Technologies

#### Core Framework
- **React 18.x**: Modern UI library
- **React Router DOM**: Client-side routing
- **React Hooks**: State and lifecycle management

#### Styling
- **CSS3**: Custom styling with modern features
- **CSS Grid & Flexbox**: Responsive layouts
- **CSS Animations**: Smooth transitions and effects
- **Media Queries**: Mobile-responsive design

#### Development Tools
- **npm**: Package manager
- **Babel**: JavaScript transpiler
- **Webpack**: Module bundler
- **ESLint**: Code quality and style checker

### Development Tools
- **Git**: Version control
- **GitHub**: Code repository hosting
- **VS Code**: Recommended IDE
- **Postman**: API testing
- **MySQL Workbench**: Database administration

---

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │   React Frontend (Port 3000)                         │  │
│  │   - Components  - Pages  - API Client  - State Mgmt  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↕ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │   Spring Boot Backend (Port 8080)                    │  │
│  │   - Controllers  - Services  - Repositories          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↕ JDBC
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │   MySQL Database (Port 3306)                         │  │
│  │   - Tables  - Indexes  - Relationships               │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Component Interaction Flow

1. **User Interface**: React components render UI and handle user interactions
2. **API Client**: Frontend makes HTTP requests to backend endpoints
3. **REST Controllers**: Spring Boot controllers receive and validate requests
4. **Service Layer**: Business logic processes data and enforces rules
5. **Repository Layer**: JPA repositories interact with database
6. **Database**: MySQL stores and retrieves persistent data
7. **Response**: Data flows back through layers to UI

---

## 📥 Installation Guide

### Prerequisites

Before you begin, ensure you have the following installed:

- **Java Development Kit (JDK) 17 or higher**
  ```bash
  java -version
  ```

- **Node.js 16.x or higher and npm**
  ```bash
  node -v
  npm -v
  ```

- **MySQL 8.x or higher**
  ```bash
  mysql --version
  ```

- **Git**
  ```bash
  git --version
  ```

- **Maven 3.6 or higher** (optional, wrapper included)
  ```bash
  mvn -v
  ```

### Clone Repository

```bash
# Clone the repository
git clone https://github.com/ZeeP-Coder/Dishcovery.git

# Navigate to project directory
cd Dishcovery
```

---

## 🔧 Backend Setup

### Step 1: Database Configuration

1. **Create MySQL Database**
   ```sql
   CREATE DATABASE dishcovery_db;
   USE dishcovery_db;
   ```

2. **Configure Database Connection**
   
   Navigate to `backend/ghidorakings/src/main/resources/application.properties`
   
   ```properties
   # Database Configuration
   spring.datasource.url=jdbc:mysql://localhost:3306/dishcovery_db
   spring.datasource.username=root
   spring.datasource.password=your_password
   spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
   
   # JPA Configuration
   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.show-sql=true
   spring.jpa.properties.hibernate.format_sql=true
   spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
   
   # Server Configuration
   server.port=8080
   server.error.include-message=always
   spring.web.error.include-stacktrace=never
   
   # Security Configuration
   spring.security.user.name=admin
   spring.security.user.password=admin123
   ```

### Step 2: Build and Run Backend

```bash
# Navigate to backend directory
cd backend/ghidorakings

# Using Maven wrapper (recommended)
./mvnw clean install
./mvnw spring-boot:run

# Or using Maven
mvn clean install
mvn spring-boot:run

# Backend will start on http://localhost:8080
```

### Step 3: Verify Backend

- Check console for "Started GhidorakingsApplication"
- Test API health: `http://localhost:8080/actuator/health`
- Admin account created automatically:
  - Email: `jnfranzadin@gmail.com`
  - Password: `dishcoveryadmin`

---

## 🎨 Frontend Setup

### Step 1: Install Dependencies

```bash
# Navigate to frontend directory
cd frontend/dishcovery

# Install npm packages
npm install

# If you encounter errors, try:
npm install --legacy-peer-deps
```

### Step 2: Configure API Endpoint

Check `frontend/dishcovery/src/api/backend.js`:

```javascript
const API_BASE_URL = 'http://localhost:8080';

export const apiGet = async (endpoint) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  if (!response.ok) throw new Error('Network response was not ok');
  return await response.json();
};

// Additional API methods...
```

### Step 3: Start Development Server

```bash
# Start React development server
npm start

# Application will open at http://localhost:3000
```

### Step 4: Build for Production

```bash
# Create optimized production build
npm run build

# Output will be in build/ directory
# Serve with any static file server
```

---

## 🗄️ Database Configuration

### Database Schema

#### Users Table
```sql
CREATE TABLE user (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  role VARCHAR(50) DEFAULT 'USER',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Recipes Table
```sql
CREATE TABLE recipe (
  recipe_id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  steps TEXT,
  ingredients TEXT,
  category VARCHAR(100),
  image LONGTEXT,
  estimated_price DECIMAL(10,2),
  is_approved BOOLEAN DEFAULT FALSE,
  user_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user(user_id)
);
```

#### Comments Table
```sql
CREATE TABLE comment (
  comment_id INT PRIMARY KEY AUTO_INCREMENT,
  content TEXT NOT NULL,
  user_id INT,
  recipe_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user(user_id),
  FOREIGN KEY (recipe_id) REFERENCES recipe(recipe_id)
);
```

#### Ratings Table
```sql
CREATE TABLE rating (
  rating_id INT PRIMARY KEY AUTO_INCREMENT,
  score INT CHECK (score BETWEEN 1 AND 5),
  user_id INT,
  recipe_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user(user_id),
  FOREIGN KEY (recipe_id) REFERENCES recipe(recipe_id)
);
```

#### Favorites Table
```sql
CREATE TABLE favorite (
  favorite_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  recipe_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user(user_id),
  FOREIGN KEY (recipe_id) REFERENCES recipe(recipe_id)
);
```

### Database Migrations

The application automatically handles database migrations on startup:

1. **Schema Creation**: Tables are created automatically via JPA
2. **Admin Account**: Default admin user is created if not exists
3. **Image Migration**: Legacy image_url data is migrated to image column

---

## 📡 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /user/add
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "userId": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "isAdmin": false
}
```

#### Login (Custom Implementation)
```http
POST /user/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "userId": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "isAdmin": false
}
```

### Recipe Endpoints

#### Get All Recipes
```http
GET /recipe/getAllRecipes

Response: 200 OK
[
  {
    "recipeId": 1,
    "title": "Chicken Adobo",
    "description": "Classic Filipino dish",
    "steps": "1. Marinate chicken...",
    "ingredients": "[{\"name\":\"Chicken\",\"amount\":\"1kg\"}]",
    "category": "Filipino",
    "image": "data:image/jpeg;base64,...",
    "estimatedPrice": 250.00,
    "isApproved": true,
    "userId": 2
  }
]
```

#### Create Recipe
```http
POST /recipe/insertRecipe
Content-Type: application/json

{
  "title": "Spaghetti Carbonara",
  "description": "Creamy Italian pasta",
  "steps": "1. Cook pasta...\n2. Prepare sauce...",
  "ingredients": "[{\"name\":\"Pasta\",\"amount\":\"500g\"}]",
  "category": "Italian",
  "image": "data:image/jpeg;base64,...",
  "estimatedPrice": 300.00,
  "userId": 1
}

Response: 201 Created
```

#### Update Recipe
```http
PUT /recipe/updateRecipe/{recipeId}
Content-Type: application/json

{
  "title": "Updated Recipe Title",
  "description": "Updated description",
  ...
}

Response: 200 OK
```

#### Delete Recipe
```http
DELETE /recipe/deleteRecipe/{recipeId}

Response: 200 OK
"Recipe deleted successfully"
```

### Admin Recipe Endpoints

#### Get Pending Recipes
```http
GET /recipe/admin/pending

Response: 200 OK
[...]
```

#### Get Approved Recipes
```http
GET /recipe/admin/approved

Response: 200 OK
[...]
```

#### Approve Recipe
```http
PUT /recipe/admin/approve/{recipeId}

Response: 200 OK
```

#### Reject Recipe
```http
PUT /recipe/admin/reject/{recipeId}

Response: 200 OK
```

### User Endpoints

#### Get All Users
```http
GET /user/getAll

Response: 200 OK
[...]
```

#### Get User by ID
```http
GET /user/get/{userId}

Response: 200 OK
{...}
```

#### Update User
```http
PUT /user/update/{userId}
Content-Type: application/json

{
  "username": "newusername",
  "email": "newemail@example.com",
  "role": "ADMIN"
}

Response: 200 OK
```

#### Delete User
```http
DELETE /user/delete/{userId}

Response: 200 OK
```

### Comment Endpoints

#### Get All Comments
```http
GET /comment/getAllComments

Response: 200 OK
[...]
```

#### Add Comment
```http
POST /comment/insertComment
Content-Type: application/json

{
  "content": "Great recipe!",
  "userId": 1,
  "recipeId": 5
}

Response: 201 Created
```

#### Update Comment
```http
PUT /comment/updateComment/{commentId}
Content-Type: application/json

{
  "content": "Updated comment"
}

Response: 200 OK
```

#### Delete Comment
```http
DELETE /comment/deleteComment/{commentId}

Response: 200 OK
```

### Rating Endpoints

#### Add Rating
```http
POST /rating/insertRating
Content-Type: application/json

{
  "score": 5,
  "userId": 1,
  "recipeId": 5
}

Response: 201 Created
```

#### Get All Ratings
```http
GET /rating/getAllRatings

Response: 200 OK
[...]
```

### Favorite Endpoints

#### Add to Favorites
```http
POST /favorite/insertFavorite
Content-Type: application/json

{
  "userId": 1,
  "recipeId": 5
}

Response: 201 Created
```

#### Get User Favorites
```http
GET /favorite/getUserFavorites/{userId}

Response: 200 OK
[...]
```

#### Remove from Favorites
```http
DELETE /favorite/deleteFavorite/{favoriteId}

Response: 200 OK
```

---

## 👤 User Guide

### Getting Started

#### Registration
1. Navigate to Register page
2. Enter username, email, and password
3. Click "Register"
4. You'll be redirected to login page

#### Login
1. Enter registered email and password
2. Click "Login"
3. You'll be redirected to home page

### Using the Platform

#### Browsing Recipes
1. **Home Page**: View featured and recent recipes
2. **Recipes Page**: Browse all approved recipes
3. **Search**: Use search bar to find specific recipes
4. **Filter**: Filter by category and price range
5. **Categories**: Browse recipes by cuisine type

#### Viewing Recipe Details
1. Click on any recipe card
2. View full details including:
   - Recipe image
   - Description and ingredients
   - Step-by-step instructions
   - User ratings and comments
   - Estimated price
3. Rate the recipe (1-5 stars)
4. Add comments
5. Add to favorites

#### Creating a Recipe
1. Navigate to "Create Recipe" page
2. Fill in recipe details:
   - Title (required)
   - Description
   - Ingredients (JSON format or text)
   - Step-by-step instructions
   - Category selection
   - Estimated price
   - Upload image from device
3. Click "Submit Recipe"
4. Wait for admin approval

#### Managing Your Recipes
1. Go to "My Recipes" page
2. View all your submitted recipes
3. See approval status (pending/approved)
4. Edit or delete your recipes
5. Track recipe performance

#### Favorites
1. Click heart icon on any recipe
2. View all favorites in "Favorites" page
3. Remove from favorites anytime

#### Profile Management
1. Navigate to "Profile" page
2. Update username and email
3. Change password
4. Upload profile picture
5. Logout

---

## 👑 Admin Guide

### Admin Dashboard Overview

Upon logging in as admin, you'll see a management dashboard instead of the regular home page.

#### Dashboard Features
- **Platform Statistics**: Total recipes, users, pending approvals
- **Quick Actions**: Fast access to common tasks
- **Top Contributors**: Most active recipe creators
- **System Status**: Platform health indicators

### Managing Recipes

#### Reviewing Pending Recipes
1. Click "Pending" tab in Admin Panel
2. Review each recipe submission
3. Options per recipe:
   - **View**: See full recipe details
   - **Approve**: Make recipe public
   - **Reject**: Send back to user
   - **Delete**: Remove permanently

#### Bulk Actions
1. Click "Bulk Select" in Pending or Approved tab
2. Check recipes you want to manage
3. Click "Select All" for all recipes
4. Choose bulk action:
   - Bulk Approve
   - Bulk Reject
   - Bulk Delete
5. Confirm action

#### Managing Approved Recipes
1. Go to "Approved" tab
2. View all public recipes
3. Delete inappropriate content
4. Monitor recipe quality

### User Management

#### Viewing Users
1. Navigate to "Users" tab
2. See all registered users
3. View user statistics:
   - Number of recipes
   - Number of comments
   - Current role

#### Promoting/Demoting Users
1. Find user in Users tab
2. Click "Promote" to make admin
3. Click "Demote" to remove admin rights
4. Confirm action

#### Deleting Users
1. Locate user in Users tab
2. Click "Delete" button
3. Confirm deletion
4. All user data will be removed

### Content Moderation

#### Moderating Comments
1. Go to "Comments" tab
2. View all user comments
3. See comment context (recipe and user)
4. Delete inappropriate comments
5. Use search to find specific comments

### Analytics

#### Platform Analytics
1. Navigate to "Analytics" tab
2. View insights:
   - Recipes by category
   - User engagement metrics
   - Average recipes per user
   - Comments per recipe
   - Approval rate

#### Top Contributors
1. Dashboard shows top 5 contributors
2. See recipe count per user
3. Identify most active community members

### Data Management

#### Exporting Data
1. Go to Dashboard
2. Click "Export Data" in Quick Actions
3. Download JSON backup containing:
   - All recipes
   - All users
   - All comments
   - All ratings
   - Export timestamp
4. File saved as `dishcovery-backup-YYYY-MM-DD.json`

#### Using Exported Data
- Backup before major changes
- Migrate to new environment
- Analyze platform trends
- Generate reports

---

## 📁 Project Structure

```
Dishcovery/
│
├── README.md                       # This file
├── .gitignore                      # Git ignore rules
│
├── backend/                        # Spring Boot Backend
│   └── ghidorakings/
│       ├── pom.xml                 # Maven dependencies
│       ├── mvnw                    # Maven wrapper (Linux/Mac)
│       ├── mvnw.cmd                # Maven wrapper (Windows)
│       └── src/
│           ├── main/
│           │   ├── java/
│           │   │   └── com/appdevg5/ghidorakings/
│           │   │       ├── GhidorakingsApplication.java
│           │   │       ├── controller/
│           │   │       │   ├── UserController.java
│           │   │       │   ├── RecipeController.java
│           │   │       │   ├── CommentController.java
│           │   │       │   ├── RatingController.java
│           │   │       │   └── FavoriteController.java
│           │   │       ├── entity/
│           │   │       │   ├── UserEntity.java
│           │   │       │   ├── RecipeEntity.java
│           │   │       │   ├── CommentEntity.java
│           │   │       │   ├── RatingEntity.java
│           │   │       │   └── FavoriteEntity.java
│           │   │       ├── repository/
│           │   │       │   ├── UserRepository.java
│           │   │       │   ├── RecipeRepository.java
│           │   │       │   ├── CommentRepository.java
│           │   │       │   ├── RatingRepository.java
│           │   │       │   └── FavoriteRepository.java
│           │   │       └── service/
│           │   │           ├── UserService.java
│           │   │           ├── RecipeService.java
│           │   │           ├── CommentService.java
│           │   │           ├── RatingService.java
│           │   │           └── FavoriteService.java
│           │   └── resources/
│           │       └── application.properties
│           └── test/
│               └── java/
│                   └── com/appdevg5/ghidorakings/
│
└── frontend/                       # React Frontend
    └── dishcovery/
        ├── package.json            # npm dependencies
        ├── package-lock.json
        ├── .gitignore
        ├── public/
        │   ├── index.html
        │   ├── manifest.json
        │   └── robots.txt
        ├── build/                  # Production build (generated)
        └── src/
            ├── index.js            # App entry point
            ├── App.js              # Main app component
            ├── App.css             # Global styles
            ├── api/
            │   └── backend.js      # API client functions
            ├── components/
            │   ├── NavBar.js
            │   ├── NavBar.css
            │   ├── HeroBanner.js
            │   ├── SearchBar.js
            │   ├── FilterBar.js
            │   ├── RecipeCard.js
            │   ├── RecipeGrid.js
            │   └── RecipeDetailModal.js
            ├── data/
            │   ├── recipes.json
            │   ├── sampleDishes.js
            │   └── users.json
            ├── pages/
            │   ├── HomePage.js
            │   ├── LoginPage.js
            │   ├── LoginPage.css
            │   ├── RegisterPage.js
            │   ├── RegisterPage.css
            │   ├── RecipesPage.js
            │   ├── CategoriesPage.js
            │   ├── FavoritesPage.js
            │   ├── MyRecipesPage.js
            │   ├── MyRecipesPage.css
            │   ├── CreateRecipePage.js
            │   ├── CreateRecipePage.css
            │   ├── EditRecipePage.js
            │   ├── ProfilePage.js
            │   ├── ProfilePage.css
            │   ├── AdminPage.js
            │   ├── AdminPage.css
            │   ├── AdminHomePage.js
            │   └── AdminHomePage.css
            ├── data/
            │   ├── recipes.json    # Sample data
            │   ├── users.json      # Sample data
            │   └── sampleDishes.js
            └── utils/
                ├── recipeStorage.js
                └── userStorage.js
```

---

## 🔄 Development Workflow

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "Add: feature description"

# Push to remote
git push origin feature/your-feature-name

# Create pull request on GitHub
```

### Commit Message Convention

```
Type: Brief description

Types:
- Add: New feature or file
- Fix: Bug fix
- Update: Modify existing feature
- Remove: Delete code or file
- Refactor: Code restructuring
- Docs: Documentation changes
- Style: Formatting changes
- Test: Add or update tests

Examples:
- Add: user authentication system
- Fix: recipe image upload error
- Update: admin dashboard UI
- Docs: installation guide in README
```

### Code Style Guidelines

#### Java (Backend)
- Use camelCase for variables and methods
- Use PascalCase for class names
- Add @Override annotation
- Use meaningful variable names
- Add Javadoc comments for public methods

#### JavaScript (Frontend)
- Use camelCase for variables and functions
- Use PascalCase for components
- Use arrow functions where appropriate
- Add JSDoc comments for complex functions
- Use const/let instead of var

#### CSS
- Use kebab-case for class names
- Organize by component
- Use CSS variables for colors
- Keep selectors specific but not overly nested

---

## 🧪 Testing

### Backend Testing

#### Unit Tests
```bash
cd backend/ghidorakings
./mvnw test
```

#### Integration Tests
```bash
./mvnw verify
```

#### Test Coverage
```bash
./mvnw clean test jacoco:report
# Report in target/site/jacoco/index.html
```

### Frontend Testing

#### Run Tests
```bash
cd frontend/dishcovery
npm test
```

#### Test Coverage
```bash
npm test -- --coverage
```

#### End-to-End Tests
```bash
npm run test:e2e
```

### Manual Testing Checklist

#### User Flow
- [ ] User registration works
- [ ] Login/logout functions correctly
- [ ] Recipe creation and submission
- [ ] Recipe editing and deletion
- [ ] Search and filter functionality
- [ ] Comments and ratings
- [ ] Favorites management
- [ ] Profile updates

#### Admin Flow
- [ ] Admin login redirects to dashboard
- [ ] Recipe approval/rejection
- [ ] Bulk actions work correctly
- [ ] User management functions
- [ ] Comment moderation
- [ ] Data export successful
- [ ] Analytics display correctly

#### Cross-Browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

#### Responsive Testing
- [ ] Mobile (320px - 480px)
- [ ] Tablet (481px - 768px)
- [ ] Desktop (769px+)

---

## 🚀 Deployment

### Backend Deployment

#### Building JAR
```bash
cd backend/ghidorakings
./mvnw clean package
# JAR file in target/ghidorakings-0.0.1-SNAPSHOT.jar
```

#### Running JAR
```bash
java -jar target/ghidorakings-0.0.1-SNAPSHOT.jar
```

#### Production Configuration
Update `application.properties` for production:
```properties
spring.datasource.url=jdbc:mysql://production-host:3306/dishcovery_db
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
server.port=8080
```

### Frontend Deployment

#### Build for Production
```bash
cd frontend/dishcovery
npm run build
```

#### Deploy to Static Hosting
Options:
- **Netlify**: Drag and drop build folder
- **Vercel**: Connect GitHub repo
- **GitHub Pages**: Use gh-pages package
- **AWS S3**: Upload to S3 bucket
- **Firebase Hosting**: Use Firebase CLI

#### Environment Variables
Create `.env.production`:
```
REACT_APP_API_URL=https://your-api-domain.com
```

### Docker Deployment (Optional)

#### Backend Dockerfile
```dockerfile
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

#### Frontend Dockerfile
```dockerfile
FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
```

#### Docker Compose
```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: rootpass
      MYSQL_DATABASE: dishcovery_db
    ports:
      - "3306:3306"
  
  backend:
    build: ./backend/ghidorakings
    ports:
      - "8080:8080"
    depends_on:
      - mysql
  
  frontend:
    build: ./frontend/dishcovery
    ports:
      - "80:80"
    depends_on:
      - backend
```

---

## 🤝 Contributing

We welcome contributions from the community!

### How to Contribute

1. **Fork the Repository**
   - Click "Fork" button on GitHub
   - Clone your fork locally

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make Changes**
   - Write clean, documented code
   - Follow coding conventions
   - Add tests if applicable

4. **Commit Changes**
   ```bash
   git commit -m "Add: amazing feature"
   ```

5. **Push to Fork**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Create Pull Request**
   - Go to original repository
   - Click "New Pull Request"
   - Describe your changes
   - Wait for review

### Contribution Guidelines

- **Code Quality**: Maintain high code standards
- **Documentation**: Update docs for new features
- **Testing**: Add tests for new functionality
- **Commit Messages**: Follow convention
- **Pull Requests**: Keep them focused and small
- **Be Respectful**: Follow code of conduct

### Areas to Contribute

- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation improvements
- 🎨 UI/UX enhancements
- 🧪 Test coverage
- ♿ Accessibility improvements
- 🌍 Internationalization
- ⚡ Performance optimizations

---

## 🔧 Troubleshooting

### Common Issues

#### Backend Won't Start

**Problem**: Port 8080 already in use
```
Solution:
1. Kill process using port 8080
   - Windows: netstat -ano | findstr :8080 then taskkill /PID <PID> /F
   - Mac/Linux: lsof -i :8080 then kill -9 <PID>
2. Or change port in application.properties
```

**Problem**: Database connection failed
```
Solution:
1. Verify MySQL is running
2. Check credentials in application.properties
3. Ensure database exists: CREATE DATABASE dishcovery_db;
4. Check firewall settings
```

#### Frontend Won't Start

**Problem**: Port 3000 already in use
```
Solution:
1. Kill process or use different port
2. Set PORT environment variable: PORT=3001 npm start
```

**Problem**: npm install fails
```
Solution:
1. Delete node_modules and package-lock.json
2. Run: npm cache clean --force
3. Run: npm install --legacy-peer-deps
```

#### API Connection Issues

**Problem**: CORS errors
```
Solution:
1. Add CORS configuration in Spring Boot:
   @CrossOrigin(origins = "http://localhost:3000")
2. Or use proxy in package.json:
   "proxy": "http://localhost:8080"
```

**Problem**: 404 errors on API calls
```
Solution:
1. Verify backend is running
2. Check API_BASE_URL in frontend/src/api/backend.js
3. Confirm endpoint paths match backend controllers
```

#### Image Upload Issues

**Problem**: Images too large
```
Solution:
1. Compress images before upload
2. Limit file size in frontend
3. Increase MySQL packet size:
   max_allowed_packet=64M in my.cnf
```

#### Authentication Issues

**Problem**: User can't login
```
Solution:
1. Verify credentials are correct
2. Check user exists in database
3. Ensure password is stored correctly
4. Check for JavaScript errors in console
```

### Debug Mode

#### Enable Debug Logging
```properties
# Backend - application.properties
logging.level.root=DEBUG
logging.level.com.appdevg5.ghidorakings=DEBUG
```

#### Frontend Debug
```javascript
// Enable React DevTools
// Open browser console
localStorage.debug = 'dishcovery:*'
```

### Getting Help

- **GitHub Issues**: Report bugs or request features
- **Documentation**: Check this README thoroughly
- **Stack Overflow**: Tag questions with `dishcovery`
- **Email**: Contact development team

---

## ❓ FAQ

### General Questions

**Q: Is Dishcovery free to use?**
A: Yes, Dishcovery is completely free and open-source.

**Q: Can I use Dishcovery for commercial purposes?**
A: Yes, under the MIT license terms.

**Q: What technologies does Dishcovery use?**
A: Spring Boot (backend), React (frontend), MySQL (database).

### User Questions

**Q: How do I create an account?**
A: Click "Register" on the login page and fill in your details.

**Q: Why isn't my recipe showing up?**
A: Recipes require admin approval before appearing publicly.

**Q: Can I edit my recipe after submission?**
A: Yes, go to "My Recipes" and click "Edit" on any recipe.

**Q: How do I become an admin?**
A: Contact the platform administrator to request promotion.

### Developer Questions

**Q: What version of Java is required?**
A: Java 17 or higher is required.

**Q: Can I use PostgreSQL instead of MySQL?**
A: Yes, update dependencies and configuration accordingly.

**Q: How do I add a new feature?**
A: Fork the repo, create a feature branch, implement, and submit a PR.

**Q: Is there API documentation?**
A: Yes, see the API Documentation section in this README.

### Troubleshooting Questions

**Q: Why is the backend not connecting to MySQL?**
A: Check your database credentials in application.properties.

**Q: Frontend shows blank page, what's wrong?**
A: Check browser console for errors and ensure backend is running.

**Q: How do I reset my database?**
A: Drop and recreate the database, then restart the backend.

---

## 📄 License

This project is licensed under the MIT License.

```
MIT License

Copyright (c) 2025 Dishcovery Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📞 Contact

### Development Team

**Project Lead**: AppDev G5 Team
- GitHub: [@ZeeP-Coder](https://github.com/ZeeP-Coder)
- Repository: [Dishcovery](https://github.com/ZeeP-Coder/Dishcovery)

### Support

- **Bug Reports**: [GitHub Issues](https://github.com/ZeeP-Coder/Dishcovery/issues)
- **Feature Requests**: [GitHub Discussions](https://github.com/ZeeP-Coder/Dishcovery/discussions)
- **Email**: support@dishcovery.com (if applicable)

### Social Media

- Twitter: @DishcoveryApp
- Facebook: /DishcoveryApp
- Instagram: @dishcovery

---

## 🎉 Acknowledgments

### Special Thanks

- **CIT-U**: Cebu Institute of Technology - University
- **Spring Boot Team**: For the amazing framework
- **React Team**: For the powerful UI library
- **MySQL**: For reliable database management
- **Open Source Community**: For inspiration and tools

### Contributors

Thank you to all contributors who have helped make Dishcovery better!

- [View Contributors](https://github.com/ZeeP-Coder/Dishcovery/graphs/contributors)

### Third-Party Libraries

- React Router DOM - Navigation
- Spring Data JPA - Database operations
- MySQL Connector - Database connectivity
- Lombok - Code generation
- And many more...

---

## 🗺️ Roadmap

### Version 2.0 (Planned)

- [ ] Email verification for registration
- [ ] Password reset functionality
- [ ] Advanced search with AI recommendations
- [ ] Social media sharing integration
- [ ] Recipe printing functionality
- [ ] Shopping list generation from ingredients
- [ ] Nutritional information calculator
- [ ] Video recipe support
- [ ] Multi-language support
- [ ] Mobile app (iOS/Android)

### Version 2.5 (Future)

- [ ] Real-time chat between users
- [ ] Recipe collaboration feature
- [ ] Meal planning calendar
- [ ] Ingredient substitution suggestions
- [ ] Voice-guided cooking mode
- [ ] Integration with smart kitchen devices
- [ ] Community challenges and events
- [ ] Premium membership features

---

## 📊 Statistics

### Project Metrics

- **Total Lines of Code**: 15,000+
- **Number of Files**: 50+
- **Commits**: 200+
- **Contributors**: 5+
- **GitHub Stars**: ⭐ (Star us!)

### Platform Statistics

- **Registered Users**: Growing daily
- **Published Recipes**: 500+ and counting
- **Total Comments**: 2,000+
- **Total Ratings**: 3,000+
- **Categories**: 10+

---

## 🔐 Security

### Reporting Security Issues

If you discover a security vulnerability, please email security@dishcovery.com instead of using the issue tracker.

### Security Best Practices

- Never commit credentials to Git
- Use environment variables for sensitive data
- Keep dependencies updated
- Use HTTPS in production
- Implement rate limiting
- Sanitize user inputs
- Use prepared statements for SQL queries

---

## 📚 Additional Resources

### Learning Materials

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [REST API Best Practices](https://restfulapi.net/)

### Related Projects

- Recipe API Services
- Food Photography Tips
- Cooking Tutorials

---

## 🌟 Star History

If you find this project useful, please consider giving it a star on GitHub! ⭐

[![Star History Chart](https://api.star-history.com/svg?repos=ZeeP-Coder/Dishcovery&type=Date)](https://star-history.com/#ZeeP-Coder/Dishcovery&Date)

---

## 📝 Changelog

### Version 1.0.0 (Current)

#### Added
- User registration and authentication system
- Recipe CRUD operations with image upload
- Admin dashboard with comprehensive analytics
- Bulk actions for recipe management
- User role management (promote/demote)
- Comment and rating system
- Favorites functionality
- Image upload support with base64 encoding
- Search and filter features
- Responsive design for all devices
- Data export functionality for backups
- Separate admin home page with management tools
- Quick actions dashboard for administrators
- Top contributors tracking
- Category-based recipe organization

#### Fixed
- Image upload size issues with LONGTEXT migration
- Database migration errors
- CORS configuration for cross-origin requests
- UI responsiveness issues on mobile devices
- JSX syntax errors in admin components
- Duplicate code removal

#### Changed
- Updated admin UI from red theme to professional white/light gray theme
- Improved navigation for admin users with role-specific menus
- Enhanced recipe approval workflow with bulk operations
- Optimized database schema for better performance
- Improved error handling and user feedback

---

**Thank you for using Dishcovery! Happy Cooking! 👨‍🍳👩‍🍳**