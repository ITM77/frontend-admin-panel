import { useEffect, useState } from "react";
import NextLink from "next/link";
import PropTypes from "prop-types";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  IconButton,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { PencilAlt as PencilAltIcon } from "@icons/pencil-alt";
import { getInitials } from "@utils/get-initials";
import { Scrollbar } from "../../scrollbar";

export const PushNotificationListTable = (props) => {
  const {
    pushNotifications,
    pushNotificationsCount,
    onPageChange,
    onRowsPerPageChange,
    page,
    rowsPerPage,
    ...other
  } = props;
  const [selectedPushNotifications, setSelectedPushNotifications] = useState(
    []
  );

  // Reset selected pushNotifications when pushNotifications change
  useEffect(
    () => {
      if (selectedPushNotifications.length) {
        setSelectedPushNotifications([]);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pushNotifications]
  );

  const handleSelectAllPushNotifications = (event) => {
    setSelectedPushNotifications(
      event.target.checked ? pushNotifications.map((user) => user.id) : []
    );
  };

  const handleSelectOnePushNotification = (event, userId) => {
    if (!selectedPushNotifications.includes(userId)) {
      setSelectedPushNotifications((prevSelected) => [...prevSelected, userId]);
    } else {
      setSelectedPushNotifications((prevSelected) =>
        prevSelected.filter((id) => id !== userId)
      );
    }
  };

  const enableBulkActions = selectedPushNotifications.length > 0;
  const selectedSomePushNotifications =
    selectedPushNotifications.length > 0 &&
    selectedPushNotifications.length < pushNotifications.length;
  const selectedAllPushNotifications =
    selectedPushNotifications.length === pushNotifications.length;

  return (
    <div {...other}>
      <Box
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "neutral.800" : "neutral.100",
          display: enableBulkActions ? "block" : "none",
          px: 2,
          py: 0.5,
        }}
      >
        <Checkbox
          checked={selectedAllPushNotifications}
          indeterminate={selectedSomePushNotifications}
          onChange={handleSelectAllPushNotifications}
        />
        <Button size="small" sx={{ ml: 2 }}>
          Delete
        </Button>
        <Button size="small" sx={{ ml: 2 }}>
          Edit
        </Button>
      </Box>
      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableHead
            sx={{ visibility: enableBulkActions ? "collapse" : "visible" }}
          >
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAllPushNotifications}
                  indeterminate={selectedSomePushNotifications}
                  onChange={handleSelectAllPushNotifications}
                />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pushNotifications.map((user) => {
              const isPushNotificationSelected =
                selectedPushNotifications.includes(user.id);

              return (
                <TableRow
                  hover
                  key={user.id}
                  selected={isPushNotificationSelected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isPushNotificationSelected}
                      onChange={(event) =>
                        handleSelectOnePushNotification(event, user.id)
                      }
                      value={isPushNotificationSelected}
                    />
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: "center",
                        display: "flex",
                      }}
                    >
                      <Avatar
                        src={user.avatar}
                        sx={{
                          height: 42,
                          width: 42,
                        }}
                      >
                        {getInitials(user.name)}
                      </Avatar>
                      <Box sx={{ ml: 1 }}>
                        <NextLink
                          href={`/dashboard/pushNotifications/${user.id}/edit`}
                          passHref
                        >
                          <Link color="inherit" variant="subtitle2">
                            {user.name}
                          </Link>
                        </NextLink>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell>{user.role?.name}</TableCell>
                  <TableCell>{user.email}</TableCell>

                  <TableCell align="right">
                    <NextLink
                      href={`/dashboard/pushNotifications/${user.id}/edit`}
                      passHref
                    >
                      <IconButton component="a">
                        <PencilAltIcon fontSize="small" />
                      </IconButton>
                    </NextLink>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Scrollbar>
      <TablePagination
        component="div"
        count={pushNotificationsCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </div>
  );
};

PushNotificationListTable.propTypes = {
  pushNotifications: PropTypes.array.isRequired,
  pushNotificationsCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};