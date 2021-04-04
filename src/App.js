import "./App.css";
import FormControl from "@material-ui/core/FormControl";
import { CardContent, Menu, MenuItem, Select, Card } from "@material-ui/core";
import { useEffect, useState } from "react";
import InfoBox from "./InfoBox";
import Map from "./Mapi";
import Table from "./Table";
import { sortdata, prettyPrintStat } from "./Ulist";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";

function App() {
  const world = "worldwide";
  const [countries, setCountries] = useState([]);
  const [land, setLand] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tabledata, setTabledata] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapcountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((res) => res.json())
      .then((data) => setCountryInfo(data));
  }, []);

  useEffect(() => {
    const getCountryData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((res) => res.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));

          const sorteddata = sortdata(data);
          setTabledata(sorteddata);
          setMapcountries(data);
          setCountries(countries);
        });
    };
    getCountryData();
  }, []);

  const onCountyChange = async (event) => {
    const countryCode = event.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}?strict=false`;
    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setCountryInfo(data);
        setLand(countryCode);
        countryCode === "worldwide"
          ? setMapCenter({ lat: 34.80746, lng: -40.4796 })
          : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };

  return (
    <div className="app">
      <div className="app_left">
        <div className="app_header">
          <h1>Covid-19-TRACKER</h1>
          <FormControl className="app_dropdown">
            <Select variant="outlined" value={land} onChange={onCountyChange}>
              <MenuItem value="worldwide">worldwide</MenuItem>
              {countries.map((countrie) => (
                <MenuItem value={countrie.value}>{countrie.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app_stats">
          <InfoBox
            isRed
            active={casesType === "cases"}
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            total={prettyPrintStat(countryInfo.cases)}
            cases={prettyPrintStat(countryInfo.todayCases)}
          />
          <InfoBox
            active={casesType === "recovered"}
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            total={prettyPrintStat(countryInfo.recovered)}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
          />
          <InfoBox
            isRed
            active={casesType === "deaths"}
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            total={prettyPrintStat(countryInfo.deaths)}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
          />
        </div>
        <div>
          <Map
            casesType={casesType}
            countries={mapCountries}
            center={mapCenter}
            zoom={mapZoom}
          />
        </div>
      </div>
      <div className="app_right">
        <Card>
          <CardContent>
            <h3>Live cases by Country</h3>
            <Table countries={tabledata} />
            <h3>Worldwide new {casesType}</h3>
            <LineGraph className="app_graph" casesType={casesType} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
