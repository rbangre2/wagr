// components/SignupForm.tsx
import React, { useState, FormEvent } from "react";
import {
  Box,
  Button,
  Typography,
  Link,
  InputAdornment,
  IconButton,
  Snackbar,
} from "@mui/material";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { useRouter } from "next/navigation";
import { signIn } from "@/services/userService";
import FormTextField from "../FormTextField/FormTextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SigninForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

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

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await signIn(formData.email, formData.password);
      router.push("/dashboard");
    } catch (error) {
      setError("Failed to sign in. Please check your credentials.");
      setOpenSnackbar(true);
      setFormData({ email: "", password: "" });
    }
  };

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
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
          borderRadius: "20px",
          backgroundColor: "#e6bbad",
          "&:hover": {
            backgroundColor: "lightgreen",
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
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SigninForm;
