"use client";

import { useState } from "react";

// HttpayerClient class (copied from SDK for frontend use)
class HttpayerClient {
	private routerUrl: string;
	private apiKey: string;

	constructor(routerUrl?: string, apiKey?: string) {
		this.routerUrl =
			routerUrl ||
			process.env.NEXT_PUBLIC_HTTPAYER_API_URL ||
			"http://provider.boogle.cloud:31157/httpayer";
		this.apiKey =
			apiKey || process.env.NEXT_PUBLIC_HTTPAYER_API_KEY || "chainlinkhack2025";
		if (!this.routerUrl || !this.apiKey) {
			throw new Error("Router URL and API Key must be configured!");
		}
	}

	async payInvoice(
		apiUrl: string,
		apiMethod: string = "GET",
		apiPayload: any = {},
	): Promise<any> {
		const data = {
			api_url: apiUrl,
			method: apiMethod,
			payload: apiPayload,
		};
		const headers = {
			"Content-Type": "application/json",
			"x-api-key": this.apiKey,
		};
		const response = await fetch(this.routerUrl, {
			method: "POST",
			headers,
			body: JSON.stringify(data),
		});
		if (!response.ok) {
			const errorBody = await response.json().catch(() => ({}));
			throw new Error(
				errorBody.error ||
					`HTTPayer request failed: ${response.status} ${response.statusText}`,
			);
		}
		return response.json();
	}
}

// Simple utility to conditionally join class names
function cn(...classes: (string | boolean | undefined | null)[]): string {
	return classes.filter(Boolean).join(" ");
}

// Define types based on ARCHITECTURE.md for request and response
type HttpRequestPayload = {
	api_url: string;
	method: "GET" | "POST" | "PUT" | "DELETE";
	payload?: Record<string, unknown>;
};

// Response is dynamic, so we'll use unknown and cast later if specific structure is expected
type PaymentResponse = unknown;

const steps = [
	"Idle",
	"Initiating payment via HTTPayer service...",
	"HTTPayer: Processing x402 protocol...",
	"HTTPayer: Orchestrating cross-chain payment via Chainlink CCIP...",
	"HTTPayer: Settling on-chain & verifying access...",
	"Success! Accessing protected API...",
];

export function PaymentDemo() {
	const [statusIndex, setStatusIndex] = useState(0);
	const [result, setResult] = useState<unknown | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handlePayment = async () => {
		setIsLoading(true);
		setResult(null);
		setError(null);
		setStatusIndex(1);

		let client: HttpayerClient;
		try {
			client = new HttpayerClient();
		} catch (e) {
			setError(e instanceof Error ? e.message : String(e));
			setIsLoading(false);
			return;
		}

		try {
			await new Promise((resolve) => setTimeout(resolve, 1500));
			setStatusIndex(2);
			await new Promise((resolve) => setTimeout(resolve, 2000));
			setStatusIndex(3);
			await new Promise((resolve) => setTimeout(resolve, 2500));
			setStatusIndex(4);
			await new Promise((resolve) => setTimeout(resolve, 1500));

			const apiUrl =
				"http://provider.akash-palmito.org:30862/avalanche-weather";
			const apiMethod = "GET";
			const apiPayload = {};
			const apiResult = await client.payInvoice(apiUrl, apiMethod, apiPayload);
			setResult(apiResult);
			setStatusIndex(5);
		} catch (err: unknown) {
			const errorMessage =
				err instanceof Error ? err.message : "Check console.";
			setError(`Network or Unexpected Error: ${errorMessage}`);
			setStatusIndex(0);
		} finally {
			setIsLoading(false);
		}
	};

	const buttonClasses = cn(
		"px-6 py-3 font-semibold text-white bg-blue-600 rounded-md shadow-sm",
		"hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900",
		isLoading && "bg-gray-600 cursor-not-allowed",
	);

	return (
		<div className="p-6 mt-6 bg-gray-800 rounded-lg shadow-lg">
			<h2 className="text-lg font-semibold text-gray-300">
				Interactive Demo: Cross-Chain API Call
			</h2>
			<p className="mt-1 text-sm text-gray-400">
				Pay for Avalanche weather data using funds orchestrated by HTTPayer.
			</p>

			<div className="flex flex-col gap-4 mt-4">
				<button
					type="button"
					onClick={handlePayment}
					disabled={isLoading}
					className={buttonClasses}
				>
					{isLoading ? "Processing Payment..." : "Get Weather on Avalanche"}
				</button>

				{error && (
					<div className="p-3 font-mono text-red-300 bg-red-900/50 rounded-md">
						<p className="font-bold">Error:</p>
						<p>{error}</p>
					</div>
				)}

				<div className="flex-grow p-4 font-mono text-sm bg-gray-900 rounded-md">
					<p>
						<span className="text-gray-500 mr-2">$</span>
						<span
							className={cn(
								isLoading ? "text-yellow-400" : "text-gray-400",
								statusIndex === 5 && "text-green-400", // Green when success
							)}
						>
							{steps[statusIndex]}
						</span>
					</p>
				</div>
			</div>

			{result !== null && (
				<div className="p-4 mt-4 font-mono text-green-300 bg-green-900/50 rounded-md">
					<p className="font-bold">API Response:</p>
					<pre>{JSON.stringify(result ?? {}, null, 2)}</pre>
				</div>
			)}
		</div>
	);
}
