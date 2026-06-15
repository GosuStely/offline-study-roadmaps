// Content for the "api-design" roadmap. One entry per topic id (see data/api-design.js).
window.CONTENT_DATA = window.CONTENT_DATA || {};
window.CONTENT_DATA["api-design"] = window.CONTENT_DATA["api-design"] || {};
var C = window.CONTENT_DATA["api-design"];

/* ===================== INTRODUCTION ===================== */

C["what-are-apis"] = {
  summary: "<p>An <strong>API (Application Programming Interface)</strong> is a contract that lets software " +
    "components talk to each other &mdash; defining what operations are available, what inputs they take, and " +
    "what they return, while hiding the implementation. Web APIs (the focus here) let clients (browsers, " +
    "mobile apps, other services) request data and actions from a server over a network, typically via HTTP. " +
    "APIs are the connective tissue of modern software.</p>",
  examples: [
    {
      title: "Example 1: A web API request/response",
      description: "<p>Client asks; server responds with structured data.</p>",
      code: "// Client request:\nGET /api/products/42\n// Server response:\nHTTP/1.1 200 OK\nContent-Type: application/json\n{ \"id\": 42, \"name\": \"Mug\", \"price\": 9.99 }\n// The client doesn't know HOW the server stores/computes this."
    },
    {
      title: "Example 2: APIs as contracts/abstraction",
      description: "<p>The interface is stable; the implementation can change.</p>",
      code: "// The API promises: POST /orders { items } -> 201 { orderId }\n// Behind it, the server can change databases, languages, or logic\n//   without breaking clients, as long as the contract holds."
    },
    {
      title: "Example 3: the API is the contract many clients depend on",
      description: "<p>Once published, the request/response shape is a commitment - changing it breaks every consumer.</p>",
      code: "// Published contract: GET /products/:id -> { id, name, price }\n" +
        "// Breaking change (renaming a field) silently breaks ALL clients:\n" +
        "//   { id, title, price }   // clients reading .name now get undefined\n" +
        "// Non-breaking (additive) change is safe:\n" +
        "//   { id, name, price, currency }   // old clients ignore the new field"
    },
    {
      title: "Example 4 (edge case): APIs come in many styles, not just REST/HTTP",
      description: "<p>'API' is broader than web REST - the same contract idea spans libraries, RPC, GraphQL, and events.</p>",
      code: "// web REST:   GET /products/42 -> JSON\n" +
        "// GraphQL:    one endpoint, client-specified query\n" +
        "// gRPC:       typed RPC over HTTP/2 (internal services)\n" +
        "// library:    add(a, b) - a programmatic interface, no network\n" +
        "// event/async: publish 'OrderPlaced' -> consumers react\n" +
        "// the design principles (clear contract, stable, versioned) apply to all."
    }
  ],
  whenToUse: "<p>APIs exist wherever software integrates &mdash; front-end to back-end, service to service, " +
    "third-party platforms. Good API design matters because an API is a <em>contract</em> many clients depend " +
    "on, and breaking it is costly. <strong>Gotchas:</strong> design APIs around consumer needs and stable " +
    "contracts, version them carefully, and treat the public surface as a long-term commitment. The rest of " +
    "this roadmap covers how to design APIs that are clear, consistent, secure, and evolvable.</p>"
};

C["learn-the-basics"] = {
  summary: "<p>Before designing APIs, you need the foundational concepts they're built on: how the " +
    "<strong>web works</strong> (clients, servers, requests/responses), <strong>HTTP</strong> (the protocol " +
    "most web APIs use), <strong>TCP/IP</strong> and <strong>DNS</strong> (how machines connect and resolve " +
    "names), data formats (JSON), and client-server architecture. These basics underpin every API decision &mdash; " +
    "from URL design to status codes to caching.</p>",
  examples: [
    {
      title: "Example 1: The request lifecycle",
      description: "<p>From a name to a response.</p>",
      code: "// 1. DNS resolves api.example.com -> an IP address\n// 2. TCP connection established (over TLS for HTTPS)\n// 3. Client sends an HTTP request (method, path, headers, body)\n// 4. Server processes and returns an HTTP response (status, body)\n// Designing APIs means shaping steps 3-4 well."
    },
    {
      title: "Example 2: Client-server with JSON",
      description: "<p>The common shape of a modern web API exchange.</p>",
      code: "// Client (browser/mobile/service) <--HTTP/JSON--> Server (API)\n// JSON is the dominant data format:\n//   { \"user\": { \"id\": 7, \"name\": \"Sam\" } }"
    },
    {
      title: "Example 3: the request/response cycle these basics underpin",
      description: "<p>Every API design choice traces back to how the web actually moves a request from client to server and back.</p>",
      code: "// DNS:  api.example.com -> 93.184.216.34\n" +
        "// TCP+TLS: open a secure connection to that IP:443\n" +
        "// HTTP: GET /products/42  Host: api.example.com  Authorization: Bearer ...\n" +
        "// server -> 200 OK  Content-Type: application/json  { ... }\n" +
        "// REST resources, status codes, headers, caching all sit ON this cycle."
    },
    {
      title: "Example 4 (edge case): these layers leak into your API decisions",
      description: "<p>The 'basics' aren't trivia - they explain real API behavior (timeouts, caching, CORS, payload limits).</p>",
      code: "// connection setup cost (TCP+TLS handshakes) -> reuse connections / HTTP keep-alive\n" +
        "// DNS TTLs -> why a failover/IP change isn't instant\n" +
        "// HTTP caching headers -> why some responses are stale\n" +
        "// the browser's same-origin policy -> why you need CORS\n" +
        "// understanding the stack turns 'mysterious bug' into 'expected behavior'."
    }
  ],
  whenToUse: "<p>Master these basics first &mdash; nearly every API design choice (REST resources, status codes, " +
    "headers, caching, auth) builds on HTTP and the request/response model. <strong>Gotchas:</strong> skipping " +
    "fundamentals leads to misusing HTTP (e.g. mutating data on GET, wrong status codes) and security gaps " +
    "(not understanding TLS, CORS). The subsequent sections drill into each piece; this is the orientation.</p>"
};

C["understand-tcp-ip"] = {
  summary: "<p><strong>TCP/IP</strong> is the suite of protocols that moves data across the internet. " +
    "<strong>IP</strong> routes packets between machines by address; <strong>TCP</strong> provides a " +
    "reliable, ordered, connection-based stream on top (handshake, retransmission, ordering) &mdash; which " +
    "HTTP runs over. <strong>UDP</strong> is the fast, connectionless alternative. Understanding TCP/IP " +
    "explains latency, connection overhead, and why HTTP behaves as it does.</p>",
  examples: [
    {
      title: "Example 1: The layers under an API call",
      description: "<p>HTTP rides on TCP rides on IP.</p>",
      code: "// HTTP (your API)        - request/response semantics\n//   over TLS             - encryption (HTTPS)\n//     over TCP           - reliable, ordered byte stream + handshake\n//       over IP          - routing packets by address"
    },
    {
      title: "Example 2: TCP reliability vs UDP speed",
      description: "<p>Why most APIs use TCP.</p>",
      code: "// TCP: connection setup + guaranteed, ordered delivery (retransmits loss)\n//   -> correct but adds latency (handshake, acks)\n// UDP: fire-and-forget, no guarantees -> fast (used for real-time media)\n// APIs need correctness -> TCP/HTTP (or HTTP/3 which uses QUIC over UDP)."
    },
    {
      title: "Example 3: connection setup cost and keep-alive",
      description: "<p>Each new TCP (+TLS) connection costs round-trips; reusing connections is a major API performance lever.</p>",
      code: "// cold connection: TCP handshake (1 RTT) + TLS handshake (1-2 RTT) BEFORE any data\n" +
        "//   -> a new connection PER request is brutal for latency.\n" +
        "// HTTP keep-alive / connection pooling reuses the established connection:\n" +
        "//   client keeps a pool of warm connections -> subsequent requests skip handshakes.\n" +
        "// this is why you reuse ONE HttpClient, not new-one-per-request."
    },
    {
      title: "Example 4 (edge case): TCP guarantees come with head-of-line blocking",
      description: "<p>TCP's in-order, reliable delivery means one lost packet stalls everything behind it - the reason HTTP/3 moved to UDP/QUIC.</p>",
      code: "// a single dropped packet -> TCP holds back all later bytes until it's resent\n" +
        "//   (head-of-line blocking), stalling even unrelated HTTP/2 streams on that conn.\n" +
        "// HTTP/3 (QUIC over UDP) gives independent streams -> no TCP-level HOL blocking.\n" +
        "// also: TCP adds latency/overhead vs UDP -> real-time/loss-tolerant flows (video,\n" +
        "//   games) sometimes prefer UDP, accepting loss for speed."
    }
  ],
  whenToUse: "<p>Understanding TCP/IP helps you reason about API performance and reliability &mdash; connection " +
    "reuse (keep-alive), the cost of many small requests (handshake overhead), timeouts, and why HTTP/2 " +
    "multiplexing and HTTP/3 (QUIC) exist. <strong>Gotchas:</strong> you rarely program TCP directly for " +
    "APIs, but its behavior matters: set timeouts, reuse connections, and understand that the network is " +
    "unreliable (design for retries/failures). It's foundational context, not day-to-day API code.</p>"
};

C["basics-of-dns"] = {
  summary: "<p><strong>DNS (Domain Name System)</strong> translates human-readable domain names " +
    "(<code>api.example.com</code>) into IP addresses machines route to. Every API call starts with a DNS " +
    "lookup (often cached). DNS also enables load distribution, failover, and routing to the nearest server " +
    "(geo/latency-based), making it a quietly important part of API infrastructure and availability.</p>",
  examples: [
    {
      title: "Example 1: Resolving an API hostname",
      description: "<p>Name to IP, with caching.</p>",
      code: "// Client calls https://api.example.com/...\n//   -> DNS resolves api.example.com -> 93.184.216.34 (cached per TTL)\n//   -> client connects to that IP\n// A wrong/expired DNS record or slow resolution adds latency or outages."
    },
    {
      title: "Example 2: DNS for routing & failover",
      description: "<p>Records can direct traffic and reroute on failure.</p>",
      code: "// Managed DNS (e.g. Route 53) policies:\n//   - latency/geo routing -> nearest region\n//   - weighted -> split traffic\n//   - health-checked failover -> route away from a down endpoint\n// (Failover via DNS is slow due to TTL caching.)"
    },
    {
      title: "Example 3: DNS for hosting, routing, and failover",
      description: "<p>Beyond name resolution, DNS records and policies route API traffic.</p>",
      code: "// A/AAAA   api.example.com -> IP(s)\n" +
        "// CNAME    api.example.com -> your-lb.cloudprovider.net\n" +
        "// GeoDNS   return the nearest region's IP by resolver location\n" +
        "// weighted/failover: shift % of traffic, or drop a dead endpoint via health checks\n" +
        "// this is how custom domains + multi-region API routing are wired up."
    },
    {
      title: "Example 4 (edge case): TTL caching delays DNS changes",
      description: "<p>DNS is heavily cached by TTL, so an IP/failover change doesn't take effect everywhere immediately - don't rely on DNS alone for fast failover.</p>",
      code: "// record TTL=3600 -> resolvers cache the old IP for up to an hour (some ignore TTL).\n" +
        "// you migrate/failover -> clients keep hitting the OLD IP until caches expire.\n" +
        "// mitigation: LOWER the TTL (e.g. 60s) BEFORE a planned change; for instant\n" +
        "//   failover use a load balancer / anycast IP, not DNS swaps.\n" +
        "// first-lookup latency also adds up -> connection reuse + caching help."
    }
  ],
  whenToUse: "<p>DNS knowledge matters for API hosting, custom domains, multi-region routing, and diagnosing " +
    "connectivity issues. <strong>Gotchas:</strong> DNS changes propagate slowly due to <strong>TTL " +
    "caching</strong> &mdash; failover isn't instant; use low TTLs for records you may need to change quickly. " +
    "DNS is a potential single point of failure and security target (spoofing/hijacking) &mdash; use a " +
    "reputable provider. For day-to-day API design it's background infrastructure, but it affects " +
    "availability and latency.</p>"
};

/* ===================== HTTP FUNDAMENTALS ===================== */

C["http"] = {
  summary: "<p><strong>HTTP (HyperText Transfer Protocol)</strong> is the request/response protocol that " +
    "powers the web and most APIs. A client sends a request (method + URL + headers + optional body); the " +
    "server returns a response (status code + headers + body). HTTP is <strong>stateless</strong> &mdash; " +
    "each request is independent (state is carried via tokens/cookies). Its methods, status codes, and " +
    "headers give APIs a rich, standard vocabulary.</p>",
  examples: [
    {
      title: "Example 1: Anatomy of request/response",
      description: "<p>The core pieces you design around.</p>",
      code: "// Request\nPOST /api/orders HTTP/1.1\nHost: example.com\nAuthorization: Bearer <token>\nContent-Type: application/json\n{ \"items\": [1, 2] }\n// Response\nHTTP/1.1 201 Created\nLocation: /api/orders/99\n{ \"id\": 99 }"
    },
    {
      title: "Example 2: Statelessness",
      description: "<p>Each request must carry its own context.</p>",
      code: "// The server keeps no per-connection memory between requests.\n// Identity travels in each request (token/cookie), not a session\n//   the connection 'remembers'. This enables horizontal scaling."
    },
    {
      title: "Example 3: anatomy of an HTTP request and response",
      description: "<p>An API call is a request line + headers + optional body, answered by a status line + headers + body.</p>",
      code: "// REQUEST\n" +
        "POST /orders HTTP/1.1\n" +
        "Host: api.example.com\n" +
        "Authorization: Bearer eyJ...\n" +
        "Content-Type: application/json\n" +
        "\n" +
        "{ \"items\": [42] }\n" +
        "// RESPONSE\n" +
        "HTTP/1.1 201 Created\n" +
        "Location: /orders/1001\n" +
        "{ \"orderId\": 1001 }"
    },
    {
      title: "Example 4 (edge case): HTTP is stateless - design around it",
      description: "<p>Each request is independent; the server remembers nothing between them unless you carry state (token/cookie) - a common source of confusion.</p>",
      code: "// the server does NOT 'remember' you between requests -> every request must carry\n" +
        "//   its own auth (Authorization header / session cookie).\n" +
        "// 'logged in' = the client re-presents a token each time, not server memory.\n" +
        "// statelessness is what lets you scale horizontally (any instance handles any\n" +
        "//   request) - so keep session state in a token or a shared store, not in-process."
    }
  ],
  whenToUse: "<p>HTTP is the foundation of web API design &mdash; use its semantics correctly: appropriate " +
    "methods, meaningful status codes, proper headers, and caching. <strong>Gotchas:</strong> respect " +
    "statelessness (don't rely on server-side connection memory). Use HTTPS always. Misusing methods/status " +
    "codes breaks clients, caching, and tooling. Prefer modern versions (HTTP/2, HTTP/3) for performance. The " +
    "following topics cover methods, status codes, headers, caching, and more in depth.</p>"
};

C["http-versions"] = {
  summary: "<p>HTTP has evolved: <strong>HTTP/1.1</strong> (text-based, one request at a time per connection &mdash; " +
    "head-of-line blocking), <strong>HTTP/2</strong> (binary, multiplexed streams over one connection, header " +
    "compression, server push), and <strong>HTTP/3</strong> (runs over QUIC/UDP, eliminating TCP head-of-line " +
    "blocking, faster connection setup). Each improves performance, especially for many concurrent requests.</p>",
  examples: [
    {
      title: "Example 1: The performance progression",
      description: "<p>Each version reduces blocking/latency.</p>",
      code: "// HTTP/1.1: one request per connection at a time (or pipelining, rarely used)\n//   -> head-of-line blocking; browsers open multiple connections\n// HTTP/2: many requests MULTIPLEXED over ONE connection + header compression\n// HTTP/3: over QUIC (UDP) -> no TCP head-of-line blocking, faster setup"
    },
    {
      title: "Example 2: Practical impact",
      description: "<p>Mostly automatic; enable at the server/CDN.</p>",
      code: "// You usually enable HTTP/2 or HTTP/3 at the server/load balancer/CDN.\n// Clients and your API code largely don't change - the benefits\n//   (multiplexing, less latency) come 'for free' once enabled."
    },
    {
      title: "Example 3: what each version improved",
      description: "<p>Each HTTP version mainly attacked latency/concurrency limits of the previous one.</p>",
      code: "// HTTP/1.1: text protocol, one request at a time per connection (browsers open ~6)\n" +
        "//   -> head-of-line blocking; needs many connections.\n" +
        "// HTTP/2:   binary, MULTIPLEXED streams over ONE connection + header compression\n" +
        "//   -> many concurrent requests, but still TCP-level HOL on packet loss.\n" +
        "// HTTP/3:   over QUIC (UDP) -> independent streams, faster handshakes, no TCP HOL."
    },
    {
      title: "Example 4 (edge case): HTTP/2 doesn't fix application-level mistakes",
      description: "<p>Multiplexing removed the need for old HTTP/1 hacks - keeping them can hurt - and version is negotiated, not guaranteed.</p>",
      code: "// HTTP/1 era hacks become ANTI-patterns on HTTP/2:\n" +
        "//   domain sharding + concatenating files -> unnecessary, can hurt caching/multiplex.\n" +
        "// Version is negotiated (ALPN) -> a client/proxy may still fall back to HTTP/1.1,\n" +
        "//   so don't ASSUME h2/h3; test the actual negotiated version.\n" +
        "// And no version fixes an N+1 chatty API or huge payloads - design still matters."
    }
  ],
  whenToUse: "<p>Enable HTTP/2 (and HTTP/3 where supported) at your server/CDN for better performance, " +
    "especially for APIs/pages making many requests. <strong>Gotchas:</strong> HTTP/2's multiplexing reduces " +
    "the benefit of old HTTP/1.1 hacks (domain sharding, concatenation) &mdash; don't carry them over. HTTP/2 " +
    "still suffers TCP-level head-of-line blocking (HTTP/3 fixes it via QUIC). Most gains are transparent to " +
    "your code. Ensure your infrastructure (proxies, CDNs) supports the version end-to-end. It's an " +
    "infrastructure choice more than an API-design one, but worth knowing.</p>"
};

C["http-methods"] = {
  summary: "<p><strong>HTTP methods (verbs)</strong> express the intended action on a resource: " +
    "<strong>GET</strong> (read, safe + idempotent), <strong>POST</strong> (create / non-idempotent action), " +
    "<strong>PUT</strong> (replace, idempotent), <strong>PATCH</strong> (partial update), " +
    "<strong>DELETE</strong> (remove, idempotent), plus <strong>HEAD</strong>/<strong>OPTIONS</strong>. Using " +
    "the right method gives APIs predictable semantics and enables caching, retries, and tooling.</p>",
  examples: [
    {
      title: "Example 1: Methods map to CRUD",
      description: "<p>Verb + resource expresses intent.</p>",
      code: "GET    /users      -> list users        (read)\nGET    /users/7    -> get one user       (read)\nPOST   /users      -> create a user       (not idempotent)\nPUT    /users/7    -> replace user 7      (idempotent)\nPATCH  /users/7    -> partially update    (update some fields)\nDELETE /users/7    -> delete user 7       (idempotent)"
    },
    {
      title: "Example 2: Safe and idempotent properties",
      description: "<p>Properties that matter for caching/retries.</p>",
      code: "// Safe (no side effects): GET, HEAD, OPTIONS -> cacheable, prefetchable\n// Idempotent (same result if repeated): GET, PUT, DELETE, HEAD\n//   -> safe to retry on network failure\n// POST is neither -> retrying may create duplicates (use idempotency keys)."
    },
    {
      title: "Example 3: safe vs idempotent methods (and why it matters)",
      description: "<p>Method semantics drive caching, prefetching, and safe client retries.</p>",
      code: "// SAFE (no side effects): GET, HEAD, OPTIONS  -> cacheable, prefetchable\n" +
        "// IDEMPOTENT (same result if repeated): GET, PUT, DELETE, HEAD\n" +
        "//   -> safe for clients/proxies to RETRY on timeout\n" +
        "// NOT idempotent: POST, PATCH(usually)\n" +
        "//   -> retrying may create duplicates -> needs an idempotency key\n" +
        "// PUT /users/5 {full object} == replace (idempotent); POST /users == create (not)."
    },
    {
      title: "Example 4 (edge case): PUT vs PATCH, and never mutate on GET",
      description: "<p>PUT replaces the whole resource while PATCH updates part - confusing them wipes fields; and state changes on GET are a classic bug.</p>",
      code: "// PUT replaces the ENTIRE resource -> omitted fields may be cleared:\n" +
        "//   PUT /users/5 { name:'Sam' }  -> email/role may be wiped if not included\n" +
        "// PATCH updates only what's sent:\n" +
        "//   PATCH /users/5 { name:'Sam' }  -> other fields untouched\n" +
        "// NEVER do state changes on GET (GET /delete?id=5) -> prefetch/cache/CSRF triggers it."
    }
  ],
  whenToUse: "<p>Choose the method that matches the operation's semantics &mdash; it's fundamental to RESTful " +
    "design. <strong>Gotchas:</strong> never mutate state on GET (crawlers/prefetch/caches will trigger it). " +
    "PUT replaces the whole resource; PATCH updates part &mdash; don't conflate them. POST isn't idempotent, " +
    "so retried POSTs can duplicate &mdash; support idempotency keys for critical creates. Return " +
    "<code>405</code> for unsupported methods. Handle OPTIONS for CORS preflight. Correct verbs make your API " +
    "predictable and tool-friendly.</p>"
};

C["http-status-codes"] = {
  summary: "<p><strong>HTTP status codes</strong> tell the client the outcome of a request, grouped by class: " +
    "<strong>2xx</strong> success (200 OK, 201 Created, 204 No Content), <strong>3xx</strong> redirection, " +
    "<strong>4xx</strong> client errors (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, " +
    "409 Conflict, 422 Unprocessable, 429 Too Many Requests), <strong>5xx</strong> server errors (500, 503). " +
    "Correct codes make APIs predictable and let clients react appropriately.</p>",
  examples: [
    {
      title: "Example 1: Common codes by scenario",
      description: "<p>Map outcomes to the right status.</p>",
      code: "201 Created       -> POST created a resource (+ Location header)\n204 No Content    -> success with empty body (e.g. DELETE)\n400 Bad Request   -> malformed request\n401 Unauthorized  -> not authenticated\n403 Forbidden     -> authenticated but not allowed\n404 Not Found     -> resource doesn't exist\n429 Too Many Requests -> rate limited (+ Retry-After)\n500 / 503         -> server error / unavailable"
    },
    {
      title: "Example 2: 401 vs 403, 400 vs 422",
      description: "<p>Subtle but important distinctions.</p>",
      code: "// 401 = WHO are you? (missing/invalid credentials)\n// 403 = I know who you are, but you CAN'T do this\n// 400 = the request is malformed (bad syntax)\n// 422 = syntax ok, but semantically invalid (validation failed)"
    },
    {
      title: "Example 3: the status code families and common members",
      description: "<p>Codes are grouped by class; clients branch on them (success, redirect, fix-your-request, server error).</p>",
      code: "// 2xx success:   200 OK, 201 Created (+Location), 204 No Content\n" +
        "// 3xx redirect:  301 Moved, 304 Not Modified (caching)\n" +
        "// 4xx client:    400 bad, 401 unauthenticated, 403 forbidden, 404 not found,\n" +
        "//                409 conflict, 422 validation, 429 rate limited\n" +
        "// 5xx server:    500 internal, 502/503/504 upstream/unavailable/timeout\n" +
        "// rule: 4xx = client must change the request; 5xx = server's fault (may retry)."
    },
    {
      title: "Example 4 (edge case): the '200 OK with an error inside' anti-pattern",
      description: "<p>Returning 200 for failures breaks clients, caches, and monitoring that rely on the status line.</p>",
      code: "// WRONG: HTTP 200 { \"success\": false, \"error\": \"not found\" }\n" +
        "//   -> caches cache the 'error', client retry logic thinks it succeeded,\n" +
        "//      dashboards show 0% error rate during an outage.\n" +
        "// RIGHT: use the real code -> 404 + a problem body.\n" +
        "// Also: don't overuse 200 for created (use 201) or misuse 401 (auth) vs 403\n" +
        "//   (authorized-but-forbidden) - clients react differently (re-login vs give up)."
    }
  ],
  whenToUse: "<p>Return accurate status codes on every response &mdash; clients, caches, and tooling rely on " +
    "them. <strong>Gotchas:</strong> a frequent anti-pattern is returning <code>200 OK</code> with an error " +
    "in the body &mdash; this breaks clients and caching; use the proper code. Distinguish 401 vs 403 and 400 " +
    "vs 422. Be mindful that codes can leak info (404 vs 403 reveals existence) &mdash; for auth, consider " +
    "uniform responses. Pair error codes with a structured error body (see RFC 7807). Don't invent " +
    "non-standard codes.</p>"
};

C["http-headers"] = {
  summary: "<p><strong>HTTP headers</strong> carry metadata about the request/response: content type " +
    "(<code>Content-Type</code>, <code>Accept</code>), authentication (<code>Authorization</code>), caching " +
    "(<code>Cache-Control</code>, <code>ETag</code>), CORS, rate limiting, and custom headers. They control " +
    "how requests/responses are interpreted, cached, secured, and negotiated &mdash; a key part of API " +
    "behavior beyond the body.</p>",
  examples: [
    {
      title: "Example 1: Common headers",
      description: "<p>Metadata that shapes handling.</p>",
      code: "// Request\nContent-Type: application/json   // body format\nAccept: application/json         // desired response format\nAuthorization: Bearer <token>    // credentials\n// Response\nContent-Type: application/json\nCache-Control: max-age=60\nETag: \"abc123\"                    // for conditional/cache validation"
    },
    {
      title: "Example 2: Security headers",
      description: "<p>Headers that harden responses.</p>",
      code: "Strict-Transport-Security: max-age=31536000  // force HTTPS\nX-Content-Type-Options: nosniff               // no MIME sniffing\nContent-Security-Policy: default-src 'self'   // restrict content sources"
    },
    {
      title: "Example 3: the headers an API uses constantly",
      description: "<p>Headers carry metadata: auth, content type, caching, and negotiation.</p>",
      code: "// request\n" +
        "Authorization: Bearer eyJ...\n" +
        "Content-Type: application/json     // what I'm sending\n" +
        "Accept: application/json           // what I want back\n" +
        "If-None-Match: \"abc123\"            // conditional GET (caching)\n" +
        "// response\n" +
        "Content-Type: application/json\n" +
        "Cache-Control: max-age=60\n" +
        "ETag: \"abc123\"                     // version tag for caching\n" +
        "X-RateLimit-Remaining: 99"
    },
    {
      title: "Example 4 (edge case): custom headers, case, and trusting forwarded values",
      description: "<p>Header names are case-insensitive, the <code>X-</code> prefix is deprecated, and proxy-set headers can be spoofed.</p>",
      code: "// case-insensitive: Content-Type == content-type (don't rely on exact case).\n" +
        "// X- prefix for custom headers is DEPRECATED (RFC 6648) -> use a plain name\n" +
        "//   (e.g. 'Idempotency-Key', not 'X-Idempotency-Key').\n" +
        "// SECURITY: never blindly trust X-Forwarded-For / X-User-Id -> a client can set\n" +
        "//   them unless your trusted proxy overwrites them. Only trust forwarded headers\n" +
        "//   set by infrastructure you control."
    }
  ],
  whenToUse: "<p>Use headers for content negotiation, auth, caching, CORS, and security on every API. " +
    "<strong>Gotchas:</strong> set correct <code>Content-Type</code> (and validate the request's). Put " +
    "credentials in <code>Authorization</code>, never in URLs. Use caching headers deliberately (a wrong " +
    "<code>Cache-Control: public</code> can leak private data). Custom headers conventionally aren't prefixed " +
    "<code>X-</code> anymore. Headers have size limits (avoid bloated tokens). Apply security headers " +
    "(HSTS, nosniff, CSP) consistently &mdash; often centrally at a gateway.</p>"
};

C["cookies"] = {
  summary: "<p><strong>Cookies</strong> are small pieces of data the server sets (<code>Set-Cookie</code>) and " +
    "the browser automatically sends back (<code>Cookie</code>) on subsequent requests &mdash; commonly used " +
    "for session management and auth in browser-based apps. Security attributes (<code>HttpOnly</code>, " +
    "<code>Secure</code>, <code>SameSite</code>) are critical to protect them from XSS and CSRF.</p>",
  examples: [
    {
      title: "Example 1: A secure session cookie",
      description: "<p>Set with protective attributes.</p>",
      code: "Set-Cookie: sessionId=abc123;\n  HttpOnly;            // JS can't read it (XSS protection)\n  Secure;              // sent only over HTTPS\n  SameSite=Strict;     // not sent on cross-site requests (CSRF protection)\n  Max-Age=3600; Path=/"
    },
    {
      title: "Example 2: Cookies vs token headers",
      description: "<p>Different storage/transport for credentials.</p>",
      code: "// Cookies: sent automatically by the browser -> convenient, but need\n//   CSRF protection (SameSite, CSRF tokens).\n// Bearer tokens (Authorization header): not auto-sent -> no CSRF, but\n//   vulnerable to XSS if stored in localStorage. Trade-offs both ways."
    },
    {
      title: "Example 3: secure cookie attributes",
      description: "<p>The security of a session cookie lives in its flags - set them all.</p>",
      code: "Set-Cookie: session=abc123;\n" +
        "  HttpOnly;        // JS (and XSS) can't read it\n" +
        "  Secure;          // sent only over HTTPS\n" +
        "  SameSite=Lax;    // not sent on most cross-site requests (CSRF defense)\n" +
        "  Path=/; Max-Age=3600\n" +
        "// the browser then attaches it automatically on requests to your domain."
    },
    {
      title: "Example 4 (edge case): cookies auto-send -> CSRF; and cross-site limits",
      description: "<p>Automatic sending is convenient but is exactly why CSRF exists; and SameSite/third-party rules complicate cross-origin APIs.</p>",
      code: "// Auto-attach means a malicious site can trigger an authenticated request\n" +
        "//   (CSRF) -> defend with SameSite + a CSRF token for state-changing requests.\n" +
        "// SameSite=Strict can break legit cross-site flows (links from email); Lax is\n" +
        "//   the usual balance. Third-party cookies are increasingly BLOCKED by browsers.\n" +
        "// For cross-origin SPAs/mobile, token-in-header auth is often simpler than cookies\n" +
        "//   (no CSRF, but then guard the token against XSS)."
    }
  ],
  whenToUse: "<p>Use cookies for session-based auth in traditional browser apps. <strong>Gotchas:</strong> " +
    "always set <code>HttpOnly</code> (blocks JS/XSS theft), <code>Secure</code> (HTTPS only), and " +
    "<code>SameSite</code> (CSRF defense). Because browsers send cookies automatically, cookie-auth APIs need " +
    "CSRF protection (SameSite + anti-CSRF tokens). For stateless APIs consumed by SPAs/mobile, bearer tokens " +
    "are common instead (but watch XSS/storage). Don't store sensitive data in cookies. Choose cookie vs " +
    "token based on client type and threat model.</p>"
};

