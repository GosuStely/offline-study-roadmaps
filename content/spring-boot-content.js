// Content for the "spring-boot" roadmap.
// One entry per topic id (see data/spring-boot.js for the list of ids).

window.CONTENT_DATA = window.CONTENT_DATA || {};
window.CONTENT_DATA["spring-boot"] = window.CONTENT_DATA["spring-boot"] || {};

var C = window.CONTENT_DATA["spring-boot"];

/* ======================================================================
   SECTION 1 — INTRODUCTION
   ====================================================================== */

C["introduction"] = {
  summary: "<p><strong>Spring Boot</strong> is an opinionated framework built on top of the Spring Framework " +
    "that makes it fast to create stand-alone, production-grade Java applications. Plain Spring is powerful " +
    "but historically required lots of manual XML/Java configuration; Spring Boot removes that friction with " +
    "<strong>auto-configuration</strong> (sensible defaults wired up automatically), <strong>starter " +
    "dependencies</strong> (curated dependency bundles), an <strong>embedded server</strong> (run a JAR, no " +
    "external Tomcat), and production features like health checks and metrics out of the box. The motto is " +
    "'convention over configuration': you write business code, Boot handles the plumbing.</p>",
  examples: [
    {
      title: "Example 1: A complete Spring Boot application",
      description: "<p>A single annotation plus a <code>main</code> method gives you a running web app.</p>",
      code: "@SpringBootApplication            // enables auto-config + component scanning\n" +
        "public class StoreApplication {\n" +
        "    public static void main(String[] args) {\n" +
        "        SpringApplication.run(StoreApplication.class, args); // boots everything\n" +
        "    }\n" +
        "}\n" +
        "\n" +
        "@RestController\n" +
        "class HelloController {\n" +
        "    @GetMapping(\"/hello\")\n" +
        "    String hello() { return \"Hello from Spring Boot\"; }\n" +
        "}\n" +
        "// Run the main method -> an embedded server starts on port 8080."
    },
    {
      title: "Example 2: Minimal configuration via application.properties",
      description: "<p>Most settings are simple key/value properties; Boot reads them automatically.</p>",
      code: "# application.properties (or application.yml)\n" +
        "server.port=9090\n" +
        "spring.datasource.url=jdbc:postgresql://localhost:5432/store\n" +
        "spring.jpa.hibernate.ddl-auto=update\n" +
        "# No XML, no boilerplate wiring - Boot configures the datasource & JPA for you."
    }
  ],
  whenToUse: "<p>Reach for Spring Boot for essentially any backend Java service &mdash; REST APIs, " +
    "microservices, scheduled jobs, web apps &mdash; especially when you want to be productive quickly and " +
    "rely on a huge, battle-tested ecosystem. It's the de-facto standard for Java backends. " +
    "<strong>Trade-offs:</strong> the 'magic' of auto-configuration is wonderful until something behaves " +
    "unexpectedly and you don't know which default kicked in &mdash; so it's worth understanding what Boot " +
    "is doing under the hood (the topics in this roadmap). It also pulls in many dependencies and has a " +
    "non-trivial startup time and memory footprint, which matters for serverless/cold-start scenarios " +
    "(where lighter frameworks like Quarkus or plain Micronaut sometimes win).</p>"
};

C["why-use-spring"] = {
  summary: "<p>The core reason to use <strong>Spring</strong> is that it manages the <em>plumbing</em> of an " +
    "application so you can focus on business logic. It provides <strong>dependency injection</strong> (so " +
    "objects don't create their own collaborators), a vast ecosystem of integrations (databases, messaging, " +
    "security, web, cloud) that follow consistent patterns, and abstractions that hide boilerplate (e.g. one " +
    "annotation for a transaction instead of manual commit/rollback). Spring Boot adds auto-configuration on " +
    "top. The payoff: less glue code, loosely-coupled and testable components, and a consistent way to do " +
    "almost anything a backend needs.</p>",
  examples: [
    {
      title: "Example 1: Spring wires dependencies for you",
      description: "<p>You declare what you need; Spring constructs and injects it &mdash; no manual <code>new</code>.</p>",
      code: "@Service\n" +
        "class OrderService {\n" +
        "    private final PaymentGateway gateway;\n" +
        "    // Spring sees this constructor and injects a PaymentGateway bean\n" +
        "    OrderService(PaymentGateway gateway) { this.gateway = gateway; }\n" +
        "}\n" +
        "// Without Spring you'd hand-build the whole object graph and pass it around."
    },
    {
      title: "Example 2: Boilerplate handled by abstractions",
      description: "<p>A declarative annotation replaces tedious, error-prone manual code.</p>",
      code: "@Transactional        // Spring opens, commits, or rolls back the transaction\n" +
        "public void transfer(Long from, Long to, BigDecimal amount) {\n" +
        "    accounts.withdraw(from, amount);\n" +
        "    accounts.deposit(to, amount);   // if this throws, the withdraw rolls back\n" +
        "}"
    }
  ],
  whenToUse: "<p>Choose Spring when building non-trivial Java backends where you'd otherwise reinvent dependency " +
    "wiring, transactions, security, and data access by hand &mdash; which is almost every serious " +
    "application. Its consistency means once you learn the patterns, every new integration feels familiar. " +
    "<strong>Counterpoint:</strong> for a tiny script or an ultra-lightweight function, Spring's size and " +
    "startup cost can be overkill, and the abstraction layers add a learning curve. The benefit grows with " +
    "the size and lifespan of the project; the larger and longer-lived the system, the more Spring's " +
    "structure and ecosystem pay off.</p>"
};

C["terminology"] = {
  summary: "<p>Spring has its own vocabulary that's essential to understand. A <strong>Bean</strong> is any " +
    "object that the Spring container creates and manages. The <strong>IoC container</strong> (or " +
    "<code>ApplicationContext</code>) is the registry that builds, wires, and hands out beans. " +
    "<strong>Dependency Injection (DI)</strong> is how the container supplies a bean's collaborators. " +
    "<strong>Inversion of Control (IoC)</strong> is the broader principle &mdash; the framework controls " +
    "object creation and lifecycle, not you. <strong>Configuration</strong> tells the container what beans " +
    "exist. <strong>AOP</strong> adds cross-cutting behavior. Knowing these terms makes the rest of Spring " +
    "readable.</p>",
  examples: [
    {
      title: "Example 1: Beans living in the container",
      description: "<p>Annotated classes become beans the <code>ApplicationContext</code> manages.</p>",
      code: "@Component                       // -> this class becomes a managed BEAN\n" +
        "class EmailSender { /* ... */ }\n" +
        "\n" +
        "// The CONTAINER (ApplicationContext) holds all beans and can hand them out\n" +
        "ApplicationContext ctx = SpringApplication.run(App.class, args);\n" +
        "EmailSender sender = ctx.getBean(EmailSender.class); // retrieve a bean"
    },
    {
      title: "Example 2: The vocabulary in one place",
      description: "<p>A quick map of the terms you'll see constantly.</p>",
      code: "// Bean            -> an object managed by Spring\n" +
        "// IoC Container   -> ApplicationContext; creates & wires beans\n" +
        "// Dependency Inj. -> container passes collaborators into a bean\n" +
        "// @Configuration  -> a class that DEFINES beans (via @Bean methods)\n" +
        "// @Component      -> marks a class to be auto-detected as a bean\n" +
        "// AOP             -> cross-cutting concerns (logging, tx) via proxies"
    }
  ],
  whenToUse: "<p>This isn't a feature you 'use' &mdash; it's the shared language you need before everything " +
    "else makes sense. Internalizing these terms early prevents confusion when reading docs, error messages, " +
    "and Stack Overflow answers (which assume you know what a 'bean' or 'context' is). <strong>Gotcha:</strong> " +
    "some terms overlap and get used loosely &mdash; people say 'context', 'container', and 'ApplicationContext' " +
    "interchangeably, and 'IoC' and 'DI' are related but not identical (DI is one way to achieve IoC). When " +
    "in doubt, anchor on the concrete artifacts: a bean is an object Spring made, the context is where they " +
    "live.</p>"
};

C["architecture"] = {
  summary: "<p>A typical Spring Boot application is organized in <strong>layers</strong>, each with a clear " +
    "responsibility: <strong>Controller</strong> (web layer &mdash; handles HTTP requests/responses), " +
    "<strong>Service</strong> (business logic and orchestration), and <strong>Repository</strong> (data " +
    "access). Requests flow Controller &rarr; Service &rarr; Repository and back. Spring wires these layers " +
    "together via dependency injection, and the embedded server, auto-configuration, and bean container sit " +
    "underneath. This layered architecture keeps concerns separated, makes each layer testable in isolation, " +
    "and is the conventional structure nearly every Spring Boot project follows.</p>",
  examples: [
    {
      title: "Example 1: The three layers wired together",
      description: "<p>Each layer depends on the one below it, injected by Spring.</p>",
      code: "@RestController                 // WEB layer\n" +
        "class OrderController {\n" +
        "    private final OrderService service;\n" +
        "    OrderController(OrderService service) { this.service = service; }\n" +
        "    @PostMapping(\"/orders\")\n" +
        "    Order create(@RequestBody OrderRequest req) { return service.place(req); }\n" +
        "}\n" +
        "\n" +
        "@Service                        // BUSINESS layer\n" +
        "class OrderService {\n" +
        "    private final OrderRepository repo;\n" +
        "    OrderService(OrderRepository repo) { this.repo = repo; }\n" +
        "    Order place(OrderRequest req) { /* rules */ return repo.save(new Order(req)); }\n" +
        "}\n" +
        "\n" +
        "interface OrderRepository extends JpaRepository<Order, Long> {} // DATA layer"
    },
    {
      title: "Example 2: Why the separation matters",
      description: "<p>Layers let you test business logic without HTTP or a database.</p>",
      code: "// Test the Service with a FAKE repository - no web server, no DB\n" +
        "@Test void placesOrder() {\n" +
        "    OrderRepository fake = mock(OrderRepository.class);\n" +
        "    OrderService service = new OrderService(fake);\n" +
        "    service.place(new OrderRequest(...));\n" +
        "    verify(fake).save(any(Order.class));\n" +
        "}"
    }
  ],
  whenToUse: "<p>Use this layered structure as the default for Spring Boot apps &mdash; it's universally " +
    "understood, supported by the framework's stereotypes (<code>@Controller</code>, <code>@Service</code>, " +
    "<code>@Repository</code>), and keeps web, business, and data concerns from bleeding into each other. " +
    "<strong>Gotchas:</strong> keep business logic in the service layer, not the controller (a common 'fat " +
    "controller' smell), and don't let persistence types (JPA entities) leak all the way out to the API &mdash; " +
    "map to DTOs at the web boundary. For larger systems, consider organizing by <em>feature</em> (vertical " +
    "slices) on top of these horizontal layers so related code stays together rather than spread across three " +
    "packages.</p>"
};

C["dependency-injection"] = {
  summary: "<p><strong>Dependency Injection (DI)</strong> is the technique where an object receives its " +
    "collaborators (dependencies) from the outside instead of creating them itself. In Spring, the container " +
    "constructs your beans and 'injects' the other beans they need. The strongly-recommended form is " +
    "<strong>constructor injection</strong>: declare dependencies as constructor parameters and Spring " +
    "supplies them. DI is what makes Spring components loosely coupled (they depend on interfaces, not " +
    "concrete classes) and easily testable (you can pass in fakes). It's the practical mechanism behind " +
    "Spring's IoC.</p>",
  examples: [
    {
      title: "Example 1: Constructor injection (preferred)",
      description: "<p>Dependencies are final and provided by Spring; the class can't exist half-built.</p>",
      code: "@Service\n" +
        "class NotificationService {\n" +
        "    private final EmailSender email;     // a dependency\n" +
        "    private final SmsSender sms;\n" +
        "\n" +
        "    // Spring injects both beans via this constructor (no @Autowired needed\n" +
        "    // on a single constructor in modern Spring)\n" +
        "    NotificationService(EmailSender email, SmsSender sms) {\n" +
        "        this.email = email;\n" +
        "        this.sms = sms;\n" +
        "    }\n" +
        "}"
    },
    {
      title: "Example 2: Why DI helps testing",
      description: "<p>Because dependencies come from outside, tests can inject controlled fakes.</p>",
      code: "// In production Spring injects real senders; in a test you inject mocks\n" +
        "@Test void sends() {\n" +
        "    EmailSender email = mock(EmailSender.class);\n" +
        "    SmsSender sms = mock(SmsSender.class);\n" +
        "    var service = new NotificationService(email, sms); // plain construction\n" +
        "    service.notifyUser(user);\n" +
        "    verify(email).send(any());\n" +
        "}"
    }
  ],
  whenToUse: "<p>DI is fundamental &mdash; you use it for virtually every Spring bean that needs a collaborator. " +
    "Prefer <strong>constructor injection</strong> (over field injection with <code>@Autowired</code> on " +
    "fields) because it makes dependencies explicit and required, allows <code>final</code> fields, and lets " +
    "you instantiate the class in a plain unit test without Spring. <strong>Gotchas:</strong> field injection " +
    "is concise but hides dependencies and can't be used in tests without reflection &mdash; avoid it. Watch " +
    "for <em>too many</em> constructor parameters: that's a smell that the class has too many " +
    "responsibilities (split it). And circular dependencies (A needs B, B needs A) signal a design problem " +
    "Spring will complain about &mdash; rethink the boundaries rather than forcing it.</p>"
};

C["spring-ioc"] = {
  summary: "<p><strong>Inversion of Control (IoC)</strong> is the principle that the framework, not your code, " +
    "controls the creation and lifecycle of objects. In Spring this is embodied by the <strong>IoC container</strong> " +
    "(the <code>ApplicationContext</code>): you declare beans and their dependencies, and the container " +
    "instantiates them, wires them together, manages their scope, and disposes of them. You 'hand over " +
    "control' of object management to Spring. Dependency Injection is the most common way IoC is realized. " +
    "The result is that your components describe <em>what</em> they need, and the container figures out " +
    "<em>how</em> to provide it.</p>",
  examples: [
    {
      title: "Example 1: The container owns object creation",
      description: "<p>You never call <code>new</code> on beans &mdash; the container builds the whole graph.</p>",
      code: "@Configuration\n" +
        "class AppConfig {\n" +
        "    @Bean PaymentGateway gateway() { return new StripeGateway(); }\n" +
        "    @Bean OrderService orderService(PaymentGateway gw) {\n" +
        "        return new OrderService(gw);   // container passes the gateway bean in\n" +
        "    }\n" +
        "}\n" +
        "// At startup Spring constructs gateway, then orderService, wiring them up."
    },
    {
      title: "Example 2: Inversion compared to manual control",
      description: "<p>Without IoC you assemble everything yourself; with IoC the container does it.</p>",
      code: "// WITHOUT IoC: you control creation and wiring (and must repeat it everywhere)\n" +
        "var gateway = new StripeGateway();\n" +
        "var service = new OrderService(gateway);\n" +
        "\n" +
        "// WITH IoC: declare beans; Spring creates & injects them for you\n" +
        "// (control is 'inverted' from your code to the framework)"
    }
  ],
  whenToUse: "<p>IoC is always on in a Spring app &mdash; it's the foundation, not an optional feature. The " +
    "practical value is that centralizing object creation in the container removes scattered wiring code, " +
    "enables consistent lifecycle management, and makes swapping implementations trivial (change one bean " +
    "definition, not every call site). <strong>Understanding gotcha:</strong> beginners are often confused " +
    "by 'where do my objects come from?' &mdash; the answer is the container created them at startup based on " +
    "your annotations/config. When something isn't injected, it's usually because the class isn't a bean " +
    "(missing <code>@Component</code>/<code>@Service</code> or outside the component-scan path) rather than a " +
    "Spring bug.</p>"
};

