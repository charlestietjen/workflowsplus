import { connect } from 'npm:mongoose@8.7.3'
import { default as api } from '~/routes/index.ts'

const uri = Deno.env.get('MONGO_URI') || 'mongodb://localhost:27017/deno'
await connect(uri)


Deno.serve({ port: Number(Deno.env.get('PORT')) || 8090 }, async req => {
  const url = new URL(req.url)
  const path = url.pathname.split('/').filter(Boolean)[0]
  switch (path) {
    case 'api': {
      return api(req)
    }
    default: {
      return new Response('Not Found', { status: 404 })
    }
  }
})