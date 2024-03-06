import React from "react";
import { Avatar, Box, Button, Typography } from "@mui/material";
import styles from "./ChangePfpCard.module.css";

interface ChangePfpCardProps {
  newPfpBlob: Blob | null;
  setNewPfpBlob: React.Dispatch<React.SetStateAction<Blob | null>>;
  pfpSource: string;
  handleClearPfp: () => void;
}

export default function ChangePfpCard({
  newPfpBlob,
  setNewPfpBlob,
  pfpSource,
  handleClearPfp,
}: ChangePfpCardProps) {
  const handleUploadClick = () => {
    // Programmatically click the hidden file input
    document.getElementById("hiddenFileInput")?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (
      file &&
      (file.type === "image/png" ||
        file.type === "image/jpg" ||
        file.type === "image/jpeg")
    ) {
      // Convert selected file to Blob and update state
      setNewPfpBlob(new Blob([file], { type: file.type }));
    }
  };
  return (
    <Box className={styles.container}>
      <Box className={styles.titleContainer}>
        <Typography className={styles.title}>Change Profile Picture</Typography>
        <Typography className={styles.subtitle}>
          Upload a new profile picture here!
        </Typography>
      </Box>
      <Box className={styles.pfpContainer}>
        {newPfpBlob !== null && (
          <Avatar
            className={styles.pfp}
            src={URL.createObjectURL(newPfpBlob)}
          />
        )}
        {pfpSource !== "" && newPfpBlob === null && (
          <Avatar className={styles.pfp} src={pfpSource} />
        )}
        {pfpSource === "" && newPfpBlob === null && (
          <Avatar
            className={styles.pfp}
            src="https://i.pinimg.com/originals/f6/bc/9a/f6bc9a75409c4db0acf3683bab1fab9c.png"
          />
        )}
        <Box className={styles.buttonContainer}>
          <input
            type="file"
            id="hiddenFileInput"
            style={{ display: "none" }}
            accept=".png,.jpg,.jpeg"
            onChange={handleFileChange}
          />
          <Button
            variant="contained"
            className={styles.uploadButton}
            onClick={handleUploadClick}
          >
            Upload
          </Button>
          <Button
            variant="contained"
            className={styles.clearButton}
            onClick={handleClearPfp}
          >
            Clear
          </Button>
        </Box>
      </Box>
      <Box className={styles.warningTextContainer}>
        <Typography className={styles.warningText}>
          Supported file types: PNG, JPG, JPEG
        </Typography>
      </Box>
    </Box>
  );
}
