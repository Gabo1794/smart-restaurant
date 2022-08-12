import React, { useState } from "react";
import logo from "../../logo.svg";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { auth, store } from "../../firebase/config";

const Index = (props) => {
  const [loading, setLoading] = useState(false);
  const onFinish = async (userLogin) => {
    setLoading(true);
    try {
      let dataLogIn = await auth.signInWithEmailAndPassword(
        userLogin.username,
        userLogin.password
      );

      let { uid } = dataLogIn.user;

      if (dataLogIn.operationType === "signIn") {
        const restaurantUser = await ValidateRestaurantUser(uid);

        localStorage.setItem("restaurantUser", JSON.stringify(restaurantUser));
        setLoading(false);
        window.location = "./admin";
      }
    } catch (error) {
      if (error.code === "auth/user-not-found")
        message.error("El usuario no existe.");

      if (error.code === "auth/wrong-password")
        message.error("La contraseña es erronea.");

      setLoading(false);
      auth.signOut();
    }
  };

  const ValidateRestaurantUser = async (userId) => {
    const { docs } = await store
      .collection("RestaurantUsers")
      .where("UserId", "==", userId)
      .get();

    if (!docs) return null;

    const restaurantUser = docs.map((item) => ({
      Id: item.id,
      ...item.data(),
    }));

    if (!restaurantUser) return null;

    if (restaurantUser && restaurantUser.length > 1) {
      message.warning("Caracteristica de multi usuario en desarrollo");
      return null;
    }

    return restaurantUser[0];
  };
  return (
    <div className="container">
      <div className="content-center login-container">
        <img
          src={logo}
          alt="Comedor Familiar Gaby"
          className="login-container-img"
        />

        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Por favor ingresa tu correo electrónico.",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Usuario"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Por favor ingresa tu contraseña." },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Contraseña"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="primary-button"
              loading={loading}
              block
            >
              Acceder al sitio
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Index;
