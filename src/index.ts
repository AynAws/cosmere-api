/**
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 * Learn more at https://developers.cloudflare.com/workers/
 */

const lengths = ["Novel", "Short Story", "Novella", "Graphic Novel", "Bonus Content"] as const
type Length = (typeof lengths)[number]
type Book = {
	"id": string,
	"title": string,
	"releaseDate": string,
	"series": string | null,
	"length": Length,
	"prerequirements": string[],
	"prerecommendations": string[]
}

const books: Book[] = [
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
		// new Response(...) as a function for readability
		const response = (body: Object, status: number, headers: Record<string, string>) => {return new Response(
			JSON.stringify(body), {
				status,
				headers
			}
		)}
		// premade responses:
		const response400 = (message:string, allowed?: readonly string[]) => {return response({status: `Bad Request: ${message}`, allowed}, 400, {"Content-Type": "application/json"})}
		const response404 = () => {return response({status: `${path} Not Found`}, 404, {"Content-Type": "application/json"})}
		const response405 = () => {return response({status: "Method Not Allowed"}, 405, {"Content-Type": "application/json", "Allow": "GET"})}
		// breaking down request
		const url = new URL(request.url)
		const path = url.pathname

		const method = request.method
		// API only allows GET
		if (method !== "GET") {return response405()}
		// handle GET request
		if (path === "/api/health") {
			return response({status: "ok"}, 200, {"Content-Type": "application/json"})
		} else if (path === "/api/books") {
			const parameters = {
				"id": url.searchParams.get("id"),
				"series": url.searchParams.get("series"),
				"length": url.searchParams.get("length")
			}
			const allowedParams = Object.keys(parameters)
			for (const param of url.searchParams.keys()) {
				if (!(allowedParams.includes(param))) {
					return response400(`${param} is not a valid parameter`, allowedParams)
				}
			}
			let body = books
			if (parameters.id) {
				body = body.filter(book => book.id === parameters.id)
			}
			if (parameters.series) {
				body = body.filter(book => book.series ? book.series.slice(0, book.series.lastIndexOf(" ")) === parameters.series : false)
			}
			if (parameters.length) {
				if (!(lengths as readonly string[]).includes(parameters.length)) {return response400("Invalid Length", lengths)}
				body = body.filter(book => book.length === parameters.length)
			}
			return response({books: body}, 200, {"Content-Type": "application/json"})
		} else {
			return response404()
		}
	},
} satisfies ExportedHandler<Env>