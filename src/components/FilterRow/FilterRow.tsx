import React, { useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  TextField,
} from "@mui/material";
import OddsRangeSlider from "../OddsSlider/OddsSlider";
import { Sport, League, sportsOptions, leagueOptions } from "./types";

const FilterRow: React.FC = () => {
  const [selectedSport, setSelectedSport] = useState<Sport | "">("");
  const [selectedLeague, setSelectedLeague] = useState<League | "">("");
  const [oddsRange, setOddsRange] = useState<number[]>([1.01, 5]);
  const [amount, setAmount] = useState<number | "">("");

  const handleApplyFilters = () => {
    console.log(selectedSport, selectedLeague, oddsRange, amount);
  };

  const handleOddsRangeChange = (event: Event, newValue: number | number[]) => {
    setOddsRange(newValue as number[]);
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
      }}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={2}>
          <FormControl fullWidth>
            <InputLabel id="sport-select-label">Sport</InputLabel>
            <Select
              labelId="sport-select-label"
              id="sport-select"
              value={selectedSport}
              label="Sport"
              onChange={(event) =>
                setSelectedSport(event.target.value as Sport)
              }
            >
              {Object.values(Sport).map((sport) => (
                <MenuItem key={sport} value={sport}>
                  {sport}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={2}>
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
        </Grid>
        <Grid item xs={4}>
          <Box
            sx={{
              marginTop: "20px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <OddsRangeSlider
              value={oddsRange}
              onChange={handleOddsRangeChange}
              valueLabelDisplay="auto"
              min={1.01}
              max={5}
              step={0.01}
            />
          </Box>
        </Grid>
        <Grid item xs={2}>
          <TextField
            id="amount-input"
            label="Amount"
            type="number"
            variant="outlined"
            fullWidth
            value={amount}
            onChange={(event) => {
              const value = event.target.value;
              const numericalValue = parseFloat(value);
              setAmount(numericalValue >= 0 ? numericalValue : "");
            }}
          />
        </Grid>
        <Grid item xs={2}>
          <Button variant="contained" onClick={handleApplyFilters} fullWidth>
            Apply Filters
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FilterRow;
