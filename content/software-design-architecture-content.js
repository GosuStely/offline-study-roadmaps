// Content for the "software-design-architecture" roadmap.
// One entry per topic id (see data/software-design-architecture.js for the list of ids).

window.CONTENT_DATA = window.CONTENT_DATA || {};
window.CONTENT_DATA["software-design-architecture"] = window.CONTENT_DATA["software-design-architecture"] || {};

var C = window.CONTENT_DATA["software-design-architecture"];

C["cqrs"] = {
  summary: "<p><strong>CQRS (Command Query Responsibility Segregation)</strong> is an architectural pattern " +
    "that uses <em>separate models</em> for changing data (the <strong>write/command</strong> side) and " +
    "reading data (the <strong>read/query</strong> side), instead of one model doing both. The command side " +
    "enforces business rules and validation; the read side is optimized for fast, often denormalized " +
    "queries. In its fuller form the two sides use different data stores kept in sync via events, letting " +
    "each scale and evolve independently. It extends the simpler Command-Query Separation principle to the " +
    "architecture level and pairs naturally with Event Sourcing.</p>",
  examples: [
    {
      title: "Example 1: Separate command and query paths",
      description: "<p>Writes flow through a rule-enforcing command handler; reads hit an optimized view.</p>",
      code: "// WRITE side: validate + change state through the domain model\n" +
        "class CancelOrderCommandHandler {\n" +
        "  handle(cmd) {\n" +
        "    const order = this.writeRepo.load(cmd.orderId);\n" +
        "    order.cancel();                 // full business rules here\n" +
        "    this.writeRepo.save(order);\n" +
        "  }\n" +
        "}\n" +
        "\n" +
        "// READ side: no domain rules, just a fast tailored view\n" +
        "class OrderListQuery {\n" +
        "  handle(userId) { return this.readDb.ordersForUserView(userId); }\n" +
        "}"
    },
    {
      title: "Example 2: Read model kept in sync via events",
      description: "<p>The write side emits events; a projection updates the denormalized read store.</p>",
      code: "// After a write, publish what happened\n" +
        "bus.publish('OrderCancelled', { orderId: 42 });\n" +
        "\n" +
        "// A projection updates the read-optimized store (eventually consistent)\n" +
        "bus.subscribe('OrderCancelled', e =>\n" +
        "  readDb.updateOrderView(e.orderId, { status: 'cancelled' }));\n" +
        "// Reads are now fast; the read model lags writes by a short moment."
    },
    {
      title: "Example 3: separate read and write data stores",
      description: "<p>In its fuller form, each side gets a store tuned for its job - a normalized write DB and a denormalized read store.</p>",
      code: "// WRITE store: normalized, transactional (Postgres)\n" +
        "//   orders, order_items, customers (enforces invariants)\n" +
        "// READ store: denormalized, query-optimized (Elasticsearch / a flat view table)\n" +
        "//   order_summary { orderId, customerName, total, status }  // one row, no joins\n" +
        "// Each scales independently: add read replicas without touching the write model."
    },
    {
      title: "Example 4 (edge case): eventual consistency between the two sides",
      description: "<p>The read model lags the write, so a user may not immediately see their own change - the dominant CQRS gotcha.</p>",
      code: "// user cancels order -> write side commits -> read projection updates 200ms later\n" +
        "// immediate refetch of the order list may STILL show 'active'\n" +
        "// Mitigations: optimistic UI (show 'cancelled' locally), read-your-writes from\n" +
        "//   the write side for that user, or a 'processing' state.\n" +
        "// Don't adopt full CQRS for simple CRUD - the consistency complexity isn't worth it."
    }
  ],
  whenToUse: "<p>Reach for CQRS when reads and writes have genuinely different needs &mdash; a very high " +
    "read-to-write ratio, complex reporting/search that a normalized write model serves poorly, or a domain " +
    "where the ideal shape for queries differs sharply from the shape needed to enforce write-time " +
    "invariants. It shines alongside Event Sourcing and in high-scale systems that must scale reads and " +
    "writes separately. <strong>Strong caution:</strong> full CQRS is frequently over-applied. It means two " +
    "models to maintain, synchronization machinery, and <em>eventual consistency</em> (the read side briefly " +
    "lags the write side), which is significant complexity. For typical CRUD, a single model serving both is " +
    "simpler and correct. Adopt the lightweight read/write method separation freely; adopt full CQRS only " +
    "when a concrete scaling or modeling pressure justifies it &mdash; and often only for the specific " +
    "aggregates that need it.</p>"
};

/* ======================================================================
   SECTION 1 — PROGRAMMING PARADIGMS
   ====================================================================== */

C["programming-paradigms"] = {
  summary: "<p>A <strong>programming paradigm</strong> is a style or mental model for structuring code. " +
    "It dictates how you think about state, data, and control flow. The big families are " +
    "<strong>imperative</strong> (tell the computer step-by-step how to do something), " +
    "<strong>object-oriented</strong> (bundle data with the behavior that acts on it), and " +
    "<strong>functional</strong> (build programs by composing pure functions and avoiding shared mutable " +
    "state). Most modern languages are <em>multi-paradigm</em>, so the skill is choosing the right style " +
    "for the problem rather than treating any one as a religion.</p>",
  examples: [
    {
      title: "Example 1: The same task in three paradigms",
      description: "<p>Summing the even numbers in a list, shown imperatively vs functionally. Both are " +
        "correct &mdash; they just express intent differently.</p>",
      code: "// Imperative: describe every step and mutate a running total\n" +
        "let total = 0;\n" +
        "for (let i = 0; i < nums.length; i++) {\n" +
        "  if (nums[i] % 2 === 0) total += nums[i];\n" +
        "}\n" +
        "\n" +
        "// Functional: describe WHAT you want, not the bookkeeping\n" +
        "const total2 = nums\n" +
        "  .filter(n => n % 2 === 0)  // keep evens\n" +
        "  .reduce((sum, n) => sum + n, 0); // fold into a single value"
    },
    {
      title: "Example 2: Object-oriented framing of the same data",
      description: "<p>OOP groups the numbers and the operations on them into one unit.</p>",
      code: "class NumberSet {\n" +
        "  constructor(nums) { this.nums = nums; }\n" +
        "  // behavior lives next to the data it operates on\n" +
        "  sumEvens() {\n" +
        "    return this.nums.filter(n => n % 2 === 0)\n" +
        "                    .reduce((a, b) => a + b, 0);\n" +
        "  }\n" +
        "}\n" +
        "const total = new NumberSet(nums).sumEvens();"
    },
    {
      title: "Example 3: the same task in three paradigms",
      description: "<p>Sum even numbers - imperative (how), object-oriented (objects), functional (transform).</p>",
      code: "// Imperative/structured: explicit loop + mutable accumulator\n" +
        "let sum = 0; for (const n of nums) if (n % 2 === 0) sum += n;\n" +
        "\n" +
        "// Functional: declarative pipeline, no mutation\n" +
        "const sum2 = nums.filter(n => n % 2 === 0).reduce((a, b) => a + b, 0);\n" +
        "\n" +
        "// OOP: behavior attached to an object\n" +
        "class NumberSet { constructor(ns){this.ns=ns;} sumEven(){/* ... */} }"
    },
    {
      title: "Example 4 (edge case): paradigms mix - most code is multi-paradigm",
      description: "<p>Modern languages blend styles; dogmatic purity is usually counterproductive.</p>",
      code: "// Idiomatic TS/Java/C#: OOP for structure, FP for data transforms, imperative\n" +
        "//   for the hot loop. e.g. a class (OOP) whose method uses map/filter (FP):\n" +
        "class Report {\n" +
        "  build(rows) { return rows.filter(r => r.active).map(r => r.total); }\n" +
        "}\n" +
        "// Forcing one paradigm everywhere (pure FP in an OO codebase, or vice versa)\n" +
        "// fights the language and your team. Use the style that fits each problem."
    }
  ],
  whenToUse: "<p>You rarely pick a paradigm in the abstract; the language and codebase usually lean one " +
    "way. The value of knowing several is <em>flexibility</em>: reach for functional style (map/filter/" +
    "reduce, immutability) when transforming data and you want predictable, testable code; reach for OOP " +
    "when you're modeling entities with identity and lifecycle (a <code>User</code>, an <code>Order</code>). " +
    "<strong>Gotcha:</strong> beginners often cargo-cult one style everywhere &mdash; forcing deep class " +
    "hierarchies onto simple data transforms, or writing 200-line pure-functional pipelines no one can read. " +
    "Match the paradigm to the problem.</p>"
};

C["structured-programming"] = {
  summary: "<p><strong>Structured programming</strong> is the foundational discipline (Dijkstra, 1960s) " +
    "of building programs out of three control structures only: <strong>sequence</strong> (one statement " +
    "after another), <strong>selection</strong> (<code>if/else</code>, <code>switch</code>), and " +
    "<strong>iteration</strong> (loops) &mdash; and avoiding arbitrary <code>goto</code> jumps. Each block " +
    "has a single entry and a single exit, which makes code possible to reason about top to bottom. Every " +
    "language you use today is structured by default; the principle survives as 'keep control flow simple " +
    "and predictable.'</p>",
  examples: [
    {
      title: "Example 1: The three building blocks",
      description: "<p>Sequence, selection, and iteration combined in one small routine.</p>",
      code: "function classifyScores(scores) {\n" +
        "  const result = [];            // sequence\n" +
        "  for (const s of scores) {     // iteration\n" +
        "    if (s >= 90) {              // selection\n" +
        "      result.push('A');\n" +
        "    } else if (s >= 70) {\n" +
        "      result.push('B');\n" +
        "    } else {\n" +
        "      result.push('F');\n" +
        "    }\n" +
        "  }\n" +
        "  return result;                // single exit\n" +
        "}"
    },
    {
      title: "Example 2: Guard clauses keep control flow flat",
      description: "<p>Early returns replace deep nesting while staying structured and linear.</p>",
      code: "// Deeply nested (harder to follow)\n" +
        "function priceBad(user) {\n" +
        "  if (user) {\n" +
        "    if (user.active) {\n" +
        "      if (user.premium) { return 0; } else { return 10; }\n" +
        "    }\n" +
        "  }\n" +
        "  return 20;\n" +
        "}\n" +
        "\n" +
        "// Flattened with guard clauses\n" +
        "function price(user) {\n" +
        "  if (!user || !user.active) return 20;\n" +
        "  if (user.premium) return 0;\n" +
        "  return 10;\n" +
        "}"
    },
    {
      title: "Example 3: structured control flow vs goto",
      description: "<p>Structured programming replaced arbitrary jumps with sequence, selection, and iteration - making code analyzable.</p>",
      code: "// Unstructured (goto spaghetti - avoid):\n" +
        "//   if (x) goto cleanup; ... cleanup: free(); \n" +
        "// Structured: the three building blocks\n" +
        "if (cond) { ... } else { ... }     // selection\n" +
        "for (const x of items) { ... }     // iteration\n" +
        "doA(); doB(); doC();               // sequence\n" +
        "// Every function has one entry; control flow is a readable tree, not a web."
    },
    {
      title: "Example 4 (edge case): early returns vs single-exit dogma",
      description: "<p>A modern nuance: structured programming favored single-exit, but guard-clause early returns are now preferred for readability.</p>",
      code: "// Deep nesting (old single-exit style):\n" +
        "function f(u){ let r; if(u){ if(u.active){ r = go(u); } } return r; }\n" +
        "// Guard clauses (clearer): return early, keep the happy path flat\n" +
        "function f2(u){ if(!u) return null; if(!u.active) return null; return go(u); }\n" +
        "// The spirit (analyzable flow) matters more than literal one-return purity."
    }
  ],
  whenToUse: "<p>This isn't something you 'turn on' &mdash; it's the baseline of all modern code. The living " +
    "lesson is to keep control flow shallow and obvious: prefer early-return guards over deeply nested " +
    "<code>if</code>s, avoid clever jumps, and keep each function's path easy to trace. <strong>Trade-off:</strong> " +
    "purists argue for a literal single <code>return</code> per function, but modern practice favors " +
    "<em>guard clauses</em> (multiple early returns) because they reduce nesting and read more clearly. The " +
    "real goal &mdash; predictable, linear control flow &mdash; matters more than the dogma.</p>"
};

C["object-oriented-programming"] = {
  summary: "<p><strong>Object-Oriented Programming (OOP)</strong> organizes software as a collection of " +
    "<strong>objects</strong> &mdash; self-contained units that bundle <em>data</em> (fields/state) with " +
    "the <em>behavior</em> (methods) that operates on it. Objects are created from <strong>classes</strong> " +
    "(blueprints). The paradigm rests on four pillars: <strong>encapsulation</strong>, <strong>abstraction</strong>, " +
    "<strong>inheritance</strong>, and <strong>polymorphism</strong>. The core promise is that by modeling " +
    "real-world concepts as objects, large systems become easier to organize, extend, and reason about.</p>",
  examples: [
    {
      title: "Example 1: A class bundling state and behavior",
      description: "<p>A <code>BankAccount</code> keeps its balance private and exposes safe operations.</p>",
      code: "class BankAccount {\n" +
        "  #balance = 0;                 // state, hidden from outside\n" +
        "\n" +
        "  deposit(amount) {             // behavior tied to the state\n" +
        "    if (amount <= 0) throw new Error('Amount must be positive');\n" +
        "    this.#balance += amount;\n" +
        "  }\n" +
        "  getBalance() { return this.#balance; }\n" +
        "}\n" +
        "\n" +
        "const acc = new BankAccount();\n" +
        "acc.deposit(100);\n" +
        "console.log(acc.getBalance()); // 100 - balance can only change via deposit"
    },
    {
      title: "Example 2: Objects collaborating (each owns its job)",
      description: "<p>An <code>Order</code> delegates to a <code>BankAccount</code> without knowing its internals.</p>",
      code: "class Order {\n" +
        "  constructor(total) { this.total = total; this.paid = false; }\n" +
        "  payWith(account) {\n" +
        "    account.withdraw(this.total); // Order doesn't know HOW withdraw works\n" +
        "    this.paid = true;\n" +
        "  }\n" +
        "}"
    },
    {
      title: "Example 3: the four pillars together",
      description: "<p>Encapsulation, inheritance, polymorphism, and abstraction working in one small example.</p>",
      code: "abstract class Shape {            // abstraction\n" +
        "  abstract area(): number;\n" +
        "}\n" +
        "class Circle extends Shape {     // inheritance\n" +
        "  constructor(private r: number) { super(); }   // encapsulation (private)\n" +
        "  area() { return Math.PI * this.r ** 2; }       // polymorphism (override)\n" +
        "}\n" +
        "const shapes: Shape[] = [new Circle(2)];\n" +
        "shapes.forEach(s => s.area());   // calls the right area() per type"
    },
    {
      title: "Example 4 (edge case): over-engineered OOP",
      description: "<p>OOP can devolve into deep hierarchies, AbstractFactoryFactory patterns, and ceremony that obscures simple logic.</p>",
      code: "// Smell: a 5-level class hierarchy + 3 interfaces to add two numbers.\n" +
        "// Smell: anemic classes that are just data bags with getters/setters (no behavior)\n" +
        "//   -> that's procedural code wearing an OOP costume.\n" +
        "// Prefer composition over deep inheritance, keep hierarchies shallow, and don't\n" +
        "//   model a simple calculation as an object graph. OOP is a tool, not a mandate."
    }
  ],
  whenToUse: "<p>OOP shines when you're modeling a domain full of <em>things with identity and lifecycle</em> " +
    "&mdash; users, orders, invoices, devices &mdash; where state changes over time and you want to guard " +
    "how it changes. It's the default for most business applications and large team codebases because it " +
    "gives natural boundaries for dividing work. <strong>Gotcha:</strong> OOP is easy to overdo. Deep " +
    "inheritance trees, anemic 'manager' and 'helper' classes, and objects that are just bags of getters/" +
    "setters are anti-patterns. Favor small objects with real behavior, and prefer composition over " +
    "inheritance (see those topics).</p>"
};

C["functional-programming"] = {
  summary: "<p><strong>Functional Programming (FP)</strong> builds software by composing <strong>pure " +
    "functions</strong> and treating data as <strong>immutable</strong>. Instead of changing state in " +
    "place, you transform data into new data. Functions are <em>first-class</em> &mdash; you can pass them " +
    "as arguments, return them, and store them. Key ideas: no (or minimal) side effects, no shared mutable " +
    "state, and building complex behavior by chaining small, predictable transformations. This makes code " +
    "easier to test, parallelize, and reason about.</p>",
  examples: [
    {
      title: "Example 1: Immutability and transformation",
      description: "<p>Rather than mutating the array, we derive a new one. The original is untouched.</p>",
      code: "const prices = [10, 20, 30];\n" +
        "\n" +
        "// Pure transformation: input in, new output out, nothing mutated\n" +
        "const withTax = prices.map(p => p * 1.2);\n" +
        "\n" +
        "console.log(prices);  // [10, 20, 30]  <- unchanged\n" +
        "console.log(withTax); // [12, 24, 36]"
    },
    {
      title: "Example 2: Functions as first-class values + composition",
      description: "<p>Small functions combined into a pipeline. Each is trivially testable in isolation.</p>",
      code: "const trim    = s => s.trim();\n" +
        "const lower   = s => s.toLowerCase();\n" +
        "const dashify = s => s.replace(/\\s+/g, '-');\n" +
        "\n" +
        "// compose runs right-to-left: dashify(lower(trim(x)))\n" +
        "const compose = (...fns) => x => fns.reduceRight((acc, f) => f(acc), x);\n" +
        "\n" +
        "const toSlug = compose(dashify, lower, trim);\n" +
        "console.log(toSlug('  Hello World ')); // 'hello-world'"
    },
    {
      title: "Example 3: immutability and higher-order functions",
      description: "<p>FP avoids mutation and passes behavior as values, composing small functions into pipelines.</p>",
      code: "const orders = [{t:10,paid:true},{t:5,paid:false},{t:20,paid:true}];\n" +
        "// no mutation, declarative transform:\n" +
        "const revenue = orders\n" +
        "  .filter(o => o.paid)\n" +
        "  .map(o => o.t)\n" +
        "  .reduce((a, b) => a + b, 0);   // 30\n" +
        "// original 'orders' is untouched; each step returns a new value."
    },
    {
      title: "Example 4 (edge case): the world isn't pure - isolate side effects",
      description: "<p>Real programs must do I/O; FP doesn't ban effects, it pushes them to the edges so the core stays pure and testable.</p>",
      code: "// Keep the core PURE (easy to test, no mocks):\n" +
        "function priceCart(items, rules) { /* pure calculation */ }\n" +
        "// Do effects at the EDGE:\n" +
        "const items = await db.load();          // impure (boundary)\n" +
        "const total = priceCart(items, rules);  // pure (core)\n" +
        "await db.save(total);                   // impure (boundary)\n" +
        "// Also: deep recursion can blow the stack in languages without TCO - know your runtime."
    }
  ],
  whenToUse: "<p>Reach for FP when you're <em>transforming data</em> &mdash; pipelines, parsing, mapping API " +
    "responses, aggregations &mdash; or when you want code that's easy to test and safe under concurrency " +
    "(pure functions have no shared state to corrupt). It pairs beautifully with OOP: model your entities " +
    "with objects, but keep their internal calculations pure. <strong>Trade-off:</strong> the real world " +
    "has side effects (databases, network, I/O) &mdash; FP doesn't eliminate them, it pushes them to the " +
    "edges so the core logic stays pure. Going fully dogmatic (monad-heavy code in a team that doesn't know " +
    "it) hurts readability more than it helps.</p>"
};

C["encapsulation"] = {
  summary: "<p><strong>Encapsulation</strong> means hiding an object's internal state and only allowing it " +
    "to be changed through a controlled, public interface. The fields are private; the methods are the " +
    "guarded doors. This protects <strong>invariants</strong> &mdash; rules that must always hold true " +
    "(e.g. 'a balance can never go negative') &mdash; because no outside code can reach in and break them. " +
    "It's the single most practical of the OOP pillars: it lets you change <em>how</em> a class works " +
    "internally without breaking everyone who uses it.</p>",
  examples: [
    {
      title: "Example 1: Guarding an invariant",
      description: "<p>The temperature can never be set below absolute zero, because the only way in is a " +
        "validating method.</p>",
      code: "class Thermostat {\n" +
        "  #celsius = 20;\n" +
        "\n" +
        "  setTemperature(c) {\n" +
        "    if (c < -273.15) throw new Error('Below absolute zero!');\n" +
        "    this.#celsius = c;          // invariant enforced in one place\n" +
        "  }\n" +
        "  get temperature() { return this.#celsius; }\n" +
        "}\n" +
        "// No external code can ever put #celsius in an invalid state."
    },
    {
      title: "Example 2: Hiding implementation so it can change freely",
      description: "<p>Callers use <code>fullName()</code>; whether it's stored as one field or two is the " +
        "class's private business.</p>",
      code: "class Person {\n" +
        "  #first; #last;\n" +
        "  constructor(first, last) { this.#first = first; this.#last = last; }\n" +
        "\n" +
        "  // Internals could later become a single #name field -\n" +
        "  // callers of fullName() would never notice.\n" +
        "  fullName() { return `${this.#first} ${this.#last}`; }\n" +
        "}"
    },
    {
      title: "Example 3: hiding state behind behavior",
      description: "<p>Encapsulation means the object guards its own data; callers go through methods that enforce invariants.</p>",
      code: "class Thermostat {\n" +
        "  #temp = 20;                       // private state\n" +
        "  setTemp(t) {\n" +
        "    if (t < 5 || t > 30) throw new Error('out of range'); // invariant\n" +
        "    this.#temp = t;\n" +
        "  }\n" +
        "  get temp() { return this.#temp; }\n" +
        "}\n" +
        "// No way to put the object into an invalid state from outside."
    },
    {
      title: "Example 4 (edge case): getters/setters that leak internals defeat it",
      description: "<p>Auto-exposing every field, or returning mutable internal references, is encapsulation in name only.</p>",
      code: "class Order {\n" +
        "  #items = [];\n" +
        "  get items() { return this.#items; }   // LEAK: caller can mutate internal array\n" +
        "}\n" +
        "order.items.push(x);  // bypasses any validation in addItem()\n" +
        "// Fix: return a copy ([...this.#items]) or an unmodifiable view, and expose\n" +
        "//   intent-revealing methods (addItem) rather than raw setters for everything."
    }
  ],
  whenToUse: "<p>Encapsulate whenever an object has rules about its own state &mdash; which is almost always. " +
    "The litmus test: if you find yourself writing a getter <em>and</em> a setter for every field with no " +
    "logic in between, you haven't really encapsulated anything; you've just made the fields public with " +
    "extra steps (an 'anemic' object). Real encapsulation exposes <em>operations</em> ('deposit', " +
    "'cancel', 'rename'), not raw data access. <strong>Why it matters:</strong> it localizes change. When " +
    "requirements shift, you fix one class instead of hunting every place that touched a public field.</p>"
};

C["abstraction"] = {
  summary: "<p><strong>Abstraction</strong> is exposing <em>what</em> something does while hiding <em>how</em> " +
    "it does it. You interact with a simplified model and ignore the messy details underneath. A " +
    "<code>List</code> lets you <code>add()</code> and <code>get()</code> without knowing if it's backed by " +
    "an array or a linked list. Abstraction reduces the mental load of working with a system and lets " +
    "implementations change behind a stable contract. It's closely related to encapsulation: encapsulation " +
    "hides state, abstraction hides complexity/implementation.</p>",
  examples: [
    {
      title: "Example 1: An abstract contract with swappable implementations",
      description: "<p>Calling code depends on the idea of 'sending a notification', not on email vs SMS.</p>",
      code: "// The abstraction: a stable, simple contract\n" +
        "class Notifier {\n" +
        "  send(message) { throw new Error('not implemented'); }\n" +
        "}\n" +
        "\n" +
        "// Concrete details hidden behind it\n" +
        "class EmailNotifier extends Notifier {\n" +
        "  send(message) { /* SMTP handshake, retries... */ }\n" +
        "}\n" +
        "class SmsNotifier extends Notifier {\n" +
        "  send(message) { /* talk to SMS gateway... */ }\n" +
        "}\n" +
        "\n" +
        "function alertUser(notifier) { notifier.send('Your order shipped'); }\n" +
        "// alertUser doesn't know or care which kind it got."
    },
    {
      title: "Example 2: Abstracting away a calculation",
      description: "<p>Consumers ask for the price; the tax/discount math is an implementation detail.</p>",
      code: "class Cart {\n" +
        "  constructor(items) { this.items = items; }\n" +
        "\n" +
        "  // The exposed concept: 'how much do I owe?'\n" +
        "  total() {\n" +
        "    const sub = this.items.reduce((s, i) => s + i.price, 0);\n" +
        "    return this.#applyTax(this.#applyDiscount(sub));\n" +
        "  }\n" +
        "  #applyDiscount(x) { return x * 0.9; }  // hidden detail\n" +
        "  #applyTax(x)      { return x * 1.2; }  // hidden detail\n" +
        "}"
    },
    {
      title: "Example 3: depend on the concept, not the implementation",
      description: "<p>An abstraction names a capability so callers don't know or care which concrete thing fulfills it.</p>",
      code: "interface Notifier { send(to: string, msg: string): void; }\n" +
        "class EmailNotifier implements Notifier { send(t,m){/*...*/} }\n" +
        "class SmsNotifier   implements Notifier { send(t,m){/*...*/} }\n" +
        "\n" +
        "function alert(n: Notifier) { n.send('sam', 'hi'); } // works with ANY notifier\n" +
        "// callers code to 'something that notifies', not to email/SMS specifics."
    },
    {
      title: "Example 4 (edge case): premature or leaky abstraction",
      description: "<p>Abstracting with only one implementation (speculative) adds indirection for nothing, and an abstraction that exposes implementation details isn't really abstract.</p>",
      code: "// Premature: a Repository interface with ONE impl 'in case we swap DBs' -> YAGNI\n" +
        "//   indirection you'll likely never use. Wait for the second implementation.\n" +
        "// Leaky: interface FileStore { getS3Url(): string } -> the S3 detail leaked into\n" +
        "//   the abstraction, so callers are coupled to S3 anyway.\n" +
        "// Good abstractions hide the 'how' and have a real reason to exist."
    }
  ],
  whenToUse: "<p>Introduce an abstraction when (a) you have multiple implementations of the same idea, or (b) " +
    "a detail is likely to change and you want to insulate the rest of the code from it. The classic example " +
    "is data access: code against a <code>UserRepository</code> abstraction so you can swap Postgres for an " +
    "in-memory fake in tests. <strong>Gotcha &mdash; don't over-abstract:</strong> creating interfaces with a " +
    "single implementation 'just in case' adds indirection and ceremony with no payoff. Abstract in response " +
    "to real, observed variation (or a real testing need), not speculative future flexibility (see YAGNI).</p>"
};

C["inheritance"] = {
  summary: "<p><strong>Inheritance</strong> lets one class (the <em>subclass</em>/child) acquire the fields " +
    "and methods of another (the <em>superclass</em>/parent), then add or override behavior. It models an " +
    "<strong>'is-a'</strong> relationship: a <code>Dog</code> <em>is an</em> <code>Animal</code>. It " +
    "promotes reuse and lets you treat related types uniformly through the parent type. But it's the most " +
    "<em>misused</em> OOP feature &mdash; it creates tight coupling between parent and child, and deep " +
    "hierarchies become rigid and fragile. Modern guidance: use it sparingly and prefer composition.</p>",
  examples: [
    {
      title: "Example 1: Sharing behavior via a parent class",
      description: "<p>Both subclasses reuse <code>describe()</code> and supply their own <code>speak()</code>.</p>",
      code: "class Animal {\n" +
        "  constructor(name) { this.name = name; }\n" +
        "  describe() { return `${this.name} says ${this.speak()}`; }\n" +
        "  speak() { return '...'; }     // default, meant to be overridden\n" +
        "}\n" +
        "\n" +
        "class Dog extends Animal {\n" +
        "  speak() { return 'Woof'; }    // override\n" +
        "}\n" +
        "class Cat extends Animal {\n" +
        "  speak() { return 'Meow'; }\n" +
        "}\n" +
        "\n" +
        "console.log(new Dog('Rex').describe()); // 'Rex says Woof'"
    },
    {
      title: "Example 2: Extending with super()",
      description: "<p>A subclass can build on the parent's constructor/behavior instead of replacing it.</p>",
      code: "class Vehicle {\n" +
        "  constructor(wheels) { this.wheels = wheels; }\n" +
        "}\n" +
        "class Car extends Vehicle {\n" +
        "  constructor(brand) {\n" +
        "    super(4);                   // run parent setup first\n" +
        "    this.brand = brand;\n" +
        "  }\n" +
        "}"
    },
    {
      title: "Example 3: reusing and specializing a base class",
      description: "<p>A subclass inherits the base's state/behavior and extends or overrides it.</p>",
      code: "class Employee {\n" +
        "  constructor(public name: string, protected base: number) {}\n" +
        "  pay() { return this.base; }\n" +
        "}\n" +
        "class Manager extends Employee {\n" +
        "  constructor(name: string, base: number, private bonus: number) { super(name, base); }\n" +
        "  pay() { return super.pay() + this.bonus; } // specialize via override + super\n" +
        "}"
    },
    {
      title: "Example 4 (edge case): the fragile base class / wrong 'is-a'",
      description: "<p>Inheritance tightly couples subclass to base internals; a base change can silently break subclasses, and a false 'is-a' violates LSP.</p>",
      code: "// LSP violation: Square extends Rectangle, but setWidth must also change height\n" +
        "//   -> code expecting a Rectangle breaks. They aren't substitutable.\n" +
        "// Fragile base: subclass overrides one method that the base calls internally ->\n" +
        "//   a later base refactor changes call order -> subclass breaks unexpectedly.\n" +
        "// Prefer composition unless the 'is-a' is genuine, stable, and substitutable."
    }
  ],
  whenToUse: "<p>Use inheritance when there's a genuine, stable 'is-a' relationship <em>and</em> the subclass " +
    "can be used anywhere the parent is expected without surprises (the Liskov Substitution Principle from " +
    "SOLID). Good fits: framework base classes you extend, or a small, closed hierarchy of variants. " +
    "<strong>The classic trap:</strong> using inheritance just to reuse code. If <code>Stack</code> extends " +
    "<code>ArrayList</code> only to borrow its methods, you've also inherited methods that break the stack's " +
    "rules. When the relationship is really 'has-a' or 'uses-a', use <strong>composition</strong> instead. " +
    "Rule of thumb: model behavior sharing with composition, reserve inheritance for true subtyping.</p>"
};

C["polymorphism"] = {
  summary: "<p><strong>Polymorphism</strong> ('many forms') is the ability to treat different types through " +
    "a common interface, where each type responds to the same call in its own way. The calling code says " +
    "<code>shape.area()</code> and the right implementation runs depending on whether <code>shape</code> is " +
    "a circle or a square &mdash; no <code>if/else</code> on type needed. It's what makes abstraction " +
    "powerful: you write code against the general concept, and new types plug in without changing the " +
    "caller. This is <em>runtime</em> (subtype) polymorphism; generics provide a separate compile-time kind.</p>",
  examples: [
    {
      title: "Example 1: One call, many behaviors",
      description: "<p>The loop never checks what kind of shape it has &mdash; each shape knows its own area.</p>",
      code: "class Circle { constructor(r){this.r=r;}  area(){ return Math.PI*this.r**2; } }\n" +
        "class Square { constructor(s){this.s=s;}  area(){ return this.s*this.s; } }\n" +
        "\n" +
        "const shapes = [new Circle(2), new Square(3)];\n" +
        "\n" +
        "// Polymorphic: same method name, type-specific behavior\n" +
        "for (const shape of shapes) {\n" +
        "  console.log(shape.area());  // calls the correct area() automatically\n" +
        "}"
    },
    {
      title: "Example 2: Replacing a type-switch with polymorphism",
      description: "<p>Instead of a growing <code>switch</code>, each payment type owns its logic.</p>",
      code: "// BEFORE (rigid): every new method means editing this switch\n" +
        "// function fee(p){ switch(p.type){ case 'card': ...; case 'paypal': ...; } }\n" +
        "\n" +
        "// AFTER: open for extension, closed for modification\n" +
        "class CardPayment   { fee(amt){ return amt * 0.029; } }\n" +
        "class PaypalPayment { fee(amt){ return amt * 0.034; } }\n" +
        "\n" +
        "function charge(payment, amount) {\n" +
        "  return amount + payment.fee(amount); // adding a new type needs no change here\n" +
        "}"
    },
    {
      title: "Example 3: replacing a type switch with polymorphism",
      description: "<p>Each type knows its own behavior, so adding a type doesn't mean editing a giant conditional.</p>",
      code: "// Conditional version (must edit for every new shape):\n" +
        "function area(s){ switch(s.kind){ case 'circle': ...; case 'square': ...; } }\n" +
        "\n" +
        "// Polymorphic: each shape implements area(); callers don't switch\n" +
        "interface Shape { area(): number; }\n" +
        "class Circle implements Shape { area(){ /*...*/ } }\n" +
        "shapes.forEach(s => s.area());   // add a Triangle -> no caller changes (OCP)"
    },
    {
      title: "Example 4 (edge case): runtime vs compile-time, and overuse",
      description: "<p>Subtype (runtime) polymorphism differs from generics/overloading (compile-time); and not every conditional should become a class hierarchy.</p>",
      code: "// Runtime (dynamic dispatch): s.area() resolves by the object's actual type.\n" +
        "// Compile-time: generics <T> and method overloading resolve at compile time.\n" +
        "// Overuse smell: a 2-branch if turned into 2 classes + a factory + an interface\n" +
        "//   -> more indirection than the problem warrants. Use polymorphism when the set\n" +
        "//   of variants grows or the conditional is duplicated across the codebase."
    }
  ],
  whenToUse: "<p>Use polymorphism whenever you catch yourself writing a <code>switch</code> or <code>if/else " +
    "</code> chain that branches on a type or 'kind' field &mdash; that's a signal each branch could become " +
    "its own class implementing a shared interface. It's the engine behind the Open/Closed Principle: you add " +
    "new behavior by adding new types, not by editing existing code. <strong>Trade-off:</strong> it spreads " +
    "logic across multiple small classes, which can make a single behavior harder to see all at once. For two " +
    "trivial cases, a simple <code>if</code> may be clearer; polymorphism pays off as the number of variants " +
    "grows.</p>"
};

C["interfaces"] = {
  summary: "<p>An <strong>interface</strong> is a pure contract: a named set of method signatures with no " +
    "implementation. A class that 'implements' the interface promises to provide those methods. Interfaces " +
    "let unrelated classes be used interchangeably as long as they fulfill the same contract, enabling " +
    "polymorphism and loose coupling. They answer 'what can this thing <em>do</em>?' rather than 'what " +
    "<em>is</em> it?'. A class can implement many interfaces, which is how languages without multiple " +
    "inheritance still mix in multiple capabilities.</p>",
  examples: [
    {
      title: "Example 1: A contract decoupling caller from implementation",
      description: "<p>Shown in TypeScript for explicit interface syntax. Any logger matching the shape works.</p>",
      code: "interface Logger {\n" +
        "  log(message: string): void;   // contract only - no body\n" +
        "}\n" +
        "\n" +
        "class ConsoleLogger implements Logger {\n" +
        "  log(message: string) { console.log(message); }\n" +
        "}\n" +
        "class FileLogger implements Logger {\n" +
        "  log(message: string) { /* append to a file */ }\n" +
        "}\n" +
        "\n" +
        "// Depends on the CONTRACT, not a concrete class\n" +
        "function run(logger: Logger) { logger.log('started'); }"
    },
    {
      title: "Example 2: One class, multiple capabilities",
      description: "<p>A class can satisfy several small interfaces at once (interface segregation).</p>",
      code: "interface Readable { read(): string; }\n" +
        "interface Writable { write(data: string): void; }\n" +
        "\n" +
        "class FileStream implements Readable, Writable {\n" +
        "  read() { return '...'; }\n" +
        "  write(data: string) { /* ... */ }\n" +
        "}\n" +
        "// A function needing only reading can ask for Readable -\n" +
        "// it won't depend on write() it doesn't use."
    },
    {
      title: "Example 3: program to an interface to enable swapping/testing",
      description: "<p>Depending on an interface lets you substitute real and fake implementations freely.</p>",
      code: "interface Clock { now(): number; }\n" +
        "class SystemClock implements Clock { now(){ return Date.now(); } }\n" +
        "class FakeClock implements Clock { constructor(public t:number){} now(){ return this.t; } }\n" +
        "\n" +
        "function isExpired(token, clock: Clock) { return token.exp < clock.now(); }\n" +
        "isExpired(tok, new FakeClock(0)); // deterministic test, no real time dependency"
    },
    {
      title: "Example 4 (edge case): fat interfaces violate ISP",
      description: "<p>A bloated interface forces implementers to stub methods they don't need; split into focused, role-based interfaces.</p>",
      code: "// Fat: interface Worker { work(); eat(); sleep(); } -> a Robot must stub eat()/sleep()\n" +
        "//   throw new Error('not supported') -> brittle, lying implementation.\n" +
        "// ISP: split into Workable, Feedable, Sleepable; implement only what applies.\n" +
        "// Keep interfaces small and cohesive (the 'I' in SOLID)."
    }
  ],
  whenToUse: "<p>Define an interface when callers should depend on a capability rather than a concrete class " +
    "&mdash; the cornerstone of the Dependency Inversion Principle and of writing testable code (swap the " +
    "real implementation for a fake in tests). Use them at the seams of your system: data access, external " +
    "services, plug-in points. <strong>Gotcha:</strong> don't create an interface for every class reflexively. " +
    "An interface with exactly one implementation that will never have another is just indirection. Add them " +
    "where you have, or genuinely expect, multiple implementations or a test boundary. Keep them small and " +
    "focused (Interface Segregation) rather than one giant 'do-everything' interface.</p>"
};

