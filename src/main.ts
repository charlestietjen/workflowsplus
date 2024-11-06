import { connect } from 'npm:mongoose@8.7.3'
import { Location } from "./models/Location.ts"

const uri = Deno.env.get('MONGO_URI') || 'mongodb://localhost:27017/deno'
await connect(uri)

const location = new Location({
  locationId: '123',
  token: {
    access_token: '123',
    token_type: '123',
    expires_in: 123,
    refresh_token: '123',
    scope: '123',
    userType: '123',
    locationId: '123',
    companyId: '123',
    approvedLocations: ['123'],
    userId: '123',
    planId: '123'
  },
  triggers: [
    {
      id: '123',
      key: '123',
      filters: ['123'],
      eventType: '123',
      targetUrl: '123'
    }
  ]
})

await location.save()

Deno.serve({ port: 8090 }, async req => {
  const url = new URL(req.url)
  if (url.pathname === '/api/testauth') {
    if (req.body) {
      console.log(await req.json())
    }
    return new Response('Hello TestAuth!')
  }
  return new Response('Hello World!')
})