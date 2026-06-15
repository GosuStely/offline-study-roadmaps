// Content for the "api-security-best-practices" roadmap.
// One entry per topic id (see data/api-security-best-practices.js).

window.CONTENT_DATA = window.CONTENT_DATA || {};
window.CONTENT_DATA["api-security-best-practices"] = window.CONTENT_DATA["api-security-best-practices"] || {};
var C = window.CONTENT_DATA["api-security-best-practices"];

/* ===================== AUTHENTICATION ===================== */

C["use-standard-authentication"] = {
  summary: "<p>Always rely on <strong>well-established, battle-tested authentication standards and " +
    "libraries</strong> &mdash; OAuth 2.0 / OpenID Connect, JWT, session cookies, WebAuthn &mdash; rather " +
    "than inventing your own login/token scheme. Authentication is extremely easy to get subtly wrong " +
    "(timing attacks, weak hashing, token leakage), and rolling your own almost always introduces " +
    "vulnerabilities that attackers know how to exploit. Standard mechanisms have been reviewed by experts, " +
    "have mature, audited implementations, and handle the edge cases you'd otherwise miss.</p>",
  examples: [
    {
      title: "Example 1: Use a vetted library, not custom crypto",
      description: "<p>Lean on proven password hashing and token libraries.</p>",
      code: "// DON'T hand-roll: MD5(password), homemade token formats, custom signing\n" +
        "// DO use established primitives:\n" +
        "//   - password hashing: bcrypt / argon2 / scrypt (slow, salted)\n" +
        "//   - tokens: a maintained JWT library, or framework session management\n" +
        "//   - auth flows: OAuth2/OIDC via a provider (Auth0, Keycloak, Okta)\n" +
        "const hash = await bcrypt.hash(password, 12); // never store plaintext"
    },
    {
      title: "Example 2: Delegate to a provider when you can",
      description: "<p>Offload auth to an identity provider for SSO + security.</p>",
      code: "// Instead of managing passwords yourself:\n" +
        "//   'Sign in with Google/Microsoft' via OpenID Connect\n" +
        "//   -> the IdP handles credentials, MFA, breach detection\n" +
        "//   -> your API just validates the issued token"
    }
  ],
  whenToUse: "<p>Apply this to <em>every</em> API that authenticates anyone. There is essentially never a good " +
    "reason to build custom authentication. <strong>Gotchas:</strong> 'use a standard' still requires using " +
    "it <em>correctly</em> &mdash; misconfigured OAuth flows, weak JWT settings, or storing tokens insecurely " +
    "reintroduce risk. Keep libraries updated (auth bugs get patched), and prefer delegating to a dedicated " +
    "identity provider when feasible. The cost of getting auth wrong is total account compromise, so this is " +
    "non-negotiable.</p>"
};

C["authentication-mechanisms"] = {
  summary: "<p>Choose the right <strong>authentication mechanism</strong> for your API's clients and threat " +
    "model. Common options: <strong>API keys</strong> (simple, for server-to-server/identifying apps), " +
    "<strong>session cookies</strong> (browser apps, with CSRF protection), <strong>JWT/bearer tokens</strong> " +
    "(stateless APIs, SPAs, mobile), <strong>OAuth2/OIDC</strong> (delegated access, third-party login), and " +
    "<strong>mutual TLS</strong> (high-security service-to-service). Each has different trade-offs in " +
    "statefulness, revocation, and where the credential is stored. Picking the appropriate one &mdash; and " +
    "configuring it securely &mdash; is foundational.</p>",
  examples: [
    {
      title: "Example 1: Matching mechanism to client",
      description: "<p>Different clients call for different schemes.</p>",
      code: "// Browser SPA          -> short-lived JWT + refresh token, or secure cookie\n" +
        "// Mobile app            -> OAuth2 (Authorization Code + PKCE)\n" +
        "// Server-to-server      -> API key or OAuth2 Client Credentials / mTLS\n" +
        "// Third-party 'login with' -> OpenID Connect"
    },
    {
      title: "Example 2: Bearer token in the Authorization header",
      description: "<p>The standard way to present a token to an API.</p>",
      code: "GET /api/orders\n" +
        "Authorization: Bearer eyJhbGciOiJIUzI1NiIs...\n" +
        "// Server validates the token's signature, expiry, issuer, audience\n" +
        "// before processing the request."
    }
  ],
  whenToUse: "<p>Decide the mechanism early, based on who calls your API and from where. <strong>Gotchas:</strong> " +
    "don't mix concerns &mdash; API keys identify an <em>application</em> but aren't strong user authentication; " +
    "cookies need CSRF defenses; bearer tokens need secure storage (XSS can steal them from " +
    "<code>localStorage</code>). For multiple client types you may support several mechanisms. Always pair " +
    "authentication with <strong>authorization</strong> (mechanism proves who you are; access control decides " +
    "what you can do). Enforce everything server-side.</p>"
};

C["max-retry-jail"] = {
  summary: "<p><strong>Max retry & jail</strong> limits how many failed authentication attempts a client can " +
    "make, then temporarily locks them out ('jails' them) &mdash; defending against <strong>brute-force</strong> " +
    "and <strong>credential-stuffing</strong> attacks. Without a cap, attackers can try millions of password " +
    "combinations. After N failed logins (per account and/or per IP), you block further attempts for a " +
    "cooldown period, escalate delays, require CAPTCHA, or alert. It dramatically raises the cost of guessing " +
    "credentials.</p>",
  examples: [
    {
      title: "Example 1: Lockout after repeated failures",
      description: "<p>Count failures and jail the offender after a threshold.</p>",
      code: "// Track failed attempts per account + per IP:\n" +
        "//   5 failures in 15 min -> lock the account for 15 min (or require CAPTCHA)\n" +
        "//   continued abuse from an IP -> block the IP temporarily\n" +
        "// Reset the counter on a successful login."
    },
    {
      title: "Example 2: Exponential backoff on retries",
      description: "<p>Make each successive attempt slower.</p>",
      code: "// attempt 1-3: allowed immediately\n" +
        "// attempt 4: wait 2s ; 5: wait 4s ; 6: wait 8s ...\n" +
        "// Slows automated guessing to a crawl without fully locking real users out."
    }
  ],
  whenToUse: "<p>Apply to all login, password-reset, OTP, and token endpoints. <strong>Gotchas:</strong> a naive " +
    "per-account lockout enables a <em>denial-of-service</em> against legitimate users (an attacker " +
    "deliberately locks victims out) &mdash; combine account-based and IP-based limits, prefer " +
    "throttling/CAPTCHA over hard lockouts, and give users a recovery path. Track attempts in a shared store " +
    "(Redis) so limits apply across all server instances, not per-instance. Return the same generic error for " +
    "locked/wrong-credentials to avoid leaking which accounts exist.</p>"
};

C["sensitive-data-encryption"] = {
  summary: "<p><strong>Encrypt sensitive data</strong> both <em>in transit</em> (TLS/HTTPS for everything) and " +
    "<em>at rest</em> (encrypted databases, disks, backups), and apply special handling to secrets like " +
    "passwords (hashed, never encrypted/reversible), tokens, and personal/financial data. Encryption ensures " +
    "that even if data is intercepted on the wire or a database/backup is stolen, it's unreadable without the " +
    "keys. It's a baseline requirement for protecting user data and for compliance (GDPR, PCI-DSS, HIPAA).</p>",
  examples: [
    {
      title: "Example 1: Hash passwords, encrypt other secrets",
      description: "<p>Passwords are hashed (one-way); other sensitive data is encrypted.</p>",
      code: "// Passwords: HASH (one-way, slow, salted) - never store/encrypt reversibly\n" +
        "passwordHash = await argon2.hash(password);\n" +
        "// Other sensitive fields (e.g. PII, tokens at rest): encrypt with AES-256\n" +
        "//   using keys from a KMS / secrets manager (never hardcoded)."
    },
    {
      title: "Example 2: Encryption in transit + at rest",
      description: "<p>Protect data on the wire and on disk.</p>",
      code: "// In transit: HTTPS/TLS 1.2+ everywhere (APIs, internal service calls)\n" +
        "// At rest:    enabled DB encryption, encrypted volumes, encrypted backups\n" +
        "// Keys:       managed by a KMS (AWS KMS, Vault), rotated, access-controlled"
    }
  ],
  whenToUse: "<p>Always &mdash; encrypt all traffic with TLS and encrypt sensitive data at rest. " +
    "<strong>Gotchas:</strong> never <em>encrypt</em> passwords (which is reversible) &mdash; <em>hash</em> " +
    "them with bcrypt/argon2. Don't hardcode encryption keys in code or config; use a key management service " +
    "with rotation. Encryption at rest doesn't protect against an attacker who has app-level access (the app " +
    "decrypts data), so it complements, not replaces, access control. Minimize what sensitive data you store " +
    "at all (data you don't hold can't be breached).</p>"
};

/* ===================== JWT ===================== */

C["good-jwt-secret"] = {
  summary: "<p>A JWT's security rests entirely on its <strong>signing secret/key</strong>. For symmetric " +
    "algorithms (HS256), use a <strong>long, high-entropy, random secret</strong> (not a dictionary word or " +
    "short string); for asymmetric algorithms (RS256/ES256), protect the private key. A weak or guessable JWT " +
    "secret lets an attacker forge valid tokens and impersonate anyone. The secret must be stored securely " +
    "(secrets manager/env, never in source control) and rotated if compromised.</p>",
  examples: [
    {
      title: "Example 1: Strong vs weak secret",
      description: "<p>HS256 secrets must be long and random.</p>",
      code: "// WEAK (forgeable): 'secret', 'mykey123', anything short/guessable\n" +
        "// STRONG: a 256-bit (32+ byte) cryptographically random value\n" +
        "//   e.g. base64 of crypto.randomBytes(32)\n" +
        "// Stored in a secrets manager / env var, NEVER committed to git."
    },
    {
      title: "Example 2: Asymmetric keys for distributed verification",
      description: "<p>RS256 lets others verify without holding the signing key.</p>",
      code: "// RS256: sign with a PRIVATE key (kept secret on the issuer)\n" +
        "//        verify with the PUBLIC key (safe to distribute)\n" +
        "// Good when many services must verify tokens but only one issues them."
    }
  ],
  whenToUse: "<p>Whenever you issue JWTs. <strong>Gotchas:</strong> a leaked HS256 secret = total compromise " +
    "(anyone can mint admin tokens), so treat it like a crown-jewel credential. Don't reuse the same secret " +
    "across environments. Rotating a symmetric secret invalidates all existing tokens (plan for it, e.g. key " +
    "ids / overlapping keys). For multi-service architectures, asymmetric keys (RS256) are often safer since " +
    "verifiers only need the public key. Combine with short token expiry to limit the blast radius of any " +
    "leak.</p>"
};