C["abstract-classes"] = {
  summary: "<p>An <strong>abstract class</strong> sits between an interface and a concrete class. It cannot " +
    "be instantiated directly and may contain a mix of <strong>implemented</strong> methods (shared " +
    "behavior) and <strong>abstract</strong> methods (signatures subclasses must fill in). It's the tool " +
    "for capturing a common base while forcing subclasses to supply the parts that differ &mdash; the " +
    "Template Method pattern. The key distinction from an interface: an abstract class can hold state and " +
    "concrete logic, and a class can extend only one of them.</p>",
  examples: [
    {
      title: "Example 1: Shared skeleton, subclass-specific steps",
      description: "<p>The base defines the algorithm; subclasses only fill in the variable step.</p>",
      code: "abstract class Report {\n" +
        "  // shared, concrete: the overall flow is fixed here\n" +
        "  generate() {\n" +
        "    return this.header() + this.body() + '\\n-- end --';\n" +
        "  }\n" +
        "  header() { return 'REPORT\\n'; }   // shared default\n" +
        "  abstract body(): string;            // MUST be supplied by subclass\n" +
        "}\n" +
        "\n" +
        "class SalesReport extends Report {\n" +
        "  body() { return 'Total sales: $5,000\\n'; }\n" +
        "}"
    },
    {
      title: "Example 2: Holding shared state",
      description: "<p>Unlike an interface, an abstract class can carry fields used by all subclasses.</p>",
      code: "abstract class Shape {\n" +
        "  constructor(protected color: string) {}  // shared state\n" +
        "  describe() { return `A ${this.color} shape with area ${this.area()}`; }\n" +
        "  abstract area(): number;                  // each shape differs\n" +
        "}\n" +
        "class Circle extends Shape {\n" +
        "  constructor(color: string, private r: number) { super(color); }\n" +
        "  area() { return Math.PI * this.r ** 2; }\n" +
        "}"
    },
    {
      title: "Example 3: shared implementation + required hooks (template method)",
      description: "<p>An abstract class provides common logic and leaves abstract 'holes' subclasses must fill.</p>",
      code: "abstract class DataExporter {\n" +
        "  export(rows) { return this.header() + rows.map(r => this.row(r)).join('\\n'); }\n" +
        "  protected abstract header(): string;   // subclass fills these\n" +
        "  protected abstract row(r): string;\n" +
        "}\n" +
        "class CsvExporter extends DataExporter {\n" +
        "  header(){ return 'id,name'; } row(r){ return `${r.id},${r.name}`; }\n" +
        "}"
    },
    {
      title: "Example 4 (edge case): single inheritance limits abstract classes",
      description: "<p>A class can extend only one abstract class but implement many interfaces - prefer interfaces when you only need a contract.</p>",
      code: "// Can't extend two abstract classes:\n" +
        "// class A extends Base1, Base2 {}   // ERROR (single inheritance)\n" +
        "// But can implement several interfaces + extend one base:\n" +
        "class A extends Base implements Serializable, Comparable {}\n" +
        "// Rule of thumb: interface for 'can-do' capabilities and multiple contracts;\n" +
        "//   abstract class only when subclasses share real STATE or implementation."
    }
  ],
  whenToUse: "<p>Choose an abstract class over an interface when subclasses genuinely <em>share</em> code or " +
    "state, not just a contract &mdash; for example a base <code>Controller</code> with common request " +
    "handling, or a parser base that implements the loop and delegates one parsing step. <strong>The decision " +
    "rule:</strong> 'Is this a <em>can-do</em> capability that varied types might have?' &rarr; interface. " +
    "'Is this a <em>partial implementation</em> of a closely-related family?' &rarr; abstract class. " +
    "<strong>Trade-off:</strong> single inheritance means an abstract base 'uses up' your one extends slot " +
    "and bakes in tight coupling; many codebases prefer interfaces + composition for flexibility, reserving " +
    "abstract classes for true template-method situations.</p>"
};

C["concrete-classes"] = {
  summary: "<p>A <strong>concrete class</strong> is an ordinary, fully-implemented class &mdash; every method " +
    "has a body, so it can be <strong>instantiated</strong> with <code>new</code>. It's the 'normal' class, " +
    "named in contrast to abstract classes and interfaces. Concrete classes are where actual work and real " +
    "objects live. A well-designed system has abstractions (interfaces/abstract classes) at its boundaries " +
    "for flexibility, and concrete classes providing the real implementations behind them.</p>",
  examples: [
    {
      title: "Example 1: A concrete class implementing an abstraction",
      description: "<p><code>EmailValidator</code> is concrete &mdash; complete and instantiable &mdash; " +
        "and fulfills an abstract contract.</p>",
      code: "interface Validator { isValid(input: string): boolean; }\n" +
        "\n" +
        "// Concrete: nothing left abstract, can be 'new'ed\n" +
        "class EmailValidator implements Validator {\n" +
        "  isValid(input: string) {\n" +
        "    return /^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(input);\n" +
        "  }\n" +
        "}\n" +
        "\n" +
        "const v = new EmailValidator();   // works: concrete classes are instantiable\n" +
        "v.isValid('a@b.com');"
    },
    {
      title: "Example 2: Concrete vs non-instantiable",
      description: "<p>Trying to instantiate an abstraction fails; the concrete subclass is what you create.</p>",
      code: "abstract class Animal { abstract speak(): string; }\n" +
        "\n" +
        "class Dog extends Animal { speak() { return 'Woof'; } } // concrete\n" +
        "\n" +
        "// new Animal();  // ERROR - abstract, incomplete\n" +
        "const d = new Dog(); // OK - concrete and complete"
    },
    {
      title: "Example 3: a concrete class implements the contracts",
      description: "<p>Concrete classes are fully implemented and instantiable - the actual workhorses behind interfaces/abstractions.</p>",
      code: "interface Repository<T> { findById(id: string): T | null; }\n" +
        "\n" +
        "class PostgresUserRepository implements Repository<User> { // concrete\n" +
        "  findById(id) { /* real SQL */ return /* user */; }\n" +
        "}\n" +
        "const repo = new PostgresUserRepository(); // can be instantiated\n" +
        "// abstractions describe; concrete classes DO."
    },
    {
      title: "Example 4 (edge case): coupling callers to a concrete type",
      description: "<p>Referencing a concrete class everywhere (instead of its interface) makes substitution and testing hard.</p>",
      code: "// Rigid: every caller hard-codes the concrete type\n" +
        "function svc(repo: PostgresUserRepository) { ... } // can't pass a fake/mock\n" +
        "// Flexible: depend on the abstraction, inject the concrete at the edge\n" +
        "function svc(repo: Repository<User>) { ... }\n" +
        "// 'new' the concrete class only at the composition root (wiring), not deep in logic."
    }
  ],
  whenToUse: "<p>Concrete classes are simply where you put real, runnable logic &mdash; you'll write far more " +
    "of them than interfaces or abstract classes. The design lesson is about <em>what other code depends " +
    "on</em>: at module boundaries and test seams, have callers depend on abstractions and inject the " +
    "concrete class; but for simple internal types with no variation, a plain concrete class is perfectly " +
    "fine &mdash; don't wrap it in a needless interface. <strong>Rule of thumb:</strong> start concrete, and " +
    "extract an abstraction only when a second implementation or a testing boundary actually appears.</p>"
};

C["pure-functions"] = {
  summary: "<p>A <strong>pure function</strong> has two properties: (1) given the same inputs it always " +
    "returns the same output, and (2) it has <strong>no side effects</strong> &mdash; it doesn't modify " +
    "external state, write to disk, mutate its arguments, or call the network. It depends only on its " +
    "parameters and only communicates through its return value. Pure functions are the backbone of " +
    "functional programming and are prized everywhere because they're trivially testable, cacheable, " +
    "parallelizable, and easy to reason about &mdash; nothing 'spooky' can happen.</p>",
  examples: [
    {
      title: "Example 1: Pure vs impure",
      description: "<p>The pure version is self-contained; the impure one reaches outside itself and is " +
        "unpredictable.</p>",
      code: "// PURE: same input -> same output, touches nothing external\n" +
        "function add(a, b) { return a + b; }\n" +
        "\n" +
        "// IMPURE: depends on hidden external state, and mutates it\n" +
        "let count = 0;\n" +
        "function addImpure(n) {\n" +
        "  count += n;        // side effect: changes outside state\n" +
        "  return count;      // output depends on history, not just input\n" +
        "}\n" +
        "// add(2,2) is always 4. addImpure(2) returns a different value each call."
    },
    {
      title: "Example 2: Not mutating inputs",
      description: "<p>A pure function returns new data rather than altering what it was given.</p>",
      code: "// IMPURE: mutates the caller's array (a surprising side effect)\n" +
        "function addItemBad(cart, item) { cart.push(item); return cart; }\n" +
        "\n" +
        "// PURE: leaves the original untouched, returns a fresh array\n" +
        "function addItem(cart, item) { return [...cart, item]; }\n" +
        "\n" +
        "const original = ['a'];\n" +
        "const updated = addItem(original, 'b');\n" +
        "// original is still ['a']; updated is ['a','b']"
    },
    {
      title: "Example 3: pure vs impure",
      description: "<p>A pure function depends only on its inputs and has no side effects - same input, same output, always.</p>",
      code: "// PURE: deterministic, no side effects, trivially testable\n" +
        "const taxed = (amount, rate) => amount * (1 + rate);\n" +
        "\n" +
        "// IMPURE: reads external state + mutates + does I/O\n" +
        "let total = 0;\n" +
        "function add(x) { total += x; console.log(total); return total; } // depends on/changes 'total'"
    },
    {
      title: "Example 4 (edge case): hidden impurity and where purity ends",
      description: "<p>Reading the clock, randomness, or shared mutable state secretly breaks purity; and effects must happen somewhere - push them to the edges.</p>",
      code: "// Looks pure but ISN'T (depends on hidden global state):\n" +
        "function isExpired(token){ return token.exp < Date.now(); } // Date.now() = impurity\n" +
        "// Make it pure by injecting time:\n" +
        "function isExpired(token, now){ return token.exp < now; }\n" +
        "// I/O can't be pure -> keep a pure core, do db/network at the boundary."
    }
  ],
  whenToUse: "<p>Make functions pure by default, especially for business logic, calculations, validation, and " +
    "data transformation &mdash; it's the cheapest way to get code that's easy to unit-test (no mocks, no " +
    "setup) and free of heisenbugs. The standard architecture is a <em>pure core, impure shell</em>: keep " +
    "side effects (DB writes, HTTP calls, logging) at the edges, and keep the decision-making logic pure in " +
    "the middle. <strong>Reality check:</strong> a program with zero side effects does nothing useful &mdash; " +
    "the goal isn't purity everywhere, it's <em>isolating</em> impurity so the bulk of your logic stays " +
    "predictable and testable.</p>"
};

/* ======================================================================
   SECTION 2 — CLEAN CODE
   ====================================================================== */

C["clean-code"] = {
  summary: "<p><strong>Clean code</strong> is code that is easy to read, understand, and change by humans " +
    "&mdash; not just code that works. The compiler accepts almost anything; the cost of software lives in " +
    "<em>maintenance</em>, where people read code far more often than they write it. Clean code reads almost " +
    "like prose: clear names, small focused functions, no duplication, minimal surprises, and tests that " +
    "document behavior. It's a craft discipline popularized by Robert C. Martin, and the whole section that " +
    "follows is a set of concrete habits that add up to it.</p>",
  examples: [
    {
      title: "Example 1: Same logic, messy vs clean",
      description: "<p>Both compute a discounted total. The second tells you <em>why</em>, not just how.</p>",
      code: "// Messy: cryptic names, magic numbers, no intent\n" +
        "function c(x) { return x > 100 ? x * 0.9 : x; }\n" +
        "\n" +
        "// Clean: names carry the meaning, the rule is obvious\n" +
        "const BULK_THRESHOLD = 100;\n" +
        "const BULK_DISCOUNT = 0.1;\n" +
        "function applyBulkDiscount(orderTotal) {\n" +
        "  if (orderTotal <= BULK_THRESHOLD) return orderTotal;\n" +
        "  return orderTotal * (1 - BULK_DISCOUNT);\n" +
        "}"
    },
    {
      title: "Example 2: Letting code read top-to-bottom",
      description: "<p>A high-level function that reads like a summary, delegating details to well-named helpers.</p>",
      code: "function checkout(cart, user) {\n" +
        "  const total = calculateTotal(cart);\n" +
        "  const discounted = applyBulkDiscount(total);\n" +
        "  chargeCustomer(user, discounted);\n" +
        "  sendReceipt(user, discounted);\n" +
        "}\n" +
        "// You understand the WHAT here; drop into a helper only when you need the HOW."
    },
    {
      title: "Example 3: readability is the point - code is read far more than written",
      description: "<p>Clean code optimizes for the next human reader: clear names, small functions, obvious intent.</p>",
      code: "// Unclear:\n" +
        "function p(d){ return d.filter(x=>x.s===1).map(x=>x.a).reduce((a,b)=>a+b,0); }\n" +
        "// Clean: intent reads off the page\n" +
        "function totalPaidRevenue(orders) {\n" +
        "  return orders.filter(isPaid).map(o => o.amount).reduce(sum, 0);\n" +
        "}\n" +
        "// Same behavior; the second is obvious in 2 seconds."
    },
    {
      title: "Example 4 (edge case): 'clean' is contextual, not dogma",
      description: "<p>Blindly applying rules (extract everything, zero comments) can hurt - and a hot path may justify less-pretty but faster code.</p>",
      code: "// Over-extraction: 8 one-line functions called once each can be HARDER to follow\n" +
        "//   than one cohesive 15-line function. Extract for reuse/clarity, not as a reflex.\n" +
        "// Performance: a tight numeric loop may justify manual, less-elegant code with a\n" +
        "//   comment explaining WHY. Clarity usually wins, but 'clean' serves the reader\n" +
        "//   and the requirements - it's judgment, not a checklist to satisfy mechanically."
    }
  ],
  whenToUse: "<p>Clean code is a default posture, not a special-occasion activity &mdash; apply it to every " +
    "line you'd expect someone (including future-you) to read again. The payoff is economic: clean code is " +
    "cheaper to extend and debug, which dominates a project's total cost. <strong>Balance:</strong> 'clean' " +
    "is not 'maximally clever' or 'maximally abstracted.' Over-engineering in the name of cleanliness " +
    "(needless layers, premature patterns) is its own mess. Aim for <em>boring, obvious</em> code. And don't " +
    "polish throwaway scripts to production shine &mdash; match the effort to the code's lifespan.</p>"
};

C["clean-code-principles"] = {
  summary: "<p>The <strong>clean code principles</strong> are a checklist of habits that, together, keep a " +
    "codebase readable and maintainable: use meaningful names; keep functions and classes small and " +
    "single-purpose; avoid duplication (DRY); minimize the number of arguments; avoid hidden side effects; " +
    "prefer clear names over explanatory comments; handle errors deliberately; and keep formatting " +
    "consistent. None are revolutionary in isolation; their power is cumulative. The items in this section " +
    "each drill into one of them.</p>",
  examples: [
    {
      title: "Example 1: Several principles applied at once",
      description: "<p>Small, single-purpose, well-named, no magic numbers, no duplication.</p>",
      code: "const MIN_PASSWORD_LENGTH = 8;\n" +
        "\n" +
        "function isStrongPassword(password) {\n" +
        "  return hasMinLength(password)\n" +
        "      && hasNumber(password)\n" +
        "      && hasUppercase(password);\n" +
        "}\n" +
        "\n" +
        "const hasMinLength = p => p.length >= MIN_PASSWORD_LENGTH;\n" +
        "const hasNumber    = p => /[0-9]/.test(p);\n" +
        "const hasUppercase = p => /[A-Z]/.test(p);"
    },
    {
      title: "Example 2: Fewer arguments via an object",
      description: "<p>Long positional argument lists are error-prone; a named object documents each value.</p>",
      code: "// Hard to call correctly: which boolean is which?\n" +
        "// createUser('Sam', 'sam@x.com', true, false, true);\n" +
        "\n" +
        "// Self-documenting at the call site\n" +
        "createUser({\n" +
        "  name: 'Sam',\n" +
        "  email: 'sam@x.com',\n" +
        "  isAdmin: true,\n" +
        "  newsletter: false,\n" +
        "  verified: true,\n" +
        "});"
    },
    {
      title: "Example 3: a quick self-review checklist",
      description: "<p>The principles distill into a handful of questions to ask before committing.</p>",
      code: "// - Do names reveal intent? (no temp/data2/flag)\n" +
        "// - Does each function do ONE thing, fit on a screen, few args?\n" +
        "// - Any duplicated knowledge? (DRY)\n" +
        "// - Any dead code / commented-out blocks? (delete it; git remembers)\n" +
        "// - Are errors handled, not swallowed?\n" +
        "// - Could a new teammate read this without you explaining it?"
    },
    {
      title: "Example 4 (edge case): principles can conflict - balance them",
      description: "<p>DRY vs decoupling, small functions vs readability - clean-code principles sometimes pull in opposite directions.</p>",
      code: "// DRY pushes you to share code; but forcing two only-superficially-similar things\n" +
        "//   into one abstraction creates harmful coupling (a wrong abstraction is worse\n" +
        "//   than duplication). Sometimes 'WET' (write twice) is correct.\n" +
        "// 'Small functions' vs 'don't over-fragment' also trade off.\n" +
        "// Principles are heuristics, not laws - apply judgment for the specific code."
    }
  ],
  whenToUse: "<p>Treat these as a code-review and self-review checklist. They matter most in code that lives a " +
    "long time and is touched by many people &mdash; shared libraries, core domain logic, anything on the " +
    "critical path. <strong>Trade-off to watch:</strong> principles can conflict. Extracting a tiny helper " +
    "to avoid two lines of 'duplication' can hurt readability (over-DRY); splitting one clear function into " +
    "five micro-functions can scatter logic. Use judgement: the meta-principle is <em>readability for the " +
    "next human</em>, and the other rules serve that, not the reverse.</p>"
};

C["use-meaningful-names"] = {
  summary: "<p><strong>Meaningful names</strong> are the highest-leverage readability habit. A name should " +
    "reveal <em>intent</em>: what a variable holds, what a function does, why it exists. Good names make " +
    "comments unnecessary and let readers understand code without tracing it. Avoid single letters (except " +
    "tiny loop counters), cryptic abbreviations, and 'noise' words like <code>data</code>, <code>info</code>, " +
    "<code>manager</code>, or <code>temp</code>. Names are the cheapest documentation you'll ever write and " +
    "the most-read.</p>",
  examples: [
    {
      title: "Example 1: Intent-revealing names",
      description: "<p>The second version needs no comment to explain what the loop is doing.</p>",
      code: "// Unclear: what are d, x, and the magic 86400?\n" +
        "function f(d) { return d.filter(x => x.t > Date.now() - 86400000); }\n" +
        "\n" +
        "// Clear: the names tell the whole story\n" +
        "const ONE_DAY_MS = 24 * 60 * 60 * 1000;\n" +
        "function getRecentOrders(orders) {\n" +
        "  return orders.filter(order => order.timestamp > Date.now() - ONE_DAY_MS);\n" +
        "}"
    },
    {
      title: "Example 2: Names that match their type/role",
      description: "<p>Booleans read as yes/no questions; functions read as verbs; collections are plural.</p>",
      code: "let isActive = true;          // boolean -> reads as a question\n" +
        "let userCount = 42;           // number -> noun describing a quantity\n" +
        "let activeUsers = [];         // collection -> plural\n" +
        "\n" +
        "function calculateTax() {}    // function -> verb phrase (an action)\n" +
        "function hasPermission() {}   // boolean-returning -> 'has/is/can' prefix"
    },
    {
      title: "Example 3: names that reveal intent and units",
      description: "<p>Good names answer why/what without a comment; include units and avoid disinformation.</p>",
      code: "// Vague:\n" +
        "let d; let list; function check(x){}\n" +
        "// Intentful:\n" +
        "let elapsedDays; let activeUsers; function isEligibleForRefund(order){}\n" +
        "const timeoutMs = 5000;        // unit in the name\n" +
        "const MAX_RETRIES = 3;         // named constant beats a magic number"
    },
    {
      title: "Example 4 (edge case): misleading names are worse than vague ones",
      description: "<p>A name that lies about type, scope, or behavior actively misleads the reader.</p>",
      code: "const userList = new Set();     // it's a Set, not a List -> rename to 'users'\n" +
        "function getUser(id){ db.delete(id); } // 'get' that DELETES -> dangerous lie\n" +
        "// Also avoid: single-letter names beyond tiny loops, encodings (strName), and\n" +
        "//   near-identical names (userData vs userInfo) that readers can't tell apart.\n" +
        "// A name should match what the thing IS and DOES - exactly."
    }
  ],
  whenToUse: "<p>Every time you declare anything. The moment you write <code>temp</code>, <code>data2</code>, " +
    "or <code>handleStuff</code>, stop and name the actual concept. Renaming is cheap with modern IDEs, so " +
    "improve a bad name the instant you understand the code better. <strong>Gotchas:</strong> avoid " +
    "encoding type into names (<code>strName</code>, <code>arrUsers</code>) &mdash; the type system already " +
    "knows; avoid near-duplicate names (<code>account</code> vs <code>accountData</code>) that force readers " +
    "to guess the difference; and keep names honest &mdash; a <code>getUser()</code> that also writes to the " +
    "database is a lie that will bite someone.</p>"
};

C["meaningful-names-over-comments"] = {
  summary: "<p>The principle <strong>'meaningful names over comments'</strong> says: when you're tempted to " +
    "write a comment explaining <em>what</em> code does, first try to rename things or extract a " +
    "well-named function so the code explains itself. Comments drift out of sync with code (nobody updates " +
    "them), while names are checked by the compiler and read every time. The best comment is the one you " +
    "didn't need because the code was clear. Comments still have a place &mdash; for <em>why</em>, not " +
    "<em>what</em>.</p>",
  examples: [
    {
      title: "Example 1: Replace a comment with a named function",
      description: "<p>The comment becomes the function name, which can't go stale.</p>",
      code: "// BEFORE: a comment explaining a cryptic condition\n" +
        "// check if the user is eligible for a refund\n" +
        "if (u.purchaseDate > Date.now() - 30 * 86400000 && !u.refunded) { /* ... */ }\n" +
        "\n" +
        "// AFTER: the name IS the explanation\n" +
        "if (isEligibleForRefund(u)) { /* ... */ }\n" +
        "\n" +
        "function isEligibleForRefund(user) {\n" +
        "  const THIRTY_DAYS = 30 * 86400000;\n" +
        "  return user.purchaseDate > Date.now() - THIRTY_DAYS && !user.refunded;\n" +
        "}"
    },
    {
      title: "Example 2: A comment that IS worth keeping",
      description: "<p>Names explain the 'what'; comments are for non-obvious 'why' that code can't express.</p>",
      code: "// Good comment: explains a decision the code cannot show\n" +
        "// We retry 3 times because the payment gateway has a known\n" +
        "// transient-failure rate during their nightly maintenance window.\n" +
        "const MAX_RETRIES = 3;"
    },
    {
      title: "Example 3: extract-and-name instead of commenting",
      description: "<p>A 'what' comment is a hint to extract a well-named function or variable.</p>",
      code: "// Before: comment explains the condition\n" +
        "if (u.age >= 18 && u.country === 'NL' && !u.banned) { /* eligible to vote */ }\n" +
        "\n" +
        "// After: the NAME explains it - no comment needed\n" +
        "if (canVote(u)) { ... }\n" +
        "function canVote(u){ return u.age >= 18 && u.country === 'NL' && !u.banned; }"
    },
    {
      title: "Example 4 (edge case): comments that DO earn their place",
      description: "<p>Names express 'what'; comments are still right for 'why', warnings, and external context a name can't carry.</p>",
      code: "// Good comments explain WHY, not WHAT:\n" +
        "// Stripe rounds half-up; we must match it or reconciliation fails. (link to docs)\n" +
        "rounded = roundHalfUp(amount);\n" +
        "\n" +
        "// TODO/FIXME with context, legal/license headers, and regex explanations are fine.\n" +
        "// What to delete: comments that restate code, and commented-OUT code (use git)."
    }
  ],
  whenToUse: "<p>Apply this whenever you reach for a 'what' comment. Extract-and-name first; comment only when " +
    "the reason genuinely lives outside the code (a business rule, a workaround for an external bug, a " +
    "performance trade-off, a link to a spec). <strong>Caution against the extreme:</strong> 'self-documenting " +
    "code' is sometimes used as an excuse to write <em>no</em> comments at all, which is just as harmful. " +
    "Public APIs, complex algorithms, and surprising decisions deserve comments. The rule is about removing " +
    "<em>redundant</em> comments, not all of them.</p>"
};

C["keep-methods-classes-files-small"] = {
  summary: "<p><strong>Keeping methods, classes, and files small</strong> is a direct consequence of the " +
    "Single Responsibility Principle. A small function does one thing and fits on a screen; a small class " +
    "has one reason to change; a small file is easy to navigate. Smallness improves comprehension (less to " +
    "hold in your head), reuse (focused units compose), and testing (fewer paths). When something grows " +
    "large, that's a smell signalling it's doing too much and should be split along its natural seams.</p>",
  examples: [
    {
      title: "Example 1: Splitting a function that does too much",
      description: "<p>One long function becomes a readable orchestrator plus focused helpers.</p>",
      code: "// BEFORE: one function validating, saving, emailing, logging...\n" +
        "// AFTER: each step is its own small, testable unit\n" +
        "function registerUser(input) {\n" +
        "  const user = validateAndBuild(input);\n" +
        "  saveToDatabase(user);\n" +
        "  sendWelcomeEmail(user);\n" +
        "  logSignup(user);\n" +
        "  return user;\n" +
        "}\n" +
        "// Each helper can be tested and changed independently."
    },
    {
      title: "Example 2: A class with one reason to change",
      description: "<p>Instead of a 'God' class, responsibilities are separated.</p>",
      code: "// Too big: handles HTTP, business rules, AND persistence\n" +
        "// class UserController { parseRequest(){} validate(){} save(){} render(){} }\n" +
        "\n" +
        "// Split by responsibility\n" +
        "class UserController { /* handles HTTP in/out only */ }\n" +
        "class UserService    { /* business rules only */ }\n" +
        "class UserRepository { /* persistence only */ }"
    },
    {
      title: "Example 3: split a function that does several things",
      description: "<p>Small units that each do one thing read like prose and are easier to test and reuse.</p>",
      code: "// One function doing parse + validate + save + notify:\n" +
        "function handleSignup(req){ /* 60 lines, 4 responsibilities */ }\n" +
        "\n" +
        "// Decomposed - each name describes one step:\n" +
        "function handleSignup(req){\n" +
        "  const data = parseSignup(req);\n" +
        "  validate(data);\n" +
        "  const user = saveUser(data);\n" +
        "  sendWelcome(user);\n" +
        "}"
    },
    {
      title: "Example 4 (edge case): don't shred code into too many trivial units",
      description: "<p>Over-fragmentation (a function per line, called once) scatters logic and can be harder to follow than one cohesive function.</p>",
      code: "// Anti-pattern: extracting every line into its own one-call helper\n" +
        "//   addOne(), then(), maybe(), reallyDoIt() ... reader hops across 8 functions.\n" +
        "// Extract when it (a) names a meaningful step, (b) is reused, or (c) reduces\n" +
        "//   nesting/complexity - not as a reflex to hit an arbitrary line count.\n" +
        "// Cohesion matters more than a hard size limit; ~screen-sized is a guideline."
    }
  ],
  whenToUse: "<p>Refactor toward smaller units when a function won't fit on a screen, takes many arguments, " +
    "has many nested branches, or you struggle to name it without 'and'. Same for classes that accumulate " +
    "unrelated methods. <strong>The counter-balance:</strong> 'small' is a guideline, not a hard line count. " +
    "Splitting too aggressively produces a fog of one-line functions and ping-pong navigation that's " +
    "<em>harder</em> to follow than a slightly longer, cohesive function. Split when there's a real seam " +
    "(distinct responsibility, reuse, or testability), not just to hit a number.</p>"
};

C["avoid-passing-nulls-booleans"] = {
  summary: "<p>Two related smells: <strong>passing <code>null</code></strong> as an argument forces every " +
    "callee to defensively null-check and invites null-pointer crashes; <strong>passing a boolean " +
    "flag</strong> into a function usually means the function does two different things depending on the " +
    "flag &mdash; a hidden violation of single responsibility. The advice is to avoid both: represent " +
    "'absence' with explicit options/empty values, and split flag-driven functions into two clearly-named " +
    "functions.</p>",
  examples: [
    {
      title: "Example 1: Boolean flag -> two clear functions",
      description: "<p>A flag argument hides two behaviors behind one name; splitting makes intent obvious.</p>",
      code: "// Smell: what does 'true' mean at the call site?\n" +
        "// renderPage(user, true);\n" +
        "function renderPage(user, isAdmin) {\n" +
        "  if (isAdmin) { /* admin view */ } else { /* normal view */ }\n" +
        "}\n" +
        "\n" +
        "// Better: intent is explicit, each function does one thing\n" +
        "function renderAdminPage(user) { /* admin view */ }\n" +
        "function renderUserPage(user)  { /* normal view */ }"
    },
    {
      title: "Example 2: Avoid null by being explicit about absence",
      description: "<p>Return an empty array or an Option-like value instead of <code>null</code>.</p>",
      code: "// Risky: callers must remember to null-check, or crash\n" +
        "// function findTags(id) { return found ? tags : null; }\n" +
        "\n" +
        "// Safer: an empty result is naturally safe to iterate\n" +
        "function findTags(id) {\n" +
        "  const tags = lookup(id);\n" +
        "  return tags ?? [];   // never null; callers can always map/forEach\n" +
        "}"
    },
    {
      title: "Example 3: a boolean flag hides two responsibilities",
      description: "<p>A boolean argument usually means the function does two things - split it into two intent-revealing functions.</p>",
      code: "// Opaque at the call site - what does 'true' mean?\n" +
        "renderPage(user, true);\n" +
        "\n" +
        "// Two clear functions instead:\n" +
        "renderPageForAdmin(user);\n" +
        "renderPageForGuest(user);\n" +
        "// If you must keep one entry point, pass an options object: render(user, {admin:true})."
    },
    {
      title: "Example 4 (edge case): nulls as 'no value' invite NPEs",
      description: "<p>Returning/accepting null forces callers to null-check everywhere; prefer Optional, empty collections, or a Null Object.</p>",
      code: "// Null-returning API -> every caller must remember to check:\n" +
        "User find(id){ return null; }  user.name; // NPE if forgotten\n" +
        "// Better:\n" +
        "//   return Optional<User> / User | null with the type forcing a check\n" +
        "//   return an EMPTY collection instead of null for lists\n" +
        "//   use a Null Object (a do-nothing default) where a 'missing' instance makes sense"
    }
  ],
  whenToUse: "<p>Apply when designing function signatures. If you're about to add a boolean parameter, ask " +
    "whether you're really describing two operations &mdash; if so, split them. If a parameter can be " +
    "<code>null</code>, consider whether an empty collection, a default object, or a dedicated " +
    "'null object' would remove the special case. <strong>Pragmatic limits:</strong> a boolean is fine when " +
    "it's genuinely a single piece of configuration data (e.g. <code>{ caseSensitive: true }</code> in an " +
    "options object), and some APIs legitimately use null. The target is the <em>flag that switches behavior</em> " +
    "and the <em>null that propagates risk</em>, not every boolean or null everywhere.</p>"
};

C["minimize-cyclomatic-complexity"] = {
  summary: "<p><strong>Cyclomatic complexity</strong> counts the number of independent paths through a piece " +
    "of code &mdash; roughly, one plus the number of branching points (<code>if</code>, <code>for</code>, " +
    "<code>case</code>, <code>&&</code>, <code>?:</code>). High complexity means more paths to understand " +
    "and to test, and more places for bugs to hide. Minimizing it &mdash; via guard clauses, extracting " +
    "functions, replacing conditionals with polymorphism or lookup tables &mdash; makes code easier to " +
    "follow and dramatically easier to test (each path needs a test).</p>",
  examples: [
    {
      title: "Example 1: Flatten nested branches with guard clauses",
      description: "<p>Each early return removes a level of nesting and a tangled path.</p>",
      code: "// High complexity: nested conditions, many paths\n" +
        "function shippingBad(o) {\n" +
        "  if (o) { if (o.items.length) { if (o.country === 'US') { return 5; } else { return 15; } } }\n" +
        "  return 0;\n" +
        "}\n" +
        "\n" +
        "// Lower complexity: linear, each case obvious\n" +
        "function shipping(o) {\n" +
        "  if (!o || o.items.length === 0) return 0;\n" +
        "  return o.country === 'US' ? 5 : 15;\n" +
        "}"
    },
    {
      title: "Example 2: Replace a switch with a lookup table",
      description: "<p>Data-driven dispatch collapses many branches into one map access.</p>",
      code: "// Branchy\n" +
        "// switch(role){ case 'admin': return 100; case 'editor': return 50; ... }\n" +
        "\n" +
        "// Table-driven: zero branching, easy to extend\n" +
        "const ACCESS_LEVEL = { admin: 100, editor: 50, viewer: 10 };\n" +
        "function accessLevel(role) { return ACCESS_LEVEL[role] ?? 0; }"
    },
    {
      title: "Example 3: flatten branching to lower complexity",
      description: "<p>Cyclomatic complexity counts independent paths; guard clauses and lookup tables cut it dramatically.</p>",
      code: "// High complexity: deep nested if/else (many paths to test)\n" +
        "function role(u){ if(u){ if(u.admin){...} else { if(u.paid){...} else {...} } } }\n" +
        "\n" +
        "// Lower: guard clauses + early return\n" +
        "function role(u){\n" +
        "  if (!u) return 'anon';\n" +
        "  if (u.admin) return 'admin';\n" +
        "  return u.paid ? 'member' : 'free';\n" +
        "}\n" +
        "// Or replace a big switch with a lookup map."
    },
    {
      title: "Example 4 (edge case): the metric is a smell, not a hard gate",
      description: "<p>Some logic is irreducibly branchy; chasing a low number can scatter cohesive code or hide complexity rather than remove it.</p>",
      code: "// A state machine / parser may legitimately have many branches - splitting it to\n" +
        "//   satisfy a linter can SCATTER one coherent decision across files (harder to read).\n" +
        "// Also, extracting branches into many tiny functions can move complexity around\n" +
        "//   without reducing the real decision count.\n" +
        "// Use the metric to FIND hotspots; then simplify genuinely (tables, polymorphism),\n" +
        "//   don't just game the number."
    }
  ],
  whenToUse: "<p>Watch complexity on logic-heavy code &mdash; pricing, permissions, parsing, state machines. " +
    "Linters can flag functions over a threshold (often 10) so you catch creep early. The biggest practical " +
    "win is testability: a function with 12 paths needs ~12 tests; two functions with 3 paths each need ~6. " +
    "<strong>Don't game the metric:</strong> you can lower the number by hiding branches in helpers without " +
    "actually simplifying anything. The goal is genuinely fewer, clearer paths &mdash; sometimes a flat " +
    "<code>switch</code> with five cases is simpler than five polymorphic classes. Reduce real complexity, " +
    "not just the score.</p>"
};

C["indentation-and-code-style"] = {
  summary: "<p><strong>Consistent indentation and code style</strong> &mdash; spacing, brace placement, line " +
    "length, import ordering, naming conventions &mdash; make code visually scannable and reduce cognitive " +
    "load. The specific style matters far less than <em>consistency</em>: a codebase where everything looks " +
    "the same lets readers focus on logic instead of formatting. Modern teams settle this with automated " +
    "tools (formatters like Prettier/Black, linters like ESLint) so it's enforced mechanically and never " +
    "debated in code review.</p>",
  examples: [
    {
      title: "Example 1: Consistent structure aids scanning",
      description: "<p>Uniform indentation makes the block structure obvious at a glance.</p>",
      code: "// Consistent indentation reveals nesting and scope instantly\n" +
        "function process(items) {\n" +
        "  return items\n" +
        "    .filter(item => item.active)\n" +
        "    .map(item => ({\n" +
        "      id: item.id,\n" +
        "      name: item.name.trim(),\n" +
        "    }));\n" +
        "}"
    },
    {
      title: "Example 2: Automate it instead of arguing",
      description: "<p>A config file makes style a settled, machine-enforced fact.</p>",
      code: "// .prettierrc  (checked into the repo)\n" +
        "{\n" +
        "  \"semi\": true,\n" +
        "  \"singleQuote\": true,\n" +
        "  \"tabWidth\": 2,\n" +
        "  \"printWidth\": 100\n" +
        "}\n" +
        "// Run on save / in CI -> every file is formatted identically, automatically."
    },
    {
      title: "Example 3: let tools enforce style, not humans",
      description: "<p>An auto-formatter + linter ends style debates and keeps diffs about logic, not whitespace.</p>",
      code: "// commit the config so everyone (and CI) is identical:\n" +
        "//   .prettierrc, .editorconfig, .eslintrc / spotless / gofmt / black\n" +
        "// run on save + as a pre-commit hook + in CI:\n" +
        "//   prettier --check .   eslint .\n" +
        "// Consistent indentation/style makes code scannable and reduces cognitive load."
    },
    {
      title: "Example 4 (edge case): noisy formatting changes and tool conflicts",
      description: "<p>Introducing a formatter late creates huge diffs, and overlapping tools can fight each other.</p>",
      code: "// Reformatting an old repo in a feature PR -> 2000-line diff that hides the real\n" +
        "//   change + breaks git blame. Do a SEPARATE 'format everything' commit (and add\n" +
        "//   it to .git-blame-ignore-revs).\n" +
        "// ESLint stylistic rules vs Prettier conflict -> use eslint-config-prettier to\n" +
        "//   disable formatting rules in the linter. One tool owns formatting, one owns bugs."
    }
  ],
  whenToUse: "<p>Set this up once, at the start of a project: adopt a formatter and linter, commit their config, " +
    "and ideally run them on commit (pre-commit hook) and in CI. Then nobody hand-formats and nobody argues " +
    "about it. <strong>Why it matters beyond aesthetics:</strong> consistent formatting produces clean diffs " +
    "&mdash; a reviewer sees only the real change, not noise from re-indentation. <strong>The trap to avoid:</strong> " +
    "letting style become a bikeshedding battleground. The 'right' brace style is whichever one the team " +
    "agrees on and the tool enforces. Pick, automate, move on.</p>"
};