C["cors"] = {
  summary: "<p><strong>CORS (Cross-Origin Resource Sharing)</strong> is a browser security mechanism that " +
    "controls whether a web page from one origin can call an API on a different origin. By default browsers " +
    "block cross-origin requests; the server opts in by sending CORS headers (<code>Access-Control-Allow-" +
    "Origin</code>, etc.). For non-simple requests, the browser sends a <strong>preflight OPTIONS</strong> " +
    "request first to check permission.</p>",
  examples: [
    {
      title: "Example 1: Allowing a specific origin",
      description: "<p>Server grants access to a trusted origin.</p>",
      code: "// Response headers from your API:\nAccess-Control-Allow-Origin: https://app.example.com\nAccess-Control-Allow-Methods: GET, POST, PUT, DELETE\nAccess-Control-Allow-Headers: Authorization, Content-Type\nAccess-Control-Allow-Credentials: true   // if using cookies"
    },
    {
      title: "Example 2: Preflight request",
      description: "<p>The browser checks before the real request.</p>",
      code: "// Browser sends first:\nOPTIONS /api/data\nOrigin: https://app.example.com\nAccess-Control-Request-Method: POST\n// Server must respond with the matching Allow-* headers\n//   before the browser sends the actual POST."
    },
    {
      title: "Example 3: a preflight + the response headers that allow it",
      description: "<p>For non-simple cross-origin requests the browser sends an OPTIONS preflight; the server must explicitly allow the origin/method/headers.</p>",
      code: "// browser preflight:\n" +
        "OPTIONS /orders\n" +
        "Origin: https://app.example.com\n" +
        "Access-Control-Request-Method: POST\n" +
        "// server must answer:\n" +
        "Access-Control-Allow-Origin: https://app.example.com\n" +
        "Access-Control-Allow-Methods: POST, GET\n" +
        "Access-Control-Allow-Headers: Content-Type, Authorization\n" +
        "// only then does the browser send the real request."
    },
    {
      title: "Example 4 (edge case): CORS is browser-enforced, and the wildcard+credentials trap",
      description: "<p>CORS protects browsers, not your API; and <code>*</code> can't be combined with credentials.</p>",
      code: "// CORS is enforced by the BROWSER, not the server -> curl/Postman/servers ignore\n" +
        "//   it. It is NOT authorization; it doesn't protect your API from non-browser clients.\n" +
        "// Invalid: Access-Control-Allow-Origin: *  WITH  Allow-Credentials: true\n" +
        "//   -> browser rejects it. With credentials you must echo a SPECIFIC origin.\n" +
        "// Reflecting ANY Origin back ('*'-equivalent) on a credentialed API is a security\n" +
        "//   hole -> allow-list exact origins."
    }
  ],
  whenToUse: "<p>Configure CORS on any API called by browser front-ends hosted on a different origin. " +
    "<strong>Gotchas:</strong> CORS is enforced by <em>browsers</em> only (not a server-side security control &mdash; " +
    "it doesn't protect against non-browser clients). <strong>Never use <code>Access-Control-Allow-Origin: " +
    "*</code> with credentials</strong> (cookies) &mdash; it's insecure and disallowed; allowlist specific " +
    "origins. Reflecting any Origin back is a common misconfiguration. Handle the preflight OPTIONS correctly. " +
    "CORS confuses many developers &mdash; remember it's about <em>browser</em> cross-origin rules, not API " +
    "authorization.</p>"
};

C["http-caching"] = {
  summary: "<p><strong>HTTP caching</strong> lets clients, proxies, and CDNs reuse responses instead of " +
    "re-fetching, reducing latency and server load. It's controlled by headers: <code>Cache-Control</code> " +
    "(max-age, public/private, no-store), <code>ETag</code>/<code>If-None-Match</code> and " +
    "<code>Last-Modified</code>/<code>If-Modified-Since</code> for revalidation (returning <code>304 Not " +
    "Modified</code> when unchanged). Well-designed caching dramatically improves API performance.</p>",
  examples: [
    {
      title: "Example 1: Cache-Control + ETag revalidation",
      description: "<p>Cache, then validate cheaply when stale.</p>",
      code: "// Response:\nCache-Control: max-age=60, public\nETag: \"v42\"\n// After max-age, client revalidates:\nGET /resource   If-None-Match: \"v42\"\n// Server: 304 Not Modified (no body resent) if unchanged"
    },
    {
      title: "Example 2: Public vs private; no-store",
      description: "<p>Control who may cache and what must not be.</p>",
      code: "Cache-Control: public, max-age=3600   // CDN/proxies may cache (shared)\nCache-Control: private, max-age=60    // only the user's browser\nCache-Control: no-store               // never cache (sensitive data)"
    },
    {
      title: "Example 3: Cache-Control plus conditional revalidation",
      description: "<p>Tell caches how long a response is fresh, then revalidate cheaply with ETag/If-None-Match.</p>",
      code: "// first response\n" +
        "Cache-Control: public, max-age=60\n" +
        "ETag: \"v7\"\n" +
        "// after max-age, client revalidates instead of re-downloading:\n" +
        "GET /products  If-None-Match: \"v7\"\n" +
        "-> 304 Not Modified   (no body re-sent; client keeps its cached copy)\n" +
        "// huge bandwidth saving for unchanged, frequently-fetched data."
    },
    {
      title: "Example 4 (edge case): caching private or dynamic data leaks/staleness",
      description: "<p>Caching the wrong things serves one user's data to another or shows stale results - scope caching deliberately.</p>",
      code: "// Per-user/auth'd response at a SHARED cache (CDN/proxy) -> user B gets user A's\n" +
        "//   data. Mark it: Cache-Control: private, no-store.\n" +
        "// public reference data -> Cache-Control: public, max-age=...\n" +
        "// you can't force-expire a client cache you already sent -> use versioned URLs\n" +
        "//   (content hashes) for assets, short max-age + ETag for changeable data.\n" +
        "// don't cache POST/responses that vary by header unless you set Vary correctly."
    }
  ],
  whenToUse: "<p>Cache cacheable GET responses (reference data, public content, expensive computations) to cut " +
    "latency and load. Use <code>ETag</code>/<code>Last-Modified</code> for revalidation of changing data. " +
    "<strong>Gotchas:</strong> the hard part is freshness &mdash; cached data can go stale; use validation or " +
    "short max-age and versioned URLs for immutable assets. <strong>Never cache private/per-user data as " +
    "<code>public</code></strong> (leaks data to other users via shared caches) &mdash; use " +
    "<code>private</code>/<code>no-store</code>. Only GET/HEAD are normally cacheable. Test caching behavior; " +
    "misconfiguration causes subtle, serious bugs.</p>"
};

C["content-negotiation"] = {
  summary: "<p><strong>Content negotiation</strong> lets the client and server agree on the response's format, " +
    "language, or encoding. The client expresses preferences via <code>Accept</code> (media type), " +
    "<code>Accept-Language</code>, <code>Accept-Encoding</code> headers, and the server responds with the " +
    "best match (and a matching <code>Content-Type</code>). It enables one endpoint to serve multiple " +
    "representations (JSON/XML, languages, gzip).</p>",
  examples: [
    {
      title: "Example 1: Format negotiation",
      description: "<p>Client requests a format; server honors it.</p>",
      code: "// Client:\nGET /api/users/7\nAccept: application/json\n// Server responds in JSON (Content-Type: application/json)\n// A different client sending Accept: application/xml could get XML."
    },
    {
      title: "Example 2: Compression and language",
      description: "<p>Negotiate encoding and locale.</p>",
      code: "Accept-Encoding: gzip, br      -> server may gzip the response\nAccept-Language: fr, en        -> server returns French if available\n// Server signals choices: Content-Encoding: gzip; Content-Language: fr"
    },
    {
      title: "Example 3: the client asks, the server picks",
      description: "<p>Content negotiation uses Accept* request headers; the server responds with the chosen representation.</p>",
      code: "// client:\n" +
        "Accept: application/json\n" +
        "Accept-Language: fr-FR, en;q=0.8\n" +
        "Accept-Encoding: gzip, br\n" +
        "// server picks the best match and signals it:\n" +
        "Content-Type: application/json\n" +
        "Content-Language: fr-FR\n" +
        "Content-Encoding: gzip\n" +
        "Vary: Accept, Accept-Language   // tell caches the response varies by these"
    },
    {
      title: "Example 4 (edge case): forget Vary -> caches serve the wrong variant",
      description: "<p>If a shared cache ignores the negotiated headers, one client's French/JSON response is served to a client wanting English/XML.</p>",
      code: "// Without 'Vary: Accept-Language', a CDN caches the FR response and serves it to\n" +
        "//   EN clients too -> wrong language for everyone after the first request.\n" +
        "// Always set Vary on the headers you negotiated on.\n" +
        "// Also: too many variants fragment the cache (low hit ratio). Many modern APIs\n" +
        "//   skip negotiation and use explicit URLs (/v2/...) or ?format=json - simpler\n" +
        "//   and cache-friendly. Negotiate only when you truly need multiple representations."
    }
  ],
  whenToUse: "<p>Use content negotiation when an API must serve multiple formats/languages/encodings from the " +
    "same URLs. In practice, many modern APIs are JSON-only (negotiation simplified), but encoding " +
    "negotiation (gzip/brotli) is near-universal for performance. <strong>Gotchas:</strong> always send an " +
    "accurate <code>Content-Type</code> matching what you returned. If you can't satisfy <code>Accept</code>, " +
    "return <code>406 Not Acceptable</code>. Don't over-engineer multi-format support you don't need. Vary " +
    "the cache by negotiated dimensions (<code>Vary</code> header) to avoid serving the wrong representation " +
    "from a cache.</p>"
};

C["url-query-path-parameters"] = {
  summary: "<p>APIs pass data through the URL in three ways: the <strong>path</strong> identifies a resource " +
    "(<code>/users/7</code>), <strong>path parameters</strong> are variables in the path " +
    "(<code>/users/{id}</code>), and <strong>query parameters</strong> (<code>?sort=name&page=2</code>) " +
    "provide filtering, sorting, pagination, and optional modifiers. Using each correctly makes URLs " +
    "intuitive and RESTful.</p>",
  examples: [
    {
      title: "Example 1: Path vs query parameters",
      description: "<p>Identify the resource in the path; modify with query.</p>",
      code: "GET /users/7                  // path: identifies user 7\nGET /users/7/orders           // nested resource\nGET /users?role=admin&page=2&sort=name\n//   query: filter (role), paginate (page), sort - all optional modifiers"
    },
    {
      title: "Example 2: When to use which",
      description: "<p>Required identity -> path; optional/filtering -> query.</p>",
      code: "// Path: required, hierarchical identity (which resource)\n//   /products/42\n// Query: optional, filtering/sorting/pagination/search\n//   /products?category=books&minPrice=10&limit=20"
    },
    {
      title: "Example 3: path for identity, query for modifiers",
      description: "<p>Path segments identify the resource; query params filter/sort/paginate it.</p>",
      code: "// path = WHICH resource (identity + hierarchy)\n" +
        "GET /users/42/orders/1001\n" +
        "// query = HOW to shape the result (filter/sort/paginate/search)\n" +
        "GET /orders?status=open&sort=-createdAt&page=2&limit=20\n" +
        "// don't encode identity in the query (GET /order?id=1001 is less RESTful than\n" +
        "//   /orders/1001), and don't put filters in the path."
    },
    {
      title: "Example 4 (edge case): never put sensitive data in the URL; encode special chars",
      description: "<p>Query/path values land in logs, history, and Referer headers, and unencoded characters break parsing.</p>",
      code: "// BAD: /search?token=SECRET or /users?ssn=123-45-6789\n" +
        "//   -> URLs are logged everywhere + leak via Referer. Put secrets in headers/body.\n" +
        "// Encode special characters: a space/&/? in a value must be percent-encoded\n" +
        "//   /search?q=tom%20%26%20jerry   (raw '&' would be parsed as a new param)\n" +
        "// also beware overly long URLs (server/proxy limits ~2-8KB) -> use a POST body\n" +
        "//   for large/complex queries."
    }
  ],
  whenToUse: "<p>Use the <strong>path</strong> for resource identity/hierarchy and <strong>query parameters</strong> " +
    "for filtering, sorting, pagination, and optional flags. <strong>Gotchas:</strong> don't put sensitive " +
    "data (tokens, PII) in URLs &mdash; they're logged everywhere. Keep paths noun-based (resources), not " +
    "verbs. Validate and sanitize all parameters (injection, path traversal). Use consistent query-param " +
    "naming across the API. Prefer query params for things that don't define identity; overloading the path " +
    "with filters makes ugly, inconsistent URLs.</p>"
};

/* ===================== API STYLES & DESIGN ===================== */

C["different-api-styles"] = {
  summary: "<p>There are several <strong>API styles</strong>, each with trade-offs: <strong>REST</strong> " +
    "(resource-based over HTTP, ubiquitous), <strong>GraphQL</strong> (client-specified queries, flexible " +
    "data fetching), <strong>gRPC</strong> (high-performance binary RPC over HTTP/2, internal services), " +
    "<strong>SOAP</strong> (XML-based, enterprise/legacy), and simple <strong>JSON/RPC</strong> styles. " +
    "Choosing the right style depends on consumers, performance needs, and flexibility.</p>",
  examples: [
    {
      title: "Example 1: Style by use case",
      description: "<p>Match the style to the need.</p>",
      code: "// REST    -> public/web APIs, CRUD, broad compatibility, cacheable\n// GraphQL -> flexible client data needs (mobile, varied UIs)\n// gRPC    -> internal high-performance service-to-service, typed contracts\n// SOAP    -> enterprise/legacy, strict contracts (WSDL), formal standards"
    },
    {
      title: "Example 2: Same operation, different styles",
      description: "<p>Fetching a user, conceptually.</p>",
      code: "// REST:    GET /users/7\n// GraphQL: query { user(id:7) { name email } }   (pick exact fields)\n// gRPC:    UserService.GetUser(GetUserRequest{id:7})  (typed RPC)"
    },
    {
      title: "Example 3: the major styles and their sweet spots",
      description: "<p>Each API style optimizes for different forces - pick by client needs and context.</p>",
      code: "// REST     - resource-oriented HTTP; safe default for public/web APIs, cacheable\n" +
        "// GraphQL  - client-specified queries; diverse/evolving client data needs\n" +
        "// gRPC     - typed, binary, fast; internal service-to-service\n" +
        "// SOAP     - heavy XML/contracts; legacy enterprise integration\n" +
        "// JSON-RPC / simple JSON - action-oriented internal endpoints\n" +
        "// webhooks/events - server pushes; async notifications"
    },
    {
      title: "Example 4 (edge case): you can mix styles - and each has a cost",
      description: "<p>Real systems combine styles; don't pick by hype, and remember every style carries operational baggage.</p>",
      code: "// common mix: public REST + GraphQL gateway for the SPA + gRPC between services\n" +
        "//   + webhooks for partner notifications.\n" +
        "// costs: GraphQL -> server N+1, harder caching, query-cost attacks; gRPC -> not\n" +
        "//   browser-native, binary debugging; SOAP -> verbose, tooling-heavy.\n" +
        "// choose for the CONSUMER + team, not novelty. REST is a fine default until a\n" +
        "//   concrete need (over-fetching, perf, streaming) justifies another style."
    }
  ],
  whenToUse: "<p>Choose the style per context: REST as a safe default for public/web APIs; GraphQL when diverse " +
    "clients need flexible data and you want to avoid over/under-fetching; gRPC for internal, " +
    "performance-critical service calls; SOAP mainly when integrating with existing enterprise systems. " +
    "<strong>Gotchas:</strong> don't pick by hype &mdash; each adds complexity (GraphQL: server complexity, " +
    "caching; gRPC: not browser-friendly; SOAP: heavyweight). Many systems are polyglot (REST externally, " +
    "gRPC internally). The detailed topics below cover each style.</p>"
};

C["restful-apis"] = {
  summary: "<p><strong>RESTful APIs</strong> model the system as <strong>resources</strong> (nouns) " +
    "identified by URLs and manipulated with standard HTTP methods, in a stateless way that leverages HTTP " +
    "features (status codes, caching, content negotiation). REST is the dominant style for web APIs due to " +
    "its simplicity, ubiquity, tooling, and cacheability. 'RESTful' loosely means 'follows REST conventions " +
    "over HTTP'.</p>",
  examples: [
    {
      title: "Example 1: Resource-oriented design",
      description: "<p>Nouns + verbs = predictable API.</p>",
      code: "GET    /articles            list\nPOST   /articles            create\nGET    /articles/42         read\nPUT    /articles/42         replace\nDELETE /articles/42         delete\nGET    /articles/42/comments  nested resource"
    },
    {
      title: "Example 2: Stateless + standard status codes",
      description: "<p>Each request self-contained; HTTP semantics honored.</p>",
      code: "POST /articles -> 201 Created + Location: /articles/42\nGET /articles/999 -> 404 Not Found\n// No server-side session between calls; auth travels in each request."
    },
    {
      title: "Example 3: resources + HTTP verbs, consistently",
      description: "<p>RESTful design models nouns and uses standard verbs/status codes uniformly.</p>",
      code: "GET    /articles            list      -> 200\n" +
        "POST   /articles            create    -> 201 + Location\n" +
        "GET    /articles/42         read      -> 200 / 404\n" +
        "PUT    /articles/42         replace   -> 200/204\n" +
        "PATCH  /articles/42         update    -> 200\n" +
        "DELETE /articles/42         remove    -> 204\n" +
        "// plural nouns, no verbs in URLs (/getArticle is NOT RESTful), nest for hierarchy."
    },
    {
      title: "Example 4 (edge case): not everything is a resource (actions)",
      description: "<p>Pure CRUD doesn't model verbs like 'publish' or 'search' cleanly - handle them pragmatically rather than contorting REST.</p>",
      code: "// awkward as pure CRUD: 'publish an article', 'send', 'search'\n" +
        "// pragmatic options:\n" +
        "//   POST /articles/42/publish        (a sub-resource action)\n" +
        "//   POST /articles/42:publish        (action syntax)\n" +
        "//   model state: PATCH /articles/42 { status: 'published' }\n" +
        "// don't twist everything into nouns; a few action endpoints are fine. Also REST's\n" +
        "//   over/under-fetching is real -> consider GraphQL/BFF when it bites."
    }
  ],
  whenToUse: "<p>Use REST for public web APIs, CRUD services, and broad compatibility &mdash; it's the safe " +
    "default with excellent tooling and caching. <strong>Gotchas:</strong> REST's fixed resource shapes cause " +
    "over-fetching (too much data) and under-fetching (many round-trips) &mdash; GraphQL addresses that. " +
    "Designing good resource URLs, using correct methods/status codes, and consistent conventions takes " +
    "discipline (verbs in URLs and misused codes are common smells). Plan versioning and error formats. For " +
    "highly variable client data or internal performance, consider GraphQL/gRPC instead.</p>"
};

C["simple-json-apis"] = {
  summary: "<p>A <strong>simple JSON API</strong> is a pragmatic, lightweight style: HTTP endpoints that " +
    "accept and return JSON, without strictly following all REST constraints (resource modeling, HATEOAS, " +
    "etc.). It often uses a few endpoints with action-oriented or RPC-like semantics. It's quick to build and " +
    "understand, common for internal tools and small services where full REST ceremony isn't needed.</p>",
  examples: [
    {
      title: "Example 1: Pragmatic JSON endpoints",
      description: "<p>JSON in, JSON out &mdash; not strict REST.</p>",
      code: "POST /api/sendEmail        { to, subject, body }  -> { sent: true }\nPOST /api/calculateTax    { amount, region }     -> { tax: 7.5 }\nGET  /api/dashboard       -> { stats, recent, alerts }\n// Action-oriented; not pure resource/REST modeling."
    },
    {
      title: "Example 2: When simplicity wins",
      description: "<p>Less ceremony for internal/small APIs.</p>",
      code: "// For an internal admin tool, you don't need HATEOAS, content\n//   negotiation, or perfect REST resources - just clear JSON endpoints\n//   that do the job. Keep it consistent and documented."
    },
    {
      title: "Example 3: action-oriented JSON over HTTP",
      description: "<p>A simple JSON/RPC-style API exposes operations directly, without strict REST resource modeling.</p>",
      code: "// not modeling resources - just calling actions:\n" +
        "POST /api  { \"method\": \"calculateShipping\", \"params\": { \"zip\": \"1011\" } }\n" +
        "-> 200 { \"result\": { \"cost\": 4.99 } }\n" +
        "// or simple endpoint-per-action:\n" +
        "POST /calculate-shipping { zip: '1011' } -> { cost: 4.99 }\n" +
        "// fast to build for internal tools where REST ceremony adds little."
    },
    {
      title: "Example 4 (edge case): it skips the conventions clients rely on",
      description: "<p>Without REST/HTTP semantics you lose caching, standard status handling, and discoverability - fine internally, weak for public APIs.</p>",
      code: "// everything via POST + 200 -> no HTTP caching, no method semantics, errors hidden\n" +
        "//   in the body (200 { ok:false }) -> tooling/monitoring can't reason about it.\n" +
        "// no standard pagination/filtering/versioning conventions -> each endpoint ad hoc.\n" +
        "// great for internal/prototype speed; for a PUBLIC, long-lived API prefer REST\n" +
        "//   (or a defined RPC like gRPC/JSON-RPC) so consumers get predictable behavior."
    }
  ],
  whenToUse: "<p>Use simple JSON APIs for internal tools, small services, prototypes, or RPC-style operations " +
    "where strict REST adds little value. They're fast to build and easy to consume. <strong>Gotchas:</strong> " +
    "'simple' still needs consistency, proper status codes, validation, auth, and error handling &mdash; don't " +
    "let 'pragmatic' mean 'sloppy'. As an API grows or goes public, the lack of REST conventions can hurt " +
    "discoverability, caching, and client expectations &mdash; consider migrating toward proper REST/GraphQL. " +
    "Match the rigor to the API's audience and lifespan.</p>"
};

C["soap-apis"] = {
  summary: "<p><strong>SOAP (Simple Object Access Protocol)</strong> is a mature, XML-based messaging protocol " +
    "for web services, with formal contracts (<strong>WSDL</strong>), strict typing, and built-in standards " +
    "(WS-Security, transactions, reliability). It's heavyweight and verbose compared to REST/JSON, but offers " +
    "rigorous contracts and enterprise features. It's largely legacy now but still common in enterprise, " +
    "finance, and government systems.</p>",
  examples: [
    {
      title: "Example 1: A SOAP message (XML envelope)",
      description: "<p>Verbose, structured XML.</p>",
      code: "<soap:Envelope>\n  <soap:Body>\n    <getUser><id>7</id></getUser>\n  </soap:Body>\n</soap:Envelope>\n// Contract defined formally in a WSDL document."
    },
    {
      title: "Example 2: SOAP vs REST",
      description: "<p>Formality/features vs simplicity.</p>",
      code: "// SOAP: XML, WSDL contract, WS-Security/transactions, protocol-agnostic\n//   -> rigorous but heavyweight/verbose\n// REST: JSON, HTTP-native, lightweight, cacheable\n//   -> simpler, dominant for new web APIs"
    },
    {
      title: "Example 3: XML envelope with a formal contract (WSDL)",
      description: "<p>SOAP wraps calls in a strict XML envelope and is described by a machine-readable WSDL contract.</p>",
      code: "POST /service  Content-Type: text/xml\n" +
        "<soap:Envelope>\n" +
        "  <soap:Body>\n" +
        "    <getOrder><id>1001</id></getOrder>\n" +
        "  </soap:Body>\n" +
        "</soap:Envelope>\n" +
        "// the WSDL defines operations/types -> clients are code-generated from it.\n" +
        "// built-in WS-* standards: WS-Security, transactions, reliable messaging."
    },
    {
      title: "Example 4 (edge case): verbose, heavy, and mostly legacy now",
      description: "<p>SOAP's rigor comes with overhead; for new APIs REST/gRPC are lighter - you'll meet SOAP integrating with existing enterprise systems.</p>",
      code: "// XML envelopes are large + slow to parse vs JSON; tooling-heavy; not browser-friendly.\n" +
        "// SOAP also opens XML attack surface (XXE, entity expansion) -> harden the parser.\n" +
        "// Choose SOAP almost only to integrate with EXISTING SOAP services (banking,\n" +
        "//   telecom, gov). For new work, REST/gRPC/GraphQL are the defaults.\n" +
        "// Its strengths (formal contracts, WS-Security, transactions) matter in regulated\n" +
        "//   enterprise integration - rarely elsewhere."
    }
  ],
  whenToUse: "<p>You'll mostly encounter SOAP when integrating with existing enterprise/legacy systems " +
    "(banking, ERP, government) that mandate it, or when you need its formal contracts and WS-* features " +
    "(strong security, transactions, reliable messaging). <strong>Gotchas:</strong> SOAP is verbose, complex, " +
    "and tooling-heavy; for new public/web APIs, REST or GraphQL is almost always preferable. The WSDL gives " +
    "strict contracts and codegen but is rigid. Don't choose SOAP for greenfield web APIs unless a specific " +
    "enterprise requirement demands it &mdash; it's a legacy/interop choice today.</p>"
};

C["graphql-apis"] = {
  summary: "<p><strong>GraphQL</strong> is a query language and runtime where the <em>client</em> specifies " +
    "exactly what data it needs in a single request, and the server returns precisely that shape. A typed " +
    "schema defines available types and operations (queries, mutations, subscriptions). It solves REST's " +
    "over-fetching and under-fetching, letting diverse clients fetch tailored data and related resources in " +
    "one round-trip.</p>",
  examples: [
    {
      title: "Example 1: Client picks exact fields",
      description: "<p>One query, precise data, nested relations.</p>",
      code: "query {\n  user(id: 7) {\n    name\n    orders(last: 3) { total product { name } }\n  }\n}\n// Returns exactly these fields - no over/under-fetching."
    },
    {
      title: "Example 2: The N+1 resolver pitfall",
      description: "<p>Naive resolvers fire a query per item.</p>",
      code: "// 100 users + each user's company:\n//   naive: 1 + 100 queries (N+1!)\n// Fix: batch with DataLoader -> 1 + 1 batched query.\n// GraphQL needs deliberate batching/caching."
    },
    {
      title: "Example 3: one endpoint, client picks the exact fields",
      description: "<p>GraphQL eliminates over/under-fetching - the query specifies precisely the data and shape needed.</p>",
      code: "POST /graphql\n" +
        "query {\n" +
        "  user(id: 42) {\n" +
        "    name\n" +
        "    orders(last: 3) { id total }   // related data in ONE round-trip\n" +
        "  }\n" +
        "}\n" +
        "// no over-fetch (only name + those order fields), no N+1 of REST calls; strongly\n" +
        "//   typed schema enables great tooling/introspection."
    },
    {
      title: "Example 4 (edge case): the complexity moves to the server",
      description: "<p>GraphQL solves client problems but introduces N+1 resolvers, weak HTTP caching, and query-cost DoS risk.</p>",
      code: "// server N+1: naively resolving orders for 100 users = 1 + 100 DB queries ->\n" +
        "//   use DataLoader (batch+cache per request).\n" +
        "// caching: everything is POST /graphql -> simple URL/CDN caching breaks ->\n" +
        "//   need persisted queries / response caching.\n" +
        "// a deeply-nested query can DoS you -> enforce depth/complexity limits + timeouts.\n" +
        "// for simple CRUD, REST is less machinery; adopt GraphQL when clients truly vary."
    }
  ],
  whenToUse: "<p>Use GraphQL when clients have diverse, evolving data needs and you want to avoid over/under-" +
    "fetching &mdash; mobile apps, rich front-ends, aggregating multiple sources behind one endpoint. It " +
    "gives flexibility and a strongly-typed, self-documenting schema. <strong>Gotchas:</strong> it shifts " +
    "complexity to the server &mdash; guard against the N+1 problem (DataLoader/batching) and expensive/" +
    "abusive queries (depth/complexity limits, rate limiting). HTTP caching is harder than REST (usually one " +
    "POST endpoint). For simple CRUD or when strong HTTP caching/ubiquity matters, REST is simpler. Invest in " +
    "the batching and security GraphQL requires.</p>"
};

C["grpc-apis"] = {
  summary: "<p><strong>gRPC</strong> is a high-performance RPC framework using <strong>Protocol Buffers</strong> " +
    "(compact binary serialization) over <strong>HTTP/2</strong>. You define services and messages in a " +
    "<code>.proto</code> contract, and gRPC generates typed client/server code in many languages. It offers " +
    "small fast payloads, streaming (including bidirectional), and strong typed contracts &mdash; excellent " +
    "for internal microservice communication.</p>",
  examples: [
    {
      title: "Example 1: A .proto contract",
      description: "<p>Define once; generate typed clients/servers.</p>",
      code: "service UserService {\n  rpc GetUser (GetUserRequest) returns (User);\n  rpc Watch (Query) returns (stream Event);  // server streaming\n}\nmessage GetUserRequest { int64 id = 1; }\n// Generates typed stubs in Go, Java, Python, etc."
    },
    {
      title: "Example 2: Efficiency + streaming",
      description: "<p>Binary, multiplexed, streaming over HTTP/2.</p>",
      code: "// Protobuf binary << JSON in size + parse cost.\n// Streaming types: unary, server-stream, client-stream, bidirectional.\n// Ideal for high-throughput internal service-to-service calls."
    },
    {
      title: "Example 3: contract-first Protobuf + streaming",
      description: "<p>gRPC generates typed clients/servers from a <code>.proto</code> and supports streaming over HTTP/2.</p>",
      code: "// orders.proto\n" +
        "service Orders {\n" +
        "  rpc Get(GetReq) returns (Order);           // unary\n" +
        "  rpc Watch(WatchReq) returns (stream Order); // server streaming\n" +
        "}\n" +
        "// codegen gives type-safe stubs in many languages; binary Protobuf is compact +\n" +
        "//   fast -> ideal for high-volume internal east-west traffic."
    },
    {
      title: "Example 4 (edge case): not browser-native; harder to debug",
      description: "<p>gRPC's binary HTTP/2 protocol isn't directly callable from browsers and isn't human-readable - so it's an internal, not public, choice.</p>",
      code: "// browsers can't speak raw gRPC -> need gRPC-Web + a proxy (Envoy) to bridge.\n" +
        "// binary payloads -> can't just curl/inspect; need grpcurl/tooling.\n" +
        "// schema changes require regenerating + redeploying clients (tight coupling).\n" +
        "// so: gRPC for internal services; expose REST/GraphQL at the public edge."
    }
  ],
  whenToUse: "<p>Use gRPC for internal service-to-service communication where performance, typed contracts, and " +
    "streaming matter &mdash; microservice meshes, low-latency/high-throughput APIs, polyglot environments. " +
    "<strong>Gotchas:</strong> not natively browser-callable (needs gRPC-Web + a proxy), so it's a poor fit " +
    "for public/web APIs (use REST/GraphQL there). Binary payloads aren't human-readable (harder debugging). " +
    "Adds build/tooling complexity (proto compilation) and contract coupling &mdash; manage schema evolution " +
    "carefully (protobuf is good at backward compatibility if you follow the rules). Reserve gRPC for " +
    "internal, performance-sensitive APIs.</p>"
};

C["rest-principles"] = {
  summary: "<p>The core <strong>REST principles</strong> (Roy Fielding): <strong>client-server</strong> " +
    "separation, <strong>statelessness</strong> (each request self-contained), <strong>cacheability</strong>, " +
    "a <strong>uniform interface</strong> (resources, standard methods, representations, HATEOAS), " +
    "<strong>layered system</strong> (intermediaries like proxies/gateways), and optional code-on-demand. " +
    "Following them yields scalable, evolvable, interoperable APIs. Most real APIs apply them pragmatically.</p>",
  examples: [
    {
      title: "Example 1: Statelessness + uniform interface",
      description: "<p>Self-contained requests on resources via standard verbs.</p>",
      code: "// Stateless: every request carries auth + all needed context\n//   (no server-side session memory) -> easy horizontal scaling\n// Uniform interface: resources + standard methods + representations\n//   GET/POST/PUT/DELETE on /resources with JSON"
    },
    {
      title: "Example 2: Cacheability + layered system",
      description: "<p>Responses declare caching; intermediaries are transparent.</p>",
      code: "// Cacheable: responses say Cache-Control/ETag -> proxies/CDNs reuse them\n// Layered: client doesn't know if it's talking to the server directly\n//   or through a gateway/CDN/load balancer."
    },
    {
      title: "Example 3: the REST constraints in practice",
      description: "<p>REST is defined by constraints that give it scalability and evolvability.</p>",
      code: "// statelessness: each request carries its own context (auth) -> any server handles it\n" +
        "// uniform interface: resources + standard verbs + standard status codes\n" +
        "// cacheability: GETs are cacheable via Cache-Control/ETag\n" +
        "// client-server: separation of concerns; layered: proxies/gateways are transparent\n" +
        "// these constraints are WHY REST scales horizontally and caches well."
    },
    {
      title: "Example 4 (edge case): 'RESTful' is a spectrum (Richardson Maturity)",
      description: "<p>Most APIs are pragmatically REST-ish, not textbook REST - chasing full HATEOAS purity rarely pays off.</p>",
      code: "// Richardson maturity: L0 single endpoint -> L1 resources -> L2 verbs+status\n" +
        "//   -> L3 hypermedia (HATEOAS).\n" +
        "// Most real-world 'REST' APIs sit at Level 2 and that's FINE.\n" +
        "// Common pragmatic breaks: action endpoints (/publish), non-stateless sessions.\n" +
        "// Don't be dogmatic - the goal is a clear, consistent, evolvable API, not a purity\n" +
        "//   badge."
    }
  ],
  whenToUse: "<p>Apply REST principles to build APIs that scale, cache, and evolve well. <strong>Gotchas:</strong> " +
    "statelessness is the most important and most-violated principle (don't rely on server session memory). " +
    "Full HATEOAS is rarely implemented in practice (most 'RESTful' APIs are pragmatic, not purist) &mdash; " +
    "that's usually fine. The principles are guidelines, not dogma; apply them where they add value (caching, " +
    "scalability, consistency) rather than chasing purity. Understanding them helps you design predictable, " +
    "tool-friendly APIs.</p>"
};

