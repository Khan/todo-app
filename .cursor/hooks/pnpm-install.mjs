#!/usr/bin/env node
import { spawnSync } from "child_process";
import { existsSync } from "fs";

if (!existsSync("package.json")) process.exit(0);

const result = spawnSync("pnpm", ["install"], {
    encoding: "utf8",
    stdio: ["inherit", "pipe", "pipe"],
});

if (result.status !== 0) {
    const output = [result.stdout?.trim(), result.stderr?.trim()]
        .filter(Boolean)
        .join("\n");
    process.stderr.write(output ? `pnpm install failed:\n${output}\n` : "pnpm install failed\n");
    process.exit(2);
}
