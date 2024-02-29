import { IconButton, TextField } from "@mui/material";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import React from "react";

interface FormTextFieldProps {
  idName: string;
  labelName: string;
  value: string;
  onChange: (event: { target: { value: any } }) => void;
  disabled?: boolean;
  type?: string;
  showPassword?: boolean;
  setShowPassword?: (show: boolean) => void; // Updated type
  style?: any;
  width?: string;
  endAdornment?: React.ReactNode;
  onSubmit?: () => void;
}

export default function FormTextField({
  idName,
  labelName,
  value,
  onChange,
  disabled,
  type,
  showPassword,
  setShowPassword,
  style,
  width,
  endAdornment,
  onSubmit,
}: FormTextFieldProps) {
  return (
    <TextField
      type={type === "password" && showPassword ? "text" : type}
      margin="normal"
      disabled={disabled}
      id={idName}
      name={idName}
      fullWidth
      multiline={type === "Des"}
      value={value}
      onChange={onChange}
      label={labelName}
      onKeyDown={(event) => {
        if (event.key === "Enter" && type === "password" && onSubmit) {
          event.preventDefault();
          onSubmit();
        }
      }}
      InputProps={{
        sx: {
          borderRadius: "10px",
          backgroundColor: "var(--background-light)",
          border: "none",
          fontFamily: "var(--font)",
          ...style,
          overflow: "hidden",
          textOverflow: "ellipsis",
          width: width || "100%",
        },
        endAdornment: endAdornment || (
          type === "password" ? (
            <IconButton onClick={() => setShowPassword && setShowPassword(!showPassword)}>
              {showPassword ? <IconEyeOff /> : <IconEye />}
            </IconButton>
          ) : null
        ),
      }}
      sx={{
        "& .MuiInputBase-input": {
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
        "& .MuiOutlinedInput-root": {
          color: "black",
          display: "flex",
          overflow: "hidden",
          textOverflow: "ellipsis",
          alignItems: "center",
          "& fieldset": {
            borderColor: "black",
          },
          "&:hover fieldset": {
            borderColor: "black",
          },
          "&.Mui-focused fieldset": {
            borderColor: "black",
          },
        },
        "& .MuiInputLabel-root": {
          color: "black",
          fontFamily: "var(--font)",
          "&.Mui-focused": {
            color: "black",
          },
        },
      }}
    />
  );
}
