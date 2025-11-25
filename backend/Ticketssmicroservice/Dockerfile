# -----------------------------
# Stage 1: Build the JAR using Maven
# -----------------------------
FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /app

# Copy POM first (better caching)
COPY pom.xml .

# Download dependencies (offline cache)
RUN mvn -q dependency:go-offline

# Copy source
COPY src ./src

# Build jar
RUN mvn -q -DskipTests package


# -----------------------------
# Stage 2: Run the jar in a small JDK image
# -----------------------------
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy built jar from stage 1
COPY --from=build /app/target/*.jar app.jar

# Expose container port
EXPOSE 8084

# Run Spring Boot app
ENTRYPOINT ["java", "-jar", "app.jar"]
