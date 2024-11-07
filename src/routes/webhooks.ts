import Trigger from "~/models/Trigger.ts";

const webhooks = async (req: Request) => {
    const method = req.method
    const body = await req.json()
    if (method !== 'POST') {
        return new Response('Method not allowed', { status: 405 })
    }
    try {
        switch (body.type) {
            case 'InboundMessage': {
                const triggers = await Trigger.find({ 'extras.locationId': body.locationId, 'triggerData.key': 'wfp_inbound_message' })
                if (triggers.length < 1) return new Response('No records found', { status: 404 })
                triggers.forEach(trigger => {
                    
                })
            }
        }
    } catch (error) {
        return new Response('Internal Error', { status: 500 })
    }
}

export default webhooks