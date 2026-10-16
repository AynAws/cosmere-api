/**
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 * Learn more at https://developers.cloudflare.com/workers/
 */

const lengths = ["Novel", "Short Story", "Novella", "Graphic Novel", "Bonus Content"] as const
const isLength = (value: string): value is Length => (lengths as readonly string[]).includes(value)
type Length = (typeof lengths)[number]

type Book = {
	"id": string,
	"title": string,
	"releaseDate": string,
	"seriesName": string | null,
	"seriesOrder": number | null,
	"length": Length//,
	//"prerequirements": string[],
	//"prerecommendations": string[]
}
type BookRow = {id: string, title: string, release_date: string, series_name: string | null, series_order: number | null, length: Length}
const toBook = (row: BookRow): Book => ({
	"id": row.id,
	"title": row.title,
	"releaseDate": row.release_date,
	"seriesName": row.series_name,
	"seriesOrder": row.series_order,
	"length": row.length
})

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
				"series_name": url.searchParams.get("series_name"),
				"length": url.searchParams.get("length")
			}
			// make sure parameters are recognized
			const allowedParams = Object.keys(parameters)
			for (const param of url.searchParams.keys()) {
				if (!(allowedParams.includes(param))) {
					return response400(`${param} is not a valid parameter`, allowedParams)
				}
			}
			// make sure length's value is recognized
			if (parameters.length !== null && !isLength(parameters.length)) {return response400("Invalid Length", lengths)}
			// books array from DB
			const properties = Object.entries(parameters).filter(([key, value]) => value !== null)
			let values: string[] = []
			let getSQL = "SELECT id, title, release_date, series_name, series_order, length FROM books"
			if (properties.length > 0) {
				let arr:string[] = []
				for (const [key, value] of properties) {
					arr.push(`${key} = ?`)
					if (value !== null) values.push(value)
				}
				getSQL += " WHERE " + arr.join(" AND ")
			}
			const booksSQL = (await env.DB.prepare(getSQL).bind(...values).all<BookRow>()).results
			// convert SQL to JSON
			const books = booksSQL.map(toBook)
			return response({books}, 200, {"Content-Type": "application/json"})
		} else {
			return response404()
		}
	},
} satisfies ExportedHandler<Env>