C["spring-aop"] = {
  summary: "<p><strong>Aspect-Oriented Programming (AOP)</strong> lets you apply <strong>cross-cutting " +
    "concerns</strong> &mdash; logic that's needed in many places but isn't core business logic, like " +
    "logging, security checks, transactions, and metrics &mdash; without scattering it through every method. " +
    "You define an <strong>aspect</strong> (the cross-cutting code) and <strong>pointcuts</strong> (where it " +
    "applies), and Spring weaves it in by wrapping your beans in <strong>proxies</strong>. This is how " +
    "<code>@Transactional</code>, <code>@Cacheable</code>, and method-level security actually work under the " +
    "hood &mdash; they're AOP aspects applied automatically.</p>",
  examples: [
    {
      title: "Example 1: A logging aspect applied across methods",
      description: "<p>One aspect adds timing to many service methods without touching their code.</p>",
      code: "@Aspect\n" +
        "@Component\n" +
        "class TimingAspect {\n" +
        "    // Pointcut: any method in the service package\n" +
        "    @Around(\"execution(* com.app.service..*(..))\")\n" +
        "    Object time(ProceedingJoinPoint pjp) throws Throwable {\n" +
        "        long start = System.nanoMillis();\n" +
        "        try { return pjp.proceed(); }          // run the real method\n" +
        "        finally { log.info(pjp.getSignature() + \" took \" + (...)); }\n" +
        "    }\n" +
        "}"
    },
    {
      title: "Example 2: Built-in annotations ARE AOP",
      description: "<p>Common Spring annotations are aspects Spring applies via proxies for you.</p>",
      code: "@Service\n" +
        "class ReportService {\n" +
        "    @Transactional      // AOP wraps the call in a transaction\n" +
        "    @Cacheable(\"reports\")  // AOP returns a cached result if present\n" +
        "    public Report build(Long id) { /* expensive work */ }\n" +
        "}\n" +
        "// You didn't write proxy code - Spring's AOP infrastructure does it."
    }
  ],
  whenToUse: "<p>Use AOP for genuine cross-cutting concerns that would otherwise be duplicated everywhere: " +
    "audit logging, performance timing, security enforcement, retry, transactions, caching. It keeps that " +
    "code in one place and your business methods clean. Most of the time you'll <em>consume</em> AOP via " +
    "built-in annotations rather than write custom aspects. <strong>Gotchas:</strong> Spring AOP works via " +
    "proxies, so it only intercepts calls that go <em>through the proxy</em> &mdash; a method calling another " +
    "<code>@Transactional</code>/<code>@Cacheable</code> method on <code>this</code> (a 'self-invocation') " +
    "bypasses the aspect entirely, a classic bug. Custom aspects also add hidden behavior that can make code " +
    "harder to follow, so use them judiciously and document them.</p>"
};

C["spring-bean-scope"] = {
  summary: "<p>A bean's <strong>scope</strong> defines how many instances the container creates and how long " +
    "they live. The default is <strong>singleton</strong>: one shared instance per container, reused " +
    "everywhere. <strong>prototype</strong> creates a new instance every time the bean is requested. In web " +
    "apps there are also <strong>request</strong> (one per HTTP request), <strong>session</strong> (one per " +
    "user session), and <strong>application</strong> scopes. Choosing the right scope matters for correctness " +
    "and memory: singletons must be stateless/thread-safe because they're shared; stateful beans usually " +
    "need a narrower scope.</p>",
  examples: [
    {
      title: "Example 1: The default singleton scope",
      description: "<p>One instance is shared, so it must not hold per-request mutable state.</p>",
      code: "@Service                       // singleton by default\n" +
        "class PricingService {\n" +
        "    // SAFE: no mutable instance state; just stateless logic\n" +
        "    BigDecimal withTax(BigDecimal amount) { return amount.multiply(TAX); }\n" +
        "}\n" +
        "// Every injection point shares the SAME PricingService instance."
    },
    {
      title: "Example 2: Declaring a different scope",
      description: "<p>Use prototype or request scope when each use needs its own instance/state.</p>",
      code: "@Component\n" +
        "@Scope(\"prototype\")            // a NEW instance on every request for this bean\n" +
        "class ShoppingCart {\n" +
        "    private final List<Item> items = new ArrayList<>(); // per-instance state\n" +
        "}\n" +
        "\n" +
        "@Component\n" +
        "@Scope(value = \"request\", proxyMode = TARGET_CLASS) // one per HTTP request\n" +
        "class RequestContext { /* holds data for the current request only */ }"
    }
  ],
  whenToUse: "<p>Stick with the default <strong>singleton</strong> for the vast majority of beans &mdash; " +
    "services, repositories, controllers &mdash; and keep them <em>stateless</em> so sharing one instance " +
    "across threads is safe. Use <strong>prototype</strong> or <strong>request/session</strong> scope only " +
    "when a bean must carry per-use or per-user mutable state. <strong>The #1 gotcha:</strong> putting " +
    "mutable instance fields on a singleton bean &mdash; since it's shared across all requests and threads, " +
    "you get race conditions and data bleeding between users. Another trap: injecting a shorter-lived bean " +
    "(prototype/request) into a singleton naively gives you only the first instance; you need a scoped proxy " +
    "(<code>proxyMode</code>) or a provider to get a fresh one each time.</p>"
};

C["annotations"] = {
  summary: "<p>Spring is heavily <strong>annotation-driven</strong>: small markers on classes and methods " +
    "tell the framework how to treat them. Key families include <em>stereotypes</em> that declare beans " +
    "(<code>@Component</code>, <code>@Service</code>, <code>@Repository</code>, <code>@Controller</code>/" +
    "<code>@RestController</code>), <em>injection</em> (<code>@Autowired</code>, <code>@Qualifier</code>, " +
    "<code>@Value</code>), <em>configuration</em> (<code>@Configuration</code>, <code>@Bean</code>), " +
    "<em>web mapping</em> (<code>@GetMapping</code>, <code>@PostMapping</code>, <code>@RequestBody</code>), " +
    "and <em>behavior</em> (<code>@Transactional</code>, <code>@Cacheable</code>). Annotations replace the " +
    "old XML configuration and make intent visible right at the code.</p>",
  examples: [
    {
      title: "Example 1: Stereotype + web + injection annotations together",
      description: "<p>A handful of annotations declare a bean, map URLs, and inject a dependency.</p>",
      code: "@RestController                       // bean + web controller\n" +
        "@RequestMapping(\"/api/users\")        // base path for all methods\n" +
        "class UserController {\n" +
        "    private final UserService service;\n" +
        "    UserController(UserService service) { this.service = service; } // injection\n" +
        "\n" +
        "    @GetMapping(\"/{id}\")              // maps GET /api/users/{id}\n" +
        "    User get(@PathVariable Long id) { return service.find(id); }\n" +
        "}"
    },
    {
      title: "Example 2: Configuration and value annotations",
      description: "<p>Define beans in code and inject external property values.</p>",
      code: "@Configuration\n" +
        "class AppConfig {\n" +
        "    @Bean RestClient restClient() { return RestClient.create(); } // a bean\n" +
        "\n" +
        "    @Value(\"${app.timeout:30}\")      // inject a property (default 30)\n" +
        "    private int timeout;\n" +
        "}"
    }
  ],
  whenToUse: "<p>You'll use annotations constantly &mdash; they're the primary way you tell Spring what to do. " +
    "The skill is knowing the common ones and what each triggers (a stereotype makes a bean; a mapping " +
    "annotation registers a route; <code>@Transactional</code> wraps a method via AOP). <strong>Gotchas:</strong> " +
    "annotations only work on <em>beans</em> the container manages, and many (transactions, caching, " +
    "security) rely on proxies &mdash; so they're ignored on private methods, on self-invoked calls, and on " +
    "objects you <code>new</code> yourself. Also avoid annotation overload: stacking many behavioral " +
    "annotations on one method hides a lot of implicit logic. Understand what each one does rather than " +
    "cargo-culting them from examples.</p>"
};

C["configuration"] = {
  summary: "<p><strong>Configuration</strong> in Spring Boot is how you customize the application's behavior " +
    "and define beans. There are two complementary sides: <strong>externalized configuration</strong> " +
    "(settings in <code>application.properties</code>/<code>application.yml</code>, environment variables, " +
    "or command-line args &mdash; values that change per environment) and <strong>Java configuration</strong> " +
    "(<code>@Configuration</code> classes with <code>@Bean</code> methods that define and wire beans " +
    "programmatically). Boot also supports <strong>profiles</strong> to load different settings for dev, " +
    "test, and prod. Good configuration keeps environment-specific values out of code and centralizes bean " +
    "setup.</p>",
  examples: [
    {
      title: "Example 1: Externalized, type-safe configuration",
      description: "<p>Bind a group of properties to a typed object instead of scattering <code>@Value</code>s.</p>",
      code: "# application.yml\n" +
        "app:\n" +
        "  mail:\n" +
        "    host: smtp.example.com\n" +
        "    port: 587\n" +
        "\n" +
        "@ConfigurationProperties(prefix = \"app.mail\")  // binds the 'app.mail.*' keys\n" +
        "@Component\n" +
        "class MailProperties {\n" +
        "    private String host; private int port;\n" +
        "    // getters/setters -> host & port are populated from the YAML\n" +
        "}"
    },
    {
      title: "Example 2: Profile-specific configuration",
      description: "<p>Different beans/settings per environment via profiles.</p>",
      code: "@Configuration\n" +
        "@Profile(\"dev\")                 // only active when 'dev' profile is on\n" +
        "class DevConfig {\n" +
        "    @Bean DataSource dataSource() { return new H2InMemoryDataSource(); }\n" +
        "}\n" +
        "// application-prod.yml would point at the real database instead.\n" +
        "// Activate with: --spring.profiles.active=prod"
    }
  ],
  whenToUse: "<p>Use <strong>externalized properties</strong> for anything that varies by environment " +
    "(URLs, credentials, timeouts, feature flags) so the same build runs everywhere, and use " +
    "<strong><code>@ConfigurationProperties</code></strong> for grouped, type-safe settings over scattered " +
    "<code>@Value</code> injections. Use <strong>Java <code>@Configuration</code></strong> when you need to " +
    "construct beans that aren't your own classes (third-party objects) or that need custom wiring. " +
    "<strong>Gotchas:</strong> never hard-code secrets in <code>application.properties</code> committed to " +
    "git &mdash; use environment variables or a secrets manager; and be aware of Boot's property " +
    "<em>precedence</em> order (command-line &gt; env vars &gt; profile files &gt; defaults), which surprises " +
    "people when a value they set is silently overridden by a higher-priority source.</p>"
};

C["spring-mvc-intro"] = {
  summary: "<p><strong>Spring MVC</strong> is Spring's web framework for building HTTP applications and REST " +
    "APIs, following the Model-View-Controller pattern. A central <strong>DispatcherServlet</strong> " +
    "receives every request and routes it to the right <strong>controller</strong> method based on the URL " +
    "and HTTP method; the controller runs logic and returns either a view (for server-rendered pages) or " +
    "data (for REST, serialized to JSON). In Spring Boot you typically build REST APIs with " +
    "<code>@RestController</code> and mapping annotations. This is the introduction; the dedicated Spring MVC " +
    "section covers servlets, components, and views in depth.</p>",
  examples: [
    {
      title: "Example 1: A REST controller",
      description: "<p>Mapping annotations turn methods into HTTP endpoints; return values become JSON.</p>",
      code: "@RestController\n" +
        "@RequestMapping(\"/api/products\")\n" +
        "class ProductController {\n" +
        "    private final ProductService service;\n" +
        "    ProductController(ProductService s) { this.service = s; }\n" +
        "\n" +
        "    @GetMapping(\"/{id}\")           // GET  /api/products/42\n" +
        "    Product get(@PathVariable Long id) { return service.find(id); }\n" +
        "\n" +
        "    @PostMapping                    // POST /api/products  (JSON body)\n" +
        "    Product create(@RequestBody Product p) { return service.save(p); }\n" +
        "}"
    },
    {
      title: "Example 2: Request flow at a glance",
      description: "<p>How a request travels through Spring MVC.</p>",
      code: "// 1. Client -> HTTP request\n" +
        "// 2. DispatcherServlet receives it (the 'front controller')\n" +
        "// 3. It finds the matching @GetMapping/@PostMapping handler\n" +
        "// 4. Controller method runs, calls services\n" +
        "// 5. Return value is serialized (JSON) or rendered (view) back to client"
    }
  ],
  whenToUse: "<p>Spring MVC is the default choice for building web endpoints and REST APIs in Spring Boot &mdash; " +
    "use it for essentially any synchronous request/response HTTP service. <strong>Trade-offs:</strong> " +
    "Spring MVC is built on the traditional blocking, thread-per-request servlet model, which is simple and " +
    "perfect for most applications. For very high-concurrency, streaming, or latency-sensitive workloads " +
    "where you need non-blocking I/O, Spring also offers <strong>WebFlux</strong> (reactive) as an " +
    "alternative &mdash; but it's more complex, so don't reach for it unless you have a concrete need. For " +
    "the overwhelming majority of CRUD and business APIs, Spring MVC is the right, simpler tool.</p>"
};

/* ======================================================================
   SECTION 2 — SPRING SECURITY
   ====================================================================== */

C["spring-security"] = {
  summary: "<p><strong>Spring Security</strong> is the framework's comprehensive solution for " +
    "<strong>authentication</strong> (who are you?) and <strong>authorization</strong> (what are you allowed " +
    "to do?), plus protection against common attacks (CSRF, session fixation, clickjacking). It works as a " +
    "chain of <strong>servlet filters</strong> that intercept every request before it reaches your " +
    "controllers, applying your security rules. It's highly configurable but secure-by-default, and " +
    "integrates with many mechanisms: form login, HTTP Basic, OAuth2, JWT, LDAP, and more. The mental model: " +
    "a request must pass authentication and authorization checks in the filter chain before any business " +
    "code runs.</p>",
  examples: [
    {
      title: "Example 1: A basic security configuration",
      description: "<p>Define which URLs are public and which require authentication.</p>",
      code: "@Configuration\n" +
        "@EnableWebSecurity\n" +
        "class SecurityConfig {\n" +
        "    @Bean\n" +
        "    SecurityFilterChain chain(HttpSecurity http) throws Exception {\n" +
        "        http.authorizeHttpRequests(auth -> auth\n" +
        "                .requestMatchers(\"/public/**\").permitAll()    // open\n" +
        "                .requestMatchers(\"/admin/**\").hasRole(\"ADMIN\") // role-gated\n" +
        "                .anyRequest().authenticated())                 // everything else\n" +
        "            .formLogin(withDefaults());\n" +
        "        return http.build();\n" +
        "    }\n" +
        "}"
    },
    {
      title: "Example 2: The filter-chain mental model",
      description: "<p>Security runs before your controller; failing a check stops the request early.</p>",
      code: "// Request -> [ Security Filter Chain ] -> DispatcherServlet -> Controller\n" +
        "//             |  authenticate (who?)   |\n" +
        "//             |  authorize  (allowed?) |\n" +
        "// If authentication fails -> 401 Unauthorized\n" +
        "// If authorization fails  -> 403 Forbidden  (controller never runs)"
    }
  ],
  whenToUse: "<p>Use Spring Security on any application that has logins, protected resources, or different " +
    "permission levels &mdash; which is most real-world apps. It saves you from hand-rolling security (which " +
    "is dangerous to get wrong) and gives you vetted protections. <strong>Gotchas:</strong> it's powerful but " +
    "has a steep learning curve, and the configuration API has changed significantly across versions (the " +
    "old <code>WebSecurityConfigurerAdapter</code> is deprecated in favor of the component-based " +
    "<code>SecurityFilterChain</code> bean shown above) &mdash; so old tutorials can mislead you. Also, it's " +
    "secure-by-default (e.g. CSRF protection on, everything locked down), which sometimes surprises beginners " +
    "whose requests get blocked until they configure rules explicitly. Don't disable protections like CSRF " +
    "blindly to 'make it work' &mdash; understand why they're there first.</p>"
};