C["uri-design"] = {
  summary: "<p>Good <strong>URI design</strong> makes APIs intuitive and consistent. Use <strong>nouns, not " +
    "verbs</strong> (the HTTP method is the verb), <strong>plural resource names</strong>, hierarchy for " +
    "relationships (<code>/users/7/orders</code>), lowercase with hyphens, and query params for filtering/" +
    "pagination. Clear, predictable URIs are a hallmark of a well-designed REST API.</p>",
  examples: [
    {
      title: "Example 1: Good vs bad URIs",
      description: "<p>Nouns + methods, not verbs in the path.</p>",
      code: "// GOOD:\nGET    /users\nPOST   /users\nGET    /users/7/orders\n// BAD (verbs in URL, inconsistent):\nGET    /getUser?id=7\nPOST   /createUserOrder\nGET    /Users/7/Order_List"
    },
    {
      title: "Example 2: Conventions",
      description: "<p>Plural, lowercase-hyphenated, query for filters.</p>",
      code: "/products                      // plural collection\n/products/42                   // specific item\n/products?category=books&sort=price   // filtering/sorting via query\n/product-categories            // lowercase + hyphens for multi-word"
    },
    {
      title: "Example 3: consistent, resource-oriented URIs",
      description: "<p>Use plural nouns, lowercase + hyphens, and nesting for hierarchy - predictable URIs aid discoverability.</p>",
      code: "GET /users/42/orders/1001/items     // hierarchy reads naturally\n" +
        "// conventions:\n" +
        "//   plural nouns: /orders not /order\n" +
        "//   no verbs: /orders/42 (+DELETE) not /deleteOrder?id=42\n" +
        "//   lowercase + hyphens: /shipping-addresses not /shippingAddresses or /Shipping_Addresses\n" +
        "//   query for filters: /orders?status=open&sort=-date"
    },
    {
      title: "Example 4 (edge case): don't over-nest; trailing slashes; identifiers",
      description: "<p>Deep nesting becomes rigid, and small inconsistencies (slashes, ids in the path) cause real client bugs.</p>",
      code: "// over-nesting couples URLs to hierarchy + gets unwieldy:\n" +
        "//   /users/42/orders/1001/items/7/reviews/3  -> prefer /reviews/3 once you have an id\n" +
        "// trailing slash: /orders and /orders/ should not behave differently -> pick one,\n" +
        "//   redirect the other (a frequent 404/duplicate-content trap).\n" +
        "// use stable, opaque ids in the path; avoid exposing sequential ids (enumeration)."
    }
  ],
  whenToUse: "<p>Design URIs deliberately for any REST API &mdash; consistency aids discoverability and client " +
    "experience. <strong>Gotchas:</strong> avoid verbs in paths (the method conveys the action), avoid deep " +
    "nesting beyond ~2 levels (gets unwieldy &mdash; consider top-level resources with filters), be consistent " +
    "(plural vs singular, casing) across the whole API. Don't expose internal/sequential ids that enable " +
    "enumeration; don't put sensitive data in URIs. Keep URIs stable (they're a contract) and version them " +
    "when breaking changes are needed.</p>"
};

C["versioning-strategies"] = {
  summary: "<p><strong>API versioning</strong> lets you evolve an API without breaking existing clients. Common " +
    "strategies: <strong>URI versioning</strong> (<code>/v1/users</code>), <strong>header versioning</strong> " +
    "(<code>Accept: application/vnd.api.v2+json</code>), and <strong>query-param versioning</strong> " +
    "(<code>?version=2</code>). The goal is to introduce breaking changes safely while letting old clients " +
    "keep working.</p>",
  examples: [
    {
      title: "Example 1: Versioning approaches",
      description: "<p>Three common ways to signal version.</p>",
      code: "// URI (most common, visible, easy):\nGET /v2/users/7\n// Header (clean URLs, content negotiation):\nGET /users/7   Accept: application/vnd.example.v2+json\n// Query param:\nGET /users/7?version=2"
    },
    {
      title: "Example 2: Avoid breaking changes when possible",
      description: "<p>Additive changes don't need a new version.</p>",
      code: "// NON-breaking (no new version): add a new optional field/endpoint\n// BREAKING (new version): remove/rename a field, change types,\n//   change required params or response structure\n// Prefer additive evolution; version only for true breaks."
    },
    {
      title: "Example 3: the common versioning approaches",
      description: "<p>Several strategies exist; URI versioning is the simplest and most visible.</p>",
      code: "// URI:    /v2/orders                 (clear, cacheable, easy - most common)\n" +
        "// Header: Accept: application/vnd.api+json; version=2   (clean URLs, less obvious)\n" +
        "// Query:  /orders?version=2        (easy but mixes versioning into params)\n" +
        "// pick ONE and apply it consistently; URI versioning is the safe default."
    },
    {
      title: "Example 4 (edge case): prefer non-breaking evolution over new versions",
      description: "<p>Versioning is costly to maintain - most changes can be additive, avoiding a new version entirely.</p>",
      code: "// NON-breaking (no new version needed): add a new optional field, add an endpoint,\n" +
        "//   add an enum value clients can ignore.\n" +
        "// BREAKING (needs v2): rename/remove a field, change a type, change required params.\n" +
        "// every version you ship must be maintained + eventually deprecated (with notice +\n" +
        "//   sunset dates). Don't bump the version for changes you could make additive.\n" +
        "// communicate deprecations via headers (Deprecation, Sunset) + docs."
    }
  ],
  whenToUse: "<p>Version any public/long-lived API so you can evolve it without breaking clients. URI " +
    "versioning is the most common (simple, visible); header versioning is 'purer' but less discoverable. " +
    "<strong>Gotchas:</strong> versioning is a commitment &mdash; supporting many versions is costly, so " +
    "minimize breaking changes (prefer additive, backward-compatible evolution) and deprecate old versions on " +
    "a clear schedule. Pick one strategy and apply it consistently. Document version differences and " +
    "deprecation timelines. Internal APIs can sometimes avoid formal versioning by coordinating deploys.</p>"
};

C["handling-crud-operations"] = {
  summary: "<p><strong>CRUD (Create, Read, Update, Delete)</strong> maps naturally to HTTP methods in REST: " +
    "POST (create), GET (read), PUT/PATCH (update), DELETE (delete). Designing CRUD well means consistent " +
    "URIs, correct methods and status codes, proper request/response bodies, validation, and handling of " +
    "partial updates and not-found cases.</p>",
  examples: [
    {
      title: "Example 1: CRUD endpoints",
      description: "<p>The standard mapping with correct status codes.</p>",
      code: "POST   /tasks        { title }    -> 201 Created + body + Location\nGET    /tasks/5                   -> 200 OK { task } (or 404)\nPUT    /tasks/5      { full task } -> 200 OK (replace)\nPATCH  /tasks/5      { done: true }-> 200 OK (partial update)\nDELETE /tasks/5                   -> 204 No Content"
    },
    {
      title: "Example 2: PUT (replace) vs PATCH (partial)",
      description: "<p>Choose based on full vs partial update.</p>",
      code: "// PUT /tasks/5  -> client sends the WHOLE resource (replaces it)\n// PATCH /tasks/5 { \"done\": true }  -> updates only that field\n// PATCH is handy for partial updates; PUT for full replacement."
    },
    {
      title: "Example 3: the CRUD-to-HTTP mapping with correct codes",
      description: "<p>Each CRUD operation maps to a method + a status code clients expect.</p>",
      code: "// CREATE  POST   /orders        -> 201 Created + Location: /orders/1001\n" +
        "// READ    GET    /orders/1001   -> 200 / 404\n" +
        "// UPDATE  PUT    /orders/1001   -> 200/204 (replace) ; PATCH for partial\n" +
        "// DELETE  DELETE /orders/1001   -> 204 No Content (200 if returning a body)\n" +
        "// list:   GET /orders -> 200 + pagination (never an unbounded array)."
    },
    {
      title: "Example 4 (edge case): idempotency and delete semantics",
      description: "<p>Create-on-retry can duplicate, and deleting an already-deleted resource needs a defined, idempotent behavior.</p>",
      code: "// POST retried after a timeout -> duplicate order. Use an Idempotency-Key header\n" +
        "//   so the server returns the original result instead of creating again.\n" +
        "// DELETE is idempotent: deleting /orders/1001 twice should not error the 2nd time\n" +
        "//   -> return 204 (or 404) consistently, not a 500.\n" +
        "// PUT replaces the WHOLE resource (omitted fields cleared) - use PATCH for partial\n" +
        "//   updates so you don't accidentally wipe data."
    }
  ],
  whenToUse: "<p>CRUD is the backbone of most data APIs. <strong>Gotchas:</strong> use correct status codes " +
    "(201 + Location on create, 204 on delete, 404 on missing). Validate input and return clear errors (400/" +
    "422). PUT should be idempotent (full replace); be careful that PATCH semantics are well-defined (JSON " +
    "Patch vs merge). Handle concurrent updates (optimistic locking via ETag/version to avoid lost updates). " +
    "Enforce authorization per-object (don't let a user CRUD another's data). Consistent CRUD design makes " +
    "the whole API predictable.</p>"
};

C["building-json-restful-apis"] = {
  summary: "<p>Building <strong>JSON RESTful APIs</strong> combines REST principles with JSON payloads: " +
    "consistent resource URIs, correct HTTP methods/status codes, well-structured JSON request/response " +
    "bodies, consistent naming (camelCase or snake_case throughout), proper error formats, validation, and " +
    "documentation. It's the most common way to build modern web APIs.</p>",
  examples: [
    {
      title: "Example 1: Consistent JSON shapes",
      description: "<p>Predictable structure across endpoints.</p>",
      code: "// Consistent field casing + envelope conventions:\nGET /users/7 -> { \"data\": { \"id\": 7, \"firstName\": \"Sam\" } }\n// Errors in a consistent shape too:\n{ \"error\": { \"code\": \"NOT_FOUND\", \"message\": \"User 7 not found\" } }"
    },
    {
      title: "Example 2: Collections with metadata",
      description: "<p>Wrap lists with pagination info.</p>",
      code: "GET /users?page=2 -> {\n  \"data\": [ ... ],\n  \"meta\": { \"page\": 2, \"perPage\": 20, \"total\": 153 }\n}"
    },
    {
      title: "Example 3: consistent JSON conventions across the API",
      description: "<p>Pick conventions once - casing, envelopes, date format, nullability - and apply them everywhere.</p>",
      code: "// consistent shape:\n" +
        "{\n" +
        "  \"id\": 1001,\n" +
        "  \"createdAt\": \"2026-06-15T10:00:00Z\",   // ISO-8601 UTC, always\n" +
        "  \"totalCents\": 1999,                       // integer cents, not float dollars\n" +
        "  \"customer\": { \"id\": 42, \"name\": \"Sam\" }\n" +
        "}\n" +
        "// fix camelCase vs snake_case once; same date format + money representation everywhere."
    },
    {
      title: "Example 4 (edge case): floats for money, and JSON number precision",
      description: "<p>JSON numbers are IEEE-754 doubles - money as floats and large 64-bit ids both lose precision.</p>",
      code: "// money as float -> 0.1 + 0.2 = 0.30000000000000004 -> use integer cents or strings.\n" +
        "// big ids: JS Number is safe only to 2^53 -> a 64-bit id like 9007199254740993\n" +
        "//   silently rounds in JavaScript clients -> send large ids as STRINGS.\n" +
        "// also decide null vs omitted consistently (absent field vs \"x\": null mean\n" +
        "//   different things to clients), and don't leak internal/DB field names."
    }
  ],
  whenToUse: "<p>This is the default for most web/back-end APIs. <strong>Gotchas:</strong> be <strong>consistent</strong> &mdash; " +
    "pick one casing, one error format, one pagination style, and apply them everywhere (inconsistency " +
    "frustrates clients). Validate all input; return structured errors (RFC 7807). Don't leak sensitive " +
    "fields (use response DTOs). Set correct content types and status codes. Document the API (OpenAPI). " +
    "Decide on enveloping (<code>data</code> wrapper) deliberately. Plan versioning and pagination from the " +
    "start &mdash; retrofitting them is painful.</p>"
};

C["pagination"] = {
  summary: "<p><strong>Pagination</strong> splits large result sets into manageable pages so responses stay " +
    "fast and bounded. Two main approaches: <strong>offset/limit</strong> (<code>?page=2&limit=20</code> or " +
    "<code>?offset=40&limit=20</code> &mdash; simple but slow/inconsistent for large/changing data) and " +
    "<strong>cursor/keyset</strong> (<code>?after=&lt;cursor&gt;</code> &mdash; efficient and stable for " +
    "large datasets). Include metadata (total, next links) to help clients.</p>",
  examples: [
    {
      title: "Example 1: Offset vs cursor pagination",
      description: "<p>Simple offset vs efficient cursor.</p>",
      code: "// Offset (simple): GET /items?page=3&limit=20\n//   -> easy, but slow at high offsets + can skip/duplicate if data changes\n// Cursor/keyset (scalable): GET /items?limit=20&after=eyJpZCI6MTAwfQ\n//   -> uses a stable pointer; fast + consistent for large/live data"
    },
    {
      title: "Example 2: Pagination metadata",
      description: "<p>Tell the client how to get more.</p>",
      code: "{\n  \"data\": [ ... ],\n  \"pagination\": { \"nextCursor\": \"abc\", \"hasMore\": true }\n}\n// Or links: { \"next\": \"/items?after=abc\", \"prev\": \"...\" }"
    },
    {
      title: "Example 3: offset vs cursor pagination",
      description: "<p>Two main strategies - offset is simple; cursor is stable and scales to large/changing datasets.</p>",
      code: "// offset/limit (simple, but slow + unstable on deep/changing data):\n" +
        "GET /orders?page=3&limit=20            // -> items + total, page links\n" +
        "// cursor/keyset (stable, efficient for infinite scroll/large sets):\n" +
        "GET /orders?limit=20&after=eyJpZCI6MTAwMX0   // opaque cursor\n" +
        "-> { items: [...], nextCursor: '...' }\n" +
        "// always include a stable sort; never return an unbounded list."
    },
    {
      title: "Example 4 (edge case): offset pagination drifts and degrades",
      description: "<p>Offset pagination skips/duplicates rows when data changes mid-paging and gets slow at high offsets.</p>",
      code: "// page=2 (rows 21-40); meanwhile a new row is inserted at the top -> page 3 now\n" +
        "//   REPEATS a row you already saw (or skips one) -> inconsistent results.\n" +
        "// OFFSET 1000000 LIMIT 20 -> the DB still scans/discards a million rows -> slow.\n" +
        "// cursor/keyset (WHERE id < lastSeenId ORDER BY id) avoids both: stable + indexed.\n" +
        "// cap the max limit (e.g. 100) so clients can't request 100k at once."
    }
  ],
  whenToUse: "<p>Paginate any endpoint that can return many items &mdash; never return unbounded lists. Use " +
    "<strong>offset</strong> for small/admin datasets where simplicity matters; use <strong>cursor/keyset</strong> " +
    "for large, high-traffic, or frequently-changing data (better performance and consistency). " +
    "<strong>Gotchas:</strong> offset pagination degrades at high offsets (the DB scans/skips many rows) and " +
    "can skip/duplicate items if data changes between pages. Always cap <code>limit</code> (prevent abuse). " +
    "Provide consistent metadata/links. Decide and document one approach; mixing confuses clients.</p>"
};

C["rate-limiting"] = {
  summary: "<p><strong>Rate limiting</strong> caps how many requests a client can make in a time window to " +
    "protect the API from abuse, overload, and unfair usage. When exceeded, return <code>429 Too Many " +
    "Requests</code> with a <code>Retry-After</code> header. Common algorithms: token bucket, leaky bucket, " +
    "fixed/sliding window. Limits are often tiered by plan and communicated via response headers.</p>",
  examples: [
    {
      title: "Example 1: Limit + 429 + headers",
      description: "<p>Cap usage; tell clients their status.</p>",
      code: "// Response headers communicating limits:\nX-RateLimit-Limit: 100\nX-RateLimit-Remaining: 0\nRetry-After: 30\n// Over limit -> 429 Too Many Requests"
    },
    {
      title: "Example 2: Token bucket, shared across instances",
      description: "<p>Allow bursts; enforce globally.</p>",
      code: "// Token bucket (Redis-backed, shared by all API servers):\n//   capacity 100, refill 10/sec -> bursts allowed, sustained rate bounded\n// Tiered: free = 60/min, pro = 1000/min"
    },
    {
      title: "Example 3: communicate limits with standard headers + 429",
      description: "<p>Tell clients their budget and when to retry so well-behaved clients can self-throttle.</p>",
      code: "// on every response:\n" +
        "X-RateLimit-Limit: 100\n" +
        "X-RateLimit-Remaining: 12\n" +
        "X-RateLimit-Reset: 1718450000\n" +
        "// when exceeded:\n" +
        "HTTP 429 Too Many Requests\n" +
        "Retry-After: 30\n" +
        "// algorithms: token bucket (allow bursts), sliding window (smoother)."
    },
    {
      title: "Example 4 (edge case): distributed limits and shared IPs",
      description: "<p>Per-instance counters don't add up to a global limit, and IP-based limits punish users behind shared NATs.</p>",
      code: "// 5 instances each '100/min' in memory -> real limit is 500/min -> use a SHARED\n" +
        "//   store (Redis) for a true cluster-wide limit.\n" +
        "// limiting by IP blocks a whole office/carrier behind one NAT -> prefer per-API-\n" +
        "//   key/user when authenticated; IP only for anonymous traffic.\n" +
        "// tier limits (free vs paid), limit expensive endpoints harder, and return 429\n" +
        "//   (not 403/500) so clients know to back off."
    }
  ],
  whenToUse: "<p>Apply rate limiting to all public and many authenticated endpoints, especially auth, search, " +
    "and write-heavy ones. <strong>Gotchas:</strong> enforce limits in a <strong>shared</strong> store so " +
    "they apply across instances (per-instance limits multiply). Rate-limit by stable identity (API key/user) " +
    "where possible (IP limits hurt shared NATs and are evaded). Always send <code>429</code> + " +
    "<code>Retry-After</code> so good clients back off (avoid triggering retry storms). Communicate limits via " +
    "headers and document them. It's also covered under performance throttling &mdash; same concept, security " +
    "and stability lens.</p>"
};

C["idempotency"] = {
  summary: "<p><strong>Idempotency</strong> means an operation produces the same result whether performed " +
    "once or many times. GET/PUT/DELETE are naturally idempotent; POST is not (retrying can create " +
    "duplicates). For critical non-idempotent operations (payments, orders), APIs use <strong>idempotency " +
    "keys</strong>: the client sends a unique key, and the server returns the same result for repeats &mdash; " +
    "making retries safe.</p>",
  examples: [
    {
      title: "Example 1: Idempotency key for safe retries",
      description: "<p>A key dedupes retried requests.</p>",
      code: "POST /payments\nIdempotency-Key: req-abc-123\n{ \"amount\": 50 }\n// If the server already processed 'req-abc-123', it returns the SAME\n//   result instead of charging again. Network retry -> no double charge."
    },
    {
      title: "Example 2: Naturally idempotent methods",
      description: "<p>Some methods are safe to repeat by design.</p>",
      code: "PUT /users/7 { ... }   // replace -> same end state if repeated (idempotent)\nDELETE /users/7        // already deleted -> still deleted (idempotent)\nPOST /orders           // each call may create a NEW order (NOT idempotent)"
    },
    {
      title: "Example 3: an idempotency key for safe POST retries",
      description: "<p>A client-supplied key lets the server dedupe retries of non-idempotent operations like payments.</p>",
      code: "POST /payments   Idempotency-Key: 9f1c-7b2a-...   { amount: 999 }\n" +
        "// server:\n" +
        "//   if (seen(key)) return storedResponse(key);   // duplicate -> same result, no re-charge\n" +
        "//   else { r = charge(); store(key, r); return r; }\n" +
        "// a network timeout + client retry now charges ONCE and returns the original response."
    },
    {
      title: "Example 4 (edge case): which verbs are naturally idempotent",
      description: "<p>GET/PUT/DELETE are idempotent by spec; POST and relative updates are not - those are the ones needing keys.</p>",
      code: "// already idempotent: GET (read), PUT x=5 (set absolute), DELETE id\n" +
        "// NOT idempotent: POST /orders (new each call), balance = balance + 10 (accumulates)\n" +
        "// fixes: idempotency keys, OR model as absolute set ('set status=paid') instead\n" +
        "//   of relative ('add 10'). Store keys with a TTL + scope them per endpoint/user.\n" +
        "// retries are INEVITABLE in distributed systems -> design create/charge endpoints\n" +
        "//   to be safe under replay."
    }
  ],
  whenToUse: "<p>Design for idempotency wherever clients may retry &mdash; which in distributed systems is " +
    "everywhere. Use <strong>idempotency keys</strong> for critical creates/payments so network retries don't " +
    "duplicate. Make PUT/DELETE truly idempotent. <strong>Gotchas:</strong> store processed keys with their " +
    "results (and expire them) so repeats return the original outcome; define the key's scope (per endpoint/" +
    "user). Without idempotency, a timed-out-but-succeeded POST that the client retries causes double charges/" +
    "duplicate orders &mdash; a real, costly bug. It's the foundation of reliable retries.</p>"
};

C["hateoas"] = {
  summary: "<p><strong>HATEOAS (Hypermedia as the Engine of Application State)</strong> is the REST principle " +
    "that responses include <strong>links</strong> to related actions/resources, so clients navigate the API " +
    "dynamically via links rather than hardcoding URLs. In theory it makes APIs self-descriptive and " +
    "evolvable. In practice, it's the least-adopted REST constraint &mdash; most APIs skip it.</p>",
  examples: [
    {
      title: "Example 1: Links in the response",
      description: "<p>The response tells the client what it can do next.</p>",
      code: "GET /orders/42 -> {\n  \"id\": 42, \"status\": \"pending\",\n  \"_links\": {\n    \"self\":   { \"href\": \"/orders/42\" },\n    \"cancel\": { \"href\": \"/orders/42/cancel\", \"method\": \"POST\" },\n    \"pay\":    { \"href\": \"/orders/42/pay\", \"method\": \"POST\" }\n  }\n}"
    },
    {
      title: "Example 2: Dynamic vs hardcoded navigation",
      description: "<p>Clients follow links instead of building URLs.</p>",
      code: "// HATEOAS ideal: client follows _links.cancel.href (server controls URLs)\n// Reality: most clients hardcode '/orders/{id}/cancel' from docs anyway."
    },
    {
      title: "Example 3: responses include links to related actions",
      description: "<p>HATEOAS (hypermedia) embeds the next available actions as links, so clients navigate by following them rather than hardcoding URLs.</p>",
      code: "GET /orders/1001 ->\n" +
        "{\n" +
        "  \"id\": 1001, \"status\": \"open\",\n" +
        "  \"_links\": {\n" +
        "    \"self\":   { \"href\": \"/orders/1001\" },\n" +
        "    \"cancel\": { \"href\": \"/orders/1001/cancel\", \"method\": \"POST\" },\n" +
        "    \"pay\":    { \"href\": \"/orders/1001/pay\", \"method\": \"POST\" }\n" +
        "  }\n" +
        "}\n" +
        "// the server controls flow; clients discover what's possible from the response."
    },
    {
      title: "Example 4 (edge case): rarely worth the cost in practice",
      description: "<p>HATEOAS is the least-adopted REST level - clients usually hardcode URLs anyway, and the extra complexity seldom pays off.</p>",
      code: "// reality: most clients ignore _links and hardcode '/orders/{id}/cancel' ->\n" +
        "//   you pay for hypermedia but get none of the decoupling benefit.\n" +
        "// it shines for long-lived, autonomous, browser-like clients (and some standards\n" +
        "//   APIs) - rare in typical apps.\n" +
        "// don't force full HATEOAS for a purity badge; a Level-2 REST API with good docs\n" +
        "//   serves most teams better."
    }
  ],
  whenToUse: "<p>HATEOAS suits APIs that want maximum discoverability and the ability to change URLs/flows " +
    "without breaking clients (e.g. some hypermedia-driven or long-lived public APIs). <strong>Gotchas:</strong> " +
    "it's the <em>least</em> implemented REST constraint &mdash; most clients hardcode URLs from documentation " +
    "regardless, and it adds payload size and complexity for often-unused links. It's not 'wrong' to skip it; " +
    "most pragmatic REST APIs do. Adopt it only if clients will genuinely use the hypermedia (rare). Don't " +
    "feel un-RESTful for omitting it &mdash; it's a purist ideal more than a practical necessity.</p>"
};

C["error-handling"] = {
  summary: "<p>Good <strong>API error handling</strong> returns the correct HTTP status code plus a " +
    "consistent, structured, informative error body &mdash; an error code, a human-readable message, and " +
    "(where useful) details/field errors &mdash; without leaking sensitive internals. Consistent error " +
    "responses let clients handle failures programmatically and give developers clear, actionable " +
    "feedback.</p>",
  examples: [
    {
      title: "Example 1: A consistent error response",
      description: "<p>Status + structured body.</p>",
      code: "HTTP/1.1 422 Unprocessable Entity\n{\n  \"error\": {\n    \"code\": \"VALIDATION_ERROR\",\n    \"message\": \"Validation failed\",\n    \"details\": [ { \"field\": \"email\", \"issue\": \"invalid format\" } ]\n  }\n}"
    },
    {
      title: "Example 2: Don't leak internals",
      description: "<p>Generic to client, detailed in logs.</p>",
      code: "// BAD: return a stack trace / SQL error to the client (info disclosure)\n// GOOD: client gets { code: \"INTERNAL\", message: \"Something went wrong\" }\n//   while full details + a trace id are logged server-side."
    },
    {
      title: "Example 3: a consistent, machine-readable error body",
      description: "<p>Pair the right status code with a structured body clients can branch on - a stable code, a human message, and details.</p>",
      code: "HTTP 422 Unprocessable Entity\n" +
        "{\n" +
        "  \"code\": \"validation_error\",       // stable, machine-readable\n" +
        "  \"message\": \"Email is invalid\",     // human-friendly\n" +
        "  \"errors\": [ { \"field\": \"email\", \"issue\": \"format\" } ],\n" +
        "  \"traceId\": \"abc123\"                // correlate with server logs\n" +
        "}\n" +
        "// same shape for EVERY error so clients write one handler."
    },
    {
      title: "Example 4 (edge case): leaking internals vs being useless",
      description: "<p>Errors must help clients without exposing stack traces/SQL - and a generic '400 something went wrong' is equally unhelpful.</p>",
      code: "// LEAK: { error: 'SQLException at users.email: duplicate key ...' } -> reveals\n" +
        "//   schema/stack -> attacker intel. Log details SERVER-side (by traceId) only.\n" +
        "// USELESS: 400 { error: 'Bad Request' } with no detail -> client can't fix it.\n" +
        "// right balance: a stable code + actionable message + field-level detail, no\n" +
        "//   internals. Don't return 200 for errors. Localize messages if needed, but keep\n" +
        "//   the 'code' stable + language-independent."
    }
  ],
  whenToUse: "<p>Standardize error handling across the whole API. <strong>Gotchas:</strong> use the right " +
    "status code (don't return 200 with an error body). Keep a <strong>consistent</strong> error shape so " +
    "clients can parse it. Include a stable machine-readable <code>code</code> (not just a message). Never " +
    "expose stack traces, SQL, or internal paths to clients (log them instead; return a correlation/trace id " +
    "for support). Be careful errors don't leak whether accounts/resources exist (auth). Consider the RFC " +
    "7807 standard for a common format.</p>"
};

C["rfc-7807-problem-details-for-apis"] = {
  summary: "<p><strong>RFC 7807 (Problem Details for HTTP APIs)</strong> defines a standard JSON (or XML) " +
    "format for error responses, so APIs report problems in a consistent, machine-readable way. The media " +
    "type is <code>application/problem+json</code>, and the body has standard fields: <code>type</code> (a " +
    "URI identifying the problem), <code>title</code>, <code>status</code>, <code>detail</code>, and " +
    "<code>instance</code>, plus optional extensions.</p>",
  examples: [
    {
      title: "Example 1: A Problem Details response",
      description: "<p>The standardized error shape.</p>",
      code: "HTTP/1.1 403 Forbidden\nContent-Type: application/problem+json\n{\n  \"type\": \"https://example.com/probs/insufficient-funds\",\n  \"title\": \"Insufficient funds\",\n  \"status\": 403,\n  \"detail\": \"Your balance is 30 but the charge is 50.\",\n  \"instance\": \"/accounts/12/transactions\"\n}"
    },
    {
      title: "Example 2: Extension members",
      description: "<p>Add domain-specific fields alongside the standard ones.</p>",
      code: "{\n  \"type\": \".../validation-error\", \"title\": \"Validation failed\",\n  \"status\": 422,\n  \"errors\": [ { \"field\": \"email\", \"message\": \"invalid\" } ]  // extension\n}"
    },
    {
      title: "Example 3: the standard problem+json error shape",
      description: "<p>RFC 7807/9457 defines a standard error media type so clients and tools understand errors uniformly.</p>",
      code: "HTTP 403 Forbidden\n" +
        "Content-Type: application/problem+json\n" +
        "{\n" +
        "  \"type\": \"https://api.example.com/problems/insufficient-funds\",\n" +
        "  \"title\": \"Insufficient funds\",\n" +
        "  \"status\": 403,\n" +
        "  \"detail\": \"Your balance is 30 but 50 is required\",\n" +
        "  \"instance\": \"/accounts/12/transfers/abc\"\n" +
        "}\n" +
        "// 'type' is a stable URI clients key on; extension members add domain detail."
    },
    {
      title: "Example 4 (edge case): use the right content-type and stable type URIs",
      description: "<p>The benefit comes from the <code>application/problem+json</code> type and stable <code>type</code> URIs - not just any JSON error body.</p>",
      code: "// Returning the body as application/json (not problem+json) -> generic clients/\n" +
        "//   middleware won't recognize it as a Problem Details object.\n" +
        "// 'type' must be STABLE (clients branch on it) -> don't change/rename URIs casually.\n" +
        "// don't dump stack traces into 'detail'. RFC 9457 supersedes 7807 (same idea).\n" +
        "// adopting it is mostly free and gives consistent, tool-friendly errors."
    }
  ],
  whenToUse: "<p>Adopt RFC 7807 to give your API a consistent, standards-based error format that clients and " +
    "tools recognize &mdash; especially useful for public APIs and across microservices. It removes " +
    "guesswork about error shapes. <strong>Gotchas:</strong> use the <code>application/problem+json</code> " +
    "content type and the standard field names; add extensions for domain details (like field errors). Keep " +
    "<code>type</code> URIs stable (they identify problem categories). Don't leak sensitive info in " +
    "<code>detail</code>. Many frameworks have built-in RFC 7807 support. It's a great default for " +
    "consistency, though a well-designed custom format is acceptable if applied uniformly.</p>"
};

/* ===================== AUTHENTICATION & AUTHORIZATION ===================== */

