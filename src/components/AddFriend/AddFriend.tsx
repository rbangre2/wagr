import React, { useState } from "react";
import SearchBar from "../SearchBar/SearchBar"; // Adjust the import path as necessary
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { Box } from "@mui/material";
import { User } from "@/models/User"; // Adjust the import path as necessary

interface AddUser {
  id: string;
  email: string;
}

const AddFriend: React.FC = () => {
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<AddUser[]>([]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
    if (event.target.value) {
      searchFriends(event.target.value);
    } else {
      setSearchResults([]);
    }
  };

  const sendFriendInvite = (userId: string | undefined) => {
    console.log("Sending invite to:", userId); // Placeholder functionality
  };

  const searchFriends = async (prefix: string) => {
    // Hardcoded data for demonstration purposes
    setSearchResults([
      { id: "1", email: "Alice" },
      { id: "2", email: "Bob" },
      { id: "3", email: "Charlie" },
      // Add more mock users as needed
    ]);
  };

  return (
    <Box sx={{ marginTop: "75px" }}>
      <SearchBar
        searchInput={searchInput}
        handleSearchChange={handleSearchChange}
      />
      <List>
        {searchResults.map((user) => (
          <ListItem
            key={user.id}
            button
            onClick={() => sendFriendInvite(user.id)}
          >
            <ListItemText primary={user.email} />
          </ListItem>
        ))}
      </List>
      <Button
        variant="contained"
        sx={{
          marginTop: "35px",
          marginLeft: "75px",
          backgroundColor: "#a881af", // Primary color or any color you prefer
          color: "#fff", // Text color
          "&:hover": {
            backgroundColor: "var(--accent-hover-color, #115293)", // Darken on hover
          },
          boxShadow:
            "0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)", // Elevation shadow
          textTransform: "none", // Keep the text as is
          fontSize: "1rem", // Larger font size
          fontWeight: "bold", // Bold font weight
          padding: "10px 20px", // More padding for a larger button
          borderRadius: "20px", // Rounded corners
          transition: "background-color 0.3s, box-shadow 0.3s", // Smooth transition for hover effect
        }}
        onClick={() =>
          searchResults.length && sendFriendInvite(searchResults[0].id)
        }
      >
        Invite Friend
      </Button>
    </Box>
  );
};

export default AddFriend;
