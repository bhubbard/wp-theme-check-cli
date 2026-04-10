# 🚀 WP Theme Check CLI

A high-performance, strictly-typed TypeScript rewriting of the official legacy WordPress `theme-check` tool. 

Engineered with **Bun**, this modern command-line interface audits WordPress themes (both Classic and Full-Site Editing/Block themes) automatically, ensuring they conform to the exact WordPress Coding Standards (WPCS) required by heavy-duty hosting platforms and theme repositories.

## 🌟 Key Features

*   **100% Dynamic Engine:** Operates over 65 dedicated inspection classes evaluating everything from raw file structures, FSE `theme.json` schemas, escaping logic, and more. 
*   **Intelligent Routing:** Automatically detects whether it is reading an old Classic Theme (with `.php` wrappers) or a modern Block Theme (with `templates/index.html`), gracefully skipping irrelevant tests without throwing false positives.
*   **JSON Streaming Support:** Unlike the old `theme-check` plugin which trapped results inside the WordPress wp-admin interface, this utility can trigger via headless CI/CD runners using standard structured JSON format strings.
*   **Blazing Fast:** Refactored into static `Bun` compilation outperforming standard Node.

## ⚙️ Installation

Make sure your machine supports `npm` and `bun`, then install the node module directory globally.

```bash
git clone https://github.com/bhubbard/wp-theme-check-cli.git
cd wp-theme-check-cli
bun install
npm link
```

## 🎯 Usage

Since the project binds to your local alias environment natively, drop the command into any shell directory path pointing at your specific WordPress theme structure.

```bash
# General Output
wp-theme-check --path /path/to/my-theme

# Structured Output (CI/CD / JQ Compatible)
wp-theme-check --path /path/to/my-theme --format json
```

### Options

*   **`--path <directory>`:** Specify the location of the WordPress folder root you wish to scan. Defaults to the current active directory `.`
*   **`--format <type>`:** Standard text strings or `json`.
*   **`-h, --help`:** Displays the default interface help menu. 

## 🛠️ Modding & Expanding
Thanks to the router design in `/src/runner.ts`, creating custom policies takes mere seconds. 
1. Build a new `YourCheckClass.ts`
2. Save it directly to the `/src/checks/` folder hierarchy.
3. Automatically maps! Zero array registration dependencies.

## 🤝 Community Checks

Features popular requested constraints that never officially merged into WordPress core plugins.
*   Block hardcoded string outputs of `current_user_can('administrator')` ensuring native UX capabilities are mapped natively.
*   Flags un-dismissible custom admin notice injections.
*   Traps raw jQuery queues, enforcing functional Vanilla Javascript configurations.
*   Automatically rejects bloated artifact directories (such as `__MACOSX`, `.vscode`, `src/`) from distribution folders.