C["authentication-methods"] = {
  summary: "<p><strong>Authentication</strong> verifies <em>who</em> a client is. Common methods: " +
    "<strong>Basic Auth</strong> (username:password, base64), <strong>API keys</strong> (identify an app), " +
    "<strong>token-based</strong> (bearer tokens like JWT), <strong>session-based</strong> (server session + " +
    "cookie), and <strong>OAuth2/OIDC</strong> (delegated/third-party login). The right choice depends on the " +
    "client type, statefulness needs, and security requirements.</p>",
  examples: [
    {
      title: "Example 1: Method by client",
      description: "<p>Match the scheme to the consumer.</p>",
      code: "// Browser SPA   -> token (JWT) or secure session cookie\n// Mobile app    -> OAuth2 (Authorization Code + PKCE)\n// Server-to-server -> API key / OAuth2 Client Credentials / mTLS\n// 'Login with Google' -> OpenID Connect"
    },
    {
      title: "Example 2: Presenting credentials",
      description: "<p>Standard transport for tokens.</p>",
      code: "Authorization: Bearer eyJhbGci...   // token-based\nAuthorization: Basic dXNlcjpwYXNz    // Basic (base64 user:pass) - HTTPS only!"
    },
    {
      title: "Example 3: matching the method to the client",
      description: "<p>Different callers warrant different auth - choose by client type and threat model.</p>",
      code: "// browser SPA / mobile -> OAuth2/OIDC + short-lived tokens (or secure cookies)\n" +
        "// server-to-server     -> client credentials (OAuth) / mTLS / signed requests\n" +
        "// third-party devs      -> API keys (identify app) + scopes + rate limits\n" +
        "// traditional web app   -> session cookies\n" +
        "// internal services     -> mTLS / service-mesh identity"
    },
    {
      title: "Example 4 (edge case): authentication is not authorization",
      description: "<p>Proving who you are (authN) is separate from what you may do (authZ) - both are required on protected endpoints.</p>",
      code: "// authN: 'this request is from user 42' (valid token/credential)\n" +
        "// authZ: 'may user 42 read THIS order?' (ownership/role/scope check)\n" +
        "// a valid token alone does NOT grant access -> still check object-level\n" +
        "//   authorization (the #1 API vuln, BOLA, is skipping that check).\n" +
        "// also: API keys IDENTIFY an app, they don't authenticate a USER - don't conflate."
    }
  ],
  whenToUse: "<p>Pick an authentication method per client type and threat model. <strong>Gotchas:</strong> " +
    "always use HTTPS (Basic Auth and bearer tokens are trivially sniffed otherwise). API keys identify an " +
    "<em>app</em>, not strong user auth. Tokens need secure storage (XSS) and short expiry; cookies need CSRF " +
    "defense. Don't invent custom auth &mdash; use standards/libraries. Authentication only proves identity &mdash; " +
    "always pair it with <strong>authorization</strong>. The sub-topics detail each method.</p>"
};

C["basic-auth"] = {
  summary: "<p><strong>Basic Authentication</strong> sends a base64-encoded <code>username:password</code> in " +
    "the <code>Authorization: Basic</code> header on every request. It's simple and widely supported, but the " +
    "credentials are only <em>encoded</em> (not encrypted), so it's <strong>only safe over HTTPS</strong> and " +
    "sends the password repeatedly. It's fine for simple, internal, or server-to-server cases but inferior to " +
    "tokens for user-facing apps.</p>",
  examples: [
    {
      title: "Example 1: The Basic Auth header",
      description: "<p>Base64 of user:password (not encryption!).</p>",
      code: "// 'sam:secret' -> base64 -> c2FtOnNlY3JldA==\nAuthorization: Basic c2FtOnNlY3JldA==\n// Anyone who intercepts this (without HTTPS) reads the password.\n// -> MUST be used only over TLS."
    },
    {
      title: "Example 2: Basic Auth vs tokens",
      description: "<p>Simple but limited.</p>",
      code: "// Basic Auth: password sent on EVERY request; no expiry/revocation;\n//   no scopes. Simple but coarse.\n// Tokens (JWT/OAuth): short-lived, scoped, revocable, password sent once.\n//   Preferred for user-facing APIs."
    },
    {
      title: "Example 3: base64(user:pass) in the Authorization header",
      description: "<p>HTTP Basic Auth sends credentials encoded (not encrypted) on every request - only safe over HTTPS.</p>",
      code: "Authorization: Basic c2FtOnBhc3N3b3Jk     // base64('sam:password')\n" +
        "// base64 is ENCODING, not encryption -> trivially decoded.\n" +
        "// therefore: ONLY over TLS, and credentials travel on EVERY request (more exposure).\n" +
        "// fine for a quick internal tool / server-to-server with a secret manager."
    },
    {
      title: "Example 4 (edge case): why it's weak for real apps",
      description: "<p>Basic Auth has no expiry, no scopes, and re-sends long-lived credentials constantly - prefer tokens for anything user-facing.</p>",
      code: "// problems: credentials sent every request (more chances to leak), no expiry/\n" +
        "//   revocation, no scopes, no MFA, and browsers cache them awkwardly.\n" +
        "// a leaked Basic credential = full access until the password is changed everywhere.\n" +
        "// for user-facing/public APIs use token-based auth (OAuth/JWT) or sessions;\n" +
        "//   reserve Basic for low-risk internal/script use over HTTPS."
    }
  ],
  whenToUse: "<p>Use Basic Auth for simple internal tools, scripts, or server-to-server calls where its " +
    "simplicity is worth it &mdash; <strong>always over HTTPS</strong>. <strong>Gotchas:</strong> it transmits " +
    "the password on every request (more exposure), has no built-in expiry, scopes, or revocation, and " +
    "encourages storing raw passwords client-side. For anything user-facing or security-sensitive, prefer " +
    "token-based or OAuth2. Never use it over plain HTTP. It's a pragmatic, low-effort scheme for low-risk, " +
    "internal scenarios &mdash; not for public APIs.</p>"
};

C["token-based-auth"] = {
  summary: "<p><strong>Token-based authentication</strong> issues the client a token after login, which it " +
    "sends on subsequent requests (usually <code>Authorization: Bearer &lt;token&gt;</code>). The server " +
    "validates the token instead of re-checking credentials. Tokens can be <strong>stateless</strong> " +
    "(self-contained, like JWT) or <strong>opaque</strong> (a reference looked up server-side). They suit " +
    "stateless APIs, SPAs, and mobile apps, and support short expiry + refresh.</p>",
  examples: [
    {
      title: "Example 1: Login then bearer token",
      description: "<p>Exchange credentials once for a token.</p>",
      code: "// 1. POST /login { user, pass } -> { accessToken, refreshToken }\n// 2. Subsequent requests:\nGET /api/orders\nAuthorization: Bearer <accessToken>\n// Server validates the token (no password re-check)."
    },
    {
      title: "Example 2: Access + refresh tokens",
      description: "<p>Short-lived access, longer refresh.</p>",
      code: "// Access token: short expiry (minutes), used on every request\n// Refresh token: longer, stored securely, revocable -> gets new access tokens\n// Stolen access token = useful only briefly."
    },
    {
      title: "Example 3: client presents a bearer token each request",
      description: "<p>The server issues a token at login; the client sends it in the Authorization header, and the server validates it statelessly.</p>",
      code: "// login -> token\n" +
        "POST /login -> { accessToken: 'eyJ...', refreshToken: '...' }\n" +
        "// every subsequent request carries it\n" +
        "GET /orders   Authorization: Bearer eyJ...\n" +
        "// server validates the token (signature/expiry) - no server-side session needed\n" +
        "//   -> scales horizontally; any instance can serve any request."
    },
    {
      title: "Example 4 (edge case): bearer tokens are 'whoever holds it' secrets",
      description: "<p>A leaked token works for anyone until it expires; storage and revocation are the hard parts.</p>",
      code: "// anyone with the token IS the user -> protect it: HTTPS only, never in URLs/logs.\n" +
        "// browser storage trade-off: localStorage -> XSS can steal it; HttpOnly cookie ->\n" +
        "//   safe from JS but needs CSRF protection. Pick deliberately.\n" +
        "// stateless tokens can't be easily revoked before expiry -> keep access tokens\n" +
        "//   SHORT + use refresh tokens (revocable, server-tracked) for longer sessions."
    }
  ],
  whenToUse: "<p>Use token-based auth for stateless APIs, SPAs, mobile apps, and microservices &mdash; it scales " +
    "horizontally (no server session needed) and supports scopes/expiry. <strong>Gotchas:</strong> store " +
    "tokens securely on the client (XSS can steal from <code>localStorage</code>; <code>HttpOnly</code> " +
    "cookies are safer but add CSRF concerns). Keep access tokens short-lived; use refresh tokens (rotated, " +
    "revocable) for longevity. Validate tokens fully (signature/expiry/scope) on every request. Stateless " +
    "tokens (JWT) are hard to revoke before expiry &mdash; plan for that. See JWT and OAuth2 sub-topics.</p>"
};

C["jwt"] = {
  summary: "<p>A <strong>JWT (JSON Web Token)</strong> is a compact, self-contained, signed token with three " +
    "parts (header, payload/claims, signature). It carries identity and claims (user id, roles, expiry) that " +
    "the server verifies by checking the signature &mdash; <strong>without server-side session storage</strong>. " +
    "Signed but not encrypted, so the payload is readable. JWTs are common for stateless API authentication.</p>",
  examples: [
    {
      title: "Example 1: JWT structure and use",
      description: "<p>Claims in the payload; verified by signature.</p>",
      code: "// header.PAYLOAD.signature\n// payload (decoded, readable by anyone):\n//   { \"sub\": \"user-7\", \"roles\": [\"user\"], \"exp\": 1718000000 }\nAuthorization: Bearer eyJhbGci...\n// Server verifies signature + exp -> trusts claims, no DB lookup."
    },
    {
      title: "Example 2: Security essentials",
      description: "<p>Pin algorithm; short expiry; no secrets in payload.</p>",
      code: "// - Validate the algorithm explicitly (reject 'none', avoid confusion)\n// - Short exp + refresh tokens (JWTs are hard to revoke early)\n// - NEVER put secrets/sensitive data in the payload (it's readable)\n// - Strong signing secret/key, kept safe"
    },
    {
      title: "Example 3: a self-contained, signed token",
      description: "<p>A JWT carries its claims in the payload and a signature any service can verify without a database lookup.</p>",
      code: "// header.payload.signature ; payload (decoded) is readable JSON:\n" +
        "{ \"sub\": \"42\", \"role\": \"editor\", \"exp\": 1718500000 }\n" +
        "// verify pinning the algorithm:\n" +
        "jwt.verify(token, publicKey, { algorithms: ['RS256'] });\n" +
        "// stateless: no session store; great for microservices that each verify locally."
    },
    {
      title: "Example 4 (edge case): the JWT footguns",
      description: "<p>JWTs are easy to misuse - readable payloads, hard revocation, and algorithm-confusion attacks.</p>",
      code: "// payload is base64, NOT encrypted -> never put secrets/PII in claims.\n" +
        "// can't revoke before exp -> keep access tokens short + use refresh tokens/denylist.\n" +
        "// ALWAYS pin algorithms on verify -> reject alg:'none' and RS256->HS256 confusion.\n" +
        "// decode != verify -> never trust jwt.decode() output without verifying signature.\n" +
        "// don't store in localStorage if you can avoid it (XSS); validate iss/aud/exp."
    }
  ],
  whenToUse: "<p>Use JWTs for stateless API auth &mdash; SPAs, mobile, microservices &mdash; where any server " +
    "can validate the token without shared session state. <strong>Gotchas:</strong> the payload is " +
    "<em>signed, not encrypted</em> (readable) &mdash; no secrets in it. The big weakness is <strong>revocation</strong>: " +
    "a valid JWT can't easily be invalidated before expiry &mdash; use short expiry + refresh tokens + a " +
    "denylist for emergencies. Validate the algorithm explicitly (reject <code>alg: none</code>/confusion " +
    "attacks). Use a strong secret/key. Don't bloat the payload (sent every request). For server-rendered " +
    "apps with sessions, plain sessions are often simpler.</p>"
};

C["oauth-2-0"] = {
  summary: "<p><strong>OAuth 2.0</strong> is the industry-standard protocol for <strong>delegated " +
    "authorization</strong> &mdash; letting an app access a user's resources on another service without " +
    "sharing passwords. It defines roles (resource owner, client, authorization server, resource server) and " +
    "flows (grant types). It powers 'Log in with Google/GitHub' and third-party API access. " +
    "<strong>OpenID Connect</strong> adds authentication on top of OAuth2.</p>",
  examples: [
    {
      title: "Example 1: Authorization Code flow (+ PKCE)",
      description: "<p>The recommended flow for user-facing apps.</p>",
      code: "// 1. App redirects user to the authorization server (Google)\n// 2. User authenticates + consents\n// 3. Server returns a short-lived CODE to the app's redirect URI\n// 4. App exchanges code (+ PKCE verifier) for tokens (back channel)\n// 5. App calls the API with the access token"
    },
    {
      title: "Example 2: Grant types by scenario",
      description: "<p>Pick the right flow.</p>",
      code: "// Authorization Code + PKCE -> user-facing apps (SPA, mobile, web)\n// Client Credentials       -> service-to-service (no user)\n// (Implicit + Password grants are deprecated - avoid)"
    },
    {
      title: "Example 3: delegated access without sharing the password",
      description: "<p>OAuth2 lets a user grant an app limited access to their data on another service, scoped and revocable.</p>",
      code: "// Authorization Code + PKCE flow:\n" +
        "// 1. app -> /authorize?client_id&scope=read:contacts&code_challenge&state\n" +
        "// 2. user consents at the provider -> redirect back with ?code&state\n" +
        "// 3. app -> /token (code + verifier) -> access token (scoped: read:contacts)\n" +
        "// the app NEVER sees the password; the user can revoke access anytime."
    },
    {
      title: "Example 4 (edge case): OAuth2 is authorization, not authentication - and easy to misconfigure",
      description: "<p>OAuth2 grants access to resources; for login identity use OpenID Connect on top. Flow misconfigs are dangerous.</p>",
      code: "// OAuth2 alone != 'who is the user' -> use OIDC (adds an id_token) for login.\n" +
        "// must-dos: exact redirect_uri match, 'state' (CSRF), PKCE for public clients,\n" +
        "//   validate token scope + audience on the resource server.\n" +
        "// the legacy Implicit flow (token in URL) is DEPRECATED -> use Auth Code + PKCE.\n" +
        "// don't build your own provider -> use a managed IdP (Auth0/Okta/Keycloak)."
    }
  ],
  whenToUse: "<p>Use OAuth2 for third-party/social login, delegated access, and API authorization across " +
    "services &mdash; whenever apps should access resources on a user's behalf without handling their " +
    "password. <strong>Gotchas:</strong> OAuth2 is complex with multiple flows &mdash; choosing the wrong one " +
    "is a common mistake (use Authorization Code + PKCE for user apps, Client Credentials for service-to-" +
    "service; avoid the deprecated Implicit/Password grants). Validate <code>redirect_uri</code> strictly, use " +
    "the <code>state</code> parameter (CSRF), and validate scopes/audience. Don't implement it yourself &mdash; " +
    "use a provider (Keycloak, Auth0, Okta) or vetted library. OAuth2 is authorization; for authentication use " +
    "OIDC on top.</p>"
};

C["session-based-auth"] = {
  summary: "<p><strong>Session-based authentication</strong> is the traditional stateful approach: on login " +
    "the server creates a <strong>session</strong> (stored server-side or in a shared store) and gives the " +
    "client a <strong>session ID</strong> in a cookie. The browser sends the cookie automatically on each " +
    "request, and the server looks up the session. It's well-suited to server-rendered web apps and offers " +
    "easy revocation (delete the session).</p>",
  examples: [
    {
      title: "Example 1: Session cookie flow",
      description: "<p>Server holds state; cookie carries the id.</p>",
      code: "// 1. POST /login -> server creates session, sets cookie:\n//    Set-Cookie: sessionId=abc; HttpOnly; Secure; SameSite=Strict\n// 2. Browser auto-sends the cookie on each request\n// 3. Server looks up session 'abc' -> knows the user\n// Logout = delete the session (instant revocation)."
    },
    {
      title: "Example 2: Sessions vs tokens",
      description: "<p>Stateful (revocable) vs stateless (scalable).</p>",
      code: "// Sessions: server-side state; easy revoke/logout; need a shared store\n//   to scale; cookies need CSRF protection.\n// Tokens (JWT): stateless, scale easily; harder to revoke before expiry."
    },
    {
      title: "Example 3: server-side session + a session-id cookie",
      description: "<p>The server stores session state and gives the client an opaque id in a secure cookie.</p>",
      code: "// login -> server creates a session, sets a cookie:\n" +
        "Set-Cookie: sid=opaque-random; HttpOnly; Secure; SameSite=Lax\n" +
        "// server keeps state: sessions[sid] = { userId: 42, ... }\n" +
        "// each request auto-sends the cookie -> server looks up the session.\n" +
        "// easy revocation: delete the session server-side -> instantly logged out."
    },
    {
      title: "Example 4 (edge case): CSRF and scaling the session store",
      description: "<p>Auto-sent cookies enable CSRF, and server-side sessions need a shared store to scale horizontally.</p>",
      code: "// CSRF: the cookie is sent automatically cross-site -> a malicious page can trigger\n" +
        "//   authenticated requests -> defend with SameSite + a CSRF token on writes.\n" +
        "// scaling: in-memory sessions break across instances (user hits a different server)\n" +
        "//   -> use a SHARED session store (Redis), not sticky sessions.\n" +
        "// sessions (stateful, revocable) vs tokens (stateless, hard to revoke) is the core\n" +
        "//   trade-off - sessions suit server-rendered apps, tokens suit SPAs/mobile/services."
    }
  ],
  whenToUse: "<p>Use session-based auth for traditional server-rendered web apps and when you want easy, " +
    "instant revocation and simpler security (no token storage on the client). <strong>Gotchas:</strong> it's " +
    "<em>stateful</em> &mdash; to scale across servers you need a shared session store (Redis), and sticky " +
    "sessions hurt elasticity. Cookies are auto-sent, so you must add <strong>CSRF protection</strong> " +
    "(SameSite + anti-CSRF tokens) and secure cookie flags. For stateless APIs/SPAs/mobile, tokens are often " +
    "preferred. Don't reinvent session management &mdash; use your framework's. Choose sessions vs tokens by " +
    "client type and revocation/scaling needs.</p>"
};

C["authorization-methods"] = {
  summary: "<p><strong>Authorization</strong> decides <em>what</em> an authenticated client may do. Common " +
    "models: <strong>RBAC</strong> (role-based &mdash; permissions via roles), <strong>ABAC</strong> " +
    "(attribute-based &mdash; rules over user/resource/context attributes), <strong>scopes</strong> (OAuth " +
    "permissions per token), and <strong>ACLs</strong> (per-resource permission lists). It always happens " +
    "<em>after</em> authentication and must be enforced server-side, including per-object checks.</p>",
  examples: [
    {
      title: "Example 1: RBAC vs ABAC",
      description: "<p>Role-based vs attribute/rule-based.</p>",
      code: "// RBAC: user has role ADMIN -> can DELETE\n//   if (user.hasRole('ADMIN')) allow();\n// ABAC: rule over attributes\n//   if (user.dept == resource.dept && time.isWorkHours()) allow();"
    },
    {
      title: "Example 2: Object-level authorization",
      description: "<p>Check ownership, not just role.</p>",
      code: "// Bug (BOLA/IDOR): GET /orders/42 checks login but not OWNERSHIP\n//   -> user reads someone else's order.\n// Fix: verify the authenticated user may access THIS specific object."
    },
    {
      title: "Example 3: authorize at the operation AND the object level",
      description: "<p>Two layers: may this role perform the action, and may this user touch this specific object.</p>",
      code: "// function-level (role/scope): can this user delete orders at all?\n" +
        "if (!user.can('orders:delete')) return res.status(403).end();\n" +
        "// object-level (ownership): is THIS order theirs (or are they admin)?\n" +
        "if (order.ownerId !== user.id && !user.isAdmin) return res.status(404).end();\n" +
        "// skipping the second check = BOLA, the #1 API vulnerability."
    },
    {
      title: "Example 4 (edge case): RBAC vs ABAC and enforcing server-side",
      description: "<p>Pick the model to fit your rules' complexity, and never rely on the client to hide actions.</p>",
      code: "// RBAC: simple role buckets (admin/editor/viewer) -> easy, can explode into\n" +
        "//   role-permutations as rules grow.\n" +
        "// ABAC: policy over attributes (department, time, resource owner) -> flexible but\n" +
        "//   complex to reason about/audit. Use it when RBAC needs too many roles.\n" +
        "// ALWAYS enforce on the server: hiding a button or omitting a link is UX, not\n" +
        "//   security -> the attacker just calls the endpoint directly."
    }
  ],
  whenToUse: "<p>Apply authorization to every protected operation. Use <strong>RBAC</strong> for straightforward " +
    "role-based access, <strong>ABAC</strong> for fine-grained, context-aware rules, <strong>scopes</strong> " +
    "for OAuth token permissions. <strong>Gotchas:</strong> <strong>Broken Object-Level Authorization (BOLA/" +
    "IDOR) is the #1 API vulnerability</strong> &mdash; always check that the user may access the <em>specific</em> " +
    "resource, not just that they're logged in or have a role. Enforce authz server-side (never trust the " +
    "client/UI). Centralize authorization logic. Fail closed (deny by default). The sub-topics detail RBAC and " +
    "ABAC.</p>"
};

C["role-based-access-control-rbac"] = {
  summary: "<p><strong>RBAC (Role-Based Access Control)</strong> grants permissions through <strong>roles</strong>: " +
    "users are assigned roles (admin, editor, viewer), and roles carry permissions. It simplifies access " +
    "management at scale &mdash; you manage role-permission mappings centrally and assign roles to users, " +
    "rather than per-user permissions. It's the most common authorization model.</p>",
  examples: [
    {
      title: "Example 1: Roles to permissions",
      description: "<p>Users get roles; roles grant permissions.</p>",
      code: "// Roles -> permissions:\n//   admin  -> [read, write, delete, manage-users]\n//   editor -> [read, write]\n//   viewer -> [read]\n// User Sam has role 'editor' -> can read + write, not delete.\nif (user.hasPermission(\"write\")) { /* allow */ }"
    },
    {
      title: "Example 2: Enforcing roles",
      description: "<p>Gate endpoints by role/permission.</p>",
      code: "// DELETE /users/7 requires the 'manage-users' permission (admins only)\n//   user lacks it -> 403 Forbidden\n// Often combined with object-level checks for fine control."
    },
    {
      title: "Example 3: roles bundle permissions; users get roles",
      description: "<p>RBAC assigns permissions to roles and roles to users - simple to reason about and audit.</p>",
      code: "const roles = {\n" +
        "  viewer: ['orders:read'],\n" +
        "  editor: ['orders:read', 'orders:write'],\n" +
        "  admin:  ['orders:read', 'orders:write', 'orders:delete', 'users:manage'],\n" +
        "};\n" +
        "function can(user, perm) { return roles[user.role].includes(perm); }\n" +
        "if (!can(user, 'orders:delete')) return res.status(403).end();"
    },
    {
      title: "Example 4 (edge case): role explosion and missing object-level checks",
      description: "<p>RBAC struggles with per-resource/contextual rules, leading to dozens of narrow roles - and roles alone don't check ownership.</p>",
      code: "// role explosion: 'editor-region-eu', 'editor-team-7', 'editor-readonly-friday' ->\n" +
        "//   when rules depend on attributes/context, RBAC needs combinatorial roles -> ABAC fits better.\n" +
        "// RBAC says 'editors may edit orders' but NOT 'this editor may edit THIS order' ->\n" +
        "//   still need an object-level ownership check (BOLA).\n" +
        "// keep roles coarse + meaningful; layer ABAC/ownership for fine-grained context."
    }
  ],
  whenToUse: "<p>Use RBAC for most applications with clear user categories &mdash; it's simple, well-understood, " +
    "and scales (manage roles, not individual permissions). <strong>Gotchas:</strong> RBAC can get unwieldy " +
    "with many fine-grained or context-dependent rules ('role explosion') &mdash; that's where ABAC fits " +
    "better. RBAC handles <em>what kind</em> of action, but you often still need <strong>object-level</strong> " +
    "checks (does this editor own <em>this</em> document?) to prevent IDOR. Keep role definitions clear and " +
    "least-privilege. Mismatched role-name prefixes/conventions cause subtle bugs. Combine RBAC with " +
    "per-resource authorization for fine control.</p>"
};

C["attribute-based-access-control-abac"] = {
  summary: "<p><strong>ABAC (Attribute-Based Access Control)</strong> grants access based on <strong>policies " +
    "that evaluate attributes</strong> of the user, the resource, the action, and the context (time, " +
    "location, etc.) &mdash; not just static roles. It's far more flexible and fine-grained than RBAC, " +
    "expressing rules like 'a manager can approve expenses in their own department under $10k during " +
    "business hours'.</p>",
  examples: [
    {
      title: "Example 1: Attribute-driven policy",
      description: "<p>Decisions from multiple attributes + context.</p>",
      code: "// Policy: allow if\n//   user.role == 'manager'\n//   AND user.department == expense.department\n//   AND expense.amount < 10000\n//   AND context.time within business hours\n// Far more expressive than a single role check."
    },
    {
      title: "Example 2: ABAC vs RBAC",
      description: "<p>Flexible rules vs simple roles.</p>",
      code: "// RBAC: 'admins can delete'  (coarse, role-based)\n// ABAC: 'users can delete records they own, if not locked, in their region'\n//   (fine-grained, context-aware) - harder to manage but very flexible"
    },
    {
      title: "Example 3: policy over attributes of subject, resource, action, context",
      description: "<p>ABAC decides access by evaluating attributes, enabling fine-grained, dynamic rules.</p>",
      code: "// allow if: same department AND it's business hours AND not a high-risk action\n" +
        "function allow(user, resource, action, ctx) {\n" +
        "  return user.dept === resource.dept\n" +
        "      && ctx.hour >= 9 && ctx.hour < 18\n" +
        "      && !(action === 'delete' && resource.sensitive);\n" +
        "}\n" +
        "// expresses rules RBAC can't without exploding into countless roles."
    },
    {
      title: "Example 4 (edge case): power vs auditability and performance",
      description: "<p>ABAC's flexibility makes policies hard to reason about, test, and debug - and attribute lookups add latency.</p>",
      code: "// 'why was this allowed/denied?' is hard to answer when policy spans many attributes\n" +
        "//   -> harder to audit/test than 'role X has permission Y'.\n" +
        "// evaluating policies may require fetching attributes (user dept, resource owner,\n" +
        "//   risk score) on every request -> latency; cache carefully.\n" +
        "// start with RBAC; adopt ABAC (or a policy engine like OPA) only when rules are\n" +
        "//   genuinely attribute-/context-driven. Often: RBAC for coarse + ABAC for the\n" +
        "//   few dynamic rules."
    }
  ],
  whenToUse: "<p>Use ABAC when access rules are fine-grained, dynamic, or context-dependent and RBAC would " +
    "require an unmanageable explosion of roles &mdash; regulated industries, multi-tenant systems, " +
    "ownership/context-sensitive access. <strong>Gotchas:</strong> ABAC is powerful but <strong>complex</strong> " +
    "to design, test, and reason about &mdash; policies can become hard to audit and debug, and " +
    "misconfiguration causes security holes. Consider a policy engine (OPA/Cedar) rather than hand-coding " +
    "rules. Often RBAC + a few attribute checks suffices &mdash; don't over-engineer with full ABAC unless the " +
    "flexibility is genuinely needed. Performance of policy evaluation matters at scale.</p>"
};

C["api-keys-management"] = {
  summary: "<p><strong>API keys</strong> are secret tokens that identify and authenticate a calling " +
    "<em>application</em> (not a user). Good <strong>key management</strong> covers generating strong keys, " +
    "transmitting them securely (header, not URL), scoping/limiting them, rotating them, revoking compromised " +
    "ones, and monitoring usage. Keys are simple and common for server-to-server and developer-facing APIs, " +
    "but are coarse-grained credentials.</p>",
  examples: [
    {
      title: "Example 1: Using and scoping a key",
      description: "<p>Send in a header; scope its permissions.</p>",
      code: "GET /api/data\nX-API-Key: sk_live_a1b2c3...     // identifies the app/account\n// Scope keys: read-only vs read-write; per-environment (test/live);\n//   rate-limited per key."
    },
    {
      title: "Example 2: Lifecycle management",
      description: "<p>Rotate, revoke, monitor.</p>",
      code: "// - Generate: long, random, prefixed (sk_live_) for identification\n// - Store: HASHED at rest (like passwords), never plaintext\n// - Rotate periodically; support multiple active keys for zero-downtime rotation\n// - Revoke instantly if leaked; monitor per-key usage for anomalies"
    },
    {
      title: "Example 3: issue, scope, and store keys safely",
      description: "<p>Treat API keys like passwords - hash at rest, scope them, and make rotation possible.</p>",
      code: "// give the client the key ONCE; store only a HASH:\n" +
        "//   keys(id, hashedKey, scopes, ownerId, createdAt, lastUsed, revokedAt)\n" +
        "// verify by hashing the presented key + constant-time compare.\n" +
        "// scope each key (read-only, specific endpoints), rate-limit per key,\n" +
        "//   support multiple active keys so rotation has zero downtime."
    },
    {
      title: "Example 4 (edge case): keys identify, they don't authenticate users - and they leak",
      description: "<p>API keys are long-lived bearer secrets for an app, not user auth, and they're frequently exposed.</p>",
      code: "// a key in frontend JS / a mobile app / a public repo is EXTRACTABLE -> never use\n" +
        "//   a single client-side key as the only protection for sensitive data.\n" +
        "// keys = 'which app', not 'which user' -> for user identity use OAuth/OIDC.\n" +
        "// hygiene: rotate regularly, revoke leaked keys fast, scan repos for committed keys,\n" +
        "//   send in a header (never the URL), and log usage to detect abuse."
    }
  ],
  whenToUse: "<p>Use API keys for server-to-server integrations, developer/partner APIs, and identifying " +
    "applications. <strong>Gotchas:</strong> keys identify an <em>app</em>, not strong user authentication &mdash; " +
    "don't use them for user auth. Transmit in headers over HTTPS (never in URLs &mdash; they leak in logs). " +
    "Store them hashed server-side. Support rotation and instant revocation, and scope/rate-limit each key. " +
    "Keys are frequently leaked (committed to git, in client code) &mdash; scan for exposure and rotate. " +
    "They're coarse; for fine-grained, user-centric access, prefer OAuth2/tokens with scopes.</p>"
};

/* ===================== DOCUMENTATION ===================== */

C["api-documentation-tools"] = {
  summary: "<p><strong>API documentation tools</strong> help you create, host, and maintain clear, " +
    "interactive docs so developers can understand and use your API. They range from spec-driven tools " +
    "(Swagger/OpenAPI UI), to documentation platforms (Readme.com, Stoplight), to API clients with doc " +
    "features (Postman). Good docs &mdash; with endpoints, parameters, examples, auth, and error formats &mdash; " +
    "are essential to API adoption.</p>",
  examples: [
    {
      title: "Example 1: Spec-driven docs",
      description: "<p>Generate interactive docs from an OpenAPI spec.</p>",
      code: "// Write/generate an OpenAPI (openapi.yaml) spec ->\n//   Swagger UI / Redoc renders interactive docs:\n//   - try-it-out console, schemas, examples, auth, error codes\n// Single source of truth (spec) drives docs + client/server codegen."
    },
    {
      title: "Example 2: The tool landscape",
      description: "<p>Different tools, different strengths.</p>",
      code: "// Swagger/OpenAPI -> standard spec + interactive UI (open, ubiquitous)\n// Readme.com      -> polished hosted developer portals\n// Stoplight       -> design-first OpenAPI editing + docs\n// Postman         -> client + collections + auto-generated docs"
    },
    {
      title: "Example 3: generate docs from a spec (single source of truth)",
      description: "<p>Write an OpenAPI spec and generate interactive docs/clients from it, so docs can't drift from the API.</p>",
      code: "// openapi.yaml describes paths, params, schemas, auth, examples\n" +
        "//   -> Swagger UI / Redoc render interactive docs\n" +
        "//   -> codegen produces typed client SDKs + server stubs\n" +
        "//   -> the spec is testable against the real API in CI\n" +
        "// one artifact drives docs, clients, and validation."
    },
    {
      title: "Example 4 (edge case): docs that drift are worse than none",
      description: "<p>Hand-written docs decay as the API changes; out-of-date examples actively mislead and erode trust.</p>",
      code: "// a doc showing a removed field or old auth scheme makes integrators chase ghosts\n" +
        "//   -> more support load than no docs.\n" +
        "// keep docs generated from the spec/code, validate the spec against the API in CI,\n" +
        "//   and include WORKING examples (and error responses), not just the happy path.\n" +
        "// design-first (write the spec, then build to it) keeps them aligned from the start."
    }
  ],
  whenToUse: "<p>Document every API &mdash; docs drive adoption and reduce support burden. Prefer " +
    "<strong>spec-driven</strong> docs (OpenAPI) so documentation, mocks, tests, and client SDKs share one " +
    "source of truth and stay in sync. <strong>Gotchas:</strong> docs that drift from the actual API are " +
    "worse than none &mdash; generate/validate from the spec or code, and keep them current. Include realistic " +
    "examples, auth instructions, error formats, and rate limits. For public APIs, a polished portal matters; " +
    "for internal, Swagger UI may suffice. The sub-topics cover specific tools.</p>"
};

