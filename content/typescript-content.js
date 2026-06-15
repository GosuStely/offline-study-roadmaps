// Content for the "typescript" roadmap.
// One entry per topic id (see data/typescript.js for the list of ids).

window.CONTENT_DATA = window.CONTENT_DATA || {};
window.CONTENT_DATA["typescript"] = window.CONTENT_DATA["typescript"] || {};

var C = window.CONTENT_DATA["typescript"];

/* ======================================================================
   SECTION 1 — INTRODUCTION TO TYPESCRIPT
   ====================================================================== */

C["introduction-to-typescript"] = {
  summary: "<p><strong>TypeScript</strong> is a strongly-typed superset of JavaScript developed by Microsoft. " +
    "It adds an optional <strong>static type system</strong> on top of JavaScript: you annotate variables, " +
    "parameters, and return values with types, and the <strong>TypeScript compiler (tsc)</strong> checks " +
    "them <em>before</em> your code runs, catching whole classes of bugs at edit/compile time instead of in " +
    "production. TypeScript itself produces no runtime code &mdash; it <em>compiles down to plain " +
    "JavaScript</em> that runs anywhere JS does (browsers, Node, Deno). The payoff is safer code, better " +
    "autocomplete and refactoring, and self-documenting interfaces, with essentially zero runtime cost.</p>",
  examples: [
    {
      title: "Example 1: Types catch a bug before runtime",
      description: "<p>The compiler flags a mistake the same code would happily run (and break) in JS.</p>",
      code: "function greet(name: string): string {\n" +
        "  return \"Hello, \" + name.toUpperCase();\n" +
        "}\n" +
        "\n" +
        "greet(\"Sam\");   // OK\n" +
        "greet(42);       // ERROR at compile time:\n" +
        "//   Argument of type 'number' is not assignable to parameter of type 'string'\n" +
        "// In plain JS this runs and throws at runtime: 42.toUpperCase() is not a function"
    },
    {
      title: "Example 2: TypeScript compiles to plain JavaScript",
      description: "<p>Types are erased; the output is ordinary JS with no type machinery.</p>",
      code: "// input.ts\n" +
        "const add = (a: number, b: number): number => a + b;\n" +
        "\n" +
        "// compiled output.js (types stripped away)\n" +
        "const add = (a, b) => a + b;\n" +
        "// Nothing 'TypeScript' survives to runtime - it's a compile-time tool."
    }
  ],
  whenToUse: "<p>Use TypeScript for any JavaScript project beyond a trivial script &mdash; it's now the default " +
    "for most serious front-end (React, Angular, Vue) and Node back-end work. The benefits grow with " +
    "codebase size and team count: fewer runtime bugs, safer refactoring, and editor tooling that " +
    "understands your code. <strong>Trade-offs:</strong> there's a build step (compilation) and a learning " +
    "curve, and the type system can occasionally feel like it's fighting you on dynamic patterns. It also " +
    "gives a false sense of total safety &mdash; types are erased at runtime, so data crossing your " +
    "boundaries (API responses, user input) is <em>not</em> automatically validated; you still need runtime " +
    "checks there. For a tiny throwaway script, plain JS may be quicker, but for anything maintained, " +
    "TypeScript pays for itself fast.</p>"
};

C["typescript-vs-javascript"] = {
  summary: "<p>The core difference: <strong>JavaScript is dynamically typed</strong> (types are checked at " +
    "runtime, variables can hold anything) while <strong>TypeScript adds static typing</strong> (types are " +
    "checked at compile time). TypeScript is a <em>superset</em> &mdash; every valid JavaScript program is " +
    "valid TypeScript &mdash; so TS adds features (type annotations, interfaces, generics, enums) without " +
    "removing any JS. After compilation, TypeScript becomes JavaScript, so they run identically. The " +
    "practical distinction is <em>when</em> errors are caught: TypeScript surfaces type mistakes in your " +
    "editor as you type; JavaScript only discovers them when the buggy line actually executes.</p>",
  examples: [
    {
      title: "Example 1: When the error surfaces",
      description: "<p>The same mistake is caught at different times.</p>",
      code: "// JavaScript: no complaint until this line RUNS (maybe in production)\n" +
        "function len(x) { return x.length; }\n" +
        "len(123);  // runtime: undefined (or a crash) - silent until executed\n" +
        "\n" +
        "// TypeScript: error in the editor, before running anything\n" +
        "function lenTs(x: string) { return x.length; }\n" +
        "lenTs(123); // compile error: number is not assignable to string"
    },
    {
      title: "Example 2: TS is a superset (all JS is valid TS)",
      description: "<p>You can adopt TypeScript gradually &mdash; existing JS already 'works'.</p>",
      code: "// This is valid JavaScript AND valid TypeScript:\n" +
        "const items = [1, 2, 3];\n" +
        "const doubled = items.map(n => n * 2);\n" +
        "// TypeScript even infers types here (items: number[], doubled: number[])\n" +
        "// without a single annotation - you opt into more typing as you go."
    }
  ],
  whenToUse: "<p>Choose TypeScript over plain JavaScript when correctness, maintainability, and tooling matter " +
    "&mdash; medium-to-large apps, shared libraries, team projects, long-lived code. Choose plain JS for " +
    "quick scripts, tiny prototypes, or environments where a build step isn't worth it. <strong>Key " +
    "insight:</strong> the choice isn't all-or-nothing &mdash; because TS is a superset, you can migrate a JS " +
    "codebase file by file, even allowing <code>any</code> in stubborn spots initially. <strong>Gotcha:</strong> " +
    "don't assume TypeScript makes JavaScript's quirks disappear &mdash; <code>0.1 + 0.2 !== 0.3</code>, " +
    "<code>==</code> coercion, and runtime <code>undefined</code> from external data all still exist; TS " +
    "helps you reason about types, not change JavaScript's runtime semantics.</p>"
};

C["ts-js-interoperability"] = {
  summary: "<p><strong>TypeScript and JavaScript interoperate seamlessly</strong> because TS compiles to JS " +
    "and a TS project can include and call plain JS files (and vice versa). You can import JS modules into " +
    "TypeScript, mix <code>.ts</code> and <code>.js</code> files (with <code>allowJs</code>), and consume the " +
    "millions of npm packages written in JavaScript. For type safety with JS libraries, TypeScript uses " +
    "<strong>declaration files</strong> (<code>.d.ts</code>) that describe a JS library's shape &mdash; many " +
    "are bundled with packages or available via the community <code>@types/*</code> packages (DefinitelyTyped). " +
    "This interop is why adopting TypeScript incrementally in an existing JS project is realistic.</p>",
  examples: [
    {
      title: "Example 1: Using a JS library with community types",
      description: "<p>Install the library plus its <code>@types</code> package to get full type safety.</p>",
      code: "// npm install lodash\n" +
        "// npm install -D @types/lodash   <- community-maintained declarations\n" +
        "\n" +
        "import { chunk } from \"lodash\";\n" +
        "const groups = chunk([1, 2, 3, 4], 2); // fully typed: number[][]\n" +
        "// Even though lodash is JS, the .d.ts gives you autocomplete + checking."
    },
    {
      title: "Example 2: Allowing JS files in a TS project",
      description: "<p>Mix JS and TS during a migration with one compiler flag.</p>",
      code: "// tsconfig.json\n" +
        "{\n" +
        "  \"compilerOptions\": {\n" +
        "    \"allowJs\": true,      // compile .js files too\n" +
        "    \"checkJs\": false      // (optionally) also type-check them\n" +
        "  }\n" +
        "}\n" +
        "// import legacyUtil from \"./legacy.js\";  // works inside TypeScript"
    }
  ],
  whenToUse: "<p>Interop matters constantly: every time you use an npm package (most are JS) and whenever you " +
    "migrate an existing JavaScript codebase to TypeScript gradually. Lean on <code>@types/*</code> packages " +
    "for untyped libraries, and <code>allowJs</code>/<code>checkJs</code> to mix file types during migration. " +
    "<strong>Gotchas:</strong> some JS libraries ship no types and no <code>@types</code> exist &mdash; you " +
    "then get <code>any</code> (losing safety) or must write your own <code>.d.ts</code>. Community " +
    "<code>@types</code> can also lag behind or mismatch the library's actual version, causing confusing " +
    "errors. And data flowing in from JS code or external sources isn't validated by types &mdash; treat " +
    "boundaries as <code>unknown</code> and validate at runtime rather than trusting a declaration file " +
    "blindly.</p>"
};

C["installation-and-configuration"] = {
  summary: "<p>You install TypeScript via npm &mdash; either globally or (preferably) as a per-project dev " +
    "dependency &mdash; which gives you the <code>tsc</code> compiler. A TypeScript project is configured " +
    "with a <strong><code>tsconfig.json</code></strong> file at its root, which tells the compiler which " +
    "files to include, what JavaScript version to target, which module system to use, how strict to be, and " +
    "where to put output. You generate a starter config with <code>tsc --init</code>. Getting this setup " +
    "right &mdash; especially enabling strict mode &mdash; is the foundation for everything else.</p>",
  examples: [
    {
      title: "Example 1: Install and initialize a project",
      description: "<p>Add TypeScript locally and scaffold a config.</p>",
      code: "# Install as a project-local dev dependency (recommended over global)\n" +
        "npm install --save-dev typescript\n" +
        "\n" +
        "# Generate a tsconfig.json with sensible defaults + comments\n" +
        "npx tsc --init\n" +
        "\n" +
        "# Compile the project\n" +
        "npx tsc"
    },
    {
      title: "Example 2: A minimal, sane tsconfig",
      description: "<p>The settings most projects want from day one.</p>",
      code: "// tsconfig.json\n" +
        "{\n" +
        "  \"compilerOptions\": {\n" +
        "    \"target\": \"ES2022\",\n" +
        "    \"module\": \"NodeNext\",\n" +
        "    \"strict\": true,        // enable ALL strict checks - do this early\n" +
        "    \"outDir\": \"dist\",\n" +
        "    \"rootDir\": \"src\"\n" +
        "  },\n" +
        "  \"include\": [\"src/**/*\"]\n" +
        "}"
    }
  ],
  whenToUse: "<p>You configure TypeScript once at the start of every project (or inherit a shared base config). " +
    "Prefer a <strong>local</strong> install so everyone on the team uses the exact same compiler version " +
    "(committed in <code>package.json</code>) rather than relying on whatever is installed globally. " +
    "<strong>Strong recommendation:</strong> turn on <code>\"strict\": true</code> from the very beginning " +
    "&mdash; it enables null checks and other safety features that are painful to retrofit later. " +
    "<strong>Gotcha:</strong> framework toolchains (Vite, Next.js, Angular CLI) often provide their own " +
    "tsconfig and may use a bundler (esbuild/swc) that transpiles without full type-checking for speed &mdash; " +
    "so understand whether type errors actually block your build, and run <code>tsc --noEmit</code> in CI to " +
    "be sure.</p>"
};

C["tsconfig-json"] = {
  summary: "<p><strong><code>tsconfig.json</code></strong> is the configuration file that defines a TypeScript " +
    "project and controls how the compiler behaves. Its presence marks the project root. The main parts are " +
    "<strong><code>compilerOptions</code></strong> (the bulk &mdash; target JS version, module system, " +
    "strictness, output paths, and dozens more), <strong><code>include</code>/<code>exclude</code></strong> " +
    "(which files are part of the project), and <strong><code>extends</code></strong> (inherit from a base " +
    "config). It's how you turn on type safety features, point the compiler at your source, and shape the " +
    "emitted JavaScript. Editors read it too, so it also drives your in-IDE type checking.</p>",
  examples: [
    {
      title: "Example 1: Common configuration shape",
      description: "<p>The sections you'll edit most often.</p>",
      code: "{\n" +
        "  \"compilerOptions\": {\n" +
        "    \"target\": \"ES2022\",       // JS version of the output\n" +
        "    \"module\": \"NodeNext\",     // module system for emitted code\n" +
        "    \"strict\": true,            // all strict type-checking on\n" +
        "    \"esModuleInterop\": true,   // smoother default imports of CJS modules\n" +
        "    \"skipLibCheck\": true,      // skip type-checking .d.ts files (faster)\n" +
        "    \"outDir\": \"dist\"\n" +
        "  },\n" +
        "  \"include\": [\"src/**/*\"],\n" +
        "  \"exclude\": [\"node_modules\", \"dist\"]\n" +
        "}"
    },
    {
      title: "Example 2: Sharing config with extends",
      description: "<p>Inherit a base config and override only what differs.</p>",
      code: "// tsconfig.base.json (shared across packages in a monorepo)\n" +
        "{ \"compilerOptions\": { \"strict\": true, \"target\": \"ES2022\" } }\n" +
        "\n" +
        "// packages/api/tsconfig.json\n" +
        "{\n" +
        "  \"extends\": \"../../tsconfig.base.json\",\n" +
        "  \"compilerOptions\": { \"outDir\": \"dist\" }\n" +
        "}"
    }
  ],
  whenToUse: "<p>You touch <code>tsconfig.json</code> whenever you start a project or need to change how code " +
    "is compiled or checked &mdash; targeting a different JS version, switching module systems, tightening " +
    "strictness, or setting up path aliases. Use <code>extends</code> to share a base config across a " +
    "monorepo for consistency. <strong>Gotchas:</strong> the options interact in subtle ways &mdash; " +
    "<code>module</code> and <code>moduleResolution</code> must match your runtime (Node ESM vs CommonJS vs " +
    "bundler), and getting them wrong causes baffling import errors. <code>skipLibCheck</code> is widely used " +
    "to speed up builds but can hide real type problems in dependencies. Don't blindly copy a tsconfig from " +
    "the internet &mdash; many options have real consequences; understand the ones you set, and lean on " +
    "<code>tsc --init</code>'s commented output as a guide.</p>"
};

C["compiler-options"] = {
  summary: "<p><strong>Compiler options</strong> are the individual settings inside <code>compilerOptions</code> " +
    "that fine-tune TypeScript's behavior. Important categories: <em>output</em> (<code>target</code>, " +
    "<code>module</code>, <code>outDir</code>, <code>sourceMap</code>), <em>type checking strictness</em> " +
    "(<code>strict</code> and its sub-flags like <code>strictNullChecks</code>, <code>noImplicitAny</code>), " +
    "<em>module resolution</em> (<code>moduleResolution</code>, <code>paths</code>, <code>baseUrl</code>), " +
    "and <em>interop/JS</em> (<code>esModuleInterop</code>, <code>allowJs</code>, <code>jsx</code>). The most " +
    "consequential single flag is <code>strict</code>, which bundles several safety checks. Learning the key " +
    "options lets you tailor TypeScript to your runtime and your safety needs.</p>",
  examples: [
    {
      title: "Example 1: Strict mode and its components",
      description: "<p><code>strict: true</code> turns on a family of important checks at once.</p>",
      code: "{\n" +
        "  \"compilerOptions\": {\n" +
        "    \"strict\": true\n" +
        "    // equivalent to enabling, among others:\n" +
        "    //   \"strictNullChecks\": true   -> null/undefined must be handled\n" +
        "    //   \"noImplicitAny\": true      -> no silent 'any' on untyped params\n" +
        "    //   \"strictFunctionTypes\": true\n" +
        "    //   \"strictBindCallApply\": true\n" +
        "  }\n" +
        "}"
    },
    {
      title: "Example 2: Path aliases for cleaner imports",
      description: "<p>Map a short alias to a folder to avoid <code>../../../</code> import chains.</p>",
      code: "{\n" +
        "  \"compilerOptions\": {\n" +
        "    \"baseUrl\": \"./src\",\n" +
        "    \"paths\": { \"@/*\": [\"*\"] }\n" +
        "  }\n" +
        "}\n" +
        "// Now: import { User } from \"@/models/User\";\n" +
        "// (Note: your bundler/runtime must resolve the alias too.)"
    }
  ],
  whenToUse: "<p>Adjust compiler options to match your environment (browser vs Node, ESM vs CJS), your safety " +
    "appetite, and your tooling. Always enable <code>strict</code> on new projects. Use additional flags like " +
    "<code>noUnusedLocals</code>, <code>noImplicitReturns</code>, and <code>noUncheckedIndexedAccess</code> " +
    "to catch more bugs as you mature a codebase. <strong>Gotchas:</strong> some options only affect type " +
    "<em>checking</em> while others change the emitted output &mdash; know which you're touching. " +
    "<code>paths</code> aliases are resolved by <code>tsc</code> for type-checking but <em>not</em> rewritten " +
    "in the output, so your bundler or runtime must understand them too (a common 'works in editor, breaks at " +
    "runtime' trap). Introduce stricter flags incrementally on existing code to avoid a flood of errors all " +
    "at once.</p>"
};

C["running-typescript"] = {
  summary: "<p>Because browsers and Node don't execute TypeScript directly, you need a way to <strong>run</strong> " +
    "it. The options: <strong>compile then run</strong> &mdash; use <code>tsc</code> to produce JavaScript, " +
    "then run that JS with Node or load it in a browser; <strong>run directly</strong> with a tool like " +
    "<code>ts-node</code> (or <code>tsx</code>, or Node's newer built-in TS support) that transpiles on the " +
    "fly; or <strong>experiment instantly</strong> in the online <strong>TypeScript Playground</strong>. In " +
    "real apps, a bundler (Vite, esbuild, Webpack) usually handles the TS&rarr;JS step as part of the build. " +
    "Knowing these paths lets you pick the fastest feedback loop for the task.</p>",
  examples: [
    {
      title: "Example 1: Compile-then-run vs run-directly",
      description: "<p>Two common workflows for executing TypeScript.</p>",
      code: "# Option A: compile to JS, then run the JS\n" +
        "npx tsc            # produces dist/app.js\n" +
        "node dist/app.js\n" +
        "\n" +
        "# Option B: run the .ts file directly (no manual build step)\n" +
        "npx ts-node src/app.ts\n" +
        "# or the faster, modern alternative:\n" +
        "npx tsx src/app.ts"
    },
    {
      title: "Example 2: Watch mode for a fast feedback loop",
      description: "<p>Recompile automatically on every save during development.</p>",
      code: "# Recompile whenever a file changes\n" +
        "npx tsc --watch\n" +
        "\n" +
        "# In real front-end apps the dev server (e.g. Vite) does this for you\n" +
        "# and reloads the browser on each change (HMR)."
    }
  ],
  whenToUse: "<p>Pick the run method by context: <code>tsc</code> (or a bundler) for production builds where you " +
    "ship the compiled JS; <code>ts-node</code>/<code>tsx</code> for quickly running scripts, tests, or a " +
    "Node server in development without a separate build step; the Playground for learning, sharing snippets, " +
    "and experimenting with types. <strong>Gotchas:</strong> tools that transpile on the fly (<code>ts-node</code>, " +
    "<code>tsx</code>, esbuild, swc) are fast because they often <em>strip types without fully " +
    "type-checking</em> &mdash; so your code can run while still containing type errors. Always run a separate " +
    "<code>tsc --noEmit</code> type-check (in CI and pre-commit) so transpile-only speed doesn't let type " +
    "bugs slip through. Also match your <code>module</code>/<code>target</code> config to the runner, or " +
    "you'll hit import/syntax errors.</p>"
};

C["tsc"] = {
  summary: "<p><strong><code>tsc</code></strong> is the official <strong>TypeScript compiler</strong>. It " +
    "reads your <code>.ts</code> files and <code>tsconfig.json</code>, performs <strong>type checking</strong>, " +
    "and (unless told otherwise) <strong>emits JavaScript</strong>. It's the canonical, authoritative tool " +
    "for both verifying types and producing output. Common invocations: <code>tsc</code> (build the whole " +
    "project per tsconfig), <code>tsc --watch</code> (rebuild on change), and <code>tsc --noEmit</code> " +
    "(type-check only, produce no files &mdash; ideal for CI when a bundler handles the actual build). " +
    "Whatever fancy tooling you use, <code>tsc</code> is the source of truth for whether your types are " +
    "correct.</p>",
  examples: [
    {
      title: "Example 1: Core commands",
      description: "<p>The handful of <code>tsc</code> invocations you'll use most.</p>",
      code: "npx tsc               # compile the project (reads tsconfig.json)\n" +
        "npx tsc --watch       # recompile automatically on file changes\n" +
        "npx tsc --noEmit      # type-check ONLY, emit nothing (great for CI)\n" +
        "npx tsc app.ts        # compile a single file (ignores tsconfig)"
    },
    {
      title: "Example 2: Type-check in CI without building",
      description: "<p>Use <code>--noEmit</code> so a fast bundler builds but <code>tsc</code> guards types.</p>",
      code: "// package.json\n" +
        "{\n" +
        "  \"scripts\": {\n" +
        "    \"build\": \"vite build\",        // bundler produces the artifacts\n" +
        "    \"typecheck\": \"tsc --noEmit\"  // tsc just verifies types\n" +
        "  }\n" +
        "}\n" +
        "// CI runs both: a green 'typecheck' guarantees no type errors shipped."
    }
  ],
  whenToUse: "<p>Use <code>tsc</code> as the authoritative type checker and, for simple Node libraries, as the " +
    "build tool that emits JS. In modern front-end apps, you usually let a faster bundler (Vite/esbuild) do " +
    "the emit and run <code>tsc --noEmit</code> separately to enforce type correctness. <strong>Gotchas:</strong> " +
    "<code>tsc</code> is thorough but comparatively slow on large projects &mdash; use project references and " +
    "incremental builds (<code>\"incremental\": true</code>, <code>tsc --build</code>) to speed it up. Don't " +
    "assume a passing bundler build means types are fine: many bundlers transpile without type-checking, so a " +
    "separate <code>tsc --noEmit</code> step is essential. And remember <code>tsc app.ts</code> on a single " +
    "file bypasses your <code>tsconfig.json</code> entirely, which surprises people when their configured " +
    "options don't apply.</p>"
};

C["ts-node"] = {
  summary: "<p><strong><code>ts-node</code></strong> is a tool that runs TypeScript files <strong>directly in " +
    "Node</strong>, compiling them in memory on the fly so you skip the explicit <code>tsc</code> build step. " +
    "It's handy for executing scripts, running a Node server in development, or using a TypeScript REPL. You " +
    "invoke it like Node: <code>ts-node script.ts</code>. In recent years faster alternatives based on esbuild/" +
    "swc &mdash; notably <strong><code>tsx</code></strong> &mdash; have become popular because they're much " +
    "quicker (they strip types without full type-checking), and Node itself has added native TypeScript " +
    "support, so <code>ts-node</code>'s role is shrinking but the concept (run TS directly) remains common.</p>",
  examples: [
    {
      title: "Example 1: Running and REPL",
      description: "<p>Execute a TS file or open an interactive TypeScript REPL.</p>",
      code: "# Run a TypeScript file directly, no build step\n" +
        "npx ts-node src/seed.ts\n" +
        "\n" +
        "# Interactive REPL for quick experiments\n" +
        "npx ts-node\n" +
        "> const x: number = 5; x * 2\n" +
        "10"
    },
    {
      title: "Example 2: The faster modern alternative",
      description: "<p><code>tsx</code> does the same job, much faster, for most dev use.</p>",
      code: "# tsx (esbuild-based) - very fast, popular for dev/scripts\n" +
        "npx tsx src/server.ts\n" +
        "npx tsx watch src/server.ts   # restart on changes\n" +
        "\n" +
        "# Node (recent versions) can also run .ts directly in many cases:\n" +
        "node --experimental-strip-types src/app.ts"
    }
  ],
  whenToUse: "<p>Use <code>ts-node</code> (or <code>tsx</code>) when you want to run TypeScript without a " +
    "separate compile step &mdash; dev servers, one-off scripts, database seeds, test runners, quick " +
    "experiments. It keeps the inner-loop fast. <strong>Important gotcha:</strong> for speed, these tools " +
    "(especially <code>tsx</code>/esbuild) often <em>transpile without full type-checking</em>, so code with " +
    "type errors will still run &mdash; never rely on them to catch type mistakes; pair them with a separate " +
    "<code>tsc --noEmit</code>. <code>ts-node</code> can also be slow and finicky with ESM/module config. For " +
    "<strong>production</strong>, prefer compiling ahead of time with <code>tsc</code> or a bundler and " +
    "running the resulting JS, rather than transpiling on every start. Given the ecosystem shift, " +
    "<code>tsx</code> or Node's native support is often the better modern pick over <code>ts-node</code>.</p>"
};

C["ts-playground"] = {
  summary: "<p>The <strong>TypeScript Playground</strong> (typescriptlang.org/play) is an official online " +
    "editor where you write TypeScript and instantly see the compiled JavaScript output, type errors, and " +
    "inferred types &mdash; with no local setup. You can tweak compiler options, switch TS versions, share " +
    "code via a URL, and inspect how the type system reasons about your code (hovering shows inferred types). " +
    "It's an invaluable tool for <strong>learning</strong>, <strong>experimenting</strong> with tricky type " +
    "behavior, <strong>sharing</strong> reproductions in bug reports or questions, and checking how a feature " +
    "behaves across TypeScript versions.</p>",
  examples: [
    {
      title: "Example 1: See inferred types and output instantly",
      description: "<p>Paste code and the Playground shows types and the emitted JS side by side.</p>",
      code: "// In the Playground, hover over 'user' to see the inferred type:\n" +
        "const user = { id: 1, name: \"Sam\", roles: [\"admin\"] };\n" +
        "// inferred: { id: number; name: string; roles: string[] }\n" +
        "\n" +
        "// The right panel shows the compiled JavaScript in real time."
    },
    {
      title: "Example 2: Sharing a reproduction",
      description: "<p>Encode the code in the URL to share a minimal example.</p>",
      code: "// Write a minimal example that shows a type behavior, then click 'Share'.\n" +
        "type Flatten<T> = T extends Array<infer U> ? U : T;\n" +
        "type A = Flatten<string[]>; // string\n" +
        "// The generated URL contains the code - perfect for Stack Overflow / issues."
    }
  ],
  whenToUse: "<p>Reach for the Playground whenever you want to test a type idea quickly, understand <em>why</em> " +
    "TypeScript infers or rejects something, learn a new feature, or produce a shareable minimal reproduction " +
    "for a question or bug report. It's also great for checking behavior across TS versions and for teaching. " +
    "<strong>Limitations to remember:</strong> it's a single-file, isolated sandbox &mdash; it can't resolve " +
    "your project's <code>node_modules</code>, real imports, or multi-file setups, so it's for experiments " +
    "and snippets, not for testing your actual application. For anything involving your real dependencies or " +
    "build config, reproduce locally. Used for what it's good at &mdash; isolated type experiments &mdash; " +
    "it's one of the best ways to deepen your TypeScript understanding.</p>"
};

/* ======================================================================
   SECTION 2 — TYPESCRIPT TYPES
   ====================================================================== */

C["typescript-types"] = {
  summary: "<p>TypeScript's <strong>type system</strong> describes the shape of your data so the compiler can " +
    "verify how it's used. The building blocks are: <strong>primitive types</strong> (<code>boolean</code>, " +
    "<code>number</code>, <code>string</code>, plus <code>void</code>, <code>null</code>, <code>undefined</code>); " +
    "<strong>object types</strong> (interfaces, classes, enums, arrays, tuples, objects); the <strong>top " +
    "types</strong> <code>unknown</code> and <code>any</code> (which accept anything); the <strong>bottom " +
    "type</strong> <code>never</code> (which accepts nothing); and <strong>assertions</strong> like " +
    "<code>as</code>, <code>as const</code>, the non-null <code>!</code>, and <code>satisfies</code> that " +
    "let you adjust or refine how the compiler sees a value. Mastering these is the heart of using TypeScript.</p>",
  examples: [
    {
      title: "Example 1: Annotating values with types",
      description: "<p>You attach a type after a colon; the compiler enforces it everywhere.</p>",
      code: "let count: number = 0;\n" +
        "let name: string = \"Sam\";\n" +
        "let active: boolean = true;\n" +
        "let tags: string[] = [\"a\", \"b\"];        // array type\n" +
        "let point: [number, number] = [10, 20];   // tuple type\n" +
        "\n" +
        "count = \"oops\"; // ERROR: 'string' is not assignable to 'number'"
    },
    {
      title: "Example 2: The categories at a glance",
      description: "<p>A quick map of the type families covered in this section.</p>",
      code: "// Primitives: boolean, number, string, void, null, undefined\n" +
        "// Objects:    interface, class, enum, Array, Tuple, object\n" +
        "// Top types:  unknown (safe), any (escape hatch)\n" +
        "// Bottom:     never (impossible value)\n" +
        "// Assertions: as, as const, as any, ! (non-null), satisfies"
    }
  ],
  whenToUse: "<p>You use types continuously &mdash; the skill is choosing the <em>right</em> one and letting " +
    "inference handle the rest (annotate function signatures and public APIs; let TS infer local variables). " +
    "<strong>Guiding principles:</strong> prefer precise types over <code>any</code> (which disables " +
    "checking), prefer <code>unknown</code> over <code>any</code> when a value is genuinely untyped (it " +
    "forces you to narrow before use), and reach for assertions sparingly &mdash; they tell the compiler " +
    "'trust me', which means <em>you</em> take responsibility for correctness. The rest of this section " +
    "breaks down each type individually with its own gotchas.</p>"
};

