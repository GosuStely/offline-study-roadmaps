// Roadmap data for "System Design".
// Structure mirrors roadmap.sh: 27 sections. Cloud patterns that are intentionally
// cross-listed across categories use section-prefixed ids that share content via aliases.
window.ROADMAP_DATA = window.ROADMAP_DATA || {};
window.ROADMAP_DATA["system-design"] = {
  "title": "System Design",
  "description": "Roadmap to learning system design: fundamentals, scaling, databases, caching, communication, monitoring, and cloud design patterns.",
  "groups": [
    {
      "title": "Introduction",
      "overviewId": "introduction",
      "items": [
        { "id": "what-is-system-design", "title": "What is System Design?" },
        { "id": "how-to-approach-system-design", "title": "How to approach System Design?" }
      ]
    },
    { "title": "Performance vs Scalability", "overviewId": "performance-vs-scalability", "items": [] },
    { "title": "Latency vs Throughput", "overviewId": "latency-vs-throughput", "items": [] },
    {
      "title": "Availability vs Consistency",
      "overviewId": "availability-vs-consistency",
      "items": [
        { "id": "cap-theorem", "title": "CAP Theorem" }
      ]
    },
    {
      "title": "Consistency Patterns",
      "overviewId": "consistency-patterns",
      "items": [
        { "id": "weak-consistency", "title": "Weak Consistency" },
        { "id": "eventual-consistency", "title": "Eventual Consistency" },
        { "id": "strong-consistency", "title": "Strong Consistency" }
      ]
    },
    {
      "title": "Availability Patterns",
      "overviewId": "availability-patterns",
      "items": [
        { "id": "fail-over", "title": "Fail-Over" },
        { "id": "replication", "title": "Replication" },
        { "id": "availability-in-numbers", "title": "Availability in Numbers" }
      ]
    },
    {
      "title": "Background Jobs",
      "overviewId": "background-jobs",
      "items": [
        { "id": "event-driven", "title": "Event-Driven" },
        { "id": "schedule-driven", "title": "Schedule Driven" },
        { "id": "returning-results", "title": "Returning Results" }
      ]
    },
    { "title": "Domain Name System", "overviewId": "domain-name-system", "items": [] },
    {
      "title": "Content Delivery Networks",
      "overviewId": "content-delivery-networks",
      "items": [
        { "id": "push-cdns", "title": "Push CDNs" },
        { "id": "pull-cdns", "title": "Pull CDNs" }
      ]
    },
    {
      "title": "Load Balancers",
      "overviewId": "load-balancers",
      "items": [
        { "id": "lb-vs-reverse-proxy", "title": "LB vs Reverse Proxy" },
        { "id": "load-balancing-algorithms", "title": "Load Balancing Algorithms" },
        { "id": "layer-7-load-balancing", "title": "Layer 7 Load Balancing" },
        { "id": "layer-4-load-balancing", "title": "Layer 4 Load Balancing" },
        { "id": "horizontal-scaling", "title": "Horizontal Scaling" }
      ]
    },
    {
      "title": "Application Layer",
      "overviewId": "application-layer",
      "items": [
        { "id": "microservices", "title": "Microservices" },
        { "id": "service-discovery", "title": "Service Discovery" }
      ]
    },
    {
      "title": "Databases",
      "overviewId": "databases",
      "items": [
        { "id": "sql-vs-nosql", "title": "SQL vs NoSQL" },
        { "id": "key-value-store", "title": "Key-Value Store" },
        { "id": "document-store", "title": "Document Store" },
        { "id": "wide-column-store", "title": "Wide Column Store" },
        { "id": "graph-databases", "title": "Graph Databases" },
        { "id": "db-replication", "title": "Replication" },
        { "id": "sharding", "title": "Sharding" },
        { "id": "federation", "title": "Federation" },
        { "id": "denormalization", "title": "Denormalization" },
        { "id": "sql-tuning", "title": "SQL Tuning" }
      ]
    },
    {
      "title": "Caching",
      "overviewId": "caching",
      "items": [
        { "id": "refresh-ahead", "title": "Refresh Ahead" },
        { "id": "write-behind", "title": "Write-behind" },
        { "id": "write-through", "title": "Write-through" },
        { "id": "cache-aside", "title": "Cache Aside" },
        { "id": "client-caching", "title": "Client Caching" },
        { "id": "cdn-caching", "title": "CDN Caching" },
        { "id": "web-server-caching", "title": "Web Server Caching" },
        { "id": "database-caching", "title": "Database Caching" },
        { "id": "application-caching", "title": "Application Caching" }
      ]
    },
    {
      "title": "Asynchronism",
      "overviewId": "asynchronism",
      "items": [
        { "id": "back-pressure", "title": "Back Pressure" },
        { "id": "task-queues", "title": "Task Queues" },
        { "id": "message-queues", "title": "Message Queues" }
      ]
    },
    { "title": "Idempotent Operations", "overviewId": "idempotent-operations", "items": [] },
    {
      "title": "Communication",
      "overviewId": "communication",
      "items": [
        { "id": "http", "title": "HTTP" },
        { "id": "tcp", "title": "TCP" },
        { "id": "udp", "title": "UDP" },
        { "id": "rpc", "title": "RPC" },
        { "id": "rest", "title": "REST" },
        { "id": "grpc", "title": "gRPC" },
        { "id": "graphql", "title": "GraphQL" }
      ]
    },
    {
      "title": "Performance Antipatterns",
      "overviewId": "performance-antipatterns",
      "items": [
        { "id": "busy-database", "title": "Busy Database" },
        { "id": "busy-frontend", "title": "Busy Frontend" },
        { "id": "chatty-io", "title": "Chatty I/O" },
        { "id": "extraneous-fetching", "title": "Extraneous Fetching" },
        { "id": "improper-instantiation", "title": "Improper Instantiation" },
        { "id": "monolithic-persistence", "title": "Monolithic Persistence" },
        { "id": "no-caching", "title": "No Caching" },
        { "id": "noisy-neighbor", "title": "Noisy Neighbor" },
        { "id": "retry-storm", "title": "Retry Storm" },
        { "id": "synchronous-io", "title": "Synchronous I/O" }
      ]
    },
    {
      "title": "Monitoring",
      "overviewId": "monitoring",
      "items": [
        { "id": "health-monitoring", "title": "Health Monitoring" },
        { "id": "availability-monitoring", "title": "Availability Monitoring" },
        { "id": "performance-monitoring", "title": "Performance Monitoring" },
        { "id": "security-monitoring", "title": "Security Monitoring" },
        { "id": "usage-monitoring", "title": "Usage Monitoring" },
        { "id": "instrumentation", "title": "Instrumentation" },
        { "id": "visualization-alerts", "title": "Visualization & Alerts" }
      ]
    },
    { "title": "Cloud Design Patterns", "overviewId": "cloud-design-patterns", "items": [] },
    {
      "title": "Messaging",
      "overviewId": "messaging",
      "items": [
        { "id": "sequential-convoy", "title": "Sequential Convoy" },
        { "id": "scheduling-agent-supervisor", "title": "Scheduling Agent Supervisor" },
        { "id": "queue-based-load-leveling", "title": "Queue-Based Load Leveling" },
        { "id": "publisher-subscriber", "title": "Publisher/Subscriber" },
        { "id": "priority-queue", "title": "Priority Queue" },
        { "id": "pipes-and-filters", "title": "Pipes and Filters" },
        { "id": "competing-consumers", "title": "Competing Consumers" },
        { "id": "choreography", "title": "Choreography" },
        { "id": "claim-check", "title": "Claim Check" },
        { "id": "async-request-reply", "title": "Async Request Reply" }
      ]
    },
    {
      "title": "Data Management",
      "overviewId": "data-management",
      "items": [
        { "id": "valet-key", "title": "Valet Key" },
        { "id": "static-content-hosting", "title": "Static Content Hosting" },
        { "id": "dm-sharding", "title": "Sharding" },
        { "id": "materialized-view", "title": "Materialized View" },
        { "id": "index-table", "title": "Index Table" },
        { "id": "event-sourcing", "title": "Event Sourcing" },
        { "id": "cqrs", "title": "CQRS" },
        { "id": "dm-cache-aside", "title": "Cache-Aside" }
      ]
    },
    {
      "title": "Design & Implementation",
      "overviewId": "design-implementation",
      "items": [
        { "id": "strangler-fig", "title": "Strangler Fig" },
        { "id": "sidecar", "title": "Sidecar" },
        { "id": "di-static-content-hosting", "title": "Static Content Hosting" },
        { "id": "leader-election", "title": "Leader Election" },
        { "id": "di-cqrs", "title": "CQRS" },
        { "id": "di-pipes-and-filters", "title": "Pipes & Filters" },
        { "id": "ambassador", "title": "Ambassador" },
        { "id": "gateway-routing", "title": "Gateway Routing" },
        { "id": "gateway-offloading", "title": "Gateway Offloading" },
        { "id": "gateway-aggregation", "title": "Gateway Aggregation" },
        { "id": "external-config-store", "title": "External Config Store" },
        { "id": "compute-resource-consolidation", "title": "Compute Resource Consolidation" },
        { "id": "backends-for-frontend", "title": "Backends for Frontend" },
        { "id": "anti-corruption-layer", "title": "Anti-Corruption Layer" }
      ]
    },
    { "title": "Reliability Patterns", "overviewId": "reliability-patterns", "items": [] },
    {
      "title": "Availability",
      "overviewId": "availability",
      "items": [
        { "id": "deployment-stamps", "title": "Deployment Stamps" },
        { "id": "throttling", "title": "Throttling" },
        { "id": "geodes", "title": "Geodes" },
        { "id": "health-endpoint-monitoring", "title": "Health Endpoint Monitoring" },
        { "id": "av-queue-based-load-leveling", "title": "Queue-Based Load Leveling" }
      ]
    },
    {
      "title": "High Availability",
      "overviewId": "high-availability",
      "items": [
        { "id": "ha-deployment-stamps", "title": "Deployment Stamps" },
        { "id": "ha-geodes", "title": "Geodes" },
        { "id": "bulkhead", "title": "Bulkhead" },
        { "id": "ha-health-endpoint-monitoring", "title": "Health Endpoint Monitoring" },
        { "id": "circuit-breaker", "title": "Circuit Breaker" }
      ]
    },
    {
      "title": "Resiliency",
      "overviewId": "resiliency",
      "items": [
        { "id": "res-bulkhead", "title": "Bulkhead" },
        { "id": "res-circuit-breaker", "title": "Circuit Breaker" },
        { "id": "compensating-transaction", "title": "Compensating Transaction" },
        { "id": "res-health-endpoint-monitoring", "title": "Health Endpoint Monitoring" },
        { "id": "res-leader-election", "title": "Leader Election" },
        { "id": "res-queue-based-load-leveling", "title": "Queue-Based Load Leveling" },
        { "id": "retry", "title": "Retry" },
        { "id": "scheduler-agent-supervisor", "title": "Scheduler Agent Supervisor" }
      ]
    },
    {
      "title": "Security",
      "overviewId": "security",
      "items": [
        { "id": "federated-identity", "title": "Federated Identity" },
        { "id": "gatekeeper", "title": "Gatekeeper" },
        { "id": "sec-valet-key", "title": "Valet Key" }
      ]
    }
  ]
};

window.CONTENT_DATA = window.CONTENT_DATA || {};
window.CONTENT_DATA["system-design"] = window.CONTENT_DATA["system-design"] || {};
