import "jsr:@std/dotenv/load";
import { connect } from 'npm:mongoose@8.7.3'
import { default as api } from '~/routes/index.ts'

const uri = Deno.env.get('MONGO_URI') || 'mongodb://localhost:27017/workflowsplus'
await connect(uri)

Deno.serve({ port: Number(Deno.env.get('PORT')) || 3000 }, req => {
  const url = new URL(req.url)
  const path = url.pathname.split('/').filter(Boolean)[0]
  // console.log(url.pathname)
  switch (path) {
    case 'api': {
      return api(req)
    }
    default: {
      return new Response('Not Found', { status: 404 })
    }
  }
})