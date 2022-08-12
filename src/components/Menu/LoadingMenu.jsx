import React from "react";
import { Spin } from 'antd';

const LoadingMenu = (props) => {
  return (
    <div className="loading-menu">
      <Spin tip="Cargando..." size="large" />
    </div>
  );
};

export default LoadingMenu;
