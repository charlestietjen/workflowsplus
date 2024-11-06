import express, { Router } from 'npm:express@4.21.1'

const router = Router()

router.get('/testauth', (req : express.Request, res : express.Request) => {
    console.log(req.body)
    res.send('Hello from testauth')
})
.post((req : express.Request, res : express.Request) => {
    console.log(req.body)
    res.send('Hello from testauth post')
})

export default router