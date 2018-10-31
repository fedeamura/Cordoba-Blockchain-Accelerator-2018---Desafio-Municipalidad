const styles = theme => ({
  button: {
    display: 'inline-block',
    width: '200px',
    margin: '0px auto',
    marginTop: '20px',
    borderRadius: '20px',
    '&[type="cancel"]': {
      background: 'rgb(244,67,54)',
      marginRight: '10px'
    }
  },
  buttonMiTabla: {
    display: 'inline-block',
    width: '200px',
    margin: '0px auto',
    borderRadius: '20px',
    '&[type="cancel"]': {
      background: 'rgb(244,67,54)',
      marginRight: '10px'
    }
  }
});


export default styles;