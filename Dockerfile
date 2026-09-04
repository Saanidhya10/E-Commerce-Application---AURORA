# Multi-stage Dockerfile for Spring Boot E-Commerce Application (Root Monorepo)
# Stage 1: Build stage
FROM maven:3.9-eclipse-temurin-21-alpine AS builder
WORKDIR /app
COPY ecommerceapp/pom.xml .
RUN mvn dependency:go-offline -B
COPY ecommerceapp/src ./src
RUN mvn clean package -DskipTests

# Stage 2: Production runtime stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Non-root security user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

COPY --from=builder /app/target/ecommerceapp-*.jar app.jar

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT:-8080} -jar app.jar"]
