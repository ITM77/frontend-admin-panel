import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { format } from "date-fns";
import {
  Box,
  Card,
  Container,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DashboardLayout } from "@components/dashboard/dashboard-layout";
import { PointListTable } from "@components/dashboard/partners_balance/point/point-list-table";
import { Search as SearchIcon } from "@icons/search";
import { useDispatch, useSelector } from "src/store";
import {
  getPartnerPointsBalanceStatuses,
  getPartnersBalancePoints,
} from "@services/index";
import { AuthGuard } from "@components/authentication/auth-guard";
import { gtm } from "src/lib/gtm";

const PointList = () => {
  const dispatch = useDispatch();

  const { partnerPointsBalanceStatuses } = useSelector(
    (state) => state.handbooks
  );

  const { partnersBalancePoints, count } = useSelector(
    (state) => state.partnersBalance
  );

  const router = useRouter();

  const queryRef = useRef(null);

  const partnerId = router.query?.partnerId;

  const queryParams = {
    page: router.query?.page ?? 0,
    perPage: router.query?.perPage ?? 10,
    search: router.query?.search ?? "",
    status: router.query?.status ?? "",
    dateTo: router.query?.dateTo ?? "2099-10-10",
    dateFrom: router.query?.dateFrom ?? "2000-10-10",
  };
  const [search, setSearch] = useState(queryParams?.search);
  const [dateTo, setDateTo] = useState(queryParams?.dateTo);
  const [dateFrom, setDateFrom] = useState(queryParams?.dateFrom);
  const [page, setPage] = useState(+queryParams.page);
  const [rowsPerPage, setRowsPerPage] = useState(+queryParams?.perPage);
  const [status, setStatus] = useState(queryParams?.status);

  const formattedDateTo = format(new Date(dateTo), "yyyy-MM-dd");
  const formattedDateFrom = format(new Date(dateFrom), "yyyy-MM-dd");

  const handleQueryChange = (event) => {
    event.preventDefault();
    setSearch(queryRef.current?.value);
  };

  const handleSortChange = (event) => {
    setPage(0);
    setStatus(event.target.value);
  };

  const handlePageChange = (_, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  useEffect(() => {
    dispatch(getPartnerPointsBalanceStatuses());
    gtm.push({ event: "page_view" });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(
        `/dashboard/partners-balance/${partnerId}/points?search=${search}&page=${page}&perPage=${rowsPerPage}&status=${status}&dateFrom=${formattedDateFrom}&dateTo=${formattedDateTo}`
      );
      dispatch(
        getPartnersBalancePoints({
          partnerId: partnerId,
          page: Number(page + 1),
          perPage: Number(rowsPerPage),
          search: search,
          status: status,
          dateTo: formattedDateTo,
          dateFrom: formattedDateFrom,
        })
      );
    }, 500);

    return () => clearTimeout(timer);
  }, [page, rowsPerPage, search, status]);

  return (
    <>
      <Head>
        <title>Dashboard: Partners Balance Points</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ mb: 4 }}>
            <Grid container justifyContent="space-between" spacing={3}>
              <Grid item>
                <Typography variant="h4">Partners Balance Points</Typography>
              </Grid>
            </Grid>
          </Box>
          <Card>
            <Box
              sx={{
                alignItems: "center",
                display: "flex",
                flexWrap: "wrap",
                m: -1.5,
                p: 3,
              }}
            >
              <Box
                sx={{
                  flexGrow: 1,
                  m: 1.5,
                }}
              >
                <TextField
                  defaultValue=""
                  fullWidth
                  onChange={handleQueryChange}
                  inputProps={{ ref: queryRef }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Search partners balance points"
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexGrow: 1,
                }}
              >
                <DatePicker
                  inputFormat="dd/MM/yyyy"
                  label="Date from"
                  onChange={(date) => {
                    setDateFrom(date);
                  }}
                  renderInput={(inputProps) => (
                    <TextField fullWidth {...inputProps} sx={{ m: 1.5 }} />
                  )}
                  value={dateFrom || null}
                />
                <DatePicker
                  inputFormat="dd/MM/yyyy"
                  label="Date to"
                  onChange={(date) => {
                    setDateTo(date);
                  }}
                  renderInput={(inputProps) => (
                    <TextField fullWidth {...inputProps} sx={{ m: 1.5 }} />
                  )}
                  value={dateTo || null}
                />
                <TextField
                  label="Status"
                  name="status"
                  onChange={handleSortChange}
                  select
                  fullWidth
                  SelectProps={{ native: true }}
                  sx={{ m: 1.5 }}
                  value={status}
                >
                  <option></option>
                  {partnerPointsBalanceStatuses.map((option) => (
                    <option key={option.key} value={option.key}>
                      {option.value}
                    </option>
                  ))}
                </TextField>
              </Box>
            </Box>
            {partnersBalancePoints.length > 0 ? (
              <PointListTable
                points={partnersBalancePoints}
                pointsCount={count}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPage={rowsPerPage}
                page={page}
              />
            ) : (
              <Box sx={{ m: 3 }}>No partners balance points found</Box>
            )}
          </Card>
        </Container>
      </Box>
    </>
  );
};

PointList.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>{page}</DashboardLayout>
  </AuthGuard>
);

export default PointList;