C["swagger-open-api"] = {
  summary: "<p><strong>OpenAPI</strong> (formerly Swagger) is the industry-standard specification for " +
    "describing REST APIs in a machine-readable format (YAML/JSON): endpoints, methods, parameters, request/" +
    "response schemas, auth, and examples. From one spec you get <strong>interactive docs (Swagger UI/Redoc)</strong>, " +
    "<strong>mock servers</strong>, <strong>client/server code generation</strong>, and " +
    "<strong>validation</strong> &mdash; a single source of truth for the API contract.</p>",
  examples: [
    {
      title: "Example 1: An OpenAPI snippet",
      description: "<p>Declarative description of an endpoint.</p>",
      code: "paths:\n  /users/{id}:\n    get:\n      parameters:\n        - name: id\n          in: path\n          required: true\n          schema: { type: integer }\n      responses:\n        '200':\n          description: A user\n          content:\n            application/json:\n              schema: { $ref: '#/components/schemas/User' }"
    },
    {
      title: "Example 2: What the spec powers",
      description: "<p>One spec, many outputs.</p>",
      code: "// From openapi.yaml:\n//   - Swagger UI / Redoc -> interactive docs\n//   - codegen -> typed client SDKs + server stubs\n//   - mock server -> develop against the API before it exists\n//   - request/response validation in middleware"
    },
    {
      title: "Example 3: a minimal OpenAPI definition",
      description: "<p>OpenAPI (formerly Swagger) is a machine-readable description of your REST API that powers docs, codegen, and validation.</p>",
      code: "openapi: 3.1.0\n" +
        "paths:\n" +
        "  /orders/{id}:\n" +
        "    get:\n" +
        "      parameters: [{ name: id, in: path, required: true, schema: { type: integer } }]\n" +
        "      responses:\n" +
        "        '200': { description: OK, content: { application/json: { schema: { $ref: '#/components/schemas/Order' } } } }\n" +
        "        '404': { description: Not found }\n" +
        "// -> Swagger UI docs, client SDKs, and request/response validation, all from this."
    },
    {
      title: "Example 4 (edge case): design-first vs code-first, and spec drift",
      description: "<p>Generating the spec from code is convenient but can lag intent; either approach must be validated against the running API.</p>",
      code: "// design-first: write openapi.yaml, get team review, THEN build to it (great for\n" +
        "//   contracts/governance, parallel client+server work).\n" +
        "// code-first: annotations generate the spec (less duplication, but the spec only\n" +
        "//   reflects what's coded, not what was intended).\n" +
        "// either way: VALIDATE the spec against the real API in CI (e.g. schemathesis/dredd)\n" +
        "//   so the contract and implementation can't silently diverge."
    }
  ],
  whenToUse: "<p>Use OpenAPI for essentially all REST APIs &mdash; it's the standard, with vast tooling. Adopt " +
    "<strong>design-first</strong> (write the spec, agree the contract, then build) or generate the spec from " +
    "code &mdash; either way keep it the source of truth. <strong>Gotchas:</strong> the biggest risk is the " +
    "spec drifting from the real API; validate requests/responses against it and/or generate it from code, and " +
    "run it in CI. OpenAPI fits REST best (GraphQL/gRPC have their own schemas). Keep schemas DRY with " +
    "<code>$ref</code> components. A good spec dramatically improves docs, client generation, and testing.</p>"
};

C["readme-com"] = {
  summary: "<p><strong>Readme.com</strong> is a hosted developer-documentation platform for creating polished, " +
    "branded API reference portals and guides. It ingests your OpenAPI spec to generate interactive reference " +
    "docs (with a try-it console), and adds guides, changelogs, search, and developer-experience features &mdash; " +
    "aimed at public/partner APIs where a great developer portal drives adoption.</p>",
  examples: [
    {
      title: "Example 1: Spec-driven portal",
      description: "<p>Import OpenAPI; get an interactive portal.</p>",
      code: "// Import openapi.yaml into Readme ->\n//   - branded reference docs with 'try it' console\n//   - auto-generated code samples in multiple languages\n//   - guides, tutorials, changelog, search"
    },
    {
      title: "Example 2: Developer experience focus",
      description: "<p>More than reference: a full portal.</p>",
      code: "// Beyond raw reference docs, Readme adds:\n//   onboarding guides, API key management UI, usage metrics,\n//   versioned docs, community/support - a polished DX."
    },
    {
      title: "Example 3: a hosted developer hub on top of your spec",
      description: "<p>Readme.com turns an OpenAPI spec into a polished portal with guides, an API explorer, and personalized examples.</p>",
      code: "// import openapi.yaml -> get:\n" +
        "//   - auto-generated reference docs + 'try it' API explorer\n" +
        "//   - hand-written guides/tutorials alongside the reference\n" +
        "//   - code samples in multiple languages, prefilled with the user's API key\n" +
        "//   - changelog + versioned docs\n" +
        "// aimed at a professional public/partner developer experience."
    },
    {
      title: "Example 4 (edge case): hosted convenience vs control/cost",
      description: "<p>Managed doc platforms trade ownership and cost for polish - and the spec still has to be kept current.</p>",
      code: "// trade-offs: subscription cost, your docs live on a third party, less control over\n" +
        "//   hosting/branding internals, potential lock-in.\n" +
        "// it does NOT fix spec drift -> if your OpenAPI is stale, the pretty portal is\n" +
        "//   confidently wrong.\n" +
        "// for internal-only or simple APIs, self-hosted Swagger UI/Redoc may be enough;\n" +
        "//   reach for a hosted hub when DX for external developers is a priority."
    }
  ],
  whenToUse: "<p>Consider Readme.com for <strong>public or partner-facing APIs</strong> where a professional, " +
    "branded developer portal and great DX boost adoption and reduce support load. <strong>Gotchas:</strong> " +
    "it's a paid, hosted product (cost, vendor dependence) &mdash; for purely internal APIs, free options " +
    "(Swagger UI/Redoc) are usually enough. Keep the underlying OpenAPI spec accurate (the portal is only as " +
    "good as the spec). It's one of several doc platforms (Stoplight, GitBook, etc.); choose based on DX " +
    "needs, budget, and how much guide/tutorial content you maintain.</p>"
};

C["stoplight"] = {
  summary: "<p><strong>Stoplight</strong> is an API design and documentation platform centered on a " +
    "<strong>design-first</strong> workflow: a visual OpenAPI editor, style/linting governance (Spectral), " +
    "mock servers, and hosted docs. It helps teams design consistent, standards-compliant APIs " +
    "<em>before</em> coding and keep the spec as the source of truth.</p>",
  examples: [
    {
      title: "Example 1: Design-first with governance",
      description: "<p>Visually design + lint the spec.</p>",
      code: "// Stoplight Studio: visual OpenAPI editor (no raw YAML wrangling)\n// Spectral linting: enforce style rules (naming, required fields,\n//   error formats) -> consistent APIs across teams\n// + mock servers + hosted docs from the same spec."
    },
    {
      title: "Example 2: Mock before building",
      description: "<p>Frontend works against a mock from the spec.</p>",
      code: "// From the OpenAPI spec, Stoplight serves a mock API ->\n//   frontend/clients integrate against it before the backend exists\n//   -> parallel development; the spec is the contract."
    },
    {
      title: "Example 3: design-first authoring with governance",
      description: "<p>Stoplight provides a visual OpenAPI editor plus style/linting rules to enforce consistency across many APIs.</p>",
      code: "// visual + code editor for openapi.yaml (no hand-writing YAML by feel)\n" +
        "// Spectral lint rules enforce org standards:\n" +
        "//   - every operation has an operationId + description\n" +
        "//   - paths are kebab-case; all 4xx/5xx documented\n" +
        "//   - naming/versioning conventions\n" +
        "// -> consistent contracts across teams BEFORE any code is written."
    },
    {
      title: "Example 4 (edge case): tooling helps only if the org adopts the process",
      description: "<p>Governance tooling adds value with design-first discipline; bolted onto a code-first team it's friction.</p>",
      code: "// if teams build first and back-fill specs, the design-first/governance benefits\n" +
        "//   (review-before-build, shared standards) mostly evaporate.\n" +
        "// Spectral linting can be adopted standalone in CI without the whole platform.\n" +
        "// for a single small API, a plain OpenAPI file + Swagger UI may be all you need;\n" +
        "//   Stoplight shines at scale (many APIs, many teams, governance requirements)."
    }
  ],
  whenToUse: "<p>Use Stoplight when you want a <strong>design-first</strong> process with API governance/" +
    "consistency across many teams/APIs &mdash; its visual editor, linting (Spectral), and mocking shine for " +
    "organizations standardizing their API portfolio. <strong>Gotchas:</strong> it's a platform investment " +
    "(paid tiers, onboarding); for a single small API, plain OpenAPI + Swagger UI is simpler. Its value is " +
    "governance and design workflow, not just docs. The OpenAPI spec remains the source of truth. Choose " +
    "Stoplight vs Readme.com vs raw OpenAPI based on whether you need design tooling/governance (Stoplight) " +
    "or a polished consumer portal (Readme).</p>"
};

C["postman"] = {
  summary: "<p><strong>Postman</strong> is a popular API platform best known as a <strong>client for testing " +
    "and exploring APIs</strong>: build requests, organize them into collections, manage environments/" +
    "variables, write test scripts, mock APIs, and auto-generate documentation. It's widely used across the " +
    "API lifecycle &mdash; development, testing, debugging, and sharing &mdash; by both developers and QA.</p>",
  examples: [
    {
      title: "Example 1: Collections + environments",
      description: "<p>Organize and parameterize requests.</p>",
      code: "// Collection: grouped requests (GET /users, POST /users, ...)\n// Environment variables: {{baseUrl}}, {{token}} -> switch dev/staging/prod\n// GET {{baseUrl}}/users  Authorization: Bearer {{token}}"
    },
    {
      title: "Example 2: Tests + automation",
      description: "<p>Assert responses; run in CI.</p>",
      code: "// Test script on a request:\npm.test(\"status 200\", () => pm.response.to.have.status(200));\npm.test(\"has id\", () => pm.expect(pm.response.json().id).to.exist);\n// Run collections in CI via Newman (CLI)."
    },
    {
      title: "Example 3: collections, environments, and automated tests",
      description: "<p>Postman organizes requests into shareable collections, parameterized by environment, with scripted assertions.</p>",
      code: "// environment vars: {{baseUrl}}, {{token}} -> switch dev/staging/prod in one click\n" +
        "// a request's Tests tab (JS assertions):\n" +
        "pm.test('status 200', () => pm.response.to.have.status(200));\n" +
        "pm.test('has id', () => pm.expect(pm.response.json().id).to.exist);\n" +
        "// run the whole collection in CI via Newman -> lightweight API regression tests."
    },
    {
      title: "Example 4 (edge case): exploration tool, not a full test suite - and secret hygiene",
      description: "<p>Postman is great for manual/dev testing but isn't a substitute for code-level tests, and shared collections can leak secrets.</p>",
      code: "// don't make Postman your ONLY tests -> unit/integration tests in the repo run on\n" +
        "//   every commit and live with the code; Postman/Newman complements them.\n" +
        "// secret leak: tokens/keys saved IN a shared collection or synced to the cloud ->\n" +
        "//   use environment variables marked secret, and don't commit exported collections\n" +
        "//   with live credentials.\n" +
        "// keep collections in version control if you rely on them for CI."
    }
  ],
  whenToUse: "<p>Use Postman throughout development for exploring, testing, and debugging APIs, sharing " +
    "collections with your team, mocking endpoints, and generating quick docs. It's great for manual and " +
    "automated API testing (via Newman in CI). <strong>Gotchas:</strong> avoid committing secrets/tokens in " +
    "shared collections (use environment variables and secret management). Postman-generated docs are handy " +
    "but a formal OpenAPI spec is a better single source of truth for public APIs. Don't let collections drift " +
    "from the real API. It's a versatile tool across the lifecycle &mdash; complementary to OpenAPI/CI " +
    "testing, not a replacement for them.</p>"
};

/* ===================== API SECURITY ===================== */

C["api-security"] = {
  summary: "<p><strong>API security</strong> protects APIs from abuse and attack across authentication, " +
    "authorization, input validation, transport security (HTTPS), rate limiting, and data protection. APIs " +
    "are prime targets because they expose data and operations directly. The <strong>OWASP API Security Top " +
    "10</strong> catalogs the most critical risks &mdash; topped by broken object-level and broken " +
    "authentication. Security must be layered (defense in depth) and enforced server-side.</p>",
  examples: [
    {
      title: "Example 1: Layers of API security",
      description: "<p>Defense in depth across the request path.</p>",
      code: "// Transport: HTTPS/TLS everywhere\n// AuthN: verify identity (tokens/OAuth)\n// AuthZ: enforce per-endpoint + per-object permissions\n// Input: validate/sanitize all input (injection, XXE)\n// Limits: rate limiting/throttling; size limits\n// Output: don't leak sensitive data; security headers\n// Monitor: log, alert, detect anomalies"
    },
    {
      title: "Example 2: The top risk - BOLA",
      description: "<p>Broken object-level authorization.</p>",
      code: "// #1 OWASP API risk: an endpoint checks login but NOT ownership\n//   GET /accounts/42 -> returns account 42 to ANY logged-in user\n// Fix: verify the caller may access THIS specific object, every time."
    },
    {
      title: "Example 3: defense in depth across the request path",
      description: "<p>API security is layered - no single control is trusted alone.</p>",
      code: "// edge:      TLS, WAF, rate limiting\n" +
        "// gateway:   authenticate (validate token), IP allow-lists\n" +
        "// service:   AUTHORIZE (role + object-level/ownership), validate ALL input\n" +
        "// data:      encrypt at rest, least-privilege DB user, parameterized queries\n" +
        "// response:  no sensitive fields, correct status, no internal detail in errors\n" +
        "// assume any one layer can be breached."
    },
    {
      title: "Example 4 (edge case): the OWASP API Top 10 - authorization dominates",
      description: "<p>The most common API breaches aren't exotic - they're missing authorization checks on objects and functions.</p>",
      code: "// API1 BOLA: GET /orders/99 returns someone else's order (no ownership check) - #1.\n" +
        "// API5 BFLA: a normal user calls an admin-only endpoint (no role check).\n" +
        "// API3 excessive data exposure: returning whole objects + trusting the client to hide.\n" +
        "// also: broken auth, SSRF, mass assignment, injection.\n" +
        "// the recurring theme: AUTHN != AUTHZ -> check 'may THIS user do THIS to THIS object?'."
    }
  ],
  whenToUse: "<p>Apply API security to every API &mdash; it's not optional. <strong>Gotchas:</strong> security " +
    "must be <em>layered</em> and <em>server-enforced</em> (never trust the client). The most common, " +
    "high-impact failures are <strong>broken authorization</strong> (object/function level), broken " +
    "authentication, and excessive data exposure &mdash; not exotic attacks. Validate input, use HTTPS, rate-" +
    "limit, and don't leak data. Keep dependencies patched. There's a dedicated API Security roadmap with the " +
    "full checklist; the sub-topics here cover common vulnerabilities and best practices.</p>"
};

C["common-vulnerabilities"] = {
  summary: "<p>Common API <strong>vulnerabilities</strong> (per OWASP API Top 10): <strong>broken object-" +
    "level authorization (BOLA/IDOR)</strong>, <strong>broken authentication</strong>, <strong>excessive " +
    "data exposure</strong>, <strong>broken function-level authorization</strong>, <strong>injection</strong> " +
    "(SQL/NoSQL/command), <strong>security misconfiguration</strong>, <strong>mass assignment</strong>, " +
    "<strong>lack of rate limiting</strong>, and <strong>SSRF</strong>. Knowing them helps you design " +
    "defenses.</p>",
  examples: [
    {
      title: "Example 1: BOLA and injection",
      description: "<p>Two of the most damaging classes.</p>",
      code: "// BOLA/IDOR: GET /orders/42 without checking ownership\n//   -> read others' data by changing the id\n// Injection: building a query from raw input\n//   'SELECT * FROM users WHERE name=' + input  -> SQL injection\n//   Fix: parameterized queries + input validation"
    },
    {
      title: "Example 2: Mass assignment + excessive exposure",
      description: "<p>Binding too much input / returning too much data.</p>",
      code: "// Mass assignment: PATCH /users/7 { \"isAdmin\": true }\n//   blindly binds to the model -> privilege escalation.\n//   Fix: allowlist updatable fields.\n// Excessive exposure: returning passwordHash/PII in responses.\n//   Fix: response DTOs with only intended fields."
    },
    {
      title: "Example 3: the common API vulnerabilities and their fixes",
      description: "<p>Most API breaches come from a short list - know the fix for each.</p>",
      code: "// broken object-level authz (BOLA) -> check ownership on every object access\n" +
        "// injection (SQL/NoSQL/cmd)        -> parameterize queries, validate input\n" +
        "// broken auth                      -> standard libs, MFA, lockouts, short tokens\n" +
        "// excessive data exposure          -> allow-list response fields (DTOs)\n" +
        "// mass assignment                  -> bind only allowed fields\n" +
        "// SSRF                             -> validate/allow-list outbound URLs\n" +
        "// security misconfig               -> debug off, headers set, deps patched"
    },
    {
      title: "Example 4 (edge case): mass assignment and SSRF are easy to miss",
      description: "<p>Two subtle ones: binding the whole request body to a model, and letting user input drive server-side requests.</p>",
      code: "// MASS ASSIGNMENT: user.update(req.body) -> attacker sends { role:'admin', \n" +
        "//   isVerified:true } and escalates. Fix: bind ONLY permitted fields (allow-list).\n" +
        "// SSRF: server fetches a user-supplied URL -> attacker points it at\n" +
        "//   http://169.254.169.254/ (cloud metadata) or internal services. Fix: allow-list\n" +
        "//   hosts, block private/link-local ranges, no redirects to internal.\n" +
        "// both pass 'normal' validation -> need explicit, targeted defenses."
    }
  ],
  whenToUse: "<p>Know these vulnerabilities to design and review APIs defensively, and during security " +
    "testing/threat modeling. <strong>Gotchas:</strong> the dominant API risks are <strong>authorization</strong> " +
    "failures (BOLA/IDOR, function-level) &mdash; not just classic web attacks &mdash; so test that users " +
    "can't access others' objects or admin functions. Validate input (injection), allowlist fields (mass " +
    "assignment), filter output (data exposure), rate-limit, and validate outbound URLs (SSRF). Use automated " +
    "scanning + manual review + the OWASP API Top 10 as a checklist. The next topic covers concrete best " +
    "practices.</p>"
};

C["best-practices"] = {
  summary: "<p>API security <strong>best practices</strong>: use HTTPS everywhere; authenticate with proven " +
    "standards; enforce authorization at endpoint <em>and</em> object level; validate and sanitize all input; " +
    "rate-limit; return minimal data (no leakage); use security headers; never log secrets; keep dependencies " +
    "patched; handle errors without leaking internals; and monitor/alert. Together these implement defense in " +
    "depth and least privilege.</p>",
  examples: [
    {
      title: "Example 1: A security checklist",
      description: "<p>Layered, server-enforced controls.</p>",
      code: "// [ ] HTTPS/TLS only (+ HSTS)\n// [ ] Standard auth (OAuth2/JWT), short token expiry\n// [ ] AuthZ on every endpoint + object-level checks\n// [ ] Validate input (allowlist) + parameterized queries\n// [ ] Rate limiting + request size limits\n// [ ] Minimal data out (DTOs) + security headers\n// [ ] No secrets in logs; patched deps; monitoring/alerts"
    },
    {
      title: "Example 2: Least privilege + fail closed",
      description: "<p>Default to deny; grant the minimum.</p>",
      code: "// Deny by default; require explicit permission to proceed.\n// Tokens/keys scoped to the minimum needed.\n// On error/uncertainty, DENY (fail closed), don't allow."
    },
    {
      title: "Example 3: the baseline security checklist",
      description: "<p>A short set of always-on practices that prevent most API incidents.</p>",
      code: "// 1. HTTPS everywhere (+ HSTS)\n" +
        "// 2. authenticate, then AUTHORIZE (role + object-level)\n" +
        "// 3. validate/sanitize ALL input; parameterize queries; encode output\n" +
        "// 4. rate-limit; cap payload sizes; set timeouts\n" +
        "// 5. least-privilege everything (DB users, tokens, keys)\n" +
        "// 6. security headers; debug off; patch deps; don't log secrets"
    },
    {
      title: "Example 4 (edge case): security is only as strong as the weakest link",
      description: "<p>A single missed check undoes the rest - and these must be enforced server-side, continuously.</p>",
      code: "// 99 protected endpoints + 1 forgotten /internal/export with no auth = breach.\n" +
        "//   -> deny-by-default routing (fail closed), audit the route table in CI.\n" +
        "// client-side checks are UX, not security -> the attacker calls the API directly.\n" +
        "// 'we did it at launch' isn't enough -> deps get CVEs, configs drift -> scan + patch\n" +
        "//   continuously. One unvalidated input or missing ownership check is the whole hole."
    }
  ],
  whenToUse: "<p>Apply these to every API as a baseline. <strong>Gotchas:</strong> security is only as strong " +
    "as its weakest layer &mdash; do all of it, not just one. Enforce everything <strong>server-side</strong> " +
    "(client checks are bypassable). Don't roll your own auth/crypto. The highest-impact, most-overlooked " +
    "practices are object-level authorization and not exposing excessive data. Automate checks (SAST/DAST, " +
    "dependency scanning) in CI, and review manually. The dedicated API Security roadmap has the full " +
    "checklist; these best practices are the essentials to build in from the start.</p>"
};

/* ===================== TESTING & PERFORMANCE ===================== */

C["api-testing"] = {
  summary: "<p><strong>API testing</strong> verifies that an API behaves correctly, reliably, and securely &mdash; " +
    "across <strong>unit</strong> (isolated logic), <strong>integration</strong> (components together), " +
    "<strong>functional/contract</strong> (endpoints meet the spec), <strong>load/performance</strong> " +
    "(behavior under stress), and <strong>security</strong> tests. Automated API tests in CI catch " +
    "regressions (including security/contract breaks) before release.</p>",
  examples: [
    {
      title: "Example 1: The testing layers",
      description: "<p>Different tests catch different problems.</p>",
      code: "// Unit: a function/handler in isolation (fast, many)\n// Integration: endpoint + DB + auth working together\n// Functional/Contract: endpoint matches the OpenAPI contract\n// Load: behavior + latency under N concurrent users\n// Security: authz, input validation, injection"
    },
    {
      title: "Example 2: An endpoint test",
      description: "<p>Assert status + body, including auth.</p>",
      code: "// (REST Assured / supertest style)\nGET /api/users/7  Authorization: Bearer <token>\n  -> expect 200, body.name == 'Sam'\nGET /api/users/OTHER  with user's token\n  -> expect 403  (authorization regression guard)"
    },
    {
      title: "Example 3: the API test pyramid",
      description: "<p>Layer your tests - many fast unit tests, fewer integration tests, a thin layer of end-to-end.</p>",
      code: "// many:   unit tests (pure logic: validation, rules) - milliseconds, no I/O\n" +
        "// some:   integration tests (route + real DB via Testcontainers) - verify wiring\n" +
        "// few:    end-to-end / contract tests (full stack or cross-service)\n" +
        "// plus:   security tests (authz, bad input) + load tests before launch\n" +
        "// run unit+integration on every commit; e2e/load on a schedule or pre-release."
    },
    {
      title: "Example 4 (edge case): testing only the happy path",
      description: "<p>The bugs and breaches live in the cases teams skip - missing auth, wrong owner, malformed input, edge values.</p>",
      code: "// don't just assert 'valid request -> 200'. Also test:\n" +
        "//   no token -> 401 ; other user's object -> 403/404 (BOLA) ; bad body -> 400\n" +
        "//   over rate limit -> 429 ; huge payload -> rejected ; pagination edges\n" +
        "// these regression-guard your SECURITY checks - if someone removes an authz\n" +
        "//   guard later, the test fails loudly. Happy-path-only tests give false confidence."
    }
  ],
  whenToUse: "<p>Test APIs continuously in CI. <strong>Gotchas:</strong> follow the test pyramid &mdash; many " +
    "fast unit tests, fewer integration, fewest E2E/load (which are slow and need environments). Explicitly " +
    "test <em>security</em> paths (authz, validation), not just happy paths. Keep tests fast and independent. " +
    "Manage test data and environments. Contract testing keeps API and clients in sync. Don't rely solely on " +
    "manual testing. The sub-topics cover each test type and performance concerns.</p>"
};

C["unit-testing"] = {
  summary: "<p><strong>Unit testing</strong> verifies individual pieces of API logic (functions, handlers, " +
    "validators, services) <em>in isolation</em>, with dependencies mocked/stubbed. Unit tests are fast, " +
    "numerous, and run on every commit &mdash; the base of the testing pyramid. For APIs, they validate " +
    "business rules, input handling, and edge cases without needing a database or network.</p>",
  examples: [
    {
      title: "Example 1: Testing a handler's logic",
      description: "<p>Isolated, fast, mocked dependencies.</p>",
      code: "test('rejects negative amount', () => {\n  const repo = mockRepo();\n  const svc = new PaymentService(repo);  // dependency injected/mocked\n  expect(() => svc.charge(-5)).toThrow('amount must be positive');\n});"
    },
    {
      title: "Example 2: Edge cases + validation",
      description: "<p>Cover boundaries, not just happy paths.</p>",
      code: "// Validate inputs: empty, null, too long, wrong type, boundary values\n// Test error branches + business rules in isolation (no DB/network)\n// Fast -> run thousands on every commit"
    },
    {
      title: "Example 3: test pure logic in isolation",
      description: "<p>Unit tests target a single function/class with no I/O - fast and deterministic.</p>",
      code: "// pure function -> trivial to test, no mocks needed\n" +
        "test('applies bulk discount over 10 units', () => {\n" +
        "  expect(price(12, 5)).toBe(54);   // 12 * 5 * 0.9\n" +
        "});\n" +
        "// inject dependencies (clock, repo) as fakes for logic that needs them:\n" +
        "expect(isExpired(token, fakeClock(0))).toBe(true);"
    },
    {
      title: "Example 4 (edge case): over-mocking tests the mocks, not the code",
      description: "<p>Heavy mocking can make a unit test pass while the real integration is broken; some things belong in integration tests.</p>",
      code: "// if you mock the DB, the HTTP client, AND the logic under test, the test asserts\n" +
        "//   your MOCKS behave as configured - not that the code works.\n" +
        "// keep units small + mostly PURE so they need few/no mocks. Push wiring/SQL/\n" +
        "//   serialization checks to integration tests against real dependencies.\n" +
        "// also avoid asserting implementation details (exact call order) -> test behavior/\n" +
        "//   outputs so refactors don't break tests needlessly."
    }
  ],
  whenToUse: "<p>Write unit tests for all non-trivial logic &mdash; validation, business rules, computations, " +
    "edge cases. They're the cheapest, fastest safety net for refactoring. <strong>Gotchas:</strong> keep " +
    "them <strong>fast and independent</strong> (mock external dependencies &mdash; DB, network). Don't " +
    "over-mock (mocking everything tests nothing real). Unit tests don't verify that components work " +
    "<em>together</em> &mdash; you also need integration tests. Test behavior, not implementation details " +
    "(brittle tests). Include negative/error cases. They're necessary but not sufficient on their own.</p>"
};

C["integration-testing"] = {
  summary: "<p><strong>Integration testing</strong> verifies that multiple components work together correctly &mdash; " +
    "e.g. an API endpoint with its real database, auth, and dependencies (or close stand-ins). For APIs, " +
    "integration tests hit actual endpoints and check the full request &rarr; handler &rarr; DB &rarr; " +
    "response flow, catching issues that unit tests (with mocks) miss, like wiring, queries, and " +
    "serialization.</p>",
  examples: [
    {
      title: "Example 1: Endpoint + real DB",
      description: "<p>Test the full path against a real database.</p>",
      code: "// Spin up a real (test) DB (e.g. Testcontainers):\ntest('creates and reads a user', async () => {\n  const res = await api.post('/users', { name: 'Sam' });\n  expect(res.status).toBe(201);\n  const got = await api.get('/users/' + res.body.id);\n  expect(got.body.name).toBe('Sam');   // verifies handler + DB + serialization\n});"
    },
    {
      title: "Example 2: Auth + authz integration",
      description: "<p>Verify the security wiring end-to-end.</p>",
      code: "// With a real token + middleware:\n//   no token -> 401; wrong user's resource -> 403; valid -> 200\n// Confirms auth/authz actually wired correctly (unit mocks can hide this)."
    },
    {
      title: "Example 3: exercise the route against a real database",
      description: "<p>Integration tests hit the actual stack (router + service + DB) to catch wiring, SQL, and serialization bugs units miss.</p>",
      code: "// spin up a REAL Postgres for the test (Testcontainers), seed, hit the endpoint:\n" +
        "test('POST /orders persists and returns 201', async () => {\n" +
        "  const res = await request(app).post('/orders').send({ items: [1] });\n" +
        "  expect(res.status).toBe(201);\n" +
        "  expect(await db.count('orders')).toBe(1);   // verify it actually saved\n" +
        "});"
    },
    {
      title: "Example 4 (edge case): in-memory fakes hide real DB behavior",
      description: "<p>Testing against H2/SQLite instead of the production DB lets dialect-specific bugs through; integration tests are slower and need isolation.</p>",
      code: "// H2 may accept SQL that Postgres rejects (or vice versa) + different null/locking\n" +
        "//   semantics -> 'passing' integration tests, failing prod. Test the engine you SHIP\n" +
        "//   (Testcontainers).\n" +
        "// integration tests are slower + share state -> reset/rollback between tests, run\n" +
        "//   them as a smaller suite than units.\n" +
        "// don't hit real THIRD-PARTY services -> stub those at the boundary; keep the DB real."
    }
  ],
  whenToUse: "<p>Use integration tests to verify endpoints work with real dependencies &mdash; database queries, " +
    "auth, serialization, transactions, external services (or test doubles). They catch wiring and contract " +
    "issues unit tests miss. <strong>Gotchas:</strong> they're slower and need test infrastructure (a real DB &mdash; " +
    "use <strong>Testcontainers</strong> for fidelity over in-memory DBs that behave differently). Manage test " +
    "data/cleanup (independent, repeatable). Keep them fewer than unit tests (pyramid). Don't test every " +
    "permutation here &mdash; cover key flows and integration points. They're essential for confidence that " +
    "the assembled system works.</p>"
};

C["functional-testing"] = {
  summary: "<p><strong>Functional testing</strong> verifies that the API does what it's <em>supposed</em> to " +
    "from the user/consumer perspective &mdash; testing endpoints against their functional requirements/spec, " +
    "treating the API as a black box. It checks that given certain inputs, the API returns the correct " +
    "outputs, status codes, and side effects, covering real use cases and business scenarios end-to-end.</p>",
  examples: [
    {
      title: "Example 1: Black-box scenario test",
      description: "<p>Verify a business flow against requirements.</p>",
      code: "// Requirement: 'placing an order reduces stock and returns 201'\n// POST /orders { productId: 5, qty: 2 } -> 201 { orderId }\n// GET /products/5 -> stock reduced by 2\n// Tests the API's BEHAVIOR, not its internals."
    },
    {
      title: "Example 2: Cover the use cases",
      description: "<p>Happy paths + error/edge scenarios.</p>",
      code: "// - valid order -> 201\n// - out-of-stock -> 409 with a clear error\n// - invalid product -> 404\n// - unauthenticated -> 401\n// Each maps to a functional requirement."
    },
    {
      title: "Example 3: test a complete user-facing workflow",
      description: "<p>Functional tests verify the API does what the requirements say, from the consumer's perspective, across multiple calls.</p>",
      code: "// 'a user can sign up, log in, place an order' - black-box, end-to-end:\n" +
        "test('order workflow', async () => {\n" +
        "  await api.post('/signup', user);\n" +
        "  const { token } = await api.post('/login', creds);\n" +
        "  const order = await api.post('/orders', cart, auth(token));\n" +
        "  expect(order.status).toBe('confirmed');   // requirement met\n" +
        "});"
    },
    {
      title: "Example 4 (edge case): functional vs integration, and flakiness",
      description: "<p>Functional tests check 'meets requirements' (behavior); they overlap integration tests but are higher-level, slower, and flakier.</p>",
      code: "// integration: 'does the endpoint work with the DB?' (technical wiring)\n" +
        "// functional:  'does the FEATURE behave per the spec?' (consumer requirement)\n" +
        "// functional/e2e tests span many components -> slower + more flaky (timing,\n" +
        "//   external deps) -> keep them FEW (top of the pyramid), make them deterministic\n" +
        "//   (control time/data), and don't push every edge case through them - that's what\n" +
        "//   fast unit tests are for."
    }
  ],
  whenToUse: "<p>Use functional testing to confirm the API meets its requirements from the consumer's view &mdash; " +
    "validating real use cases, business rules, and error scenarios end-to-end. <strong>Gotchas:</strong> " +
    "functional tests overlap with integration/E2E tests; the distinction is the <em>focus</em> (requirements/" +
    "behavior vs component interaction). They're black-box, so they don't pinpoint <em>where</em> a failure " +
    "is (pair with unit tests for localization). They can be slower and need a running environment + data. " +
    "Derive them from the spec/requirements so they stay meaningful. Don't duplicate exhaustive unit-level " +
    "checks here &mdash; focus on user-facing behavior.</p>"
};

