import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar } from '@material-ui/core';

function getModalStyle() {
    const top = 50;
    const left = 50;
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }
  
  const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }));

function Promo({displayname, photoURL}) {
    const classes = useStyles();
    return (
        <div>
            <Avatar
            className="app__avatar"
            alt={displayname}
            src={photoURL ? photoURL : "/static/1.jpeg"}
          />
          <h3>{displayname}</h3>
        </div>
    )
}

export default Promo
