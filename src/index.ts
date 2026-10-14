/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { BaseGuildTextChannel } from "discord.js";

const books = [
    {
        "id": "elantris",
        "title": "Elantris",
        "releaseDate": "2005-05-01",
        "series": "Elantris 1",
        "length": "Novel",
        "prerequirements": [],
        "prerecommendations": []
    },
    {
        "id": "hope-of-elantris",
        "title": "The Hope of Elantris",
        "releaseDate": "2006-01-01",
        "series": "Elantris 1.5",
        "length": "Short Story",
        "prerequirements": ["elantris"],
        "prerecommendations": []
    },
    {
        "id": "mistborn-final-empire",
        "title": "Mistborn: The Final Empire",
        "releaseDate": "2006-07-17",
        "series": "Mistborn (Era 1) 1",
        "length": "Novel",
        "prerequirements": [],
        "prerecommendations": []
    },
    {
        "id": "mistborn-well-of-ascension",
        "title": "The Well of Ascension",
        "releaseDate": "2007-08-21",
        "series": "Mistborn (Era 1) 2",
        "length": "Novel",
        "prerequirements": ["mistborn-final-empire"],
        "prerecommendations": []
    },
    {
        "id": "mistborn-hero-of-ages",
        "title": "The Hero of Ages",
        "releaseDate": "2008-10-14",
        "series": "Mistborn (Era 1) 3",
        "length": "Novel",
        "prerequirements": ["mistborn-well-of-ascension"],
        "prerecommendations": []
    },
    {
        "id": "warbreaker",
        "title": "Warbreaker",
        "releaseDate": "2009-06-09",
        "series": null,
        "length": "Novel",
        "prerequirements": [],
        "prerecommendations": []
    }
]

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url)
		const path = url.pathname.split("/")
		const method = request.method
		const response = (body: Object, status: number, headers: Object) => {return new Response(
			JSON.stringify(body), {
				status,
				headers
			}
		)}
		const response404 = () => {return response({status: `${path.join("/")} Not Found`}, 404, {"Content-Type": "application/json"})}
		const response405 = () => {return response({status: "Method Not Allowed"}, 405, {"Content-Type": "application/json", "Allow": "GET"})}
		if (`/${path[1]}/${path[2]}` === "/api/health") {
			return method === "GET" ? response({status: "ok"}, 200, {"Content-Type": "application/json"}) : response405()
		} else if (`/${path[1]}/${path[2]}` === "/api/books") {
			if (!path[3]) {
				return method === "GET" ? response({books}, 200, {"Content-Type": "application/json"}) : response405()
			} else {
				let body
				switch (path[3]) {
					case "id":
						body = books.find(book => book.id === path[4])
						break
					case "series":
						body = books.filter(book => book.series ? book.series.slice(0, book.series.lastIndexOf(" ")) === decodeURIComponent(path[4]) : null)
						break
					default:
						return response404()
				}
				return !body ? response404() : response({books: body}, 200, {"Content-Type": "application/json"})
			}
		} else {
			return response404()
		}
	},
} satisfies ExportedHandler<Env>;