C["jwt-algorithm"] = {
  summary: "<p>Always <strong>explicitly specify and validate the JWT signing algorithm</strong>, and reject " +
    "anything unexpected. The classic vulnerabilities are the <code>alg: none</code> attack (a token claiming " +
    "no signature) and <strong>algorithm confusion</strong> (tricking a server that expects RS256 into " +
    "verifying an HS256 token using the public key as the HMAC secret). Pin your verifier to the exact " +
    "algorithm(s) you trust and never let the token's own header dictate how it's verified.</p>",
  examples: [
    {
      title: "Example 1: Reject 'alg: none' and pin the algorithm",
      description: "<p>Verify with an explicit allowlist, not the token's header.</p>",
      code: "// VULNERABLE: verify(token, key)  // trusts header.alg blindly\n" +
        "//   attacker sends { alg: 'none' } -> 'valid' unsigned token!\n" +
        "// SAFE: pin the algorithm(s) you accept:\n" +
        "verify(token, key, { algorithms: ['RS256'] }); // reject everything else"
    },
    {
      title: "Example 2: Avoid algorithm confusion",
      description: "<p>Don't let a public key be used as an HMAC secret.</p>",
      code: "// If you expect RS256 (asymmetric), NEVER also accept HS256 with the\n" +
        "// same key material - an attacker could sign an HS256 token using your\n" +
        "// PUBLIC key as the secret and have it verified. Lock to one alg family."
    }
  ],
  whenToUse: "<p>On every JWT verification. <strong>Gotchas:</strong> many JWT libraries historically defaulted " +
    "to trusting the token header's <code>alg</code> &mdash; always pass an explicit algorithms allowlist. " +
    "Prefer strong algorithms (RS256/ES256 or HS256 with a strong secret); avoid <code>none</code> entirely. " +
    "Keep your JWT library up to date, as these attacks have driven multiple CVEs. The token header is " +
    "attacker-controlled &mdash; never trust it to decide security behavior.</p>"
};

C["token-expiry"] = {
  summary: "<p>Give JWTs (and tokens generally) a <strong>short expiration time</strong> (<code>exp</code> " +
    "claim) so a stolen token is only useful for a brief window. Because JWTs are typically stateless and " +
    "hard to revoke before they expire, short lifetimes are the primary defense against token theft. Pair " +
    "short-lived <strong>access tokens</strong> (minutes) with longer-lived <strong>refresh tokens</strong> " +
    "(stored more securely, revocable) so users don't have to log in constantly while keeping exposure low.</p>",
  examples: [
    {
      title: "Example 1: Short access + refresh token pattern",
      description: "<p>Access tokens expire fast; refresh tokens renew them.</p>",
      code: "// Access token:  exp ~ 5-15 minutes (used on every request)\n" +
        "// Refresh token: exp ~ days/weeks, stored securely, REVOCABLE\n" +
        "// When the access token expires -> use the refresh token to get a new one\n" +
        "// Stolen access token = useful only for minutes."
    },
    {
      title: "Example 2: Always check exp on verification",
      description: "<p>Reject expired tokens server-side.</p>",
      code: "// The verifier must enforce expiry:\n" +
        "//   { exp: 1718000000 } -> reject if now > exp\n" +
        "// (Reputable libraries check exp automatically - don't disable it.)"
    }
  ],
  whenToUse: "<p>Always set sensible expiry. <strong>Gotchas:</strong> the core JWT weakness is that you " +
    "<em>can't easily revoke</em> a valid token before <code>exp</code> &mdash; so keep access tokens short " +
    "and maintain a way to revoke refresh tokens (a denylist/rotation). For instant revocation needs (logout, " +
    "compromised account), you need server-side state (a token denylist or short windows). Rotate refresh " +
    "tokens on use and detect reuse (a replayed old refresh token signals theft). Balance UX (not " +
    "re-authenticating constantly) against exposure.</p>"
};

C["jwt-payload"] = {
  summary: "<p>Be careful what you put in the <strong>JWT payload (claims)</strong>. JWTs are " +
    "<strong>signed but not encrypted</strong> &mdash; anyone can base64-decode and read the payload &mdash; " +
    "so <em>never store secrets or sensitive data</em> in it (passwords, full PII, card numbers). Include " +
    "only the minimal identity/authorization claims needed (user id, roles, issuer, audience, expiry). Treat " +
    "the payload as public information that the signature merely makes tamper-evident.</p>",
  examples: [
    {
      title: "Example 1: Payload is readable by anyone",
      description: "<p>Signing prevents tampering, not reading.</p>",
      code: "// header.PAYLOAD.signature  -> the middle part is just base64\n" +
        "// Decoded payload (visible to anyone with the token):\n" +
        "//   { \"sub\": \"user-7\", \"roles\": [\"user\"], \"iss\": \"api\",\n" +
        "//     \"aud\": \"web\", \"exp\": 1718000000 }\n" +
        "// NO passwords, SSNs, secrets - they'd be exposed."
    },
    {
      title: "Example 2: Keep it minimal",
      description: "<p>Only identity + authz claims; look up the rest server-side.</p>",
      code: "// Good: just enough to identify + authorize\n" +
        "//   sub (user id), roles/scopes, iss, aud, exp, iat\n" +
        "// Need the user's email/profile? Fetch it from the DB by sub,\n" +
        "//   don't embed sensitive details in the token."
    }
  ],
  whenToUse: "<p>Every time you design token claims. <strong>Gotchas:</strong> the #1 mistake is assuming JWT " +
    "payloads are private &mdash; they are <em>not</em> encrypted. Don't trust client-supplied claims beyond " +
    "what you signed. Validate standard claims (<code>iss</code>, <code>aud</code>, <code>exp</code>, " +
    "<code>nbf</code>) on every request. If you genuinely need confidential data in a token, use JWE " +
    "(encrypted JWT) &mdash; but usually it's better to keep tokens lean and look sensitive data up " +
    "server-side.</p>"
};

C["payload-size"] = {
  summary: "<p>Keep the <strong>JWT payload small</strong>. Because the token is sent on <em>every</em> " +
    "request (usually in an HTTP header), a bloated payload (lots of claims, large role lists, embedded data) " +
    "wastes bandwidth, can hit header size limits, and slows every request. Include only essential claims and " +
    "reference larger data by id rather than embedding it. Smaller tokens mean faster, leaner requests.</p>",
  examples: [
    {
      title: "Example 1: Lean vs bloated token",
      description: "<p>Minimal claims keep per-request overhead low.</p>",
      code: "// Bloated: full profile, all permissions inline, nested objects\n" +
        "//   -> large header on EVERY request; may exceed server header limits\n" +
        "// Lean: { sub, roles, exp } -> look up details server-side by sub"
    },
    {
      title: "Example 2: Reference, don't embed",
      description: "<p>Point to data instead of carrying it.</p>",
      code: "// Instead of embedding 200 fine-grained permissions in the token,\n" +
        "//   embed a role/scope and resolve permissions server-side,\n" +
        "//   or cache them keyed by user id."
    }
  ],
  whenToUse: "<p>When designing claims, especially for users with many roles/permissions. <strong>Gotchas:</strong> " +
    "servers and proxies cap header sizes (often ~8KB) &mdash; an oversized token causes mysterious " +
    "<code>431</code>/<code>400</code> errors. Large tokens also amplify bandwidth on high-traffic APIs. " +
    "Balance against making too many server-side lookups; cache resolved data. The goal is the smallest token " +
    "that carries the identity and coarse authorization you need.</p>"
};

/* ===================== ACCESS CONTROL ===================== */

C["throttle-requests"] = {
  summary: "<p><strong>Throttle/rate-limit requests</strong> to protect your API from abuse, brute-force, " +
    "scraping, and denial-of-service, and to ensure fair use across clients. Limit how many requests a " +
    "client (by API key, user, or IP) can make per time window; when exceeded, return <code>429 Too Many " +
    "Requests</code> with a <code>Retry-After</code> header. Rate limiting is a frontline control that caps " +
    "the damage any single client can do and keeps the service available for everyone.</p>",
  examples: [
    {
      title: "Example 1: Per-client rate limit with 429",
      description: "<p>Cap usage; reject excess clearly.</p>",
      code: "// Limit: 100 requests / minute per API key\n" +
        "//   within limit -> serve\n" +
        "//   over limit   -> 429 Too Many Requests, Retry-After: 30\n" +
        "// Tiered: free=60/min, paid=1000/min"
    },
    {
      title: "Example 2: Distributed, token-bucket limiting",
      description: "<p>Shared counters + burst allowance across instances.</p>",
      code: "// Token bucket in Redis (shared across all API servers):\n" +
        "//   capacity 100, refill 10/sec -> allows bursts, bounds sustained rate\n" +
        "// Must be SHARED, or each instance enforces N separate limits."
    }
  ],
  whenToUse: "<p>On all public and authenticated endpoints, especially auth, search, and write-heavy ones. " +
    "<strong>Gotchas:</strong> enforce limits in a <em>shared</em> store so they apply across instances. " +
    "Rate-limit by a stable identity (API key/user) where possible, since IP-based limits affect users behind " +
    "shared NATs and are evaded by attackers rotating IPs. Always send <code>429</code> + <code>Retry-After</code> " +
    "so good clients back off (and don't cause retry storms). Pair with per-endpoint limits (login should be " +
    "stricter than read-only GETs).</p>"
};

C["use-https"] = {
  summary: "<p><strong>Use HTTPS (TLS) for all API traffic</strong>, with no plaintext HTTP. TLS encrypts " +
    "data in transit, preventing eavesdropping and man-in-the-middle tampering, and authenticates the server " +
    "to the client. Every endpoint &mdash; including redirects, internal service calls, and 'low-risk' GETs &mdash; " +
    "must be HTTPS, because <em>any</em> plaintext request can leak tokens, cookies, or data. Redirect HTTP " +
    "to HTTPS and, ideally, refuse plaintext entirely.</p>",
  examples: [
    {
      title: "Example 1: Enforce HTTPS everywhere",
      description: "<p>Redirect HTTP to HTTPS and use modern TLS.</p>",
      code: "// All traffic over TLS 1.2+ (disable old SSL/TLS, weak ciphers)\n" +
        "// HTTP (port 80) -> 301 redirect to HTTPS (port 443)\n" +
        "// Even better for APIs: simply reject non-HTTPS requests."
    },
    {
      title: "Example 2: Why even one HTTP request is dangerous",
      description: "<p>A single plaintext call can leak the token.</p>",
      code: "// If a client accidentally calls http://api/... once with its\n" +
        "//   Authorization header, the token is sent in CLEARTEXT and can be\n" +
        "//   sniffed -> account compromise. HTTPS-only prevents this."
    }
  ],
  whenToUse: "<p>Always &mdash; this is non-negotiable for any API handling auth or data. <strong>Gotchas:</strong> " +
    "use modern TLS (1.2+), disable legacy protocols/ciphers, and keep certificates valid and auto-renewed " +
    "(expired certs cause outages). Terminating TLS at a load balancer is fine, but secure the hop to backends " +
    "too for sensitive internal traffic. Combine with <strong>HSTS</strong> to force browsers to use HTTPS. " +
    "Free, automated certs (Let's Encrypt) remove any excuse for plaintext.</p>"
};

C["hsts-header"] = {
  summary: "<p>The <strong>HSTS (HTTP Strict Transport Security)</strong> response header tells browsers to " +
    "<em>only</em> connect to your domain over HTTPS for a specified duration, even if a user types " +
    "<code>http://</code> or clicks an HTTP link. This prevents <strong>SSL-stripping</strong> attacks " +
    "(downgrading a connection to plaintext) and protects the very first navigation after the header is " +
    "cached. It's a one-line header that closes a real man-in-the-middle gap.</p>",
  examples: [
    {
      title: "Example 1: The HSTS header",
      description: "<p>Force HTTPS for the domain and subdomains.</p>",
      code: "Strict-Transport-Security: max-age=31536000; includeSubDomains; preload\n" +
        "// max-age: how long (seconds) browsers enforce HTTPS-only (1 year here)\n" +
        "// includeSubDomains: apply to all subdomains\n" +
        "// preload: eligible for browsers' built-in HSTS preload list"
    },
    {
      title: "Example 2: What it prevents",
      description: "<p>Stops downgrade/SSL-stripping attacks.</p>",
      code: "// Without HSTS: attacker on the network rewrites https->http,\n" +
        "//   intercepting the plaintext connection.\n" +
        "// With HSTS: the browser REFUSES http for your domain -> attack fails."
    }
  ],
  whenToUse: "<p>Set HSTS on all HTTPS sites/APIs served to browsers. <strong>Gotchas:</strong> only enable it " +
    "once you're confident <em>all</em> traffic (and subdomains, if you use <code>includeSubDomains</code>) " +
    "works over HTTPS &mdash; otherwise you can lock users out of HTTP-only subdomains. <code>preload</code> " +
    "is hard to undo (it's baked into browsers), so add it deliberately. HSTS mainly helps browser clients; " +
    "non-browser API clients should still be configured HTTPS-only. It complements, not replaces, " +
    "redirecting/refusing HTTP.</p>"
};

