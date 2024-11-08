import { Schema, model } from 'npm:mongoose@8.7.3';

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

const triggerSchema = new Schema<ITrigger>({
    triggerData: {
        id: {
            type: String,
            required: true
        },
        key: {
            type: String,
            required: true
        },
        filters: [String],
        eventType: String,
        targetUrl: {
            type: String,
            required: true
        }
    },
    meta: {
        key: String,
        version: String
    },
    extras: {
        locationId: {
            type: String,
            required: true
        }, 
        workflowId: String, 
        companyId: String
    }
});

export default model<ITrigger>('Trigger', triggerSchema);