C["type-boolean"] = {
  summary: "<p><strong><code>boolean</code></strong> is the primitive type for <code>true</code>/<code>false</code> " +
    "values. It's the type of comparisons, flags, and conditions. Note the distinction: lowercase " +
    "<code>boolean</code> is the type you should use; uppercase <code>Boolean</code> is the JavaScript " +
    "wrapper object and should be avoided in type positions. TypeScript will infer <code>boolean</code> " +
    "automatically for comparison results and <code>true</code>/<code>false</code> literals.</p>",
  examples: [
    {
      title: "Example 1: Declaring and inferring booleans",
      description: "<p>Explicit annotation vs inference from a comparison.</p>",
      code: "let isDone: boolean = false;       // explicit\n" +
        "const isAdult = age >= 18;         // inferred as boolean\n" +
        "\n" +
        "isDone = true;\n" +
        "isDone = \"yes\"; // ERROR: 'string' is not assignable to 'boolean'"
    },
    {
      title: "Example 2: Booleans in conditions and returns",
      description: "<p>Functions that answer yes/no questions return <code>boolean</code>.</p>",
      code: "function isEven(n: number): boolean {\n" +
        "  return n % 2 === 0;\n" +
        "}\n" +
        "if (isEven(4)) { /* ... */ }"
    }
  ],
  whenToUse: "<p>Use <code>boolean</code> for any true/false flag, condition, or predicate result &mdash; it's " +
    "everywhere. <strong>Gotchas:</strong> use the lowercase primitive <code>boolean</code>, never the " +
    "uppercase <code>Boolean</code> object type (it's broader and allows odd behavior). Beware JavaScript's " +
    "<em>truthiness</em>: values like <code>0</code>, <code>\"\"</code>, <code>null</code>, and " +
    "<code>undefined</code> are 'falsy' but are not the boolean <code>false</code> &mdash; so " +
    "<code>if (someString)</code> tests truthiness, not equality with a boolean. When a flag can also be " +
    "absent, model it explicitly (<code>boolean | undefined</code>) rather than relying on truthiness, which " +
    "conflates 'false' with 'missing'.</p>"
};

C["type-number"] = {
  summary: "<p><strong><code>number</code></strong> is the single numeric type in TypeScript/JavaScript &mdash; " +
    "it covers integers and floating-point alike (there's no separate <code>int</code>/<code>float</code>). " +
    "It also includes special values <code>NaN</code>, <code>Infinity</code>, and <code>-Infinity</code>, " +
    "and supports the usual numeric literals (decimal, hex <code>0xff</code>, binary <code>0b101</code>, " +
    "scientific <code>1e3</code>, and numeric separators <code>1_000_000</code>). For arbitrarily large " +
    "integers beyond <code>Number.MAX_SAFE_INTEGER</code>, JavaScript/TypeScript has a separate " +
    "<code>bigint</code> type.</p>",
  examples: [
    {
      title: "Example 1: Numeric literals and operations",
      description: "<p>One type covers all numbers; various literal forms are allowed.</p>",
      code: "let price: number = 19.99;\n" +
        "let hex: number = 0xff;          // 255\n" +
        "let big: number = 1_000_000;     // separators for readability\n" +
        "let total = price * 3;           // inferred: number"
    },
    {
      title: "Example 2: The floating-point gotcha",
      description: "<p>TypeScript doesn't fix JavaScript's float math &mdash; just types it.</p>",
      code: "const sum: number = 0.1 + 0.2;\n" +
        "console.log(sum);          // 0.30000000000000004  (not exactly 0.3!)\n" +
        "console.log(sum === 0.3);  // false\n" +
        "// For money, use integer cents or a decimal library, not raw floats."
    }
  ],
  whenToUse: "<p>Use <code>number</code> for all ordinary numeric values. <strong>Critical gotchas:</strong> " +
    "since it's IEEE-754 floating point, decimal arithmetic is imprecise (<code>0.1 + 0.2 !== 0.3</code>) " +
    "&mdash; never use raw <code>number</code> for money; store integer cents or use a decimal library. " +
    "Integer precision is only guaranteed up to <code>Number.MAX_SAFE_INTEGER</code> (~9 quadrillion); for " +
    "larger integers (big IDs, timestamps in nanoseconds) use <code>bigint</code>. Also, parsing user input " +
    "can yield <code>NaN</code> (which is, confusingly, of type <code>number</code> yet not equal to itself), " +
    "so validate parsed numbers. TypeScript types these values but doesn't change JavaScript's numeric " +
    "behavior &mdash; the math quirks are still yours to handle.</p>"
};

C["type-string"] = {
  summary: "<p><strong><code>string</code></strong> is the primitive type for text. TypeScript strings " +
    "support single quotes, double quotes, and <strong>template literals</strong> (backticks) with " +
    "<code>${...}</code> interpolation and multi-line text. Strings are immutable and come with the full " +
    "JavaScript string API (<code>.toUpperCase()</code>, <code>.slice()</code>, <code>.includes()</code>, " +
    "etc.). TypeScript also supports <strong>string literal types</strong> (a type that is one specific " +
    "string) and <strong>template literal types</strong> for advanced typing &mdash; covered later &mdash; " +
    "but the everyday <code>string</code> type is for any text value.</p>",
  examples: [
    {
      title: "Example 1: String forms and interpolation",
      description: "<p>Template literals make building strings clean and readable.</p>",
      code: "let first: string = \"Sam\";\n" +
        "let last = 'Lee';\n" +
        "let full = `${first} ${last}`;     // template literal interpolation\n" +
        "let multi = `line 1\n" +
        "line 2`;                            // multi-line"
    },
    {
      title: "Example 2: Using the string API safely",
      description: "<p>Methods are type-checked &mdash; calling them on a non-string is a compile error.</p>",
      code: "function slug(title: string): string {\n" +
        "  return title.trim().toLowerCase().replace(/\\s+/g, \"-\");\n" +
        "}\n" +
        "slug(\"  Hello World \"); // \"hello-world\"\n" +
        "slug(42); // ERROR: number is not assignable to string"
    }
  ],
  whenToUse: "<p>Use <code>string</code> for all text. Prefer template literals for interpolation and " +
    "multi-line strings over <code>+</code> concatenation. <strong>Gotchas:</strong> use the lowercase " +
    "primitive <code>string</code>, not the uppercase <code>String</code> object wrapper. When a value can " +
    "only be one of a few specific strings (e.g. a status), prefer a <strong>string literal union</strong> " +
    "(<code>\"active\" | \"closed\"</code>) over a plain <code>string</code> &mdash; it gives autocomplete " +
    "and rejects typos. And remember strings from external sources (forms, APIs) are untrusted at runtime " +
    "even though TypeScript types them as <code>string</code>; validate format/content (email, length) " +
    "yourself since the type only guarantees 'it's text', not 'it's valid'.</p>"
};

C["type-void"] = {
  summary: "<p><strong><code>void</code></strong> represents the absence of a return value &mdash; it's the " +
    "type of a function that doesn't return anything meaningful. A function with no <code>return</code> (or " +
    "<code>return;</code> with no value) is inferred as returning <code>void</code>. It's conceptually 'this " +
    "function is called for its side effects, not its result.' Although a <code>void</code> function actually " +
    "returns <code>undefined</code> at runtime, <code>void</code> as a type signals intent: callers " +
    "shouldn't use the return value.</p>",
  examples: [
    {
      title: "Example 1: A function that returns nothing",
      description: "<p><code>void</code> documents that there's no useful return value.</p>",
      code: "function logMessage(msg: string): void {\n" +
        "  console.log(msg);   // side effect only; no return\n" +
        "}\n" +
        "const result = logMessage(\"hi\"); // result: void (don't use it)"
    },
    {
      title: "Example 2: void in callback types",
      description: "<p>A <code>void</code> return type in a callback means 'return value is ignored'.</p>",
      code: "// The callback's return is ignored, so any return type is accepted\n" +
        "function forEach<T>(arr: T[], fn: (item: T) => void): void {\n" +
        "  for (const item of arr) fn(item);\n" +
        "}\n" +
        "// This is why [1,2,3].forEach(n => arr.push(n)) is allowed -\n" +
        "// push returns a number, but the void callback type ignores it."
    }
  ],
  whenToUse: "<p>Use <code>void</code> as the return type of functions that exist for side effects &mdash; " +
    "logging, event handlers, setters, <code>forEach</code> callbacks. <strong>Gotchas:</strong> don't " +
    "confuse <code>void</code> (a function returns nothing useful) with <code>undefined</code> (a specific " +
    "value); they're related but used differently &mdash; a variable typed <code>void</code> is almost never " +
    "what you want. A subtle but useful rule: a <code>void</code>-returning <em>callback type</em> permits " +
    "functions that actually return a value (the value is just discarded), which is why you can pass " +
    "value-returning functions where a <code>void</code> callback is expected. Avoid relying on the return " +
    "value of a <code>void</code> function &mdash; the type is telling you it's meaningless.</p>"
};

C["type-undefined"] = {
  summary: "<p><strong><code>undefined</code></strong> is both a value and a type representing 'a variable has " +
    "been declared but not assigned' or 'this property doesn't exist'. It's JavaScript's default for missing " +
    "things: uninitialized variables, absent object properties, and omitted function arguments are all " +
    "<code>undefined</code>. With <code>strictNullChecks</code> on, TypeScript treats <code>undefined</code> " +
    "as a distinct type you must handle explicitly &mdash; you can't access a property on a possibly-" +
    "<code>undefined</code> value without first checking. This is one of TypeScript's most valuable " +
    "safety features.</p>",
  examples: [
    {
      title: "Example 1: Optional values are possibly undefined",
      description: "<p>Optional properties/parameters include <code>undefined</code> in their type.</p>",
      code: "interface User { name: string; nickname?: string; } // nickname?: string | undefined\n" +
        "\n" +
        "function greet(u: User) {\n" +
        "  // u.nickname might be undefined - must handle it\n" +
        "  return `Hi ${u.nickname ?? u.name}`; // ?? falls back if undefined/null\n" +
        "}"
    },
    {
      title: "Example 2: strictNullChecks forces handling",
      description: "<p>The compiler stops you from using a value that could be undefined.</p>",
      code: "function firstChar(s: string | undefined): string {\n" +
        "  // return s[0];     // ERROR: 's' is possibly 'undefined'\n" +
        "  if (s === undefined) return \"\";\n" +
        "  return s[0];        // OK: narrowed to string here\n" +
        "}"
    }
  ],
  whenToUse: "<p>You'll deal with <code>undefined</code> constantly &mdash; it models optional/missing data. " +
    "<strong>Enable <code>strictNullChecks</code></strong> (part of <code>strict</code>) so the compiler " +
    "forces you to handle it; without it, <code>undefined</code> silently slips into every type and you lose " +
    "the protection (the dreaded 'cannot read property of undefined' returns at runtime). <strong>Gotchas:</strong> " +
    "use optional chaining (<code>?.</code>) and nullish coalescing (<code>??</code>) to handle it cleanly. " +
    "Note <code>??</code> only falls back on <code>null</code>/<code>undefined</code>, unlike <code>||</code> " +
    "which also falls back on <code>0</code> and <code>\"\"</code> &mdash; a common bug source. Distinguish " +
    "<code>undefined</code> ('was never set') from <code>null</code> ('intentionally empty') and be " +
    "consistent about which your code uses.</p>"
};

C["type-null"] = {
  summary: "<p><strong><code>null</code></strong> is a value and type representing the <em>intentional</em> " +
    "absence of a value &mdash; 'this is deliberately empty', as opposed to <code>undefined</code> which " +
    "usually means 'not set yet/missing'. Like <code>undefined</code>, with <code>strictNullChecks</code> on, " +
    "<code>null</code> is a distinct type that must be explicitly allowed (<code>string | null</code>) and " +
    "handled before use. Many APIs and databases return <code>null</code> for empty fields, so handling it " +
    "correctly is essential.</p>",
  examples: [
    {
      title: "Example 1: Explicitly nullable values",
      description: "<p>A value that may be null must include <code>null</code> in its type.</p>",
      code: "function findUser(id: number): User | null {\n" +
        "  return db.get(id) ?? null;  // null = 'not found'\n" +
        "}\n" +
        "\n" +
        "const u = findUser(1);\n" +
        "// u.name;        // ERROR: 'u' is possibly 'null'\n" +
        "if (u) console.log(u.name); // OK after the null check"
    },
    {
      title: "Example 2: null vs undefined intent",
      description: "<p>Use the two to mean different things, deliberately.</p>",
      code: "interface Profile {\n" +
        "  avatarUrl: string | null;   // null = user removed their avatar (set, but empty)\n" +
        "  bio?: string;               // undefined = bio was never provided\n" +
        "}\n" +
        "// Choosing one consistently makes intent clear across the codebase."
    }
  ],
  whenToUse: "<p>Use <code>null</code> for deliberate emptiness &mdash; an explicitly cleared field, a " +
    "'not found' result, a database <code>NULL</code>. <strong>Gotchas:</strong> with <code>strictNullChecks</code>, " +
    "always handle <code>null</code> before accessing members (optional chaining <code>?.</code> and " +
    "nullish coalescing <code>??</code> are your friends). A frequent debate is <code>null</code> vs " +
    "<code>undefined</code> &mdash; both exist in JS for historical reasons; pick a convention for your " +
    "codebase (many teams prefer <code>undefined</code> internally and only accept <code>null</code> at " +
    "boundaries where external systems use it). Watch the classic JS quirk: <code>typeof null === \"object\"</code> " +
    "(a long-standing bug), so don't use <code>typeof</code> to test for null &mdash; use <code>=== null</code> " +
    "or a truthiness check.</p>"
};

C["type-interface"] = {
  summary: "<p>In the context of TypeScript's basic types, an <strong>interface</strong> defines the shape of " +
    "an object &mdash; the names and types of its properties and methods &mdash; without providing an " +
    "implementation. It's a contract that object values must satisfy. Interfaces are a primary way to type " +
    "structured data and are <strong>open/extendable</strong> (you can add to them across declarations and " +
    "extend them). (The dedicated 'TypeScript Interfaces' section goes deeper; here it's introduced as one " +
    "of the core object types.)</p>",
  examples: [
    {
      title: "Example 1: Describing an object's shape",
      description: "<p>Any object assigned to this type must match the contract.</p>",
      code: "interface User {\n" +
        "  id: number;\n" +
        "  name: string;\n" +
        "  email?: string;          // optional property\n" +
        "  readonly createdAt: Date; // can't be reassigned after creation\n" +
        "}\n" +
        "\n" +
        "const u: User = { id: 1, name: \"Sam\", createdAt: new Date() };\n" +
        "// Missing 'name' or wrong types -> compile error."
    },
    {
      title: "Example 2: Interfaces can describe functions and be implemented",
      description: "<p>Interfaces type method shapes and can be implemented by classes.</p>",
      code: "interface Repository {\n" +
        "  find(id: number): User | null;\n" +
        "  save(user: User): void;\n" +
        "}\n" +
        "class SqlRepo implements Repository {\n" +
        "  find(id: number) { /* ... */ return null; }\n" +
        "  save(user: User) { /* ... */ }\n" +
        "}"
    }
  ],
  whenToUse: "<p>Use interfaces to model the shape of objects, the contracts your classes implement, and the " +
    "structure of data passed around &mdash; one of the most common things you do in TypeScript. They're " +
    "ideal for public API shapes because their declaration-merging/extensibility suits library authors. " +
    "<strong>Interface vs type alias:</strong> both can describe object shapes and are largely " +
    "interchangeable; interfaces are preferred for object/class contracts and when you want extendability, " +
    "while type aliases are needed for unions, tuples, and mapped/conditional types (see 'Types vs " +
    "Interfaces'). <strong>Gotcha:</strong> interfaces are purely compile-time &mdash; they don't exist at " +
    "runtime, so you can't use one to validate incoming JSON; that still needs runtime checks.</p>"
};

C["type-class"] = {
  summary: "<p>A <strong>class</strong> in TypeScript is a blueprint for creating objects that bundles data " +
    "(fields) and behavior (methods), with TypeScript adding type annotations, access modifiers " +
    "(<code>public</code>/<code>private</code>/<code>protected</code>), and other features on top of the " +
    "standard JavaScript class. Importantly, a class creates <em>both</em> a runtime value (the constructor " +
    "function you call with <code>new</code>) <em>and</em> a type (the instance shape). That dual nature " +
    "&mdash; existing at runtime, unlike interfaces &mdash; is a key distinction. (The dedicated 'Classes' " +
    "section covers the details.)</p>",
  examples: [
    {
      title: "Example 1: A typed class",
      description: "<p>Fields and methods are typed; the class is both a value and a type.</p>",
      code: "class Counter {\n" +
        "  private count: number = 0;      // typed, private field\n" +
        "  increment(): void { this.count++; }\n" +
        "  get value(): number { return this.count; }\n" +
        "}\n" +
        "\n" +
        "const c = new Counter();          // 'Counter' used as a VALUE (constructor)\n" +
        "let other: Counter;               // 'Counter' used as a TYPE (instance shape)"
    },
    {
      title: "Example 2: Class exists at runtime (unlike interface)",
      description: "<p>You can use a class with <code>instanceof</code> &mdash; impossible with interfaces.</p>",
      code: "class ApiError extends Error {}\n" +
        "try { /* ... */ }\n" +
        "catch (e) {\n" +
        "  if (e instanceof ApiError) { /* runtime check works - classes are real */ }\n" +
        "}\n" +
        "// 'instanceof SomeInterface' is impossible: interfaces vanish at compile time."
    }
  ],
  whenToUse: "<p>Use classes when you need objects with identity, encapsulated state, and behavior &mdash; " +
    "domain entities, services, error types, stateful components &mdash; and especially when you want runtime " +
    "<code>instanceof</code> checks or inheritance. <strong>Choose between class and interface/type:</strong> " +
    "if you just need to describe a data shape, an interface or type alias is lighter (no runtime cost); use " +
    "a class when you need instantiation, methods bundled with state, or runtime presence. <strong>Gotcha:</strong> " +
    "in modern TS/JS, many prefer plain functions and data objects over heavy class hierarchies (composition " +
    "over inheritance) &mdash; don't reach for classes reflexively. But for things that genuinely have a " +
    "lifecycle and behavior, classes are the natural fit.</p>"
};

C["type-enum"] = {
  summary: "<p>An <strong>enum</strong> defines a named set of related constants, giving meaningful names to " +
    "a group of values (e.g. directions, statuses, roles). TypeScript has numeric enums (auto-numbered from " +
    "0 by default) and string enums (each member has an explicit string value). Enums are one of the few " +
    "TypeScript features that <em>generate runtime code</em> (a real object exists in the output), which is " +
    "both useful (you can iterate/reverse-map) and a point of controversy &mdash; many teams prefer plain " +
    "union types or <code>as const</code> objects instead.</p>",
  examples: [
    {
      title: "Example 1: Numeric and string enums",
      description: "<p>Two flavors; string enums are usually clearer for debugging/serialization.</p>",
      code: "enum Direction { Up, Down, Left, Right } // numeric: 0,1,2,3\n" +
        "let move: Direction = Direction.Up;\n" +
        "\n" +
        "enum Status {                            // string enum (preferred)\n" +
        "  Active = \"ACTIVE\",\n" +
        "  Closed = \"CLOSED\",\n" +
        "}\n" +
        "let s: Status = Status.Active; // value is \"ACTIVE\" at runtime"
    },
    {
      title: "Example 2: The modern alternative (union / as const)",
      description: "<p>A union or const object often beats an enum &mdash; no runtime code, simpler types.</p>",
      code: "// Union of string literals - zero runtime cost, great autocomplete\n" +
        "type Status2 = \"active\" | \"closed\";\n" +
        "let s2: Status2 = \"active\";\n" +
        "\n" +
        "// Or an 'as const' object when you need the values as data\n" +
        "const Role = { Admin: \"admin\", User: \"user\" } as const;\n" +
        "type Role = typeof Role[keyof typeof Role]; // \"admin\" | \"user\""
    }
  ],
  whenToUse: "<p>Use enums for a fixed, named set of related constants where having a runtime object is useful " +
    "(iterating members, reverse mapping). <strong>However, be aware of the criticisms:</strong> numeric " +
    "enums are loosely typed (any number may be assignable in some cases) and their reverse-mapping bloats " +
    "output; enums also generate runtime code, which conflicts with type-only/erasable-syntax goals (and " +
    "Node's experimental TS support and <code>isolatedModules</code>/<code>const enum</code> have " +
    "restrictions). <strong>Many modern codebases prefer string-literal union types or <code>as const</code> " +
    "objects</strong> &mdash; they're simpler, have no runtime footprint, and give the same autocomplete and " +
    "safety. If you do use enums, prefer <em>string</em> enums over numeric ones for clarity. Reach for an " +
    "enum deliberately, not by habit.</p>"
};

C["type-array"] = {
  summary: "<p>An <strong>array</strong> type represents an ordered list of values that all share a type. " +
    "Write it as <code>T[]</code> (e.g. <code>number[]</code>) or equivalently <code>Array&lt;T&gt;</code>. " +
    "TypeScript checks that elements match the declared type and that array methods (<code>map</code>, " +
    "<code>filter</code>, <code>reduce</code>) are used correctly, inferring result types through the chain. " +
    "For arrays that shouldn't be mutated, there's <code>readonly T[]</code> (or " +
    "<code>ReadonlyArray&lt;T&gt;</code>). Arrays of mixed but positional types are <em>tuples</em> (a " +
    "separate topic).</p>",
  examples: [
    {
      title: "Example 1: Typed arrays and method inference",
      description: "<p>Element type flows through array operations automatically.</p>",
      code: "const nums: number[] = [1, 2, 3];\n" +
        "const names: Array<string> = [\"a\", \"b\"]; // alternate syntax\n" +
        "\n" +
        "const doubled = nums.map(n => n * 2);   // inferred: number[]\n" +
        "const big = nums.filter(n => n > 1);    // inferred: number[]\n" +
        "nums.push(\"x\"); // ERROR: 'string' not assignable to 'number'"
    },
    {
      title: "Example 2: Readonly arrays prevent mutation",
      description: "<p>Use <code>readonly</code> to forbid in-place changes.</p>",
      code: "function sum(values: readonly number[]): number {\n" +
        "  // values.push(0); // ERROR: push doesn't exist on readonly array\n" +
        "  return values.reduce((a, b) => a + b, 0);\n" +
        "}\n" +
        "// Signals the function won't mutate the caller's array."
    }
  ],
  whenToUse: "<p>Use array types for any collection of same-typed items &mdash; ubiquitous. Prefer " +
    "<code>readonly T[]</code> in function parameters when you don't intend to mutate, to document and " +
    "enforce that. <strong>Gotchas:</strong> with the default (non-strict-indexed) settings, indexing " +
    "(<code>arr[10]</code>) is typed as <code>T</code> even when the element is actually " +
    "<code>undefined</code> (out of bounds) &mdash; a real source of runtime crashes. Enable " +
    "<code>noUncheckedIndexedAccess</code> to make indexed access return <code>T | undefined</code> and " +
    "force a check. Also, an empty array literal infers as <code>any[]</code> (or <code>never[]</code>) " +
    "until elements are added, so annotate empty arrays you'll fill later. For fixed-length, " +
    "position-typed data, use a tuple instead.</p>"
};

C["type-tuple"] = {
  summary: "<p>A <strong>tuple</strong> is an array with a <em>fixed length</em> and a <em>specific type at " +
    "each position</em> &mdash; e.g. <code>[string, number]</code> is exactly a string followed by a number. " +
    "Tuples are useful for representing a small, ordered group of values of different types as a single value " +
    "(like a coordinate pair, a key-value pair, or React's <code>useState</code> return). TypeScript checks " +
    "the length and the type at each index. Tuples also support optional elements, rest elements, and named " +
    "labels for readability.</p>",
  examples: [
    {
      title: "Example 1: Position-typed fixed-length data",
      description: "<p>Each slot has its own type; length and order are enforced.</p>",
      code: "let point: [number, number] = [10, 20];\n" +
        "let entry: [string, number] = [\"age\", 30];\n" +
        "\n" +
        "point[0].toFixed(1);   // OK: position 0 is number\n" +
        "entry[0].toUpperCase(); // OK: position 0 is string\n" +
        "point = [1, 2, 3];     // ERROR: too many elements"
    },
    {
      title: "Example 2: The classic useState pattern + labels",
      description: "<p>Tuples shine when returning a pair the caller destructures.</p>",
      code: "// A labeled tuple documents each position\n" +
        "function useToggle(): [value: boolean, toggle: () => void] {\n" +
        "  let v = false;\n" +
        "  return [v, () => { v = !v; }];\n" +
        "}\n" +
        "const [isOpen, toggle] = useToggle(); // destructure the tuple"
    }
  ],
  whenToUse: "<p>Use a tuple for a small, fixed set of values with distinct types and meaningful order that " +
    "you'll often destructure &mdash; coordinate pairs, key/value entries, hook-style returns. " +
    "<strong>Gotcha and guidance:</strong> tuples are best kept short; once positions carry real meaning, an " +
    "<strong>object with named fields is usually clearer</strong> (<code>{ x: number; y: number }</code> " +
    "beats <code>[number, number]</code> when readers must remember what each slot means). Also note that, " +
    "by default, some array methods (like <code>push</code>) can still mutate a tuple and TypeScript may not " +
    "catch length violations through them &mdash; use <code>readonly</code> tuples to lock them down. " +
    "Labels improve readability but don't add runtime info. Reach for objects when clarity matters, tuples " +
    "when brevity and destructuring do.</p>"
};

C["type-object"] = {
  summary: "<p>The <strong><code>object</code></strong> type (lowercase) means 'any non-primitive value' " +
    "&mdash; anything that isn't <code>number</code>, <code>string</code>, <code>boolean</code>, " +
    "<code>symbol</code>, <code>null</code>, <code>undefined</code>, or <code>bigint</code>. It's quite " +
    "broad and rarely the best choice. More commonly you type objects by their <em>shape</em> using an " +
    "interface, a type alias, or an inline object type (<code>{ name: string; age: number }</code>). There's " +
    "also <code>Record&lt;K, V&gt;</code> and index signatures for dictionaries. Distinguish lowercase " +
    "<code>object</code> (the broad type), uppercase <code>Object</code> (the JS wrapper, avoid), and " +
    "<code>{}</code> (almost anything except null/undefined).</p>",
  examples: [
    {
      title: "Example 1: Prefer shapes over the bare object type",
      description: "<p>Describe the actual structure rather than using the vague <code>object</code>.</p>",
      code: "// Too vague: you can't access any properties safely\n" +
        "function bad(x: object) { /* x.name is an ERROR - shape unknown */ }\n" +
        "\n" +
        "// Precise: describe the shape\n" +
        "function good(user: { name: string; age: number }) {\n" +
        "  return `${user.name} is ${user.age}`;\n" +
        "}"
    },
    {
      title: "Example 2: Dictionaries with index signatures / Record",
      description: "<p>For objects used as maps with arbitrary keys.</p>",
      code: "// Index signature\n" +
        "const scores: { [name: string]: number } = { sam: 10, alex: 8 };\n" +
        "\n" +
        "// Equivalent with the Record utility type\n" +
        "const scores2: Record<string, number> = { sam: 10 };"
    }
  ],
  whenToUse: "<p>Rarely use the bare <code>object</code> type &mdash; it's too broad to do anything useful with " +
    "(you can't access properties). Instead, type objects by their concrete shape with interfaces/type " +
    "aliases, and use <code>Record&lt;K, V&gt;</code> or index signatures for dictionary/map-like objects. " +
    "<strong>Gotchas:</strong> beware the confusing trio &mdash; lowercase <code>object</code> (non-primitive), " +
    "uppercase <code>Object</code> (the wrapper interface, accepts almost everything, avoid in annotations), " +
    "and <code>{}</code> (means 'any value except null/undefined', also a trap because it accepts primitives). " +
    "Index signatures make all property access return the value type even for missing keys, so consider " +
    "<code>noUncheckedIndexedAccess</code> and explicit checks. When you know the keys, list them; reserve " +
    "open-ended index types for genuine dictionaries.</p>"
};

C["type-unknown"] = {
  summary: "<p><strong><code>unknown</code></strong> is the <em>type-safe</em> counterpart to <code>any</code>. " +
    "Like <code>any</code>, a value of type <code>unknown</code> can hold anything; <em>unlike</em> " +
    "<code>any</code>, you cannot use it (access properties, call it, do operations) until you've " +
    "<strong>narrowed</strong> it to a more specific type via a type guard. It forces you to prove what the " +
    "value is before trusting it, which makes it the correct type for genuinely-unknown data &mdash; API " +
    "responses, JSON, caught errors, user input. It's 'I don't know what this is yet, and the compiler will " +
    "make me check.'</p>",
  examples: [
    {
      title: "Example 1: unknown forces a check before use",
      description: "<p>You must narrow <code>unknown</code> before doing anything with it.</p>",
      code: "function process(value: unknown) {\n" +
        "  // value.toUpperCase();  // ERROR: object is of type 'unknown'\n" +
        "  if (typeof value === \"string\") {\n" +
        "    value.toUpperCase();   // OK: narrowed to string\n" +
        "  }\n" +
        "}"
    },
    {
      title: "Example 2: The right type for caught errors / JSON",
      description: "<p>Catch clauses and parsed JSON are best treated as <code>unknown</code>.</p>",
      code: "try { risky(); }\n" +
        "catch (err: unknown) {              // errors are unknown in modern TS\n" +
        "  if (err instanceof Error) console.log(err.message); // narrow first\n" +
        "}\n" +
        "\n" +
        "const data: unknown = JSON.parse(input); // don't trust shape - validate it"
    }
  ],
  whenToUse: "<p>Use <code>unknown</code> wherever data enters your program with no compile-time guarantee of " +
    "its type &mdash; <code>JSON.parse</code> results, <code>fetch</code> responses, deserialized messages, " +
    "caught exceptions, dynamic plugin inputs. It's the safe boundary type: it makes you validate/narrow " +
    "before use, exactly where bugs otherwise hide. <strong>Prefer <code>unknown</code> over <code>any</code></strong> " +
    "by default for untyped values &mdash; <code>any</code> silently disables all checking and lets bugs " +
    "through, while <code>unknown</code> keeps the safety net. <strong>Gotcha:</strong> narrowing " +
    "<code>unknown</code> from external data often needs real runtime validation, not just " +
    "<code>typeof</code>/<code>instanceof</code>, for complex shapes &mdash; pair it with a validation " +
    "library (Zod, Valibot) or hand-written type guards (type predicates) to safely turn " +
    "<code>unknown</code> into your real types.</p>"
};