C["load-testing"] = {
  summary: "<p><strong>Load testing</strong> measures how an API behaves under expected and peak " +
    "<strong>concurrent load</strong> &mdash; simulating many users to observe response times, throughput, " +
    "error rates, and resource use. It reveals bottlenecks, capacity limits, and whether the API meets " +
    "performance SLAs before real traffic hits. Related: stress testing (beyond capacity) and spike testing " +
    "(sudden surges). Tools: JMeter, Gatling, k6, Locust.</p>",
  examples: [
    {
      title: "Example 1: A load test scenario",
      description: "<p>Simulate concurrent users; measure.</p>",
      code: "// 500 virtual users, ramp over 60s, hit GET /api/products\n// Measure: throughput (req/s), latency p50/p95/p99, error rate\n// Assert: p95 < 300ms, error rate < 1% at target load"
    },
    {
      title: "Example 2: Finding the breaking point",
      description: "<p>Increase load until it degrades.</p>",
      code: "// Ramp load up until latency spikes or errors climb ->\n//   that's your capacity limit / bottleneck.\n// Then optimize (caching, scaling, query tuning) and retest."
    },
    {
      title: "Example 3: load, stress, soak, and spike tests",
      description: "<p>Different performance tests answer different questions about behavior under load.</p>",
      code: "// load:   expected traffic -> does it meet latency/throughput SLOs?\n" +
        "// stress: ramp past the limit -> WHERE does it break, and does it fail gracefully?\n" +
        "// soak:   sustained load for hours -> memory leaks / resource exhaustion?\n" +
        "// spike:  sudden surge -> autoscaling + rate limiting hold up?\n" +
        "// tools: k6, Gatling, JMeter, Locust. Assert on p95/p99, not just average."
    },
    {
      title: "Example 4 (edge case): unrealistic tests + the load generator as bottleneck",
      description: "<p>Bad load tests mislead - too-clean data, no think-time, or an undersized client gives numbers that don't reflect reality.</p>",
      code: "// pitfalls: same cached request repeated (unrealistically fast), no pacing/think\n" +
        "//   time, tiny dataset (everything cache-hits), testing a non-prod-like env.\n" +
        "// the GENERATOR can be the limit: if client CPU maxes while server is idle, you're\n" +
        "//   measuring the test rig -> distribute load, run headless, size the injector.\n" +
        "// never load-test prod without care (you can cause an outage). Use realistic data\n" +
        "//   distributions + ramp profiles, and watch the SERVER's resources, not just RPS."
    }
  ],
  whenToUse: "<p>Load test before launches, major changes, and to validate SLAs/capacity planning. " +
    "<strong>Gotchas:</strong> test against a <strong>production-like environment</strong> with realistic " +
    "data and scenarios &mdash; results from a tiny test DB mislead. Measure <strong>percentiles</strong> " +
    "(p95/p99), not just averages (the tail is what users feel). Ensure the load generator isn't the " +
    "bottleneck. Include realistic think-times and mixed endpoints. Don't load-test production without care " +
    "(or use isolated environments). Combine with profiling to find <em>why</em> it's slow. Re-test " +
    "regularly to catch regressions.</p>"
};

C["mocking-apis"] = {
  summary: "<p><strong>Mocking APIs</strong> creates fake implementations that return predefined responses, " +
    "so you can develop and test against an API <em>before it exists</em> or <em>without</em> calling the real " +
    "(slow, costly, unreliable, or third-party) service. Mocks enable parallel front-end/back-end development, " +
    "deterministic tests, and offline work. Tools generate mocks from OpenAPI specs or let you script " +
    "responses (Postman, WireMock, Mockoon, MSW).</p>",
  examples: [
    {
      title: "Example 1: Mock from a spec",
      description: "<p>Frontend builds against a mock while the API is built.</p>",
      code: "// From openapi.yaml, a mock server returns example responses:\n//   GET /users/7 -> 200 { id:7, name:'Sam' }\n// Frontend integrates NOW; swap to the real API when ready.\n// The spec is the contract both sides honor."
    },
    {
      title: "Example 2: Mock a third-party dependency in tests",
      description: "<p>Deterministic tests without external calls.</p>",
      code: "// Don't call the real payment gateway in tests:\n//   mock it to return success/failure deterministically\n//   -> fast, reliable, no cost, test failure paths easily"
    },
    {
      title: "Example 3: a mock server from the API spec",
      description: "<p>Generate a stand-in API from your OpenAPI spec so clients can develop and test before the real backend exists.</p>",
      code: "// from openapi.yaml, a tool (Prism, WireMock, MSW) serves canned responses:\n" +
        "//   GET /orders/1 -> 200 { id:1, status:'open' }   (example from the spec)\n" +
        "// front-end builds against this NOW; deterministic responses make tests stable.\n" +
        "// also mock 3rd-party APIs in tests so you don't hit real services (cost/flakiness)."
    },
    {
      title: "Example 4 (edge case): mocks drift from reality",
      description: "<p>A mock that doesn't match the real API gives false confidence - code passes against the mock, fails against production.</p>",
      code: "// the real API changes (new required field, different error shape) but the mock\n" +
        "//   doesn't -> your client 'works' in tests, breaks in prod.\n" +
        "// keep mocks generated from the SAME spec the server implements, and add CONTRACT\n" +
        "//   tests so provider+consumer stay in sync.\n" +
        "// mocks also can't reveal real latency, rate limits, or auth quirks -> still run\n" +
        "//   some integration tests against the actual API."
    }
  ],
  whenToUse: "<p>Use mocking for parallel development (front-end before back-end is ready), deterministic and " +
    "fast tests (no flaky/slow/costly external calls), simulating error conditions, and offline work. " +
    "<strong>Gotchas:</strong> mocks can drift from the real API &mdash; keep them spec-driven and add " +
    "<strong>contract tests</strong> to ensure the real API matches. Over-reliance on mocks can hide real " +
    "integration issues (mocks always behave; reality doesn't) &mdash; complement with integration tests " +
    "against the real thing. Mock external dependencies and not-yet-built services; don't mock the system " +
    "under test itself.</p>"
};

C["contract-testing"] = {
  summary: "<p><strong>Contract testing</strong> verifies that an API (provider) and its consumers agree on " +
    "the <strong>contract</strong> &mdash; the request/response shapes each expects &mdash; so changes don't " +
    "break integrations. Consumer-driven contract testing (e.g. Pact) has consumers define expectations, and " +
    "the provider verifies it meets them. It catches breaking changes early, especially valuable in " +
    "microservices where many services depend on each other.</p>",
  examples: [
    {
      title: "Example 1: Consumer-driven contract",
      description: "<p>Consumer expectations verified against the provider.</p>",
      code: "// Consumer (UserUI) declares it expects:\n//   GET /users/7 -> { id, name }\n// This contract is shared; the provider (UserService) runs a test\n//   asserting it actually returns { id, name } -> breaking it fails CI."
    },
    {
      title: "Example 2: Catching breaking changes",
      description: "<p>Contract tests guard the integration.</p>",
      code: "// Provider removes the 'name' field ->\n//   the contract test FAILS in the provider's CI\n//   -> the breaking change is caught BEFORE it breaks the consumer."
    },
    {
      title: "Example 3: consumer-driven contracts keep services compatible",
      description: "<p>The consumer defines what it expects; the provider verifies it still satisfies that contract - catching breaking changes pre-deploy.</p>",
      code: "// consumer (e.g. with Pact) records its expectation:\n" +
        "//   GET /users/1 -> 200 { id, name }   (a 'pact')\n" +
        "// provider's CI replays the pact against the real service:\n" +
        "//   provider removes 'name' -> pact verification FAILS -> breaking change caught\n" +
        "//   BEFORE deploy, without a full end-to-end environment."
    },
    {
      title: "Example 4 (edge case): contract tests check shape, not full behavior",
      description: "<p>They verify the interface matches expectations, not that the logic is correct - and both sides must run them in CI to matter.</p>",
      code: "// a contract test confirms 'returns { id, name }', NOT that the name is right ->\n" +
        "//   still need the provider's own unit/integration tests for correctness.\n" +
        "// only works if BOTH sides participate: consumer publishes pacts, provider verifies\n" +
        "//   them in CI -> otherwise it's just unused ceremony.\n" +
        "// best for microservices/independently-deployed services; overkill for a single\n" +
        "//   app with one in-house client."
    }
  ],
  whenToUse: "<p>Use contract testing in <strong>microservices</strong> and any setup with independently-" +
    "deployed providers and consumers, to prevent breaking changes from slipping through. It's lighter and " +
    "more reliable than full end-to-end tests across services. <strong>Gotchas:</strong> contract tests verify " +
    "the <em>shape/agreement</em>, not full behavior &mdash; complement with functional tests. They require " +
    "coordination/tooling (a broker like Pact Broker) and discipline to maintain contracts. They shine when " +
    "many services integrate; for a monolith or a single client you control, they may be overkill. Keep " +
    "contracts in sync and run them in both providers' and consumers' CI.</p>"
};

C["api-performance"] = {
  summary: "<p><strong>API performance</strong> is how fast and efficiently an API responds under load &mdash; " +
    "measured by latency, throughput, and resource usage. Improving it involves caching, database/query " +
    "optimization, pagination, efficient serialization, connection pooling, async processing, load balancing, " +
    "and CDNs. Good performance is critical for user experience, cost, and scalability.</p>",
  examples: [
    {
      title: "Example 1: Common performance levers",
      description: "<p>Where API latency/throughput is won.</p>",
      code: "// - Caching (response/data) -> avoid recomputation/refetch\n// - Efficient DB queries + indexes; avoid N+1\n// - Pagination -> bounded responses\n// - Connection pooling -> reuse DB/HTTP connections\n// - Async/queues for slow work; compression (gzip)\n// - Load balancing + horizontal scaling; CDN for static"
    },
    {
      title: "Example 2: Measure before optimizing",
      description: "<p>Profile to find the real bottleneck.</p>",
      code: "// A slow endpoint: 1200ms = 1100ms DB query + 100ms rest\n//   -> the query is the bottleneck (add an index / cache it)\n// Optimize what the data shows, not guesses. Track p95/p99."
    },
    {
      title: "Example 3: the main levers for API performance",
      description: "<p>Most API speedups come from a handful of techniques - apply the one that fits the bottleneck.</p>",
      code: "// caching        -> avoid recomputing/refetching stable data (biggest win)\n" +
        "// fix N+1 queries -> batch/join instead of per-item calls\n" +
        "// pagination      -> never return unbounded lists\n" +
        "// async/queues    -> move slow work off the request path\n" +
        "// connection reuse-> pooling + keep-alive (skip handshakes)\n" +
        "// compression     -> gzip/br on responses; right indexes on the DB"
    },
    {
      title: "Example 4 (edge case): measure first - optimize the real bottleneck",
      description: "<p>Guessing wastes effort and adds complexity; profile to find where time actually goes (often a few hotspots).</p>",
      code: "// 'must be the DB' -> add caching -> no change, because the cost was JSON\n" +
        "//   serialization or a slow downstream call.\n" +
        "// use APM traces + slow-query logs + percentiles (p95/p99, not averages).\n" +
        "// premature optimization adds complexity for no measured gain. Amdahl: optimizing\n" +
        "//   a 5%-of-time path can't help much -> attack the dominant cost. Then re-measure."
    }
  ],
  whenToUse: "<p>Attend to performance for any API with real traffic or latency requirements. <strong>Gotchas:</strong> " +
    "<strong>measure first</strong> (profile/monitor) &mdash; optimize the actual bottleneck, not guesses. The " +
    "database is usually the first bottleneck (indexing, N+1, query tuning beat adding servers). Caching is " +
    "often the biggest, cheapest win &mdash; but adds invalidation complexity. Track percentiles, not " +
    "averages. Don't prematurely optimize or add distributed complexity you don't need. Balance performance " +
    "against simplicity and correctness. The sub-topics (metrics, caching, load balancing, profiling) detail " +
    "the techniques.</p>"
};

C["performance-metrics"] = {
  summary: "<p><strong>Performance metrics</strong> quantify API behavior: <strong>latency/response time</strong> " +
    "(at percentiles p50/p95/p99), <strong>throughput</strong> (requests/sec), <strong>error rate</strong>, " +
    "<strong>resource utilization</strong> (CPU, memory, connections), and the 'golden signals' (latency, " +
    "traffic, errors, saturation). Tracking the right metrics tells you whether the API is healthy and meeting " +
    "SLAs, and where bottlenecks are.</p>",
  examples: [
    {
      title: "Example 1: Percentiles over averages",
      description: "<p>Averages hide the slow tail.</p>",
      code: "// Mean latency 80ms looks fine, but:\n//   p50=40ms, p95=300ms, p99=2s -> 1% of users wait 2 seconds!\n// Always track p95/p99 (the experience of the worst-affected users)."
    },
    {
      title: "Example 2: The golden signals",
      description: "<p>What to monitor at minimum.</p>",
      code: "// Latency: how long requests take (percentiles)\n// Traffic: requests/sec\n// Errors: error rate (4xx/5xx)\n// Saturation: how 'full' resources are (CPU/mem/connections/queue depth)"
    },
    {
      title: "Example 3: the golden signals to track per endpoint",
      description: "<p>A small set of metrics tells you an API's health (the RED method).</p>",
      code: "// Rate:     requests/sec\n" +
        "// Errors:   % of 4xx/5xx (split them - 4xx is client, 5xx is you)\n" +
        "// Duration: latency DISTRIBUTION p50/p95/p99 (not average)\n" +
        "// plus saturation: CPU/mem, DB connections, queue depth\n" +
        "// per endpoint + per status -> you can see which route degraded and why."
    },
    {
      title: "Example 4 (edge case): averages lie; tail latency and cardinality bite",
      description: "<p>Mean latency hides pain, and tagging metrics with unbounded values blows up your metrics backend.</p>",
      code: "// avg=50ms but p99=2s -> 1% of users suffer; the average hid it. Alert on p99.\n" +
        "// fan-out amplifies tails: a page making 20 calls each p99=100ms is LIKELY to hit\n" +
        "//   a slow one -> the page p99 >> 100ms.\n" +
        "// high cardinality: tagging metrics with userId/requestId creates a series per\n" +
        "//   value -> cost + slowdown. Tag with bounded dims (endpoint, status, region)."
    }
  ],
  whenToUse: "<p>Track performance metrics continuously to detect issues, validate SLOs, plan capacity, and " +
    "catch regressions. <strong>Gotchas:</strong> <strong>measure percentiles, not averages</strong> (a good " +
    "mean hides a terrible p99). Watch saturation as a leading indicator before failures. Tie alerts to " +
    "user-impacting metrics, not raw noise. Beware high-cardinality metrics (cost). Use them to guide " +
    "optimization (find the bottleneck) and to define/verify SLAs. Metrics tell you <em>what</em>; pair with " +
    "tracing/profiling for <em>why</em>. Establish baselines so anomalies stand out.</p>"
};

C["caching-strategies"] = {
  summary: "<p><strong>Caching strategies</strong> store and reuse data to cut latency and load. Layers: " +
    "<strong>client/browser</strong>, <strong>CDN/edge</strong>, <strong>reverse-proxy</strong>, " +
    "<strong>application</strong> (in-memory/Redis), and <strong>database</strong>. Patterns: " +
    "<strong>cache-aside</strong> (load on miss), <strong>write-through</strong>, <strong>write-behind</strong>, " +
    "<strong>refresh-ahead</strong>. HTTP caching headers (<code>Cache-Control</code>, <code>ETag</code>) " +
    "drive client/CDN caching. The core challenge is invalidation (freshness).</p>",
  examples: [
    {
      title: "Example 1: Cache-aside (most common)",
      description: "<p>App checks cache, loads DB on miss, populates.</p>",
      code: "function getProduct(id) {\n  let p = cache.get('product:' + id);\n  if (p) return p;                    // hit\n  p = db.findProduct(id);             // miss -> load\n  cache.set('product:' + id, p, 300); // populate (TTL 5min)\n  return p;\n}"
    },
    {
      title: "Example 2: HTTP caching for clients/CDN",
      description: "<p>Headers let browsers/CDNs reuse responses.</p>",
      code: "Cache-Control: public, max-age=3600    // CDN/browser cache 1h\nETag: \"v42\"                            // revalidate when stale\nCache-Control: private, no-store        // never cache sensitive data"
    },
    {
      title: "Example 3: cache at multiple layers",
      description: "<p>Caching applies at several points; each offloads work from the layer behind it.</p>",
      code: "// client/browser:  Cache-Control + ETag (no request at all on a hit)\n" +
        "// CDN/edge:        cache public GETs near users\n" +
        "// reverse proxy:   micro-cache hot responses (offload the app)\n" +
        "// application:     Redis for computed results/sessions (cache-aside)\n" +
        "// database:        buffer pool (automatic) + tuned queries/indexes\n" +
        "// a 95% hit ratio turns thousands of expensive ops into a handful."
    },
    {
      title: "Example 4 (edge case): invalidation, stampedes, and caching the wrong things",
      description: "<p>'There are only two hard things... cache invalidation.' Staleness, concurrent misses, and per-user data all bite.</p>",
      code: "// staleness: source changed but cache serves old value -> set TTL the feature\n" +
        "//   tolerates; invalidate on write (delete the key) rather than update.\n" +
        "// stampede: a hot key expires -> 1000 requests miss at once -> use single-flight/\n" +
        "//   stale-while-revalidate.\n" +
        "// NEVER cache per-user/auth'd data at a SHARED layer (CDN/proxy) -> user B gets\n" +
        "//   user A's data. Mark it private/no-store. Cache read-heavy + tolerant-of-staleness only."
    }
  ],
  whenToUse: "<p>Cache read-heavy, expensive, frequently-requested, and infrequently-changing data &mdash; " +
    "often the biggest, cheapest performance win. Use HTTP caching for public/static responses, application " +
    "caching for query results/computations. <strong>Gotchas:</strong> <strong>invalidation</strong> is the " +
    "hard part &mdash; stale data when the source changes; use TTLs, event-based eviction, or versioned keys. " +
    "Never cache private/per-user data in shared caches as <code>public</code> (data leak). Watch cache " +
    "stampedes on hot expired keys. Don't cache rarely-reused data (wasted memory). Pick the right layer(s) " +
    "and a freshness strategy deliberately.</p>"
};

C["load-balancing"] = {
  summary: "<p><strong>Load balancing</strong> distributes incoming API traffic across multiple server " +
    "instances so no single server is overwhelmed, enabling horizontal scaling and high availability. A load " +
    "balancer routes each request to a healthy backend using an algorithm (round robin, least connections, " +
    "etc.), performs health checks, and can handle SSL termination. It's essential for scaling and resilience.</p>",
  examples: [
    {
      title: "Example 1: Distributing across instances",
      description: "<p>One entry point spreads load and routes around failures.</p>",
      code: "//             -> [API instance 1]\n// Clients -> [LB] -> [API instance 2]\n//             -> [API instance 3 - failed health check -> removed]\n// Stateless instances let any server handle any request."
    },
    {
      title: "Example 2: Algorithms + health checks",
      description: "<p>Balance smartly; avoid dead servers.</p>",
      code: "// Round robin: cycle through (simple, uniform requests)\n// Least connections: send to least-busy (variable request durations)\n// Health checks: probe /health; route only to healthy instances"
    },
    {
      title: "Example 3: distribute traffic + health-check backends",
      description: "<p>A load balancer spreads requests across instances and routes away from unhealthy ones.</p>",
      code: "//            -> instance 1\n" +
        "//   LB ----> -> instance 2   (algorithms: round robin, least connections, hash)\n" +
        "//            -> instance 3\n" +
        "// health check GET /health every 5s -> a failed instance is pulled from rotation,\n" +
        "//   rejoins when healthy. Requires STATELESS instances + shared session store."
    },
    {
      title: "Example 4 (edge case): the LB as SPOF, and sticky-session pitfalls",
      description: "<p>One load balancer just moves the single point of failure, and session affinity undermines even balancing and resilience.</p>",
      code: "// one LB instance down -> total outage -> run LBs HA (pair/managed/anycast).\n" +
        "// sticky sessions (pin user->instance) break when that instance dies and prevent\n" +
        "//   even load -> prefer STATELESS apps + shared session store (Redis) so any\n" +
        "//   instance handles any request.\n" +
        "// also: adding app instances behind an LB just shifts load onto the DB -> the DB\n" +
        "//   often becomes the next bottleneck (scale it with replicas/caching too)."
    }
  ],
  whenToUse: "<p>Use load balancing whenever you run more than one API instance &mdash; for scale and " +
    "redundancy (essentially all production APIs). <strong>Gotchas:</strong> the LB must not be a single point " +
    "of failure (run redundant/managed LBs). Prefer <strong>stateless</strong> backends so any server handles " +
    "any request; if you need sessions, externalize them (shared store) rather than relying on sticky " +
    "sessions (which hurt elasticity). Health checks must be meaningful (readiness, not just 'process up'). " +
    "Choose the algorithm to fit traffic (least-connections for variable workloads). It enables horizontal " +
    "scaling, which usually requires statelessness first.</p>"
};

C["rate-limiting-throttling"] = {
  summary: "<p><strong>Rate limiting / throttling</strong> controls how many requests a client can make in a " +
    "time window, protecting the API from overload and abuse and ensuring fair use. <em>Rate limiting</em> " +
    "rejects requests over the limit (<code>429</code>); <em>throttling</em> may slow/queue them. Algorithms: " +
    "token bucket, leaky bucket, fixed/sliding window. It's both a performance/stability and a security " +
    "control.</p>",
  examples: [
    {
      title: "Example 1: Limit with 429 + Retry-After",
      description: "<p>Reject excess clearly so clients back off.</p>",
      code: "// 100 req/min per client\n//   within -> serve\n//   over   -> 429 Too Many Requests\n//             Retry-After: 30\n//             X-RateLimit-Remaining: 0"
    },
    {
      title: "Example 2: Protect + smooth load",
      description: "<p>Throttling protects capacity during scale-up.</p>",
      code: "// Token bucket allows bursts up to capacity, bounds sustained rate.\n// Throttling caps load to protect the DB/downstream during spikes,\n//   complementing autoscaling (which lags) and load leveling."
    },
    {
      title: "Example 3: protect capacity and ensure fair use",
      description: "<p>Throttling caps how fast each client can call, protecting the service from overload and abuse and sharing capacity fairly.</p>",
      code: "// per API key/user (token bucket: 100 burst, 10/s refill)\n" +
        "//   over limit -> 429 + Retry-After + X-RateLimit-* headers\n" +
        "// tier it: free 60/min, paid 6000/min; limit expensive endpoints (search/export) harder.\n" +
        "// it's both a reliability control (stop one client saturating the system) AND a\n" +
        "//   security control (slow brute force / scraping)."
    },
    {
      title: "Example 4 (edge case): distributed limits, shared IPs, and graceful 429s",
      description: "<p>Per-instance counters don't aggregate, IP limits punish NATs, and clients must handle 429 or throttling backfires.</p>",
      code: "// 5 instances * '100/min' in memory = 500/min globally -> use a SHARED store (Redis).\n" +
        "// IP-based limits block a whole office/carrier behind one NAT -> prefer per-key/user\n" +
        "//   when authenticated.\n" +
        "// return 429 + Retry-After (not 500) so well-behaved clients back off; a client that\n" +
        "//   ignores it and retries harder makes things worse -> consider exponential penalties.\n" +
        "// distinguish throttling (slow down) from blocking (abuse)."
    }
  ],
  whenToUse: "<p>Apply to public and many authenticated endpoints (especially auth, search, writes) for " +
    "stability, fairness, cost control, and abuse/DoS defense. <strong>Gotchas:</strong> enforce limits in a " +
    "<strong>shared</strong> store across instances. Rate-limit by stable identity (key/user) where possible. " +
    "Always return <code>429</code> + <code>Retry-After</code> (so clients back off, avoiding retry storms). " +
    "Tune limits to block abuse without rejecting legitimate traffic. Communicate limits via headers and " +
    "docs. It complements autoscaling and load leveling. (Also covered under Access Control from a security " +
    "lens.)</p>"
};

C["profiling-and-monitoring"] = {
  summary: "<p><strong>Profiling and monitoring</strong> give visibility into API performance and health. " +
    "<strong>Monitoring</strong> continuously tracks metrics, logs, and traces (latency, errors, throughput, " +
    "resources) to detect issues and alert. <strong>Profiling</strong> drills into <em>where</em> time/" +
    "resources are spent within a request (slow queries, hot code paths) to pinpoint bottlenecks. Together " +
    "they enable both detection and diagnosis.</p>",
  examples: [
    {
      title: "Example 1: Monitoring + tracing",
      description: "<p>Track health; trace a request across services.</p>",
      code: "// Metrics: req rate, error rate, p95/p99 latency, saturation -> dashboards/alerts\n// Distributed trace of a slow request:\n//   gateway 20ms -> auth 30ms -> DB query 1100ms (!) -> ...\n//   -> the DB query is the bottleneck"
    },
    {
      title: "Example 2: Profiling a hotspot",
      description: "<p>Find the expensive code/query.</p>",
      code: "// A profiler reveals 70% of CPU in JSON serialization, or a query\n//   doing a full table scan -> targeted fix (index, cache, optimize)\n// Profile to confirm WHERE the time goes before optimizing."
    },
    {
      title: "Example 3: monitor continuously, profile to diagnose",
      description: "<p>Monitoring tells you THAT something is slow; profiling/tracing tells you WHERE the time goes.</p>",
      code: "// monitoring (always on): dashboards + alerts on rate/errors/p99, resource use\n" +
        "// distributed trace breaks one slow request into spans:\n" +
        "//   800ms = gateway 20 + auth 50 + db 600 + render 130 -> the DB call is the culprit\n" +
        "// profiler (on demand): CPU/alloc flame graph of a hot path to find the exact line.\n" +
        "// instrument with OpenTelemetry so traces correlate across services."
    },
    {
      title: "Example 4 (edge case): observer effect, sampling, and overhead",
      description: "<p>Profiling/tracing isn't free - heavy instrumentation distorts results, and sampling can miss the rare slow request.</p>",
      code: "// profiling adds overhead -> a profiled run is slower than prod; interpret relatively.\n" +
        "// high-volume tracing must be SAMPLED (e.g. 1%) -> the pathological request may be\n" +
        "//   the one you didn't capture -> use TAIL-based sampling (keep slow/error traces).\n" +
        "// logging in a hot loop or unbounded metric cardinality can THEMSELVES cause the\n" +
        "//   slowdown you're chasing -> measure the cost of your observability too."
    }
  ],
  whenToUse: "<p>Monitor every production API; profile when investigating specific performance problems. " +
    "<strong>Gotchas:</strong> monitor the golden signals and alert on user-impacting symptoms tied to SLOs " +
    "(avoid alert fatigue). Use distributed tracing in microservices to localize slowness across services. " +
    "Profiling has overhead &mdash; sample in production or profile in staging with realistic load. Don't " +
    "optimize without data (profile first). Capture enough context (trace ids) to correlate. Beware logging " +
    "sensitive data and high-cardinality metric costs. Monitoring detects; profiling diagnoses &mdash; you " +
    "need both.</p>"
};

C["performance-testing"] = {
  summary: "<p><strong>Performance testing</strong> is the umbrella for verifying an API's speed, scalability, " +
    "and stability under various conditions: <strong>load</strong> (expected/peak traffic), " +
    "<strong>stress</strong> (beyond capacity, to find breaking points), <strong>spike</strong> (sudden " +
    "surges), <strong>soak/endurance</strong> (sustained load over time, finding leaks). It validates " +
    "performance requirements before they affect real users.</p>",
  examples: [
    {
      title: "Example 1: Types of performance tests",
      description: "<p>Each answers a different question.</p>",
      code: "// Load:   does it meet SLAs at expected/peak traffic?\n// Stress: where does it break? (find the capacity ceiling)\n// Spike:  can it handle a sudden 10x surge?\n// Soak:   does it stay healthy over hours? (memory leaks, degradation)"
    },
    {
      title: "Example 2: A measurable goal",
      description: "<p>Define pass/fail criteria.</p>",
      code: "// Target: at 1000 req/s sustained,\n//   p95 latency < 300ms, error rate < 0.5%, no memory growth over 2h.\n// Run, measure, then optimize the bottleneck and re-test."
    },
    {
      title: "Example 3: define SLOs and assert on them in the test",
      description: "<p>A performance test should pass/fail against explicit targets, not just produce graphs.</p>",
      code: "// k6 example: ramp to 500 VUs, then assert thresholds\n" +
        "export const options = {\n" +
        "  stages: [{ duration: '2m', target: 500 }, { duration: '5m', target: 500 }],\n" +
        "  thresholds: {\n" +
        "    http_req_duration: ['p(95)<300', 'p(99)<800'],   // latency SLO\n" +
        "    http_req_failed:   ['rate<0.01'],                 // <1% errors\n" +
        "  },\n" +
        "};\n" +
        "// CI fails if the SLOs are missed -> catches regressions before release."
    },
    {
      title: "Example 4 (edge case): test environment realism + regression baselines",
      description: "<p>Results are meaningless if the environment, data, or traffic shape differ from production, and one-off tests miss gradual regressions.</p>",
      code: "// non-prod-like env (smaller DB, no CDN, tiny dataset) -> numbers won't transfer.\n" +
        "//   use prod-like infra + realistic data volume + realistic request mix/think-time.\n" +
        "// run on a SCHEDULE and track a BASELINE -> a 10% p99 creep per release is invisible\n" +
        "//   in a single run but compounds. Compare against last release.\n" +
        "// also size the load generator (an undersized client measures the rig, not the API)."
    }
  ],
  whenToUse: "<p>Run performance tests before launches and major changes, and on a schedule to catch " +
    "regressions. <strong>Gotchas:</strong> test against production-like environments and data with realistic " +
    "scenarios (or results mislead). Measure percentiles. Don't skip <strong>soak tests</strong> &mdash; some " +
    "problems (memory leaks, resource exhaustion) only appear over time. Make the load generator adequate so " +
    "it isn't the bottleneck. Define clear pass/fail criteria tied to SLAs. Combine with profiling/monitoring " +
    "to diagnose failures. Automate where possible (perf tests in CI with thresholds). It overlaps with load " +
    "testing &mdash; load is one type of performance test.</p>"
};

C["error-handling-retries"] = {
  summary: "<p>Robust API clients handle errors and <strong>retry transient failures</strong> (network blips, " +
    "timeouts, <code>503</code>/<code>429</code>) with <strong>exponential backoff and jitter</strong>, a " +
    "retry cap, and <strong>circuit breakers</strong> to stop hammering a failing service. On the server, " +
    "return clear errors and appropriate retryable status codes. Done right, this makes integrations " +
    "resilient; done naively, retries amplify load (retry storms).</p>",
  examples: [
    {
      title: "Example 1: Retry with backoff + jitter",
      description: "<p>Retry transient failures, spacing attempts out.</p>",
      code: "// attempt 1 fails -> wait ~1s (+ random jitter)\n// attempt 2 -> ~2s ; attempt 3 -> ~4s ; then give up (retry budget)\n// Only retry TRANSIENT + IDEMPOTENT operations.\n// Jitter prevents many clients retrying in lockstep (thundering herd)."
    },
    {
      title: "Example 2: Circuit breaker + idempotency",
      description: "<p>Stop calling a failing dependency; make retries safe.</p>",
      code: "// Circuit breaker: after repeated failures, 'open' -> fail fast/fallback\n//   for a cooldown, letting the service recover.\n// Idempotency keys: retried POSTs don't create duplicates."
    },
    {
      title: "Example 3: retry transient failures with backoff + jitter",
      description: "<p>Retry only retryable errors, spacing attempts out, and give up after a bound.</p>",
      code: "for (let attempt = 0; attempt < 4; attempt++) {\n" +
        "  try { return await call(); }\n" +
        "  catch (e) {\n" +
        "    if (!isTransient(e)) throw e;          // don't retry 4xx / validation\n" +
        "    await sleep(rand(0, min(cap, base * 2 ** attempt))); // exp backoff + jitter\n" +
        "  }\n" +
        "}\n" +
        "// honor Retry-After on 429/503; pair with a circuit breaker + per-call timeout."
    },
    {
      title: "Example 4 (edge case): retrying non-idempotent calls + retry storms",
      description: "<p>Blind retries can double-charge and can amplify an outage - bound them and gate with a breaker.</p>",
      code: "// retrying POST /charge after a timeout (that actually succeeded) -> double charge.\n" +
        "//   only retry idempotent ops, or send an Idempotency-Key.\n" +
        "// during an outage, every client retrying 3x = 3x load on the dying service\n" +
        "//   (retry storm) -> use a CIRCUIT BREAKER (stop calling) + a retry BUDGET.\n" +
        "// never retry with no delay or unbounded; don't retry 4xx (they'll fail again)."
    }
  ],
  whenToUse: "<p>Implement error handling + retries for any client calling a remote API/service &mdash; networks " +
    "are unreliable. <strong>Gotchas:</strong> always use <strong>exponential backoff with jitter</strong> and " +
    "a <strong>cap</strong> &mdash; naive immediate/synchronized retries cause <strong>retry storms</strong> " +
    "that worsen outages, especially when nested across layers (retry at one level). Only retry " +
    "<strong>transient</strong> failures (not 400/404) and <strong>idempotent</strong> operations (or use " +
    "idempotency keys). Add timeouts and circuit breakers. On the server, return correct retryable codes (429/" +
    "503 + <code>Retry-After</code>). Use proven resilience libraries rather than hand-rolling.</p>"
};

