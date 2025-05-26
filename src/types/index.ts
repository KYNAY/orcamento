export interface Material {
  id: string;
  name: string;
  type: MaterialType;
  pricePerUnit: number;
  quantity: number;
  details?: string;
  dimensions?: {
    width: number;
    height: number;
  };
  finishing: FinishingType;
}

export enum MaterialType {
  GRANITE = "Granito",
  MARBLE = "Mármore",
  QUARTZ = "Quartzo",
  QUARTZITE = "Quartzito",
  ULTRACOMPACT = "Ultracompacto",
}

export enum FinishingType {
  POLISHED = "Polido",
  RAW = "Bruto",
  LEATHERED = "Levigado",
  FLAMED = "Flameado",
  SANDBLASTED = "Jateado",
  BRUSHED = "Escovado",
  BUSH_HAMMERED = "Apicoado",
}

export interface QuotationData {
  company: string;
  seller: string;
  client: string;
  materials: Material[];
  paymentMethod: PaymentMethod;
  installments?: number;
  bankDetails?: BankDetails;
  showBankDetails: boolean;
  validUntil: Date;
  createdAt: Date;
}

export enum PaymentMethod {
  CASH = "À vista",
  CHECK = "Cheque",
  BANK_TRANSFER = "Boleto",
}

export interface BankDetails {
  bank: string;
  agency: string;
  account: string;
  cnpj: string;
  companyName: string;
  pix: string;
}