C["type-any"] = {
  summary: "<p><strong><code>any</code></strong> is the escape hatch that turns <em>off</em> type checking for " +
    "a value. A value typed <code>any</code> can be assigned anything, accessed in any way, and assigned to " +
    "anything else &mdash; the compiler stops checking it entirely. This makes it powerful but dangerous: it " +
    "silently disables the very safety TypeScript provides, and it's 'contagious' (it spreads through " +
    "expressions). It exists for gradual migration from JS and for genuinely dynamic edge cases, but " +
    "overusing it defeats the purpose of TypeScript. The safer alternative for unknown data is " +
    "<code>unknown</code>.</p>",
  examples: [
    {
      title: "Example 1: any disables all checking",
      description: "<p>Everything is allowed on an <code>any</code> &mdash; including real bugs.</p>",
      code: "let value: any = \"hello\";\n" +
        "value.foo.bar.baz();   // NO error - compiler checks nothing\n" +
        "value = 42;\n" +
        "value();               // NO error - until it crashes at runtime\n" +
        "// The safety net is gone wherever 'any' appears."
    },
    {
      title: "Example 2: any spreads (it's contagious)",
      description: "<p>Touching an <code>any</code> can make downstream values <code>any</code> too.</p>",
      code: "const data: any = JSON.parse(input);\n" +
        "const name = data.user.name;  // 'name' is now 'any' - safety lost downstream\n" +
        "\n" +
        "// Better: type as unknown, then narrow/validate\n" +
        "const safe: unknown = JSON.parse(input);"
    }
  ],
  whenToUse: "<p>Avoid <code>any</code> whenever possible. Legitimate uses are narrow: <em>gradual migration</em> " +
    "of a JS codebase (temporarily, with a plan to remove it), and a few genuinely dynamic situations where " +
    "no other type fits. <strong>For untyped/external data, reach for <code>unknown</code> instead</strong> " +
    "&mdash; it gives the same flexibility without silently disabling checks. <strong>Gotchas:</strong> " +
    "<code>any</code> is contagious and hides bugs that surface only at runtime; an accidental " +
    "<code>any</code> (from <code>noImplicitAny</code> being off, or untyped libraries) quietly erodes " +
    "safety across your codebase. Turn on <code>noImplicitAny</code> and consider lint rules " +
    "(<code>no-explicit-any</code>) to flag it. When you must use it, isolate it to one spot and convert to a " +
    "real type as soon as possible.</p>"
};

C["type-never"] = {
  summary: "<p><strong><code>never</code></strong> is the <em>bottom type</em> &mdash; it represents a value " +
    "that can <strong>never occur</strong>. It's the return type of functions that never return normally " +
    "(they always throw or loop forever), and the type of a variable in a branch the compiler has proven is " +
    "unreachable. <code>never</code> is assignable to every type, but nothing (except <code>never</code>) is " +
    "assignable to it. Its most practical use is <strong>exhaustiveness checking</strong>: ensuring you've " +
    "handled every case of a union, so the compiler errors if a new case is added and forgotten.</p>",
  examples: [
    {
      title: "Example 1: Functions that never return",
      description: "<p>A function that always throws (or loops forever) returns <code>never</code>.</p>",
      code: "function fail(msg: string): never {\n" +
        "  throw new Error(msg);   // never returns normally\n" +
        "}\n" +
        "function loopForever(): never {\n" +
        "  while (true) { /* ... */ }\n" +
        "}"
    },
    {
      title: "Example 2: Exhaustiveness checking (the killer use)",
      description: "<p>The compiler forces you to handle every union case.</p>",
      code: "type Shape = Circle | Square;\n" +
        "function area(s: Shape): number {\n" +
        "  switch (s.kind) {\n" +
        "    case \"circle\": return Math.PI * s.r ** 2;\n" +
        "    case \"square\": return s.side ** 2;\n" +
        "    default:\n" +
        "      const _exhaustive: never = s; // ERROR here if a new Shape is added\n" +
        "      return _exhaustive;\n" +
        "  }\n" +
        "}"
    }
  ],
  whenToUse: "<p>The everyday use of <code>never</code> is <strong>exhaustiveness checking</strong> over " +
    "discriminated unions: assign the value to a <code>never</code> in the <code>default</code> branch so " +
    "that if someone later adds a new variant and forgets to handle it, the build fails &mdash; turning a " +
    "potential runtime bug into a compile error. It's also the natural return type for throw-only helpers " +
    "(<code>assertNever</code>, <code>fail</code>). <strong>Gotchas:</strong> seeing <code>never</code> " +
    "<em>unexpectedly</em> usually signals a problem &mdash; e.g. an over-narrowed type, an empty array " +
    "inferred as <code>never[]</code>, or an impossible intersection &mdash; so an unintended " +
    "<code>never</code> is a clue to investigate. You rarely write <code>never</code> annotations directly " +
    "except in these assertion/exhaustiveness patterns.</p>"
};

C["as-const"] = {
  summary: "<p><strong><code>as const</code></strong> is a 'const assertion' that tells TypeScript to infer " +
    "the <em>most specific, immutable</em> type for a value rather than a general one. Without it, " +
    "<code>let x = \"active\"</code> is inferred as <code>string</code>; with <code>as const</code> it's the " +
    "literal type <code>\"active\"</code>. Applied to objects and arrays, it makes all properties " +
    "<code>readonly</code> and infers literal types throughout (and arrays become <code>readonly</code> " +
    "tuples). It's the idiomatic way to create typed constant data, configuration, and to build union types " +
    "from values.</p>",
  examples: [
    {
      title: "Example 1: Literal types instead of widened ones",
      description: "<p><code>as const</code> narrows inference to exact values.</p>",
      code: "let a = \"GET\";            // inferred: string\n" +
        "let b = \"GET\" as const;   // inferred: \"GET\" (literal)\n" +
        "\n" +
        "const config = {\n" +
        "  method: \"POST\",\n" +
        "  retries: 3,\n" +
        "} as const;\n" +
        "// config.method is \"POST\" (not string), and everything is readonly"
    },
    {
      title: "Example 2: Deriving a union from a const array",
      description: "<p>Build a string-union type from a single source of truth.</p>",
      code: "const ROLES = [\"admin\", \"editor\", \"viewer\"] as const;\n" +
        "type Role = typeof ROLES[number]; // \"admin\" | \"editor\" | \"viewer\"\n" +
        "// Add a role to the array -> the type updates automatically."
    }
  ],
  whenToUse: "<p>Use <code>as const</code> for constant data you want typed precisely and immutably: " +
    "configuration objects, lookup tables, and especially to derive union types from arrays/objects (a clean, " +
    "DRY alternative to enums). It's a go-to tool for keeping a single source of truth for both values and " +
    "types. <strong>Gotchas:</strong> it makes things deeply <code>readonly</code>, so you can't mutate the " +
    "result afterward (usually what you want for constants, occasionally surprising). It's a compile-time " +
    "assertion only &mdash; no runtime effect. And because the inferred types become very specific, passing " +
    "an <code>as const</code> value where a mutable/wider type is expected can cause assignability errors " +
    "(e.g. a <code>readonly</code> array where a mutable array is required) &mdash; you may need to spread or " +
    "loosen the type at the boundary.</p>"
};

C["as-type"] = {
  summary: "<p><strong><code>as [type]</code></strong> is a <strong>type assertion</strong> &mdash; you tell " +
    "the compiler 'treat this value as this type', overriding its inference. It does <em>not</em> convert or " +
    "check anything at runtime; it's purely a compile-time instruction that says 'trust me, I know the type " +
    "better than you do.' It's useful when you genuinely have more information than the compiler (e.g. you " +
    "know a DOM element is an <code>HTMLInputElement</code>), but it's also a way to lie to the type system, " +
    "so it should be used sparingly &mdash; an incorrect assertion reintroduces exactly the runtime errors " +
    "TypeScript exists to prevent.</p>",
  examples: [
    {
      title: "Example 1: Asserting a more specific type",
      description: "<p>When you know more than the compiler about a value's real type.</p>",
      code: "// document.getElementById returns HTMLElement | null\n" +
        "const input = document.getElementById(\"email\") as HTMLInputElement;\n" +
        "input.value = \"hi\"; // .value exists on HTMLInputElement specifically\n" +
        "\n" +
        "// Asserting the shape of parsed data (risky - not validated!)\n" +
        "const user = JSON.parse(raw) as { id: number; name: string };"
    },
    {
      title: "Example 2: Assertions don't check at runtime",
      description: "<p>A wrong assertion compiles fine but crashes later.</p>",
      code: "const value: unknown = \"not a number\";\n" +
        "const n = value as number;   // compiles - but it's actually a string!\n" +
        "n.toFixed(2);                // runtime crash: toFixed is not a function\n" +
        "// The 'as' silenced the compiler without making it true."
    }
  ],
  whenToUse: "<p>Use <code>as</code> assertions only when you legitimately know a value's type better than the " +
    "compiler can infer &mdash; narrowing DOM element types, working around limitations, or asserting the " +
    "shape of data you've <em>already validated</em>. <strong>Gotchas:</strong> assertions are unchecked, so " +
    "an incorrect one silently breaks safety and causes runtime errors &mdash; never use <code>as</code> as a " +
    "shortcut to silence an error you don't understand. Prefer real <strong>narrowing</strong> (type guards, " +
    "<code>typeof</code>, <code>instanceof</code>) over assertions wherever possible, since narrowing is " +
    "verified by the compiler while <code>as</code> is not. The double assertion <code>x as unknown as T</code> " +
    "(forcing through <code>unknown</code>) is an even bigger red flag &mdash; it bypasses TypeScript's own " +
    "guardrails and should be extremely rare. Assert as a last resort, and validate untrusted data instead of " +
    "asserting its shape.</p>"
};

C["as-any"] = {
  summary: "<p><strong><code>as any</code></strong> is a type assertion to <code>any</code> &mdash; it casts a " +
    "value to <code>any</code>, completely disabling type checking on it from that point. It's the bluntest " +
    "escape hatch in TypeScript, combining the dangers of both <code>any</code> and assertions: it tells the " +
    "compiler 'stop checking this entirely.' It's occasionally necessary to work around incorrect type " +
    "definitions or to bridge stubborn type mismatches during migration, but it's a code smell &mdash; every " +
    "<code>as any</code> is a hole in your type safety where runtime bugs can slip through unnoticed.</p>",
  examples: [
    {
      title: "Example 1: Forcing past a type error",
      description: "<p><code>as any</code> silences the compiler &mdash; and the safety with it.</p>",
      code: "// Sometimes used to work around a wrong/missing library type:\n" +
        "(thirdPartyThing as any).undocumentedMethod();\n" +
        "\n" +
        "// But it disables checking - typos and misuse won't be caught:\n" +
        "const x = (value as any).whatever.nonsense; // no error, may crash"
    },
    {
      title: "Example 2: A safer narrowing alternative",
      description: "<p>Prefer narrowing or a precise assertion over <code>as any</code>.</p>",
      code: "// Instead of: const len = (data as any).length;\n" +
        "// Validate / narrow:\n" +
        "if (typeof data === \"string\" || Array.isArray(data)) {\n" +
        "  const len = data.length; // safe, checked\n" +
        "}"
    }
  ],
  whenToUse: "<p>Use <code>as any</code> only as a genuine last resort &mdash; bridging an incorrect " +
    "third-party type definition, an interim step in migration, or a rare case the type system can't express. " +
    "Treat each one as technical debt. <strong>Gotchas:</strong> it's strictly worse than most alternatives: " +
    "prefer fixing or augmenting the bad type, casting to a <em>specific</em> type with <code>as T</code>, or " +
    "narrowing with a real check. If you must use it, isolate it behind a small, well-named wrapper function " +
    "so the unsafe spot is contained and documented rather than sprinkled through your code. Enable lint rules " +
    "to surface <code>as any</code> usage in review. The goal is zero (or near-zero) <code>as any</code> in a " +
    "healthy codebase &mdash; each one is a place TypeScript can no longer protect you.</p>"
};

C["non-null-assertion"] = {
  summary: "<p>The <strong>non-null assertion operator</strong> (a postfix <code>!</code>) tells the compiler " +
    "that a value you've typed as possibly <code>null</code> or <code>undefined</code> is <em>actually</em> " +
    "present at that point &mdash; <code>value!</code> means 'I promise this isn't null/undefined here.' Like " +
    "other assertions, it's compile-time only and unchecked: it removes <code>null</code>/<code>undefined</code> " +
    "from the type without verifying anything at runtime. It's a concise way to override the compiler when " +
    "you know more than it does, but if you're wrong, you get the exact 'cannot read property of " +
    "undefined/null' crash TypeScript was trying to prevent.</p>",
  examples: [
    {
      title: "Example 1: Asserting a value is present",
      description: "<p><code>!</code> strips null/undefined from the type.</p>",
      code: "const el = document.getElementById(\"app\"); // HTMLElement | null\n" +
        "el!.classList.add(\"ready\");                // ! says 'it's not null'\n" +
        "\n" +
        "// Equivalent safer alternative (checked at runtime):\n" +
        "if (el) el.classList.add(\"ready\");"
    },
    {
      title: "Example 2: When the assertion is wrong",
      description: "<p>An incorrect <code>!</code> compiles but crashes.</p>",
      code: "function getName(user?: { name: string }) {\n" +
        "  return user!.name; // compiles even if user is undefined...\n" +
        "}\n" +
        "getName();           // runtime crash: cannot read 'name' of undefined"
    }
  ],
  whenToUse: "<p>Use the non-null assertion sparingly, only when you're certain a value is present but the " +
    "compiler can't prove it &mdash; e.g. a DOM element you know exists, or a value initialized in a " +
    "lifecycle the compiler doesn't track. <strong>Strongly prefer an actual check</strong> (an " +
    "<code>if</code> guard, optional chaining <code>?.</code>, or a default with <code>??</code>) because " +
    "those are verified and handle the null case gracefully, whereas <code>!</code> just suppresses the " +
    "warning and crashes if you're wrong. <strong>Gotchas:</strong> overusing <code>!</code> is a sign you're " +
    "fighting the type system &mdash; it often indicates a value should be typed as non-nullable upstream, or " +
    "that you should restructure so the compiler can see the value is present. Many teams lint against it. " +
    "Reach for narrowing first; assert only when there's truly no cleaner option.</p>"
};

C["satisfies-keyword"] = {
  summary: "<p>The <strong><code>satisfies</code></strong> operator (TypeScript 4.9+) checks that a value " +
    "conforms to a type <em>without widening or changing the value's own inferred type</em>. With a normal " +
    "annotation (<code>const x: T = ...</code>), the variable takes type <code>T</code>, losing the specific " +
    "literal details. With <code>satisfies T</code>, the compiler verifies the value is assignable to " +
    "<code>T</code> but keeps the precise inferred type. This gives you the best of both worlds: validation " +
    "against a contract <em>and</em> retention of narrow, literal types for better autocomplete and " +
    "type-safety downstream.</p>",
  examples: [
    {
      title: "Example 1: Validation without losing specificity",
      description: "<p><code>satisfies</code> checks the shape but keeps exact value types.</p>",
      code: "type Config = Record<string, string | number>;\n" +
        "\n" +
        "// With annotation: types widen, you lose the specifics\n" +
        "const a: Config = { host: \"localhost\", port: 8080 };\n" +
        "// a.port is 'string | number' - widened\n" +
        "\n" +
        "// With satisfies: validated AND precise\n" +
        "const b = { host: \"localhost\", port: 8080 } satisfies Config;\n" +
        "b.port.toFixed(0); // OK! b.port is known to be number"
    },
    {
      title: "Example 2: Catching mistakes while keeping literals",
      description: "<p>It still errors on invalid values, but preserves keys/literals.</p>",
      code: "const palette = {\n" +
        "  primary: \"#ff0000\",\n" +
        "  secondary: \"#00ff00\",\n" +
        "} satisfies Record<string, string>;\n" +
        "\n" +
        "palette.primary;  // autocompletes; known key\n" +
        "// palette.tertiary -> ERROR (not a known key) - specificity retained\n" +
        "// A non-string value would also be rejected by 'satisfies'."
    }
  ],
  whenToUse: "<p>Use <code>satisfies</code> when you want to <em>validate</em> a value against a type while " +
    "keeping its precise inferred type &mdash; configuration objects, constant maps, palettes, route tables, " +
    "anything where you want both 'this matches the expected shape' and 'preserve the exact keys/literals for " +
    "autocomplete'. It's superior to a plain annotation in these cases because the annotation widens and " +
    "discards specificity. <strong>Gotchas:</strong> it requires TypeScript 4.9+, so older toolchains won't " +
    "support it. Understand the distinction from <code>as</code>: <code>satisfies</code> <em>checks</em> the " +
    "value (errors if it doesn't conform) and keeps its type, whereas <code>as</code> <em>forces</em> a type " +
    "without checking &mdash; <code>satisfies</code> is the safe one. Reach for it as the modern best practice " +
    "for typing constant data structures.</p>"
};

/* ======================================================================
   SECTION 3 — TYPE INFERENCE (overview only)
   ====================================================================== */

C["type-inference"] = {
  summary: "<p><strong>Type inference</strong> is TypeScript's ability to automatically determine types " +
    "without you writing explicit annotations. When you initialize a variable, return a value, or call a " +
    "generic function, the compiler figures out the type from context. <code>let x = 5</code> is inferred as " +
    "<code>number</code>; <code>[1,2,3].map(n =&gt; n*2)</code> is inferred as <code>number[]</code>. " +
    "Inference is what makes TypeScript feel lightweight rather than verbose &mdash; you get full type safety " +
    "while annotating only where it adds value (mainly function signatures and public APIs). Understanding " +
    "how inference works (and where it 'widens' types) helps you write cleaner, safer code.</p>",
  examples: [
    {
      title: "Example 1: Inference removes redundant annotations",
      description: "<p>The compiler already knows the types &mdash; annotating them is noise.</p>",
      code: "// Redundant: TS already infers these\n" +
        "const count: number = 5;\n" +
        "\n" +
        "// Idiomatic: let inference do the work\n" +
        "const count2 = 5;                 // number\n" +
        "const names = [\"a\", \"b\"];        // string[]\n" +
        "const user = { id: 1, name: \"Sam\" }; // { id: number; name: string }\n" +
        "const doubled = names.map(n => n.length); // number[]"
    },
    {
      title: "Example 2: Widening, and where to annotate",
      description: "<p><code>let</code> widens literals; annotate signatures, not obvious locals.</p>",
      code: "let status = \"active\";   // widened to string (let can be reassigned)\n" +
        "const s = \"active\";      // narrowed to literal \"active\" (const can't change)\n" +
        "\n" +
        "// DO annotate function signatures (inputs/outputs are a contract):\n" +
        "function total(items: number[]): number {\n" +
        "  return items.reduce((a, b) => a + b, 0); // return inferred, but annotated for clarity\n" +
        "}"
    }
  ],
  whenToUse: "<p>Lean on inference everywhere it works &mdash; for local variables, array/object literals, and " +
    "the results of well-typed function calls &mdash; and reserve explicit annotations for <strong>function " +
    "parameters and return types</strong> (which form your API contract and aren't always inferable) and " +
    "places where you want to <em>constrain</em> rather than discover a type. <strong>Gotchas:</strong> " +
    "inference 'widens' &mdash; <code>let x = \"a\"</code> becomes <code>string</code>, not <code>\"a\"</code> " +
    "(use <code>const</code> or <code>as const</code> to keep literals). Empty arrays/objects infer broadly " +
    "(<code>any[]</code>/<code>{}</code>) until populated, so annotate those. And while inferred return types " +
    "are convenient, explicitly annotating public function return types catches accidental changes and speeds " +
    "up the compiler. Over-annotating obvious locals is just clutter; under-annotating APIs hides contracts &mdash; " +
    "aim for the balance.</p>"
};

/* ======================================================================
   SECTION 4 — TYPE COMPATIBILITY (overview only)
   ====================================================================== */

C["type-compatibility"] = {
  summary: "<p><strong>Type compatibility</strong> in TypeScript is based on <strong>structural typing</strong> " +
    "(aka 'duck typing'): two types are compatible if their <em>shapes</em> match, regardless of their names " +
    "or declared relationships. If an object has all the properties a type requires (with compatible types), " +
    "it's assignable to that type &mdash; you don't need to explicitly declare that it <code>implements</code> " +
    "anything. This differs from <em>nominal</em> typing (used by Java/C#) where compatibility depends on " +
    "explicit declarations. Structural typing makes TypeScript flexible and ergonomic, but has implications " +
    "you should understand &mdash; like 'excess property checks' and when extra properties are or aren't " +
    "allowed.</p>",
  examples: [
    {
      title: "Example 1: Shape matters, not name",
      description: "<p>An object is compatible if it has the required structure.</p>",
      code: "interface Point { x: number; y: number; }\n" +
        "\n" +
        "// No 'implements Point' needed - the shape matches structurally\n" +
        "const p = { x: 1, y: 2, z: 3 };\n" +
        "const point: Point = p;   // OK: has x and y (extra z is fine via a variable)\n" +
        "\n" +
        "function dist(pt: Point) { /* ... */ }\n" +
        "dist(p);                  // OK - structurally a Point"
    },
    {
      title: "Example 2: Excess property checks on literals",
      description: "<p>Object literals get a stricter check than variables.</p>",
      code: "// ERROR: object literals can't have unknown extra props\n" +
        "const bad: Point = { x: 1, y: 2, z: 3 };\n" +
        "//   'z' does not exist in type 'Point'\n" +
        "\n" +
        "// But assigning via a variable bypasses the literal check (see Example 1).\n" +
        "// This catches typos like { x: 1, y: 2, colour: \"red\" } on direct literals."
    }
  ],
  whenToUse: "<p>You don't 'use' type compatibility directly &mdash; understanding it explains a lot of " +
    "TypeScript's behavior. Structural typing is why you can pass any conforming object without ceremony, why " +
    "duck-typed code 'just works', and why you can define minimal parameter types (ask only for the " +
    "properties you use). <strong>Gotchas to know:</strong> <em>excess property checks</em> reject unknown " +
    "properties on object <em>literals</em> assigned directly (catching typos) but not when assigned through " +
    "a variable &mdash; surprising the first time you hit it. Function parameter compatibility has subtle " +
    "rules (bivariance/contravariance) that occasionally bite. And because compatibility is purely " +
    "structural, two unrelated types with the same shape are interchangeable &mdash; if you need to prevent " +
    "that (e.g. distinguish a <code>UserId</code> from a plain <code>string</code>), use a 'branded type' " +
    "pattern, since TypeScript won't do nominal distinction for you.</p>"
};

/* ======================================================================
   SECTION 5 — COMBINING TYPES
   ====================================================================== */

C["combining-types"] = {
  summary: "<p><strong>Combining types</strong> means building new types out of existing ones. The core tools " +
    "are <strong>union types</strong> (<code>A | B</code> &mdash; a value is one of several types), " +
    "<strong>intersection types</strong> (<code>A &amp; B</code> &mdash; a value has all members of several " +
    "types at once), <strong>type aliases</strong> (naming a type for reuse), and the <strong><code>keyof</code> " +
    "operator</strong> (getting the union of an object type's keys). Together these let you compose precise, " +
    "expressive types from simple pieces, which is much of the power of TypeScript's type system. They're the " +
    "foundation for discriminated unions, mixins, and generic utilities.</p>",
  examples: [
    {
      title: "Example 1: Union and intersection",
      description: "<p>Union = 'one of'; intersection = 'all of, combined'.</p>",
      code: "type Id = number | string;          // union: either type\n" +
        "let userId: Id = 1; userId = \"abc\";   // both allowed\n" +
        "\n" +
        "type Named = { name: string };\n" +
        "type Aged = { age: number };\n" +
        "type Person = Named & Aged;          // intersection: must have BOTH\n" +
        "const p: Person = { name: \"Sam\", age: 30 };"
    },
    {
      title: "Example 2: Type aliases and keyof",
      description: "<p>Name a composed type and derive its keys.</p>",
      code: "type Point = { x: number; y: number };\n" +
        "type Axis = keyof Point;   // \"x\" | \"y\"\n" +
        "\n" +
        "function get(p: Point, axis: Axis) { return p[axis]; }\n" +
        "get({ x: 1, y: 2 }, \"x\"); // only \"x\" or \"y\" accepted"
    }
  ],
  whenToUse: "<p>You'll combine types constantly: unions to model a value that can be one of several things " +
    "(a status, a result that's success-or-error, an id that's number-or-string), intersections to merge " +
    "object shapes (mixins, adding properties), aliases to name and reuse complex types, and <code>keyof</code> " +
    "to write key-safe generic helpers. <strong>Gotchas:</strong> with unions, you can only access members " +
    "common to <em>all</em> members until you <strong>narrow</strong> (see Type Guards) &mdash; that's by " +
    "design and prevents unsafe access. Intersections of incompatible primitives produce <code>never</code> " +
    "(e.g. <code>string &amp; number</code> is impossible). Prefer <strong>discriminated unions</strong> (a " +
    "shared literal 'tag' field) for modeling alternatives &mdash; they narrow cleanly and enable " +
    "exhaustiveness checking. Each sub-topic here is detailed next.</p>"
};

C["union-types"] = {
  summary: "<p>A <strong>union type</strong> (<code>A | B | C</code>) describes a value that can be <em>one " +
    "of</em> several types. It's how you model 'this is either X or Y' &mdash; an id that's a number or " +
    "string, a function result that's a value or <code>null</code>, a status that's one of a few literals. " +
    "Until you <strong>narrow</strong> a union (check which member you actually have), you can only access " +
    "properties/methods common to <em>all</em> members. The most powerful pattern is the " +
    "<strong>discriminated (tagged) union</strong>: each member shares a literal 'kind' field, letting the " +
    "compiler narrow precisely in a <code>switch</code>.</p>",
  examples: [
    {
      title: "Example 1: A basic union and narrowing it",
      description: "<p>You must narrow before using member-specific behavior.</p>",
      code: "function format(id: number | string): string {\n" +
        "  if (typeof id === \"number\") return id.toFixed(0); // narrowed to number\n" +
        "  return id.toUpperCase();                            // narrowed to string\n" +
        "}"
    },
    {
      title: "Example 2: A discriminated union (the key pattern)",
      description: "<p>A shared literal tag lets the compiler narrow each case precisely.</p>",
      code: "type Result =\n" +
        "  | { status: \"success\"; data: string }\n" +
        "  | { status: \"error\"; message: string };\n" +
        "\n" +
        "function handle(r: Result) {\n" +
        "  switch (r.status) {\n" +
        "    case \"success\": return r.data;    // r is the success variant here\n" +
        "    case \"error\":   return r.message; // r is the error variant here\n" +
        "  }\n" +
        "}"
    }
  ],
  whenToUse: "<p>Use unions to model any value with a finite set of alternatives: nullable results " +
    "(<code>T | null</code>), multi-type ids, finite string statuses (<code>\"on\" | \"off\"</code>), or " +
    "states of a process. <strong>Discriminated unions are the gold standard</strong> for modeling 'one of " +
    "several shapes' (API results, Redux actions, state machines) &mdash; the shared tag enables clean " +
    "narrowing and, with a <code>never</code> default, compile-time exhaustiveness checks. <strong>Gotchas:</strong> " +
    "you can't access non-shared members before narrowing (a feature, not a bug). Large unions can produce " +
    "confusing error messages. Prefer literal unions over loose types (<code>\"sm\" | \"md\" | \"lg\"</code> " +
    "over <code>string</code>) for autocomplete and typo safety. And design unions to be discriminable &mdash; " +
    "without a distinguishing field, narrowing gets awkward.</p>"
};

