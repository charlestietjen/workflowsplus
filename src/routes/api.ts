import { Location } from "~/models/Location.ts";
import Trigger from "~/models/Trigger.ts";
import { getToken } from "~/lib/highlevel.ts";

const locations = async (req: Request) => {
    const method = req.method;
    const body = await req.json();
    switch (method) {
        case "POST": {
            try {
                const location = new Location(body);
                await location.save();
                return new Response(JSON.stringify(location), { status: 200 });
            } catch (_error) {
                return new Response("Bad request", { status: 400 });
            }
        }
        case "PATCH": {
            try {
                const location = await Location.findOne({
                    locationId: body.locationId,
                });
                if (location) {
                    location.set(body);
                    await location.save();
                    return new Response(JSON.stringify(location), {
                        status: 200,
                    });
                }
                throw new Error("Location not found");
                // deno-lint-ignore no-explicit-any
            } catch (error: any) {
                return new Response(error.message || "Bad request", {
                    status: 400,
                });
            }
        }
        default: {
            return new Response("Method not allowed", { status: 405 });
        }
    }
};

const triggers = async (req: Request) => {
    const method = req.method;
    if (method !== "POST") {
        return new Response("Method not allowed", { status: 405 });
    }
    try {
        const body = await req.json();
        switch (body.triggerData.eventType) {
            case "CREATE": {
                const trigger = new Trigger(body);
                await trigger.save();
                return new Response(JSON.stringify(trigger), { status: 200 });
            }
            case "UPDATED": {
                const trigger = await Trigger.findOne({
                    "triggerData.id": body.triggerData.id,
                });
                if (trigger) {
                    trigger.set(body);
                    await trigger.save();
                    return new Response(JSON.stringify(trigger), {
                        status: 200,
                    });
                }
                return new Response("Trigger not found", { status: 404 });
            }
            case "DELETED": {
                Trigger.deleteOne({
                    "triggerData.id": body.triggerData.id,
                });
                return new Response("Trigger deleted", { status: 200 });
            }
            default: {
                return new Response("Bad request", { status: 400 });
            }
        }
    } catch (_error) {
        return new Response("Bad request", { status: 400 });
    }
};

const authorization = async (req: Request) => {
    const method = req.method;
    if (method !== "POST") {
        return new Response("Method not allowed", { status: 405 });
    }
    try {
        const regex = /.*code=(\d+)/;
        const searchParams = new URL(req.url).search;
        const code = searchParams.match(regex)?.[1];
        if (!code) throw Error("Invalid Auth Code");
        const token = await getToken(code);
        if (!token.access_token) throw Error("Failed to get token");
        const location = await Location.findOne({locationId: token.locationId})
        if (!location) {
            const newLocation = new Location({ locationId: token.locationId, token });
            await newLocation.save();
            return new Response("OK", { status: 200 });
        }
        location.set({ token })
        await location.save();
        return new Response("OK", { status: 200 });
    // deno-lint-ignore no-explicit-any
    } catch (_error : any) {
        return new Response(_error.message, { status: 400 });
    }
};

export { locations, triggers, authorization };
