import { Box, Button } from "@mui/material";
import styles from "./DepositCard.module.css";
import DepositMethodCard from "../DepositMethodCard/DepositMethodCard";
import {
  CreditCardDetailsForm,
  DepositDetailsForm,
} from "@/app/account/deposit/types";
import CreditCardDetailsCard from "../CreditCardDetailsCard/CreditCardDetails";

interface DepositCardProps {
  depositDetailsForm: DepositDetailsForm;
  handleDepositDetailsFormChange: (prop: string) => (event: {
    target: {
      value: any;
    };
  }) => void;
  creditCardDetailsForm: CreditCardDetailsForm;
  handleCreditCardDetailsFormChange: (prop: string) => (event: {
    target: {
      value: any;
    };
  }) => void;
}

export default function DepositCard({
  depositDetailsForm,
  handleDepositDetailsFormChange,
  creditCardDetailsForm,
  handleCreditCardDetailsFormChange,
}: DepositCardProps) {
  const onSubmit = async () => {};
  const onClear = async () => {};
  return (
    <Box className={styles.container}>
      <Box className={styles.topRow}>
        <DepositMethodCard
          depositDetailsForm={depositDetailsForm}
          handleDepositDetailsFormChange={handleDepositDetailsFormChange}
        />
        <CreditCardDetailsCard
          creditCardDetailsForm={creditCardDetailsForm}
          handleCreditCardDetailsFormChange={handleCreditCardDetailsFormChange}
        />
      </Box>
      <Box className={styles.buttonContainer}>
        <Button
          variant="contained"
          className={styles.saveButton}
          onClick={onSubmit}
          disabled={Object.values(depositDetailsForm).some(
            (value) => value === ""
          )}
        >
          Deposit
        </Button>
        <Button
          variant="contained"
          className={styles.cancelButton}
          onClick={onClear}
        >
          Clear
        </Button>
      </Box>
    </Box>
  );
}
