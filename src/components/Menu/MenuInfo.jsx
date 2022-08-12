import React, { useState, useEffect, Fragment } from "react";
import { Empty, Row, Col } from "antd";
import logo from "../../logo.svg";

const MenuInfo = ({ menuInfo }) => {
  const [hasMenuInfo, setHasMenuInfo] = useState(false);

  useEffect(() => {
    if (
      menuInfo &&
      (menuInfo.FirstSoups ||
        menuInfo.SecondSoups ||
        menuInfo.BasicStews ||
        menuInfo.ProStews ||
        menuInfo.SpecialStews)
    ) {
      setHasMenuInfo(true);
    }
  }, [menuInfo]);

  const RenderMenuData = (menuInfo) => {
    return menuInfo.map((item, index) => (
      <label key={index + 1} className="menu-complements m-b-10">
        {item.Name}
      </label>
    ));
  };

  const RenderSinglePrices = (menuInfo) => {
    return menuInfo.map((item, index) => (
      <label
        key={index + 1}
        className="menu-complements m-b-10 contect-justify-sb"
      >
        {item.Name} <strong>$ {item.Price}.00 MXN</strong>
      </label>
    ));
  };

  return (
    <Fragment>
      {!hasMenuInfo ? (
        <div className="loading-menu">
          <Empty />
        </div>
      ) : (
        <div className="container-menu">
          <Row
            className="menu-header"
            gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
          >
            <Col className="gutter-row" span={12}>
              <img
                src={logo}
                alt="Comedor Familiar Gaby"
                className="header-menu-img"
              />
            </Col>
            <Col className="gutter-row" span={12}>
              <h1 className="header-menu-text">Menú</h1>
            </Col>
          </Row>

          <div className="container-menus">
            <div className="container-50 m-b-20">
              <div className="container-50 menu-title contect-justify-sb m-b-20">
                <label>Menú del día</label>
                <label>$ 75.00</label>
              </div>
              <div className="content-colum">
                <label className="menu-subtitle m-b-10">Primer tiempo</label>
                {menuInfo && menuInfo.FirstSoups ? (
                  RenderMenuData(menuInfo.FirstSoups)
                ) : (
                  <label className="menu-complements m-b-10">Agotado</label>
                )}
                <label className="menu-subtitle m-b-10">Segundo tiempo</label>
                {menuInfo && menuInfo.SecondSoups ? (
                  RenderMenuData(menuInfo.SecondSoups)
                ) : (
                  <label className="menu-complements m-b-10">Agotado</label>
                )}
                <label className="menu-subtitle m-b-10">Plato fuerte</label>
                {menuInfo && menuInfo.BasicStews ? (
                  RenderMenuData(menuInfo.BasicStews)
                ) : (
                  <label className="menu-complements m-b-10">Agotado</label>
                )}
              </div>
            </div>
            <div className="container-50 m-b-20">
              <div className="container-50 menu-title contect-justify-sb m-b-20">
                <label>Menú a la carta</label>
                <label>$ 85.00</label>
              </div>
              <div className="content-colum">
                <label className="menu-subtitle m-b-10">Primer tiempo</label>
                {menuInfo && menuInfo.FirstSoups ? (
                  RenderMenuData(menuInfo.FirstSoups)
                ) : (
                  <label className="menu-complements m-b-10">Agotado</label>
                )}
                <label className="menu-subtitle m-b-10">Segundo tiempo</label>
                {menuInfo && menuInfo.SecondSoups ? (
                  RenderMenuData(menuInfo.SecondSoups)
                ) : (
                  <label className="menu-complements m-b-10">Agotado</label>
                )}
                <label className="menu-subtitle m-b-10">Plato fuerte</label>
                {menuInfo && menuInfo.ProStews ? (
                  RenderMenuData(menuInfo.ProStews)
                ) : (
                  <label className="menu-complements m-b-10">Agotado</label>
                )}
              </div>
            </div>
            <div className="container-50 m-b-20">
              <div className="container-50 menu-title contect-justify-sb m-b-20">
                <label>Menú especial</label>
                <label>Desde $ 92.00</label>
              </div>
              <div className="content-colum">
                <label className="menu-subtitle m-b-10">Primer tiempo</label>
                {menuInfo && menuInfo.FirstSoups ? (
                  RenderMenuData(menuInfo.FirstSoups)
                ) : (
                  <label className="menu-complements m-b-10">Agotado</label>
                )}
                <label className="menu-subtitle m-b-10">Segundo tiempo</label>
                {menuInfo && menuInfo.SecondSoups ? (
                  RenderMenuData(menuInfo.SecondSoups)
                ) : (
                  <label className="menu-complements m-b-10">Agotado</label>
                )}
                <label className="menu-subtitle m-b-10">Plato fuerte</label>
                {menuInfo && menuInfo.SpecialStews ? (
                  RenderMenuData(menuInfo.SpecialStews)
                ) : (
                  <label className="menu-complements m-b-10">Agotado</label>
                )}
              </div>
            </div>
            <div className="container-50 m-b-20">
              <div className="menu-title contect-justify-sb m-b-20">
                <label>Costos individuales</label>
              </div>
              <div className="content-colum">
                {menuInfo && menuInfo.FirstSoups
                  ? RenderSinglePrices(menuInfo.FirstSoups)
                  : null}
                {menuInfo && menuInfo.SecondSoups
                  ? RenderSinglePrices(menuInfo.SecondSoups)
                  : null}
                {menuInfo && menuInfo.BasicStews
                  ? RenderSinglePrices(menuInfo.BasicStews)
                  : null}
                {menuInfo && menuInfo.ProStews
                  ? RenderSinglePrices(menuInfo.ProStews)
                  : null}
                {menuInfo && menuInfo.SpecialStews
                  ? RenderSinglePrices(menuInfo.SpecialStews)
                  : null}
                <div className="menu-include">
                  Todos nuestros menús incluyen 1/2 litro de agua, tortillas,
                  frijoles y postre. P/P
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

MenuInfo.propTypes = {};

export default MenuInfo;
