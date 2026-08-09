"use server";

import prismaDb from "@/src/server/db/db";

async function generateUsernameSuggestions(displayName: string) {
  const base = displayName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ");

  const parts = base.split(" ");
  const first = parts[0] || "user";
  const last = parts.slice(1).join("") || "";

  const suggestions = new Set<string>();

  const randomNum = () => Math.floor(100 + Math.random() * 900);

  // basic
  suggestions.add(first);

  if (last) {
    suggestions.add(first + last);
    suggestions.add(first + "_" + last);
    suggestions.add(first + "." + last);
    suggestions.add(first[0] + last);
    suggestions.add(first + last[0]);
    suggestions.add(first + last + randomNum());
  }

  suggestions.add(first + randomNum());
  suggestions.add(first + "_" + randomNum());

  // ensure at least 5
  while (suggestions.size < 5) {
    suggestions.add(first + randomNum());
  }

  const usernames = Array.from(suggestions)
    .slice(0, 5)
    .map((u) => u.toLowerCase());

  const suggestedUsernames = await getAvailableUsernames(usernames);

  return suggestedUsernames.filter((u) => u.available).map((u) => u.username);
}

async function getAvailableUsernames(usernames: string[]) {
  const normalized = usernames.map((u) => u.toLowerCase());

  const existingUsers = await prismaDb.user.findMany({
    where: {
      username: {
        in: normalized,
      },
    },
    select: { username: true },
  });

  const taken = new Set(
    existingUsers.map((u: typeof existingUsers) => u.username),
  );

  return normalized.map((u) => ({
    username: u,
    available: !taken.has(u),
  }));
}

export { generateUsernameSuggestions, getAvailableUsernames };