C["authentication"] = {
  summary: "<p><strong>Authentication</strong> is verifying <em>who</em> a user is &mdash; confirming their " +
    "identity, typically via credentials (username/password), a token, or an external provider. In Spring " +
    "Security, authentication produces an <code>Authentication</code> object stored in the " +
    "<code>SecurityContext</code>, representing the logged-in principal. The framework delegates credential " +
    "checking to an <code>AuthenticationManager</code> and one or more <code>AuthenticationProvider</code>s, " +
    "which often use a <code>UserDetailsService</code> to load user data and a <code>PasswordEncoder</code> " +
    "to verify hashed passwords. The result answers 'is this really who they claim to be?'</p>",
  examples: [
    {
      title: "Example 1: Loading users and encoding passwords",
      description: "<p>Provide how to fetch a user and how passwords are hashed; Spring does the check.</p>",
      code: "@Bean\n" +
        "UserDetailsService users(UserRepository repo) {\n" +
        "    return username -> repo.findByUsername(username)  // load the user\n" +
        "        .map(u -> User.withUsername(u.getUsername())\n" +
        "                      .password(u.getPasswordHash())\n" +
        "                      .roles(u.getRole())\n" +
        "                      .build())\n" +
        "        .orElseThrow(() -> new UsernameNotFoundException(username));\n" +
        "}\n" +
        "\n" +
        "@Bean PasswordEncoder encoder() { return new BCryptPasswordEncoder(); } // never store plain text"
    },
    {
      title: "Example 2: Reading the authenticated user",
      description: "<p>Once authenticated, the current principal is available anywhere.</p>",
      code: "@GetMapping(\"/me\")\n" +
        "String me(Authentication auth) {           // Spring injects the current user\n" +
        "    return \"Logged in as: \" + auth.getName();\n" +
        "}\n" +
        "// Or: SecurityContextHolder.getContext().getAuthentication()"
    }
  ],
  whenToUse: "<p>You need authentication whenever your app has the concept of a 'logged-in user' or protected " +
    "resources. Choose the mechanism to fit the client: form login/sessions for traditional server-rendered " +
    "web apps, token-based (JWT) for stateless APIs and SPAs/mobile, OAuth2/OpenID Connect for 'log in with " +
    "Google/etc.' or delegated identity. <strong>Critical gotchas:</strong> <em>never</em> store passwords in " +
    "plain text &mdash; always hash with a strong, salted algorithm like BCrypt (Spring's " +
    "<code>PasswordEncoder</code> handles this); don't roll your own crypto; and be careful to give the same " +
    "generic error for 'wrong username' and 'wrong password' to avoid leaking which usernames exist. " +
    "Authentication only proves identity &mdash; what they can <em>do</em> is authorization, a separate " +
    "step.</p>"
};

C["authorization"] = {
  summary: "<p><strong>Authorization</strong> determines <em>what</em> an authenticated user is allowed to do " +
    "&mdash; which URLs, methods, or data they may access. It happens <em>after</em> authentication. Spring " +
    "Security supports authorization at two levels: <strong>request-level</strong> (rules on URL patterns in " +
    "the security config) and <strong>method-level</strong> (annotations like <code>@PreAuthorize</code> on " +
    "service methods). Decisions are based on the user's <strong>roles</strong> (coarse groups like " +
    "<code>ADMIN</code>) or <strong>authorities/permissions</strong> (fine-grained like " +
    "<code>order:read</code>). The question it answers: 'this user is authenticated, but are they permitted " +
    "to do <em>this</em>?'</p>",
  examples: [
    {
      title: "Example 1: Method-level authorization",
      description: "<p>Annotations guard individual methods based on roles or expressions.</p>",
      code: "@Service\n" +
        "class AccountService {\n" +
        "    @PreAuthorize(\"hasRole('ADMIN')\")            // only admins\n" +
        "    void closeAccount(Long id) { /* ... */ }\n" +
        "\n" +
        "    // Expression can reference the user and method args\n" +
        "    @PreAuthorize(\"#userId == authentication.principal.id\")\n" +
        "    Account viewOwn(Long userId) { /* users see only their own */ }\n" +
        "}\n" +
        "// Requires @EnableMethodSecurity on a config class."
    },
    {
      title: "Example 2: Roles vs authorities",
      description: "<p>Roles are coarse buckets; authorities are fine-grained permissions.</p>",
      code: "// Coarse: role-based\n" +
        "//   .requestMatchers(\"/admin/**\").hasRole(\"ADMIN\")\n" +
        "\n" +
        "// Fine-grained: permission/authority-based\n" +
        "//   .requestMatchers(\"/orders/**\").hasAuthority(\"order:read\")\n" +
        "// Fine-grained authorities scale better as permissions multiply."
    }
  ],
  whenToUse: "<p>Apply authorization whenever different users should have different access &mdash; admin vs " +
    "regular user, owner vs stranger, read vs write. Use request-level rules for broad URL protection and " +
    "method-level <code>@PreAuthorize</code> for fine-grained, business-rule-aware checks (especially " +
    "'can this user act on <em>this specific</em> resource?'). <strong>Gotchas:</strong> the role vs " +
    "authority distinction trips people up &mdash; <code>hasRole('ADMIN')</code> actually checks for the " +
    "authority <code>ROLE_ADMIN</code> (the prefix is added automatically), so mismatched prefixes are a " +
    "common bug. Prefer fine-grained authorities over a proliferation of roles as your permission model " +
    "grows. And always enforce authorization on the <em>server</em> &mdash; hiding a button in the UI is not " +
    "security; the backend must reject unauthorized requests.</p>"
};

C["oauth2"] = {
  summary: "<p><strong>OAuth 2.0</strong> is an industry-standard protocol for <strong>delegated " +
    "authorization</strong> &mdash; letting a user grant a third-party application limited access to their " +
    "resources without sharing their password. It's what powers 'Log in with Google/GitHub/Facebook' and " +
    "API access tokens. Key roles: the <em>resource owner</em> (user), <em>client</em> (your app), " +
    "<em>authorization server</em> (issues tokens, e.g. Google), and <em>resource server</em> (hosts the " +
    "protected API). Spring Security provides first-class OAuth2 support both as a <em>client</em> (logging " +
    "users in via a provider) and as a <em>resource server</em> (validating access tokens on your API). " +
    "OpenID Connect builds authentication on top of OAuth2.</p>",
  examples: [
    {
      title: "Example 1: OAuth2 login (acting as a client)",
      description: "<p>Configure a provider and Spring handles the whole 'log in with X' redirect flow.</p>",
      code: "# application.yml\n" +
        "spring:\n" +
        "  security:\n" +
        "    oauth2:\n" +
        "      client:\n" +
        "        registration:\n" +
        "          google:\n" +
        "            client-id: ${GOOGLE_CLIENT_ID}\n" +
        "            client-secret: ${GOOGLE_CLIENT_SECRET}\n" +
        "            scope: openid, profile, email\n" +
        "\n" +
        "// http.oauth2Login(withDefaults()); -> Spring manages the redirect & token exchange"
    },
    {
      title: "Example 2: Protecting an API (resource server)",
      description: "<p>Validate incoming bearer tokens on your API endpoints.</p>",
      code: "# application.yml -> point at the authorization server's public keys\n" +
        "spring.security.oauth2.resourceserver.jwt.issuer-uri: https://issuer.example.com\n" +
        "\n" +
        "@Bean SecurityFilterChain api(HttpSecurity http) throws Exception {\n" +
        "    http.authorizeHttpRequests(a -> a.anyRequest().authenticated())\n" +
        "        .oauth2ResourceServer(o -> o.jwt(withDefaults())); // validate the token\n" +
        "    return http.build();\n" +
        "}"
    }
  ],
  whenToUse: "<p>Use OAuth2 when you want users to log in via an external identity provider (social/enterprise " +
    "SSO), when building APIs consumed by clients that need delegated access, or in microservice systems with " +
    "a central authorization server issuing tokens. It avoids your app ever handling third-party passwords " +
    "and is the standard for modern API security. <strong>Trade-offs and gotchas:</strong> OAuth2 is " +
    "genuinely complex &mdash; multiple grant types/flows (authorization code, client credentials, etc.), " +
    "and choosing the wrong one is a common mistake (use Authorization Code with PKCE for user-facing apps, " +
    "Client Credentials for service-to-service). Don't implement the protocol yourself; lean on Spring " +
    "Security and a real authorization server (Keycloak, Auth0, Okta, or Spring Authorization Server). Also " +
    "remember OAuth2 is about <em>authorization</em>; for <em>authentication</em> you specifically want " +
    "OpenID Connect on top of it.</p>"
};

C["jwt-authentication"] = {
  summary: "<p><strong>JWT (JSON Web Token)</strong> authentication is a stateless approach where, after " +
    "login, the server issues a signed token containing the user's identity and claims (roles, expiry). The " +
    "client sends this token on every subsequent request (usually in the <code>Authorization: Bearer</code> " +
    "header), and the server verifies the signature to trust it &mdash; <em>without</em> storing session " +
    "state. A JWT has three parts (header, payload, signature) that are base64-encoded and signed. Because " +
    "the server doesn't keep session data, JWTs scale well across multiple servers and suit stateless REST " +
    "APIs, SPAs, and mobile apps.</p>",
  examples: [
    {
      title: "Example 1: The token's structure and use",
      description: "<p>A JWT carries claims in its payload and is sent as a bearer token.</p>",
      code: "// A JWT looks like: header.payload.signature (base64url-encoded)\n" +
        "//   payload (decoded): { \"sub\": \"user-42\", \"roles\": [\"USER\"], \"exp\": 1718000000 }\n" +
        "\n" +
        "// Client sends it on every request:\n" +
        "//   GET /api/orders\n" +
        "//   Authorization: Bearer eyJhbGciOiJIUzI1NiIsIn...\n" +
        "// Server verifies the SIGNATURE -> trusts the claims, no DB/session lookup."
    },
    {
      title: "Example 2: Validating JWTs as a resource server",
      description: "<p>Spring Security can validate JWTs out of the box with minimal config.</p>",
      code: "# application.yml -> the secret/public key used to verify signatures\n" +
        "spring.security.oauth2.resourceserver.jwt.secret-key: ${JWT_SECRET}\n" +
        "\n" +
        "@Bean SecurityFilterChain chain(HttpSecurity http) throws Exception {\n" +
        "    http.csrf(csrf -> csrf.disable())            // stateless API: no CSRF session\n" +
        "        .sessionManagement(s -> s.sessionCreationPolicy(STATELESS))\n" +
        "        .authorizeHttpRequests(a -> a.anyRequest().authenticated())\n" +
        "        .oauth2ResourceServer(o -> o.jwt(withDefaults()));\n" +
        "    return http.build();\n" +
        "}"
    }
  ],
  whenToUse: "<p>Use JWTs for <strong>stateless APIs</strong> &mdash; REST backends serving SPAs, mobile apps, " +
    "or other services &mdash; where you don't want server-side sessions and need to scale horizontally " +
    "(any server can validate the token). <strong>Important gotchas:</strong> JWTs are <em>signed, not " +
    "encrypted</em> &mdash; anyone can decode and read the payload, so never put secrets in it. The big " +
    "weakness is <strong>revocation</strong>: a valid JWT can't easily be invalidated before it expires, so " +
    "use short expiry times plus refresh tokens, and keep a denylist for emergencies. Store tokens carefully " +
    "on the client (XSS can steal them from <code>localStorage</code>; <code>HttpOnly</code> cookies are " +
    "safer but reintroduce CSRF concerns). For traditional server-rendered apps where you control sessions, " +
    "plain session-based auth is often simpler and more secure than JWTs &mdash; don't adopt JWTs just " +
    "because they're trendy.</p>"
};

/* ======================================================================
   SECTIONS 3-6 — STARTERS / AUTOCONFIG / ACTUATORS / EMBEDDED SERVER
   ====================================================================== */

C["spring-boot-starters"] = {
  summary: "<p><strong>Spring Boot Starters</strong> are curated, named dependency bundles that pull in " +
    "everything you need for a particular capability with a single entry in your build file. Instead of " +
    "hunting for individually-compatible versions of a dozen libraries to do web development, you add " +
    "<code>spring-boot-starter-web</code> and get Spring MVC, an embedded Tomcat, JSON support (Jackson), " +
    "and validation &mdash; all version-aligned. Starters solve 'dependency hell': Boot's parent BOM manages " +
    "versions so the libraries are guaranteed to work together. They're a big part of why starting a Spring " +
    "Boot project is so fast.</p>",
  examples: [
    {
      title: "Example 1: One starter pulls in a whole capability",
      description: "<p>A single dependency brings a coherent, version-aligned set of libraries.</p>",
      code: "<!-- Maven: build a web app with one line -->\n" +
        "<dependency>\n" +
        "    <groupId>org.springframework.boot</groupId>\n" +
        "    <artifactId>spring-boot-starter-web</artifactId>\n" +
        "</dependency>\n" +
        "<!-- transitively brings: Spring MVC, embedded Tomcat, Jackson, validation... -->\n" +
        "<!-- Note: no <version> needed - the Boot parent BOM manages it. -->"
    },
    {
      title: "Example 2: Common starters you'll mix and match",
      description: "<p>Compose capabilities by adding the relevant starters.</p>",
      code: "// spring-boot-starter-web         -> REST/web MVC + embedded server\n" +
        "// spring-boot-starter-data-jpa     -> Spring Data JPA + Hibernate\n" +
        "// spring-boot-starter-security     -> Spring Security\n" +
        "// spring-boot-starter-test         -> JUnit, Mockito, AssertJ, Spring Test\n" +
        "// spring-boot-starter-actuator     -> production endpoints (health, metrics)\n" +
        "// spring-boot-starter-validation   -> Bean Validation (jakarta.validation)"
    }
  ],
  whenToUse: "<p>Use starters as your default way to add functionality &mdash; prefer the relevant " +
    "<code>spring-boot-starter-*</code> over assembling individual libraries yourself, because Boot " +
    "guarantees the versions are compatible. They're especially valuable for avoiding version-conflict " +
    "headaches. <strong>Gotchas:</strong> a starter can pull in more than you realize (transitive " +
    "dependencies), occasionally bloating your app or activating auto-configuration you didn't expect &mdash; " +
    "use <code>mvn dependency:tree</code> to see what's actually included. If you need to override a managed " +
    "version, you can, but do it deliberately since it may break the curated compatibility. You can also " +
    "create your own custom starter for a shared internal capability across many services.</p>"
};

