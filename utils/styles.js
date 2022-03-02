import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  navbar: {
    backgroundColor: "#203040",
    "& a": {
      color: "#FFFFFF",
      marginLeft: 10,
    },
  },
  main: {
    minHeight: "80vh",
  },
  footer: {
    textAlign: "center",
    marginTop: "10px",
  },
  brand: {
    fontWeight: "bold",
    fontSize: "1.5rem",
  },
  grow: {
    flexGrow: 1,
  },
  section: {
    marginTop: "10px",
    marginBottom: "10px",
  },
  form: {
    maxWidth: 800,
    margin: "0 auto",
  },
  navbarButton: {
    color: "white",
    textTransform: "initial",
  },
  myLink: {
    cursor: "pointer",
  },
  transparentBackground: {
    backgroundColor: "transparent",
  },
  error: {
    color: "#f04040",
  },
});

export default useStyles;