C["intersection-types"] = {
  summary: "<p>An <strong>intersection type</strong> (<code>A &amp; B</code>) describes a value that has " +
    "<em>all</em> the members of every combined type simultaneously &mdash; it merges shapes together. If " +
    "<code>A</code> has <code>name</code> and <code>B</code> has <code>age</code>, then <code>A &amp; B</code> " +
    "has both. It's the logical 'and' of types (versus union's 'or'). Intersections are used to compose " +
    "objects from multiple smaller types (mixin-style), to add properties to an existing type, and to combine " +
    "constraints in generics. For object types it's like merging; for incompatible primitives it produces " +
    "<code>never</code>.</p>",
  examples: [
    {
      title: "Example 1: Merging object shapes",
      description: "<p>The result must satisfy all combined types.</p>",
      code: "type HasId = { id: number };\n" +
        "type Timestamped = { createdAt: Date; updatedAt: Date };\n" +
        "\n" +
        "type Entity = HasId & Timestamped;  // has id, createdAt, AND updatedAt\n" +
        "const e: Entity = { id: 1, createdAt: new Date(), updatedAt: new Date() };"
    },
    {
      title: "Example 2: Extending a type inline / adding props",
      description: "<p>Combine a base type with extra fields without declaring a new interface.</p>",
      code: "type Props = { title: string };\n" +
        "type WithChildren = Props & { children: React.ReactNode };\n" +
        "\n" +
        "// Incompatible primitives collapse to 'never':\n" +
        "type Impossible = string & number; // never (no value is both)"
    }
  ],
  whenToUse: "<p>Use intersections to compose object types from reusable pieces &mdash; mixing capabilities " +
    "(<code>Serializable &amp; Comparable</code>), adding common fields (id + timestamps) to many entities, " +
    "or extending props in component libraries. They're great for building up types modularly. " +
    "<strong>Gotchas:</strong> intersecting object types with <em>conflicting</em> property types yields a " +
    "property of type <code>never</code> (e.g. one type says <code>id: string</code>, another <code>id: " +
    "number</code> &rarr; <code>id: never</code>), which then can't be satisfied &mdash; a confusing error if " +
    "unintended. Intersecting incompatible primitives gives <code>never</code> outright. For object shapes, " +
    "<code>interface extends</code> is often clearer than <code>&amp;</code> and gives better error messages, " +
    "so prefer extension for simple inheritance and reserve intersections for combining/computed types. Don't " +
    "confuse <code>&amp;</code> (combine into one) with <code>|</code> (either-or) &mdash; they're opposites.</p>"
};

C["type-aliases"] = {
  summary: "<p>A <strong>type alias</strong> (<code>type Name = ...</code>) gives a name to any type &mdash; " +
    "a primitive, union, intersection, object shape, tuple, function signature, or a generic/computed type. " +
    "It doesn't create a new type, just a reusable label, improving readability and avoiding repetition. " +
    "Unlike interfaces (which are limited to object/class shapes), type aliases can name <em>anything</em>, " +
    "including unions, tuples, mapped types, and conditional types &mdash; which is why they're essential for " +
    "advanced typing. The everyday use is naming a complex type once and referring to it everywhere.</p>",
  examples: [
    {
      title: "Example 1: Naming various kinds of types",
      description: "<p>Aliases work for unions, objects, functions, and tuples alike.</p>",
      code: "type ID = number | string;                 // union\n" +
        "type Point = { x: number; y: number };     // object shape\n" +
        "type Handler = (event: string) => void;    // function type\n" +
        "type Pair = [string, number];              // tuple\n" +
        "\n" +
        "function move(p: Point): void { /* ... */ }"
    },
    {
      title: "Example 2: Generic type aliases",
      description: "<p>Aliases can be parameterized like generic types.</p>",
      code: "type ApiResult<T> =\n" +
        "  | { ok: true; data: T }\n" +
        "  | { ok: false; error: string };\n" +
        "\n" +
        "const r: ApiResult<number> = { ok: true, data: 42 };"
    }
  ],
  whenToUse: "<p>Use type aliases whenever a type is non-trivial, repeated, or benefits from a meaningful name " +
    "&mdash; unions, function signatures, tuples, generic results, and any computed/advanced type (which " +
    "interfaces can't express). For naming plain <em>object</em> shapes, both <code>type</code> and " +
    "<code>interface</code> work &mdash; see 'Types vs Interfaces' for the trade-offs (interfaces support " +
    "declaration merging and <code>extends</code> ergonomics; type aliases support unions and computed " +
    "types). <strong>Gotchas:</strong> a type alias is purely a name, not a distinct nominal type &mdash; " +
    "<code>type UserId = string</code> is interchangeable with any other <code>string</code> (use branded " +
    "types if you need true distinction). Aliases can't be re-opened/merged like interfaces. Pick aliases for " +
    "expressiveness (especially unions and computed types) and interfaces for extendable object/class " +
    "contracts.</p>"
};

C["keyof-operator"] = {
  summary: "<p>The <strong><code>keyof</code></strong> operator takes an object type and produces a " +
    "<strong>union of its keys</strong> as literal types. For <code>type Point = { x: number; y: number }</code>, " +
    "<code>keyof Point</code> is <code>\"x\" | \"y\"</code>. It's a cornerstone of type-safe generic code: " +
    "combined with generics and indexed access types (<code>T[K]</code>), it lets you write functions that " +
    "operate on object properties while guaranteeing the key exists and the returned value has the right " +
    "type. It's the basis for many utility types and safe property-access patterns.</p>",
  examples: [
    {
      title: "Example 1: A type-safe property getter",
      description: "<p><code>keyof</code> + indexed access guarantees key and value types.</p>",
      code: "function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {\n" +
        "  return obj[key];   // T[K] = the type of that specific property\n" +
        "}\n" +
        "\n" +
        "const user = { id: 1, name: \"Sam\" };\n" +
        "const id = getProp(user, \"id\");     // typed as number\n" +
        "const x = getProp(user, \"nope\");    // ERROR: \"nope\" is not a key of user"
    },
    {
      title: "Example 2: keyof for constrained keys",
      description: "<p>Restrict a parameter to valid property names of a type.</p>",
      code: "type Config = { host: string; port: number; secure: boolean };\n" +
        "type ConfigKey = keyof Config; // \"host\" | \"port\" | \"secure\"\n" +
        "\n" +
        "function describe(key: ConfigKey) { /* only real keys allowed */ }\n" +
        "describe(\"port\");  // OK\n" +
        "describe(\"prot\");  // ERROR - typo caught"
    }
  ],
  whenToUse: "<p>Use <code>keyof</code> whenever you write generic code that works with an object's keys &mdash; " +
    "safe property getters/setters, pluck/pick helpers, form field handlers, and building utility types " +
    "(<code>Pick</code>, <code>Record</code>, mapped types all rely on it). It turns 'pass any string as a " +
    "key' into 'pass only a real key, and get the correctly-typed value back'. <strong>Gotchas:</strong> " +
    "<code>keyof</code> on a type with an index signature (<code>{ [k: string]: V }</code>) gives " +
    "<code>string | number</code> rather than specific literals. For arrays, <code>keyof T[]</code> includes " +
    "all the array method names and indices, which is rarely what you want (use <code>T[number]</code> to get " +
    "the element type instead). Combine <code>keyof</code> with <code>extends</code> in generics " +
    "(<code>K extends keyof T</code>) to constrain keys &mdash; that's the idiomatic, type-safe pattern.</p>"
};

/* ======================================================================
   SECTION 6 — TYPE GUARDS / NARROWING
   ====================================================================== */

C["type-guards-narrowing"] = {
  summary: "<p><strong>Narrowing</strong> is the process by which TypeScript refines a broad type (like a " +
    "union or <code>unknown</code>) down to a more specific type within a code branch, based on runtime " +
    "checks called <strong>type guards</strong>. After <code>if (typeof x === \"string\")</code>, TypeScript " +
    "<em>knows</em> <code>x</code> is a string inside that block. The built-in guards include " +
    "<code>typeof</code>, <code>instanceof</code>, equality checks, truthiness checks, the <code>in</code> " +
    "operator, and custom <strong>type predicates</strong> (<code>x is T</code>). Narrowing is what makes " +
    "unions usable and is central to writing safe, idiomatic TypeScript.</p>",
  examples: [
    {
      title: "Example 1: Several guards working together",
      description: "<p>Each check narrows the type for the branch that follows.</p>",
      code: "function describe(x: string | number | null) {\n" +
        "  if (x === null) return \"nothing\";        // equality guard -> excludes null\n" +
        "  if (typeof x === \"number\") return x.toFixed(2); // typeof guard -> number\n" +
        "  return x.toUpperCase();                    // remaining type: string\n" +
        "}"
    },
    {
      title: "Example 2: The 'in' operator guard",
      description: "<p>Check for a property to discriminate between object shapes.</p>",
      code: "type Dog = { bark: () => void };\n" +
        "type Cat = { meow: () => void };\n" +
        "function speak(pet: Dog | Cat) {\n" +
        "  if (\"bark\" in pet) pet.bark();  // narrowed to Dog\n" +
        "  else pet.meow();                 // narrowed to Cat\n" +
        "}"
    }
  ],
  whenToUse: "<p>You narrow constantly &mdash; any time you work with a union, <code>unknown</code>, or " +
    "nullable value, you check what it is before using it. The guard you pick depends on the type: " +
    "<code>typeof</code> for primitives, <code>instanceof</code> for class instances, <code>in</code> or a " +
    "discriminant field for object shapes, equality for literals/null, and custom type predicates for complex " +
    "validation. <strong>Gotchas:</strong> narrowing can be 'lost' &mdash; reassigning a variable or calling " +
    "a function between the check and the use can reset what TypeScript knows (it can't assume a value is " +
    "unchanged after arbitrary calls). Truthiness checks are convenient but conflate <code>0</code>/" +
    "<code>\"\"</code>/<code>null</code>/<code>undefined</code> (a frequent bug). For data from outside your " +
    "program, simple guards aren't enough &mdash; use type predicates or a validation library to safely " +
    "narrow <code>unknown</code> to your real types.</p>"
};

C["equality"] = {
  summary: "<p><strong>Equality narrowing</strong> uses comparison operators (<code>===</code>, <code>!==</code>, " +
    "<code>==</code>, <code>!=</code>) and <code>switch</code> cases to narrow types. Comparing a union " +
    "against a specific value tells the compiler which member you have in each branch: after " +
    "<code>if (x === null)</code>, the <code>else</code> branch knows <code>x</code> isn't null; comparing a " +
    "discriminant field against a literal narrows a discriminated union. Equality narrowing also works " +
    "<em>between</em> two variables &mdash; if <code>a === b</code> and they have overlapping types, the " +
    "compiler narrows both to the common type in that branch.</p>",
  examples: [
    {
      title: "Example 1: Narrowing out null/undefined",
      description: "<p>An equality check against null removes it from the type.</p>",
      code: "function len(s: string | null | undefined): number {\n" +
        "  if (s === null || s === undefined) return 0;\n" +
        "  return s.length;   // narrowed to string\n" +
        "}\n" +
        "// (s != null  also excludes BOTH null and undefined in one check)"
    },
    {
      title: "Example 2: Switch on a literal/discriminant",
      description: "<p>Each <code>case</code> narrows to that specific literal.</p>",
      code: "type Status = \"loading\" | \"success\" | \"error\";\n" +
        "function render(status: Status) {\n" +
        "  switch (status) {\n" +
        "    case \"loading\": return spinner();\n" +
        "    case \"success\": return content();\n" +
        "    case \"error\":   return errorBox(); // each case = that exact literal\n" +
        "  }\n" +
        "}"
    }
  ],
  whenToUse: "<p>Use equality narrowing to handle nullable values (<code>=== null</code>, or the handy " +
    "<code>!= null</code> which catches both <code>null</code> and <code>undefined</code> at once) and to " +
    "branch on discriminated unions and literal types via <code>===</code> or <code>switch</code>. It's the " +
    "natural companion to discriminated unions and exhaustiveness checking. <strong>Gotchas:</strong> prefer " +
    "strict equality <code>===</code>/<code>!==</code> over loose <code>==</code>/<code>!=</code> to avoid " +
    "JavaScript's coercion surprises &mdash; <em>except</em> the idiomatic <code>x != null</code>, which is a " +
    "deliberate, safe shorthand for 'not null and not undefined'. Don't confuse equality narrowing with " +
    "truthiness narrowing: <code>if (x)</code> is truthiness (and mishandles <code>0</code>/<code>\"\"</code>), " +
    "while <code>if (x === something)</code> is exact. For exhaustive <code>switch</code>es, add a " +
    "<code>never</code> default to catch unhandled cases.</p>"
};

C["instanceof"] = {
  summary: "<p>The <strong><code>instanceof</code></strong> operator narrows a value to a specific " +
    "<em>class</em> by checking whether it was created from that class (i.e. the class is in its prototype " +
    "chain). After <code>if (err instanceof TypeError)</code>, TypeScript knows <code>err</code> is a " +
    "<code>TypeError</code> in that block. Because it relies on real runtime constructors, " +
    "<code>instanceof</code> only works with <strong>classes</strong> (and other constructor functions) " +
    "&mdash; not with interfaces or type aliases, which don't exist at runtime. It's the go-to guard for " +
    "narrowing class instances and especially for handling different error types.</p>",
  examples: [
    {
      title: "Example 1: Narrowing error types",
      description: "<p>A classic use: branch on the kind of error caught.</p>",
      code: "try { doWork(); }\n" +
        "catch (err: unknown) {\n" +
        "  if (err instanceof ValidationError) {\n" +
        "    showFieldErrors(err.fields);   // narrowed to ValidationError\n" +
        "  } else if (err instanceof Error) {\n" +
        "    log(err.message);              // narrowed to Error\n" +
        "  }\n" +
        "}"
    },
    {
      title: "Example 2: Why it doesn't work on interfaces",
      description: "<p>Interfaces vanish at runtime, so <code>instanceof</code> can't see them.</p>",
      code: "interface Bird { fly(): void; }\n" +
        "// if (animal instanceof Bird) {}  // ERROR: 'Bird' only refers to a type\n" +
        "\n" +
        "// Use 'in' or a type predicate for interface-like shapes instead:\n" +
        "// if (\"fly\" in animal) { ... }"
    }
  ],
  whenToUse: "<p>Use <code>instanceof</code> to narrow values that are <em>class instances</em> &mdash; most " +
    "importantly for distinguishing error types in <code>catch</code> blocks (the modern idiom, since caught " +
    "errors are <code>unknown</code>), and for built-ins like <code>Date</code>, <code>Array</code> (though " +
    "<code>Array.isArray</code> is preferred), <code>Map</code>, etc. <strong>Gotchas:</strong> it only works " +
    "for things with a runtime constructor &mdash; not interfaces, type aliases, or plain object shapes (use " +
    "the <code>in</code> operator or a type predicate for those). It can also fail across different execution " +
    "contexts/realms (e.g. an array from an iframe isn't <code>instanceof</code> your <code>Array</code>) &mdash; " +
    "which is exactly why <code>Array.isArray</code> exists. And remember <code>typeof null === \"object\"</code> " +
    "and <code>null instanceof X</code> is <code>false</code>, so guard null separately when needed.</p>"
};

C["typeof"] = {
  summary: "<p>The <strong><code>typeof</code></strong> operator (used as a type guard) narrows a value by its " +
    "JavaScript primitive type at runtime. <code>typeof x</code> returns one of a fixed set of strings " +
    "(<code>\"string\"</code>, <code>\"number\"</code>, <code>\"boolean\"</code>, <code>\"object\"</code>, " +
    "<code>\"function\"</code>, <code>\"undefined\"</code>, <code>\"symbol\"</code>, <code>\"bigint\"</code>), " +
    "and TypeScript uses that check to narrow a union to the matching primitive. (Separately, " +
    "<code>typeof</code> is also used in <em>type</em> positions to capture the type of a value &mdash; e.g. " +
    "<code>typeof myObject</code> &mdash; which is a related but distinct feature.) As a guard it's the " +
    "standard way to narrow primitives.</p>",
  examples: [
    {
      title: "Example 1: Narrowing a primitive union",
      description: "<p>Each <code>typeof</code> check refines the type in its branch.</p>",
      code: "function pad(value: string | number): string {\n" +
        "  if (typeof value === \"number\") {\n" +
        "    return value.toString().padStart(4, \"0\"); // value is number\n" +
        "  }\n" +
        "  return value.padStart(4, \"0\");              // value is string\n" +
        "}"
    },
    {
      title: "Example 2: typeof in a type position (bonus use)",
      description: "<p>Capture the type of an existing value to reuse it.</p>",
      code: "const defaultSettings = { theme: \"dark\", fontSize: 14 };\n" +
        "type Settings = typeof defaultSettings; // { theme: string; fontSize: number }\n" +
        "\n" +
        "function apply(s: Settings) { /* ... */ }"
    }
  ],
  whenToUse: "<p>Use <code>typeof</code> as a guard to narrow unions of <em>primitives</em> &mdash; " +
    "string-vs-number, handling optional/undefined, distinguishing a function from a value. In type " +
    "positions, use <code>typeof someValue</code> to derive a type from existing data (great with " +
    "<code>as const</code> objects for a single source of truth). <strong>Gotchas:</strong> JavaScript's " +
    "<code>typeof</code> has famous quirks &mdash; <code>typeof null === \"object\"</code> (so it can't " +
    "distinguish null from objects; check <code>=== null</code> separately), and arrays and most objects all " +
    "report <code>\"object\"</code> (use <code>Array.isArray</code> or the <code>in</code> operator to tell " +
    "them apart). It can't distinguish between different object shapes or class instances &mdash; use " +
    "<code>instanceof</code>, <code>in</code>, or type predicates for those. It's perfect for primitives, " +
    "limited for objects.</p>"
};

C["truthiness"] = {
  summary: "<p><strong>Truthiness narrowing</strong> uses a value's truthy/falsy nature in a condition to " +
    "narrow its type. Writing <code>if (value)</code> narrows out the 'falsy' possibilities &mdash; " +
    "<code>null</code>, <code>undefined</code>, <code>0</code>, <code>NaN</code>, <code>\"\"</code> (empty " +
    "string), and <code>false</code> &mdash; so inside the block, a <code>string | null</code> becomes " +
    "<code>string</code>. It's a concise way to guard against null/undefined and is extremely common. But its " +
    "convenience hides a serious trap: it removes <em>all</em> falsy values, not just null/undefined, which " +
    "can silently mishandle legitimate <code>0</code> or empty-string values.</p>",
  examples: [
    {
      title: "Example 1: Convenient null/undefined guarding",
      description: "<p>A truthiness check narrows away null and undefined.</p>",
      code: "function greet(name: string | null | undefined) {\n" +
        "  if (name) {\n" +
        "    return `Hi, ${name.toUpperCase()}`; // name narrowed to string\n" +
        "  }\n" +
        "  return \"Hi, stranger\";\n" +
        "}"
    },
    {
      title: "Example 2: The falsy-value trap",
      description: "<p>Truthiness wrongly rejects valid <code>0</code> and <code>\"\"</code>.</p>",
      code: "function setCount(count: number | undefined) {\n" +
        "  if (count) { /* ... */ }   // BUG: skips when count === 0 (which is valid!)\n" +
        "\n" +
        "  // Correct: check explicitly for the thing you mean\n" +
        "  if (count !== undefined) { /* handles 0 properly */ }\n" +
        "}"
    }
  ],
  whenToUse: "<p>Truthiness narrowing is fine and idiomatic when the falsy values you're excluding are " +
    "<em>genuinely</em> all invalid &mdash; e.g. an object reference that's either present or " +
    "<code>null</code>/<code>undefined</code>. <strong>The critical gotcha:</strong> for " +
    "<code>number</code>s, <code>0</code> is falsy, and for <code>string</code>s, <code>\"\"</code> is falsy " +
    "&mdash; so <code>if (count)</code> or <code>if (name)</code> silently skips valid zero/empty values, a " +
    "very common bug. When a value could legitimately be <code>0</code> or <code>\"\"</code>, narrow " +
    "<em>explicitly</em> with <code>!== null</code>, <code>!== undefined</code>, or <code>!= null</code> " +
    "(both) instead of relying on truthiness. Similarly, prefer <code>??</code> over <code>||</code> for " +
    "defaults so <code>0</code>/<code>\"\"</code> aren't accidentally replaced. Use truthiness for presence " +
    "checks on objects; be explicit for numbers and strings.</p>"
};

C["type-predicates"] = {
  summary: "<p>A <strong>type predicate</strong> is a custom, user-defined type guard &mdash; a function whose " +
    "return type is written as <code>arg is SomeType</code>. When the function returns <code>true</code>, " +
    "TypeScript narrows the argument to <code>SomeType</code> in the calling code. This lets you encapsulate " +
    "complex runtime checks (that <code>typeof</code>/<code>instanceof</code> can't express) into reusable, " +
    "named guards &mdash; essential for safely narrowing <code>unknown</code> data, validating shapes of " +
    "parsed JSON, and filtering arrays to a narrower type. It's how you teach the compiler about validations " +
    "you perform manually.</p>",
  examples: [
    {
      title: "Example 1: A custom guard for an object shape",
      description: "<p>The <code>is</code> return type narrows the value where the guard is true.</p>",
      code: "interface User { id: number; name: string; }\n" +
        "\n" +
        "function isUser(value: unknown): value is User {\n" +
        "  return typeof value === \"object\" && value !== null\n" +
        "    && \"id\" in value && \"name\" in value;\n" +
        "}\n" +
        "\n" +
        "const data: unknown = JSON.parse(input);\n" +
        "if (isUser(data)) data.name.toUpperCase(); // narrowed to User - safe"
    },
    {
      title: "Example 2: Narrowing while filtering an array",
      description: "<p>A predicate lets <code>filter</code> change the element type.</p>",
      code: "const values: (string | null)[] = [\"a\", null, \"b\"];\n" +
        "\n" +
        "// Without a predicate, filter(Boolean) still types as (string | null)[]\n" +
        "const clean = values.filter((v): v is string => v !== null);\n" +
        "// clean is string[] - the predicate narrowed the element type"
    }
  ],
  whenToUse: "<p>Write type predicates when a built-in guard isn't enough &mdash; validating the shape of " +
    "external/<code>unknown</code> data (API responses, JSON, messages), creating reusable domain guards " +
    "(<code>isAdmin</code>, <code>isValidEmail</code>), and narrowing arrays via <code>filter</code>. They're " +
    "the bridge between runtime validation and compile-time types. <strong>Critical gotcha:</strong> a type " +
    "predicate is an <em>unchecked promise</em> &mdash; TypeScript trusts your <code>boolean</code> logic " +
    "without verifying it matches the claimed type. If your check is incomplete (you forgot to verify a " +
    "property's type), you've created a false guarantee and reintroduced runtime bugs. So make the predicate's " +
    "logic genuinely thorough, or better, use a <strong>schema validation library</strong> (Zod, Valibot, " +
    "io-ts) that generates correct guards for you &mdash; especially for complex/nested data where " +
    "hand-written predicates are error-prone.</p>"
};

/* ======================================================================
   SECTION 7 — TYPESCRIPT FUNCTIONS
   ====================================================================== */

C["typescript-functions"] = {
  summary: "<p>TypeScript adds types to functions: you annotate <strong>parameter types</strong> and an " +
    "optional <strong>return type</strong>, and the compiler checks every call and the body against them. It " +
    "supports optional parameters (<code>?</code>), default values, rest parameters (<code>...args</code>), " +
    "and typed callbacks/higher-order functions. Functions can be typed inline, via a type alias or " +
    "interface, and TypeScript infers return types automatically (though annotating them on public APIs is " +
    "good practice). Well-typed functions are where TypeScript delivers most of its value &mdash; they form " +
    "the contracts that make the rest of your code safe.</p>",
  examples: [
    {
      title: "Example 1: Parameters, optionals, defaults, rest",
      description: "<p>The common parameter features, all type-checked.</p>",
      code: "function createUser(\n" +
        "  name: string,\n" +
        "  age: number = 18,        // default value (implies optional)\n" +
        "  email?: string,          // optional (string | undefined)\n" +
        "  ...roles: string[]       // rest: collects remaining args\n" +
        "): void { /* ... */ }\n" +
        "\n" +
        "createUser(\"Sam\");\n" +
        "createUser(\"Alex\", 30, \"a@x.com\", \"admin\", \"editor\");"
    },
    {
      title: "Example 2: Typing functions as values",
      description: "<p>Function types describe callbacks and stored functions.</p>",
      code: "type BinaryOp = (a: number, b: number) => number;\n" +
        "const add: BinaryOp = (a, b) => a + b;   // params inferred from BinaryOp\n" +
        "\n" +
        "function apply(op: BinaryOp, x: number, y: number) { return op(x, y); }\n" +
        "apply(add, 2, 3); // 5"
    }
  ],
  whenToUse: "<p>You type functions constantly &mdash; it's the highest-value annotation in TypeScript because " +
    "signatures are the contracts the compiler checks at every call site. <strong>Best practices:</strong> " +
    "always annotate parameters; annotate return types on public/exported functions (catches accidental " +
    "changes and improves error locality), while letting simple internal functions infer their returns. " +
    "<strong>Gotchas:</strong> optional parameters must come after required ones; a parameter with a default " +
    "is effectively optional at the call site. Be careful typing callbacks &mdash; a <code>void</code> return " +
    "type on a callback intentionally allows value-returning functions (the value is ignored). Avoid typing " +
    "parameters as <code>any</code> (turns off checking); prefer specific types, unions, or generics. For " +
    "functions that behave differently based on argument types, see Function Overloading.</p>"
};

C["typing-functions"] = {
  summary: "<p><strong>Typing functions</strong> covers the various syntaxes for describing a function's shape: " +
    "inline annotations on a declaration, function <strong>type expressions</strong> (<code>(a: number) =&gt; " +
    "string</code>), <strong>call signatures</strong> in interfaces/type aliases, and typing this/parameters/" +
    "returns. The arrow syntax <code>(params) =&gt; ReturnType</code> is the most common way to express a " +
    "function type as a value. You can also describe more complex function objects (with properties, or " +
    "multiple call signatures). Getting function types right enables type-safe callbacks, event handlers, and " +
    "higher-order functions.</p>",
  examples: [
    {
      title: "Example 1: Function type expression vs inline",
      description: "<p>Two ways to type the same function.</p>",
      code: "// Inline on the declaration\n" +
        "function map1(items: number[], fn: (n: number) => string): string[] {\n" +
        "  return items.map(fn);\n" +
        "}\n" +
        "\n" +
        "// Reusable named function type\n" +
        "type Mapper = (n: number) => string;\n" +
        "function map2(items: number[], fn: Mapper): string[] { return items.map(fn); }"
    },
    {
      title: "Example 2: Call signature in an interface",
      description: "<p>Interfaces/aliases can describe a callable shape.</p>",
      code: "interface Comparator<T> {\n" +
        "  (a: T, b: T): number;   // call signature\n" +
        "}\n" +
        "const byLength: Comparator<string> = (a, b) => a.length - b.length;\n" +
        "[\"bbb\", \"a\", \"cc\"].sort(byLength);"
    }
  ],
  whenToUse: "<p>Use named function types (via <code>type</code> or an interface call signature) when the same " +
    "function shape is reused &mdash; callback contracts, strategy functions, event handlers, comparators &mdash; " +
    "for readability and consistency; use inline annotations for one-off parameters. <strong>Gotchas:</strong> " +
    "when you assign a function to a typed variable, the parameters are <em>inferred</em> from the type " +
    "(contextual typing), so you don't re-annotate them &mdash; a nice convenience. Watch function-type " +
    "compatibility rules: a function with fewer parameters is assignable where more are expected (extra args " +
    "are ignored, like JS callbacks), and parameter types have subtle bivariance behavior that can let unsafe " +
    "assignments through in non-strict settings. For functions with multiple distinct call shapes, reach for " +
    "overloads instead of a single broad signature.</p>"
};

C["function-overloading"] = {
  summary: "<p><strong>Function overloading</strong> lets a single function have <em>multiple type " +
    "signatures</em>, so it can be called in different ways with different, precisely-typed results. You " +
    "declare several <strong>overload signatures</strong> (the public call shapes), followed by one " +
    "<strong>implementation signature</strong> (broader, not directly callable) that handles all cases. The " +
    "compiler matches each call against the overloads and gives the corresponding return type. It's useful " +
    "when a function's return type genuinely depends on its argument types in a way a single signature can't " +
    "express. Often, though, a union type or generics is a simpler alternative.</p>",
  examples: [
    {
      title: "Example 1: Overloads for different return types",
      description: "<p>The result type depends on which overload matched.</p>",
      code: "// Overload signatures (what callers see)\n" +
        "function parse(input: string): string[];\n" +
        "function parse(input: number): number[];\n" +
        "// Implementation signature (not directly callable; handles all)\n" +
        "function parse(input: string | number): string[] | number[] {\n" +
        "  return typeof input === \"string\" ? input.split(\"\") : [input];\n" +
        "}\n" +
        "\n" +
        "const a = parse(\"abc\");  // typed as string[]\n" +
        "const b = parse(42);     // typed as number[]"
    },
    {
      title: "Example 2: Often a union/generic is simpler",
      description: "<p>Prefer the simpler tool when overloads aren't truly needed.</p>",
      code: "// Instead of overloads, a single signature with a union often suffices:\n" +
        "function first<T>(arr: T[]): T | undefined { return arr[0]; }\n" +
        "first([1, 2]);     // number | undefined\n" +
        "first([\"a\"]);     // string | undefined  - generics handle it cleanly"
    }
  ],
  whenToUse: "<p>Use overloading when a function truly behaves differently &mdash; with different return types " +
    "&mdash; depending on the specific types or number of arguments, and a single signature would be too " +
    "loose (forcing callers to narrow the result). Common in library APIs (e.g. <code>document.createElement</code>). " +
    "<strong>Gotchas:</strong> overloads are often <em>overused</em> &mdash; in many cases a <strong>union " +
    "return type</strong>, <strong>optional parameters</strong>, or <strong>generics</strong> express the " +
    "intent more simply and are easier to maintain; try those first. The implementation signature must be " +
    "compatible with all overloads but isn't visible to callers, and it's easy to make it too loose (using " +
    "<code>any</code>) which weakens safety inside the body. Keep overload lists short and ordered from most " +
    "specific to least, and reach for overloads only when simpler tools genuinely can't express the " +
    "relationship.</p>"
};

/* ======================================================================
   SECTION 8 — TYPESCRIPT INTERFACES
   ====================================================================== */