C["autoconfiguration"] = {
  summary: "<p><strong>Auto-configuration</strong> is Spring Boot's signature feature: it automatically " +
    "configures beans based on what's on the classpath, what beans you've already defined, and your " +
    "properties &mdash; following the 'convention over configuration' philosophy. See " +
    "<code>spring-boot-starter-data-jpa</code> on the classpath and a database URL in your properties? Boot " +
    "auto-configures a <code>DataSource</code>, an <code>EntityManagerFactory</code>, and a transaction " +
    "manager for you. It's driven by conditional configuration classes (<code>@ConditionalOnClass</code>, " +
    "<code>@ConditionalOnMissingBean</code>) that only activate when appropriate, and it always backs off " +
    "when you provide your own bean &mdash; so your explicit configuration always wins.</p>",
  examples: [
    {
      title: "Example 1: Auto-config reacts to the classpath + properties",
      description: "<p>Just adding a dependency and a property gives you fully-wired beans.</p>",
      code: "// 1. Add spring-boot-starter-data-jpa + an H2/Postgres driver\n" +
        "// 2. Provide a datasource URL:\n" +
        "//      spring.datasource.url=jdbc:postgresql://localhost/store\n" +
        "// 3. Boot AUTO-CONFIGURES, with no code from you:\n" +
        "//      - a connection-pooled DataSource (HikariCP)\n" +
        "//      - a JPA EntityManagerFactory (Hibernate)\n" +
        "//      - a PlatformTransactionManager\n" +
        "// You just inject and use them."
    },
    {
      title: "Example 2: Overriding / inspecting auto-config",
      description: "<p>Define your own bean to override, and use the report to see what fired.</p>",
      code: "// Provide your own bean -> auto-config backs off (@ConditionalOnMissingBean)\n" +
        "@Bean DataSource dataSource() { return myCustomDataSource(); }\n" +
        "\n" +
        "// See exactly what auto-config matched (and why it did or didn't):\n" +
        "//   run with --debug, or hit the actuator 'conditions' endpoint\n" +
        "// Disable a specific one:\n" +
        "//   @SpringBootApplication(exclude = DataSourceAutoConfiguration.class)"
    }
  ],
  whenToUse: "<p>Auto-configuration is always working for you &mdash; the skill is understanding and steering " +
    "it, not 'enabling' it. Lean on it to avoid boilerplate, override it by simply defining your own bean " +
    "when you need custom behavior, and exclude specific auto-configs when they get in the way. " +
    "<strong>The core gotcha</strong> is that the convenience is also the confusion: when the app behaves " +
    "unexpectedly, it's often because some auto-config silently created (or didn't create) a bean. Your " +
    "debugging tools are the <code>--debug</code> flag (prints the auto-configuration report showing what " +
    "matched and why) and the actuator <code>conditions</code> endpoint. Understanding that auto-config " +
    "<em>backs off when you define your own bean</em> resolves most 'why isn't my config being used?' " +
    "confusion.</p>"
};

C["actuators"] = {
  summary: "<p><strong>Spring Boot Actuator</strong> adds production-ready <strong>monitoring and management</strong> " +
    "endpoints to your application with almost no effort. Once you add the actuator starter, you get HTTP (or " +
    "JMX) endpoints exposing the app's internals: <code>/actuator/health</code> (is it up? are the DB and " +
    "dependencies reachable?), <code>/actuator/metrics</code> (memory, CPU, request timings), " +
    "<code>/actuator/info</code>, <code>/actuator/loggers</code> (change log levels at runtime), and more. " +
    "These are essential for operating a service: load balancers use health checks, monitoring systems " +
    "scrape metrics, and ops teams diagnose issues live. It turns observability from a chore into a " +
    "configuration toggle.</p>",
  examples: [
    {
      title: "Example 1: Enabling and exposing endpoints",
      description: "<p>Add the starter and choose which endpoints to expose over HTTP.</p>",
      code: "<!-- pom.xml -->\n" +
        "<dependency>\n" +
        "    <artifactId>spring-boot-starter-actuator</artifactId>\n" +
        "    <groupId>org.springframework.boot</groupId>\n" +
        "</dependency>\n" +
        "\n" +
        "# application.properties - expose specific endpoints (health is on by default)\n" +
        "management.endpoints.web.exposure.include=health,info,metrics,loggers\n" +
        "management.endpoint.health.show-details=when-authorized"
    },
    {
      title: "Example 2: A custom health indicator",
      description: "<p>Teach the health endpoint to check a dependency that matters to you.</p>",
      code: "@Component\n" +
        "class PaymentGatewayHealth implements HealthIndicator {\n" +
        "    public Health health() {\n" +
        "        return gateway.isReachable()\n" +
        "            ? Health.up().build()\n" +
        "            : Health.down().withDetail(\"reason\", \"gateway unreachable\").build();\n" +
        "    }\n" +
        "}\n" +
        "// Now /actuator/health reflects the payment gateway's status too."
    }
  ],
  whenToUse: "<p>Add Actuator to essentially every service you deploy &mdash; the <code>/health</code> endpoint " +
    "for liveness/readiness probes (Kubernetes, load balancers) and <code>/metrics</code> for monitoring are " +
    "near-mandatory in production. Pair it with Micrometer to ship metrics to Prometheus/Datadog/etc. " +
    "<strong>Critical gotcha &mdash; security:</strong> actuator endpoints expose sensitive internals " +
    "(environment variables, config, even heap dumps and thread dumps). Never expose them all publicly. By " +
    "default Boot only exposes <code>health</code> over the web; deliberately choose what else to expose, " +
    "lock the management endpoints behind authentication or a separate internal port, and especially guard " +
    "<code>env</code>, <code>configprops</code>, and <code>heapdump</code>. Observability is the benefit; an " +
    "open actuator is a security hole.</p>"
};

C["embedded-server"] = {
  summary: "<p>An <strong>embedded server</strong> means the web server (Tomcat by default, or Jetty/" +
    "Undertow) runs <em>inside</em> your application rather than your app being deployed <em>into</em> an " +
    "external server. Spring Boot packages everything into a single executable 'fat JAR' that you run with " +
    "<code>java -jar app.jar</code> &mdash; the server starts up as part of your <code>main</code> method. " +
    "This is a major shift from the old model of building a WAR and deploying it to a standalone Tomcat/" +
    "WebLogic. Embedded servers make apps self-contained, simple to run identically everywhere, and a " +
    "perfect fit for containers (Docker) and microservices.</p>",
  examples: [
    {
      title: "Example 1: Run a self-contained app",
      description: "<p>No external server to install &mdash; the JAR is the whole runnable service.</p>",
      code: "# Build a single executable JAR (server included)\n" +
        "mvn clean package\n" +
        "\n" +
        "# Run it anywhere with a JRE - Tomcat starts inside the process\n" +
        "java -jar target/store-app.jar\n" +
        "#   ...Tomcat started on port(s): 8080 (http)\n" +
        "# Same artifact runs on your laptop, CI, and prod - no environment drift."
    },
    {
      title: "Example 2: Configuring or swapping the server",
      description: "<p>Tune the embedded server via properties, or switch the implementation.</p>",
      code: "# application.properties\n" +
        "server.port=8443\n" +
        "server.tomcat.threads.max=200\n" +
        "server.compression.enabled=true\n" +
        "\n" +
        "<!-- To use Undertow instead of Tomcat: exclude Tomcat, add the Undertow starter -->\n" +
        "<!-- spring-boot-starter-web excludes tomcat; add spring-boot-starter-undertow -->"
    }
  ],
  whenToUse: "<p>The embedded server is the default and recommended model for modern Spring Boot apps, " +
    "especially microservices and anything containerized &mdash; it makes deployment a matter of shipping one " +
    "JAR (or one Docker image), with the runtime identical across all environments. <strong>When you might " +
    "deviate:</strong> some legacy or enterprise environments mandate deploying a WAR into a shared, " +
    "centrally-managed application server &mdash; Boot still supports building a traditional WAR for those " +
    "cases. <strong>Gotchas:</strong> each app runs its own server instance (fine for microservices, but " +
    "many apps on one host means many servers); and default settings (thread pool size, timeouts, max " +
    "request size) are tuned for general use, so review them for high-load production. For 99% of new work, " +
    "embedded is the right choice.</p>"
};

/* ======================================================================
   SECTION 7 — HIBERNATE
   ====================================================================== */

C["hibernate"] = {
  summary: "<p><strong>Hibernate</strong> is the most popular Java <strong>ORM (Object-Relational Mapper)</strong> " +
    "and the default JPA implementation in Spring Boot. It maps Java objects (<strong>entities</strong>) to " +
    "database tables, so you work with objects and let Hibernate generate the SQL to load, save, update, and " +
    "delete rows. <strong>JPA</strong> is the standard specification (the interfaces/annotations); Hibernate " +
    "is the concrete engine behind it. Hibernate manages a <strong>persistence context</strong> (a first-" +
    "level cache / unit of work) that tracks entity changes and flushes them as SQL. It hugely reduces " +
    "boilerplate JDBC code, but its 'magic' has behaviors you must understand.</p>",
  examples: [
    {
      title: "Example 1: An entity mapped to a table",
      description: "<p>Annotations map a class and its fields to a table and columns.</p>",
      code: "@Entity                          // this class maps to a DB table\n" +
        "@Table(name = \"products\")\n" +
        "class Product {\n" +
        "    @Id @GeneratedValue(strategy = IDENTITY)\n" +
        "    private Long id;             // primary key, auto-generated\n" +
        "\n" +
        "    @Column(nullable = false)\n" +
        "    private String name;\n" +
        "    private BigDecimal price;\n" +
        "    // getters/setters...\n" +
        "}\n" +
        "// Hibernate can now SELECT/INSERT/UPDATE/DELETE products without hand-written SQL."
    },
    {
      title: "Example 2: The persistence context tracks changes",
      description: "<p>Within a transaction, modifying a managed entity auto-syncs to the DB (dirty checking).</p>",
      code: "@Transactional\n" +
        "void renameProduct(Long id, String newName) {\n" +
        "    Product p = entityManager.find(Product.class, id); // now 'managed'\n" +
        "    p.setName(newName);   // no explicit save() needed!\n" +
        "    // Hibernate detects the change and issues UPDATE at transaction commit\n" +
        "}"
    }
  ],
  whenToUse: "<p>Use Hibernate/JPA for the bulk of standard CRUD persistence in a Spring Boot app &mdash; it " +
    "eliminates tedious JDBC and mapping code and integrates seamlessly with Spring Data. <strong>Know the " +
    "trade-offs:</strong> the ORM hides SQL, which causes classic traps &mdash; the <strong>N+1 select " +
    "problem</strong> (lazy associations firing one query per row in a loop), surprising lazy-loading " +
    "exceptions outside a transaction (<code>LazyInitializationException</code>), and inefficient generated " +
    "SQL. So you still need to understand SQL and inspect the queries Hibernate emits (enable " +
    "<code>show-sql</code>/statistics). For complex reporting, bulk updates, or hot-path performance, drop to " +
    "native SQL or a query builder rather than fighting the ORM. The pragmatic stance: Hibernate for routine " +
    "data access, raw SQL for the performance-critical or set-based exceptions.</p>"
};

C["entity-lifecycle"] = {
  summary: "<p>A JPA <strong>entity</strong> moves through well-defined lifecycle <strong>states</strong>, and " +
    "understanding them explains much of Hibernate's behavior. <strong>Transient</strong>: a new object not " +
    "yet associated with the persistence context (a plain <code>new</code>). <strong>Managed/Persistent</strong>: " +
    "attached to the context within a transaction &mdash; Hibernate tracks its changes and auto-syncs them " +
    "(dirty checking). <strong>Detached</strong>: was managed but the context closed &mdash; changes are no " +
    "longer tracked. <strong>Removed</strong>: marked for deletion. You can also hook into transitions with " +
    "callbacks like <code>@PrePersist</code> and <code>@PreUpdate</code>.</p>",
  examples: [
    {
      title: "Example 1: Moving through the states",
      description: "<p>The same object is transient, then managed, then detached.</p>",
      code: "Product p = new Product(\"Mug\");      // TRANSIENT (not in any context)\n" +
        "\n" +
        "@Transactional void save(Product p) {\n" +
        "    entityManager.persist(p);          // -> MANAGED (tracked + scheduled INSERT)\n" +
        "    p.setPrice(new BigDecimal(\"9.99\")); // change auto-synced at commit\n" +
        "}                                       // tx ends -> p becomes DETACHED\n" +
        "// p.setPrice(...) here would NOT hit the DB - it's detached now."
    },
    {
      title: "Example 2: Lifecycle callbacks",
      description: "<p>Run logic automatically at lifecycle transitions.</p>",
      code: "@Entity\n" +
        "class Order {\n" +
        "    private Instant createdAt;\n" +
        "    @PrePersist void onCreate() { createdAt = Instant.now(); } // before INSERT\n" +
        "    @PreUpdate  void onUpdate() { /* e.g. set updatedAt */ }   // before UPDATE\n" +
        "}"
    }
  ],
  whenToUse: "<p>You don't 'use' lifecycle states directly &mdash; understanding them is what lets you predict " +
    "Hibernate's behavior and avoid its most common bugs. <strong>Key gotchas this explains:</strong> why " +
    "modifying a managed entity persists <em>without</em> calling <code>save()</code> (dirty checking on a " +
    "managed entity), why touching a lazy association on a <em>detached</em> entity throws " +
    "<code>LazyInitializationException</code> (the context that would load it is gone), and why changes to a " +
    "detached object silently don't persist until you <code>merge()</code> it back. Lifecycle callbacks " +
    "(<code>@PrePersist</code>/<code>@PreUpdate</code>) are handy for audit timestamps, but keep them simple " +
    "&mdash; heavy logic in callbacks is hard to test and surprising. Spring Data's auditing " +
    "(<code>@CreatedDate</code>, <code>@LastModifiedDate</code>) is usually a cleaner option for timestamps.</p>"
};

C["relationships"] = {
  summary: "<p><strong>Relationships</strong> map associations between entities onto database foreign keys " +
    "using JPA annotations: <strong>@OneToMany</strong> / <strong>@ManyToOne</strong> (e.g. one order has " +
    "many items; each item belongs to one order), <strong>@OneToOne</strong>, and <strong>@ManyToMany</strong> " +
    "(via a join table). Each relationship has a <strong>fetch type</strong> &mdash; <code>LAZY</code> (load " +
    "the association only when accessed) or <code>EAGER</code> (load it immediately) &mdash; and an owning " +
    "side that controls the foreign key. Getting relationships and their fetch strategy right is one of the " +
    "biggest factors in a JPA app's correctness and performance.</p>",
  examples: [
    {
      title: "Example 1: A bidirectional one-to-many",
      description: "<p>One <code>Order</code> has many <code>Item</code>s; the item owns the foreign key.</p>",
      code: "@Entity class Order {\n" +
        "    @Id @GeneratedValue Long id;\n" +
        "    // 'mappedBy' = the field on the other side that owns the FK\n" +
        "    @OneToMany(mappedBy = \"order\", cascade = ALL, orphanRemoval = true)\n" +
        "    private List<Item> items = new ArrayList<>();\n" +
        "}\n" +
        "\n" +
        "@Entity class Item {\n" +
        "    @Id @GeneratedValue Long id;\n" +
        "    @ManyToOne(fetch = FetchType.LAZY)   // the owning side -> has order_id FK\n" +
        "    private Order order;\n" +
        "}"
    },
    {
      title: "Example 2: Avoiding the N+1 problem with a fetch join",
      description: "<p>Lazy relationships in a loop cause many queries; a join fetch loads them in one.</p>",
      code: "// PROBLEM: 1 query for orders + 1 per order's items = N+1\n" +
        "// for (Order o : orderRepo.findAll()) o.getItems().size();\n" +
        "\n" +
        "// FIX: fetch the association up front in a single query\n" +
        "@Query(\"SELECT o FROM Order o JOIN FETCH o.items\")\n" +
        "List<Order> findAllWithItems();"
    }
  ],
  whenToUse: "<p>Map relationships whenever your domain has connected entities &mdash; orders/items, users/" +
    "roles, posts/comments. <strong>Best-practice defaults and gotchas:</strong> prefer " +
    "<code>FetchType.LAZY</code> for <code>@ManyToOne</code> and <code>@OneToMany</code> (EAGER fetching of " +
    "collections is a notorious performance trap that loads huge graphs you didn't need); be deliberate about " +
    "the owning side and <code>mappedBy</code> or you'll get a redundant join table or extra UPDATEs; and " +
    "watch the <strong>N+1 query problem</strong> &mdash; the #1 JPA performance killer &mdash; by using " +
    "<code>JOIN FETCH</code> or entity graphs when you know you'll need an association. Be cautious with " +
    "<code>@ManyToMany</code>: it's convenient but often better modeled as an explicit join entity once the " +
    "relationship needs its own attributes. Also avoid <code>CascadeType.ALL</code> reflexively &mdash; " +
    "cascading deletes can remove more than you intend.</p>"
};

