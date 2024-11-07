import { connect } from 'npm:mongoose@8.7.3'

const uri = Deno.env.get('MONGO_URI') || 'mongodb://localhost:27017/deno'
await connect(uri)


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