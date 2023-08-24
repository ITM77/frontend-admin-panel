import NextLink from "next/link";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { FieldArray, Formik, getIn } from "formik";
import { Map, Placemark, SearchControl, YMaps } from "react-yandex-maps";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
} from "@mui/material";
import { useDispatch } from "src/store";
import { createPoint, updatePoint } from "@services/index";
import { format } from "date-fns";
import { useRef } from "react";

export const PointEditForm = (props) => {
  const { point, mode = "edit", ...other } = props;

  const dispatch = useDispatch();

  const { query } = useRouter();

  const pointId = query?.pointId;
  const partnerId = query?.partnerId;

  const map = useRef(null);

  const handleGetGeoObject = async (map, setFieldValue) => {
    if (Array.isArray(map)) {
      setFieldValue("location.latitude", map[0]);
      setFieldValue("location.longitude", map[1]);
    } else {
      const coords = map.get("coords");
      setFieldValue("location.latitude", coords[0]);
      setFieldValue("location.longitude", coords[1]);
    }
  };

  const pointPhones = point?.phoneNumbers?.map((item) => {
    return {
      phoneNumber: item.substring(4),
    };
  });

  return (
    <Formik
      enableReinitialize
      initialValues={{
        id: mode === "edit" ? pointId : "",
        partnerId: mode === "create" ? partnerId : "",
        assortment: point?.assortment || "",
        commission: point?.commission || "",
        averageCookingTime: point?.averageCookingTime || null,
        closingTime: new Date("01/01/1970 " + point?.closingTime) || null,
        location: {
          latitude: point?.address?.latitude || "",
          longitude: point?.address?.longitude || "",
        },
        kitchenType: point?.kitchenType || "",
        minimumCheckAmount: point?.minimumCheckAmount || "",
        openingTime: new Date("01/01/1970 " + point?.openingTime) || "",
        status: point?.status || "",
        phoneNumbers:
          pointPhones && pointPhones.length > 0
            ? pointPhones
            : [{ phoneNumber: "" }],
        submit: null,
      }}
      validationSchema={Yup.object().shape({
        // assortment: Yup.string().max(255).required(),
        // averageCookingTime: Yup.string().required(),
        // closingTime: Yup.string().required(),
        // latitude: Yup.string().max(255).required(),
        // longitude: Yup.string().max(255).required(),
        // kitchenType: Yup.string().max(255).required(),
        // minimumCheckAmount: Yup.string().max(255).required(),
        // openingTime: Yup.string().required(),
        phoneNumbers: Yup.array().of(
          Yup.object().shape({
            phoneNumber: Yup.string()
              .min(9)
              .max(12)
              .required("Phone number is required"),
          })
        ),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          const phonesWithPrefix = values.phoneNumbers.map(
            (item) => "+992" + item?.phoneNumber?.replaceAll(" ", "")
          );

          const newValues = {
            ...values,
            phoneNumbers: phonesWithPrefix,
            averageCookingTime: format(
              new Date(values.averageCookingTime),
              "mm"
            ),
            closingTime: format(new Date(values.closingTime), "HH:mm"),
            openingTime: format(new Date(values.openingTime), "HH:mm"),
            minimumCheckAmount: +values.minimumCheckAmount,
          };
          if (mode === "create") {
            dispatch(createPoint(newValues));
          } else {
            dispatch(updatePoint(newValues));
          }
          setStatus({ success: true });
          setSubmitting(false);
        } catch (err) {
          console.error(err);
          toast.error("Something went wrong!");
          setStatus({ success: false });
          setErrors({ submit: err.message });
          setSubmitting(false);
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        isSubmitting,
        touched,
        values,
      }) => (
        <form noValidate onSubmit={handleSubmit}>
          <Card>
            <CardHeader
              title={`${mode === "create" ? "Create" : "Edit"} point`}
            />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.assortment && errors.assortment)}
                    fullWidth
                    helperText={touched.assortment && errors.assortment}
                    label="Assortment"
                    name="assortment"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    value={values.assortment}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.commission && errors.commission)}
                    fullWidth
                    helperText={touched.commission && errors.commission}
                    label="Commission"
                    name="commission"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    value={values.commission}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TimePicker
                    openTo="minutes"
                    ampm={false}
                    inputFormat="mm"
                    label="Average Cooking Time"
                    value={values.averageCookingTime}
                    onChange={(time) => {
                      setFieldValue("averageCookingTime", time);
                    }}
                    renderInput={(inputProps) => (
                      <TextField fullWidth {...inputProps} />
                    )}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TimePicker
                    ampm={false}
                    inputFormat="hh:mm"
                    label="Opening Time"
                    onChange={(time) => {
                      console.log({ time });
                      setFieldValue("openingTime", time);
                    }}
                    renderInput={(inputProps) => (
                      <TextField fullWidth {...inputProps} />
                    )}
                    value={values.openingTime}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TimePicker
                    ampm={false}
                    inputFormat="HH:mm"
                    label="Closing Time"
                    onChange={(time) => {
                      setFieldValue("closingTime", time);
                    }}
                    renderInput={(inputProps) => (
                      <TextField fullWidth {...inputProps} />
                    )}
                    value={values.closingTime}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.kitchenType && errors.kitchenType)}
                    fullWidth
                    helperText={touched.kitchenType && errors.kitchenType}
                    label="Kitchen Type"
                    name="kitchenType"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    value={values.kitchenType}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    required
                    fullWidth
                    // type="number"
                    error={Boolean(
                      touched.location?.latitude && errors.location?.latitude
                    )}
                    helperText={
                      touched.location?.latitude && errors.location?.latitude
                    }
                    label="Geolocation Latitude"
                    name="latitude"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.location?.latitude}
                    inputProps={{ maxLength: 9 }}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    required
                    fullWidth
                    // type="number"
                    error={Boolean(
                      touched.location?.longitude && errors.location?.longitude
                    )}
                    helperText={
                      touched.location?.longitude && errors.location?.longitude
                    }
                    label="Geolocation Longitude"
                    name="longitude"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.location?.longitude}
                    inputProps={{ maxLength: 9 }}
                  />
                </Grid>

                <Grid item md={6} xs={12}>
                  <FieldArray
                    name="phoneNumbers"
                    render={({ push, remove }) => (
                      <Grid container spacing={3}>
                        {values?.phoneNumbers?.map((p, index) => {
                          const phoneNumber = `phoneNumbers[${index}].phoneNumber`;
                          const touchedPhone = getIn(touched, phoneNumber);
                          const errorPhone = getIn(errors, phoneNumber);
                          return (
                            <Grid item xs={12} key={index}>
                              <TextField
                                error={Boolean(touchedPhone && errorPhone)}
                                fullWidth
                                helperText={
                                  touchedPhone && errorPhone ? errorPhone : ""
                                }
                                label="Phone numbers"
                                name={phoneNumber}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={p?.phoneNumber ?? ""}
                                inputProps={{ maxLength: 9 }}
                              />
                              <Box
                                mt={3}
                                gap={3}
                                display="flex"
                                justifyContent="space-between"
                              >
                                <Button
                                  fullWidth
                                  color="primary"
                                  variant="contained"
                                  onClick={() => push(index, "")}
                                >
                                  Add
                                </Button>
                                <Button
                                  fullWidth
                                  color="warning"
                                  variant="outlined"
                                  onClick={() => remove(index)}
                                >
                                  Remove
                                </Button>
                              </Box>
                            </Grid>
                          );
                        })}
                      </Grid>
                    )}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    required
                    fullWidth
                    // type="number"
                    error={Boolean(
                      touched.minimumCheckAmount && errors.minimumCheckAmount
                    )}
                    helperText={
                      touched.minimumCheckAmount && errors.minimumCheckAmount
                    }
                    label="Minimum Check Amount"
                    name="minimumCheckAmount"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.minimumCheckAmount}
                    inputProps={{ maxLength: 9 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <YMaps
                    query={{
                      lang: "ru_RU",
                      apikey: "6d2219fd-5118-4e09-bb69-e786ff23284a",
                    }}
                  >
                    <Map
                      defaultState={{
                        center: [38.559772, 68.787038],
                        zoom: 11,
                      }}
                      options={{ minZoom: 8 }}
                      width="100%"
                      height="300px"
                      onClick={(map) => {
                        handleGetGeoObject(map, setFieldValue);
                      }}
                      modules={[
                        "templateLayoutFactory",
                        "layout.ImageWithContent",
                        "geocode",
                        "geoObject.addon.balloon",
                        "multiRouter.MultiRoute",
                      ]}
                      instanceRef={map}
                    >
                      <SearchControl
                        options={{
                          float: "right",
                        }}
                      />
                      <Placemark
                        // onClick={() => handlePoint(point)}
                        geometry={[values.latitude, values.longitude]}
                        options={{
                          iconColor: "#ff0000",
                        }}
                        //       properties={{
                        //         hintContent: `
                        // <div>
                        //   <h6>Название: ${point?.name}</h6>
                        //     <div>Адрес: ${point?.address}</div>
                        //     <div>Тип: ${point?.type?.name}</div><br/>
                        // </div>
                        // `,
                        //       }}
                        modules={["geoObject.addon.hint"]}
                      />
                    </Map>
                  </YMaps>
                </Grid>
                {/* </Grid> */}
              </Grid>
            </CardContent>
            <CardActions
              sx={{
                flexWrap: "wrap",
                m: -1,
              }}
            >
              <Button
                disabled={isSubmitting}
                type="submit"
                sx={{ m: 1 }}
                variant="contained"
              >
                {mode === "create" ? "Create" : "Update"}
              </Button>
              <NextLink
                href={`/dashboard/partners/${partnerId}/points`}
                passHref
              >
                <Button
                  component="a"
                  disabled={isSubmitting}
                  sx={{
                    m: 1,
                    mr: "auto",
                  }}
                  variant="outlined"
                >
                  Cancel
                </Button>
              </NextLink>
            </CardActions>
          </Card>
        </form>
      )}
    </Formik>
  );
};