C["transactions"] = {
  summary: "<p>A <strong>transaction</strong> groups a set of database operations into a single atomic unit: " +
    "either all succeed and commit, or any failure rolls them all back, keeping data consistent. In Spring " +
    "you almost always manage transactions declaratively with <strong><code>@Transactional</code></strong> " +
    "&mdash; annotate a method and Spring (via AOP) opens a transaction before it runs and commits afterward, " +
    "or rolls back if it throws. This frees you from manual <code>commit()</code>/<code>rollback()</code> " +
    "code. Transactions have important settings: <strong>propagation</strong> (how nested transactional " +
    "calls combine), <strong>isolation</strong> (how concurrent transactions see each other), and " +
    "<strong>rollback rules</strong>.</p>",
  examples: [
    {
      title: "Example 1: Declarative atomicity",
      description: "<p>The whole method is one transaction; a failure undoes the earlier change.</p>",
      code: "@Transactional\n" +
        "public void transfer(Long from, Long to, BigDecimal amount) {\n" +
        "    accounts.withdraw(from, amount);  // step 1\n" +
        "    accounts.deposit(to, amount);     // step 2 - if THIS throws,\n" +
        "                                      // step 1 is rolled back automatically\n" +
        "}\n" +
        "// You never see money leave one account without arriving in the other."
    },
    {
      title: "Example 2: Read-only and rollback rules",
      description: "<p>Tune transactions for reads and control what triggers a rollback.</p>",
      code: "@Transactional(readOnly = true)   // optimization hint for pure reads\n" +
        "public List<Order> recentOrders() { return repo.findRecent(); }\n" +
        "\n" +
        "// By default Spring rolls back on RuntimeException but NOT checked exceptions.\n" +
        "@Transactional(rollbackFor = IOException.class)  // also roll back on this\n" +
        "public void importData() throws IOException { /* ... */ }"
    }
  ],
  whenToUse: "<p>Wrap any operation that performs multiple related writes (or a write that must be all-or-" +
    "nothing) in a transaction &mdash; typically at the <em>service</em> layer, around a use case, not on " +
    "individual repository calls. <strong>Common gotchas:</strong> by default Spring rolls back only on " +
    "unchecked (<code>RuntimeException</code>) exceptions, <em>not</em> checked ones &mdash; a frequent " +
    "source of 'why didn't it roll back?' bugs (use <code>rollbackFor</code>). Because " +
    "<code>@Transactional</code> works via a proxy, a <strong>self-invocation</strong> (one method in a bean " +
    "calling another <code>@Transactional</code> method on <code>this</code>) bypasses the transaction " +
    "entirely. Avoid putting slow external calls (HTTP, email) inside a transaction &mdash; they hold the DB " +
    "connection open. And keep transactions short to reduce lock contention. Understand " +
    "<strong>propagation</strong> (e.g. <code>REQUIRES_NEW</code>) before relying on nested transactional " +
    "behavior.</p>"
};

/* ======================================================================
   SECTION 8 — SPRING DATA
   ====================================================================== */

C["spring-data"] = {
  summary: "<p><strong>Spring Data</strong> is a family of projects that drastically reduce data-access " +
    "boilerplate by letting you define <strong>repository interfaces</strong> &mdash; you declare the methods " +
    "you want and Spring generates the implementation at runtime. Extend a base repository and you instantly " +
    "get CRUD operations; declare a method named by convention (<code>findByEmail</code>) and Spring derives " +
    "the query for you. It provides a consistent programming model across many stores (JPA/relational, " +
    "MongoDB, Redis, etc.), so the same repository style works whether you're on SQL or NoSQL. It's one of " +
    "the biggest productivity wins in the Spring ecosystem.</p>",
  examples: [
    {
      title: "Example 1: A repository with zero implementation code",
      description: "<p>Extend an interface and get full CRUD plus derived query methods for free.</p>",
      code: "interface UserRepository extends JpaRepository<User, Long> {\n" +
        "    // CRUD (save, findById, findAll, delete...) is inherited automatically.\n" +
        "\n" +
        "    // Derived queries: Spring parses the method NAME into a query\n" +
        "    Optional<User> findByEmail(String email);\n" +
        "    List<User> findByActiveTrueOrderByCreatedAtDesc();\n" +
        "    long countByRole(String role);\n" +
        "}\n" +
        "// No @Repository class to write - Spring builds the implementation at startup."
    },
    {
      title: "Example 2: Custom queries when conventions aren't enough",
      description: "<p>Drop to an explicit query for anything the method-name DSL can't express.</p>",
      code: "interface OrderRepository extends JpaRepository<Order, Long> {\n" +
        "    @Query(\"SELECT o FROM Order o WHERE o.total > :min AND o.status = 'PAID'\")\n" +
        "    List<Order> findBigPaidOrders(@Param(\"min\") BigDecimal min);\n" +
        "\n" +
        "    // Or use Pageable for pagination + sorting out of the box\n" +
        "    Page<Order> findByCustomerId(Long customerId, Pageable pageable);\n" +
        "}"
    }
  ],
  whenToUse: "<p>Use Spring Data for virtually all standard data access in a Spring Boot app &mdash; it removes " +
    "an enormous amount of repetitive code and gives you CRUD, derived queries, pagination, sorting, and " +
    "auditing almost for free. Reach for the module matching your store (Spring Data JPA, MongoDB, JDBC, " +
    "etc.). <strong>Gotchas:</strong> derived query methods are magical but get unwieldy fast &mdash; a name " +
    "like <code>findByXAndYOrZOrderByW</code> is a sign to switch to an explicit <code>@Query</code> for " +
    "readability. Remember it's a thin layer over the underlying store, so all the underlying caveats still " +
    "apply (for JPA: the N+1 problem, lazy loading, transactions). And a typo in a derived method name often " +
    "fails only at startup (or silently does the wrong thing), so test your repository methods.</p>"
};

C["spring-data-jpa"] = {
  summary: "<p><strong>Spring Data JPA</strong> is the most-used Spring Data module, combining Spring Data's " +
    "repository abstraction with JPA/Hibernate for <strong>relational databases</strong>. You define " +
    "repository interfaces extending <code>JpaRepository</code> and get CRUD, derived queries, JPQL/native " +
    "<code>@Query</code> support, pagination, sorting, specifications (dynamic queries), and auditing &mdash; " +
    "all backed by Hibernate's ORM. It's the default persistence approach in most Spring Boot applications " +
    "that use SQL databases, sitting on top of everything covered in the Hibernate section while removing the " +
    "repository boilerplate.</p>",
  examples: [
    {
      title: "Example 1: JpaRepository in action",
      description: "<p>Inherited CRUD plus derived and paged queries against a relational DB.</p>",
      code: "interface ProductRepository extends JpaRepository<Product, Long> {\n" +
        "    List<Product> findByCategoryAndPriceLessThan(String cat, BigDecimal max);\n" +
        "    Page<Product> findByNameContainingIgnoreCase(String q, Pageable page);\n" +
        "}\n" +
        "\n" +
        "// Usage\n" +
        "Product saved = repo.save(new Product(\"Mug\", \"kitchen\", new BigDecimal(\"9\")));\n" +
        "Page<Product> page = repo.findByNameContainingIgnoreCase(\"mug\", PageRequest.of(0, 20));"
    },
    {
      title: "Example 2: Dynamic queries with Specifications",
      description: "<p>Build queries from optional criteria without writing many method variants.</p>",
      code: "// Combine optional filters at runtime instead of findByAOrByAB...\n" +
        "Specification<Product> spec = Specification.where(null);\n" +
        "if (category != null) spec = spec.and((root, q, cb) ->\n" +
        "    cb.equal(root.get(\"category\"), category));\n" +
        "if (maxPrice != null) spec = spec.and((root, q, cb) ->\n" +
        "    cb.lessThan(root.get(\"price\"), maxPrice));\n" +
        "List<Product> results = repo.findAll(spec); // needs JpaSpecificationExecutor"
    }
  ],
  whenToUse: "<p>Spring Data JPA is the go-to for applications backed by a relational database (Postgres, " +
    "MySQL, etc.) with typical CRUD and moderately complex queries &mdash; the default for most Spring Boot " +
    "backends. Use derived queries for simple cases, <code>@Query</code> for explicit JPQL/SQL, and " +
    "Specifications or Querydsl for dynamic, multi-filter searches. <strong>Trade-offs:</strong> because it's " +
    "Hibernate underneath, you inherit all ORM considerations &mdash; N+1 queries, lazy-loading boundaries, " +
    "transaction management &mdash; so monitor the generated SQL. For heavy reporting, bulk operations, or " +
    "highly-tuned queries, plain JDBC, Spring Data JDBC, or native SQL can be a better fit than bending JPA. " +
    "Don't reach for JPA's full machinery if your access pattern is simple key-value or you don't need an " +
    "object graph &mdash; lighter options exist.</p>"
};

C["spring-data-mongodb"] = {
  summary: "<p><strong>Spring Data MongoDB</strong> brings the same repository programming model to " +
    "<strong>MongoDB</strong>, a document (NoSQL) database that stores flexible, JSON-like documents instead " +
    "of rows in fixed tables. You annotate classes with <code>@Document</code>, define repositories " +
    "extending <code>MongoRepository</code>, and get CRUD and derived queries just like with JPA &mdash; but " +
    "against collections of documents. It also offers <code>MongoTemplate</code> for more advanced queries " +
    "and aggregations. The consistent Spring Data API means moving between SQL and Mongo feels familiar, " +
    "while you gain Mongo's schema flexibility and horizontal scalability.</p>",
  examples: [
    {
      title: "Example 1: A document entity and repository",
      description: "<p>Map a class to a Mongo collection and query it with derived methods.</p>",
      code: "@Document(collection = \"products\")  // stored as a JSON-like document\n" +
        "class Product {\n" +
        "    @Id String id;                  // Mongo uses string/ObjectId ids\n" +
        "    String name;\n" +
        "    List<String> tags;              // documents can nest arrays/objects freely\n" +
        "}\n" +
        "\n" +
        "interface ProductRepository extends MongoRepository<Product, String> {\n" +
        "    List<Product> findByTagsContaining(String tag);\n" +
        "}"
    },
    {
      title: "Example 2: Advanced queries with MongoTemplate",
      description: "<p>For aggregations and complex criteria, use the template API.</p>",
      code: "Query query = new Query(Criteria.where(\"price\").gt(10).lt(100))\n" +
        "        .with(Sort.by(\"name\")).limit(20);\n" +
        "List<Product> results = mongoTemplate.find(query, Product.class);\n" +
        "// MongoTemplate also exposes the aggregation pipeline for grouping/analytics."
    }
  ],
  whenToUse: "<p>Choose MongoDB (and this module) when your data is document-shaped, schema-flexible, or rapidly " +
    "evolving &mdash; content management, catalogs with varied attributes, event/activity logs, or when you " +
    "need easy horizontal scaling and denormalized documents that map naturally to your objects. " +
    "<strong>Trade-offs and gotchas:</strong> MongoDB is not a drop-in replacement for SQL &mdash; it has " +
    "historically weaker support for multi-document transactions and joins, so model your data around access " +
    "patterns (embed related data in one document vs referencing) rather than normalizing as you would in " +
    "SQL. Schema flexibility is a double-edged sword: without discipline you get inconsistent documents. " +
    "Don't pick Mongo by default or because it's 'NoSQL and modern' &mdash; if your data is highly relational " +
    "with strong consistency needs, a relational database with JPA is usually the better, simpler choice.</p>"
};

C["spring-data-jdbc"] = {
  summary: "<p><strong>Spring Data JDBC</strong> is a lighter-weight alternative to Spring Data JPA for " +
    "relational databases. It gives you the same repository abstraction but deliberately omits the complex " +
    "parts of JPA/Hibernate &mdash; no lazy loading, no persistence context/dirty checking, no first-level " +
    "cache. It maps objects to tables more directly and predictably: when you save, it issues SQL " +
    "immediately; there's no hidden session tracking changes. This makes its behavior far easier to reason " +
    "about and its SQL more predictable, at the cost of fewer features (it's built around Domain-Driven " +
    "Design aggregates rather than arbitrary object graphs).</p>",
  examples: [
    {
      title: "Example 1: A simple JDBC repository",
      description: "<p>Looks like Spring Data JPA, but with simpler, more direct semantics.</p>",
      code: "@Table(\"customers\")\n" +
        "class Customer {\n" +
        "    @Id Long id;\n" +
        "    String name;\n" +
        "    String email;\n" +
        "}\n" +
        "\n" +
        "interface CustomerRepository extends CrudRepository<Customer, Long> {\n" +
        "    List<Customer> findByEmail(String email);   // derived query\n" +
        "    @Query(\"SELECT * FROM customers WHERE name LIKE :q\") // plain SQL\n" +
        "    List<Customer> search(@Param(\"q\") String q);\n" +
        "}"
    },
    {
      title: "Example 2: Predictable, immediate persistence",
      description: "<p>No dirty checking &mdash; you explicitly save, and SQL runs right then.</p>",
      code: "@Transactional\n" +
        "void rename(Long id, String name) {\n" +
        "    Customer c = repo.findById(id).orElseThrow();\n" +
        "    c.setName(name);\n" +
        "    repo.save(c);    // REQUIRED: JDBC won't auto-detect the change like JPA does\n" +
        "}\n" +
        "// What you see is what runs - no hidden flush, no lazy proxies."
    }
  ],
  whenToUse: "<p>Choose Spring Data JDBC when you want relational persistence that's <strong>simple and " +
    "predictable</strong>, and you don't need JPA's heavy machinery (lazy loading, complex object graphs, " +
    "caching). It shines for straightforward aggregates, microservices that value transparency over features, " +
    "and teams burned by Hibernate's surprises (N+1, lazy exceptions, opaque SQL). <strong>Trade-offs:</strong> " +
    "you give up convenient lazy associations, automatic dirty checking, and rich relationship mapping &mdash; " +
    "you must save explicitly and model around DDD aggregates (load and save whole aggregates, not arbitrary " +
    "graphs). For applications with deep, interconnected object models and lots of derived navigation, JPA is " +
    "more productive. The decision is essentially 'predictability and simplicity (JDBC) vs features and " +
    "object-graph convenience (JPA)' &mdash; pick based on which your project values more.</p>"
};

/* ======================================================================
   SECTION 9 — MICROSERVICES
   ====================================================================== */