C["use-correct-constructs"] = {
  summary: "<p><strong>Use the correct constructs</strong> means reaching for the language feature that most " +
    "directly expresses your intent, instead of bending a general-purpose tool to do everything. Use a " +
    "<code>for...of</code> or <code>map</code> instead of a manual index loop when you just need each " +
    "element; use a <code>switch</code> or lookup over a long <code>if/else</code> ladder; use an enum/union " +
    "over magic strings; use built-in collection methods over hand-rolled loops. The right construct is " +
    "shorter, less bug-prone, and signals intent to the reader.</p>",
  examples: [
    {
      title: "Example 1: The right looping construct",
      description: "<p>When you only need the values, an index loop adds noise and off-by-one risk.</p>",
      code: "const names = ['Sam', 'Alex', 'Jo'];\n" +
        "\n" +
        "// Overkill: manual index management you don't need\n" +
        "for (let i = 0; i < names.length; i++) { console.log(names[i]); }\n" +
        "\n" +
        "// Intent-matching: 'for each name'\n" +
        "for (const name of names) { console.log(name); }\n" +
        "\n" +
        "// Even better when transforming: 'turn each name into its length'\n" +
        "const lengths = names.map(name => name.length);"
    },
    {
      title: "Example 2: Enums/unions over magic strings",
      description: "<p>A constrained type prevents typos and documents the allowed values.</p>",
      code: "// Fragile: any typo'd string compiles and silently misbehaves\n" +
        "// if (status === 'activ') { ... }\n" +
        "\n" +
        "// Correct construct: a closed set the compiler can check (TypeScript)\n" +
        "type Status = 'active' | 'suspended' | 'closed';\n" +
        "function setStatus(s: Status) { /* only valid values get here */ }"
    },
    {
      title: "Example 3: use the language feature built for the job",
      description: "<p>Reaching for the right construct removes bookkeeping and bugs.</p>",
      code: "// Manual index loop to transform -> use map\n" +
        "const out = []; for (let i=0;i<xs.length;i++) out.push(xs[i]*2);\n" +
        "const out2 = xs.map(x => x*2);\n" +
        "// Manual resource close -> try-with-resources / using / defer\n" +
        "// Sentinel/null return -> Optional / Result\n" +
        "// Long if-else on a value -> switch / pattern matching / polymorphism"
    },
    {
      title: "Example 4 (edge case): clever constructs that hurt readability",
      description: "<p>The 'correct' construct is the clearest one - dense one-liners or obscure features can be worse than a plain loop.</p>",
      code: "// Too clever: a nested ternary / reduce that nobody can parse\n" +
        "const r = xs.reduce((a,x)=>({...a,[x.k]:(a[x.k]||0)+x.v}),{}); // takes a minute to read\n" +
        "// A plain loop or a well-named helper can be the 'correct construct' here.\n" +
        "// Also beware exotic language features that your team doesn't know -> readability\n" +
        "//   for the team beats showing off. Right construct = clearest for THIS code."
    }
  ],
  whenToUse: "<p>Apply continuously as you write. When a piece of code feels clunky &mdash; lots of bookkeeping, " +
    "repeated patterns, manual index math &mdash; pause and ask if the language has a construct built for " +
    "exactly this. Learning your language's standard library and idioms is what makes this automatic. " +
    "<strong>Balance:</strong> 'correct' means clear, not 'most clever.' A dense one-liner using an obscure " +
    "operator can be worse than a plain loop your whole team understands. Idiomatic-and-readable beats " +
    "clever-and-terse.</p>"
};

C["tests-should-be-fast-and-independent"] = {
  summary: "<p>Good unit tests are <strong>fast</strong> (milliseconds, so you run them constantly) and " +
    "<strong>independent</strong> (each runs in isolation, in any order, with no shared state or hidden " +
    "ordering). A common articulation is <strong>FIRST</strong>: Fast, Independent, Repeatable, " +
    "Self-validating, Timely. Slow or interdependent tests get run rarely and trusted less, defeating their " +
    "purpose. Fast/independent tests give a tight feedback loop and pinpoint failures, which is what makes a " +
    "test suite a safety net rather than a chore.</p>",
  examples: [
    {
      title: "Example 1: Independent tests don't share mutable state",
      description: "<p>Fresh fixtures per test mean order never matters and one failure doesn't cascade.</p>",
      code: "describe('Cart', () => {\n" +
        "  let cart;\n" +
        "  beforeEach(() => { cart = new Cart(); }); // fresh instance every test\n" +
        "\n" +
        "  test('starts empty', () => {\n" +
        "    expect(cart.count()).toBe(0);\n" +
        "  });\n" +
        "  test('adds an item', () => {\n" +
        "    cart.add({ id: 1 });          // does NOT affect the test above\n" +
        "    expect(cart.count()).toBe(1);\n" +
        "  });\n" +
        "});"
    },
    {
      title: "Example 2: Fast by faking slow dependencies",
      description: "<p>Replace the real network/DB with an in-memory fake so the test runs instantly.</p>",
      code: "// Slow + flaky: hits a real API\n" +
        "// const user = await realApi.fetchUser(1);\n" +
        "\n" +
        "// Fast + deterministic: a stub returns a fixed value\n" +
        "const fakeApi = { fetchUser: async () => ({ id: 1, name: 'Test' }) };\n" +
        "const user = await getUserProfile(fakeApi, 1);\n" +
        "expect(user.name).toBe('Test');"
    },
    {
      title: "Example 3: independent tests with no shared state or order",
      description: "<p>Each test sets up its own data and passes in isolation and in any order - the F.I.R.S.T. properties.</p>",
      code: "// Bad: tests share mutable state + depend on order\n" +
        "let user;            // shared\n" +
        "test('create', () => { user = create(); });   // test B relies on A running first\n" +
        "test('update', () => { update(user); });\n" +
        "\n" +
        "// Good: each test is self-contained\n" +
        "test('update', () => { const u = create(); expect(update(u)).toBe(...); });\n" +
        "// reset state in beforeEach; no test depends on another."
    },
    {
      title: "Example 4 (edge case): slow/flaky tests from real I/O",
      description: "<p>Hitting real DBs, networks, or the clock makes tests slow and non-deterministic - the suite gets ignored.</p>",
      code: "// Flaky: depends on the real network / current time / sleep()\n" +
        "expect(await fetch(realApi)).toBe(...);   // breaks when the API/network blips\n" +
        "// Fast+stable: inject fakes for unit tests\n" +
        "expect(service.run(fakeClock, stubRepo)).toBe(...);\n" +
        "// Keep a SMALL number of slower integration tests (real DB via Testcontainers)\n" +
        "//   separate from the fast unit suite, so the inner loop stays quick."
    }
  ],
  whenToUse: "<p>Aim for fast+independent on your <em>unit</em> tests &mdash; the large base of the test " +
    "pyramid that you run on every save and in CI. Isolate them from the network, filesystem, clock, and " +
    "shared databases using fakes/stubs. <strong>Nuance:</strong> not all tests can or should be unit-fast. " +
    "Integration and end-to-end tests legitimately touch real systems and run slower; you keep fewer of them " +
    "and run them less often. The principle targets the bulk of your suite &mdash; if your 'unit' tests need " +
    "a live database, they're really integration tests in disguise, and the feedback loop suffers.</p>"
};

C["organize-code-by-actor-it-belongs-to"] = {
  summary: "<p>This is the heart of the <strong>Single Responsibility Principle</strong>, precisely stated: a " +
    "module should have one, and only one, reason to change &mdash; meaning it should answer to a single " +
    "<strong>actor</strong> (a stakeholder or role whose needs drive change). Code that serves the finance " +
    "team, the reporting team, and the DBA in one class will be pulled in three directions; a change for one " +
    "actor risks breaking another. Organizing by actor keeps each piece cohesive and changes localized.</p>",
  examples: [
    {
      title: "Example 1: One class serving three actors (the problem)",
      description: "<p>Robert Martin's classic example: three different roles all depend on one class.</p>",
      code: "// Employee serves THREE actors with conflicting reasons to change:\n" +
        "class Employee {\n" +
        "  calculatePay()   { /* owned by Accounting */ }\n" +
        "  reportHours()    { /* owned by HR */ }\n" +
        "  save()           { /* owned by the DBA / DB team */ }\n" +
        "}\n" +
        "// A tweak requested by Accounting can accidentally break HR's report."
    },
    {
      title: "Example 2: Split so each actor owns its code",
      description: "<p>Each responsibility moves to a class with a single stakeholder.</p>",
      code: "class PayCalculator  { calculatePay(employee) { /* Accounting */ } }\n" +
        "class HourReporter   { reportHours(employee)  { /* HR */ } }\n" +
        "class EmployeeRepo   { save(employee)         { /* DB team */ } }\n" +
        "\n" +
        "// Now a change for one actor touches only that actor's class."
    },
    {
      title: "Example 3: split a class by the actor it serves (SRP)",
      description: "<p>The Single Responsibility Principle is really about actors: code should change for one reason / one stakeholder.</p>",
      code: "// God class serving three actors - changes for THREE reasons:\n" +
        "class Employee { calcPay(){/*finance*/} reportHours(){/*HR*/} save(){/*DBA*/} }\n" +
        "// Split by actor: each changes for one stakeholder\n" +
        "class PayCalculator {}   // finance rules\n" +
        "class HoursReporter {}   // HR rules\n" +
        "class EmployeeRepository {} // persistence\n" +
        "// A finance change can't accidentally break an HR report."
    },
    {
      title: "Example 4 (edge case): SRP is about reasons-to-change, not 'do one tiny thing'",
      description: "<p>People over-split chasing 'one method per class'; the real test is whether two responsibilities answer to different actors.</p>",
      code: "// Over-split: ten 1-method classes that always change together -> needless\n" +
        "//   ceremony; they share ONE reason to change, so they belong together.\n" +
        "// Under-split: methods edited by finance AND HR in the same class -> merge\n" +
        "//   conflicts + accidental breakage. Group by ACTOR/reason-to-change, then keep\n" +
        "//   cohesive things together."
    }
  ],
  whenToUse: "<p>Use this lens when deciding where code <em>belongs</em> and how to split a class that's grown " +
    "uncomfortable. Ask: 'who would request a change to this, and would two different roles ever want " +
    "conflicting changes here?' If yes, that's a seam to split along. It's especially valuable in business " +
    "applications where different departments drive requirements. <strong>Caution:</strong> taken to an " +
    "extreme it fragments code into a maze of tiny classes. Group by <em>actor/reason-to-change</em>, not by " +
    "every conceivable micro-responsibility &mdash; cohesion (related things together) matters as much as " +
    "separation.</p>"
};

C["keep-framework-code-distant"] = {
  summary: "<p><strong>Keep framework code distant</strong> (a core idea of Clean/Hexagonal Architecture): " +
    "your business logic should not be tangled up with the web framework, ORM, message broker, or cloud SDK " +
    "you happen to use. Frameworks are <em>details</em> &mdash; they change, they get replaced, they have " +
    "their own opinions and lifecycles. By keeping them at the edges and having your domain depend on " +
    "abstractions instead, your core logic stays testable, portable, and unaffected when a framework is " +
    "upgraded or swapped.</p>",
  examples: [
    {
      title: "Example 1: Framework leaking into the domain (the smell)",
      description: "<p>Business rules tied directly to HTTP and ORM types are hard to test and migrate.</p>",
      code: "// Domain logic entangled with Express + an ORM\n" +
        "app.post('/orders', async (req, res) => {\n" +
        "  const total = req.body.items.reduce((s, i) => s + i.price, 0); // business rule\n" +
        "  if (total > 10000) return res.status(400).send('too large');   // business rule\n" +
        "  await OrmOrder.create({ total });                              // persistence\n" +
        "  res.json({ ok: true });\n" +
        "});\n" +
        "// To test the rules you must spin up HTTP + a database."
    },
    {
      title: "Example 2: Push the framework to the edge",
      description: "<p>Pure domain function in the center; the framework is a thin adapter around it.</p>",
      code: "// CORE: no framework, trivially unit-testable\n" +
        "function placeOrder(items, repo) {\n" +
        "  const total = items.reduce((s, i) => s + i.price, 0);\n" +
        "  if (total > 10000) throw new OrderTooLargeError();\n" +
        "  return repo.save({ total });        // repo is an abstraction\n" +
        "}\n" +
        "\n" +
        "// EDGE: the framework just translates HTTP <-> the core\n" +
        "app.post('/orders', (req, res) =>\n" +
        "  placeOrder(req.body.items, orderRepo).then(() => res.json({ ok: true })));"
    },
    {
      title: "Example 3: business logic that doesn't import the framework",
      description: "<p>Keep core domain code free of framework types so the framework is a replaceable detail (the dependency rule).</p>",
      code: "// Core (no framework imports) - pure, portable, testable:\n" +
        "class PricingService { price(cart) { /* business rules only */ } }\n" +
        "\n" +
        "// Framework layer adapts the web to the core:\n" +
        "@RestController class PricingController {       // Spring lives ONLY here\n" +
        "  PricingController(PricingService svc){...}\n" +
        "  @PostMapping('/price') price(@RequestBody c){ return svc.price(c); }\n" +
        "}"
    },
    {
      title: "Example 4 (edge case): purism vs pragmatism",
      description: "<p>Total framework isolation costs adapters/mapping; for small or short-lived apps it's over-engineering.</p>",
      code: "// Strict hexagonal/clean architecture means ports + adapters + DTO mapping for\n" +
        "//   everything -> real boilerplate. Worth it for large, long-lived domains where\n" +
        "//   the business logic outlives the framework.\n" +
        "// For a CRUD app or prototype, leaning on the framework directly is fine.\n" +
        "// The key win: don't let framework annotations/types bleed into CORE business rules."
    }
  ],
  whenToUse: "<p>Worth the effort on long-lived applications with substantial business logic, where frameworks " +
    "will outlive their welcome and you want a test suite that doesn't boot the whole stack. The payoff: you " +
    "can unit-test rules with no HTTP/DB, and a framework upgrade touches only adapter code. <strong>Trade-off:</strong> " +
    "it adds layers and indirection. For a small CRUD app or a short-lived prototype, that ceremony can cost " +
    "more than it saves &mdash; using the framework directly is fine. Apply the distance proportional to the " +
    "domain's complexity and the project's expected lifespan.</p>"
};

C["be-consistent"] = {
  summary: "<p><strong>Be consistent</strong>: within a codebase, do the same kind of thing the same way " +
    "every time &mdash; naming, file layout, error handling, the way you structure a module, how you call " +
    "the database. Consistency lets a reader transfer understanding from one part of the system to another: " +
    "once they learn the pattern, the whole codebase becomes predictable. A consistent-but-imperfect " +
    "convention is usually better than a mix of locally-optimal but globally-incoherent approaches.</p>",
  examples: [
    {
      title: "Example 1: Consistent naming and shape across modules",
      description: "<p>Every service follows the same verb conventions, so behavior is predictable.</p>",
      code: "// Pick one convention and apply it everywhere:\n" +
        "userService.getUser(id);      orderService.getOrder(id);\n" +
        "userService.createUser(data); orderService.createOrder(data);\n" +
        "\n" +
        "// AVOID a mix that forces readers to relearn each module:\n" +
        "// userService.fetchUser(id);  orderService.retrieve(id);  productService.find(id);"
    },
    {
      title: "Example 2: Consistent error handling",
      description: "<p>One agreed pattern for failures beats every function inventing its own.</p>",
      code: "// Convention: throw typed errors, never return null/false for failures\n" +
        "function getUser(id) {\n" +
        "  const user = db.find(id);\n" +
        "  if (!user) throw new NotFoundError('user', id);\n" +
        "  return user;\n" +
        "}\n" +
        "// Because EVERY function does this, callers can rely on one handling strategy."
    },
    {
      title: "Example 3: match the surrounding conventions",
      description: "<p>Consistency means new code looks like the code around it - naming, structure, error handling, patterns.</p>",
      code: "// If the codebase uses Result<T> for errors, don't throw in your new function.\n" +
        "// If repositories are named XxxRepository, don't add an XxxDao.\n" +
        "// If async uses async/await everywhere, don't introduce raw .then() chains.\n" +
        "// A reader should not be able to tell WHO wrote a given file - the style is uniform."
    },
    {
      title: "Example 4 (edge case): consistency vs improving a bad pattern",
      description: "<p>Blind consistency perpetuates mistakes; sometimes the right move is to change the convention deliberately, not locally diverge.</p>",
      code: "// If the existing pattern is genuinely bad (e.g. swallowing exceptions everywhere),\n" +
        "//   don't silently do it differently in one file -> now there are TWO patterns.\n" +
        "// Either follow the convention, OR change it across the codebase as a deliberate,\n" +
        "//   agreed migration. One-off local 'improvements' create inconsistency, which is\n" +
        "//   its own cost. Be consistent first; evolve the standard intentionally."
    }
  ],
  whenToUse: "<p>Lean on consistency constantly, and especially when joining or extending an existing codebase: " +
    "<em>follow the local style even if you'd personally choose differently</em>. New code that matches its " +
    "surroundings is easier to review and maintain than code that's 'better' but alien. Document conventions " +
    "and enforce the mechanical ones with linters. <strong>The balancing act:</strong> consistency shouldn't " +
    "freeze a bad pattern forever. When you genuinely need to improve a convention, change it deliberately " +
    "and ideally migrate broadly &mdash; don't just start a competing style in one corner, which gives you " +
    "the worst of both worlds.</p>"
};

C["scope-visibility"] = {
  summary: "<p><strong>Scope and visibility</strong> are about exposing the minimum necessary. Declare " +
    "variables in the narrowest scope where they're used; make class members <code>private</code> by " +
    "default and only widen to <code>public</code> what genuinely forms the type's contract; keep module " +
    "internals un-exported. The less that's visible, the less can be misused or depended upon, the smaller " +
    "your 'surface area,' and the more freely you can change internals. This 'principle of least exposure' " +
    "underpins encapsulation and loose coupling.</p>",
  examples: [
    {
      title: "Example 1: Narrow variable scope",
      description: "<p>Keep variables local to where they're needed instead of leaking them broadly.</p>",
      code: "// Too broad: temp lives longer than necessary, inviting reuse/confusion\n" +
        "// let temp; for (...) { temp = compute(x); use(temp); }\n" +
        "\n" +
        "// Narrow: scoped to exactly one iteration, can't leak\n" +
        "for (const x of items) {\n" +
        "  const result = compute(x);   // born and dies inside the loop\n" +
        "  use(result);\n" +
        "}"
    },
    {
      title: "Example 2: Minimal public surface on a class",
      description: "<p>Only the intended contract is public; helpers stay private and free to change.</p>",
      code: "class PriceCalculator {\n" +
        "  // public: the contract callers depend on\n" +
        "  total(cart) { return this.#withTax(this.#subtotal(cart)); }\n" +
        "\n" +
        "  // private: implementation details, safe to refactor anytime\n" +
        "  #subtotal(cart) { return cart.reduce((s, i) => s + i.price, 0); }\n" +
        "  #withTax(x)     { return x * 1.2; }\n" +
        "}"
    },
    {
      title: "Example 3: start private, widen only when needed",
      description: "<p>The smaller the scope, the less code can depend on (and break from) a change.</p>",
      code: "class Cache {\n" +
        "  #store = new Map();        // private: implementation detail, free to change\n" +
        "  get(k){ return this.#store.get(k); }   // public: the intended surface\n" +
        "}\n" +
        "// A narrow public API = a small contract to keep stable; internals can evolve.\n" +
        "// Same idea: declare variables in the tightest block scope that works."
    },
    {
      title: "Example 4 (edge case): over-exposing creates a fragile public contract",
      description: "<p>Making fields/classes public 'for convenience' or for tests turns internals into a contract you can't change without breaking callers.</p>",
      code: "// Making a field public so a test can poke it -> the field is now part of your\n" +
        "//   API; refactoring it breaks the test (and maybe consumers). Test via the\n" +
        "//   public behavior instead.\n" +
        "// 'public' everywhere = anyone can depend on anything = nothing is safe to change.\n" +
        "// Default to private/package-private; widen deliberately when a real caller needs it."
    }
  ],
  whenToUse: "<p>Default to the most restrictive scope/visibility and widen only when a real need appears &mdash; " +
    "it's far easier to make something more visible later than to claw back something the whole codebase now " +
    "depends on. This directly shrinks the public API you must keep stable. <strong>Why it matters:</strong> " +
    "every public member is a promise; the fewer you make, the more freedom you keep to refactor. " +
    "<strong>Gotcha:</strong> don't make things <code>public</code> 'so the tests can reach them' &mdash; " +
    "test through the public contract instead, or it signals the class is doing too much. Restrict first, " +
    "expose deliberately.</p>"
};

/* ======================================================================
   SECTION 3 — DESIGN PRINCIPLES
   ====================================================================== */

C["design-principles"] = {
  summary: "<p><strong>Design principles</strong> are time-tested guidelines for structuring code so it's " +
    "easier to change, extend, and understand. They are not rigid rules but heuristics that nudge you away " +
    "from common traps: tight coupling, duplication, rigidity, and needless complexity. The well-known ones " +
    "&mdash; SOLID, DRY, KISS, YAGNI, Law of Demeter, composition over inheritance &mdash; all ultimately " +
    "serve one goal: managing change. Software that can't absorb change cheaply is software that rots, so " +
    "these principles are really about keeping future modification affordable.</p>",
  examples: [
    {
      title: "Example 1: A principle-driven refactor",
      description: "<p>Applying 'depend on abstractions' makes a class open to new behavior without edits.</p>",
      code: "// Rigid: hard-wired to one concrete logger\n" +
        "class Service { constructor() { this.logger = new FileLogger(); } }\n" +
        "\n" +
        "// Flexible: depends on an abstraction, injected from outside\n" +
        "class Service {\n" +
        "  constructor(logger) { this.logger = logger; } // any Logger works\n" +
        "}\n" +
        "// Now tests inject a fake; prod injects a real one - no class change needed."
    },
    {
      title: "Example 2: Principles often reinforce each other",
      description: "<p>Removing duplication (DRY) also yields a single, well-named place to change (SRP).</p>",
      code: "// Duplicated rule in two places drifts out of sync over time\n" +
        "// AFTER: one source of truth, satisfies DRY and gives one reason to change\n" +
        "const TAX_RATE = 0.2;\n" +
        "const withTax = amount => amount * (1 + TAX_RATE);\n" +
        "// Every caller now shares one definition."
    },
    {
      title: "Example 3: the core principles at a glance",
      description: "<p>Most design heuristics reduce to: reduce coupling, raise cohesion, and don't repeat knowledge.</p>",
      code: "// SOLID  - five OOP guidelines for change-friendly code\n" +
        "// DRY    - one authoritative source for each piece of knowledge\n" +
        "// KISS   - prefer the simplest thing that works\n" +
        "// YAGNI  - don't build for imagined future needs\n" +
        "// Demeter- talk to friends, not strangers (avoid deep chains)\n" +
        "// composition over inheritance; depend on abstractions"
    },
    {
      title: "Example 4 (edge case): principles conflict - they're heuristics, not laws",
      description: "<p>DRY can fight decoupling; SOLID can fight KISS. Good design balances them for the context.</p>",
      code: "// DRY vs decoupling: merging two superficially-similar bits creates a WRONG\n" +
        "//   abstraction + coupling -> sometimes duplication is the lesser evil.\n" +
        "// SOLID vs KISS: full SOLID on a tiny script = over-engineering.\n" +
        "// Apply judgment: these guide thinking, they don't substitute for it. The goal\n" +
        "//   is code that's easy to change, not maximal rule compliance."
    }
  ],
  whenToUse: "<p>Keep these principles in mind during design and code review, especially for code you expect to " +
    "evolve. They're guides, not laws &mdash; their value is in <em>preventing</em> the pain of rigid, " +
    "duplicated, tangled code before it sets in. <strong>The meta-gotcha:</strong> principles can be " +
    "over-applied. Religiously following SOLID/DRY on a tiny script produces more abstraction than the " +
    "problem warrants. Always weigh a principle against simplicity (KISS) and actual need (YAGNI). Apply " +
    "them to solve a problem you actually have, not to score purity points.</p>"
};

C["solid"] = {
  summary: "<p><strong>SOLID</strong> is five object-oriented design principles (Robert C. Martin) for " +
    "building maintainable systems: <strong>S</strong>ingle Responsibility (one reason to change), " +
    "<strong>O</strong>pen/Closed (open to extension, closed to modification), <strong>L</strong>iskov " +
    "Substitution (subtypes must be usable wherever the base type is), <strong>I</strong>nterface " +
    "Segregation (many small focused interfaces over one fat one), and <strong>D</strong>ependency " +
    "Inversion (depend on abstractions, not concretions). Together they push you toward loosely-coupled, " +
    "extensible code.</p>",
  examples: [
    {
      title: "Example 1: Open/Closed + Dependency Inversion",
      description: "<p>Add new shapes without touching the calculator, and depend on an abstraction.</p>",
      code: "// Open/Closed: new shapes plug in, AreaCalculator never changes\n" +
        "class Circle { area() { return Math.PI * this.r ** 2; } }\n" +
        "class Square { area() { return this.s * this.s; } }\n" +
        "\n" +
        "function totalArea(shapes) {        // depends on the 'area()' abstraction\n" +
        "  return shapes.reduce((sum, s) => sum + s.area(), 0);\n" +
        "}\n" +
        "// Adding a Triangle requires zero edits here."
    },
    {
      title: "Example 2: Interface Segregation",
      description: "<p>Don't force a class to implement methods it doesn't need.</p>",
      code: "// BAD: a fat interface forces empty/throwing methods\n" +
        "// interface Machine { print(); scan(); fax(); }\n" +
        "\n" +
        "// GOOD: small interfaces; a class implements only what it does\n" +
        "interface Printer { print(): void; }\n" +
        "interface Scanner { scan(): void; }\n" +
        "class SimplePrinter implements Printer { print() {} } // no useless fax()"
    },
    {
      title: "Example 3: the five principles, one line each",
      description: "<p>SOLID is five guidelines that make OOP code easier to change.</p>",
      code: "// S - Single Responsibility: a class changes for ONE reason/actor\n" +
        "// O - Open/Closed: open to extension, closed to modification (add, don't edit)\n" +
        "// L - Liskov Substitution: subtypes must be usable as their base type\n" +
        "// I - Interface Segregation: many small interfaces > one fat one\n" +
        "// D - Dependency Inversion: depend on abstractions, not concretions"
    },
    {
      title: "Example 4 (edge case): Open/Closed via polymorphism, not editing",
      description: "<p>OCP in action: adding a case shouldn't mean editing existing code - but applied dogmatically it can over-abstract.</p>",
      code: "// Violates OCP: must EDIT this switch for every new shape\n" +
        "function area(s){ switch(s.kind){ case 'circle':...; case 'square':... } }\n" +
        "// Satisfies OCP: ADD a class, don't touch existing code\n" +
        "interface Shape { area(): number; }\n" +
        "class Triangle implements Shape { area(){...} }  // new file, nothing edited\n" +
        "// Caveat: don't pre-build extension points for variation that may never come (YAGNI)."
    }
  ],
  whenToUse: "<p>SOLID earns its keep in medium-to-large OOP codebases that change often and have multiple " +
    "developers &mdash; business systems, frameworks, anything with a long life. The most universally useful " +
    "members are SRP (keeps classes focused) and DIP (makes code testable via injected abstractions). " +
    "<strong>Gotcha:</strong> SOLID is frequently over-applied, producing a blizzard of interfaces and " +
    "single-method classes that obscure simple logic. The principles assume a certain scale; on small or " +
    "stable code they add ceremony without payoff. Use them to relieve real pain (rigidity, untestability), " +
    "not as a box-ticking ritual.</p>"
};

C["dry"] = {
  summary: "<p><strong>DRY &mdash; Don't Repeat Yourself</strong> &mdash; states that every piece of " +
    "<em>knowledge</em> should have a single, authoritative representation in the system. When a business " +
    "rule, constant, or piece of logic is duplicated, changing it means finding and updating every copy, and " +
    "missing one creates bugs. DRY is really about knowledge, not text: two snippets that look identical but " +
    "represent <em>different</em> decisions should stay separate. Centralizing genuine duplication gives you " +
    "one place to change and one source of truth.</p>",
  examples: [
    {
      title: "Example 1: Centralizing a duplicated rule",
      description: "<p>The tax rule lived in three files; now it lives in one.</p>",
      code: "// BEFORE (scattered): the same rule copy-pasted, drifts over time\n" +
        "// fileA: price * 1.2   fileB: price * 1.2   fileC: price * 1.20\n" +
        "\n" +
        "// AFTER: one definition everyone imports\n" +
        "export const TAX_RATE = 0.2;\n" +
        "export const withTax = amount => amount * (1 + TAX_RATE);\n" +
        "// Change the rate once -> the whole app updates."
    },
    {
      title: "Example 2: Extracting repeated logic into a helper",
      description: "<p>Repeated validation becomes a single reusable function.</p>",
      code: "// Repeated in many handlers\n" +
        "// if (!email.includes('@')) throw new Error('bad email');\n" +
        "\n" +
        "function assertValidEmail(email) {\n" +
        "  if (!/^[^@]+@[^@]+\\.[^@]+$/.test(email)) {\n" +
        "    throw new ValidationError('Invalid email');\n" +
        "  }\n" +
        "}\n" +
        "// Now every caller shares one definition of 'valid email'."
    },
    {
      title: "Example 3: centralize a single source of truth",
      description: "<p>DRY targets duplicated knowledge - one authoritative definition that everything references.</p>",
      code: "// Duplicated rule -> drifts apart when one copy is updated:\n" +
        "if (user.age >= 18) {...}   // here\n" +
        "if (u.age >= 18) {...}      // and here, and 5 other places\n" +
        "// One source of truth:\n" +
        "const VOTING_AGE = 18;\n" +
        "function isAdult(u){ return u.age >= VOTING_AGE; }  // referenced everywhere"
    },
    {
      title: "Example 4 (edge case): false DRY - coincidental duplication",
      description: "<p>Code that merely looks the same isn't the same knowledge; merging it couples unrelated things (a wrong abstraction is worse than duplication).</p>",
      code: "// Two validators happen to both check 'length > 3' TODAY:\n" +
        "function validUsername(s){ return s.length > 3; }\n" +
        "function validTag(s){ return s.length > 3; }\n" +
        "// 'DRY' them into one -> later usernames need length>5 but tags don't -> now the\n" +
        "//   shared function has a flag/branch and couples two unrelated rules.\n" +
        "// They represent DIFFERENT knowledge that coincidentally matches -> keep separate."
    }
  ],
  whenToUse: "<p>Apply DRY when the same <em>knowledge</em> appears in multiple places &mdash; a constant, a " +
    "calculation, a validation rule, a config value. It pays off most for things that genuinely change " +
    "together. <strong>The big trap is over-DRYing:</strong> forcing unrelated code that merely looks similar " +
    "into one shared abstraction creates tight coupling, and when the two cases later diverge you get a " +
    "tangle of flags and special cases. The healthier guideline is often 'a little duplication is cheaper " +
    "than the wrong abstraction' (the Rule of Three: wait until you see it three times before extracting). " +
    "DRY knowledge, not coincidental resemblance.</p>"
};

C["kiss"] = {
  summary: "<p><strong>KISS &mdash; Keep It Simple, Stupid</strong> &mdash; urges you to favor the simplest " +
    "solution that solves the problem. Complexity is the primary enemy of maintainability: every clever " +
    "abstraction, extra layer, or premature optimization is something future readers must understand and " +
    "future changes must navigate. Simple code is easier to read, test, debug, and modify. KISS isn't about " +
    "writing dumb code &mdash; it's about resisting unnecessary sophistication and choosing clarity over " +
    "cleverness.</p>",
  examples: [
    {
      title: "Example 1: Simple beats clever",
      description: "<p>Both check if a number is even; the simple one is instantly readable.</p>",
      code: "// Clever but opaque\n" +
        "const isEven = n => !(n & 1);\n" +
        "\n" +
        "// Simple and obvious to everyone\n" +
        "const isEven2 = n => n % 2 === 0;"
    },
    {
      title: "Example 2: Don't build a framework for a one-off",
      description: "<p>A configurable, plugin-based engine where a direct call would do.</p>",
      code: "// Over-engineered for a single, fixed need\n" +
        "// const pipeline = new RuleEngine().register(new DiscountRule())\n" +
        "//   .register(new TaxRule()).build(); pipeline.run(order);\n" +
        "\n" +
        "// KISS: the problem is just two steps\n" +
        "function priceOrder(order) {\n" +
        "  return withTax(applyDiscount(order.total));\n" +
        "}"
    },
    {
      title: "Example 3: prefer the simple solution",
      description: "<p>KISS favors the most straightforward approach a reader can grasp immediately.</p>",
      code: "// Over-engineered: a config-driven rules engine for 3 fixed cases\n" +
        "// Simple: just write the 3 cases\n" +
        "function shippingCost(weight) {\n" +
        "  if (weight < 1) return 5;\n" +
        "  if (weight < 5) return 10;\n" +
        "  return 20;\n" +
        "}\n" +
        "// Reach for the framework/abstraction only when the simple version stops scaling."
    },
    {
      title: "Example 4 (edge case): 'simple' is not 'simplistic' or terse",
      description: "<p>KISS means low essential complexity, not fewest characters or skipping needed error handling.</p>",
      code: "// Falsely 'simple': a dense one-liner that's hard to read, or code that ignores\n" +
        "//   edge cases ('happy path only') -> that's simplistic, and it bites later.\n" +
        "// Genuinely simple: clear, handles the real cases, no speculative machinery.\n" +
        "// Also: some problems are irreducibly complex (crypto, concurrency) - KISS means\n" +
        "//   don't ADD accidental complexity, not pretend essential complexity away."
    }
  ],
  whenToUse: "<p>KISS is a constant counterweight, most needed exactly when you feel the urge to be clever or " +
    "to 'future-proof.' Before adding an abstraction, pattern, or config option, ask whether the current " +
    "problem actually requires it. Simpler designs are cheaper to change later, which usually beats trying " +
    "to anticipate the future. <strong>Balance:</strong> 'simple' means simple <em>for the problem</em> " +
    "&mdash; oversimplifying genuinely complex domains (cramming real complexity into one giant function) is " +
    "its own failure. The goal is the <em>least</em> complexity the problem honestly demands, no more and no " +
    "less.</p>"
};

C["keep-it-simple-and-refactor-often"] = {
  summary: "<p>This pairs KISS with continuous <strong>refactoring</strong>: start with the simplest thing " +
    "that works, then improve the structure in small, safe steps as the code teaches you what it needs to " +
    "be. Refactoring is changing internal structure <em>without</em> changing external behavior &mdash; " +
    "renaming, extracting functions, removing duplication &mdash; and it's only safe when you have tests. " +
    "The philosophy rejects big up-front 'perfect' designs in favor of evolving the design as understanding " +
    "grows, keeping the code clean as you go rather than letting debt pile up.</p>",
  examples: [
    {
      title: "Example 1: A small refactoring step",
      description: "<p>Extracting a confusing condition into a named function &mdash; behavior unchanged.</p>",
      code: "// Before\n" +
        "if (order.total > 100 && order.customer.years > 2) { applyVip(order); }\n" +
        "\n" +
        "// After: clearer, same behavior - a safe, mechanical refactor\n" +
        "if (qualifiesForVip(order)) { applyVip(order); }\n" +
        "function qualifiesForVip(o) {\n" +
        "  return o.total > 100 && o.customer.years > 2;\n" +
        "}"
    },
    {
      title: "Example 2: Refactor under the safety of tests",
      description: "<p>Tests are what make 'refactor often' safe rather than reckless.</p>",
      code: "// 1. Tests are green and pin down behavior\n" +
        "test('vip when total>100 and loyal', () => {\n" +
        "  expect(qualifiesForVip({ total: 150, customer: { years: 3 } })).toBe(true);\n" +
        "});\n" +
        "// 2. Restructure freely.  3. Tests still green => behavior preserved."
    },
    {
      title: "Example 3: the boy-scout rule + red-green-refactor",
      description: "<p>Continuous small refactors keep code healthy without big risky rewrites.</p>",
      code: "// Leave each file a little cleaner than you found it:\n" +
        "//   touching a function? rename a bad variable, extract a confusing block.\n" +
        "// With tests: red (failing test) -> green (make it pass) -> REFACTOR (clean up,\n" +
        "//   tests still green). The test safety net makes continuous cleanup safe.\n" +
        "// Small, frequent improvements >> one heroic rewrite."
    },
    {
      title: "Example 4 (edge case): refactoring without tests, or gold-plating",
      description: "<p>Refactoring needs a safety net, and 'keep it simple' means not refactoring code that doesn't need it.</p>",
      code: "// Refactoring untested legacy code = changing behavior blindly -> add\n" +
        "//   characterization tests FIRST, then refactor.\n" +
        "// Don't refactor for its own sake: rewriting stable, working code to be 'prettier'\n" +
        "//   risks new bugs for no real gain (and isn't simple). Refactor when it eases an\n" +
        "//   upcoming change or removes real friction - not as decoration."
    }
  ],
  whenToUse: "<p>Refactor continuously in small doses &mdash; the 'boy scout rule': leave each file a little " +
    "cleaner than you found it. The best moment is right before adding a feature (tidy the area you're about " +
    "to change) and right after (clean up what you just learned). <strong>Prerequisite and gotcha:</strong> " +
    "refactoring without tests is just 'changing code and hoping' &mdash; you need a safety net to guarantee " +
    "behavior is preserved. Also resist mixing refactoring with feature changes in one commit; keep them " +
    "separate so each is easy to review and revert.</p>"
};

C["yagni"] = {
  summary: "<p><strong>YAGNI &mdash; You Aren't Gonna Need It</strong> &mdash; warns against building " +
    "functionality, abstraction, or flexibility based on speculation about future needs. The vast majority " +
    "of anticipated requirements either never arrive or arrive in a different shape than imagined, so " +
    "speculative code becomes complexity you maintain for nothing &mdash; and it often makes the real change " +
    "harder when it comes. YAGNI says build for the requirements you actually have <em>now</em>, and add " +
    "more when (and only when) a concrete need materializes.</p>",
  examples: [
    {
      title: "Example 1: Don't build speculative flexibility",
      description: "<p>One payment method exists today; the multi-provider framework is imagined.</p>",
      code: "// Speculative: an abstraction + factory for providers you don't have yet\n" +
        "// class PaymentProviderFactory { ... 5 strategies, config, registry ... }\n" +
        "\n" +
        "// YAGNI: solve today's actual need directly\n" +
        "function chargeCard(amount, token) {\n" +
        "  return stripe.charge(amount, token);\n" +
        "}\n" +
        "// Add the abstraction the day a SECOND provider is real."
    },
    {
      title: "Example 2: Don't add unused config knobs",
      description: "<p>Every 'just in case' option is permanent surface area to support and test.</p>",
      code: "// Over-built: options nobody asked for\n" +
        "// function send(msg, { retries=3, backoff='exponential', priority='normal',\n" +
        "//                      encoding='utf8', compress=false } = {}) { ... }\n" +
        "\n" +
        "// YAGNI: the only requirement is 'send a message'\n" +
        "function send(msg) { transport.write(msg); }"
    },
    {
      title: "Example 3: build for today's requirement, not an imagined one",
      description: "<p>YAGNI says don't add capability until there's a real, present need for it.</p>",
      code: "// Speculative: a plugin system, generic config, and 3 DB adapters for an app\n" +
        "//   that supports exactly ONE payment provider today.\n" +
        "// YAGNI: implement the one provider behind a small interface; add the second\n" +
        "//   adapter WHEN you actually integrate the second provider.\n" +
        "// Unused flexibility is code to maintain, test, and read - for nothing."
    },
    {
      title: "Example 4 (edge case): YAGNI is not an excuse to skip design",
      description: "<p>Don't pre-build features, but DO leave seams; some decisions (security, data model) are expensive to retrofit.</p>",
      code: "// YAGNI misused: hard-coding everything with no abstraction 'because YAGNI' ->\n" +
        "//   a later change requires shotgun edits everywhere.\n" +
        "// Balance: keep it simple AND keep clean boundaries so change is cheap.\n" +
        "// Things NOT to defer: security, auditing, and core data-model choices - retrofitting\n" +
        "//   these is painful. YAGNI targets speculative FEATURES, not basic good structure."
    }
  ],
  whenToUse: "<p>Invoke YAGNI whenever you're tempted to add something 'because we might need it later' &mdash; " +
    "extra parameters, generic frameworks, premature plugin systems, speculative database columns. Building " +
    "only what's needed keeps the codebase small and changeable, and you can always add the feature when it " +
    "becomes real (often more cheaply, because you'll know the actual requirement). <strong>The nuance:</strong> " +
    "YAGNI is not an excuse to ignore obvious, cheap extensibility or to write code that's painful to extend. " +
    "Some decisions (data model, public API contracts) are expensive to reverse and warrant more " +
    "forethought. Apply YAGNI to <em>speculative complexity</em>, not to basic good structure.</p>"
};

