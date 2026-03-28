import "./ssr-polyfill.js";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

// Client-side render — skipped when the module is imported during prerendering
if (typeof window !== "undefined") {
	const root = ReactDOM.createRoot(document.getElementById("root"));
	root.render(
		<HelmetProvider>
			<Router>
				<App />
			</Router>
		</HelmetProvider>
	);
}

// SSR prerender export — called by vite-prerender-plugin at build time
export async function prerender({ url }) {
	const { renderToString } = await import("react-dom/server");
	const { StaticRouter } = await import("react-router-dom/server");

	const helmetContext = {};
	const html = renderToString(
		<HelmetProvider context={helmetContext}>
			<StaticRouter location={url}>
				<App />
			</StaticRouter>
		</HelmetProvider>
	);

	const { helmet } = helmetContext;
	const headElements = new Set();
	if (helmet) {
		if (helmet.meta.toString()) headElements.add(helmet.meta.toString());
		if (helmet.link.toString()) headElements.add(helmet.link.toString());
	}

	return {
		html,
		head: helmet
			? {
					title: helmet.title
						.toString()
						.replace(/<\/?title>/g, "")
						.trim(),
					elements: headElements,
			  }
			: undefined,
	};
}
