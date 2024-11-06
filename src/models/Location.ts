import { Schema, model } from 'npm:mongoose@8.7.3';

interface IToken {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
    userType: string;
    locationId: string;
    companyId: string;
    approvedLocations: string[];
    userId: string;
    planId: string;
}

interface ITrigger {
    triggerData: {
        id: string;
        key: string;
        filters: string[];
        eventType: string;
        targetUrl: string;
    };
    meta: {
        key: string;
        version: string;
    };
    extras: {
        locationId: string;
        workflowId: string;
        companyId: string;
    }
}

interface ILocation {
    locationId: string;
    token: IToken;
    triggers: ITrigger[];
}

const tokenSchema = new Schema<IToken>({
    access_token: String,
    token_type: String,
    expires_in: Number,
    refresh_token: String,
    scope: String,
    userType: String,
    locationId: String,
    companyId: String,
    approvedLocations: [String],
    userId: String,
    planId: String
});

const triggerSchema = new Schema<ITrigger>({
    triggerData: {
        id: String,
        key: String,
        filters: [String],
        eventType: String,
        targetUrl: String
    },
    meta: {
        key: String,
        version: String
    },
    extras: {
        locationId: String, 
        workflowId: String, 
        companyId: String
    }
});

const locationSchema = new Schema<ILocation>({
    locationId: String,
    token: tokenSchema,
    triggers: [triggerSchema]
});

export const Location = model<ILocation>('Location', locationSchema)