C["directory-listings"] = {
  summary: "<p><strong>Disable directory listings</strong> (and any auto-generated index of files) so attackers " +
    "can't browse your server's file structure to discover source code, config files, backups, or other " +
    "sensitive resources. When a web server is misconfigured, requesting a directory with no index file may " +
    "return a listing of all its contents &mdash; an information-disclosure goldmine. Turn this off and serve " +
    "a 403/404 instead.</p>",
  examples: [
    {
      title: "Example 1: Turn off auto-indexing",
      description: "<p>Don't expose folder contents.</p>",
      code: "// Nginx:  autoindex off;        (default off - keep it off)\n" +
        "// Apache: Options -Indexes\n" +
        "// Requesting /uploads/ should NOT list every file in it."
    },
    {
      title: "Example 2: What it would otherwise leak",
      description: "<p>Listings reveal files attackers shouldn't see.</p>",
      code: "// A directory listing might expose:\n" +
        "//   .env, config.bak, db_dump.sql, .git/, internal scripts\n" +
        "// -> credentials, source code, data. Disable listings + block dotfiles."
    }
  ],
  whenToUse: "<p>On any web/API server that serves files or static content. <strong>Gotchas:</strong> beyond " +
    "directory listings, explicitly block access to sensitive paths (<code>.git</code>, <code>.env</code>, " +
    "backups, dotfiles) and don't store secrets in web-served directories at all. Don't rely on 'security " +
    "through obscurity' (hidden filenames) &mdash; remove sensitive files from web roots entirely. This is a " +
    "quick, high-value hardening step that prevents easy reconnaissance.</p>"
};

C["restrict-private-apis"] = {
  summary: "<p><strong>Restrict access to private/internal APIs</strong> so they're not reachable from the " +
    "public internet. Internal admin endpoints, debug routes, health/metrics, and service-to-service APIs " +
    "should be exposed only to allowed networks/clients &mdash; via network segmentation (VPC/private " +
    "subnets), IP allowlisting, mutual TLS, a VPN, or an internal-only gateway &mdash; not simply 'hidden' " +
    "behind an unguessable URL. Reducing the attack surface to only what must be public is core defense in " +
    "depth.</p>",
  examples: [
    {
      title: "Example 1: Keep internal endpoints off the public net",
      description: "<p>Network-level restriction, not obscurity.</p>",
      code: "// Admin/internal APIs:\n" +
        "//   - bind to a private network / internal load balancer only\n" +
        "//   - require mTLS or an internal auth scheme\n" +
        "//   - IP-allowlist trusted ranges (office/VPN/known services)\n" +
        "// Public API surface = only the endpoints that truly need to be public."
    },
    {
      title: "Example 2: Don't expose debug/management routes",
      description: "<p>Lock down actuator/metrics/admin paths.</p>",
      code: "// Expose /metrics, /actuator, /admin, /debug only internally\n" +
        "//   (separate port/network + auth). Publicly exposed management\n" +
        "//   endpoints are a classic breach vector."
    }
  ],
  whenToUse: "<p>For any API with internal/admin functionality. <strong>Gotchas:</strong> 'private' must mean " +
    "<em>network/auth-enforced</em>, not just an obscure path &mdash; attackers scan and find hidden " +
    "endpoints. Watch for management/monitoring tools that bind to all interfaces by default. In " +
    "microservices, enforce service-to-service authentication (mTLS) so internal APIs aren't trivially " +
    "callable by anything inside the network. Least exposure limits the blast radius of any single " +
    "compromise.</p>"
};

/* ===================== OAUTH ===================== */

C["oauth-redirect-ui"] = {
  summary: "<p>In OAuth flows, <strong>strictly validate the <code>redirect_uri</code></strong> against a " +
    "pre-registered allowlist of exact URIs. The redirect URI is where the authorization server sends the " +
    "user (with the auth code/token) after login. If it's not validated, an attacker can register their own " +
    "redirect and <strong>steal authorization codes/tokens</strong> by tricking the server into redirecting " +
    "to an attacker-controlled URL &mdash; a serious account-takeover vector.</p>",
  examples: [
    {
      title: "Example 1: Exact-match redirect allowlist",
      description: "<p>Only registered, exact redirect URIs are accepted.</p>",
      code: "// Registered: https://app.example.com/callback\n" +
        "// Request with redirect_uri=https://app.example.com/callback -> OK\n" +
        "// Request with redirect_uri=https://evil.com/callback        -> REJECT\n" +
        "// Use EXACT matching - not prefix/substring (which can be bypassed)."
    },
    {
      title: "Example 2: Why loose matching is dangerous",
      description: "<p>Open redirects leak the code to attackers.</p>",
      code: "// Loose match allowing https://app.example.com.evil.com\n" +
        "//   or //evil.com -> the auth code is delivered to the attacker\n" +
        "//   -> they exchange it for tokens. Always exact-match."
    }
  ],
  whenToUse: "<p>In every OAuth2/OIDC integration. <strong>Gotchas:</strong> use <em>exact</em> URI matching, " +
    "not prefix/wildcard/substring (all bypassable). Avoid open-redirect endpoints anywhere on your domain " +
    "(they can be chained to defeat redirect validation). Combine with the <code>state</code> parameter and " +
    "PKCE. Lean on a reputable OAuth provider/library that enforces strict redirect validation rather than " +
    "implementing the flow by hand.</p>"
};

C["response-type-token"] = {
  summary: "<p>Avoid the OAuth <strong>implicit flow</strong> (<code>response_type=token</code>), which returns " +
    "the access token directly in the URL fragment. It's deprecated because tokens in URLs leak (browser " +
    "history, logs, referrer headers) and there's no client authentication. Use the <strong>Authorization " +
    "Code flow with PKCE</strong> instead, where the client receives a short-lived code and exchanges it for " +
    "tokens over a back channel &mdash; far safer for SPAs and mobile apps.</p>",
  examples: [
    {
      title: "Example 1: Prefer Authorization Code + PKCE",
      description: "<p>Code flow keeps tokens out of the URL.</p>",
      code: "// DEPRECATED implicit: response_type=token\n" +
        "//   -> #access_token=... in the URL (leaks via history/logs/referrer)\n" +
        "// PREFERRED: response_type=code  + PKCE\n" +
        "//   -> short-lived code in URL -> exchanged for tokens server/back-channel"
    },
    {
      title: "Example 2: PKCE protects public clients",
      description: "<p>A code verifier prevents code interception abuse.</p>",
      code: "// Client generates code_verifier -> sends code_challenge (hash)\n" +
        "// On token exchange, presents the verifier -> server checks it matches\n" +
        "// -> a stolen auth code is useless without the verifier."
    }
  ],
  whenToUse: "<p>For all new OAuth integrations, especially SPAs and mobile apps. <strong>Gotchas:</strong> the " +
    "implicit flow is officially discouraged by the OAuth 2.0 Security Best Current Practice &mdash; migrate " +
    "off it. Always use PKCE for public clients (no client secret). Tokens should arrive via back-channel " +
    "exchange, never in a redirect URL. If you're using a modern OAuth library/provider, it defaults to " +
    "Authorization Code + PKCE for you.</p>"
};

C["oauth-state"] = {
  summary: "<p>Always use the OAuth <strong><code>state</code> parameter</strong> to protect against " +
    "<strong>CSRF</strong> in the authorization flow. The client generates a random, unguessable " +
    "<code>state</code> value, sends it with the authorization request, and verifies the returned " +
    "<code>state</code> matches on callback. This ensures the response corresponds to a request <em>your</em> " +
    "client initiated, preventing an attacker from injecting their own authorization response into a victim's " +
    "session.</p>",
  examples: [
    {
      title: "Example 1: Generate and verify state",
      description: "<p>Round-trip a random value to bind request and response.</p>",
      code: "// 1. Client creates random state, stores it (session) and sends it:\n" +
        "//    /authorize?...&state=Xy9...random\n" +
        "// 2. On callback: /callback?code=...&state=Xy9...random\n" +
        "//    -> verify returned state == stored state, else REJECT\n" +
        "// Prevents CSRF / response injection in the OAuth flow."
    },
    {
      title: "Example 2: State can also carry return context",
      description: "<p>Bind to the user's session safely.</p>",
      code: "// state should be random + tied to the user's session.\n" +
        "// Don't put sensitive data in it (it's visible); use it as a\n" +
        "//   one-time anti-CSRF nonce (optionally a lookup key to your own data)."
    }
  ],
  whenToUse: "<p>In every OAuth2/OIDC authorization request. <strong>Gotchas:</strong> <code>state</code> must " +
    "be cryptographically random and verified server-side; skipping verification defeats the purpose. It's " +
    "distinct from PKCE (which protects the code itself) &mdash; use both. Don't reuse <code>state</code> " +
    "values. Good OAuth libraries handle <code>state</code> automatically; if you roll the flow yourself, " +
    "don't omit it.</p>"
};

C["oauth-validate-scope"] = {
  summary: "<p><strong>Validate OAuth scopes</strong> on the resource server: when a request arrives with an " +
    "access token, verify the token actually grants the <strong>scope/permission</strong> required for that " +
    "operation, and that it wasn't granted broader scopes than intended. Scopes define what an access token " +
    "is allowed to do; enforcing them per-endpoint implements least privilege and prevents a token issued for " +
    "one purpose from being used for another.</p>",
  examples: [
    {
      title: "Example 1: Enforce required scope per endpoint",
      description: "<p>Check the token's scopes before allowing the action.</p>",
      code: "// DELETE /orders/42 requires scope 'orders:write'\n" +
        "//   token scopes = ['orders:read']  -> 403 Forbidden (insufficient scope)\n" +
        "//   token scopes = ['orders:write'] -> allowed\n" +
        "// Validate on the RESOURCE SERVER, every request."
    },
    {
      title: "Example 2: Grant minimal scopes",
      description: "<p>Request and issue only the scopes actually needed.</p>",
      code: "// A read-only widget should request scope 'orders:read' only -\n" +
        "//   not 'orders:write' or a broad 'admin'. Least privilege limits damage\n" +
        "//   if the token leaks. Verify the granted scope matches the need."
    }
  ],
  whenToUse: "<p>On every protected endpoint that consumes OAuth access tokens. <strong>Gotchas:</strong> don't " +
    "just check that a token is <em>valid</em> &mdash; check it has the <em>right scope</em> for the specific " +
    "operation (a common gap). Validate the token's <code>aud</code> (audience) too, so a token for another " +
    "API isn't accepted. Keep scopes granular and request the minimum. Scope enforcement is authorization; " +
    "pair it with object-level checks (does this user own <em>this</em> resource?).</p>"
};

/* ===================== INPUT ===================== */

