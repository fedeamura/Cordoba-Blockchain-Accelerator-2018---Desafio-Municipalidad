const styles = theme => ({
  margin: {
    width: '100%'
  },
  marginGrid: {
    padding: '20px',
    position: 'relative'
  },
  root: {
    width: '100%',
    paddingTop: '10px',
    margin: '0px auto'
  },
  button: {
    position: 'absolute',
    bottom: '0px',
    right: '0px',
    display: 'inline-block',
    width: '200px',
    margin: '0px auto',
    borderRadius: '20px',
    '&[type="cancel"]': {
      background: 'rgb(244,67,54)',
      marginRight: '10px'
    }
  },
});


export default styles;