import {betterAuth} from "better-auth";
import {drizzleAdapter} from "better-auth/adapters/drizzle";
import {db} from "../db/db"; // your drizzle instance
import {openAPI} from "better-auth/plugins";
import * as schema from "../db/schema";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite",
        schema,
    }),
    emailAndPassword: {
        enabled: true,
    },
    // emailVerification: {
    //     sendVerificationEmail: async ({user, url, token}, request) => {
    //         await sendEmail({
    //             to: user.email,
    //             subject: "Verify your email address",
    //             text: `Click the link to verify your email: ${url}`,
    //         });
    //     },
    // },
    plugins: [
        openAPI()
    ]
});