C["proper-http-methods"] = {
  summary: "<p>Use <strong>HTTP methods correctly and restrict which are allowed</strong> per endpoint. " +
    "GET should be safe and read-only; POST/PUT/PATCH/DELETE for changes; and methods you don't support " +
    "(TRACE, unexpected verbs) should be disabled. Correct method semantics enable caching, idempotency, and " +
    "predictable behavior, while restricting methods reduces attack surface (e.g. blocking TRACE prevents " +
    "Cross-Site Tracing, rejecting unexpected verbs prevents method-based bypasses).</p>",
  examples: [
    {
      title: "Example 1: Method semantics + allowlist",
      description: "<p>Map verbs to intent; reject the rest.</p>",
      code: "// GET    /orders/42  -> read (safe, idempotent, cacheable)\n" +
        "// POST   /orders     -> create\n" +
        "// DELETE /orders/42  -> delete (idempotent)\n" +
        "// Unsupported method on a route -> 405 Method Not Allowed\n" +
        "// Disable TRACE (Cross-Site Tracing risk)."
    },
    {
      title: "Example 2: Don't mutate on GET",
      description: "<p>Read methods must not change state.</p>",
      code: "// BAD: GET /orders/42/delete  (mutating via GET)\n" +
        "//   -> can be triggered by prefetch/crawlers/CSRF, and is cached.\n" +
        "// GOOD: DELETE /orders/42"
    }
  ],
  whenToUse: "<p>When designing every endpoint. <strong>Gotchas:</strong> never perform state changes on GET " +
    "(crawlers, prefetchers, and CSRF can trigger them, and caches may serve them). Return <code>405</code> " +
    "for unsupported methods and configure your server/proxy to reject dangerous verbs. Method handling also " +
    "interacts with CORS preflight (OPTIONS) &mdash; handle it deliberately. Correct, restricted methods make " +
    "the API both safer and more standards-compliant.</p>"
};

C["validate-content-type"] = {
  summary: "<p><strong>Validate the request <code>Content-Type</code></strong> and only accept the formats " +
    "your endpoint expects (e.g. <code>application/json</code>). Reject mismatched or unexpected content " +
    "types with <code>415 Unsupported Media Type</code>. This prevents parser-confusion attacks, ensures the " +
    "body is parsed by the intended parser, and blocks tricks that smuggle one format past validation by " +
    "mislabeling it (e.g. XML where JSON is expected, enabling XXE).</p>",
  examples: [
    {
      title: "Example 1: Accept only expected types",
      description: "<p>Enforce the content type before parsing.</p>",
      code: "// JSON API endpoint:\n" +
        "//   Content-Type: application/json -> parse as JSON\n" +
        "//   Content-Type: text/xml or missing -> 415 Unsupported Media Type\n" +
        "// Don't let the server 'guess' the format."
    },
    {
      title: "Example 2: Prevents format-confusion attacks",
      description: "<p>Stops XXE / parser abuse via mislabeled bodies.</p>",
      code: "// If you only accept JSON, an attacker can't sneak in an XML payload\n" +
        "//   to trigger XML External Entity (XXE) parsing. Strict Content-Type\n" +
        "//   + a strict parser closes that door."
    }
  ],
  whenToUse: "<p>On all endpoints that accept request bodies. <strong>Gotchas:</strong> also validate/limit the " +
    "<code>Accept</code> header for responses and force a correct response <code>Content-Type</code>. Don't " +
    "rely on content sniffing. Be strict: an endpoint that 'helpfully' parses multiple formats expands attack " +
    "surface. Combine with input validation and disabling dangerous parser features (XML entity expansion).</p>"
};

C["validate-user-input"] = {
  summary: "<p><strong>Validate and sanitize all user input</strong> &mdash; treat every input (body, query " +
    "params, headers, path, uploaded files) as untrusted. Enforce expected types, formats, lengths, and " +
    "ranges, preferably with an <em>allowlist</em> (accept known-good) rather than a denylist (block " +
    "known-bad). Proper input validation is the foundation that prevents injection (SQL, NoSQL, command, " +
    "XSS), buffer/size abuse, and logic errors. It's one of the highest-impact security practices.</p>",
  examples: [
    {
      title: "Example 1: Schema-based allowlist validation",
      description: "<p>Define exactly what's acceptable and reject the rest.</p>",
      code: "// Validate against a strict schema (e.g. Zod/Joi/JSON Schema):\n" +
        "//   email: valid email format\n" +
        "//   age: integer 0-150\n" +
        "//   role: one of ['user','admin']  (enum allowlist)\n" +
        "// Reject (400) anything that doesn't match - don't try to 'fix' it."
    },
    {
      title: "Example 2: Validation is not the only defense",
      description: "<p>Combine with parameterized queries / encoding.</p>",
      code: "// Even with validation, use PARAMETERIZED queries (not string concat)\n" +
        "//   db.query('SELECT * FROM users WHERE id = ?', [id]);  // safe\n" +
        "// and ENCODE output for the context (HTML/JS) to stop XSS.\n" +
        "// Defense in depth: validate input AND escape on use."
    }
  ],
  whenToUse: "<p>On every input, everywhere &mdash; the single most important habit for API security. " +
    "<strong>Gotchas:</strong> validate on the <em>server</em> (client-side validation is for UX only and is " +
    "trivially bypassed). Prefer allowlists; denylists miss novel attacks. Validation alone doesn't stop " +
    "injection &mdash; also use parameterized queries and context-aware output encoding. Validate at trust " +
    "boundaries and re-validate data from other services. Beware deeply nested/oversized payloads (limit " +
    "size and depth).</p>"
};

C["authorization-header"] = {
  summary: "<p>Handle the <strong><code>Authorization</code> header</strong> correctly and securely: expect " +
    "credentials there (e.g. <code>Bearer &lt;token&gt;</code>), validate them on every request, and never " +
    "accept credentials in places that leak (query strings, URLs). Tokens/keys in the <code>Authorization</code> " +
    "header (over HTTPS) stay out of logs, browser history, and referrer headers, unlike URL parameters. " +
    "Validate the token fully (signature, expiry, scope) before processing.</p>",
  examples: [
    {
      title: "Example 1: Credentials in the header, not the URL",
      description: "<p>Keep tokens out of URLs to prevent leakage.</p>",
      code: "// GOOD: Authorization: Bearer eyJhbGci...\n" +
        "// BAD:  GET /api/data?token=eyJhbGci...\n" +
        "//   -> URL tokens leak via logs, history, referrer, proxies."
    },
    {
      title: "Example 2: Validate before doing anything",
      description: "<p>Authenticate first, then authorize, then act.</p>",
      code: "// 1. Extract token from Authorization header\n" +
        "// 2. Validate signature + exp + iss + aud (+ scope)\n" +
        "// 3. Resolve the user, check authorization for THIS resource\n" +
        "// 4. Only then process the request. Reject early with 401/403."
    }
  ],
  whenToUse: "<p>On all authenticated endpoints. <strong>Gotchas:</strong> never put tokens/API keys in URLs " +
    "or query params (they leak everywhere). Always require HTTPS so the header isn't sniffable. Don't log the " +
    "<code>Authorization</code> header. Reject missing/malformed headers with <code>401</code>. Distinguish " +
    "<code>401</code> (not authenticated) from <code>403</code> (authenticated but not allowed). Validate the " +
    "token's claims, not just its presence.</p>"
};

C["only-server-side-encryption"] = {
  summary: "<p>Perform <strong>encryption (and key handling) on the server side</strong>, not in the client, " +
    "for data your backend protects. Client-side code (browser JS, mobile apps) can be inspected and " +
    "tampered with, so any keys or crypto logic there are exposed. Sensitive operations &mdash; encrypting " +
    "stored data, signing, key management &mdash; belong on the server where keys stay secret (in a KMS/" +
    "secrets manager). Clients should send data over TLS and let the trusted server handle encryption at rest.</p>",
  examples: [
    {
      title: "Example 1: Keys live on the server",
      description: "<p>Never ship encryption keys to the client.</p>",
      code: "// Client -> sends data over HTTPS (TLS protects it in transit)\n" +
        "// Server -> encrypts at rest using keys from a KMS/secrets manager\n" +
        "// Client-side encryption with a baked-in key = key is extractable\n" +
        "//   from the JS bundle / app binary -> not real protection."
    },
    {
      title: "Example 2: TLS in transit + server crypto at rest",
      description: "<p>Two layers, both server-controlled.</p>",
      code: "// In transit: TLS (handled by the platform)\n" +
        "// At rest: AES-256 with KMS-managed keys, on the server\n" +
        "// The server is the single trusted place keys exist."
    }
  ],
  whenToUse: "<p>Whenever your backend is responsible for protecting data. <strong>Gotchas:</strong> client-side " +
    "encryption is only meaningful in specific end-to-end-encryption designs where the <em>server is " +
    "untrusted</em> and the client manages keys (e.g. password managers) &mdash; that's a different threat " +
    "model. For normal APIs, don't expose keys to clients; rely on TLS in transit and server-side encryption " +
    "at rest with managed keys. Never hardcode keys anywhere shipped to users.</p>"
};

C["api-gateway"] = {
  summary: "<p>Use an <strong>API gateway</strong> as a single, hardened entry point that centralizes " +
    "cross-cutting security controls in front of your services: <strong>TLS termination, authentication, " +
    "authorization, rate limiting/throttling, input validation, request filtering (WAF), logging, and " +
    "routing</strong>. Centralizing these means consistent enforcement, a smaller exposed surface (backends " +
    "aren't directly reachable), and one place to apply policy &mdash; rather than re-implementing security " +
    "in every service.</p>",
  examples: [
    {
      title: "Example 1: Security at the edge",
      description: "<p>The gateway enforces policy before traffic hits services.</p>",
      code: "// Client -> [ API Gateway ] -> backend services\n" +
        "//   gateway does: TLS, authn, authz, rate limit, WAF/filtering,\n" +
        "//                 request validation, logging, routing\n" +
        "// Backends receive only clean, authenticated, rate-limited traffic."
    },
    {
      title: "Example 2: Consistent policy, smaller surface",
      description: "<p>One enforcement point for many services.</p>",
      code: "// Without a gateway: every service re-implements auth/rate-limit\n" +
        "//   (inconsistent, error-prone).\n" +
        "// With a gateway: policy enforced once, uniformly; internal services\n" +
        "//   stay private behind it."
    }
  ],
  whenToUse: "<p>For most multi-service/microservice APIs and any public API needing centralized control. " +
    "<strong>Gotchas:</strong> the gateway is a critical single point &mdash; make it highly available and " +
    "well-secured (it terminates TLS and holds policy). Don't put business logic in it (keep it to " +
    "cross-cutting concerns) or it becomes a bottleneck/god component. It doesn't replace service-level " +
    "authorization (defense in depth &mdash; services should still verify object-level access). A managed " +
    "gateway (cloud or Kong/Apigee/etc.) gives you these controls without building them.</p>"
};

/* ===================== PROCESSING ===================== */

