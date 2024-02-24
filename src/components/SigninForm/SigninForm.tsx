// components/SignupForm.tsx
import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@mui/material";
import FormTextField from "../FormTextField/FormTextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const SigninForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange =
    (prop: keyof typeof formData) =>
    (
      event: React.ChangeEvent<HTMLInputElement> | { target: { value: any } }
    ) => {
      setFormData({ ...formData, [prop]: event.target.value });
    };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Form data:", formData);
    // Implement your sign-up logic here
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        maxWidth: 400,
        margin: "auto",
      }}
    >
      <Typography variant="h4" textAlign="center" color="black" gutterBottom>
        Welcome Back!
      </Typography>
      <Typography
        variant="subtitle1"
        color="black"
        textAlign="center"
        gutterBottom
      >
        Sign in to start placing some wagrs.
      </Typography>
      <FormTextField
        idName="email"
        labelName="Email"
        type="email"
        value={formData.email}
        onChange={handleChange("email")}
      />
      <FormTextField
        idName="password"
        labelName="Password"
        type={showPassword ? "text" : "password"}
        value={formData.password}
        onChange={handleChange("password")}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
      />
      <Button
        variant="contained"
        type="submit"
        fullWidth
        sx={{
          borderRadius: "20px", // Rounded corners
          backgroundColor: "#e6bbad", // Main color
          "&:hover": {
            backgroundColor: "lightgreen", // Hover color
          },
        }}
      >
        Continue
      </Button>

      <Typography
        variant="body2"
        color="black"
        textAlign="center"
        sx={{ mt: 2 }}
      >
        {"Don't have an account? "} <Link href="/auth/signup">Sign Up</Link>
      </Typography>
    </Box>
  );
};

export default SigninForm;