C["law-of-demeter"] = {
  summary: "<p>The <strong>Law of Demeter</strong> (the 'principle of least knowledge') says a method should " +
    "only talk to its immediate friends, not to strangers reached by digging through other objects. " +
    "Concretely: avoid long chains like <code>a.getB().getC().doSomething()</code>. Such chains couple your " +
    "code to the internal structure of distant objects, so any change deep in that structure ripples back to " +
    "you. Following the law &mdash; 'tell, don't ask', exposing behavior instead of internals &mdash; keeps " +
    "objects loosely coupled.</p>",
  examples: [
    {
      title: "Example 1: A train-wreck chain vs a direct ask",
      description: "<p>The chain knows too much about how a customer stores its address.</p>",
      code: "// Violates LoD: reaches through 3 objects' internals\n" +
        "const zip = order.getCustomer().getAddress().getZipCode();\n" +
        "\n" +
        "// Follows LoD: ask the nearest object for what you actually need\n" +
        "const zip2 = order.getShippingZip();\n" +
        "// Order decides internally how to obtain it - callers stay decoupled."
    },
    {
      title: "Example 2: Tell, don't ask",
      description: "<p>Push the behavior into the object that owns the data instead of pulling data out.</p>",
      code: "// Asking: caller pulls data out and decides\n" +
        "// if (account.getBalance() >= amount) account.setBalance(account.getBalance() - amount);\n" +
        "\n" +
        "// Telling: the object that owns the balance enforces the rule\n" +
        "account.withdraw(amount); // account checks its own invariant"
    },
    {
      title: "Example 3: talk to friends, not strangers",
      description: "<p>The Law of Demeter says a method should only call its own fields, parameters, and objects it creates - not reach through them.</p>",
      code: "// Violation - reaching through a chain (couples to deep structure):\n" +
        "order.getCustomer().getAddress().getCity().toUpperCase();\n" +
        "// any change to Customer/Address shape breaks this caller.\n" +
        "// Tell, don't reach - let the object expose what you need:\n" +
        "order.shippingCity();   // Order knows how to get its own city"
    },
    {
      title: "Example 4 (edge case): fluent builders and data structures are fine",
      description: "<p>Demeter targets behavioral coupling; chaining on builders or plain data (DTOs/query DSLs) is not a violation.</p>",
      code: "// NOT a violation - a fluent builder returns 'this' by design:\n" +
        "new QueryBuilder().select('*').from('users').where('id', 1).build();\n" +
        "// NOT a violation - navigating a plain data tree you own (JSON/DTO).\n" +
        "// Also don't over-apply: wrapping every chain in a delegating method can bloat\n" +
        "//   classes with pass-through 'wrapper' methods. Apply to BEHAVIOR coupling."
    }
  ],
  whenToUse: "<p>Watch for Demeter violations whenever you see method chains that traverse several objects, or " +
    "code that pulls data out of one object only to make decisions that belong to that object. Fixing them " +
    "reduces coupling so internal refactors don't break distant callers. <strong>Important exception:</strong> " +
    "the law targets <em>chains through behavior-rich objects</em>. Fluent APIs and builders " +
    "(<code>query.where().orderBy().limit()</code>) and pipelines over plain data " +
    "(<code>list.filter().map()</code>) return the same or value-like objects and are perfectly fine &mdash; " +
    "they're not 'reaching into strangers.' Don't apply the rule mechanically to every dot.</p>"
};

C["composition-over-inheritance"] = {
  summary: "<p><strong>Composition over inheritance</strong> advises building behavior by <em>combining</em> " +
    "small objects (has-a) rather than <em>extending</em> a base class (is-a). Inheritance is rigid: it's " +
    "fixed at compile time, exposes the parent's internals to the child, and deep hierarchies become brittle " +
    "(the 'fragile base class' problem). Composition is flexible: you assemble capabilities from independent " +
    "parts, can swap them at runtime, and avoid being locked into a single class lineage. It's one of the " +
    "most consequential practical principles in OOP design.</p>",
  examples: [
    {
      title: "Example 1: Inheritance explosion vs composition",
      description: "<p>Mixing features via inheritance multiplies subclasses; composition just plugs in parts.</p>",
      code: "// Inheritance: every combination needs a new class\n" +
        "// FlyingDuck, SwimmingDuck, FlyingSwimmingRobotDuck... combinatorial mess\n" +
        "\n" +
        "// Composition: assemble behaviors as interchangeable parts\n" +
        "class Duck {\n" +
        "  constructor(flyBehavior, swimBehavior) {\n" +
        "    this.fly = flyBehavior;   // a strategy object\n" +
        "    this.swim = swimBehavior;\n" +
        "  }\n" +
        "}\n" +
        "const rubberDuck = new Duck(noFly, floats); // mix & match freely"
    },
    {
      title: "Example 2: Swapping behavior at runtime",
      description: "<p>Composition lets you change a collaborator on the fly &mdash; inheritance can't.</p>",
      code: "class TextEditor {\n" +
        "  constructor(formatter) { this.formatter = formatter; }\n" +
        "  setFormatter(f) { this.formatter = f; }   // change behavior live\n" +
        "  render(text) { return this.formatter.format(text); }\n" +
        "}\n" +
        "const editor = new TextEditor(new MarkdownFormatter());\n" +
        "editor.setFormatter(new HtmlFormatter());  // impossible with fixed inheritance"
    },
    {
      title: "Example 3: inject behavior instead of inheriting it",
      description: "<p>Composition assembles behavior from parts you can swap, avoiding rigid class hierarchies.</p>",
      code: "// Inheritance explosion: FlyingQuackingDuck, MuteFlyingDuck, ... per combo\n" +
        "// Composition: plug in behaviors\n" +
        "class Duck {\n" +
        "  constructor(private fly: FlyBehavior, private sound: SoundBehavior) {}\n" +
        "  perform() { return this.fly.fly() + this.sound.make(); }\n" +
        "}\n" +
        "new Duck(new NoFly(), new Quack());  // mix freely, even change at runtime"
    },
    {
      title: "Example 4 (edge case): inheritance is still right for true 'is-a'",
      description: "<p>'Prefer composition' isn't 'never inherit' - a genuine, stable, substitutable is-a relationship is a fine use of inheritance.</p>",
      code: "// Reasonable inheritance: class IOException extends Exception {} (true is-a).\n" +
        "// Composition shines for HAS-A / behavior reuse across unrelated types.\n" +
        "// Over-composition can also fragment logic into many tiny collaborators that are\n" +
        "//   hard to trace. Choose by the relationship: is-a + substitutable -> inherit;\n" +
        "//   varying/shared behavior -> compose."
    }
  ],
  whenToUse: "<p>Default to composition for sharing or varying behavior &mdash; especially when you'd otherwise " +
    "create subclasses just to mix features, or when behavior might change at runtime. It underpins many " +
    "design patterns (Strategy, Decorator). Reserve inheritance for genuine, stable 'is-a' subtyping where " +
    "Liskov substitution holds. <strong>Trade-off:</strong> composition can mean more wiring &mdash; more " +
    "small objects to create and connect &mdash; and a bit more indirection than a single inherited method. " +
    "For a small, truly fixed hierarchy, inheritance is simpler. But when in doubt, composition ages better.</p>"
};

C["program-against-abstractions"] = {
  summary: "<p><strong>Program against abstractions, not implementations</strong> &mdash; the Dependency " +
    "Inversion Principle in practice. High-level code should depend on interfaces/abstract types, and the " +
    "concrete details should be supplied from outside (dependency injection). This decouples your logic from " +
    "specific libraries, databases, or services: you can swap implementations, test with fakes, and change " +
    "infrastructure without rewriting business logic. The direction of dependency 'inverts' so that details " +
    "depend on abstractions, not the other way around.</p>",
  examples: [
    {
      title: "Example 1: Depend on an interface, inject the concrete",
      description: "<p>The service works with any repository that fulfills the contract.</p>",
      code: "interface UserRepository { findById(id: string): User; }\n" +
        "\n" +
        "class UserService {\n" +
        "  constructor(private repo: UserRepository) {} // abstraction, injected\n" +
        "  getName(id: string) { return this.repo.findById(id).name; }\n" +
        "}\n" +
        "\n" +
        "// prod:  new UserService(new PostgresUserRepo());\n" +
        "// tests: new UserService(new InMemoryUserRepo());  // no DB needed"
    },
    {
      title: "Example 2: Why it makes testing trivial",
      description: "<p>A fake implementation lets you test logic in isolation, fast and deterministically.</p>",
      code: "const fakeRepo = {\n" +
        "  findById: () => ({ id: '1', name: 'Test User' })\n" +
        "};\n" +
        "const service = new UserService(fakeRepo);\n" +
        "expect(service.getName('1')).toBe('Test User'); // no real database involved"
    },
    {
      title: "Example 3: depend on an interface, inject the implementation",
      description: "<p>High-level code references an abstraction; the concrete detail is supplied from outside (Dependency Inversion).</p>",
      code: "// core depends on the ABSTRACTION:\n" +
        "class ReportService { constructor(private store: BlobStore) {} }\n" +
        "interface BlobStore { put(key, data): void; }\n" +
        "// details implement it; wiring happens at the edge:\n" +
        "class S3Store implements BlobStore { put(k,d){...} }\n" +
        "new ReportService(new S3Store());   // swap to LocalStore in tests, no core change"
    },
    {
      title: "Example 4 (edge case): don't abstract things that won't vary",
      description: "<p>Abstraction is for boundaries that change (DB, HTTP, time); wrapping stable internals in interfaces is pointless indirection.</p>",
      code: "// Worth abstracting: external/volatile boundaries (DB, payment, clock, filesystem).\n" +
        "// NOT worth it: an interface over a pure helper that has one impl and never\n" +
        "//   varies -> you've added a layer for nothing (and an extra file to open).\n" +
        "// Program to abstractions WHERE substitution/testing matters; use concrete types\n" +
        "//   freely for stable internal logic."
    }
  ],
  whenToUse: "<p>Apply this at the boundaries between your core logic and the outside world: databases, HTTP " +
    "clients, message queues, file systems, third-party SDKs, the clock and randomness. Those are the things " +
    "you most want to swap (for tests, for new providers) and most want to keep out of your domain. " +
    "<strong>Gotcha &mdash; don't invert everything:</strong> wrapping every internal class in an interface " +
    "creates a maze of indirection where 'jump to definition' lands on an interface with one implementation. " +
    "Abstract the volatile, external, or test-relevant dependencies; let stable internal collaborators be " +
    "concrete.</p>"
};

C["encapsulate-what-varies"] = {
  summary: "<p><strong>Encapsulate what varies</strong> &mdash; identify the parts of your system most likely " +
    "to change, and isolate them behind a stable interface so the rest of the code is shielded from those " +
    "changes. It's a foundational idea behind most design patterns: find the axis of variation (the payment " +
    "method, the sorting strategy, the export format) and wrap it so swapping or extending it doesn't ripple " +
    "outward. The corollary is that <em>stable</em> code and <em>volatile</em> code should be separated, not " +
    "interleaved.</p>",
  examples: [
    {
      title: "Example 1: Isolate the varying part behind a contract",
      description: "<p>The export format varies; everything else stays stable behind one interface.</p>",
      code: "// What varies: HOW data is exported. Encapsulate it.\n" +
        "interface Exporter { export(data: Row[]): string; }\n" +
        "class CsvExporter  implements Exporter { export(d) { /* ... */ return 'csv'; } }\n" +
        "class JsonExporter implements Exporter { export(d) { /* ... */ return 'json'; } }\n" +
        "\n" +
        "// Stable code never changes when a new format appears\n" +
        "function downloadReport(exporter: Exporter, data: Row[]) {\n" +
        "  return exporter.export(data);\n" +
        "}"
    },
    {
      title: "Example 2: Pull a changeable rule into one place",
      description: "<p>Pricing rules change often; isolate them so callers don't.</p>",
      code: "// Volatile business policy, encapsulated behind a method\n" +
        "class PricingPolicy {\n" +
        "  discountFor(customer) {\n" +
        "    if (customer.tier === 'gold') return 0.2; // changes frequently...\n" +
        "    return 0;                                  // ...but only here\n" +
        "  }\n" +
        "}\n" +
        "// Checkout code calls policy.discountFor(c) and is insulated from changes."
    },
    {
      title: "Example 3: isolate the part that varies behind an interface",
      description: "<p>Identify what changes (algorithms, formats, providers) and put it behind a stable abstraction so the rest stays untouched.</p>",
      code: "// Varying part = the payment provider -> encapsulate it:\n" +
        "interface PaymentProvider { charge(cents): Result; }\n" +
        "class Stripe implements PaymentProvider {}\n" +
        "class Paypal implements PaymentProvider {}\n" +
        "// stable code depends on PaymentProvider; adding a provider doesn't touch it.\n" +
        "// This is the basis of Strategy, and the spirit of Open/Closed."
    },
    {
      title: "Example 4 (edge case): guessing wrong about what varies",
      description: "<p>If you encapsulate the wrong axis, you add abstraction that never flexes while the real change cuts across your boundaries.</p>",
      code: "// You abstract 'storage backend' (never changes) but hard-code the report FORMAT\n" +
        "//   (which is what actually keeps changing) -> the abstraction doesn't help.\n" +
        "// Encapsulate variation you can OBSERVE (you've already changed it once, or a\n" +
        "//   requirement clearly implies it) - not speculative axes (YAGNI). Refactor to\n" +
        "//   introduce the boundary when the second variant actually arrives."
    }
  ],
  whenToUse: "<p>Use this when you can see a clear axis of change &mdash; multiple algorithms, formats, " +
    "providers, or business rules that shift with requirements. Wrapping the variation pays off every time " +
    "that part changes, because the change stays contained. <strong>The judgement call:</strong> you must " +
    "correctly identify <em>what actually varies</em>. Guessing wrong (encapsulating something stable while " +
    "interleaving the truly volatile part) adds abstraction with no benefit &mdash; the YAGNI failure mode. " +
    "Often the honest move is to wait until you've seen the variation at least once before building the " +
    "abstraction around it.</p>"
};

C["command-query-separation"] = {
  summary: "<p><strong>Command-Query Separation (CQS)</strong> states that every method should be either a " +
    "<strong>command</strong> (does something / changes state, returns nothing) or a <strong>query</strong> " +
    "(answers something / returns a value, changes nothing) &mdash; never both. A query you can call freely " +
    "without side effects is safe to use anywhere and reason about; a command makes its state change " +
    "explicit. Mixing the two (a getter that also mutates) produces surprising, hard-to-debug behavior. CQS " +
    "is the principle behind the larger CQRS architectural pattern.</p>",
  examples: [
    {
      title: "Example 1: Separate the command from the query",
      description: "<p>A method that both returns a value and mutates is a hidden trap; split it.</p>",
      code: "// Violates CQS: looks like a query, but secretly mutates\n" +
        "// getNextId() { this.counter++; return this.counter; }\n" +
        "\n" +
        "// CQS: a command to change, a query to read\n" +
        "class Counter {\n" +
        "  #value = 0;\n" +
        "  increment() { this.#value++; }      // command: changes, returns nothing\n" +
        "  get value() { return this.#value; } // query: returns, changes nothing\n" +
        "}"
    },
    {
      title: "Example 2: Why pure queries are safe",
      description: "<p>Because a query has no side effects, calling it twice or in a log is harmless.</p>",
      code: "// Safe: total() is a query, no surprises from repeated calls\n" +
        "log('debug', `cart total is ${cart.total()}`);\n" +
        "if (cart.total() > 100) applyDiscount();\n" +
        "// If total() also mutated, this debug log would change program behavior!"
    },
    {
      title: "Example 3: a method either changes state OR returns data, not both",
      description: "<p>Commands mutate and return nothing; queries return data and cause no observable change.</p>",
      code: "// Query: pure read, no side effects\n" +
        "getBalance(): number { return this.balance; }\n" +
        "// Command: mutates, returns void\n" +
        "deposit(amount: number): void { this.balance += amount; }\n" +
        "// Asking a question never changes the answer -> safe to call queries freely."
    },
    {
      title: "Example 4 (edge case): pragmatic violations - pop(), and 'create' returning an id",
      description: "<p>Some idiomatic APIs deliberately break CQS; that's acceptable when the combined operation is clearer or atomic.</p>",
      code: "// stack.pop() both returns the top AND removes it - a well-understood exception.\n" +
        "// createUser() often returns the new id (a command that yields a value) for\n" +
        "//   convenience/atomicity. That's fine - just be consistent and intentional.\n" +
        "// The thing to AVOID is a getter that secretly mutates (a hidden side effect in\n" +
        "//   a 'query'), which surprises callers and breaks reasoning."
    }
  ],
  whenToUse: "<p>Follow CQS by default when designing methods &mdash; it makes code predictable and prevents the " +
    "nasty class of bug where reading a value changes it. It also clarifies intent: readers know a query is " +
    "safe and a command is where change happens. <strong>Pragmatic exceptions exist:</strong> some " +
    "well-established idioms intentionally combine both, like <code>stack.pop()</code> (returns the item " +
    "<em>and</em> removes it) or 'get-or-create'/atomic 'compareAndSet' operations. These are accepted " +
    "because their dual nature is obvious and expected. Treat CQS as the default and break it only when a " +
    "combined operation is genuinely clearer or required for atomicity.</p>"
};

C["tell-don-t-ask"] = {
  summary: "<p><strong>Tell, Don't Ask</strong> says: rather than pulling data out of an object to make a " +
    "decision and then act on it, <em>tell</em> the object what you want done and let it decide using its " +
    "own internal state. This keeps data and the behavior that operates on it together (true encapsulation), " +
    "instead of scattering an object's logic across every caller that interrogates it. It's closely tied to " +
    "the Law of Demeter and is the antidote to 'anemic' objects that are just data with external procedures " +
    "acting on them.</p>",
  examples: [
    {
      title: "Example 1: Asking vs telling",
      description: "<p>The 'ask' version puts the rule outside the object; the 'tell' version keeps it inside.</p>",
      code: "// ASK: caller reads state and enforces the rule (logic leaks out)\n" +
        "if (account.getBalance() >= amount) {\n" +
        "  account.setBalance(account.getBalance() - amount);\n" +
        "}\n" +
        "\n" +
        "// TELL: the object enforces its own invariant\n" +
        "account.withdraw(amount); // throws if insufficient - rule lives WITH the data"
    },
    {
      title: "Example 2: Telling avoids duplicated rules",
      description: "<p>If five callers 'ask', the same rule gets copied five times and can drift.</p>",
      code: "class Thermostat {\n" +
        "  #temp = 20;\n" +
        "  // Tell it to adjust; it owns the safe-range rule in ONE place\n" +
        "  adjust(delta) {\n" +
        "    const next = this.#temp + delta;\n" +
        "    if (next < 10 || next > 30) throw new Error('out of safe range');\n" +
        "    this.#temp = next;\n" +
        "  }\n" +
        "}"
    },
    {
      title: "Example 3: tell the object what to do, don't pull out its data",
      description: "<p>Move the logic to the object that owns the data instead of querying and deciding from outside.</p>",
      code: "// Ask: caller reaches into the object's state and decides\n" +
        "if (account.getBalance() >= amount) account.setBalance(account.getBalance()-amount);\n" +
        "// Tell: the object enforces its own rule\n" +
        "account.withdraw(amount);   // throws if insufficient - logic lives with the data\n" +
        "// keeps invariants in one place and removes scattered get/check/set duplication."
    },
    {
      title: "Example 4 (edge case): Tell-Don't-Ask vs CQS, and reporting/DTOs",
      description: "<p>It can tension with 'queries return data', and pure read/reporting code legitimately asks for data.</p>",
      code: "// You still NEED queries (getBalance for a UI/report) - Tell-Don't-Ask targets\n" +
        "//   DECISIONS/behavior, not all reads.\n" +
        "// Don't contort everything into 'tell': a reporting layer reading DTOs is fine.\n" +
        "// Apply it where logic about an object's state belongs WITH that object; keep\n" +
        "//   plain data access for genuine read/serialization needs."
    }
  ],
  whenToUse: "<p>Apply it when you notice callers doing 'get value &rarr; check it &rarr; set value' against the " +
    "same object &mdash; that decision logic belongs <em>inside</em> the object. Following it produces " +
    "behavior-rich objects, less duplication, and stronger encapsulation. <strong>Limits:</strong> it's a " +
    "principle for objects that own behavior, not for plain data structures, DTOs, or value objects whose " +
    "whole job is to carry data across a boundary &mdash; those legitimately expose their fields. And you " +
    "still need queries to display data (you can't 'tell' a UI without reading something). Use it to stop " +
    "<em>logic</em> from leaking out, not to forbid all reading.</p>"
};

C["hollywood-principle"] = {
  summary: "<p>The <strong>Hollywood Principle</strong> &mdash; 'Don't call us, we'll call you' &mdash; " +
    "describes <strong>inversion of control</strong>: instead of your code calling into a library to drive " +
    "the flow, a framework holds the flow and calls <em>your</em> code at the right moments (via callbacks, " +
    "hooks, event handlers, lifecycle methods, or injected dependencies). This inverts the traditional " +
    "direction of control and is the backbone of frameworks, dependency-injection containers, and " +
    "event-driven systems. It lets the framework own the hard plumbing while you supply just the custom bits.</p>",
  examples: [
    {
      title: "Example 1: The framework calls your code",
      description: "<p>You don't run the event loop; you register a handler and it's invoked for you.</p>",
      code: "// You DON'T write: while(true) { checkForClicks(); }\n" +
        "// You register a callback; the framework calls it when ready:\n" +
        "button.addEventListener('click', () => {\n" +
        "  console.log('the framework called ME at the right time');\n" +
        "});"
    },
    {
      title: "Example 2: Template method / lifecycle hooks",
      description: "<p>A base class owns the algorithm and calls your overridden steps.</p>",
      code: "abstract class Migration {\n" +
        "  run() {                 // framework controls the sequence\n" +
        "    this.before();\n" +
        "    this.up();            // <- YOUR code, called by the framework\n" +
        "    this.after();\n" +
        "  }\n" +
        "  before() {}\n" +
        "  abstract up(): void;    // you implement only this\n" +
        "  after() {}\n" +
        "}"
    },
    {
      title: "Example 3: 'don't call us, we'll call you' (inversion of control)",
      description: "<p>The framework owns the flow and calls your code at the right time, rather than your code driving the framework.</p>",
      code: "// You don't call the framework's main loop; it calls your hooks:\n" +
        "class MyComponent {\n" +
        "  onInit() {}        // framework calls this when ready\n" +
        "  onClick(e) {}      // framework calls this on the event\n" +
        "}\n" +
        "// Same idea: DI containers construct + inject; test runners invoke your tests;\n" +
        "//   template methods call your overridden steps."
    },
    {
      title: "Example 4 (edge case): inverted control can obscure the flow",
      description: "<p>When the framework drives everything, execution order and 'who called this?' become non-obvious - a debugging cost.</p>",
      code: "// Lifecycle hooks fire in a framework-defined order you must LEARN (and that can\n" +
        "//   change between versions) -> 'why did onX run before onY?' surprises.\n" +
        "// Stack traces start in framework internals, not your main().\n" +
        "// Benefit (decoupling/extensibility) usually wins, but be aware you've traded\n" +
        "//   explicit control for convention - read the framework's lifecycle docs."
    }
  ],
  whenToUse: "<p>You consume this principle constantly (every framework, event system, and DI container uses " +
    "it) and you apply it yourself when building extensible systems &mdash; plugin architectures, lifecycle " +
    "hooks, middleware pipelines &mdash; where you want to own the overall flow but let others inject " +
    "behavior at defined points. <strong>Trade-off:</strong> inversion of control makes flow harder to " +
    "follow, because control 'disappears' into the framework and reappears in your callback &mdash; you " +
    "can't just read top-to-bottom. That indirection is worth it for genuine framework/extensibility needs, " +
    "but overusing callbacks and events in plain application code makes it needlessly hard to trace.</p>"
};

C["coupling-and-cohesion"] = {
  summary: "<p><strong>Coupling</strong> is how much one module depends on others; <strong>cohesion</strong> " +
    "is how strongly the elements <em>inside</em> a module belong together. The enduring goal of good design " +
    "is <strong>low coupling, high cohesion</strong>: each module is focused on one clear job (cohesive) and " +
    "interacts with others through small, stable interfaces (loosely coupled). Tightly-coupled code breaks " +
    "in distant places when you change something; low-cohesion modules are grab-bags that are hard to name " +
    "and harder to reuse. Almost every other principle here is ultimately a tactic for achieving these two.</p>",
  examples: [
    {
      title: "Example 1: Reducing coupling via an interface",
      description: "<p>Depending on an abstraction loosens the knot between modules.</p>",
      code: "// Tightly coupled: Report is welded to a specific PDF library\n" +
        "// class Report { constructor() { this.lib = new AcmePdfLib(); } }\n" +
        "\n" +
        "// Loosely coupled: depends on a small contract, not a vendor\n" +
        "class Report {\n" +
        "  constructor(renderer) { this.renderer = renderer; } // any Renderer\n" +
        "}\n" +
        "// Swapping PDF libraries no longer touches Report."
    },
    {
      title: "Example 2: Improving cohesion by grouping related logic",
      description: "<p>Scattered date helpers pulled into one cohesive module.</p>",
      code: "// Low cohesion: date logic sprinkled across unrelated files\n" +
        "// AFTER: one cohesive unit, everything date-related lives together\n" +
        "const DateUtils = {\n" +
        "  isWeekend(d)  { return [0, 6].includes(d.getDay()); },\n" +
        "  addDays(d, n) { /* ... */ },\n" +
        "  format(d)     { /* ... */ },\n" +
        "};"
    },
    {
      title: "Example 3: low coupling + high cohesion",
      description: "<p>Aim for modules whose insides belong together (cohesion) and that depend minimally on each other (coupling).</p>",
      code: "// High cohesion: everything in OrderService is about orders.\n" +
        "// Low coupling: it depends on a PaymentGateway INTERFACE, not Stripe's classes.\n" +
        "//\n" +
        "// Bad (low cohesion + high coupling): a 'Utils' god-class touched by everything,\n" +
        "//   importing the DB, the mailer, and the HTTP layer -> a change anywhere ripples."
    },
    {
      title: "Example 4 (edge case): they pull against each other - and DRY",
      description: "<p>Maximizing cohesion can raise coupling; over-applying DRY couples modules that should stay independent.</p>",
      code: "// Splitting one cohesive module into many to 'reduce its size' can INCREASE\n" +
        "//   coupling (now they all call each other).\n" +
        "// Sharing a 'common' module across services for DRY couples their release cycles.\n" +
        "// Goal: each module changes for its own reasons with minimal ripple. Sometimes a\n" +
        "//   little duplication keeps two modules decoupled - that's the right trade."
    }
  ],
  whenToUse: "<p>These are the lenses to evaluate almost any design decision: when splitting modules, drawing " +
    "service boundaries, or reviewing code, ask 'does this belong together (cohesion)?' and 'how many things " +
    "must change if this changes (coupling)?' Low coupling + high cohesion is what makes systems modular, " +
    "testable, and safe to evolve. <strong>The balance:</strong> you can't drive coupling to zero &mdash; " +
    "modules must collaborate somehow, and chasing absolute decoupling produces event-soup and over-" +
    "abstraction. Aim for <em>loose</em> coupling through clear interfaces, and group by genuine relatedness " +
    "rather than superficial similarity.</p>"
};

C["component-principles"] = {
  summary: "<p>Beyond individual classes, the <strong>component principles</strong> (Robert C. Martin) govern " +
    "how to group classes into deployable <strong>components</strong> (libraries/packages/modules) and how " +
    "those components should depend on each other. Cohesion principles decide <em>what goes together</em>: " +
    "REP (reuse-release equivalence), CCP (common closure &mdash; things that change together belong " +
    "together), CRP (common reuse &mdash; things used together belong together). Coupling principles decide " +
    "<em>the dependency structure</em>: ADP (no dependency cycles), SDP (depend toward stability), SAP " +
    "(stable components should be abstract).</p>",
  examples: [
    {
      title: "Example 1: Acyclic dependencies (no cycles)",
      description: "<p>Component dependencies must form a DAG; cycles make components inseparable.</p>",
      code: "// BAD: a cycle - none of these can be built or released independently\n" +
        "//   auth -> billing -> auth\n" +
        "\n" +
        "// GOOD: break the cycle by extracting a shared abstraction\n" +
        "//   auth    -> shared-contracts\n" +
        "//   billing -> shared-contracts\n" +
        "// Dependencies now flow one way -> each can ship on its own."
    },
    {
      title: "Example 2: Common Closure - group by reason to change",
      description: "<p>Classes that change for the same reason live in the same component.</p>",
      code: "// Group so a single requirement change hits ONE component:\n" +
        "//   /pricing  -> PriceCalculator, Discount, TaxRule   (all change with pricing)\n" +
        "//   /shipping -> Carrier, Rate, Zone                  (all change with shipping)\n" +
        "// A pricing rule change never forces a shipping redeploy."
    },
    {
      title: "Example 3: cohesion + coupling principles for components",
      description: "<p>Robert Martin's component principles guide how to group classes into deployable units.</p>",
      code: "// Cohesion (what goes in a component):\n" +
        "//   REP - release together what's versioned together\n" +
        "//   CCP - classes that change together belong together\n" +
        "//   CRP - don't force users to depend on things they don't use\n" +
        "// Coupling (relationships between components):\n" +
        "//   ADP - no dependency cycles\n" +
        "//   SDP - depend in the direction of stability\n" +
        "//   SAP - the more stable, the more abstract"
    },
    {
      title: "Example 4 (edge case): the cohesion principles tension",
      description: "<p>REP/CCP/CRP pull against each other - you can't maximize all three, so the right grouping shifts as a project matures.</p>",
      code: "// Early on: favor CCP (group by what changes together) for dev speed, accept some\n" +
        "//   over-broad components.\n" +
        "// Mature/widely-reused: favor CRP/REP (tight, stable, reusable units) so consumers\n" +
        "//   aren't dragged along by unrelated changes.\n" +
        "// A dependency CYCLE (ADP violation) is the one to fix unconditionally - break it\n" +
        "//   with an interface (Dependency Inversion)."
    }
  ],
  whenToUse: "<p>These matter at the scale of modules, packages, and services &mdash; structuring a large " +
    "codebase, splitting a monolith, or defining build/deploy boundaries. The most universally important is " +
    "ADP: <strong>no dependency cycles</strong>, because cycles destroy the ability to build, test, and " +
    "deploy parts independently (most build tools and module systems will flag or reject them). " +
    "<strong>Reality check:</strong> the tension between cohesion principles (CCP pulls things together, CRP " +
    "pushes them apart) means there's no perfect grouping &mdash; component design is iterative and " +
    "context-dependent. Don't agonize over a perfect package layout up front; let it evolve as the system's " +
    "real change patterns reveal themselves.</p>"
};

C["policy-vs-detail"] = {
  summary: "<p>The <strong>policy vs detail</strong> distinction separates the parts of a system that capture " +
    "<em>business rules and value</em> (policy &mdash; the high-level 'what and why') from the parts that " +
    "are mere <em>mechanisms</em> (details &mdash; the database, web framework, UI, external APIs). In Clean " +
    "Architecture, policy is the stable core and details are the volatile, replaceable outer layers. The key " +
    "rule: <strong>details should depend on policy, never the reverse</strong>. Your business logic " +
    "shouldn't know or care whether data lives in Postgres or whether requests arrive over HTTP or gRPC.</p>",
  examples: [
    {
      title: "Example 1: Policy at the center, details at the edge",
      description: "<p>The rule (policy) is pure; persistence (detail) is injected and swappable.</p>",
      code: "// POLICY: a business rule, no DB/HTTP knowledge\n" +
        "function approveLoan(application, repo) {\n" +
        "  if (application.creditScore < 600) return reject('low score');\n" +
        "  if (application.amount > 100000)  return reject('over limit');\n" +
        "  return repo.save(approve(application)); // repo is a DETAIL behind an interface\n" +
        "}\n" +
        "// The Postgres/Mongo/in-memory choice never touches this rule."
    },
    {
      title: "Example 2: Dependency direction",
      description: "<p>Details point inward toward policy; policy stays oblivious to details.</p>",
      code: "// Allowed:   PostgresLoanRepo --implements--> LoanRepo (policy's interface)\n" +
        "// Forbidden: approveLoan() importing 'pg' or 'express' directly\n" +
        "//\n" +
        "// So you can replace Postgres, switch HTTP for a queue, or swap the UI\n" +
        "// without editing a single business rule."
    },
    {
      title: "Example 3: policy (rules) shouldn't depend on detail (mechanism)",
      description: "<p>High-level business policy is stable and valuable; low-level details (DB, UI, frameworks) are volatile - dependencies point inward, toward policy.</p>",
      code: "// POLICY (core): how to price an order - no DB/HTTP/framework imports\n" +
        "class Pricing { total(cart, rules) { /* pure business logic */ } }\n" +
        "// DETAIL (edge): Postgres, REST, Stripe - implement interfaces the core defines\n" +
        "//   detail -> depends on -> policy (never the reverse)\n" +
        "// Swap Postgres for Mongo, REST for gRPC: policy doesn't change."
    },
    {
      title: "Example 4 (edge case): not every app has rich policy",
      description: "<p>For thin CRUD apps the 'policy' is trivial, so an elaborate inversion of detail-vs-policy is overkill.</p>",
      code: "// A simple admin CRUD app is almost ALL 'detail' (DB <-> forms) with no real\n" +
        "//   policy -> wrapping it in ports/adapters adds layers for no benefit.\n" +
        "// The policy/detail split pays off when business RULES are substantial and\n" +
        "//   long-lived (they outlive the DB/framework choices). Match the architecture\n" +
        "//   to how much real policy exists."
    }
  ],
  whenToUse: "<p>Lean on this lens for applications where the business logic is the valuable, long-lived part " +
    "and infrastructure choices may change &mdash; it's the core idea of Clean/Hexagonal/Onion architecture. " +
    "Keeping policy independent makes it testable in isolation and resilient to infrastructure churn. " +
    "<strong>Trade-off:</strong> the inversion (details depending on policy via interfaces the policy owns) " +
    "adds layers and can feel like overkill for thin CRUD apps where there's barely any policy to protect. " +
    "Invest in the separation proportional to how much real business complexity you have; a simple " +
    "data-in-data-out service may not need it.</p>"
};

C["boundaries"] = {
  summary: "<p><strong>Boundaries</strong> are the architectural lines you draw between parts of a system that " +
    "should change independently &mdash; between business logic and the database, between your app and " +
    "third-party services, between modules owned by different teams. A well-placed boundary is crossed only " +
    "through a narrow, explicit interface, which lets each side evolve, be tested, and even be replaced " +
    "without disturbing the other. Deciding <em>where</em> to draw boundaries (and where <em>not</em> to, " +
    "since each one has a cost) is one of the central jobs of software architecture.</p>",
  examples: [
    {
      title: "Example 1: A boundary around a third-party service",
      description: "<p>An anti-corruption layer keeps a vendor's quirks from leaking into your domain.</p>",
      code: "// Your domain speaks its OWN language behind a boundary\n" +
        "interface PaymentGateway { charge(amount: Money): Receipt; }\n" +
        "\n" +
        "// The boundary translates vendor specifics in ONE place\n" +
        "class StripeGateway implements PaymentGateway {\n" +
        "  charge(amount) {\n" +
        "    const res = stripe.charges.create({ amount: amount.cents }); // vendor shape\n" +
        "    return new Receipt(res.id); // mapped back to YOUR shape\n" +
        "  }\n" +
        "}\n" +
        "// Switching to PayPal means writing one new adapter - the domain is untouched."
    },
    {
      title: "Example 2: A boundary between modules",
      description: "<p>Modules communicate only through a published interface, not internal classes.</p>",
      code: "// billing module exposes a deliberate, narrow public API\n" +
        "export interface BillingApi { invoice(orderId: string): Invoice; }\n" +
        "// Other modules import ONLY this - never billing's internal classes.\n" +
        "// Billing can refactor its internals freely behind the boundary."
    },
    {
      title: "Example 3: a boundary isolates a volatile dependency",
      description: "<p>Wrap external/changeable things behind an interface your core owns, so they can be replaced without ripple.</p>",
      code: "// core defines the port (boundary):\n" +
        "interface EmailSender { send(to, subject, body): void; }\n" +
        "// adapters live OUTSIDE the boundary:\n" +
        "class SendgridSender implements EmailSender {}\n" +
        "class SesSender implements EmailSender {}\n" +
        "// switching providers = one new adapter; core code untouched. Same for DB, queues, time."
    },
    {
      title: "Example 4 (edge case): boundaries cost mapping and can be drawn wrong",
      description: "<p>Each boundary adds an interface + translation; too many fragments the system, and a misplaced boundary leaks the very detail it should hide.</p>",
      code: "// Cost: DTO<->domain mapping, extra interfaces, more files to navigate.\n" +
        "// Wrong boundary: interface PaymentPort { stripeChargeId(): string } -> Stripe\n" +
        "//   leaked through the 'boundary', so it isn't isolating anything.\n" +
        "// Draw boundaries around things that are VOLATILE or externally owned; don't\n" +
        "//   ceremonially wrap stable internals. Fewer, well-placed boundaries > many leaky ones."
    }
  ],
  whenToUse: "<p>Draw firm boundaries around things that are volatile, externally owned, or likely to be " +
    "replaced (databases, payment providers, notification services), and around modules owned by separate " +
    "teams so they can work in parallel. The benefit is independent evolution, testability (fake across the " +
    "boundary), and contained blast radius for change. <strong>The cost &mdash; and the gotcha:</strong> " +
    "every boundary adds indirection, mapping code, and ceremony. Too many premature boundaries (a service " +
    "or interface for everything) create distributed complexity worse than the coupling they avoided. Draw " +
    "boundaries where change actually happens; defer the ones you only <em>imagine</em> needing.</p>"
};