C["endpoint-authentication"] = {
  summary: "<p>Ensure <strong>every endpoint that should be protected actually authenticates the caller</strong> " +
    "&mdash; no accidentally-public routes. A frequent breach cause is an endpoint that was assumed protected " +
    "but isn't (a forgotten admin route, a new endpoint missing the auth middleware, a debug path). Apply " +
    "authentication by default (deny-by-default) and explicitly allowlist the few truly public endpoints, " +
    "rather than remembering to add auth to each new route.</p>",
  examples: [
    {
      title: "Example 1: Secure by default, opt-in public",
      description: "<p>Require auth globally; allowlist public routes.</p>",
      code: "// Apply auth middleware GLOBALLY:\n" +
        "//   app.use(requireAuth);            // everything needs auth...\n" +
        "//   publicRouter for /login, /health // ...except explicit exceptions\n" +
        "// New endpoints are protected automatically (no forgotten routes)."
    },
    {
      title: "Example 2: Don't rely on per-route memory",
      description: "<p>Opt-out is fragile; opt-in is safe.</p>",
      code: "// FRAGILE: add @Authenticated to each route (forget one -> exposed)\n" +
        "// ROBUST: deny by default; a route is public only if explicitly marked."
    }
  ],
  whenToUse: "<p>Across the whole API. <strong>Gotchas:</strong> audit your route list to confirm none are " +
    "unintentionally open (broken authentication tops the OWASP API Top 10). Watch for new endpoints, " +
    "versioned APIs, and internal/debug routes slipping out unprotected. Authentication just proves identity " +
    "&mdash; also enforce <em>authorization</em> per endpoint and per object. Deny-by-default is the safest " +
    "posture.</p>"
};

C["avoid-personal-id-urls"] = {
  summary: "<p><strong>Avoid putting personal or sensitive identifiers in URLs</strong> (e.g. " +
    "<code>/users/123/ssn</code>, emails, or sequential ids that reveal/enumerate users). URLs are logged " +
    "everywhere (server logs, proxies, browser history, referrer headers, analytics), so identifiers in them " +
    "leak. Sequential/guessable ids also enable <strong>enumeration</strong> and <strong>IDOR/BOLA</strong> " +
    "attacks (changing the id to access someone else's data). Prefer opaque, non-sequential identifiers and " +
    "keep sensitive data out of the path/query.</p>",
  examples: [
    {
      title: "Example 1: Don't expose sensitive ids in the path",
      description: "<p>Sequential ids enable enumeration; sensitive data leaks.</p>",
      code: "// BAD: GET /users/1001/orders  -> attacker tries 1002, 1003, ...\n" +
        "//      GET /reset?email=a@x.com  -> email in logs/history\n" +
        "// BETTER: opaque ids + authorization checks; sensitive values in the\n" +
        "//         body over HTTPS, not the URL."
    },
    {
      title: "Example 2: Use UUIDs and authorize",
      description: "<p>Opaque ids + ownership checks defeat IDOR.</p>",
      code: "// GET /orders/8f14e45f-...  (non-guessable)\n" +
        "// AND verify the authenticated user owns/permits THIS order\n" +
        "//   (don't rely on the id being unguessable alone)."
    }
  ],
  whenToUse: "<p>When designing URLs and identifiers. <strong>Gotchas:</strong> opaque/UUID ids reduce " +
    "enumeration but are <em>not</em> a substitute for authorization &mdash; always verify the caller may " +
    "access the specific object (IDOR/BOLA is the #1 API risk). Keep PII out of URLs entirely (use the body). " +
    "Be mindful of logs and third-party analytics capturing full URLs. See <em>Prefer UUID</em>.</p>"
};

C["prefer-uuid"] = {
  summary: "<p><strong>Prefer UUIDs (or other non-sequential, unguessable identifiers)</strong> over " +
    "auto-incrementing integer ids for resources exposed in APIs. Sequential ids leak information (how many " +
    "users/orders you have, creation order) and make <strong>enumeration</strong> trivial (iterate " +
    "1,2,3...). UUIDs are random and non-guessable, so attackers can't simply walk the id space. This reduces " +
    "(but doesn't eliminate) the risk of IDOR/BOLA and information disclosure.</p>",
  examples: [
    {
      title: "Example 1: UUID vs sequential id",
      description: "<p>Non-sequential ids resist enumeration.</p>",
      code: "// Sequential: /orders/1042 -> /orders/1043 -> ... easy to enumerate\n" +
        "// UUID:       /orders/9b2e...c41 -> effectively unguessable\n" +
        "// Also hides business metrics (count/order of records)."
    },
    {
      title: "Example 2: Still enforce authorization",
      description: "<p>Unguessable does not mean authorized.</p>",
      code: "// UUIDs make GUESSING hard, but a leaked/shared UUID is still usable.\n" +
        "// ALWAYS check: does the authenticated user have access to THIS resource?\n" +
        "// UUIDs are a hardening layer, not an access-control mechanism."
    }
  ],
  whenToUse: "<p>For externally-exposed resource identifiers, especially user-scoped data. <strong>Gotchas:</strong> " +
    "UUIDs don't replace authorization &mdash; an attacker who obtains a UUID (shared link, leak) can still " +
    "use it unless you check ownership. UUIDs are larger and (v4) random, which can affect database index " +
    "performance (consider UUIDv7/ULID for sortable, index-friendly ids). Internally you may still use " +
    "integers; expose UUIDs externally. The real fix for IDOR is server-side authorization on every object " +
    "access.</p>"
};

C["disable-entity-parsing-xml"] = {
  summary: "<p><strong>Disable XML external entity (XXE) parsing</strong> in any XML parser you use. By " +
    "default, many XML parsers resolve <em>external entities</em> &mdash; references to external files or " +
    "URLs &mdash; which attackers exploit to read local files (<code>/etc/passwd</code>), perform SSRF " +
    "(make the server fetch internal URLs), or cause denial of service. Configure parsers to disallow DTDs " +
    "and external entity resolution entirely.</p>",
  examples: [
    {
      title: "Example 1: The XXE attack",
      description: "<p>A crafted entity reads server files or hits internal URLs.</p>",
      code: "<!-- Malicious XML if external entities are enabled: -->\n" +
        "<!DOCTYPE foo [ <!ENTITY x SYSTEM \"file:///etc/passwd\"> ]>\n" +
        "<data>&x;</data>\n" +
        "// Parser resolves &x; -> leaks the file contents in the response."
    },
    {
      title: "Example 2: Harden the parser",
      description: "<p>Disable DTDs and external entities.</p>",
      code: "// Configure the parser to:\n" +
        "//   - disallow DOCTYPE/DTD declarations\n" +
        "//   - disable external general + parameter entities\n" +
        "// (Exact flags vary by library; many have a 'secure processing' mode.)"
    }
  ],
  whenToUse: "<p>Anywhere you parse XML (SOAP, SVG, config, document uploads, XML APIs). <strong>Gotchas:</strong> " +
    "XXE is on the OWASP Top 10 and easy to miss because parser defaults are often unsafe. Prefer JSON over " +
    "XML where you can. If you must accept XML, disable DTDs/external entities and validate content type so " +
    "XML can't be smuggled into a JSON endpoint. Also see <em>Disable Entity Expansion</em> for the related " +
    "DoS vector.</p>"
};

C["disable-entity-expansion"] = {
  summary: "<p><strong>Disable (or strictly limit) XML entity expansion</strong> to prevent the " +
    "<strong>'billion laughs' / exponential entity expansion</strong> denial-of-service attack. A small XML " +
    "document can define nested entities that expand to gigabytes in memory, crashing the parser/server with " +
    "minimal attacker effort. Configure parsers to forbid or cap entity expansion (and DTD processing) so a " +
    "tiny malicious payload can't exhaust resources.</p>",
  examples: [
    {
      title: "Example 1: Billion laughs attack",
      description: "<p>Nested entities explode in size.</p>",
      code: "<!-- Each entity references the previous one 10x -> exponential blowup -->\n" +
        "<!DOCTYPE lolz [\n" +
        "  <!ENTITY a \"dododo\">\n" +
        "  <!ENTITY b \"&a;&a;&a;&a;&a;&a;&a;&a;&a;&a;\">\n" +
        "  <!ENTITY c \"&b;&b;&b;&b;&b;&b;&b;&b;&b;&b;\"> ]>\n" +
        "// A few KB expands to gigabytes in memory -> DoS."
    },
    {
      title: "Example 2: Cap or disable expansion",
      description: "<p>Forbid DTDs / limit expansion depth and size.</p>",
      code: "// Safest: disable DTD processing entirely.\n" +
        "// Else: cap entity expansion count/depth and total expanded size."
    }
  ],
  whenToUse: "<p>On all XML parsing. <strong>Gotchas:</strong> like XXE, this stems from unsafe parser " +
    "defaults &mdash; disabling DTD processing usually closes both. Also enforce overall request size limits " +
    "and timeouts so any pathological payload (XML, JSON, or otherwise) can't exhaust resources. Prefer JSON " +
    "and a parser with secure defaults where possible.</p>"
};

C["cdn-for-file-uploads"] = {
  summary: "<p>Offload <strong>file uploads/downloads to dedicated object storage + CDN</strong> rather than " +
    "streaming them through your API servers. Using pre-signed URLs (Valet Key pattern), clients upload " +
    "directly to storage (S3/blob) and download via CDN, which improves scalability and performance and " +
    "<em>reduces the security surface of your app servers</em> (large/malicious files don't hit your core " +
    "API). It also lets you apply storage-level access controls, scanning, and isolation to user content.</p>",
  examples: [
    {
      title: "Example 1: Direct-to-storage via pre-signed URL",
      description: "<p>The big file bypasses your app servers.</p>",
      code: "// 1. Client asks API for an upload URL\n" +
        "// 2. API returns a scoped, expiring pre-signed URL (e.g. S3 PUT)\n" +
        "// 3. Client uploads DIRECTLY to storage; CDN serves downloads\n" +
        "// Your app servers never handle the raw bytes."
    },
    {
      title: "Example 2: Isolate and scan user content",
      description: "<p>Serve uploads from a separate origin/domain.</p>",
      code: "// Serve user files from a SEPARATE domain (e.g. usercontent.example.com)\n" +
        "//   -> limits XSS/cookie exposure on your main domain.\n" +
        "// Scan uploads for malware; set correct Content-Type; never execute them."
    }
  ],
  whenToUse: "<p>For any API handling user file uploads/downloads at scale. <strong>Gotchas:</strong> still " +
    "validate uploads &mdash; restrict file types/sizes, scan for malware, and never trust the client-" +
    "provided filename or content type. Serve user content from a separate domain and with " +
    "<code>Content-Disposition: attachment</code>/<code>X-Content-Type-Options: nosniff</code> so uploaded " +
    "HTML/SVG can't run as script in your origin. Keep pre-signed URLs tightly scoped and short-lived. " +
    "Storage buckets must not be publicly writable/over-permissive.</p>"
};

C["avoid-http-blocking"] = {
  summary: "<p><strong>Avoid blocking operations on your request-handling threads</strong> &mdash; long " +
    "synchronous I/O (slow DB queries, external API calls, file/network operations) ties up threads and lets " +
    "a few slow or malicious requests exhaust your capacity, a denial-of-service risk. Use non-blocking/" +
    "async I/O, offload long work to background queues, and apply timeouts so no single request can hold " +
    "resources indefinitely. Keeping the request path fast and bounded preserves availability under load.</p>",
  examples: [
    {
      title: "Example 1: Offload slow work",
      description: "<p>Don't block the request on long operations.</p>",
      code: "// BAD: request thread waits 30s for video processing -> thread starved\n" +
        "// GOOD: enqueue the job -> respond 202 immediately -> worker processes it\n" +
        "// Keeps request threads free; protects availability."
    },
    {
      title: "Example 2: Timeouts everywhere",
      description: "<p>Bound every external call so it can't hang.</p>",
      code: "// Set timeouts on DB queries, HTTP calls, locks.\n" +
        "//   downstream hangs -> your request fails fast (not forever)\n" +
        "// Pair with circuit breakers so a failing dependency can't pile up."
    }
  ],
  whenToUse: "<p>In any API under real load or with slow dependencies. <strong>Gotchas:</strong> this is both a " +
    "performance and a <em>security/availability</em> concern &mdash; attackers deliberately send slow/heavy " +
    "requests (Slowloris, expensive queries) to exhaust threads. Combine async I/O, background jobs, " +
    "timeouts, circuit breakers, rate limiting, and request size limits. Async helps I/O-bound work; offload " +
    "CPU-bound work to separate workers. The goal: no single request can monopolize server resources.</p>"
};

