import React, { useState } from "react";
import { grey } from "@mui/material/colors";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField,
} from "@mui/material";
import { Sport, League, Filter } from "@/app/dashboard/bets/types";
import { leagueOptions } from "./types";

interface FilterRowProps {
  initFilter: Filter;
  onApplyFilters: (filters: Filter) => void;
  onClearFilters: () => void;
}

const FilterRow: React.FC<FilterRowProps> = ({
  initFilter,
  onApplyFilters,
  onClearFilters,
}) => {
  const [selectedSport, setSelectedSport] = useState<Sport>(Sport.None);
  const [selectedLeague, setSelectedLeague] = useState<League>(League.None);

  const handleApplyFilters = () => {
    const newFilter: Filter = {
      sport: selectedSport,
      league: selectedLeague,
    };
    onApplyFilters(newFilter);
  };

  const resetFilters = () => {
    setSelectedSport(Sport.None);
    setSelectedLeague(League.None);
    onClearFilters();
  };

  const availableLeagues = selectedSport
    ? leagueOptions.filter((league) => league.sport === selectedSport)
    : leagueOptions;

  return (
    <Box
      sx={{
        flexGrow: 1,
        marginBottom: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap", // Allows the boxes to wrap when the window is resized
      }}
    >
      {/* Sport selection */}
      <Box sx={{ minWidth: 120, margin: 1 }}>
        <FormControl fullWidth>
          <InputLabel id="sport-select-label">Sport</InputLabel>
          <Select
            labelId="sport-select-label"
            id="sport-select"
            value={selectedSport}
            label="Sport"
            onChange={(event) => setSelectedSport(event.target.value as Sport)}
          >
            {Object.values(Sport).map((sport) => (
              <MenuItem key={sport} value={sport}>
                {sport}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* League selection */}
      <Box sx={{ minWidth: 120, margin: 1 }}>
        <FormControl fullWidth>
          <InputLabel id="league-select-label">League</InputLabel>
          <Select
            labelId="league-select-label"
            id="league-select"
            value={selectedLeague}
            label="League"
            onChange={(event) =>
              setSelectedLeague(event.target.value as League)
            }
            disabled={!selectedSport}
          >
            {availableLeagues.map((league) => (
              <MenuItem key={league.value} value={league.value}>
                {league.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Buttons */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          margin: 1,
          justifyContent: "flex-end", // Aligns the buttons to the right
          flex: 1,
        }}
      >
        <Button
          variant="contained"
          onClick={handleApplyFilters}
          sx={{
            backgroundColor: grey[900],
            color: "#fff",
            "&:hover": {
              backgroundColor: grey[700],
            },
          }}
        >
          Apply
        </Button>
        <Button
          variant="contained"
          onClick={resetFilters} // Fixed to use resetFilters function
          sx={{
            backgroundColor: "lightgray",
            color: "black",
            "&:hover": {
              backgroundColor: grey[700],
            },
          }}
        >
          Reset
        </Button>
      </Box>
    </Box>
  );
};

export default FilterRow;
