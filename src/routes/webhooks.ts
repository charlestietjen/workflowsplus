import Trigger from "~/models/Trigger.ts";
import { Location } from "~/models/Location.ts";
import { refreshToken } from "~/lib/highlevel.ts";

const webhooks = async (req: Request) => {
    // console.log("webhooooook");
    const method = req.method;
    const body = await req.json();
    // console.log(body);
    if (method !== "POST") {
        console.log("Not a post");
        return new Response("Method not allowed", { status: 405 });
    }
    try {
        switch (body.type) {
            case "InboundMessage": {
                // console.log("InboundMessage")
                const triggers = await Trigger.find({
                    "extras.locationId": body.locationId,
                    "triggerData.key": "wfp_inbound_message",
                    "triggerData.eventType": { $ne: "DELETED" }
                });
                // console.log('triggers: ', triggers)
                if (triggers.length < 1) {
                    // console.log('No triggers found')
                    return new Response("No records found", { status: 404 });
                }
                let location = await Location.findOne({
                    locationId: body.locationId,
                });
                triggers.forEach(async (trigger, i) => {
                    // console.log('trigger: ', i, 'access_token: ', location?.token.access_token)
                    let response = await fetch(
                        trigger.triggerData.targetUrl,
                        {
                            method: "POST",
                            headers: {
                                "Authorization":
                                    `Bearer ${location?.token.access_token}`,
                                "Content-Type": "application/json",
                                "version": "2021-04-15",
                            },
                            body: JSON.stringify(body),
                        },
                    );
                    if (response.status === 401) {
                        await refreshToken(
                            body.locationId,
                        );
                        location = await Location.findOne({
                            locationId: body.locationId,
                        });
                        response = await fetch(
                            trigger.triggerData.targetUrl,
                            {
                                method: "POST",
                                headers: {
                                    "Authorization":
                                        `Bearer ${location?.token.access_token}`,
                                    "Content-Type": "application/json",
                                    "version": "2021-04-15",
                                },
                                body: JSON.stringify(body),
                            },
                        );
                    }
                    if (!response.ok) {
                        console.log(response);
                        return new Response("Failed to send webhook", {
                            status: 400,
                        });
                    }
                });
                return new Response("OK", { status: 200 });
            }
            case "OutboundMessage": {
                const triggers = await Trigger.find({
                    "extras.locationId": body.locationId,
                    "triggerData.key": "wfp_outbound_message",
                    "triggerData.eventType": { $ne: "DELETED" },
                });
                if (triggers.length < 1) {
                    return new Response("No records found", { status: 404 });
                }
                let location = await Location.findOne({
                    locationId: body.locationId,
                });
                triggers.forEach(async (trigger, i) => {
                    let response = await fetch(
                        trigger.triggerData.targetUrl,
                        {
                            method: "POST",
                            headers: {
                                "Authorization":
                                    `Bearer ${location?.token.access_token}`,
                                "Content-Type": "application/json",
                                "version": "2021-04-15",
                            },
                            body: JSON.stringify(body),
                        },
                    );
                    if (response.status === 401) {
                        await refreshToken(
                            body.locationId,
                        );
                        location = await Location.findOne({
                            locationId: body.locationId,
                        });
                        response = await fetch(
                            trigger.triggerData.targetUrl,
                            {
                                method: "POST",
                                headers: {
                                    "Authorization":
                                        `Bearer ${location?.token.access_token}`,
                                    "Content-Type": "application/json",
                                    "version": "2021-04-15",
                                },
                                body: JSON.stringify(body),
                            },
                        );
                    }
                    if (!response.ok) {
                        console.log(response);
                        return new Response("Failed to send webhook", {
                            status: 400,
                        });
                    }
                });
                return new Response("OK", { status: 200 });
            }
            default: {
                console.log(
                    "Trigger type: ",
                    body.type,
                    " has failed to execute.",
                );
                return new Response("Trigger type invalid", { status: 400 });
            }
        }
    } catch (_error) {
        return new Response("Internal error", { status: 500 });
    }
};

export default webhooks;