C["debug-mode-off"] = {
  summary: "<p><strong>Disable debug mode and verbose error output in production.</strong> Debug modes expose " +
    "stack traces, internal paths, configuration, framework versions, SQL queries, and other details that " +
    "help attackers map and exploit your system. Production should return generic error messages to clients " +
    "(while logging full details server-side) and run with debug/development features turned off. Leaving " +
    "debug on is a common, high-impact misconfiguration.</p>",
  examples: [
    {
      title: "Example 1: Generic errors to clients",
      description: "<p>Hide internals; log details server-side.</p>",
      code: "// Debug ON (leaks): full stack trace, file paths, SQL, env vars in the\n" +
        "//   HTTP response -> reconnaissance gift to attackers.\n" +
        "// Production: client sees { error: 'Internal Server Error' } (500);\n" +
        "//   full details go to your server logs only."
    },
    {
      title: "Example 2: Turn off dev features",
      description: "<p>No debug endpoints, profilers, or auto-reload in prod.</p>",
      code: "// Ensure: DEBUG=false / NODE_ENV=production / app.debug=False\n" +
        "// Disable debug toolbars, /debug routes, detailed error pages,\n" +
        "//   directory listings, and verbose framework banners."
    }
  ],
  whenToUse: "<p>Always, in every production deployment. <strong>Gotchas:</strong> this is a leading cause of " +
    "information-disclosure breaches (and several frameworks ship debug-on by default in dev configs that " +
    "accidentally reach prod). Verify the setting per environment, remove debug/admin/profiler endpoints, and " +
    "centralize error handling so no raw exception ever reaches the client. Also suppress version/fingerprint " +
    "headers (see <em>Remove Fingerprint Header</em>).</p>"
};

C["non-executable-stacks"] = {
  summary: "<p>Use <strong>non-executable stacks/memory</strong> and related OS/compiler memory-protection " +
    "defenses (NX/DEP, ASLR, stack canaries) to mitigate memory-corruption exploits (buffer overflows) in " +
    "native code. Marking the stack/heap non-executable prevents attackers from running injected shellcode " +
    "there. These are largely platform-level protections (enabled by modern OSes/compilers) that matter most " +
    "for services written in memory-unsafe languages (C/C++) or running native dependencies.</p>",
  examples: [
    {
      title: "Example 1: Memory-protection defenses",
      description: "<p>Layered mitigations against memory-corruption exploits.</p>",
      code: "// NX/DEP: mark stack/heap non-executable -> injected shellcode won't run\n" +
        "// ASLR: randomize memory layout -> harder to predict addresses\n" +
        "// Stack canaries: detect stack-buffer overflows before return\n" +
        "// Compile with these enabled (often default in modern toolchains)."
    },
    {
      title: "Example 2: Memory-safe languages reduce the risk",
      description: "<p>The root cause is unsafe memory handling.</p>",
      code: "// Memory-safe runtimes (Go, Rust, Java, JS) avoid most of these bugs.\n" +
        "// Still keep the OS + native dependencies patched and protections on."
    }
  ],
  whenToUse: "<p>Most relevant for native/low-level services and any system running C/C++ components. " +
    "<strong>Gotchas:</strong> these are mitigations, not fixes &mdash; the real defense against memory " +
    "corruption is safe coding and memory-safe languages. Keep your OS, compilers, and native libraries " +
    "updated so protections are present and current. For typical web APIs in managed runtimes this is mostly " +
    "handled by the platform, but it still matters for your dependencies and base images. Layer it with the " +
    "other input-validation and hardening practices.</p>"
};

/* ===================== OUTPUT ===================== */

C["no-sniff-header"] = {
  summary: "<p>Send <strong><code>X-Content-Type-Options: nosniff</code></strong> to stop browsers from " +
    "<strong>MIME-sniffing</strong> &mdash; guessing a response's content type instead of trusting the " +
    "declared <code>Content-Type</code>. Sniffing can cause a browser to treat a response as HTML/JavaScript " +
    "when it shouldn't, enabling XSS via uploaded files or API responses. <code>nosniff</code> forces the " +
    "browser to honor your declared type, closing that class of attack.</p>",
  examples: [
    {
      title: "Example 1: The nosniff header",
      description: "<p>One header disables content-type guessing.</p>",
      code: "X-Content-Type-Options: nosniff\n" +
        "// Browser uses the declared Content-Type verbatim;\n" +
        "//   it won't 'helpfully' interpret a .txt or JSON response as HTML/JS."
    },
    {
      title: "Example 2: Protects file/JSON responses",
      description: "<p>Prevents a non-HTML response from executing as script.</p>",
      code: "// A user-uploaded file served as text/plain, or a JSON API response,\n" +
        "//   won't be sniffed into executable HTML/JS -> blocks an XSS path.\n" +
        "// Pair with correct Content-Type + CSP."
    }
  ],
  whenToUse: "<p>On all responses, especially APIs and anything serving user-supplied content. " +
    "<strong>Gotchas:</strong> it only works if you <em>also</em> set correct <code>Content-Type</code> " +
    "headers. It's one of several defensive headers (with CSP, X-Frame-Options) &mdash; set them together. " +
    "Cheap to add, no downside. Many security header middlewares (e.g. Helmet) include it by default.</p>"
};

C["x-frame-options-deny"] = {
  summary: "<p>Send <strong><code>X-Frame-Options: DENY</code></strong> (or <code>SAMEORIGIN</code>) to " +
    "prevent your pages from being embedded in an <code>&lt;iframe&gt;</code> on other sites, defeating " +
    "<strong>clickjacking</strong> attacks (where a victim is tricked into clicking hidden, framed UI). For " +
    "modern browsers, the CSP <code>frame-ancestors</code> directive supersedes it. APIs returning JSON don't " +
    "need framing protection, but any HTML your service serves does.</p>",
  examples: [
    {
      title: "Example 1: Block framing",
      description: "<p>Prevent your UI from being embedded elsewhere.</p>",
      code: "X-Frame-Options: DENY        // no site may frame this page\n" +
        "// or SAMEORIGIN to allow only your own domain to frame it.\n" +
        "// Modern equivalent (CSP): Content-Security-Policy: frame-ancestors 'none'"
    },
    {
      title: "Example 2: Clickjacking scenario it stops",
      description: "<p>Hidden framed buttons can't trick users.</p>",
      code: "// Attacker frames your 'Delete account' page invisibly over a game.\n" +
        "// Victim 'clicks the game' but actually clicks your button.\n" +
        "// Framing protection blocks the page from loading in their frame."
    }
  ],
  whenToUse: "<p>On any HTML pages your service serves (dashboards, auth pages, admin UIs). <strong>Gotchas:</strong> " +
    "prefer CSP <code>frame-ancestors</code> (more flexible, the modern standard) and set " +
    "<code>X-Frame-Options</code> for older-browser coverage. Pure JSON APIs don't render in frames, so it's " +
    "less relevant there, but harmless. Choose <code>SAMEORIGIN</code> if you legitimately frame your own " +
    "pages; otherwise <code>DENY</code>. Part of the standard security-header set.</p>"
};

C["csp-header"] = {
  summary: "<p>The <strong>Content-Security-Policy (CSP)</strong> header restricts which sources of content " +
    "(scripts, styles, images, frames, connections) a browser may load and execute for your page &mdash; a " +
    "powerful defense against <strong>XSS</strong> and data injection. By allowlisting trusted origins and " +
    "disallowing inline scripts, even if an attacker injects markup, the browser refuses to execute " +
    "unauthorized code. CSP is one of the strongest browser-side mitigations, though it requires care to " +
    "configure without breaking your app.</p>",
  examples: [
    {
      title: "Example 1: A restrictive policy",
      description: "<p>Allowlist sources; block inline/eval.</p>",
      code: "Content-Security-Policy:\n" +
        "  default-src 'self';\n" +
        "  script-src 'self' https://cdn.trusted.com;\n" +
        "  object-src 'none';\n" +
        "  frame-ancestors 'none';\n" +
        "// Injected <script> from an untrusted origin won't execute."
    },
    {
      title: "Example 2: Avoid 'unsafe-inline'",
      description: "<p>Inline scripts undermine CSP's XSS protection.</p>",
      code: "// 'unsafe-inline' allows inline <script> -> largely defeats CSP vs XSS.\n" +
        "// Prefer external scripts + nonces/hashes for any inline you truly need:\n" +
        "//   script-src 'self' 'nonce-RANDOM'"
    }
  ],
  whenToUse: "<p>On all HTML responses (web apps, dashboards, auth/admin UIs). <strong>Gotchas:</strong> CSP is " +
    "tricky to roll out &mdash; start in <code>Content-Security-Policy-Report-Only</code> mode to find " +
    "violations without breaking the site, then enforce. Avoid <code>unsafe-inline</code>/<code>unsafe-eval</code> " +
    "(they gut the protection); use nonces/hashes instead. CSP is for browser-rendered content, not pure JSON " +
    "APIs. It's defense in depth &mdash; combine with input validation and output encoding, not a replacement " +
    "for them.</p>"
};

C["remove-fingerprint-header"] = {
  summary: "<p><strong>Remove or obscure fingerprinting headers</strong> that reveal your server software, " +
    "framework, and versions &mdash; <code>Server</code>, <code>X-Powered-By</code>, " +
    "<code>X-AspNet-Version</code>, etc. This information helps attackers target known vulnerabilities for " +
    "your specific stack/version. Stripping these headers is cheap 'security through reduced disclosure' " +
    "(not a real defense on its own, but it removes easy reconnaissance and signals a hardened posture).</p>",
  examples: [
    {
      title: "Example 1: Strip version-disclosing headers",
      description: "<p>Don't advertise your stack.</p>",
      code: "// Remove headers like:\n" +
        "//   Server: nginx/1.18.0\n" +
        "//   X-Powered-By: Express\n" +
        "//   X-AspNet-Version: 4.0.30319\n" +
        "// -> attackers can't trivially look up CVEs for your exact version."
    },
    {
      title: "Example 2: Configure the server/framework",
      description: "<p>Disable the banners at the source.</p>",
      code: "// Express: app.disable('x-powered-by')\n" +
        "// Nginx:   server_tokens off;\n" +
        "// Or strip them at the API gateway/reverse proxy for everything."
    }
  ],
  whenToUse: "<p>On all responses. <strong>Gotchas:</strong> this is obscurity, not security &mdash; it doesn't " +
    "patch anything, so still keep software updated. But it removes low-effort reconnaissance and is trivial " +
    "to do (often at the gateway/proxy for all services at once). Don't rely on it; pair with real patching " +
    "and the other hardening headers.</p>"
};

