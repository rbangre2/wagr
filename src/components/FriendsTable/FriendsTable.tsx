import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import ChallengeIcon from "@mui/icons-material/SportsMma";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelIcon from "@mui/icons-material/Cancel";
import { DataGrid } from "@mui/x-data-grid";
import { Tabs, Tab, Box } from "@mui/material";
import { GridRenderCellParams, GridAlignment } from "@mui/x-data-grid";
import { formatDistanceToNow } from "date-fns";
import Typography from '@mui/material/Typography';
import { Friend } from "@/models/User";
import StatusIndicator from "../StatusIndicator/StatusIndicator";
import { FriendRequest } from "@/models/FriendRequest"; // Assuming Friend is also exported from FriendRequest for simplification
import {
  removeFriend,
  getIncomingFriendRequestsForUser,
  getOutgoingFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriends,
} from "@/services/friendService";
import { useUser } from "@/contexts/UserContext";
import { TabPanelProps } from "./types";
import { getUserById } from "@/services/userService";
import { formatCurrency } from "@/utils/designUtils";

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
  const [openDialog, setOpenDialog] = useState(false); // Added missing state for dialog
  const [friendToRemove, setFriendToRemove] = useState<Friend | null>(null); // Added missing state for friend to remove
  const user = useUser().user;

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAcceptRequest = async (requestId: string, senderId: string) => {
    try {
      if (user && user.id) {
        await acceptFriendRequest(requestId, senderId, user.id);
        setTabValue(0);
        setRefreshRequests((prevState) => !prevState);
      }
    } catch (error) {
      console.error("error accepting friend request", error);
    }
  };

  const handleRemoveFriend = async (friendId: string) => { // Modified to accept friendId
    try {
      if (user && user.id && friendId) { // Check if friendId is provided
        await removeFriend(user.id, friendId);
        setRefreshRequests((prevState) => !prevState);
        setOpenDialog(false); // Close the dialog
      }
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      if (user && user.id) {
        await rejectFriendRequest(requestId);
        setRefreshRequests((prevState) => !prevState);
      }
    } catch (error) {
      console.error("error rejecting friend request", error);
    }
  };

  const columns = [
    {
      field: "profile",
      headerName: "Profile",
      renderCell: (params: GridRenderCellParams) => (
        <Avatar alt={params.row.name} src={params.row.profilePicture} />
      ),
      width: 125,
      headerAlign: "center" as GridAlignment,
      align: "center" as GridAlignment,
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
      renderCell: (params: GridRenderCellParams) => (
        <>
          <IconButton aria-label="challenge">
            <ChallengeIcon />
          </IconButton>
          <IconButton aria-label="remove"  onClick={() => handleRemoveFriend(params.row.id)} >
            <PersonRemoveIcon />
          </IconButton>
        </>
      ),
      width: 200,
      headerAlign: "center" as GridAlignment,
      align: "center" as GridAlignment,
    },
  ];

  const incomingRequestColumns = [
    {
      field: "from",
      headerName: "From",
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            alt={params.row.senderName}
            src={params.row.senderProfilePicture}
            sx={{ width: 30, height: 30, marginRight: 2 }}
          />
          <Typography variant="body2" noWrap>
            {params.row.senderName}
          </Typography>
        </Box>
      ),
      headerAlign: "left" as GridAlignment,
      align: "left" as GridAlignment,
    },
    {
      field: "sentDate",
      headerName: "Sent Date",
      width: 250,
      valueGetter: (params: GridRenderCellParams) =>
        `${formatDistanceToNow(new Date(params.row.createdAt), {
          addSuffix: true,
        })}`,
      headerAlign: "center" as GridAlignment,
      align: "center" as GridAlignment,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      renderCell: (params: GridRenderCellParams<FriendRequest>) => {
        return (
          <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
            <IconButton
              aria-label="accept"
              color="success"
              size="small"
              onClick={() =>
                handleAcceptRequest(params.row.id, params.row.sender)
              }
            >
              <CheckCircleOutlineIcon />
            </IconButton>
            <IconButton
              aria-label="decline"
              color="error"
              size="small"
              onClick={() => handleRejectRequest(params.row.id)}
            >
              <CancelIcon />
            </IconButton>
          </Box>
        );
      },
      headerAlign: "center" as GridAlignment,
      align: "center" as GridAlignment,
    },
  ];

  const outgoingRequestColumns = [
    {
      field: "sent to",
      headerName: "To",
      width: 200,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar
            alt={params.row.receiverName}
            src={params.row.receiverProfilePicture}
          />
          <span>{params.row.receiverName}</span>
        </Box>
      ),
    },
    {
      field: "sentDate",
      headerName: "Sent Date",
      width: 180,
      valueGetter: (params: GridRenderCellParams) =>
        formatDistanceToNow(new Date(params.row.createdAt), {
          addSuffix: true,
        }),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
          <IconButton
            aria-label="cancel request"
            color="warning"
            size="small"
            onClick={() => handleRejectRequest(params.row.id)}
          >
            <CancelIcon />
          </IconButton>
        </Box>
      ),
      headerAlign: "center" as GridAlignment,
      align: "center" as GridAlignment,
    },
  ];

  useEffect(() => {
    async function fetchFriends() {
      try {
        if (user && user.id) {
          const friendsList = await getFriends(user.id);
          setFriends(friendsList);
        }
      } catch (error) {
        console.error("failed to fetch friends: ", error);
      }
    }

    async function fetchIncomingRequests() {
      try {
        if (user && user.id) {
          const incomingRequestsData = await getIncomingFriendRequestsForUser(
            user.id
          );

          const incomingRequestsWithSenderInfo = await Promise.all(
            incomingRequestsData.map(async (request) => {
              const senderUser = await getUserById(request.sender);
              return {
                ...request,
                senderName: senderUser
                  ? senderUser.firstName + " " + senderUser.lastName
                  : "Unknown",
              };
            })
          );
          setIncomingRequests(incomingRequestsWithSenderInfo);
        }
      } catch (error) {
        console.error("Error fetching incoming friend requests:", error);
      }
    }

    async function fetchOutgoingRequests() {
      try {
        if (user && user.id) {
          const outgoingRequestsData = await getOutgoingFriendRequests(user.id);

          const outgoingRequestsWithReceiverInfo = await Promise.all(
            outgoingRequestsData.map(async (request) => {
              const receiverUser = await getUserById(request.receiver);
              return {
                ...request,
                receiverName: receiverUser
                  ? receiverUser.firstName + " " + receiverUser.lastName
                  : "Unknown",
              };
            })
          );
          setOutgoingRequests(outgoingRequestsWithReceiverInfo);
        }
      } catch (error) {
        console.error("error fetching outgoing requests", error);
      }
    }

    fetchFriends();
    fetchIncomingRequests();
    fetchOutgoingRequests();
  }, [user, user?.id, refreshRequests]);

  return (
    <>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="friend tabs"
        >
          <Tab label="Friends" />
          <Tab label="Incoming Requests" />
          <Tab label="Outgoing Requests" />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        <div style={{ height: 500, width: "100%" }}>
          <DataGrid
            rows={friends}
            columns={columns}
            disableRowSelectionOnClick
          />
        </div>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <div style={{ height: 500, width: "100%" }}>
          <DataGrid
            rows={incomingRequests}
            columns={incomingRequestColumns}
            disableRowSelectionOnClick
            disableColumnFilter
            disableColumnSelector
          />
        </div>
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <div style={{ height: 500, width: "100%" }}>
          <DataGrid
            rows={outgoingRequests}
            columns={outgoingRequestColumns}
            disableRowSelectionOnClick
          />
        </div>
      </TabPanel>
    </>
  );
};

export default FriendsTable;