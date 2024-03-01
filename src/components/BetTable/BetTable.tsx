import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridRowProps } from "@mui/x-data-grid";
import { Tabs, Tab, Box, Button } from "@mui/material";
import { Bet, BetWithDetails } from "@/models/Bet";
import { useUser } from "@/contexts/UserContext";
import {
  getBetsByUserId,
  getIncomingBetsByUserId,
  getOutgoingBetsByUserId,
  acceptBet,
  declineBet,
} from "@/services/betService";
import { getEventById } from "@/services/eventService";
import IconButton from "@mui/material/IconButton";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

const BetTable: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [refreshToggle, setRefreshToggle] = useState(false);
  const [rows, setRows] = useState<BetWithDetails[]>([]);
  const { user } = useUser();

  useEffect(() => {
    const mapBetsToRows = async (bets: Bet[]): Promise<BetWithDetails[]> => {
      const betsWithDetails = await Promise.all(
        bets.map(async (bet) => {
          const event = await getEventById(bet.eventId);

          if (event) {
            console.log(`event date: ${event.date}`);
            if (user?.id === bet.senderId) {
              const senderBet: BetWithDetails = {
                id: bet.id,
                opponent: bet.receiverName,
                event: `${event.homeTeam} vs. ${event?.awayTeam}`,
                selection: bet.senderSelection,
                staked: new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(bet.senderStake),
                odds: new Intl.NumberFormat("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(bet.senderOdds),
                potentialPayout: new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(bet.senderPotentialWin),
                eventDate: new Date(
                  (event.date as any).toDate()
                ).toDateString(),
              };
              return senderBet;
            }
            const receiverBet: BetWithDetails = {
              id: bet.id,
              opponent: bet.senderName,
              event: `${event?.homeTeam} vs. ${event?.awayTeam}`,
              selection: bet.receiverSelection,
              staked: new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(bet.receiverStake),
              odds: new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(bet.receiverOdds),
              potentialPayout: new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(bet.receiverPotentialWin),
              eventDate: new Date((event.date as any).toDate()).toDateString(),
            };
            return receiverBet;
          }
        })
      );

      const res = await Promise.all(betsWithDetails);
      return res.filter((bet): bet is BetWithDetails => bet !== undefined);
    };

    const fetchBetsData = async () => {
      if (user && user.id) {
        const userId = user.id;
        switch (tabValue) {
          case 0:
            const bets = await getBetsByUserId(userId);
            setRows(await mapBetsToRows(bets));

            break;
          case 1:
            const incoming = await getIncomingBetsByUserId(userId);
            setRows(await mapBetsToRows(incoming));
            break;
          case 2:
            const outgoing = await getOutgoingBetsByUserId(userId);
            setRows(await mapBetsToRows(outgoing));
            break;
        }
      }
    };

    fetchBetsData();
  }, [tabValue, user, refreshToggle]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAccept = async (id: string) => {
    await acceptBet(id);
    setRefreshToggle((t) => !t);
    console.log(`Accept bet with id: ${id}`);
  };

  const handleDecline = async (id: string) => {
    await declineBet(id);
    setRefreshToggle((t) => !t);
    console.log(`Decline bet with id: ${id}`);
  };

  const incomingBetsColumn: GridColDef[] = [
    { field: "opponent", headerName: "Opponent", width: 150 },
    { field: "event", headerName: "Event", width: 200 },
    { field: "selection", headerName: "Selection", width: 150 },
    { field: "staked", headerName: "Stake", width: 110 },
    { field: "odds", headerName: "Odds", width: 110 },
    { field: "potentialPayout", headerName: "Payout", width: 150 },
    { field: "eventDate", headerName: "Event Date", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              onClick={() => handleAccept(params.id as string)}
              color="primary"
              size="small"
            >
              <CheckCircleOutlineIcon />
            </IconButton>
            <IconButton
              onClick={() => handleDecline(params.id as string)}
              color="secondary"
              size="small"
            >
              <HighlightOffIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  const outgoingBetsColumn: GridColDef[] = [
    { field: "opponent", headerName: "Opponent", width: 150 },
    { field: "event", headerName: "Event", width: 200 },
    { field: "selection", headerName: "Selection", width: 150 },
    { field: "staked", headerName: "Stake", width: 110 },
    { field: "odds", headerName: "Odds", width: 110 },
    { field: "potentialPayout", headerName: "Payout", width: 150 },
    { field: "eventDate", headerName: "Event Date", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              onClick={() => handleDecline(params.id as string)}
              color="secondary"
              size="small"
            >
              <HighlightOffIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  const betsColumn: GridColDef[] = [
    { field: "opponent", headerName: "Opponent", width: 150 },
    { field: "event", headerName: "Event", width: 200 },
    { field: "selection", headerName: "Selection", width: 150 },
    { field: "staked", headerName: "Stake", width: 110 },
    { field: "odds", headerName: "Odds", width: 110 },
    { field: "potentialPayout", headerName: "Payout", width: 150 },
    { field: "eventDate", headerName: "Event Date", width: 150 },
  ];

  return (
    <Box sx={{ height: 500, width: "100%" }}>
      <Tabs value={tabValue} onChange={handleTabChange} aria-label="bet tabs">
        <Tab label="Bets" />
        <Tab label="Incoming Bets" />
        <Tab label="Outgoing Bets" />
      </Tabs>
      <TabPanel value={tabValue} index={0}>
        <DataGrid rows={rows} columns={betsColumn} autoHeight />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <DataGrid rows={rows} columns={incomingBetsColumn} autoHeight />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <DataGrid rows={rows} columns={outgoingBetsColumn} autoHeight />
      </TabPanel>
    </Box>
  );
};

export default BetTable;

function TabPanel(props: {
  children?: React.ReactNode;
  index: any;
  value: any;
}) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}
