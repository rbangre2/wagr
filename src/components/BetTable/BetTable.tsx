import React, { useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Tabs, Tab, Box } from "@mui/material";
import { useUser } from "@/contexts/UserContext";
import { useBets } from "@/hooks/useBets";
import { useIncomingBets } from "@/hooks/useIncomingBets";
import { useOutgoingBets } from "@/hooks/useOutgoingBets";
import { useResolvedBets } from "@/hooks/useResolvedBets";
import IconButton from "@mui/material/IconButton";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { acceptBet, declineBet, getBetById } from "@/services/betService";
import { getUserById, updateUserBalance } from "@/services/userService";

const BetTable = () => {
  const [tabValue, setTabValue] = useState(0);
  const { user, setUser } = useUser();

  // React Query hooks to fetch bets based on the tab
  const { data: bets, refetch: refetchBets } = useBets(user?.id);
  const { data: incomingBets, refetch: refetchIncomingBets } = useIncomingBets(
    user?.id
  );
  const { data: outgoingBets, refetch: refetchOutgoingBets } = useOutgoingBets(
    user?.id
  );
  const { data: resolvedBets, refetch: refetchResolvedBets } = useResolvedBets(
    user?.id
  );

  // Dynamically select the correct dataset based on the active tab
  const betsData = (() => {
    switch (tabValue) {
      case 0:
        return bets;
      case 1:
        return incomingBets;
      case 2:
        return outgoingBets;
      case 3:
        return resolvedBets;
      default:
        return [];
    }
  })();

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

  const columns = (() => {
    switch (tabValue) {
      case 0:
        return betsColumn;
      case 1:
        return incomingBetsColumn;
      case 2:
        return outgoingBetsColumn;
      case 3:
        return resolvedBetsColumn;
      default:
        return betsColumn;
    }
  })();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
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
        refetchIncomingBets();
        refetchBets();
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
      if (user && user.id && user.id === bet.senderId) {
        await updateUserBalance(bet.senderId, sender.balance + bet.senderStake);
        setUser({ ...user, balance: user.balance + bet.senderStake });
      }
      await declineBet(id);
      refetchIncomingBets();
      refetchOutgoingBets();
      refetchBets();
    } catch (error) {
      console.error("error rejecting bet: ", id);
    }
    console.log(`declined bet with id: ${id}`);
  };

  return (
    <Box sx={{ height: 600, width: "100%" }}>
      <Tabs value={tabValue} onChange={handleTabChange} aria-label="bet tabs">
        <Tab label="My Bets" />
        <Tab label="Incoming Bets" />
        <Tab label="Outgoing Bets" />
        <Tab label="Bet History" />
      </Tabs>
      <DataGrid rows={betsData || []} columns={columns} autoHeight />
    </Box>
  );
};

export default BetTable;
