import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import ChallengeIcon from "@mui/icons-material/SportsMma";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelIcon from "@mui/icons-material/Cancel";
import { DataGrid, GridRenderCellParams, GridAlignment } from "@mui/x-data-grid";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Tabs, Tab, Box, Typography } from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import StatusIndicator from "../StatusIndicator/StatusIndicator";
import { formatCurrency } from "@/utils/designUtils";
import { Friend } from "@/models/User"; // Ensure you have the correct path for your models
import { removeFriend, getIncomingFriendRequestsForUser, getOutgoingFriendRequests, acceptFriendRequest, rejectFriendRequest, getFriends } from "@/services/friendService"; // Ensure paths are correct
import { useUser } from "@/contexts/UserContext";
import { FriendRequest } from "@/models/FriendRequest";
import { getUserById } from "@/services/userService";

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
    </Box>
  );
}

const FriendsTable: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<FriendRequest[]>([]);
  const [refreshRequests, setRefreshRequests] = useState(false);
  const { user } = useUser();
  const [openDialog, setOpenDialog] = useState(false);
  const [friendToRemove, setFriendToRemove] = useState({ id: "", name: "" });


  useEffect(() => {
    async function fetchData() {
      if (user && user.id) {
        const fetchedFriends = await getFriends(user.id);
        setFriends(fetchedFriends);
        const fetchedIncomingRequests = await getIncomingFriendRequestsForUser(user.id);
        setIncomingRequests(fetchedIncomingRequests);
        const fetchedOutgoingRequests = await getOutgoingFriendRequests(user.id);
        setOutgoingRequests(fetchedOutgoingRequests);
      }
    }

    fetchData();
  }, [user, refreshRequests]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAcceptRequest = async (requestId: string, senderId: string) => {
    try {
      if (user) {
        await acceptFriendRequest(requestId, senderId || "", user.id);
        setRefreshRequests((prevState) => !prevState);
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await rejectFriendRequest(requestId);
      setRefreshRequests((prevState) => !prevState);
    } catch (error) {
      console.error("Error rejecting friend request:", error);
    }
  };

  const handleRemoveFriend = async (friendId: string) => {
    try {
      await removeFriend(user.id, friendId);
      setRefreshRequests((prevState) => !prevState);
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  const columns = [
    {
      field: "profile",
      headerName: "Profile",
      width: 125,
      renderCell: (params: GridRenderCellParams<any>) => (
        <Avatar alt={params.row.name} src={params.row.profilePicture} />
      ),
      headerAlign: "center",
      align: "center",
    },
    {
      field: "name",
      headerName: "Name",
      width: 150,
      headerAlign: "center" as GridAlignment,
      align: "center" as GridAlignment,
    },
    {
      field: "status",
      headerName: "Status",
      renderCell: (params: GridRenderCellParams) => (
        <>
          <StatusIndicator status={params.row.status} />
          {params.row.status}
        </>
      ),
      width: 150,
      headerAlign: "center" as GridAlignment,
      align: "center" as GridAlignment,
    },
    {
      field: "lastActive",
      headerName: "Last Active",
      valueGetter: (params: GridRenderCellParams) =>
        `${formatDistanceToNow(new Date(params.row.lastActive), {
          addSuffix: true,
        })}`,
      width: 175,
      headerAlign: "center" as GridAlignment,
      align: "center" as GridAlignment,
    },
    {
      field: "netResult",
      headerName: "Net Result",
      width: 150,
      renderCell: (params: GridRenderCellParams) => {
        const value = params.value as number;
        const formattedValue = formatCurrency(value);
        const color = value > 0 ? "green" : value < 0 ? "red" : "grey";

        return <div style={{ color: color }}>{formattedValue}</div>;
      },
      headerAlign: "center" as GridAlignment,
      align: "center" as GridAlignment,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params: GridRenderCellParams<any>) => (
        <>
          <IconButton aria-label="challenge">
            <ChallengeIcon />
          </IconButton>
          <IconButton aria-label="remove" onClick={() => handleRemoveFriend(params.id)}>
            <PersonRemoveIcon />
          </IconButton>
        </>
      ),
      headerAlign: "center",
      align: "center",
    },
  ];

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="friend tabs">
          <Tab label="Friends" />
          <Tab label="Incoming Requests" />
          <Tab label="Outgoing Requests" />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        <div style={{ height: 500, width: "100%" }}>
          <DataGrid rows={friends} columns={columns} pageSize={5} />
        </div>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        {/* Render incoming friend requests */}
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        {/* Render outgoing friend requests */}
      </TabPanel>
    </>
  );
};

export default FriendsTable;