C["microservices"] = {
  summary: "<p><strong>Microservices</strong> structure an application as a set of small, independently " +
    "deployable services, each owning a business capability and communicating over the network. Spring Boot " +
    "is a leading platform for building them, and <strong>Spring Cloud</strong> provides the supporting " +
    "infrastructure: service discovery (Eureka), an API gateway (Spring Cloud Gateway), centralized " +
    "configuration (Cloud Config), resilience (Circuit Breaker), declarative HTTP clients (OpenFeign), and " +
    "observability (Micrometer). The benefits are independent deployment/scaling and team autonomy; the cost " +
    "is real distributed-systems complexity &mdash; network failures, data consistency, and operational " +
    "overhead.</p>",
  examples: [
    {
      title: "Example 1: A Spring Cloud microservice landscape",
      description: "<p>How the Spring Cloud pieces fit together around your services.</p>",
      code: "//                 [ Config Server ]  (central config)\n" +
        "//                        |\n" +
        "//  client -> [ API Gateway ] -> [ order-service ] --Feign--> [ payment-service ]\n" +
        "//                        |            |                            |\n" +
        "//                  [ Eureka registry: services register & discover each other ]\n" +
        "//  + Circuit Breaker around remote calls, Micrometer metrics everywhere"
    },
    {
      title: "Example 2: A minimal service that registers itself",
      description: "<p>Annotations turn a Boot app into a discoverable cloud service.</p>",
      code: "@SpringBootApplication\n" +
        "@EnableDiscoveryClient          // register with Eureka so others can find it\n" +
        "public class OrderServiceApp {\n" +
        "    public static void main(String[] a) { SpringApplication.run(OrderServiceApp.class, a); }\n" +
        "}\n" +
        "// Other services now call 'order-service' by name, not a hard-coded URL."
    }
  ],
  whenToUse: "<p>Adopt microservices when you have concrete drivers: multiple teams needing to deploy " +
    "independently, parts of the system with very different scaling needs, or a need to isolate failures " +
    "&mdash; <em>and</em> the DevOps maturity (CI/CD, containers, monitoring, tracing) to run them. " +
    "<strong>The dominant advice is 'monolith first':</strong> most applications should start as a " +
    "well-structured modular monolith and split into services only when a real boundary and pain point " +
    "emerge. Premature microservices trade simple in-process calls for network failures, eventual " +
    "consistency, distributed transactions (sagas), and heavy operational burden a small team can't absorb. " +
    "Microservices solve organizational and scaling problems, not code-quality problems &mdash; don't reach " +
    "for them for a small app just because Spring Cloud makes it possible.</p>"
};

C["spring-cloud"] = {
  summary: "<p><strong>Spring Cloud</strong> is an umbrella of projects that provide the common building " +
    "blocks for distributed systems and microservices, built on Spring Boot. Rather than solving discovery, " +
    "configuration, routing, resilience, and observability from scratch, you compose Spring Cloud modules: " +
    "<strong>Cloud Config</strong> (centralized configuration), <strong>Netflix Eureka</strong> (service " +
    "discovery), <strong>Spring Cloud Gateway</strong> (API gateway), <strong>Circuit Breaker</strong> " +
    "(resilience), <strong>OpenFeign</strong> (declarative clients), and more. Each integrates with Boot's " +
    "auto-configuration so you wire them in with a starter and a few properties.</p>",
  examples: [
    {
      title: "Example 1: Adding a Spring Cloud capability",
      description: "<p>A starter plus an annotation enables a whole distributed-systems feature.</p>",
      code: "<!-- Bring in service discovery -->\n" +
        "<dependency>\n" +
        "  <groupId>org.springframework.cloud</groupId>\n" +
        "  <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>\n" +
        "</dependency>\n" +
        "\n" +
        "// @EnableDiscoveryClient + eureka.client.service-url in properties\n" +
        "// -> this service now registers and discovers peers automatically."
    },
    {
      title: "Example 2: Version alignment via the Cloud BOM",
      description: "<p>Spring Cloud releases as a coordinated train aligned to a Boot version.</p>",
      code: "<!-- Import the Spring Cloud BOM so all cloud modules use compatible versions -->\n" +
        "<dependencyManagement><dependencies><dependency>\n" +
        "  <groupId>org.springframework.cloud</groupId>\n" +
        "  <artifactId>spring-cloud-dependencies</artifactId>\n" +
        "  <version>2023.0.x</version>   <!-- must match your Spring Boot version -->\n" +
        "  <type>pom</type><scope>import</scope>\n" +
        "</dependency></dependencies></dependencyManagement>"
    }
  ],
  whenToUse: "<p>Use Spring Cloud when you're building a genuine microservices/distributed system on Spring Boot " +
    "and need standardized solutions for discovery, config, routing, and resilience rather than hand-rolling " +
    "them. It's the natural companion to Spring Boot microservices. <strong>Gotchas:</strong> Spring Cloud " +
    "versions are tied to specific Spring Boot versions via a 'release train' &mdash; mismatching them causes " +
    "baffling errors, so always import the matching BOM. Also, the ecosystem has evolved (several Netflix " +
    "components are in maintenance mode; some capabilities now overlap with Kubernetes-native tooling like " +
    "k8s service discovery, ConfigMaps, and service meshes). If you deploy on Kubernetes, evaluate whether " +
    "the platform already provides discovery/config/routing before adding Spring Cloud equivalents &mdash; " +
    "don't run two competing mechanisms.</p>"
};

C["spring-cloud-gateway"] = {
  summary: "<p><strong>Spring Cloud Gateway</strong> is an <strong>API gateway</strong> &mdash; a single entry " +
    "point that sits in front of your microservices and routes incoming requests to the right backend " +
    "service, while handling cross-cutting concerns centrally: authentication, rate limiting, request/" +
    "response transformation, CORS, and load balancing. Instead of clients knowing about and calling many " +
    "services directly, they call the gateway, which forwards based on configurable <strong>routes</strong> " +
    "(matched by path, host, headers) with <strong>predicates</strong> and <strong>filters</strong>. It's " +
    "built on reactive (non-blocking) foundations for high throughput.</p>",
  examples: [
    {
      title: "Example 1: Routing requests to services",
      description: "<p>Path-based routes forward traffic to the appropriate backend.</p>",
      code: "# application.yml\n" +
        "spring:\n" +
        "  cloud:\n" +
        "    gateway:\n" +
        "      routes:\n" +
        "        - id: orders\n" +
        "          uri: lb://order-service        # 'lb://' = load-balanced via discovery\n" +
        "          predicates:\n" +
        "            - Path=/api/orders/**        # this path -> order-service\n" +
        "        - id: payments\n" +
        "          uri: lb://payment-service\n" +
        "          predicates:\n" +
        "            - Path=/api/payments/**"
    },
    {
      title: "Example 2: Applying a cross-cutting filter",
      description: "<p>Centralize concerns like rate limiting or header rewriting at the gateway.</p>",
      code: "        - id: orders\n" +
        "          uri: lb://order-service\n" +
        "          predicates: [ Path=/api/orders/** ]\n" +
        "          filters:\n" +
        "            - StripPrefix=2                        # drop /api/orders\n" +
        "            - AddRequestHeader=X-Gateway, true\n" +
        "            - name: RequestRateLimiter             # throttle here, once, for all\n" +
        "// Auth, rate limiting, CORS done at the edge instead of in every service."
    }
  ],
  whenToUse: "<p>Use an API gateway when you have multiple microservices and want a single, controlled entry " +
    "point &mdash; to hide your internal service topology from clients, enforce auth/rate-limiting/CORS in " +
    "one place, and route or aggregate requests. It's standard in microservice architectures. " +
    "<strong>Trade-offs:</strong> the gateway is a critical piece of infrastructure and a potential single " +
    "point of failure and bottleneck, so it must be highly available and not become a 'god component' " +
    "stuffed with business logic (keep it to routing and cross-cutting concerns). Don't over-engineer with a " +
    "gateway for a single service or a small system &mdash; it adds a network hop and operational burden. " +
    "Also note that on Kubernetes, an Ingress controller or service mesh may already provide much of this; " +
    "avoid stacking redundant layers.</p>"
};

C["cloud-config"] = {
  summary: "<p><strong>Spring Cloud Config</strong> provides <strong>centralized, externalized configuration</strong> " +
    "for distributed systems. Instead of each microservice carrying its own copy of config (and you editing " +
    "and redeploying many services to change one value), a <strong>Config Server</strong> serves " +
    "configuration from a central source &mdash; commonly a Git repository &mdash; and each service fetches " +
    "its settings at startup (and can refresh them at runtime). This gives you one place to manage " +
    "environment-specific properties across all services, with versioning (via Git history), and the ability " +
    "to change configuration without rebuilding services.</p>",
  examples: [
    {
      title: "Example 1: A Config Server backed by Git",
      description: "<p>One server serves all services' config from a versioned Git repo.</p>",
      code: "@SpringBootApplication\n" +
        "@EnableConfigServer             // this app IS the central config server\n" +
        "public class ConfigServerApp { /* main */ }\n" +
        "\n" +
        "# its application.yml points at the config repo\n" +
        "spring:\n" +
        "  cloud:\n" +
        "    config:\n" +
        "      server:\n" +
        "        git:\n" +
        "          uri: https://github.com/myorg/service-configs"
    },
    {
      title: "Example 2: A client fetching its config",
      description: "<p>A service pulls <code>order-service.yml</code> from the server at startup.</p>",
      code: "# A client service's config\n" +
        "spring:\n" +
        "  application:\n" +
        "    name: order-service           # -> server serves 'order-service.yml'\n" +
        "  config:\n" +
        "    import: optional:configserver:http://config-server:8888\n" +
        "// Change the value in Git -> POST /actuator/refresh to apply without restart."
    }
  ],
  whenToUse: "<p>Centralized config is valuable when you run many services or many instances and want a single, " +
    "auditable place to manage their settings &mdash; changing a value once instead of editing every service, " +
    "with Git giving you version history and rollback. It pairs naturally with the rest of Spring Cloud. " +
    "<strong>Trade-offs and gotchas:</strong> the Config Server becomes a critical dependency &mdash; if it's " +
    "down at startup, services may fail to boot (use fallback/retry and treat it as highly available). " +
    "<strong>Secrets are a real concern:</strong> don't store plaintext passwords in a config Git repo &mdash; " +
    "use encryption or a dedicated secrets manager (Vault). On Kubernetes, ConfigMaps and Secrets often cover " +
    "this need natively, so consider whether you need Spring Cloud Config at all. For a single service or a " +
    "small app, plain <code>application.yml</code> + environment variables is simpler.</p>"
};

C["spring-cloud-circuit-breaker"] = {
  summary: "<p>A <strong>circuit breaker</strong> is a resilience pattern that prevents failures in one " +
    "service from cascading through the system. When calls to a remote dependency start failing repeatedly, " +
    "the breaker 'trips' (opens) and immediately fails fast (or returns a fallback) instead of letting every " +
    "request hang waiting on the broken dependency &mdash; giving it time to recover. After a cooldown it " +
    "lets a trial request through (half-open) and closes again if healthy. <strong>Spring Cloud Circuit " +
    "Breaker</strong> is an abstraction over implementations like <strong>Resilience4j</strong>, providing " +
    "circuit breaking plus related patterns (retry, rate limiting, bulkhead, timeouts).</p>",
  examples: [
    {
      title: "Example 1: Wrapping a remote call with a fallback",
      description: "<p>If the dependency fails, return a sensible fallback instead of hanging or erroring.</p>",
      code: "@Service\n" +
        "class InventoryClient {\n" +
        "    @CircuitBreaker(name = \"inventory\", fallbackMethod = \"fallback\")\n" +
        "    public Stock check(Long productId) {\n" +
        "        return restClient.get()... // remote call that might fail/timeout\n" +
        "    }\n" +
        "    // called when the breaker is open or the call fails\n" +
        "    Stock fallback(Long productId, Throwable t) {\n" +
        "        return Stock.unknown();    // degrade gracefully, don't crash\n" +
        "    }\n" +
        "}"
    },
    {
      title: "Example 2: The breaker's states",
      description: "<p>How the circuit breaker protects the system over time.</p>",
      code: "// CLOSED   -> calls flow normally; failures are counted\n" +
        "// (failure rate exceeds threshold)\n" +
        "// OPEN     -> calls fail fast / hit fallback immediately (no waiting)\n" +
        "// (after a wait duration)\n" +
        "// HALF-OPEN-> allow a few trial calls; if they succeed -> CLOSED, else -> OPEN\n" +
        "// Result: a struggling dependency can't drag the whole system down."
    }
  ],
  whenToUse: "<p>Use a circuit breaker around <strong>any synchronous call to a remote dependency</strong> that " +
    "could be slow or unavailable &mdash; other microservices, third-party APIs, databases. It's essential in " +
    "distributed systems to prevent one slow service from exhausting threads and cascading into a total " +
    "outage. Combine it with <strong>timeouts</strong> (a circuit breaker without timeouts still lets calls " +
    "hang) and consider retries with backoff and bulkheads. <strong>Gotchas:</strong> design meaningful " +
    "<em>fallbacks</em> &mdash; returning stale/default data or a clear degraded response is the point; a " +
    "fallback that just rethrows defeats the purpose. Tune thresholds carefully: too sensitive and it trips " +
    "on normal blips; too lax and it doesn't protect you. And make sure retries don't amplify load on an " +
    "already-struggling service (retry storms).</p>"
};

C["spring-cloud-open-feign"] = {
  summary: "<p><strong>Spring Cloud OpenFeign</strong> lets you call other HTTP services by writing a simple " +
    "<strong>declarative interface</strong> &mdash; you define a Java interface with annotations describing " +
    "the remote endpoints, and Feign generates the HTTP client implementation at runtime. Instead of " +
    "manually building requests with a <code>RestClient</code>/<code>WebClient</code>, you just call a method " +
    "on the interface. It integrates with service discovery (call services by name, load-balanced) and with " +
    "circuit breakers, making inter-service communication concise and consistent across a microservices " +
    "codebase.</p>",
  examples: [
    {
      title: "Example 1: A declarative HTTP client",
      description: "<p>Describe the remote API as an interface; Feign implements the calls.</p>",
      code: "@FeignClient(name = \"payment-service\")   // resolved via service discovery\n" +
        "interface PaymentClient {\n" +
        "    @PostMapping(\"/charges\")\n" +
        "    Receipt charge(@RequestBody ChargeRequest req);\n" +
        "\n" +
        "    @GetMapping(\"/charges/{id}\")\n" +
        "    Receipt get(@PathVariable(\"id\") String id);\n" +
        "}\n" +
        "// Enable with @EnableFeignClients. Then just inject and call it:\n" +
        "//   receipt = paymentClient.charge(req);  // no manual HTTP code"
    },
    {
      title: "Example 2: Compared to a manual client",
      description: "<p>Feign removes the request-building boilerplate.</p>",
      code: "// WITHOUT Feign: build URL, method, headers, body, parse response yourself\n" +
        "// var receipt = restClient.post().uri(\"http://payment-service/charges\")\n" +
        "//      .body(req).retrieve().body(Receipt.class);\n" +
        "\n" +
        "// WITH Feign: the interface IS the client\n" +
        "// var receipt = paymentClient.charge(req);"
    }
  ],
  whenToUse: "<p>Use OpenFeign in microservice systems to make inter-service HTTP calls clean and uniform, " +
    "especially when combined with Eureka (call by service name) and circuit breakers (declarative " +
    "resilience). It reduces boilerplate and keeps remote API contracts readable as interfaces. " +
    "<strong>Trade-offs and gotchas:</strong> Feign is traditionally blocking/synchronous &mdash; for " +
    "high-concurrency or reactive stacks, <code>WebClient</code> may fit better (a reactive Feign exists but " +
    "is less common). The declarative simplicity can hide network reality: always pair Feign clients with " +
    "<strong>timeouts and circuit breakers</strong>, because a hidden remote call that hangs is just as " +
    "dangerous as an explicit one. Also, sharing the client interface between provider and consumer can " +
    "couple them &mdash; manage your API contracts deliberately. Note Spring also offers native declarative " +
    "HTTP interfaces now, which overlap with Feign.</p>"
};

