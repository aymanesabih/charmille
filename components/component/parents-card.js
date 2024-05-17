import { Box, Typography } from "@mui/material";
import React from "react";

const ParentsCard = ({ parents }) => {
  return (
    <Box
      sx={{
        height: "auto",
        width: "40rem",
        backgroundColor: "white",
        borderRadius: "8px",
        padding: "20px",
        textAlign: "center",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      {parents.map((parent, index) => (
        <div className="text-left my-4" key={index}>
          <Typography>
            <b>Nom : </b>
            {parent.first_name}
          </Typography>
          <Typography>
            <b>Prénom : </b>
            {parent.last_name}
          </Typography>
          <Typography>
            <b>Numéro de téléphone : </b>
            {parent.phone_number}
          </Typography>
          <Typography>
            <b>Email : </b>
            {parent.email}
          </Typography>
          <Typography>
            <b>Relation :</b> {parent.relationship}
          </Typography>
        </div>
      ))}
    </Box>
  );
};

export default ParentsCard;
