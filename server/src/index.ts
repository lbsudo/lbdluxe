import { Hono } from "hono";
import { cors } from "hono/cors";
import type { ApiResponse } from "shared/dist";

export const app = new Hono()

	.use('*', cors({
		origin: (origin) => {
			// Allow requests from your client domains
			const allowedOrigins = [
				'http://localhost:5173', // Vite dev server
				'https://lbdluxe.com', // Your production client domain
				'https://www.lbdluxe.com', // WWW subdomain
				'https://lbdluxe.pages.dev', // Cloudflare Pages default domain
			];

			// Also allow preview deployments from Cloudflare Pages
			if (origin && origin.endsWith('.lbdluxe.pages.dev')) {
				return origin;
			}

			return allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
		},
		allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowHeaders: ['Content-Type', 'Authorization'],
		exposeHeaders: ['Content-Length'],
		maxAge: 600,
		credentials: true,
	}))

	.get("/", (c) => {
		return c.text("Hello Hono!");
	})

	.get("/hello", async (c) => {
		const data: ApiResponse = {
			message: "Hello BHVR!",
			success: true,
		};

		return c.json(data, { status: 200 });
	});

export default app;