// Content for the "system-design" roadmap.
// One entry per topic id (see data/system-design.js). Cross-listed cloud patterns
// share content via aliases at the bottom of this file.

window.CONTENT_DATA = window.CONTENT_DATA || {};
window.CONTENT_DATA["system-design"] = window.CONTENT_DATA["system-design"] || {};

var C = window.CONTENT_DATA["system-design"];

/* ======================================================================
   FUNDAMENTALS
   ====================================================================== */

C["introduction"] = {
  summary: "<p><strong>System design</strong> is the process of defining the architecture, components, " +
    "interfaces, and data flow of a system to satisfy a set of requirements &mdash; especially " +
    "<em>non-functional</em> ones like scalability, availability, reliability, performance, and cost. Unlike " +
    "coding a single feature, system design is about the big picture: how services, databases, caches, queues, " +
    "and load balancers fit together to serve millions of users without falling over. It's a core skill for " +
    "senior engineers and a staple of technical interviews. There's rarely one 'right' answer &mdash; design " +
    "is the art of making sensible trade-offs for your specific constraints.</p>",
  examples: [
    {
      title: "Example 1: A typical scalable web architecture",
      description: "<p>The classic building blocks and how requests flow through them.</p>",
      code: "Client\n" +
        "  -> DNS -> CDN (static assets)\n" +
        "  -> Load Balancer\n" +
        "       -> Web/App servers (stateless, horizontally scaled)\n" +
        "            -> Cache (Redis)        [read-heavy paths]\n" +
        "            -> Database (primary + read replicas)\n" +
        "            -> Message Queue -> Workers [async/background work]"
  },
    {
      title: "Example 2: Requirements drive the design",
      description: "<p>Numbers and constraints, not buzzwords, should shape the architecture.</p>",
      code: "// Clarify BEFORE designing:\n" +
        "// - Scale:        1M daily users? 100M? reads vs writes ratio?\n" +
        "// - Latency:      p99 < 200ms?\n" +
        "// - Consistency:  must reads be immediately correct (bank) or eventual (likes)?\n" +
        "// - Availability: 99.9% or 99.99%?\n" +
        "// The answers decide SQL vs NoSQL, sync vs async, caching, replication..."
    }
  ],
  whenToUse: "<p>You do system design whenever you build (or interview about) a system that must scale beyond a " +
    "single machine or serve real traffic reliably. The discipline matters because architectural decisions " +
    "are the most expensive to change later. <strong>Key mindset:</strong> start from requirements and scale " +
    "estimates, not technologies &mdash; pick the simplest design that meets the actual needs, and add " +
    "complexity (sharding, microservices, caching layers) only when justified by real constraints. " +
    "<strong>The recurring theme of this whole roadmap is trade-offs:</strong> consistency vs availability, " +
    "latency vs throughput, simplicity vs scalability. There's no universally correct architecture &mdash; " +
    "only the one that fits your requirements, team, and budget.</p>"
};

C["what-is-system-design"] = {
  summary: "<p><strong>System design</strong> answers 'how do we build a system that meets these requirements " +
    "at this scale?' It encompasses choosing the components (services, databases, caches, queues, gateways), " +
    "defining how they communicate, modeling the data, and planning for failure, growth, and operability. It " +
    "operates at a higher level than writing code &mdash; it's about structure and trade-offs. A good design " +
    "balances the system's <strong>quality attributes</strong>: scalability (handle more load), availability " +
    "(stay up), reliability (work correctly), performance (be fast), maintainability, and cost.</p>",
  examples: [
    {
      title: "Example 1: From requirement to component",
      description: "<p>Each requirement maps to architectural choices.</p>",
      code: "// 'Serve 10k requests/sec, mostly reads'\n" +
        "//   -> add read replicas + a cache layer\n" +
        "// 'Survive a server failure with no downtime'\n" +
        "//   -> multiple stateless app servers behind a load balancer + failover DB\n" +
        "// 'Process uploaded videos without blocking users'\n" +
        "//   -> message queue + background worker pool"
    },
    {
      title: "Example 2: Vertical vs horizontal scaling",
      description: "<p>Two fundamental ways to handle more load.</p>",
      code: "// Vertical (scale up): bigger machine (more CPU/RAM)\n" +
        "//   simple, but a hard ceiling + single point of failure\n" +
        "// Horizontal (scale out): more machines behind a load balancer\n" +
        "//   near-unlimited, fault-tolerant, but needs statelessness + coordination\n" +
        "// Modern large systems favor horizontal scaling."
    }
  ],
  whenToUse: "<p>Apply system design thinking when a system must handle significant scale, stay highly " +
    "available, or coordinate multiple components &mdash; essentially any real production backend. " +
    "<strong>Guiding principle:</strong> design for the requirements you actually have, not imagined future " +
    "scale; a well-structured monolith with a database and cache serves enormous traffic and is far simpler " +
    "than premature microservices. <strong>Gotcha:</strong> the most common mistake is over-engineering &mdash; " +
    "adding distributed components, sharding, and queues before the load justifies them, importing complexity " +
    "(network failures, consistency issues, operational burden) you don't need. Start simple, measure, and " +
    "scale the parts that actually become bottlenecks.</p>"
};

C["how-to-approach-system-design"] = {
  summary: "<p>A reliable way to <strong>approach a system design problem</strong> (especially in interviews) " +
    "is a structured process: (1) <strong>clarify requirements</strong> &mdash; functional features and " +
    "non-functional targets (scale, latency, consistency); (2) <strong>estimate</strong> &mdash; back-of-the-" +
    "envelope traffic, storage, and bandwidth; (3) define the <strong>API and data model</strong>; (4) sketch " +
    "a <strong>high-level design</strong> (boxes and arrows); (5) <strong>deep-dive</strong> into the hard " +
    "parts (the database, the bottleneck, the scaling strategy); and (6) <strong>address bottlenecks, " +
    "failures, and trade-offs</strong>. The goal is a clear, justified architecture, not a perfect one.</p>",
  examples: [
    {
      title: "Example 1: The estimation step",
      description: "<p>Rough numbers reveal where the hard problems are.</p>",
      code: "// 'Design a URL shortener' - estimate first:\n" +
        "// 100M new URLs/month -> ~40 writes/sec\n" +
        "// 10:1 read:write     -> ~400 reads/sec (cache-friendly!)\n" +
        "// 100M/mo * 5 yrs * ~500 bytes -> ~3 TB storage\n" +
        "// Conclusion: reads dominate -> heavy caching; modest write load."
    },
    {
      title: "Example 2: High-level then deep-dive",
      description: "<p>Start broad, then drill into the part that matters.</p>",
      code: "// High level:\n" +
        "//   Client -> LB -> App servers -> Cache -> DB\n" +
        "// Deep dive on the interesting decision:\n" +
        "//   How to generate short codes? base62 of an auto-increment id,\n" +
        "//   or a hash + collision check? Trade-offs: predictability, length,\n" +
        "//   coordination across servers (e.g. a key-generation service)."
    }
  ],
  whenToUse: "<p>Use this framework in system design interviews and when kicking off a real architecture. It " +
    "keeps you from jumping to a solution before understanding the problem, and it surfaces the trade-offs " +
    "interviewers (and stakeholders) care about. <strong>Tips and gotchas:</strong> always clarify scope " +
    "first &mdash; designing the wrong system perfectly scores nothing. Do the math early; estimates dictate " +
    "whether you need sharding, caching, or async processing. Don't try to cover everything &mdash; identify " +
    "the 1-2 genuinely hard parts and go deep there. Explicitly state trade-offs ('I'd choose eventual " +
    "consistency here to favor availability, accepting that...') &mdash; demonstrating reasoning matters more " +
    "than naming a specific technology.</p>"
};

C["performance-vs-scalability"] = {
  summary: "<p><strong>Performance</strong> and <strong>scalability</strong> are related but distinct. " +
    "<em>Performance</em> is how fast the system handles a <strong>single</strong> unit of work (latency for " +
    "one request). <em>Scalability</em> is the system's ability to maintain performance as the " +
    "<strong>load grows</strong> (more users, more data). A rule of thumb: if you have a performance problem, " +
    "your system is slow for a single user; if you have a scalability problem, it's fast for one user but " +
    "slow (or failing) under many. A well-scaling system keeps per-request performance roughly constant as " +
    "you add resources proportional to load.</p>",
  examples: [
    {
      title: "Example 1: Distinguishing the two problems",
      description: "<p>The symptom tells you which one you have.</p>",
      code: "// Performance problem:\n" +
        "//   1 user, 1 request -> 5 seconds. Slow regardless of load.\n" +
        "//   Fix: optimize the query/algorithm, add an index, cache the result.\n" +
        "\n" +
        "// Scalability problem:\n" +
        "//   1 user -> 50ms (great), but 10,000 users -> 8s or errors.\n" +
        "//   Fix: scale out (more servers), shard the DB, add caching/queues."
    },
    {
      title: "Example 2: Scaling keeps performance flat under load",
      description: "<p>Adding capacity should preserve per-request latency.</p>",
      code: "// Scales well:    load x10 + servers x10 -> latency stays ~50ms\n" +
        "// Scales poorly:   load x10 (same servers)  -> latency 50ms -> 5s\n" +
        "// Worse: a shared bottleneck (one DB) means adding app servers\n" +
        "//        doesn't help - you must scale the bottleneck itself."
    }
  ],
  whenToUse: "<p>Diagnose which problem you actually have before optimizing &mdash; they need different fixes. " +
    "Improve <strong>performance</strong> with better algorithms, indexing, caching, and reducing work per " +
    "request. Improve <strong>scalability</strong> with horizontal scaling, statelessness, partitioning/" +
    "sharding, and removing shared bottlenecks. <strong>Gotchas:</strong> they can trade off &mdash; a " +
    "design that's fastest for one user (e.g. everything in one process) may scale worst, while a distributed " +
    "design adds per-request latency (network hops) but scales far better. Don't optimize scalability you " +
    "don't need (premature distribution), and don't ignore performance hoping more servers will mask it &mdash; " +
    "throwing hardware at an inefficient query is expensive and often doesn't help if there's a shared " +
    "bottleneck.</p>"
};

C["latency-vs-throughput"] = {
  summary: "<p><strong>Latency</strong> is the time to complete a single operation (e.g. 50ms per request). " +
    "<strong>Throughput</strong> is the number of operations completed per unit time (e.g. 10,000 requests/" +
    "sec). They're related but not the same: a system can have low latency but low throughput, or high " +
    "throughput with higher latency (via batching/parallelism). Generally you want the <em>lowest latency " +
    "achievable at an acceptable throughput</em>. Improving one can hurt the other &mdash; batching raises " +
    "throughput but adds latency; parallelism raises throughput while keeping per-item latency low if " +
    "resources allow.</p>",
  examples: [
    {
      title: "Example 1: The factory analogy",
      description: "<p>Latency = time for one item; throughput = items per hour.</p>",
      code: "// Latency:    one car takes 8 hours to build\n" +
        "// Throughput: the factory finishes 100 cars/hour (many in parallel)\n" +
        "// High throughput does NOT require low latency - assembly lines\n" +
        "// pipeline many slow items to maximize completed-per-hour."
    },
    {
      title: "Example 2: Batching trades latency for throughput",
      description: "<p>Grouping work increases throughput but delays individual items.</p>",
      code: "// No batching: write each event immediately\n" +
        "//   low latency per event, lower total throughput (per-call overhead)\n" +
        "// Batching: buffer 1000 events, write together every 100ms\n" +
        "//   much higher throughput, but each event waits up to 100ms (more latency)\n" +
        "// Choose based on whether speed-per-item or total-volume matters more."
    }
  ],
  whenToUse: "<p>Optimize for <strong>latency</strong> when user-perceived speed matters most (interactive " +
    "apps, search, trading, page loads) and for <strong>throughput</strong> when processing volume matters " +
    "(batch jobs, analytics pipelines, log ingestion, ETL). Many systems need both, measured at percentiles " +
    "(p50/p99 latency) plus sustained requests/sec. <strong>Gotchas:</strong> measure latency at " +
    "<em>percentiles</em>, not averages &mdash; a low mean can hide a terrible p99 (the slowest 1% of users). " +
    "Techniques that boost throughput (batching, queuing) often add latency, so know which you're trading. " +
    "And throughput is capped by your tightest bottleneck (Little's Law / the slowest stage), so adding " +
    "capacity elsewhere won't help until you relieve it.</p>"
};

C["availability-vs-consistency"] = {
  summary: "<p>In distributed systems, <strong>availability</strong> (every request gets a response) and " +
    "<strong>consistency</strong> (every read sees the latest write) are in fundamental tension whenever the " +
    "network can fail &mdash; the heart of the <strong>CAP theorem</strong>. When a network partition splits " +
    "your nodes, you must choose: keep serving requests but risk returning stale/conflicting data (favor " +
    "availability, 'AP'), or refuse requests until consistency is restored (favor consistency, 'CP'). There's " +
    "no free lunch &mdash; this choice shapes the database and design you pick, and it should be driven by " +
    "what your domain actually requires.</p>",
  examples: [
    {
      title: "Example 1: The choice during a partition",
      description: "<p>When nodes can't talk, pick correctness or uptime.</p>",
      code: "// Network split between data centers. A write arrives on one side.\n" +
        "// CP choice: reject the write/read until nodes reconcile\n" +
        "//   -> always correct, but temporarily UNAVAILABLE\n" +
        "// AP choice: accept it locally, reconcile later\n" +
        "//   -> always AVAILABLE, but temporarily INCONSISTENT (stale reads)"
    },
    {
      title: "Example 2: Domain decides",
      description: "<p>Different data tolerates different trade-offs.</p>",
      code: "// Bank account balance     -> consistency (CP). Never show wrong money.\n" +
        "// Social media 'like' count -> availability (AP). Stale count is fine.\n" +
        "// Shopping cart             -> often AP with conflict resolution (merge carts).\n" +
        "// Match the trade-off to the cost of being wrong vs being down."
    }
  ],
  whenToUse: "<p>Make this trade-off consciously for every piece of data in a distributed system. Favor " +
    "<strong>consistency</strong> where incorrect data is costly or dangerous (money, inventory, " +
    "authorization). Favor <strong>availability</strong> where staleness is tolerable and downtime is worse " +
    "(feeds, counters, recommendations, content). <strong>Gotchas:</strong> CAP only forces the choice " +
    "<em>during a partition</em> &mdash; when the network is healthy you can have both, so don't over-index " +
    "on the worst case for every component. Also, 'consistency' has levels (strong, eventual, causal) and " +
    "real systems mix them per-feature rather than picking one globally. The modern refinement (PACELC) adds " +
    "that even without partitions you trade latency for consistency. Choose per data type based on the cost " +
    "of being wrong.</p>"
};

C["cap-theorem"] = {
  summary: "<p>The <strong>CAP theorem</strong> states that a distributed data store can provide at most two " +
    "of three guarantees simultaneously: <strong>Consistency</strong> (every read returns the most recent " +
    "write), <strong>Availability</strong> (every request gets a non-error response), and <strong>Partition " +
    "tolerance</strong> (the system keeps working despite network failures between nodes). Since network " +
    "partitions are unavoidable in real distributed systems, partition tolerance is mandatory &mdash; so the " +
    "real choice is between <strong>CP</strong> (consistent but may reject requests during a partition) and " +
    "<strong>AP</strong> (available but may return stale data during a partition).</p>",
  examples: [
    {
      title: "Example 1: CP vs AP databases",
      description: "<p>Real systems lean one way; the partition forces the choice.</p>",
      code: "// CP systems (consistency over availability during partitions):\n" +
        "//   e.g. traditional RDBMS clusters, HBase, MongoDB (default), ZooKeeper\n" +
        "// AP systems (availability over consistency during partitions):\n" +
        "//   e.g. Cassandra, DynamoDB, Riak, CouchDB\n" +
        "// 'CA' (no partition tolerance) isn't realistic for distributed stores."
    },
    {
      title: "Example 2: What the choice looks like",
      description: "<p>A partition splits the cluster; behavior differs.</p>",
      code: "//        [Node A] --X network split X-- [Node B]\n" +
        "// CP: Node B can't confirm it has the latest data -> returns an ERROR\n" +
        "//     (refuses to serve possibly-stale reads/writes)\n" +
        "// AP: Node B answers from its local copy -> may be STALE,\n" +
        "//     reconciles with A when the partition heals (eventual consistency)"
    }
  ],
  whenToUse: "<p>Use CAP as a lens when choosing a distributed database or designing a multi-node data layer: " +
    "decide whether each dataset needs CP (correctness during partitions) or AP (uptime during partitions). " +
    "<strong>Gotchas and nuance:</strong> CAP is often oversimplified &mdash; it's specifically about " +
    "behavior <em>during a network partition</em>, not a permanent 'pick two' for all time; healthy networks " +
    "give you C and A together. 'Consistency' in CAP means linearizability (strong), which is stricter than " +
    "the everyday sense. Real databases offer tunable consistency (e.g. quorum reads/writes) and many systems " +
    "mix CP and AP per feature. The more practical model is <strong>PACELC</strong>: if Partitioned, choose A " +
    "or C; Else (normal operation) choose Latency or Consistency &mdash; capturing the everyday latency cost " +
    "of strong consistency.</p>"
};

C["consistency-patterns"] = {
  summary: "<p><strong>Consistency patterns</strong> describe the guarantees a system makes about when writes " +
    "become visible to reads, on a spectrum from loosest to strictest: <strong>weak consistency</strong> " +
    "(reads may or may not see a recent write &mdash; no guarantee), <strong>eventual consistency</strong> " +
    "(reads will see the write eventually, after some delay, if no new writes happen), and <strong>strong " +
    "consistency</strong> (reads always see the most recent write, immediately). Stronger consistency is " +
    "easier to reason about but costs latency and availability; weaker consistency scales better and stays " +
    "available but pushes complexity (conflict handling, stale reads) onto the application.</p>",
  examples: [
    {
      title: "Example 1: The consistency spectrum",
      description: "<p>A write happens; when can a read see it?</p>",
      code: "// Write X = 5 at time T:\n" +
        "// Weak:     a read at T+1ms might see 5, might see the old value, no promise\n" +
        "// Eventual: reads converge to 5 after a short delay (e.g. replicas catch up)\n" +
        "// Strong:   every read after T is guaranteed to see 5 immediately"
    },
    {
      title: "Example 2: Matching pattern to use case",
      description: "<p>Pick the weakest consistency the feature can tolerate.</p>",
      code: "// Weak:     live video/voice (a lost frame is irrelevant; latest matters)\n" +
        "// Eventual: DNS, social feeds, view counts, S3 (scales, stays available)\n" +
        "// Strong:   bank transfers, inventory decrements, unique-username checks"
    }
  ],
  whenToUse: "<p>Choose a consistency model per dataset based on how much staleness the feature can tolerate " +
    "versus how much latency/availability you're willing to spend. Default to the <em>weakest</em> model the " +
    "use case allows, because stronger consistency is more expensive (coordination, latency, reduced " +
    "availability). <strong>Gotchas:</strong> eventual consistency means your application must handle stale " +
    "reads and possible conflicts gracefully (e.g. 'your comment may take a moment to appear') &mdash; bolting " +
    "it onto code that assumes immediate consistency causes subtle bugs. Strong consistency across many nodes " +
    "or regions is costly and can reduce availability (CAP). Many systems mix models: strong for the critical " +
    "path (payment), eventual for the rest (analytics, feeds). The sub-topics detail each level.</p>"
};

C["weak-consistency"] = {
  summary: "<p><strong>Weak consistency</strong> offers <em>no guarantee</em> that a read after a write will " +
    "see that write &mdash; the system makes a best effort, and reads may return stale or missing data with " +
    "no promise of when (or whether) they'll catch up. It's the loosest model, chosen when absolute freshness " +
    "doesn't matter and the priority is speed, availability, and low overhead. It's typical of real-time " +
    "systems where the <em>latest</em> data matters far more than every past update, and missing an old " +
    "update is harmless.</p>",
  examples: [
    {
      title: "Example 1: Real-time media",
      description: "<p>For live streams, stale or lost data is simply skipped.</p>",
      code: "// Video call / live game state over UDP:\n" +
        "// If a packet (frame/position update) is lost or arrives late,\n" +
        "// the system does NOT wait or retry - it shows the NEXT update.\n" +
        "// Consistency is sacrificed for real-time latency; old data is useless."
    },
    {
      title: "Example 2: Best-effort caches/counters",
      description: "<p>Approximate values where exactness isn't needed.</p>",
      code: "// A 'currently online users' counter updated best-effort:\n" +
        "// reads may be slightly off, occasionally missing increments.\n" +
        "// That's acceptable - nobody needs an exact live count, and the\n" +
        "// looseness keeps it cheap and fast at huge scale."
    }
  ],
  whenToUse: "<p>Use weak consistency for real-time, high-volume data where only the most recent value matters " +
    "and missing past updates is harmless &mdash; live video/voice, multiplayer game state, real-time " +
    "telemetry, approximate counters, and best-effort caches. It maximizes speed and availability with " +
    "minimal coordination. <strong>Gotchas:</strong> it's the wrong choice for anything where missing or " +
    "stale data causes incorrect behavior (money, orders, permissions) &mdash; there's no recovery guarantee. " +
    "Be explicit that the data is approximate so consumers don't build logic assuming correctness. In " +
    "practice, pure weak consistency is niche; most 'eventually correct' systems want <em>eventual</em> " +
    "consistency (which at least guarantees convergence) rather than truly weak (which guarantees nothing).</p>"
};

C["eventual-consistency"] = {
  summary: "<p><strong>Eventual consistency</strong> guarantees that if no new writes occur, all replicas will " +
    "<em>eventually</em> converge to the same value and reads will return the latest write &mdash; but there's " +
    "a window during which reads may be stale. It's the workhorse model of large-scale distributed systems " +
    "because it allows high availability and low latency (writes go to one replica and propagate " +
    "asynchronously) while still promising convergence. The trade-off is that the application must tolerate " +
    "temporary staleness and, sometimes, resolve conflicting concurrent writes.</p>",
  examples: [
    {
      title: "Example 1: Asynchronous replication",
      description: "<p>A write propagates in the background; reads briefly lag.</p>",
      code: "// Write 'X=5' to the primary at T:\n" +
        "//   primary -> async replicate -> replica1, replica2 (arrives at T+50ms)\n" +
        "// A read hitting replica2 at T+10ms may still see the OLD value,\n" +
        "// but by T+100ms all replicas show 5. Reads have 'caught up'."
    },
    {
      title: "Example 2: Familiar eventually-consistent systems",
      description: "<p>You already rely on these every day.</p>",
      code: "// DNS:          a record change propagates over minutes/hours\n" +
        "// Social feeds: your post may take a moment to appear for others\n" +
        "// DynamoDB/Cassandra: tunable, often eventual reads by default\n" +
        "// 'Read-your-own-writes' is often added so YOU at least see your update."
    }
  ],
  whenToUse: "<p>Use eventual consistency for the large class of data where brief staleness is acceptable and " +
    "availability/scale matter &mdash; social feeds, view/like counts, product catalogs, search indexes, DNS, " +
    "and most cross-region replication. It's how systems stay fast and available at massive scale. " +
    "<strong>Gotchas:</strong> the application must be designed for it &mdash; show 'pending' states, avoid " +
    "read-after-write assumptions (or add a 'read-your-own-writes' guarantee so a user sees their own action " +
    "immediately), and handle conflicting concurrent updates (last-write-wins, version vectors, or CRDTs). " +
    "Don't use it where correctness is immediate-critical (account balances, inventory at checkout). The " +
    "subtle bugs come from code that <em>assumes</em> strong consistency running on an eventually-consistent " +
    "store.</p>"
};

C["strong-consistency"] = {
  summary: "<p><strong>Strong consistency</strong> guarantees that every read reflects the most recent " +
    "committed write &mdash; once a write succeeds, all subsequent reads (from anywhere) see it immediately. " +
    "It makes the system behave as if there's a single, up-to-date copy of the data, which is the easiest " +
    "model to reason about. Achieving it across distributed nodes requires coordination (synchronous " +
    "replication, consensus protocols like Paxos/Raft, distributed transactions, or quorum reads/writes), " +
    "which costs latency and can reduce availability during partitions (CP in CAP terms).</p>",
  examples: [
    {
      title: "Example 1: Synchronous replication / quorum",
      description: "<p>A write isn't 'done' until enough replicas confirm it.</p>",
      code: "// Strong consistency via synchronous commit:\n" +
        "//   write -> primary writes AND waits for replicas to ack -> THEN success\n" +
        "// Or quorum (e.g. Dynamo-style with strong settings):\n" +
        "//   write to W replicas, read from R replicas, with R + W > N\n" +
        "//   guarantees a read overlaps the latest write."
    },
    {
      title: "Example 2: Where it's non-negotiable",
      description: "<p>Money and uniqueness can't tolerate stale reads.</p>",
      code: "// Bank transfer: after debiting account A, a balance read MUST\n" +
        "//   reflect it - showing the old (higher) balance could allow overdraft.\n" +
        "// Unique username: two simultaneous signups must not both 'succeed'.\n" +
        "// These need strong consistency (often a transaction + unique constraint)."
    }
  ],
  whenToUse: "<p>Use strong consistency where correctness is immediate and critical &mdash; financial " +
    "transactions, inventory/stock decrements, uniqueness constraints, authorization decisions, anything " +
    "where a stale read causes a real error. It's the default for traditional RDBMS single-node operation and " +
    "available (with care) in distributed systems via consensus/quorums. <strong>Trade-offs and gotchas:</strong> " +
    "it costs latency (coordination/round-trips) and, per CAP, can sacrifice availability during partitions " +
    "&mdash; and that latency cost applies even in normal operation (PACELC). It's expensive to scale " +
    "globally, so apply it only to the data that truly needs it rather than blanket-applying it system-wide. " +
    "A common, pragmatic design is strong consistency on the critical write path and eventual consistency " +
    "everywhere else.</p>"
};

C["availability-patterns"] = {
  summary: "<p><strong>Availability patterns</strong> are techniques to keep a system serving requests despite " +
    "failures. The two foundational approaches are <strong>fail-over</strong> (have standby components ready " +
    "to take over when an active one dies) and <strong>replication</strong> (keep multiple copies of data/" +
    "services so there's no single point of failure). Availability is usually expressed in 'nines' (99.9%, " +
    "99.99%) of uptime. Higher availability requires eliminating single points of failure through redundancy, " +
    "which adds cost and complexity &mdash; so you target the level your business actually needs.</p>",
  examples: [
    {
      title: "Example 1: Redundancy removes single points of failure",
      description: "<p>Every critical component should have a backup.</p>",
      code: "// Single point of failure (bad): one DB, one LB, one server\n" +
        "//   any one dies -> total outage\n" +
        "// Redundant (good):\n" +
        "//   2+ load balancers, N app servers, primary + replica DB w/ failover\n" +
        "//   any single component can die without taking the system down"
    },
    {
      title: "Example 2: Availability in series vs parallel",
      description: "<p>Redundancy (parallel) raises availability; chains (series) lower it.</p>",
      code: "// In SERIES (request must pass through all): availabilities multiply\n" +
        "//   99.9% * 99.9% * 99.9% = ~99.7% (worse than any single component)\n" +
        "// In PARALLEL (redundant copies): unavailability multiplies\n" +
        "//   1 - (0.1% * 0.1%) = 99.9999% (far better)"
    }
  ],
  whenToUse: "<p>Apply availability patterns to any system where downtime is costly &mdash; revenue-generating " +
    "services, critical infrastructure, anything with an SLA. Use replication and fail-over to remove single " +
    "points of failure, and add redundancy proportional to your target nines. <strong>Gotchas:</strong> each " +
    "additional nine is exponentially more expensive (99.9% &rarr; 99.99% means cutting downtime from ~8.7 " +
    "hours/year to ~52 minutes/year), so don't over-target. Availability composes: components in series " +
    "<em>reduce</em> overall availability (more dependencies = more ways to fail), so minimize critical-path " +
    "dependencies and add parallel redundancy where it counts. Also, redundancy only helps if failover " +
    "actually works &mdash; untested failover is a false sense of security; test it regularly (chaos " +
    "engineering). The sub-topics cover fail-over, replication, and the numbers.</p>"
};

C["fail-over"] = {
  summary: "<p><strong>Fail-over</strong> is the process of automatically switching to a redundant standby " +
    "component when the active one fails, keeping the system available. The two main styles are " +
    "<strong>active-passive</strong> (a standby sits idle, monitoring via heartbeats, and takes over when " +
    "the active dies &mdash; there's a brief switchover delay) and <strong>active-active</strong> (multiple " +
    "nodes serve traffic simultaneously, so if one dies the others already absorb the load with no " +
    "switchover). Fail-over is essential to high availability but introduces complexity around detecting " +
    "failure, promoting the standby, and avoiding data loss or split-brain.</p>",
  examples: [
    {
      title: "Example 1: Active-passive vs active-active",
      description: "<p>Idle standby vs all-nodes-serving.</p>",
      code: "// ACTIVE-PASSIVE: \n" +
        "//   [Active] <-- heartbeat --> [Passive standby (idle)]\n" +
        "//   Active dies -> passive detects missing heartbeat -> promotes itself\n" +
        "//   (brief downtime during switchover; standby capacity wasted while idle)\n" +
        "\n" +
        "// ACTIVE-ACTIVE:\n" +
        "//   [Node1] [Node2] both serve traffic behind a load balancer\n" +
        "//   Node1 dies -> LB routes all to Node2 (no switchover, but each node\n" +
        "//   must handle the full load alone during failure)"
    },
    {
      title: "Example 2: The split-brain risk",
      description: "<p>A partition can make two nodes both think they're primary.</p>",
      code: "// Danger: network split -> passive can't see active -> promotes itself\n" +
        "//   while the active is actually still alive = TWO primaries (split-brain),\n" +
        "//   both accepting writes -> data divergence/corruption.\n" +
        "// Mitigation: quorum/witness node, fencing, or a consensus system\n" +
        "//   (Raft/ZooKeeper) to agree on exactly one leader."
    }
  ],
  whenToUse: "<p>Use fail-over for any component whose failure would cause an outage &mdash; databases, load " +
    "balancers, critical services. Choose <strong>active-active</strong> when you want zero switchover delay " +
    "and to use all capacity (but each node must handle surge load on failure), and <strong>active-passive</strong> " +
    "when simpler is fine and brief downtime during promotion is acceptable. <strong>Gotchas:</strong> the " +
    "hard parts are reliable failure detection (false positives cause needless failovers) and avoiding " +
    "<strong>split-brain</strong> (two nodes both acting as primary during a partition, corrupting data) &mdash; " +
    "solve it with quorums/fencing/consensus, never naive heartbeats alone. Failover can also lose " +
    "in-flight/unreplicated data if replication is asynchronous. And untested failover often doesn't work " +
    "when you need it &mdash; rehearse it.</p>"
};

C["replication"] = {
  summary: "<p><strong>Replication</strong> keeps multiple copies of data across nodes to improve " +
    "availability, durability, and read scalability. The common models are <strong>primary-replica</strong> " +
    "(aka master-slave: one node takes writes and replicates to read-only replicas) and " +
    "<strong>primary-primary</strong> (aka master-master: multiple nodes accept writes and replicate to each " +
    "other). Replication lets reads scale out across replicas, provides a hot standby for failover, and " +
    "guards against data loss &mdash; but it introduces replication lag (replicas trail the primary) and, in " +
    "multi-primary setups, write-conflict resolution.</p>",
  examples: [
    {
      title: "Example 1: Primary-replica (read scaling + failover)",
      description: "<p>One writer, many readers; promote a replica on failure.</p>",
      code: "//          writes\n" +
        "//   App ----------> [Primary] --replicate--> [Replica 1] (reads)\n" +
        "//   App <---reads--           \\-----------> [Replica 2] (reads)\n" +
        "// Scales READS by adding replicas; if primary dies, promote a replica.\n" +
        "// Gotcha: replicas lag -> a read right after a write may be stale."
    },
    {
      title: "Example 2: Primary-primary (write availability)",
      description: "<p>Multiple writers; must resolve conflicts.</p>",
      code: "//   [Primary A] <--replicate--> [Primary B]   (both accept writes)\n" +
        "// Pros: write availability even if one is down; geo-distributed writes\n" +
        "// Cons: concurrent writes to the same row on A and B CONFLICT\n" +
        "//   -> need conflict resolution (last-write-wins, version vectors, app logic)"
    }
  ],
  whenToUse: "<p>Use replication to scale reads (add replicas), survive node failures (promote a replica), and " +
    "place data near users (geo-replicas). <strong>Primary-replica</strong> fits the common read-heavy case " +
    "and is simpler; <strong>primary-primary</strong> adds write availability and multi-region writes at the " +
    "cost of conflict handling. <strong>Gotchas:</strong> asynchronous replication causes <em>replication " +
    "lag</em> &mdash; a read from a replica right after a write may be stale (eventual consistency), so route " +
    "read-after-write to the primary or add 'read-your-writes'. Synchronous replication avoids lag but adds " +
    "write latency and can reduce availability. Multi-primary write conflicts are genuinely hard &mdash; avoid " +
    "it unless you need it and have a clear conflict-resolution strategy. Replication aids availability and " +
    "read scale, but it is <em>not</em> a backup (it faithfully replicates bad writes/deletes too).</p>"
};

C["availability-in-numbers"] = {
  summary: "<p><strong>Availability in numbers</strong> expresses uptime as a percentage &mdash; the famous " +
    "'nines'. <strong>99.9%</strong> ('three nines') allows ~8.7 hours of downtime per year; " +
    "<strong>99.99%</strong> ('four nines') ~52 minutes/year; <strong>99.999%</strong> ('five nines') ~5 " +
    "minutes/year. Each extra nine reduces allowed downtime ~10x and costs disproportionately more to " +
    "achieve. Availability also <em>composes</em>: components in series multiply (lowering total " +
    "availability), while redundant components in parallel multiply their <em>un</em>availability (raising " +
    "total). Knowing the math helps you set realistic SLAs and design redundancy where it pays off.</p>",
  examples: [
    {
      title: "Example 1: The nines and their downtime budgets",
      description: "<p>Each nine is roughly a 10x reduction in allowed downtime.</p>",
      code: "// 99%     (two nines)   -> ~3.65 days/year downtime\n" +
        "// 99.9%   (three nines) -> ~8.77 hours/year\n" +
        "// 99.99%  (four nines)  -> ~52.6 minutes/year\n" +
        "// 99.999% (five nines)  -> ~5.26 minutes/year\n" +
        "// Each extra nine = ~10x less downtime, but much higher cost/complexity."
    },
    {
      title: "Example 2: Series vs parallel composition",
      description: "<p>Dependencies lower availability; redundancy raises it.</p>",
      code: "// SERIES (all must work):   A * B\n" +
        "//   99.9% * 99.9% = 99.8001%  (worse than either alone)\n" +
        "// PARALLEL (either works):   1 - (1-A)(1-B)\n" +
        "//   1 - (0.001 * 0.001) = 99.9999%  (much better)\n" +
        "// Lesson: minimize serial dependencies; add parallel redundancy."
    }
  ],
  whenToUse: "<p>Use availability math to set realistic SLAs/SLOs and to decide where redundancy is worth it. " +
    "Target the level the business genuinely needs &mdash; for many products three nines is plenty; five " +
    "nines is extremely expensive and only justified for critical infrastructure. <strong>Gotchas:</strong> " +
    "every serial dependency drags your total availability <em>below</em> its weakest link, so a service that " +
    "calls five 99.9% dependencies in series can't itself hit 99.9% &mdash; reduce hard dependencies, add " +
    "fallbacks/caching, and parallelize. Promising more nines than your dependencies (and your operational " +
    "maturity) can deliver sets you up to miss SLAs. Also, measured availability must account for " +
    "<em>partial</em> failures and slow responses, not just hard down/up. The numbers guide design; the real " +
    "work is removing single points of failure.</p>"
};

/* ======================================================================
   BACKGROUND JOBS / DNS / CDN / LOAD BALANCERS / APPLICATION LAYER
   ====================================================================== */

C["background-jobs"] = {
  summary: "<p><strong>Background jobs</strong> are tasks executed outside the main request/response cycle &mdash; " +
    "work that's slow, resource-intensive, or doesn't need to block the user (sending emails, processing " +
    "uploads, generating reports, running ML inference). Instead of making a user wait, you offload the work " +
    "to be done asynchronously by workers. Background jobs are typically <strong>event-driven</strong> " +
    "(triggered by an event/message) or <strong>schedule-driven</strong> (run on a timer/cron). A key design " +
    "question is how the user learns the result (<strong>returning results</strong>) since the work finishes " +
    "after the original request returns.</p>",
  examples: [
    {
      title: "Example 1: Offloading slow work to a worker",
      description: "<p>Respond fast; do the heavy lifting in the background.</p>",
      code: "// Synchronous (bad UX): user waits 30s while the video transcodes\n" +
        "// Async (good): \n" +
        "//   1. API receives upload -> enqueue a 'transcode' job -> respond 202 fast\n" +
        "//   2. Worker pool picks up the job -> transcodes -> stores result\n" +
        "//   3. Notify the user (webhook/poll/websocket) when done"
    },
    {
      title: "Example 2: Event-driven vs schedule-driven triggers",
      description: "<p>Two ways jobs get started.</p>",
      code: "// Event-driven: 'OrderPlaced' event -> job: send confirmation email\n" +
        "//   reacts immediately to something happening\n" +
        "// Schedule-driven: every night at 02:00 -> job: rebuild search index\n" +
        "//   runs on a fixed timer regardless of events (cron)"
    }
  ],
  whenToUse: "<p>Use background jobs whenever work is slow, can fail and need retries, must be rate-limited, or " +
    "simply doesn't need to happen within the request &mdash; emails, image/video processing, report " +
    "generation, data syncs, scheduled cleanups. They keep request latency low and improve resilience " +
    "(failed jobs can retry). <strong>Gotchas:</strong> you need a queue and worker infrastructure, plus a " +
    "strategy for retries, failures (dead-letter queues), and <strong>idempotency</strong> (a job may run " +
    "more than once, so re-running must be safe). Returning results to the user is now asynchronous &mdash; " +
    "you need polling, webhooks, or push notifications. And background work is easy to lose track of " +
    "operationally, so monitor queue depth and job failures. The sub-topics cover event vs schedule driving " +
    "and returning results.</p>"
};

C["event-driven"] = {
  summary: "<p><strong>Event-driven</strong> background jobs are triggered in <em>reaction to an event</em> &mdash; " +
    "a message published when something happens (an order is placed, a file is uploaded, a user signs up). A " +
    "producer emits the event, and one or more consumers react by doing work, decoupled in time and identity " +
    "via a queue or message broker. This is responsive (work starts as soon as the trigger occurs) and " +
    "extensible (add new reactions by adding consumers, without touching the producer). It's the dominant " +
    "model for reactive, real-time-ish processing.</p>",
  examples: [
    {
      title: "Example 1: React to an event",
      description: "<p>Publishing an event kicks off independent jobs.</p>",
      code: "// Producer emits an event; consumers react independently\n" +
        "publish('UserSignedUp', { userId: 7 });\n" +
        "// -> consumer A: send welcome email\n" +
        "// -> consumer B: create billing profile\n" +
        "// -> consumer C: warm up recommendations\n" +
        "// The producer doesn't know or wait for any of them."
    },
    {
      title: "Example 2: Decoupling and extensibility",
      description: "<p>New behavior slots in without changing existing code.</p>",
      code: "// Need to also start a fraud check on signup? Add a consumer:\n" +
        "//   subscribe('UserSignedUp', e => fraudService.screen(e.userId));\n" +
        "// No change to the signup code - that's the event-driven win."
    }
  ],
  whenToUse: "<p>Use event-driven jobs when work should begin promptly in response to something happening, when " +
    "multiple independent actions follow one trigger, or when you want producers and consumers decoupled and " +
    "independently scalable &mdash; order processing, notifications, syncing systems, audit trails. " +
    "<strong>Gotchas:</strong> control flow becomes implicit and harder to trace (you must know who " +
    "subscribes), and you inherit messaging concerns &mdash; at-least-once delivery means consumers must be " +
    "<strong>idempotent</strong> (handle duplicates), plus ordering, failures, and dead-letter handling. " +
    "Debugging an event chain end-to-end is harder than following a function call. Use it where the " +
    "responsiveness and decoupling are worth that operational complexity; for simple, immediate work a direct " +
    "call or a scheduled job may be simpler.</p>"
};

C["schedule-driven"] = {
  summary: "<p><strong>Schedule-driven</strong> (or time-driven) background jobs run on a <em>fixed schedule</em> " +
    "&mdash; at specific times or recurring intervals &mdash; regardless of any triggering event, typically via " +
    "a cron expression or a scheduler. They're for periodic, predictable work: nightly batch processing, " +
    "hourly report generation, daily cleanup of expired data, regular cache warming, or polling an external " +
    "system. Unlike event-driven jobs (which react), schedule-driven jobs proactively run on the clock.</p>",
  examples: [
    {
      title: "Example 1: Cron-style scheduling",
      description: "<p>Recurring jobs defined by a schedule expression.</p>",
      code: "// cron syntax:  min hour day month weekday\n" +
        "// 0 2 * * *      -> every day at 02:00  (nightly batch / index rebuild)\n" +
        "// */15 * * * *   -> every 15 minutes    (poll external API, refresh cache)\n" +
        "// 0 0 1 * *      -> 1st of each month    (generate monthly invoices)"
    },
    {
      title: "Example 2: Typical scheduled tasks",
      description: "<p>Periodic maintenance and batch work.</p>",
      code: "// - Nightly: aggregate yesterday's analytics, rebuild search index\n" +
        "// - Hourly:  retry failed payments, sync inventory\n" +
        "// - Daily:   delete expired sessions, send digest emails\n" +
        "// - Weekly:  database vacuum/maintenance, archive old logs"
    }
  ],
  whenToUse: "<p>Use schedule-driven jobs for periodic, predictable work that doesn't depend on a specific " +
    "event &mdash; batch aggregation, reports, cleanup, backups, polling, recurring billing. They're simple " +
    "and well-understood (cron is everywhere). <strong>Gotchas:</strong> in a distributed system, naive cron " +
    "on multiple servers means the job runs <em>multiple times</em> &mdash; you need a single scheduler, " +
    "leader election, or a distributed lock so exactly one instance runs it. Long-running scheduled jobs can " +
    "overlap with the next run (guard against concurrent execution), and a missed run (server down at the " +
    "scheduled time) may silently skip &mdash; consider catch-up logic and monitoring/alerting on job success. " +
    "Make jobs idempotent so a re-run after failure is safe. For work that should start immediately on a " +
    "trigger, use event-driven instead of polling on a schedule.</p>"
};

C["returning-results"] = {
  summary: "<p><strong>Returning results</strong> addresses a core challenge of background jobs: since the " +
    "work completes <em>after</em> the original request has returned, how does the caller get the outcome? " +
    "The common strategies are <strong>polling</strong> (client repeatedly asks 'is it done yet?' via a " +
    "status endpoint/job id), <strong>webhooks/callbacks</strong> (the server calls back a client-provided " +
    "URL when finished), and <strong>push</strong> (WebSockets/Server-Sent Events/push notifications to " +
    "deliver the result in real time). Each trades off simplicity, latency, and infrastructure.</p>",
  examples: [
    {
      title: "Example 1: The async request-reply with polling",
      description: "<p>Return a job id immediately; the client polls for status.</p>",
      code: "// 1. POST /reports  -> 202 Accepted, { jobId: \"abc\", status: \"pending\" }\n" +
        "// 2. Client polls:  GET /reports/abc  -> { status: \"processing\" }\n" +
        "// 3. ...later:      GET /reports/abc  -> { status: \"done\", url: \"...\" }\n" +
        "// Simple, but polling wastes requests and adds latency between checks."
    },
    {
      title: "Example 2: Webhook (push) callback",
      description: "<p>The server notifies the client when work completes.</p>",
      code: "// Client provides a callback URL when submitting the job:\n" +
        "//   POST /reports { callbackUrl: \"https://client/done\" }\n" +
        "// When finished, the server POSTs the result to that URL:\n" +
        "//   -> POST https://client/done { jobId: \"abc\", result: {...} }\n" +
        "// No polling; but the client must expose an endpoint and verify the call."
    }
  ],
  whenToUse: "<p>Pick a result-return strategy by client capability and latency needs: <strong>polling</strong> " +
    "is the simplest and works for any client (good default for moderate latency), <strong>webhooks</strong> " +
    "suit server-to-server integrations where the client can receive callbacks (efficient, no polling), and " +
    "<strong>push (WebSocket/SSE)</strong> suits real-time UIs that need instant updates. <strong>Gotchas:</strong> " +
    "polling wastes resources and adds delay (tune the interval, use backoff); webhooks require the client to " +
    "host an endpoint, handle retries/duplicates, and <em>verify authenticity</em> (signatures) since anyone " +
    "could POST to the URL; push connections are stateful and harder to scale. Always include a job/" +
    "correlation id, handle the case where the result is requested before it's ready, and set expectations " +
    "(timeouts, expiry of results). This is the Async Request-Reply pattern in practice.</p>"
};

C["domain-name-system"] = {
  summary: "<p>The <strong>Domain Name System (DNS)</strong> is the internet's phone book: it translates " +
    "human-readable domain names (<code>example.com</code>) into IP addresses (<code>93.184.216.34</code>) " +
    "that machines route to. A DNS lookup walks a hierarchy &mdash; root servers &rarr; top-level domain " +
    "(.com) servers &rarr; the domain's authoritative name servers &mdash; with heavy caching at every level " +
    "(your OS, resolver, browser) to keep it fast. Beyond name resolution, DNS is a key tool in system " +
    "design: it enables load distribution (round-robin, geo-routing), failover, and directing users to the " +
    "nearest CDN edge.</p>",
  examples: [
    {
      title: "Example 1: The resolution chain",
      description: "<p>How a name becomes an IP, with caching shortcuts.</p>",
      code: "// Browser wants example.com:\n" +
        "// 1. Check local/OS/browser cache (often answered here)\n" +
        "// 2. Ask the recursive resolver (ISP/8.8.8.8)\n" +
        "// 3. Resolver -> root server -> .com TLD server -> authoritative NS\n" +
        "// 4. Authoritative NS returns the IP (with a TTL for caching)\n" +
        "// Cached by TTL so most lookups skip steps 3-4."
    },
    {
      title: "Example 2: DNS as a system-design tool",
      description: "<p>Record types enable routing, failover, and CDN.</p>",
      code: "// A / AAAA  -> domain to IPv4 / IPv6 address\n" +
        "// CNAME     -> alias one name to another (e.g. www -> app.cdn.com)\n" +
        "// Routing policies (managed DNS like Route 53):\n" +
        "//   - weighted     -> split traffic %s across endpoints\n" +
        "//   - latency/geo  -> send users to the nearest region\n" +
        "//   - failover     -> route away from an unhealthy endpoint"
    }
  ],
  whenToUse: "<p>You rely on DNS for every internet request, and you actively use it in design for global " +
    "traffic management: round-robin or weighted records for crude load balancing, latency/geo routing to " +
    "send users to the closest region or CDN edge, and health-checked failover to route around outages. " +
    "<strong>Gotchas:</strong> DNS changes propagate slowly because of <strong>TTL caching</strong> &mdash; a " +
    "record update isn't instant (clients hold the old value until TTL expires), so failover via DNS is not " +
    "fast (seconds to minutes); use low TTLs for records you may need to change quickly, but not so low that " +
    "you lose caching benefits. DNS-based load balancing is coarse (no per-request awareness, clients cache " +
    "results). DNS is also a single point of failure and a security target (DNS spoofing/hijacking) &mdash; " +
    "use a reputable managed provider and DNSSEC where appropriate.</p>"
};

C["content-delivery-networks"] = {
  summary: "<p>A <strong>Content Delivery Network (CDN)</strong> is a geographically distributed network of " +
    "edge servers that cache and serve content from locations close to users, reducing latency and offloading " +
    "your origin servers. When a user requests a static asset (image, CSS, JS, video), the CDN serves it from " +
    "a nearby edge instead of your distant origin &mdash; faster for users, cheaper and lighter for you. CDNs " +
    "come in two flavors by how content gets to the edge: <strong>push</strong> (you upload to the CDN) and " +
    "<strong>pull</strong> (the CDN fetches from your origin on first request). They're essential for serving " +
    "static content at scale.</p>",
  examples: [
    {
      title: "Example 1: Edge caching cuts latency",
      description: "<p>Serve from the nearest edge, not the distant origin.</p>",
      code: "// Without CDN: user in Tokyo -> origin in Virginia (~150ms+ each asset)\n" +
        "// With CDN:   user in Tokyo -> Tokyo edge (~5-20ms), origin hit only\n" +
        "//             on a cache miss. Origin load drops dramatically too."
    },
    {
      title: "Example 2: What to put on a CDN",
      description: "<p>Static and cacheable content benefits most.</p>",
      code: "// Great for CDN: images, video, CSS/JS bundles, fonts, downloads,\n" +
        "//   and cacheable API/page responses (with proper cache headers)\n" +
        "// Control caching with headers:\n" +
        "//   Cache-Control: public, max-age=31536000, immutable  (hashed assets)\n" +
        "//   plus cache invalidation/versioned URLs for updates"
    }
  ],
  whenToUse: "<p>Use a CDN for virtually any public web app or service that serves static assets, media, or " +
    "cacheable responses to a geographically spread audience &mdash; it improves load times, reduces origin " +
    "load and bandwidth cost, and absorbs traffic spikes (and some DDoS). <strong>Gotchas:</strong> the " +
    "central challenge is <strong>cache invalidation</strong> &mdash; when content changes, edges may still " +
    "serve the old version until TTL expiry or an explicit purge; the standard fix is versioned/hashed URLs " +
    "(<code>app.a1b2c3.js</code>) so new content gets a new URL. Don't CDN highly dynamic, per-user, or " +
    "sensitive content without care (you could cache private data at the edge). Set <code>Cache-Control</code> " +
    "headers deliberately. The sub-topics cover push vs pull CDNs and their trade-offs.</p>"
};

C["push-cdns"] = {
  summary: "<p>With a <strong>push CDN</strong>, <em>you</em> proactively upload content to the CDN, which then " +
    "serves it from its edges. You're responsible for pushing new/updated files and removing stale ones &mdash; " +
    "the CDN holds exactly what you put there. This gives you full control over what's cached and avoids " +
    "origin hits entirely (the origin may not even need to be reachable), but it requires you to manage " +
    "uploads and invalidation. Push CDNs suit sites with <em>infrequently changing</em> content or low " +
    "traffic where re-fetching from origin would waste resources.</p>",
  examples: [
    {
      title: "Example 1: You control what's on the edge",
      description: "<p>Upload on change; the CDN serves your pushed copy.</p>",
      code: "// Deploy step pushes assets to the CDN's storage:\n" +
        "//   build -> upload dist/* to CDN (S3+CloudFront origin, etc.)\n" +
        "// CDN serves exactly those files; origin isn't queried per-miss.\n" +
        "// You must re-push (and invalidate) whenever content changes."
    },
    {
      title: "Example 2: Push vs pull at a glance",
      description: "<p>Who initiates getting content to the edge.</p>",
      code: "// PUSH: you upload -> CDN stores -> serves. You manage updates.\n" +
        "//   Good for: small/static sites, infrequently updated large files,\n" +
        "//   low-traffic content (no benefit to lazy pull).\n" +
        "// PULL: CDN fetches from origin on first request, then caches (see Pull CDNs)."
    }
  ],
  whenToUse: "<p>Choose a push CDN when content changes infrequently, when you have large files you want " +
    "available at the edge without origin round-trips, when traffic is low/uneven (a pull CDN's first-request " +
    "origin fetches would be wasteful), or when you need precise control over exactly what's cached. " +
    "<strong>Gotchas:</strong> you own the upload and invalidation lifecycle &mdash; forgetting to push an " +
    "update means users get stale content, and storage at the CDN can grow if you don't prune old assets. It " +
    "adds a step to your deploy/publish pipeline. For frequently changing content or large catalogs where " +
    "pre-uploading everything is impractical, a <strong>pull CDN</strong> (fetch-on-demand) is usually simpler " +
    "&mdash; most modern setups default to pull. Use push when its control and origin-independence genuinely " +
    "help.</p>"
};

C["pull-cdns"] = {
  summary: "<p>With a <strong>pull CDN</strong>, the CDN fetches content from your origin <em>on demand</em>: " +
    "the first time an edge gets a request for an asset it doesn't have, it pulls it from your origin, caches " +
    "it (per TTL), and serves it; subsequent requests are served from the cache until it expires. You don't " +
    "pre-upload anything &mdash; the cache populates lazily based on actual demand. This minimizes management " +
    "(no manual uploads) and storage (only requested content is cached), which is why it's the most common, " +
    "default CDN model for typical websites.</p>",
  examples: [
    {
      title: "Example 1: Lazy, on-demand caching",
      description: "<p>First request fills the cache; the rest are fast hits.</p>",
      code: "// First request for /logo.png at the Tokyo edge:\n" +
        "//   edge MISS -> pull from origin -> cache (TTL) -> serve (slower this once)\n" +
        "// Next requests at that edge:\n" +
        "//   edge HIT -> serve from cache (fast), no origin hit until TTL expires"
    },
    {
      title: "Example 2: TTL controls freshness",
      description: "<p>Cache-Control headers set how long edges hold content.</p>",
      code: "// Origin sets cache lifetime:\n" +
        "//   Cache-Control: public, max-age=3600  -> edge caches for 1 hour\n" +
        "// After TTL, the edge re-validates/re-pulls from origin.\n" +
        "// Use long TTL + versioned URLs for assets that 'never change'."
    }
  ],
  whenToUse: "<p>Choose a pull CDN (the usual default) for most websites and apps &mdash; especially with large " +
    "or frequently-changing catalogs where pre-uploading everything (push) is impractical, and for steady " +
    "traffic where the one-time origin fetch per asset is negligible. It minimizes operational overhead and " +
    "only caches what's actually requested. <strong>Gotchas:</strong> the <em>first</em> request to each edge " +
    "for each asset incurs an origin fetch (a 'cold' miss is slower, and a traffic spike of cold content can " +
    "briefly hammer your origin &mdash; 'thundering herd'/cache stampede). Stale content persists until TTL " +
    "expiry unless you purge, so use versioned URLs for instant updates. Set sensible <code>Cache-Control</code>/" +
    "TTLs &mdash; too short and you lose the benefit, too long and updates lag. For rarely-changing or low-" +
    "traffic content where you want zero origin dependence, consider push instead.</p>"
};

C["load-balancers"] = {
  summary: "<p>A <strong>load balancer (LB)</strong> distributes incoming traffic across multiple backend " +
    "servers so no single server is overwhelmed, enabling horizontal scaling and high availability. It sits " +
    "between clients and your server pool, routing each request to a healthy backend using a balancing " +
    "algorithm (round robin, least connections, etc.), performing health checks to avoid dead servers, and " +
    "often handling SSL termination and session persistence. Load balancers operate at <strong>Layer 4</strong> " +
    "(transport: TCP/UDP) or <strong>Layer 7</strong> (application: HTTP), each with different capabilities. " +
    "They're foundational to any scalable, fault-tolerant system.</p>",
  examples: [
    {
      title: "Example 1: Distributing traffic across a pool",
      description: "<p>One entry point spreads load and routes around failures.</p>",
      code: "//                 -> [Server 1] (healthy)\n" +
        "//  Clients -> [LB] -> [Server 2] (healthy)\n" +
        "//                 -> [Server 3] (failed health check -> removed)\n" +
        "// The LB sends requests only to healthy servers, balancing the load,\n" +
        "// so you can scale out and tolerate individual server failures."
    },
    {
      title: "Example 2: What load balancers also do",
      description: "<p>Beyond distribution: health, TLS, stickiness.</p>",
      code: "// - Health checks: probe /health; stop routing to unhealthy nodes\n" +
        "// - SSL/TLS termination: decrypt HTTPS at the LB (offload from servers)\n" +
        "// - Session persistence ('sticky sessions'): pin a user to one server\n" +
        "// - Redundancy: run LBs in pairs (active-active/passive) - no single LB SPOF"
    }
  ],
  whenToUse: "<p>Use a load balancer any time you run more than one server (for scale or redundancy) &mdash; " +
    "essentially every production web system. It's what makes horizontal scaling and zero-downtime deploys/" +
    "failover possible. <strong>Gotchas:</strong> the LB itself must not be a single point of failure &mdash; " +
    "run redundant LBs (or use a managed/cloud LB that's inherently HA). Prefer <strong>stateless</strong> " +
    "backends so any server can handle any request; if you need sessions, use sticky sessions or (better) " +
    "externalize session state to a shared store so the LB can route freely. Choose Layer 4 vs Layer 7 based " +
    "on whether you need content-aware routing (see those topics). Health checks must be meaningful (a real " +
    "readiness probe), or the LB may keep sending traffic to broken servers. The sub-topics cover LB vs " +
    "reverse proxy, algorithms, and L4/L7.</p>"
};

C["lb-vs-reverse-proxy"] = {
  summary: "<p>A <strong>load balancer</strong> and a <strong>reverse proxy</strong> both sit in front of " +
    "servers and forward client requests, and their roles overlap (many tools, like Nginx and HAProxy, do " +
    "both) &mdash; but the emphasis differs. A <strong>load balancer's</strong> primary purpose is " +
    "distributing traffic across <em>multiple</em> backend servers for scale and availability. A " +
    "<strong>reverse proxy's</strong> primary purpose is to be a single front door that adds capabilities &mdash; " +
    "SSL termination, caching, compression, request routing, security/filtering, hiding backend topology &mdash; " +
    "and it works even with a <em>single</em> backend. In short: load balancing is about <em>distribution</em>; " +
    "reverse proxying is about <em>intermediation</em>.</p>",
  examples: [
    {
      title: "Example 1: Different primary jobs",
      description: "<p>Distribution vs front-door services.</p>",
      code: "// Load Balancer (focus: spread load across many backends)\n" +
        "//   Clients -> [LB] -> [Server1] [Server2] [Server3]\n" +
        "\n" +
        "// Reverse Proxy (focus: a smart single entry point; even 1 backend)\n" +
        "//   Clients -> [Reverse Proxy] -> [App server]\n" +
        "//   + TLS termination, caching, gzip, routing, auth, hides the backend"
    },
    {
      title: "Example 2: They're often the same component",
      description: "<p>One tool can play both roles at once.</p>",
      code: "// Nginx / HAProxy / Envoy commonly do BOTH:\n" +
        "//   - reverse proxy features (TLS, caching, routing by path/host)\n" +
        "//   - AND load balancing across an upstream pool\n" +
        "// e.g. nginx: terminate TLS, route /api -> api pool, /img -> cache,\n" +
        "//      balancing each pool with round robin / least_conn."
    }
  ],
  whenToUse: "<p>Use a <strong>reverse proxy</strong> when you want a single managed entry point providing " +
    "cross-cutting services &mdash; TLS termination, caching, compression, path/host-based routing, " +
    "authentication, rate limiting, and hiding/decoupling your backend layout &mdash; even with one server. " +
    "Use a <strong>load balancer</strong> when the goal is spreading traffic across multiple servers for " +
    "scale and failover. In practice you usually want both, and a single component (Nginx, HAProxy, Envoy, or " +
    "a cloud ALB) provides them together. <strong>Gotchas:</strong> don't over-think the distinction &mdash; " +
    "it's more about emphasis than a hard line. Whatever you deploy at the edge becomes critical " +
    "infrastructure, so make it redundant and monitor it, and be deliberate about where TLS is terminated and " +
    "whether responses are cached (avoid caching per-user/private data).</p>"
};

C["load-balancing-algorithms"] = {
  summary: "<p><strong>Load balancing algorithms</strong> decide which backend server receives each request. " +
    "Common ones: <strong>round robin</strong> (cycle through servers in order), <strong>weighted round " +
    "robin</strong> (favor more powerful servers), <strong>least connections</strong> (send to the server " +
    "with the fewest active connections &mdash; good for uneven request durations), <strong>least response " +
    "time</strong> (factor in latency), <strong>IP hash</strong> (map a client's IP to a consistent server &mdash; " +
    "basic stickiness), and <strong>random (with two choices)</strong>. The right choice depends on whether " +
    "requests are uniform, whether servers are equal, and whether you need session affinity.</p>",
  examples: [
    {
      title: "Example 1: Round robin vs least connections",
      description: "<p>Order-based vs load-aware distribution.</p>",
      code: "// Round robin: req1->S1, req2->S2, req3->S3, req4->S1, ...\n" +
        "//   simple & fair when requests are uniform; ignores actual load\n" +
        "\n" +
        "// Least connections: send to whichever server has fewest open conns\n" +
        "//   better when request durations vary widely (some slow, some fast),\n" +
        "//   so a server stuck on long requests isn't handed more."
    },
    {
      title: "Example 2: Weighting and hashing",
      description: "<p>Account for server capacity, or pin clients.</p>",
      code: "// Weighted round robin: S1(weight 3), S2(weight 1)\n" +
        "//   -> S1 gets ~3x the traffic (use when servers differ in capacity)\n" +
        "// IP hash / consistent hashing: hash(client_ip) -> same server each time\n" +
        "//   -> rough session stickiness; consistent hashing minimizes\n" +
        "//      reshuffling when servers are added/removed."
    }
  ],
  whenToUse: "<p>Pick the algorithm to match your traffic: <strong>round robin</strong> for uniform requests on " +
    "equal servers (simple default), <strong>least connections</strong> when request durations vary a lot " +
    "(prevents piling work on busy servers), <strong>weighted</strong> when servers have different capacities, " +
    "and <strong>IP/consistent hashing</strong> when you need affinity (sticky sessions, cache locality). " +
    "<strong>Gotchas:</strong> round robin ignores real load, so one slow server can still get overwhelmed; " +
    "least connections is usually a safer general default for variable workloads. Hash-based stickiness " +
    "breaks even load distribution and can hot-spot; prefer <em>stateless</em> servers + a shared session " +
    "store over relying on stickiness. <strong>Consistent hashing</strong> matters when servers scale up/down " +
    "frequently (it remaps far fewer keys than plain modulo hashing). Most managed LBs default to sensible " +
    "algorithms &mdash; tune only if you observe imbalance.</p>"
};

C["layer-7-load-balancing"] = {
  summary: "<p><strong>Layer 7 (application-layer) load balancing</strong> operates on the <em>content</em> of " +
    "requests &mdash; HTTP method, URL path, headers, cookies, hostnames. Because it understands the " +
    "application protocol, it can route intelligently: send <code>/api</code> to one pool and <code>/images</code> " +
    "to another, route by hostname (multi-tenant), terminate SSL, inspect/modify headers, do content-based " +
    "stickiness, and implement smart features (A/B routing, canary). The cost is more processing per request " +
    "(it parses the full request) and thus somewhat higher latency/overhead than Layer 4. It's the basis of " +
    "modern application load balancers and API gateways.</p>",
  examples: [
    {
      title: "Example 1: Content-aware routing",
      description: "<p>Route by path/host because the LB understands HTTP.</p>",
      code: "// One L7 LB, routing by request content:\n" +
        "//   Host: api.example.com  -> API server pool\n" +
        "//   Path: /static/*        -> static/CDN origin pool\n" +
        "//   Path: /admin/*         -> admin pool (+ extra auth)\n" +
        "//   Cookie/header rules    -> canary/A-B testing, sticky sessions"
    },
    {
      title: "Example 2: L7 capabilities",
      description: "<p>Things only an application-aware LB can do.</p>",
      code: "// - SSL/TLS termination (decrypt, inspect, re-route)\n" +
        "// - Header manipulation (add X-Forwarded-For, auth headers)\n" +
        "// - HTTP-aware health checks (GET /health, check status code)\n" +
        "// - Rate limiting / WAF / request rewriting\n" +
        "// (All require reading the HTTP request - hence Layer 7.)"
    }
  ],
  whenToUse: "<p>Use Layer 7 load balancing when you need content-aware routing &mdash; path/host-based " +
    "routing, microservice/API gateways, multi-tenant hosting, SSL termination, header/cookie logic, A/B and " +
    "canary deployments, or HTTP-aware health checks and security (WAF, rate limiting). It's the right choice " +
    "for most modern web/API traffic. <strong>Trade-offs and gotchas:</strong> parsing and terminating the " +
    "full request adds latency and CPU cost versus Layer 4, and the LB becomes a richer (more complex) " +
    "component that must scale and stay highly available. Terminating TLS at the LB means traffic to backends " +
    "may be unencrypted unless you re-encrypt (consider it for sensitive data). When you only need raw, " +
    "high-throughput packet/connection distribution without understanding content (e.g. non-HTTP, extreme " +
    "performance), Layer 4 is leaner &mdash; see that topic.</p>"
};

C["layer-4-load-balancing"] = {
  summary: "<p><strong>Layer 4 (transport-layer) load balancing</strong> routes traffic based on network " +
    "information &mdash; source/destination IP and port &mdash; <em>without</em> inspecting the request " +
    "content. It simply forwards TCP/UDP connections/packets to a backend, making decisions purely on the " +
    "transport layer. Because it does far less work per request (no parsing, often no TLS termination), it's " +
    "<strong>faster and lower-overhead</strong> than Layer 7, handling very high throughput with minimal " +
    "latency. The trade-off is that it can't make content-based decisions (no path/host routing) &mdash; it " +
    "treats traffic as opaque.</p>",
  examples: [
    {
      title: "Example 1: Routing without reading content",
      description: "<p>Decisions on IP/port only; the payload is opaque.</p>",
      code: "// L4 LB sees only: src/dst IP + port, protocol (TCP/UDP)\n" +
        "//   Connection to :443 -> pick a backend (e.g. least conn) -> forward\n" +
        "// It does NOT parse HTTP, so it can't route by URL/host/header.\n" +
        "// Often preserves the connection end-to-end (can pass TLS through)."
    },
    {
      title: "Example 2: L4 vs L7 trade-off",
      description: "<p>Speed and simplicity vs intelligence.</p>",
      code: "// Layer 4: fast, high throughput, protocol-agnostic (TCP/UDP),\n" +
        "//   can pass through encrypted traffic untouched; NO content routing.\n" +
        "// Layer 7: content-aware (path/host/header), TLS termination, richer\n" +
        "//   features; more CPU/latency per request.\n" +
        "// Many architectures use L4 at the edge + L7 deeper in."
    }
  ],
  whenToUse: "<p>Use Layer 4 load balancing when you need maximum throughput and minimal latency, when traffic " +
    "is non-HTTP (raw TCP/UDP, databases, game servers, custom protocols), when you want to pass encrypted " +
    "traffic through untouched (TLS terminated at the backend), or as a high-performance front layer ahead of " +
    "L7 balancers. <strong>Trade-offs and gotchas:</strong> it can't do content-based routing, HTTP-aware " +
    "health checks, or header/cookie logic &mdash; if you need those, you need Layer 7. Because it's " +
    "connection-oriented, a single long-lived TCP connection stays pinned to one backend (which can cause " +
    "imbalance with few, long connections). The common modern pattern is L4 for sheer scale/throughput at the " +
    "outer edge and L7 (application LB / gateway) for the smart routing &mdash; pick L4 when you genuinely " +
    "don't need to understand the request.</p>"
};

C["horizontal-scaling"] = {
  summary: "<p><strong>Horizontal scaling</strong> ('scaling out') means handling more load by adding " +
    "<em>more machines</em> to a pool, rather than making one machine bigger (<em>vertical</em> scaling / " +
    "'scaling up'). Traffic is spread across the machines by a load balancer. Horizontal scaling offers " +
    "near-unlimited growth and built-in fault tolerance (one node can die without taking the system down), " +
    "which is why large systems rely on it. Its key requirement is <strong>statelessness</strong>: servers " +
    "must not store per-user state locally, so any server can handle any request and you can add/remove nodes " +
    "freely. State goes to shared stores (databases, caches, session stores).</p>",
  examples: [
    {
      title: "Example 1: Scale out vs scale up",
      description: "<p>More machines vs a bigger machine.</p>",
      code: "// Vertical (scale up):   1 server: 8 cores -> 64 cores\n" +
        "//   simple, but a hard ceiling + single point of failure + costly\n" +
        "// Horizontal (scale out): 1 server -> 10 servers behind a load balancer\n" +
        "//   add capacity incrementally, tolerate node failures, cheap commodity HW"
    },
    {
      title: "Example 2: Statelessness is the prerequisite",
      description: "<p>Externalize state so any node can serve any request.</p>",
      code: "// BAD (stateful): store session/user data in the server's memory\n" +
        "//   -> requests must stick to that one server; can't freely scale\n" +
        "// GOOD (stateless): keep no local state; put sessions in Redis,\n" +
        "//   data in the DB, files in object storage\n" +
        "//   -> any of the N servers can handle any request; add/remove at will"
    }
  ],
  whenToUse: "<p>Use horizontal scaling for systems that must grow beyond one machine's limits or need fault " +
    "tolerance &mdash; essentially all large web services. It's the foundation of cloud-native, elastic " +
    "(auto-scaling) architectures. <strong>Gotchas:</strong> it <em>requires statelessness</em> &mdash; the " +
    "single biggest blocker is servers holding local session/state, which forces sticky sessions and breaks " +
    "elasticity; externalize state to shared stores first. It also pushes complexity onto coordination: load " +
    "balancing, service discovery, distributed caching, and data consistency across nodes. Scaling the " +
    "stateless app tier is easy; the <em>database</em> usually becomes the real bottleneck (it doesn't scale " +
    "out as trivially &mdash; hence replication/sharding). Vertical scaling is simpler and fine up to a point; " +
    "many systems do both (scale up until it's uneconomical, then scale out).</p>"
};

C["application-layer"] = {
  summary: "<p>The <strong>application layer</strong> (sometimes the 'platform' or 'service' layer) is the " +
    "tier that holds your business logic, sitting between the web/presentation tier and the data tier. " +
    "Separating the application layer from the web layer lets you scale them independently and structure the " +
    "logic cleanly. A major design decision here is how to organize that logic &mdash; as a single " +
    "<strong>monolith</strong> or as multiple <strong>microservices</strong> &mdash; and, if distributed, how " +
    "services find each other (<strong>service discovery</strong>). This layer is where most of the " +
    "'business' of the system lives, so its structure heavily influences scalability and maintainability.</p>",
  examples: [
    {
      title: "Example 1: Separating web and application tiers",
      description: "<p>Independent layers scale and evolve separately.</p>",
      code: "//  [Web tier]  - handles HTTP, serves pages/UI, light logic\n" +
        "//      |  (internal API calls)\n" +
        "//  [App tier]  - business logic, orchestration, talks to data tier\n" +
        "//      |\n" +
        "//  [Data tier] - databases, caches\n" +
        "// Each tier scales on its own; a spike in logic work doesn't force\n" +
        "// you to scale the web layer (and vice versa)."
    },
    {
      title: "Example 2: Monolith vs microservices for the app layer",
      description: "<p>One deployable vs many independent services.</p>",
      code: "// Monolith: all logic in one app/process - simple, fast calls, one deploy\n" +
        "// Microservices: split by capability - independent deploy/scale per service,\n" +
        "//   but network calls, distributed data, and ops overhead.\n" +
        "// + service discovery so services can find each other dynamically."
    }
  ],
  whenToUse: "<p>Think about the application layer's structure whenever you're organizing business logic for " +
    "scale and maintainability. Separating it from the web tier is broadly useful (independent scaling, " +
    "cleaner boundaries). <strong>Monolith vs microservices</strong> is the big call: start with a " +
    "well-structured monolith for most systems (simpler, faster to build, easy to reason about) and adopt " +
    "microservices only when you have concrete drivers &mdash; large teams needing independent deploys, parts " +
    "with very different scaling needs, or fault isolation &mdash; plus the ops maturity to run them. " +
    "<strong>Gotcha:</strong> premature microservices import enormous complexity (network failures, " +
    "distributed data, service discovery, tracing). The sub-topics cover microservices and service discovery; " +
    "match the structure to your team and scale, not to hype.</p>"
};

C["microservices"] = {
  summary: "<p><strong>Microservices</strong> structure the application layer as a set of small, independently " +
    "deployable services, each owning a specific business capability and its own data, communicating over the " +
    "network (HTTP/gRPC/messaging). The benefits are independent deployment and scaling per service, " +
    "technology freedom, fault isolation, and letting teams own services end-to-end. The cost is significant " +
    "<strong>distributed-systems complexity</strong>: network calls and their failures, data consistency " +
    "across service boundaries, service discovery, distributed tracing, and heavier operational overhead. " +
    "It's a powerful pattern for large-scale organizations but a frequent source of over-engineering when " +
    "adopted prematurely.</p>",
  examples: [
    {
      title: "Example 1: Services own capability + data",
      description: "<p>Each service is autonomous and communicates over the network.</p>",
      code: "//   [Order svc] --http--> [Payment svc] --http--> [Ledger svc]\n" +
        "//      (own DB)               (own DB)                (own DB)\n" +
        "// Each deploys, scales, and is owned independently.\n" +
        "// No shared database - services talk via APIs/events."
    },
    {
      title: "Example 2: New failure modes to design for",
      description: "<p>In-process calls don't fail halfway; network calls do.</p>",
      code: "// A remote call can time out, fail, or partially succeed:\n" +
        "//   order.place() -> payment.charge() OK -> inventory.reserve() FAILS\n" +
        "//   -> must compensate (refund) or use a saga; no easy DB transaction\n" +
        "//      spans services. Add retries, timeouts, circuit breakers."
    }
  ],
  whenToUse: "<p>Adopt microservices when you have real drivers: many teams needing to deploy independently, " +
    "components with very different scaling profiles, a need to isolate failures or tech stacks &mdash; " +
    "<em>and</em> the DevOps maturity (CI/CD, containers, monitoring, distributed tracing) to operate them. " +
    "<strong>The dominant guidance is 'monolith first':</strong> most systems should start as a modular " +
    "monolith and extract services only when a real boundary and pain point emerge. <strong>Gotchas:</strong> " +
    "premature microservices trade simple in-process calls for network failures, eventual consistency, " +
    "distributed transactions (sagas), service discovery, and big operational burden a small team can't " +
    "absorb. Get service boundaries wrong and you build a 'distributed monolith' (the worst of both). " +
    "Microservices solve organizational and scaling problems, not code-quality ones.</p>"
};

C["service-discovery"] = {
  summary: "<p><strong>Service discovery</strong> is how services in a dynamic environment find each other's " +
    "network locations without hard-coded addresses. As instances scale up/down, fail, and move, their IPs " +
    "change &mdash; so services register themselves in a <strong>service registry</strong> and look up others " +
    "by logical name. Two models: <strong>client-side discovery</strong> (the caller queries the registry and " +
    "picks an instance) and <strong>server-side discovery</strong> (the caller hits a load balancer/router " +
    "that does the lookup). Tools include Consul, etcd, Eureka, and Kubernetes' built-in DNS-based discovery. " +
    "It's essential glue for microservices and any elastic, multi-instance system.</p>",
  examples: [
    {
      title: "Example 1: Register and discover by name",
      description: "<p>Instances register; callers look up the logical service.</p>",
      code: "// On startup, each instance registers itself + sends heartbeats:\n" +
        "//   payment-svc -> registry: 'I'm at 10.0.3.7:8080, healthy'\n" +
        "// A caller asks the registry by NAME, not IP:\n" +
        "//   order-svc -> registry: 'where is payment-svc?'\n" +
        "//             -> [10.0.3.7:8080, 10.0.3.9:8080] -> pick one (LB)\n" +
        "// Dead instances stop heartbeating and are removed."
    },
    {
      title: "Example 2: Client-side vs server-side",
      description: "<p>Who does the lookup and load balancing.</p>",
      code: "// Client-side: caller queries registry + balances itself\n" +
        "//   order-svc -> registry -> chooses an instance -> calls it\n" +
        "// Server-side: caller hits a router/LB that resolves + forwards\n" +
        "//   order-svc -> [LB/gateway] -> resolves payment-svc -> forwards\n" +
        "// Kubernetes: DNS-based - call 'payment-svc' and the platform resolves it."
    }
  ],
  whenToUse: "<p>Use service discovery whenever you run multiple, dynamically-scaled service instances whose " +
    "locations aren't fixed &mdash; microservices, auto-scaling groups, container orchestration. It removes " +
    "brittle hard-coded URLs and enables load balancing, failover, and elasticity. <strong>Gotchas and " +
    "context:</strong> if you deploy on <strong>Kubernetes, you usually get service discovery for free</strong> " +
    "(via Services + DNS) and don't need a separate Consul/Eureka &mdash; running both is redundant. The " +
    "registry must be highly available (it's critical infrastructure; run it clustered). There's a propagation " +
    "window where a just-failed instance may still appear registered, so combine discovery with health checks " +
    "and circuit breakers/retries. For a small system with a couple of fixed services, a simple load balancer " +
    "or DNS entry is enough &mdash; full discovery infrastructure earns its place at scale.</p>"
};

/* ======================================================================
   DATABASES
   ====================================================================== */

C["databases"] = {
  summary: "<p>The <strong>database</strong> is usually the hardest part of a system to scale and the most " +
    "consequential design choice. The big split is <strong>SQL (relational)</strong> &mdash; structured " +
    "tables, strong consistency, ACID transactions, joins &mdash; versus <strong>NoSQL</strong> &mdash; " +
    "flexible schemas, horizontal scalability, varied data models (key-value, document, wide-column, graph). " +
    "Scaling techniques include <strong>replication</strong> (copies for read scale/availability), " +
    "<strong>sharding</strong> (partition data across machines for write scale), <strong>federation</strong> " +
    "(split by function), <strong>denormalization</strong> (trade storage for fewer joins), and " +
    "<strong>SQL tuning</strong> (indexes, query optimization). Choosing and scaling the data layer well is " +
    "central to system design.</p>",
  examples: [
    {
      title: "Example 1: Scaling techniques overview",
      description: "<p>Different problems call for different scaling moves.</p>",
      code: "// Read-heavy?      -> replication (read replicas) + caching\n" +
        "// Write-heavy / too big for one machine? -> sharding (partition data)\n" +
        "// Distinct functional areas?             -> federation (split by domain)\n" +
        "// Too many expensive joins?              -> denormalization\n" +
        "// Slow queries?                          -> indexes + SQL tuning"
    },
    {
      title: "Example 2: SQL vs NoSQL at a glance",
      description: "<p>Structure and guarantees vs flexibility and scale.</p>",
      code: "// SQL:  fixed schema, ACID, joins, strong consistency\n" +
        "//   great for relational data + transactions (orders, payments)\n" +
        "// NoSQL: flexible schema, horizontal scale, eventual consistency (often)\n" +
        "//   great for huge scale, simple access patterns, varied/sparse data"
    }
  ],
  whenToUse: "<p>Invest the most design effort here &mdash; the database is typically the bottleneck. Default to " +
    "a <strong>relational database</strong> for most applications (it's robust, well-understood, and handles " +
    "more scale than people assume with replicas, caching, and indexing); reach for NoSQL when you have a " +
    "specific need its data model or scale-out serves better. Scale reads with replication + caching before " +
    "anything else; only shard when a single primary genuinely can't handle the write volume or data size, " +
    "because sharding adds major complexity. <strong>Gotchas:</strong> don't pick NoSQL by default or for " +
    "hype &mdash; if your data is relational with transactional needs, SQL is usually the simpler, safer " +
    "choice. Denormalization and sharding are powerful but hard to reverse, so apply them when measurements " +
    "justify them. The sub-topics detail each technique and store type.</p>"
};

C["sql-vs-nosql"] = {
  summary: "<p><strong>SQL vs NoSQL</strong> is the foundational database choice. <strong>SQL (relational)</strong> " +
    "databases (PostgreSQL, MySQL) use structured tables with a fixed schema, support powerful queries with " +
    "<strong>joins</strong>, and provide <strong>ACID</strong> transactions and strong consistency &mdash; " +
    "ideal for structured, related data with integrity requirements. <strong>NoSQL</strong> databases trade " +
    "some of that for <strong>flexible schemas</strong> and easier <strong>horizontal scaling</strong>, in " +
    "four main families: key-value, document, wide-column, and graph. The choice hinges on data structure, " +
    "consistency needs, query patterns, and scale &mdash; not on one being universally 'better'.</p>",
  examples: [
    {
      title: "Example 1: Strengths of each",
      description: "<p>Match the store to the data and access pattern.</p>",
      code: "// SQL shines:   complex relationships + joins, multi-row transactions,\n" +
        "//   strong consistency (banking, orders, inventory), ad-hoc queries\n" +
        "// NoSQL shines: massive horizontal scale, flexible/evolving schema,\n" +
        "//   simple key-based access, high write throughput, denormalized docs"
    },
    {
      title: "Example 2: The four NoSQL families",
      description: "<p>NoSQL isn't one thing &mdash; pick the right model.</p>",
      code: "// Key-Value (Redis, DynamoDB): simple GET/PUT by key - fast, cache-like\n" +
        "// Document (MongoDB):  JSON-ish documents - flexible, app-object-shaped\n" +
        "// Wide-Column (Cassandra): rows with dynamic columns - huge write scale\n" +
        "// Graph (Neo4j):  nodes + edges - relationship-heavy queries (social, fraud)"
    }
  ],
  whenToUse: "<p>Choose <strong>SQL</strong> as the default for most applications &mdash; structured, related " +
    "data, transactions, strong consistency, and flexible querying; it scales further than many assume with " +
    "replicas, caching, and good indexing. Choose <strong>NoSQL</strong> when you have a concrete fit: massive " +
    "horizontal scale, simple key-based access patterns, flexible/sparse schemas, very high write throughput, " +
    "or graph/relationship-heavy queries &mdash; and pick the right family for your access pattern. " +
    "<strong>Gotchas:</strong> don't pick NoSQL reflexively or because it's 'modern' &mdash; many teams " +
    "regret choosing it for relational data and then reinventing joins and transactions in application code. " +
    "Many real systems are <strong>polyglot</strong>: SQL for core transactional data plus a key-value/cache " +
    "and maybe a search or graph store for specific needs. Match the database to the data, not the trend.</p>"
};

C["key-value-store"] = {
  summary: "<p>A <strong>key-value store</strong> is the simplest NoSQL model: data is stored and retrieved by " +
    "a unique key, with the value being an opaque blob (string, JSON, binary). Operations are basically " +
    "<code>get(key)</code>, <code>put(key, value)</code>, <code>delete(key)</code> &mdash; no joins, no " +
    "complex queries. This simplicity makes key-value stores extremely fast and highly scalable (easy to " +
    "partition by key). Examples: Redis, Memcached (in-memory, often used as caches), DynamoDB, Riak. They're " +
    "the backbone of caching, session storage, and any workload with simple, key-based access at high " +
    "throughput.</p>",
  examples: [
    {
      title: "Example 1: Simple key-based access",
      description: "<p>Just get/set by key &mdash; no query language needed.</p>",
      code: "// Conceptual key-value operations\n" +
        "PUT  \"session:abc123\" -> { userId: 7, expires: ... }\n" +
        "GET  \"session:abc123\" -> { userId: 7, ... }\n" +
        "PUT  \"user:7:cart\"    -> [ ...items ]\n" +
        "// O(1) lookups by key; partition by key hash to scale horizontally."
    },
    {
      title: "Example 2: Common uses",
      description: "<p>Where key-value's speed and simplicity fit.</p>",
      code: "// - Caching (Redis/Memcached): cache DB query results, computed pages\n" +
        "// - Sessions: store user session state by session id\n" +
        "// - Rate limiting / counters: INCR per key\n" +
        "// - Feature flags, leaderboards (Redis sorted sets), pub/sub"
    }
  ],
  whenToUse: "<p>Use a key-value store when access is by a known key and you need very high throughput and low " +
    "latency with simple operations &mdash; caching, sessions, rate limiting, counters, leaderboards, feature " +
    "flags, and as a fast lookup layer in front of a slower database. In-memory ones (Redis, Memcached) are " +
    "the default caching tool. <strong>Gotchas:</strong> the simplicity is also the limitation &mdash; you " +
    "can't query by value or do joins, so you must design your keys/access patterns up front (you can only " +
    "find data by the key you stored it under). The value being opaque means no partial updates or " +
    "server-side filtering on the data (unless the store adds richer types, as Redis does). In-memory stores " +
    "are fast but volatile (configure persistence/replication if you need durability). It's the wrong choice " +
    "for relational queries or ad-hoc reporting.</p>"
};

C["document-store"] = {
  summary: "<p>A <strong>document store</strong> holds data as self-contained <strong>documents</strong> &mdash; " +
    "typically JSON/BSON &mdash; where each document can have a flexible, nested structure and documents in a " +
    "collection need not share the same schema. Unlike key-value stores, you can query <em>inside</em> " +
    "documents (by field values), and unlike relational tables, you can embed related data in one document " +
    "rather than joining. Examples: MongoDB, Couchbase, Amazon DocumentDB. Document stores map naturally to " +
    "application objects, suit evolving/heterogeneous data, and scale horizontally &mdash; making them a " +
    "popular general-purpose NoSQL choice.</p>",
  examples: [
    {
      title: "Example 1: Flexible, nested documents",
      description: "<p>Embed related data; documents can vary in shape.</p>",
      code: "// A 'users' collection - documents can differ and nest data\n" +
        "{ _id: 1, name: \"Sam\", address: { city: \"NYC\", zip: \"10001\" },\n" +
        "  orders: [ { id: 99, total: 50 } ] }      // embedded, no join needed\n" +
        "{ _id: 2, name: \"Alex\", phone: \"...\" }    // different fields - that's fine\n" +
        "// Query inside: find users where address.city == \"NYC\""
    },
    {
      title: "Example 2: Embed vs reference (modeling choice)",
      description: "<p>Document modeling revolves around access patterns.</p>",
      code: "// Embed (denormalize) when data is read together + bounded:\n" +
        "//   order document includes its line items -> one read gets everything\n" +
        "// Reference when data is large/shared/independently updated:\n" +
        "//   order stores customerId; fetch the customer separately\n" +
        "// Model around HOW you read, not normalized purity."
    }
  ],
  whenToUse: "<p>Use a document store when your data is naturally document-shaped, schemas vary or evolve " +
    "frequently, you read related data together (embed it to avoid joins), and you want horizontal scale with " +
    "a flexible developer experience &mdash; content management, catalogs with varied attributes, user " +
    "profiles, event logs, and rapid-iteration apps. <strong>Gotchas:</strong> schema flexibility is " +
    "double-edged &mdash; without discipline you get inconsistent documents that complicate code; enforce " +
    "structure at the application layer (or with schema validation). Modeling must follow access patterns " +
    "(embed vs reference), and getting it wrong leads to huge documents or the very joins you tried to avoid " +
    "(done slowly in app code). Multi-document transactions and cross-collection joins are weaker than in " +
    "SQL. Don't use it for highly relational, transaction-heavy data where a relational DB is the better fit.</p>"
};

C["wide-column-store"] = {
  summary: "<p>A <strong>wide-column store</strong> (column-family database) organizes data into rows " +
    "identified by a key, where each row can have a large and <em>varying</em> set of columns grouped into " +
    "'column families'. It's optimized for <strong>massive write throughput</strong> and storing enormous, " +
    "sparse datasets across many machines, with reads/writes by row key. Examples: Apache Cassandra, HBase, " +
    "Google Bigtable, ScyllaDB. The data model is designed around your queries (you model tables per access " +
    "pattern), and these stores typically offer tunable, often eventual consistency and excellent horizontal " +
    "scalability and availability (Cassandra is AP).</p>",
  examples: [
    {
      title: "Example 1: Rows with flexible columns",
      description: "<p>Each row keyed; columns can differ per row and be sparse.</p>",
      code: "// Conceptual wide-column row (keyed by user_id):\n" +
        "//  user_id | name  | email     | last_login | premium_until | ...\n" +
        "//  7       | Sam   | s@x.com   | 2026-06-14 |               |\n" +
        "//  9       | Alex  |           |            | 2027-01-01    | promo_code:X\n" +
        "// Sparse columns cost nothing when absent; great for huge, varied data."
    },
    {
      title: "Example 2: Model around queries, not entities",
      description: "<p>You design a table per access pattern (query-first).</p>",
      code: "// Cassandra: no ad-hoc joins; you denormalize per query.\n" +
        "// Need 'messages by user' AND 'messages by channel'?\n" +
        "//   -> create TWO tables, each with the partition key matching the query\n" +
        "//      messages_by_user(user_id, ...)\n" +
        "//      messages_by_channel(channel_id, ...)\n" +
        "// Write the data to both; reads stay fast and partition-local."
    }
  ],
  whenToUse: "<p>Use a wide-column store for very high write volumes and huge, sparse datasets that must scale " +
    "across many nodes with high availability &mdash; time-series data, IoT/sensor data, event logging, " +
    "messaging, and write-heavy analytics. Cassandra-style stores excel at always-available, geo-distributed " +
    "writes. <strong>Gotchas:</strong> you must <strong>model around your queries up front</strong> (no " +
    "joins, limited ad-hoc querying) &mdash; the data model is query-first and denormalized, so unanticipated " +
    "query patterns are painful (you create new tables and re-write data). Consistency is typically tunable/" +
    "eventual (AP), so it's a poor fit where strong transactional consistency is required. Choosing the " +
    "partition key well is critical (bad keys cause hot partitions and imbalance). It's powerful at scale but " +
    "overkill and awkward for modest, relational, query-flexible workloads.</p>"
};

C["graph-databases"] = {
  summary: "<p>A <strong>graph database</strong> stores data as <strong>nodes</strong> (entities) and " +
    "<strong>edges</strong> (relationships between them), with properties on both. It's purpose-built for data " +
    "where the <em>relationships</em> are as important as the entities, making traversals (friends-of-friends, " +
    "shortest path, recommendations) fast and natural &mdash; queries that would require many expensive joins " +
    "in a relational database. Examples: Neo4j, Amazon Neptune, ArangoDB. Graph databases use traversal-" +
    "oriented query languages (Cypher, Gremlin) and excel at deeply connected data and relationship-centric " +
    "questions.</p>",
  examples: [
    {
      title: "Example 1: Nodes and edges",
      description: "<p>Relationships are first-class, not foreign keys to join.</p>",
      code: "// (Sam)-[:FRIEND]->(Alex)-[:FRIEND]->(Jo)\n" +
        "// (Sam)-[:LIKES]->(Post#42)<-[:LIKES]-(Jo)\n" +
        "// Traversing relationships is O(edges followed), not O(table scans).\n" +
        "// Cypher: MATCH (sam)-[:FRIEND]->()-[:FRIEND]->(fof) RETURN fof"
    },
    {
      title: "Example 2: Where graphs beat relational joins",
      description: "<p>Deep, variable-length relationship queries.</p>",
      code: "// 'Friends of friends of friends who like jazz' in SQL =\n" +
        "//   multiple self-joins, slow and ugly as depth grows.\n" +
        "// In a graph DB: a short traversal that stays fast even at depth.\n" +
        "// Great for: social networks, recommendations, fraud rings,\n" +
        "//   knowledge graphs, network/dependency analysis."
    }
  ],
  whenToUse: "<p>Use a graph database when relationships and traversals are central to your queries &mdash; " +
    "social networks, recommendation engines, fraud detection (finding rings/paths), knowledge graphs, " +
    "identity/access graphs, and network/dependency mapping. They make deep, variable-depth relationship " +
    "queries fast and expressive where relational joins become unwieldy. <strong>Gotchas:</strong> graph " +
    "databases are specialized &mdash; for data that's mostly tabular with shallow relationships, a relational " +
    "database is simpler and faster (don't adopt a graph DB just because your data 'has relationships' &mdash; " +
    "everything does). They can be harder to scale horizontally than other NoSQL types (traversals span the " +
    "graph), and they add another technology and query language to operate. Many systems use a graph database " +
    "alongside a primary store for the specific relationship-heavy features, rather than as the main database.</p>"
};

C["db-replication"] = {
  summary: "<p><strong>Database replication</strong> keeps copies of your data on multiple database servers to " +
    "improve read scalability, availability, and durability. In the common <strong>primary-replica</strong> " +
    "(master-slave) setup, one primary handles writes and streams changes to read-only replicas that serve " +
    "reads &mdash; scaling read capacity and providing a hot standby for failover. <strong>Primary-primary</strong> " +
    "(master-master) lets multiple nodes accept writes (write availability, geo-distribution) at the cost of " +
    "conflict resolution. Replication is usually the <em>first</em> database scaling step because read-heavy " +
    "workloads are common and replicas are straightforward to add.</p>",
  examples: [
    {
      title: "Example 1: Read scaling with replicas",
      description: "<p>Send writes to the primary, spread reads across replicas.</p>",
      code: "//   writes ----> [Primary] --replicate--> [Replica1] <-- reads\n" +
        "//   reads <------                       \\--> [Replica2] <-- reads\n" +
        "// Add replicas to scale READS; promote one if the primary fails.\n" +
        "// Application routes: write queries -> primary, read queries -> replicas."
    },
    {
      title: "Example 2: Replication lag caveat",
      description: "<p>Replicas trail the primary &mdash; reads can be stale.</p>",
      code: "// User updates their profile (write -> primary), then immediately\n" +
        "// reloads (read -> replica that hasn't caught up) -> sees OLD data.\n" +
        "// Fixes: route read-after-write to the primary, or add\n" +
        "//   'read-your-writes' stickiness for a short window."
    }
  ],
  whenToUse: "<p>Use database replication early and often: it's the standard way to scale <strong>read-heavy</strong> " +
    "workloads (most web apps), provide failover for availability, run analytics on a replica without loading " +
    "the primary, and place data near users (geo-replicas). <strong>Primary-replica</strong> is the simpler, " +
    "common choice; <strong>primary-primary</strong> only when you need multi-writer/multi-region writes and " +
    "can handle conflicts. <strong>Gotchas:</strong> asynchronous replication causes <strong>replication " +
    "lag</strong> &mdash; replicas serve slightly stale data, so route read-after-write to the primary or add " +
    "stickiness. Replication scales reads but <em>not writes</em> (all writes still hit the one primary) &mdash; " +
    "for write scaling you need sharding. And replication is <em>not a backup</em>: it faithfully copies bad " +
    "writes and deletes too, so keep real backups separately.</p>"
};

C["sharding"] = {
  summary: "<p><strong>Sharding</strong> (horizontal partitioning) splits a large dataset across multiple " +
    "database servers, each holding a subset (a 'shard'), so that writes and storage scale beyond a single " +
    "machine. Data is divided by a <strong>shard key</strong> (e.g. user id) using a strategy like range-based " +
    ", hash-based, or directory-based partitioning. Each shard is an independent database handling its " +
    "portion, so total capacity grows with the number of shards. Sharding is the main way to scale " +
    "<strong>writes</strong> (where replication can't help), but it's complex and hard to reverse, so it's " +
    "typically a later-stage move.</p>",
  examples: [
    {
      title: "Example 1: Partitioning by shard key",
      description: "<p>Each shard owns a slice of the keyspace.</p>",
      code: "// Hash-based sharding on user_id across 4 shards:\n" +
        "//   shard = hash(user_id) % 4\n" +
        "//   user 7  -> shard 3 ; user 8 -> shard 0 ; ...\n" +
        "// Each shard is a full DB handling only its users' data.\n" +
        "// Writes + storage spread across all 4 -> ~4x capacity."
    },
    {
      title: "Example 2: The hard parts",
      description: "<p>Cross-shard operations and hotspots are the pain points.</p>",
      code: "// Cross-shard query (e.g. 'all orders over $1000') must hit EVERY\n" +
        "//   shard and merge results - slow and complex.\n" +
        "// Cross-shard transactions are hard (no single ACID boundary).\n" +
        "// A bad shard key -> 'hot shard' (e.g. one celebrity user) overloaded.\n" +
        "// Resharding (changing shard count) is painful -> consistent hashing helps."
    }
  ],
  whenToUse: "<p>Shard when a single database can no longer handle your <strong>write volume or data size</strong> " +
    "even after replication, caching, and tuning &mdash; very large-scale systems with high write throughput. " +
    "<strong>Gotchas (this is a last resort):</strong> sharding adds major complexity &mdash; cross-shard " +
    "queries and joins become slow multi-shard scatter-gather, cross-shard transactions are hard or " +
    "impossible, and choosing a good <strong>shard key</strong> is critical (a poor one causes hot shards and " +
    "uneven load). Rebalancing/resharding is operationally painful (use consistent hashing to minimize data " +
    "movement). Many problems people reach to sharding for are better solved first by read replicas, caching, " +
    "better indexing, or archiving old data. Exhaust simpler options before sharding, and design the shard key " +
    "carefully &mdash; it's expensive to change later.</p>"
};

C["federation"] = {
  summary: "<p><strong>Federation</strong> (functional partitioning) splits databases <em>by function or " +
    "domain</em> rather than by rows. Instead of one giant database holding everything, you create separate " +
    "databases per feature area &mdash; e.g. a 'users' database, a 'products' database, a 'forums' database &mdash; " +
    "each handling writes and reads for its domain. This spreads load across multiple databases, reduces " +
    "contention, lets each scale and be cached independently, and aligns with service boundaries. It's a " +
    "simpler scaling step than sharding (which splits a single dataset), and it pairs naturally with a " +
    "service-oriented or microservices architecture.</p>",
  examples: [
    {
      title: "Example 1: Splitting by domain",
      description: "<p>One monolithic DB becomes several function-specific DBs.</p>",
      code: "// Before: one DB with users, products, forums (all contend for it)\n" +
        "// After (federated):\n" +
        "//   [Users DB]     - accounts, profiles, auth\n" +
        "//   [Products DB]  - catalog, inventory\n" +
        "//   [Forums DB]    - posts, comments\n" +
        "// Each takes its own write/read load; less contention; scale separately."
    },
    {
      title: "Example 2: The cross-domain join cost",
      description: "<p>Queries spanning federated DBs lose the easy join.</p>",
      code: "// 'Users who commented on a product' now spans Users + Products + Forums.\n" +
        "// You can't JOIN across separate databases -> the application must\n" +
        "//   query each and join in code, or you denormalize/duplicate data.\n" +
        "// Trade simpler scaling for harder cross-domain queries."
    }
  ],
  whenToUse: "<p>Use federation when your database load comes from distinct functional areas that can be split " +
    "cleanly &mdash; it relieves a single overloaded database, reduces lock/contention, and lets each domain " +
    "scale and be tuned independently. It's a natural fit alongside service decomposition (each service owns " +
    "its database). It's often a gentler, earlier scaling step than sharding. <strong>Gotchas:</strong> the " +
    "main cost is losing cross-database joins and single-database transactions &mdash; queries and operations " +
    "spanning domains must be handled in application code or via denormalization/events, which adds " +
    "complexity. Federation only helps if load actually divides along functional lines (a single hot domain " +
    "still needs replication/sharding within it). Splitting too aggressively creates many small databases to " +
    "operate. Use it where clear domain boundaries exist and reduce coupling across them.</p>"
};

C["denormalization"] = {
  summary: "<p><strong>Denormalization</strong> deliberately introduces redundant copies of data (or " +
    "precomputed/derived values) into a database to improve read performance by avoiding expensive joins or " +
    "aggregations at query time. Normalized schemas eliminate redundancy (each fact stored once) but require " +
    "joins to reassemble data; denormalization duplicates some data so common reads can be served from a " +
    "single place quickly. It trades write complexity and storage (you must keep the copies in sync) for " +
    "faster, simpler reads &mdash; a common optimization in read-heavy systems and a default mindset in many " +
    "NoSQL stores.</p>",
  examples: [
    {
      title: "Example 1: Avoiding a join with a redundant field",
      description: "<p>Store a copy so the hot read needs no join.</p>",
      code: "// Normalized: posts table + users table; every post listing JOINs\n" +
        "//   to users to show the author name (extra work on every read).\n" +
        "// Denormalized: store author_name directly on the post row.\n" +
        "//   -> list posts with no join. Cost: if a user renames, you must\n" +
        "//      update author_name on all their posts (write-time work)."
    },
    {
      title: "Example 2: Precomputed aggregates",
      description: "<p>Store the answer instead of recomputing it.</p>",
      code: "// Instead of COUNT(*) on millions of comments every page load:\n" +
        "//   keep a comment_count column on the post, updated on insert/delete.\n" +
        "// Reads are instant; writes do a little extra bookkeeping.\n" +
        "// (Materialized views are a managed form of this.)"
    }
  ],
  whenToUse: "<p>Denormalize when reads dominate and specific queries are too slow due to joins or aggregations " +
    "&mdash; read-heavy pages, feeds, dashboards, and especially in NoSQL stores (which often <em>require</em> " +
    "denormalized, query-shaped data since they lack joins). Materialized views are a managed way to do it. " +
    "<strong>Gotchas:</strong> the cost is <strong>keeping duplicated data consistent</strong> &mdash; every " +
    "source-of-truth change must update all copies, adding write complexity and risk of drift/anomalies " +
    "(stale copies). It also uses more storage. So denormalize <em>selectively</em>, driven by measured slow " +
    "reads, not by default; start normalized for correctness and denormalize specific hot paths. Be explicit " +
    "about how copies stay in sync (triggers, application logic, events, or scheduled rebuilds), and accept " +
    "the eventual-consistency window that often comes with it.</p>"
};

C["sql-tuning"] = {
  summary: "<p><strong>SQL tuning</strong> is optimizing database performance at the query and schema level &mdash; " +
    "often the cheapest, highest-impact scaling work before reaching for replicas or sharding. The big levers " +
    "are <strong>indexes</strong> (let the DB find rows without scanning the whole table), " +
    "<strong>query optimization</strong> (rewriting queries, avoiding <code>SELECT *</code>, reducing joins/" +
    "subqueries, using the query plan), <strong>schema design</strong> (right data types, normalization vs " +
    "denormalization), and configuration (connection pools, caches). Reading the <strong>EXPLAIN/query " +
    "plan</strong> to find full table scans and missing indexes is the core diagnostic skill.</p>",
  examples: [
    {
      title: "Example 1: Indexing a filtered/joined column",
      description: "<p>An index turns a slow scan into a fast lookup.</p>",
      code: "// Slow: full table scan on every lookup by email\n" +
        "SELECT * FROM users WHERE email = 'a@x.com';   -- scans all rows\n" +
        "\n" +
        "// Add an index -> the DB jumps straight to matching rows\n" +
        "CREATE INDEX idx_users_email ON users(email);\n" +
        "// Index columns used in WHERE, JOIN, ORDER BY. (Indexes cost write\n" +
        "// speed + storage, so index deliberately, not every column.)"
    },
    {
      title: "Example 2: Read the query plan; fix the obvious",
      description: "<p>EXPLAIN reveals scans, bad joins, and missing indexes.</p>",
      code: "EXPLAIN SELECT ... ;  -- shows scans vs index use, row estimates, join order\n" +
        "// Common fixes:\n" +
        "//  - avoid SELECT * -> fetch only needed columns\n" +
        "//  - eliminate N+1 queries -> one join/IN instead of a query per row\n" +
        "//  - add composite indexes matching multi-column filters\n" +
        "//  - paginate with keyset (WHERE id > ?) instead of large OFFSET"
    }
  ],
  whenToUse: "<p>Tune SQL <em>first</em> whenever the database is slow &mdash; it's usually far cheaper and more " +
    "effective than adding hardware, replicas, or sharding, and a single missing index can be the difference " +
    "between 5 seconds and 5 milliseconds. Profile slow queries, read the query plan, add the right indexes, " +
    "and fix N+1 patterns. <strong>Gotchas:</strong> indexes are not free &mdash; each one slows writes and " +
    "uses storage, so index the columns that filtering/joining/sorting actually use, not everything. " +
    "<code>SELECT *</code>, large <code>OFFSET</code> pagination, and N+1 query patterns are common, easily " +
    "fixed culprits. Over-normalization can force too many joins; under-normalization causes anomalies &mdash; " +
    "balance them. Always measure with real data volumes (a query fast on 1k rows can crawl on 10M). Exhaust " +
    "tuning before architectural scaling &mdash; most 'we need to shard' situations are really 'we need an " +
    "index'.</p>"
};

/* ======================================================================
   CACHING
   ====================================================================== */

C["caching"] = {
  summary: "<p><strong>Caching</strong> stores copies of frequently-accessed data in a fast layer (memory) so " +
    "future requests are served quickly without hitting the slower source (database, API, computation). It's " +
    "one of the highest-impact performance techniques: it reduces latency, offloads backends, and absorbs " +
    "traffic spikes. Caches exist at many layers (<strong>client, CDN, web server, application, database</strong>) " +
    "and use various <strong>strategies</strong> for how data is read and written (<strong>cache-aside, " +
    "write-through, write-behind, refresh-ahead</strong>). The central challenge is <strong>invalidation</strong> " +
    "&mdash; keeping cached data fresh enough &mdash; famously 'one of the two hard things in computer science.'</p>",
  examples: [
    {
      title: "Example 1: Cache between app and database",
      description: "<p>Serve hot data from memory; fall back to the DB on a miss.</p>",
      code: "// Read path with a cache (cache-aside):\n" +
        "//   1. check cache -> HIT? return it (fast, ~sub-ms)\n" +
        "//   2. MISS -> query DB -> store in cache (with TTL) -> return\n" +
        "// A high hit ratio means most reads never touch the database."
    },
    {
      title: "Example 2: Layers of caching",
      description: "<p>Caching happens at every level of the stack.</p>",
      code: "// Client cache  -> browser caches assets/responses\n" +
        "// CDN cache     -> edge servers cache static content near users\n" +
        "// Web server    -> reverse proxy caches responses (nginx, Varnish)\n" +
        "// Application   -> in-memory / Redis caches query results, sessions\n" +
        "// Database      -> the DB's own buffer/query cache"
    }
  ],
  whenToUse: "<p>Cache read-heavy, expensive-to-produce, and frequently-requested data &mdash; query results, " +
    "rendered fragments, API responses, computed values, sessions. It's often the single biggest, cheapest " +
    "performance win. <strong>Gotchas:</strong> the hard problems are <strong>invalidation</strong> (stale " +
    "data when the source changes &mdash; use TTLs, event-based invalidation, or versioned keys) and choosing " +
    "<strong>what</strong> to cache (cache the hot, reusable data; caching rarely-reused data wastes memory). " +
    "Watch for cache <strong>stampede</strong> (many simultaneous misses hammering the DB when a popular key " +
    "expires &mdash; mitigate with locks/early refresh) and cache/DB inconsistency. Don't cache " +
    "highly-dynamic, per-user-sensitive data carelessly. The sub-topics cover the strategies (how reads/writes " +
    "interact with the cache) and the layers (where caches live).</p>"
};

C["refresh-ahead"] = {
  summary: "<p><strong>Refresh-ahead</strong> is a caching strategy where the cache <em>proactively</em> " +
    "refreshes popular entries <em>before</em> they expire, predicting they'll be needed again. Instead of " +
    "waiting for an entry to expire and then incurring a cache-miss latency on the next request, the cache " +
    "asynchronously reloads frequently-accessed items as their TTL approaches. The benefit is reduced latency " +
    "(hot data is always fresh and present, so reads rarely miss) and avoidance of stampedes on expiry. The " +
    "risk is wasted work refreshing data that <em>won't</em> actually be requested again, if the prediction " +
    "is wrong.</p>",
  examples: [
    {
      title: "Example 1: Proactive reload before expiry",
      description: "<p>Refresh hot entries ahead of TTL so reads never miss.</p>",
      code: "// Entry TTL = 60s, refresh-ahead factor = 80%\n" +
        "//   at ~48s (80% of TTL), if the entry is being accessed,\n" +
        "//   asynchronously reload it from the source in the background.\n" +
        "// Result: the entry is refreshed BEFORE it would expire, so the\n" +
        "//   next read still HITS (fresh data, no miss latency)."
    },
    {
      title: "Example 2: vs reactive (lazy) refresh",
      description: "<p>Predictive vs on-demand reloading.</p>",
      code: "// Reactive (cache-aside): entry expires -> next request MISSES ->\n" +
        "//   that request waits for the slow source reload (latency spike).\n" +
        "// Refresh-ahead: predicted-hot entry is reloaded in advance ->\n" +
        "//   the request HITS fresh data; no user-facing miss.\n" +
        "// Trade-off: wasted refreshes if the prediction is wrong."
    }
  ],
  whenToUse: "<p>Use refresh-ahead for a relatively small set of <strong>predictably hot</strong> data where " +
    "miss latency is costly and you want consistently low read latency &mdash; popular product pages, trending " +
    "content, frequently-read config. It shines when access patterns are predictable enough that proactive " +
    "refresh usually pays off. <strong>Gotchas:</strong> if predictions are poor, you waste resources " +
    "refreshing entries nobody requests, and the added background load on the source can be significant if " +
    "applied too broadly. It's more complex than simple lazy caching and is a feature of more sophisticated " +
    "caching layers. For data with unpredictable access, cache-aside with reasonable TTLs (plus stampede " +
    "protection) is simpler and usually sufficient. Reserve refresh-ahead for the specific hot keys where the " +
    "latency win clearly justifies the proactive work.</p>"
};

C["write-behind"] = {
  summary: "<p><strong>Write-behind</strong> (write-back) caching writes data to the <em>cache first</em> and " +
    "then asynchronously persists it to the backing store after a delay (often batched). The application gets " +
    "a fast acknowledgment as soon as the cache is updated, while the slower database write happens in the " +
    "background. This dramatically improves write performance and throughput (writes are absorbed by fast " +
    "memory and can be batched/coalesced), but it risks <strong>data loss</strong> if the cache fails before " +
    "the data is flushed to durable storage, and it introduces a window where the cache and database " +
    "disagree.</p>",
  examples: [
    {
      title: "Example 1: Fast ack, deferred persistence",
      description: "<p>Write to cache, return immediately, flush to DB later.</p>",
      code: "// write(key, value):\n" +
        "//   1. update CACHE -> return success immediately (fast!)\n" +
        "//   2. queue the write; a background flush persists to the DB later\n" +
        "//      (often batched: many writes -> fewer DB operations)\n" +
        "// Great for write-heavy bursts; the DB sees a smoothed, batched load."
    },
    {
      title: "Example 2: The durability risk",
      description: "<p>Un-flushed data is lost if the cache dies.</p>",
      code: "// Window of risk: data acked from cache but NOT yet in the DB.\n" +
        "//   cache crashes during this window -> those writes are LOST.\n" +
        "// Mitigations: replicate/persist the cache (e.g. Redis AOF),\n" +
        "//   short flush intervals, or only use for loss-tolerant data."
    }
  ],
  whenToUse: "<p>Use write-behind for write-heavy workloads where write latency/throughput matters and some " +
    "durability risk is acceptable or mitigated &mdash; high-frequency counters, metrics, logs, analytics " +
    "events, or buffering bursty writes to protect the database. Batching is a major benefit (turning many " +
    "small writes into fewer, larger DB operations). <strong>Gotchas:</strong> the core risk is " +
    "<strong>data loss</strong> in the gap between cache ack and DB flush &mdash; never use it for critical " +
    "data (payments, orders) without strong cache durability (persistence/replication). The cache and DB are " +
    "temporarily inconsistent, and reads bypassing the cache may see stale data. It's more complex than " +
    "write-through. For data where every write must be durably persisted before acknowledging, use " +
    "<strong>write-through</strong> instead; reserve write-behind for performance-critical, loss-tolerant (or " +
    "well-protected) writes.</p>"
};

C["write-through"] = {
  summary: "<p><strong>Write-through</strong> caching writes data to <em>both</em> the cache and the backing " +
    "store <strong>synchronously</strong> as part of the same operation &mdash; the write isn't acknowledged " +
    "until both succeed. This keeps the cache and database always consistent and ensures durability (data is " +
    "in the persistent store immediately), so subsequent reads hit a fresh cache. The trade-off is higher " +
    "write latency (every write pays for both the cache and the slower DB write), and you may cache data " +
    "that's never read again (write-through populates the cache on every write regardless of read demand).</p>",
  examples: [
    {
      title: "Example 1: Synchronous double write",
      description: "<p>Update cache and DB together; ack only when both succeed.</p>",
      code: "// write(key, value):\n" +
        "//   1. write to DB        (durable)\n" +
        "//   2. write to CACHE     (now consistent + warm)\n" +
        "//   3. return success     (only after BOTH)\n" +
        "// Reads afterward HIT a cache that already matches the DB."
    },
    {
      title: "Example 2: Consistency vs latency trade-off",
      description: "<p>Always-fresh cache, but slower writes.</p>",
      code: "// Pro: cache never serves stale data after a write; durable immediately.\n" +
        "// Con: every write waits on the DB (no speedup for writes), and you\n" +
        "//   cache items that might never be read (wasted cache space).\n" +
        "// Often paired with cache-aside reads, or write-behind for speed."
    }
  ],
  whenToUse: "<p>Use write-through when read-after-write consistency and durability matter and you want the " +
    "cache to always reflect the database &mdash; data that's written and then frequently read, where serving " +
    "stale data after a write would be a problem. It's safer than write-behind (no loss window) and keeps the " +
    "cache warm and correct. <strong>Gotchas:</strong> it adds latency to <em>every</em> write (you pay for " +
    "both stores) and doesn't speed writes up at all &mdash; if write performance is the concern, write-behind " +
    "is better (at a durability cost). It also caches everything written, even rarely-read data, potentially " +
    "wasting cache space (a write-allocate concern). Frequently it's combined with cache-aside reads. Choose " +
    "write-through when correctness/consistency of the cache is the priority; choose write-behind when write " +
    "speed is, and cache-aside when you only want to cache on read.</p>"
};

C["cache-aside"] = {
  summary: "<p><strong>Cache-aside</strong> (lazy loading) is the most common caching pattern: the " +
    "<em>application</em> manages the cache explicitly. On a read, the app first checks the cache; on a " +
    "<strong>hit</strong> it returns the cached value, and on a <strong>miss</strong> it loads from the " +
    "database, stores the result in the cache (with a TTL), and returns it. Writes go to the database, and the " +
    "app <em>invalidates</em> (or updates) the cache entry. The cache only ever holds data that's actually " +
    "been requested ('lazy'), which is memory-efficient, and the application has full control &mdash; but it's " +
    "also responsible for keeping the cache and DB consistent.</p>",
  examples: [
    {
      title: "Example 1: The read path",
      description: "<p>Check cache, fall back to DB on a miss, then populate.</p>",
      code: "function getUser(id) {\n" +
        "  let user = cache.get('user:' + id);\n" +
        "  if (user) return user;                 // HIT\n" +
        "  user = db.query('SELECT ... WHERE id=?', id); // MISS -> load\n" +
        "  cache.set('user:' + id, user, { ttl: 300 });  // populate (5 min)\n" +
        "  return user;\n" +
        "}"
    },
    {
      title: "Example 2: Writes invalidate the cache",
      description: "<p>Update the source of truth, then evict the stale entry.</p>",
      code: "function updateUser(id, changes) {\n" +
        "  db.update(id, changes);          // DB is the source of truth\n" +
        "  cache.delete('user:' + id);      // invalidate -> next read reloads fresh\n" +
        "}\n" +
        "// (Deleting is safer than updating the cache to avoid race conditions.)"
    }
  ],
  whenToUse: "<p>Cache-aside is the default, general-purpose caching strategy &mdash; use it for read-heavy data " +
    "where you want to cache only what's actually accessed and keep full control in the application. It pairs " +
    "naturally with Redis/Memcached in front of a database. <strong>Gotchas:</strong> the first request for " +
    "any key always misses (cold cache), and a burst of misses on a popular expired key can cause a " +
    "<strong>cache stampede</strong> hammering the DB (mitigate with locks/single-flight or refresh-ahead). " +
    "Keeping cache and DB consistent is the app's job &mdash; prefer <em>invalidating</em> (deleting) on write " +
    "over updating the cache, to avoid races where stale data gets re-cached. Set sensible TTLs as a safety " +
    "net against missed invalidations. It's the same 'Cache-Aside' that appears as an Azure cloud design " +
    "pattern. Combine with write-through/write-behind for the write path as needed.</p>"
};

C["client-caching"] = {
  summary: "<p><strong>Client caching</strong> stores data on the client (browser, mobile app, or device) so " +
    "it doesn't need to be re-fetched from the server. In the browser this includes the HTTP cache (governed " +
    "by <code>Cache-Control</code>, <code>ETag</code>, <code>Expires</code> headers), <code>localStorage</code>/" +
    "<code>IndexedDB</code>, and service worker caches. It's the closest cache to the user, so a hit is the " +
    "fastest possible (no network at all) and it offloads your servers entirely. The trade-offs are limited " +
    "control (you can't directly purge a client's cache) and the need to manage staleness via cache headers " +
    "and versioning.</p>",
  examples: [
    {
      title: "Example 1: HTTP caching headers",
      description: "<p>Tell the browser how long it may reuse a response.</p>",
      code: "// Long-cache immutable, versioned assets (hashed filenames):\n" +
        "Cache-Control: public, max-age=31536000, immutable   // app.a1b2c3.js\n" +
        "\n" +
        "// Revalidate dynamic content with ETags (conditional requests):\n" +
        "ETag: \"v42\"\n" +
        "// next request: If-None-Match: \"v42\" -> 304 Not Modified (no body resent)"
    },
    {
      title: "Example 2: Versioning to bust the cache",
      description: "<p>New content = new URL, so clients fetch fresh.</p>",
      code: "// Because you can't purge a client's cache, change the URL:\n" +
        "//   <script src=\"/app.a1b2c3.js\">   (hash changes when code changes)\n" +
        "// Old cached app.OLDHASH.js is simply never requested again.\n" +
        "// Pattern: long max-age on hashed assets + short/no-cache on the HTML."
    }
  ],
  whenToUse: "<p>Use client caching for static assets (JS/CSS/images/fonts), and for API responses or data the " +
    "client can safely reuse &mdash; it's the fastest cache (no network) and the cheapest (zero server load). " +
    "Set <code>Cache-Control</code> deliberately: long max-age for versioned/immutable assets, revalidation " +
    "(ETag/Last-Modified) for things that change, and no-cache/short for HTML and per-user data. " +
    "<strong>Gotchas:</strong> you <em>can't purge</em> a client's cache, so use <strong>versioned/hashed " +
    "URLs</strong> to force updates &mdash; otherwise users get stale assets after a deploy (a classic bug). " +
    "Never client-cache sensitive or per-user private data with <code>public</code> caching (it can be stored " +
    "or shared inappropriately). Be careful caching HTML that references hashed assets (cache the HTML " +
    "briefly, the assets forever). Client caching complements, not replaces, server/CDN caching.</p>"
};

C["cdn-caching"] = {
  summary: "<p><strong>CDN caching</strong> stores content on geographically distributed edge servers close to " +
    "users, so requests are served from a nearby edge instead of your origin. It dramatically reduces latency " +
    "for static and cacheable content, offloads your origin (most requests never reach it), saves bandwidth, " +
    "and absorbs traffic spikes and some DDoS. Edges cache per <code>Cache-Control</code>/TTL and fetch from " +
    "origin on a miss (pull) or hold pre-uploaded content (push). It's a layer of caching specifically about " +
    "<em>location</em> &mdash; bringing content physically closer to the user. (See also Content Delivery " +
    "Networks.)</p>",
  examples: [
    {
      title: "Example 1: Edge serves the user; origin is spared",
      description: "<p>A cache hit at the edge never touches your servers.</p>",
      code: "// User -> nearest CDN edge\n" +
        "//   HIT  -> served from edge (~ms, no origin load)\n" +
        "//   MISS -> edge pulls from origin once -> caches (TTL) -> serves\n" +
        "// At scale, a 95%+ edge hit ratio means your origin sees a fraction\n" +
        "// of total traffic."
    },
    {
      title: "Example 2: Controlling and invalidating edge cache",
      description: "<p>Headers set TTL; versioning/purge handle updates.</p>",
      code: "// Origin sets edge cache lifetime:\n" +
        "//   Cache-Control: public, max-age=86400   // edge caches for a day\n" +
        "// Update content via:\n" +
        "//   - versioned URLs (new URL = guaranteed fresh), or\n" +
        "//   - explicit purge/invalidation API for a path"
    }
  ],
  whenToUse: "<p>Use CDN caching for any content served to a geographically distributed audience that can be " +
    "cached at the edge &mdash; static assets, media, downloads, and cacheable page/API responses. It's " +
    "near-mandatory for global web performance and scale. <strong>Gotchas:</strong> the central challenge is " +
    "<strong>invalidation</strong> &mdash; edges keep serving old content until TTL expiry or an explicit " +
    "purge, so use versioned URLs for instant updates and purge sparingly. Be very careful not to cache " +
    "<strong>private/per-user content</strong> at the edge (a wrong <code>Cache-Control: public</code> can " +
    "leak one user's data to others &mdash; a serious bug); mark such responses <code>private</code>/" +
    "<code>no-store</code>. Tune TTLs by content type (long for immutable assets, short/zero for dynamic). " +
    "CDN caching handles the <em>location</em> dimension; combine it with application and database caching for " +
    "the full picture.</p>"
};

C["web-server-caching"] = {
  summary: "<p><strong>Web server caching</strong> caches responses at the web server / reverse proxy layer " +
    "(Nginx, Apache, Varnish) &mdash; in front of your application servers but behind the CDN. The proxy " +
    "stores full HTTP responses (or fragments) and serves repeat requests directly from its cache without " +
    "invoking the application or database. This offloads your app tier, reduces latency, and can also handle " +
    "compression and SSL. It's especially effective for content that's the same for many users (anonymous " +
    "pages, public API responses) and is a fast, centralized cache layer you fully control (unlike client " +
    "caches).</p>",
  examples: [
    {
      title: "Example 1: Reverse proxy caches full responses",
      description: "<p>Repeat requests are served by the proxy, sparing the app.</p>",
      code: "// Request -> [nginx/Varnish cache]\n" +
        "//   HIT  -> return cached response (app/DB never invoked)\n" +
        "//   MISS -> forward to app -> cache the response -> return\n" +
        "// Great for pages/responses identical across users (homepage,\n" +
        "// product pages for anonymous visitors, public API GETs)."
    },
    {
      title: "Example 2: Caching dynamic content carefully",
      description: "<p>Micro-caching and varying by key avoid serving wrong data.</p>",
      code: "// Micro-caching: cache even 'dynamic' pages for a few SECONDS\n" +
        "//   -> a burst of identical requests is served once, hugely cutting load,\n" +
        "//      with at most a few seconds of staleness.\n" +
        "// Vary the cache key (cookie/auth) so logged-in users aren't served\n" +
        "//   another user's cached page."
    }
  ],
  whenToUse: "<p>Use web server / reverse proxy caching to offload your application tier for responses that are " +
    "shared across users or change infrequently &mdash; anonymous pages, public listings, static API " +
    "responses. Even <strong>micro-caching</strong> (caching for a few seconds) can absorb huge bursts of " +
    "identical requests with minimal staleness. It's centralized and fully under your control. " +
    "<strong>Gotchas:</strong> the danger is caching <strong>user-specific content</strong> and serving it to " +
    "the wrong user &mdash; cache only safe responses, and key/vary the cache by auth/cookie so logged-in " +
    "users bypass or get isolated caches. Invalidation is your responsibility (TTLs, purge on change). It sits " +
    "between CDN and app, so coordinate cache headers across layers. For per-user dynamic data, prefer " +
    "application-level caching (cache the data, not the whole rendered response).</p>"
};

C["database-caching"] = {
  summary: "<p><strong>Database caching</strong> refers to caching at or near the database to speed up reads. " +
    "This includes the database's own internal caches (the <strong>buffer pool</strong> that keeps hot pages " +
    "in memory, query plan caches, and in some engines a query result cache) and external caches placed in " +
    "front of the DB. Most of the buffer-pool caching is automatic &mdash; the database keeps frequently-" +
    "accessed data in RAM so reads avoid disk I/O &mdash; and tuning its size is a key performance lever. " +
    "Beyond the built-in caches, teams add a dedicated cache layer (Redis) in front for application-level " +
    "results.</p>",
  examples: [
    {
      title: "Example 1: The buffer pool (automatic caching)",
      description: "<p>The DB keeps hot data in RAM to avoid slow disk reads.</p>",
      code: "// A read for a frequently-accessed row:\n" +
        "//   data already in the buffer pool (RAM) -> served fast, no disk I/O\n" +
        "//   not cached -> read from disk -> placed in buffer pool for next time\n" +
        "// Tuning the buffer pool size (e.g. innodb_buffer_pool_size) so the\n" +
        "// working set fits in memory is one of the biggest DB perf wins."
    },
    {
      title: "Example 2: External cache vs DB's own cache",
      description: "<p>Add an app-managed cache to offload the DB entirely.</p>",
      code: "// DB internal cache: speeds up queries that still hit the DB engine.\n" +
        "// External cache (Redis, cache-aside): repeat reads skip the DB\n" +
        "//   ENTIRELY -> far less DB load and lower latency than even a\n" +
        "//   buffer-pool hit (no SQL parsing/execution at all)."
    }
  ],
  whenToUse: "<p>Rely on the database's built-in caching always (it's automatic) and <strong>tune the buffer " +
    "pool</strong> so your hot working set fits in RAM &mdash; this is a major, low-effort win for read " +
    "performance. Add an <strong>external cache</strong> (Redis cache-aside) when you want to offload the DB " +
    "further, reduce repeated identical queries, or cache computed/aggregated results the DB would recompute. " +
    "<strong>Gotchas:</strong> the DB's internal query-result cache (where it exists, e.g. older MySQL) is " +
    "often more trouble than it's worth (invalidation overhead, contention) and has been removed in modern " +
    "versions &mdash; don't rely on it; use an external cache instead. Buffer-pool caching only helps if the " +
    "machine has enough RAM for the working set. An external cache shifts invalidation responsibility to your " +
    "application. Combine DB tuning, an external app cache, and proper indexing for read-heavy systems.</p>"
};

C["application-caching"] = {
  summary: "<p><strong>Application caching</strong> is caching managed by your application code, typically in " +
    "an in-memory store (a local process cache, or a shared cache like <strong>Redis</strong>/Memcached). The " +
    "app explicitly stores and retrieves computed results, query outputs, session data, rendered fragments, " +
    "or any expensive-to-produce value. It's the most flexible caching layer because you control exactly what, " +
    "when, and how to cache and invalidate. A shared cache (Redis) is preferred over per-process local caches " +
    "in horizontally-scaled systems so all servers see the same cached data and there's no duplication or " +
    "inconsistency across instances.</p>",
  examples: [
    {
      title: "Example 1: Caching an expensive computation",
      description: "<p>Compute once, reuse from the cache (cache-aside).</p>",
      code: "function getDashboard(userId) {\n" +
        "  const key = 'dash:' + userId;\n" +
        "  let data = redis.get(key);\n" +
        "  if (data) return JSON.parse(data);        // HIT\n" +
        "  data = buildExpensiveDashboard(userId);   // heavy DB + compute\n" +
        "  redis.set(key, JSON.stringify(data), 'EX', 60); // cache 60s\n" +
        "  return data;\n" +
        "}"
    },
    {
      title: "Example 2: Shared (Redis) vs local in-process cache",
      description: "<p>In a multi-server setup, prefer a shared cache.</p>",
      code: "// Local in-process cache: fastest, but each server has its OWN copy\n" +
        "//   -> N servers = N caches, inconsistent, low hit ratio, hard to invalidate.\n" +
        "// Shared cache (Redis): all servers read/write one cache\n" +
        "//   -> consistent, high hit ratio, central invalidation.\n" +
        "// Common combo: small local cache + shared Redis behind it."
    }
  ],
  whenToUse: "<p>Use application caching for expensive or frequently-reused computed values, query results, " +
    "session data, aggregations, and anything you'd rather not recompute &mdash; it's the most controllable " +
    "and widely-used cache layer. In horizontally-scaled systems, use a <strong>shared cache (Redis)</strong> " +
    "so all instances share state. <strong>Gotchas:</strong> a per-process local cache in a multi-server " +
    "deployment causes inconsistency (each server caches independently) and low hit ratios &mdash; prefer a " +
    "shared cache, or use local caches only for truly immutable data. You own invalidation (TTLs + event/" +
    "write-based eviction) and consistency between cache and source. Watch memory limits and eviction policies " +
    "(LRU), serialization cost, and cache stampedes on hot keys. Cache the data, not whole rendered responses, " +
    "when you need per-user flexibility. It's the application-managed counterpart to the automatic DB/CDN " +
    "caches.</p>"
};

/* ======================================================================
   ASYNCHRONISM
   ====================================================================== */

C["asynchronism"] = {
  summary: "<p><strong>Asynchronism</strong> decouples work in time: instead of doing everything within a " +
    "request while the user waits, you hand work off to be processed later, so the request returns quickly. " +
    "The core tools are <strong>message queues</strong> (durable buffers that hold work/events for consumers) " +
    "and <strong>task queues</strong> (queues of jobs for worker pools), plus <strong>back pressure</strong> " +
    "(mechanisms to prevent producers from overwhelming consumers). Asynchronous processing improves perceived " +
    "performance, smooths load spikes (the queue absorbs bursts), enables reliable retries, and lets " +
    "components scale independently &mdash; at the cost of added infrastructure and eventual-consistency " +
    "complexity.</p>",
  examples: [
    {
      title: "Example 1: Move slow work off the request path",
      description: "<p>Enqueue and respond fast; a worker does the heavy work.</p>",
      code: "// Synchronous: user waits while we resize images + send email (slow)\n" +
        "// Asynchronous:\n" +
        "//   request -> enqueue 'process-upload' job -> respond 202 immediately\n" +
        "//   worker pool -> consumes job -> resizes, emails -> updates status\n" +
        "// The user isn't blocked; workers scale to the backlog."
    },
    {
      title: "Example 2: Queue as a shock absorber",
      description: "<p>A buffer smooths bursty load so backends aren't overwhelmed.</p>",
      code: "// 50,000 events arrive in a spike:\n" +
        "//   [API] --enqueue all--> [ queue ] --steady drip--> [workers x10]\n" +
        "// The queue buffers the burst; workers process at a sustainable rate\n" +
        "// instead of the database collapsing under simultaneous load."
    }
  ],
  whenToUse: "<p>Use asynchronism when work is slow, bursty, retryable, or doesn't need an immediate result &mdash; " +
    "media processing, emails/notifications, report generation, data pipelines, and any spike-prone workload " +
    "you want to smooth. It keeps requests fast and the system resilient. <strong>Gotchas:</strong> you take " +
    "on a queue/broker as critical infrastructure and shift to eventually-consistent, harder-to-trace flows. " +
    "Consumers must be <strong>idempotent</strong> (messages can be delivered more than once) and you must " +
    "handle failures (retries, dead-letter queues), ordering, and <strong>back pressure</strong> (a fast " +
    "producer mustn't overwhelm slow consumers or an unbounded queue). Returning results to users becomes " +
    "async (polling/webhooks/push). For simple, fast, immediate request/response, synchronous is simpler &mdash; " +
    "don't queue everything. The sub-topics cover back pressure, task queues, and message queues.</p>"
};

C["back-pressure"] = {
  summary: "<p><strong>Back pressure</strong> is a mechanism by which a system under load signals upstream " +
    "producers to <em>slow down</em>, preventing them from overwhelming downstream consumers or filling " +
    "unbounded buffers. When work arrives faster than it can be processed, an unbounded queue grows until " +
    "memory is exhausted and the system crashes; back pressure instead bounds the queue and pushes the strain " +
    "back to the source &mdash; by blocking, rejecting requests (e.g. HTTP 429/503), dropping low-priority " +
    "work, or signaling the producer to throttle. It's essential for stability and graceful degradation under " +
    "overload.</p>",
  examples: [
    {
      title: "Example 1: Bounded queue rejects instead of exploding",
      description: "<p>A full buffer pushes back rather than consuming all memory.</p>",
      code: "// Unbounded (bad): queue grows forever under overload -> OOM crash\n" +
        "// Bounded with back pressure (good):\n" +
        "//   queue has max size N. When full:\n" +
        "//     - reject new work (return 429/503 'try later'), or\n" +
        "//     - block the producer until space frees up, or\n" +
        "//     - shed/drop low-priority items\n" +
        "// The system stays alive and degrades gracefully."
    },
    {
      title: "Example 2: Reactive streams style signaling",
      description: "<p>The consumer tells the producer how much it can take.</p>",
      code: "// Pull/demand-based flow control:\n" +
        "//   consumer: 'send me 10 more items' (request(10))\n" +
        "//   producer sends at most 10, then waits for the next demand signal.\n" +
        "// The consumer's capacity governs the producer's rate -> no overload."
    }
  ],
  whenToUse: "<p>Apply back pressure anywhere a fast producer can outpace a slower consumer &mdash; queues, " +
    "stream processing, API ingestion, service-to-service calls, any pipeline. It's what keeps a system from " +
    "collapsing under overload and is the foundation of graceful degradation. <strong>Gotchas:</strong> the " +
    "most common failure is an <strong>unbounded queue/buffer</strong> that masks the problem until it " +
    "exhausts memory and crashes &mdash; always bound your queues and decide what happens when they're full " +
    "(reject, block, or shed load). Rejecting work (load shedding) is often better than degrading everyone; " +
    "return clear signals (429 with <code>Retry-After</code>) so clients back off. Back pressure must " +
    "propagate end-to-end &mdash; relieving it at one stage while an upstream stage keeps pushing just moves " +
    "the bottleneck. Pair it with retries+backoff on the producer side (and beware retry storms amplifying " +
    "load).</p>"
};

C["task-queues"] = {
  summary: "<p><strong>Task queues</strong> hold units of work (jobs) to be executed asynchronously by a pool " +
    "of <strong>workers</strong>. A producer enqueues a task (e.g. 'resize image #88'); workers pull tasks " +
    "and execute them, typically with support for retries, scheduling/delays, priorities, and result " +
    "tracking. Task queues (Celery, Sidekiq, Bull, RabbitMQ-based systems) are the standard way to run " +
    "background jobs: they decouple slow work from the request path, distribute it across workers (scale by " +
    "adding workers), and provide reliability (failed tasks retry). Each task is usually processed by exactly " +
    "one worker (competing consumers).</p>",
  examples: [
    {
      title: "Example 1: Enqueue a job, workers process it",
      description: "<p>Producers add tasks; a worker pool consumes them.</p>",
      code: "// Producer (web request):\n" +
        "queue.enqueue('send_email', { to: 'a@x.com', template: 'welcome' });\n" +
        "//   -> returns immediately; the email is sent in the background\n" +
        "\n" +
        "// Worker process (one of many):\n" +
        "//   loop: take next task -> execute -> ack (or retry on failure)\n" +
        "// Scale throughput by running more worker processes."
    },
    {
      title: "Example 2: Retries, delays, priorities",
      description: "<p>Task queues add reliability features around jobs.</p>",
      code: "// queue.enqueue('charge_card', payload, {\n" +
        "//   retries: 3, backoff: 'exponential',  // retry transient failures\n" +
        "//   delay: '5m',                          // run later\n" +
        "//   priority: 'high'                      // jump ahead of low-pri work\n" +
        "// })\n" +
        "// Failed-after-retries tasks go to a dead-letter queue for inspection."
    }
  ],
  whenToUse: "<p>Use task queues for any background job &mdash; sending emails, processing uploads, generating " +
    "reports, calling slow third-party APIs, scheduled/deferred work. They keep requests fast, distribute " +
    "load across scalable workers, and add reliability (retries, dead-letter queues). <strong>Gotchas:</strong> " +
    "tasks can be delivered/run more than once (at-least-once semantics + retries), so make them " +
    "<strong>idempotent</strong> &mdash; re-running 'charge_card' must not double-charge. Handle failures " +
    "explicitly (retry with backoff, then dead-letter) rather than losing jobs silently. Monitor " +
    "<strong>queue depth</strong> and worker health &mdash; a growing backlog signals you need more workers or " +
    "that workers are failing. Watch for poison messages (a task that always fails and blocks/retries " +
    "forever). Long tasks should be chunked or checkpointed. Task queues are the workhorse of asynchronous " +
    "processing.</p>"
};

C["message-queues"] = {
  summary: "<p><strong>Message queues</strong> are infrastructure for asynchronous communication: producers " +
    "send <strong>messages</strong> to a queue, and consumers receive and process them, decoupled in time, " +
    "space, and rate. The queue durably buffers messages, smoothing load and surviving consumer downtime. " +
    "There are two broad delivery models: <strong>point-to-point</strong> (each message goes to exactly one " +
    "consumer &mdash; work distribution) and <strong>publish-subscribe</strong> (each message is broadcast to " +
    "all interested subscribers &mdash; fan-out). Examples: RabbitMQ, Amazon SQS, Apache Kafka (a log-based " +
    "stream). Message queues are the communication backbone of event-driven and microservice architectures.</p>",
  examples: [
    {
      title: "Example 1: Producers, queue, consumers",
      description: "<p>A durable buffer decouples sender from receiver.</p>",
      code: "// Producer sends; queue holds; consumer processes at its own pace:\n" +
        "//   [Producer] --send--> [ Queue (durable) ] --deliver--> [Consumer]\n" +
        "// Consumer down? Messages wait safely in the queue until it's back.\n" +
        "// Producer fast / consumer slow? The queue buffers the difference."
    },
    {
      title: "Example 2: Point-to-point vs pub/sub",
      description: "<p>Deliver to one worker, or broadcast to many subscribers.</p>",
      code: "// Point-to-point (work queue): each message -> ONE consumer\n" +
        "//   'resize-image' -> exactly one of [worker1, worker2, worker3]\n" +
        "// Pub/Sub (topic): each message -> ALL subscribers (a copy each)\n" +
        "//   'OrderPlaced' -> email svc AND inventory svc AND analytics svc"
    }
  ],
  whenToUse: "<p>Use message queues to decouple services, process work asynchronously, buffer bursty load, " +
    "broadcast events to multiple consumers, and add reliability (durability + retries) &mdash; the foundation " +
    "of event-driven and microservice systems. Choose <strong>point-to-point</strong> for distributing tasks " +
    "to workers and <strong>pub/sub</strong> for fanning events out to many interested parties; choose a " +
    "log-based broker (Kafka) when you need retained, replayable, ordered streams. <strong>Gotchas:</strong> " +
    "a broker is critical infrastructure to run and monitor. You must design for messaging realities: " +
    "<strong>at-least-once delivery</strong> means duplicates happen, so consumers must be " +
    "<strong>idempotent</strong>; ordering is not guaranteed across partitions; handle failures with " +
    "dead-letter queues; and watch queue depth. For simple synchronous request/response where the caller " +
    "needs an immediate answer, a direct call is simpler than a queue.</p>"
};

/* ======================================================================
   IDEMPOTENT OPERATIONS
   ====================================================================== */

C["idempotent-operations"] = {
  summary: "<p>An <strong>idempotent</strong> operation produces the <em>same result</em> whether it's " +
    "performed once or many times &mdash; repeating it has no additional effect. This property is critical in " +
    "distributed systems because failures, retries, and at-least-once message delivery mean operations " +
    "<em>will</em> sometimes execute more than once. If 'charge the customer $50' is idempotent, a retried " +
    "request won't double-charge. Idempotency is achieved with techniques like unique <strong>idempotency " +
    "keys</strong>, conditional updates, and designing operations to be naturally repeatable (e.g. " +
    "<code>set x = 5</code> is idempotent; <code>increment x</code> is not).</p>",
  examples: [
    {
      title: "Example 1: Idempotent vs non-idempotent",
      description: "<p>Some operations are safe to repeat; others aren't.</p>",
      code: "// Idempotent: set balance = 100   (running it again -> still 100)\n" +
        "//             DELETE /orders/42    (already deleted -> still deleted)\n" +
        "//             PUT /users/7 {...}   (full replace -> same end state)\n" +
        "// NOT idempotent: balance += 50    (each run adds again -> wrong)\n" +
        "//                 POST /orders     (each call creates a NEW order)"
    },
    {
      title: "Example 2: Idempotency keys",
      description: "<p>A client-supplied key dedupes retried requests.</p>",
      code: "// Client sends a unique key with the request:\n" +
        "//   POST /charges  Idempotency-Key: 'req-abc-123'\n" +
        "// Server: if it has already processed 'req-abc-123',\n" +
        "//   return the SAME stored result instead of charging again.\n" +
        "// Retries (network timeout, duplicate delivery) are now safe."
    }
  ],
  whenToUse: "<p>Make operations idempotent whenever they can be retried or redelivered &mdash; which in " +
    "distributed systems is nearly all important write operations: payment processing, message/queue " +
    "consumers, webhook handlers, API endpoints clients might retry, and background jobs. It's what makes " +
    "'just retry on failure' safe. <strong>Techniques and gotchas:</strong> use server-side " +
    "<strong>idempotency keys</strong> (store processed request ids and return the cached result on repeat), " +
    "prefer naturally-idempotent operations (set/replace over increment; <code>PUT</code>/<code>DELETE</code> " +
    "are idempotent by HTTP semantics, <code>POST</code> is not), and use conditional updates (optimistic " +
    "concurrency, unique constraints). Non-idempotent operations under retries cause the classic " +
    "double-charge/duplicate-order bugs. Idempotency is the cornerstone of reliable retries, exactly-once " +
    "<em>effects</em> (despite at-least-once delivery), and safe distributed processing.</p>"
};

/* ======================================================================
   COMMUNICATION
   ====================================================================== */

C["communication"] = {
  summary: "<p><strong>Communication</strong> covers the protocols and styles systems use to talk to each " +
    "other. At the transport layer, <strong>TCP</strong> (reliable, ordered, connection-based) and " +
    "<strong>UDP</strong> (fast, connectionless, best-effort) underpin everything. At the application layer, " +
    "<strong>HTTP</strong> is the web's request/response protocol, and on top of it sit API styles: " +
    "<strong>REST</strong> (resource-based over HTTP), <strong>RPC</strong> (call remote functions), " +
    "<strong>gRPC</strong> (high-performance binary RPC over HTTP/2), and <strong>GraphQL</strong> (flexible " +
    "client-driven queries). Choosing the right protocol/style shapes performance, coupling, and developer " +
    "experience.</p>",
  examples: [
    {
      title: "Example 1: The layers of communication",
      description: "<p>Transport protocols underpin application-level styles.</p>",
      code: "// Transport:    TCP (reliable) / UDP (fast, lossy)\n" +
        "// Application:  HTTP (on TCP)\n" +
        "// API styles:   REST (resources), RPC/gRPC (methods), GraphQL (queries)\n" +
        "// Each higher layer builds on the one below."
    },
    {
      title: "Example 2: Choosing an API style",
      description: "<p>Different styles fit different needs.</p>",
      code: "// REST:    public/web APIs, CRUD over HTTP, cacheable, ubiquitous\n" +
        "// gRPC:    internal service-to-service, high performance, typed contracts\n" +
        "// GraphQL: clients need flexible, exact data shapes (mobile, varied UIs)\n" +
        "// Pick based on consumers, performance, and coupling needs."
    }
  ],
  whenToUse: "<p>Choose communication mechanisms per relationship: <strong>HTTP/REST</strong> for public APIs " +
    "and broad compatibility, <strong>gRPC</strong> for efficient internal service-to-service calls with " +
    "typed contracts, <strong>GraphQL</strong> when diverse clients need flexible/precise data and you want " +
    "to avoid over/under-fetching, and raw <strong>TCP/UDP</strong> for custom or latency-critical protocols. " +
    "<strong>Gotchas:</strong> understand the transport trade-off (TCP reliability vs UDP speed) since it " +
    "underlies the rest. Synchronous request/response (REST/gRPC) couples caller and callee in time &mdash; " +
    "for decoupling and resilience, consider asynchronous messaging instead. Each style has costs: REST can " +
    "be chatty/over-fetch, GraphQL adds server complexity and caching challenges, gRPC is less " +
    "browser/human-friendly. Match the choice to the consumer and performance needs rather than defaulting to " +
    "one everywhere. The sub-topics detail each protocol and style.</p>"
};

C["http"] = {
  summary: "<p><strong>HTTP (HyperText Transfer Protocol)</strong> is the foundational request/response " +
    "protocol of the web, running over TCP (HTTP/1.1, HTTP/2) or QUIC/UDP (HTTP/3). A client sends a request " +
    "(method + URL + headers + optional body) and the server returns a response (status code + headers + " +
    "body). It's <strong>stateless</strong> (each request is independent; state is carried via cookies/" +
    "tokens). Key elements: <strong>methods</strong> (GET, POST, PUT, DELETE, PATCH), <strong>status " +
    "codes</strong> (2xx success, 3xx redirect, 4xx client error, 5xx server error), and <strong>headers</strong> " +
    "(content type, caching, auth). It underpins REST, GraphQL, and most web APIs.</p>",
  examples: [
    {
      title: "Example 1: A request and response",
      description: "<p>Method, path, headers, body in; status, headers, body out.</p>",
      code: "// Request\n" +
        "GET /api/users/7 HTTP/1.1\n" +
        "Host: example.com\n" +
        "Authorization: Bearer <token>\n" +
        "\n" +
        "// Response\n" +
        "HTTP/1.1 200 OK\n" +
        "Content-Type: application/json\n" +
        "Cache-Control: max-age=60\n" +
        "{ \"id\": 7, \"name\": \"Sam\" }"
    },
    {
      title: "Example 2: Methods and status codes carry meaning",
      description: "<p>Use the right verb and status to be correct and cacheable.</p>",
      code: "// Methods: GET (read, safe+idempotent), POST (create), PUT (replace,\n" +
        "//   idempotent), PATCH (partial), DELETE (idempotent)\n" +
        "// Status:  200 OK, 201 Created, 204 No Content, 301/302 redirect,\n" +
        "//   400 Bad Request, 401 Unauthorized, 404 Not Found,\n" +
        "//   429 Too Many Requests, 500 Server Error, 503 Unavailable"
    }
  ],
  whenToUse: "<p>HTTP is the default for web and most API communication &mdash; you use it constantly. Use its " +
    "semantics correctly: appropriate <strong>methods</strong> (GET for reads so they're cacheable/safe; " +
    "PUT/DELETE for idempotent operations), meaningful <strong>status codes</strong>, and proper " +
    "<strong>caching headers</strong>. Prefer HTTP/2 or HTTP/3 for multiplexing and performance. " +
    "<strong>Gotchas:</strong> HTTP is stateless, so don't assume server-side per-connection state &mdash; " +
    "carry identity via tokens/cookies. Misusing methods/status codes breaks caching, retries, and client " +
    "expectations (e.g. a GET that mutates data is a bug; returning 200 on an error confuses clients). Always " +
    "use HTTPS (TLS) in production. Head-of-line blocking in HTTP/1.1 hurts performance (HTTP/2 multiplexing " +
    "helps; HTTP/3 over QUIC avoids TCP head-of-line blocking). It's the substrate for REST, GraphQL, and " +
    "gRPC (over HTTP/2).</p>"
};

C["tcp"] = {
  summary: "<p><strong>TCP (Transmission Control Protocol)</strong> is a connection-oriented transport protocol " +
    "that provides <strong>reliable, ordered, error-checked</strong> delivery of a byte stream between two " +
    "endpoints. It establishes a connection via a three-way handshake, guarantees that data arrives complete " +
    "and in order (retransmitting lost packets, reassembling out-of-order ones), and provides flow control " +
    "and congestion control. These guarantees make it the backbone of most internet communication (HTTP, " +
    "email, file transfer, database connections) &mdash; but they add overhead and latency compared to UDP, " +
    "which trades reliability for speed.</p>",
  examples: [
    {
      title: "Example 1: Reliable, ordered byte stream",
      description: "<p>TCP guarantees delivery and order; you get the data intact.</p>",
      code: "// 3-way handshake establishes the connection:\n" +
        "//   client -> SYN -> server -> SYN-ACK -> client -> ACK -> connected\n" +
        "// Then a reliable byte stream:\n" +
        "//   lost packet? -> retransmitted automatically\n" +
        "//   out of order? -> reassembled in order before delivery\n" +
        "//   -> the application receives a clean, complete, ordered stream."
    },
    {
      title: "Example 2: The cost of reliability",
      description: "<p>Guarantees mean handshakes, acks, and ordering overhead.</p>",
      code: "// Overhead vs UDP:\n" +
        "//   + connection setup (handshake) latency\n" +
        "//   + acknowledgements & retransmissions\n" +
        "//   + head-of-line blocking (one lost packet stalls later in-order data)\n" +
        "// Worth it for correctness-critical data; too slow for real-time media."
    }
  ],
  whenToUse: "<p>Use TCP (directly or via HTTP, which runs on it) whenever <strong>correctness and completeness " +
    "matter more than minimal latency</strong> &mdash; web pages, APIs, file transfers, database connections, " +
    "messaging, anything where lost or reordered data would corrupt the result. It's the default for the vast " +
    "majority of communication. <strong>Trade-offs and gotchas:</strong> the reliability guarantees cost " +
    "connection setup latency, acknowledgement overhead, and <strong>head-of-line blocking</strong> (a single " +
    "lost packet stalls all subsequent in-order data &mdash; a real issue that HTTP/3 over QUIC/UDP addresses). " +
    "For real-time data where the latest value matters more than every past one (live video/voice, gaming, " +
    "telemetry), TCP's retransmission of stale data is counterproductive &mdash; use UDP. Connection setup " +
    "cost also makes many short-lived connections inefficient (reuse connections / keep-alive).</p>"
};

C["udp"] = {
  summary: "<p><strong>UDP (User Datagram Protocol)</strong> is a connectionless transport protocol that sends " +
    "independent packets ('datagrams') with <strong>no guarantees</strong> of delivery, ordering, or " +
    "duplicate protection &mdash; it's fire-and-forget. By skipping handshakes, acknowledgements, and " +
    "retransmissions, UDP is <strong>fast and low-overhead</strong>, with minimal latency. The application " +
    "must handle (or tolerate) any loss/reordering itself. UDP suits real-time and high-throughput scenarios " +
    "where speed and the <em>latest</em> data matter more than perfect reliability &mdash; live media, gaming, " +
    "DNS lookups, and it underlies QUIC/HTTP/3.</p>",
  examples: [
    {
      title: "Example 1: Fire-and-forget datagrams",
      description: "<p>No connection, no acks &mdash; just send and move on.</p>",
      code: "// UDP: send a datagram; don't wait, don't confirm, don't retry\n" +
        "//   sender -> [packet] -> receiver   (may arrive, may not, any order)\n" +
        "// No handshake, no retransmission -> very low latency + overhead.\n" +
        "// If a packet is lost, it's simply gone (unless the app handles it)."
    },
    {
      title: "Example 2: Where 'latest' beats 'complete'",
      description: "<p>Real-time data makes stale retransmissions useless.</p>",
      code: "// Live video/voice, multiplayer game position updates:\n" +
        "//   a lost frame/position is irrelevant - you want the NEXT one,\n" +
        "//   not a retransmitted old one (TCP would stall to redeliver it).\n" +
        "// Also: DNS (small request/response), real-time telemetry, QUIC/HTTP3."
    }
  ],
  whenToUse: "<p>Use UDP when <strong>low latency and speed matter more than guaranteed delivery</strong>, and " +
    "the application can tolerate or handle loss &mdash; live audio/video streaming, VoIP, online gaming " +
    "(position updates), real-time telemetry/metrics, DNS, and as the base for QUIC (HTTP/3). It avoids TCP's " +
    "handshake and head-of-line blocking. <strong>Gotchas:</strong> you get <em>no</em> reliability, ordering, " +
    "or congestion control by default &mdash; if you need any of those, you must build them in the application " +
    "(which is essentially what QUIC does), so don't choose UDP for data that must arrive intact (use TCP). " +
    "UDP can also contribute to network congestion if unthrottled (no built-in congestion control) and is " +
    "sometimes blocked by firewalls. Use it deliberately for real-time/streaming/lookup workloads; for " +
    "everything correctness-critical, TCP is the right default.</p>"
};

C["rpc"] = {
  summary: "<p><strong>RPC (Remote Procedure Call)</strong> is a communication style that makes calling a " +
    "function on a remote server look like calling a local function &mdash; you invoke a method with " +
    "arguments and get a return value, while the framework handles serialization, network transport, and " +
    "deserialization under the hood. It's <em>action/method-oriented</em> ('do this operation') rather than " +
    "resource-oriented like REST. RPC can be efficient and ergonomic for service-to-service communication " +
    "(modern examples: gRPC, Thrift), but the 'it looks local' abstraction can hide the realities of network " +
    "calls (latency, partial failure), and tight coupling between client and server contracts.</p>",
  examples: [
    {
      title: "Example 1: Calling a remote method like a local one",
      description: "<p>RPC hides the network behind a function call.</p>",
      code: "// Feels local, but runs over the network:\n" +
        "//   result = paymentService.charge(orderId, amount);\n" +
        "// Under the hood: serialize args -> send -> server runs charge() ->\n" +
        "//   serialize result -> return. The framework generates the 'stub'.\n" +
        "// Action-oriented: you call METHODS (charge, refund), not resources."
    },
    {
      title: "Example 2: RPC vs REST framing",
      description: "<p>Methods vs resources for the same operation.</p>",
      code: "// RPC:  POST /chargeOrder        body: { orderId, amount }\n" +
        "//       (an action/verb endpoint)\n" +
        "// REST: POST /orders/42/charges  body: { amount }\n" +
        "//       (a resource you create under an order)\n" +
        "// RPC suits internal service calls; REST suits resource-style web APIs."
    }
  ],
  whenToUse: "<p>Use RPC for <strong>internal service-to-service communication</strong> where you want " +
    "efficient, method-oriented calls with typed contracts &mdash; especially gRPC for performance-sensitive " +
    "microservice meshes. It's natural when your interactions are 'invoke an operation' rather than 'manipulate " +
    "a resource'. <strong>Gotchas:</strong> the biggest danger is the leaky abstraction &mdash; making remote " +
    "calls <em>look</em> local tempts developers to ignore network reality (latency, timeouts, partial " +
    "failure, retries), leading to chatty, fragile designs (see the Chatty I/O antipattern). RPC also tightly " +
    "couples client and server to a shared interface/contract, so versioning needs care. It's less " +
    "browser/human-friendly and less cacheable than REST. For public APIs, REST or GraphQL is usually better; " +
    "reserve RPC (gRPC) for internal, high-performance, contract-driven communication &mdash; and always " +
    "design for the network's failure modes.</p>"
};

C["rest"] = {
  summary: "<p><strong>REST (Representational State Transfer)</strong> is an architectural style for web APIs " +
    "built on HTTP, organized around <strong>resources</strong> (nouns) identified by URLs and manipulated " +
    "with standard HTTP <strong>methods</strong> (GET, POST, PUT, PATCH, DELETE). It's <strong>stateless</strong> " +
    "(each request carries all needed context), leverages HTTP features (status codes, caching, content " +
    "negotiation), and aims for a uniform, predictable interface. REST is the dominant style for public and " +
    "web-facing APIs due to its simplicity, ubiquity, tooling, and cacheability &mdash; though it can lead to " +
    "over-/under-fetching and chatty interactions for complex data needs.</p>",
  examples: [
    {
      title: "Example 1: Resources + HTTP methods",
      description: "<p>URLs are nouns; methods are the verbs acting on them.</p>",
      code: "GET    /users          -> list users\n" +
        "POST   /users          -> create a user\n" +
        "GET    /users/7        -> fetch user 7\n" +
        "PUT    /users/7        -> replace user 7\n" +
        "PATCH  /users/7        -> partially update user 7\n" +
        "DELETE /users/7        -> delete user 7\n" +
        "GET    /users/7/orders -> user 7's orders (nested resource)"
    },
    {
      title: "Example 2: Over-fetching / under-fetching",
      description: "<p>Fixed resource shapes can return too much or too little.</p>",
      code: "// Over-fetching: GET /users/7 returns 30 fields; the UI needs 2.\n" +
        "// Under-fetching: to show a user + their last order + the product,\n" +
        "//   the client makes 3 requests (/users/7, /orders?.., /products/..).\n" +
        "// REST's fixed shapes cause this; GraphQL targets exactly this problem."
    }
  ],
  whenToUse: "<p>Use REST for public web APIs, CRUD-style services, and anywhere broad compatibility, " +
    "simplicity, caching, and tooling matter &mdash; it's the safe default for web-facing APIs. Its alignment " +
    "with HTTP makes responses cacheable and the interface predictable. <strong>Gotchas:</strong> REST's " +
    "fixed resource shapes cause <strong>over-fetching</strong> (clients get more than they need) and " +
    "<strong>under-fetching</strong> (clients make many round-trips to assemble related data), which hurts " +
    "mobile/complex UIs &mdash; GraphQL addresses this. Designing good resource URLs and using correct methods/" +
    "status codes takes discipline (verbs in URLs, misused codes, and inconsistent conventions are common " +
    "smells). Versioning and evolving APIs needs a strategy. For high-performance internal calls, gRPC is " +
    "leaner; for highly variable client data needs, GraphQL fits better. Choose REST when its simplicity and " +
    "ubiquity are the priority.</p>"
};

C["grpc"] = {
  summary: "<p><strong>gRPC</strong> is a high-performance, open-source RPC framework from Google that uses " +
    "<strong>Protocol Buffers</strong> (a compact binary serialization format) over <strong>HTTP/2</strong>. " +
    "You define service methods and message types in a <code>.proto</code> contract, and gRPC generates " +
    "typed client/server code in many languages. Benefits: small fast binary payloads, HTTP/2 multiplexing " +
    "and streaming (including bidirectional), strong typed contracts, and great cross-language support &mdash; " +
    "making it excellent for internal microservice communication. Drawbacks: it's not natively " +
    "browser-friendly (needs a proxy), binary payloads aren't human-readable, and it's more complex to set up " +
    "than REST.</p>",
  examples: [
    {
      title: "Example 1: A .proto contract generates code",
      description: "<p>Define the service once; get typed clients/servers.</p>",
      code: "// payment.proto\n" +
        "service PaymentService {\n" +
        "  rpc Charge (ChargeRequest) returns (Receipt);\n" +
        "}\n" +
        "message ChargeRequest { string order_id = 1; int64 amount_cents = 2; }\n" +
        "// -> generates typed client + server stubs in Go, Java, Python, etc.\n" +
        "//    client: receipt = stub.Charge(req)   (typed, binary, over HTTP/2)"
    },
    {
      title: "Example 2: Streaming and efficiency",
      description: "<p>gRPC supports streaming and compact payloads.</p>",
      code: "// Streaming RPC types (over HTTP/2):\n" +
        "//   unary, server-streaming, client-streaming, bidirectional\n" +
        "// e.g. rpc Watch (Query) returns (stream Event);  // server pushes events\n" +
        "// Protobuf binary is much smaller/faster to parse than JSON\n" +
        "//   -> ideal for high-throughput internal service-to-service traffic."
    }
  ],
  whenToUse: "<p>Use gRPC for <strong>internal service-to-service communication</strong> where performance, " +
    "typed contracts, and streaming matter &mdash; microservice meshes, low-latency/high-throughput APIs, and " +
    "polyglot environments needing consistent contracts. The <code>.proto</code> definitions give you a " +
    "single source of truth and code generation across languages. <strong>Gotchas:</strong> gRPC isn't " +
    "directly callable from browsers (needs gRPC-Web + a proxy), so it's a poor fit for public/web-facing APIs " +
    "where REST or GraphQL is friendlier. Binary protobuf is efficient but not human-readable (harder to " +
    "debug with curl/inspect). It adds build/tooling complexity (proto compilation) and tighter client-server " +
    "coupling to the contract (manage schema evolution carefully &mdash; protobuf is good at backward " +
    "compatibility if you follow the rules). Reserve gRPC for internal, performance-sensitive, contract-driven " +
    "communication; use REST/GraphQL at the public edge.</p>"
};

C["graphql"] = {
  summary: "<p><strong>GraphQL</strong> is a query language and runtime for APIs where the <em>client</em> " +
    "specifies exactly what data it needs in a single request, and the server returns precisely that shape &mdash; " +
    "no more, no less. A typed <strong>schema</strong> defines available types and operations (queries, " +
    "mutations, subscriptions), and clients traverse the graph to fetch related data in one round-trip. This " +
    "solves REST's over-fetching and under-fetching: a mobile client can request just the fields it shows, " +
    "and assemble a user + their orders + product names in one query. The trade-offs are added server " +
    "complexity, harder HTTP caching, and new performance pitfalls (like N+1 resolution).</p>",
  examples: [
    {
      title: "Example 1: Client asks for exactly what it needs",
      description: "<p>One query, precise fields, related data in a single request.</p>",
      code: "# Single request fetches exactly these fields + nested relations:\n" +
        "query {\n" +
        "  user(id: 7) {\n" +
        "    name\n" +
        "    orders(last: 3) {\n" +
        "      total\n" +
        "      product { name }   # related data, no extra round-trip\n" +
        "    }\n" +
        "  }\n" +
        "}\n" +
        "# No over-fetching (only name/total/product.name) or under-fetching."
    },
    {
      title: "Example 2: The N+1 resolver pitfall",
      description: "<p>Naive resolvers can fire a query per item.</p>",
      code: "// Query for 100 users + each user's company:\n" +
        "//   naive: 1 query for users + 100 queries for companies (N+1!)\n" +
        "// Fix: batch with a DataLoader -> 1 users query + 1 batched\n" +
        "//   companies query. GraphQL needs deliberate batching/caching."
    }
  ],
  whenToUse: "<p>Use GraphQL when clients have <strong>diverse, evolving data needs</strong> and you want to " +
    "avoid over/under-fetching &mdash; mobile apps, rich front-ends, public APIs serving many client types, or " +
    "aggregating data from multiple sources behind one endpoint. It gives clients flexibility and a strongly " +
    "typed, self-documenting schema. <strong>Gotchas:</strong> it shifts complexity to the server &mdash; you " +
    "must guard against the <strong>N+1 problem</strong> (use DataLoader/batching), and against expensive/" +
    "abusive queries (depth/complexity limits, rate limiting). HTTP caching is harder than REST (everything is " +
    "usually one POST endpoint), needing application-level or persisted-query caching. There's a learning " +
    "curve and tooling overhead. For simple CRUD or when strong HTTP caching/ubiquity matters, REST is " +
    "simpler; for high-performance internal calls, gRPC. Choose GraphQL specifically for flexible client-driven " +
    "data fetching, and invest in the batching/security it requires.</p>"
};

/* ======================================================================
   PERFORMANCE ANTIPATTERNS
   ====================================================================== */

C["performance-antipatterns"] = {
  summary: "<p><strong>Performance antipatterns</strong> are common design/implementation mistakes that cause " +
    "scalability and performance problems &mdash; recurring 'ways to do it wrong' (catalogued by Microsoft's " +
    "Azure architecture guidance). Examples include <strong>Busy Database</strong> (offloading too much work " +
    "onto the DB), <strong>Chatty I/O</strong> (too many small calls), <strong>Extraneous Fetching</strong> " +
    "(retrieving more data than needed), <strong>No Caching</strong>, <strong>Noisy Neighbor</strong>, " +
    "<strong>Retry Storm</strong>, and <strong>Synchronous I/O</strong>. Recognizing these patterns helps you " +
    "diagnose why a system is slow and points to the fix &mdash; they're a checklist for performance reviews.</p>",
  examples: [
    {
      title: "Example 1: The antipatterns at a glance",
      description: "<p>Each names a specific, fixable mistake.</p>",
      code: "// Chatty I/O          -> many tiny calls; batch them\n" +
        "// Extraneous Fetching -> fetching too much/too often; select only needed\n" +
        "// No Caching          -> recomputing/refetching repeatedly; add a cache\n" +
        "// Busy Database       -> heavy logic in the DB; move it to the app tier\n" +
        "// Synchronous I/O     -> blocking threads on I/O; go async\n" +
        "// Retry Storm         -> aggressive retries amplifying load; backoff + breaker"
    },
    {
      title: "Example 2: Use them as a diagnostic checklist",
      description: "<p>A slow system usually matches one or more of these.</p>",
      code: "// 'Why is this endpoint slow under load?' Check:\n" +
        "//   - Is it making N+1 / chatty calls? (Chatty I/O)\n" +
        "//   - Fetching whole rows/objects for a couple of fields? (Extraneous)\n" +
        "//   - Recomputing the same result every request? (No Caching)\n" +
        "//   - Blocking on I/O and exhausting threads? (Synchronous I/O)\n" +
        "// Matching the symptom to the antipattern points to the fix."
    }
  ],
  whenToUse: "<p>Use this catalog during design reviews, performance investigations, and code review as a " +
    "checklist for what tends to go wrong. When a system is slow or doesn't scale, matching the symptom to a " +
    "known antipattern is a fast route to the cause and the standard fix. <strong>Gotchas:</strong> these are " +
    "<em>antipatterns</em> &mdash; things to avoid &mdash; but their fixes have trade-offs (e.g. batching to " +
    "fix Chatty I/O can increase latency per call; caching to fix No Caching adds invalidation complexity), so " +
    "apply the remedy thoughtfully, not mechanically. Also, premature optimization to avoid an antipattern you " +
    "don't actually have is its own mistake &mdash; measure first. The point is awareness: knowing these " +
    "patterns helps you spot real problems and avoid building them in. The sub-topics detail each antipattern.</p>"
};

C["busy-database"] = {
  summary: "<p>The <strong>Busy Database</strong> antipattern occurs when too much processing is pushed onto " +
    "the database server &mdash; complex business logic in stored procedures, heavy data transformation, " +
    "aggregations, or formatting that could run elsewhere. Because the database is often the hardest tier to " +
    "scale (and a shared resource), overloading its CPU with work that isn't fundamentally data access " +
    "creates a bottleneck that throttles the entire system. The fix is to move appropriate processing to the " +
    "stateless, easily-scaled application tier, reserving the database for what it does best: storing and " +
    "querying data.</p>",
  examples: [
    {
      title: "Example 1: Heavy logic in the database",
      description: "<p>The DB CPU becomes the bottleneck doing non-data work.</p>",
      code: "// Antipattern: a giant stored procedure does business rules,\n" +
        "//   string formatting, complex calculations, and report assembly\n" +
        "//   -> the single DB server's CPU is saturated; adding app servers\n" +
        "//      doesn't help because the bottleneck is the (hard-to-scale) DB."
    },
    {
      title: "Example 2: Move work to the app tier",
      description: "<p>Let the DB query; let the scalable app tier compute.</p>",
      code: "// Fix: DB returns the raw data; the APP tier does the business logic,\n" +
        "//   formatting, and aggregation (it scales horizontally and cheaply).\n" +
        "// Keep in the DB only what it's best at: filtering, indexed lookups,\n" +
        "//   set-based operations that genuinely belong close to the data."
    }
  ],
  whenToUse: "<p>Watch for Busy Database when the DB server's CPU is the bottleneck and it's doing work beyond " +
    "data access &mdash; sprawling stored procedures, heavy computation, or formatting. Relieve it by moving " +
    "that logic to the application tier, which scales out far more easily than a database. <strong>Nuance and " +
    "gotcha:</strong> this is a balance, not an absolute rule &mdash; some processing genuinely belongs in the " +
    "database because doing it there avoids transferring huge amounts of data to the app (the opposite " +
    "mistake; see Extraneous Fetching). Set-based filtering, aggregation over large datasets, and indexed " +
    "lookups are often best left to the DB. The real principle: don't put <em>CPU-heavy, non-data</em> work on " +
    "the scarce, hard-to-scale database, but don't pull massive data to the app just to filter it either. " +
    "Profile to see where the time actually goes before relocating logic.</p>"
};

C["busy-frontend"] = {
  summary: "<p>The <strong>Busy Front End</strong> antipattern occurs when the front-end/web tier performs too " +
    "much resource-intensive work synchronously within requests &mdash; heavy computation, large data " +
    "processing, or long-running tasks that consume the threads meant for handling user requests. This starves " +
    "the system of capacity to serve users: threads are tied up doing background-style work, so request " +
    "latency climbs and throughput collapses under load. The fix is to offload heavy or long-running work to " +
    "asynchronous background processing (queues + workers), keeping the front-end tier free to do what it " +
    "should: quickly accept requests and return responses.</p>",
  examples: [
    {
      title: "Example 1: Heavy work blocks request threads",
      description: "<p>Resource-intensive work in the request path exhausts capacity.</p>",
      code: "// Antipattern: the web request thread itself does\n" +
        "//   image processing / PDF generation / a big computation inline\n" +
        "//   -> each such request hogs a thread for seconds\n" +
        "//   -> the thread pool drains; normal fast requests queue and time out."
    },
    {
      title: "Example 2: Offload to background workers",
      description: "<p>Accept fast, process heavy work elsewhere.</p>",
      code: "// Fix: front-end enqueues the heavy task and returns immediately\n" +
        "//   request -> enqueue 'generate-pdf' -> respond 202 (fast)\n" +
        "//   separate worker pool does the heavy lifting off the request path\n" +
        "// The web tier stays responsive; heavy work scales independently."
    }
  ],
  whenToUse: "<p>Recognize Busy Front End when your web/app servers are saturated by heavy in-request work and " +
    "user-facing latency suffers under load. The remedy is to push resource-intensive or long-running tasks " +
    "into asynchronous background processing (task/message queues + dedicated workers), so the front end stays " +
    "lean and responsive and the heavy work can be scaled, retried, and rate-limited separately. " +
    "<strong>Gotchas:</strong> offloading introduces asynchronicity &mdash; you now need a queue, idempotent " +
    "workers, and a way to return results to the user (polling/webhooks/push). Don't over-correct by making " +
    "<em>everything</em> async; trivial fast work belongs inline (a queue round-trip would add needless " +
    "latency). The signal to offload is work that's slow, CPU/memory-heavy, or doesn't need to complete within " +
    "the request. It pairs with the Async Request-Reply and Queue-Based Load Leveling patterns.</p>"
};

C["chatty-io"] = {
  summary: "<p>The <strong>Chatty I/O</strong> antipattern is making a large number of small I/O requests &mdash; " +
    "to a database, API, or file system &mdash; when fewer, larger requests would do. Each request carries " +
    "fixed overhead (network round-trip latency, connection setup, serialization), so many tiny calls " +
    "accumulate huge cumulative latency and load, even if each is individually cheap. The classic case is the " +
    "<strong>N+1 query problem</strong>. The fix is to <strong>batch</strong> or combine requests: fetch " +
    "related data together (joins, <code>IN</code> clauses, batch endpoints), retrieve in bulk, and reduce the " +
    "number of round-trips.</p>",
  examples: [
    {
      title: "Example 1: The N+1 query problem",
      description: "<p>One query per item explodes into many round-trips.</p>",
      code: "// Chatty (N+1): 1 query for orders + 1 query PER order for its customer\n" +
        "//   orders = db.query('SELECT * FROM orders')          // 1\n" +
        "//   for (o of orders) o.customer = db.get(o.customerId) // + N queries!\n" +
        "// 100 orders = 101 round-trips. Latency dominated by overhead."
    },
    {
      title: "Example 2: Batch into one request",
      description: "<p>Combine the calls; one round-trip instead of N.</p>",
      code: "// Fix with a join or a single batched query:\n" +
        "//   SELECT o.*, c.* FROM orders o JOIN customers c ON c.id=o.customerId\n" +
        "// Or batch the ids:\n" +
        "//   SELECT * FROM customers WHERE id IN (1,2,3,...)\n" +
        "// 1-2 round-trips total. (GraphQL: DataLoader batches these.)"
    }
  ],
  whenToUse: "<p>Fix Chatty I/O whenever you see many small, repetitive calls in a loop or per-item &mdash; " +
    "N+1 queries, per-record API calls, fetching items one at a time. Batch them (joins, <code>IN</code> " +
    "clauses, bulk/batch endpoints, DataLoader) to slash round-trips and overhead. It's one of the most common " +
    "and impactful performance fixes. <strong>Gotchas and balance:</strong> over-batching is the opposite " +
    "antipattern (Extraneous Fetching) &mdash; pulling one giant payload to avoid round-trips can fetch far " +
    "more data than needed and strain memory/bandwidth, so batch the <em>right amount</em>. Very large batches " +
    "can also cause long-running queries and lock contention. The goal is fewer, appropriately-sized requests, " +
    "not one enormous one. Watch for chattiness across <em>any</em> boundary (DB, cache, microservice, " +
    "external API) &mdash; it's especially costly across the network in distributed systems.</p>"
};

C["extraneous-fetching"] = {
  summary: "<p>The <strong>Extraneous Fetching</strong> antipattern is retrieving <em>more data than " +
    "needed</em> &mdash; selecting all columns when you need two, loading entire collections to use a few " +
    "items, fetching full related objects you'll discard, or pulling large datasets to filter or aggregate in " +
    "the application. It wastes bandwidth, memory, and database/CPU work, and increases latency. The fix is to " +
    "fetch only what's required: select specific columns, filter and paginate at the data source, push " +
    "aggregation to the database, and avoid eagerly loading data that isn't used.</p>",
  examples: [
    {
      title: "Example 1: Fetching too much, then discarding",
      description: "<p>Pulling everything to use a fraction wastes resources.</p>",
      code: "// Antipattern:\n" +
        "//   SELECT * FROM products;            -- all rows, all columns\n" +
        "//   then in code: filter to in-stock, keep only name + price\n" +
        "// -> transfers/loads huge data, most of it thrown away.\n" +
        "// Fix: let the DB do the work\n" +
        "//   SELECT name, price FROM products WHERE in_stock = true LIMIT 50;"
    },
    {
      title: "Example 2: Aggregate at the source, paginate",
      description: "<p>Don't move millions of rows to count them.</p>",
      code: "// Antipattern: load 1M orders into the app to sum revenue.\n" +
        "// Fix: SELECT SUM(total) FROM orders WHERE ...   (DB returns one number)\n" +
        "// And always paginate large result sets (LIMIT/keyset) instead of\n" +
        "//   fetching everything 'just in case'."
    }
  ],
  whenToUse: "<p>Address Extraneous Fetching whenever you retrieve and then ignore most of the data &mdash; " +
    "<code>SELECT *</code> for a couple of fields, loading whole collections to filter in code, eager-loading " +
    "unused relations, or computing aggregates in the app. Fetch precisely: project specific columns, filter/" +
    "paginate/aggregate at the database, and lazy-load only what's used. It directly cuts bandwidth, memory, " +
    "and latency. <strong>Gotchas and balance:</strong> the opposite extreme is Chatty I/O &mdash; fetching " +
    "too <em>little</em> per call and making many round-trips &mdash; so don't over-correct into " +
    "under-fetching. The goal is to fetch <em>exactly</em> what's needed in as few requests as practical. " +
    "Note ORMs make extraneous fetching easy to do accidentally (lazy loading whole objects, N+1, " +
    "<code>SELECT *</code>), so inspect the actual queries your ORM emits. Balance against Chatty I/O: right " +
    "data, right granularity, right number of calls.</p>"
};

C["improper-instantiation"] = {
  summary: "<p>The <strong>Improper Instantiation</strong> antipattern is repeatedly creating and destroying " +
    "objects that are <em>designed to be shared and reused</em> &mdash; most commonly HTTP clients, database " +
    "connections, and similar expensive-to-create, intended-to-be-long-lived resources. Creating a new " +
    "instance per request (instead of reusing a shared/pooled one) wastes CPU on setup/teardown, exhausts " +
    "resources (e.g. socket/port exhaustion from new connections), and harms performance and stability. The " +
    "fix is to instantiate these objects <strong>once</strong> and reuse them (singletons, connection pools, " +
    "shared clients) for the application's lifetime.</p>",
  examples: [
    {
      title: "Example 1: New client per request (the bug)",
      description: "<p>Creating expensive clients repeatedly causes resource exhaustion.</p>",
      code: "// Antipattern: a fresh HTTP client on every request\n" +
        "function callApi() {\n" +
        "  const client = new HttpClient();   // expensive; opens sockets\n" +
        "  return client.get('/data');\n" +
        "}\n" +
        "// Under load -> thousands of clients -> socket/port exhaustion,\n" +
        "//   GC pressure, dropped connections. A classic production outage."
    },
    {
      title: "Example 2: Reuse a shared instance / pool",
      description: "<p>Create once; reuse everywhere.</p>",
      code: "// Fix: one shared, reused client (created at startup)\n" +
        "const client = new HttpClient();      // singleton\n" +
        "function callApi() { return client.get('/data'); }\n" +
        "\n" +
        "// Databases: use a CONNECTION POOL (reuse a fixed set of connections)\n" +
        "//   rather than opening/closing a connection per query."
    }
  ],
  whenToUse: "<p>Avoid Improper Instantiation by reusing objects meant to be shared &mdash; HTTP clients, " +
    "database connections (via pools), gRPC channels, serializers, thread pools, and other heavyweight " +
    "resources. Create them once and inject/share them. This is critical for any service under real load. " +
    "<strong>Gotchas:</strong> the symptoms are often non-obvious until production load &mdash; intermittent " +
    "connection failures, socket/port exhaustion, high GC, and degrading latency. Many libraries explicitly " +
    "document that their client is thread-safe and intended to be reused (people miss this and 'new' it per " +
    "request). The flip side: shared instances must be <strong>thread-safe</strong> and stateless (or properly " +
    "synchronized) &mdash; sharing a non-thread-safe object causes its own bugs. Use connection pools (with " +
    "sane min/max sizes) for connections rather than a single shared connection. When in doubt about a " +
    "resource's cost/lifetime, check the library docs.</p>"
};

C["monolithic-persistence"] = {
  summary: "<p>The <strong>Monolithic Persistence</strong> antipattern is using a single data store for " +
    "<em>all</em> of an application's data regardless of how different parts are used &mdash; cramming " +
    "transactional data, analytics, logs, search, caching, and blobs into one database. Different data has " +
    "different access patterns and performance characteristics, and forcing them into one store creates " +
    "contention (analytics queries slowing down transactions), poor fit (relational DB for full-text search), " +
    "and a scaling bottleneck. The fix is <strong>polyglot persistence</strong>: use the right store for each " +
    "kind of data (relational for transactions, a search engine for search, a cache for hot reads, object " +
    "storage for files).</p>",
  examples: [
    {
      title: "Example 1: One store doing everything (badly)",
      description: "<p>Mixed workloads contend in a single database.</p>",
      code: "// Antipattern: the main transactional DB also handles\n" +
        "//   heavy analytics queries, full-text search, session storage,\n" +
        "//   and large file blobs.\n" +
        "// -> analytics scans lock/slow down order processing; search is poor;\n" +
        "//    blobs bloat the DB. One store, many mismatched jobs, all contending."
    },
    {
      title: "Example 2: Polyglot persistence (right tool per job)",
      description: "<p>Match each data type to a fitting store.</p>",
      code: "// Transactions     -> relational DB (Postgres)\n" +
        "// Full-text search  -> Elasticsearch / OpenSearch\n" +
        "// Hot reads/sessions-> Redis (cache/KV)\n" +
        "// Analytics         -> data warehouse / column store (read replica or OLAP)\n" +
        "// Files/media        -> object storage (S3) + CDN"
    }
  ],
  whenToUse: "<p>Move away from monolithic persistence when one data store is being stretched across mismatched " +
    "workloads and you see contention or poor fit &mdash; analytics slowing transactions, weak search, blob " +
    "bloat, scaling limits. Adopt the store best suited to each access pattern (polyglot persistence). " +
    "<strong>Gotchas and balance:</strong> don't overcorrect into a sprawl of databases prematurely &mdash; " +
    "every additional store adds operational burden (ops, backups, consistency, expertise) and cross-store " +
    "consistency challenges (data duplicated across stores must be kept in sync, often via events/eventual " +
    "consistency). For small or early-stage systems, a single well-chosen database is simpler and fine; split " +
    "out a specialized store when a specific workload genuinely justifies it (e.g. add a search engine when " +
    "SQL <code>LIKE</code> can't cut it, a cache when reads are hot). The principle is 'right tool per job', " +
    "applied as needs emerge, not maximal fragmentation from day one.</p>"
};

C["no-caching"] = {
  summary: "<p>The <strong>No Caching</strong> antipattern is repeatedly fetching or recomputing the same data " +
    "on every request when it could be cached and reused. Without caching, every request hits the database (or " +
    "recomputes an expensive result), even for data that rarely changes and is requested constantly &mdash; " +
    "wasting resources, adding latency, and overloading backends that a cache would shield. The fix is to " +
    "introduce appropriate caching (client, CDN, web server, application, database) for frequently-read, " +
    "expensive-to-produce, infrequently-changing data, dramatically reducing load and latency.</p>",
  examples: [
    {
      title: "Example 1: Recomputing/refetching every time",
      description: "<p>Hitting the source for unchanged, hot data is wasteful.</p>",
      code: "// Antipattern: every request recomputes the same expensive result\n" +
        "//   GET /homepage -> run 8 queries + heavy render, EVERY time,\n" +
        "//   even though the homepage changes a few times a day.\n" +
        "// -> the DB is hammered with identical work; latency is high."
    },
    {
      title: "Example 2: Add a cache for hot, stable data",
      description: "<p>Compute once, serve many from the cache.</p>",
      code: "// Fix (cache-aside):\n" +
        "//   check cache -> HIT? serve instantly\n" +
        "//   MISS -> compute/query -> store with a TTL -> serve\n" +
        "// Now thousands of identical requests are served from memory;\n" +
        "//   the backend sees a tiny fraction of the load."
    }
  ],
  whenToUse: "<p>Fix No Caching whenever the same data is read far more often than it changes and producing it " +
    "is non-trivial &mdash; query results, rendered pages/fragments, API responses, computed aggregates, " +
    "reference data. Caching is often the single biggest, cheapest performance and scalability win. " +
    "<strong>Gotchas (the trade-offs caching brings):</strong> adding a cache introduces " +
    "<strong>invalidation</strong> complexity (stale data when the source changes &mdash; manage with TTLs, " +
    "event-based eviction, or versioned keys) and potential cache/source inconsistency, so it's not free. " +
    "Don't cache rarely-reused data (low hit ratio wastes memory) or per-user sensitive data carelessly, and " +
    "guard against cache stampedes on popular expired keys. The point of the antipattern is that " +
    "<em>omitting</em> caching for clearly cacheable hot data is a mistake; add it deliberately, with a " +
    "freshness strategy, where the access pattern justifies it.</p>"
};

C["noisy-neighbor"] = {
  summary: "<p>The <strong>Noisy Neighbor</strong> antipattern occurs in multi-tenant or shared-resource " +
    "systems when one tenant/component consumes a disproportionate share of resources (CPU, memory, I/O, " +
    "connections, queue capacity), degrading performance for everyone else sharing those resources. One " +
    "heavy user's workload 'shouts over' the others. Mitigations include <strong>resource isolation</strong> " +
    "(quotas, limits, dedicated resources per tenant), <strong>throttling/rate limiting</strong> per tenant, " +
    "and the <strong>Bulkhead</strong> pattern (partitioning resources so one tenant's overload can't drain " +
    "the shared pool). It's a key concern for SaaS, cloud, and any shared infrastructure.</p>",
  examples: [
    {
      title: "Example 1: One tenant starves the rest",
      description: "<p>Shared resources mean one heavy user impacts all.</p>",
      code: "// Shared thread pool / DB / queue across tenants:\n" +
        "//   Tenant A runs a massive batch job -> consumes most CPU/connections\n" +
        "//   -> Tenants B, C, D experience slow responses or timeouts\n" +
        "//      even though THEIR load is normal. A is the 'noisy neighbor'."
    },
    {
      title: "Example 2: Isolation and limits",
      description: "<p>Quotas and bulkheads contain the blast radius.</p>",
      code: "// Mitigations:\n" +
        "//  - per-tenant rate limits / quotas (A can't exceed its share)\n" +
        "//  - bulkheads: separate connection pools / worker pools per tenant tier\n" +
        "//  - resource limits (CPU/mem caps per container/tenant)\n" +
        "//  - dedicated resources for premium tenants\n" +
        "// One tenant's spike no longer drains everyone's capacity."
    }
  ],
  whenToUse: "<p>Guard against Noisy Neighbor in any multi-tenant SaaS, shared cluster, or system where " +
    "components compete for common resources &mdash; shared databases, thread/connection pools, message " +
    "queues, cloud VMs. Apply per-tenant quotas and throttling, resource limits, and bulkheading so one " +
    "tenant's overload can't degrade others. <strong>Gotchas:</strong> the problem is often invisible until a " +
    "specific tenant's spike causes mysterious, widespread slowness &mdash; good per-tenant monitoring is key " +
    "to even detecting it. Full isolation (dedicated resources per tenant) is the strongest fix but costs more " +
    "(less efficient resource sharing), so it's a trade-off between isolation and density; many systems tier " +
    "it (shared for free tenants, more isolation for paid). On cloud infrastructure you can also be the victim " +
    "of a noisy neighbor on shared hardware &mdash; dedicated/reserved instances mitigate that. It's closely " +
    "tied to the Bulkhead and Throttling patterns.</p>"
};

C["retry-storm"] = {
  summary: "<p>The <strong>Retry Storm</strong> (or retry amplification) antipattern happens when many clients " +
    "aggressively retry failed requests against a struggling service, <em>amplifying</em> the load and " +
    "preventing it from recovering &mdash; turning a transient hiccup into a sustained outage. When a service " +
    "slows or errors, naive immediate retries multiply the request volume exactly when the service can least " +
    "handle it (and retries can cascade across service layers). Mitigations: <strong>exponential backoff with " +
    "jitter</strong>, a <strong>retry budget/cap</strong>, and the <strong>Circuit Breaker</strong> pattern " +
    "(stop sending requests to a failing service to let it recover).</p>",
  examples: [
    {
      title: "Example 1: Retries amplify the failure",
      description: "<p>Immediate retries pile on load when the service is weakest.</p>",
      code: "// Service slows down -> 1000 clients time out -> each retries 3x\n" +
        "//   instantly -> 3000+ requests hit the already-struggling service\n" +
        "//   -> it gets WORSE, more timeouts, more retries... a storm.\n" +
        "// The retries prevent recovery instead of helping."
    },
    {
      title: "Example 2: Backoff + jitter + circuit breaker",
      description: "<p>Retry gently, and stop entirely when it's clearly down.</p>",
      code: "// Exponential backoff with jitter (spread retries out):\n" +
        "//   wait ~ random(0, base * 2^attempt), cap attempts (retry budget)\n" +
        "// Circuit breaker: after N consecutive failures, OPEN the circuit ->\n" +
        "//   fail fast (no calls) for a cooldown, then probe -> lets the\n" +
        "//   downstream service recover instead of being hammered."
    }
  ],
  whenToUse: "<p>Design against retry storms anywhere clients retry calls to a service &mdash; essentially all " +
    "distributed/microservice systems. Use <strong>exponential backoff with jitter</strong> (never immediate, " +
    "fixed-interval, synchronized retries), cap retries (a retry budget), and add <strong>circuit " +
    "breakers</strong> so a failing dependency is given room to recover rather than being pounded. " +
    "<strong>Gotchas:</strong> retries that seem reasonable in isolation become dangerous in aggregate and " +
    "especially when <em>nested</em> across layers (each layer retrying multiplies load exponentially &mdash; " +
    "retry at only one level, ideally the edge). Always add <strong>jitter</strong> or synchronized clients " +
    "retry in lockstep ('thundering herd'). Only retry <em>idempotent</em>, <em>transient</em> failures &mdash; " +
    "retrying non-idempotent operations causes duplicates, and retrying permanent errors (400s) is pointless. " +
    "Retries are useful for transient faults, but undisciplined retries are a leading cause of cascading " +
    "outages.</p>"
};

C["synchronous-io"] = {
  summary: "<p>The <strong>Synchronous I/O</strong> antipattern is blocking a thread while waiting for an I/O " +
    "operation (database query, network call, file/disk access) to complete. While the thread is blocked, it " +
    "does no useful work yet still consumes memory and a slot in the thread pool. Under load, blocking I/O " +
    "exhausts the thread pool &mdash; all threads are stuck waiting &mdash; so the system can't accept new " +
    "requests even though the CPU is idle. The fix is <strong>asynchronous (non-blocking) I/O</strong>, where " +
    "a thread initiates I/O and is freed to handle other work, resuming when the I/O completes &mdash; " +
    "achieving far higher concurrency with fewer threads.</p>",
  examples: [
    {
      title: "Example 1: Blocking threads exhaust the pool",
      description: "<p>Threads waiting on I/O can't serve other requests.</p>",
      code: "// Synchronous (blocking):\n" +
        "//   handle(req): result = db.query(...) // thread BLOCKS ~50ms waiting\n" +
        "//   With a 200-thread pool, only 200 requests can be 'in flight';\n" +
        "//   the rest queue/reject even though CPUs are mostly idle (just waiting)."
    },
    {
      title: "Example 2: Async I/O frees the thread",
      description: "<p>Non-blocking I/O lets few threads handle many requests.</p>",
      code: "// Asynchronous (non-blocking):\n" +
        "//   handle(req): result = await db.query(...) // thread is RELEASED\n" +
        "//   while waiting -> handles other requests -> resumes on completion.\n" +
        "// A handful of threads can serve thousands of concurrent I/O-bound\n" +
        "//   requests (Node's event loop, async/await, reactive frameworks)."
    }
  ],
  whenToUse: "<p>Prefer asynchronous/non-blocking I/O for I/O-bound workloads with high concurrency &mdash; web " +
    "servers, API gateways, services that make many database/network/external calls. It's the key to handling " +
    "many simultaneous connections without a massive thread pool, and it prevents thread-pool exhaustion under " +
    "load. <strong>Gotchas and nuance:</strong> async helps <em>I/O-bound</em> work, not CPU-bound work " +
    "(spinning the CPU still ties up resources &mdash; offload heavy computation to workers instead). Async " +
    "code is harder to write and debug (callback/promise chains, error propagation, no blocking the event " +
    "loop with sync work). In some platforms with virtual/green threads (e.g. Go goroutines, Java virtual " +
    "threads), 'blocking' code is cheap because the runtime handles non-blocking under the hood &mdash; so the " +
    "antipattern is specifically <em>OS-thread-blocking</em> I/O at scale. Match the model to the platform; the " +
    "principle is: don't waste scarce threads idly waiting on I/O.</p>"
};

/* ======================================================================
   MONITORING
   ====================================================================== */

C["monitoring"] = {
  summary: "<p><strong>Monitoring</strong> is observing a running system to understand its health, performance, " +
    "and behavior &mdash; essential for operating reliable services ('you can't manage what you can't " +
    "measure'). It spans several concerns: <strong>health</strong> (is it up and functioning?), " +
    "<strong>availability</strong> (is it reachable by users?), <strong>performance</strong> (latency, " +
    "throughput, resource use), <strong>security</strong> (threats, anomalies), and <strong>usage</strong> " +
    "(how features/resources are used). It's built on <strong>instrumentation</strong> (emitting metrics, " +
    "logs, traces) and <strong>visualization & alerting</strong> (dashboards and automated alerts). The three " +
    "pillars of observability are metrics, logs, and traces.</p>",
  examples: [
    {
      title: "Example 1: The three pillars of observability",
      description: "<p>Metrics, logs, and traces answer different questions.</p>",
      code: "// Metrics: numeric time-series - 'what/how much' (req/s, p99 latency,\n" +
        "//   error rate, CPU) -> dashboards + alerts; cheap, aggregated\n" +
        "// Logs:    discrete events - 'what happened' (errors, audit trail)\n" +
        "// Traces:  a request's path across services - 'where the time went'\n" +
        "//   and where it failed (distributed tracing)"
    },
    {
      title: "Example 2: From signal to action",
      description: "<p>Instrument, visualize, alert, respond.</p>",
      code: "// 1. Instrument code -> emit metrics/logs/traces\n" +
        "// 2. Collect (Prometheus, ELK, OpenTelemetry) + Visualize (Grafana)\n" +
        "// 3. Alert on SLO breaches (p99 > 500ms, error rate > 1%)\n" +
        "// 4. On-call responds, uses dashboards/traces to diagnose"
    }
  ],
  whenToUse: "<p>Monitor every production system &mdash; it's not optional. You need it to detect outages, " +
    "diagnose issues, verify SLOs, plan capacity, and understand user impact. Instrument from the start rather " +
    "than bolting it on after an incident. <strong>Gotchas:</strong> alert on <strong>symptoms users feel</strong> " +
    "(high latency, error rate, unavailability) tied to SLOs, not on every raw metric &mdash; too many noisy " +
    "alerts cause alert fatigue and ignored pages. Monitor the 'golden signals' (latency, traffic, errors, " +
    "saturation) at minimum. Beware high-cardinality metrics (unbounded label values explode storage/cost). " +
    "Distributed systems need distributed tracing to follow a request across services. Don't just collect " +
    "data &mdash; make it actionable (clear dashboards, runbooks, sensible alert thresholds). The sub-topics " +
    "cover each monitoring concern plus instrumentation and visualization/alerting.</p>"
};

C["health-monitoring"] = {
  summary: "<p><strong>Health monitoring</strong> tracks whether a system and its components are <em>up and " +
    "functioning correctly</em>. The core mechanism is <strong>health check endpoints</strong> (e.g. " +
    "<code>/health</code>) that report status, used by load balancers and orchestrators to decide whether to " +
    "route traffic to an instance. A good health check verifies not just that the process is running " +
    "('liveness') but that it can actually do its job &mdash; reach its database, cache, and critical " +
    "dependencies ('readiness'). Health monitoring enables automatic failover (remove unhealthy instances) and " +
    "is the basis of the Health Endpoint Monitoring cloud pattern.</p>",
  examples: [
    {
      title: "Example 1: Liveness vs readiness",
      description: "<p>Two distinct questions a health check can answer.</p>",
      code: "// Liveness: is the process alive? (restart it if not)\n" +
        "//   GET /health/live  -> 200 if the app is running\n" +
        "// Readiness: can it serve traffic? (route to it only if yes)\n" +
        "//   GET /health/ready -> checks DB, cache, deps reachable -> 200/503\n" +
        "// LB/orchestrator routes only to READY instances."
    },
    {
      title: "Example 2: A meaningful health check",
      description: "<p>Verify real dependencies, not just 'I'm alive'.</p>",
      code: "// GET /health -> {\n" +
        "//   status: 'UP',\n" +
        "//   checks: { database: 'UP', cache: 'UP', paymentGateway: 'DOWN' }\n" +
        "// }  -> overall DOWN if a critical dependency is unreachable\n" +
        "// A shallow check that only returns 200 'OK' can hide real breakage."
    }
  ],
  whenToUse: "<p>Implement health checks on every service &mdash; load balancers and orchestrators (Kubernetes) " +
    "rely on them for routing, auto-restart, and failover, and external monitors use them to detect outages. " +
    "Distinguish <strong>liveness</strong> (restart if dead) from <strong>readiness</strong> (route only when " +
    "able to serve). <strong>Gotchas:</strong> a <em>shallow</em> health check that just returns 200 because " +
    "the process is up can mask real failures (the app is 'alive' but can't reach its database) &mdash; make " +
    "readiness checks verify critical dependencies. But don't over-check: an overly aggressive health check " +
    "that fails on any minor/degraded dependency can cause unnecessary instance removal and cascading failures " +
    "(if a shared dependency blips, all instances report unhealthy at once). Keep checks fast and cheap (they " +
    "run frequently), and be careful that deep dependency checks don't themselves cause load or false " +
    "negatives. This underpins the Health Endpoint Monitoring resiliency pattern.</p>"
};

C["availability-monitoring"] = {
  summary: "<p><strong>Availability monitoring</strong> measures whether the system is <em>reachable and usable " +
    "by its users</em> &mdash; tracking uptime/downtime, typically against an SLA/SLO. It's often done with " +
    "<strong>synthetic monitoring</strong> (automated probes from external locations that simulate user " +
    "actions and verify the system responds correctly) and by measuring real user success rates. The key " +
    "metric is the percentage of time the service is available (the 'nines'). Availability monitoring tells " +
    "you when users <em>can't</em> use the system &mdash; the most user-impacting failure &mdash; and feeds " +
    "SLA reporting, alerting, and error budgets.</p>",
  examples: [
    {
      title: "Example 1: Synthetic (external) probes",
      description: "<p>Simulate users from outside to catch real reachability issues.</p>",
      code: "// From multiple external regions, every minute:\n" +
        "//   probe: GET /login -> assert 200 + expected content within 2s\n" +
        "//   probe: run a key user flow (login -> dashboard) end to end\n" +
        "// Failures from outside = users can't reach/use the system\n" +
        "//   (catches DNS, network, TLS, and whole-stack outages a /health misses)."
    },
    {
      title: "Example 2: Tracking against an SLO",
      description: "<p>Availability as a measured percentage and error budget.</p>",
      code: "// SLO: 99.9% availability per month (~43 min downtime budget)\n" +
        "// Measure: successful_requests / total_requests over the window\n" +
        "// Burn through the error budget too fast -> alert + slow down risky\n" +
        "//   changes (the basis of SRE error-budget policy)."
    }
  ],
  whenToUse: "<p>Use availability monitoring for any user-facing service with uptime expectations &mdash; it's " +
    "how you know whether you're meeting SLAs/SLOs and when users are actually affected. Combine " +
    "<strong>synthetic</strong> probes (proactive, from the user's perspective, multi-region) with " +
    "<strong>real-user</strong> success-rate measurement. <strong>Gotchas:</strong> internal health checks " +
    "can say 'green' while users still can't reach you (DNS failure, CDN issue, network/TLS problems, a broken " +
    "client path) &mdash; external synthetic monitoring is what catches these, so don't rely on " +
    "<code>/health</code> alone. Measure from multiple geographic locations (a regional outage may only affect " +
    "some users). Define availability precisely (which endpoints/flows count, what 'success' means including " +
    "latency thresholds &mdash; a 30-second response is effectively down). Tie it to error budgets to balance " +
    "reliability against feature velocity. It's the most user-centric monitoring signal.</p>"
};

C["performance-monitoring"] = {
  summary: "<p><strong>Performance monitoring</strong> tracks how <em>fast and efficient</em> a system is &mdash; " +
    "latency (response times, ideally at percentiles like p50/p95/p99), throughput (requests/sec), and " +
    "resource utilization (CPU, memory, disk, network, connection pools). It surfaces slowdowns, bottlenecks, " +
    "and capacity limits before they become outages, and validates that the system meets its performance " +
    "targets. <strong>APM (Application Performance Monitoring)</strong> tools and distributed tracing help " +
    "pinpoint <em>where</em> time is spent across services and which queries/calls are slow. Performance " +
    "monitoring is essential for capacity planning, regression detection, and meeting latency SLOs.</p>",
  examples: [
    {
      title: "Example 1: Latency percentiles, not averages",
      description: "<p>Percentiles reveal the slow tail averages hide.</p>",
      code: "// Average latency 80ms looks fine, BUT:\n" +
        "//   p50 = 40ms, p95 = 300ms, p99 = 2s\n" +
        "//   -> 1% of requests take 2 seconds (your worst-affected users!).\n" +
        "// Always monitor p95/p99, not just the mean - the tail is what hurts."
    },
    {
      title: "Example 2: Tracing finds the bottleneck",
      description: "<p>Distributed tracing shows where the time goes.</p>",
      code: "// A slow request, broken down by a trace:\n" +
        "//   total 1200ms = gateway 20ms + auth 30ms + DB query 1100ms (!) + ...\n" +
        "// -> the DB query is the bottleneck; add an index / cache it.\n" +
        "// Without tracing you only know it's 'slow', not WHERE."
    }
  ],
  whenToUse: "<p>Use performance monitoring continuously to detect slowdowns, find bottlenecks, validate " +
    "latency SLOs, catch performance regressions after deploys, and plan capacity. Track the 'golden signals' " +
    "&mdash; latency, traffic, errors, saturation &mdash; and use APM/tracing to localize problems across a " +
    "distributed system. <strong>Gotchas:</strong> <strong>measure percentiles, not averages</strong> &mdash; " +
    "a healthy mean can hide a terrible p99 (the experience of your most-affected users), and averaging " +
    "percentiles across instances is statistically wrong. Watch saturation (resource utilization approaching " +
    "limits) as a leading indicator before things break. Tracing is essential in microservices to find which " +
    "service/query is slow. Beware the observer effect and cost (high-frequency, high-cardinality metrics and " +
    "always-on tracing add overhead &mdash; sample wisely). Set thresholds tied to user-impacting targets, not " +
    "arbitrary numbers.</p>"
};

C["security-monitoring"] = {
  summary: "<p><strong>Security monitoring</strong> watches for threats, attacks, vulnerabilities, and " +
    "suspicious behavior &mdash; detecting and helping respond to security incidents. It includes tracking " +
    "authentication failures and anomalies (brute-force, credential stuffing), unauthorized access attempts, " +
    "unusual traffic patterns (DDoS, scraping), audit logging of sensitive actions, and integration with " +
    "<strong>SIEM</strong> (Security Information and Event Management) systems and intrusion detection. " +
    "Security monitoring provides the audit trail and real-time alerting needed to detect breaches early " +
    "(time-to-detect is critical), support investigations/forensics, and meet compliance requirements.</p>",
  examples: [
    {
      title: "Example 1: Detecting suspicious patterns",
      description: "<p>Anomalies in auth and access often signal attacks.</p>",
      code: "// Alert on signals like:\n" +
        "//   - 100s of failed logins for one account -> brute force\n" +
        "//   - logins from a new country / impossible travel\n" +
        "//   - spike in 401/403 -> probing for access\n" +
        "//   - a user suddenly accessing far more data than usual -> exfiltration\n" +
        "//   - unusual outbound traffic -> possible compromise"
    },
    {
      title: "Example 2: Audit logging for forensics + compliance",
      description: "<p>An immutable trail of sensitive actions.</p>",
      code: "// Log security-relevant events (who/what/when/where):\n" +
        "//   audit: { user, action: 'export_customer_data', ip, timestamp }\n" +
        "// Ship to a tamper-resistant store / SIEM.\n" +
        "// Needed to investigate incidents AND for compliance (GDPR, SOC2, etc.)."
    }
  ],
  whenToUse: "<p>Implement security monitoring for any system handling user data, authentication, payments, or " +
    "anything an attacker might target &mdash; effectively all production systems, and especially " +
    "regulated/sensitive ones. It's how you detect breaches quickly (attackers often dwell undetected for " +
    "weeks), investigate incidents, and satisfy compliance. <strong>Gotchas:</strong> log " +
    "security-relevant events with enough context (who, what, when, where) but <strong>never log secrets/PII " +
    "in plaintext</strong> (passwords, tokens, card numbers) &mdash; logs become a liability if leaked. Tune " +
    "detection to balance false positives (alert fatigue) against missing real attacks. Protect the logs " +
    "themselves (tamper-resistant, access-controlled &mdash; attackers try to erase their tracks). " +
    "Security monitoring complements, not replaces, preventive security (auth, encryption, patching); it's the " +
    "detection-and-response layer. Integrate with incident response so alerts lead to action.</p>"
};

C["usage-monitoring"] = {
  summary: "<p><strong>Usage monitoring</strong> tracks <em>how</em> the system and its features are used &mdash; " +
    "which features/endpoints are popular, how much each tenant/customer consumes, traffic patterns over time, " +
    "and resource consumption per user/operation. Unlike health or performance monitoring (focused on " +
    "operations), usage monitoring serves business and capacity needs: it informs <strong>capacity " +
    "planning</strong>, <strong>billing/metering</strong> (charging by usage), product decisions (which " +
    "features matter), and detecting abuse or unusual consumption. It connects technical telemetry to business " +
    "insight and cost management.</p>",
  examples: [
    {
      title: "Example 1: Metering for billing and quotas",
      description: "<p>Track per-tenant consumption to bill and enforce limits.</p>",
      code: "// Track usage per customer:\n" +
        "//   api_calls, storage_gb, compute_minutes, messages_sent ...\n" +
        "// -> bill by consumption, enforce plan quotas, detect a customer\n" +
        "//    suddenly using 100x normal (abuse, runaway job, or upsell signal)."
    },
    {
      title: "Example 2: Feature usage informs decisions",
      description: "<p>Know what's used to plan capacity and product.</p>",
      code: "// Which endpoints/features get the most traffic? Trends over time?\n" +
        "//   -> capacity planning (scale the busy paths)\n" +
        "//   -> product: invest in popular features, sunset unused ones\n" +
        "//   -> spot adoption changes after a release"
    }
  ],
  whenToUse: "<p>Use usage monitoring for capacity planning (know what to scale and when), usage-based billing/" +
    "metering, enforcing quotas and rate limits, understanding product adoption, and detecting abuse or " +
    "anomalous consumption (which is also a cost-control and security signal). It bridges engineering and " +
    "business. <strong>Gotchas:</strong> usage data often involves user behavior, so respect " +
    "<strong>privacy and compliance</strong> (anonymize/aggregate where possible, honor consent, don't " +
    "over-collect &mdash; GDPR/CCPA implications). For billing, accuracy and reliability of metering matter " +
    "(under/over-charging erodes trust), so make it auditable. High-cardinality per-user metrics can be " +
    "expensive to store &mdash; aggregate appropriately. Distinguish usage monitoring (business/capacity) from " +
    "performance monitoring (operations); both draw on the same instrumentation but answer different " +
    "questions. It's especially critical for multi-tenant SaaS where per-tenant usage drives both cost and " +
    "revenue.</p>"
};

C["instrumentation"] = {
  summary: "<p><strong>Instrumentation</strong> is adding code to your application to emit telemetry &mdash; " +
    "<strong>metrics</strong> (numeric measurements like request count, latency, errors), <strong>logs</strong> " +
    "(discrete event records), and <strong>traces</strong> (the path and timing of a request across " +
    "components). It's the foundation of all monitoring: without instrumentation, you have no data to " +
    "visualize, alert on, or debug with. Modern practice uses standards like <strong>OpenTelemetry</strong> " +
    "for vendor-neutral instrumentation, and libraries (Micrometer, Prometheus clients) that make emitting and " +
    "exporting telemetry straightforward. Good instrumentation captures meaningful signals with " +
    "<strong>structured</strong>, correlatable data (e.g. a trace/correlation id linking logs to a request).</p>",
  examples: [
    {
      title: "Example 1: Emitting metrics and structured logs",
      description: "<p>Record measurements and contextual events.</p>",
      code: "// Metric: count + time an operation\n" +
        "ordersPlaced.increment();\n" +
        "timer.record(() => placeOrder(o));   // latency histogram\n" +
        "\n" +
        "// Structured log (machine-parseable, with context):\n" +
        "log.info({ event: 'order_placed', orderId: 42, userId: 7,\n" +
        "           traceId: 'abc', durationMs: 85 });"
    },
    {
      title: "Example 2: Tracing across services",
      description: "<p>A propagated trace id ties the whole request together.</p>",
      code: "// A request gets a traceId at the edge; every service propagates it\n" +
        "// (e.g. via headers) and records spans:\n" +
        "//   [gateway span] -> [auth span] -> [order span] -> [db span]\n" +
        "// -> reconstruct the full request timeline; correlate logs by traceId.\n" +
        "// OpenTelemetry standardizes this across languages/vendors."
    }
  ],
  whenToUse: "<p>Instrument code from the beginning of any production service &mdash; it's the prerequisite for " +
    "every other kind of monitoring and for debugging issues you can't reproduce locally. Emit metrics for the " +
    "golden signals and key business events, structured logs with context, and traces in distributed systems. " +
    "Prefer <strong>OpenTelemetry</strong> for vendor-neutral, portable instrumentation. <strong>Gotchas:</strong> " +
    "use <strong>structured logging</strong> (JSON with fields) rather than free-text so logs are queryable, " +
    "and include a <strong>correlation/trace id</strong> so you can tie together all telemetry for one request " +
    "(invaluable across microservices). Beware overhead and cost: high-frequency metrics, verbose logging, and " +
    "always-on tracing add latency and storage cost &mdash; sample traces, choose log levels wisely, and avoid " +
    "<strong>high-cardinality</strong> metric labels (unbounded values like user id explode the metric count). " +
    "Don't log secrets/PII. Instrument the signals that answer real operational questions, not everything " +
    "indiscriminately.</p>"
};

C["visualization-alerts"] = {
  summary: "<p><strong>Visualization & alerts</strong> turn raw telemetry into human-understandable insight and " +
    "automated notifications. <strong>Visualization</strong> means dashboards (Grafana, Kibana, " +
    "vendor tools) that chart metrics and let you spot trends, anomalies, and correlations at a glance. " +
    "<strong>Alerting</strong> means rules that automatically notify on-call engineers when something crosses " +
    "a threshold or violates an SLO (high error rate, latency spike, low disk) &mdash; so problems are caught " +
    "and acted on quickly rather than discovered by users. Together they close the monitoring loop: " +
    "instrument &rarr; collect &rarr; visualize &rarr; alert &rarr; respond.</p>",
  examples: [
    {
      title: "Example 1: A service dashboard",
      description: "<p>Key signals on one screen for quick assessment.</p>",
      code: "// Dashboard panels (the golden signals + business KPIs):\n" +
        "//   request rate | error rate | p50/p95/p99 latency\n" +
        "//   CPU/memory/saturation | DB connections | queue depth\n" +
        "//   orders/min, signups, revenue (business view)\n" +
        "// One glance answers 'is the system healthy right now?'"
    },
    {
      title: "Example 2: Alert on symptoms tied to SLOs",
      description: "<p>Page on what users feel, not on noise.</p>",
      code: "// Good alerts (user-impacting, SLO-based):\n" +
        "//   error_rate > 1% for 5m       -> page\n" +
        "//   p99_latency > 500ms for 10m  -> page\n" +
        "//   disk_free < 10%              -> page (leading indicator)\n" +
        "// Avoid: alerting on every CPU blip -> noise -> alert fatigue."
    }
  ],
  whenToUse: "<p>Build dashboards and alerts for every production service so you can see health at a glance and " +
    "get notified before users complain. Dashboards aid diagnosis and trend-spotting; alerts drive timely " +
    "response. Tie alerts to <strong>SLOs and user-impacting symptoms</strong> (latency, errors, availability) " +
    "plus key leading indicators (saturation, disk). <strong>Gotchas:</strong> the biggest pitfall is " +
    "<strong>alert fatigue</strong> &mdash; too many noisy, non-actionable alerts train on-call to ignore " +
    "pages (and miss the real one). Every alert should be actionable and ideally come with a runbook. Alert on " +
    "<em>symptoms</em> (what users experience) rather than every <em>cause</em>; use severity levels (page vs " +
    "ticket vs info). Avoid alerting on raw causes that don't always matter (a brief CPU spike). Keep " +
    "dashboards focused (a wall of 200 graphs helps no one) &mdash; highlight the golden signals. Review and " +
    "prune alerts regularly. Good visualization + disciplined alerting is what makes all the collected " +
    "telemetry actually useful.</p>"
};

/* ======================================================================
   CLOUD DESIGN PATTERNS (overview) + MESSAGING
   ====================================================================== */

C["cloud-design-patterns"] = {
  summary: "<p><strong>Cloud design patterns</strong> are reusable solutions to common problems in building " +
    "reliable, scalable, secure distributed/cloud systems &mdash; a well-known catalog is Microsoft's Azure " +
    "Architecture Center patterns (vendor-neutral despite the source). They're grouped by concern: " +
    "<strong>data management</strong> (CQRS, Event Sourcing, Materialized View, Sharding...), <strong>design " +
    "& implementation</strong> (Ambassador, Sidecar, Gateway patterns, Strangler Fig...), " +
    "<strong>messaging</strong> (Pub/Sub, Competing Consumers, Queue-Based Load Leveling...), and " +
    "<strong>reliability</strong> (Circuit Breaker, Retry, Bulkhead, Throttling...). Each addresses specific " +
    "challenges of distribution &mdash; latency, failure, scale, consistency &mdash; with known trade-offs.</p>",
  examples: [
    {
      title: "Example 1: Pattern categories",
      description: "<p>The patterns are organized by the problem they solve.</p>",
      code: "// Data Management:   CQRS, Event Sourcing, Materialized View, Sharding,\n" +
        "//                    Index Table, Cache-Aside, Valet Key, Static Hosting\n" +
        "// Design & Impl.:    Ambassador, Anti-Corruption Layer, Sidecar, Strangler Fig,\n" +
        "//                    Gateway (Routing/Offloading/Aggregation), Leader Election\n" +
        "// Messaging:         Pub/Sub, Competing Consumers, Queue-Based Load Leveling,\n" +
        "//                    Priority Queue, Pipes & Filters, Claim Check, Choreography\n" +
        "// Reliability:       Circuit Breaker, Retry, Bulkhead, Throttling, Compensating Tx"
    },
    {
      title: "Example 2: Patterns solve recurring problems",
      description: "<p>Recognize the problem, apply the known pattern.</p>",
      code: "// 'Spiky load overwhelms my service'   -> Queue-Based Load Leveling\n" +
        "// 'One failing dependency cascades'     -> Circuit Breaker + Bulkhead\n" +
        "// 'Migrate a legacy system gradually'   -> Strangler Fig\n" +
        "// 'Reads and writes need different models' -> CQRS\n" +
        "// 'Add cross-cutting features at the edge' -> Gateway Offloading"
    }
  ],
  whenToUse: "<p>Reach for a cloud design pattern when you recognize the <em>problem</em> it solves &mdash; not " +
    "to collect patterns. They give you proven structures and shared vocabulary for distributed-system " +
    "challenges. <strong>Gotchas:</strong> every pattern carries complexity and trade-offs, so apply them " +
    "judiciously and only when a real problem warrants it &mdash; cargo-culting patterns (especially heavy " +
    "ones like CQRS, Event Sourcing, or full microservice gateways) into systems that don't need them is a " +
    "common form of over-engineering. Many patterns combine (Circuit Breaker + Retry + Bulkhead for " +
    "resilience; Gateway patterns together at the edge). Start with the simplest design that works and " +
    "introduce a pattern when its specific pain point appears. The sub-categories (Messaging, Data Management, " +
    "Design & Implementation, and the Reliability groups) detail the individual patterns.</p>"
};

C["messaging"] = {
  summary: "<p>The <strong>messaging</strong> cloud design patterns address communication and coordination via " +
    "<strong>messages</strong> in distributed systems &mdash; how to connect components asynchronously, " +
    "reliably, and scalably. They include <strong>Publisher/Subscriber</strong> (broadcast events), " +
    "<strong>Competing Consumers</strong> (scale processing across workers), <strong>Queue-Based Load " +
    "Leveling</strong> (buffer spikes), <strong>Priority Queue</strong>, <strong>Pipes and Filters</strong> " +
    "(staged processing), <strong>Claim Check</strong> (handle large payloads), <strong>Async Request-" +
    "Reply</strong>, <strong>Choreography</strong> (decentralized coordination), <strong>Sequential " +
    "Convoy</strong> (ordered processing), and <strong>Scheduler Agent Supervisor</strong> (coordinate " +
    "distributed work). They build on message queues to decouple and scale systems.</p>",
  examples: [
    {
      title: "Example 1: Messaging patterns at a glance",
      description: "<p>Each solves a specific messaging challenge.</p>",
      code: "// Pub/Sub                 -> broadcast an event to many subscribers\n" +
        "// Competing Consumers     -> many workers share one queue (scale out)\n" +
        "// Queue-Based Load Leveling-> queue absorbs spikes; workers drain steadily\n" +
        "// Priority Queue          -> urgent messages processed first\n" +
        "// Claim Check             -> store big payload externally, pass a reference\n" +
        "// Choreography            -> services react to events, no central orchestrator"
    },
    {
      title: "Example 2: They compose",
      description: "<p>Real systems combine several messaging patterns.</p>",
      code: "// An order pipeline might use:\n" +
        "//   Pub/Sub (broadcast OrderPlaced)\n" +
        "//   + Competing Consumers (worker pool processes the work)\n" +
        "//   + Queue-Based Load Leveling (buffer Black Friday spikes)\n" +
        "//   + Async Request-Reply (tell the user when it's done)"
    }
  ],
  whenToUse: "<p>Use messaging patterns when components must communicate asynchronously, scale independently, " +
    "or stay decoupled &mdash; event-driven architectures, microservices, work distribution, and spike " +
    "absorption. They're the building blocks for resilient, scalable inter-service communication. " +
    "<strong>Gotchas:</strong> all of them inherit messaging realities &mdash; a broker as critical " +
    "infrastructure, at-least-once delivery (so consumers must be <strong>idempotent</strong>), ordering " +
    "challenges, failure handling (dead-letter queues), and harder end-to-end tracing. Pick the specific " +
    "pattern that matches your need rather than adopting messaging wholesale; for simple synchronous request/" +
    "response a direct call is simpler. The sub-topics detail each messaging pattern and its trade-offs.</p>"
};

C["sequential-convoy"] = {
  summary: "<p>The <strong>Sequential Convoy</strong> pattern processes a set of related messages in a " +
    "<strong>defined order</strong> while still allowing different groups to be processed in parallel. In " +
    "messaging systems that scale by adding consumers (competing consumers), ordering is normally lost &mdash; " +
    "but some workflows require that messages for the same entity (e.g. one customer's orders, one device's " +
    "events) be handled in sequence. Sequential Convoy groups messages by a key and ensures all messages in a " +
    "group are processed in order (often by routing a group to a single consumer / a per-key partition), while " +
    "independent groups proceed concurrently.</p>",
  examples: [
    {
      title: "Example 1: Order within a group, parallel across groups",
      description: "<p>Partition by key so each entity's messages stay ordered.</p>",
      code: "// Messages keyed by accountId; ordering matters PER account:\n" +
        "//   account A: [deposit, withdraw]  must run in that order\n" +
        "//   account B: [open, deposit]      independent of A\n" +
        "// Route by key (e.g. Kafka partition = hash(accountId)):\n" +
        "//   all of A -> partition/consumer 1 (in order)\n" +
        "//   all of B -> partition/consumer 2 (in order)\n" +
        "// A and B process in PARALLEL; within each, order is preserved."
    },
    {
      title: "Example 2: Why naive scaling breaks order",
      description: "<p>Competing consumers alone don't preserve sequence.</p>",
      code: "// Plain competing consumers: A's 'withdraw' might be picked by worker 2\n" +
        "//   BEFORE A's 'deposit' (picked by worker 1) finishes -> wrong order!\n" +
        "// Sequential Convoy fixes this by keeping a key's messages on ONE\n" +
        "//   ordered stream while different keys scale out."
    }
  ],
  whenToUse: "<p>Use Sequential Convoy when message order matters <em>within</em> a logical group but groups are " +
    "independent &mdash; per-account transactions, per-device event streams, per-order state transitions, " +
    "anything where 'process A's events in order, but A and B can go in parallel'. It reconciles ordering with " +
    "scalability. <strong>Gotchas:</strong> partitioning by key means a <em>hot key</em> (one very busy group) " +
    "becomes a bottleneck that can't be parallelized (all its messages funnel to one consumer) &mdash; choose " +
    "the grouping key carefully. Strict ordering reduces throughput and adds complexity (you can't just freely " +
    "scale consumers). Kafka-style partitioned logs naturally support this (order within a partition). Only " +
    "impose ordering where it's genuinely required &mdash; if order doesn't matter, plain competing consumers " +
    "scale better and simpler. It often pairs with idempotency to handle redelivery without breaking sequence " +
    "logic.</p>"
};

C["scheduling-agent-supervisor"] = {
  summary: "<p>The <strong>Scheduler Agent Supervisor</strong> pattern coordinates a set of distributed actions " +
    "as a single operation, with built-in failure handling and recovery. It has three roles: the " +
    "<strong>Scheduler</strong> orchestrates the steps of the workflow and records state; <strong>Agents</strong> " +
    "perform the actual remote/distributed work (calling services, resources); and the <strong>Supervisor</strong> " +
    "monitors the workflow, detecting steps that fail or time out and triggering remediation (retry or " +
    "compensating/undo actions). It's a way to reliably manage long-running, multi-step distributed " +
    "operations that can partially fail &mdash; related to the saga pattern for distributed transactions.</p>",
  examples: [
    {
      title: "Example 1: The three roles",
      description: "<p>Schedule steps, do work via agents, supervise for failures.</p>",
      code: "// Scheduler:  drives the workflow, persists each step's state\n" +
        "//   e.g. book flight -> book hotel -> charge card (record progress)\n" +
        "// Agents:     execute each remote step (flight svc, hotel svc, payment)\n" +
        "// Supervisor: watches for steps that failed/timed out ->\n" +
        "//   retry, or run COMPENSATING actions (cancel flight, refund) to undo."
    },
    {
      title: "Example 2: Recovering from partial failure",
      description: "<p>If a later step fails, undo the earlier ones.</p>",
      code: "// flight booked OK -> hotel booked OK -> payment FAILS\n" +
        "// Supervisor detects the failure and triggers compensation:\n" +
        "//   cancel hotel, cancel flight -> system returns to a consistent state.\n" +
        "// State is persisted so recovery works even if the scheduler restarts."
    }
  ],
  whenToUse: "<p>Use Scheduler Agent Supervisor (and the related saga pattern) for long-running, multi-step " +
    "distributed operations that span services/resources and must handle partial failure reliably &mdash; " +
    "travel bookings, order fulfillment, provisioning workflows, anything where you can't wrap the whole thing " +
    "in a single ACID transaction. It provides resilience and recovery (retry or compensate) for inherently " +
    "unreliable distributed work. <strong>Gotchas:</strong> it's complex &mdash; you must persist workflow " +
    "state durably (so recovery survives crashes), design <strong>compensating actions</strong> for each step " +
    "(undoing real-world effects is sometimes impossible or messy &mdash; you can't always 'un-send' an " +
    "email), and make steps idempotent (retries/recovery may re-run them). Distributed workflows are " +
    "eventually consistent, not atomic. Don't reach for this for simple operations; use it when you genuinely " +
    "have distributed, failure-prone, multi-step transactions. Workflow engines (Temporal, AWS Step Functions, " +
    "Camunda) implement this pattern so you don't hand-roll it.</p>"
};

C["queue-based-load-leveling"] = {
  summary: "<p><strong>Queue-Based Load Leveling</strong> places a <strong>queue</strong> between producers and " +
    "a service/resource to smooth out load spikes. Instead of bursts of requests hitting the service directly " +
    "(and overwhelming it), requests are enqueued and the service consumes them at its own sustainable rate. " +
    "The queue acts as a buffer/shock absorber, decoupling the <em>arrival</em> rate from the " +
    "<em>processing</em> rate. This protects downstream resources (databases, services) from being swamped " +
    "during peaks, improves reliability, and lets you size the service for the <em>average</em> load rather " +
    "than the peak.</p>",
  examples: [
    {
      title: "Example 1: The queue as a shock absorber",
      description: "<p>Bursts fill the queue; the service drains it steadily.</p>",
      code: "// Without leveling: 10,000 simultaneous requests -> service/DB overload\n" +
        "// With queue-based load leveling:\n" +
        "//   [Producers] --burst--> [ Queue ] --steady rate--> [Service]\n" +
        "// The queue absorbs the spike; the service processes at, say,\n" +
        "//   500/sec sustainably. Peak is smoothed into manageable throughput."
    },
    {
      title: "Example 2: Size for average, not peak",
      description: "<p>Decoupling arrival from processing saves cost.</p>",
      code: "// Direct: must provision for PEAK (expensive, idle most of the time)\n" +
        "//   or fail during spikes.\n" +
        "// Queued: provision for AVERAGE throughput; the queue holds the\n" +
        "//   overflow during peaks and drains during lulls.\n" +
        "// (The queue depth itself is a great autoscaling signal.)"
    }
  ],
  whenToUse: "<p>Use Queue-Based Load Leveling when load is bursty/spiky and the downstream service or resource " +
    "could be overwhelmed by peaks &mdash; protecting databases, rate-limited external APIs, or " +
    "compute-intensive processing from traffic surges (sales events, batch arrivals, fan-out). It improves " +
    "resilience and cost-efficiency (provision for average, not peak). <strong>Gotchas:</strong> it makes " +
    "processing <strong>asynchronous and eventually consistent</strong> &mdash; the caller gets an " +
    "acknowledgment, not an immediate result, so it's unsuitable when a synchronous, real-time response is " +
    "required. Under sustained (not just spiky) overload the queue just grows unboundedly &mdash; pair it with " +
    "<strong>back pressure</strong>/load shedding and autoscale consumers based on queue depth. You add a " +
    "queue as infrastructure, and consumers must be idempotent. It's one of the most useful, broadly-" +
    "applicable patterns for protecting services from spikes; it appears in the Availability and Resiliency " +
    "pattern groups for exactly this reason.</p>"
};

C["publisher-subscriber"] = {
  summary: "<p>The <strong>Publisher/Subscriber (Pub/Sub)</strong> pattern lets a publisher broadcast messages/" +
    "events to <em>multiple</em> interested subscribers without knowing who they are, via an intermediary " +
    "(message broker/topic). Publishers send to a <strong>topic</strong>; subscribers register interest and " +
    "each receives a copy of relevant messages. It fully decouples senders from receivers (in identity, " +
    "number, and time) and enables one-to-many fan-out, so adding a new consumer doesn't require changing the " +
    "publisher. It's the backbone of event-driven architectures (Kafka, RabbitMQ, Google Pub/Sub, SNS).</p>",
  examples: [
    {
      title: "Example 1: One event, many independent reactions",
      description: "<p>The publisher broadcasts; subscribers react on their own.</p>",
      code: "// Publisher emits to a topic, unaware of subscribers:\n" +
        "//   publish('OrderPlaced', { orderId: 42 })\n" +
        "// Each subscriber independently receives a copy:\n" +
        "//   - Email service     -> send confirmation\n" +
        "//   - Inventory service -> reserve stock\n" +
        "//   - Analytics service -> record the sale\n" +
        "// Add a Fraud service later -> just subscribe; publisher unchanged."
    },
    {
      title: "Example 2: Pub/Sub vs point-to-point queue",
      description: "<p>Broadcast to all vs deliver to one.</p>",
      code: "// Pub/Sub (topic): every subscriber gets a COPY (fan-out)\n" +
        "// Point-to-point (queue): each message goes to exactly ONE consumer\n" +
        "//   (Competing Consumers - for distributing work, not broadcasting)"
    }
  ],
  whenToUse: "<p>Use Pub/Sub when an event has multiple interested consumers, when you want to add/remove " +
    "consumers without touching producers, or when you need decoupled, asynchronous broadcast &mdash; domain " +
    "events, notifications, cache invalidation fan-out, integrating multiple systems. It's central to " +
    "event-driven and microservice designs. <strong>Gotchas:</strong> you take on a broker as critical " +
    "infrastructure; flow becomes implicit and harder to trace (you must know who subscribes). Reason about " +
    "delivery guarantees (at-least-once &rarr; duplicates &rarr; idempotent subscribers), message ordering, " +
    "and what happens when a subscriber is down (durable subscriptions, dead-letter queues, replay). Schema/" +
    "event versioning matters as subscribers evolve independently. For one-to-one work distribution use a " +
    "queue (Competing Consumers) instead; for simple direct calls, Pub/Sub is overkill. It's the messaging " +
    "embodiment of the Observer principle at system scale.</p>"
};

C["priority-queue"] = {
  summary: "<p>The <strong>Priority Queue</strong> pattern processes messages according to their " +
    "<strong>priority</strong> rather than strictly in arrival order, so high-priority work is handled before " +
    "lower-priority work even if it arrived later. This is useful when some requests are more urgent or " +
    "valuable than others (premium customers, time-sensitive operations, critical alerts). It's implemented " +
    "either with a broker that supports message priorities, or with <strong>separate queues per priority " +
    "level</strong> consumed with weighting (high-priority queue checked first / given more consumers). It " +
    "ensures important work isn't stuck behind a backlog of trivial messages.</p>",
  examples: [
    {
      title: "Example 1: Separate queues per priority",
      description: "<p>Consumers favor the high-priority queue.</p>",
      code: "// Three queues: high, normal, low\n" +
        "// Consumers: always drain 'high' first; only take 'normal'/'low'\n" +
        "//   when 'high' is empty (or use weighted allocation, e.g. 5:3:1).\n" +
        "// A premium request enqueued now jumps ahead of a backlog of\n" +
        "//   low-priority batch messages."
    },
    {
      title: "Example 2: Use cases",
      description: "<p>When some work genuinely must go first.</p>",
      code: "// - Paid/premium customers served before free-tier requests\n" +
        "// - Critical alerts processed before routine notifications\n" +
        "// - Time-sensitive operations (e.g. expiring) ahead of background work\n" +
        "// - Express vs standard processing tiers"
    }
  ],
  whenToUse: "<p>Use a Priority Queue when some messages genuinely need faster handling than others and " +
    "processing them strictly FIFO would delay important work &mdash; tiered service levels (premium vs free), " +
    "urgent vs routine tasks, time-critical operations. It ensures SLAs for high-priority work. " +
    "<strong>Gotchas:</strong> the main risk is <strong>starvation</strong> &mdash; if high-priority work " +
    "never stops arriving, low-priority messages may <em>never</em> be processed; mitigate with weighted/fair " +
    "scheduling (guarantee low-priority gets <em>some</em> share) or aging (raise priority of long-waiting " +
    "messages). Broker-native priority support varies and can have performance costs; the multiple-queue " +
    "approach is often simpler and more predictable. Don't over-engineer with many priority levels &mdash; " +
    "two or three tiers usually suffice. Only add prioritization when ordering by urgency actually matters; if " +
    "all work is equally important, a plain queue is simpler.</p>"
};

C["pipes-and-filters"] = {
  summary: "<p>The <strong>Pipes and Filters</strong> pattern decomposes a complex processing task into a " +
    "sequence of independent <strong>filters</strong> (each performing one transformation/step), connected by " +
    "<strong>pipes</strong> (channels passing data from one filter to the next). Each filter does a single, " +
    "well-defined job and is independent of the others, so they can be reused, reordered, tested in isolation, " +
    "and scaled independently. Data flows through the pipeline, transformed at each stage. It's ideal for " +
    "multi-step data processing &mdash; ETL, message processing pipelines, request transformation &mdash; and " +
    "echoes the Unix philosophy (<code>cmd1 | cmd2 | cmd3</code>).</p>",
  examples: [
    {
      title: "Example 1: A processing pipeline",
      description: "<p>Each filter transforms; pipes carry data along.</p>",
      code: "// Order processing as independent filters:\n" +
        "//   [validate] -> [enrich] -> [calculate tax] -> [persist] -> [notify]\n" +
        "// Each filter: one responsibility, independently testable/deployable.\n" +
        "// Like Unix:   cat file | grep error | sort | uniq -c"
    },
    {
      title: "Example 2: Independent scaling and reuse",
      description: "<p>Scale the slow stage; reuse filters across pipelines.</p>",
      code: "// If 'calculate tax' is the bottleneck, scale ONLY that filter\n" +
        "//   (run more instances of it) without touching the others.\n" +
        "// Reuse 'validate' and 'enrich' filters in a different pipeline.\n" +
        "// Filters often communicate via queues between stages (async)."
    }
  ],
  whenToUse: "<p>Use Pipes and Filters for tasks naturally decomposable into a series of independent " +
    "transformation steps &mdash; ETL/data pipelines, stream/message processing, media transcoding stages, " +
    "request/response transformation chains. It maximizes reuse, testability, and independent scaling of " +
    "stages. <strong>Gotchas:</strong> passing data between distributed filters (often via queues) adds " +
    "latency and serialization overhead, so it's better for throughput-oriented batch/stream work than " +
    "ultra-low-latency single requests. You must handle failures mid-pipeline (a filter fails &mdash; retry " +
    "the stage, dead-letter, or compensate) and idempotency (stages may re-run). Keep filters truly " +
    "<em>independent and stateless</em> (shared state breaks the benefits). If steps are tightly coupled or " +
    "the work is trivial, a single function is simpler than a pipeline. (Appears in both Messaging and Design " +
    "& Implementation pattern groups.)</p>"
};

C["competing-consumers"] = {
  summary: "<p>The <strong>Competing Consumers</strong> pattern has <em>multiple</em> consumer instances " +
    "reading from the <em>same</em> message queue, so they 'compete' to process messages &mdash; each message " +
    "is handled by exactly one consumer. This distributes the processing load across the consumers and lets " +
    "you scale throughput simply by adding more consumers (and shrink by removing them). It also improves " +
    "reliability (if one consumer dies, others keep processing) and naturally load-balances work. It's the " +
    "standard pattern for parallel processing of a work queue and the engine behind worker pools.</p>",
  examples: [
    {
      title: "Example 1: Many workers share one queue",
      description: "<p>Each message goes to exactly one of the competing consumers.</p>",
      code: "//                       -> [Consumer 1]\n" +
        "//   [ Queue ] --deliver-> [Consumer 2]   (each msg -> ONE consumer)\n" +
        "//                       -> [Consumer 3]\n" +
        "// Add consumers to increase throughput; remove them to scale down.\n" +
        "// One consumer crashes -> the others keep draining the queue."
    },
    {
      title: "Example 2: Scaling by consumer count",
      description: "<p>Throughput scales (roughly) with workers, up to limits.</p>",
      code: "// Queue backing up (depth growing)? -> add consumers.\n" +
        "// Autoscale workers based on queue depth / age of oldest message.\n" +
        "// Distinct from Pub/Sub: here each message is processed ONCE (work\n" +
        "//   distribution), not broadcast to all (fan-out)."
    }
  ],
  whenToUse: "<p>Use Competing Consumers to process a queue of work in parallel and scale throughput elastically " +
    "&mdash; background job processing, task queues, ingestion pipelines, any 'pool of workers draining a " +
    "queue'. It's the default for distributing independent units of work and pairs with autoscaling on queue " +
    "depth. <strong>Gotchas:</strong> message <strong>ordering is not preserved</strong> across competing " +
    "consumers (if order matters, use Sequential Convoy / partitioning). With at-least-once delivery, a " +
    "message may be processed more than once (a slow consumer's lock expires and another picks it up), so " +
    "consumers must be <strong>idempotent</strong>. Handle poison messages (always-failing) with retry limits " +
    "+ dead-letter queues so one bad message doesn't block progress. Ensure adequate visibility timeout / lock " +
    "duration for long tasks. It scales throughput, not a single message's latency. Combine with Queue-Based " +
    "Load Leveling for spike absorption.</p>"
};

C["choreography"] = {
  summary: "<p>The <strong>Choreography</strong> pattern coordinates a distributed workflow <em>without a " +
    "central controller</em>: each service reacts to events and emits its own events, and the overall process " +
    "emerges from these decentralized reactions. It contrasts with <strong>orchestration</strong> (a central " +
    "coordinator explicitly directs each step). In choreography, services are loosely coupled and autonomous " +
    "&mdash; they 'know how to dance' by responding to events &mdash; which avoids a central bottleneck/single " +
    "point of failure and lets services evolve independently. The trade-off is that the end-to-end flow is " +
    "implicit and harder to see, monitor, and reason about.</p>",
  examples: [
    {
      title: "Example 1: Services react to each other's events",
      description: "<p>No conductor &mdash; the flow emerges from reactions.</p>",
      code: "// Order saga via choreography (event-driven):\n" +
        "//   Order svc:    emits 'OrderCreated'\n" +
        "//   Payment svc:  on OrderCreated -> charge -> emits 'PaymentDone'\n" +
        "//   Inventory svc: on PaymentDone -> reserve -> emits 'StockReserved'\n" +
        "//   Shipping svc: on StockReserved -> ship -> emits 'Shipped'\n" +
        "// No central coordinator; each service just reacts and emits."
    },
    {
      title: "Example 2: Choreography vs orchestration",
      description: "<p>Decentralized reactions vs a central conductor.</p>",
      code: "// Orchestration: a central 'OrderOrchestrator' explicitly calls\n" +
        "//   payment, then inventory, then shipping (clear flow, central control,\n" +
        "//   but a coupling point / potential bottleneck).\n" +
        "// Choreography: services react to events autonomously (decoupled,\n" +
        "//   resilient, but the flow is implicit and harder to trace)."
    }
  ],
  whenToUse: "<p>Use choreography when you want loosely-coupled, autonomous services that react to events, avoid " +
    "a central coordinator as a bottleneck/SPOF, and let teams evolve services independently &mdash; " +
    "event-driven microservices, sagas where decentralization is preferred. <strong>Gotchas:</strong> the " +
    "end-to-end business flow becomes <strong>implicit and hard to follow</strong> &mdash; no single place " +
    "shows the whole process, making it harder to understand, debug, monitor, and change (you need good " +
    "distributed tracing and event documentation). Error handling and compensation across a choreographed saga " +
    "are tricky (no central place to coordinate rollback). It can lead to complex, cyclic event dependencies " +
    "if not designed carefully. <strong>Orchestration</strong> (a central coordinator, e.g. a workflow engine) " +
    "is often clearer for complex flows with many steps and error paths, at the cost of some coupling. Choose " +
    "choreography for simpler, decoupled event flows; orchestration when you need visible, controlled, complex " +
    "workflows.</p>"
};

C["claim-check"] = {
  summary: "<p>The <strong>Claim Check</strong> pattern handles <strong>large message payloads</strong> by " +
    "storing the big data in external storage and passing only a small <em>reference</em> (the 'claim check') " +
    "through the messaging system. Instead of putting a large file/blob directly in a message (bloating the " +
    "queue, hitting size limits, slowing the broker), the producer saves the payload to a store (e.g. S3/blob " +
    "storage) and sends a message containing just the location/id. The consumer uses that reference to " +
    "retrieve the full payload when needed. It keeps messages small and the broker efficient, like a coat-" +
    "check ticket for your luggage.</p>",
  examples: [
    {
      title: "Example 1: Store the payload, pass a reference",
      description: "<p>The message carries a pointer, not the big data.</p>",
      code: "// Producer:\n" +
        "//   1. upload the 50MB file to blob storage -> get key 'uploads/abc'\n" +
        "//   2. send a small message: { claimCheck: 'uploads/abc', type: 'video' }\n" +
        "// Consumer:\n" +
        "//   3. read the message -> fetch the file from storage using the key\n" +
        "// The queue only ever holds tiny reference messages."
    },
    {
      title: "Example 2: Why not just put it in the message",
      description: "<p>Large messages strain brokers and hit limits.</p>",
      code: "// Many brokers cap message size (e.g. SQS 256KB, Kafka default ~1MB).\n" +
        "// Big payloads in messages -> slow throughput, memory pressure,\n" +
        "//   broker storage bloat, failures on oversized messages.\n" +
        "// Claim Check sidesteps all of that by keeping payloads out of the broker."
    }
  ],
  whenToUse: "<p>Use Claim Check when messages would otherwise carry large payloads &mdash; file/image/video " +
    "uploads, big documents, large datasets &mdash; especially when the broker has size limits or you want to " +
    "keep messaging fast and cheap. It decouples payload size from the messaging system. <strong>Gotchas:</strong> " +
    "you now manage two things and their <strong>lifecycle</strong> &mdash; the message <em>and</em> the stored " +
    "payload; you must ensure the payload exists before/when the consumer reads it, and clean up stored " +
    "payloads after processing (or they accumulate cost). Handle the case where the reference is valid but the " +
    "blob was deleted/expired. Add security: the reference shouldn't let unauthorized parties fetch the data " +
    "(use signed URLs / access control &mdash; relates to the Valet Key pattern). It adds a storage round-trip " +
    "for the consumer. Don't use it for small payloads where the extra indirection isn't worth it &mdash; " +
    "reserve it for genuinely large data.</p>"
};

C["async-request-reply"] = {
  summary: "<p>The <strong>Asynchronous Request-Reply</strong> pattern decouples a long-running backend " +
    "operation from the client request when the work takes too long for a synchronous HTTP response. The " +
    "client makes a request, the server immediately returns an acknowledgment (often <code>202 Accepted</code> " +
    "with a status URL/job id), processes the work asynchronously, and the client obtains the result later &mdash; " +
    "typically by <strong>polling</strong> a status endpoint (or via webhook/push). It keeps the API " +
    "responsive and avoids long-held connections/timeouts, while still giving clients a way to get results " +
    "over HTTP without adopting full messaging on the client side.</p>",
  examples: [
    {
      title: "Example 1: 202 Accepted + status polling",
      description: "<p>Acknowledge fast; the client polls until the result is ready.</p>",
      code: "// 1. POST /jobs            -> 202 Accepted\n" +
        "//      Location: /jobs/abc/status   (where to check)\n" +
        "// 2. GET /jobs/abc/status  -> 200 { status: 'running' }\n" +
        "// 3. GET /jobs/abc/status  -> 200 { status: 'done',\n" +
        "//                                   resultUrl: '/jobs/abc/result' }\n" +
        "// 4. GET /jobs/abc/result  -> 200 <the result>"
    },
    {
      title: "Example 2: Why not just hold the connection",
      description: "<p>Long synchronous waits break down at scale.</p>",
      code: "// Synchronous long wait: client + server hold a connection for 60s+\n" +
        "//   -> timeouts (gateways/LBs cut long requests), wasted resources,\n" +
        "//      poor UX, and no resilience if the connection drops.\n" +
        "// Async request-reply: fast ack + poll -> robust and scalable."
    }
  ],
  whenToUse: "<p>Use Asynchronous Request-Reply for operations too slow for a synchronous response &mdash; " +
    "report generation, video processing, complex computations, bulk operations, anything beyond a few " +
    "seconds &mdash; where the client communicates over HTTP and can't easily consume a message queue " +
    "directly. It avoids gateway/LB timeouts and keeps the API responsive. <strong>Gotchas:</strong> " +
    "<strong>polling</strong> is simple but wastes requests and adds latency between checks (tune the interval, " +
    "use backoff; for instant results consider webhooks or WebSocket/SSE push instead). Return a clear job/" +
    "correlation id and handle status lifecycle (pending/running/done/failed) plus result expiry. Make the " +
    "submit idempotent (use an idempotency key) so a retried submission doesn't start duplicate jobs. Decide " +
    "how long results are retained. It's the request/reply face of background jobs (which do the actual async " +
    "work behind it). For genuinely fast operations, a normal synchronous response is simpler &mdash; only go " +
    "async when the duration warrants it.</p>"
};

/* ======================================================================
   DATA MANAGEMENT
   ====================================================================== */

C["data-management"] = {
  summary: "<p>The <strong>data management</strong> cloud design patterns address how data is stored, " +
    "queried, kept consistent, and secured in distributed systems. They include <strong>CQRS</strong> " +
    "(separate read/write models), <strong>Event Sourcing</strong> (store changes as events), " +
    "<strong>Materialized View</strong> (precompute query-optimized projections), <strong>Index Table</strong> " +
    "(secondary indexes for non-key lookups), <strong>Sharding</strong> (partition data across nodes), " +
    "<strong>Cache-Aside</strong> (load into cache on demand), <strong>Valet Key</strong> (grant scoped " +
    "direct access to storage), and <strong>Static Content Hosting</strong> (serve static assets from " +
    "storage/CDN). They help data layers scale, perform, and stay secure where a single naive database " +
    "struggles.</p>",
  examples: [
    {
      title: "Example 1: Data patterns by problem",
      description: "<p>Each addresses a specific data challenge.</p>",
      code: "// Different read vs write needs   -> CQRS\n" +
        "// Need full history / audit / replay -> Event Sourcing\n" +
        "// Slow aggregate/join queries       -> Materialized View\n" +
        "// Lookups by a non-primary field    -> Index Table\n" +
        "// Data too big for one node         -> Sharding\n" +
        "// Offload large-file access securely -> Valet Key"
    },
    {
      title: "Example 2: They often combine",
      description: "<p>Data patterns frequently work together.</p>",
      code: "// Event Sourcing + CQRS: events are the write model; projections\n" +
        "//   build read-optimized views (often as Materialized Views).\n" +
        "// Cache-Aside + Materialized View: precompute + cache hot read models.\n" +
        "// Sharding + Index Table: partition data, plus secondary lookup tables."
    }
  ],
  whenToUse: "<p>Apply data management patterns when your data layer hits limits in performance, scale, query " +
    "flexibility, consistency, or security &mdash; high read/write asymmetry (CQRS), audit/history needs " +
    "(Event Sourcing), slow aggregations (Materialized View), non-key lookups (Index Table), volume " +
    "(Sharding), or secure large-file access (Valet Key). <strong>Gotchas:</strong> several of these " +
    "(especially CQRS and Event Sourcing) add substantial complexity and eventual consistency, and are " +
    "frequently over-applied &mdash; reach for them only when a concrete problem justifies the cost, often " +
    "for specific aggregates rather than the whole system. For most applications, a well-indexed relational " +
    "database with caching covers the needs. The sub-topics detail each pattern and when it earns its keep.</p>"
};

C["valet-key"] = {
  summary: "<p>The <strong>Valet Key</strong> pattern grants a client <strong>limited, time-bound, direct " +
    "access</strong> to a specific resource (usually in object/blob storage) using a token, so the client can " +
    "upload or download data <em>directly</em> to/from storage without routing the data through your " +
    "application servers. The classic implementation is a <strong>pre-signed URL</strong> (S3 presigned URLs, " +
    "Azure SAS tokens): your server generates a URL that grants scoped permission (e.g. 'upload to this one " +
    "key, for the next 15 minutes') and hands it to the client, who uses it to transfer data straight to " +
    "storage. This offloads heavy data transfer from your servers.</p>",
  examples: [
    {
      title: "Example 1: Pre-signed upload URL",
      description: "<p>The client uploads directly to storage, bypassing your servers.</p>",
      code: "// 1. Client asks your API: 'I want to upload avatar.jpg'\n" +
        "// 2. Server generates a scoped, expiring URL (valet key):\n" +
        "//      presignedUrl = storage.presign('PUT', 'avatars/user7.jpg', '15m')\n" +
        "// 3. Client uploads the file DIRECTLY to storage using that URL\n" +
        "//      (the big file never passes through your app servers).\n" +
        "// The key only allows PUT to that one object, only for 15 minutes."
    },
    {
      title: "Example 2: Why not proxy through the app",
      description: "<p>Direct transfer offloads bandwidth and compute.</p>",
      code: "// Without Valet Key: client -> uploads to YOUR server -> server\n" +
        "//   forwards to storage. Your servers handle all the bytes (bandwidth,\n" +
        "//   memory, scaling pain for large files).\n" +
        "// With Valet Key: client -> storage directly. Your app only issues\n" +
        "//   tokens. Far more scalable for large-file transfer."
    }
  ],
  whenToUse: "<p>Use Valet Key for direct client access to storage &mdash; uploading/downloading files, images, " +
    "videos, backups, large datasets &mdash; to offload bandwidth and processing from your application servers " +
    "and reduce latency (the client talks straight to storage). It's the standard way to handle file uploads/" +
    "downloads at scale. <strong>Gotchas:</strong> the token must be <strong>tightly scoped</strong> &mdash; " +
    "limit it to the specific operation, object, and a <em>short</em> expiry; an over-broad or long-lived " +
    "pre-signed URL is a security hole (anyone with the URL can use it within its scope). You lose the chance " +
    "to inspect/validate the data as it passes through your server, so do validation after upload (and scan " +
    "uploads for malware where relevant). Generate keys server-side only for authenticated/authorized " +
    "requests. It pairs with the Claim Check pattern (store big payloads, pass references) and is also listed " +
    "under Security for exactly these access-control reasons.</p>"
};

C["static-content-hosting"] = {
  summary: "<p>The <strong>Static Content Hosting</strong> pattern serves static assets &mdash; HTML, CSS, " +
    "JavaScript, images, fonts, videos, downloads &mdash; directly from a storage service (object storage like " +
    "S3/blob storage) and/or a <strong>CDN</strong>, rather than from your application servers. Static content " +
    "doesn't need application logic to produce, so making your app servers serve it wastes their compute. " +
    "Offloading it to purpose-built, cheap, highly-scalable storage + CDN reduces load on your application " +
    "tier, lowers cost, and improves performance (content served from edges close to users). It's a standard, " +
    "high-value optimization for any web application.</p>",
  examples: [
    {
      title: "Example 1: Serve assets from storage + CDN",
      description: "<p>Static files bypass the app entirely.</p>",
      code: "// Instead of: app server serves /css, /js, /images (wasting compute)\n" +
        "// Host static assets in object storage, fronted by a CDN:\n" +
        "//   build -> upload dist/* to S3 -> served via CloudFront edges\n" +
        "// App servers handle only dynamic requests (APIs, personalized pages).\n" +
        "// Result: less app load, lower cost, faster global delivery."
    },
    {
      title: "Example 2: Even SPAs are static hosting",
      description: "<p>A front-end build is just static files to host.</p>",
      code: "// A React/Vue SPA build = static HTML/JS/CSS -> host on S3+CDN,\n" +
        "//   call a separate API for data. No app server needed for the UI itself.\n" +
        "// Use versioned/hashed filenames + long cache headers for the assets\n" +
        "//   (and short cache on index.html) for instant, safe updates."
    }
  ],
  whenToUse: "<p>Use Static Content Hosting for any content that doesn't require server-side processing &mdash; " +
    "front-end bundles/SPAs, images and media, downloads, documentation, marketing pages. It offloads your " +
    "application tier, cuts costs (storage + CDN is far cheaper than app compute for serving files), and " +
    "speeds delivery via edge caching. It's near-universal for modern web apps. <strong>Gotchas:</strong> " +
    "manage <strong>cache invalidation</strong> with versioned/hashed filenames so updates take effect " +
    "immediately (and don't serve stale assets) &mdash; cache hashed assets long, the entry HTML short. Set " +
    "correct content types and <code>Cache-Control</code> headers. Be careful with access control: " +
    "public buckets are for genuinely public content (a misconfigured public bucket leaking private data is a " +
    "classic breach) &mdash; use signed URLs (Valet Key) for private files. Configure CORS for cross-origin " +
    "asset access. It's a simple, high-leverage pattern; it appears in both Data Management and Design & " +
    "Implementation groups.</p>"
};

C["materialized-view"] = {
  summary: "<p>The <strong>Materialized View</strong> pattern precomputes and stores the result of an " +
    "expensive query (joins, aggregations) as a separate, read-optimized 'view', so reads are fast lookups " +
    "instead of costly on-the-fly computation. Unlike a regular (virtual) database view that runs its query " +
    "each time, a materialized view holds the actual computed data, refreshed periodically or on data change. " +
    "It trades extra storage and the need to keep the view updated for dramatically faster reads &mdash; ideal " +
    "for dashboards, reports, and read-heavy queries that would otherwise repeatedly crunch large amounts of " +
    "data.</p>",
  examples: [
    {
      title: "Example 1: Precomputed aggregate instead of live computation",
      description: "<p>Store the answer; reads become instant.</p>",
      code: "// Expensive on every read:\n" +
        "//   SELECT region, SUM(total) FROM orders GROUP BY region; -- scans millions\n" +
        "// Materialized view: precompute and store the result\n" +
        "//   sales_by_region(region, total) -- a small, ready-to-read table\n" +
        "// Reads hit the tiny precomputed table -> milliseconds, no heavy scan."
    },
    {
      title: "Example 2: Keeping the view fresh",
      description: "<p>Refresh on a schedule or in response to changes/events.</p>",
      code: "// Refresh strategies:\n" +
        "//   - scheduled: rebuild the view every N minutes (simple; stale window)\n" +
        "//   - on-write/event: update the view when source data changes (fresher,\n" +
        "//     more complex)\n" +
        "// In CQRS/Event Sourcing, read models ARE materialized views built\n" +
        "//   by projecting events."
    }
  ],
  whenToUse: "<p>Use Materialized Views for read-heavy queries that are expensive to compute repeatedly and " +
    "where some staleness is acceptable &mdash; dashboards, analytics, leaderboards, reporting, aggregations " +
    "over large tables, and the read side of CQRS/Event Sourcing. They turn slow recurring computations into " +
    "fast lookups. <strong>Gotchas:</strong> the data is a <strong>copy</strong>, so it's <em>stale</em> " +
    "between refreshes &mdash; only use where eventual consistency is fine (not for must-be-live data), and " +
    "choose a refresh strategy (scheduled vs event-driven) balancing freshness against cost/complexity. It " +
    "uses extra storage and adds the maintenance burden of keeping it in sync (a form of denormalization &mdash; " +
    "same trade-offs). Refreshing large views can be expensive; consider incremental refresh. Don't " +
    "materialize cheap queries or ones needing real-time accuracy. It's one of the most practical performance " +
    "patterns for read-heavy analytics-style workloads.</p>"
};

C["index-table"] = {
  summary: "<p>The <strong>Index Table</strong> pattern creates secondary lookup tables (indexes) to enable " +
    "efficient queries on fields that aren't the primary key, in data stores that don't support rich " +
    "secondary indexing (common in some NoSQL/key-value/sharded stores). Since these stores efficiently " +
    "retrieve only by primary/partition key, querying by another attribute would otherwise require a full " +
    "scan. An index table maps the alternate key to the primary keys of matching records, so a lookup by that " +
    "field becomes a fast key access into the index, then direct fetches. It's essentially building and " +
    "maintaining your own secondary index.</p>",
  examples: [
    {
      title: "Example 1: A secondary lookup table",
      description: "<p>Map a non-key field to primary keys for fast access.</p>",
      code: "// Main table keyed by user_id. Need to look up users by email.\n" +
        "// Without an index: scan ALL users -> slow.\n" +
        "// Index table: email -> user_id\n" +
        "//   'a@x.com' -> 7\n" +
        "//   'b@x.com' -> 9\n" +
        "// Lookup: get user_id from the email index (fast), then fetch user 7."
    },
    {
      title: "Example 2: Keeping the index consistent",
      description: "<p>Every write must update the index too.</p>",
      code: "// On create/update/delete of a user, also update the email index:\n" +
        "//   create user(7, email='a@x.com') -> also write index 'a@x.com'->7\n" +
        "//   change email -> delete old index entry, add new one\n" +
        "// The index is a denormalized copy you must maintain (often via\n" +
        "//   the same transaction, events, or a background process)."
    }
  ],
  whenToUse: "<p>Use Index Tables when you must query by non-primary-key fields in a store lacking efficient " +
    "secondary indexes &mdash; key-value or wide-column stores (DynamoDB without/ beyond GSIs, Cassandra), " +
    "sharded databases where cross-shard scans are costly, and high-scale systems needing fast alternate-key " +
    "lookups. They make otherwise-full-scan queries fast. <strong>Gotchas:</strong> the index is a " +
    "<strong>denormalized copy that must be kept consistent</strong> with the source on every write &mdash; " +
    "extra write complexity and a consistency challenge (often eventual, via events/background updates), with " +
    "risk of drift if updates are missed. It uses extra storage and adds write latency. Each query pattern may " +
    "need its own index table (more tables to maintain). Many managed stores now offer built-in secondary " +
    "indexes (DynamoDB GSIs, Mongo indexes) &mdash; prefer those when available rather than hand-rolling. " +
    "Reach for manual index tables specifically when the store can't do it for you and the alternate-key query " +
    "is important enough to justify the maintenance.</p>"
};

C["event-sourcing"] = {
  summary: "<p><strong>Event Sourcing</strong> stores application state as an immutable, append-only " +
    "<strong>sequence of events</strong> describing everything that happened, rather than just the current " +
    "state. Current state is derived by replaying the events. Instead of <code>UPDATE balance = 70</code>, you " +
    "append <code>Deposited(100)</code> then <code>Withdrew(30)</code> and compute the balance from them. This " +
    "yields a complete audit trail, the ability to reconstruct state at any past point ('time travel'), and a " +
    "natural fit with event-driven systems and CQRS &mdash; at the cost of significant added complexity " +
    "(event schema evolution, eventual consistency, rebuilding state, snapshots).</p>",
  examples: [
    {
      title: "Example 1: State as a fold over events",
      description: "<p>Derive the current value by replaying recorded events.</p>",
      code: "// The event log (append-only, immutable):\n" +
        "//   [Deposited 100], [Withdrew 30], [Deposited 50]\n" +
        "// Current balance = replay the events:\n" +
        "//   100 - 30 + 50 = 120\n" +
        "// Nothing is overwritten; you store WHAT HAPPENED, not the snapshot."
    },
    {
      title: "Example 2: Audit, replay, snapshots",
      description: "<p>History is first-class; snapshots keep replay fast.</p>",
      code: "// Free benefits: full audit trail, state at any past time\n" +
        "//   (replay events up to timestamp T), rebuild read models by\n" +
        "//   re-projecting events, debug by inspecting the event stream.\n" +
        "// Performance: periodically SNAPSHOT state so you don't replay from\n" +
        "//   the beginning every time."
    }
  ],
  whenToUse: "<p>Use Event Sourcing when history itself is a requirement &mdash; domains needing a complete " +
    "audit trail (finance, healthcare, compliance), where you must know exactly how state was reached, where " +
    "you want to replay/rebuild views or debug via past states, and in event-driven systems (it pairs " +
    "naturally with CQRS). <strong>Serious gotchas:</strong> it's a major complexity increase and is " +
    "<em>frequently over-applied</em>. You must version and evolve event schemas forever (old events are " +
    "immutable), handle eventual consistency, build projections to query current state efficiently, and manage " +
    "snapshots so replay stays fast. It's a paradigm shift for the team. For most CRUD applications, storing " +
    "current state in a normal database is far simpler and entirely sufficient. Adopt it only where the audit/" +
    "history/replay benefits clearly justify the cost, and usually only for the specific aggregates that need " +
    "it &mdash; not the whole system.</p>"
};

C["cqrs"] = {
  summary: "<p><strong>CQRS (Command Query Responsibility Segregation)</strong> uses <em>separate models</em> " +
    "for writing data (commands) and reading data (queries) instead of one model serving both. The write side " +
    "handles commands and enforces business rules; the read side serves queries from one or more optimized, " +
    "often denormalized read models. In its fuller form the two sides use different data stores kept in sync " +
    "via events, letting each scale and be optimized independently. It pairs naturally with Event Sourcing " +
    "(events are the write log; read models are projections). The benefit is independent optimization of reads " +
    "vs writes; the cost is added complexity and eventual consistency between the sides.</p>",
  examples: [
    {
      title: "Example 1: Separate write and read models",
      description: "<p>Commands change state; queries read optimized views.</p>",
      code: "// WRITE side: command enforces rules, updates the source of truth\n" +
        "//   handle(PlaceOrderCommand) -> validate -> persist (normalized)\n" +
        "//   -> emit 'OrderPlaced' event\n" +
        "// READ side: a projection updates a denormalized, query-optimized view\n" +
        "//   on('OrderPlaced') -> update orders_summary_view (fast to read)\n" +
        "// Reads and writes evolve and scale independently."
    },
    {
      title: "Example 2: Different stores per side",
      description: "<p>Optimize each side for its job; sync via events.</p>",
      code: "// Write: normalized relational DB (correctness, transactions)\n" +
        "// Read:  denormalized store / search index / cache (fast queries)\n" +
        "// Kept in sync by events -> EVENTUAL consistency (read lags write briefly)."
    }
  ],
  whenToUse: "<p>Use lightweight CQRS (separate read/write code paths) freely &mdash; it clarifies intent and " +
    "keeps reads side-effect-free. Reserve <strong>full CQRS</strong> (separate models/stores) for cases with " +
    "high read/write asymmetry, complex domains where the ideal write model differs sharply from read needs, " +
    "very different read vs write scaling, or systems already using Event Sourcing. <strong>Strong " +
    "caution:</strong> full CQRS is frequently over-applied. It means two models to maintain, synchronization " +
    "machinery, and <strong>eventual consistency</strong> (the read side briefly lags the write side &mdash; " +
    "your UI must handle 'your change may take a moment to appear'). For typical CRUD, a single model serving " +
    "both is simpler and correct. Adopt full CQRS only when a concrete scaling or modeling pressure justifies " +
    "it, and often only for the specific aggregates that need it. (Listed under Data Management, Design & " +
    "Implementation, and High Availability for its different benefits.)</p>"
};

/* ======================================================================
   DESIGN & IMPLEMENTATION
   ====================================================================== */

C["design-implementation"] = {
  summary: "<p>The <strong>design and implementation</strong> cloud design patterns concern how to structure, " +
    "compose, and evolve the components of a distributed system for good design, consistency, and " +
    "maintainability. They include <strong>Ambassador</strong> and <strong>Sidecar</strong> (helper " +
    "components deployed alongside services), <strong>Anti-Corruption Layer</strong> (isolate from legacy/" +
    "external models), the <strong>Gateway</strong> patterns (Routing, Offloading, Aggregation), " +
    "<strong>Backends for Frontends</strong>, <strong>Strangler Fig</strong> (incremental migration), " +
    "<strong>Leader Election</strong>, <strong>External Configuration Store</strong>, <strong>Compute Resource " +
    "Consolidation</strong>, <strong>Static Content Hosting</strong>, <strong>CQRS</strong>, and " +
    "<strong>Pipes & Filters</strong>. They're the structural toolkit for cloud-native systems.</p>",
  examples: [
    {
      title: "Example 1: Structural patterns by purpose",
      description: "<p>Each shapes how components are arranged.</p>",
      code: "// Sidecar/Ambassador  -> attach cross-cutting helpers to a service\n" +
        "// Gateway (Routing/Offloading/Aggregation) -> smart edge in front of services\n" +
        "// Backends for Frontends -> a tailored API per client type\n" +
        "// Strangler Fig        -> migrate a legacy system incrementally\n" +
        "// Anti-Corruption Layer -> translate between your model and a legacy/external one\n" +
        "// Leader Election      -> pick one coordinator among instances"
    },
    {
      title: "Example 2: Edge and migration patterns combine",
      description: "<p>These patterns often appear together in real systems.</p>",
      code: "// Microservice edge: Gateway Routing + Offloading + Aggregation,\n" +
        "//   plus Backends-for-Frontends per client (web/mobile).\n" +
        "// Legacy migration: Strangler Fig (route new features to new services)\n" +
        "//   + Anti-Corruption Layer (translate the old model)."
    }
  ],
  whenToUse: "<p>Apply these patterns when structuring microservices and cloud-native systems, integrating with " +
    "legacy/external systems, or evolving an architecture &mdash; they provide proven ways to handle " +
    "cross-cutting concerns, edge routing, client-specific needs, coordination, and incremental migration. " +
    "<strong>Gotchas:</strong> each adds moving parts and operational complexity, so apply them where a real " +
    "need exists rather than preemptively (gateways, sidecars, and per-client backends are powerful but add " +
    "infrastructure to run and monitor). Many are specifically valuable at microservice scale and overkill for " +
    "a simple monolith. The sub-topics detail each pattern and the problem it solves.</p>"
};

C["strangler-fig"] = {
  summary: "<p>The <strong>Strangler Fig</strong> pattern incrementally migrates a legacy system by gradually " +
    "replacing specific pieces of functionality with new services, while the old and new systems run side by " +
    "side, until the old system is eventually 'strangled' (fully replaced) and removed. A routing facade " +
    "directs requests either to the new implementation (for migrated features) or the legacy system (for the " +
    "rest). This avoids a risky 'big bang' rewrite: you migrate piece by piece, can roll back individual " +
    "pieces, and keep delivering value throughout. The name comes from the strangler fig vine that gradually " +
    "envelops and replaces its host tree.</p>",
  examples: [
    {
      title: "Example 1: Route gradually to the new system",
      description: "<p>A facade sends migrated features to new code, the rest to legacy.</p>",
      code: "//            [ Routing facade / proxy ]\n" +
        "//   /orders/*   -> NEW order service (migrated)\n" +
        "//   /billing/*  -> NEW billing service (migrated)\n" +
        "//   /everything-else -> LEGACY monolith (not yet migrated)\n" +
        "// Migrate one capability at a time; flip its route when ready;\n" +
        "//   roll back just that route if it breaks. No big-bang cutover."
    },
    {
      title: "Example 2: Incremental, reversible migration",
      description: "<p>Replace, verify, repeat &mdash; until legacy is gone.</p>",
      code: "// Phase 1: facade in front of legacy (no behavior change)\n" +
        "// Phase 2: extract feature A -> new service -> route A to it\n" +
        "// Phase 3: extract feature B ... repeat\n" +
        "// Phase N: nothing left routing to legacy -> decommission it.\n" +
        "// Low risk: each step is small, verifiable, and reversible."
    }
  ],
  whenToUse: "<p>Use Strangler Fig to modernize or migrate a legacy system (monolith-to-microservices, old " +
    "platform to new) incrementally and safely &mdash; the standard approach when a full rewrite is too risky " +
    "(which it almost always is). It lets you deliver continuously, migrate by priority, and roll back " +
    "individual pieces. <strong>Gotchas:</strong> running two systems in parallel adds complexity and the " +
    "facade is a critical component (it must be reliable). You need a strategy for <strong>shared data</strong> " +
    "&mdash; the old and new systems may both touch the same data, requiring synchronization or careful " +
    "boundaries during the transition. Migrations can stall halfway (the dreaded permanent 'hybrid' state) if " +
    "not driven to completion &mdash; commit to finishing, including decommissioning the legacy part. It often " +
    "pairs with the Anti-Corruption Layer (to translate between old and new models). It's about <em>process " +
    "and risk reduction</em> as much as architecture &mdash; far safer than big-bang rewrites.</p>"
};

C["sidecar"] = {
  summary: "<p>The <strong>Sidecar</strong> pattern deploys a helper component in a <strong>separate process/" +
    "container alongside</strong> the main application (sharing its host/pod lifecycle), to provide " +
    "cross-cutting features &mdash; logging, monitoring, configuration, TLS, networking, service-mesh proxying &mdash; " +
    "without embedding them in the application code. The sidecar runs next to the app, attached like a " +
    "motorcycle sidecar. This keeps the application focused on business logic, lets the cross-cutting " +
    "functionality be language-agnostic and updated independently, and is the foundation of service meshes " +
    "(e.g. Envoy sidecars in Istio/Linkerd handle traffic, security, and observability for each service).</p>",
  examples: [
    {
      title: "Example 1: Cross-cutting helper alongside the app",
      description: "<p>The sidecar handles concerns so the app doesn't have to.</p>",
      code: "// One pod, two containers sharing lifecycle + localhost:\n" +
        "//   [ app container ]  <-->  [ sidecar container ]\n" +
        "//      business logic          (e.g. Envoy proxy: mTLS, retries,\n" +
        "//                               metrics, traffic routing)\n" +
        "// The app talks plain localhost; the sidecar adds security, telemetry,\n" +
        "//   and networking transparently - in ANY language."
    },
    {
      title: "Example 2: Service mesh = sidecars everywhere",
      description: "<p>A proxy sidecar per service provides the mesh.</p>",
      code: "// Istio/Linkerd inject an Envoy sidecar next to every service.\n" +
        "// The mesh gives you, without app code changes:\n" +
        "//   mutual TLS, load balancing, retries, circuit breaking,\n" +
        "//   tracing, and traffic policies - all in the sidecars."
    }
  ],
  whenToUse: "<p>Use the Sidecar pattern to add cross-cutting capabilities (observability, security, " +
    "networking, config) consistently across services without modifying or coupling them to that logic &mdash; " +
    "especially in polyglot microservice environments and as the basis of a service mesh. It keeps apps lean " +
    "and lets platform concerns evolve independently of business code. <strong>Gotchas:</strong> each sidecar " +
    "consumes resources (CPU/memory) and adds a small latency hop (app &harr; sidecar) &mdash; multiplied " +
    "across many services, the overhead is real. It increases deployment complexity (now two containers per " +
    "service, coordinated lifecycles) and the sidecar becomes part of your critical path (a broken sidecar can " +
    "break the service). Service meshes are powerful but heavy &mdash; don't adopt one for a handful of " +
    "services where the operational cost outweighs the benefit. Use sidecars when the cross-cutting need is " +
    "broad and consistency/language-agnosticism matters; for a single app, a library may be simpler.</p>"
};

C["leader-election"] = {
  summary: "<p>The <strong>Leader Election</strong> pattern coordinates multiple instances of a service by " +
    "designating <strong>one</strong> instance as the 'leader' responsible for a task that must be done by " +
    "exactly one node at a time &mdash; e.g. running a scheduled job, coordinating work, or being the single " +
    "writer. The instances use a consensus mechanism (or a distributed lock/coordination service like " +
    "ZooKeeper, etcd, Consul, or a database lock) to agree on the leader, and if the leader fails, the others " +
    "elect a new one. It prevents conflicts and duplicate work in distributed systems where a single " +
    "coordinator is needed despite running many instances for availability.</p>",
  examples: [
    {
      title: "Example 1: One leader runs the singleton task",
      description: "<p>Many instances, but only the leader does the exclusive work.</p>",
      code: "// 5 instances of a service all run; a scheduled cleanup job must run\n" +
        "//   exactly ONCE, not 5 times. Leader election picks one leader:\n" +
        "//   - only the leader runs the cron job / coordinates work\n" +
        "//   - leader dies -> the others detect it and elect a new leader\n" +
        "// Avoids 5x duplicate work and conflicting actions."
    },
    {
      title: "Example 2: Using a coordination service / lock",
      description: "<p>A consensus store or distributed lock decides the leader.</p>",
      code: "// Common implementations:\n" +
        "//   - ZooKeeper/etcd/Consul: ephemeral node / lease -> whoever holds it leads\n" +
        "//   - Database lock / lease row with TTL\n" +
        "//   - Raft/Paxos consensus (used inside those systems)\n" +
        "// The leader renews its lease via heartbeats; if it stops, the lease\n" +
        "//   expires and another instance acquires it."
    }
  ],
  whenToUse: "<p>Use Leader Election when a task must be performed by exactly one instance among many for " +
    "correctness &mdash; scheduled jobs in a horizontally-scaled service (avoid running the cron N times), " +
    "coordinating a distributed workflow, a single-writer role, or partition ownership. It reconciles " +
    "'run many instances for availability' with 'this work must happen once'. <strong>Gotchas:</strong> " +
    "naive implementations risk <strong>split-brain</strong> (two nodes both believe they're leader during a " +
    "network partition, causing conflicts) &mdash; use a proven coordination service with leases/fencing " +
    "rather than hand-rolling. Leader failover has a detection delay (heartbeat/lease timeout) during which " +
    "the task may pause. The coordination service becomes a critical dependency (must be HA). Don't build " +
    "leader election yourself from scratch &mdash; lean on battle-tested tools (etcd, ZooKeeper, Consul, or " +
    "Kubernetes leases). Reserve it for genuine single-coordinator needs; if work can be safely parallelized " +
    "(idempotent, partitioned), that's simpler. (Listed under Design & Implementation and Resiliency.)</p>"
};

C["ambassador"] = {
  summary: "<p>The <strong>Ambassador</strong> pattern places a helper service (often a sidecar) that handles " +
    "<strong>network communication</strong> on behalf of an application &mdash; an out-of-process proxy for " +
    "<em>outbound</em> connectivity concerns like retries, circuit breaking, routing, monitoring, and security " +
    "for the calls a service makes to other services. The application makes simple local calls to the " +
    "ambassador, which then handles the complex, resilient communication with remote services. It's like " +
    "having a diplomat handle external relations: the app focuses on logic while the ambassador manages the " +
    "messy realities of network calls &mdash; consistently and language-agnostically.</p>",
  examples: [
    {
      title: "Example 1: Proxy outbound network concerns",
      description: "<p>The ambassador adds resilience to the calls a service makes.</p>",
      code: "// App makes a simple local call; the ambassador handles the hard parts:\n" +
        "//   [ App ] --localhost--> [ Ambassador ] --network--> [ Remote service ]\n" +
        "//                            adds: retries w/ backoff, circuit breaker,\n" +
        "//                            timeouts, TLS, routing, metrics, logging\n" +
        "// The app doesn't implement any of that resilience logic itself."
    },
    {
      title: "Example 2: Ambassador vs Sidecar framing",
      description: "<p>Ambassador is a sidecar specialized for outbound comms.</p>",
      code: "// Sidecar: general helper attached to a service (any cross-cutting concern)\n" +
        "// Ambassador: a sidecar focused on OUTBOUND network communication\n" +
        "//   (the client-side proxy). Service-mesh sidecars play both roles.\n" +
        "// Great for adding resilience to legacy apps you can't easily modify."
    }
  ],
  whenToUse: "<p>Use the Ambassador pattern to offload outbound network concerns &mdash; retries, circuit " +
    "breaking, timeouts, TLS, routing, observability &mdash; from application code, especially in polyglot " +
    "environments (implement resilience once, use it from any language) or to add resilient connectivity to " +
    "<strong>legacy apps you can't easily modify</strong> (wrap them with an ambassador). It centralizes and " +
    "standardizes how services talk to dependencies. <strong>Gotchas:</strong> like any sidecar, it adds a " +
    "process/container and a small latency hop per call, plus resource overhead multiplied across services. It " +
    "becomes part of the critical path. Much of what the Ambassador pattern provides is now delivered by " +
    "<strong>service meshes</strong> (Envoy sidecars), so on a mesh you often get it without explicitly " +
    "building ambassadors. For a single service in one language, an in-process resilience library may be " +
    "simpler. Reach for it when you need consistent, language-agnostic outbound resilience across many " +
    "services or for hard-to-change apps.</p>"
};

C["gateway-routing"] = {
  summary: "<p>The <strong>Gateway Routing</strong> pattern uses a single entry point (gateway) that " +
    "<strong>routes</strong> incoming requests to the appropriate backend service based on request attributes " +
    "&mdash; path, host, headers, version. Clients call one endpoint (the gateway), unaware of the internal " +
    "service topology; the gateway forwards each request to the right service. This decouples clients from the " +
    "backend layout (you can split, merge, move, or version services without changing clients), centralizes " +
    "routing logic, and is a core function of API gateways. It's one of three related Gateway patterns " +
    "(Routing, Offloading, Aggregation) commonly combined at a microservice edge.</p>",
  examples: [
    {
      title: "Example 1: One endpoint, routed to many services",
      description: "<p>The gateway maps request attributes to backend services.</p>",
      code: "// Clients call ONE host (api.example.com); the gateway routes:\n" +
        "//   /users/**     -> user-service\n" +
        "//   /orders/**    -> order-service\n" +
        "//   /v2/products/** -> product-service-v2  (version routing)\n" +
        "// Clients never know or change when services are split/moved/renamed."
    },
    {
      title: "Example 2: Decoupling clients from topology",
      description: "<p>Reorganize services behind a stable gateway URL.</p>",
      code: "// Split the monolithic 'catalog' into 'products' + 'inventory' services?\n" +
        "//   -> just update gateway routes; the client-facing URLs stay the same.\n" +
        "// Blue/green or canary: route a % of traffic to a new version at the gateway."
    }
  ],
  whenToUse: "<p>Use Gateway Routing in microservice/multi-service systems to give clients a single, stable " +
    "entry point and hide internal topology &mdash; enabling you to reorganize, version, and roll out services " +
    "(canary/blue-green) without breaking clients. It centralizes routing and is a standard API-gateway " +
    "capability. <strong>Gotchas:</strong> the gateway becomes a <strong>single point of failure and a " +
    "potential bottleneck</strong>, so it must be highly available and scalable (run redundant instances/use a " +
    "managed gateway). Keep routing logic in the gateway focused &mdash; don't let it accumulate business " +
    "logic and become a 'god component'. It adds a network hop. For a single service or small system, a plain " +
    "load balancer or reverse proxy suffices &mdash; don't introduce a full gateway prematurely. It commonly " +
    "combines with Gateway Offloading (cross-cutting concerns) and Gateway Aggregation (combining responses) " +
    "at the same edge.</p>"
};

C["gateway-offloading"] = {
  summary: "<p>The <strong>Gateway Offloading</strong> pattern moves shared, cross-cutting functionality from " +
    "individual services into the <strong>gateway</strong>, so it's implemented once at the edge rather than " +
    "duplicated in every service. Common offloaded concerns: <strong>SSL/TLS termination</strong>, " +
    "<strong>authentication/authorization</strong>, <strong>rate limiting/throttling</strong>, " +
    "<strong>response caching</strong>, <strong>compression</strong>, request/response transformation, and " +
    "logging. This keeps backend services simpler (focused on business logic), ensures consistency (one " +
    "implementation of auth, rate limiting, etc.), and lets specialized infrastructure handle these concerns " +
    "efficiently. It's a core API-gateway responsibility, combined with routing and aggregation.</p>",
  examples: [
    {
      title: "Example 1: Cross-cutting concerns at the edge",
      description: "<p>Do shared work once in the gateway, not in every service.</p>",
      code: "// The gateway handles, before forwarding to backends:\n" +
        "//   - TLS termination (decrypt HTTPS once)\n" +
        "//   - authentication (validate the token; reject anonymous)\n" +
        "//   - rate limiting (429 abusive clients)\n" +
        "//   - response caching, compression, logging\n" +
        "// Backend services receive clean, authenticated, plain requests\n" +
        "//   and stay focused on business logic."
    },
    {
      title: "Example 2: Consistency + simpler services",
      description: "<p>One implementation of shared concerns, applied uniformly.</p>",
      code: "// Without offloading: every one of 20 services implements auth,\n" +
        "//   rate limiting, TLS... duplicated, inconsistent, error-prone.\n" +
        "// With offloading: implement once at the gateway -> uniform policy,\n" +
        "//   each service is simpler and easier to maintain."
    }
  ],
  whenToUse: "<p>Use Gateway Offloading to centralize cross-cutting concerns &mdash; TLS termination, auth, " +
    "rate limiting, caching, compression, logging &mdash; at the edge in a microservice architecture, keeping " +
    "services simple and policies consistent. It's a primary reason to run an API gateway. <strong>Gotchas:</strong> " +
    "don't overload the gateway with <em>business</em> logic &mdash; offload genuinely cross-cutting, generic " +
    "concerns, not service-specific rules (that recreates a monolith at the edge and couples everything to the " +
    "gateway). The gateway becomes critical and security-sensitive (it terminates TLS and enforces auth), so " +
    "it must be hardened, HA, and scalable. Terminating TLS at the gateway means traffic to backends may be " +
    "unencrypted unless you re-encrypt (consider for sensitive internal traffic). Centralizing too much can " +
    "make the gateway a bottleneck and a deployment chokepoint. Offload the right things (broad, generic, " +
    "security/infra concerns); keep domain logic in services.</p>"
};

C["gateway-aggregation"] = {
  summary: "<p>The <strong>Gateway Aggregation</strong> pattern uses a gateway to combine <em>multiple</em> " +
    "backend requests into a <strong>single</strong> request/response for the client. Instead of the client " +
    "making many calls to assemble a screen's data (chatty, slow over high-latency networks), it makes one " +
    "request to the gateway, which fans out to the necessary services, aggregates their responses, and returns " +
    "a combined result. This reduces client-server round-trips (especially valuable for mobile/high-latency " +
    "clients), hides service decomposition, and offloads orchestration from the client. It's one of the three " +
    "Gateway patterns and overlaps with the Backends-for-Frontends idea.</p>",
  examples: [
    {
      title: "Example 1: Fan-out, then combine",
      description: "<p>One client call; the gateway gathers from several services.</p>",
      code: "// Client wants a profile page: user info + recent orders + recommendations.\n" +
        "// Without aggregation: client makes 3 separate calls (3 round-trips).\n" +
        "// With Gateway Aggregation: client makes 1 call ->\n" +
        "//   gateway calls user-svc + order-svc + rec-svc (in parallel) ->\n" +
        "//   merges results -> returns ONE combined response.\n" +
        "// Fewer round-trips, especially valuable on mobile/high-latency networks."
    },
    {
      title: "Example 2: Parallel calls cut latency",
      description: "<p>The gateway calls backends concurrently and merges.</p>",
      code: "// Gateway fetches in PARALLEL (not sequentially):\n" +
        "//   total latency ~= the SLOWEST single call, not the sum.\n" +
        "// Handle partial failures: if 'recommendations' fails, still return\n" +
        "//   user + orders (graceful degradation) rather than failing everything."
    }
  ],
  whenToUse: "<p>Use Gateway Aggregation when clients need data from multiple services to render a view and " +
    "making many separate calls is too chatty/slow &mdash; mobile apps and high-latency clients benefit most " +
    "(fewer round-trips). It hides service decomposition and offloads composition from the client. " +
    "<strong>Gotchas:</strong> the gateway now does orchestration and can become complex and a bottleneck &mdash; " +
    "call backends <strong>in parallel</strong> (not sequentially) and handle <strong>partial failures</strong> " +
    "gracefully (return what succeeded rather than failing the whole response). The aggregation logic can " +
    "creep toward business logic and tight coupling to backend shapes &mdash; keep it thin. It adds a hop and " +
    "the gateway must scale with traffic. This overlaps with <strong>Backends-for-Frontends</strong> (a " +
    "per-client aggregating layer) and GraphQL (which solves client-driven aggregation differently). Don't " +
    "aggregate when clients genuinely need independent, cacheable resource calls. Reserve it for composite " +
    "views that would otherwise be chatty.</p>"
};

C["external-config-store"] = {
  summary: "<p>The <strong>External Configuration Store</strong> pattern moves configuration <em>out</em> of " +
    "application deployment packages into a centralized, external store that the application reads at runtime &mdash; " +
    "rather than baking settings into code or per-instance files. A central config service/store (Spring Cloud " +
    "Config, AWS Parameter Store/AppConfig, Azure App Configuration, Consul, etcd) holds settings shared across " +
    "instances and environments, with versioning and the ability to update configuration <em>without " +
    "redeploying</em>. This gives one place to manage config across many services/instances, consistent " +
    "settings, dynamic updates, and (with a secrets manager) secure secret handling.</p>",
  examples: [
    {
      title: "Example 1: Centralized, runtime-read config",
      description: "<p>Instances fetch shared settings from one external store.</p>",
      code: "// Instead of config baked into each deployment:\n" +
        "//   all instances read from a central store at startup (and refresh):\n" +
        "//   [Config Store] <- read 'feature.x.enabled', 'rate.limit', db urls\n" +
        "//        ^-- update a value once -> all instances pick it up\n" +
        "//            (sometimes WITHOUT a redeploy)"
    },
    {
      title: "Example 2: Secrets belong in a secrets manager",
      description: "<p>Sensitive config needs encryption + access control.</p>",
      code: "// Don't store plaintext secrets in a config repo!\n" +
        "// Use a dedicated secrets manager (Vault, AWS Secrets Manager,\n" +
        "//   Azure Key Vault) with encryption, access control, rotation.\n" +
        "// Non-secret config -> config store; secrets -> secrets manager."
    }
  ],
  whenToUse: "<p>Use an External Configuration Store when you run many instances/services and want centralized, " +
    "consistent, versioned configuration that can change without redeploying &mdash; feature flags, tunable " +
    "limits, environment-specific settings, and (via a secrets manager) credentials. It's valuable in " +
    "microservices and dynamically-scaled systems. <strong>Gotchas:</strong> the config store becomes a " +
    "<strong>critical dependency</strong> &mdash; if it's unavailable at startup, instances may fail to boot; " +
    "make it HA and add fallback/caching of last-known-good config. <strong>Never store secrets in " +
    "plaintext</strong> in a general config store (or in a git-backed config repo) &mdash; use a proper " +
    "secrets manager with encryption and rotation. Dynamic config changes can have surprising effects &mdash; " +
    "validate and roll out carefully (a bad config push can take down everything at once). On Kubernetes, " +
    "ConfigMaps/Secrets often cover much of this natively. For a single small app, environment variables and a " +
    "config file are simpler &mdash; introduce a central store when scale and dynamism justify it.</p>"
};

C["compute-resource-consolidation"] = {
  summary: "<p>The <strong>Compute Resource Consolidation</strong> pattern combines multiple tasks or services " +
    "onto fewer compute units (servers/containers/VMs) to improve <strong>resource utilization and reduce " +
    "cost</strong>, rather than running many under-utilized dedicated instances. If you have many small " +
    "services each barely using a dedicated machine, you're paying for lots of idle capacity; consolidating " +
    "them onto shared, better-packed compute uses resources efficiently. It's essentially smart bin-packing of " +
    "workloads. Container orchestration (Kubernetes) embodies this &mdash; scheduling many containers densely " +
    "onto a pool of nodes &mdash; balancing density against isolation.</p>",
  examples: [
    {
      title: "Example 1: Pack workloads densely",
      description: "<p>Fewer, well-utilized machines instead of many idle ones.</p>",
      code: "// Wasteful: 10 microservices, each on its own VM using ~10% CPU\n" +
        "//   -> paying for 10 mostly-idle machines.\n" +
        "// Consolidated: pack those 10 services onto 2-3 shared nodes\n" +
        "//   (e.g. K8s schedules many pods per node by their resource requests)\n" +
        "//   -> much higher utilization, lower cost."
    },
    {
      title: "Example 2: Density vs isolation trade-off",
      description: "<p>Consolidation must be balanced against the Noisy Neighbor risk.</p>",
      code: "// Higher density = lower cost BUT more contention risk\n" +
        "//   (Noisy Neighbor: one workload's spike hurts co-located ones).\n" +
        "// Mitigate with per-workload resource requests/limits + bulkheads.\n" +
        "// Keep incompatible workloads (e.g. latency-critical vs batch) apart."
    }
  ],
  whenToUse: "<p>Use Compute Resource Consolidation to cut infrastructure cost and waste when you have many " +
    "small or intermittently-busy workloads that don't each need a dedicated machine &mdash; microservices, " +
    "batch tasks, internal tools. Container orchestrators do this automatically by packing workloads onto " +
    "shared nodes based on their resource requests. <strong>Gotchas:</strong> denser packing increases " +
    "<strong>resource contention</strong> and the <strong>Noisy Neighbor</strong> risk &mdash; set proper " +
    "resource requests/limits, use bulkheads, and don't co-locate workloads with conflicting profiles " +
    "(latency-sensitive next to a heavy batch job). Over-consolidation hurts isolation, fault tolerance (more " +
    "eggs per basket), and security boundaries. It's a balance: consolidate for efficiency, but keep enough " +
    "isolation for performance predictability and blast-radius control. Conversely, don't consolidate to the " +
    "point that a single node failure or one bad workload takes down many services. Right-size based on actual " +
    "utilization data.</p>"
};

C["backends-for-frontend"] = {
  summary: "<p>The <strong>Backends for Frontends (BFF)</strong> pattern creates a <strong>separate backend " +
    "service tailored to each frontend/client type</strong> &mdash; e.g. one BFF for the web app, another for " +
    "the mobile app, another for a partner API &mdash; instead of forcing all clients through a single " +
    "general-purpose backend. Each BFF is optimized for its client's specific needs: the data shapes, " +
    "aggregations, and payload sizes that client wants. This avoids the compromises of a one-size-fits-all API " +
    "(over/under-fetching for some clients), lets each client's team move independently, and keeps " +
    "client-specific logic out of the shared services.</p>",
  examples: [
    {
      title: "Example 1: A tailored backend per client",
      description: "<p>Each frontend gets an API shaped for its needs.</p>",
      code: "//   [Web app]    -> [Web BFF]    \\\n" +
        "//   [Mobile app] -> [Mobile BFF]  >-> shared downstream services\n" +
        "//   [Partner]    -> [Partner BFF] /\n" +
        "// Mobile BFF: small, aggregated payloads (limited bandwidth/battery).\n" +
        "// Web BFF: richer data for a big screen. Each optimized independently."
    },
    {
      title: "Example 2: Why not one shared API",
      description: "<p>One general API compromises every client.</p>",
      code: "// Single API for all clients -> mobile over-fetches huge web-shaped\n" +
        "//   payloads; web makes extra calls; the API bloats with conditional\n" +
        "//   logic for each client. BFF gives each client exactly what it needs.\n" +
        "// (Overlaps with Gateway Aggregation; GraphQL is an alternative.)"
    }
  ],
  whenToUse: "<p>Use BFF when you have multiple, meaningfully-different frontends (web, mobile, partner, IoT) " +
    "whose data and interaction needs diverge &mdash; tailoring each backend avoids over/under-fetching, keeps " +
    "client-specific concerns out of shared services, and lets frontend teams own their backend. " +
    "<strong>Gotchas:</strong> it adds more services to build, deploy, and maintain (one per client type), and " +
    "risks <strong>logic duplication</strong> across BFFs (extract truly shared logic into downstream services " +
    "or libraries). Keep BFFs as thin composition/translation layers, not places to hide business rules. Don't " +
    "create a BFF per trivial client difference &mdash; reserve it for genuinely distinct clients. " +
    "<strong>GraphQL</strong> is an alternative that lets a single endpoint serve flexible per-client shapes " +
    "(reducing the need for multiple BFFs), and it overlaps with Gateway Aggregation. Choose BFF when " +
    "per-client backends genuinely simplify things; one well-designed API or GraphQL may suffice for similar " +
    "clients.</p>"
};

C["anti-corruption-layer"] = {
  summary: "<p>The <strong>Anti-Corruption Layer (ACL)</strong> pattern inserts a translation layer between " +
    "your system and an external or legacy system that uses a different (often messy or outdated) data model, " +
    "so the foreign model doesn't 'corrupt' your clean domain model. The ACL translates between the two " +
    "worlds &mdash; mapping the external system's concepts, formats, and quirks to your own and back &mdash; " +
    "isolating the rest of your code from the legacy/external system's design. This keeps your domain pure and " +
    "lets you integrate with or migrate away from legacy systems without their model leaking everywhere. " +
    "(Originates from Domain-Driven Design.)</p>",
  examples: [
    {
      title: "Example 1: Translate at the boundary",
      description: "<p>The ACL maps the legacy model to your clean model.</p>",
      code: "// Your domain speaks clean concepts; the legacy system is messy.\n" +
        "//   [Your domain] <-> [ Anti-Corruption Layer ] <-> [Legacy system]\n" +
        "//   ACL: maps legacy 'CUST_REC' fields, weird codes, SOAP/CSV formats\n" +
        "//        -> your Customer domain object (and back)\n" +
        "// The rest of your code never sees the legacy ugliness."
    },
    {
      title: "Example 2: Isolating during migration",
      description: "<p>The ACL contains legacy coupling so you can replace it later.</p>",
      code: "// During a Strangler Fig migration, the ACL is the single place that\n" +
        "//   knows the legacy system. When you finally retire the legacy system,\n" +
        "//   you change/remove the ACL - not your whole codebase.\n" +
        "// Without an ACL, legacy quirks spread through every integration point."
    }
  ],
  whenToUse: "<p>Use an Anti-Corruption Layer when integrating with a legacy system, a third-party/external " +
    "service, or any system whose data model you don't want leaking into your clean domain &mdash; especially " +
    "during incremental migrations (it pairs with Strangler Fig) and when consuming poorly-designed external " +
    "APIs. It protects your model's integrity and contains coupling to the foreign system in one place. " +
    "<strong>Gotchas:</strong> the ACL adds translation code and a maintenance burden, and a layer of " +
    "indirection/latency &mdash; it's worth it to protect a valuable domain model, but overkill for a simple, " +
    "well-designed integration where direct mapping is fine. Keep the translation logic <em>in</em> the ACL " +
    "(don't let mapping concerns scatter). The ACL can get complex if the two models differ greatly. Apply it " +
    "where the external/legacy model is genuinely incompatible or messy and your domain purity matters; for " +
    "clean, aligned integrations, the ceremony isn't needed.</p>"
};

/* ======================================================================
   RELIABILITY PATTERNS (overview) + AVAILABILITY / HIGH AVAILABILITY /
   RESILIENCY / SECURITY
   ====================================================================== */

C["reliability-patterns"] = {
  summary: "<p><strong>Reliability patterns</strong> are cloud design patterns focused on keeping systems " +
    "<strong>dependable</strong> under failure and load &mdash; grouped into <strong>Availability</strong> " +
    "(stay reachable/serving), <strong>Resiliency</strong> (recover gracefully from failures), and " +
    "<strong>Security</strong> (protect against threats). They include Circuit Breaker, Retry, Bulkhead, " +
    "Throttling, Compensating Transaction, Health Endpoint Monitoring, Deployment Stamps, Geodes, Leader " +
    "Election, and security patterns like Gatekeeper, Federated Identity, and Valet Key. Reliability is about " +
    "designing for the reality that <em>everything fails eventually</em> &mdash; networks, services, hardware &mdash; " +
    "so the system must degrade gracefully and recover, not collapse.</p>",
  examples: [
    {
      title: "Example 1: Reliability pattern groups",
      description: "<p>Patterns organized by reliability concern.</p>",
      code: "// Availability:  Deployment Stamps, Geodes, Throttling,\n" +
        "//                Queue-Based Load Leveling, Health Endpoint Monitoring\n" +
        "// Resiliency:    Circuit Breaker, Retry, Bulkhead, Compensating Transaction,\n" +
        "//                Leader Election, Scheduler Agent Supervisor\n" +
        "// Security:      Gatekeeper, Federated Identity, Valet Key"
    },
    {
      title: "Example 2: Design for failure",
      description: "<p>Combine patterns so one failure doesn't cascade.</p>",
      code: "// A resilient call to a dependency typically layers:\n" +
        "//   timeout + retry-with-backoff + circuit breaker + bulkhead + fallback\n" +
        "// So a slow/failing dependency fails fast, in isolation, with a\n" +
        "//   graceful degraded response - instead of cascading an outage."
    }
  ],
  whenToUse: "<p>Apply reliability patterns to any system where uptime and graceful failure matter &mdash; " +
    "essentially all production and especially business-critical systems. They embody the core distributed-" +
    "systems truth that failure is inevitable, so you design to contain, recover from, and degrade gracefully " +
    "under it. <strong>Gotchas:</strong> reliability patterns combine (and must be tuned together) &mdash; a " +
    "circuit breaker needs timeouts; retries need backoff+jitter and idempotency; bulkheads need sizing. " +
    "Over-applying them adds complexity and can mask problems, while under-applying them leaves you one " +
    "dependency failure away from a cascading outage. Match the investment to the system's reliability " +
    "requirements (SLOs). The sub-groups &mdash; Availability, High Availability, Resiliency, and Security &mdash; " +
    "detail the individual patterns.</p>"
};

C["availability"] = {
  summary: "<p>The <strong>Availability</strong> reliability patterns keep a system <strong>reachable and " +
    "serving requests</strong>, even under load or partial failure, and let it scale globally. Key patterns: " +
    "<strong>Deployment Stamps</strong> (replicate independent copies of the stack to scale and isolate), " +
    "<strong>Geodes</strong> (geographically distributed nodes serving any request), <strong>Throttling</strong> " +
    "(limit resource consumption to stay within capacity), <strong>Queue-Based Load Leveling</strong> (buffer " +
    "spikes), and <strong>Health Endpoint Monitoring</strong> (detect unhealthy instances so traffic routes " +
    "around them). Together they maximize uptime and the system's ability to handle scale and regional " +
    "distribution without a single point of failure.</p>",
  examples: [
    {
      title: "Example 1: Availability patterns and their roles",
      description: "<p>Each contributes to staying up and scaling.</p>",
      code: "// Deployment Stamps -> independent stack copies (scale-units), isolate tenants\n" +
        "// Geodes            -> active-active nodes across regions; nearest serves\n" +
        "// Throttling        -> cap usage to protect capacity (avoid overload)\n" +
        "// Queue-Based Load Leveling -> absorb spikes so backends aren't swamped\n" +
        "// Health Endpoint Monitoring -> route only to healthy instances"
    },
    {
      title: "Example 2: Removing single points of failure",
      description: "<p>Redundancy + distribution + overload protection = high uptime.</p>",
      code: "// Geodes (multi-region active-active) + Deployment Stamps (scale units)\n" +
        "//   -> no single region/stack failure takes the system down.\n" +
        "// + Throttling & load leveling -> overload doesn't cause cascading failure.\n" +
        "// + Health monitoring -> failed nodes are detected and bypassed."
    }
  ],
  whenToUse: "<p>Use Availability patterns for systems with strict uptime needs, global user bases, or " +
    "multi-tenant scale &mdash; SaaS platforms, large-scale consumer services, anything with demanding SLAs. " +
    "Deployment Stamps and Geodes enable scaling and regional distribution; Throttling and Queue-Based Load " +
    "Leveling protect against overload; Health Endpoint Monitoring enables automatic failover. " +
    "<strong>Gotchas:</strong> higher availability is exponentially more expensive (each 'nine' costs more), " +
    "so target the level you actually need. Multi-region active-active (Geodes) brings serious data-" +
    "consistency challenges (replication, conflict resolution across regions). Throttling must be tuned to " +
    "protect capacity without rejecting legitimate load. Redundancy only helps if failover is tested. The " +
    "sub-topics detail Deployment Stamps, Geodes, Throttling, Health Endpoint Monitoring, and (cross-listed) " +
    "Queue-Based Load Leveling.</p>"
};

C["deployment-stamps"] = {
  summary: "<p>The <strong>Deployment Stamps</strong> pattern (also called 'scale units' or 'stamps') deploys " +
    "multiple <strong>independent copies of an entire application stack</strong> &mdash; each a self-contained " +
    "'stamp' with its own services and data &mdash; to scale out, isolate tenants, and contain failures. " +
    "Instead of scaling one giant shared system, you add more stamps, each serving a subset of users/tenants. " +
    "Stamps are independent: a failure or overload in one doesn't affect others, you can deploy/upgrade them " +
    "individually (e.g. canary a new version on one stamp), and you can place stamps in different regions. A " +
    "routing layer directs each request/tenant to its stamp.</p>",
  examples: [
    {
      title: "Example 1: Independent stack copies",
      description: "<p>Each stamp is a full, isolated deployment serving some tenants.</p>",
      code: "//   [ Traffic router ] decides which stamp serves a tenant/user\n" +
        "//      -> [Stamp 1: app + db]  (tenants A-M)\n" +
        "//      -> [Stamp 2: app + db]  (tenants N-Z)\n" +
        "//      -> [Stamp 3: app + db]  (new region / overflow)\n" +
        "// Scale by ADDING stamps; a problem in Stamp 1 doesn't touch Stamp 2."
    },
    {
      title: "Example 2: Isolation and safe rollout",
      description: "<p>Blast radius and deployments are contained per stamp.</p>",
      code: "// Failure isolation: a bad deploy or overload hits ONE stamp's tenants,\n" +
        "//   not everyone (limited blast radius).\n" +
        "// Safe rollout: deploy a new version to one stamp first (canary),\n" +
        "//   verify, then roll out to the rest.\n" +
        "// Also enables data residency (a stamp per region/jurisdiction)."
    }
  ],
  whenToUse: "<p>Use Deployment Stamps for large multi-tenant SaaS, systems that must scale beyond a single " +
    "deployment's limits, need tenant/failure isolation, or have regional/data-residency requirements. They " +
    "give horizontal scale at the <em>whole-stack</em> level, contained blast radius, and safe incremental " +
    "rollouts. <strong>Gotchas:</strong> managing many stamps adds <strong>operational complexity</strong> &mdash; " +
    "you need automation (infrastructure-as-code) to provision, deploy, and monitor stamps uniformly, and a " +
    "reliable <strong>routing/tenant-assignment</strong> layer. Cross-stamp operations and global features " +
    "(e.g. analytics across all tenants) are harder (data is partitioned across stamps). Stamps can be " +
    "under-utilized if tenants are unevenly distributed (rebalancing is non-trivial). It's a heavyweight " +
    "pattern justified at significant scale/tenancy &mdash; overkill for a small single-tenant app. It pairs " +
    "with Geodes (stamps across regions) for global, highly-available deployments.</p>"
};

C["throttling"] = {
  summary: "<p>The <strong>Throttling</strong> pattern controls the rate at which clients can consume " +
    "resources, limiting requests/operations per client (or overall) within a time window to keep the system " +
    "within its capacity. When limits are exceeded, requests are rejected (HTTP <code>429 Too Many " +
    "Requests</code>), queued, or degraded. Throttling protects services from being overwhelmed &mdash; by " +
    "traffic spikes, abusive clients, or runaway loops &mdash; ensures fair resource sharing among clients " +
    "(mitigating the Noisy Neighbor problem), and enforces usage tiers/quotas. Common algorithms: token " +
    "bucket, leaky bucket, fixed/sliding window. It's a frontline defense for availability and a complement to " +
    "autoscaling.</p>",
  examples: [
    {
      title: "Example 1: Rate limiting per client",
      description: "<p>Cap requests; reject or slow excess with 429.</p>",
      code: "// Limit: 100 requests/minute per API key\n" +
        "//   within budget -> serve normally\n" +
        "//   over budget   -> 429 Too Many Requests\n" +
        "//                    Retry-After: 30   (tell the client when to retry)\n" +
        "// Protects the service + shares capacity fairly across clients."
    },
    {
      title: "Example 2: Token bucket algorithm",
      description: "<p>Allow bursts up to a bucket size, refilled at a steady rate.</p>",
      code: "// Token bucket: capacity 100, refill 10 tokens/sec\n" +
        "//   each request consumes 1 token; empty bucket -> throttled.\n" +
        "// Allows short bursts (up to 100) while bounding the sustained rate.\n" +
        "// Tiered: free = 60/min, pro = 1000/min (enforce plan quotas)."
    }
  ],
  whenToUse: "<p>Use Throttling to protect services from overload and abuse, enforce fair usage and plan " +
    "quotas, control costs, and defend against spikes/DoS &mdash; essential for any public API or " +
    "multi-tenant system. It's a key availability and Noisy-Neighbor mitigation. <strong>Gotchas:</strong> " +
    "set limits carefully &mdash; too strict rejects legitimate traffic and frustrates users; too loose " +
    "doesn't protect. Always return clear signals (<code>429</code> + <code>Retry-After</code>) so well-" +
    "behaved clients back off (and to avoid triggering retry storms). In distributed systems, rate limit " +
    "<strong>across all instances</strong> (a shared counter in Redis), not per-instance, or the effective " +
    "limit is N&times; what you intended. Throttling is a defensive ceiling, complementary to " +
    "<strong>autoscaling</strong> (add capacity) and load leveling (buffer) &mdash; use them together: scale " +
    "for real demand, throttle to cap abuse/cost and protect during scale-up lag. Choose an algorithm (token " +
    "bucket allows bursts; sliding window is smoother) to fit your traffic.</p>"
};

C["geodes"] = {
  summary: "<p>The <strong>Geodes</strong> pattern (Geographical Nodes) deploys a system as a set of " +
    "<strong>geographically distributed, active-active nodes</strong> where <em>every</em> node can serve " +
    "<em>any</em> request &mdash; users are routed to the nearest geode for low latency, and all geodes are " +
    "equal peers backed by a globally-distributed data layer. Unlike primary-secondary regional setups, there's " +
    "no single 'primary' region: all geodes actively handle traffic, providing low latency worldwide, high " +
    "availability (lose a region, others carry on), and massive scale. It relies on a globally-replicated " +
    "database (e.g. Cosmos DB, DynamoDB Global Tables, Spanner) to keep data consistent across regions.</p>",
  examples: [
    {
      title: "Example 1: Active-active across regions",
      description: "<p>Every region serves any user; nearest one handles the request.</p>",
      code: "//   user (EU) -> [EU geode]  \\\n" +
        "//   user (US) -> [US geode]   >-- all active, all equal, backed by a\n" +
        "//   user (AP) -> [AP geode]  /    globally-replicated data layer\n" +
        "// Nearest geode serves -> low latency worldwide.\n" +
        "// A region goes down -> traffic shifts to others; no single primary."
    },
    {
      title: "Example 2: Needs a global data layer",
      description: "<p>The hard part is consistent data across regions.</p>",
      code: "// Geodes only work with a globally-distributed database that\n" +
        "//   replicates across regions (Cosmos DB, DynamoDB Global Tables,\n" +
        "//   Spanner). Trade-off: cross-region consistency vs latency\n" +
        "//   (often eventual/tunable consistency between regions)."
    }
  ],
  whenToUse: "<p>Use the Geodes pattern for globally-distributed applications needing <strong>low latency " +
    "worldwide and very high availability</strong> &mdash; large consumer platforms, global APIs, services " +
    "with users on every continent. Active-active geographic distribution removes regional single points of " +
    "failure and serves users from nearby. <strong>Gotchas:</strong> the dominant challenge is " +
    "<strong>data consistency across regions</strong> &mdash; you need a globally-replicated database and must " +
    "accept its consistency model (typically eventual or tunable, with conflict resolution for concurrent " +
    "cross-region writes). It's complex and costly to build and operate, and only justified at genuine global " +
    "scale. For most apps, a single region (or a few) with regional failover is far simpler. Geodes pair with " +
    "Deployment Stamps (stamps placed across regions). Reserve this pattern for when worldwide low-latency " +
    "active-active is a real requirement, not a nice-to-have &mdash; the consistency and operational costs are " +
    "substantial.</p>"
};

C["high-availability"] = {
  summary: "<p><strong>High Availability (HA)</strong> patterns ensure a system keeps operating with minimal " +
    "downtime by eliminating single points of failure and containing faults. They overlap with the broader " +
    "Availability and Resiliency groups and include <strong>Circuit Breaker</strong> (stop calling a failing " +
    "dependency so it can recover and you fail fast), <strong>Bulkhead</strong> (isolate resources so one " +
    "failure can't sink everything), <strong>Health Endpoint Monitoring</strong> (detect and route around " +
    "unhealthy instances), and redundancy/distribution patterns (<strong>Deployment Stamps</strong>, " +
    "<strong>Geodes</strong>). HA is about designing so that individual component failures don't cause " +
    "system-wide outages &mdash; the system stays available even as parts fail.</p>",
  examples: [
    {
      title: "Example 1: Contain failures so the system stays up",
      description: "<p>Isolation + fast-fail prevent one fault from spreading.</p>",
      code: "// Bulkhead: separate resource pools -> one overloaded dependency\n" +
        "//   exhausts only ITS pool, not the whole app (others keep working).\n" +
        "// Circuit Breaker: a failing dependency is 'cut off' -> calls fail fast\n" +
        "//   with a fallback instead of hanging and cascading.\n" +
        "// Together: a single failure is contained, not system-ending."
    },
    {
      title: "Example 2: Redundancy + detection",
      description: "<p>No single point of failure, and fast rerouting.</p>",
      code: "// Redundant instances (Deployment Stamps) across regions (Geodes)\n" +
        "//   + Health Endpoint Monitoring to detect failures and reroute\n" +
        "//   -> a node/region failure is bypassed automatically, no outage."
    }
  ],
  whenToUse: "<p>Apply High Availability patterns to systems where downtime is costly &mdash; revenue-critical " +
    "services, infrastructure, anything with a strict SLA. Combine redundancy (no single point of failure), " +
    "fault isolation (Bulkhead), fast-fail (Circuit Breaker), and health-based rerouting to keep serving as " +
    "components fail. <strong>Gotchas:</strong> HA is achieved by <em>combining</em> patterns, not one trick &mdash; " +
    "and each adds complexity and must be tuned (breaker thresholds, bulkhead sizes). Higher availability " +
    "costs more (redundancy, multi-region) and faces diminishing returns per 'nine' &mdash; target what the " +
    "business needs. Redundancy is useless if failover is untested (practice it; chaos engineering). Beware " +
    "shared dependencies that undermine isolation (a single DB behind 'redundant' app servers is still a " +
    "single point of failure). The sub-topics (and cross-listed Resiliency patterns) detail Bulkhead, Circuit " +
    "Breaker, and the redundancy/distribution patterns.</p>"
};

C["bulkhead"] = {
  summary: "<p>The <strong>Bulkhead</strong> pattern isolates resources into separate pools so that a failure " +
    "or overload in one part of the system can't consume all resources and take down everything else &mdash; " +
    "named after the watertight compartments in a ship's hull that stop one breach from sinking the vessel. " +
    "You partition resources (thread pools, connection pools, compute) per dependency, tenant, or feature, so " +
    "if one is exhausted (e.g. a slow downstream service hogging all threads), only its compartment is " +
    "affected and the rest keep working. It's a core resiliency/isolation pattern, complementary to the " +
    "Circuit Breaker.</p>",
  examples: [
    {
      title: "Example 1: Separate pools per dependency",
      description: "<p>One slow dependency drains only its own pool.</p>",
      code: "// Without bulkhead: ONE shared thread pool for all calls.\n" +
        "//   Dependency B hangs -> all threads block on B -> A and C also fail\n" +
        "//   (the whole app is down because of one bad dependency).\n" +
        "// With bulkhead: separate pools\n" +
        "//   poolA (10), poolB (10), poolC (10)\n" +
        "//   B hangs -> only poolB exhausts; A and C keep serving normally."
    },
    {
      title: "Example 2: Isolation dimensions",
      description: "<p>Bulkhead by dependency, tenant, or criticality.</p>",
      code: "// Partition by:\n" +
        "//   - downstream dependency (isolate each external call)\n" +
        "//   - tenant (one tenant's spike can't starve others - Noisy Neighbor)\n" +
        "//   - criticality (critical path gets its own reserved resources)\n" +
        "// Containers/pods with resource limits are a form of bulkheading too."
    }
  ],
  whenToUse: "<p>Use Bulkhead to contain failures and prevent resource exhaustion from cascading &mdash; isolate " +
    "calls to different downstream dependencies, separate tenants in multi-tenant systems (Noisy Neighbor " +
    "mitigation), and protect critical paths with dedicated resources. It's essential for resilient services " +
    "that depend on multiple external systems. <strong>Gotchas:</strong> partitioning resources reduces " +
    "<strong>overall efficiency</strong> &mdash; reserved-but-idle capacity in one pool can't help a busy one " +
    "(isolation vs utilization trade-off), so size pools thoughtfully based on each dependency's needs. Too " +
    "many fine-grained bulkheads add complexity and waste; too few don't isolate. It pairs with " +
    "<strong>Circuit Breaker</strong> (bulkhead limits the damage, breaker stops calling the failing " +
    "dependency) and timeouts (so threads don't block forever). At the infrastructure level, container " +
    "resource limits and separate clusters are bulkheads too. Apply it where a single dependency or tenant " +
    "could realistically exhaust shared resources.</p>"
};

C["circuit-breaker"] = {
  summary: "<p>The <strong>Circuit Breaker</strong> pattern prevents an application from repeatedly calling a " +
    "failing dependency, giving it time to recover and letting the caller fail fast instead of hanging. Like " +
    "an electrical breaker, it has three states: <strong>Closed</strong> (calls flow normally; failures are " +
    "counted), <strong>Open</strong> (after too many failures, calls are blocked and fail immediately / hit a " +
    "fallback, for a cooldown), and <strong>Half-Open</strong> (after the cooldown, a few trial calls test " +
    "recovery &mdash; success closes the breaker, failure reopens it). It stops cascading failures, avoids " +
    "wasting resources on doomed calls, and is a cornerstone resiliency pattern (often paired with retries, " +
    "timeouts, and bulkheads).</p>",
  examples: [
    {
      title: "Example 1: The three states",
      description: "<p>Closed → Open → Half-Open protects a failing dependency.</p>",
      code: "// CLOSED:    calls pass through; count failures\n" +
        "//   (failure rate exceeds threshold, e.g. 50% over 20 calls)\n" +
        "// OPEN:      calls FAIL FAST (no call made) / return fallback,\n" +
        "//            for a cooldown (e.g. 30s) -> lets the dependency recover\n" +
        "//   (after cooldown)\n" +
        "// HALF-OPEN: allow a few trial calls\n" +
        "//            success -> CLOSED ; failure -> back to OPEN"
    },
    {
      title: "Example 2: Fail fast with a fallback",
      description: "<p>While open, degrade gracefully instead of hanging.</p>",
      code: "@CircuitBreaker(name='inventory', fallback='unknownStock')\n" +
        "stock = inventoryService.check(productId); // protected call\n" +
        "// When OPEN: returns unknownStock() instantly (no slow timeout,\n" +
        "//   no hammering the struggling service). Pair with a TIMEOUT so\n" +
        "//   calls don't hang, and retries+backoff for transient blips."
    }
  ],
  whenToUse: "<p>Use a Circuit Breaker around <strong>any synchronous call to a remote dependency</strong> that " +
    "could be slow or unavailable &mdash; other services, third-party APIs, databases. It's essential in " +
    "distributed systems to prevent a struggling dependency from exhausting your resources and cascading into " +
    "a full outage, and it enables graceful degradation. <strong>Gotchas:</strong> design a meaningful " +
    "<strong>fallback</strong> (cached/default data or a clear degraded response &mdash; a fallback that just " +
    "rethrows defeats the purpose). Always combine with <strong>timeouts</strong> (a breaker without timeouts " +
    "still lets calls hang) and tune thresholds carefully (too sensitive trips on normal blips; too lax " +
    "doesn't protect). Beware retries <em>through</em> a breaker amplifying load (use backoff+jitter, and only " +
    "retry idempotent/transient failures). It pairs with Bulkhead (isolation) for layered resilience. Use a " +
    "proven library (Resilience4j, Polly) rather than hand-rolling. It appears across the High Availability and " +
    "Resiliency groups for this central role.</p>"
};

C["resiliency"] = {
  summary: "<p><strong>Resiliency</strong> patterns enable a system to <strong>recover gracefully from " +
    "failures</strong> and keep functioning (perhaps in a degraded mode) rather than crashing. Where " +
    "availability is about staying reachable, resiliency is about handling the failures that <em>will</em> " +
    "happen. Key patterns: <strong>Circuit Breaker</strong> (fail fast on a broken dependency), " +
    "<strong>Retry</strong> (re-attempt transient failures with backoff), <strong>Bulkhead</strong> (isolate " +
    "resources), <strong>Compensating Transaction</strong> (undo a multi-step operation that partially " +
    "failed), <strong>Leader Election</strong> (coordinate after failures), and <strong>Scheduler Agent " +
    "Supervisor</strong> (manage and recover distributed work). They embody 'design for failure' &mdash; " +
    "assume things break and build recovery in.</p>",
  examples: [
    {
      title: "Example 1: Resiliency patterns and roles",
      description: "<p>Each handles a different failure scenario.</p>",
      code: "// Retry           -> transient failure? try again (backoff + jitter)\n" +
        "// Circuit Breaker  -> persistent failure? stop calling; fail fast\n" +
        "// Bulkhead         -> isolate so one failure can't drain everything\n" +
        "// Compensating Tx  -> multi-step op partly failed? undo prior steps\n" +
        "// Scheduler Agent Supervisor -> coordinate + recover distributed work"
    },
    {
      title: "Example 2: Layered resilience for one call",
      description: "<p>Combine patterns for robust dependency calls.</p>",
      code: "// A resilient remote call:\n" +
        "//   timeout (don't hang) + retry w/ backoff (transient blips)\n" +
        "//   + circuit breaker (stop if persistently failing)\n" +
        "//   + bulkhead (isolate its resources) + fallback (degrade gracefully)\n" +
        "// One dependency failing -> contained, recovered-from, or degraded."
    }
  ],
  whenToUse: "<p>Apply resiliency patterns to all distributed systems &mdash; networks, services, and hardware " +
    "fail, so the system must tolerate and recover from it. Layer them: timeouts + retries (with backoff/" +
    "jitter) + circuit breakers + bulkheads + fallbacks for dependency calls; compensating transactions for " +
    "multi-step distributed operations. <strong>Gotchas:</strong> patterns must be tuned together and " +
    "carefully &mdash; retries need idempotency and backoff (or they cause retry storms), breakers need " +
    "timeouts and good thresholds, compensating transactions require designing undo logic for each step " +
    "(undoing real-world effects is sometimes impossible). Only retry transient, idempotent failures. Test " +
    "failure handling deliberately (chaos engineering) &mdash; resilience code that's never exercised often " +
    "doesn't work when needed. Don't over-engineer trivial paths. The sub-topics (and cross-listed Circuit " +
    "Breaker/Bulkhead/Leader Election) detail each resiliency pattern.</p>"
};

C["compensating-transaction"] = {
  summary: "<p>The <strong>Compensating Transaction</strong> pattern undoes the effects of a series of steps " +
    "when a multi-step operation <em>partially</em> fails, in systems where a single atomic (ACID) transaction " +
    "isn't possible &mdash; e.g. a workflow spanning multiple services/resources. Since you can't roll back " +
    "across distributed boundaries, you instead define a <strong>compensating action</strong> for each step " +
    "that reverses it (cancel the booking, refund the charge, release the inventory), and on failure you run " +
    "the compensations for the steps already completed, bringing the system back to a consistent state. It's " +
    "the rollback mechanism of the <strong>Saga</strong> pattern for distributed transactions.</p>",
  examples: [
    {
      title: "Example 1: Undo completed steps on failure",
      description: "<p>Each step has a compensating action to reverse it.</p>",
      code: "// Distributed booking (no single ACID transaction across services):\n" +
        "//   step1: reserve flight   (compensation: cancel flight)\n" +
        "//   step2: reserve hotel    (compensation: cancel hotel)\n" +
        "//   step3: charge card  -> FAILS\n" +
        "// Run compensations for completed steps, in reverse:\n" +
        "//   cancel hotel -> cancel flight -> system is consistent again."
    },
    {
      title: "Example 2: Compensation isn't a perfect rollback",
      description: "<p>Undoing real-world effects can be messy or impossible.</p>",
      code: "// A true DB rollback erases as if nothing happened.\n" +
        "// Compensation is a NEW action that reverses effects -> but:\n" +
        "//   - you can't 'un-send' a confirmation email (send a correction)\n" +
        "//   - a refund may incur fees; intermediate states were briefly visible\n" +
        "// Design compensations to be idempotent and to handle these realities."
    }
  ],
  whenToUse: "<p>Use Compensating Transactions for multi-step operations spanning services/resources that can't " +
    "be wrapped in one ACID transaction &mdash; distributed sagas like order fulfillment, travel booking, " +
    "provisioning workflows. It's how you maintain consistency across distributed boundaries when partial " +
    "failure occurs. <strong>Gotchas:</strong> compensation is <em>not</em> a true rollback &mdash; it's a new " +
    "action reversing prior effects, and some effects can't be cleanly undone (sent emails, externally-visible " +
    "intermediate states, real-world actions); design for this (corrections, idempotent compensations, accept " +
    "brief inconsistency). Compensating actions can themselves fail, so they need retries and monitoring. The " +
    "system is <strong>eventually consistent</strong>, not atomic. It's complex &mdash; use a workflow/saga " +
    "engine (Temporal, Step Functions, Camunda) rather than hand-rolling, and reserve it for genuinely " +
    "distributed transactions. If your operation fits within one database, a regular ACID transaction is far " +
    "simpler and stronger. It's the recovery half of the Scheduler Agent Supervisor / Saga approach.</p>"
};

C["retry"] = {
  summary: "<p>The <strong>Retry</strong> pattern handles <strong>transient failures</strong> &mdash; " +
    "temporary glitches like a brief network blip, a momentary timeout, or a short-lived service overload &mdash; " +
    "by automatically re-attempting the failed operation, often after a delay, on the assumption it will " +
    "succeed on a subsequent try. The crucial refinements are <strong>exponential backoff</strong> (wait " +
    "longer between successive retries) and <strong>jitter</strong> (randomize the delay so many clients don't " +
    "retry in lockstep), plus a <strong>retry limit/budget</strong> (give up after N attempts). Done right, " +
    "retries paper over transient faults; done naively, they amplify load and cause retry storms.</p>",
  examples: [
    {
      title: "Example 1: Exponential backoff with jitter",
      description: "<p>Retry transient failures, spacing attempts out and randomizing.</p>",
      code: "// attempt 1 fails -> wait ~1s  (+ random jitter)\n" +
        "// attempt 2 fails -> wait ~2s  (+ jitter)\n" +
        "// attempt 3 fails -> wait ~4s  (+ jitter)\n" +
        "// attempt 4 -> give up (retry budget exhausted) -> surface the error\n" +
        "// Jitter spreads retries so clients don't all retry at the same instant."
    },
    {
      title: "Example 2: Only retry the right things",
      description: "<p>Retry transient + idempotent operations, not everything.</p>",
      code: "// RETRY:   timeouts, 503/429, connection resets (transient)\n" +
        "//          AND only if the operation is IDEMPOTENT (safe to repeat)\n" +
        "// DON'T RETRY: 400/401/404 (permanent - retrying won't help),\n" +
        "//          or non-idempotent ops (a retried 'charge' may double-charge)\n" +
        "// Pair with a circuit breaker so persistent failures stop retrying."
    }
  ],
  whenToUse: "<p>Use Retry for transient, recoverable failures in any network/distributed call &mdash; service-" +
    "to-service requests, database connections, external APIs, message processing. It dramatically improves " +
    "reliability against the inevitable brief glitches of distributed systems. <strong>Critical gotchas:</strong> " +
    "always use <strong>exponential backoff with jitter</strong> and a <strong>retry cap</strong> &mdash; " +
    "naive immediate/fixed retries amplify load on a struggling service and cause <strong>retry storms</strong> " +
    "(a leading cause of cascading outages), especially when retries are <em>nested</em> across layers (retry " +
    "at only one level). Only retry <strong>transient</strong> failures (not permanent 4xx) and only " +
    "<strong>idempotent</strong> operations (or use idempotency keys) &mdash; retrying a non-idempotent write " +
    "causes duplicates/double-charges. Pair with <strong>circuit breakers</strong> so persistent failures stop " +
    "being retried, and timeouts so each attempt is bounded. Use a proven resilience library rather than " +
    "hand-rolling. Retries are powerful but dangerous if undisciplined.</p>"
};

C["security"] = {
  summary: "<p>The <strong>security</strong> cloud design patterns protect systems against threats while " +
    "supporting availability and trust. Key patterns: <strong>Gatekeeper</strong> (a dedicated broker/host " +
    "that validates and sanitizes requests before they reach protected services, shrinking the attack " +
    "surface), <strong>Federated Identity</strong> (delegate authentication to a trusted external identity " +
    "provider rather than managing credentials yourself), and <strong>Valet Key</strong> (grant scoped, " +
    "time-limited direct access to a resource via a token). Security in system design is about defense in " +
    "depth, least privilege, and minimizing exposure &mdash; assuming threats exist and limiting what any " +
    "single compromise can reach.</p>",
  examples: [
    {
      title: "Example 1: Security patterns and roles",
      description: "<p>Each reduces risk in a specific way.</p>",
      code: "// Gatekeeper       -> validate/sanitize requests at a hardened broker\n" +
        "//                     before they reach sensitive services\n" +
        "// Federated Identity -> 'log in with Google/Okta'; don't store passwords\n" +
        "// Valet Key         -> scoped, expiring token for direct resource access\n" +
        "// All apply least privilege + minimize the attack surface."
    },
    {
      title: "Example 2: Defense in depth",
      description: "<p>Layered controls so one failure isn't catastrophic.</p>",
      code: "// Layers: gateway (TLS, auth, rate limit) + gatekeeper (validate input)\n" +
        "//   + federated identity (delegated, MFA-capable auth)\n" +
        "//   + least-privilege access + encryption + audit/security monitoring\n" +
        "// No single control is trusted alone; compromise of one is contained."
    }
  ],
  whenToUse: "<p>Apply security patterns to any system handling user data, authentication, payments, or " +
    "sensitive operations &mdash; effectively all production systems. Use defense in depth (layered controls), " +
    "least privilege (grant the minimum access needed), and minimize the attack surface. <strong>Gotchas:</strong> " +
    "security must be designed in, not bolted on; a single weak layer can be the breach point, so don't rely " +
    "on one control. Never roll your own crypto or auth &mdash; use proven providers and protocols (OAuth2/" +
    "OIDC, established libraries). Combine these patterns with the basics: TLS everywhere, hashing secrets, " +
    "input validation, encryption at rest/in transit, and security monitoring/auditing. The sub-topics detail " +
    "Federated Identity, Gatekeeper, and (cross-listed) Valet Key.</p>"
};

C["federated-identity"] = {
  summary: "<p>The <strong>Federated Identity</strong> pattern delegates user authentication to a trusted " +
    "<strong>external identity provider (IdP)</strong> &mdash; like Google, Microsoft, Okta, Auth0, or a " +
    "corporate directory &mdash; instead of your application managing usernames and passwords itself. Users " +
    "authenticate with the IdP, which issues a token your application trusts (via standards like " +
    "<strong>OAuth2/OpenID Connect</strong> or <strong>SAML</strong>). This enables 'Log in with Google/SSO', " +
    "single sign-on across multiple apps, and removes the burden and risk of you storing credentials. The " +
    "application trusts the IdP's assertion of identity and focuses on authorization (what the user can do).</p>",
  examples: [
    {
      title: "Example 1: Delegated authentication",
      description: "<p>The IdP authenticates; your app trusts its token.</p>",
      code: "// 1. User clicks 'Log in with Google' -> redirected to Google (the IdP)\n" +
        "// 2. Google authenticates the user (password, MFA) - YOUR app never\n" +
        "//    sees the password.\n" +
        "// 3. Google issues a signed token (OIDC id_token) asserting identity.\n" +
        "// 4. Your app verifies the token's signature -> trusts who they are.\n" +
        "// You handle AUTHORIZATION; the IdP handled AUTHENTICATION."
    },
    {
      title: "Example 2: SSO and enterprise federation",
      description: "<p>One identity across many apps; corporate directories.</p>",
      code: "// SSO: log in once at the IdP -> access many apps without re-auth.\n" +
        "// Enterprise: federate with the company's directory (Azure AD/Okta) via\n" +
        "//   SAML/OIDC -> employees use their corporate identity; central control\n" +
        "//   over provisioning/deprovisioning (deactivate once -> access revoked)."
    }
  ],
  whenToUse: "<p>Use Federated Identity to offer social login or enterprise SSO, to support B2B/B2E scenarios " +
    "(customers use their own corporate identity), and to avoid the security burden of storing and protecting " +
    "passwords yourself &mdash; the IdP handles credentials, MFA, and account security. It's standard for " +
    "modern auth. <strong>Gotchas:</strong> you now <strong>depend on the external IdP's availability</strong> " +
    "(an IdP outage blocks your logins &mdash; consider fallbacks/multiple IdPs for critical systems) and must " +
    "trust it. Implement the standards correctly &mdash; OAuth2/OIDC have many flows and subtle security " +
    "requirements (use Authorization Code + PKCE for user-facing apps); <strong>don't hand-roll</strong> it, " +
    "use vetted libraries/providers. Validate tokens properly (signature, issuer, audience, expiry). Map " +
    "external identities to your authorization model carefully. Manage account linking and the case where a " +
    "user has multiple IdPs. It cleanly separates authentication (IdP) from authorization (your app).</p>"
};

C["gatekeeper"] = {
  summary: "<p>The <strong>Gatekeeper</strong> pattern protects applications and services by placing a " +
    "dedicated <strong>broker/host</strong> between clients and your sensitive backend, which validates, " +
    "sanitizes, and authorizes all requests before forwarding them &mdash; so the protected services are " +
    "never directly exposed. The gatekeeper holds no sensitive data or business logic itself and runs with " +
    "minimal privileges, acting purely as a hardened, throwaway front line. If the gatekeeper is compromised, " +
    "the attacker still can't directly reach the protected resources or their data (the gatekeeper has limited " +
    "access). It reduces the attack surface and adds a validation/sanitization layer (defense in depth).</p>",
  examples: [
    {
      title: "Example 1: A hardened broker shields the backend",
      description: "<p>Clients hit the gatekeeper; it validates, then forwards.</p>",
      code: "//   Client -> [ Gatekeeper ] -> [ Trusted host / protected services ]\n" +
        "//             (public-facing,         (not directly reachable,\n" +
        "//              minimal privilege,       holds the data + logic)\n" +
        "//              validates/sanitizes\n" +
        "//              every request)\n" +
        "// The gatekeeper has only limited access -> compromising it doesn't\n" +
        "//   hand over the protected resources."
    },
    {
      title: "Example 2: Validation + privilege separation",
      description: "<p>Sanitize input and separate the exposed tier from secrets.</p>",
      code: "// Gatekeeper: validate/sanitize input, enforce auth, rate limit,\n" +
        "//   reject malformed/malicious requests - BEFORE the backend sees them.\n" +
        "// It stores NO secrets and has minimal rights; the trusted backend\n" +
        "//   (with the real privileges/data) is only reachable via the gatekeeper.\n" +
        "// Limits blast radius if the public-facing layer is breached."
    }
  ],
  whenToUse: "<p>Use the Gatekeeper pattern to protect sensitive services and data exposed to untrusted clients &mdash; " +
    "public-facing applications handling valuable or regulated data, where reducing the attack surface and " +
    "validating/sanitizing all input at a hardened, low-privilege front line is worth the extra hop. It " +
    "embodies privilege separation and defense in depth. <strong>Gotchas:</strong> it adds a component and a " +
    "network hop (latency), and the gatekeeper must itself be highly available and scalable (it's in the " +
    "critical path and is the exposed target). Keep it truly minimal &mdash; no secrets, no business logic, " +
    "least privilege &mdash; or it just becomes another sensitive component to breach. Its functions overlap " +
    "with API gateways/WAFs (which often provide validation, auth, rate limiting), so in many architectures " +
    "those tools fulfill the gatekeeper role. It's most justified for high-value/high-risk systems; for " +
    "lower-risk apps, standard gateway + good input validation may suffice. Combine with the other security " +
    "patterns rather than relying on it alone.</p>"
};

C["health-endpoint-monitoring"] = {
  summary: "<p>The <strong>Health Endpoint Monitoring</strong> pattern exposes <strong>health-check " +
    "endpoints</strong> in a service that external tools (load balancers, orchestrators, uptime monitors) " +
    "probe to verify the service is functioning. A request to <code>/health</code> runs checks and returns a " +
    "status (200 healthy / 503 unhealthy), ideally verifying not just that the process is alive but that it " +
    "can reach its critical dependencies (database, cache, downstream services). This enables automated " +
    "detection of failures and rerouting around unhealthy instances &mdash; the backbone of self-healing, " +
    "highly-available systems. It's the cloud-pattern formalization of health checks, used across the " +
    "Availability, High Availability, and Resiliency concerns.</p>",
  examples: [
    {
      title: "Example 1: A meaningful health endpoint",
      description: "<p>Verify real dependencies, not just 'process is up'.</p>",
      code: "// GET /health -> runs checks, returns overall status\n" +
        "// {\n" +
        "//   status: 'UP',\n" +
        "//   checks: { database: 'UP', cache: 'UP', paymentGateway: 'DOWN' }\n" +
        "// }   -> 503 if a CRITICAL dependency is down\n" +
        "// Probed by LB/orchestrator/uptime monitor on an interval."
    },
    {
      title: "Example 2: Drives routing and self-healing",
      description: "<p>Failed checks trigger automated reaction.</p>",
      code: "// Load balancer: stop routing to an instance failing health checks.\n" +
        "// Kubernetes: liveness probe fails -> restart the pod;\n" +
        "//             readiness probe fails -> remove from service endpoints.\n" +
        "// External monitor: endpoint down from multiple regions -> alert on-call."
    }
  ],
  whenToUse: "<p>Implement health endpoints on every service &mdash; load balancers and orchestrators rely on " +
    "them for routing, restart, and failover, and external monitors use them to detect outages and alert. " +
    "Distinguish <strong>liveness</strong> (restart if dead) from <strong>readiness</strong> (route only when " +
    "able to serve), and verify critical dependencies in readiness. <strong>Gotchas:</strong> a " +
    "<em>shallow</em> check that returns 200 just because the process runs can mask real breakage (alive but " +
    "can't reach its DB) &mdash; but an <em>overly aggressive</em> check that fails on any minor/shared " +
    "dependency blip can cause mass instance removal and cascading failures (a shared DB hiccup makes every " +
    "instance report unhealthy at once). Keep checks fast and cheap (they run frequently) and avoid expensive " +
    "deep checks on every probe. Secure/limit exposure of detailed health info. It's the detection mechanism " +
    "that makes automated failover and self-healing possible; it appears in multiple reliability groups for " +
    "this reason.</p>"
};

/* ======================================================================
   ALIASES — cross-listed patterns share one content entry
   ====================================================================== */

C["db-replication"] = C["replication"];
C["dm-sharding"] = C["sharding"];
C["dm-cache-aside"] = C["cache-aside"];
C["di-static-content-hosting"] = C["static-content-hosting"];
C["di-cqrs"] = C["cqrs"];
C["di-pipes-and-filters"] = C["pipes-and-filters"];
C["av-queue-based-load-leveling"] = C["queue-based-load-leveling"];
C["ha-deployment-stamps"] = C["deployment-stamps"];
C["ha-geodes"] = C["geodes"];
C["ha-health-endpoint-monitoring"] = C["health-endpoint-monitoring"];
C["res-bulkhead"] = C["bulkhead"];
C["res-circuit-breaker"] = C["circuit-breaker"];
C["res-health-endpoint-monitoring"] = C["health-endpoint-monitoring"];
C["res-leader-election"] = C["leader-election"];
C["res-queue-based-load-leveling"] = C["queue-based-load-leveling"];
C["scheduler-agent-supervisor"] = C["scheduling-agent-supervisor"];
C["sec-valet-key"] = C["valet-key"];