/* ======================================================================
   SECTION 4 — DESIGN PATTERNS
   ====================================================================== */

C["design-patterns"] = {
  summary: "<p><strong>Design patterns</strong> are named, reusable solutions to problems that recur in " +
    "software design. They aren't code you copy &mdash; they're <em>templates</em> for how to structure " +
    "classes and objects to solve a particular kind of problem (creating objects flexibly, composing " +
    "behavior, decoupling senders from receivers). Their biggest practical value is <strong>shared " +
    "vocabulary</strong>: saying 'use a Strategy here' or 'wrap it in an Adapter' communicates an entire " +
    "design in two words. They also encode hard-won lessons about flexibility and decoupling.</p>",
  examples: [
    {
      title: "Example 1: Strategy pattern (encapsulate interchangeable algorithms)",
      description: "<p>The sorting/pricing/etc. algorithm becomes a swappable object.</p>",
      code: "// Strategy: each algorithm is an object with the same interface\n" +
        "const byPrice = (a, b) => a.price - b.price;\n" +
        "const byName  = (a, b) => a.name.localeCompare(b.name);\n" +
        "\n" +
        "class ProductList {\n" +
        "  constructor(items) { this.items = items; }\n" +
        "  sortedBy(strategy) { return [...this.items].sort(strategy); }\n" +
        "}\n" +
        "list.sortedBy(byPrice); // swap behavior without changing ProductList"
    },
    {
      title: "Example 2: Adapter pattern (make incompatible interfaces work together)",
      description: "<p>Wrap a mismatched API so your code can use it through a familiar contract.</p>",
      code: "// Your code expects: logger.log(msg)\n" +
        "// Third-party library offers: thirdParty.writeEntry(level, text)\n" +
        "class LoggerAdapter {\n" +
        "  constructor(thirdParty) { this.lib = thirdParty; }\n" +
        "  log(msg) { this.lib.writeEntry('INFO', msg); } // translate the call\n" +
        "}"
    },
    {
      title: "Example 3: patterns are a shared vocabulary",
      description: "<p>Naming a pattern communicates a whole design in one word to other developers.</p>",
      code: "// 'Use a Strategy here' -> everyone knows: swap algorithms behind an interface.\n" +
        "// 'That's an Observer' -> publish/subscribe to state changes.\n" +
        "// 'Wrap it in an Adapter' -> make an incompatible interface fit.\n" +
        "// 'Add a Facade' -> one simple entry point over a complex subsystem.\n" +
        "// The value is communication + proven structure, not the code itself."
    },
    {
      title: "Example 4 (edge case): pattern fever - forcing patterns where they don't fit",
      description: "<p>Applying patterns for their own sake adds indirection and ceremony; recognize the problem first.</p>",
      code: "// Smell: a SingletonFactoryStrategyBuilder to do something a function would do.\n" +
        "// Smell: every class behind an interface 'because patterns'.\n" +
        "// Many GoF patterns also exist to work around OLD language limits - in modern\n" +
        "//   languages a Strategy is often just a passed-in function; a Singleton is often\n" +
        "//   just a module. Reach for a pattern when its PROBLEM appears, not to use patterns."
    }
  ],
  whenToUse: "<p>Reach for a pattern when you recognize the <em>problem</em> it solves &mdash; not the other " +
    "way around. Strategy when you have interchangeable algorithms; Observer for event notifications; " +
    "Factory when object creation is complex or conditional; Adapter to bridge mismatched interfaces; " +
    "Decorator to add behavior without subclassing. <strong>The classic anti-pattern is 'patternitis':</strong> " +
    "forcing patterns into code that doesn't need them, turning a five-line solution into five classes. " +
    "Patterns add indirection, which is justified only when it buys real flexibility you need. Learn them to " +
    "<em>recognize</em> situations, then apply the simplest one that fits &mdash; or none at all.</p>"
};

C["gof-design-patterns"] = {
  summary: "<p>The <strong>Gang of Four (GoF) patterns</strong> are the 23 classic object-oriented patterns " +
    "from <em>Design Patterns</em> (1994), grouped into three families. <strong>Creational</strong> " +
    "(Factory Method, Abstract Factory, Builder, Prototype, Singleton) deal with flexible object creation. " +
    "<strong>Structural</strong> (Adapter, Decorator, Facade, Composite, Proxy, Bridge, Flyweight) deal with " +
    "composing objects into larger structures. <strong>Behavioral</strong> (Strategy, Observer, Command, " +
    "State, Template Method, Iterator, Chain of Responsibility, Mediator, Visitor, Memento, Interpreter) " +
    "deal with how objects interact and distribute responsibility.</p>",
  examples: [
    {
      title: "Example 1: Builder (creational) — construct complex objects step by step",
      description: "<p>Avoids giant constructors with many optional parameters.</p>",
      code: "class QueryBuilder {\n" +
        "  #parts = { table: '', where: [], limit: null };\n" +
        "  from(t)  { this.#parts.table = t; return this; }   // fluent steps\n" +
        "  where(c) { this.#parts.where.push(c); return this; }\n" +
        "  limit(n) { this.#parts.limit = n; return this; }\n" +
        "  build()  { /* assemble SQL from #parts */ return '...'; }\n" +
        "}\n" +
        "new QueryBuilder().from('users').where('age > 18').limit(10).build();"
    },
    {
      title: "Example 2: Observer (behavioral) — notify subscribers of changes",
      description: "<p>One subject, many listeners that react without the subject knowing who they are.</p>",
      code: "class Subject {\n" +
        "  #observers = [];\n" +
        "  subscribe(fn) { this.#observers.push(fn); }\n" +
        "  notify(data)  { this.#observers.forEach(fn => fn(data)); }\n" +
        "}\n" +
        "const orders = new Subject();\n" +
        "orders.subscribe(o => sendEmail(o));   // independent reactions\n" +
        "orders.subscribe(o => updateMetrics(o));\n" +
        "orders.notify({ id: 1 }); // both run; Subject is decoupled from them"
    },
    {
      title: "Example 3: the three GoF categories",
      description: "<p>The 23 patterns group by intent: creating objects, composing them, or coordinating their behavior.</p>",
      code: "// Creational (object creation): Factory, Builder, Singleton, Prototype, Abstract Factory\n" +
        "// Structural (composition):     Adapter, Decorator, Facade, Proxy, Composite, Bridge\n" +
        "// Behavioral (interaction):     Strategy, Observer, Command, State, Iterator, Template Method\n" +
        "// e.g. Decorator: wrap an object to add behavior without subclassing:\n" +
        "//   new GzipStream(new BufferedStream(new FileStream(...)))"
    },
    {
      title: "Example 4 (edge case): some GoF patterns are dated or language-specific",
      description: "<p>Modern language features make several patterns trivial or unnecessary; Singleton in particular is often an anti-pattern.</p>",
      code: "// Strategy -> often just pass a function (first-class functions).\n" +
        "// Iterator -> built into the language (for-of, IEnumerable).\n" +
        "// Singleton -> global mutable state: hurts testability + hides dependencies;\n" +
        "//   prefer DI with a single instance managed by a container.\n" +
        "// Use the INTENT; don't transcribe 1994 Java/C++ implementations literally."
    }
  ],
  whenToUse: "<p>Use a specific GoF pattern when its target problem appears: Singleton for a single shared " +
    "resource (use sparingly &mdash; it's effectively global state and harms testability), Factory for " +
    "conditional/complex creation, Decorator/Composite for tree-like or layered structures, Observer for " +
    "publish/subscribe, State/Strategy to replace sprawling conditionals. <strong>Caveats:</strong> several " +
    "GoF patterns predate modern language features &mdash; first-class functions make many " +
    "(Strategy, Command, Observer) collapse into a simple callback, and Iterator is built into most " +
    "languages now. Singleton is widely considered an anti-pattern. Know the patterns to read others' code " +
    "and communicate, but prefer the lightest modern expression of the idea.</p>"
};

C["posa-patterns"] = {
  summary: "<p><strong>PoSA</strong> stands for <em>Pattern-Oriented Software Architecture</em>, a five-volume " +
    "series (Buschmann et al.) that catalogs patterns at a <strong>higher level than GoF</strong> &mdash; " +
    "architectural and system-scale patterns rather than class-level ones. It includes structural patterns " +
    "like <strong>Layers</strong>, <strong>Pipes and Filters</strong>, and <strong>Blackboard</strong>; " +
    "distribution patterns like <strong>Broker</strong>; interactive-system patterns like " +
    "<strong>Model-View-Controller</strong> and <strong>Presentation-Abstraction-Control</strong>; and " +
    "concurrency/networking patterns like <strong>Reactor</strong> and <strong>Proactor</strong>. Where GoF " +
    "shapes objects, PoSA shapes whole subsystems.</p>",
  examples: [
    {
      title: "Example 1: Layers pattern (a PoSA architectural pattern)",
      description: "<p>Organize a system into stacked layers, each using only the one below it.</p>",
      code: "// Presentation -> Application -> Domain -> Infrastructure\n" +
        "// Each layer depends only DOWNWARD, never upward:\n" +
        "//\n" +
        "//   Controller (presentation) calls\n" +
        "//     OrderService (application) calls\n" +
        "//       Order domain rules, then\n" +
        "//         OrderRepository (infrastructure)\n" +
        "// A change in the DB layer doesn't ripple up to the controller."
    },
    {
      title: "Example 2: Pipes and Filters (a PoSA structural pattern)",
      description: "<p>Process a stream through independent stages connected by pipes.</p>",
      code: "// Each filter does one transformation; pipes carry data between them\n" +
        "const pipeline = [parse, validate, enrich, format];\n" +
        "function run(input) {\n" +
        "  return pipeline.reduce((data, filter) => filter(data), input);\n" +
        "}\n" +
        "// Filters are reusable and reorderable - like Unix `cat | grep | sort`."
    },
    {
      title: "Example 3: architecture-scale patterns (bigger than GoF)",
      description: "<p>PoSA (Pattern-Oriented Software Architecture) catalogs patterns for whole-system structure, not single classes.</p>",
      code: "// Layers           - stack of responsibility tiers (presentation/domain/data)\n" +
        "// Pipes and Filters- a data-processing pipeline of stages\n" +
        "// Broker           - decouple clients/servers via an intermediary\n" +
        "// MVC              - separate model, view, controller\n" +
        "// Microkernel      - minimal core + plug-in extensions\n" +
        "// Blackboard       - shared knowledge space for ill-structured problems"
    },
    {
      title: "Example 4 (edge case): architecture patterns are expensive to change later",
      description: "<p>Unlike a class-level pattern, picking the wrong architectural pattern is costly to undo - choose against real, present forces.</p>",
      code: "// Refactoring a class from Strategy to something else = local change.\n" +
        "// Switching a system from Layers to Microservices = months + risk.\n" +
        "// So: don't adopt a heavyweight architecture pattern speculatively. Start simple\n" +
        "//   (often a layered monolith) and evolve toward Broker/Microkernel/etc. only\n" +
        "//   when a concrete force (scale, team structure, extensibility) demands it."
    }
  ],
  whenToUse: "<p>PoSA patterns are the vocabulary for <em>system and subsystem structure</em> &mdash; reach for " +
    "them when deciding the overall shape of an application or service, not when arranging a handful of " +
    "classes (that's GoF territory). Layers suits most business apps; Pipes and Filters suits data-processing " +
    "and ETL flows; Broker underlies distributed/RPC systems; Reactor/Proactor underlie high-performance " +
    "event-driven servers. <strong>Perspective:</strong> you'll rarely cite PoSA by name day-to-day, but its " +
    "patterns are baked into the frameworks and architectures you already use. The value is recognizing the " +
    "structure you're working within and choosing it deliberately rather than by accident.</p>"
};

/* ======================================================================
   SECTION 5 — MODEL-DRIVEN DESIGN
   ====================================================================== */

C["model-driven-design"] = {
  summary: "<p><strong>Model-Driven Design</strong> centers software around a <strong>domain model</strong> " +
    "&mdash; a rich, code-level representation of the real-world concepts, rules, and relationships your " +
    "software is about. Instead of treating the database schema or UI as the heart of the system, you build " +
    "objects that capture the domain's behavior and language, and let the rest (persistence, presentation) " +
    "serve that model. It's a core idea of Domain-Driven Design: the model and the code stay tightly bound, " +
    "evolving together, so the code <em>is</em> an executable expression of how the business works.</p>",
  examples: [
    {
      title: "Example 1: A behavior-rich domain model",
      description: "<p>The model encodes real rules, not just fields &mdash; it 'knows' the business.</p>",
      code: "class Subscription {\n" +
        "  #status = 'active';\n" +
        "  #renewsOn;\n" +
        "  // Domain BEHAVIOR and rules live in the model itself\n" +
        "  cancel() {\n" +
        "    if (this.#status === 'cancelled') throw new Error('already cancelled');\n" +
        "    this.#status = 'cancelled';\n" +
        "  }\n" +
        "  isActiveOn(date) {\n" +
        "    return this.#status === 'active' && date <= this.#renewsOn;\n" +
        "  }\n" +
        "}"
    },
    {
      title: "Example 2: Model vs database-driven thinking",
      description: "<p>The model expresses intent; persistence is a separate concern that maps to it.</p>",
      code: "// Database-driven (anemic): logic scattered in services around dumb rows\n" +
        "// updateSubscriptionStatus(id, 'cancelled');\n" +
        "\n" +
        "// Model-driven: ask the model to do domain work, then persist it\n" +
        "const sub = repo.findById(id);\n" +
        "sub.cancel();          // business rule enforced inside the model\n" +
        "repo.save(sub);        // persistence is downstream of the model"
    },
    {
      title: "Example 3: code that mirrors the domain",
      description: "<p>Model-driven design builds software around a model of the domain shared by developers and experts, so the code speaks the business's language.</p>",
      code: "// The model in code matches how the business talks:\n" +
        "class Policy {\n" +
        "  renew(): void {}        // domain verbs, not 'updateRow'\n" +
        "  lapse(): void {}\n" +
        "  isInGracePeriod(): boolean {}\n" +
        "}\n" +
        "// A domain expert could read these method names and recognize their process."
    },
    {
      title: "Example 4 (edge case): only worth it for complex domains",
      description: "<p>For thin/CRUD domains the modeling overhead doesn't pay; and a model that drifts from the experts' language stops helping.</p>",
      code: "// Simple CRUD (a form over a table) has little 'domain' to model -> a rich model\n" +
        "//   is ceremony; Transaction Script / Active Record is fine.\n" +
        "// If the model and the experts' vocabulary diverge over time, the shared\n" +
        "//   understanding breaks -> keep refining the model WITH domain experts.\n" +
        "// Model-driven design earns its cost when business RULES are the hard part."
    }
  ],
  whenToUse: "<p>Model-driven design pays off in applications with <strong>genuine domain complexity</strong> " +
    "&mdash; rich business rules, intricate workflows, evolving requirements (insurance, banking, logistics, " +
    "scheduling). Investing in a clean model makes that complexity manageable and keeps the code speaking the " +
    "business's language. <strong>When it's overkill:</strong> for simple CRUD apps that just move data " +
    "between forms and tables, a lightweight, database-/transaction-script approach is faster and perfectly " +
    "adequate &mdash; a full domain model adds layers with little payoff. Match the modeling investment to " +
    "the amount of real domain logic you have.</p>"
};

C["domain-models"] = {
  summary: "<p>A <strong>domain model</strong> is the object (or set of objects) that captures the data " +
    "<em>and</em> behavior of a concept from the business domain. A good domain model is 'rich': it enforces " +
    "its own invariants, exposes meaningful operations, and uses the domain's vocabulary &mdash; the " +
    "opposite of an 'anemic' model that's just public fields with logic living elsewhere. The domain model " +
    "is the centerpiece of model-driven and domain-driven design; everything else exists to support and " +
    "serve it.</p>",
  examples: [
    {
      title: "Example 1: A rich domain model that protects itself",
      description: "<p>The model guarantees it can never enter an invalid state.</p>",
      code: "class Order {\n" +
        "  #items = []; #status = 'draft';\n" +
        "  addItem(item) {\n" +
        "    if (this.#status !== 'draft') throw new Error('order already placed');\n" +
        "    this.#items.push(item);          // invariant: only edit drafts\n" +
        "  }\n" +
        "  place() {\n" +
        "    if (this.#items.length === 0) throw new Error('cannot place empty order');\n" +
        "    this.#status = 'placed';\n" +
        "  }\n" +
        "  total() { return this.#items.reduce((s, i) => s + i.price, 0); }\n" +
        "}"
    },
    {
      title: "Example 2: Domain operations read like the business",
      description: "<p>Method names mirror how domain experts talk &mdash; the code documents the domain.</p>",
      code: "const account = repo.load(id);\n" +
        "account.deposit(money(100));\n" +
        "account.withdraw(money(30));\n" +
        "account.freeze('fraud suspected');\n" +
        "// Reads like a description of real banking actions, not data mutations."
    },
    {
      title: "Example 3: behavior lives WITH the data (rich model)",
      description: "<p>A domain model object owns both its state and the rules that operate on it.</p>",
      code: "class BankAccount {\n" +
        "  #balance = 0;\n" +
        "  withdraw(amount) {\n" +
        "    if (amount > this.#balance) throw new Error('insufficient funds'); // rule here\n" +
        "    this.#balance -= amount;\n" +
        "  }\n" +
        "}\n" +
        "// The rule can't be bypassed; the model is always in a valid state."
    },
    {
      title: "Example 4 (edge case): the anemic-model trap",
      description: "<p>A 'domain model' that's only getters/setters with all logic in services is procedural code in disguise.</p>",
      code: "// Anemic: data bag + a service that manipulates it from outside\n" +
        "class Account { balance = 0; }                 // no behavior\n" +
        "class AccountService { withdraw(a, amt){ a.balance -= amt; } } // rule outside\n" +
        "// -> rules get scattered/duplicated across services; invariants aren't protected.\n" +
        "// Put behavior on the model. (Anemic is fine for true DTOs, just not for the DOMAIN.)"
    }
  ],
  whenToUse: "<p>Build rich domain models where the business logic is the valuable part of the system and you " +
    "want it in one trustworthy place rather than smeared across controllers and services. They make complex " +
    "rules easier to test (no infrastructure needed) and keep the codebase aligned with how the business " +
    "thinks. <strong>Gotcha:</strong> resist letting infrastructure concerns (ORM annotations, JSON " +
    "serialization quirks, framework base classes) creep into the model and pollute it &mdash; that's how " +
    "rich models slowly rot. And don't force a heavy model onto simple data-shuffling features. See " +
    "<em>Anemic Models</em> for the anti-pattern this guards against.</p>"
};

C["anemic-models"] = {
  summary: "<p>An <strong>anemic domain model</strong> is an object that holds data (fields with getters/" +
    "setters) but <em>no behavior</em> &mdash; all the actual logic lives in separate 'service' classes that " +
    "operate on these dumb data bags. Martin Fowler labeled it an <strong>anti-pattern</strong> because it " +
    "looks object-oriented but is really procedural: it breaks encapsulation (anyone can put the object in " +
    "an invalid state), scatters related rules across many services, and loses the main benefit of objects " +
    "(data and behavior together). The contrast is the rich domain model.</p>",
  examples: [
    {
      title: "Example 1: The anemic anti-pattern",
      description: "<p>The object is a passive struct; rules live elsewhere and can be bypassed.</p>",
      code: "// Anemic: just data, no protection\n" +
        "class Account { balance = 0; }            // anyone can set any balance\n" +
        "\n" +
        "// All logic lives outside, in a service operating on the dumb object\n" +
        "class AccountService {\n" +
        "  withdraw(account, amount) {\n" +
        "    if (account.balance < amount) throw new Error('insufficient');\n" +
        "    account.balance -= amount;            // rule enforced HERE, not in Account\n" +
        "  }\n" +
        "}\n" +
        "// Risk: account.balance = -999 elsewhere completely bypasses the rule."
    },
    {
      title: "Example 2: The rich alternative",
      description: "<p>Moving behavior into the object restores encapsulation and one home for the rule.</p>",
      code: "class Account {\n" +
        "  #balance = 0;\n" +
        "  withdraw(amount) {\n" +
        "    if (this.#balance < amount) throw new Error('insufficient');\n" +
        "    this.#balance -= amount;              // rule + data together, can't bypass\n" +
        "  }\n" +
        "  get balance() { return this.#balance; }\n" +
        "}"
    },
    {
      title: "Example 3: spotting an anemic model",
      description: "<p>The tell-tale sign: objects are pure data with getters/setters, while all behavior sits in 'manager'/'service' classes.</p>",
      code: "class Order { items=[]; status; get total(){...} set status(s){...} } // just data\n" +
        "class OrderService {                 // ALL the logic, outside the object\n" +
        "  cancel(o){ o.status = 'cancelled'; refund(o); }\n" +
        "  addItem(o,i){ o.items.push(i); }\n" +
        "}\n" +
        "// Rules aren't enforced by Order itself -> any code can set an invalid status."
    },
    {
      title: "Example 4 (edge case): anemic is the RIGHT choice for DTOs and simple CRUD",
      description: "<p>Anemic models are only an anti-pattern in a rich domain; as data-transfer objects or for trivial CRUD they're correct.</p>",
      code: "// Perfectly fine anemic objects:\n" +
        "//   DTOs at API/message boundaries (just carry data, no behavior)\n" +
        "//   a CRUD admin tool with no real business rules\n" +
        "// 'Anemic' is a problem ONLY when there ARE domain rules and they got pushed into\n" +
        "//   services. Don't force behavior onto a DTO to avoid the label."
    }
  ],
  whenToUse: "<p>This is mostly a 'what to avoid' topic: in a domain with real rules, prefer rich models over " +
    "anemic data-bags + service procedures. Recognize the smell when your 'model' classes are pure getters/" +
    "setters and a parallel set of <code>*Service</code>/<code>*Manager</code> classes hold all the logic. " +
    "<strong>Important nuance:</strong> anemic structures are <em>not</em> always wrong. DTOs, API request/" +
    "response shapes, database row mappings, and value-carrying objects across boundaries are <em>supposed</em> " +
    "to be data-only. And for genuinely simple CRUD, an 'anemic + service' style (sometimes called " +
    "Transaction Script) is a legitimate, pragmatic choice. The anti-pattern is specifically using anemic " +
    "models <em>while pretending to do rich domain modeling</em> in a complex domain.</p>"
};

C["domain-language"] = {
  summary: "<p><strong>Domain language</strong> &mdash; called the <strong>Ubiquitous Language</strong> in " +
    "Domain-Driven Design &mdash; is a shared, precise vocabulary used consistently by developers, domain " +
    "experts, documentation, <em>and the code itself</em>. If the business says 'policy', 'premium', and " +
    "'claim', then the classes, methods, and variables are named <code>Policy</code>, <code>Premium</code>, " +
    "and <code>Claim</code> &mdash; not <code>Record</code>, <code>Amount</code>, and <code>Item</code>. " +
    "This eliminates the costly translation layer between how the business talks and how the code is " +
    "written, reducing misunderstandings and bugs.</p>",
  examples: [
    {
      title: "Example 1: Code that speaks the domain",
      description: "<p>Names come straight from the business glossary, so experts can sanity-check the logic.</p>",
      code: "// Generic, translation needed: what's a 'record' with a 'flag'?\n" +
        "// record.flag = true; record.amount -= record.fee;\n" +
        "\n" +
        "// Ubiquitous language: a domain expert can read this\n" +
        "class InsurancePolicy {\n" +
        "  fileClaim(claim) { this.claims.push(claim); }\n" +
        "  lapse() { this.status = 'lapsed'; }     // 'lapse' is the real industry term\n" +
        "}"
    },
    {
      title: "Example 2: Aligning conversation and code",
      description: "<p>The same word means the same thing in a meeting and in the codebase.</p>",
      code: "// Domain expert: \"When a guest no-shows, we forfeit the deposit.\"\n" +
        "// Code mirrors that sentence exactly:\n" +
        "reservation.markNoShow();   // -> internally calls forfeitDeposit()\n" +
        "// No mental mapping between business speak and developer speak."
    },
    {
      title: "Example 3: a ubiquitous language in the code",
      description: "<p>The same terms the business uses appear in class/method names, so conversation and code stay in sync.</p>",
      code: "// Business says: 'a policy lapses after the grace period'\n" +
        "// Code says exactly that:\n" +
        "class Policy { lapse(){...} isInGracePeriod(){...} }\n" +
        "// NOT: class Record { setStatusFlag(2) } - which forces a mental translation\n" +
        "//   between 'what the business means' and 'what the code does'."
    },
    {
      title: "Example 4 (edge case): the language drifts or differs per context",
      description: "<p>Terms mean different things in different parts of the business - forcing one global vocabulary causes confusion; bound the language per context.</p>",
      code: "// 'Customer' in Sales (a lead) != 'Customer' in Support (an account with tickets).\n" +
        "//   Forcing ONE Customer model muddies both -> use DDD Bounded Contexts: each\n" +
        "//   context has its own consistent language + model.\n" +
        "// Also: code drifts from current business terms over time -> rename deliberately\n" +
        "//   when the language evolves, or comprehension erodes."
    }
  ],
  whenToUse: "<p>Cultivate a domain language on any project where developers and domain experts must " +
    "collaborate and the domain has its own terminology &mdash; which is most non-trivial business software. " +
    "Build a shared glossary, name code after it, and update both as understanding deepens. The payoff is " +
    "fewer translation bugs and conversations where experts can actually validate the logic. " +
    "<strong>Gotchas:</strong> the language must stay <em>consistent</em> (one term, one meaning) and " +
    "<em>current</em> &mdash; if the business renames a concept, rename it in code too, or the language " +
    "decays. In large systems the same word can mean different things in different contexts; DDD handles " +
    "this with <em>bounded contexts</em>, keeping each context's language internally consistent rather than " +
    "forcing one global dictionary.</p>"
};

C["class-variants"] = {
  summary: "<p>In model-driven/DDD design, the domain model is expressed through several recurring " +
    "<strong>kinds of classes</strong>, each with a distinct role: <strong>Entities</strong> (objects with " +
    "a unique identity that persists through change), <strong>Value Objects</strong> (immutable objects " +
    "defined entirely by their attributes, with no identity), <strong>Aggregates</strong> (clusters of " +
    "entities/values treated as one consistency unit with a single root), <strong>Services</strong> " +
    "(stateless operations that don't naturally belong to one entity), <strong>Repositories</strong> " +
    "(collection-like access to aggregates), and <strong>Factories</strong> (encapsulated creation of " +
    "complex objects). Knowing these 'class variants' helps you put each piece of logic in the right home.</p>",
  examples: [
    {
      title: "Example 1: Entity vs Value Object",
      description: "<p>An entity is the same thing over time even as data changes; a value object is just its values.</p>",
      code: "// Entity: identity matters - this is 'the same' customer after edits\n" +
        "class Customer {\n" +
        "  constructor(id, name) { this.id = id; this.name = name; }\n" +
        "  equals(other) { return this.id === other.id; }   // compared by IDENTITY\n" +
        "}\n" +
        "\n" +
        "// Value Object: no identity, immutable, compared by VALUE\n" +
        "class Money {\n" +
        "  constructor(amount, currency) { Object.freeze(this); /* immutable */ }\n" +
        "  equals(o) { return this.amount === o.amount && this.currency === o.currency; }\n" +
        "}"
    },
    {
      title: "Example 2: Service for logic that fits no single entity",
      description: "<p>Some operations span entities; a domain service is the right home.</p>",
      code: "// Transferring money touches TWO accounts - belongs to neither alone\n" +
        "class TransferService {\n" +
        "  transfer(from, to, amount) {\n" +
        "    from.withdraw(amount);   // each entity enforces its own rules\n" +
        "    to.deposit(amount);\n" +
        "  }\n" +
        "}"
    },
    {
      title: "Example 3: entity vs value object vs service",
      description: "<p>Three roles: entities have identity, value objects are defined by their data, services hold logic that fits no single object.</p>",
      code: "// Entity: identity matters, mutable over time\n" +
        "class Order { id; status; }            // two orders with same data are DIFFERENT\n" +
        "// Value object: defined by value, immutable, interchangeable\n" +
        "class Money { constructor(readonly amount, readonly currency){} } // 5 EUR == 5 EUR\n" +
        "// Domain service: logic spanning multiple entities, no natural home\n" +
        "class TransferService { transfer(from: Account, to: Account, m: Money){} }"
    },
    {
      title: "Example 4 (edge case): the same concept can be an entity OR a value object",
      description: "<p>The classification depends on the domain - 'Address' is a value object in shipping but an entity in a property registry.</p>",
      code: "// Address as VALUE object (shipping): we only care about the data; two identical\n" +
        "//   addresses are the same -> immutable, no id.\n" +
        "// Address as ENTITY (real-estate registry): each property address is tracked\n" +
        "//   over time with its own identity/history.\n" +
        "// Don't classify in the abstract - decide by whether IDENTITY/continuity matters\n" +
        "//   in THIS domain."
    }
  ],
  whenToUse: "<p>Use these distinctions when modeling a non-trivial domain to decide <em>where each piece of " +
    "logic lives</em>: identity-bearing things become entities; descriptive, immutable concepts (money, " +
    "dates, addresses, ranges) become value objects (which are simpler and safer because they can't change " +
    "underneath you); cross-entity operations become services; access goes through repositories. Getting " +
    "these roles right keeps the model clean and cohesive. <strong>Caution:</strong> this is DDD machinery " +
    "&mdash; valuable for complex domains, overkill for simple apps. Don't ceremonially label every class as " +
    "one of these stereotypes if the domain doesn't warrant it; use the vocabulary where it genuinely helps " +
    "you place responsibilities.</p>"
};

C["layered-architectures"] = {
  summary: "<p>A <strong>layered architecture</strong> organizes a system into horizontal layers, each with " +
    "a clear responsibility, where each layer depends only on the layer(s) below it. A common four-layer " +
    "split is <strong>Presentation</strong> (UI/API), <strong>Application</strong> (use-case orchestration), " +
    "<strong>Domain</strong> (business rules/model), and <strong>Infrastructure</strong> (database, external " +
    "services). This is the most widespread application structure because it cleanly separates concerns, " +
    "makes responsibilities easy to locate, and lets you change one layer (say, swap the database) with " +
    "limited impact on others.</p>",
  examples: [
    {
      title: "Example 1: A request flowing down the layers",
      description: "<p>Each layer has one job and hands off to the next layer down.</p>",
      code: "// Presentation: translate HTTP <-> application calls\n" +
        "app.post('/orders', (req, res) =>\n" +
        "  orderService.placeOrder(req.body).then(o => res.json(o)));\n" +
        "\n" +
        "// Application: orchestrate the use case\n" +
        "class OrderService {\n" +
        "  placeOrder(data) {\n" +
        "    const order = new Order(data);   // Domain: rules live here\n" +
        "    order.validate();\n" +
        "    return this.repo.save(order);    // Infrastructure: persistence\n" +
        "  }\n" +
        "}"
    },
    {
      title: "Example 2: Dependencies point one direction",
      description: "<p>Lower layers never import upper ones, preventing tangled cycles.</p>",
      code: "// Allowed:   Presentation -> Application -> Domain -> Infrastructure\n" +
        "// In Clean Architecture the dependency is INVERTED at the bottom:\n" +
        "//   Domain defines a Repository interface;\n" +
        "//   Infrastructure implements it -> Domain stays pure & DB-agnostic.\n" +
        "// Either way, the Domain never reaches UP into Presentation."
    },
    {
      title: "Example 3: the classic three (or four) layers",
      description: "<p>Each layer has one responsibility and depends only on the layer below.</p>",
      code: "// presentation (controllers/UI)\n" +
        "//    -> application/business (services, domain logic)\n" +
        "//        -> persistence (repositories)\n" +
        "//            -> database\n" +
        "// a request flows down; each layer talks only to the next. Swapping the UI or DB\n" +
        "//   ideally doesn't touch the business layer."
    },
    {
      title: "Example 4 (edge case): the 'sinkhole' and skipped layers",
      description: "<p>Layers that just pass calls through add ceremony without value, and reaching past a layer breaks the architecture's guarantees.</p>",
      code: "// Sinkhole anti-pattern: controller -> service -> repo where service does NOTHING\n" +
        "//   but forward calls -> pure boilerplate. Allow some layers to be 'open' (skippable)\n" +
        "//   for simple read-throughs, or collapse needless layers.\n" +
        "// Layer skipping: controller reaching straight into the DB bypasses business rules\n" +
        "//   -> inconsistent behavior. If you enforce layering, enforce it consistently."
    }
  ],
  whenToUse: "<p>Layering is a sensible default for most business and web applications &mdash; it's familiar, " +
    "easy to onboard new developers into, and supported by virtually every framework. Use it when you want " +
    "clear separation of concerns without the operational complexity of distributed systems. " +
    "<strong>Trade-offs:</strong> strict layering can produce 'pass-through' code where a simple change " +
    "requires touching every layer (a DTO mapped four times), and a classic top-to-bottom layering still " +
    "leaves the domain depending on infrastructure unless you invert that dependency (Clean/Hexagonal " +
    "style). For very simple apps the layers can be overhead; for very large systems you may also need " +
    "<em>vertical</em> slicing (by feature/module) on top of the horizontal layers.</p>"
};

/* ======================================================================
   SECTION 6 — ARCHITECTURAL STYLES
   ====================================================================== */

C["architectural-principles"] = {
  summary: "<p><strong>Architectural principles</strong> are the high-level guidelines that shape a system's " +
    "overall structure (as opposed to class-level design principles). They include: separate concerns, keep " +
    "components loosely coupled and highly cohesive, depend on abstractions at boundaries, design for change " +
    "and for failure, and defer hard-to-reverse decisions as long as responsibly possible. Architecture is " +
    "fundamentally about the decisions that are <em>expensive to change later</em> &mdash; so these " +
    "principles aim to keep those decisions flexible and the system's important qualities (scalability, " +
    "maintainability, resilience) achievable.</p>",
  examples: [
    {
      title: "Example 1: Separation of concerns at the system level",
      description: "<p>Distinct responsibilities live in distinct components with clear interfaces.</p>",
      code: "// Each concern is its own component, talking through contracts:\n" +
        "//   [Web API]  -> [Order Service]  -> [Payment Gateway interface]\n" +
        "//                                  -> [Inventory Service]\n" +
        "// You can scale, deploy, or replace one without rewriting the others."
    },
    {
      title: "Example 2: Defer a hard-to-reverse decision",
      description: "<p>Hide a database choice behind an interface so it isn't locked in on day one.</p>",
      code: "// The architecture commits to 'we need persistence', not 'we need Postgres'\n" +
        "interface EventStore { append(e: Event): void; read(id: string): Event[]; }\n" +
        "// Start with an in-memory or file store; swap in Postgres/Kafka later\n" +
        "// without touching any business logic that depends only on EventStore."
    },
    {
      title: "Example 3: principles that hold at architecture scale",
      description: "<p>The same ideas as code-level design, applied to modules/services/systems.</p>",
      code: "// separation of concerns - each part has one job\n" +
        "// high cohesion / low coupling - between modules and services\n" +
        "// dependency rule - dependencies point toward stable policy\n" +
        "// design for change - isolate what's volatile behind boundaries\n" +
        "// keep it as simple as the requirements allow (architecture YAGNI)"
    },
    {
      title: "Example 4 (edge case): architecture is about trade-offs, not 'best practices'",
      description: "<p>Every architectural choice trades qualities (scalability vs simplicity, consistency vs availability) - there's no universally correct answer.</p>",
      code: "// Microservices: + independent scaling/deploys  - ops complexity, distributed bugs\n" +
        "// Monolith:     + simple, fast to build       - one big deploy, shared scaling\n" +
        "// Strong consistency: + correctness           - latency/availability cost\n" +
        "// The skill is choosing trade-offs that fit THIS system's forces (team, scale,\n" +
        "//   change rate) - and revisiting them as forces change. Copying FAANG\n" +
        "//   architecture onto a 5-person team is a classic mismatch."
    }
  ],
  whenToUse: "<p>These principles guide every significant structural decision: how to split a system into " +
    "components/services, where to put boundaries, how components communicate, and which quality attributes " +
    "(performance, availability, security) to optimize for. They matter most early, when choices are cheap, " +
    "and on systems expected to grow. <strong>The core trade-off in architecture is that there are no right " +
    "answers, only trade-offs:</strong> flexibility costs complexity, decoupling costs indirection, " +
    "scalability costs operational overhead. Good architecture isn't maximizing any single quality &mdash; " +
    "it's making the trade-offs your specific context actually requires, and avoiding over-engineering for " +
    "needs you don't have.</p>"
};