/* ===================== INTEGRATION PATTERNS ===================== */

C["api-integration-patterns"] = {
  summary: "<p><strong>API integration patterns</strong> are established ways for systems to communicate: " +
    "<strong>synchronous</strong> request/response (REST, gRPC), <strong>asynchronous</strong> messaging " +
    "(queues, events), <strong>event-driven</strong> architectures, <strong>webhooks</strong> vs " +
    "<strong>polling</strong>, <strong>API gateways</strong>, <strong>batch processing</strong>, and " +
    "<strong>real-time</strong> (WebSockets, SSE). Choosing the right pattern shapes coupling, scalability, " +
    "and resilience of integrations.</p>",
  examples: [
    {
      title: "Example 1: Sync vs async integration",
      description: "<p>Immediate response vs decoupled processing.</p>",
      code: "// Synchronous: client calls API, waits for the result (REST/gRPC)\n//   -> simple, immediate; couples caller + callee in time\n// Asynchronous: client sends a message/event, gets ack, result later\n//   -> decoupled, resilient, scalable; eventual, harder to trace"
    },
    {
      title: "Example 2: Pattern by need",
      description: "<p>Match the pattern to the requirement.</p>",
      code: "// Immediate result needed       -> synchronous request/response\n// Decouple + absorb spikes       -> messaging queue (async)\n// React to events / fan-out      -> event-driven / pub-sub\n// Push updates to clients        -> webhooks / WebSockets / SSE\n// Many independent services      -> microservices + API gateway"
    },
    {
      title: "Example 3: the integration patterns and when each fits",
      description: "<p>Pick by coupling, latency, and reliability needs.</p>",
      code: "// request/response (sync): need an answer now -> REST/gRPC\n" +
        "// messaging/events (async): decouple, buffer, fan-out -> queues/pub-sub\n" +
        "// webhooks: server pushes events to a client URL -> near-real-time notifications\n" +
        "// polling: client asks repeatedly -> simple, works everywhere, wasteful\n" +
        "// batch: bulk/scheduled processing -> high volume, no per-item realtime\n" +
        "// gateway/BFF: aggregate/route across services for clients"
    },
    {
      title: "Example 4 (edge case): sync coupling vs async complexity",
      description: "<p>Synchronous integration is simple but couples availability; async decouples but adds eventual consistency and ordering/duplication concerns.</p>",
      code: "// sync chains: A->B->C, if C is down/slow, A fails/stalls (coupled availability +\n" +
        "//   cascading failure) -> add timeouts/breakers, or go async for non-critical steps.\n" +
        "// async/messaging: decoupled + resilient, BUT at-least-once delivery (dedupe),\n" +
        "//   per-partition ordering only, results arrive later, and a broker to operate.\n" +
        "// rule of thumb: sync for 'need the answer now', async for 'do this eventually'."
    }
  ],
  whenToUse: "<p>Choose integration patterns based on coupling, latency, reliability, and scale needs. Use " +
    "<strong>synchronous</strong> when the caller needs an immediate answer; <strong>asynchronous/event-" +
    "driven</strong> to decouple services, absorb load, and improve resilience. <strong>Gotchas:</strong> " +
    "async adds complexity (eventual consistency, idempotency, harder tracing, a broker to operate) &mdash; " +
    "don't make everything async. Sync is simpler but couples services in time (a slow dependency blocks the " +
    "caller). Mix patterns deliberately. The sub-topics detail sync/async, events, gateways, webhooks vs " +
    "polling, queues, and real-time options.</p>"
};

C["synchronous-vs-asynchronous-apis"] = {
  summary: "<p><strong>Synchronous</strong> APIs return the result within the request &mdash; the caller waits " +
    "(REST, gRPC). <strong>Asynchronous</strong> APIs accept the request, return immediately (often " +
    "<code>202 Accepted</code>), and deliver the result later (via polling, webhook, queue, or push). Sync is " +
    "simple and immediate but couples caller and callee in time; async decouples them, handles long-running " +
    "work, and absorbs load, at the cost of complexity.</p>",
  examples: [
    {
      title: "Example 1: Sync vs async response",
      description: "<p>Wait for the result vs get it later.</p>",
      code: "// Synchronous:\n//   POST /resize -> (waits) -> 200 { url }\n// Asynchronous:\n//   POST /resize -> 202 Accepted { jobId }   (returns immediately)\n//   later: GET /jobs/{jobId} -> { status: done, url }  (or webhook/push)"
    },
    {
      title: "Example 2: When to go async",
      description: "<p>Long, spiky, or decoupled work.</p>",
      code: "// Use async when: work is slow (video/report), bursty (absorb spikes\n//   via a queue), or services should be decoupled/independently scaled.\n// Use sync when: the caller needs the result NOW and work is fast."
    },
    {
      title: "Example 3: same operation, sync vs async shapes",
      description: "<p>Sync returns the result inline; async accepts the work and reports completion later.</p>",
      code: "// synchronous: caller waits for the result\n" +
        "POST /reports -> 200 { reportUrl }        // blocks until built (only if fast)\n" +
        "// asynchronous: accept now, finish later\n" +
        "POST /reports -> 202 Accepted { jobId }\n" +
        "GET  /reports/{jobId} -> 200 { status:'processing' } ... then { status:'done', url }\n" +
        "//   (or notify via webhook/SSE when ready) -> frees the caller, survives slow work."
    },
    {
      title: "Example 4 (edge case): long sync calls exhaust resources",
      description: "<p>Forcing slow work to be synchronous ties up threads/connections and times out clients - the cue to go async.</p>",
      code: "// a 30s sync report ties up a request thread + risks client/proxy timeouts (often\n" +
        "//   ~30-60s) -> under load, threads pile up -> the whole API stalls.\n" +
        "// make it async: 202 + jobId, process in a worker, client polls/gets pushed.\n" +
        "// but async costs UX complexity (no immediate answer) + tracking state -> don't\n" +
        "//   make FAST operations async for no reason. Match to the work's duration."
    }
  ],
  whenToUse: "<p>Use <strong>synchronous</strong> for fast operations where the caller needs an immediate " +
    "result (most CRUD/reads). Use <strong>asynchronous</strong> for long-running work, spike absorption, and " +
    "decoupling services (reports, media processing, integrations). <strong>Gotchas:</strong> async makes " +
    "results eventual &mdash; you need a way to deliver them (polling/webhooks/push) and to make operations " +
    "idempotent (retries). It adds infrastructure (queues) and harder end-to-end tracing. Sync blocks the " +
    "caller on slow dependencies (use timeouts/circuit breakers). Don't force async where sync is simpler, or " +
    "vice versa &mdash; match it to the operation's duration and coupling needs.</p>"
};

C["event-driven-architecture"] = {
  summary: "<p><strong>Event-driven architecture (EDA)</strong> has components communicate by producing and " +
    "reacting to <strong>events</strong> ('something happened') rather than calling each other directly. " +
    "Producers emit events to a broker; consumers subscribe and react independently. This yields loose " +
    "coupling, extensibility (add consumers without touching producers), and async scalability &mdash; " +
    "foundational to reactive systems and microservices.</p>",
  examples: [
    {
      title: "Example 1: Producer emits, consumers react",
      description: "<p>One event, many independent reactions.</p>",
      code: "// Producer:\npublish('OrderPlaced', { orderId: 42 });\n// Consumers (independent, decoupled):\n//   - Email service -> confirmation\n//   - Inventory     -> reserve stock\n//   - Analytics     -> record sale\n// Add a Fraud check later -> just subscribe; producer unchanged."
    },
    {
      title: "Example 2: Event vs direct call",
      description: "<p>Announce a fact vs invoke a service.</p>",
      code: "// Direct (coupled): orderSvc.call(emailSvc.send(...))\n// Event (decoupled): orderSvc emits 'OrderPlaced'; subscribers react.\n//   -> producer doesn't know/wait for consumers"
    },
    {
      title: "Example 3: one event, many independent reactions",
      description: "<p>A producer emits a fact; consumers react autonomously, added without changing the producer.</p>",
      code: "// producer announces a fact (doesn't know/care who listens):\n" +
        "publish('OrderPlaced', { orderId: 42 });\n" +
        "// independent consumers react:\n" +
        "on('OrderPlaced', reserveInventory);\n" +
        "on('OrderPlaced', sendConfirmation);\n" +
        "on('OrderPlaced', updateAnalytics);   // add 'awardLoyaltyPoints' later, zero producer change"
    },
    {
      title: "Example 4 (edge case): eventual consistency + hard-to-trace flows",
      description: "<p>EDA's decoupling comes with duplicate/out-of-order delivery and an implicit, scattered control flow.</p>",
      code: "// 'what happens after an order?' has no single answer -> logic is spread across N\n" +
        "//   handlers (and risks event loops A->B->A).\n" +
        "// events are at-least-once + unordered -> consumers must be idempotent + tolerate\n" +
        "//   reordering (partition by entity key for per-entity order).\n" +
        "// mitigate with correlation/trace ids, event schemas, and DLQs. For a strictly\n" +
        "//   ordered, must-see-now workflow, sync calls may fit better."
    }
  ],
  whenToUse: "<p>Use EDA when you need loose coupling, one action triggering many independent reactions, async/" +
    "scalable processing, or real-time-ish workflows &mdash; order processing, notifications, integrations, " +
    "audit trails. <strong>Gotchas:</strong> control flow becomes implicit and harder to trace (you must know " +
    "who subscribes); you inherit messaging concerns &mdash; at-least-once delivery (make consumers " +
    "idempotent), ordering, failures, dead-letter handling, and event schema versioning. Debugging end-to-end " +
    "is harder. A broker is critical infrastructure. Use it where decoupling/async benefits are real; keep " +
    "simple synchronous calls where flow clarity matters.</p>"
};

C["api-gateways"] = {
  summary: "<p>An <strong>API gateway</strong> is a single entry point in front of backend services that " +
    "handles cross-cutting concerns: <strong>routing</strong>, <strong>authentication/authorization</strong>, " +
    "<strong>rate limiting</strong>, <strong>request/response transformation</strong>, " +
    "<strong>aggregation</strong>, caching, and logging. It decouples clients from internal service topology, " +
    "centralizes policy, and reduces the surface exposed to clients &mdash; a staple of microservice " +
    "architectures.</p>",
  examples: [
    {
      title: "Example 1: Gateway responsibilities",
      description: "<p>One front door doing cross-cutting work.</p>",
      code: "// Client -> [ API Gateway ] -> microservices\n//   - routes /users/** -> user-service, /orders/** -> order-service\n//   - terminates TLS, authenticates, rate-limits\n//   - aggregates multiple service calls into one response\n//   - logs, transforms, caches"
    },
    {
      title: "Example 2: Hides internal topology",
      description: "<p>Reorganize services without breaking clients.</p>",
      code: "// Split a service or move it -> just update gateway routes;\n//   client-facing URLs stay stable. Backends stay private behind it."
    },
    {
      title: "Example 3: a single entry point handling cross-cutting concerns",
      description: "<p>The gateway routes to services and centralizes auth, rate limiting, TLS, and aggregation.</p>",
      code: "// client -> GATEWAY -> services\n" +
        "//   routing:    /users/* -> user-svc, /orders/* -> order-svc\n" +
        "//   cross-cut:  TLS termination, authN, rate limiting, logging, CORS\n" +
        "//   aggregation: combine calls for a client view (BFF-style)\n" +
        "// services stay simple + internal; clients get one stable URL."
    },
    {
      title: "Example 4 (edge case): SPOF, bottleneck, and the trust boundary",
      description: "<p>All traffic flows through the gateway, so it must be HA and thin - and services must not blindly trust headers it sets.</p>",
      code: "// one gateway instance down -> everything is unreachable -> run multiple replicas / HA.\n" +
        "// don't put business logic in it (becomes a 'god gateway' + deploy bottleneck) -\n" +
        "//   keep it to routing + cross-cutting.\n" +
        "// services trust X-User-Id set by the gateway -> if a service is reachable DIRECTLY\n" +
        "//   (misconfig/SSRF), that header is forgeable -> lock services to gateway-only\n" +
        "//   traffic (mTLS/private net) AND still authorize inside each service."
    }
  ],
  whenToUse: "<p>Use an API gateway for microservice/multi-service architectures and public APIs needing " +
    "centralized routing, security, and policy. It gives clients one stable endpoint and offloads cross-" +
    "cutting concerns from services. <strong>Gotchas:</strong> the gateway is a critical single point &mdash; " +
    "make it highly available and scalable (or it's a bottleneck/SPOF). Don't put business logic in it (keep " +
    "it to cross-cutting concerns) or it becomes a god component. It doesn't replace service-level " +
    "authorization (defense in depth). Adds a network hop and operational piece. For a single service/small " +
    "system, a plain reverse proxy/load balancer suffices &mdash; don't introduce a gateway prematurely.</p>"
};

C["microservices-architecture"] = {
  summary: "<p><strong>Microservices architecture</strong> structures an application as small, independently " +
    "deployable services, each owning a business capability and (usually) its own data, communicating over " +
    "the network (REST/gRPC/messaging). It enables independent deployment/scaling, team autonomy, and fault " +
    "isolation &mdash; at the cost of significant distributed-systems complexity (network failures, data " +
    "consistency, service discovery, observability).</p>",
  examples: [
    {
      title: "Example 1: Services own capability + data",
      description: "<p>Autonomous services over the network.</p>",
      code: "//   [Order svc] --http/event--> [Payment svc] --> [Inventory svc]\n//      (own DB)                  (own DB)             (own DB)\n// Each deploys, scales, and is owned independently.\n// + API gateway, service discovery, distributed tracing."
    },
    {
      title: "Example 2: New failure modes",
      description: "<p>Network calls fail; transactions span services.</p>",
      code: "// order.place() -> payment OK -> inventory FAILS\n//   -> no single DB transaction across services\n//   -> compensate (saga) + retries + circuit breakers + idempotency"
    },
    {
      title: "Example 3: independently deployable services, each owning its data",
      description: "<p>Decompose by business capability; services communicate over the network and own their datastore.</p>",
      code: "// order-svc (own DB) --REST/events--> payment-svc (own DB)\n" +
        "//                     --events-->         inventory-svc (own DB)\n" +
        "// each: own pipeline, own scaling, one team end-to-end; NO shared database.\n" +
        "// boundaries follow capabilities (orders, payments), not technical layers."
    },
    {
      title: "Example 4 (edge case): the distributed-monolith trap + inherent tax",
      description: "<p>Services that share a DB or must deploy together give you the costs of distribution with none of the independence.</p>",
      code: "// smell: svc A can't deploy without B, they share a DB, one change touches both ->\n" +
        "//   distributed monolith (worst of both worlds).\n" +
        "// tax even when done right: no cross-service transactions (sagas), retries/\n" +
        "//   idempotency, tracing, versioned contracts, N pipelines.\n" +
        "// adopt ONLY with real drivers (many teams, independent scale). Otherwise a\n" +
        "//   modular monolith ships faster - extract services when a boundary truly needs it."
    }
  ],
  whenToUse: "<p>Adopt microservices when you have concrete drivers &mdash; many teams needing independent " +
    "deploys, parts with very different scaling needs, fault isolation &mdash; <em>and</em> the DevOps " +
    "maturity to run them. <strong>The dominant advice is 'monolith first':</strong> start with a modular " +
    "monolith and extract services only when a real boundary/pain emerges. <strong>Gotchas:</strong> " +
    "premature microservices trade simple in-process calls for network failures, eventual consistency, " +
    "distributed transactions (sagas), service discovery, and heavy operational burden. Wrong boundaries " +
    "create a 'distributed monolith' (worst of both). Microservices solve organizational/scaling problems, " +
    "not code quality. (See the System Design roadmap for depth.)</p>"
};

C["webhooks-vs-polling"] = {
  summary: "<p>Two ways for a client to learn about events/results: <strong>polling</strong> (the client " +
    "repeatedly asks 'any updates?') and <strong>webhooks</strong> (the server pushes a notification to a " +
    "client-provided URL when something happens). Polling is simple but wasteful and laggy; webhooks are " +
    "efficient and near-real-time but require the client to host an endpoint and handle delivery " +
    "reliability/security.</p>",
  examples: [
    {
      title: "Example 1: Polling vs webhook",
      description: "<p>Pull repeatedly vs get pushed once.</p>",
      code: "// Polling: client every 30s -> GET /orders/42/status -> 'pending'... 'done'\n//   simple, but wasteful + delayed (up to the poll interval)\n// Webhook: server POSTs to client's URL when status changes:\n//   POST https://client/hooks { orderId: 42, status: 'done' }\n//   efficient, near-real-time"
    },
    {
      title: "Example 2: Webhook reliability + security",
      description: "<p>Push needs retries, dedup, and verification.</p>",
      code: "// Webhooks must handle: retries on delivery failure, duplicate\n//   deliveries (idempotency), and SIGNATURE VERIFICATION\n//   (so the client trusts the sender). Client must expose an endpoint."
    },
    {
      title: "Example 3: push (webhook) vs pull (polling)",
      description: "<p>Webhooks deliver events as they happen; polling repeatedly asks - efficiency vs simplicity.</p>",
      code: "// polling: client asks on a timer (simple, but wasteful + laggy)\n" +
        "//   every 30s: GET /events?since=... -> mostly empty responses\n" +
        "// webhook: server POSTs to YOUR url when something happens (efficient, real-time)\n" +
        "//   POST https://you.com/hooks/order  { event:'order.paid', id:42 }\n" +
        "// webhooks need a public endpoint; polling works from anywhere."
    },
    {
      title: "Example 4 (edge case): webhook reliability + polling cost",
      description: "<p>Webhooks can be missed and must be secured/retried; polling wastes calls and adds latency.</p>",
      code: "// webhooks: receiver down -> event lost unless you RETRY with backoff; make handling\n" +
        "//   IDEMPOTENT (duplicates happen); VERIFY the signature (HMAC) - the endpoint is\n" +
        "//   public and spoofable. Provide a way to replay missed events.\n" +
        "// polling: too frequent = load + cost + mostly-empty responses; too rare = stale ->\n" +
        "//   use conditional requests (ETag/since) + backoff.\n" +
        "// hybrid: webhook for immediacy + periodic poll as a reconciliation safety net."
    }
  ],
  whenToUse: "<p>Use <strong>webhooks</strong> for efficient, near-real-time event delivery between servers " +
    "(integrations, async results) when the receiver can host an endpoint. Use <strong>polling</strong> for " +
    "simplicity, when the client can't receive callbacks, or for low-frequency checks. <strong>Gotchas:</strong> " +
    "polling wastes resources and adds latency (tune interval, use conditional requests/backoff). Webhooks " +
    "require the receiver to handle retries, <strong>duplicate deliveries (idempotency)</strong>, and " +
    "<strong>verify authenticity</strong> (signatures &mdash; anyone could POST to the URL). Webhooks fail " +
    "silently if the endpoint is down (need retries + monitoring). For browser clients needing live updates, " +
    "WebSockets/SSE fit better than either.</p>"
};

C["batch-processing"] = {
  summary: "<p><strong>Batch processing</strong> handles large volumes of data or operations together, " +
    "typically asynchronously and on a schedule, rather than one-by-one in real time. For APIs, this includes " +
    "<strong>batch endpoints</strong> (submit many operations in one request), bulk imports/exports, and " +
    "scheduled jobs that process accumulated data. It improves throughput and efficiency for high-volume work " +
    "where immediate per-item responses aren't needed.</p>",
  examples: [
    {
      title: "Example 1: A batch endpoint",
      description: "<p>Submit many operations in one call.</p>",
      code: "POST /users/batch\n{ \"operations\": [\n  { \"method\": \"create\", \"data\": {...} },\n  { \"method\": \"update\", \"id\": 7, \"data\": {...} }\n]}\n-> 200 { results: [ { status: 'ok' }, { status: 'error', ... } ] }\n// Reduces round-trips for bulk work."
    },
    {
      title: "Example 2: Async bulk job",
      description: "<p>Large jobs run in the background.</p>",
      code: "// POST /imports (large CSV) -> 202 { jobId }   (async)\n//   worker processes in batches -> client polls/webhook for result\n// Scheduled batch: nightly job aggregates the day's data."
    },
    {
      title: "Example 3: a bulk endpoint with per-item results",
      description: "<p>Process many items in one request, returning a status per item (and often a 207 multi-status).</p>",
      code: "POST /orders/batch  { items: [ {...}, {...}, {...} ] }\n" +
        "-> 207 Multi-Status\n" +
        "{ results: [ { index:0, status:201, id:1 },\n" +
        "             { index:1, status:422, error:'invalid' },\n" +
        "             { index:2, status:201, id:2 } ] }\n" +
        "// one round-trip for many items; caller sees which succeeded/failed individually."
    },
    {
      title: "Example 4 (edge case): partial failure, size limits, and async for big jobs",
      description: "<p>Batches complicate atomicity (all-or-nothing?), can exceed payload limits, and large jobs should be async.</p>",
      code: "// decide + document: is the batch ATOMIC (all-or-nothing) or BEST-EFFORT (per-item)?\n" +
        "//   -> partial success needs the per-item result shape above, not a single 200/400.\n" +
        "// cap batch size (e.g. 1000 items) + payload size -> reject oversized requests.\n" +
        "// for very large/slow batches go ASYNC: 202 + jobId, process in a worker, poll for\n" +
        "//   progress -> don't hold a request open for minutes. Make retries idempotent."
    }
  ],
  whenToUse: "<p>Use batch processing for high-volume operations where per-item real-time responses aren't " +
    "needed &mdash; bulk imports/exports, data syncs, scheduled aggregations, reducing round-trips for many " +
    "small operations. <strong>Gotchas:</strong> decide partial-failure semantics (all-or-nothing vs per-item " +
    "results &mdash; usually return per-item status). Large batches can be slow/heavy &mdash; process " +
    "asynchronously (202 + job status) and chunk the work. Cap batch size (prevent abuse/resource " +
    "exhaustion). Make batch operations idempotent (retried batches). Provide progress/result reporting. " +
    "Don't force batch where simple per-request operations suffice; reserve it for genuine bulk/throughput " +
    "needs.</p>"
};

C["messaging-queues"] = {
  summary: "<p><strong>Messaging queues</strong> enable asynchronous communication: producers send messages " +
    "to a queue, and consumers process them independently &mdash; decoupling services in time, space, and " +
    "rate. The queue durably buffers messages (surviving consumer downtime, absorbing spikes). Models: " +
    "point-to-point (one consumer per message) and pub/sub (broadcast). They're the backbone of async/event-" +
    "driven integrations (RabbitMQ, Kafka, SQS).</p>",
  examples: [
    {
      title: "Example 1: Decoupled producer/consumer",
      description: "<p>A durable buffer between services.</p>",
      code: "// Producer -> [ Queue ] -> Consumer (processes at its own pace)\n// Consumer down? Messages wait. Producer fast / consumer slow?\n//   The queue buffers the difference -> resilient + scalable."
    },
    {
      title: "Example 2: Spike absorption",
      description: "<p>The queue smooths bursty load.</p>",
      code: "// 10,000 requests arrive in a burst:\n//   [API] --enqueue--> [ queue ] --steady--> [workers x5]\n// Workers drain at a sustainable rate; the DB isn't overwhelmed."
    },
    {
      title: "Example 3: producer -> queue -> consumer, decoupled",
      description: "<p>A queue lets a producer hand off work without waiting; consumers process at their own pace and scale independently.</p>",
      code: "// web: enqueue + return immediately\n" +
        "queue.send('process-upload', { fileId: 9 }); // POST returns 202\n" +
        "// worker(s): pull + process; add workers to raise throughput\n" +
        "queue.consume('process-upload', job => transcode(job.fileId));\n" +
        "// buffers bursts, survives consumer downtime, decouples producer from consumer."
    },
    {
      title: "Example 4 (edge case): delivery semantics + the broker as infrastructure",
      description: "<p>Queues are at-least-once with limited ordering, and the broker itself must be operated.</p>",
      code: "// at-least-once -> consumers MUST be idempotent (dedupe by message id).\n" +
        "// ordering is per-queue/partition only -> partition by key if order matters.\n" +
        "// handle poison messages (max retries -> dead-letter queue), and set visibility\n" +
        "//   timeout > processing time (or two workers grab the same message).\n" +
        "// the broker (RabbitMQ/Kafka/SQS) is infra to run, monitor (queue depth/lag),\n" +
        "//   secure, and make HA. Don't use a queue for request/response needing an immediate reply."
    }
  ],
  whenToUse: "<p>Use message queues to decouple services, process work asynchronously, absorb bursts, broadcast " +
    "events, and add reliability (durability + retries) &mdash; core to async integration and microservices. " +
    "<strong>Gotchas:</strong> a broker is critical infrastructure to run/monitor. Design for messaging " +
    "realities: at-least-once delivery means duplicates &mdash; make consumers <strong>idempotent</strong>; " +
    "handle ordering, failures (dead-letter queues), and back pressure. Processing becomes eventual (no " +
    "immediate result). For simple synchronous request/response where the caller needs an answer now, a " +
    "direct call is simpler. The sub-topics cover RabbitMQ and Kafka specifically.</p>"
};

C["rabbit-mq"] = {
  summary: "<p><strong>RabbitMQ</strong> is a popular, mature <strong>message broker</strong> implementing " +
    "traditional messaging (AMQP): it routes messages from producers to queues via exchanges with flexible " +
    "routing (direct, topic, fanout), supports acknowledgements, and is great for <strong>task queues</strong> " +
    "and complex routing. It's a 'smart broker, dumb consumer' model &mdash; the broker handles routing and " +
    "delivery logic.</p>",
  examples: [
    {
      title: "Example 1: Exchange routing",
      description: "<p>Exchanges route messages to queues by rules.</p>",
      code: "// Producer -> Exchange --(routing key)--> Queue(s) -> Consumers\n// Types: direct (exact key), topic (pattern 'orders.*'),\n//        fanout (broadcast to all bound queues)\n// Flexible routing is RabbitMQ's strength."
    },
    {
      title: "Example 2: Work queue with acks",
      description: "<p>Distribute tasks reliably across workers.</p>",
      code: "// Multiple workers consume one queue (competing consumers).\n// Each message ack'd after processing -> redelivered if a worker dies.\n// Great for background jobs / task distribution."
    },
    {
      title: "Example 3: flexible routing via exchanges",
      description: "<p>RabbitMQ routes messages from exchanges to queues by binding rules - great for task distribution and complex routing.</p>",
      code: "// publish to an exchange with a routing key; bindings decide which queues get it:\n" +
        "//   direct:  routingKey 'orders.eu' -> eu-queue\n" +
        "//   topic:   'orders.*'            -> all-orders-queue\n" +
        "//   fanout:  -> every bound queue (broadcast)\n" +
        "// consumers ack messages; unacked -> redelivered. Good for work queues + RPC."
    },
    {
      title: "Example 4 (edge case): RabbitMQ vs Kafka - different tools",
      description: "<p>RabbitMQ is a message BROKER (consume-and-remove); it's not built for retained, replayable event streams at Kafka scale.</p>",
      code: "// RabbitMQ: messages are consumed + removed (queue semantics); rich routing, per-\n" +
        "//   message ack, lower throughput. Best for TASK queues + complex routing + RPC.\n" +
        "// Kafka: a retained, replayable LOG; consumers read at their own offset; very high\n" +
        "//   throughput. Best for EVENT STREAMING + replay + multiple independent consumers.\n" +
        "// don't force RabbitMQ to be an event log (no long retention/replay) or Kafka to do\n" +
        "//   fine-grained routing/per-message ack. Pick by the access pattern."
    }
  ],
  whenToUse: "<p>Choose RabbitMQ for task queues, complex routing needs, request/reply, and traditional " +
    "messaging where flexible delivery and per-message acknowledgement matter &mdash; background jobs, " +
    "work distribution, RPC-over-messaging. <strong>Gotchas:</strong> it's optimized for <em>transient</em> " +
    "messaging (messages consumed and gone), not long-term event log/replay &mdash; that's Kafka's strength. " +
    "It can struggle at extreme throughput/retention compared to Kafka. Make consumers idempotent (redelivery " +
    "on failure). Configure dead-letter queues and acknowledgements correctly. RabbitMQ vs Kafka: RabbitMQ " +
    "for routing/task queues, Kafka for high-throughput event streaming/log &mdash; choose by use case.</p>"
};

C["kafka"] = {
  summary: "<p><strong>Apache Kafka</strong> is a distributed <strong>event streaming platform</strong>: a " +
    "durable, append-only, partitioned <strong>log</strong> where producers publish events to topics and " +
    "multiple consumers read independently (tracking their own offset) and can <strong>replay</strong> " +
    "history. It's built for very high throughput, retention, and ordered streams &mdash; the backbone of " +
    "event-driven systems, data pipelines, and event sourcing.</p>",
  examples: [
    {
      title: "Example 1: A retained, replayable log",
      description: "<p>Events persist; consumers read at their own offset.</p>",
      code: "// Topic 'orders' (partitioned, retained log):\n//   [e1][e2][e3][e4]...\n// Consumer A reads from offset 0 (full history),\n// Consumer B from offset 3 (recent). A NEW consumer can replay from\n//   the start - events aren't deleted on read (unlike a queue)."
    },
    {
      title: "Example 2: High-throughput streaming",
      description: "<p>Partitions enable parallelism + ordering per key.</p>",
      code: "// Partition by key (e.g. customerId) -> order preserved per key,\n//   parallelism across keys. Scales to millions of events/sec.\n// Used for: event sourcing, data pipelines, log aggregation, streaming."
    },
    {
      title: "Example 3: a retained, replayable, partitioned log",
      description: "<p>Kafka stores events in partitioned topics; consumer groups read at their own offset and can replay history.</p>",
      code: "// topic 'orders' partitioned by orderId (key) -> order kept WITHIN a partition\n" +
        "// producers append; multiple consumer GROUPS read independently:\n" +
        "//   analytics-group  reads from offset 0 (full history)\n" +
        "//   fulfillment-group reads latest only\n" +
        "// events retained for days -> replay to rebuild state / onboard a new consumer."
    },
    {
      title: "Example 4 (edge case): ordering, partitioning, and operational weight",
      description: "<p>Kafka only orders within a partition, key choice is critical, and it's heavy to run for small needs.</p>",
      code: "// global ordering doesn't exist -> only per-partition. To keep an entity's events\n" +
        "//   ordered, key by entity id (same key -> same partition). A bad key -> hot\n" +
        "//   partition (skew) or lost ordering.\n" +
        "// at-least-once by default -> consumers idempotent; 'exactly once' needs extra config.\n" +
        "// Kafka is operationally heavy (brokers, ZK/KRaft, partitions to plan) -> for a\n" +
        "//   simple task queue, RabbitMQ/SQS is far less to run."
    }
  ],
  whenToUse: "<p>Use Kafka for high-throughput event streaming, retained/replayable event logs, data " +
    "pipelines, event sourcing, and fan-out to many independent consumers. <strong>Gotchas:</strong> it's " +
    "operationally heavier than a simple queue (cluster, partitions, consumer groups, offsets) &mdash; " +
    "overkill for basic task queues (RabbitMQ/SQS are simpler there). Ordering is only guaranteed within a " +
    "partition (choose partition keys carefully). Consumers track offsets and must handle duplicates " +
    "(at-least-once) and rebalancing. Retention/storage needs planning. Kafka shines for streaming/event " +
    "log/replay at scale; for simple point-to-point task distribution, a traditional broker is simpler.</p>"
};

