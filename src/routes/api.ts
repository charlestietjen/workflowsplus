import { Location } from "~/models/Location.ts"

const location = async (req: Request) => {
    const method = req.method
    const body = await req.json()
    switch (method) {
        case 'POST': {
            const location = new Location(body)
            await location.save()
            return new Response(JSON.stringify(location), { status: 200 })
        }
        case 'PATCH': {
            const location = await Location.findOne({ locationId: body.locationId })
            if (location) {
                location.set(body)
                await location.save()
                return new Response(JSON.stringify(location), { status: 200 })
                
            }
            return new Response('Location not found', { status: 404 })
        }
        default: {
            return new Response('Method not allowed', { status: 405 })
        }
    }
}

const trigger = async (req: Request) => {}

export { location, trigger}