C["architectural-styles"] = {
  summary: "<p><strong>Architectural styles</strong> are named, high-level patterns for the overall shape of " +
    "a system &mdash; how its major parts are organized and how they interact. Common styles include " +
    "<strong>monolithic</strong>, <strong>layered</strong>, <strong>client-server</strong>, " +
    "<strong>microservices</strong>, <strong>event-driven</strong>, <strong>publish-subscribe</strong>, " +
    "<strong>peer-to-peer</strong>, <strong>component-based</strong>, and <strong>service-oriented</strong>. " +
    "Each makes different trade-offs around scalability, complexity, deployability, and team organization. " +
    "Choosing a style is one of the earliest and most consequential architectural decisions, and many real " +
    "systems blend several.</p>",
  examples: [
    {
      title: "Example 1: Same app, two styles",
      description: "<p>The same e-commerce features structured monolithically vs as microservices.</p>",
      code: "// MONOLITHIC: one deployable, in-process calls\n" +
        "//   [ Orders | Payments | Inventory | Users ]  (single app, single DB)\n" +
        "\n" +
        "// MICROSERVICES: independent deployables, network calls\n" +
        "//   [Orders svc] --http--> [Payments svc]\n" +
        "//       |                       |\n" +
        "//     (own DB)                (own DB)\n" +
        "// Same features; very different operational and complexity profiles."
    },
    {
      title: "Example 2: Event-driven vs request-driven interaction",
      description: "<p>Components can collaborate by direct calls or by reacting to events.</p>",
      code: "// Request-driven: Orders directly calls Email\n" +
        "emailService.send(order.customer, 'confirmation');\n" +
        "\n" +
        "// Event-driven: Orders just announces; subscribers react independently\n" +
        "bus.publish('OrderPlaced', { orderId: 1 });\n" +
        "// Email, Analytics, Inventory each subscribe - Orders doesn't know them."
    },
    {
      title: "Example 3: common styles and what drives each",
      description: "<p>An architectural style is a family of structures suited to particular forces.</p>",
      code: "// monolithic    - one deployable; simplest, great default\n" +
        "// layered       - tiers by responsibility (most business apps)\n" +
        "// microservices - independent services; many teams / independent scaling\n" +
        "// event-driven  - react to events; loose coupling, async workflows\n" +
        "// client-server - shared backend for many clients\n" +
        "// serverless    - functions on demand; spiky/event workloads"
    },
    {
      title: "Example 4 (edge case): styles combine, and the wrong one is costly",
      description: "<p>Real systems blend styles, and committing to a heavy style prematurely is a classic, expensive mistake.</p>",
      code: "// Typical blend: a layered monolith that emits events to async workers, with a\n" +
        "//   couple of serverless functions for glue.\n" +
        "// Anti-pattern: greenfield microservices for a tiny app/team -> you pay the\n" +
        "//   distributed-systems tax (deploys, tracing, eventual consistency) with no\n" +
        "//   benefit. Start monolithic; extract services when a real boundary needs\n" +
        "//   independence. Pick for PRESENT forces, evolve later."
    }
  ],
  whenToUse: "<p>Pick a style based on real, present forces: team size and structure, scale and load, " +
    "deployment/operational maturity, and how independently parts must evolve. A small team shipping a " +
    "product should almost always start with a well-structured monolith; reach for microservices or " +
    "event-driven distribution when you have concrete scaling, autonomy, or organizational drivers (and the " +
    "DevOps capability to operate them). <strong>The cardinal mistake</strong> is choosing a style for " +
    "resume-driven or hype reasons &mdash; e.g. microservices for a three-person startup &mdash; importing " +
    "enormous distributed-systems complexity to solve problems you don't have. Styles are also mixable: " +
    "layered internals inside microservices, events between services, etc.</p>"
};

C["monolithic"] = {
  summary: "<p>A <strong>monolithic architecture</strong> packages an entire application as a single " +
    "deployable unit: all features, modules, and layers run in one process and typically share one database. " +
    "Components call each other through ordinary in-process function calls. 'Monolith' is sometimes used as " +
    "an insult, but a <em>well-structured</em> modular monolith is simple to develop, test, deploy, and " +
    "reason about &mdash; and is the right starting point for the vast majority of systems. The downside " +
    "appears at large scale: the whole thing must be deployed together and scaled together.</p>",
  examples: [
    {
      title: "Example 1: In-process calls (the monolith's simplicity)",
      description: "<p>Modules collaborate directly &mdash; no network, no serialization, easy debugging.</p>",
      code: "// Everything in one process: a plain method call, fully type-checked,\n" +
        "// transactional, and stack-traceable end to end.\n" +
        "function checkout(cart) {\n" +
        "  const order = orderModule.create(cart);\n" +
        "  paymentModule.charge(order);     // same process, same transaction\n" +
        "  inventoryModule.reserve(order);  // no network failure modes to handle\n" +
        "  return order;\n" +
        "}"
    },
    {
      title: "Example 2: Keep it modular inside",
      description: "<p>A monolith can still have clean internal module boundaries (a 'modular monolith').</p>",
      code: "// One deployable, but organized into well-bounded modules:\n" +
        "//   /modules/orders     (own model, public API, internals hidden)\n" +
        "//   /modules/payments\n" +
        "//   /modules/inventory\n" +
        "// Modules talk only via published interfaces -> easy to later split out\n" +
        "// into services IF and WHEN scaling actually demands it."
    },
    {
      title: "Example 3: one deployable, in-process calls",
      description: "<p>A monolith packages all modules into a single deployable; modules call each other in-process - simple and fast.</p>",
      code: "// one app, internal module boundaries (a 'modular monolith'):\n" +
        "//   orders/   payments/   users/   (clear packages, but ONE build/deploy)\n" +
        "// calls between them are plain function calls (no network) -> easy to refactor,\n" +
        "//   one transaction can span modules, trivial local debugging.\n" +
        "// Deploy = ship one artifact. Best default for new projects + small teams."
    },
    {
      title: "Example 4 (edge case): the 'big ball of mud' and scaling limits",
      description: "<p>Monoliths rot without internal discipline, and the whole app scales/deploys as one unit.</p>",
      code: "// Without enforced module boundaries -> everything imports everything -> a tangled\n" +
        "//   'big ball of mud' that's scary to change. Keep clear internal seams (modular\n" +
        "//   monolith) so you COULD extract a service later.\n" +
        "// Scaling: you scale the whole app even if only one part is hot, and one bad\n" +
        "//   deploy takes everything down. These limits (not size alone) are when to\n" +
        "//   consider splitting - not before."
    }
  ],
  whenToUse: "<p>Start here for almost every new project: monoliths have the lowest operational overhead, the " +
    "simplest debugging and testing, easy cross-module transactions, and no network failure modes. They suit " +
    "small-to-medium teams and products whose scale is unknown. <strong>When the monolith hurts:</strong> " +
    "very large codebases where build/deploy times balloon, where one team's change risks everyone, or where " +
    "different parts have wildly different scaling needs. The healthy path is a <em>modular</em> monolith " +
    "with clean internal boundaries, which keeps the simplicity now and makes extracting services later (if " +
    "ever needed) far easier &mdash; rather than jumping to microservices prematurely.</p>"
};

C["layered"] = {
  summary: "<p>The <strong>layered style</strong> organizes a system into stacked horizontal layers " +
    "&mdash; commonly Presentation, Business/Domain, and Data Access &mdash; where each layer offers " +
    "services to the one above and uses the one below. It's the most familiar application architecture, " +
    "valued for clear separation of concerns and an easy-to-learn structure. (This is the same concept " +
    "covered under 'Layered Architectures' in the Model-Driven section, viewed here as an architectural " +
    "style choice for the whole system.)</p>",
  examples: [
    {
      title: "Example 1: The classic three layers",
      description: "<p>Presentation talks to business logic, which talks to data access.</p>",
      code: "// Presentation: HTTP in/out only\n" +
        "router.get('/users/:id', (req, res) =>\n" +
        "  res.json(userService.getUser(req.params.id)));\n" +
        "\n" +
        "// Business: rules and orchestration\n" +
        "class UserService { getUser(id) { return this.repo.findById(id); } }\n" +
        "\n" +
        "// Data Access: persistence details\n" +
        "class UserRepository { findById(id) { return db.query('...', id); } }"
    },
    {
      title: "Example 2: Layer isolation enables substitution",
      description: "<p>Swapping the data layer leaves the layers above untouched.</p>",
      code: "// Business depends on a repository CONTRACT, not a concrete DB\n" +
        "interface UserRepository { findById(id: string): User; }\n" +
        "// Replace SqlUserRepository with MongoUserRepository -> UserService unchanged."
    },
    {
      title: "Example 3: a request flowing down the layers",
      description: "<p>Each layer transforms the request and delegates downward; responses bubble back up.</p>",
      code: "// HTTP POST /orders\n" +
        "//   Controller   : parse + validate request, map to a command\n" +
        "//   Service      : business rules, orchestrate, transaction boundary\n" +
        "//   Repository   : persist via the DB\n" +
        "//   (response maps back up: entity -> DTO -> JSON)\n" +
        "// Each layer is replaceable/testable in isolation (mock the layer below)."
    },
    {
      title: "Example 4 (edge case): leaky layers and the pass-through tax",
      description: "<p>Layering helps only if dependencies stay one-directional and each layer adds value; otherwise it's overhead.</p>",
      code: "// Leak: a DB entity (with lazy fields) returned straight to the controller/JSON\n" +
        "//   -> persistence concerns leak into presentation. Map to a DTO at the boundary.\n" +
        "// Pass-through: a service layer that only forwards to the repo adds nothing ->\n" +
        "//   for trivial reads, allow the layer to be skipped rather than writing empty\n" +
        "//   delegations. Layering is a default, not a law for every call path."
    }
  ],
  whenToUse: "<p>Use layering as the default internal structure for typical business and web applications, " +
    "especially when you want a structure that any developer will instantly recognize and that frameworks " +
    "support out of the box. It cleanly answers 'where does this code go?' <strong>Trade-offs:</strong> " +
    "rigid layering can force 'pass-through' boilerplate (data mapped and re-mapped through each layer for a " +
    "trivial change), and a naive top-down layering leaves business logic depending on the data layer &mdash; " +
    "Clean/Hexagonal architecture inverts that bottom dependency so the domain stays independent. For complex " +
    "systems, consider combining horizontal layers with vertical feature slices so related code stays " +
    "together.</p>"
};

C["client-server"] = {
  summary: "<p><strong>Client-server</strong> splits a system into <strong>clients</strong> that request " +
    "services and one or more <strong>servers</strong> that provide them, communicating over a network. The " +
    "server centralizes shared resources, data, and logic; clients handle presentation and user interaction. " +
    "It's the foundational style of the web (browser &harr; web server), mobile apps (app &harr; API), and " +
    "countless systems (database servers, mail servers). Its strengths are centralized control and data, " +
    "easy client updates, and clear responsibility split; its constraints are server scalability and the " +
    "network between them.</p>",
  examples: [
    {
      title: "Example 1: A client requesting from a server",
      description: "<p>The client knows <em>what</em> it wants; the server owns <em>how</em> and the data.</p>",
      code: "// CLIENT (e.g. browser / mobile app): asks for data\n" +
        "const res = await fetch('https://api.example.com/orders/42');\n" +
        "const order = await res.json();   // just consumes the response\n" +
        "\n" +
        "// SERVER: owns the data and rules, serves many clients\n" +
        "app.get('/orders/:id', (req, res) => {\n" +
        "  const order = db.findOrder(req.params.id); // centralized data\n" +
        "  res.json(order);\n" +
        "});"
    },
    {
      title: "Example 2: Why centralization helps",
      description: "<p>Business rules live once on the server; every client benefits without redeploying.</p>",
      code: "// Rule enforced on the SERVER, so all clients (web, iOS, Android) share it\n" +
        "app.post('/transfer', (req, res) => {\n" +
        "  if (req.body.amount > dailyLimit(req.user)) return res.status(403).end();\n" +
        "  // a policy change here instantly applies to every client\n" +
        "});"
    },
    {
      title: "Example 3: shared server, many clients",
      description: "<p>Clients (web, mobile, desktop) talk to a central server that owns the data and shared logic.</p>",
      code: "//   [web]   \\\n" +
        "//   [iOS]    >--HTTP/API-->  [server] --> [database]\n" +
        "//   [Android]/\n" +
        "// the server is the single source of truth; clients are interchangeable front-ends.\n" +
        "// keep authoritative logic + validation on the SERVER (clients can be tampered with)."
    },
    {
      title: "Example 4 (edge case): trusting the client, and server as bottleneck/SPOF",
      description: "<p>Client-side checks can be bypassed, and the central server must be scaled and made redundant.</p>",
      code: "// NEVER trust client-side validation/authz alone -> an attacker calls your API\n" +
        "//   directly, bypassing the UI. Re-validate + authorize on the server, always.\n" +
        "// The server is shared infrastructure -> a single instance is a SPOF + capacity\n" +
        "//   ceiling. Scale it (LB + multiple instances) and make it HA. Offline-capable\n" +
        "//   clients also need sync/conflict handling."
    }
  ],
  whenToUse: "<p>Client-server is the natural fit whenever multiple users/devices need to share data or logic, " +
    "when you must centralize trust and security (never trust the client), or when you want to update logic " +
    "without shipping new client software. It underlies essentially all web and mobile applications. " +
    "<strong>Trade-offs and gotchas:</strong> the server is a scalability bottleneck and a single point of " +
    "failure (mitigated with load balancing, replication, caching); the network adds latency and failure " +
    "modes you must handle (retries, timeouts, offline states); and you must <em>never</em> trust " +
    "client-side validation alone &mdash; always re-check on the server. For purely local, single-user tools, " +
    "client-server adds needless network complexity.</p>"
};

C["event-driven"] = {
  summary: "<p>In an <strong>event-driven architecture</strong>, components communicate by producing and " +
    "reacting to <strong>events</strong> &mdash; notifications that 'something happened' (e.g. " +
    "<code>OrderPlaced</code>) &mdash; rather than calling each other directly. Producers emit events " +
    "without knowing who (if anyone) will handle them; consumers subscribe and react independently. This " +
    "yields very loose coupling and natural extensibility: adding a new reaction means adding a new " +
    "subscriber, with zero changes to the producer. It's the basis of reactive systems, message-driven " +
    "microservices, and real-time pipelines.</p>",
  examples: [
    {
      title: "Example 1: Producer emits, consumers react",
      description: "<p>The order code announces a fact; unrelated features hook in on their own.</p>",
      code: "// Producer: just announces what happened, knows nothing about reactions\n" +
        "function placeOrder(cart) {\n" +
        "  const order = createOrder(cart);\n" +
        "  eventBus.publish('OrderPlaced', { orderId: order.id });\n" +
        "  return order;\n" +
        "}\n" +
        "\n" +
        "// Consumers: independent reactions, added without touching placeOrder\n" +
        "eventBus.subscribe('OrderPlaced', e => sendConfirmationEmail(e.orderId));\n" +
        "eventBus.subscribe('OrderPlaced', e => updateInventory(e.orderId));\n" +
        "eventBus.subscribe('OrderPlaced', e => recordAnalytics(e.orderId));"
    },
    {
      title: "Example 2: Decoupling in time (async)",
      description: "<p>Events can be queued, letting producers and consumers run at different speeds.</p>",
      code: "// Producer drops an event on a queue and returns immediately\n" +
        "await queue.send('OrderPlaced', { orderId: 1 });\n" +
        "// A slow consumer (e.g. generating a PDF invoice) processes later,\n" +
        "// at its own pace, without making the user wait."
    },
    {
      title: "Example 3: components react to events, not direct calls",
      description: "<p>A producer emits an event; consumers react independently, so adding a reaction needs no change to the producer.</p>",
      code: "// producer just announces a fact:\n" +
        "bus.emit('OrderPlaced', { orderId: 42 });\n" +
        "// independent consumers react:\n" +
        "on('OrderPlaced', reserveInventory);\n" +
        "on('OrderPlaced', sendConfirmation);\n" +
        "on('OrderPlaced', updateAnalytics);   // add later, producer untouched"
    },
    {
      title: "Example 4 (edge case): eventual consistency and hard-to-trace flows",
      description: "<p>Async events bring duplicate/out-of-order delivery and an implicit, scattered control flow that's hard to debug.</p>",
      code: "// 'What happens after an order?' has no single answer -> it's spread across N\n" +
        "//   handlers (and possibly event loops A->B->A).\n" +
        "// Events are usually at-least-once + unordered -> consumers must be idempotent\n" +
        "//   and tolerate reordering.\n" +
        "// Mitigate with correlation/trace ids, event schemas, and a DLQ. For a strictly\n" +
        "//   ordered, must-see-immediately workflow, synchronous calls may fit better."
    }
  ],
  whenToUse: "<p>Use event-driven design when you need loose coupling between independently evolving parts, " +
    "when one action should trigger many independent reactions, when producers and consumers should run " +
    "asynchronously or scale separately, or for real-time/streaming workloads. It shines for extensibility " +
    "&mdash; new consumers slot in freely. <strong>The serious trade-offs:</strong> control flow becomes " +
    "implicit and hard to trace (you can't 'follow the call' &mdash; you must know who subscribes); debugging, " +
    "testing, and reasoning about end-to-end behavior get harder; and you inherit messaging concerns like " +
    "ordering, duplicate delivery, and eventual consistency. Don't make everything event-driven by default; " +
    "use it where the decoupling and async benefits are real, and keep simple synchronous calls where flow " +
    "clarity matters more.</p>"
};

C["microservices"] = {
  summary: "<p><strong>Microservices</strong> structure an application as a suite of small, independently " +
    "deployable services, each owning a specific business capability and (usually) its own database, " +
    "communicating over the network (HTTP/gRPC/messaging). The promise is independent deployment, " +
    "independent scaling, technology freedom per service, fault isolation, and letting teams own services " +
    "end-to-end. The price is substantial <strong>distributed-systems complexity</strong>: network failures, " +
    "data consistency across services, deployment/observability overhead, and harder end-to-end testing.</p>",
  examples: [
    {
      title: "Example 1: Services own their data and talk over the network",
      description: "<p>Each service is autonomous; collaboration crosses a network boundary.</p>",
      code: "// Order service does NOT touch the payment database directly.\n" +
        "// It asks the payment service over the network:\n" +
        "async function placeOrder(cart) {\n" +
        "  const order = await orderDb.save(cart);\n" +
        "  const res = await fetch('http://payments/charge', { // network call\n" +
        "    method: 'POST', body: JSON.stringify({ orderId: order.id })\n" +
        "  });\n" +
        "  if (!res.ok) await compensate(order); // must handle remote failure!\n" +
        "}"
    },
    {
      title: "Example 2: Independent deployability",
      description: "<p>Each service ships on its own cadence, in its own tech, scaled to its own load.</p>",
      code: "//  payments-svc   (Java)   x10 instances  (high load)\n" +
        "//  catalog-svc    (Node)    x2  instances  (low load)\n" +
        "//  reporting-svc  (Python)  x1  instance\n" +
        "// Deploy/scale/upgrade each independently - one team per service."
    },
    {
      title: "Example 3: independently deployable services owning their data",
      description: "<p>Each service is a small app with its own datastore, communicating over the network.</p>",
      code: "// order-svc (own DB) --REST/events--> payment-svc (own DB)\n" +
        "//                     --events-->         shipping-svc (own DB)\n" +
        "// each: own repo, own pipeline, own scaling, owned by one team end-to-end.\n" +
        "// boundaries follow business capabilities; NO shared database between services."
    },
    {
      title: "Example 4 (edge case): the distributed-monolith trap",
      description: "<p>Services that share a DB or must deploy together give you all the network cost of microservices with none of the independence.</p>",
      code: "// Smell: svc A can't deploy without svc B, they share a DB, one change touches\n" +
        "//   both -> distributed monolith (worst of both worlds).\n" +
        "// Plus the inherent tax: no cross-service transactions (sagas), retries/\n" +
        "//   idempotency, tracing, versioned contracts, N pipelines.\n" +
        "// Adopt ONLY with real drivers (many teams, independent scale). Otherwise a\n" +
        "//   modular monolith delivers faster."
    }
  ],
  whenToUse: "<p>Adopt microservices when you have concrete drivers: large organizations needing many teams to " +
    "deploy independently, parts of the system with very different scaling profiles, or a need to isolate " +
    "failures and tech stacks &mdash; <em>and</em> you have the DevOps maturity (CI/CD, containers, " +
    "monitoring, distributed tracing) to operate them. <strong>The dominant guidance is 'monolith first':</strong> " +
    "most teams should start with a modular monolith and extract services only when a real boundary and a " +
    "real pain point emerge. Premature microservices are a leading cause of failed architectures &mdash; you " +
    "trade in-process simplicity for network calls, eventual consistency, distributed transactions (sagas), " +
    "and operational burden that a small team cannot absorb. Microservices solve organizational and scaling " +
    "problems, not code-quality problems.</p>"
};

C["peer-to-peer"] = {
  summary: "<p>In a <strong>peer-to-peer (P2P)</strong> architecture there's no central server: each node " +
    "(peer) acts as both client and server, requesting and providing resources directly to other peers. " +
    "Responsibility, data, and workload are distributed across the participants. P2P excels at resilience " +
    "(no single point of failure) and scalability (capacity grows as peers join), and powers systems like " +
    "BitTorrent, blockchains, and some real-time collaboration and messaging tools. The trade-off is " +
    "complexity: peer discovery, consistency, trust, and coordination are all harder without a central " +
    "authority.</p>",
  examples: [
    {
      title: "Example 1: Peers serve each other directly",
      description: "<p>No central server &mdash; a peer both provides and consumes resources.</p>",
      code: "// Each peer can answer requests AND make them\n" +
        "class Peer {\n" +
        "  constructor(id) { this.id = id; this.chunks = new Map(); }\n" +
        "  // acts as a SERVER: hand a chunk to a requesting peer\n" +
        "  provide(chunkId) { return this.chunks.get(chunkId); }\n" +
        "  // acts as a CLIENT: pull a chunk from another peer\n" +
        "  async fetchFrom(peer, chunkId) { return peer.provide(chunkId); }\n" +
        "}"
    },
    {
      title: "Example 2: Resilience through distribution",
      description: "<p>Because many peers hold the data, losing some peers doesn't lose the system.</p>",
      code: "// A file split into chunks, each replicated across many peers:\n" +
        "//   chunk A: peers [1, 4, 7]    chunk B: peers [2, 4, 9]\n" +
        "// If peers 4 and 7 drop offline, chunk A is still available from peer 1.\n" +
        "// No central server to fail; the network self-heals as peers join/leave."
    },
    {
      title: "Example 3: peers act as both client and server",
      description: "<p>In P2P there's no central server; each node provides and consumes resources directly from other nodes.</p>",
      code: "// each peer: shares some data + requests data from others\n" +
        "//   [peer A] <--> [peer B] <--> [peer C]\n" +
        "//            \\---> [peer D] <---/\n" +
        "// examples: BitTorrent (file chunks from many peers), blockchains, some VoIP.\n" +
        "// no single point of failure or control; capacity GROWS as peers join."
    },
    {
      title: "Example 4 (edge case): discovery, trust, and consistency are hard",
      description: "<p>Decentralization removes the central server but adds peer discovery, security against malicious peers, and consistency without a coordinator.</p>",
      code: "// How does a new peer FIND others? (bootstrap nodes / DHT) - a partial centralization.\n" +
        "// Any peer may be malicious -> need verification (hashes, signatures, consensus).\n" +
        "// No central authority -> agreeing on shared state is expensive (e.g. blockchain\n" +
        "//   consensus is slow/costly). Churn (peers join/leave constantly) complicates\n" +
        "//   everything. Use P2P only when decentralization is a real requirement, not\n" +
        "//   just to avoid running servers."
    }
  ],
  whenToUse: "<p>P2P fits when you specifically want decentralization: no single point of failure or control, " +
    "censorship resistance, organic scaling with participants, or direct device-to-device exchange (file " +
    "sharing, blockchains, mesh networks, some real-time collaboration). <strong>Reality check:</strong> P2P " +
    "is a niche, demanding style. Without a central coordinator you face hard problems &mdash; discovering " +
    "peers, reaching consistency/consensus, handling untrusted participants, security, and NAT/firewall " +
    "traversal. For the overwhelming majority of business applications, centralized client-server is far " +
    "simpler and entirely sufficient. Choose P2P only when decentralization itself is a core requirement, not " +
    "as a default.</p>"
};

C["publish-subscribe"] = {
  summary: "<p><strong>Publish-Subscribe (pub/sub)</strong> is a messaging pattern where <strong>publishers</strong> " +
    "send messages to named <strong>topics/channels</strong> without knowing the recipients, and " +
    "<strong>subscribers</strong> express interest in topics and receive matching messages &mdash; mediated " +
    "by a <strong>message broker</strong> (Kafka, RabbitMQ, Redis, cloud pub/sub). It fully decouples " +
    "senders from receivers in identity, number, and time. It's the messaging backbone of event-driven " +
    "systems, enabling one-to-many fan-out, dynamic addition of subscribers, and asynchronous processing.</p>",
  examples: [
    {
      title: "Example 1: Publish to a topic, many subscribers receive",
      description: "<p>The publisher targets a topic, not specific consumers; a broker handles delivery.</p>",
      code: "// Publisher: sends to a TOPIC, unaware of who listens\n" +
        "broker.publish('user.signed_up', { userId: 7 });\n" +
        "\n" +
        "// Subscribers: each registers interest in the topic independently\n" +
        "broker.subscribe('user.signed_up', e => emailService.welcome(e.userId));\n" +
        "broker.subscribe('user.signed_up', e => crm.createLead(e.userId));\n" +
        "broker.subscribe('user.signed_up', e => analytics.track(e.userId));"
    },
    {
      title: "Example 2: Pub/Sub vs a point-to-point queue",
      description: "<p>Pub/sub fans out to all subscribers; a work queue delivers each message to one worker.</p>",
      code: "// PUB/SUB: every subscriber gets a COPY (broadcast / fan-out)\n" +
        "//   'order.placed' -> email AND inventory AND analytics all receive it\n" +
        "\n" +
        "// QUEUE (point-to-point): ONE worker gets each message (load sharing)\n" +
        "//   'resize.image' -> exactly one of [worker1, worker2, worker3] handles it"
    },
    {
      title: "Example 3: publishers and subscribers decoupled by a topic",
      description: "<p>Publishers emit to a topic without knowing subscribers; subscribers register interest independently.</p>",
      code: "// publisher (knows nothing about who listens):\n" +
        "broker.publish('user.signed_up', { id: 7 });\n" +
        "// subscribers register on the topic:\n" +
        "broker.subscribe('user.signed_up', sendWelcomeEmail);\n" +
        "broker.subscribe('user.signed_up', provisionWorkspace);\n" +
        "// add/remove subscribers freely; the publisher never changes."
    },
    {
      title: "Example 4 (edge case): no feedback + delivery guarantees",
      description: "<p>The publisher gets no success/failure signal, and a down subscriber misses events unless the broker offers durable subscriptions.</p>",
      code: "// Fire-and-forget: publisher can't know a subscriber failed -> don't use pub/sub\n" +
        "//   where you need a synchronous result.\n" +
        "// Subscriber offline when the event fires -> it MISSES the event unless using\n" +
        "//   durable subscriptions / consumer offsets (Kafka) so it can catch up.\n" +
        "// Subscribers must be idempotent (at-least-once delivery -> possible duplicates)."
    }
  ],
  whenToUse: "<p>Use pub/sub when an event has multiple interested parties, when you want to add/remove " +
    "consumers without touching producers, or when you need asynchronous, buffered processing that smooths " +
    "load spikes. It's central to event-driven and microservice architectures for broadcasting domain " +
    "events. <strong>Trade-offs:</strong> you take on a broker as critical infrastructure to run and monitor; " +
    "flow becomes implicit and harder to trace; and you must reason about delivery guarantees (at-least-once " +
    "vs exactly-once), message ordering, duplicate handling, and what happens when a subscriber is down " +
    "(dead-letter queues, replay). For simple, direct, synchronous interactions, a plain function or HTTP " +
    "call is clearer than introducing a broker.</p>"
};

C["component-based"] = {
  summary: "<p><strong>Component-based architecture</strong> builds systems from <strong>components</strong>: " +
    "self-contained, reusable units that encapsulate their implementation and expose well-defined " +
    "interfaces, so they can be developed, tested, deployed, and replaced independently and composed into " +
    "larger systems. A component is bigger than a class &mdash; it bundles related functionality behind a " +
    "contract and hides its internals. The style emphasizes <em>composition</em> and <em>reuse</em>; it " +
    "underlies UI frameworks (React/Angular/Vue components), plugin systems, and modular backends.</p>",
  examples: [
    {
      title: "Example 1: A reusable UI component with a clear interface",
      description: "<p>The component encapsulates its markup/logic; consumers use it via props (its contract).</p>",
      code: "// A self-contained component: internals hidden, interface = its props\n" +
        "function RatingStars({ value, max = 5, onChange }) {\n" +
        "  // implementation details (rendering, click handling) are encapsulated\n" +
        "  return /* stars UI that calls onChange(n) */;\n" +
        "}\n" +
        "// Reused anywhere, composed into bigger components, tested in isolation:\n" +
        "// <RatingStars value={4} onChange={save} />"
    },
    {
      title: "Example 2: Backend components composed behind contracts",
      description: "<p>Independent modules expose interfaces and are wired together.</p>",
      code: "// Each component is a black box with a published contract\n" +
        "interface AuthComponent    { login(c: Creds): Token; }\n" +
        "interface PaymentComponent { charge(t: Token, amt: Money): Receipt; }\n" +
        "\n" +
        "// Compose them; swap an implementation without touching the others\n" +
        "class App { constructor(public auth: AuthComponent,\n" +
        "                        public pay: PaymentComponent) {} }"
    },
    {
      title: "Example 3: self-contained, reusable components with clear interfaces",
      description: "<p>The system is built from independent components that expose well-defined contracts and hide internals - think UI component libraries.</p>",
      code: "// a component = encapsulated state + behavior + a public prop/event contract\n" +
        "<DatePicker value={d} onChange={setD} min={today} />   // reuse anywhere\n" +
        "// internals (calendar logic, styling) are hidden; consumers use the contract.\n" +
        "// teams build different components in parallel against agreed interfaces."
    },
    {
      title: "Example 4 (edge case): leaky contracts and version coupling",
      description: "<p>Reuse only works if the interface is stable and complete; leaky abstractions and breaking changes ripple across every consumer.</p>",
      code: "// Leaky: a component that requires callers to know its internal DOM/structure to\n" +
        "//   style or extend it -> consumers couple to internals -> refactors break them.\n" +
        "// Versioning: a breaking prop change forces every consumer to update in lockstep\n" +
        "//   -> use semver, additive changes, and deprecation windows for shared components.\n" +
        "// Design the contract for the consumer; keep internals truly private."
    }
  ],
  whenToUse: "<p>Favor component-based design when you want reusability and parallel development &mdash; UI " +
    "libraries, plugin/extension systems, product lines that share building blocks, or any codebase where " +
    "you want clear, replaceable units behind contracts. Well-defined components let teams work " +
    "independently and let you assemble features by composition. <strong>Gotchas:</strong> designing a " +
    "<em>genuinely</em> reusable component is hard &mdash; over-generalizing for imagined reuse produces " +
    "bloated, over-configurable components that are awkward everywhere (YAGNI applies). The interface (the " +
    "contract) is the most important and most expensive-to-change part, so design it carefully. And reuse is " +
    "a benefit, not an obligation: a component used in exactly one place doesn't need to be infinitely " +
    "general.</p>"
};

C["distributed"] = {
  summary: "<p>A <strong>distributed architecture</strong> spreads a system across multiple machines/nodes " +
    "that coordinate over a network to appear (ideally) as a single coherent system. Microservices, P2P, " +
    "and many cloud systems are distributed. Distribution buys scalability beyond one machine, fault " +
    "tolerance through redundancy, and geographic locality &mdash; but it introduces the genuinely hard " +
    "problems of distributed computing: partial failure, network latency/unreliability, data consistency, " +
    "and the impossibility (CAP theorem) of having perfect consistency, availability, and partition " +
    "tolerance all at once.</p>",
  examples: [
    {
      title: "Example 1: Partial failure must be designed for",
      description: "<p>In-process calls don't fail halfway; network calls do &mdash; so you need timeouts/retries.</p>",
      code: "// A remote call can hang, fail, or succeed-but-you-never-hear-back\n" +
        "async function callInventory(orderId) {\n" +
        "  try {\n" +
        "    return await withTimeout(fetch(`http://inventory/reserve/${orderId}`), 2000);\n" +
        "  } catch (e) {\n" +
        "    return retryWithBackoff(() => /* ... */, { max: 3 }); // expect failure\n" +
        "  }\n" +
        "}"
    },
    {
      title: "Example 2: The CAP trade-off in practice",
      description: "<p>During a network partition you must pick consistency or availability.</p>",
      code: "// Network split between data centers. You choose:\n" +
        "//   CP: refuse writes until consistent again (correct, but unavailable)\n" +
        "//   AP: keep accepting writes, reconcile later (available, temporarily\n" +
        "//       inconsistent -> 'eventual consistency')\n" +
        "// A bank balance leans CP; a 'likes' counter leans AP. Context decides."
    },
    {
      title: "Example 3: work spread across multiple machines",
      description: "<p>A distributed system runs on many nodes that coordinate over a network to appear as one system.</p>",
      code: "// load + data spread across nodes:\n" +
        "//   app instances (many)  +  sharded/replicated DB  +  distributed cache\n" +
        "//   coordinated via the network to serve more than one box ever could.\n" +
        "// gains: scale beyond one machine, fault tolerance, geographic reach."
    },
    {
      title: "Example 4 (edge case): the fallacies of distributed computing",
      description: "<p>Distribution introduces partial failure, latency, and consistency problems that don't exist on one machine - don't distribute without need.</p>",
      code: "// False assumptions that bite: 'the network is reliable / has zero latency /\n" +
        "//   infinite bandwidth / is secure'. None are true.\n" +
        "// You inherit: partial failures, no global clock, no cross-node ACID (CAP),\n" +
        "//   harder debugging/tracing, and network security concerns.\n" +
        "// A single machine is far simpler and handles a LOT -> distribute only when one\n" +
        "//   box genuinely can't meet load/availability/geo needs."
    }
  ],
  whenToUse: "<p>Go distributed when a single machine genuinely can't meet your needs &mdash; load beyond one " +
    "server, availability requirements that need redundancy, data/users spread across regions, or " +
    "independent scaling of parts. Modern cloud applications are distributed almost by default. " +
    "<strong>The hard truth:</strong> distribution multiplies complexity. The '<a>fallacies of distributed " +
    "computing</a>' (the network is reliable, latency is zero, bandwidth is infinite, topology doesn't " +
    "change&hellip;) are all false, and ignoring them causes outages. You must design for partial failure, " +
    "embrace eventual consistency where strong consistency is too costly, and invest in observability. Don't " +
    "distribute for its own sake &mdash; every node boundary you add is a new failure mode. Stay on one " +
    "machine as long as it serves you.</p>"
};

C["structural"] = {
  summary: "<p>In this roadmap, <strong>structural</strong> refers to the family of architectural styles " +
    "concerned with how a system is <em>statically organized</em> into parts and how those parts are " +
    "arranged and connected &mdash; as opposed to styles focused on messaging or distribution. Structural " +
    "styles include <strong>layered</strong>, <strong>component-based</strong>, <strong>monolithic</strong>, " +
    "and <strong>pipes-and-filters</strong>. The common thread is decomposition: breaking a system into " +
    "named building blocks with defined relationships so the whole is comprehensible, maintainable, and " +
    "amenable to change.</p>",
  examples: [
    {
      title: "Example 1: Pipes and filters (a structural arrangement)",
      description: "<p>Independent processing stages connected in sequence, each transforming the data.</p>",
      code: "// Structure = a chain of filters connected by pipes\n" +
        "const stages = [tokenize, removeStopWords, stem, countFrequencies];\n" +
        "const analyze = text => stages.reduce((data, stage) => stage(data), text);\n" +
        "// Each stage is reusable and independently testable; the STRUCTURE is the pipeline."
    },
    {
      title: "Example 2: Layered structure",
      description: "<p>A static arrangement of parts stacked by responsibility (see Layered).</p>",
      code: "// The structural relationship: who is allowed to depend on whom\n" +
        "//   Presentation --> Application --> Domain --> Infrastructure\n" +
        "// This dependency arrangement IS the architecture's structure."
    },
    {
      title: "Example 3: how the pieces are arranged and connected",
      description: "<p>Structural decisions are about decomposition and relationships - what the modules are and how they depend on each other.</p>",
      code: "// structural questions:\n" +
        "//   what are the top-level modules/services? (decomposition)\n" +
        "//   who depends on whom, and in which direction? (dependency graph)\n" +
        "//   where are the boundaries (in-process vs network)?\n" +
        "// a dependency diagram (boxes + arrows) IS the structural view of the system."
    },
    {
      title: "Example 4 (edge case): dependency cycles and unclear ownership",
      description: "<p>The two structural smells: cyclic dependencies between modules, and components with no clear owner/responsibility.</p>",
      code: "// Cycle: A -> B -> C -> A -> can't build/test/deploy independently, change ripples.\n" +
        "//   Break it by extracting a shared interface (Dependency Inversion).\n" +
        "// Fuzzy ownership: a 'common'/'shared' module everything depends on becomes a\n" +
        "//   change magnet + coupling hub. Keep dependencies acyclic and directional\n" +
        "//   (toward stable abstractions), with each module owning a clear concern."
    }
  ],
  whenToUse: "<p>Think in structural terms whenever you're deciding how to <em>decompose</em> a system and " +
    "arrange its parts &mdash; the static shape that determines where code lives and how dependencies flow. " +
    "Pick a layered structure for typical apps, pipes-and-filters for data-transformation flows, " +
    "component-based for reusable building blocks. <strong>Key point:</strong> a clear structure is what " +
    "makes a large system navigable; a missing or violated structure (dependencies pointing every which " +
    "way, no clear modules) is what makes a 'big ball of mud.' Define the allowed dependency directions " +
    "explicitly and, ideally, enforce them with tooling (module boundaries, lint rules) so the structure " +
    "doesn't erode over time.</p>"
};

