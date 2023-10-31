// To parse this data:
//
//   import { Convert } from "./file";
//
//   const purchase = Convert.toPurchase(json);

export interface Purchase {
    created_at:    string;
    first_name:    string;
    last_name:     string;
    ticket_number: number;
    quantity:      number;
    price:         number;
    total_price:   number;
    Details:       Details;
}

export interface Details {
    id:          number;
    ticket_id:   number;
    purchase_id: number;
    price:       number;
    quantity:    number;
    total_price: number;
    created_at:  string;
    updated_at:  string;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toPurchase(json: string): Purchase[] {
        return JSON.parse(json);
    }

    public static purchaseToJson(value: Purchase[]): string {
        return JSON.stringify(value);
    }
}