C["micrometer"] = {
  summary: "<p><strong>Micrometer</strong> is a vendor-neutral <strong>application metrics</strong> facade " +
    "for the JVM &mdash; think 'SLF4J but for metrics'. You instrument your code against Micrometer's API " +
    "(counters, gauges, timers, distribution summaries), and it exports those metrics to whatever monitoring " +
    "system you use (Prometheus, Datadog, New Relic, CloudWatch, etc.) without changing your code. Spring " +
    "Boot Actuator uses Micrometer under the hood, so you get a wealth of metrics (HTTP request timings, JVM " +
    "memory, GC, datasource pools) automatically, plus easy custom metrics. It also underpins distributed " +
    "tracing via Micrometer Tracing.</p>",
  examples: [
    {
      title: "Example 1: Custom metrics with the registry",
      description: "<p>Record business metrics that flow to your monitoring backend.</p>",
      code: "@Service\n" +
        "class OrderService {\n" +
        "    private final Counter ordersPlaced;\n" +
        "    OrderService(MeterRegistry registry) {\n" +
        "        this.ordersPlaced = registry.counter(\"orders.placed\");\n" +
        "    }\n" +
        "    void place(Order o) {\n" +
        "        /* ... */\n" +
        "        ordersPlaced.increment();   // exported to Prometheus/Datadog/etc.\n" +
        "    }\n" +
        "}"
    },
    {
      title: "Example 2: Timing and exporting to Prometheus",
      description: "<p>Measure durations and expose them on an actuator endpoint to be scraped.</p>",
      code: "// Time a block of work\n" +
        "Timer timer = registry.timer(\"report.generation\");\n" +
        "timer.record(() -> generateReport());\n" +
        "\n" +
        "// Add the Prometheus registry dependency + actuator, then:\n" +
        "//   management.endpoints.web.exposure.include=prometheus\n" +
        "//   Prometheus scrapes GET /actuator/prometheus"
    }
  ],
  whenToUse: "<p>Use Micrometer (via Actuator) on every production service to get observability &mdash; request " +
    "latencies, error rates, throughput, JVM health &mdash; and add custom metrics for business-meaningful " +
    "events (orders placed, payments failed, queue depth). Its vendor-neutrality means you can switch " +
    "monitoring backends without re-instrumenting. <strong>Gotchas:</strong> beware <strong>high-cardinality " +
    "tags</strong> &mdash; adding a tag with unbounded distinct values (like a user ID or full URL with IDs) " +
    "creates an explosion of time series that can overwhelm your metrics backend and your bill; keep tag " +
    "values bounded (status codes, route templates, not raw paths). Don't over-instrument trivial code, and " +
    "remember metrics answer 'what/how much' while logs and traces answer 'why' &mdash; use them together. " +
    "Default Boot+Micrometer metrics already cover a lot, so start there before adding custom ones.</p>"
};

C["eureka"] = {
  summary: "<p><strong>Netflix Eureka</strong> is a <strong>service discovery</strong> server. In a dynamic " +
    "microservices environment, service instances come and go and their network locations change, so " +
    "hard-coding URLs doesn't work. With Eureka, each service <em>registers</em> itself with the registry on " +
    "startup and sends heartbeats; other services <em>discover</em> available instances by logical name and " +
    "call them (typically load-balanced across instances). This decouples services from each other's physical " +
    "addresses and enables elastic scaling. Spring Cloud integrates Eureka so a service becomes a client with " +
    "an annotation and a property.</p>",
  examples: [
    {
      title: "Example 1: A Eureka server and a registering client",
      description: "<p>Stand up the registry, then have services register with it.</p>",
      code: "// THE REGISTRY\n" +
        "@SpringBootApplication\n" +
        "@EnableEurekaServer\n" +
        "public class DiscoveryServerApp { /* main */ }\n" +
        "\n" +
        "// A CLIENT service\n" +
        "@SpringBootApplication\n" +
        "@EnableDiscoveryClient          // register + enable discovery\n" +
        "public class OrderServiceApp { /* main */ }\n" +
        "// eureka.client.service-url.defaultZone=http://discovery:8761/eureka"
    },
    {
      title: "Example 2: Calling a service by name",
      description: "<p>Reference other services by their registered name, not an IP/port.</p>",
      code: "// With discovery + load balancing, call by logical service name:\n" +
        "@FeignClient(name = \"payment-service\")    // Eureka resolves real instances\n" +
        "interface PaymentClient { /* ... */ }\n" +
        "\n" +
        "// Or with a load-balanced RestClient/WebClient:\n" +
        "//   restClient.get().uri(\"http://payment-service/charges/1\")...\n" +
        "// 'payment-service' -> an actual healthy instance, chosen automatically."
    }
  ],
  whenToUse: "<p>Use service discovery like Eureka when you run multiple, dynamically-scaled service instances " +
    "whose addresses aren't fixed &mdash; classic microservices on VMs or non-orchestrated environments. It " +
    "removes hard-coded URLs and enables load balancing and elasticity. <strong>Important context:</strong> " +
    "Eureka is part of the Netflix OSS stack that's now largely in maintenance mode, and if you deploy on " +
    "<strong>Kubernetes, you usually don't need Eureka at all</strong> &mdash; Kubernetes provides service " +
    "discovery natively via Services and DNS. So evaluate your platform first; running Eureka alongside " +
    "Kubernetes' own discovery is redundant complexity. <strong>Gotchas:</strong> the registry should be " +
    "highly available (run multiple instances), and registration/heartbeat timing means there's a brief " +
    "window where a dead instance may still appear registered &mdash; combine discovery with health checks " +
    "and circuit breakers for robustness.</p>"
};

/* ======================================================================
   SECTION 10 — SPRING MVC
   ====================================================================== */

C["spring-mvc"] = {
  summary: "<p><strong>Spring MVC</strong> is Spring's servlet-based web framework, built on the Java Servlet " +
    "API. At its core is the <strong>DispatcherServlet</strong> &mdash; a 'front controller' that receives " +
    "every HTTP request and orchestrates handling it: it consults <strong>handler mappings</strong> to find " +
    "the right controller method, invokes it (binding request data to method parameters), and then turns the " +
    "return value into a response &mdash; either by rendering a <strong>view</strong> (server-side HTML) or " +
    "serializing data to JSON (for REST). This section digs into the lower-level building blocks: servlets, " +
    "the MVC components, and view technologies like JSP.</p>",
  examples: [
    {
      title: "Example 1: The DispatcherServlet flow",
      description: "<p>Every request passes through the front controller, which delegates to your handler.</p>",
      code: "// Request lifecycle in Spring MVC:\n" +
        "// 1. DispatcherServlet receives the request (the single front controller)\n" +
        "// 2. HandlerMapping picks the controller method for the URL + HTTP verb\n" +
        "// 3. HandlerAdapter invokes it, binding params (@PathVariable, @RequestBody...)\n" +
        "// 4a. REST: return value -> HttpMessageConverter -> JSON\n" +
        "// 4b. Web: return a view name -> ViewResolver -> render HTML (e.g. JSP/Thymeleaf)"
    },
    {
      title: "Example 2: Controller for views vs data",
      description: "<p>The same framework serves rendered pages or raw data depending on the controller type.</p>",
      code: "@Controller                      // returns VIEW names (server-rendered HTML)\n" +
        "class PageController {\n" +
        "    @GetMapping(\"/dashboard\")\n" +
        "    String dashboard(Model model) {\n" +
        "        model.addAttribute(\"user\", currentUser());\n" +
        "        return \"dashboard\";        // resolved to a template (e.g. dashboard.html)\n" +
        "    }\n" +
        "}\n" +
        "\n" +
        "@RestController                  // returns DATA (serialized to JSON)\n" +
        "class ApiController {\n" +
        "    @GetMapping(\"/api/user\") User user() { return currentUser(); }\n" +
        "}"
    }
  ],
  whenToUse: "<p>Spring MVC is the default for building web endpoints and REST APIs in Spring Boot &mdash; use " +
    "it for nearly any synchronous HTTP service. Use <code>@RestController</code> for JSON APIs (the common " +
    "case today) and <code>@Controller</code> + a template engine when you render HTML server-side. " +
    "<strong>Trade-offs:</strong> Spring MVC uses the blocking, thread-per-request servlet model &mdash; " +
    "simple and ideal for most apps. For very high concurrency or streaming where non-blocking I/O matters, " +
    "Spring WebFlux (reactive) is the alternative, but it's significantly more complex, so adopt it only with " +
    "a concrete need. Knowing the DispatcherServlet flow helps you debug routing issues, customize behavior " +
    "(interceptors, argument resolvers, exception handlers), and understand error messages.</p>"
};

C["servlet"] = {
  summary: "<p>A <strong>Servlet</strong> is the foundational Java standard for handling HTTP requests on the " +
    "server &mdash; a class that receives a request and produces a response, managed by a servlet container " +
    "(like Tomcat). Spring MVC is built <em>on top of</em> the Servlet API: its <code>DispatcherServlet</code> " +
    "is itself a servlet that delegates to your controllers, so you rarely write raw servlets anymore. " +
    "Understanding servlets, though, demystifies what Spring is doing &mdash; the request/response objects, " +
    "the container lifecycle, and especially <strong>filters</strong> (which Spring Security and others use " +
    "to intercept requests before they reach the DispatcherServlet).</p>",
  examples: [
    {
      title: "Example 1: A raw servlet (what Spring abstracts away)",
      description: "<p>The low-level API Spring MVC is built on &mdash; you rarely write this yourself.</p>",
      code: "@WebServlet(\"/hello\")\n" +
        "public class HelloServlet extends HttpServlet {\n" +
        "    protected void doGet(HttpServletRequest req, HttpServletResponse resp)\n" +
        "            throws IOException {\n" +
        "        resp.setContentType(\"text/plain\");\n" +
        "        resp.getWriter().write(\"Hello\");   // manual response writing\n" +
        "    }\n" +
        "}\n" +
        "// Spring MVC replaces this verbosity with @GetMapping methods."
    },
    {
      title: "Example 2: A filter (still very relevant)",
      description: "<p>Filters wrap requests before the DispatcherServlet &mdash; how security/logging hook in.</p>",
      code: "@Component\n" +
        "class RequestLogFilter extends OncePerRequestFilter {\n" +
        "    protected void doFilterInternal(HttpServletRequest req,\n" +
        "            HttpServletResponse res, FilterChain chain)\n" +
        "            throws ServletException, IOException {\n" +
        "        long start = System.currentTimeMillis();\n" +
        "        chain.doFilter(req, res);          // continue down the chain\n" +
        "        log.info(req.getRequestURI() + \" took \" + (System.currentTimeMillis() - start));\n" +
        "    }\n" +
        "}"
    }
  ],
  whenToUse: "<p>You'll almost never write raw servlets in modern Spring Boot &mdash; <code>@RestController</code>/" +
    "<code>@Controller</code> methods are far more productive. The value of understanding servlets is " +
    "<em>conceptual</em>: it explains how Spring MVC works under the hood and where the request actually " +
    "enters. Where the Servlet API is still directly useful is <strong>filters</strong> &mdash; for " +
    "cross-cutting request handling (logging, security, CORS, rate limiting, request wrapping) that needs to " +
    "run before/around the entire MVC machinery. <strong>Gotcha:</strong> know the difference between a " +
    "servlet <em>filter</em> (runs for all requests, even before Spring MVC) and a Spring MVC " +
    "<em>interceptor</em> (runs within the DispatcherServlet, with access to the matched handler) &mdash; " +
    "choosing the wrong one is a common mistake. Also relevant: Servlet 3.1+ async and the move toward " +
    "reactive stacks.</p>"
};

C["jsp-files"] = {
  summary: "<p><strong>JSP (JavaServer Pages)</strong> is an older server-side <strong>view technology</strong> " +
    "for generating HTML: a JSP file is HTML with embedded Java/JSP tags that the server processes to produce " +
    "the final page, populated with data the controller passed in. In a server-rendered Spring MVC app, the " +
    "controller returns a view name, a <code>ViewResolver</code> maps it to a JSP, and the JSP renders. JSP " +
    "is largely <strong>legacy</strong> today &mdash; Spring Boot doesn't recommend it (it works awkwardly " +
    "with embedded servers and fat JARs), and modern apps use <strong>Thymeleaf</strong> for server-side " +
    "rendering, or a separate JavaScript front-end consuming a REST API.</p>",
  examples: [
    {
      title: "Example 1: A controller rendering a view",
      description: "<p>The controller supplies data; the view template renders it into HTML.</p>",
      code: "@Controller\n" +
        "class ProfileController {\n" +
        "    @GetMapping(\"/profile\")\n" +
        "    String profile(Model model) {\n" +
        "        model.addAttribute(\"name\", \"Sam\");\n" +
        "        return \"profile\";   // resolves to a view (profile.jsp or profile.html)\n" +
        "    }\n" +
        "}\n" +
        "\n" +
        "<!-- profile.jsp: HTML + tags, server fills in the data -->\n" +
        "<h1>Hello, ${name}</h1>"
    },
    {
      title: "Example 2: The modern preference (Thymeleaf)",
      description: "<p>Spring Boot favors Thymeleaf over JSP for new server-rendered apps.</p>",
      code: "<!-- profile.html (Thymeleaf): natural HTML, works with fat JARs -->\n" +
        "<h1 th:text=\"'Hello, ' + ${name}\">Hello, placeholder</h1>\n" +
        "<!-- Add spring-boot-starter-thymeleaf; templates live in src/main/resources/templates -->\n" +
        "// JSP, by contrast, needs a WAR + extra config to work with embedded Tomcat."
    }
  ],
  whenToUse: "<p>Honestly, for <strong>new</strong> Spring Boot projects you should generally <em>not</em> " +
    "choose JSP &mdash; it predates Boot's embedded-server model, requires a WAR packaging and extra " +
    "configuration to work, and lacks the conveniences of modern engines. You'll encounter JSP mainly when " +
    "<strong>maintaining legacy applications</strong>. For new server-side rendering, prefer " +
    "<strong>Thymeleaf</strong> (Boot's recommended templating engine, works cleanly with fat JARs and has " +
    "great Spring integration); for rich interactive UIs, build a separate SPA (React/Vue/Angular) that " +
    "consumes your REST API. <strong>If you must use JSP</strong> (legacy constraints), be aware of the " +
    "packaging caveats and avoid putting business logic (scriptlets) in the page &mdash; keep views dumb and " +
    "logic in controllers/services.</p>"
};

C["components"] = {
  summary: "<p>Spring MVC processes requests through a set of collaborating <strong>components</strong>, each " +
    "with a defined role: the <strong>DispatcherServlet</strong> (front controller), <strong>HandlerMapping</strong> " +
    "(finds which controller handles a request), <strong>HandlerAdapter</strong> (invokes it), " +
    "<strong>Controllers</strong> (your code), <strong>HttpMessageConverters</strong> (serialize/deserialize " +
    "bodies, e.g. JSON&harr;objects), <strong>ViewResolver</strong> + <strong>View</strong> (render HTML), " +
    "and <strong>HandlerInterceptors</strong> (pre/post hooks). Spring also provides supporting pieces like " +
    "argument resolvers (turn request data into method parameters) and exception handlers. Knowing these " +
    "components is what lets you customize and debug the framework.</p>",
  examples: [
    {
      title: "Example 1: Interceptors — pre/post request hooks",
      description: "<p>An interceptor runs around handler execution, within the MVC pipeline.</p>",
      code: "@Component\n" +
        "class AuthInterceptor implements HandlerInterceptor {\n" +
        "    public boolean preHandle(HttpServletRequest req, HttpServletResponse res,\n" +
        "                             Object handler) {\n" +
        "        if (!isAuthorized(req)) { res.setStatus(403); return false; } // stop here\n" +
        "        return true;   // continue to the controller\n" +
        "    }\n" +
        "}\n" +
        "// Registered via WebMvcConfigurer.addInterceptors(...)"
    },
    {
      title: "Example 2: Centralized exception handling",
      description: "<p>A controller advice turns exceptions into consistent HTTP responses.</p>",
      code: "@RestControllerAdvice            // applies across all controllers\n" +
        "class ApiExceptionHandler {\n" +
        "    @ExceptionHandler(NotFoundException.class)\n" +
        "    ResponseEntity<ApiError> handle(NotFoundException ex) {\n" +
        "        return ResponseEntity.status(404).body(new ApiError(ex.getMessage()));\n" +
        "    }\n" +
        "}\n" +
        "// One place to map exceptions -> HTTP status + error body."
    }
  ],
  whenToUse: "<p>You interact with these components whenever you go beyond basic request mapping: add an " +
    "<strong>interceptor</strong> for cross-cutting pre/post-handler logic (auth checks, logging, adding " +
    "common model data), a <strong>@ControllerAdvice</strong> for centralized exception handling and " +
    "consistent error responses, custom <strong>message converters</strong> for non-JSON formats, or custom " +
    "<strong>argument resolvers</strong> to inject derived values into controller methods. " +
    "<strong>Gotchas:</strong> distinguish a Spring MVC <em>interceptor</em> (inside the DispatcherServlet, " +
    "knows the handler, ideal for app-level concerns) from a servlet <em>filter</em> (outside MVC, runs for " +
    "everything including static resources, where security operates) &mdash; pick the right layer. Mostly, " +
    "Boot's defaults are sensible; customize these components deliberately when you have a real need rather " +
    "than reconfiguring the pipeline preemptively.</p>"
};

