import { locations, triggers, authorization } from "~/routes/api.ts";

export { default as webhooks } from '~/routes/webhooks.ts'

const router = (req : Request) => {
    const url = new URL(req.url)
    const path = url.pathname.replace('/api/', '').split('/').filter(Boolean)[0]
    switch (path) {
        case 'location': {
            return locations(req)
        }
        case 'trigger': {
            return triggers(req)
        }
        case 'auth': {
            return authorization(req)
        }
        default: {
            return new Response('Not Found', { status: 404 })
        }
    }
}

export default router