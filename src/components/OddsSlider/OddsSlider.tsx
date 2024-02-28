import { styled } from "@mui/material/styles";
import Slider from "@mui/material/Slider";

const OddsRangeSlider = styled(Slider)(({ theme }) => ({
  color: "#3a8589",
  height: 3,
  padding: "13px 0",
  "& .MuiSlider-thumb": {
    height: 27,
    width: 27,
    backgroundColor: "#fff",
    border: "1px solid currentColor",
    "&:hover": {
      boxShadow: "0 0 0 8px rgba(58, 133, 137, 0.16)",
    },
    "&::after": {
      position: "absolute",
      top: "-50px",
      left: "50%",
      transform: "translateX(-50%)",
      backgroundColor: "#fff",
      padding: "2px 8px",
      fontSize: "0.75rem",
      borderRadius: "4px",
      color: "currentColor",
    },
    "& .airbnb-bar": {
      height: 9,
      width: 1,
      backgroundColor: "currentColor",
      marginLeft: 1,
      marginRight: 1,
    },
  },
  "& .MuiSlider-track": {
    height: 3,
  },
  "& .MuiSlider-rail": {
    color: theme.palette.mode === "dark" ? "#bfbfbf" : "#d8d8d8",
    opacity: theme.palette.mode === "dark" ? undefined : 1,
    height: 3,
  },
}));

export default OddsRangeSlider;
