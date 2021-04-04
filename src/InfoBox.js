import React from "react";
import "./InfoBox.css";
import { Card, CardContent, Typography } from "@material-ui/core";
function InfoBox({ title, isRed, cases, active, total, ...props }) {
  return (
    <Card
      className={`infobox  ${active && "infobox--selected"}  ${
        isRed && "infobox--red"
      }`}
      onClick={props.onClick}
    >
      <CardContent>
        <Typography className="infobox_title" color="textSecondary">
          {title}
        </Typography>
        <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>
          {cases}
        </h2>
        <Typography className="infobox_total" color="textSecondary">
          {total} Total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
