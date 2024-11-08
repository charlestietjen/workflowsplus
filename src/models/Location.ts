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

interface ILocation {
    locationId: string;
    token: IToken;
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

const locationSchema = new Schema<ILocation>({
    locationId: {
        type: String,
        required: true
    },
    token: {
        type: tokenSchema,
        required: true
    },
});

export const Location = model<ILocation>('Location', locationSchema)