C["typescript-interfaces"] = {
  summary: "<p><strong>Interfaces</strong> define the shape of objects and the contracts classes implement. " +
    "They list property names with their types and method signatures, supporting optional properties " +
    "(<code>?</code>), <code>readonly</code> properties, index signatures, call signatures, and " +
    "<strong>extension</strong> (one interface extending others). A distinctive feature is " +
    "<strong>declaration merging</strong>: declaring the same interface name twice merges them, which is " +
    "powerful for augmenting types from libraries. Interfaces are purely compile-time (no runtime footprint) " +
    "and are a primary tool for modeling data shapes and designing APIs in TypeScript.</p>",
  examples: [
    {
      title: "Example 1: A full-featured interface",
      description: "<p>Optional, readonly, methods, and index signatures together.</p>",
      code: "interface Product {\n" +
        "  readonly id: number;        // can't be reassigned\n" +
        "  name: string;\n" +
        "  description?: string;       // optional\n" +
        "  priceCents: number;\n" +
        "  discount(pct: number): number; // method signature\n" +
        "}\n" +
        "\n" +
        "const p: Product = {\n" +
        "  id: 1, name: \"Mug\", priceCents: 999,\n" +
        "  discount(pct) { return this.priceCents * (1 - pct); },\n" +
        "};"
    },
    {
      title: "Example 2: Declaration merging (augmentation)",
      description: "<p>Re-declaring an interface adds to it &mdash; useful for extending library types.</p>",
      code: "interface Window { myAppVersion: string; } // merges with the global Window\n" +
        "window.myAppVersion = \"1.0.0\";              // now typed\n" +
        "\n" +
        "// Two declarations of the same interface combine into one:\n" +
        "interface Box { width: number; }\n" +
        "interface Box { height: number; }\n" +
        "const b: Box = { width: 10, height: 20 }; // both required"
    }
  ],
  whenToUse: "<p>Use interfaces to model object shapes, define the contracts your classes <code>implement</code>, " +
    "and describe public API/data structures &mdash; especially in library code, where their extendability " +
    "and declaration merging shine (e.g. augmenting <code>Window</code> or a framework's types). " +
    "<strong>Interface vs type alias:</strong> they overlap heavily for object shapes; prefer interfaces for " +
    "extendable object/class contracts and when you might need merging, and type aliases for unions, tuples, " +
    "and computed types (interfaces can't express those). <strong>Gotchas:</strong> interfaces don't exist at " +
    "runtime, so they can't validate incoming data &mdash; that needs runtime checks. Declaration merging is " +
    "powerful but can be surprising (an accidental duplicate name silently merges). The sub-topics here cover " +
    "the details: types-vs-interfaces, extending, declaration, and hybrid types.</p>"
};

C["types-vs-interfaces"] = {
  summary: "<p><strong>Types vs Interfaces</strong> is one of the most common TypeScript questions. Both can " +
    "describe object shapes and are interchangeable for that purpose. The differences: <strong>interfaces</strong> " +
    "support <em>declaration merging</em> (re-opening to add members) and read a bit more naturally for " +
    "<code>extends</code>/<code>implements</code>; <strong>type aliases</strong> can express things " +
    "interfaces cannot &mdash; unions, tuples, primitives, mapped types, conditional types, and computed " +
    "types. Performance and error messages are largely similar. The practical guidance: use interfaces for " +
    "object/class contracts, use type aliases when you need unions or computed types &mdash; and stay " +
    "consistent.</p>",
  examples: [
    {
      title: "Example 1: Both work for object shapes",
      description: "<p>For a plain object, the two are essentially equivalent.</p>",
      code: "interface UserI { id: number; name: string; }\n" +
        "type UserT = { id: number; name: string };\n" +
        "// Both usable identically for typing an object.\n" +
        "\n" +
        "// Interfaces can be re-opened (merged); type aliases cannot:\n" +
        "interface UserI { email: string; } // merges -> id, name, email\n" +
        "// type UserT = { ... }            // ERROR: duplicate identifier"
    },
    {
      title: "Example 2: Only type aliases do unions/computed types",
      description: "<p>These shapes are impossible with an interface.</p>",
      code: "type Status = \"on\" | \"off\";              // union - alias only\n" +
        "type Pair = [string, number];             // tuple - alias only\n" +
        "type Keys = keyof UserI;                   // computed - alias only\n" +
        "type Partial2<T> = { [K in keyof T]?: T[K] }; // mapped - alias only"
    }
  ],
  whenToUse: "<p>Use an <strong>interface</strong> for object shapes and class contracts, particularly public " +
    "API types and anything that might be extended or augmented (declaration merging is great for library " +
    "authors and for augmenting third-party/global types). Use a <strong>type alias</strong> whenever you " +
    "need a union, tuple, primitive alias, function type, or a mapped/conditional/computed type &mdash; things " +
    "interfaces can't do. <strong>Gotchas:</strong> declaration merging is a double-edged sword &mdash; handy " +
    "for augmentation, but an accidental duplicate interface name silently merges instead of erroring, which " +
    "can confuse. For most app code the choice barely matters; the key is <em>consistency</em> within a " +
    "codebase. A common convention: 'interfaces for objects, types for everything else.' Don't agonize over " +
    "it &mdash; pick a rule and apply it.</p>"
};

C["extending-interfaces"] = {
  summary: "<p><strong>Extending interfaces</strong> lets one interface inherit the members of one or more " +
    "others using the <code>extends</code> keyword, building larger contracts from smaller ones. The child " +
    "interface gets all the parent's properties plus its own. An interface can extend multiple interfaces at " +
    "once (combining them), and can also extend a class's instance shape. This promotes composition and reuse " +
    "of type definitions &mdash; you define common shapes once and extend them, rather than repeating " +
    "properties. It's analogous to intersection types for objects, but with clearer syntax and error " +
    "messages.</p>",
  examples: [
    {
      title: "Example 1: Single and multiple extension",
      description: "<p>Build up a contract by extending base interfaces.</p>",
      code: "interface Entity { id: number; }\n" +
        "interface Timestamped { createdAt: Date; updatedAt: Date; }\n" +
        "\n" +
        "// Extend multiple interfaces at once\n" +
        "interface User extends Entity, Timestamped {\n" +
        "  name: string;\n" +
        "}\n" +
        "const u: User = { id: 1, name: \"Sam\", createdAt: new Date(), updatedAt: new Date() };"
    },
    {
      title: "Example 2: extends vs intersection",
      description: "<p>Two ways to combine shapes; <code>extends</code> often gives better errors.</p>",
      code: "// With extends (interface)\n" +
        "interface Admin extends User { permissions: string[]; }\n" +
        "\n" +
        "// Equivalent with an intersection (type alias)\n" +
        "type Admin2 = User & { permissions: string[] };\n" +
        "// Both valid; 'extends' reads clearer for inheritance hierarchies."
    }
  ],
  whenToUse: "<p>Use interface extension to model 'is-a-kind-of' relationships and to share common fields " +
    "across related types &mdash; base entities, mixin-style capabilities, layered DTOs. It keeps type " +
    "definitions DRY and expresses hierarchy clearly. <strong>Interface <code>extends</code> vs type " +
    "intersection (<code>&amp;</code>):</strong> they're largely equivalent for combining object shapes, but " +
    "<code>extends</code> generally produces clearer error messages and is the idiomatic choice for " +
    "interfaces, while intersections are needed when combining with union/computed types. <strong>Gotchas:</strong> " +
    "when extending, a child can <em>narrow</em> a parent property's type (compatible override) but not make " +
    "it incompatible &mdash; conflicting types cause an error. Avoid deep extension chains for the same " +
    "reasons deep inheritance is discouraged in OOP; prefer composing a few focused interfaces over towering " +
    "hierarchies.</p>"
};

C["interface-declaration"] = {
  summary: "<p><strong>Interface declaration</strong> refers to the syntax and capabilities for declaring " +
    "interfaces: property signatures (with optional <code>?</code> and <code>readonly</code> modifiers), " +
    "method signatures, <strong>index signatures</strong> (<code>[key: string]: T</code> for dictionary-like " +
    "shapes), <strong>call signatures</strong> (making the interface describe a callable function), and " +
    "<strong>construct signatures</strong> (<code>new (...) =&gt; T</code> for constructor types). Mastering " +
    "the full declaration syntax lets you model not just simple objects but functions, classes, dictionaries, " +
    "and hybrid shapes precisely.</p>",
  examples: [
    {
      title: "Example 1: Property, method, and index signatures",
      description: "<p>The common members an interface can declare.</p>",
      code: "interface Cache {\n" +
        "  readonly maxSize: number;          // readonly property\n" +
        "  ttl?: number;                      // optional property\n" +
        "  get(key: string): string | null;  // method signature\n" +
        "  [key: string]: unknown;            // index signature (extra keys)\n" +
        "}"
    },
    {
      title: "Example 2: Call and construct signatures",
      description: "<p>Interfaces can describe functions and constructors too.</p>",
      code: "interface Logger {\n" +
        "  (message: string): void;     // CALL signature: Logger is callable\n" +
        "  level: \"info\" | \"warn\";\n" +
        "}\n" +
        "\n" +
        "interface UserCtor {\n" +
        "  new (name: string): { name: string }; // CONSTRUCT signature\n" +
        "}"
    }
  ],
  whenToUse: "<p>Use the richer declaration features when simple property lists aren't enough: " +
    "<strong>index signatures</strong> for dictionary/map-like objects with dynamic keys, <strong>call " +
    "signatures</strong> to type function objects that also carry properties (see Hybrid Types), and " +
    "<strong>construct signatures</strong> for factories or typing a class itself. <strong>Gotchas:</strong> " +
    "an index signature forces <em>all</em> declared properties to be compatible with the index type, and " +
    "makes any key access return the value type even for missing keys &mdash; so it loosens safety (consider " +
    "<code>noUncheckedIndexedAccess</code> and prefer <code>Record</code> or explicit keys when you know " +
    "them). Don't reach for index signatures just to allow 'any extra property'; that often hides typos. Use " +
    "<code>readonly</code> generously for immutable fields and <code>?</code> precisely &mdash; an optional " +
    "property's type implicitly includes <code>undefined</code>, which callers must handle.</p>"
};

C["hybrid-types"] = {
  summary: "<p><strong>Hybrid types</strong> describe values that act as more than one thing at once &mdash; " +
    "most commonly a <em>function that also has properties</em> (a callable object). In JavaScript this is " +
    "common: jQuery's <code>$</code> is a function you can call <em>and</em> an object with methods; a " +
    "counter function might also carry a <code>.reset()</code> method. TypeScript models these with an " +
    "interface that has both a <strong>call signature</strong> and regular property/method members. Hybrid " +
    "types let you type these dual-natured values precisely instead of falling back to <code>any</code>.</p>",
  examples: [
    {
      title: "Example 1: A callable object with properties",
      description: "<p>An interface combining a call signature with members.</p>",
      code: "interface Counter {\n" +
        "  (): number;          // callable: counter() returns a number\n" +
        "  count: number;       // property\n" +
        "  reset(): void;       // method\n" +
        "}\n" +
        "\n" +
        "function makeCounter(): Counter {\n" +
        "  const c = (() => (c.count += 1)) as Counter;\n" +
        "  c.count = 0;\n" +
        "  c.reset = () => { c.count = 0; };\n" +
        "  return c;\n" +
        "}\n" +
        "const next = makeCounter();\n" +
        "next(); next();        // call it\n" +
        "next.reset();          // use its method"
    },
    {
      title: "Example 2: Typing a library-style export",
      description: "<p>A function namespace pattern (callable + attached helpers).</p>",
      code: "interface Money {\n" +
        "  (cents: number): string;     // money(500) -> \"$5.00\"\n" +
        "  currency: string;\n" +
        "  parse(text: string): number;\n" +
        "}\n" +
        "// Lets consumers do money(500) AND money.parse(\"$5\") with full types."
    }
  ],
  whenToUse: "<p>Use hybrid types when you genuinely have a value that's both callable and has properties &mdash; " +
    "typing existing JavaScript libraries with that pattern (jQuery-style APIs, function-with-config objects), " +
    "or modeling a function that carries metadata/helpers. They're essential when writing declaration files " +
    "(<code>.d.ts</code>) for such libraries. <strong>Gotchas:</strong> hybrid types are relatively rare in " +
    "<em>new</em> code &mdash; modern designs usually prefer a plain object with a clearly-named method over a " +
    "callable-with-properties, which is easier to understand and tree-shake. Constructing a value that " +
    "satisfies a hybrid interface often requires an assertion (as shown) because you build it up imperatively, " +
    "which is a bit awkward and a minor safety gap. Reach for hybrid types mainly when interfacing with " +
    "existing JS that already works this way, not as a default design.</p>"
};

/* ======================================================================
   SECTION 9 — CLASSES
   ====================================================================== */

C["classes"] = {
  summary: "<p><strong>Classes</strong> in TypeScript extend JavaScript classes with type annotations and " +
    "OOP features: typed fields, <strong>access modifiers</strong> (<code>public</code>, <code>private</code>, " +
    "<code>protected</code>), <code>readonly</code> fields, parameter properties (declaring + assigning " +
    "fields from the constructor), <code>abstract</code> classes/members, <code>implements</code> for " +
    "interface contracts, and typed inheritance. A class produces both a runtime constructor and an instance " +
    "type. TypeScript also supports <code>static</code> members, getters/setters, and (with proper config) " +
    "private fields via <code>#</code>. Classes are the tool for objects that bundle state with behavior and " +
    "need identity, lifecycle, or inheritance.</p>",
  examples: [
    {
      title: "Example 1: A class with modifiers and parameter properties",
      description: "<p>Parameter properties declare and assign fields concisely.</p>",
      code: "class Account {\n" +
        "  // 'private' param property: declares + assigns this.balance\n" +
        "  constructor(private balance: number, public readonly owner: string) {}\n" +
        "\n" +
        "  deposit(amount: number): void {\n" +
        "    if (amount <= 0) throw new Error(\"must be positive\");\n" +
        "    this.balance += amount;\n" +
        "  }\n" +
        "  getBalance(): number { return this.balance; }\n" +
        "}\n" +
        "const a = new Account(100, \"Sam\");\n" +
        "// a.balance -> ERROR: private; a.owner -> OK but readonly"
    },
    {
      title: "Example 2: Implementing an interface + inheritance",
      description: "<p>Classes can implement contracts and extend base classes.</p>",
      code: "interface Shape { area(): number; }\n" +
        "abstract class Base implements Shape {\n" +
        "  abstract area(): number;          // subclasses must implement\n" +
        "  describe() { return `area=${this.area()}`; }\n" +
        "}\n" +
        "class Circle extends Base {\n" +
        "  constructor(private r: number) { super(); }\n" +
        "  area() { return Math.PI * this.r ** 2; }\n" +
        "}"
    }
  ],
  whenToUse: "<p>Use classes for objects with encapsulated state and behavior, identity and lifecycle, runtime " +
    "<code>instanceof</code> needs, or inheritance hierarchies &mdash; domain entities, services, custom " +
    "error types, stateful components. <strong>Gotchas and balance:</strong> modern TS/JS often favors plain " +
    "functions and data objects (and composition) over deep class hierarchies &mdash; don't reach for classes " +
    "reflexively or build towering inheritance trees (prefer composition over inheritance). Be aware of two " +
    "kinds of 'private': TypeScript's <code>private</code> (compile-time only, still visible at runtime) " +
    "versus JavaScript's <code>#</code> private fields (truly private at runtime) &mdash; choose based on " +
    "whether you need real runtime privacy. Watch <code>this</code> binding in callbacks (use arrow methods " +
    "or bind). The sub-topics cover constructors, modifiers, abstract classes, and inheritance in detail.</p>"
};

C["constructor-params"] = {
  summary: "<p><strong>Constructor parameters</strong> in TypeScript can do double duty via " +
    "<strong>parameter properties</strong>: by adding an access modifier (<code>public</code>, " +
    "<code>private</code>, <code>protected</code>, or <code>readonly</code>) to a constructor parameter, " +
    "TypeScript automatically declares a class field of the same name and assigns the argument to it &mdash; " +
    "eliminating the usual boilerplate of declaring fields and writing <code>this.x = x</code>. Without a " +
    "modifier, a constructor parameter is just a local parameter. This shorthand is one of TypeScript's most " +
    "convenient class features and is widely used (especially with dependency injection).</p>",
  examples: [
    {
      title: "Example 1: Parameter properties vs the verbose form",
      description: "<p>The modifier turns a parameter into an auto-assigned field.</p>",
      code: "// Verbose (plain JS style)\n" +
        "class A {\n" +
        "  private name: string;\n" +
        "  constructor(name: string) { this.name = name; }\n" +
        "}\n" +
        "\n" +
        "// Concise (TypeScript parameter property - identical result)\n" +
        "class B {\n" +
        "  constructor(private name: string) {} // declares + assigns this.name\n" +
        "}"
    },
    {
      title: "Example 2: Common with dependency injection",
      description: "<p>Inject and store collaborators in one line each.</p>",
      code: "class OrderService {\n" +
        "  constructor(\n" +
        "    private readonly repo: OrderRepository, // injected + stored, immutable\n" +
        "    private readonly mailer: Mailer,\n" +
        "  ) {}\n" +
        "  place(order: Order) { this.repo.save(order); this.mailer.confirm(order); }\n" +
        "}"
    }
  ],
  whenToUse: "<p>Use parameter properties to cut constructor boilerplate whenever a constructor argument should " +
    "become a field &mdash; extremely common in service classes and dependency-injection-heavy code (Angular, " +
    "NestJS). Add <code>readonly</code> for dependencies that shouldn't change after construction. " +
    "<strong>Gotchas:</strong> a parameter <em>without</em> a modifier is just a local parameter, not a field " +
    "&mdash; forgetting the modifier means <code>this.x</code> doesn't exist (a common beginner confusion). " +
    "Mixing parameter properties with regular parameters in one constructor can read awkwardly; keep it " +
    "consistent. Parameter properties are a TypeScript-only feature (they rely on emit), so they don't exist " +
    "in plain JS and may interact with 'erasable syntax'/Node native-TS constraints. For complex " +
    "initialization logic, a regular constructor body is clearer than cramming everything into parameter " +
    "properties.</p>"
};

C["constructor-overloading"] = {
  summary: "<p><strong>Constructor overloading</strong> applies function overloading to constructors: you " +
    "declare multiple constructor signatures so a class can be instantiated in different ways with " +
    "type-safety, backed by a single implementation. Because TypeScript classes allow only one " +
    "<em>implementation</em> constructor, you list several overload signatures and then one implementation " +
    "signature (with a union of parameters) that handles all cases. It's used when an object can be sensibly " +
    "created from different inputs. In practice, static factory methods are often a cleaner alternative.</p>",
  examples: [
    {
      title: "Example 1: Multiple ways to construct",
      description: "<p>Overload signatures plus one implementation.</p>",
      code: "class DateRange {\n" +
        "  start: Date; end: Date;\n" +
        "  constructor(start: Date, end: Date);          // overload 1\n" +
        "  constructor(days: number);                    // overload 2\n" +
        "  constructor(a: Date | number, b?: Date) {     // implementation\n" +
        "    if (typeof a === \"number\") {\n" +
        "      this.start = new Date();\n" +
        "      this.end = new Date(Date.now() + a * 86400000);\n" +
        "    } else { this.start = a; this.end = b!; }\n" +
        "  }\n" +
        "}\n" +
        "new DateRange(7);                  // 7 days from now\n" +
        "new DateRange(new Date(), new Date());"
    },
    {
      title: "Example 2: Static factory methods (often cleaner)",
      description: "<p>Named factories beat overloaded constructors for clarity.</p>",
      code: "class DateRange2 {\n" +
        "  private constructor(public start: Date, public end: Date) {}\n" +
        "  static fromDays(days: number) {\n" +
        "    return new DateRange2(new Date(), new Date(Date.now() + days * 86400000));\n" +
        "  }\n" +
        "  static between(start: Date, end: Date) { return new DateRange2(start, end); }\n" +
        "}\n" +
        "DateRange2.fromDays(7);   // self-documenting at the call site"
    }
  ],
  whenToUse: "<p>Use constructor overloading when a class genuinely needs to be created from distinct kinds of " +
    "input and you want each form type-checked. <strong>However, prefer static factory methods in most " +
    "cases</strong> (<code>DateRange.fromDays(7)</code>, <code>User.fromJSON(...)</code>): they're " +
    "self-documenting (the method name explains the intent), avoid the awkward single-implementation " +
    "constraint, and can return cached instances or subclasses. <strong>Gotchas:</strong> like function " +
    "overloads, the implementation signature isn't visible to callers and is easy to make too loose; you must " +
    "handle every overloaded case in the body, often with narrowing. Overloaded constructors can get hard to " +
    "read quickly. Reach for them sparingly &mdash; named factories usually communicate intent better and are " +
    "the more maintainable pattern.</p>"
};

C["access-modifiers"] = {
  summary: "<p><strong>Access modifiers</strong> control the visibility of class members. " +
    "<strong><code>public</code></strong> (the default) means accessible everywhere; " +
    "<strong><code>private</code></strong> restricts access to within the same class; " +
    "<strong><code>protected</code></strong> allows access within the class and its subclasses. There's also " +
    "<code>readonly</code> (assignable only at declaration or in the constructor) which can combine with the " +
    "others. Note: TypeScript's <code>private</code>/<code>protected</code> are <em>compile-time</em> " +
    "enforcement only &mdash; for true runtime privacy, JavaScript's <code>#</code> private fields are " +
    "needed. Modifiers support encapsulation, one of the core benefits of OOP.</p>",
  examples: [
    {
      title: "Example 1: public / private / protected / readonly",
      description: "<p>Each modifier sets a different visibility boundary.</p>",
      code: "class Base {\n" +
        "  public id = 1;          // accessible anywhere (default)\n" +
        "  private secret = \"x\";   // only inside Base\n" +
        "  protected shared = 2;   // Base and subclasses\n" +
        "  readonly created = new Date(); // can't reassign after init\n" +
        "}\n" +
        "class Sub extends Base {\n" +
        "  show() { return this.shared; } // OK: protected visible in subclass\n" +
        "  // return this.secret;         // ERROR: private to Base\n" +
        "}\n" +
        "new Base().secret; // ERROR: private"
    },
    {
      title: "Example 2: TS private vs JS # (runtime) private",
      description: "<p><code>#</code> fields are truly private at runtime; <code>private</code> is not.</p>",
      code: "class A {\n" +
        "  private tsPrivate = 1;  // compile-time only; visible at runtime as a.tsPrivate\n" +
        "  #jsPrivate = 2;          // truly private - inaccessible outside, even in JS\n" +
        "}\n" +
        "const a = new A();\n" +
        "// (a as any).tsPrivate -> 1  (TS private can be bypassed at runtime)\n" +
        "// a.#jsPrivate          -> SyntaxError (genuinely hidden)"
    }
  ],
  whenToUse: "<p>Use access modifiers to enforce encapsulation: make fields <code>private</code> by default and " +
    "expose only what forms the class's intended API, use <code>protected</code> for members subclasses need, " +
    "and <code>readonly</code> for values fixed at construction (like injected dependencies). " +
    "<strong>Critical gotcha:</strong> TypeScript's <code>private</code>/<code>protected</code> are erased at " +
    "compile time &mdash; they prevent access in your TS code but the field still exists and is reachable at " +
    "runtime (e.g. via <code>(obj as any).field</code> or from plain JS). If you need <em>genuine</em> " +
    "runtime privacy (hiding implementation from consumers, security-sensitive data), use JavaScript's " +
    "<code>#</code> private fields instead. For most application code, TS modifiers are enough; reach for " +
    "<code>#</code> when real encapsulation at runtime matters.</p>"
};

C["abstract-classes"] = {
  summary: "<p>An <strong>abstract class</strong> is a base class that cannot be instantiated directly &mdash; " +
    "it exists to be extended. It can mix <strong>concrete</strong> members (with implementations, shared by " +
    "all subclasses) and <strong>abstract</strong> members (signatures with no body that subclasses " +
    "<em>must</em> implement). This is the Template Method pattern: the base defines the shared algorithm/" +
    "structure and delegates the varying parts to subclasses. Marked with the <code>abstract</code> keyword, " +
    "it sits between an interface (pure contract, no implementation) and a concrete class (fully " +
    "implemented).</p>",
  examples: [
    {
      title: "Example 1: Shared logic + required subclass methods",
      description: "<p>The base implements the common flow; subclasses fill the gaps.</p>",
      code: "abstract class Report {\n" +
        "  generate(): string {                    // concrete: shared algorithm\n" +
        "    return this.header() + this.body();\n" +
        "  }\n" +
        "  header() { return \"=== REPORT ===\\n\"; } // concrete default\n" +
        "  abstract body(): string;                // abstract: must be implemented\n" +
        "}\n" +
        "class SalesReport extends Report {\n" +
        "  body() { return \"Total: $5,000\"; }\n" +
        "}\n" +
        "// new Report();        // ERROR: cannot instantiate abstract class\n" +
        "new SalesReport().generate(); // OK"
    },
    {
      title: "Example 2: Abstract class vs interface",
      description: "<p>Abstract classes carry implementation/state; interfaces don't.</p>",
      code: "interface Shape { area(): number; }       // pure contract, no code/state\n" +
        "abstract class BaseShape {\n" +
        "  constructor(protected color: string) {} // can hold state\n" +
        "  describe() { return `${this.color}, area ${this.area()}`; } // shared code\n" +
        "  abstract area(): number;\n" +
        "}"
    }
  ],
  whenToUse: "<p>Use an abstract class when subclasses genuinely <em>share implementation or state</em>, not " +
    "just a contract &mdash; a base with common logic and a few subclass-specific steps (Template Method), or " +
    "a family of related types with shared behavior. <strong>Choose between abstract class and interface:</strong> " +
    "interface for a pure 'can-do' capability that unrelated types might have; abstract class for a partial " +
    "implementation of a closely-related family. <strong>Gotchas:</strong> a class can extend only one " +
    "abstract class (single inheritance) but implement many interfaces, so an abstract base 'uses up' the " +
    "extends slot and bakes in tight coupling &mdash; many modern designs prefer interfaces + composition for " +
    "flexibility. Reserve abstract classes for true template-method situations where shared code in a base " +
    "genuinely pays off; don't force a hierarchy where composition would be simpler.</p>"
};

C["inheritance-vs-polymorphism"] = {
  summary: "<p><strong>Inheritance</strong> is one class extending another (<code>extends</code>) to reuse and " +
    "specialize its members &mdash; an 'is-a' relationship. <strong>Polymorphism</strong> ('many forms') is " +
    "the ability to treat different subclasses through a common base type, where each responds to the same " +
    "method call in its own way. They work together: inheritance creates the type hierarchy, polymorphism " +
    "lets you write code against the base type that automatically invokes the correct subclass behavior at " +
    "runtime. The distinction: inheritance is about <em>structure/reuse</em>, polymorphism is about " +
    "<em>substitutable behavior</em>.</p>",
  examples: [
    {
      title: "Example 1: Inheritance creates the hierarchy",
      description: "<p>Subclasses reuse base members and add/override behavior.</p>",
      code: "class Animal {\n" +
        "  constructor(protected name: string) {}\n" +
        "  move() { return `${this.name} moves`; }   // inherited by all\n" +
        "  speak() { return \"...\"; }                  // meant to be overridden\n" +
        "}\n" +
        "class Dog extends Animal { speak() { return \"Woof\"; } }\n" +
        "class Cat extends Animal { speak() { return \"Meow\"; } }"
    },
    {
      title: "Example 2: Polymorphism uses the hierarchy",
      description: "<p>Code against the base type; the right subclass method runs.</p>",
      code: "const animals: Animal[] = [new Dog(\"Rex\"), new Cat(\"Mia\")];\n" +
        "for (const a of animals) {\n" +
        "  console.log(a.speak()); // \"Woof\", then \"Meow\" - polymorphic dispatch\n" +
        "}\n" +
        "// The loop knows only 'Animal', yet each call runs the correct override."
    }
  ],
  whenToUse: "<p>Use <strong>inheritance</strong> for genuine, stable 'is-a' relationships where a subclass can " +
    "substitute for its base without surprises (Liskov Substitution). Use <strong>polymorphism</strong> " +
    "whenever you want to write code against a general type and let specific types vary the behavior &mdash; " +
    "it's the engine behind replacing <code>switch</code>-on-type with method dispatch and the Open/Closed " +
    "Principle (add new subclasses without changing the calling code). <strong>Gotchas:</strong> inheritance " +
    "is frequently overused &mdash; it creates tight coupling and brittle hierarchies, so prefer " +
    "<strong>composition over inheritance</strong> when you just want to reuse code (rather than model true " +
    "subtyping). Polymorphism in TypeScript is structural too: any object matching the base shape works, not " +
    "only declared subclasses. Favor shallow hierarchies and interfaces; reach for inheritance when " +
    "substitutability genuinely holds.</p>"
};

