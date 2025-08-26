import "./App.css";
import { useEffect, useState } from "react";

// MUI Components
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CloudIcon from "@mui/icons-material/Cloud";
import Button from "@mui/material/Button";

// Library
import axios from "axios";
import moment from "moment";
import "moment/min/locales";
import { useTranslation } from "react-i18next";

const theme = createTheme({
  typography: {
    fontFamily: ["IBM"]
  }
});

let cancelAxios = null;
function App() {
  const { t, i18n } = useTranslation();
  // === States === //
  const [temp, setTemp] = useState({
    number: null,
    description: "",
    min: null,
    max: null,
    icon: ""
  });
  const [dateAndTime, setDateAndTime] = useState("");
  const [locale, setLocal] = useState("ar");
  // === Event Handlers ===//
  function handleLanguageClick() {
    if (locale === "en") {
      setLocal("ar");
      i18n.changeLanguage("ar");
      moment.locale("ar"); // set to Arabic
    } else {
      setLocal("en");
      i18n.changeLanguage("en");
      moment.locale("en"); // set to English
    }
    setDateAndTime(moment().format("MMMM Do YYYY, h:mm:ss a"));
  }
  useEffect(() => {
    i18n.changeLanguage(locale);
  }, []);
  useEffect(() => {
    setDateAndTime(moment().format("MMMM Do YYYY, h:mm:ss a"));
    axios
      .get(
        "https://api.openweathermap.org/data/2.5/weather?lat=30.033333&lon=31.233334&appid=677c6d908e60844cc7839ecdd799a27b",
        {
          cancelToken: new axios.CancelToken((c) => {
            cancelAxios = c;
          })
        }
      )
      .then((response) => {
        // handle success
        const responseTemp = Math.round(response.data.main.temp - 272.15);
        const min = Math.round(response.data.main.temp_min - 272.15);
        const max = Math.round(response.data.main.temp_max - 272.15);
        const description = response.data.weather[0].description;
        console.log(responseTemp, min, max, description);
        setTemp({
          number: responseTemp,
          min: min,
          max: max,
          description: description,
          icon: response.data.weather[0].icon
        }); // key and value are the same can write one of them
      })
      .catch((error) => {
        // handle error
        console.log(error);
      });
    // * cleanUp function --> when unmonting happen cancel the API request
    return () => {
      console.log("canceling");
      cancelAxios();
    };
  }, []);
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Container maxWidth="sm">
          {/* Content Container */}
          <div
            style={{
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column"
            }}
          >
            {/* Card */}
            <div
              dir={locale === "ar" ? "rtl" : "ltr"}
              style={{
                width: "100%",
                background: "rgb(28 52 91 / 36%)",
                color: "white ",
                padding: "10px",
                borderRadius: "15px",
                boxShadow: "0px 11px 1px rgba(0,0,0,0.05)"
              }}
            >
              {/* Content */}
              <div>
                {/* City & Time  */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "end",
                    justifyContent: "start"
                  }}
                  dir={locale === "ar" ? "rtl" : "ltr"}
                >
                  <Typography
                    variant="h2"
                    style={{ marginRight: "20px", fontWeight: "600" }}
                  >
                    {t("Cairo")}
                  </Typography>
                  <Typography variant="h5" style={{ marginRight: "20px" }}>
                    {dateAndTime}
                  </Typography>
                </div>
                {/*== City & Time ==  */}
                <hr />
                {/* Container of Degree + Cloud Icon*/}
                <div
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  {/* Degree & descrption */}
                  <div>
                    {/* TEMP */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <Typography variant="h1" style={{ textAlign: "right" }}>
                        {temp.number}
                      </Typography>
                      <img
                        src={`https://openweathermap.org/img/wn/${temp.icon}@2x.png`}
                        alt="Weather-icon"
                      />
                    </div>
                    {/*== TEMP ==*/}
                    <Typography variant="h6">{t(temp.description)} </Typography>
                    {/* Min & Max */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}
                    >
                      <h5>
                        {temp.min} :{t("min")}
                      </h5>
                      <h5 style={{ margin: "0 5px" }}>|</h5>
                      <h5>
                        {temp.max} :{t("max")}
                      </h5>
                    </div>
                  </div>
                  {/* == Degree & descrption ==*/}
                  <CloudIcon   sx={{color:"white"  , fontSize: {
          xs: "120px",   
          sm: "150px",  
          md: "180px",  
          lg: "200px", 
        }}} />
                </div>
                {/*== Container of Degree + Cloud Icon ==*/}
              </div>
              {/*== Content ==*/}
            </div>
            {/*== Card == */}
            {/* Translation Continer */}
            <div
              dir={locale === "ar" ? "rtl" : "ltr"}
              style={{ display: "flex", justifyContent: "end", width: "100%" }}
            >
              <Button
                variant="text"
                onClick={handleLanguageClick}
                style={{ color: "white", marginTop: "20px" }}
              >
                {" "}
                {locale === "en" ? "Arabic" : "إنجليزي"}
              </Button>
            </div>
            {/*== Translation Continer ==*/}
          </div>
          {/*== Content Container ==*/}
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default App;

//* we install axios library for manage API request --> $ npm install axios
//* then we show examples to show how handel API
//* the best time to use api is after the componet is rendering  , so we use useEffect

// ** useEffect Cleanup(if needed) --> check react documnetion to learn more
// * for ex , if have connection with the servier , must me clear this connection to avoid resource wasting(CleanUp)
//& Side effect = any operation outside rendering (like API calls, timers, DOM changes, or subscriptions).
//& Cleanup in useEffect = stops those ongoing effects when the component unmounts or dependencies change → prevents memory leaks, performance issues, and bugs.
// ~ Strict Mode in React (development only) mounts → unmounts → remounts components on purpose.
// ~ This helps test your useEffect cleanup.
// ~ If cleanup is missing → you’ll see duplicated timers, listeners, or API calls.
// ~ If cleanup is correct → React clears everything and no issues appear.
// ^ Development (Strict Mode) = extra checks, effects run twice, cleanup tested.
// ^ Production = no double run, only real behavior (one mount, one effect, cleanup on unmount).
// & Even if useEffect runs once, you still need cleanup to stop ongoing side effects (like intervals, event listeners, subscriptions) when the component unmounts or in Strict Mode (dev test).
// & Without cleanup → memory leaks, duplicate calls, and bugs.
// * stict mode help you to find error in devlopemnt environment --> like useEffect CleanUp
// * The cleanup function in useEffect is not fixed — it changes based on the side effect. Examples: clearInterval for timers, removeEventListener for events, unsubscribe for subscriptions, abort for API requests.
// * so cleanUp
// * The cleanup function in useEffect removes or stops ongoing side effects to prevent memory leaks and bugs when a component unmounts or updates.
// ? so we must  search the way of cleanup with each sideEffect
// ^ can enhance the code with use AbortController instead of CancelToken  --> To avoid Error Canceled
// ? search for Open Weather Api icons to show how get url for icons conditon

// ** Momentjs --> libarary to handel time
// go to documention to install
// $ npm install moment --save
// can use data form js but moment make that easier , and imporve good localaziton
// show document to show how to use

// ** react.i18next. --> libaray for translation
//* for Latest --> Step by step guide
// $ npm install react-i18next i18next --save
// $ npm install i18next-http-backend i18next-browser-languagedetector --save
// * must creat file  i18n.js beside your index.js , and get the content of the i18n.js form the document
// *  import './i18n'; --> in index.js
// * then import the useTranslation in the place want translation
// * import { useTranslation } from 'react-i18next';
// * const { t, i18n } = useTranslation();
// * then use t function to translate anything -->  return <h1>{t('Welcome to React')}</h1>
// * then create translation file public/locales/<language_code>/translation.json
// * get translation.json  content form documention or creat your translation json
// * then use i18n to decide the langues you chose --> but not change state in middle of the componet that can case infinite loop , so change state must be inside the event lisner and other tools in reat like use effect
//? search about langues code in Google
//? must be if have probelm go to the documention
//? must be search for the infomation , this is a big features
// ! problem appear while install i18next --> he problem is a dependency conflict: react-scripts@5 only supports TypeScript 3.x–4.x, while i18next requires TypeScript 5.x.
// ^ With () => expr it returns the expression’s value, but with () => { expr } it just executes the code without returning.
