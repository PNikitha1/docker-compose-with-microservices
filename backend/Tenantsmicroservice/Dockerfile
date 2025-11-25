# -----------------------------
# Stage 1: Build the JAR file
# -----------------------------
FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /app

# Copy pom.xml and download dependencies first
COPY pom.xml .
RUN mvn -q dependency:go-offline

# Copy the source code
COPY src ./src

# Build application JAR (skip tests for faster build)
RUN mvn -q -DskipTests package


# -----------------------------
# Stage 2: Run the Spring Boot application
# -----------------------------
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy the final JAR from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose microservice port (TENANTS = 8082)
EXPOSE 8082

# Run Spring Boot
ENTRYPOINT ["java", "-jar", "app.jar"]
