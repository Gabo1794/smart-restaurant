import React, { useState, useEffect, Fragment, message } from "react";
import { Layout, Menu, Dropdown } from "antd";
import { DownOutlined, ProfileOutlined } from "@ant-design/icons";

import Soups from "./Menu/Soups";
import Stews from "./Menu/Stews";

import { auth, store } from "../../firebase/config";

const { Header, Footer, Sider, Content } = Layout;

const Index = () => {
  const [dateSystem, setDateSystem] = useState(null);
  const [menuSelected, setMenuSelected] = useState("1");
  const [restaurantUser, setRestaurantUser] = useState(null);
  const [userIsSignIn, setUserIsSignIn] = useState(null);

  useEffect(() => {
    const date = new Date();
    if (!dateSystem) setDateSystem(date.getFullYear());

    auth.onAuthStateChanged((user) => {
      if (!user) {
        setUserIsSignIn(false);
        window.location = "./";
      }
      if (user) {
        let user = localStorage.getItem("restaurantUser");
        setRestaurantUser(JSON.parse(user));
        setUserIsSignIn(true);
      }
    });
  }, [dateSystem]);

  const CreateRestaurantItem = async (itemData) => {
    try {
      if (itemData && itemData.Status === undefined) itemData.Status = false;

      const savingStatus = await store
        .collection("RestaurantItems")
        .add(itemData);

      return savingStatus;
    } catch (error) {
      message.error("Error al guardar producto");
    }
  };

  const GetRestaurantItems = async (itemTypeId) => {
    try {
      const { RestaurantId } = restaurantUser;
      const { docs } = await store
        .collection("RestaurantItems")
        .where("RestaurantId", "==", RestaurantId)
        .where("Type", "==", itemTypeId)
        .get();

      if (!docs) {
        return null;
      }

      const restaurantItems = docs.map((item) => ({
        Id: item.id,
        ...item.data(),
      }));

      return restaurantItems;
    } catch (error) {
      message.error("Error al obtener los productos");
      return null;
    }
  };

  const UpdateRestaurantItem = async (itemId, itemData) => {
    try {
      await store.collection("RestaurantItems").doc(itemId).set(itemData);
    } catch (error) {
      message.error("Error al actualizar el producto");
    }
  };

  const DeleteRestaurantItem = async (item) => {
    try {
      await store.collection("RestaurantItems").doc(item.key).delete();
    } catch (error) {
      message.error("Error al borrar producto.");
    }
  };

  const menu = (
    <Menu>
      {/* <Menu.Item key="0">
        <label>Usuarios</label>
      </Menu.Item>
      <Menu.Divider /> */}
      <Menu.Item key="1">
        <label onClick={() => LogOut()} style={{ cursor: "pointer" }}>
          Cerrar sesión
        </label>
      </Menu.Item>
    </Menu>
  );

  const LogOut = () => {
    auth.signOut();
    window.location = "./";
  };

  return (
    <Fragment>
      {userIsSignIn ? (
        <Layout>
          <Header>
            <Dropdown overlay={menu} trigger={["click"]}>
              <label
                className="ant-dropdown-link"
                onClick={(e) => e.preventDefault()}
              >
                <strong>
                  {restaurantUser ? restaurantUser.UserName : null}
                </strong>{" "}
                <DownOutlined />
              </label>
            </Dropdown>
          </Header>
          <Layout>
            <Sider
              breakpoint="lg"
              collapsedWidth="0"
              onBreakpoint={(broken) => {
                console.log(broken);
              }}
              onCollapse={(collapsed, type) => {
                console.log(collapsed, type);
              }}
            >
              <Menu mode="inline" defaultSelectedKeys={["1"]}>
                <Menu.ItemGroup key="g1" title="Menú">
                  <Menu.Item
                    key="1"
                    onClick={(menu) => setMenuSelected(menu.key)}
                    icon={<ProfileOutlined />}
                  >
                    Sopas
                  </Menu.Item>
                  <Menu.Item
                    key="2"
                    onClick={(menu) => setMenuSelected(menu.key)}
                    icon={<ProfileOutlined />}
                  >
                    Guisados del día
                  </Menu.Item>
                  <Menu.Item
                    key="3"
                    onClick={(menu) => setMenuSelected(menu.key)}
                    icon={<ProfileOutlined />}
                  >
                    Guisados a la carta
                  </Menu.Item>
                  <Menu.Item
                    key="4"
                    onClick={(menu) => setMenuSelected(menu.key)}
                    icon={<ProfileOutlined />}
                  >
                    Guisados especiales
                  </Menu.Item>
                </Menu.ItemGroup>
              </Menu>
            </Sider>

            <Layout className="main-content">
              <Content style={{ margin: "24px 16px 0" }}>
                <div
                  className="site-layout-background"
                  style={{ padding: 24, minHeight: 360 }}
                >
                  {menuSelected === "1" ? (
                    <Soups
                      menuSelected={menuSelected}
                      restaurantUser={restaurantUser}
                      CreateRestaurantItem={CreateRestaurantItem}
                      GetRestaurantItems={GetRestaurantItems}
                      UpdateRestaurantItem={UpdateRestaurantItem}
                      DeleteRestaurantItem={DeleteRestaurantItem}
                    />
                  ) : (
                    <Stews
                      menuSelected={menuSelected}
                      restaurantUser={restaurantUser}
                      CreateRestaurantItem={CreateRestaurantItem}
                      GetRestaurantItems={GetRestaurantItems}
                      UpdateRestaurantItem={UpdateRestaurantItem}
                      DeleteRestaurantItem={DeleteRestaurantItem}
                    />
                  )}
                </div>
              </Content>
              <Footer style={{ textAlign: "center" }}>
                Comedor Familiar Gaby ©{dateSystem} Created by Gabriel Montaño
              </Footer>
            </Layout>
          </Layout>
        </Layout>
      ) : null}
    </Fragment>
  );
};

export default Index;
