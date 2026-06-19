

export const user_role = {
    admin : "admin",
    agent : "agent",
    user : "user"
} as const;

export type ROLE = "admin" | "agent" | "user";