#!/usr/bin/env node
import { defineCommand, runMain } from "citty";

const main = defineCommand({
  meta: {
    name: "vidjutsu",
    version: "0.2.0",
    description: "Give your agent Instagram superpowers.",
  },
  subCommands: {
    auth: () => import("./commands/auth").then((m) => m.default),
    account: () => import("./commands/account").then((m) => m.default),
    post: () => import("./commands/post").then((m) => m.default),
    campaign: () => import("./commands/campaign").then((m) => m.default),
    status: () => import("./commands/status").then((m) => m.default),
    balance: () => import("./commands/balance").then((m) => m.default),
    topup: () => import("./commands/topup").then((m) => m.default),
    chat: () => import("./commands/chat").then((m) => m.default),
    info: () => import("./commands/info").then((m) => m.default),
    analytics: () => import("./commands/analytics").then((m) => m.default),
    subscribe: () => import("./commands/subscribe").then((m) => m.default),
  },
});

runMain(main);
