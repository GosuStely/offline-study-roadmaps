// Roadmap data for "Software Design & Architecture".
// Structure mirrors roadmap.sh: 13 sections, 70 leaf topics.
// Each group has an `overviewId` -> the section header is itself a clickable
// overview page (as the big boxes are on roadmap.sh).
window.ROADMAP_DATA = window.ROADMAP_DATA || {};
window.ROADMAP_DATA["software-design-architecture"] = {
  "title": "Software Design & Architecture",
  "description": "Step-by-step roadmap covering clean code, paradigms, OOP, design principles & patterns, architectural styles and patterns.",
  "groups": [
    {
      "title": "Clean Code Principles",
      "overviewId": "clean-code-principles",
      "items": [
        { "id": "be-consistent", "title": "Be consistent" },
        { "id": "meaningful-names-over-comments", "title": "Meaningful names over comments" },
        { "id": "indentation-and-code-style", "title": "Indentation and Code Style" },
        { "id": "keep-methods-classes-files-small", "title": "Keep methods / classes / files small" },
        { "id": "pure-functions", "title": "Pure functions" },
        { "id": "minimize-cyclomatic-complexity", "title": "Minimize cyclomatic complexity" },
        { "id": "avoid-passing-nulls-booleans", "title": "Avoid passing nulls, booleans" },
        { "id": "keep-framework-code-distant", "title": "Keep framework code distant" },
        { "id": "use-correct-constructs", "title": "Use correct constructs" },
        { "id": "tests-should-be-fast-and-independent", "title": "Tests should be fast and independent" },
        { "id": "organize-code-by-actor-it-belongs-to", "title": "Organize code by actor it belongs to" },
        { "id": "command-query-separation", "title": "Command query separation" },
        { "id": "keep-it-simple-and-refactor-often", "title": "Keep it simple and refactor often" }
      ]
    },
    {
      "title": "Programming Paradigms",
      "overviewId": "programming-paradigms",
      "items": [
        { "id": "structured-programming", "title": "Structured Programming" },
        { "id": "functional-programming", "title": "Functional Programming" }
      ]
    },
    {
      "title": "Object Oriented Programming",
      "overviewId": "object-oriented-programming",
      "items": [
        { "id": "encapsulation", "title": "Encapsulation" },
        { "id": "abstraction", "title": "Abstraction" },
        { "id": "inheritance", "title": "Inheritance" },
        { "id": "polymorphism", "title": "Polymorphism" },
        { "id": "abstract-classes", "title": "Abstract Classes" },
        { "id": "concrete-classes", "title": "Concrete Classes" },
        { "id": "scope-visibility", "title": "Scope / Visibility" },
        { "id": "interfaces", "title": "Interfaces" }
      ]
    },
    {
      "title": "Model-Driven Design",
      "overviewId": "model-driven-design",
      "items": [
        { "id": "domain-models", "title": "Domain Models" },
        { "id": "anemic-models", "title": "Anemic Models" },
        { "id": "domain-language", "title": "Domain Language" },
        { "id": "class-variants", "title": "Class Variants" },
        { "id": "layered-architectures", "title": "Layered Architectures" }
      ]
    },
    {
      "title": "Design Principles",
      "overviewId": "design-principles",
      "items": [
        { "id": "composition-over-inheritance", "title": "Composition over Inheritance" },
        { "id": "encapsulate-what-varies", "title": "Encapsulate what varies" },
        { "id": "program-against-abstractions", "title": "Program against abstractions" },
        { "id": "hollywood-principle", "title": "Hollywood Principle" },
        { "id": "law-of-demeter", "title": "Law of Demeter" },
        { "id": "tell-don-t-ask", "title": "Tell, don't ask" },
        { "id": "solid", "title": "SOLID" },
        { "id": "dry", "title": "DRY" },
        { "id": "yagni", "title": "YAGNI" }
      ]
    },
    {
      "title": "Design Patterns",
      "overviewId": "design-patterns",
      "items": [
        { "id": "gof-design-patterns", "title": "GoF Design Patterns" },
        { "id": "posa-patterns", "title": "PoSA Patterns" }
      ]
    },
    {
      "title": "Architectural Principles",
      "overviewId": "architectural-principles",
      "items": [
        { "id": "component-principles", "title": "Component Principles" },
        { "id": "policy-vs-detail", "title": "Policy vs Detail" },
        { "id": "coupling-and-cohesion", "title": "Coupling and Cohesion" },
        { "id": "boundaries", "title": "Boundaries" }
      ]
    },
    {
      "title": "Architectural Styles",
      "overviewId": "architectural-styles",
      "items": []
    },
    {
      "title": "Messaging",
      "overviewId": "messaging",
      "items": [
        { "id": "event-driven", "title": "Event-Driven" },
        { "id": "publish-subscribe", "title": "Publish-Subscribe" }
      ]
    },
    {
      "title": "Distributed",
      "overviewId": "distributed",
      "items": [
        { "id": "client-server", "title": "Client-Server" },
        { "id": "peer-to-peer", "title": "Peer-to-Peer" }
      ]
    },
    {
      "title": "Structural",
      "overviewId": "structural",
      "items": [
        { "id": "component-based", "title": "Component-Based" },
        { "id": "monolithic", "title": "Monolithic" },
        { "id": "layered", "title": "Layered" }
      ]
    },
    {
      "title": "Architectural Patterns",
      "overviewId": "architectural-patterns",
      "items": [
        { "id": "domain-driven-design", "title": "Domain-Driven Design" },
        { "id": "model-view-controller", "title": "Model-View Controller" },
        { "id": "microservices", "title": "Microservices" },
        { "id": "blackboard-pattern", "title": "Blackboard Pattern" },
        { "id": "microkernel", "title": "Microkernel" },
        { "id": "serverless-architecture", "title": "Serverless Architecture" },
        { "id": "message-queues-streams", "title": "Message Queues / Streams" },
        { "id": "event-sourcing", "title": "Event Sourcing" },
        { "id": "soa", "title": "SOA" },
        { "id": "cqrs", "title": "CQRS" }
      ]
    },
    {
      "title": "Enterprise Patterns",
      "overviewId": "enterprise-patterns",
      "items": [
        { "id": "dtos", "title": "DTOs" },
        { "id": "identity-maps", "title": "Identity Maps" },
        { "id": "usecases", "title": "Usecases" },
        { "id": "repositories", "title": "Repositories" },
        { "id": "mappers", "title": "Mappers" },
        { "id": "transaction-script", "title": "Transaction Script" },
        { "id": "commands-queries", "title": "Commands / Queries" },
        { "id": "value-objects", "title": "Value Objects" },
        { "id": "entities", "title": "Entities" },
        { "id": "orms", "title": "ORMs" }
      ]
    }
  ]
};

window.CONTENT_DATA = window.CONTENT_DATA || {};
window.CONTENT_DATA["software-design-architecture"] = window.CONTENT_DATA["software-design-architecture"] || {};
