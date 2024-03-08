export type CreditCardDetailsForm = {
  creditCardNumber: string;
  expiry: string;
  cvv: string;
};

export const defaultCreditCardDetailsForm: CreditCardDetailsForm = {
  creditCardNumber: "",
  expiry: "",
  cvv: "",
};

export type DepositDetailsForm = {
  amount: number;
  method: string;
};

export const defaultDepositDetailsForm = {
  amount: 0,
  method: "",
};