/* ======================================================================
   SECTION 11 — TESTING
   ====================================================================== */

C["testing"] = {
  summary: "<p>Spring Boot has first-class <strong>testing</strong> support, built around a testing pyramid: " +
    "many fast <strong>unit tests</strong> (plain JUnit + Mockito, no Spring context), fewer <strong>slice " +
    "tests</strong> that load just part of the application (e.g. only the web layer or only JPA), and a few " +
    "full <strong>integration tests</strong> that boot the whole context. The <code>spring-boot-starter-test</code> " +
    "bundles JUnit 5, Mockito, AssertJ, and Spring Test. Key tools: <code>@SpringBootTest</code> (full " +
    "context), slice annotations like <code>@WebMvcTest</code> and <code>@DataJpaTest</code>, " +
    "<code>MockMvc</code> (test controllers without a real server), and mocking with " +
    "<code>@MockBean</code>/<code>@MockitoBean</code>.</p>",
  examples: [
    {
      title: "Example 1: A fast unit test (no Spring)",
      description: "<p>Most tests should be plain and fast &mdash; just construct the class and verify behavior.</p>",
      code: "@Test\n" +
        "void appliesBulkDiscount() {\n" +
        "    PricingService service = new PricingService();    // no Spring context\n" +
        "    BigDecimal result = service.total(new BigDecimal(\"200\"));\n" +
        "    assertThat(result).isEqualByComparingTo(\"180\"); // AssertJ assertion\n" +
        "}\n" +
        "// Milliseconds to run; no container, no DB, no web server."
    },
    {
      title: "Example 2: Choosing the right test type",
      description: "<p>Match the test scope to what you're verifying.</p>",
      code: "// Pure logic            -> plain JUnit (no annotation)\n" +
        "// Controller/web layer   -> @WebMvcTest + MockMvc\n" +
        "// JPA repository/queries  -> @DataJpaTest (in-memory or Testcontainers DB)\n" +
        "// Whole app wired together-> @SpringBootTest (slowest; use sparingly)\n" +
        "// Replace a collaborator  -> @MockBean / @MockitoBean"
    }
  ],
  whenToUse: "<p>Test at the lowest level that gives you confidence: prefer fast plain-JUnit unit tests for " +
    "business logic, <strong>slice tests</strong> when you need a focused part of Spring (web or persistence), " +
    "and reserve full <code>@SpringBootTest</code> for genuine end-to-end integration checks. This keeps the " +
    "suite fast and the feedback loop tight. <strong>Gotchas:</strong> the biggest mistake is reaching for " +
    "<code>@SpringBootTest</code> for everything &mdash; booting the full context for every test makes the " +
    "suite slow and brittle, defeating its purpose. Be aware each distinct context configuration is cached " +
    "but a new combination triggers a fresh (slow) startup, so minimize variety. For database tests, an " +
    "in-memory DB (H2) is fast but can mask real-DB behavior; <strong>Testcontainers</strong> (a real DB in " +
    "Docker) gives higher fidelity. Keep tests independent and deterministic.</p>"
};

C["springboottest-annotation"] = {
  summary: "<p><strong><code>@SpringBootTest</code></strong> bootstraps the <em>full</em> Spring application " +
    "context for a test &mdash; it loads all your beans, auto-configuration, and (optionally) starts an " +
    "embedded server &mdash; so you can test the application as a wired-together whole, the way it runs in " +
    "production. It's the most comprehensive (and slowest) test type, used for integration tests that verify " +
    "multiple layers cooperating. You can control how much it loads and whether a real port is used via its " +
    "<code>webEnvironment</code> attribute. It's the right tool when a focused slice test isn't enough to " +
    "exercise the real interactions.</p>",
  examples: [
    {
      title: "Example 1: A full integration test with a real server",
      description: "<p>Boot the whole app on a random port and call it over real HTTP.</p>",
      code: "@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)\n" +
        "class OrderApiIntegrationTest {\n" +
        "    @Autowired TestRestTemplate rest;   // a real HTTP client to the running app\n" +
        "\n" +
        "    @Test void createsOrder() {\n" +
        "        var resp = rest.postForEntity(\"/api/orders\", new OrderRequest(...), Order.class);\n" +
        "        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.CREATED);\n" +
        "    }\n" +
        "}"
    },
    {
      title: "Example 2: Full context without a web server",
      description: "<p>Load all beans to test service+repository wiring, no HTTP overhead.</p>",
      code: "@SpringBootTest   // webEnvironment defaults to MOCK (no real port)\n" +
        "class OrderServiceIntegrationTest {\n" +
        "    @Autowired OrderService service;   // the REAL, fully-wired service\n" +
        "    @Test void placesAndPersistsOrder() {\n" +
        "        Order o = service.place(new OrderRequest(...)); // hits real repo/DB\n" +
        "        assertThat(o.getId()).isNotNull();\n" +
        "    }\n" +
        "}"
    }
  ],
  whenToUse: "<p>Use <code>@SpringBootTest</code> for true <strong>integration tests</strong> where you need " +
    "many real components working together &mdash; verifying the wiring, configuration, and end-to-end flows " +
    "that slice tests can't cover. <strong>Use it sparingly:</strong> it's the slowest option because it " +
    "loads the entire context, so don't make it your default &mdash; most tests should be plain unit tests or " +
    "narrow slice tests (<code>@WebMvcTest</code>, <code>@DataJpaTest</code>). <strong>Gotchas:</strong> " +
    "Spring caches the context across tests with identical configuration, but each different setup (e.g. " +
    "varying <code>@MockBean</code>s, properties, or active profiles) spawns a new, slow context &mdash; so " +
    "keep configurations consistent to reuse the cache. For external dependencies (DB, message broker), pair " +
    "it with Testcontainers for realistic, isolated infrastructure rather than mocking everything.</p>"
};

C["mockbean-annotation"] = {
  summary: "<p><strong><code>@MockBean</code></strong> (and its newer equivalent <code>@MockitoBean</code> in " +
    "recent Spring versions) replaces a bean in the Spring test context with a <strong>Mockito mock</strong>. " +
    "When a test loads a Spring context but you want to isolate the code under test from a particular " +
    "collaborator &mdash; a slow external service, an unpredictable dependency, or a layer you don't want to " +
    "exercise &mdash; <code>@MockBean</code> swaps the real bean for a controllable fake whose behavior you " +
    "define with <code>when(...).thenReturn(...)</code>. It's the bridge between Spring's context and " +
    "Mockito's mocking, central to writing focused slice and integration tests.</p>",
  examples: [
    {
      title: "Example 1: Mocking a dependency in a web slice test",
      description: "<p>Test the controller while replacing the service with a mock.</p>",
      code: "@WebMvcTest(OrderController.class)   // loads ONLY the web layer\n" +
        "class OrderControllerTest {\n" +
        "    @Autowired MockMvc mvc;\n" +
        "    @MockBean OrderService service;  // real OrderService is replaced by a mock\n" +
        "\n" +
        "    @Test void returnsOrder() throws Exception {\n" +
        "        when(service.find(1L)).thenReturn(new Order(1L));   // program the mock\n" +
        "        mvc.perform(get(\"/api/orders/1\"))\n" +
        "           .andExpect(status().isOk());\n" +
        "    }\n" +
        "}"
    },
    {
      title: "Example 2: Replacing an external dependency",
      description: "<p>Mock a slow/unreliable collaborator so the test is fast and deterministic.</p>",
      code: "@SpringBootTest\n" +
        "class CheckoutTest {\n" +
        "    @MockBean PaymentGateway gateway;   // don't call the real payment API\n" +
        "    @Autowired CheckoutService checkout;\n" +
        "\n" +
        "    @Test void completesCheckout() {\n" +
        "        when(gateway.charge(any())).thenReturn(Receipt.ok());\n" +
        "        assertThat(checkout.complete(cart)).isTrue();\n" +
        "    }\n" +
        "}"
    }
  ],
  whenToUse: "<p>Use <code>@MockBean</code> in tests that <em>need a Spring context</em> but should isolate the " +
    "code under test from specific beans &mdash; mocking the service in a <code>@WebMvcTest</code>, or " +
    "stubbing out an external gateway/third-party client in an integration test so it's fast and " +
    "deterministic. <strong>Gotchas:</strong> each unique set of <code>@MockBean</code>s changes the context " +
    "configuration, which <em>defeats Spring's context caching</em> and adds slow restarts &mdash; so don't " +
    "scatter different mocks across many test classes carelessly. For pure unit tests that don't load Spring " +
    "at all, prefer plain Mockito (<code>@Mock</code> / <code>mock()</code>) &mdash; it's faster and " +
    "<code>@MockBean</code> would needlessly pull in the context. Note also the migration: newer Spring Boot " +
    "deprecates <code>@MockBean</code> in favor of <code>@MockitoBean</code>, so check your version. " +
    "Over-mocking is a smell &mdash; if you mock everything, the test may verify nothing real.</p>"
};

C["mock-mvc"] = {
  summary: "<p><strong>MockMvc</strong> lets you test Spring MVC controllers by simulating HTTP requests " +
    "<em>without</em> starting a real server or opening a network port. It drives the full Spring MVC " +
    "machinery (routing, argument binding, validation, serialization, exception handling) in-process, so you " +
    "get realistic controller behavior with the speed of an in-memory test. You build a request " +
    "(method, path, headers, body), perform it, and assert on the response (status, headers, JSON content). " +
    "It's the standard tool for testing the web layer, typically combined with <code>@WebMvcTest</code> " +
    "(controller slice) or <code>@SpringBootTest</code> + <code>@AutoConfigureMockMvc</code>.</p>",
  examples: [
    {
      title: "Example 1: Testing a GET endpoint",
      description: "<p>Perform a request in-process and assert on the JSON response.</p>",
      code: "@WebMvcTest(ProductController.class)\n" +
        "class ProductControllerTest {\n" +
        "    @Autowired MockMvc mvc;\n" +
        "    @MockBean ProductService service;\n" +
        "\n" +
        "    @Test void getsProduct() throws Exception {\n" +
        "        when(service.find(1L)).thenReturn(new Product(1L, \"Mug\"));\n" +
        "        mvc.perform(get(\"/api/products/1\"))\n" +
        "           .andExpect(status().isOk())\n" +
        "           .andExpect(jsonPath(\"$.name\").value(\"Mug\")); // assert JSON body\n" +
        "    }\n" +
        "}"
    },
    {
      title: "Example 2: Testing a POST with a body and validation",
      description: "<p>Send a JSON payload and assert the controller's handling.</p>",
      code: "@Test void rejectsInvalidProduct() throws Exception {\n" +
        "    mvc.perform(post(\"/api/products\")\n" +
        "            .contentType(MediaType.APPLICATION_JSON)\n" +
        "            .content(\"{\\\"name\\\":\\\"\\\"}\"))   // invalid: blank name\n" +
        "       .andExpect(status().isBadRequest());      // validation kicks in\n" +
        "}"
    }
  ],
  whenToUse: "<p>Use MockMvc to test controllers and the web layer &mdash; routing, request/response mapping, " +
    "validation, status codes, JSON structure, and error handling &mdash; quickly and without a running " +
    "server. Pair it with <code>@WebMvcTest</code> to load just the web slice (fast, mock the services " +
    "behind it) for focused controller tests. <strong>Trade-offs and gotchas:</strong> MockMvc tests the " +
    "Spring MVC layer in isolation, not a real HTTP round-trip &mdash; it won't catch issues with the actual " +
    "embedded server, real serialization over the wire, or filters that only apply to real requests. For " +
    "genuine end-to-end HTTP verification, use <code>@SpringBootTest(webEnvironment = RANDOM_PORT)</code> " +
    "with <code>TestRestTemplate</code>/<code>WebTestClient</code> instead. With <code>@WebMvcTest</code>, " +
    "remember the service layer isn't loaded, so you must provide mocks (<code>@MockBean</code>) for the " +
    "controller's dependencies or the context won't start.</p>"
};

C["jpa-test"] = {
  summary: "<p><strong><code>@DataJpaTest</code></strong> is a <strong>test slice</strong> for the persistence " +
    "layer: it loads only JPA-related beans (entities, repositories, the <code>EntityManager</code>, a " +
    "datasource) &mdash; not the web layer or your services &mdash; so you can test repositories and queries " +
    "fast and in isolation. By default it configures an in-memory database, runs each test in a transaction " +
    "that <strong>rolls back</strong> at the end (so tests don't pollute each other), and provides a " +
    "<code>TestEntityManager</code> helper for setting up data. It's the right tool to verify custom queries, " +
    "derived methods, mappings, and constraints actually work against a database.</p>",
  examples: [
    {
      title: "Example 1: Testing a repository query",
      description: "<p>Load only JPA, persist test data, and verify a custom finder.</p>",
      code: "@DataJpaTest                     // only the persistence slice loads\n" +
        "class UserRepositoryTest {\n" +
        "    @Autowired UserRepository repo;\n" +
        "    @Autowired TestEntityManager em;\n" +
        "\n" +
        "    @Test void findsByEmail() {\n" +
        "        em.persist(new User(\"sam@x.com\"));        // arrange data\n" +
        "        Optional<User> found = repo.findByEmail(\"sam@x.com\");\n" +
        "        assertThat(found).isPresent();             // verify the query works\n" +
        "    }\n" +
        "}\n" +
        "// Each test runs in a transaction that rolls back -> clean slate every time."
    },
    {
      title: "Example 2: Using a real database via Testcontainers",
      description: "<p>For fidelity, test against the same DB engine you run in production.</p>",
      code: "@DataJpaTest\n" +
        "@AutoConfigureTestDatabase(replace = NONE)   // don't swap in H2\n" +
        "@Testcontainers\n" +
        "class OrderRepositoryTest {\n" +
        "    @Container static PostgreSQLContainer<?> db = new PostgreSQLContainer<>(\"postgres:16\");\n" +
        "    // Spring points the datasource at the throwaway Postgres container\n" +
        "    // -> queries are validated against REAL Postgres behavior\n" +
        "}"
    }
  ],
  whenToUse: "<p>Use <code>@DataJpaTest</code> to test the data layer in isolation &mdash; verifying custom " +
    "<code>@Query</code> methods, derived query names, entity mappings, relationships, and constraints &mdash; " +
    "without the overhead of loading the whole app. The automatic transaction rollback keeps tests " +
    "independent. <strong>Important gotcha:</strong> the default in-memory database (H2) is fast but " +
    "<em>behaves differently</em> from your production DB (dialect quirks, types, functions, constraints), so " +
    "a query that passes against H2 can fail against real Postgres/MySQL. For anything beyond trivial CRUD, " +
    "prefer <strong>Testcontainers</strong> to run the real database engine in Docker for the test &mdash; " +
    "much higher fidelity. Also note the rollback default means tests don't actually commit, which can hide " +
    "issues that only surface on commit/flush (call <code>flush()</code> when you need to force the SQL to " +
    "execute and validate constraints).</p>"
};
