import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Paper, Tabs, Tab } from "@material-ui/core";

const MainLayout = ({ children }) => {
  const [tab, setTab] = useState(0);

  const handleChange = (event, newTab) => setTab(newTab);

  return (
    <main>
      <Paper>
        <Tabs
          value={tab}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          centered
          variant="fullWidth"
        >
          <Tab component={Link} to="/" label="Imanes" index={0} />
          <Tab component={Link} to="/magnet-map" label="Mapa" index={1} />
          <Tab label="Opciones" index={2} />
        </Tabs>
      </Paper>
      {children}
    </main>
  );
};

export default MainLayout;