C["messaging"] = {
  summary: "<p><strong>Messaging</strong> as an architectural style has components communicate by sending " +
    "<strong>messages</strong> through a channel or broker rather than calling each other directly. Messages " +
    "are typically asynchronous and can be commands ('do this'), events ('this happened'), or documents " +
    "('here's data'). Messaging decouples components in time (sender and receiver needn't be available " +
    "simultaneously), space (they needn't know each other's location), and pace (a queue buffers bursts). " +
    "It encompasses queues (point-to-point), pub/sub (fan-out), and message-driven microservices, and is the " +
    "communication substrate of most event-driven systems.</p>",
  examples: [
    {
      title: "Example 1: Asynchronous command via a queue",
      description: "<p>The sender hands off work and moves on; a worker processes it later.</p>",
      code: "// Sender: enqueue and return immediately - no waiting on the slow job\n" +
        "await queue.send('generate-invoice', { orderId: 42 });\n" +
        "respondToUser('Your invoice is being prepared.');\n" +
        "\n" +
        "// Worker (separate process/service): consumes at its own pace\n" +
        "queue.consume('generate-invoice', async msg => {\n" +
        "  await buildPdfInvoice(msg.orderId); // heavy work, off the request path\n" +
        "});"
    },
    {
      title: "Example 2: Buffering to absorb load spikes",
      description: "<p>A queue smooths a flood of requests so slow downstream systems aren't overwhelmed.</p>",
      code: "// 10,000 orders arrive in a burst at midnight:\n" +
        "//   [API] --enqueue all 10k--> [ queue ] --steady drip--> [worker x5]\n" +
        "// The queue absorbs the spike; workers process at a sustainable rate\n" +
        "// instead of the database falling over under simultaneous load."
    },
    {
      title: "Example 3: asynchronous communication via a broker",
      description: "<p>Components exchange messages through a broker instead of calling each other directly - decoupling them in time and space.</p>",
      code: "// producer doesn't wait or know the consumer:\n" +
        "queue.send('process-upload', { fileId: 9 });   // returns immediately\n" +
        "// consumer(s) process when able:\n" +
        "queue.consume('process-upload', job => transcode(job.fileId));\n" +
        "// buffers bursts, survives consumer downtime, lets each side scale separately."
    },
    {
      title: "Example 4 (edge case): delivery semantics + operating the broker",
      description: "<p>Messaging trades synchronous simplicity for at-least-once delivery, ordering caveats, and another piece of infrastructure to run.</p>",
      code: "// at-least-once -> consumers must be idempotent (dedupe by message id).\n" +
        "// ordering is per-partition/queue only -> partition by key if order matters.\n" +
        "// the broker itself (RabbitMQ/Kafka) is infra you must run, monitor (queue\n" +
        "//   depth/lag), secure, and make HA.\n" +
        "// Don't use messaging for request/response that needs an immediate answer."
    }
  ],
  whenToUse: "<p>Reach for messaging when work can or should be asynchronous (long-running tasks, email, " +
    "report generation), when you need to absorb bursty load (queue as a buffer), when components must be " +
    "decoupled and independently scalable, or for reliable delivery with retries. It's foundational to " +
    "event-driven and microservice architectures. <strong>Trade-offs:</strong> you introduce a broker as " +
    "critical infrastructure; you give up the simplicity of immediate, synchronous, request-response flow; " +
    "and you must handle messaging realities &mdash; ordering, at-least-once delivery and the resulting " +
    "duplicates (so make consumers <em>idempotent</em>), failures, and dead-letter handling. For simple " +
    "request/response where the caller needs an immediate answer, a direct call is simpler and more " +
    "appropriate than messaging.</p>"
};

/* ======================================================================
   SECTION 7 — ARCHITECTURAL PATTERNS
   ====================================================================== */

C["architectural-patterns"] = {
  summary: "<p><strong>Architectural patterns</strong> are reusable solutions to recurring <em>system-level</em> " +
    "organization problems &mdash; the architectural counterpart to design patterns. Where a design pattern " +
    "shapes a few classes, an architectural pattern shapes the whole application or a major subsystem: " +
    "examples include <strong>MVC</strong>, <strong>Layered</strong>, <strong>Microkernel</strong>, " +
    "<strong>Event Sourcing</strong>, <strong>CQRS</strong>, <strong>SOA</strong>, and " +
    "<strong>Domain-Driven Design</strong>'s building blocks. They provide proven structures and a shared " +
    "vocabulary for big decisions, but each carries significant trade-offs you must weigh against your " +
    "context.</p>",
  examples: [
    {
      title: "Example 1: Naming a structure with a pattern",
      description: "<p>Saying 'we use MVC here' communicates an entire arrangement of responsibilities.</p>",
      code: "// 'MVC' instantly tells a developer the role of each part:\n" +
        "//   Model      -> data + business rules\n" +
        "//   View       -> presentation\n" +
        "//   Controller -> handles input, coordinates model & view\n" +
        "// One acronym conveys a whole structural decision."
    },
    {
      title: "Example 2: Patterns are chosen for their trade-offs",
      description: "<p>Picking an architectural pattern means accepting its costs, not just its benefits.</p>",
      code: "// Event Sourcing gives a full audit trail + time travel,\n" +
        "// but costs: rebuild-from-events complexity, eventual consistency,\n" +
        "// schema/versioning of events. You adopt the COST to get the BENEFIT.\n" +
        "// No pattern is free - architecture is the art of choosing trade-offs."
    },
    {
      title: "Example 3: patterns that shape whole applications",
      description: "<p>Architectural patterns are reusable solutions to system-level problems.</p>",
      code: "// MVC / MVVM       - separate UI, state, and presentation logic\n" +
        "// Layered          - tiers by responsibility\n" +
        "// Hexagonal/Ports & Adapters - core isolated from I/O via ports\n" +
        "// Microkernel      - minimal core + plugins\n" +
        "// Event Sourcing + CQRS - store events, separate read/write\n" +
        "// Pick by the system-shaped problem you actually have."
    },
    {
      title: "Example 4 (edge case): combining patterns and the cost of change",
      description: "<p>Real systems layer multiple patterns, but committing to a heavy architectural pattern early is hard to reverse.</p>",
      code: "// Typical combo: a Layered/Hexagonal monolith using MVC at the web edge + events\n" +
        "//   to async workers.\n" +
        "// But Event Sourcing + CQRS + microservices on day one = enormous accidental\n" +
        "//   complexity if the domain doesn't need it - and unwinding it later is costly.\n" +
        "// Start with the simplest pattern that fits; adopt heavier ones only when a\n" +
        "//   concrete force (audit history, scale, plugins) demands them."
    }
  ],
  whenToUse: "<p>Consider an architectural pattern when you face the system-shaped problem it addresses: MVC/" +
    "MVVM for separating UI from logic, layered for general apps, microkernel for extensible/plugin products, " +
    "event sourcing for audit-critical domains, CQRS when reads and writes have very different needs, SOA/" +
    "microservices for organizational scale. <strong>The recurring warning:</strong> architectural patterns " +
    "are heavyweight &mdash; adopting one prematurely or cargo-culting it from a blog post imports complexity " +
    "you may not need. Start with the simplest structure that works (often a layered modular monolith) and " +
    "introduce a more elaborate pattern only when a concrete problem justifies its cost.</p>"
};

C["domain-driven-design"] = {
  summary: "<p><strong>Domain-Driven Design (DDD)</strong> is an approach (Eric Evans) to building complex " +
    "software by centering the design on a deep, evolving model of the business domain, expressed in a " +
    "shared <strong>ubiquitous language</strong>. Its <em>tactical</em> tools are building blocks &mdash; " +
    "entities, value objects, aggregates, repositories, domain services, factories, domain events. Its " +
    "<em>strategic</em> tools manage large systems by dividing them into <strong>bounded contexts</strong> " +
    "(separate models with their own consistent language), mapped together via context maps. DDD's goal is " +
    "to tame complex domains by making the code a faithful, maintainable expression of how the business " +
    "actually works.</p>",
  examples: [
    {
      title: "Example 1: An aggregate enforcing a consistency boundary",
      description: "<p>The aggregate root is the only entry point and guards the whole cluster's invariants.</p>",
      code: "// Order is an AGGREGATE ROOT; line items are inside its boundary.\n" +
        "// Outside code changes them ONLY through the root, never directly.\n" +
        "class Order {\n" +
        "  #lines = [];\n" +
        "  addLine(product, qty) {\n" +
        "    if (this.#total() + product.price * qty > 10000)\n" +
        "      throw new Error('order exceeds credit limit'); // invariant guarded\n" +
        "    this.#lines.push({ product, qty });\n" +
        "  }\n" +
        "  #total() { return this.#lines.reduce((s, l) => s + l.product.price * l.qty, 0); }\n" +
        "}"
    },
    {
      title: "Example 2: Bounded contexts keep models honest",
      description: "<p>'Customer' means different things in different contexts; DDD keeps them separate.</p>",
      code: "// Sales context: Customer = leads, opportunities, contact history\n" +
        "// Billing context: Customer = payment methods, invoices, credit\n" +
        "// Same word, DIFFERENT models. DDD keeps each context's model\n" +
        "// internally consistent instead of forcing one bloated 'Customer'."
    },
    {
      title: "Example 3: the DDD building blocks fit together",
      description: "<p>DDD provides a vocabulary for modeling complex domains around a ubiquitous language.</p>",
      code: "// Entity         - identity over time (Order)\n" +
        "// Value Object   - defined by value, immutable (Money)\n" +
        "// Aggregate      - a consistency boundary with a root entity\n" +
        "// Repository     - persistence for an aggregate\n" +
        "// Domain Service - logic spanning entities\n" +
        "// Bounded Context- a model + language valid within one boundary"
    },
    {
      title: "Example 4 (edge case): DDD is overkill for simple domains",
      description: "<p>The full tactical+strategic toolkit pays off only with real domain complexity and expert collaboration; a CRUD app drowns in ceremony.</p>",
      code: "// Anti-pattern: aggregates, repositories, domain events, and bounded contexts for\n" +
        "//   a simple admin CRUD tool -> huge overhead, no domain richness to justify it.\n" +
        "// DDD shines when business RULES are the hard part and you have domain experts to\n" +
        "//   model WITH. Strategic DDD (bounded contexts) often matters even when you skip\n" +
        "//   the heavy tactical patterns. Match the investment to the complexity."
    }
  ],
  whenToUse: "<p>DDD pays off in domains with <strong>real, substantial complexity</strong> and active " +
    "collaboration with domain experts &mdash; insurance, finance, logistics, healthcare, complex SaaS. " +
    "There, the modeling discipline and bounded contexts keep large systems comprehensible and aligned with " +
    "the business. <strong>When to skip it:</strong> DDD is a heavy investment. For CRUD-heavy or " +
    "technically-simple applications, full DDD is overkill &mdash; you'll spend effort on aggregates and " +
    "contexts that the domain doesn't justify. Many teams productively borrow the tactical patterns " +
    "(entities, value objects, repositories) without the full strategic apparatus. Apply DDD in proportion " +
    "to genuine domain complexity, and only where talking to domain experts is actually part of the work.</p>"
};

C["entities"] = {
  summary: "<p>An <strong>entity</strong> is a domain object defined by a unique <strong>identity</strong> " +
    "that persists over time, independent of its attribute values. Two entities with identical data are " +
    "still <em>different</em> if their identities differ, and an entity remains 'the same' object even as " +
    "its attributes change. A <code>Customer</code> whose name and address change is still the same customer " +
    "(same ID). Entities typically have a lifecycle, mutable state, and behavior that enforces their rules. " +
    "They contrast with value objects, which have no identity and are compared purely by their values.</p>",
  examples: [
    {
      title: "Example 1: Identity-based equality",
      description: "<p>Entities are equal when their IDs match, not when their fields match.</p>",
      code: "class Customer {\n" +
        "  constructor(id, name) { this.id = id; this.name = name; }\n" +
        "  equals(other) {\n" +
        "    return other instanceof Customer && this.id === other.id; // IDENTITY\n" +
        "  }\n" +
        "}\n" +
        "const a = new Customer('c-1', 'Sam');\n" +
        "const b = new Customer('c-1', 'Samuel'); // same person, renamed\n" +
        "a.equals(b); // true - same identity despite different name"
    },
    {
      title: "Example 2: Continuity through change",
      description: "<p>The entity carries its identity across state transitions over its lifecycle.</p>",
      code: "const order = new Order('o-42');   // identity fixed at creation\n" +
        "order.addItem(item);\n" +
        "order.place();                     // state changes...\n" +
        "order.ship();                      // ...but it's still order o-42\n" +
        "// Throughout its lifecycle, identity stays constant; attributes evolve."
    },
    {
      title: "Example 3: identity, not attributes, defines an entity",
      description: "<p>Two entities with identical fields are still different things; equality is by id.</p>",
      code: "class Customer {\n" +
        "  constructor(readonly id: string) {}\n" +
        "  equals(other: Customer) { return this.id === other.id; } // by IDENTITY\n" +
        "}\n" +
        "// two customers both named 'Sam' are DIFFERENT entities (different ids).\n" +
        "// the entity persists through attribute changes - same id = same customer."
    },
    {
      title: "Example 4 (edge case): identity source and the aggregate boundary",
      description: "<p>Where the id comes from (DB vs app-generated) and which entity is the aggregate root affect consistency and references.</p>",
      code: "// DB-generated ids force a save before you have identity -> app-generated (UUID)\n" +
        "//   lets you create + reference an entity before persistence (cleaner domain).\n" +
        "// Reference OTHER aggregates by id, not by object, to keep the consistency\n" +
        "//   boundary small: order.customerId, not order.customer (the whole object).\n" +
        "// Mutable identity (changing an id) breaks everything - ids are immutable."
    }
  ],
  whenToUse: "<p>Model something as an entity when its identity and continuity matter &mdash; you need to track " +
    "<em>this specific thing</em> over time as it changes and persists (users, orders, accounts, devices, " +
    "shipments). Entities are the natural anchors for persistence (they map to rows with primary keys) and " +
    "for aggregates. <strong>Gotcha:</strong> don't make everything an entity. Things that are fully " +
    "described by their values and have no meaningful identity &mdash; money, a date range, an address, a " +
    "color &mdash; should be <em>value objects</em>, which are simpler, immutable, and safer. Overusing " +
    "entities (giving identity to things that don't need it) leads to needless mutability and identity " +
    "tracking. Ask: 'do I care <em>which</em> one this is, or only <em>what</em> it is?'</p>"
};

C["value-objects"] = {
  summary: "<p>A <strong>value object</strong> is a domain object with <strong>no identity</strong>, defined " +
    "entirely by its attributes and (ideally) <strong>immutable</strong>. Two value objects with the same " +
    "values are interchangeable &mdash; $5 is $5. Money, dates, ranges, coordinates, addresses, and " +
    "measurements are classic value objects. Because they're immutable and compared by value, they're " +
    "simple, thread-safe, and free of the aliasing bugs mutable shared objects cause. They're also a great " +
    "home for small bits of domain behavior and validation, replacing primitive obsession (passing raw " +
    "numbers/strings around).</p>",
  examples: [
    {
      title: "Example 1: An immutable, value-compared object",
      description: "<p>Equality is by value; 'changing' it returns a new instance.</p>",
      code: "class Money {\n" +
        "  constructor(cents, currency) {\n" +
        "    this.cents = cents; this.currency = currency;\n" +
        "    Object.freeze(this);                 // immutable\n" +
        "  }\n" +
        "  equals(o) { return this.cents === o.cents && this.currency === o.currency; }\n" +
        "  add(o) {                               // returns a NEW Money, never mutates\n" +
        "    if (o.currency !== this.currency) throw new Error('currency mismatch');\n" +
        "    return new Money(this.cents + o.cents, this.currency);\n" +
        "  }\n" +
        "}"
    },
    {
      title: "Example 2: Replacing primitives with a value object",
      description: "<p>A typed value object carries validation and meaning a raw string can't.</p>",
      code: "// Primitive obsession: a bare string with no guarantees\n" +
        "// function register(email: string) { ... }\n" +
        "\n" +
        "// Value object: invalid state is unrepresentable\n" +
        "class Email {\n" +
        "  constructor(value) {\n" +
        "    if (!/^[^@]+@[^@]+\\.[^@]+$/.test(value)) throw new Error('invalid email');\n" +
        "    this.value = value; Object.freeze(this);\n" +
        "  }\n" +
        "}\n" +
        "// Anywhere you see an Email, it is guaranteed valid."
    },
    {
      title: "Example 3: immutable, equality-by-value, self-validating",
      description: "<p>A value object has no identity; it's defined by its data, can't be changed in place, and can guard its own validity.</p>",
      code: "class Money {\n" +
        "  constructor(readonly amount: number, readonly currency: string) {\n" +
        "    if (amount < 0) throw new Error('negative amount'); // self-validating\n" +
        "  }\n" +
        "  add(o: Money) {                       // returns a NEW instance (immutable)\n" +
        "    if (o.currency !== this.currency) throw new Error('currency mismatch');\n" +
        "    return new Money(this.amount + o.amount, this.currency);\n" +
        "  }\n" +
        "}\n" +
        "// 5 EUR equals 5 EUR (by value); no identity to track."
    },
    {
      title: "Example 4 (edge case): mutating a 'value object' breaks sharing",
      description: "<p>If value objects are mutable, sharing one accidentally mutates everywhere it's referenced - immutability is what makes them safe.</p>",
      code: "// If Money were mutable and shared: a.price = b.price; a.price.amount = 0;\n" +
        "//   -> b.price.amount is now 0 too (aliasing bug).\n" +
        "// Immutability avoids defensive copying and makes them safe as map keys / to\n" +
        "//   pass around freely. Replace, don't mutate: order.price = order.price.add(tax).\n" +
        "// Don't give them surrogate ids 'for the DB' - that turns them into pseudo-entities."
    }
  ],
  whenToUse: "<p>Prefer value objects for any concept fully described by its data with no need to track " +
    "identity &mdash; money, quantities, dates/durations, ranges, geographic points, names, identifiers. " +
    "They eliminate a whole class of bugs (immutability means no surprise mutations, value-equality means " +
    "intuitive comparisons) and let you attach validation and behavior, curing 'primitive obsession.' " +
    "<strong>Trade-offs:</strong> immutability means you create new instances on every change, which is " +
    "occasionally a (usually negligible) performance consideration in hot loops; and wrapping every " +
    "primitive can be overkill for trivial throwaway values. Use them where the concept has rules or recurs " +
    "across the domain, not for every loose integer.</p>"
};

C["repositories"] = {
  summary: "<p>A <strong>repository</strong> is an abstraction that mediates between the domain and data " +
    "storage, providing a <em>collection-like</em> interface for accessing aggregates/entities &mdash; " +
    "<code>save()</code>, <code>findById()</code>, <code>remove()</code> &mdash; while hiding the actual " +
    "persistence mechanism (SQL, NoSQL, an API, in-memory). The domain code talks to the repository as if it " +
    "were an in-memory collection, knowing nothing about queries, connections, or ORMs. This keeps " +
    "persistence concerns out of the domain, makes the domain testable with fake repositories, and lets you " +
    "change the database without touching business logic.</p>",
  examples: [
    {
      title: "Example 1: A repository interface owned by the domain",
      description: "<p>The domain defines what it needs; infrastructure implements it.</p>",
      code: "// Domain layer: the CONTRACT (no DB details here)\n" +
        "interface OrderRepository {\n" +
        "  findById(id: string): Order | null;\n" +
        "  save(order: Order): void;\n" +
        "}\n" +
        "\n" +
        "// Infrastructure layer: the concrete implementation\n" +
        "class SqlOrderRepository implements OrderRepository {\n" +
        "  findById(id) { /* SELECT ... maps a row back into an Order entity */ }\n" +
        "  save(order)  { /* INSERT/UPDATE ... */ }\n" +
        "}"
    },
    {
      title: "Example 2: Fake repository makes domain tests trivial",
      description: "<p>Because the domain depends on the interface, tests need no real database.</p>",
      code: "class InMemoryOrderRepo implements OrderRepository {\n" +
        "  #store = new Map();\n" +
        "  findById(id) { return this.#store.get(id) ?? null; }\n" +
        "  save(order)  { this.#store.set(order.id, order); }\n" +
        "}\n" +
        "// Unit-test business logic at full speed, no DB to spin up.\n" +
        "const service = new OrderService(new InMemoryOrderRepo());"
    },
    {
      title: "Example 3: a collection-like interface over persistence",
      description: "<p>A repository lets domain code work with aggregates as if they were an in-memory collection, hiding the datastore.</p>",
      code: "interface OrderRepository {\n" +
        "  findById(id: string): Order | null;\n" +
        "  save(order: Order): void;\n" +
        "  findByCustomer(customerId: string): Order[];\n" +
        "}\n" +
        "// domain/service code uses this interface; it never sees SQL/Mongo.\n" +
        "// swap a PostgresOrderRepository for an InMemoryOrderRepository in tests."
    },
    {
      title: "Example 4 (edge case): repositories that leak the ORM / become query dumps",
      description: "<p>A repo whose methods return ORM query builders, or that grows hundreds of bespoke finders, defeats the abstraction.</p>",
      code: "// Leak: findOrders(): QueryBuilder -> callers now build ORM queries = coupled to it.\n" +
        "// Bloat: findByXAndYSortedByZWithW(...) x200 -> the repo becomes a query junk drawer.\n" +
        "//   Prefer a few intention-revealing methods + a Specification/criteria object for\n" +
        "//   flexible queries.\n" +
        "// One repository PER AGGREGATE ROOT (not per table). For simple CRUD, a repo over\n" +
        "//   a plain ORM can be needless indirection - use judgment."
    }
  ],
  whenToUse: "<p>Use repositories when you want to decouple domain logic from persistence &mdash; especially in " +
    "DDD/layered/clean architectures, or any app where you value testability and the freedom to change " +
    "storage. They give one clear place for data-access logic per aggregate and a clean seam for testing. " +
    "<strong>Gotchas:</strong> a repository should expose domain-meaningful operations over aggregate roots, " +
    "not become a thin pass-through with a method per SQL query (that defeats the abstraction). Avoid leaking " +
    "ORM/query specifics through the interface. And for very simple CRUD apps, a repository layer on top of " +
    "an ORM that already provides one can be redundant ceremony &mdash; don't add the abstraction unless it " +
    "earns its keep.</p>"
};

C["mappers"] = {
  summary: "<p>A <strong>mapper</strong> (or Data Mapper) is an object that transfers data between two " +
    "representations while keeping them independent &mdash; most commonly between domain objects and " +
    "database rows, or between domain objects and DTOs. The domain model stays pure (no persistence " +
    "annotations, no knowledge of the database), and the mapper handles the translation in one place. This " +
    "is the pattern behind 'real' ORMs (Data Mapper, like Hibernate/Doctrine) as opposed to Active Record " +
    "(where the entity knows how to save itself). Mappers keep concerns separated at the cost of extra " +
    "translation code.</p>",
  examples: [
    {
      title: "Example 1: Mapping a domain object to/from a DB row",
      description: "<p>Translation lives in the mapper, so the domain object stays persistence-ignorant.</p>",
      code: "class UserMapper {\n" +
        "  // DB row  ->  domain object\n" +
        "  toDomain(row) { return new User(row.id, row.full_name, new Email(row.email)); }\n" +
        "  // domain object  ->  DB row\n" +
        "  toRow(user) {\n" +
        "    return { id: user.id, full_name: user.name, email: user.email.value };\n" +
        "  }\n" +
        "}\n" +
        "// User has NO knowledge of snake_case columns or the database."
    },
    {
      title: "Example 2: Mapping a domain object to an API DTO",
      description: "<p>The mapper shapes the external contract separately from the internal model.</p>",
      code: "class UserDtoMapper {\n" +
        "  toDto(user) {                  // expose only what the API should\n" +
        "    return { id: user.id, name: user.name }; // hides internal fields\n" +
        "  }\n" +
        "}\n" +
        "// Internal model can change freely; the API shape is controlled here."
    },
    {
      title: "Example 3: translate between layers' representations",
      description: "<p>A mapper converts between a domain model, a persistence row, and an API DTO so each layer keeps its own shape.</p>",
      code: "// domain <-> DTO\n" +
        "const toDto = (u: User): UserDto => ({ id: u.id, name: u.fullName() });\n" +
        "const fromDto = (d: UserDto): User => new User(d.id, d.name);\n" +
        "// keeps the API contract independent from the domain model -> you can change one\n" +
        "//   without breaking the other (e.g. rename a domain field without altering JSON)."
    },
    {
      title: "Example 4 (edge case): mapping is boilerplate that can drift",
      description: "<p>Hand-written mappers are tedious and easy to forget to update; auto-mappers are convenient but hide bugs.</p>",
      code: "// Add a field to User but forget the mapper -> it's silently dropped from the DTO.\n" +
        "//   Cover mappers with tests, or generate them (MapStruct, AutoMapper) - but\n" +
        "//   'magic' auto-mappers can mis-map by name and fail at runtime, not compile.\n" +
        "// For trivial apps where layers share a shape, mapping may be unnecessary\n" +
        "//   indirection. Use it where domain and DTO/row genuinely DIVERGE."
    }
  ],
  whenToUse: "<p>Use a mapper when you want to keep two representations decoupled &mdash; a clean domain model " +
    "independent of database schema, or an internal model independent of the external API contract. It's " +
    "essential when the shapes differ (snake_case columns vs camelCase objects, flattened tables vs nested " +
    "objects) and when you want the domain free of persistence/serialization concerns (Clean Architecture, " +
    "DDD). <strong>Trade-off:</strong> mapping is boilerplate, and it can feel tedious when the domain and " +
    "the row/DTO are nearly identical. For simple apps, an Active Record ORM or direct serialization may be " +
    "pragmatic. Adopt explicit mappers when the separation buys you real flexibility or protects a model/API " +
    "you care about keeping stable.</p>"
};

C["dtos"] = {
  summary: "<p>A <strong>DTO (Data Transfer Object)</strong> is a simple, behavior-free object whose sole job " +
    "is to carry data across a boundary &mdash; between client and server, between layers, or between " +
    "services. DTOs are deliberately 'anemic': just fields (and maybe trivial accessors), shaped for the " +
    "transfer, not for domain logic. They let you control exactly what crosses a boundary (hiding internal " +
    "fields, aggregating data from multiple sources, decoupling your API's shape from your internal model), " +
    "and they reduce the number of round-trips by bundling related data.</p>",
  examples: [
    {
      title: "Example 1: A DTO shaping the API response",
      description: "<p>The DTO exposes a controlled subset, decoupled from the internal entity.</p>",
      code: "// Internal entity (rich, has secrets you must NOT expose)\n" +
        "class User { id; name; passwordHash; internalRiskScore; }\n" +
        "\n" +
        "// DTO: exactly what the API should return, nothing more\n" +
        "function toUserDto(user) {\n" +
        "  return { id: user.id, name: user.name }; // no passwordHash, no riskScore\n" +
        "}\n" +
        "// The API contract is now independent of the internal model."
    },
    {
      title: "Example 2: A DTO aggregating data to cut round-trips",
      description: "<p>One request returns a combined shape instead of forcing several calls.</p>",
      code: "// Instead of the client calling /user, /orders, /prefs separately:\n" +
        "function toDashboardDto(user, orders, prefs) {\n" +
        "  return {\n" +
        "    user:   { id: user.id, name: user.name },\n" +
        "    recent: orders.slice(0, 5).map(o => ({ id: o.id, total: o.total() })),\n" +
        "    theme:  prefs.theme,\n" +
        "  };\n" +
        "}\n" +
        "// One payload tailored to the screen that needs it."
    },
    {
      title: "Example 3: a stable wire shape, separate from the domain",
      description: "<p>A DTO carries data across a boundary; it's a flat, serializable contract decoupled from internal models.</p>",
      code: "// internal entity has logic + sensitive fields:\n" +
        "class User { id; name; passwordHash; #internalScore; fullName(){...} }\n" +
        "// DTO exposes ONLY what the API should return:\n" +
        "interface UserDto { id: string; name: string; }   // no passwordHash, no methods\n" +
        "// the API contract can stay stable even if the entity is refactored."
    },
    {
      title: "Example 4 (edge case): leaking entities as DTOs",
      description: "<p>Serializing domain entities directly is the classic mistake - it exposes internals, leaks sensitive fields, and couples your API to the DB schema.</p>",
      code: "// return res.json(user) -> ships passwordHash + every internal field, and any\n" +
        "//   lazy-loaded relation can blow up serialization.\n" +
        "// Also couples the JSON contract to the entity -> a DB rename breaks clients.\n" +
        "// Always map entity -> DTO at the boundary. (And don't put domain LOGIC on DTOs -\n" +
        "//   they're dumb data carriers.)"
    }
  ],
  whenToUse: "<p>Use DTOs at boundaries &mdash; API request/response bodies, messages between services, data " +
    "passed across layers &mdash; whenever you want the transfer shape to differ from, and stay independent " +
    "of, your internal domain model. They protect you from leaking internal/sensitive fields, let the API " +
    "evolve separately from the domain, and can tailor payloads to specific consumers. <strong>Trade-offs:</strong> " +
    "DTOs add mapping code and a layer of duplication (the same data described twice). For tiny apps where the " +
    "domain model and the API shape are genuinely identical and you control both ends, serializing the model " +
    "directly may be fine &mdash; but the moment they need to diverge, or you expose data externally, DTOs " +
    "earn their place. Note: a DTO being anemic is correct and expected; that's not the anti-pattern.</p>"
};

C["identity-maps"] = {
  summary: "<p>An <strong>Identity Map</strong> is a pattern that ensures each object is loaded from the " +
    "database <strong>only once</strong> per session/transaction by keeping a map of already-loaded objects " +
    "keyed by identity. When code asks for an entity that's already in memory, the same instance is returned " +
    "instead of a fresh copy. This prevents duplicate objects representing the same record (which could get " +
    "out of sync), guarantees reference equality within a unit of work, and avoids redundant database reads. " +
    "It's a core mechanism inside ORMs' 'session'/'persistence context'.</p>",
  examples: [
    {
      title: "Example 1: Returning the same instance on repeat lookups",
      description: "<p>The map caches by identity so the same record yields the same object.</p>",
      code: "class IdentityMap {\n" +
        "  #map = new Map();\n" +
        "  get(id)        { return this.#map.get(id); }\n" +
        "  put(id, entity){ this.#map.set(id, entity); }\n" +
        "}\n" +
        "\n" +
        "function findUser(id, map, db) {\n" +
        "  if (map.get(id)) return map.get(id);    // already loaded -> same instance\n" +
        "  const user = db.loadUser(id);           // first time -> hit the DB once\n" +
        "  map.put(id, user);\n" +
        "  return user;\n" +
        "}"
    },
    {
      title: "Example 2: Why it prevents inconsistency",
      description: "<p>Without it, two loads of the same record can diverge and one update gets lost.</p>",
      code: "// WITHOUT an identity map:\n" +
        "//   const a = findUser('u1');  const b = findUser('u1'); // two objects!\n" +
        "//   a.name = 'New';   save(b);  // b is stale -> a's change is lost\n" +
        "//\n" +
        "// WITH an identity map: a === b, so there's one consistent object."
    },
    {
      title: "Example 3: one in-memory instance per identity within a unit of work",
      description: "<p>An identity map caches loaded objects by id so the same row maps to the same object - avoiding duplicate loads and inconsistent copies.</p>",
      code: "// within one request/session:\n" +
        "const a = repo.findById(1);   // loads from DB, caches in the identity map\n" +
        "const b = repo.findById(1);   // returns the SAME object (cache hit, no 2nd query)\n" +
        "a === b;  // true -> edits to 'a' are visible via 'b'; no divergent copies\n" +
        "// ORMs (Hibernate's persistence context, EF's change tracker) do this for you."
    },
    {
      title: "Example 4 (edge case): scope and staleness of the map",
      description: "<p>An identity map must be scoped to a unit of work; too-long a scope serves stale data and leaks memory.</p>",
      code: "// Scope = one request/transaction. A long-lived (e.g. app-wide) identity map ->\n" +
        "//   serves STALE objects after the DB changed elsewhere, and grows unbounded.\n" +
        "// It also doesn't span processes -> in a distributed system two nodes have\n" +
        "//   separate maps (it's not a distributed cache).\n" +
        "// You rarely build this yourself; understand it to reason about ORM behavior\n" +
        "//   (why you got the same object, why a refresh is needed)."
    }
  ],
  whenToUse: "<p>Identity maps are mostly relevant when building or deeply understanding data-access / ORM " +
    "layers &mdash; they're what makes a 'unit of work' consistent and efficient. If you use an ORM " +
    "(Hibernate, Entity Framework, Doctrine, TypeORM), you're already getting an identity map via its " +
    "session/context; knowing the pattern explains behaviors like 'why do I get the same object twice?' and " +
    "why detaching/clearing the session matters. <strong>Gotchas:</strong> the map must be scoped correctly " +
    "(per request/transaction, not global) or it becomes a memory leak and a source of stale data across " +
    "users; and you rarely need to hand-roll one &mdash; reach for it only when building a custom persistence " +
    "layer without an ORM.</p>"
};

C["usecases"] = {
  summary: "<p>A <strong>use case</strong> (also called an interactor or application service) represents one " +
    "specific thing a user or system can <em>do</em> with the application &mdash; 'place an order', " +
    "'register a user', 'transfer funds'. In Clean Architecture, use cases form the application layer that " +
    "orchestrates the flow: they receive input, coordinate domain entities and repositories to fulfill the " +
    "request, and return a result &mdash; without containing the deep business rules (those live in " +
    "entities) or the delivery details (HTTP, UI). Organizing code around explicit use cases makes the " +
    "application's capabilities obvious and keeps orchestration separate from both rules and infrastructure.</p>",
  examples: [
    {
      title: "Example 1: A use case orchestrating a flow",
      description: "<p>It coordinates entities and repositories but delegates the actual rules to them.</p>",
      code: "// One class = one application capability\n" +
        "class PlaceOrderUseCase {\n" +
        "  constructor(orders, payments) { this.orders = orders; this.payments = payments; }\n" +
        "  execute(input) {\n" +
        "    const order = new Order(input.items); // entity holds the rules\n" +
        "    order.validate();\n" +
        "    this.payments.charge(order.total());  // coordinate collaborators\n" +
        "    return this.orders.save(order);       // persist via repository\n" +
        "  }\n" +
        "}"
    },
    {
      title: "Example 2: Use cases as the app's public capabilities",
      description: "<p>The set of use cases is a readable catalog of what the system can do.</p>",
      code: "// The application layer literally lists what the app does:\n" +
        "//   RegisterUserUseCase\n" +
        "//   PlaceOrderUseCase\n" +
        "//   CancelOrderUseCase\n" +
        "//   GenerateInvoiceUseCase\n" +
        "// Delivery (HTTP/CLI/queue) just calls the right use case - thin adapters."
    },
    {
      title: "Example 3: one class per application action",
      description: "<p>Each use case (interactor) is a single-purpose object that orchestrates the domain to fulfill one user intent.</p>",
      code: "class PlaceOrderUseCase {\n" +
        "  constructor(private orders: OrderRepository, private pay: PaymentGateway) {}\n" +
        "  execute(cmd: PlaceOrderCommand): OrderId {\n" +
        "    // orchestrate domain objects to fulfill ONE intent\n" +
        "    const order = Order.create(cmd.items);\n" +
        "    this.pay.charge(order.total());\n" +
        "    this.orders.save(order);\n" +
        "    return order.id;\n" +
        "  }\n" +
        "}\n" +
        "// the code structure reads like the list of things the app DOES."
    },
    {
      title: "Example 4 (edge case): anemic use cases or business rules in the wrong place",
      description: "<p>Use cases should orchestrate, not contain domain rules; and trivial CRUD doesn't need a use-case class per operation.</p>",
      code: "// Smell: PlaceOrderUseCase contains the pricing/discount RULES -> those belong on\n" +
        "//   the Order/domain model; the use case should just coordinate.\n" +
        "// Smell: a UseCase class for every getById on a CRUD app -> ceremony with no\n" +
        "//   application logic to hold. Use this pattern when there's real orchestration\n" +
        "//   (multiple steps, transactions, side effects), not for thin pass-throughs."
    }
  ],
  whenToUse: "<p>Organize around explicit use cases in applications with meaningful application logic, " +
    "especially with Clean/Hexagonal architecture &mdash; it makes capabilities discoverable, keeps " +
    "orchestration out of controllers, and gives a clean unit to test (one use case, with faked " +
    "repositories). It also makes the system independent of delivery mechanism: the same use case can be " +
    "triggered by HTTP, a CLI, or a message. <strong>Trade-off:</strong> a class per use case adds structure " +
    "that can feel heavy for trivial CRUD, where a thin controller-to-repository call is enough. Introduce " +
    "explicit use cases when there's real orchestration to capture; don't create empty pass-through " +
    "interactors just to follow the pattern.</p>"
};

C["model-view-controller"] = {
  summary: "<p><strong>Model-View-Controller (MVC)</strong> is a pattern that separates an application into " +
    "three roles: the <strong>Model</strong> (data and business rules), the <strong>View</strong> (the " +
    "presentation/UI), and the <strong>Controller</strong> (handles user input, invokes the model, and " +
    "selects the view). The goal is separation of concerns: UI changes don't touch business logic and vice " +
    "versa, and the model can be tested independently of the UI. MVC and its relatives (MVP, MVVM) are the " +
    "dominant patterns for structuring user-facing applications &mdash; web frameworks, desktop, and mobile.</p>",
  examples: [
    {
      title: "Example 1: The three roles in a web request",
      description: "<p>Controller handles input, the model does the work, the view renders the result.</p>",
      code: "// Controller: receives input, coordinates, picks a view\n" +
        "class UserController {\n" +
        "  show(req, res) {\n" +
        "    const user = UserModel.findById(req.params.id); // MODEL: data + rules\n" +
        "    res.render('user-profile', { user });           // VIEW: presentation\n" +
        "  }\n" +
        "}\n" +
        "// Each part has one responsibility and can change independently."
    },
    {
      title: "Example 2: Why separation helps",
      description: "<p>Swapping the view (HTML vs JSON) doesn't touch the model or its rules.</p>",
      code: "// Same model, different views - logic isn't duplicated or entangled\n" +
        "const user = UserModel.findById(id);\n" +
        "res.render('profile.html', { user }); // web page\n" +
        "// or:\n" +
        "res.json(toUserDto(user));            // API response\n" +
        "// The Model (rules) is reused; only presentation differs."
    },
    {
      title: "Example 3: separating model, view, and controller",
      description: "<p>MVC splits data/rules (model), presentation (view), and input handling/coordination (controller).</p>",
      code: "// Model: data + rules, no UI\n" +
        "class Cart { items=[]; total(){...} }\n" +
        "// Controller: handles input, updates the model, picks a view\n" +
        "addItem(req){ cart.add(req.item); return view('cart', cart); }\n" +
        "// View: renders the model, no business logic\n" +
        "// <h1>Total: {{cart.total}}</h1>\n" +
        "// MVVM/MVP are variants differing in how the view binds to state."
    },
    {
      title: "Example 4 (edge case): fat controllers and logic leaking into views",
      description: "<p>The common failure is business logic creeping into controllers or views instead of the model.</p>",
      code: "// Fat controller: pricing/validation/DB logic crammed into the controller ->\n" +
        "//   untestable, duplicated. Keep controllers THIN; push rules into the model/services.\n" +
        "// Logic in the view: <if user.age>=18 && !banned> in the template -> move to the\n" +
        "//   model (canVote()). Views should only DISPLAY.\n" +
        "// MVC organizes the UI layer; it is NOT your whole app architecture - the model\n" +
        "//   still needs proper domain/layering behind it."
    }
  ],
  whenToUse: "<p>Use MVC (or MVP/MVVM) for essentially any application with a user interface &mdash; it's the " +
    "default way web, desktop, and mobile frameworks structure UI code, and it cleanly separates " +
    "presentation from logic so each can evolve and be tested independently. <strong>Gotchas:</strong> the " +
    "controller tends to become a dumping ground ('fat controller') &mdash; keep business logic in the " +
    "model/services, not the controller. Variants exist for good reasons: MVVM (with data binding) suits " +
    "rich, stateful UIs; MVP suits cases needing testable presenters. And 'MVC' means somewhat different " +
    "things across frameworks (server-side MVC vs client-side), so understand your framework's specific " +
    "interpretation rather than assuming one universal definition.</p>"
};

