#!/usr/bin/env node
import { defineCommand, runMain } from "citty";

const main = defineCommand({
  meta: {
    name: "vidjutsu",
    version: "0.2.0",
    description: "Video intelligence API — the feedback loop your agent is missing.",
  },
  subCommands: {
    auth: () => import("./commands/auth").then((m) => m.default),
    account: () => import("./commands/account").then((m) => m.default),
    post: () => import("./commands/post").then((m) => m.default),
    status: () => import("./commands/status").then((m) => m.default),
    session: () => import("./commands/session").then((m) => m.default),
    balance: () => import("./commands/balance").then((m) => m.default),
    info: () => import("./commands/info").then((m) => m.default),
    subscribe: () => import("./commands/subscribe").then((m) => m.default),
    upload: () => import("./commands/upload").then((m) => m.default),
    critic: () => import("./commands/critic").then((m) => m.default),
    breakdown: () => import("./commands/breakdown").then((m) => m.default),
    score: () => import("./commands/score").then((m) => m.default),
  },
});

runMain(main);
