const styles = theme => ({
    margin: {
      margin: '10px 20px'
    },
    root: {
      width: '100%',
      height: '400px',
      paddingTop: '50px',
      margin: '0px auto'
    },
    button: {
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