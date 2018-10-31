const styles = theme => ({
  button: {
    display: "inline-block",
    width: "200px",
    margin: "0px auto",
    marginTop: "20px",
    borderRadius: "20px",
    '&[type="cancel"]': {
      background: "rgb(244,67,54)",
      marginRight: "10px"
    }
  },
  buttonMiTabla: {
    display: "inline-block",
    width: "200px",
    margin: "0px auto",
    borderRadius: "20px",
    '&[type="cancel"]': {
      background: "rgb(244,67,54)",
      marginRight: "10px"
    }
  },
  titulo: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
  },
  cardInfo: {
    backgroundColor: "#FFFDE7"
  },
  cardExito: {
    backgroundColor: "#43A047",
    "& .material-icons": {
      fontSize: 32,
      marginRight: "16px"
    },
    "& > div": {
      display: "flex",
      alignItems: "center"
    },
    "& *": {
      color: "white"
    }
  },
  cardError: {
    backgroundColor: "#E53935",
    "& .material-icons": {
      fontSize: 32,
      marginRight: "16px"
    },
    "& > div": {
      display: "flex",
      alignItems: "center"
    },
    "& *": {
      color: "white"
    }
  }
});

export default styles;
