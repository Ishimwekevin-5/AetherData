
import { TransformationSchema } from './types';
import { Type } from '@google/genai';

export const SCHEMAS: TransformationSchema[] = [
  {
    id: 'user-profile',
    name: 'User Identity Profile',
    description: 'Extracts PII, account preferences, and contact details.',
    targetJsonSchema: {
      type: Type.OBJECT,
      properties: {
        fullName: { type: Type.STRING, description: 'Full name of the user' },
        email: { type: Type.STRING, description: 'Valid email address' },
        phone: { type: Type.STRING, description: 'Formatted phone number' },
        address: {
          type: Type.OBJECT,
          properties: {
            street: { type: Type.STRING },
            city: { type: Type.STRING },
            country: { type: Type.STRING }
          },
          required: ['city', 'country']
        },
        roles: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ['fullName', 'email']
    }
  },
  {
    id: 'financial-ledger',
    name: 'Financial Transaction',
    description: 'Standardizes invoice data and bank statements.',
    targetJsonSchema: {
      type: Type.OBJECT,
      properties: {
        transactionDate: { type: Type.STRING, description: 'ISO date' },
        amount: { type: Type.NUMBER },
        currency: { type: Type.STRING },
        vendor: { type: Type.STRING },
        category: { type: Type.STRING },
        lineItems: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              description: { type: Type.STRING },
              price: { type: Type.NUMBER },
              quantity: { type: Type.INTEGER }
            }
          }
        }
      },
      required: ['amount', 'currency', 'vendor']
    }
  },
  {
    id: 'system-event',
    name: 'Structured Log Event',
    description: 'Converts messy logs into traceable event objects.',
    targetJsonSchema: {
      type: Type.OBJECT,
      properties: {
        timestamp: { type: Type.STRING },
        level: { type: Type.STRING, description: 'ERROR, WARN, INFO, DEBUG' },
        service: { type: Type.STRING },
        message: { type: Type.STRING },
        metadata: {
          type: Type.OBJECT,
          properties: {
            requestId: { type: Type.STRING },
            userId: { type: Type.STRING },
            latencyMs: { type: Type.NUMBER }
          }
        }
      },
      required: ['level', 'message']
    }
  }
];
