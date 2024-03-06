import { CreditCardDetailsForm } from "@/app/account/deposit/types";
import { Box, Typography } from "@mui/material";
import FormTextField from "../FormTextField/FormTextField";
import styles from "./CreditCardDetailsCard.module.css";

interface CreditCardDetailsCardProps {
  creditCardDetailsForm: CreditCardDetailsForm;
  handleCreditCardDetailsFormChange: (prop: string) => (event: {
    target: {
      value: any;
    };
  }) => void;
}

export default function CreditCardDetailsCard({
  creditCardDetailsForm,
  handleCreditCardDetailsFormChange,
}: CreditCardDetailsCardProps) {
  return (
    <Box className={styles.container}>
      <Box className={styles.titleContainer}>
        <Typography className={styles.title}>Credit Card Details</Typography>
      </Box>
      <Box className={styles.formContainer}>
        <Box className={styles.twoBox}>
          <FormTextField
            idName="creditCardNumber"
            labelName="Credit Card Number"
            value={creditCardDetailsForm.creditCardNumber}
            onChange={handleCreditCardDetailsFormChange("creditCardNumber")}
          />
        </Box>
        <Box className={styles.twoBox}>
          <FormTextField
            idName="expiry"
            labelName="Expiry"
            value={creditCardDetailsForm.expiry}
            onChange={handleCreditCardDetailsFormChange("expiry")}
          />
          <Box className={styles.spacer} />
          <FormTextField
            idName="cvv"
            labelName="CVV"
            value={creditCardDetailsForm.cvv}
            onChange={handleCreditCardDetailsFormChange("cvv")}
          />
        </Box>
      </Box>
    </Box>
  );
}