C["method-overriding"] = {
  summary: "<p><strong>Method overriding</strong> is when a subclass provides its own implementation of a " +
    "method already defined in its base class, replacing (or extending, via <code>super</code>) the " +
    "inherited behavior. The override must be compatible with the base signature. TypeScript 4.3+ offers the " +
    "optional <strong><code>override</code></strong> keyword (and the <code>noImplicitOverride</code> flag) " +
    "to mark intentional overrides, so the compiler errors if you think you're overriding but the base method " +
    "doesn't exist (e.g. due to a typo or a renamed base method) &mdash; catching a subtle, common class of " +
    "bugs.</p>",
  examples: [
    {
      title: "Example 1: Overriding and calling super",
      description: "<p>A subclass replaces or extends the base method.</p>",
      code: "class Logger {\n" +
        "  log(msg: string) { console.log(msg); }\n" +
        "}\n" +
        "class TimestampLogger extends Logger {\n" +
        "  override log(msg: string) {           // explicit override\n" +
        "    super.log(`[${new Date().toISOString()}] ${msg}`); // extend base behavior\n" +
        "  }\n" +
        "}"
    },
    {
      title: "Example 2: The override keyword catches mistakes",
      description: "<p>With <code>noImplicitOverride</code>, a typo'd override is an error.</p>",
      code: "class Base { handleClick() {} }\n" +
        "class Button extends Base {\n" +
        "  // override handleClik() {}  // ERROR: no base method 'handleClik' to override\n" +
        "  override handleClick() {}    // OK: matches the base\n" +
        "}\n" +
        "// Without 'override', the typo'd version would silently add a NEW method."
    }
  ],
  whenToUse: "<p>Override methods when a subclass needs different behavior than its base &mdash; specializing a " +
    "default, adding pre/post logic around <code>super</code>, or implementing an abstract method. " +
    "<strong>Strongly recommended:</strong> enable <code>noImplicitOverride</code> and use the " +
    "<code>override</code> keyword on every intentional override &mdash; it documents intent and, crucially, " +
    "catches the nasty bug where a base method is renamed (or you typo the name) and your 'override' silently " +
    "becomes a brand-new, never-called method. <strong>Gotchas:</strong> overrides must keep the contract " +
    "(Liskov) &mdash; don't strengthen preconditions or weaken the return type in incompatible ways, or you " +
    "break polymorphic callers. Be careful calling overridable methods from a constructor (the subclass " +
    "override may run before the subclass is fully initialized). When extending base behavior rather than " +
    "replacing it, remember to call <code>super.method()</code>.</p>"
};

/* ======================================================================
   SECTION 10 — GENERICS
   ====================================================================== */

C["generics"] = {
  summary: "<p><strong>Generics</strong> let you write reusable, type-safe code that works over a <em>range " +
    "of types</em> while preserving type information &mdash; parameterizing types the way functions " +
    "parameterize values. A generic function or type takes one or more <strong>type parameters</strong> " +
    "(conventionally <code>T</code>, <code>K</code>, <code>U</code>) that get filled in (explicitly or by " +
    "inference) at each use. This lets a single <code>identity&lt;T&gt;</code>, <code>Array&lt;T&gt;</code>, " +
    "or <code>Map&lt;K, V&gt;</code> work for any type without resorting to <code>any</code> (which would " +
    "lose type safety). Generics are the foundation of reusable utilities, collections, and most of the " +
    "utility/advanced types.</p>",
  examples: [
    {
      title: "Example 1: A generic function preserves the type",
      description: "<p>The type flows in and back out, unlike <code>any</code>.</p>",
      code: "function identity<T>(value: T): T { return value; }\n" +
        "\n" +
        "const a = identity<string>(\"hi\"); // explicitly string\n" +
        "const b = identity(42);            // inferred: number\n" +
        "// Compare: function id(x: any): any -> loses the type entirely"
    },
    {
      title: "Example 2: Generic types/classes",
      description: "<p>Parameterize data structures so they stay type-safe.</p>",
      code: "class Box<T> {\n" +
        "  constructor(private value: T) {}\n" +
        "  get(): T { return this.value; }\n" +
        "}\n" +
        "const numBox = new Box(5);        // Box<number>\n" +
        "const strBox = new Box(\"hello\");  // Box<string>\n" +
        "numBox.get().toFixed(2);          // typed as number"
    }
  ],
  whenToUse: "<p>Use generics whenever you write code that should work uniformly across many types without " +
    "losing type information &mdash; reusable utilities (<code>first</code>, <code>groupBy</code>), data " +
    "structures (collections, caches, results), API wrappers (<code>ApiResponse&lt;T&gt;</code>), and " +
    "higher-order functions. They're the right answer almost any time you're tempted to use <code>any</code> " +
    "for flexibility. <strong>Gotchas:</strong> don't over-genericize &mdash; a type parameter used only once " +
    "and never related to anything is often unnecessary (just use the concrete type). Let inference fill in " +
    "type arguments where possible rather than always specifying them explicitly. Overly clever nested " +
    "generics produce cryptic error messages and hurt readability, so keep them as simple as the problem " +
    "allows. Use <strong>constraints</strong> (next topic) to require capabilities of a type parameter " +
    "instead of leaving it fully open.</p>"
};

C["generic-types"] = {
  summary: "<p><strong>Generic types</strong> are type definitions that take type parameters &mdash; generic " +
    "functions, generic interfaces/type aliases, and generic classes. They let you define a shape once and " +
    "reuse it for any element type: <code>Array&lt;T&gt;</code>, <code>Promise&lt;T&gt;</code>, " +
    "<code>Map&lt;K, V&gt;</code>, and your own <code>Result&lt;T&gt;</code> or <code>Repository&lt;T&gt;</code>. " +
    "Type parameters can have <strong>defaults</strong> (<code>&lt;T = string&gt;</code>) and be used in " +
    "multiple positions. Generic types are how the standard library and most well-designed TypeScript APIs " +
    "stay both flexible and type-safe.</p>",
  examples: [
    {
      title: "Example 1: Generic interface and type alias",
      description: "<p>Parameterize a shape so it adapts to any payload type.</p>",
      code: "interface ApiResponse<T> {\n" +
        "  data: T;\n" +
        "  status: number;\n" +
        "}\n" +
        "const r: ApiResponse<string[]> = { data: [\"a\", \"b\"], status: 200 };\n" +
        "\n" +
        "// Generic type alias with a default parameter\n" +
        "type Result<T = unknown> = { ok: true; value: T } | { ok: false; error: string };"
    },
    {
      title: "Example 2: Multiple type parameters",
      description: "<p>Relate several types in one definition.</p>",
      code: "class Dictionary<K, V> {\n" +
        "  private map = new Map<K, V>();\n" +
        "  set(key: K, value: V) { this.map.set(key, value); }\n" +
        "  get(key: K): V | undefined { return this.map.get(key); }\n" +
        "}\n" +
        "const ages = new Dictionary<string, number>();\n" +
        "ages.set(\"sam\", 30); // keys are strings, values numbers - enforced"
    }
  ],
  whenToUse: "<p>Define generic types for any reusable structure or contract that holds or operates on a " +
    "variable element type &mdash; response wrappers, collections, repositories, event emitters, result/option " +
    "types. Use <strong>default type parameters</strong> to make common cases ergonomic while allowing " +
    "customization. <strong>Gotchas:</strong> name type parameters meaningfully when there are several " +
    "(<code>&lt;TData, TError&gt;</code> beats <code>&lt;T, U&gt;</code> for readability). Avoid adding type " +
    "parameters that aren't actually used to relate inputs and outputs &mdash; an unused parameter is a smell. " +
    "Deeply nested generic types become hard to read and produce confusing errors, so prefer composing a few " +
    "well-named generic helpers over one monster type. Combine with <strong>constraints</strong> to require " +
    "that a type parameter has certain properties rather than accepting truly anything.</p>"
};

C["generic-constraints"] = {
  summary: "<p><strong>Generic constraints</strong> restrict what a type parameter can be, using " +
    "<code>extends</code>: <code>&lt;T extends SomeType&gt;</code> means 'T can be any type that is " +
    "assignable to SomeType'. This lets a generic function safely use properties/capabilities of the " +
    "constrained type while still accepting many concrete types. Common patterns include " +
    "<code>&lt;T extends object&gt;</code>, <code>&lt;K extends keyof T&gt;</code> (a key of T), and " +
    "constraining to types with specific members (<code>&lt;T extends { id: number }&gt;</code>). " +
    "Constraints are the balance point between fully-open generics (which can do nothing with the type) and " +
    "concrete types (which aren't reusable).</p>",
  examples: [
    {
      title: "Example 1: Requiring a capability",
      description: "<p>A constraint lets the function safely use a member of T.</p>",
      code: "// Without a constraint you couldn't access .length\n" +
        "function longest<T extends { length: number }>(a: T, b: T): T {\n" +
        "  return a.length >= b.length ? a : b;\n" +
        "}\n" +
        "longest(\"abc\", \"de\");      // OK: strings have length\n" +
        "longest([1, 2], [3]);       // OK: arrays have length\n" +
        "longest(1, 2);              // ERROR: number has no 'length'"
    },
    {
      title: "Example 2: keyof constraint for safe property access",
      description: "<p>Constrain a key parameter to the actual keys of an object.</p>",
      code: "function pluck<T, K extends keyof T>(obj: T, key: K): T[K] {\n" +
        "  return obj[key];\n" +
        "}\n" +
        "const user = { id: 1, name: \"Sam\" };\n" +
        "pluck(user, \"name\");  // string\n" +
        "pluck(user, \"nope\");  // ERROR: not a key of user"
    }
  ],
  whenToUse: "<p>Add a constraint whenever your generic code needs to <em>use</em> something about the type " +
    "parameter &mdash; access a property, call a method, or relate one parameter to another (like a key to " +
    "its object). Without a constraint, a type parameter is opaque and you can't touch its members; with one, " +
    "you get safe access while staying reusable. The <code>K extends keyof T</code> pattern is essential for " +
    "type-safe property utilities. <strong>Gotchas:</strong> constrain only as much as you actually need &mdash; " +
    "over-constraining reduces reusability, under-constraining means you can't use the type. Be aware that " +
    "<code>extends</code> in constraints means 'assignable to' (structural), not class inheritance. A subtle " +
    "trap: a generic constrained to <code>T extends X</code> isn't the same as the type <code>X</code> &mdash; " +
    "the caller picks the specific <code>T</code>, so you can't return a fixed <code>X</code> where <code>T</code> " +
    "is expected. Use constraints to express real requirements, not as decoration.</p>"
};

/* ======================================================================
   SECTION 11 — DECORATORS (overview only)
   ====================================================================== */

C["decorators"] = {
  summary: "<p><strong>Decorators</strong> are special declarations (prefixed with <code>@</code>) that you " +
    "attach to classes, methods, accessors, properties, or parameters to <em>modify or annotate</em> them. A " +
    "decorator is a function that runs when the class is defined, receiving information about the decorated " +
    "target and able to observe, modify, or replace it. They enable declarative meta-programming &mdash; " +
    "adding behavior like logging, validation, dependency injection, or routing via a simple annotation. " +
    "Decorators power frameworks like Angular and NestJS. Note there are now <strong>two flavors</strong>: " +
    "the older TypeScript 'experimental' decorators and the newer ECMAScript Stage 3 standard decorators " +
    "(TypeScript 5.0+), which differ in API and behavior.</p>",
  examples: [
    {
      title: "Example 1: A simple method decorator (modern syntax)",
      description: "<p>Wrap a method with extra behavior declaratively.</p>",
      code: "function log<T, A extends any[], R>(\n" +
        "  target: (this: T, ...args: A) => R,\n" +
        "  ctx: ClassMethodDecoratorContext\n" +
        ") {\n" +
        "  return function (this: T, ...args: A): R {\n" +
        "    console.log(`calling ${String(ctx.name)}`);\n" +
        "    return target.call(this, ...args);\n" +
        "  };\n" +
        "}\n" +
        "class Service {\n" +
        "  @log greet(name: string) { return `Hi ${name}`; }\n" +
        "}"
    },
    {
      title: "Example 2: Framework-style declarative decorators",
      description: "<p>How frameworks use decorators to wire up behavior.</p>",
      code: "// NestJS / Angular style - decorators describe intent declaratively\n" +
        "// @Controller(\"users\")\n" +
        "// class UsersController {\n" +
        "//   @Get(\":id\")\n" +
        "//   findOne(@Param(\"id\") id: string) { ... }\n" +
        "// }\n" +
        "// The framework reads these annotations to set up routing & DI."
    }
  ],
  whenToUse: "<p>You'll mostly <em>consume</em> decorators when using frameworks that rely on them &mdash; " +
    "Angular, NestJS, TypeORM, class-validator &mdash; where they declaratively wire up routing, DI, " +
    "validation, and ORM mapping. Writing your own makes sense for genuine cross-cutting concerns (logging, " +
    "caching, access control) you want to apply declaratively. <strong>Important gotchas:</strong> there are " +
    "<em>two incompatible decorator systems</em> &mdash; legacy experimental decorators (needing " +
    "<code>experimentalDecorators</code> in tsconfig, used by current Angular/Nest) and the new standardized " +
    "decorators (TS 5.0+, no flag, different API). They are <strong>not interchangeable</strong>, and many " +
    "frameworks still expect the legacy ones (often with <code>emitDecoratorMetadata</code> + " +
    "<code>reflect-metadata</code>) &mdash; so check what your framework requires. Decorators add 'magic' " +
    "that can obscure control flow, so use custom ones judiciously and document them. For non-framework code, " +
    "a plain higher-order function is often clearer than a decorator.</p>"
};

/* ======================================================================
   SECTION 12 — UTILITY TYPES
   ====================================================================== */

C["utility-types"] = {
  summary: "<p><strong>Utility types</strong> are built-in generic types that transform existing types into " +
    "new ones, saving you from writing repetitive type definitions by hand. They include shape transformers " +
    "(<code>Partial</code>, <code>Required</code>, <code>Readonly</code>, <code>Pick</code>, " +
    "<code>Omit</code>, <code>Record</code>), union manipulators (<code>Exclude</code>, <code>Extract</code>, " +
    "<code>NonNullable</code>), and function/type extractors (<code>Parameters</code>, <code>ReturnType</code>, " +
    "<code>InstanceType</code>, <code>Awaited</code>). They're implemented using mapped and conditional types " +
    "under the hood, and mastering them lets you derive types from a single source of truth instead of " +
    "duplicating and drifting.</p>",
  examples: [
    {
      title: "Example 1: Deriving related types from one source",
      description: "<p>Several utilities applied to one base type.</p>",
      code: "interface User { id: number; name: string; email: string; }\n" +
        "\n" +
        "type UserDraft = Partial<User>;          // all optional\n" +
        "type UserPreview = Pick<User, \"id\" | \"name\">; // subset\n" +
        "type UserWithoutId = Omit<User, \"id\">;   // remove a key\n" +
        "type ReadonlyUser = Readonly<User>;      // all readonly"
    },
    {
      title: "Example 2: Function and union utilities",
      description: "<p>Extract types from functions and filter unions.</p>",
      code: "function createUser(name: string, age: number): User { /* ... */ return {} as User; }\n" +
        "type Args = Parameters<typeof createUser>; // [string, number]\n" +
        "type Made = ReturnType<typeof createUser>; // User\n" +
        "\n" +
        "type T = Exclude<\"a\" | \"b\" | \"c\", \"b\">; // \"a\" | \"c\"\n" +
        "type R = Awaited<Promise<string>>;          // string"
    }
  ],
  whenToUse: "<p>Reach for utility types whenever a new type is a <em>transformation</em> of an existing one " +
    "&mdash; a 'create' DTO that omits the id, a 'patch' DTO with all fields optional, a read-only view, a " +
    "subset for a list, or the argument/return types of an existing function. They keep types DRY: change the " +
    "source type and the derived ones update automatically, preventing drift. <strong>Gotchas:</strong> most " +
    "operate at one level (e.g. <code>Partial</code>/<code>Readonly</code> are <em>shallow</em> &mdash; nested " +
    "objects aren't made optional/readonly); you need recursive/deep variants for nested structures. " +
    "<code>Pick</code>/<code>Omit</code> key arguments aren't always validated the way you'd expect " +
    "(<code>Omit</code> doesn't error on a non-existent key, a known sharp edge). Compose them, but if a chain " +
    "gets unreadable, a named mapped type may be clearer. The sub-topics cover each utility individually.</p>"
};

C["partial"] = {
  summary: "<p><strong><code>Partial&lt;T&gt;</code></strong> makes all properties of a type optional. It " +
    "transforms <code>{ id: number; name: string }</code> into <code>{ id?: number; name?: string }</code>. " +
    "It's ideal for update/patch operations where you only supply the fields that change, for optional " +
    "configuration objects, and for builders. Note it's <em>shallow</em> &mdash; only top-level properties " +
    "become optional, not nested ones.</p>",
  examples: [
    {
      title: "Example 1: Partial for update functions",
      description: "<p>Accept just the fields being changed.</p>",
      code: "interface User { id: number; name: string; email: string; }\n" +
        "\n" +
        "function updateUser(id: number, changes: Partial<User>) {\n" +
        "  // changes can be { name } or { email } or any subset\n" +
        "}\n" +
        "updateUser(1, { email: \"new@x.com\" }); // OK - only one field"
    },
    {
      title: "Example 2: Partial for default-merging config",
      description: "<p>Let callers override only some defaults.</p>",
      code: "const defaults = { retries: 3, timeout: 1000, verbose: false };\n" +
        "function configure(opts: Partial<typeof defaults>) {\n" +
        "  return { ...defaults, ...opts }; // caller overrides a subset\n" +
        "}\n" +
        "configure({ timeout: 5000 });"
    }
  ],
  whenToUse: "<p>Use <code>Partial&lt;T&gt;</code> for update/patch payloads, optional options objects, and " +
    "merge-with-defaults patterns. <strong>Gotchas:</strong> it's <em>shallow</em> &mdash; nested objects " +
    "keep their required properties, so for deep structures you need a recursive <code>DeepPartial</code>. Be " +
    "careful using <code>Partial</code> on something you then treat as complete: making everything optional " +
    "means the compiler no longer guarantees required fields are present, which can hide missing-data bugs " +
    "(e.g. don't <code>Partial</code> a type and then pass it where the full type is required without " +
    "re-validating). It's perfect for inputs you'll merge, less so for values you'll consume as if complete.</p>"
};

C["pick"] = {
  summary: "<p><strong><code>Pick&lt;T, K&gt;</code></strong> constructs a new type by selecting a subset of " +
    "properties <code>K</code> (a union of keys) from type <code>T</code>. <code>Pick&lt;User, \"id\" | " +
    "\"name\"&gt;</code> yields <code>{ id: number; name: string }</code>. It's the complement of " +
    "<code>Omit</code>: <code>Pick</code> is an allow-list (keep only these), <code>Omit</code> is a " +
    "deny-list (remove these). Useful for creating focused views, narrowing a large type to what a function " +
    "actually needs, or building DTOs.</p>",
  examples: [
    {
      title: "Example 1: A focused subset of a type",
      description: "<p>Keep only the properties you care about.</p>",
      code: "interface User { id: number; name: string; email: string; passwordHash: string; }\n" +
        "\n" +
        "type PublicUser = Pick<User, \"id\" | \"name\">;\n" +
        "// { id: number; name: string } - safe to expose, no sensitive fields"
    },
    {
      title: "Example 2: Asking only for what a function needs",
      description: "<p>Constrain a parameter to the relevant fields.</p>",
      code: "function sendWelcome(user: Pick<User, \"name\" | \"email\">) {\n" +
        "  console.log(`Welcome ${user.name} <${user.email}>`);\n" +
        "}\n" +
        "// Callers can pass a full User (structural) but the contract is minimal."
    }
  ],
  whenToUse: "<p>Use <code>Pick</code> to create a precise subset of a larger type &mdash; public-facing DTOs " +
    "(dropping sensitive fields), minimal function parameters (ask only for what you use), and focused view " +
    "models. It keeps a single source of truth: derive from the base type rather than redeclaring fields. " +
    "<strong>Pick vs Omit:</strong> use <code>Pick</code> when you want a <em>small</em> subset of a large " +
    "type (the allow-list is shorter), and <code>Omit</code> when you want <em>most</em> of the type minus a " +
    "few fields. <strong>Gotcha:</strong> the key union <code>K</code> is constrained to <code>keyof T</code>, " +
    "so picking a non-existent key is a compile error (good) &mdash; unlike <code>Omit</code>, which is more " +
    "lenient. When the base type changes and a picked key is removed, <code>Pick</code> will flag it, helping " +
    "you keep derived types in sync.</p>"
};

C["omit"] = {
  summary: "<p><strong><code>Omit&lt;T, K&gt;</code></strong> constructs a new type by removing the properties " +
    "<code>K</code> from type <code>T</code> &mdash; the deny-list complement of <code>Pick</code>. " +
    "<code>Omit&lt;User, \"passwordHash\"&gt;</code> gives you the whole <code>User</code> minus that field. " +
    "It's ideal when you want <em>most</em> of a type but need to drop a few properties &mdash; creating " +
    "'input' types without server-generated fields (id, timestamps), or stripping sensitive data before " +
    "returning it.</p>",
  examples: [
    {
      title: "Example 1: An input type without generated fields",
      description: "<p>Drop fields the server will create.</p>",
      code: "interface User { id: number; name: string; email: string; createdAt: Date; }\n" +
        "\n" +
        "// What the client sends to CREATE a user (no id/createdAt yet)\n" +
        "type CreateUserInput = Omit<User, \"id\" | \"createdAt\">;\n" +
        "// { name: string; email: string }"
    },
    {
      title: "Example 2: Stripping sensitive fields",
      description: "<p>Remove what shouldn't leave the server.</p>",
      code: "interface Account { id: number; balance: number; passwordHash: string; }\n" +
        "type SafeAccount = Omit<Account, \"passwordHash\">;\n" +
        "function toResponse(a: Account): SafeAccount {\n" +
        "  const { passwordHash, ...safe } = a; // also strip at runtime!\n" +
        "  return safe;\n" +
        "}"
    }
  ],
  whenToUse: "<p>Use <code>Omit</code> when you want a type that's 'everything except a few fields' &mdash; " +
    "create/update input DTOs (omit server-generated id/timestamps), response types (omit secrets), or " +
    "modified variants of a base type. Prefer it over <code>Pick</code> when the list of fields to remove is " +
    "shorter than the list to keep. <strong>Important gotchas:</strong> historically <code>Omit</code> does " +
    "<em>not</em> error if you pass a key that doesn't exist on <code>T</code> (its key parameter is just " +
    "<code>string | number | symbol</code>), so a typo'd or stale key is silently ignored &mdash; a real trap " +
    "when refactoring (some teams use a stricter custom <code>Omit</code>). Also, removing a type-level field " +
    "doesn't remove it at <em>runtime</em> &mdash; you must also destructure/delete the property in code, or " +
    "sensitive data still leaks in the actual object. Type-level omission and runtime stripping are separate " +
    "steps.</p>"
};

C["readonly"] = {
  summary: "<p><strong><code>Readonly&lt;T&gt;</code></strong> makes all properties of a type read-only &mdash; " +
    "they can be set when the object is created but not reassigned afterward, enforced at compile time. It " +
    "turns <code>{ name: string }</code> into <code>{ readonly name: string }</code>. It's used to signal and " +
    "enforce immutability: function parameters that shouldn't be mutated, configuration that's fixed after " +
    "load, and shared state you don't want callers changing. Like the others, it's <em>shallow</em> (nested " +
    "objects remain mutable) and compile-time only.</p>",
  examples: [
    {
      title: "Example 1: Immutable parameters and config",
      description: "<p>The compiler forbids reassigning properties.</p>",
      code: "interface Config { host: string; port: number; }\n" +
        "\n" +
        "function connect(config: Readonly<Config>) {\n" +
        "  // config.port = 9999; // ERROR: cannot assign to readonly property\n" +
        "  return `${config.host}:${config.port}`;\n" +
        "}"
    },
    {
      title: "Example 2: Shallow only — nested stays mutable",
      description: "<p>Readonly doesn't deeply freeze nested objects.</p>",
      code: "interface State { user: { name: string }; }\n" +
        "const s: Readonly<State> = { user: { name: \"Sam\" } };\n" +
        "// s.user = {...};      // ERROR (top level is readonly)\n" +
        "s.user.name = \"Alex\";   // ALLOWED (nested is NOT readonly) - a gotcha!"
    }
  ],
  whenToUse: "<p>Use <code>Readonly&lt;T&gt;</code> to document and enforce that an object won't be mutated &mdash; " +
    "function parameters (a contract that you won't change the caller's data), immutable configuration, and " +
    "shared/global state in functional-style code. It catches accidental mutations at compile time. " +
    "<strong>Critical gotchas:</strong> it's <em>shallow</em> &mdash; nested objects and arrays remain " +
    "mutable, which surprises people relying on it for deep immutability (you need a recursive " +
    "<code>DeepReadonly</code> or <code>as const</code> for that). It's also <em>compile-time only</em>: it " +
    "doesn't actually freeze the object at runtime, so plain JS code or an <code>as</code> cast can still " +
    "mutate it &mdash; use <code>Object.freeze()</code> if you need runtime immutability. Treat " +
    "<code>Readonly</code> as a helpful guardrail in your TypeScript code, not a guarantee against all " +
    "mutation.</p>"
};

C["record"] = {
  summary: "<p><strong><code>Record&lt;K, V&gt;</code></strong> constructs an object type with keys of type " +
    "<code>K</code> and values of type <code>V</code>. <code>Record&lt;string, number&gt;</code> is a " +
    "dictionary of string&rarr;number; <code>Record&lt;\"a\" | \"b\", boolean&gt;</code> requires exactly " +
    "those keys with boolean values. It's the clean, expressive way to type maps/dictionaries and " +
    "lookup tables, and it's especially powerful with a union of literal keys, which forces you to provide " +
    "every key (exhaustive maps).</p>",
  examples: [
    {
      title: "Example 1: A dictionary type",
      description: "<p>Open-ended map from keys to values.</p>",
      code: "const scores: Record<string, number> = { sam: 10, alex: 8 };\n" +
        "scores.jo = 5; // OK - any string key, number value\n" +
        "// Equivalent to: { [key: string]: number }, but more readable"
    },
    {
      title: "Example 2: Exhaustive map with literal keys",
      description: "<p>A union of keys forces every case to be provided.</p>",
      code: "type Status = \"active\" | \"closed\" | \"pending\";\n" +
        "\n" +
        "const labels: Record<Status, string> = {\n" +
        "  active: \"Active\",\n" +
        "  closed: \"Closed\",\n" +
        "  pending: \"Pending\",\n" +
        "  // omit one -> ERROR: missing key. Add a new Status -> ERROR until handled.\n" +
        "};"
    }
  ],
  whenToUse: "<p>Use <code>Record&lt;K, V&gt;</code> for dictionary/map-like objects &mdash; it's clearer than " +
    "an index signature and, with a <em>literal union</em> as the key type, gives you exhaustive maps that " +
    "force you to handle every case (great for status&rarr;label tables, config-per-variant, etc., and they " +
    "error when a new union member is added). <strong>Gotchas:</strong> with an open key type " +
    "(<code>Record&lt;string, V&gt;</code>), TypeScript assumes <em>every</em> key access returns " +
    "<code>V</code> even for keys that don't exist at runtime &mdash; so <code>map[\"missing\"]</code> is " +
    "typed as <code>V</code> but is actually <code>undefined</code> (enable " +
    "<code>noUncheckedIndexedAccess</code> to get <code>V | undefined</code> and force a check). For known, " +
    "fixed keys prefer the literal-union form; reserve the open-string form for genuine dynamic dictionaries, " +
    "and validate key presence before trusting the value.</p>"
};

C["exclude"] = {
  summary: "<p><strong><code>Exclude&lt;T, U&gt;</code></strong> removes from union type <code>T</code> all " +
    "members that are assignable to <code>U</code>. <code>Exclude&lt;\"a\" | \"b\" | \"c\", \"a\"&gt;</code> " +
    "yields <code>\"b\" | \"c\"</code>. It operates on <em>unions</em> (unlike <code>Omit</code>, which works " +
    "on object properties) and is built with conditional types. It's handy for deriving a narrower union from " +
    "a broader one &mdash; e.g. all event names except a few, or filtering <code>null</code> out of a union.</p>",
  examples: [
    {
      title: "Example 1: Removing members from a union",
      description: "<p>Subtract specific members from a union type.</p>",
      code: "type Color = \"red\" | \"green\" | \"blue\" | \"transparent\";\n" +
        "type SolidColor = Exclude<Color, \"transparent\">; // \"red\" | \"green\" | \"blue\"\n" +
        "\n" +
        "type T = Exclude<string | number | boolean, boolean>; // string | number"
    },
    {
      title: "Example 2: Exclude vs Omit (different targets)",
      description: "<p><code>Exclude</code> filters unions; <code>Omit</code> filters object keys.</p>",
      code: "// Exclude: works on a UNION of values\n" +
        "type A = Exclude<\"x\" | \"y\" | \"z\", \"y\">; // \"x\" | \"z\"\n" +
        "\n" +
        "// Omit: works on an OBJECT's properties\n" +
        "type B = Omit<{ x: 1; y: 2; z: 3 }, \"y\">;   // { x: 1; z: 3 }"
    }
  ],
  whenToUse: "<p>Use <code>Exclude</code> to derive a smaller union by removing certain members &mdash; " +
    "filtering out a 'none'/'transparent' option, removing deprecated variants, or stripping " +
    "<code>null</code>/<code>undefined</code> (though <code>NonNullable</code> is the dedicated tool for " +
    "that). It keeps unions DRY by deriving rather than re-listing. <strong>Gotchas:</strong> don't confuse " +
    "it with <code>Omit</code> &mdash; <code>Exclude</code> operates on union <em>members</em> (values/" +
    "literals), <code>Omit</code> on object <em>properties</em>; using the wrong one is a common mistake. " +
    "<code>Exclude</code> is the complement of <code>Extract</code> (Exclude removes matches, Extract keeps " +
    "them). Because it relies on assignability, broad <code>U</code> types can remove more than you intend " +
    "(e.g. excluding <code>string</code> removes all string literals). It works only on unions &mdash; on a " +
    "non-union type it either returns the type or <code>never</code>.</p>"
};

