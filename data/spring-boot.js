// Roadmap data for "Spring Boot".
// Structure mirrors roadmap.sh: 11 sections, 34 leaf subtopics.
// Each group has an `overviewId` -> the section header is itself a clickable overview page.
window.ROADMAP_DATA = window.ROADMAP_DATA || {};
window.ROADMAP_DATA["spring-boot"] = {
  "title": "Spring Boot",
  "description": "Step-by-step roadmap to becoming a Spring Boot developer: core framework, security, data access, microservices and testing.",
  "groups": [
    {
      "title": "Introduction",
      "overviewId": "introduction",
      "items": [
        { "id": "why-use-spring", "title": "Why use Spring?" },
        { "id": "terminology", "title": "Terminology" },
        { "id": "architecture", "title": "Architecture" },
        { "id": "dependency-injection", "title": "Dependency Injection" },
        { "id": "spring-ioc", "title": "Spring IOC" },
        { "id": "spring-aop", "title": "Spring AOP" },
        { "id": "spring-bean-scope", "title": "Spring Bean Scope" },
        { "id": "annotations", "title": "Annotations" },
        { "id": "configuration", "title": "Configuration" },
        { "id": "spring-mvc-intro", "title": "Spring MVC" }
      ]
    },
    {
      "title": "Spring Security",
      "overviewId": "spring-security",
      "items": [
        { "id": "authentication", "title": "Authentication" },
        { "id": "authorization", "title": "Authorization" },
        { "id": "oauth2", "title": "OAuth2" },
        { "id": "jwt-authentication", "title": "JWT Authentication" }
      ]
    },
    { "title": "Spring Boot Starters", "overviewId": "spring-boot-starters", "items": [] },
    { "title": "Autoconfiguration", "overviewId": "autoconfiguration", "items": [] },
    { "title": "Actuators", "overviewId": "actuators", "items": [] },
    { "title": "Embedded Server", "overviewId": "embedded-server", "items": [] },
    {
      "title": "Hibernate",
      "overviewId": "hibernate",
      "items": [
        { "id": "entity-lifecycle", "title": "Entity Lifecycle" },
        { "id": "relationships", "title": "Relationships" },
        { "id": "transactions", "title": "Transactions" }
      ]
    },
    {
      "title": "Spring Data",
      "overviewId": "spring-data",
      "items": [
        { "id": "spring-data-jpa", "title": "Spring Data JPA" },
        { "id": "spring-data-mongodb", "title": "Spring Data MongoDB" },
        { "id": "spring-data-jdbc", "title": "Spring Data JDBC" }
      ]
    },
    {
      "title": "Microservices",
      "overviewId": "microservices",
      "items": [
        { "id": "spring-cloud", "title": "Spring Cloud" },
        { "id": "spring-cloud-gateway", "title": "Spring Cloud Gateway" },
        { "id": "cloud-config", "title": "Cloud Config" },
        { "id": "spring-cloud-circuit-breaker", "title": "Spring Cloud Circuit Breaker" },
        { "id": "spring-cloud-open-feign", "title": "Spring Cloud Open Feign" },
        { "id": "micrometer", "title": "Micrometer" },
        { "id": "eureka", "title": "Eureka" }
      ]
    },
    {
      "title": "Spring MVC",
      "overviewId": "spring-mvc",
      "items": [
        { "id": "servlet", "title": "Servlet" },
        { "id": "jsp-files", "title": "JSP Files" },
        { "id": "components", "title": "Components" }
      ]
    },
    {
      "title": "Testing",
      "overviewId": "testing",
      "items": [
        { "id": "springboottest-annotation", "title": "@SpringBootTest Annotation" },
        { "id": "mockbean-annotation", "title": "@MockBean Annotation" },
        { "id": "mock-mvc", "title": "Mock MVC" },
        { "id": "jpa-test", "title": "JPA Test" }
      ]
    }
  ]
};

window.CONTENT_DATA = window.CONTENT_DATA || {};
window.CONTENT_DATA["spring-boot"] = window.CONTENT_DATA["spring-boot"] || {};
