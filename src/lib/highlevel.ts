import { Location } from "~/models/Location.ts";

const refreshToken = async (locationId: string) => {
    try {
        const location = await Location.findOne({ locationId });
        if (!location) {
            throw new Error("Location not found");
        }
        const url = "https://services.leadconnectorhq.com/oauth/token";
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Accept: "application/json",
            },
            body: new URLSearchParams({
                client_id: Deno.env.get("CLIENT_ID") || "",
                client_secret: Deno.env.get("CLIENT_SECRET") || "",
                grant_type: "refresh_token",
                code: "",
                refresh_token: location.token.refresh_token,
                user_type: location.token.userType,
                redirect_uri: "",
            }),
        };

        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error("Failed to refresh token");
        }
        const data = await response.json();
        location.set({ token: { ...data.token } });
        console.log(data);
    } catch (error) {
        console.error(error);
    }
};

const getToken = async (authorizationCode: string) => {
    try {
        const url = "https://services.leadconnectorhq.com/oauth/token";
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Accept: "application/json",
            },
            body: new URLSearchParams({
                client_id: Deno.env.get("CLIENT_ID") || "",
                client_secret: Deno.env.get("CLIENT_SECRET") || "",
                grant_type: "authorization_code",
                code: authorizationCode,
                refresh_token: "",
                user_type: "Location",
                redirect_uri: Deno.env.get("REDIRECT_URL") || "",
            }),
        };
        const response = await fetch(url, options)
        if (!response.ok) throw new Error("Failed to get token");
        const data = await response.json();
        return data.token;
    } catch (error) {
        return error;
    }
};

export { refreshToken, getToken };
