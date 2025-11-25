# ============================
# 1. BUILD STAGE
# ============================
FROM maven:3.9.8-eclipse-temurin-21 AS build

WORKDIR /app

# Copy only pom.xml first (better caching)
COPY pom.xml .

# Fix CRLF issues (Windows)
RUN sed -i 's/\r$//' pom.xml

# Download dependencies
RUN mvn -q dependency:go-offline

# Now copy source code
COPY src ./src

# Package the application
RUN mvn -q -DskipTests package

# ============================
# 2. RUNTIME STAGE
# ============================
FROM eclipse-temurin:21-jdk

WORKDIR /app

# Copy fat jar from build stage
COPY --from=build /app/target/*.jar usermicroservice.jar

EXPOSE 8085

ENTRYPOINT ["java", "-jar", "usermicroservice.jar"]