C["force-content-type"] = {
  summary: "<p><strong>Force a correct, explicit <code>Content-Type</code> on responses</strong> (e.g. " +
    "<code>application/json</code> for JSON APIs) so clients and browsers interpret data as intended and " +
    "don't sniff it into something dangerous. Combined with <code>X-Content-Type-Options: nosniff</code>, an " +
    "accurate <code>Content-Type</code> prevents responses (especially user-controlled data) from being " +
    "treated as executable HTML/JavaScript, closing an XSS vector and ensuring correct parsing.</p>",
  examples: [
    {
      title: "Example 1: Always set the response type",
      description: "<p>Be explicit; don't let the client guess.</p>",
      code: "// JSON API:\n" +
        "Content-Type: application/json; charset=utf-8\n" +
        "X-Content-Type-Options: nosniff\n" +
        "// The response is parsed/handled exactly as JSON, never sniffed to HTML."
    },
    {
      title: "Example 2: User content needs a safe type",
      description: "<p>Serving uploads with the wrong type enables XSS.</p>",
      code: "// Serving a user-uploaded .html or .svg as text/html lets it run\n" +
        "//   scripts in your origin. Force a safe Content-Type (or\n" +
        "//   Content-Disposition: attachment) + nosniff + separate domain."
    }
  ],
  whenToUse: "<p>On every response, particularly APIs and anything returning user-influenced data. " +
    "<strong>Gotchas:</strong> a correct <code>Content-Type</code> only fully protects when paired with " +
    "<code>nosniff</code>. Match the type to the actual content and set the charset. For downloadable/user " +
    "files, also use <code>Content-Disposition: attachment</code> so they're downloaded, not rendered. " +
    "Consistent, explicit content typing prevents a whole category of parsing/XSS bugs.</p>"
};

C["avoid-sensitive-data"] = {
  summary: "<p><strong>Don't return sensitive data in API responses</strong> beyond what the client strictly " +
    "needs. Avoid leaking password hashes, tokens, internal ids, full PII, other users' data, or system " +
    "internals. A common bug is serializing entire database objects (including secret fields) straight to " +
    "JSON. Use explicit response DTOs/serializers that include only the intended fields, and apply " +
    "field-level authorization so users see only data they're permitted to.</p>",
  examples: [
    {
      title: "Example 1: Don't serialize the whole entity",
      description: "<p>Whitelist response fields with a DTO.</p>",
      code: "// BAD: res.json(user)  // includes passwordHash, internalNotes, etc.\n" +
        "// GOOD: res.json({ id: user.id, name: user.name }) // explicit fields only\n" +
        "// Use a response DTO/serializer - never dump the raw model."
    },
    {
      title: "Example 2: Excessive data exposure",
      description: "<p>Returning extra fields 'the UI hides' is still a leak.</p>",
      code: "// If the API returns SSN/email/roles that the UI doesn't show,\n" +
        "//   attackers still read them from the raw response.\n" +
        "// Filter on the SERVER; never rely on the client to hide data."
    }
  ],
  whenToUse: "<p>On every response. <strong>Gotchas:</strong> 'Excessive Data Exposure' is an OWASP API Top 10 " +
    "issue &mdash; never trust the client to hide fields; filter server-side. Beware auto-serialization that " +
    "includes everything by default. Apply field-level permissions (an admin may see more than a regular " +
    "user). Also avoid leaking data via error messages and verbose responses. Return the minimum necessary.</p>"
};

C["proper-response-code"] = {
  summary: "<p>Return <strong>correct, consistent HTTP status codes</strong> that accurately reflect what " +
    "happened &mdash; <code>200/201/204</code> for success, <code>400</code> bad input, <code>401</code> " +
    "unauthenticated, <code>403</code> forbidden, <code>404</code> not found, <code>409</code> conflict, " +
    "<code>422</code> validation, <code>429</code> rate-limited, <code>500/503</code> server errors. Proper " +
    "codes make APIs predictable and let clients handle outcomes correctly &mdash; but craft them carefully " +
    "to avoid <em>leaking information</em> (e.g. distinguishing 'user exists' from 'wrong password').</p>",
  examples: [
    {
      title: "Example 1: Meaningful status codes",
      description: "<p>Map outcomes to the right code.</p>",
      code: "// 201 Created      -> resource created\n" +
        "// 400 Bad Request   -> malformed input\n" +
        "// 401 Unauthorized  -> not authenticated\n" +
        "// 403 Forbidden     -> authenticated but not allowed\n" +
        "// 404 Not Found     -> resource (or hidden-existence) not found\n" +
        "// 429 Too Many Requests -> rate limited (+ Retry-After)"
    },
    {
      title: "Example 2: Don't leak via status/messages",
      description: "<p>Avoid revealing whether accounts/resources exist.</p>",
      code: "// Login: return the SAME generic error for 'no such user' and\n" +
        "//   'wrong password' -> don't let attackers enumerate accounts.\n" +
        "// Sometimes return 404 instead of 403 to hide a resource's existence."
    }
  ],
  whenToUse: "<p>On every endpoint. <strong>Gotchas:</strong> correctness aids clients, but be mindful that " +
    "status codes and error messages can leak information &mdash; for auth, use uniform responses to prevent " +
    "user enumeration, and consider returning <code>404</code> rather than <code>403</code> to hide whether a " +
    "resource exists. Keep error bodies generic (no stack traces/internal detail). Be consistent across the " +
    "API so clients can rely on the semantics.</p>"
};

/* ===================== CI & CD ===================== */

C["unit-integration-tests"] = {
  summary: "<p>Maintain strong <strong>unit and integration tests</strong>, including security-focused tests, " +
    "as part of your pipeline. Automated tests catch regressions &mdash; including security regressions like a " +
    "broken auth check, a newly-exposed endpoint, or a validation gap &mdash; before they ship. Test " +
    "authentication, authorization (especially access-control on objects), input validation, and error " +
    "handling explicitly. Tests that run on every commit make security a continuous, enforced property rather " +
    "than a one-time review.</p>",
  examples: [
    {
      title: "Example 1: Test access control explicitly",
      description: "<p>Assert that users can't reach others' data.</p>",
      code: "test('user cannot access another user order', async () => {\n" +
        "  const res = await api.get('/orders/OTHER_USERS_ID', userToken);\n" +
        "  expect(res.status).toBe(403); // IDOR/BOLA regression guard\n" +
        "});"
    },
    {
      title: "Example 2: Test validation + auth boundaries",
      description: "<p>Cover the negative/abuse cases, not just happy paths.</p>",
      code: "// - rejects malformed/oversized input (400/422)\n" +
        "// - requires auth on protected routes (401)\n" +
        "// - enforces rate limits (429)\n" +
        "// Run on every commit in CI."
    }
  ],
  whenToUse: "<p>Continuously, on every change. <strong>Gotchas:</strong> teams often test happy paths but not " +
    "<em>security</em> paths &mdash; explicitly test authz (the #1 API risk), input validation, and error " +
    "handling. Fast, independent tests run on every commit are most valuable; integration tests verify the " +
    "pieces work together (auth + routing + data). Tests complement, but don't replace, security analysis and " +
    "code review. Make a failing security test block the deploy.</p>"
};

C["code-review-process"] = {
  summary: "<p>Enforce a <strong>code review process</strong> where changes are reviewed by another engineer " +
    "before merging, with security as an explicit review concern. Human review catches logic flaws, missing " +
    "auth checks, injection risks, secret leaks, and unsafe patterns that automated tools miss. A consistent, " +
    "required review step (with security awareness, checklists, and required approvals) is one of the most " +
    "effective and cheapest ways to prevent vulnerabilities from reaching production.</p>",
  examples: [
    {
      title: "Example 1: Required review with security lens",
      description: "<p>Block merges without an approving review.</p>",
      code: "// Branch protection: require >=1 approval + passing CI to merge.\n" +
        "// Reviewers check for:\n" +
        "//   missing authz checks, injection (string-built queries), secrets in\n" +
        "//   code, unsafe deserialization, leaked data in responses, bad crypto."
    },
    {
      title: "Example 2: Security checklist for reviewers",
      description: "<p>Prompt reviewers to look for the common issues.</p>",
      code: "// PR checklist:\n" +
        "//   [ ] inputs validated server-side\n" +
        "//   [ ] authz enforced (object-level too)\n" +
        "//   [ ] no secrets committed\n" +
        "//   [ ] parameterized queries\n" +
        "//   [ ] no sensitive data in logs/responses"
    }
  ],
  whenToUse: "<p>For all code changes, always. <strong>Gotchas:</strong> reviews are only effective if reviewers " +
    "know what to look for &mdash; provide security checklists and training, and pull in security expertise " +
    "for sensitive changes (auth, crypto, payments). Avoid rubber-stamping; small, focused PRs get better " +
    "review. Combine human review with automated SAST/dependency scanning (each catches different things). " +
    "Required approvals + branch protection make it non-bypassable.</p>"
};

C["run-security-analysis"] = {
  summary: "<p>Run <strong>automated security analysis</strong> in your pipeline: <strong>SAST</strong> " +
    "(static analysis of your code for vulnerabilities), <strong>DAST</strong> (dynamic testing against the " +
    "running app), <strong>secret scanning</strong> (catch committed credentials), and " +
    "<strong>dependency/SCA</strong> scanning. Automated tools continuously check every change for known " +
    "vulnerability patterns, insecure configurations, and leaked secrets &mdash; catching issues at scale and " +
    "speed that manual review can't, and shifting security 'left' into development.</p>",
  examples: [
    {
      title: "Example 1: Security gates in CI",
      description: "<p>Scan on every build; fail on serious findings.</p>",
      code: "// CI pipeline steps:\n" +
        "//   - SAST (CodeQL/Semgrep): flag injection, unsafe patterns\n" +
        "//   - secret scanning (gitleaks): block committed keys/tokens\n" +
        "//   - SCA (Dependabot/Snyk): flag vulnerable dependencies\n" +
        "//   - DAST (OWASP ZAP): probe the running app\n" +
        "// High-severity finding -> fail the build."
    },
    {
      title: "Example 2: Shift left",
      description: "<p>Catch issues before they ship, automatically.</p>",
      code: "// Run scans on PRs so problems surface during review,\n" +
        "//   not in production. Track and triage findings; tune to cut noise."
    }
  ],
  whenToUse: "<p>In every CI/CD pipeline. <strong>Gotchas:</strong> automated tools produce false positives " +
    "(tune them or developers ignore the results) and false negatives (they don't catch everything, " +
    "especially business-logic flaws &mdash; pair with human review and pentesting). Treat high-severity " +
    "findings as build-blocking. Secret scanning should run pre-commit too (a leaked secret in git history is " +
    "hard to fully remove &mdash; rotate it). Layer SAST + DAST + SCA; each finds different classes of " +
    "issues.</p>"
};

C["check-dependencies"] = {
  summary: "<p><strong>Continuously check your dependencies for known vulnerabilities</strong> and keep them " +
    "updated. Modern apps are mostly third-party code, and vulnerable dependencies (with public CVEs) are a " +
    "top breach vector. Use software composition analysis (SCA) tools to scan your dependency tree, alert on " +
    "and auto-update vulnerable packages, and pin/lock versions for reproducibility. Track a software bill of " +
    "materials (SBOM) so you can respond quickly when a new CVE drops (e.g. Log4Shell).</p>",
  examples: [
    {
      title: "Example 1: Automated dependency scanning",
      description: "<p>Continuously flag and patch vulnerable packages.</p>",
      code: "// Tools: Dependabot, Snyk, npm audit, OWASP Dependency-Check\n" +
        "//   - scan the lockfile/tree for CVEs\n" +
        "//   - open PRs to bump vulnerable packages\n" +
        "//   - fail CI on high-severity, unpatched vulns"
    },
    {
      title: "Example 2: Lock versions + keep an SBOM",
      description: "<p>Reproducibility + fast incident response.</p>",
      code: "// Commit lockfiles (package-lock.json, etc.) for reproducible builds.\n" +
        "// Maintain an SBOM so when 'CVE in library X' hits, you instantly know\n" +
        "//   if/where you use it and can patch fast."
    }
  ],
  whenToUse: "<p>Continuously &mdash; in CI and via ongoing alerts. <strong>Gotchas:</strong> transitive " +
    "(indirect) dependencies are a common blind spot &mdash; scan the whole tree, not just direct deps. Don't " +
    "blindly auto-merge major version bumps (they can break things); test updates. Balance staying current " +
    "(security) against churn. Unmaintained dependencies are a risk even without a current CVE. Also scan " +
    "container base images. Fast patching of known vulns is one of the highest-ROI security activities.</p>"
};

