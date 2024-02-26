import React, { use, useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import ChallengeIcon from "@mui/icons-material/SportsMma";
import { Friend } from "./types";
import { formatDistanceToNow } from "date-fns";
import { data } from "./mock";
import StatusIndicator from "../StatusIndicator/StatusIndicator";

const FriendsTable: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    setFriends(data);
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="friends table">
          <TableHead>
            <TableRow>
              <TableCell>Profile</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Active</TableCell>
              <TableCell>Net Result</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {friends
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((friend) => (
                <TableRow key={friend.id}>
                  <TableCell>
                    <Avatar alt={friend.name} src={friend.profilePicture} />
                  </TableCell>
                  <TableCell>{friend.name}</TableCell>
                  <TableCell>
                    <StatusIndicator status={friend.status} />
                    {friend.status}
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(friend.lastActive), {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: friend.netResult >= 0 ? "green" : "red",
                    }}
                  >
                    {friend.netResult}
                  </TableCell>
                  <TableCell>
                    <IconButton aria-label="chat">
                      <ChallengeIcon />
                    </IconButton>
                    <IconButton aria-label="delete">
                      <PersonRemoveIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={friends.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};

export default FriendsTable;
