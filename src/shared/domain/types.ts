export type Role = "CUSTOMER" | "ADMIN";
export interface Session { userId:string; email:string; role:Role }
export interface Vehicle { id:string;brand:string;model:string;modelYear:number;condition:"NEW"|"USED";price:number;plate?:string;sku:string;mileage:number;active:boolean;currency:"PEN" }
export interface Product {id:string;name:string;minTerm:number;maxTerm:number;minBalloonPct:number;maxBalloonPct:number;maxGraceMonths:number;lifeInsuranceRate:number;vehicleInsuranceRate:number;postage:number;active:boolean}
export interface Installment {number:number;state:string;openingBalance:number;interest:number;amortization:number;basePayment:number;lifeInsurance:number;vehicleInsurance:number;postage:number;balloon:number;totalPayment:number;closingBalance:number}
export interface Simulation {id:string;status:string;vehicleId:string;productId:string;financedAmount:number;monthlyRate:number;basePayment:number;balloonAmount:number;npv:number;monthlyIrr:number;tcea:number;totalInterest:number;totalInsurance:number;totalPaid:number;createdAt:string;schedule?:Installment[]}
export interface Loan {id:string;simulationId:string;status:string;approvedAt:string}