C["web-sockets"] = {
  summary: "<p><strong>WebSockets</strong> provide a persistent, <strong>full-duplex</strong> (two-way) " +
    "connection between client and server over a single TCP connection, enabling real-time, low-latency " +
    "communication in <em>both</em> directions. Unlike HTTP request/response, either side can send messages " +
    "anytime. They power chat, live collaboration, multiplayer games, live dashboards, and trading apps.</p>",
  examples: [
    {
      title: "Example 1: Two-way real-time messaging",
      description: "<p>Both client and server can push anytime.</p>",
      code: "// Client opens a persistent connection:\nconst ws = new WebSocket('wss://example.com/chat');\nws.onmessage = e => render(e.data);   // server pushes anytime\nws.send('hello');                      // client sends anytime\n// Full-duplex over one connection - ideal for chat/live updates."
    },
    {
      title: "Example 2: WebSocket vs HTTP/polling",
      description: "<p>Persistent + bidirectional vs request/response.</p>",
      code: "// HTTP/polling: client must keep asking; one-way, request/response\n// WebSocket: open once, both sides push -> low latency, less overhead\n//   for high-frequency, bidirectional updates"
    },
    {
      title: "Example 3: a persistent, bidirectional connection",
      description: "<p>WebSockets upgrade an HTTP connection to a full-duplex channel where client and server push messages anytime.</p>",
      code: "// client opens it; both sides send freely after the handshake\n" +
        "const ws = new WebSocket('wss://api.example.com/chat');\n" +
        "ws.onmessage = e => render(JSON.parse(e.data));   // server -> client push\n" +
        "ws.send(JSON.stringify({ text: 'hi' }));          // client -> server push\n" +
        "// ideal for chat, multiplayer, collaborative editing, live trading."
    },
    {
      title: "Example 4 (edge case): stateful connections are operationally harder",
      description: "<p>Long-lived connections complicate scaling, reconnection, and load balancing - and are overkill for one-way updates.</p>",
      code: "// connections are STATEFUL -> a server holds N open sockets; scaling/restart drops\n" +
        "//   them. Need: reconnect + resume logic, heartbeats/ping, and a pub/sub backplane\n" +
        "//   (Redis) so any instance can push to any client (sticky LB or shared state).\n" +
        "// no built-in request/response or caching semantics; proxies/firewalls can block them.\n" +
        "// if you only need SERVER->client updates, SSE is simpler. Use WS for true two-way."
    }
  ],
  whenToUse: "<p>Use WebSockets for genuinely <strong>bidirectional, real-time</strong> applications &mdash; " +
    "chat, collaborative editing, multiplayer games, live trading/dashboards. <strong>Gotchas:</strong> " +
    "persistent connections are <strong>stateful</strong> and harder to scale than stateless HTTP (need " +
    "connection management, sticky routing or a pub/sub backplane like Redis to broadcast across servers). " +
    "Handle reconnection, heartbeats/keep-alive, and connection limits. Secure them (<code>wss://</code>, auth " +
    "on connect, validate messages). For <em>one-way</em> server-to-client updates, <strong>Server-Sent " +
    "Events</strong> are simpler. Don't use WebSockets where simple request/response or SSE suffices &mdash; " +
    "they add operational complexity.</p>"
};

C["server-sent-events"] = {
  summary: "<p><strong>Server-Sent Events (SSE)</strong> provide a <strong>one-way</strong> stream from server " +
    "to client over a single long-lived HTTP connection &mdash; the server pushes updates, the client " +
    "listens (via <code>EventSource</code>). It's simpler than WebSockets (plain HTTP, auto-reconnect, built-" +
    "in event ids), ideal when you only need the <em>server</em> to push (notifications, live feeds, progress " +
    "updates) and not full duplex.</p>",
  examples: [
    {
      title: "Example 1: Listening to a server stream",
      description: "<p>One-way push over HTTP.</p>",
      code: "// Client:\nconst es = new EventSource('/api/notifications');\nes.onmessage = e => show(e.data);   // server pushes events\n// Server keeps the connection open and writes events:\n//   data: { \"type\": \"new_message\" }\\n\\n   (text/event-stream)"
    },
    {
      title: "Example 2: SSE vs WebSocket",
      description: "<p>Simple one-way vs full duplex.</p>",
      code: "// SSE: server -> client only; plain HTTP; auto-reconnect; simple\n//   -> great for feeds, notifications, progress, live updates\n// WebSocket: bidirectional; more complex; for two-way real-time (chat/games)"
    },
    {
      title: "Example 3: one-way server push over plain HTTP",
      description: "<p>SSE streams events from server to client over a long-lived HTTP response - simpler than WebSockets for one-way updates.</p>",
      code: "// client\n" +
        "const es = new EventSource('/notifications');\n" +
        "es.onmessage = e => show(e.data);\n" +
        "// server keeps the response open, writes text/event-stream:\n" +
        "//   Content-Type: text/event-stream\n" +
        "//   data: {\"type\":\"alert\",\"msg\":\"...\"}\\n\\n\n" +
        "// auto-reconnect + Last-Event-ID resume are built into the browser EventSource."
    },
    {
      title: "Example 4 (edge case): one-directional + connection limits",
      description: "<p>SSE can't send client->server (use a normal request for that), is text-only, and HTTP/1.1 caps concurrent connections per domain.</p>",
      code: "// client->server must use a separate HTTP request (SSE is server->client only).\n" +
        "// text/UTF-8 only (no binary) -> base64 if you must send bytes.\n" +
        "// HTTP/1.1: ~6 connections per domain in browsers -> many SSE streams exhaust them\n" +
        "//   (HTTP/2 multiplexing fixes this). Some proxies buffer/close idle streams ->\n" +
        "//   send periodic keep-alive comments.\n" +
        "// for true two-way realtime use WebSockets; for one-way, SSE is the lighter choice."
    }
  ],
  whenToUse: "<p>Use SSE for <strong>one-way server-to-client</strong> real-time updates &mdash; notifications, " +
    "live feeds, progress bars, dashboards, streaming AI responses &mdash; where you don't need the client to " +
    "push back. It's simpler than WebSockets and works over standard HTTP with automatic reconnection. " +
    "<strong>Gotchas:</strong> it's <em>one-directional</em> (client-to-server still uses normal requests). " +
    "Each connection is long-lived (server must handle many open connections; HTTP/1.1 has per-domain " +
    "connection limits &mdash; HTTP/2 helps). Reconnection and proxies/buffering need care. No binary (text " +
    "only). For bidirectional needs, use WebSockets; for one-way push, SSE is the simpler, often-overlooked " +
    "choice.</p>"
};

C["real-time-apis"] = {
  summary: "<p><strong>Real-time APIs</strong> deliver data to clients with minimal delay as it changes, " +
    "rather than only on request. Techniques range from <strong>long polling</strong> (simple, legacy) to " +
    "<strong>Server-Sent Events</strong> (one-way push) to <strong>WebSockets</strong> (full duplex), often " +
    "backed by pub/sub and event-driven systems. They power live chat, notifications, collaboration, " +
    "dashboards, gaming, and streaming.</p>",
  examples: [
    {
      title: "Example 1: Choosing a real-time technique",
      description: "<p>Match the mechanism to the need.</p>",
      code: "// Long polling: client holds a request open until data or timeout (legacy)\n// SSE: server -> client one-way push (notifications, feeds)\n// WebSocket: two-way real-time (chat, games, collaboration)\n// Backed by pub/sub (Redis/Kafka) to fan out across servers."
    },
    {
      title: "Example 2: Scaling real-time",
      description: "<p>Stateful connections need a backplane.</p>",
      code: "// Many persistent connections across N servers ->\n//   use a pub/sub backplane so an event on server A reaches\n//   clients connected to server B. Plan connection limits + reconnection."
    },
    {
      title: "Example 3: choosing the real-time transport",
      description: "<p>Match the mechanism to the directionality and infrastructure you can support.</p>",
      code: "// polling:    simplest, works everywhere, laggy + wasteful -> low-frequency updates\n" +
        "// long-poll:  near-real-time without persistent connections\n" +
        "// SSE:        server->client push over HTTP, auto-reconnect -> notifications/feeds\n" +
        "// WebSocket:  full-duplex, low latency -> chat, games, collaborative editing\n" +
        "// + a pub/sub backplane (Redis/Kafka) to fan out events to many connected clients."
    },
    {
      title: "Example 4 (edge case): real-time adds state, scaling, and delivery concerns",
      description: "<p>Live updates mean persistent connections and a fan-out problem that ordinary request/response avoids.</p>",
      code: "// persistent connections are STATEFUL -> need sticky LB or a shared backplane so any\n" +
        "//   server can push to any client; restarts/deploys drop connections (reconnect logic).\n" +
        "// delivery: client offline briefly -> missed events -> need resume (Last-Event-ID)\n" +
        "//   or a catch-up fetch on reconnect.\n" +
        "// don't go real-time if periodic polling is good enough -> it's far simpler to run.\n" +
        "// scale connection count deliberately (each open socket costs memory/fds)."
    }
  ],
  whenToUse: "<p>Build real-time APIs when users need live updates &mdash; messaging, collaborative tools, live " +
    "data/dashboards, notifications, gaming. Pick the simplest technique that fits: SSE for one-way push, " +
    "WebSockets for bidirectional, long polling only as a fallback. <strong>Gotchas:</strong> real-time = " +
    "<strong>stateful, persistent connections</strong>, which are harder to scale and operate than stateless " +
    "HTTP (connection management, sticky routing or a pub/sub backplane, reconnection, heartbeats, " +
    "connection limits). Secure connections (auth on connect, validate messages, wss/https). Don't add " +
    "real-time complexity where periodic polling or normal requests suffice &mdash; reserve it for genuine " +
    "low-latency live needs.</p>"
};

/* ===================== LIFECYCLE & COMPLIANCE ===================== */

C["api-lifecycle-management"] = {
  summary: "<p><strong>API lifecycle management</strong> covers an API from <strong>design</strong> &rarr; " +
    "<strong>development</strong> &rarr; <strong>testing</strong> &rarr; <strong>deployment</strong> &rarr; " +
    "<strong>versioning/evolution</strong> &rarr; <strong>deprecation/retirement</strong>. It includes " +
    "governance (standards, consistency), documentation, monitoring, and managing breaking changes and " +
    "deprecation gracefully so consumers aren't surprised. Treating the API as a long-lived product with a " +
    "lifecycle keeps it healthy and trustworthy.</p>",
  examples: [
    {
      title: "Example 1: The lifecycle stages",
      description: "<p>Design through retirement.</p>",
      code: "// Design (spec-first) -> Develop -> Test -> Deploy -> Monitor\n//   -> Evolve (versioning, additive changes)\n//   -> Deprecate (announce, sunset header, timeline)\n//   -> Retire (remove old version)\n// Governance + docs span all stages."
    },
    {
      title: "Example 2: Graceful deprecation",
      description: "<p>Give consumers time and signals.</p>",
      code: "// Announce deprecation + timeline in docs/changelog.\n// Signal in responses: Deprecation: true; Sunset: <date>\n// Support the old version during the migration window, then retire."
    },
    {
      title: "Example 3: the API lifecycle stages",
      description: "<p>An API moves through phases; managing them keeps consumers from being surprised.</p>",
      code: "// design  -> spec-first, review the contract\n" +
        "// develop -> build + test against the spec\n" +
        "// publish -> version it, document it, onboard consumers\n" +
        "// maintain-> monitor usage, patch, evolve ADDITIVELY (non-breaking)\n" +
        "// deprecate-> announce + Deprecation/Sunset headers + migration guide\n" +
        "// retire  -> remove only after the sunset window + low usage"
    },
    {
      title: "Example 4 (edge case): deprecation needs notice, signals, and data",
      description: "<p>Retiring an API or version abruptly breaks consumers; communicate via headers and usage metrics, not a surprise 410.</p>",
      code: "// signal it in responses well ahead of removal:\n" +
        "Deprecation: true\n" +
        "Sunset: Sat, 31 Jan 2026 23:59:59 GMT\n" +
        "Link: <https://docs/migrate-v2>; rel=\"deprecation\"\n" +
        "// track who still calls the old version (per-key usage) before retiring -> don't\n" +
        "//   break the one big customer still on it. Every live version is maintenance cost,\n" +
        "//   so plan deprecation from day one - but give real notice + a migration path."
    }
  ],
  whenToUse: "<p>Apply lifecycle management to any API that consumers depend on, especially public/partner " +
    "ones. <strong>Gotchas:</strong> the hardest parts are <strong>versioning and deprecation</strong> &mdash; " +
    "breaking changes and abrupt retirements anger consumers and break integrations. Prefer additive, " +
    "backward-compatible evolution; when you must break, version and deprecate on a clear, communicated " +
    "schedule (with <code>Deprecation</code>/<code>Sunset</code> signals). Maintain accurate docs and " +
    "monitoring throughout. Govern for consistency across your API portfolio. Treat the API as a product with " +
    "a contract and real users &mdash; not a one-off deliverable.</p>"
};

C["standards-and-compliance"] = {
  summary: "<p><strong>Standards and compliance</strong> are the legal, regulatory, and industry requirements " +
    "an API must meet when handling certain data or operating in certain domains &mdash; e.g. <strong>GDPR</strong> " +
    "(EU privacy), <strong>CCPA</strong> (California privacy), <strong>PCI DSS</strong> (payment cards), " +
    "<strong>HIPAA</strong> (US health data), plus standards for security and accessibility. Non-compliance " +
    "risks heavy fines, legal liability, and lost trust, so it shapes data handling, security, consent, and " +
    "auditability.</p>",
  examples: [
    {
      title: "Example 1: Compliance shapes design",
      description: "<p>Regulations dictate concrete API behavior.</p>",
      code: "// GDPR/CCPA -> consent, data access/deletion ('right to be forgotten'),\n//   data minimization, breach notification\n// PCI DSS -> never store raw card data; tokenize; encrypt; audit\n// HIPAA -> protect health data (PHI): encryption, access controls, audit logs"
    },
    {
      title: "Example 2: Cross-cutting requirements",
      description: "<p>Common compliance themes for APIs.</p>",
      code: "// - Encrypt sensitive data in transit + at rest\n// - Strong access control + audit logging (who accessed what)\n// - Data retention/deletion policies\n// - Consent + transparency; minimize collected PII"
    },
    {
      title: "Example 3: which regime applies to which data",
      description: "<p>Compliance is data-driven - identify what you handle, then the obligations follow.</p>",
      code: "// EU residents' personal data        -> GDPR\n" +
        "// California residents' personal data -> CCPA/CPRA\n" +
        "// payment card data                  -> PCI DSS\n" +
        "// US health data (PHI)               -> HIPAA\n" +
        "// any PII                            -> baseline data-protection duties\n" +
        "// you can be subject to SEVERAL at once -> map your data flows first."
    },
    {
      title: "Example 4 (edge case): compliance is org-wide, not a code checkbox",
      description: "<p>An API change can't make you 'compliant' - it requires data handling, contracts, processes, and legal review (this is not legal advice).</p>",
      code: "// engineering enables compliance (encryption, access control, deletion/export\n" +
        "//   endpoints, audit logs, data minimization) but doesn't ACHIEVE it alone:\n" +
        "//   also need DPAs/contracts, retention policies, breach processes, DPO/legal review.\n" +
        "// regimes OVERLAP + CONFLICT (e.g. 'delete my data' vs an immutable audit log) ->\n" +
        "//   resolve with legal, not ad hoc.\n" +
        "// this is general info, NOT legal advice - involve your privacy/legal team."
    }
  ],
  whenToUse: "<p>Address standards and compliance whenever your API handles regulated data (personal, health, " +
    "payment) or operates in regulated regions/industries &mdash; which is most real-world APIs handling user " +
    "data. <strong>Gotchas:</strong> compliance isn't a one-time checkbox &mdash; it's ongoing (audits, " +
    "evolving rules) and spans data handling, security, consent, retention, and auditability. Build it in from " +
    "the start (retrofitting is costly). Get legal/compliance expertise &mdash; engineers shouldn't interpret " +
    "regulations alone. Minimize data you collect/store (less to protect and disclose). The sub-topics cover " +
    "GDPR, CCPA, PCI DSS, HIPAA, and PII specifics.</p>"
};

C["gdpr"] = {
  summary: "<p><strong>GDPR (General Data Protection Regulation)</strong> is the EU's comprehensive data-" +
    "privacy law governing how organizations collect, process, and store the <strong>personal data</strong> " +
    "of EU residents. Key principles: lawful basis/consent, data minimization, purpose limitation, and " +
    "individual rights &mdash; access, rectification, deletion ('right to be forgotten'), and portability. It " +
    "applies to any API handling EU residents' data, with large fines for violations.</p>",
  examples: [
    {
      title: "Example 1: Individual rights as API features",
      description: "<p>GDPR rights translate to endpoints/processes.</p>",
      code: "// Support: \n//   - data access/export (right to access + portability)\n//   - deletion ('right to be forgotten') -> remove a user's data\n//   - rectification (correct data)\n//   - consent management (record + honor consent)"
    },
    {
      title: "Example 2: Core obligations",
      description: "<p>Minimize, protect, and be transparent.</p>",
      code: "// - Collect only necessary data (minimization) for a stated purpose\n// - Lawful basis/consent before processing\n// - Encrypt + secure personal data; breach notification (within 72h)\n// - Don't transfer EU data out without safeguards"
    },
    {
      title: "Example 3: GDPR data-subject rights as API features",
      description: "<p>GDPR rights translate into concrete endpoints/processes your API must support.</p>",
      code: "// right to access/portability -> GET /me/export (machine-readable copy)\n" +
        "// right to erasure ('be forgotten') -> DELETE /me (actually delete/anonymize)\n" +
        "// right to rectification -> PATCH /me\n" +
        "// consent + lawful basis -> record it; data minimization -> collect only what you need\n" +
        "// breach notification within 72h -> you need monitoring + an incident process."
    },
    {
      title: "Example 4 (edge case): erasure vs backups/logs/immutable stores",
      description: "<p>'Delete my data' collides with backups, audit logs, and event-sourced/immutable data - resolve deliberately (not legal advice).</p>",
      code: "// deleting from the primary DB but data lingers in backups, analytics, logs, and\n" +
        "//   downstream systems -> erasure must cover ALL copies (or have a documented,\n" +
        "//   time-bound backup-expiry policy).\n" +
        "// immutable/event-sourced data conflicts with deletion -> crypto-shredding (delete\n" +
        "//   the key) or anonymization.\n" +
        "// applies regardless of where YOU are hosted if the user is an EU resident; fines\n" +
        "//   are large. Involve legal - this is general info, not legal advice."
    }
  ],
  whenToUse: "<p>Comply with GDPR if your API processes any EU residents' personal data (regardless of where " +
    "you're based). <strong>Gotchas:</strong> it has broad reach and steep fines (up to 4% of global " +
    "revenue). 'Personal data' is broad (names, emails, IPs, identifiers). You must support deletion/access " +
    "requests, obtain proper consent, minimize data, and secure it &mdash; design these in (e.g. true deletion " +
    "across backups/logs is harder than it sounds). Keep records of processing. Get legal guidance &mdash; " +
    "this is a legal framework, not just an engineering one. Privacy-by-design and data minimization make " +
    "compliance (and security) far easier.</p>"
};

C["ccpa"] = {
  summary: "<p><strong>CCPA (California Consumer Privacy Act)</strong> (and its successor CPRA) is California's " +
    "data-privacy law giving consumers rights over their personal information: to <strong>know</strong> what's " +
    "collected, to <strong>access</strong> and <strong>delete</strong> it, and to <strong>opt out</strong> of " +
    "its sale. It applies to qualifying businesses handling California residents' data. Similar in spirit to " +
    "GDPR but with differences (e.g. opt-out of sale, applicability thresholds).</p>",
  examples: [
    {
      title: "Example 1: CCPA rights",
      description: "<p>Consumer rights your systems must honor.</p>",
      code: "// - Right to KNOW: what personal info is collected + how it's used\n// - Right to ACCESS + DELETE personal info\n// - Right to OPT OUT of the 'sale' of personal info ('Do Not Sell')\n// - Non-discrimination for exercising rights"
    },
    {
      title: "Example 2: CCPA vs GDPR",
      description: "<p>Related but distinct.</p>",
      code: "// Both: access, deletion, transparency, security.\n// CCPA emphasis: opt-OUT of data SALE (vs GDPR's opt-IN consent).\n// Applicability: CCPA has revenue/data-volume thresholds.\n// If you handle CA residents' data and qualify, comply."
    },
    {
      title: "Example 3: CCPA/CPRA consumer rights",
      description: "<p>California's law grants rights similar to (but distinct from) GDPR - notably around 'selling/sharing' data.</p>",
      code: "// right to know   -> what data you collected + why (export)\n" +
        "// right to delete -> remove their data on request\n" +
        "// right to opt-out of 'sale/sharing' -> honor a 'Do Not Sell My Info' signal\n" +
        "//   (incl. the Global Privacy Control header) -> a real flag in your data flows\n" +
        "// right to correct + non-discrimination for exercising rights."
    },
    {
      title: "Example 4 (edge case): CCPA's 'sale/sharing' is broad; differs from GDPR",
      description: "<p>'Sale' covers more than money changing hands (e.g. sharing with ad/analytics partners), and CCPA is opt-OUT vs GDPR's opt-IN (not legal advice).</p>",
      code: "// 'sharing data with an advertising/analytics partner' can count as a 'sale' even\n" +
        "//   with no payment -> you must offer opt-out + honor GPC.\n" +
        "// model differs: CCPA = opt-OUT (allowed until they object); GDPR = opt-IN\n" +
        "//   (need lawful basis/consent first) -> don't assume one implementation covers both.\n" +
        "// thresholds apply (revenue / # of consumers / data-selling) -> check if you're in\n" +
        "//   scope. General info, not legal advice - consult your privacy team."
    }
  ],
  whenToUse: "<p>Comply with CCPA/CPRA if your business meets the thresholds and handles California residents' " +
    "personal information. <strong>Gotchas:</strong> it overlaps with but differs from GDPR (notably the " +
    "opt-out-of-sale model and applicability thresholds) &mdash; you may need to satisfy both. Support access/" +
    "deletion/opt-out requests and clear privacy disclosures. Like GDPR, build privacy in and minimize data. " +
    "The US has a growing patchwork of state privacy laws (Virginia, Colorado, etc.) &mdash; design a general " +
    "privacy-respecting approach rather than per-law hacks. Get legal counsel for applicability and specifics; " +
    "engineering implements the rights and protections it requires.</p>"
};

C["pci-dss"] = {
  summary: "<p><strong>PCI DSS (Payment Card Industry Data Security Standard)</strong> is a security standard " +
    "for any organization that stores, processes, or transmits <strong>payment card data</strong>. It " +
    "mandates strict controls: encrypt cardholder data, restrict access, secure networks, never store " +
    "sensitive authentication data (CVV), maintain audit logs, and regularly test security. APIs handling " +
    "payments must comply &mdash; or, better, avoid touching card data directly.</p>",
  examples: [
    {
      title: "Example 1: Don't store card data - tokenize",
      description: "<p>Offload card handling to a compliant processor.</p>",
      code: "// BEST: never let raw card data touch your servers.\n//   Client -> payment processor (Stripe/Braintree) -> returns a TOKEN\n//   Your API stores/uses the TOKEN, not the card number.\n//   -> drastically reduces your PCI scope."
    },
    {
      title: "Example 2: Core PCI requirements",
      description: "<p>If you do handle card data.</p>",
      code: "// - Encrypt cardholder data in transit + at rest\n// - NEVER store CVV/sensitive auth data after authorization\n// - Strict access control + audit logging\n// - Network segmentation, vulnerability scans, pen testing"
    },
    {
      title: "Example 3: minimize scope - don't touch raw card data",
      description: "<p>The cheapest path to PCI compliance is to never let card numbers hit your servers; use a tokenizing payment provider.</p>",
      code: "// DON'T: card number flows through your API/DB -> you're fully in PCI scope.\n" +
        "// DO: client sends card data DIRECTLY to Stripe/Adyen -> you receive a TOKEN:\n" +
        "//   frontend -> provider.js -> token 'tok_abc'\n" +
        "//   your API -> charge with the token, store only the token + last4\n" +
        "// you never see/store the PAN -> dramatically reduced PCI scope (SAQ-A)."
    },
    {
      title: "Example 4 (edge case): hidden scope creep + what you may never store",
      description: "<p>Card data sneaks into logs, support tickets, and analytics; and some data must never be stored at all (not legal advice).</p>",
      code: "// NEVER store: full magnetic stripe, CVV/CVC, or PIN - period (even encrypted).\n" +
        "// PAN if stored MUST be encrypted/truncated; storing it pulls you into far stricter SAQs.\n" +
        "// scope creep: a card number pasted into a support ticket, a debug log dumping the\n" +
        "//   request body, or an analytics event -> now those systems are in scope too.\n" +
        "//   redact aggressively. Compliance is validated (SAQ/audit), not self-declared -\n" +
        "//   consult a QSA. General info, not legal advice."
    }
  ],
  whenToUse: "<p>PCI DSS applies if your API stores, processes, or transmits payment card data. <strong>Gotchas:</strong> " +
    "the smartest move is to <strong>minimize PCI scope</strong> &mdash; use a payment processor and " +
    "tokenization so raw card data never touches your systems (the processor handles compliance). If you do " +
    "handle card data, the requirements are extensive and audited; <strong>never store CVV</strong>, encrypt " +
    "everything, restrict access, log, and test. Non-compliance risks fines and losing the ability to process " +
    "cards. Don't try to be a payment processor unless you must &mdash; offload it. Get a Qualified Security " +
    "Assessor for formal compliance.</p>"
};

C["hipaa"] = {
  summary: "<p><strong>HIPAA (Health Insurance Portability and Accountability Act)</strong> is the US law " +
    "governing the privacy and security of <strong>protected health information (PHI)</strong>. APIs handling " +
    "health data must enforce strict safeguards: encryption, access controls, audit logging, integrity " +
    "controls, and signed Business Associate Agreements (BAAs) with vendors. Violations carry significant " +
    "penalties.</p>",
  examples: [
    {
      title: "Example 1: HIPAA safeguards for an API",
      description: "<p>Protecting PHI in transit, at rest, and in access.</p>",
      code: "// - Encrypt PHI in transit (TLS) + at rest\n// - Strict access controls (least privilege) + unique user IDs\n// - AUDIT LOGS: who accessed which PHI, when (required)\n// - Integrity controls; automatic logoff; breach notification"
    },
    {
      title: "Example 2: Business Associate Agreements",
      description: "<p>Vendors handling PHI must be covered.</p>",
      code: "// Any third party (cloud, SaaS, analytics) that touches PHI needs a\n//   signed BAA. Use HIPAA-eligible services + configure them compliantly.\n// Minimize PHI collected/retained; restrict who/what can access it."
    },
    {
      title: "Example 3: HIPAA safeguards as engineering controls",
      description: "<p>The Security Rule's safeguards map to concrete API/infra controls around PHI.</p>",
      code: "// access control: least-privilege + per-user auth; unique IDs (no shared accounts)\n" +
        "// audit controls: log who accessed which PHI, when (tamper-evident)\n" +
        "// integrity + transmission security: encrypt PHI in transit (TLS) AND at rest\n" +
        "// minimum necessary: return only the PHI needed for the task\n" +
        "// + a signed BAA with every vendor/cloud that touches PHI."
    },
    {
      title: "Example 4 (edge case): BAAs, logging PHI, and 'de-identified' data",
      description: "<p>Every downstream service touching PHI needs a BAA, logs/analytics easily leak PHI, and de-identification has a strict bar (not legal advice).</p>",
      code: "// any vendor processing PHI (cloud, logging SaaS, email) needs a Business Associate\n" +
        "//   Agreement -> using a non-BAA service for PHI is a violation.\n" +
        "// PHI in logs/error messages/analytics = a breach -> redact; treat logs as PHI stores.\n" +
        "// 'de-identified' (Safe Harbor / Expert Determination) data escapes some rules, but\n" +
        "//   the bar is strict - partial masking is NOT de-identification.\n" +
        "// breaches have mandatory notification + heavy penalties. General info, not legal advice."
    }
  ],
  whenToUse: "<p>Comply with HIPAA if your API creates, receives, stores, or transmits PHI (US healthcare " +
    "context). <strong>Gotchas:</strong> 'PHI' is broad (health data tied to an identifiable person). You need " +
    "technical <em>and</em> administrative safeguards, mandatory audit logging, breach notification, and " +
    "<strong>BAAs</strong> with every vendor touching PHI (a commonly-missed requirement &mdash; not all cloud " +
    "services are HIPAA-eligible or signed). Encrypt everything, enforce least-privilege access, and log " +
    "access. Minimize PHI you handle. Penalties are severe. Get compliance/legal expertise &mdash; HIPAA is " +
    "detailed and audited; engineering implements the safeguards it specifies.</p>"
};

C["pii"] = {
  summary: "<p><strong>PII (Personally Identifiable Information)</strong> is any data that can identify an " +
    "individual &mdash; name, email, phone, address, SSN, IP address, device ids, and combinations of " +
    "attributes. APIs must protect PII through encryption, access control, minimization (collect/store only " +
    "what's needed), masking/anonymization, careful logging (never log PII), and honoring privacy rights. PII " +
    "handling is the common thread across GDPR, CCPA, HIPAA, and good security practice.</p>",
  examples: [
    {
      title: "Example 1: Protecting PII",
      description: "<p>Minimize, encrypt, restrict, mask.</p>",
      code: "// - Collect only necessary PII; delete when no longer needed\n// - Encrypt in transit + at rest\n// - Restrict access (least privilege) + audit it\n// - Mask in responses/logs: email -> s***@x.com, SSN -> ***-**-1234\n// - NEVER log raw PII (passwords, full SSN, etc.)"
    },
    {
      title: "Example 2: PII in API responses",
      description: "<p>Return only what's needed; filter server-side.</p>",
      code: "// Don't dump full records: return only the PII the client truly needs.\n// Apply field-level access (an admin may see more than a normal user).\n// Don't expose PII in URLs (logged everywhere) - use the body over HTTPS."
    },
    {
      title: "Example 3: minimize, protect, and mask PII",
      description: "<p>Collect the least PII you need, encrypt it, and never expose more than required.</p>",
      code: "// data minimization: don't collect/return fields you don't need\n" +
        "// encrypt in transit (TLS) + at rest; restrict who/what can read it (least privilege)\n" +
        "// mask in responses + logs:\n" +
        "//   email: s***@example.com   phone: ***-***-1234   card: **** 1234\n" +
        "// allow-list response fields (DTOs) so PII isn't leaked by default."
    },
    {
      title: "Example 4 (edge case): PII hides in unexpected places + indirect identifiers",
      description: "<p>PII isn't just name/email - IPs, device ids, and combinations can identify someone, and it leaks via logs, URLs, and analytics.</p>",
      code: "// indirect PII: IP address, device/advertising id, precise location, or a COMBO of\n" +
        "//   quasi-identifiers (zip + birthdate + gender) can re-identify a person.\n" +
        "// common leaks: PII in URLs (-> logs, history, Referer), in error messages, in\n" +
        "//   analytics events, in third-party log sinks -> redact at the boundary.\n" +
        "// what counts as PII varies by regulation (GDPR is broad) -> when unsure, treat it\n" +
        "//   as PII and protect it. General info, not legal advice."
    }
  ],
  whenToUse: "<p>Protect PII in any API that handles user data &mdash; effectively all of them. It underpins " +
    "compliance (GDPR/CCPA/HIPAA) and basic trust/security. <strong>Gotchas:</strong> the safest data is data " +
    "you <strong>don't collect or store</strong> (minimization) &mdash; you can't leak what you don't have. " +
    "Never log PII (logs are widely accessible and a breach risk). Don't put PII in URLs (logged everywhere). " +
    "Mask/redact in responses and logs; filter server-side (don't trust clients to hide it). Combinations of " +
    "non-identifying fields can become identifying (be careful with 'anonymized' data). Encrypt, restrict " +
    "access, and honor deletion/access requests. PII protection is both a legal and an ethical obligation.</p>"
};
