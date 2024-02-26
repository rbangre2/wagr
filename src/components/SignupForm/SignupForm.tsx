// components/SignupForm.tsx
import React, { useState, FormEvent } from "react";
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
import { useRouter } from "next/navigation";
import { signup } from "@/services/userService";
import FormTextField from "../FormTextField/FormTextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await signup(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName
      );
      router.push("/dashboard");
    } catch (error: any) {
      console.log(`signup error: ${error.message}`);
    }
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
        Welcome To Wagr
      </Typography>
      <Typography
        variant="subtitle1"
        color="black"
        textAlign="center"
        gutterBottom
      >
        Create an account to get started!
      </Typography>
      <FormTextField
        idName="firstName"
        labelName="First Name"
        value={formData.firstName}
        onChange={handleChange("firstName")}
      />
      <FormTextField
        idName="firstName"
        labelName="Last Name"
        value={formData.lastName}
        onChange={handleChange("lastName")}
      />
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

      <FormTextField
        idName="confirm-password"
        labelName="Confirm Password"
        type={showConfirmPassword ? "text" : "password"}
        value={formData.confirmPassword}
        onChange={handleChange("confirmPassword")}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle confirm password visibility"
              onClick={handleClickShowConfirmPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
          backgroundColor: "#add1e6", // Main color
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
        {"Already have an account? "}
        <Link href="/auth/signin">Sign In</Link>
      </Typography>
    </Box>
  );
};

export default SignupForm;