C["extract"] = {
  summary: "<p><strong><code>Extract&lt;T, U&gt;</code></strong> is the complement of <code>Exclude</code>: it " +
    "<em>keeps</em> from union <code>T</code> only the members assignable to <code>U</code>. " +
    "<code>Extract&lt;\"a\" | \"b\" | \"c\", \"a\" | \"c\"&gt;</code> yields <code>\"a\" | \"c\"</code>. It's " +
    "used to pull a sub-union out of a larger one, or to find the overlap between two unions &mdash; e.g. " +
    "extracting only the string members from a mixed union, or selecting a category of event names.</p>",
  examples: [
    {
      title: "Example 1: Keeping only matching members",
      description: "<p>Select a sub-union from a larger union.</p>",
      code: "type Color = \"red\" | \"green\" | \"blue\" | \"transparent\";\n" +
        "type Primary = Extract<Color, \"red\" | \"blue\">; // \"red\" | \"blue\"\n" +
        "\n" +
        "// Extract by type, e.g. only the string members:\n" +
        "type T = Extract<string | number | boolean, string>; // string"
    },
    {
      title: "Example 2: Extracting a variant from a discriminated union",
      description: "<p>Pull out a specific shape by its discriminant.</p>",
      code: "type Action =\n" +
        "  | { type: \"add\"; value: number }\n" +
        "  | { type: \"remove\"; id: string }\n" +
        "  | { type: \"clear\" };\n" +
        "\n" +
        "type AddAction = Extract<Action, { type: \"add\" }>;\n" +
        "// { type: \"add\"; value: number }"
    }
  ],
  whenToUse: "<p>Use <code>Extract</code> to select a subset of a union by a condition &mdash; pulling one " +
    "variant out of a discriminated union (very handy for typing a handler that only deals with certain " +
    "actions), keeping only members of a certain type, or computing the intersection of two unions. It's the " +
    "'keep matching' counterpart to <code>Exclude</code>'s 'remove matching'. <strong>Gotchas:</strong> " +
    "remember the direction &mdash; <code>Extract</code> keeps what's assignable to <code>U</code>, " +
    "<code>Exclude</code> removes it; mixing them up is a common slip. Like <code>Exclude</code>, it works on " +
    "unions and uses assignability, so a broad <code>U</code> may match more members than expected. Extracting " +
    "a variant by its discriminant (<code>Extract&lt;Action, { type: \"add\" }&gt;</code>) is an especially " +
    "useful, readable pattern for working with one case of a tagged union in a type-safe way.</p>"
};

C["nonnullable"] = {
  summary: "<p><strong><code>NonNullable&lt;T&gt;</code></strong> removes <code>null</code> and " +
    "<code>undefined</code> from a type. <code>NonNullable&lt;string | null | undefined&gt;</code> is just " +
    "<code>string</code>. It's a focused utility for cleaning up nullable unions &mdash; useful when you've " +
    "already guaranteed (via a check or filter) that a value is present and want the type to reflect that, or " +
    "for deriving a non-nullable version of an existing type. It's essentially <code>Exclude&lt;T, null | " +
    "undefined&gt;</code> with a clear name.</p>",
  examples: [
    {
      title: "Example 1: Stripping null/undefined from a type",
      description: "<p>Get the 'present' version of a nullable type.</p>",
      code: "type MaybeName = string | null | undefined;\n" +
        "type Name = NonNullable<MaybeName>; // string\n" +
        "\n" +
        "interface Settings { theme?: string | null; }\n" +
        "type Theme = NonNullable<Settings[\"theme\"]>; // string"
    },
    {
      title: "Example 2: After filtering, reflect non-null in the type",
      description: "<p>Pair a runtime filter with a matching type.</p>",
      code: "const values: (number | null)[] = [1, null, 2];\n" +
        "// A type predicate already narrows the element type:\n" +
        "const present = values.filter((v): v is NonNullable<typeof v> => v != null);\n" +
        "// present: number[]"
    }
  ],
  whenToUse: "<p>Use <code>NonNullable&lt;T&gt;</code> when you need the non-null/undefined version of a type " +
    "&mdash; after a presence check, when extracting a guaranteed-present property type, or when building " +
    "utilities that assume a value exists. It reads more clearly than <code>Exclude&lt;T, null | " +
    "undefined&gt;</code>. <strong>Gotchas:</strong> it's a <em>type-level</em> operation &mdash; it doesn't " +
    "perform any runtime check, so using it doesn't make a value actually non-null; you still need a runtime " +
    "guard (<code>!= null</code>, optional chaining) to safely access the value. It's shallow: it removes " +
    "null/undefined from the top-level union, not from nested properties. In practice you often get the same " +
    "effect simply by narrowing with a guard, so reach for <code>NonNullable</code> mainly when you need the " +
    "<em>type</em> explicitly (in generics or derived types), not as a substitute for runtime null handling.</p>"
};

C["parameters"] = {
  summary: "<p><strong><code>Parameters&lt;T&gt;</code></strong> extracts the parameter types of a function " +
    "type as a <strong>tuple</strong>. For <code>(name: string, age: number) =&gt; void</code>, " +
    "<code>Parameters&lt;...&gt;</code> is <code>[string, number]</code>. Combined with <code>typeof</code> " +
    "(to get a function's type), it lets you derive argument types from an existing function instead of " +
    "redeclaring them &mdash; useful for wrappers, decorators, higher-order functions, and keeping a wrapper's " +
    "signature in sync with the function it wraps.</p>",
  examples: [
    {
      title: "Example 1: Deriving argument types from a function",
      description: "<p>Reuse a function's parameter types without repeating them.</p>",
      code: "function createUser(name: string, age: number, admin: boolean) { /* ... */ }\n" +
        "\n" +
        "type CreateUserArgs = Parameters<typeof createUser>;\n" +
        "// [name: string, age: number, admin: boolean]\n" +
        "\n" +
        "const args: CreateUserArgs = [\"Sam\", 30, false];\n" +
        "createUser(...args);"
    },
    {
      title: "Example 2: Typing a wrapper that forwards args",
      description: "<p>A generic wrapper stays in sync with the wrapped function.</p>",
      code: "function logged<F extends (...args: any[]) => any>(fn: F) {\n" +
        "  return (...args: Parameters<F>): ReturnType<F> => {\n" +
        "    console.log(\"args:\", args);\n" +
        "    return fn(...args);\n" +
        "  };\n" +
        "}\n" +
        "const wrapped = logged(createUser); // same signature as createUser"
    }
  ],
  whenToUse: "<p>Use <code>Parameters&lt;T&gt;</code> when you need a function's argument types derived from the " +
    "function itself &mdash; building type-safe wrappers/decorators/middleware that forward arguments, " +
    "memoization helpers, or re-exposing a third-party function's signature. It keeps the wrapper in lockstep " +
    "with the original: change the function's params and the derived type updates. <strong>Gotchas:</strong> " +
    "it needs a <em>function type</em>, so you typically combine it with <code>typeof fn</code> to get the " +
    "type of an actual function value. It returns a labeled tuple, which you can spread or index " +
    "(<code>Parameters&lt;T&gt;[0]</code> for the first parameter's type). For overloaded functions it only " +
    "captures the <em>last</em> overload signature &mdash; a real limitation when wrapping overloaded APIs. " +
    "Pair it with <code>ReturnType</code> to fully mirror a function's type in higher-order utilities.</p>"
};

C["returntype"] = {
  summary: "<p><strong><code>ReturnType&lt;T&gt;</code></strong> extracts the return type of a function type. " +
    "For <code>() =&gt; { id: number; name: string }</code>, <code>ReturnType&lt;...&gt;</code> is " +
    "<code>{ id: number; name: string }</code>. Like <code>Parameters</code>, it's typically used with " +
    "<code>typeof</code> on a function value. It's invaluable for deriving a type from a function that " +
    "produces it &mdash; avoiding a separately-declared type that could drift &mdash; common with factory " +
    "functions, selectors, action creators, and API client methods.</p>",
  examples: [
    {
      title: "Example 1: Deriving a type from a factory",
      description: "<p>Let the function be the single source of truth for its result type.</p>",
      code: "function makeUser(name: string) {\n" +
        "  return { id: Math.random(), name, createdAt: new Date() };\n" +
        "}\n" +
        "\n" +
        "type User = ReturnType<typeof makeUser>;\n" +
        "// { id: number; name: string; createdAt: Date } - stays in sync automatically"
    },
    {
      title: "Example 2: Typing around a function's output",
      description: "<p>Useful for selectors / action creators in state management.</p>",
      code: "const createAddAction = (value: number) => ({ type: \"add\" as const, value });\n" +
        "type AddAction = ReturnType<typeof createAddAction>;\n" +
        "// { type: \"add\"; value: number }\n" +
        "function reducer(action: AddAction) { /* ... */ }"
    }
  ],
  whenToUse: "<p>Use <code>ReturnType&lt;T&gt;</code> to derive a type from the function that produces it &mdash; " +
    "factory functions, Redux/Zustand action creators and selectors, API methods, and anywhere you'd " +
    "otherwise declare a result type twice (once in the function, once as an interface) and risk them " +
    "diverging. It enforces a single source of truth. <strong>Gotchas:</strong> it requires a function type, " +
    "so use <code>ReturnType&lt;typeof fn&gt;</code> for actual functions. For <code>async</code> functions, " +
    "the return type is a <code>Promise&lt;T&gt;</code> &mdash; combine with <code>Awaited</code> " +
    "(<code>Awaited&lt;ReturnType&lt;typeof fn&gt;&gt;</code>) to get the unwrapped value type. For overloaded " +
    "functions it captures only the last overload's return. Deriving types this way is convenient but couples " +
    "the type to the implementation; for a public API you may still prefer an explicit, documented return " +
    "type as the contract.</p>"
};

C["instancetype"] = {
  summary: "<p><strong><code>InstanceType&lt;T&gt;</code></strong> extracts the instance type produced by a " +
    "constructor function/class type. Given a class <code>C</code>, <code>InstanceType&lt;typeof C&gt;</code> " +
    "is the type of <code>new C()</code> &mdash; effectively the same as just <code>C</code> used as a type, " +
    "but it's essential when you're working with the <em>class itself</em> as a value (a constructor passed " +
    "around generically). It's used in factories, dependency-injection systems, and mixins that operate on " +
    "class constructors and need the resulting instance type.</p>",
  examples: [
    {
      title: "Example 1: Instance type from a class value",
      description: "<p>Get the instance type when you hold the class as a value.</p>",
      code: "class Service { connect() {} status = \"idle\"; }\n" +
        "\n" +
        "type ServiceInstance = InstanceType<typeof Service>; // Service\n" +
        "// (Here it's the same as 'Service'; it matters with generic constructors.)"
    },
    {
      title: "Example 2: A generic factory over constructors",
      description: "<p>Create an instance from any constructor and type it correctly.</p>",
      code: "function create<T extends new (...args: any[]) => any>(\n" +
        "  Ctor: T, ...args: ConstructorParameters<T>\n" +
        "): InstanceType<T> {\n" +
        "  return new Ctor(...args);\n" +
        "}\n" +
        "class User { constructor(public name: string) {} }\n" +
        "const u = create(User, \"Sam\"); // typed as User"
    }
  ],
  whenToUse: "<p>Use <code>InstanceType&lt;T&gt;</code> when you work with classes as <em>values</em> &mdash; " +
    "generic factories that instantiate a passed-in constructor, dependency-injection containers, plugin " +
    "registries, and mixins &mdash; and need the type of the instances they create. In everyday code where " +
    "you just reference a class by name, you don't need it (the class name already is the instance type); it " +
    "earns its place specifically in <em>generic</em> constructor-handling code, usually alongside " +
    "<code>ConstructorParameters&lt;T&gt;</code>. <strong>Gotchas:</strong> the type parameter must be a " +
    "constructor type (<code>new (...args) =&gt; any</code>), so constrain generics accordingly. " +
    "Abstract classes can't be instantiated, so <code>InstanceType</code> of an abstract constructor is " +
    "limited. It's a fairly advanced utility &mdash; if you're not writing constructor-generic infrastructure, " +
    "you'll rarely reach for it.</p>"
};

C["awaited"] = {
  summary: "<p><strong><code>Awaited&lt;T&gt;</code></strong> (TypeScript 4.5+) unwraps the value type that a " +
    "<code>Promise</code> resolves to &mdash; modeling the behavior of <code>await</code> at the type level. " +
    "<code>Awaited&lt;Promise&lt;string&gt;&gt;</code> is <code>string</code>. It recursively unwraps nested " +
    "promises (<code>Promise&lt;Promise&lt;number&gt;&gt;</code> &rarr; <code>number</code>) and handles " +
    "thenables. It's especially useful combined with <code>ReturnType</code> to get the resolved type of an " +
    "<code>async</code> function, which otherwise returns a <code>Promise</code>.</p>",
  examples: [
    {
      title: "Example 1: Unwrapping a promise type",
      description: "<p>Get the resolved value type, including through nesting.</p>",
      code: "type A = Awaited<Promise<string>>;            // string\n" +
        "type B = Awaited<Promise<Promise<number>>>;   // number (recursive)\n" +
        "type C = Awaited<boolean>;                    // boolean (non-promise passes through)"
    },
    {
      title: "Example 2: The resolved type of an async function",
      description: "<p>Combine with <code>ReturnType</code> for async functions.</p>",
      code: "async function fetchUser(id: number) {\n" +
        "  return { id, name: \"Sam\" };\n" +
        "}\n" +
        "type Raw = ReturnType<typeof fetchUser>;          // Promise<{ id: number; name: string }>\n" +
        "type User = Awaited<ReturnType<typeof fetchUser>>; // { id: number; name: string }"
    }
  ],
  whenToUse: "<p>Use <code>Awaited&lt;T&gt;</code> whenever you need the value a promise resolves to as a type " +
    "&mdash; most commonly <code>Awaited&lt;ReturnType&lt;typeof asyncFn&gt;&gt;</code> to derive the resolved " +
    "result type of an <code>async</code> function (since <code>ReturnType</code> alone gives you the " +
    "<code>Promise</code> wrapper). It's also handy in generic utilities that may or may not receive a " +
    "promise. <strong>Gotchas:</strong> it requires TypeScript 4.5+; before that, people hand-rolled " +
    "<code>UnwrapPromise</code> conditional types. It unwraps <em>recursively</em>, which is usually what you " +
    "want but means deeply nested promise types collapse fully. For non-promise types it just returns the " +
    "type unchanged, so it's safe to apply defensively in generic code. It models <code>await</code>'s type " +
    "behavior precisely, making async-heavy type derivations clean and correct.</p>"
};

/* ======================================================================
   SECTION 13 — ADVANCED TYPES
   ====================================================================== */

C["advanced-types"] = {
  summary: "<p><strong>Advanced types</strong> are TypeScript's tools for <em>computing</em> types from other " +
    "types &mdash; type-level programming. The main features are <strong>mapped types</strong> (transform " +
    "each property of a type), <strong>conditional types</strong> (<code>T extends U ? X : Y</code> &mdash; " +
    "choose a type based on a condition), <strong>literal types</strong> (a type that is one exact value), " +
    "<strong>template literal types</strong> (build string literal types), and <strong>recursive types</strong> " +
    "(types that reference themselves, for trees/JSON/nesting). These power the utility types and let you " +
    "express sophisticated, precise relationships &mdash; though they can become complex, so use them where " +
    "they genuinely add safety.</p>",
  examples: [
    {
      title: "Example 1: Mapped + conditional types in action",
      description: "<p>Transform properties and branch on a type.</p>",
      code: "// Mapped: make every property nullable\n" +
        "type Nullable<T> = { [K in keyof T]: T[K] | null };\n" +
        "\n" +
        "// Conditional: pick a type based on a condition\n" +
        "type ElementType<T> = T extends (infer U)[] ? U : T;\n" +
        "type A = ElementType<string[]>; // string\n" +
        "type B = ElementType<number>;   // number"
    },
    {
      title: "Example 2: Template literal + recursive types",
      description: "<p>Construct string types and self-referential structures.</p>",
      code: "type Event = \"click\" | \"hover\";\n" +
        "type Handler = `on${Capitalize<Event>}`; // \"onClick\" | \"onHover\"\n" +
        "\n" +
        "// Recursive type for JSON\n" +
        "type Json = string | number | boolean | null | Json[] | { [k: string]: Json };"
    }
  ],
  whenToUse: "<p>Use advanced types when you need precise, derived types that simpler features can't express &mdash; " +
    "building reusable utility types, typing flexible library APIs, deriving types from data, and enforcing " +
    "relationships between types. They're what make TypeScript's type system uniquely powerful. " +
    "<strong>Gotchas and balance:</strong> type-level programming can spiral into unreadable, hard-to-debug " +
    "'type gymnastics' that slow the compiler and baffle teammates &mdash; complexity here has a real cost. " +
    "Prefer the simplest construct that solves the problem, add comments explaining non-obvious type logic, " +
    "and lean on built-in utility types before hand-rolling. They're invaluable for library authors and " +
    "occasional app-level needs, but if you find yourself writing deeply nested conditional/recursive types " +
    "for ordinary application code, step back &mdash; there's often a simpler design. The sub-topics detail " +
    "each one.</p>"
};

C["mapped-types"] = {
  summary: "<p><strong>Mapped types</strong> create a new type by transforming each property of an existing " +
    "type, using the syntax <code>{ [K in keyof T]: ... }</code>. You iterate over the keys of <code>T</code> " +
    "and produce a new type for each &mdash; optionally adding/removing modifiers (<code>?</code>, " +
    "<code>readonly</code>, with <code>+</code>/<code>-</code>) and remapping keys with <code>as</code>. " +
    "Mapped types are the engine behind utility types like <code>Partial</code>, <code>Readonly</code>, " +
    "<code>Pick</code>, and <code>Record</code>. They let you derive transformed shapes from a single source " +
    "of truth instead of hand-writing each variant.</p>",
  examples: [
    {
      title: "Example 1: Adding and removing modifiers",
      description: "<p>Map over keys and tweak optionality/readonly &mdash; this is how utilities work.</p>",
      code: "// Make every property optional (this IS how Partial is defined)\n" +
        "type MyPartial<T> = { [K in keyof T]?: T[K] };\n" +
        "\n" +
        "// Remove readonly and optional modifiers\n" +
        "type Mutable<T> = { -readonly [K in keyof T]-?: T[K] };\n" +
        "\n" +
        "// Transform value types\n" +
        "type Stringify<T> = { [K in keyof T]: string };"
    },
    {
      title: "Example 2: Key remapping with 'as'",
      description: "<p>Rename or filter keys while mapping.</p>",
      code: "// Generate getter method names from properties\n" +
        "type Getters<T> = {\n" +
        "  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]\n" +
        "};\n" +
        "type UserGetters = Getters<{ name: string; age: number }>;\n" +
        "// { getName: () => string; getAge: () => number }"
    }
  ],
  whenToUse: "<p>Use mapped types to derive a transformed version of a type &mdash; making properties optional/" +
    "readonly/nullable, converting value types, generating related shapes (getters, event maps), or building " +
    "your own utility types when the built-ins don't fit. They keep types DRY and in sync with their source. " +
    "<strong>Gotchas:</strong> mapped types operate at one level (transforming top-level properties); for " +
    "nested transformation you combine them recursively. Key remapping with <code>as</code> (TS 4.1+) is " +
    "powerful but can get cryptic &mdash; comment non-obvious mappings. They can also strip away things you " +
    "didn't expect (index signatures, methods) depending on how you write them. Most everyday needs are " +
    "already covered by built-in utility types (which are mapped types) &mdash; write custom ones when you " +
    "have a genuine, repeated transformation, not for a one-off where a plain interface is clearer.</p>"
};

C["conditional-types"] = {
  summary: "<p><strong>Conditional types</strong> select one of two types based on a condition, using the " +
    "ternary-like syntax <code>T extends U ? X : Y</code> &mdash; 'if T is assignable to U, the type is X, " +
    "otherwise Y'. They enable type-level decision-making and, with the <strong><code>infer</code></strong> " +
    "keyword, let you <em>extract</em> a type from within another (e.g. the element type of an array, the " +
    "return type of a function). Over unions they distribute (apply to each member). Conditional types power " +
    "many utility types (<code>Exclude</code>, <code>ReturnType</code>, <code>Awaited</code>) and advanced " +
    "library typings.</p>",
  examples: [
    {
      title: "Example 1: Branching and inferring",
      description: "<p>Choose a type, and extract an inner type with <code>infer</code>.</p>",
      code: "// Branch on a condition\n" +
        "type IsString<T> = T extends string ? \"yes\" : \"no\";\n" +
        "type A = IsString<\"hi\">;  // \"yes\"\n" +
        "type B = IsString<42>;     // \"no\"\n" +
        "\n" +
        "// Extract with infer (this is how ReturnType works)\n" +
        "type MyReturn<T> = T extends (...args: any[]) => infer R ? R : never;\n" +
        "type C = MyReturn<() => number>; // number"
    },
    {
      title: "Example 2: Distribution over unions",
      description: "<p>Conditional types apply to each member of a union.</p>",
      code: "type ToArray<T> = T extends any ? T[] : never;\n" +
        "type Arr = ToArray<string | number>; // string[] | number[]  (distributed!)\n" +
        "// Each union member is processed separately, then re-unioned."
    }
  ],
  whenToUse: "<p>Use conditional types when a type genuinely depends on another type &mdash; building flexible " +
    "utility types, extracting inner types with <code>infer</code> (element of an array, resolved value of a " +
    "promise, params/return of a function), and writing adaptive library APIs whose output type varies with " +
    "input. They're the workhorse of advanced type derivation. <strong>Gotchas:</strong> the " +
    "<em>distributive</em> behavior over unions (each member handled separately) is powerful but surprising &mdash; " +
    "wrap in a tuple (<code>[T] extends [U] ? ...</code>) to disable distribution when you want the union " +
    "treated as a whole. Nested conditionals quickly become unreadable and produce baffling error messages; " +
    "keep them shallow and well-named. The compiler can struggle with very complex conditional types " +
    "(performance, depth limits). Reach for them for real type-level logic, not to over-engineer ordinary " +
    "application types.</p>"
};

C["literal-types"] = {
  summary: "<p><strong>Literal types</strong> are types whose value is one <em>exact</em> literal &mdash; not " +
    "just <code>string</code> but the specific string <code>\"active\"</code>; not <code>number</code> but " +
    "<code>42</code>; not <code>boolean</code> but <code>true</code>. On their own they're rarely useful, but " +
    "combined into <strong>unions</strong> (<code>\"sm\" | \"md\" | \"lg\"</code>) they model a fixed set of " +
    "allowed values with full autocomplete and typo-checking &mdash; a lighter, simpler alternative to enums. " +
    "TypeScript infers literal types for <code>const</code> declarations and <code>as const</code> values, " +
    "and widens them to the base type for <code>let</code>.</p>",
  examples: [
    {
      title: "Example 1: Literal unions for fixed value sets",
      description: "<p>Restrict a value to exact options &mdash; autocompleted and typo-safe.</p>",
      code: "type Size = \"small\" | \"medium\" | \"large\";\n" +
        "function setSize(size: Size) { /* ... */ }\n" +
        "setSize(\"medium\"); // OK, autocompleted\n" +
        "setSize(\"mdium\");  // ERROR: typo caught at compile time\n" +
        "\n" +
        "type Dice = 1 | 2 | 3 | 4 | 5 | 6;   // numeric literal union"
    },
    {
      title: "Example 2: Widening, and keeping literals",
      description: "<p><code>let</code> widens; <code>const</code>/<code>as const</code> keeps the literal.</p>",
      code: "let a = \"active\";          // widened to string\n" +
        "const b = \"active\";        // literal \"active\"\n" +
        "const obj = { role: \"admin\" };          // role: string (widened)\n" +
        "const obj2 = { role: \"admin\" } as const; // role: \"admin\" (literal)"
    }
  ],
  whenToUse: "<p>Use literal-type unions for any value restricted to a known, fixed set &mdash; sizes, statuses, " +
    "HTTP methods, variants, modes. They give autocomplete, reject typos, and enable exhaustive checking, all " +
    "with <em>zero</em> runtime footprint &mdash; which is why they're widely preferred over enums. " +
    "<strong>Gotchas:</strong> inference 'widens' literals in mutable positions (<code>let</code>, object " +
    "properties) to the base type, so use <code>const</code>, an explicit literal type annotation, or " +
    "<code>as const</code> to preserve them when needed. Very large literal unions can slow the compiler and " +
    "bloat error messages. Combine literals with template literal types for patterns, and pair them with " +
    "discriminated unions (a literal 'tag' field) for the cleanest modeling of alternatives. Prefer literal " +
    "unions to loose <code>string</code>/<code>number</code> whenever the set of valid values is actually " +
    "finite.</p>"
};

C["template-literal-types"] = {
  summary: "<p><strong>Template literal types</strong> (TS 4.1+) build new string literal types by " +
    "interpolating other types into a template, mirroring JavaScript's template strings but at the type " +
    "level: <code>`on${Capitalize&lt;Event&gt;}`</code>. They can combine unions (producing the cross-" +
    "product of all combinations), use intrinsic string manipulation types (<code>Uppercase</code>, " +
    "<code>Lowercase</code>, <code>Capitalize</code>, <code>Uncapitalize</code>), and pattern-match strings " +
    "with <code>infer</code>. They enable precise typing of string-based APIs &mdash; event names, CSS units, " +
    "route paths, prefixed keys &mdash; that previously required loose <code>string</code> types.</p>",
  examples: [
    {
      title: "Example 1: Building string types from unions",
      description: "<p>Interpolating unions produces every combination.</p>",
      code: "type Color = \"red\" | \"blue\";\n" +
        "type Shade = \"light\" | \"dark\";\n" +
        "type Variant = `${Shade}-${Color}`;\n" +
        "// \"light-red\" | \"light-blue\" | \"dark-red\" | \"dark-blue\"\n" +
        "\n" +
        "type Event = \"click\" | \"focus\";\n" +
        "type Handler = `on${Capitalize<Event>}`; // \"onClick\" | \"onFocus\""
    },
    {
      title: "Example 2: Pattern-matching strings with infer",
      description: "<p>Extract parts of a string type.</p>",
      code: "// Pull the param name out of a route segment\n" +
        "type ParamName<T> = T extends `:${infer Name}` ? Name : never;\n" +
        "type P = ParamName<\":userId\">; // \"userId\"\n" +
        "\n" +
        "type Pixel = `${number}px`;\n" +
        "const m: Pixel = \"16px\"; // \"16\" alone would error"
    }
  ],
  whenToUse: "<p>Use template literal types to precisely type string-based patterns &mdash; event handler names " +
    "(<code>on*</code>), CSS values (<code>`${number}px`</code>), prefixed/namespaced keys, typed route " +
    "params, and APIs where strings follow a structure. They turn 'just a string' into 'a string of exactly " +
    "this shape', catching typos and enabling autocomplete. <strong>Gotchas:</strong> combining multiple " +
    "unions creates a <em>cross-product</em> that can explode into thousands of members &mdash; large " +
    "combinations slow the compiler and produce huge error messages, so keep the inputs bounded. They're a " +
    "relatively advanced feature; for simple cases a plain literal union is clearer. They shine for library " +
    "authors typing string-pattern APIs and for occasional app needs (typed routes), but don't over-apply " +
    "them to ordinary strings where the extra precision isn't worth the complexity.</p>"
};

C["recursive-types"] = {
  summary: "<p><strong>Recursive types</strong> are types that reference themselves in their own definition, " +
    "used to model nested, tree-like, or arbitrarily-deep structures &mdash; JSON, file-system trees, linked " +
    "lists, nested comments, category hierarchies. A type alias can refer to itself (directly or through " +
    "another type), letting you describe data of unbounded depth with a finite definition. Recursive types " +
    "also appear in advanced 'type gymnastics' (recursive conditional/mapped types) to process types of " +
    "unknown depth, like a <code>DeepReadonly</code> or <code>DeepPartial</code>.</p>",
  examples: [
    {
      title: "Example 1: Modeling tree-shaped data",
      description: "<p>A self-referential type for arbitrarily nested structures.</p>",
      code: "// JSON value - references itself for arrays and objects\n" +
        "type Json =\n" +
        "  | string | number | boolean | null\n" +
        "  | Json[]\n" +
        "  | { [key: string]: Json };\n" +
        "\n" +
        "// A category tree\n" +
        "interface Category { name: string; children: Category[]; }"
    },
    {
      title: "Example 2: Recursive utility type (deep transformation)",
      description: "<p>Apply a transformation at every level of nesting.</p>",
      code: "type DeepReadonly<T> = {\n" +
        "  readonly [K in keyof T]: T[K] extends object\n" +
        "    ? DeepReadonly<T[K]>   // recurse into nested objects\n" +
        "    : T[K];\n" +
        "};\n" +
        "type Frozen = DeepReadonly<{ a: { b: { c: number } } }>; // readonly all the way down"
    }
  ],
  whenToUse: "<p>Use recursive types to model genuinely nested/unbounded data &mdash; JSON, trees, menus, " +
    "comment threads, org charts &mdash; and to write deep utility types (<code>DeepPartial</code>, " +
    "<code>DeepReadonly</code>) when the shallow built-ins aren't enough. They're the only way to type " +
    "structures whose depth isn't known in advance. <strong>Gotchas:</strong> deep recursive <em>computed</em> " +
    "types (recursive conditional/mapped types) can hit TypeScript's recursion-depth limits and noticeably " +
    "slow type-checking on large inputs &mdash; keep them as simple as possible and bounded where you can. " +
    "Recursive <em>data</em> types (like the JSON example) are cheap and common; recursive <em>type-level " +
    "computation</em> is advanced and best reserved for library code. As always, if a recursive type becomes " +
    "incomprehensible, document it well or reconsider whether a simpler shape would do.</p>"
};

