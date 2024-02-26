import { green, red } from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import { StatusIndicatorProps } from "./types";

const StatusIndicator = styled("span")<StatusIndicatorProps>(({ status }) => ({
  height: "10px",
  width: "10px",
  borderRadius: "50%",
  display: "inline-block",
  marginRight: "5px",
  backgroundColor: status === "Online" ? green[500] : red[500],
}));

export default StatusIndicator;
