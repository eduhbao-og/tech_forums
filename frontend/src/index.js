import React from "react";
import ReactDOM from "react-dom/client";
import { UserState } from "./User";

import App from "./App";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserState>
      <App />
    </UserState>
  </React.StrictMode>
);
