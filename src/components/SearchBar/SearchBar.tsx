import React from "react";
import { TextField } from "@mui/material";
import { IconSearch } from "@tabler/icons-react";

interface SearchBarProps {
  searchInput: string;
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchBar({
  searchInput,
  handleSearchChange,
}: SearchBarProps) {
  return (
    <TextField
      margin="normal"
      id="search"
      name="search"
      value={searchInput}
      onChange={handleSearchChange}
      label="Search"
      InputProps={{
        sx: {
          borderRadius: "10px",
          width: "300px",
          backgroundColor: "white",
          border: "none",
          fontFamily: "Inter",
        },
        endAdornment: <IconSearch size={20} />,
      }}
      InputLabelProps={{
        shrink: false,
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: "transparent", // Change the focused border color
            boxShadow:
              "rgba(145, 158, 171, 0.3) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px",
          },
          "&:hover fieldset": {
            borderColor: "transparent", // Change the hover border color
          },
          "&.Mui-focused fieldset": {
            borderColor: "black", // Change the focused border color
          },
        },
        "& .MuiInputLabel-root": {
          borderColor: "black",
          color: "grey", // Change the unfocused label color
          "&.Mui-focused": {
            color: "transparent", // Change the focused label color
          },
        },
      }}
    />
  );
}
