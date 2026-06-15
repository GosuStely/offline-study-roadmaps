// Roadmap data for "TypeScript".
// Structure mirrors roadmap.sh: 15 sections, 78 leaf subtopics.
// Each group has an `overviewId` -> the section header is itself a clickable overview page.
window.ROADMAP_DATA = window.ROADMAP_DATA || {};
window.ROADMAP_DATA["typescript"] = {
  "title": "TypeScript",
  "description": "Step-by-step roadmap to learning TypeScript: types, inference, narrowing, functions, classes, generics, utility & advanced types, modules and tooling.",
  "groups": [
    {
      "title": "Introduction to TypeScript",
      "overviewId": "introduction-to-typescript",
      "items": [
        { "id": "typescript-vs-javascript", "title": "TypeScript vs JavaScript" },
        { "id": "ts-js-interoperability", "title": "TS and JS Interoperability" },
        { "id": "installation-and-configuration", "title": "Installation and Configuration" },
        { "id": "tsconfig-json", "title": "tsconfig.json" },
        { "id": "compiler-options", "title": "Compiler Options" },
        { "id": "running-typescript", "title": "Running TypeScript" },
        { "id": "tsc", "title": "tsc" },
        { "id": "ts-node", "title": "ts-node" },
        { "id": "ts-playground", "title": "TS Playground" }
      ]
    },
    {
      "title": "TypeScript Types",
      "overviewId": "typescript-types",
      "items": [
        { "id": "type-boolean", "title": "boolean" },
        { "id": "type-number", "title": "number" },
        { "id": "type-string", "title": "string" },
        { "id": "type-void", "title": "void" },
        { "id": "type-undefined", "title": "undefined" },
        { "id": "type-null", "title": "null" },
        { "id": "type-interface", "title": "Interface" },
        { "id": "type-class", "title": "Class" },
        { "id": "type-enum", "title": "Enum" },
        { "id": "type-array", "title": "Array" },
        { "id": "type-tuple", "title": "Tuple" },
        { "id": "type-object", "title": "Object" },
        { "id": "type-unknown", "title": "unknown" },
        { "id": "type-any", "title": "any" },
        { "id": "type-never", "title": "never" },
        { "id": "as-const", "title": "as const" },
        { "id": "as-type", "title": "as [type]" },
        { "id": "as-any", "title": "as any" },
        { "id": "non-null-assertion", "title": "Non-null Assertion" },
        { "id": "satisfies-keyword", "title": "satisfies keyword" }
      ]
    },
    { "title": "Type Inference", "overviewId": "type-inference", "items": [] },
    { "title": "Type Compatibility", "overviewId": "type-compatibility", "items": [] },
    {
      "title": "Combining Types",
      "overviewId": "combining-types",
      "items": [
        { "id": "union-types", "title": "Union Types" },
        { "id": "intersection-types", "title": "Intersection Types" },
        { "id": "type-aliases", "title": "Type Aliases" },
        { "id": "keyof-operator", "title": "keyof Operator" }
      ]
    },
    {
      "title": "Type Guards / Narrowing",
      "overviewId": "type-guards-narrowing",
      "items": [
        { "id": "equality", "title": "Equality" },
        { "id": "instanceof", "title": "instanceof" },
        { "id": "typeof", "title": "typeof" },
        { "id": "truthiness", "title": "Truthiness" },
        { "id": "type-predicates", "title": "Type Predicates" }
      ]
    },
    {
      "title": "TypeScript Functions",
      "overviewId": "typescript-functions",
      "items": [
        { "id": "typing-functions", "title": "Typing Functions" },
        { "id": "function-overloading", "title": "Function Overloading" }
      ]
    },
    {
      "title": "TypeScript Interfaces",
      "overviewId": "typescript-interfaces",
      "items": [
        { "id": "types-vs-interfaces", "title": "Types vs Interfaces" },
        { "id": "extending-interfaces", "title": "Extending Interfaces" },
        { "id": "interface-declaration", "title": "Interface Declaration" },
        { "id": "hybrid-types", "title": "Hybrid Types" }
      ]
    },
    {
      "title": "Classes",
      "overviewId": "classes",
      "items": [
        { "id": "constructor-params", "title": "Constructor Params" },
        { "id": "constructor-overloading", "title": "Constructor Overloading" },
        { "id": "access-modifiers", "title": "Access Modifiers" },
        { "id": "abstract-classes", "title": "Abstract Classes" },
        { "id": "inheritance-vs-polymorphism", "title": "Inheritance vs Polymorphism" },
        { "id": "method-overriding", "title": "Method Overriding" }
      ]
    },
    {
      "title": "Generics",
      "overviewId": "generics",
      "items": [
        { "id": "generic-types", "title": "Generic Types" },
        { "id": "generic-constraints", "title": "Generic Constraints" }
      ]
    },
    { "title": "Decorators", "overviewId": "decorators", "items": [] },
    {
      "title": "Utility Types",
      "overviewId": "utility-types",
      "items": [
        { "id": "partial", "title": "Partial" },
        { "id": "pick", "title": "Pick" },
        { "id": "omit", "title": "Omit" },
        { "id": "readonly", "title": "Readonly" },
        { "id": "record", "title": "Record" },
        { "id": "exclude", "title": "Exclude" },
        { "id": "extract", "title": "Extract" },
        { "id": "nonnullable", "title": "NonNullable" },
        { "id": "parameters", "title": "Parameters" },
        { "id": "returntype", "title": "ReturnType" },
        { "id": "instancetype", "title": "InstanceType" },
        { "id": "awaited", "title": "Awaited" }
      ]
    },
    {
      "title": "Advanced Types",
      "overviewId": "advanced-types",
      "items": [
        { "id": "mapped-types", "title": "Mapped Types" },
        { "id": "conditional-types", "title": "Conditional Types" },
        { "id": "literal-types", "title": "Literal Types" },
        { "id": "template-literal-types", "title": "Template Literal Types" },
        { "id": "recursive-types", "title": "Recursive Types" }
      ]
    },
    {
      "title": "TypeScript Modules",
      "overviewId": "typescript-modules",
      "items": [
        { "id": "namespaces", "title": "Namespaces" },
        { "id": "ambient-modules", "title": "Ambient Modules" },
        { "id": "external-modules", "title": "External Modules" },
        { "id": "namespace-augmentation", "title": "Namespace Augmentation" },
        { "id": "global-augmentation", "title": "Global Augmentation" }
      ]
    },
    {
      "title": "Ecosystem",
      "overviewId": "ecosystem",
      "items": [
        { "id": "formatting", "title": "Formatting" },
        { "id": "linting", "title": "Linting" },
        { "id": "useful-packages", "title": "Useful Packages" },
        { "id": "build-tools", "title": "Build Tools" }
      ]
    }
  ]
};

window.CONTENT_DATA = window.CONTENT_DATA || {};
window.CONTENT_DATA["typescript"] = window.CONTENT_DATA["typescript"] || {};