C["rollback-deployments"] = {
  summary: "<p>Have a reliable <strong>rollback strategy</strong> so you can quickly revert a deployment that " +
    "introduces a bug, vulnerability, or outage. Fast, safe rollback (blue-green, canary, versioned " +
    "releases, immutable artifacts) limits the blast radius and duration of a bad release &mdash; including a " +
    "security regression &mdash; turning 'we shipped a vulnerability' from a prolonged incident into a quick " +
    "revert. Automated, tested rollbacks are a key part of resilient, secure delivery.</p>",
  examples: [
    {
      title: "Example 1: Quick revert on a bad release",
      description: "<p>Roll back fast to a known-good version.</p>",
      code: "// Deploy v2 -> security regression detected / errors spike\n" +
        "//   -> roll back to v1 immediately (one command / automated trigger)\n" +
        "// Blue-green: flip traffic back to the old (still-running) version instantly."
    },
    {
      title: "Example 2: Safe-rollout patterns",
      description: "<p>Canary + automated rollback limit damage.</p>",
      code: "// Canary: release to 5% of traffic first; auto-rollback if error/\n" +
        "//   security alerts trip -> most users never hit the bad version.\n" +
        "// Keep deployments immutable + versioned so rollback is deterministic."
    }
  ],
  whenToUse: "<p>For all production deployments. <strong>Gotchas:</strong> rollback must be <em>tested</em> &mdash; " +
    "an untested rollback often fails when you need it most. Database migrations complicate rollback (forward-" +
    "compatible, reversible migrations; never destructive changes without a plan). Have monitoring/alerts that " +
    "<em>detect</em> when to roll back (errors, security alerts) and ideally automate the trigger. Rollback " +
    "complements, not replaces, prevention (testing, review, scanning) &mdash; but when something slips " +
    "through, fast revert is your safety net.</p>"
};

/* ===================== MONITORING ===================== */

C["centralized-logins"] = {
  summary: "<p>Use <strong>centralized logging</strong> &mdash; aggregate logs from all services/instances " +
    "into one place (ELK, Splunk, cloud logging, a SIEM) &mdash; so you can search, correlate, and analyze " +
    "events across the whole system. In distributed systems, logs scattered across many servers are useless " +
    "for investigating an incident; centralization (with structured logs and correlation ids) lets you trace " +
    "a request or attack end-to-end, detect patterns, and meet audit/compliance needs. It's the foundation of " +
    "security monitoring and incident response.</p>",
  examples: [
    {
      title: "Example 1: Aggregate + correlate",
      description: "<p>One searchable store, tied together by request id.</p>",
      code: "// All services -> ship structured logs -> central store (ELK/Splunk/SIEM)\n" +
        "// Include a correlation/trace id so one request's path across services\n" +
        "//   can be reconstructed. Search/alert across everything in one place."
    },
    {
      title: "Example 2: Security investigation",
      description: "<p>Trace an attacker's actions across the system.</p>",
      code: "// 'Suspicious IP did what?' -> query centralized logs:\n" +
        "//   failed logins, accessed endpoints, data touched, across all servers.\n" +
        "// Impossible if logs live only on individual, ephemeral instances."
    }
  ],
  whenToUse: "<p>For any multi-instance/distributed system. <strong>Gotchas:</strong> use <strong>structured</strong> " +
    "logs (JSON with fields) and correlation ids, or aggregation is far less useful. Protect the log store " +
    "(attackers try to erase tracks &mdash; make logs tamper-resistant and access-controlled). Critically, " +
    "<strong>never log sensitive data</strong> (passwords, tokens, PII) &mdash; see the related practice. " +
    "Manage retention for cost and compliance. Centralized logging underpins alerting, IDS, and forensics.</p>"
};

C["monitor-everything"] = {
  summary: "<p><strong>Monitor everything</strong> relevant to security and operations: authentication events " +
    "(logins, failures), authorization denials, API usage and error rates, traffic anomalies, resource " +
    "consumption, and system health. Comprehensive monitoring (metrics, logs, traces) gives you visibility to " +
    "detect attacks, abuse, and failures early &mdash; you can't respond to what you can't see. Broad, " +
    "continuous observability turns a silent breach (attackers dwell for weeks undetected) into something you " +
    "catch and stop quickly.</p>",
  examples: [
    {
      title: "Example 1: What to monitor for security",
      description: "<p>Track the signals that reveal attacks/abuse.</p>",
      code: "// - auth: login success/failure rates, lockouts, new-location logins\n" +
        "// - authz: spikes in 403s (probing), access to sensitive endpoints\n" +
        "// - traffic: request rate spikes, scraping, unusual geographies\n" +
        "// - errors: 4xx/5xx rates, validation failures\n" +
        "// - usage: per-client volume (abuse/exfiltration), resource saturation"
    },
    {
      title: "Example 2: Observability pillars",
      description: "<p>Metrics + logs + traces, together.</p>",
      code: "// Metrics: 'how much / how fast' (rates, latency, saturation)\n" +
        "// Logs:    'what happened' (auth events, errors, audit trail)\n" +
        "// Traces:  'where it went' across services\n" +
        "// Combine for full visibility -> feed alerts + dashboards."
    }
  ],
  whenToUse: "<p>On every production system. <strong>Gotchas:</strong> 'monitor everything' doesn't mean " +
    "<em>alert</em> on everything &mdash; collect broadly but alert narrowly on actionable, user/security-" +
    "impacting signals (avoid alert fatigue). Don't capture sensitive data in monitoring. Beware high-" +
    "cardinality metrics (cost). Establish baselines so you can spot anomalies. Monitoring detects; pair it " +
    "with alerting and an incident-response plan so detection leads to action.</p>"
};

C["set-alerts"] = {
  summary: "<p><strong>Set up automated alerts</strong> so that suspicious or critical conditions notify the " +
    "right people (or trigger automated responses) immediately &mdash; spikes in failed logins, error-rate " +
    "surges, unusual data access, rate-limit breaches, downtime, or security-tool findings. Alerts turn " +
    "passive monitoring data into timely action; without them, problems sit unnoticed in dashboards. " +
    "Well-tuned, actionable alerts tied to real impact are essential for fast incident detection and " +
    "response.</p>",
  examples: [
    {
      title: "Example 1: Security + availability alerts",
      description: "<p>Alert on conditions that need a human now.</p>",
      code: "// failed_logins > 100/min for an account -> possible brute force\n" +
        "// 403 rate spikes -> possible authz probing / IDOR scan\n" +
        "// error_rate > 1% / p99 latency > SLO -> outage/degradation\n" +
        "// new admin created, config changed -> sensitive action alert"
    },
    {
      title: "Example 2: Make alerts actionable",
      description: "<p>Each alert should be meaningful and have a runbook.</p>",
      code: "// Tie alerts to SLOs / real impact, set severities (page vs ticket),\n" +
        "//   include context + a runbook. Route to on-call / SIEM.\n" +
        "// Avoid noisy alerts that get ignored (alert fatigue)."
    }
  ],
  whenToUse: "<p>For all critical and security-relevant conditions. <strong>Gotchas:</strong> the biggest " +
    "pitfall is <strong>alert fatigue</strong> &mdash; too many noisy, non-actionable alerts train people to " +
    "ignore them (and miss the real one). Alert on symptoms and real impact, use severity levels, and provide " +
    "runbooks. Regularly review and prune. Integrate security alerts with your SIEM/IDS and incident-response " +
    "process so they reach someone who can act.</p>"
};

C["avoid-logging-sensitive-data"] = {
  summary: "<p><strong>Never log sensitive data</strong> &mdash; passwords, tokens, API keys, full card " +
    "numbers, SSNs, health data, or other PII/secrets. Logs are widely accessible (aggregated, retained, " +
    "viewed by many, sometimes shipped to third parties), so logging secrets effectively scatters them and " +
    "creates a serious breach risk and compliance violation. Mask, redact, or omit sensitive fields before " +
    "logging, and be careful that request/response bodies, headers (<code>Authorization</code>!), and " +
    "exceptions don't sneak them in.</p>",
  examples: [
    {
      title: "Example 1: Redact before logging",
      description: "<p>Mask or drop sensitive fields.</p>",
      code: "// BAD: log.info('login', { email, password });  // password in logs!\n" +
        "// BAD: log the full Authorization header / request body with a token\n" +
        "// GOOD: log.info('login', { email });            // no secret\n" +
        "//       mask cards: '**** **** **** 1234'"
    },
    {
      title: "Example 2: Watch indirect leaks",
      description: "<p>Bodies, headers, and stack traces can leak secrets.</p>",
      code: "// Auto-logging full requests/responses can capture tokens/PII.\n" +
        "// Exceptions may include sensitive values. Configure logging to\n" +
        "//   redact known-sensitive keys (password, token, secret, ssn, card)."
    }
  ],
  whenToUse: "<p>Everywhere you log. <strong>Gotchas:</strong> indirect logging is the trap &mdash; full " +
    "request/response dumps, headers, query strings (tokens in URLs!), and exception details often contain " +
    "secrets. Centralized redaction (a logging filter on known-sensitive keys) is more reliable than relying " +
    "on each developer. If a secret is logged, treat it as compromised and rotate it. Balance useful debugging " +
    "info against never persisting secrets/PII. This is both a security and a compliance requirement.</p>"
};

C["use-ids-ips-system"] = {
  summary: "<p>Deploy an <strong>IDS/IPS (Intrusion Detection/Prevention System)</strong> &mdash; and related " +
    "tooling like a WAF &mdash; to automatically detect and block malicious traffic and attack patterns. An " +
    "<em>IDS</em> monitors and alerts on suspicious activity; an <em>IPS</em> actively blocks it. These " +
    "systems recognize known attack signatures (SQLi, XSS, scanning, exploits) and anomalies, adding an " +
    "automated defensive layer that reacts faster than humans and shields your APIs from a constant background " +
    "of probes and attacks.</p>",
  examples: [
    {
      title: "Example 1: Detect vs prevent",
      description: "<p>IDS alerts; IPS/WAF blocks.</p>",
      code: "// IDS: spots a SQLi/scan pattern -> raises an alert (you investigate)\n" +
        "// IPS/WAF: spots the same -> BLOCKS the request in real time\n" +
        "// A WAF in front of the API filters common web attacks automatically."
    },
    {
      title: "Example 2: Layered automated defense",
      description: "<p>Signatures + anomaly detection at the edge.</p>",
      code: "// Edge: WAF (OWASP rules) blocks injection/XSS/known exploits.\n" +
        "// Network/host IDS: flags lateral movement, unusual connections.\n" +
        "// Feeds alerts into your SIEM / monitoring for correlation."
    }
  ],
  whenToUse: "<p>For internet-facing APIs and systems with meaningful risk/compliance needs. <strong>Gotchas:</strong> " +
    "IDS/IPS and WAFs are a <em>layer</em>, not a cure &mdash; they catch known patterns and anomalies but " +
    "miss novel or business-logic attacks, so they complement (never replace) secure coding, input " +
    "validation, and authz. Tune rules to balance blocking attacks against false positives (a too-aggressive " +
    "IPS blocks legitimate users). Keep signatures updated. Managed WAFs (cloud) make this accessible without " +
    "running your own. Integrate alerts with centralized monitoring and incident response.</p>"
};
