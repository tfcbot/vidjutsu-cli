#!/usr/bin/env node
import { defineCommand, runMain } from "citty";

const main = defineCommand({
  meta: {
    name: "vidjutsu",
    version: "0.3.1",
    description: "Video intelligence API — watch, extract, transcribe, check.",
  },
  subCommands: {
    auth: () => import("./commands/auth").then((m) => m.default),
    watch: () => import("./commands/watch").then((m) => m.default),
    extract: () => import("./commands/extract").then((m) => m.default),
    transcribe: () => import("./commands/transcribe").then((m) => m.default),
    check: () => import("./commands/check").then((m) => m.default),
    upload: () => import("./commands/upload").then((m) => m.default),
    account: () => import("./commands/account").then((m) => m.default),
    post: () => import("./commands/post").then((m) => m.default),
    reference: () => import("./commands/reference").then((m) => m.default),
    asset: () => import("./commands/asset").then((m) => m.default),
    status: () => import("./commands/status").then((m) => m.default),
    balance: () => import("./commands/balance").then((m) => m.default),
    info: () => import("./commands/info").then((m) => m.default),
    subscribe: () => import("./commands/subscribe").then((m) => m.default),
    session: () => import("./commands/session").then((m) => m.default),
    update: () => import("./commands/update").then((m) => m.default),
  },
});

runMain(main);
