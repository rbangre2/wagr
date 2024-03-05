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
  getBetById,
  getResolvedBetsByUserId,
} from "@/services/betService";
import { getEventById } from "@/services/eventService";
import { getUserById, updateUserBalance } from "@/services/userService";
import IconButton from "@mui/material/IconButton";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

const BetTable: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [refreshToggle, setRefreshToggle] = useState(false);
  const [rows, setRows] = useState<BetWithDetails[]>([]);
  const { user, setUser } = useUser();

  useEffect(() => {
    const mapBetsToRows = async (bets: Bet[]): Promise<BetWithDetails[]> => {
      const betsWithDetails = await Promise.all(
        bets.map(async (bet) => {
          const event = await getEventById(bet.eventId);

          if (event) {
            const homeWin = event.result === "Win";
            const senderOutcome =
              (homeWin && bet.senderSelection === event.homeTeam) ||
              (!homeWin && bet.senderSelection === event.awayTeam)
                ? "WIN"
                : "LOST";
            // Determine the outcome for the receiver
            const receiverOutcome =
              (homeWin && bet.receiverSelection === event.homeTeam) ||
              (!homeWin && bet.receiverSelection === event.awayTeam)
                ? "WIN"
                : "LOST";
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
                outcome: senderOutcome,
                net_result:
                  senderOutcome === "WIN"
                    ? bet.senderPotentialWin - bet.senderStake
                    : -1 * bet.senderStake,
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
              outcome: receiverOutcome,
              net_result:
                receiverOutcome === "WIN"
                  ? bet.receiverPotentialWin - bet.receiverStake
                  : -1 * bet.receiverStake,
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
          case 3:
            const resolved = await getResolvedBetsByUserId(userId);
            setRows(await mapBetsToRows(resolved));
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
    const bet = await getBetById(id);
    if (!bet) {
      console.error("bet not found");
      return;
    }

    if (user && user.balance < bet.receiverStake) {
      alert("insufficient funds to accept bet");
      console.error("insufficient funds to accept bet");
      return;
    }

    try {
      if (user && user.id) {
        await acceptBet(id);
        await updateUserBalance(user.id, user.balance - bet.receiverStake);
        setUser({ ...user, balance: user.balance - bet.receiverStake });
        setRefreshToggle((t) => !t);
      }
    } catch (error) {
      console.error("error accepting bet with id: ", id);
    }
    console.log(`accepted bet with id: ${id}`);
  };

  const handleDecline = async (id: string) => {
    const bet = await getBetById(id);
    if (!bet) {
      console.error("bet not found");
      return;
    }
    const sender = await getUserById(bet.senderId);
    if (!sender) {
      console.error("sender not found");
      return;
    }

    try {
      if (user && user.id) {
        await declineBet(id);
        await updateUserBalance(bet.senderId, sender.balance + bet.senderStake);
        setUser({ ...user, balance: user.balance + bet.senderStake });
        setRefreshToggle((t) => !t);
      }
    } catch (error) {
      console.error("error rejecting bet: ", id);
    }
    console.log(`declined bet with id: ${id}`);
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

  const resolvedBetsColumn: GridColDef[] = [
    { field: "opponent", headerName: "Opponent", width: 150 },
    { field: "event", headerName: "Event", width: 200 },
    { field: "selection", headerName: "Selection", width: 150 },
    { field: "staked", headerName: "Stake", width: 110 },
    { field: "odds", headerName: "Odds", width: 110 },
    { field: "outcome", headerName: "Outcome", width: 150 },
    { field: "net_result", headerName: "Net Result", width: 150 },
    { field: "eventDate", headerName: "Event Date", width: 150 },
  ];

  return (
    <Box sx={{ height: 500, width: "100%" }}>
      <Tabs value={tabValue} onChange={handleTabChange} aria-label="bet tabs">
        <Tab label="Bets" />
        <Tab label="Incoming Bets" />
        <Tab label="Outgoing Bets" />
        <Tab label="Resolved Bets" />
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
      <TabPanel value={tabValue} index={3}>
        <DataGrid rows={rows} columns={resolvedBetsColumn} autoHeight />
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
