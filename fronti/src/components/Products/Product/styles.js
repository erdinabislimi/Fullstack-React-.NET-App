import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  card: {
    maxWidth: "100%",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    paddingTop: "150%", 
    overflow: "hidden",
  },
  image: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover", 
  },
  inStock: {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
  },
  outOfStock: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
  },
  exchangeButton: {
    backgroundColor: '#001524',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#001524',
    },
  },
}));

