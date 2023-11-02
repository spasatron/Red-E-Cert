import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
// TODO Instead of Getting rid of React.StrictMode integrate with React Query
ReactDOM.createRoot(document.getElementById("root")!).render(
  //<React.StrictMode>
  <App />
  //</React.StrictMode>
);
