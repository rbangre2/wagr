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
  setShowPassword?: any;
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
      type={showPassword ? "text" : type}
      margin="normal"
      disabled={disabled}
      id={idName}
      name={idName}
      fullWidth
      multiline={type === "Des"}
      value={value}
      onChange={onChange}
      inputProps={{
        endadornment: endAdornment,
      }}
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
        endAdornment:
          type === "password" && !showPassword ? (
            <IconButton onClick={() => setShowPassword(!showPassword)}>
              <IconEye />
            </IconButton>
          ) : type === "password" && showPassword ? (
            <IconButton onClick={() => setShowPassword(!showPassword)}>
              <IconEyeOff />
            </IconButton>
          ) : null,
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
            borderColor: "black", // Change the focused border color
          },
          "&:hover fieldset": {
            borderColor: "black", // Change the hover border color
          },
          "&.Mui-focused fieldset": {
            borderColor: "black", // Change the focused border color
          },
        },
        "& .MuiInputLabel-root": {
          color: "black", // Change the unfocused label color
          fontFamily: "var(--font)",
          "&.Mui-focused": {
            color: "black", // Change the focused label color
          },
        },
      }}
    />
  );
}