C["microkernel"] = {
  summary: "<p>The <strong>microkernel</strong> (or plug-in) architecture splits a system into a minimal " +
    "<strong>core</strong> that provides only essential, general functionality, plus a set of " +
    "<strong>plug-in modules</strong> that add specific features. The core knows nothing about the plug-ins' " +
    "specifics &mdash; it just provides extension points and loads/coordinates plug-ins through a defined " +
    "contract. This makes the system highly extensible: new capabilities arrive as new plug-ins without " +
    "modifying the core. It's the architecture behind IDEs (VS Code, Eclipse), browsers with extensions, " +
    "and many products designed for customization.</p>",
  examples: [
    {
      title: "Example 1: A core with pluggable extensions",
      description: "<p>The core defines a contract and runs whatever plug-ins register against it.</p>",
      code: "// Core: tiny, knows only the plug-in contract\n" +
        "class Editor {\n" +
        "  #plugins = [];\n" +
        "  register(plugin) { this.#plugins.push(plugin); }  // extension point\n" +
        "  runCommand(name, ctx) {\n" +
        "    const p = this.#plugins.find(p => p.command === name);\n" +
        "    if (p) p.execute(ctx);          // delegate to the plug-in\n" +
        "  }\n" +
        "}\n" +
        "\n" +
        "// Plug-ins: independent features, added without changing the core\n" +
        "editor.register({ command: 'format', execute: ctx => prettify(ctx) });\n" +
        "editor.register({ command: 'lint',   execute: ctx => lint(ctx) });"
    },
    {
      title: "Example 2: Extensibility without core changes",
      description: "<p>A third party can add features by shipping a plug-in, never touching core code.</p>",
      code: "// New capability = new plug-in conforming to the contract\n" +
        "const spellCheckPlugin = {\n" +
        "  command: 'spellcheck',\n" +
        "  execute: ctx => checkSpelling(ctx.text),\n" +
        "};\n" +
        "editor.register(spellCheckPlugin); // core untouched, feature added"
    },
    {
      title: "Example 3: minimal core + plug-ins",
      description: "<p>A small stable core provides the base, and features are added as plug-ins through a defined extension contract.</p>",
      code: "// core knows nothing about specific features:\n" +
        "interface Plugin { name: string; activate(ctx: CoreApi): void; }\n" +
        "core.register(new MarkdownPlugin());\n" +
        "core.register(new GitPlugin());\n" +
        "// e.g. VS Code, Eclipse, browsers, Jenkins - tiny core, ecosystem of plugins.\n" +
        "// new capabilities ship WITHOUT touching the core."
    },
    {
      title: "Example 4 (edge case): the plug-in API is a hard contract; plugins can break the core",
      description: "<p>The extension interface must be stable and well-versioned, and untrusted/buggy plugins can crash or compromise the host.</p>",
      code: "// Change the plug-in API -> every plugin breaks -> treat it as a public contract\n" +
        "//   (semver, deprecation windows). Designing the right extension points is HARD.\n" +
        "// A buggy plugin can crash the host, or a malicious one can abuse core access ->\n" +
        "//   sandbox/limit plugin permissions, isolate failures.\n" +
        "// Overkill if you don't actually need third-party/dynamic extensibility."
    }
  ],
  whenToUse: "<p>Choose a microkernel when extensibility and customization are central requirements &mdash; " +
    "products meant to host third-party plug-ins, platforms whose features vary per customer, or systems that " +
    "must evolve features independently from a stable core (IDEs, CMSs, browsers, workflow engines). It lets " +
    "you and others add behavior without risking the core. <strong>Trade-offs:</strong> designing good, " +
    "stable extension points (the plug-in contract) is hard and the contract is expensive to change later; " +
    "plug-in interactions, versioning, and failure isolation add complexity; and debugging across the core/" +
    "plug-in boundary is trickier. If your system isn't genuinely meant to be extended by many modules or " +
    "outside parties, a simpler structure is better &mdash; don't build a plug-in framework for features you " +
    "could just write directly.</p>"
};

C["blackboard-pattern"] = {
  summary: "<p>The <strong>Blackboard</strong> pattern tackles problems with no clear deterministic solution " +
    "path by having multiple specialized modules (<strong>knowledge sources</strong>) collaborate through a " +
    "shared data structure (the <strong>blackboard</strong>). Each knowledge source watches the blackboard, " +
    "and when it can contribute, it reads the current partial solution and writes an improvement back. A " +
    "<strong>control</strong> component coordinates which source acts next. The solution emerges " +
    "incrementally from many partial contributions. It originated in AI for problems like speech and image " +
    "recognition, where diverse heuristics must combine.</p>",
  examples: [
    {
      title: "Example 1: Knowledge sources collaborating on a shared board",
      description: "<p>Independent experts each refine the partial solution on the blackboard.</p>",
      code: "const blackboard = { audio: rawSignal, phonemes: null, words: null, text: null };\n" +
        "\n" +
        "// Each knowledge source contributes when it has something to add\n" +
        "const sources = [\n" +
        "  bb => { if (bb.audio && !bb.phonemes) bb.phonemes = detectPhonemes(bb.audio); },\n" +
        "  bb => { if (bb.phonemes && !bb.words) bb.words = groupIntoWords(bb.phonemes); },\n" +
        "  bb => { if (bb.words && !bb.text)     bb.text  = assembleText(bb.words); },\n" +
        "];"
    },
    {
      title: "Example 2: A control loop driving progress",
      description: "<p>The controller repeatedly lets sources act until the solution is complete.</p>",
      code: "function solve(blackboard, sources) {\n" +
        "  while (!blackboard.text) {            // until a full solution emerges\n" +
        "    for (const contribute of sources) contribute(blackboard);\n" +
        "  }\n" +
        "  return blackboard.text;\n" +
        "}\n" +
        "// The answer is built up cooperatively, not by one linear algorithm."
    },
    {
      title: "Example 3: specialists collaborate via a shared knowledge space",
      description: "<p>Independent components ('knowledge sources') read and write partial results to a shared blackboard until a solution emerges.</p>",
      code: "// blackboard = shared evolving state; a control loop picks which expert runs next\n" +
        "// speech recognition: signal -> phoneme -> word -> phrase experts each contribute\n" +
        "//   partial hypotheses to the blackboard, refining until confident.\n" +
        "// used for AI/perception, sensor fusion, complex planning - no single algorithm\n" +
        "//   solves it, so many cooperate opportunistically."
    },
    {
      title: "Example 4 (edge case): rarely the right fit - and hard to control/debug",
      description: "<p>The shared mutable state and non-deterministic control make blackboard systems complex; most problems have better-structured solutions.</p>",
      code: "// Shared mutable blackboard + many writers -> concurrency + hard-to-reproduce runs\n" +
        "//   (the order experts fire is opportunistic, not fixed).\n" +
        "// Termination ('are we done?') and conflict resolution are genuinely tricky.\n" +
        "// Use ONLY for ill-structured problems with no deterministic algorithm. For\n" +
        "//   well-defined workflows, pipelines/state machines are far simpler and clearer."
    }
  ],
  whenToUse: "<p>The blackboard pattern fits genuinely hard, ill-structured problems where no single algorithm " +
    "produces the answer and you must combine many independent heuristics or specialists that incrementally " +
    "refine a shared partial solution &mdash; speech/handwriting/image recognition, sensor fusion, complex " +
    "diagnosis or planning systems. <strong>Reality check:</strong> this is a specialized, relatively rare " +
    "pattern. The shared mutable blackboard is exactly the kind of global shared state other principles warn " +
    "against, so it brings concurrency and coordination challenges, and reasoning about emergent behavior is " +
    "hard. For ordinary business software with a known solution path, simpler patterns (pipelines, services, " +
    "events) are far more appropriate. Reach for blackboard only when the problem truly has no deterministic " +
    "recipe.</p>"
};

C["serverless-architecture"] = {
  summary: "<p><strong>Serverless architecture</strong> builds applications from functions and managed " +
    "services where the cloud provider handles all server provisioning, scaling, and maintenance. The most " +
    "common form is <strong>Functions as a Service (FaaS)</strong> &mdash; small, stateless, event-triggered " +
    "functions (AWS Lambda, Azure Functions, Cloud Functions) that run on demand and scale automatically " +
    "from zero to many. You pay only for actual execution, not idle capacity. 'Serverless' doesn't mean no " +
    "servers &mdash; it means <em>you</em> don't manage them. It trades operational control for " +
    "convenience, automatic scaling, and a pay-per-use cost model.</p>",
  examples: [
    {
      title: "Example 1: An event-triggered function",
      description: "<p>A stateless function runs in response to an event; the platform handles everything else.</p>",
      code: "// AWS Lambda-style handler: no server setup, scales automatically\n" +
        "exports.handler = async (event) => {\n" +
        "  const order = JSON.parse(event.body);\n" +
        "  await saveOrder(order);              // do one focused job\n" +
        "  return { statusCode: 200, body: 'ok' };\n" +
        "};\n" +
        "// 1 request or 10,000 concurrent - the platform spins up instances for you."
    },
    {
      title: "Example 2: Composing managed services",
      description: "<p>Serverless apps glue functions to managed event sources and stores.</p>",
      code: "// A typical serverless flow, all fully managed:\n" +
        "//   [API Gateway] -> [Lambda: validate] -> [Queue]\n" +
        "//                                            -> [Lambda: process] -> [DynamoDB]\n" +
        "//   [S3 upload event] -> [Lambda: generate thumbnail]\n" +
        "// You write the functions; the provider runs and scales the rest."
    },
    {
      title: "Example 3: functions triggered by events, scale-to-zero",
      description: "<p>You deploy functions; the platform runs and scales them per-request and bills only for execution.</p>",
      code: "// no server to manage; triggered by an event\n" +
        "export async function handler(event) {     // e.g. AWS Lambda\n" +
        "  const img = await s3.get(event.key);\n" +
        "  return resize(img);\n" +
        "}\n" +
        "// triggers: HTTP, queue message, file upload, cron. Idle = $0 (scale to zero);\n" +
        "//   a burst spins up many instances automatically."
    },
    {
      title: "Example 4 (edge case): cold starts, statelessness, and limits",
      description: "<p>Serverless trades ops for constraints - cold-start latency, no in-memory state, execution time/size limits, and potential vendor lock-in.</p>",
      code: "// Cold start: an idle function pays startup latency on the next call -> bad for\n" +
        "//   latency-critical paths (mitigate with provisioned concurrency).\n" +
        "// Stateless: no in-memory state survives between invocations -> push state to a\n" +
        "//   DB/cache; connection pooling to a DB is awkward (use a proxy).\n" +
        "// Limits: max duration/memory/payload; long jobs don't fit. Steady high traffic\n" +
        "//   can also cost MORE than a always-on server. Great for spiky/event/glue work."
    }
  ],
  whenToUse: "<p>Serverless shines for event-driven and spiky workloads, glue/integration code, scheduled " +
    "jobs, webhooks, lightweight APIs, and rapid prototyping &mdash; anywhere automatic scaling and " +
    "pay-per-use beat running idle servers, and where you'd rather not manage infrastructure. " +
    "<strong>Trade-offs and gotchas:</strong> functions are <em>stateless</em> and short-lived (state must " +
    "live in external stores); <strong>cold starts</strong> add latency after idle periods; long-running or " +
    "compute-heavy tasks hit time/resource limits and can get expensive; local testing and debugging are " +
    "harder; and you risk <strong>vendor lock-in</strong> to a provider's ecosystem. For steady, " +
    "high-throughput, or latency-sensitive workloads, traditional always-on servers/containers are often " +
    "cheaper and simpler. Serverless is a powerful tool, not a default for everything.</p>"
};

C["soa"] = {
  summary: "<p><strong>Service-Oriented Architecture (SOA)</strong> structures an application as a set of " +
    "<strong>services</strong> &mdash; coarse-grained, reusable units of business functionality exposed " +
    "through well-defined contracts and consumed over a network, often coordinated via an " +
    "<strong>Enterprise Service Bus (ESB)</strong>. SOA emphasizes enterprise-wide reuse and integration: " +
    "shared services (e.g. 'CustomerService', 'BillingService') used across many applications. It's the " +
    "conceptual predecessor to microservices, but typically coarser-grained, more centralized (the ESB), and " +
    "focused on integrating large enterprise systems rather than fine-grained independent deployment.</p>",
  examples: [
    {
      title: "Example 1: Coarse-grained shared services",
      description: "<p>Business capabilities exposed as services reused across the enterprise.</p>",
      code: "// Enterprise-wide services with contracts, reused by many apps:\n" +
        "//   CustomerService.getCustomer(id)\n" +
        "//   BillingService.createInvoice(order)\n" +
        "//   ShippingService.schedule(shipment)\n" +
        "// The CRM, the web store, and the call-center app all consume the SAME services."
    },
    {
      title: "Example 2: SOA vs microservices in granularity",
      description: "<p>SOA tends toward broad services + a central bus; microservices toward small + decentralized.</p>",
      code: "// SOA: a few broad services, often via a central ESB that routes/transforms\n" +
        "//   [App] -> [ ESB ] -> [Big CustomerService] -> [Big BillingService]\n" +
        "\n" +
        "// Microservices: many small services, decentralized, own databases\n" +
        "//   [order-svc] -> [payment-svc]   [inventory-svc]   (no central bus)"
    },
    {
      title: "Example 3: coarse-grained, reusable enterprise services",
      description: "<p>SOA organizes business capabilities as shared services, often integrated via an enterprise service bus (ESB).</p>",
      code: "// reusable business services consumed by many apps:\n" +
        "//   CustomerService, BillingService, InventoryService\n" +
        "//   apps + partners call them via standardized contracts (historically SOAP/WSDL)\n" +
        "// often routed/transformed through an ESB that handles mediation + integration.\n" +
        "// goal: reuse + integrate many existing enterprise systems."
    },
    {
      title: "Example 4 (edge case): the ESB bottleneck; SOA vs microservices",
      description: "<p>A central ESB can become a complex, coupling chokepoint - a key reason microservices favor 'smart endpoints, dumb pipes'.</p>",
      code: "// Heavy ESB doing routing + transformation + orchestration -> a complex central\n" +
        "//   component everything depends on (deploy bottleneck, single team owns it).\n" +
        "// Microservices reacted to this: keep the pipes DUMB (just messaging/HTTP), put\n" +
        "//   logic in the services. Microservices are often called 'SOA done right' -\n" +
        "//   finer-grained, independently deployable, no central bus.\n" +
        "// SOA-style still fits big-enterprise integration of legacy systems."
    }
  ],
  whenToUse: "<p>SOA-style thinking fits large enterprises integrating many existing systems and wanting " +
    "reusable, contract-based business services shared across applications &mdash; the classic 'we have a " +
    "CRM, an ERP, a billing system, and a website that all need customer data' problem. " +
    "<strong>Perspective and trade-offs:</strong> the centralized ESB can become a complex, bottleneck-prone " +
    "'god component', and heavyweight SOA (with WS-* SOAP stacks) earned a reputation for over-engineering. " +
    "Most new systems today reach for microservices (decentralized, finer-grained) or a modular monolith " +
    "instead. Understand SOA as the lineage behind today's service architectures and as still-relevant for " +
    "enterprise integration, but be wary of its heavyweight, centralized incarnations unless the enterprise " +
    "integration need is real.</p>"
};

C["event-sourcing"] = {
  summary: "<p><strong>Event Sourcing</strong> stores the state of a system as an immutable, append-only " +
    "<strong>sequence of events</strong> describing everything that has happened, rather than just the " +
    "current state. Current state is derived by replaying the events. Instead of <code>UPDATE balance = " +
    "70</code>, you append <code>Deposited(100)</code> then <code>Withdrew(30)</code>, and compute the " +
    "balance from them. This gives a complete audit trail, the ability to reconstruct state at any past " +
    "point in time ('time travel'), and a natural fit with event-driven systems &mdash; at the cost of " +
    "significant added complexity. It pairs often with CQRS.</p>",
  examples: [
    {
      title: "Example 1: State as a fold over events",
      description: "<p>The current balance is computed by replaying the recorded events.</p>",
      code: "const events = [\n" +
        "  { type: 'Deposited', amount: 100 },\n" +
        "  { type: 'Withdrew',  amount: 30 },\n" +
        "  { type: 'Deposited', amount: 50 },\n" +
        "];\n" +
        "\n" +
        "// Derive current state by replaying history\n" +
        "const balance = events.reduce((bal, e) =>\n" +
        "  e.type === 'Deposited' ? bal + e.amount : bal - e.amount, 0); // 120"
    },
    {
      title: "Example 2: Audit trail and time travel for free",
      description: "<p>Because every change is an event, you can answer 'what was the state last Tuesday?'</p>",
      code: "// State at any point in time = replay events UP TO that moment\n" +
        "function balanceAsOf(events, date) {\n" +
        "  return events\n" +
        "    .filter(e => e.timestamp <= date)\n" +
        "    .reduce((bal, e) => e.type === 'Deposited' ? bal + e.amount : bal - e.amount, 0);\n" +
        "}\n" +
        "// You get a complete, immutable audit log as an inherent property."
    },
    {
      title: "Example 3: append events, derive state by replaying them",
      description: "<p>The event log is the source of truth; current state is computed by folding events.</p>",
      code: "// store WHAT HAPPENED (immutable, append-only):\n" +
        "//   AccountOpened, Deposited(100), Withdrew(30)\n" +
        "// current balance = reduce(events) = 70\n" +
        "// gains: full audit trail, time-travel ('state as of date X'), new read models\n" +
        "//   rebuilt by replaying history. Pairs naturally with CQRS."
    },
    {
      title: "Example 4 (edge case): schema evolution, GDPR, and replay cost",
      description: "<p>Immutable events make changing event shape, deleting data, and rebuilding state genuinely hard.</p>",
      code: "// Can't edit past events -> version event schemas + upcast old ones on read.\n" +
        "// 'Right to be forgotten' vs an immutable log -> crypto-shredding (delete the key)\n" +
        "//   or tombstones.\n" +
        "// Replaying millions of events is slow -> periodic SNAPSHOTS + replay only the tail.\n" +
        "// Big complexity jump - use only when history/audit IS the requirement, not for\n" +
        "//   ordinary CRUD."
    }
  ],
  whenToUse: "<p>Event sourcing is valuable when history itself is a first-class requirement: domains needing " +
    "a complete audit trail (finance, healthcare, compliance), where you must know not just the current " +
    "state but exactly how it was reached, where you want to replay/rebuild read models or debug by " +
    "reconstructing past states, or in event-driven systems where events are already the lingua franca. " +
    "<strong>Serious trade-offs:</strong> it's a major increase in complexity &mdash; you must version and " +
    "evolve event schemas forever (old events are immutable), handle eventual consistency, build projections " +
    "to query current state efficiently, and manage snapshots so replay stays fast. It's frequently " +
    "<em>over-applied</em>. For most CRUD applications, storing current state in a normal database is far " +
    "simpler and entirely sufficient. Adopt event sourcing only where the audit/history/replay benefits " +
    "clearly justify the cost, and usually only for the specific aggregates that need it &mdash; not the " +
    "whole system.</p>"
};

/* ======================================================================
   SECTION 8 — ENTERPRISE PATTERNS
   ====================================================================== */

C["enterprise-patterns"] = {
  summary: "<p><strong>Enterprise patterns</strong> are recurring solutions for the data-handling and " +
    "logic-organization problems common in business applications &mdash; cataloged most famously in Martin " +
    "Fowler's <em>Patterns of Enterprise Application Architecture (PoEAA)</em>. They cover how to organize " +
    "domain logic (Transaction Script, Domain Model, Table Module), how to map objects to databases (Data " +
    "Mapper, Active Record, Unit of Work, Identity Map), and how to structure presentation and concurrency. " +
    "They're the practical building blocks behind ORMs, service layers, and most enterprise application " +
    "frameworks.</p>",
  examples: [
    {
      title: "Example 1: Two ways to organize domain logic",
      description: "<p>The same feature via Transaction Script (procedural) vs Domain Model (OO).</p>",
      code: "// Transaction Script: one procedure per business transaction\n" +
        "function transferFunds(fromId, toId, amount) {\n" +
        "  const from = db.load(fromId), to = db.load(toId);\n" +
        "  if (from.balance < amount) throw new Error('insufficient');\n" +
        "  db.update(fromId, from.balance - amount);\n" +
        "  db.update(toId, to.balance + amount);\n" +
        "}\n" +
        "\n" +
        "// Domain Model: rules live in objects (see Domain Models)\n" +
        "from.withdraw(amount); to.deposit(amount);"
    },
    {
      title: "Example 2: Persistence patterns working together",
      description: "<p>Unit of Work + Identity Map + Data Mapper coordinate a clean save.</p>",
      code: "// Unit of Work tracks changes and commits them in one transaction;\n" +
        "// Identity Map ensures one object per record; Data Mapper does the SQL.\n" +
        "//   uow.registerDirty(order);   // track the change\n" +
        "//   uow.commit();               // one transaction, mapper writes the rows\n" +
        "// These PoEAA patterns are exactly what ORMs implement internally."
    },
    {
      title: "Example 3: the enterprise application patterns (Fowler's PoEAA)",
      description: "<p>A catalog of solutions for typical business apps: organizing domain logic, data access, and distribution.</p>",
      code: "// domain logic:   Transaction Script | Table Module | Domain Model\n" +
        "// data access:    Active Record | Data Mapper | Repository | Unit of Work\n" +
        "// presentation:   MVC | Page Controller | Front Controller\n" +
        "// distribution:   DTO | Remote Facade\n" +
        "// pick the organizing pattern by how COMPLEX the domain logic is."
    },
    {
      title: "Example 4 (edge case): match the pattern to the complexity",
      description: "<p>The big lever is domain-logic complexity: simple apps want Transaction Script/Active Record; rich domains want Domain Model + Data Mapper.</p>",
      code: "// Simple CRUD: Domain Model + Data Mapper + Repository = needless ceremony ->\n" +
        "//   Transaction Script or Active Record is faster and clearer.\n" +
        "// Rich rules: Transaction Script becomes a tangle of duplicated logic -> a\n" +
        "//   Domain Model pays off.\n" +
        "// Don't pick the 'fanciest' pattern; pick the one whose cost matches the domain.\n" +
        "//   Many of these also overlap with DDD building blocks."
    }
  ],
  whenToUse: "<p>These patterns are the toolbox for typical line-of-business applications &mdash; CRUD-heavy " +
    "systems, admin tools, back-office software &mdash; where the central challenges are organizing modest " +
    "business logic and moving data between objects and a database reliably. <strong>Key insight:</strong> " +
    "you mostly <em>consume</em> these patterns through frameworks and ORMs rather than hand-coding them, but " +
    "knowing them helps you understand what your tools do, choose the right approach (e.g. Transaction Script " +
    "vs Domain Model based on complexity), and debug ORM behavior. <strong>Don't over-apply:</strong> match " +
    "the pattern's weight to the problem &mdash; simple logic doesn't need a full domain model, and not " +
    "every app needs a hand-built unit of work.</p>"
};

C["transaction-script"] = {
  summary: "<p><strong>Transaction Script</strong> organizes business logic as a single procedure per " +
    "request/transaction: each script takes input, does its work step by step (validate, compute, read/write " +
    "the database), and returns a result. Logic is procedural and lives in functions/services, not in rich " +
    "domain objects. It's the simplest way to organize domain logic and maps naturally to 'one function per " +
    "user action.' For straightforward operations it's clear and direct; its weakness is duplication and " +
    "tangling as logic grows and scripts start to overlap.</p>",
  examples: [
    {
      title: "Example 1: One script per business action",
      description: "<p>A self-contained procedure handling the whole transaction top to bottom.</p>",
      code: "// Each business operation = one straightforward procedure\n" +
        "function registerUser(input) {\n" +
        "  if (!isValidEmail(input.email)) throw new ValidationError();\n" +
        "  if (db.userExists(input.email)) throw new ConflictError();\n" +
        "  const id = db.insertUser(input);\n" +
        "  emailService.sendWelcome(input.email);\n" +
        "  return id;\n" +
        "}\n" +
        "// Easy to read top-to-bottom for simple cases."
    },
    {
      title: "Example 2: Where it starts to hurt",
      description: "<p>As rules grow and recur, scripts duplicate logic that a domain model would centralize.</p>",
      code: "// The same discount rule copy-pasted across several scripts:\n" +
        "//   placeOrder():   if (customer.tier === 'gold') total *= 0.9;\n" +
        "//   previewOrder(): if (customer.tier === 'gold') total *= 0.9;\n" +
        "//   quoteOrder():   if (customer.tier === 'gold') total *= 0.9;\n" +
        "// Duplication drifts and bugs creep in -> a sign to move to a Domain Model."
    },
    {
      title: "Example 3: one procedure per business transaction",
      description: "<p>Each request is handled by a single straightforward procedure - get input, do the steps, save - no domain model.</p>",
      code: "function transferFunds(fromId, toId, amount) {\n" +
        "  const from = db.getAccount(fromId);\n" +
        "  const to   = db.getAccount(toId);\n" +
        "  if (from.balance < amount) throw new Error('insufficient');\n" +
        "  db.update(fromId, from.balance - amount);\n" +
        "  db.update(toId,   to.balance + amount);\n" +
        "}\n" +
        "// dead simple, easy to read for ONE operation."
    },
    {
      title: "Example 4 (edge case): duplication as logic grows",
      description: "<p>Transaction Script doesn't scale with complexity - shared rules get copy-pasted across scripts, drifting apart.</p>",
      code: "// the 'insufficient funds' + currency + fee rules reappear in transfer, withdraw,\n" +
        "//   payBill, refund ... -> duplicated logic that drifts when one copy changes.\n" +
        "// When you see this, it's the signal to refactor toward a Domain Model (put the\n" +
        "//   rules ON the Account). Transaction Script is RIGHT for genuinely simple, few-rule\n" +
        "//   operations; it's a trap when the domain is actually rich."
    }
  ],
  whenToUse: "<p>Transaction Script is the right, pragmatic choice for applications with <strong>simple " +
    "business logic</strong> &mdash; CRUD apps, straightforward workflows, small services, prototypes &mdash; " +
    "where a full domain model would be unnecessary ceremony. It's quick to write and easy for anyone to " +
    "follow. <strong>The trade-off (and migration signal):</strong> it scales poorly with <em>complexity</em>. " +
    "As business rules multiply, interact, and get reused, transaction scripts duplicate logic and grow " +
    "tangled. When you notice the same rules copied across scripts or procedures ballooning in size, that's " +
    "the cue to refactor toward a rich Domain Model. Pick based on the complexity of the <em>logic</em>, not " +
    "the size of the app.</p>"
};

C["message-queues-streams"] = {
  summary: "<p><strong>Message queues</strong> and <strong>streams</strong> are infrastructure for " +
    "asynchronous, decoupled communication. A <strong>queue</strong> (RabbitMQ, SQS) holds messages until a " +
    "consumer processes each one &mdash; typically each message goes to exactly one worker (point-to-point), " +
    "good for distributing tasks. A <strong>stream</strong> (Kafka, Kinesis) is an append-only, ordered, " +
    "<em>retained</em> log of events that many consumers can read independently and replay &mdash; good for " +
    "event distribution, analytics, and event sourcing. Both decouple producers from consumers in time and " +
    "scale, smoothing load and enabling resilient, event-driven systems.</p>",
  examples: [
    {
      title: "Example 1: A work queue distributing tasks",
      description: "<p>Each job is consumed once by one of several workers &mdash; load sharing.</p>",
      code: "// Producer drops tasks; the queue load-balances across workers\n" +
        "await queue.send('resize-image', { imageId: 88 });\n" +
        "\n" +
        "// Workers compete: each message handled by exactly ONE of them\n" +
        "queue.consume('resize-image', async msg => {\n" +
        "  await resize(msg.imageId);   // scale out by adding more workers\n" +
        "});"
    },
    {
      title: "Example 2: A stream replayed by independent consumers",
      description: "<p>A retained log lets multiple consumers read the same events at their own offsets.</p>",
      code: "// Stream = durable, ordered log; consumers track their own position\n" +
        "//   topic 'orders':  [e1][e2][e3][e4][e5]...\n" +
        "//     analytics  reads from offset 0  (full history)\n" +
        "//     fraud-svc  reads from offset 3  (recent only)\n" +
        "// A NEW consumer can replay from the beginning - events aren't deleted on read."
    },
    {
      title: "Example 3: queue (consume-once) vs stream (replayable log)",
      description: "<p>A queue distributes discrete jobs to one consumer each; a stream is a retained, replayable log many consumers read at their own offset.</p>",
      code: "// Queue (RabbitMQ/SQS): each message handled by ONE worker, then removed\n" +
        "//   -> task distribution, work smoothing.\n" +
        "// Stream (Kafka/Kinesis): messages RETAINED; each consumer group reads at its\n" +
        "//   own offset, can replay from any point\n" +
        "//   -> event log, multiple independent consumers, reprocessing/replay."
    },
    {
      title: "Example 4 (edge case): delivery, ordering, and retention",
      description: "<p>Both are at-least-once and order only within a partition; streams add retention/replay (and disk) considerations.</p>",
      code: "// at-least-once -> consumers must be idempotent (dedupe by id).\n" +
        "// order is per-partition/queue only -> partition by entity key to keep an\n" +
        "//   entity's events ordered.\n" +
        "// streams retain data for a window (size/time) -> set retention so late/replaying\n" +
        "//   consumers can still read, but disk doesn't grow forever. Pick queue for\n" +
        "//   'do this once', stream for 'many readers / replay history'."
    }
  ],
  whenToUse: "<p>Use a <strong>queue</strong> for distributing discrete work, smoothing bursts, and offloading " +
    "slow tasks (image processing, emails, report generation) so requests stay fast and you can scale " +
    "workers horizontally. Use a <strong>stream</strong> when events must be retained, ordered, replayable, " +
    "and consumed by multiple independent subscribers &mdash; event-driven microservices, analytics " +
    "pipelines, event sourcing, audit logs. <strong>Trade-offs:</strong> both add a broker as critical " +
    "infrastructure and shift you to asynchronous, eventually-consistent flows. You must design for " +
    "at-least-once delivery (make consumers <strong>idempotent</strong> to tolerate duplicates), handle " +
    "ordering and poison messages (dead-letter queues), and accept harder end-to-end tracing. For simple " +
    "synchronous request/response where the caller needs an immediate result, a direct call is simpler than " +
    "introducing a queue or stream.</p>"
};

C["commands-queries"] = {
  summary: "<p><strong>Commands and Queries</strong> applies Command-Query Separation at the architectural " +
    "level, culminating in <strong>CQRS (Command Query Responsibility Segregation)</strong>: separate the " +
    "model that <em>changes</em> state (commands &mdash; 'PlaceOrder', 'CancelSubscription') from the model " +
    "that <em>reads</em> state (queries &mdash; 'GetOrderSummary'). Commands enforce business rules and " +
    "produce changes; queries are optimized, often denormalized, read-only views. In full CQRS the write " +
    "side and read side can use different models and even different databases, letting each be optimized " +
    "independently &mdash; at the cost of added complexity and (often) eventual consistency between them.</p>",
  examples: [
    {
      title: "Example 1: Separating the write model from the read model",
      description: "<p>Commands go through rule-enforcing handlers; queries hit optimized read views.</p>",
      code: "// WRITE side: a command enforces invariants and changes state\n" +
        "class PlaceOrderCommandHandler {\n" +
        "  handle(cmd) {\n" +
        "    const order = new Order(cmd.items); // full domain rules\n" +
        "    order.validate();\n" +
        "    this.repo.save(order);\n" +
        "  }\n" +
        "}\n" +
        "\n" +
        "// READ side: a query reads a denormalized view, no domain logic\n" +
        "class OrderSummaryQuery {\n" +
        "  handle(id) { return this.readDb.getOrderSummaryView(id); } // fast, tailored\n" +
        "}"
    },
    {
      title: "Example 2: Why separate read/write can pay off",
      description: "<p>Reads and writes often have very different shapes and scaling needs.</p>",
      code: "// Writes: normalized, transactional, rule-heavy (correctness matters)\n" +
        "// Reads:  denormalized, cached, read-optimized (speed + many queries)\n" +
        "//\n" +
        "// CQRS lets each side use the model/storage that suits it, e.g.:\n" +
        "//   write -> Postgres (normalized)   read -> Elasticsearch (search-optimized)\n" +
        "// kept in sync via events (eventual consistency)."
    },
    {
      title: "Example 3: separate the write path from the read path",
      description: "<p>Even lightweight separation - distinct commands (change state) and queries (return data) - clarifies intent and enables independent optimization.</p>",
      code: "// Commands: validate + change state, return little/nothing\n" +
        "placeOrder(cmd);  cancelOrder(cmd);\n" +
        "// Queries: read-optimized, no side effects, can hit replicas/denormalized views\n" +
        "getOrderSummary(id);  searchOrders(filter);\n" +
        "// the two paths can use different models/stores (full CQRS) or just different\n" +
        "//   methods/services (lightweight)."
    },
    {
      title: "Example 4 (edge case): don't jump to full separate-store CQRS",
      description: "<p>Lightweight command/query separation is cheap and almost always good; separate read/write databases add eventual consistency you may not want.</p>",
      code: "// Lightweight (different methods/services): safe default, low cost.\n" +
        "// Full CQRS (separate write DB + read DB synced by events): the read side LAGS ->\n" +
        "//   a user may not immediately see their own write -> UX must handle it, plus you\n" +
        "//   operate two stores + a sync pipeline.\n" +
        "// Start lightweight; adopt separate stores only when read/write scaling genuinely\n" +
        "//   diverges."
    }
  ],
  whenToUse: "<p>Lightweight command/query separation (different methods/services for reads vs writes) is " +
    "broadly useful and low-cost &mdash; it clarifies intent and keeps read paths free of accidental side " +
    "effects. <strong>Full CQRS</strong> (separate models/stores) is justified only in specific situations: " +
    "very high read/write asymmetry, complex domains where the ideal write model differs sharply from read " +
    "needs, or systems already using event sourcing. <strong>Strong caution:</strong> full CQRS is " +
    "frequently over-applied. It typically introduces two models to maintain, synchronization machinery, and " +
    "eventual consistency (the read side lags the write side), which is a lot of complexity. For most CRUD " +
    "apps a single model serving both reads and writes is simpler and correct. Adopt the lightweight " +
    "separation freely; adopt full CQRS only when a concrete scaling or modeling pressure demands it.</p>"
};

C["orms"] = {
  summary: "<p>An <strong>ORM (Object-Relational Mapper)</strong> is a library that bridges the gap between " +
    "object-oriented code and relational databases, letting you work with objects/classes instead of writing " +
    "raw SQL by hand. It maps classes to tables, objects to rows, and references to foreign keys, and " +
    "typically bundles enterprise patterns under the hood &mdash; Data Mapper or Active Record, Unit of " +
    "Work, Identity Map, lazy loading. Examples: Hibernate/JPA (Java), Entity Framework (.NET), " +
    "Doctrine (PHP), SQLAlchemy (Python), Prisma/TypeORM (Node). ORMs boost productivity and portability but " +
    "add a layer of abstraction that can obscure (and sometimes harm) the actual database behavior.</p>",
  examples: [
    {
      title: "Example 1: Objects instead of SQL",
      description: "<p>The ORM translates object operations into SQL behind the scenes.</p>",
      code: "// Without an ORM: hand-written SQL + manual row mapping\n" +
        "// db.query('INSERT INTO users (name, email) VALUES (?, ?)', [n, e]);\n" +
        "\n" +
        "// With an ORM: work with objects; it generates the SQL\n" +
        "const user = new User({ name: 'Sam', email: 'sam@x.com' });\n" +
        "await userRepository.save(user);          // -> INSERT ...\n" +
        "const found = await userRepository.findById(user.id); // -> SELECT ..."
    },
    {
      title: "Example 2: The N+1 query gotcha",
      description: "<p>A classic ORM trap: lazy loading silently fires one query per item in a loop.</p>",
      code: "// Looks innocent, but each order.customer triggers a SEPARATE query:\n" +
        "const orders = await orderRepo.findAll();       // 1 query\n" +
        "for (const order of orders) {\n" +
        "  console.log(order.customer.name);             // N more queries! (N+1)\n" +
        "}\n" +
        "// Fix: eager-load / join up front\n" +
        "const orders2 = await orderRepo.findAll({ include: ['customer'] }); // 1 query"
    },
    {
      title: "Example 3: objects mapped to tables, queries in code",
      description: "<p>An ORM maps classes to tables and lets you query with objects instead of raw SQL, removing boilerplate.</p>",
      code: "// declarative mapping + object query, no hand-written SQL/result parsing:\n" +
        "const user = await userRepo.findOne({ where: { email } });\n" +
        "user.name = 'Sam';\n" +
        "await userRepo.save(user);   // ORM generates the UPDATE\n" +
        "// also handles relations, change tracking, migrations - big productivity win for CRUD."
    },
    {
      title: "Example 4 (edge case): N+1 queries and the leaky abstraction",
      description: "<p>ORMs hide SQL until performance bites - N+1 selects, surprise lazy loads, and inefficient generated queries.</p>",
      code: "// N+1: loop over orders, touch order.customer (lazy) -> 1 + N queries.\n" +
        "//   Fix: eager fetch / join: repo.find({ relations: ['customer'] }).\n" +
        "// The ORM 'lets you ignore SQL' until a slow page forces you to read the generated\n" +
        "//   queries anyway -> learn to log + inspect them.\n" +
        "// For complex reports/analytics, drop to raw SQL or a query builder; ORMs are for\n" +
        "//   CRUD, not every query."
    }
  ],
  whenToUse: "<p>Use an ORM for typical applications with lots of standard CRUD against a relational database " +
    "&mdash; it dramatically cuts boilerplate, provides safety (parameterized queries, migrations), and lets " +
    "you stay in your language's object model. It's the default for most business apps. <strong>Know the " +
    "trade-offs and gotchas:</strong> ORMs hide the database, which causes performance traps like the " +
    "<strong>N+1 query problem</strong>, inefficient generated SQL, and surprises around lazy loading, " +
    "transactions, and caching &mdash; you still need to understand SQL and inspect the queries your ORM " +
    "emits. For complex reporting, bulk operations, or highly-tuned queries, drop to raw SQL or a query " +
    "builder (most ORMs allow this). The pragmatic stance: use the ORM for the 80% of routine data access, " +
    "and reach for SQL for the performance-critical 20% &mdash; don't fight the ORM to express something SQL " +
    "does cleanly.</p>"
};