/* ======================================================================
   SECTION 14 — TYPESCRIPT MODULES
   ====================================================================== */

C["typescript-modules"] = {
  summary: "<p><strong>Modules</strong> are how TypeScript organizes code into separate files with explicit " +
    "<code>import</code>/<code>export</code> boundaries. TypeScript uses standard <strong>ES Modules</strong> " +
    "syntax (<code>export</code>/<code>import</code>), and any file with a top-level import or export is a " +
    "module (its declarations are scoped to the file, not global). The system also includes older " +
    "<strong>namespaces</strong> (internal modules), <strong>ambient modules</strong> and declaration files " +
    "(<code>.d.ts</code>) for describing non-TS code, and <strong>augmentation</strong> for extending " +
    "existing module or global types. Understanding modules &mdash; and how TS resolves and emits them &mdash; " +
    "is essential for structuring real projects.</p>",
  examples: [
    {
      title: "Example 1: ES module import/export",
      description: "<p>The standard, recommended way to share code between files.</p>",
      code: "// math.ts\n" +
        "export function add(a: number, b: number) { return a + b; }\n" +
        "export const PI = 3.14159;\n" +
        "export default class Calculator { /* ... */ }\n" +
        "\n" +
        "// app.ts\n" +
        "import Calculator, { add, PI } from \"./math\";\n" +
        "import type { SomeType } from \"./types\"; // type-only import (erased)"
    },
    {
      title: "Example 2: Module vs script scope",
      description: "<p>An export/import makes a file a module with its own scope.</p>",
      code: "// Without any import/export, a .ts file is a 'script':\n" +
        "// its top-level declarations are GLOBAL (can clash across files).\n" +
        "\n" +
        "// Adding even an empty export makes it a module (file-scoped):\n" +
        "export {};\n" +
        "const helper = 1; // now scoped to this file, not global"
    }
  ],
  whenToUse: "<p>Use ES module <code>import</code>/<code>export</code> for organizing essentially all modern " +
    "TypeScript code &mdash; it's the standard, works everywhere, and enables tree-shaking. Use " +
    "<strong>type-only imports/exports</strong> (<code>import type</code>) for types you only use in " +
    "annotations so they're fully erased and don't cause runtime imports or cycles. <strong>Gotchas:</strong> " +
    "the trickiest part is <em>module configuration</em> &mdash; <code>module</code> and " +
    "<code>moduleResolution</code> in tsconfig must match your runtime (Node ESM vs CommonJS vs bundler), and " +
    "mismatches cause baffling import errors and <code>.js</code> extension requirements under " +
    "<code>NodeNext</code>. Prefer ES modules over the legacy <code>namespace</code> feature for new code. " +
    "The sub-topics cover namespaces, ambient/external modules, and the augmentation techniques for extending " +
    "existing types.</p>"
};

C["namespaces"] = {
  summary: "<p><strong>Namespaces</strong> (formerly 'internal modules') are TypeScript's older mechanism for " +
    "grouping related code under a single named scope, declared with the <code>namespace</code> keyword. They " +
    "prevent global naming collisions by nesting declarations and were widely used before ES Modules became " +
    "standard, especially with global scripts loaded via <code>&lt;script&gt;</code> tags. Today they're " +
    "<strong>largely legacy</strong> for application code &mdash; ES Modules (<code>import</code>/" +
    "<code>export</code>) are the recommended way to organize code. Namespaces still appear in some " +
    "declaration files (<code>.d.ts</code>) and older codebases.</p>",
  examples: [
    {
      title: "Example 1: Grouping with a namespace",
      description: "<p>Related code nested under one name, only <code>export</code>ed members are visible.</p>",
      code: "namespace Geometry {\n" +
        "  export function area(r: number) { return Math.PI * r ** 2; }\n" +
        "  const helper = 2;          // not exported -> private to the namespace\n" +
        "}\n" +
        "Geometry.area(5); // access via the namespace name"
    },
    {
      title: "Example 2: The modern ES-module equivalent",
      description: "<p>Prefer modules &mdash; they do the same job with standard syntax + tree-shaking.</p>",
      code: "// geometry.ts (a module)\n" +
        "export function area(r: number) { return Math.PI * r ** 2; }\n" +
        "\n" +
        "// consumer.ts\n" +
        "import { area } from \"./geometry\";\n" +
        "area(5); // standard, bundler-friendly, the recommended approach"
    }
  ],
  whenToUse: "<p>For <strong>new application code, prefer ES Modules</strong> &mdash; namespaces are mostly " +
    "legacy. Their few remaining legitimate uses: organizing large declaration files (<code>.d.ts</code>) for " +
    "libraries that expose a global object with nested members, working in environments without a module " +
    "bundler/loader (rare today), or maintaining existing namespace-based code. <strong>Gotchas:</strong> " +
    "namespaces don't tree-shake well (bundlers can't eliminate unused parts as effectively as ES module " +
    "exports), can encourage giant single-file groupings, and mixing namespaces with modules is confusing. " +
    "Don't introduce namespaces to 'organize' a module-based project &mdash; folders and module imports do " +
    "that better. Know how to read them (you'll see them in type definitions and older code), but reach for " +
    "ES Modules by default.</p>"
};

C["ambient-modules"] = {
  summary: "<p><strong>Ambient modules</strong> are declarations that describe the <em>types</em> of code " +
    "that exists elsewhere &mdash; typically JavaScript libraries without their own types, or non-code assets " +
    "&mdash; without providing an implementation. You declare them in <code>.d.ts</code> declaration files " +
    "using <code>declare module \"name\" { ... }</code>. This tells TypeScript 'a module by this name exists " +
    "and has this shape', so you can <code>import</code> it with type safety even though TypeScript can't see " +
    "its source. It's the mechanism behind <code>@types/*</code> packages and how you type untyped " +
    "dependencies or special imports (CSS, images, etc.).</p>",
  examples: [
    {
      title: "Example 1: Typing an untyped JS library",
      description: "<p>Declare the shape of a module that ships no types.</p>",
      code: "// types/legacy-lib.d.ts\n" +
        "declare module \"legacy-lib\" {\n" +
        "  export function doThing(input: string): number;\n" +
        "  export const version: string;\n" +
        "}\n" +
        "\n" +
        "// Now this import is type-safe:\n" +
        "import { doThing } from \"legacy-lib\";\n" +
        "const n = doThing(\"x\"); // typed as number"
    },
    {
      title: "Example 2: Declaring non-code imports",
      description: "<p>Teach TypeScript about importing CSS/images (handled by a bundler).</p>",
      code: "// globals.d.ts\n" +
        "declare module \"*.css\";\n" +
        "declare module \"*.png\" {\n" +
        "  const url: string;\n" +
        "  export default url;\n" +
        "}\n" +
        "// import logo from \"./logo.png\"; // now typed (bundler provides the value)"
    }
  ],
  whenToUse: "<p>Use ambient module declarations when you need types for something TypeScript can't infer: a " +
    "JavaScript dependency with no bundled types and no <code>@types</code> package, internal untyped " +
    "modules, or non-JS imports (CSS modules, images, SVGs, GraphQL files) that your bundler handles at " +
    "runtime. They let you keep type safety at these boundaries instead of falling back to <code>any</code>. " +
    "<strong>Gotchas:</strong> ambient declarations are <em>unchecked promises</em> &mdash; TypeScript trusts " +
    "your declared shape without verifying it matches the real module, so an inaccurate declaration causes " +
    "runtime surprises. Prefer an official or community <code>@types/*</code> package over hand-writing " +
    "declarations when one exists. Keep declaration files focused and place them where tsconfig includes them. " +
    "A minimal <code>declare module \"name\";</code> (no body) gives the module an <code>any</code> type &mdash; " +
    "a quick escape hatch, but you lose safety, so flesh out the shape when it matters.</p>"
};

C["external-modules"] = {
  summary: "<p><strong>External modules</strong> is the older term for what we now simply call " +
    "<strong>modules</strong> &mdash; files that use <code>import</code>/<code>export</code> and correspond to " +
    "a real module in the output (ES Modules or CommonJS), as opposed to TypeScript's <em>internal</em> " +
    "modules (namespaces). In modern usage, 'external module' just means a standard ES/CommonJS module: each " +
    "file is its own module, dependencies are loaded via <code>import</code>, and the module system " +
    "(configured by <code>module</code>/<code>moduleResolution</code>) determines how they're resolved and " +
    "emitted. Understanding module resolution &mdash; how TypeScript finds <code>./foo</code> vs a package in " +
    "<code>node_modules</code> &mdash; is the practical core of this topic.</p>",
  examples: [
    {
      title: "Example 1: Relative vs package imports",
      description: "<p>How the module resolver distinguishes local files from dependencies.</p>",
      code: "// Relative import -> a file in your project\n" +
        "import { helper } from \"./utils/helper\";\n" +
        "import { config } from \"../config\";\n" +
        "\n" +
        "// Bare import -> resolved from node_modules (a package)\n" +
        "import express from \"express\";\n" +
        "import { z } from \"zod\";"
    },
    {
      title: "Example 2: Module config must match the runtime",
      description: "<p>The <code>module</code>/<code>moduleResolution</code> settings control resolution and output.</p>",
      code: "// tsconfig.json\n" +
        "{\n" +
        "  \"compilerOptions\": {\n" +
        "    \"module\": \"NodeNext\",          // emit + resolve as modern Node ESM/CJS\n" +
        "    \"moduleResolution\": \"NodeNext\"  // how bare/relative specifiers are found\n" +
        "  }\n" +
        "}\n" +
        "// Under NodeNext ESM, relative imports need explicit extensions: \"./helper.js\""
    }
  ],
  whenToUse: "<p>You use external/ES modules for all normal code organization &mdash; this is just 'how modules " +
    "work' in modern TypeScript. The real skill is configuring and understanding <strong>module resolution</strong> " +
    "so imports resolve correctly in your target environment. <strong>Gotchas:</strong> the " +
    "<code>module</code>/<code>moduleResolution</code> options are a frequent source of confusion &mdash; the " +
    "right values depend on whether you target Node (ESM vs CommonJS), a browser, or a bundler, and getting " +
    "them wrong yields cryptic 'cannot find module' or interop errors. Under Node's ESM (<code>NodeNext</code>), " +
    "relative imports must include the file extension (<code>./helper.js</code>, even from a <code>.ts</code> " +
    "file), which trips people up. CommonJS/ESM interop (<code>esModuleInterop</code>, default vs named " +
    "imports) adds further subtlety. When in doubt, match a known-good config for your runtime/bundler rather " +
    "than guessing.</p>"
};

C["namespace-augmentation"] = {
  summary: "<p><strong>Namespace (module) augmentation</strong> lets you <em>add</em> declarations to an " +
    "existing module's types from your own code &mdash; extending a third-party module's interfaces without " +
    "modifying its source. Using <code>declare module \"some-module\" { ... }</code> inside a file that's " +
    "already a module, you can add properties to an interface the library exports (relying on declaration " +
    "merging). It's commonly used to extend framework types &mdash; adding a custom property to Express's " +
    "<code>Request</code>, augmenting a plugin system, or adding fields to a library's config interface.</p>",
  examples: [
    {
      title: "Example 1: Augmenting a library's interface",
      description: "<p>Add a custom property to Express's Request type.</p>",
      code: "// express-augment.d.ts\n" +
        "import \"express\";\n" +
        "declare module \"express\" {\n" +
        "  interface Request {\n" +
        "    user?: { id: string; role: string }; // add to existing Request\n" +
        "  }\n" +
        "}\n" +
        "\n" +
        "// Now req.user is typed everywhere:\n" +
        "// app.get(\"/\", (req, res) => { const id = req.user?.id; });"
    },
    {
      title: "Example 2: Augmenting a module's exported type",
      description: "<p>Extend a config interface a library exposes.</p>",
      code: "import \"some-plugin\";\n" +
        "declare module \"some-plugin\" {\n" +
        "  interface PluginOptions {\n" +
        "    myCustomFlag?: boolean; // merged into the library's options type\n" +
        "  }\n" +
        "}"
    }
  ],
  whenToUse: "<p>Use module augmentation to extend third-party types you can't edit &mdash; adding " +
    "request-scoped data to framework request objects (Express/Koa), registering custom config or plugin " +
    "fields, or filling gaps in a library's types. It's the clean, type-safe alternative to casting to " +
    "<code>any</code> when a library's types don't quite cover your usage. <strong>Gotchas:</strong> the " +
    "augmenting file must itself be a module (have an import/export) for <code>declare module</code> to " +
    "<em>augment</em> rather than <em>replace</em> &mdash; a top-level <code>declare module</code> in a " +
    "non-module file declares a new ambient module instead, a common mistake. Augmentation only changes " +
    "types, not runtime behavior, so you must still actually populate the property at runtime (e.g. middleware " +
    "that sets <code>req.user</code>). Keep augmentations in clearly-named declaration files and use them " +
    "sparingly &mdash; overusing them to bolt arbitrary fields onto library types can hide design problems.</p>"
};

C["global-augmentation"] = {
  summary: "<p><strong>Global augmentation</strong> lets you add or modify declarations in the <em>global</em> " +
    "scope &mdash; extending built-in global types like <code>Window</code>, <code>globalThis</code>, " +
    "<code>Array</code>, or <code>process.env</code>, or declaring genuinely global variables. You use " +
    "<code>declare global { ... }</code> inside a module file. It's how you tell TypeScript about globals " +
    "added at runtime (a script-injected variable, a polyfill method, environment variables) so they're " +
    "typed everywhere without importing. Like other augmentation, it relies on declaration merging and " +
    "changes types only, not runtime values.</p>",
  examples: [
    {
      title: "Example 1: Adding to the global Window",
      description: "<p>Type a global injected by a script or analytics SDK.</p>",
      code: "// global.d.ts (must be a module, hence 'export {}')\n" +
        "export {};\n" +
        "declare global {\n" +
        "  interface Window {\n" +
        "    dataLayer: unknown[];        // added by an analytics snippet\n" +
        "    myAppVersion: string;\n" +
        "  }\n" +
        "}\n" +
        "window.dataLayer.push({ event: \"load\" }); // now typed"
    },
    {
      title: "Example 2: Typing environment variables",
      description: "<p>Give <code>process.env</code> known, typed keys.</p>",
      code: "export {};\n" +
        "declare global {\n" +
        "  namespace NodeJS {\n" +
        "    interface ProcessEnv {\n" +
        "      DATABASE_URL: string;\n" +
        "      NODE_ENV: \"development\" | \"production\" | \"test\";\n" +
        "    }\n" +
        "  }\n" +
        "}\n" +
        "// process.env.NODE_ENV is now a typed union, not just string | undefined"
    }
  ],
  whenToUse: "<p>Use global augmentation to type genuinely global things &mdash; variables injected by external " +
    "scripts (analytics, feature flags on <code>window</code>), polyfilled methods, or known " +
    "<code>process.env</code> keys &mdash; so they're safely typed across the whole project without imports. " +
    "<strong>Gotchas:</strong> the file must be a module (include an <code>export {}</code> or other import/" +
    "export) for <code>declare global</code> to work as augmentation. It only affects <em>types</em> &mdash; " +
    "you still need the runtime value to actually exist (e.g. the analytics script must really set " +
    "<code>window.dataLayer</code>), and typing <code>process.env</code> keys doesn't guarantee they're set " +
    "(validate env vars at startup). <strong>Use it sparingly:</strong> globals are generally an anti-pattern " +
    "&mdash; prefer explicit imports and dependency passing. Reserve global augmentation for things that are " +
    "<em>truly</em> global by nature (browser/runtime APIs, env config), not as a shortcut to avoid proper " +
    "module structure.</p>"
};

/* ======================================================================
   SECTION 15 — ECOSYSTEM
   ====================================================================== */

C["ecosystem"] = {
  summary: "<p>The TypeScript <strong>ecosystem</strong> is the surrounding tooling that makes day-to-day " +
    "development productive: <strong>formatters</strong> (Prettier) for consistent style, <strong>linters</strong> " +
    "(ESLint with typescript-eslint) for catching bugs and enforcing conventions, <strong>build tools / " +
    "bundlers</strong> (Vite, esbuild, swc, tsup, Webpack) for compiling and packaging, and a rich set of " +
    "<strong>useful packages</strong> (validation like Zod, utilities, test runners). These tools are " +
    "mature and widely adopted; knowing the standard choices and how they fit together is as important to " +
    "real-world TypeScript work as the language itself.</p>",
  examples: [
    {
      title: "Example 1: A typical tooling setup",
      description: "<p>The common stack and the scripts that tie it together.</p>",
      code: "// package.json scripts\n" +
        "{\n" +
        "  \"scripts\": {\n" +
        "    \"dev\": \"vite\",                 // dev server + fast HMR\n" +
        "    \"build\": \"vite build\",         // bundle for production\n" +
        "    \"typecheck\": \"tsc --noEmit\",   // verify types (bundlers often skip this)\n" +
        "    \"lint\": \"eslint .\",            // catch bugs / enforce rules\n" +
        "    \"format\": \"prettier --write .\" // consistent formatting\n" +
        "  }\n" +
        "}"
    },
    {
      title: "Example 2: Separation of concerns among tools",
      description: "<p>Each tool has a focused job; together they cover the workflow.</p>",
      code: "// Prettier  -> formatting (style only, no logic)\n" +
        "// ESLint     -> code quality / bug-catching rules\n" +
        "// tsc        -> type correctness (the source of truth for types)\n" +
        "// Vite/esbuild -> fast transpile + bundle (often WITHOUT type-checking)\n" +
        "// Run tsc --noEmit separately so transpile-only speed doesn't hide type errors."
    }
  ],
  whenToUse: "<p>Set up the standard ecosystem tools on essentially every real project &mdash; they're not " +
    "optional niceties but the baseline for productive, maintainable TypeScript. Adopt a formatter and linter " +
    "from day one (and run them in CI/pre-commit), and choose a build tool matching your context (Vite for " +
    "apps, tsup/esbuild for libraries, framework CLIs where applicable). <strong>Key gotcha:</strong> most " +
    "fast bundlers (esbuild/swc-based) <em>transpile without type-checking</em> for speed, so a successful " +
    "build does <em>not</em> mean your types are correct &mdash; always run <code>tsc --noEmit</code> " +
    "separately (in CI) as the type source of truth. Keep the tools' responsibilities separate (formatting vs " +
    "linting vs type-checking) rather than overlapping them. The sub-topics cover formatting, linting, useful " +
    "packages, and build tools individually.</p>"
};

C["formatting"] = {
  summary: "<p><strong>Formatting</strong> handles the visual style of code &mdash; indentation, spacing, " +
    "quotes, line length, trailing commas &mdash; automatically and consistently. The dominant tool is " +
    "<strong>Prettier</strong>, an opinionated formatter that reprints your code to a consistent style on " +
    "save or commit. Formatting is purely about appearance, not correctness or bugs (that's linting's job). " +
    "Automating it removes style debates from code review, produces clean diffs (only real changes show), and " +
    "lets everyone write code however they like while the tool normalizes it.</p>",
  examples: [
    {
      title: "Example 1: Prettier config and usage",
      description: "<p>A small config plus a command formats the whole project.</p>",
      code: "// .prettierrc (checked into the repo)\n" +
        "{\n" +
        "  \"semi\": true,\n" +
        "  \"singleQuote\": true,\n" +
        "  \"printWidth\": 100,\n" +
        "  \"trailingComma\": \"all\"\n" +
        "}\n" +
        "\n" +
        "// format everything\n" +
        "// npx prettier --write ."
    },
    {
      title: "Example 2: Automate so nobody formats by hand",
      description: "<p>Run on save and pre-commit so style is never manual or debated.</p>",
      code: "// Editor: format on save (VS Code setting)\n" +
        "//   \"editor.formatOnSave\": true\n" +
        "\n" +
        "// Pre-commit hook (e.g. husky + lint-staged) formats staged files:\n" +
        "//   \"lint-staged\": { \"*.{ts,tsx}\": \"prettier --write\" }\n" +
        "// -> every commit is consistently formatted, automatically."
    }
  ],
  whenToUse: "<p>Adopt an automated formatter (Prettier) on every project, configured once and enforced via " +
    "format-on-save plus a pre-commit hook and/or CI check. It pays off immediately: zero style arguments, " +
    "clean reviewable diffs, and consistent code regardless of who wrote it. <strong>Best practices and " +
    "gotchas:</strong> keep formatting (Prettier) and linting (ESLint) <em>separate</em> &mdash; historically " +
    "people ran style rules through ESLint, but the modern guidance is to let Prettier own formatting and " +
    "ESLint own code-quality rules, avoiding conflicts (disable ESLint's stylistic rules). Commit the config " +
    "so the whole team shares it. Don't bikeshed the settings &mdash; the specific choices matter far less " +
    "than picking one and automating it. Run it in CI so unformatted code can't merge.</p>"
};

C["linting"] = {
  summary: "<p><strong>Linting</strong> analyzes your code for likely bugs, suspicious patterns, and " +
    "convention violations &mdash; beyond what the type checker catches. The standard is <strong>ESLint</strong> " +
    "with the <strong>typescript-eslint</strong> plugin, which understands TypeScript and can use type " +
    "information for powerful rules (e.g. flagging floating promises, unsafe <code>any</code> usage, " +
    "no-unused-vars). Unlike formatting (style) or type-checking (type correctness), linting enforces " +
    "<em>code quality</em> and team conventions, catching real problems like unhandled promises, accidental " +
    "<code>==</code>, and dead code. It's configurable via rule sets and runs in editors, pre-commit, and " +
    "CI.</p>",
  examples: [
    {
      title: "Example 1: A TypeScript ESLint setup",
      description: "<p>Enable type-aware linting with recommended rule sets.</p>",
      code: "// eslint.config.js (flat config)\n" +
        "import tseslint from \"typescript-eslint\";\n" +
        "export default tseslint.config(\n" +
        "  ...tseslint.configs.recommendedTypeChecked, // type-aware rules\n" +
        "  {\n" +
        "    rules: {\n" +
        "      \"@typescript-eslint/no-floating-promises\": \"error\", // unhandled promises\n" +
        "      \"@typescript-eslint/no-explicit-any\": \"warn\",\n" +
        "    },\n" +
        "  }\n" +
        ");"
    },
    {
      title: "Example 2: Catching a real bug linting finds",
      description: "<p>Type-aware rules catch problems the compiler allows.</p>",
      code: "async function save() { /* ... */ }\n" +
        "\n" +
        "function handler() {\n" +
        "  save(); // no-floating-promises ERROR: promise not awaited/handled\n" +
        "          // (a silent bug: errors are swallowed, ordering not guaranteed)\n" +
        "}"
    }
  ],
  whenToUse: "<p>Use ESLint + typescript-eslint on every project to catch bugs and enforce conventions the type " +
    "system doesn't &mdash; floating/unhandled promises, unsafe <code>any</code>, unused code, accidental " +
    "loose equality, and team-specific rules. Run it in your editor (instant feedback), pre-commit, and CI " +
    "(block merges on errors). Enable the <em>type-aware</em> rule sets for the most powerful checks. " +
    "<strong>Gotchas:</strong> type-aware linting requires ESLint to access your <code>tsconfig</code> and is " +
    "slower &mdash; configure it correctly and scope it. Keep linting focused on <em>code quality</em> and " +
    "leave formatting to Prettier (disable ESLint's stylistic rules to avoid conflicts). Avoid an avalanche " +
    "of rules that produce noise the team learns to ignore &mdash; start from a recommended preset and add " +
    "rules deliberately. Treat lint errors as real signals, not nags; if a rule is wrong for your project, " +
    "disable it intentionally rather than sprinkling inline ignores.</p>"
};

C["useful-packages"] = {
  summary: "<p>The TypeScript ecosystem has many <strong>useful packages</strong> that complement the " +
    "language. Standouts include <strong>runtime validation</strong> libraries (Zod, Valibot, io-ts) that " +
    "validate external data <em>and</em> infer static types from one schema; <strong>test runners</strong> " +
    "(Vitest, Jest) with first-class TS support; <strong>utility</strong> libraries (date-fns, lodash with " +
    "<code>@types</code>, ts-pattern for pattern matching, type-fest for extra utility types); and " +
    "framework-specific tooling. The most important category for type-safety is runtime validation, because " +
    "TypeScript's types are erased at runtime &mdash; these libraries bridge the gap between compile-time " +
    "types and untrusted runtime data.</p>",
  examples: [
    {
      title: "Example 1: Zod — validate and infer types together",
      description: "<p>One schema gives both runtime validation and a static type.</p>",
      code: "import { z } from \"zod\";\n" +
        "\n" +
        "const UserSchema = z.object({\n" +
        "  id: z.number(),\n" +
        "  email: z.string().email(),\n" +
        "});\n" +
        "type User = z.infer<typeof UserSchema>; // { id: number; email: string }\n" +
        "\n" +
        "const user = UserSchema.parse(await res.json()); // throws if shape is wrong\n" +
        "// 'user' is now BOTH validated at runtime AND typed at compile time."
    },
    {
      title: "Example 2: Bridging the runtime/compile-time gap",
      description: "<p>Validation turns untrusted <code>unknown</code> into a trusted type safely.</p>",
      code: "// Types alone DON'T validate - this lies at runtime:\n" +
        "const bad = (await res.json()) as User; // shape NOT checked\n" +
        "\n" +
        "// Validation actually checks at the boundary:\n" +
        "const good = UserSchema.parse(await res.json()); // verified, then typed"
    }
  ],
  whenToUse: "<p>Reach for ecosystem packages to fill gaps TypeScript leaves: most importantly, use a " +
    "<strong>runtime validation library (Zod et al.) at every trust boundary</strong> &mdash; API responses, " +
    "form input, env vars, message payloads &mdash; because TypeScript types are erased and do <em>not</em> " +
    "validate real data; a single schema gives you both validation and an inferred type, eliminating drift. " +
    "Add a modern test runner (Vitest), utility libraries as needed, and <code>type-fest</code> for advanced " +
    "utility types. <strong>Gotchas:</strong> don't over-add dependencies &mdash; each is maintenance and " +
    "bundle weight; prefer well-maintained, widely-used libraries. Ensure any JS library has types (bundled " +
    "or <code>@types/*</code>), or you lose safety. The key mental shift: <strong>types describe, validators " +
    "verify</strong> &mdash; you need both, and conflating them (trusting <code>as</code> on external data) is " +
    "a leading source of runtime bugs in 'typed' codebases.</p>"
};

C["build-tools"] = {
  summary: "<p><strong>Build tools</strong> turn your TypeScript source into runnable/shippable JavaScript &mdash; " +
    "transpiling TS to JS, bundling modules, and optimizing output. Options span a spectrum: " +
    "<strong>bundlers</strong> like Vite (dev server + Rollup-based prod build), Webpack, and esbuild; " +
    "<strong>transpilers</strong> like esbuild and swc (extremely fast, type-stripping only); " +
    "<strong>library builders</strong> like tsup; and <code>tsc</code> itself for simple cases. A crucial " +
    "distinction: most modern tools transpile <em>without type-checking</em> (for speed), so type-checking " +
    "(<code>tsc --noEmit</code>) is a separate step. Choosing and configuring the right build tool is key to " +
    "a fast, correct workflow.</p>",
  examples: [
    {
      title: "Example 1: Vite for applications",
      description: "<p>Fast dev server with HMR plus an optimized production build.</p>",
      code: "# scaffold a typed app\n" +
        "npm create vite@latest my-app -- --template react-ts\n" +
        "\n" +
        "# dev (instant HMR, transpiles via esbuild - no type check)\n" +
        "npm run dev\n" +
        "# production bundle\n" +
        "npm run build\n" +
        "# IMPORTANT: type-check separately, since Vite doesn't:\n" +
        "npx tsc --noEmit"
    },
    {
      title: "Example 2: tsup for libraries",
      description: "<p>Bundle a library with declaration files in one step.</p>",
      code: "// build a library to ESM + CJS + .d.ts type declarations\n" +
        "// npx tsup src/index.ts --format esm,cjs --dts\n" +
        "//\n" +
        "// Produces: dist/index.js, dist/index.cjs, dist/index.d.ts\n" +
        "// (the .d.ts gives consumers full type safety)"
    }
  ],
  whenToUse: "<p>Choose a build tool by use case: <strong>Vite</strong> (or a framework CLI) for web apps " +
    "&mdash; great DX, fast HMR, optimized builds; <strong>tsup/esbuild</strong> for libraries &mdash; fast, " +
    "emits ESM/CJS and <code>.d.ts</code>; plain <strong><code>tsc</code></strong> for simple Node packages " +
    "or when you want the compiler to also emit. <strong>The critical gotcha:</strong> fast bundlers " +
    "(esbuild/swc) <em>strip types without checking them</em>, so a green build does NOT mean your types are " +
    "valid &mdash; always run <code>tsc --noEmit</code> as a separate type-check step in CI; otherwise type " +
    "errors ship silently. For libraries, make sure you generate and publish <code>.d.ts</code> declaration " +
    "files (and set <code>types</code> in <code>package.json</code>) or consumers get no types. Match " +
    "<code>module</code>/<code>target</code> settings to your runtime, and don't over-configure &mdash; modern " +
    "tools have sensible defaults; reach for custom config only when you have a specific need.</p>"
};
