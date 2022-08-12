import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Modal,
  Card,
  Table,
  Tag,
  Space,
  Input,
  Form,
  InputNumber,
  Select,
  Switch,
  message
} from "antd";
import {
  PlusOutlined,
  EditFilled,
  DeleteFilled,
  SearchOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import PropTypes from "prop-types";

import { TypeItem } from "../../../helpers/TypeItems";

const { Option } = Select;

const { confirm } = Modal;

const Stews = ({
  menuSelected,
  restaurantUser,
  CreateRestaurantItem,
  GetRestaurantItems,
  UpdateRestaurantItem,
  DeleteRestaurantItem,
}) => {
  let searchInput = useRef(null);
  const [form] = Form.useForm();
  const [isEditForm, setIsEditForm] = useState(false);
  const [loading, setLoating] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [checkedSwitch, setCheckedSwitch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [dataTable, setDataTable] = useState(null);
  const [itemEdit, setItemEdit] = useState(null);
  const initialValues = {
    Name: "",
    Price: "",
    TimeItem: "",
  };

  useEffect(() => {
    async function GetData() {
      await GetRestaurantStews();
    }
    GetData();
  }, [menuSelected]);

  const openModal = () => {
    setVisibleModal(true);
  };

  const openModalEdit = (item) => {
    //Metodos para poder obtener el valor del elemento a enviar utilizando firebase.
    // const soup = await store.collection('RestaurantItems').doc(itemEdit.key).get();
    //funcion que se utiliza para poder obtener la data obtenida del documento.
    // soup.data()

    setIsEditForm(true);
    CleanForm();
    setItemEdit(item);

    const setItemDataInForm = {
      Name: item.name,
      Price: item.price,
      TimeItem: item.tags[0].toLowerCase() === "tercer tiempo" ? "3" : null,
    };

    if (item.status === "Listo para vender") setCheckedSwitch(true);
    else setCheckedSwitch(false);

    openModal();

    form.setFieldsValue(setItemDataInForm);
  };

  const closeModal = () => {
    setVisibleModal(false);
    CleanForm();
  };

  const onFinishForm = async (stewData) => {
    if (!isEditForm) SaveProduct(stewData);
    else EditProduct(stewData);
  };

  const SaveProduct = async (stewData) => {
    try {
      if (stewData && stewData.Status === undefined) stewData.Status = false;

      setLoating(true);

      const { RestaurantId } = restaurantUser;

      const newSoup = {
        RestaurantId: RestaurantId,
        Type:
          menuSelected === `${TypeItem.BasicStews}`
            ? TypeItem.BasicStews
            : menuSelected === `${TypeItem.ProStews}`
            ? TypeItem.ProStews
            : menuSelected === `${TypeItem.SpecialStews}`
            ? TypeItem.SpecialStews
            : 0,
        ...stewData,
      };

      const savingStatus = await CreateRestaurantItem(newSoup);

      if (savingStatus && savingStatus.id.length > 0) {
        message.success("Se ha guardado tu guisado de manera correcta");
        setLoating(false);
        setVisibleModal(false);
        CleanForm();
        await GetRestaurantStews();
      } else {
        message.error(`Error al guardar la guisado`);
      }
    } catch (error) {
      message.error(`Error al guardar la guisado`);
    }
  };

  const EditProduct = async (stewData) => {
    try {
      setLoating(true);

      const { RestaurantId } = restaurantUser;

      const editStew = {
        RestaurantId: RestaurantId,
        Type:
          menuSelected === `${TypeItem.BasicStews}`
            ? TypeItem.BasicStews
            : menuSelected === `${TypeItem.ProStews}`
            ? TypeItem.ProStews
            : menuSelected === `${TypeItem.SpecialStews}`
            ? TypeItem.SpecialStews
            : 0,
        ...stewData,
      };

      await UpdateRestaurantItem(itemEdit.key, editStew);

      setIsEditForm(false);
      setLoating(false);
      setVisibleModal(false);
      CleanForm();
      await GetRestaurantStews();
      message.success("Tu guisado ha sido actualizado");
    } catch (error) {
      message.error("Error al actualizar tu guisado");
    }
  };

  const DeleteProduct = async (item) => {
    try {
      confirm({
        title: "¿Seguro que deseas eliminar este articulo?",
        icon: <ExclamationCircleOutlined />,
        content:
          "Una vez eliminado ya no podra ser recuperado, este se tendra que volver a registrar.",
        okText: "Confirmar",
        cancelText: "Cancelar",
        async onOk() {
          await DeleteRestaurantItem(item);
          await GetRestaurantStews();
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    } catch (error) {
      message.error("Error al borrar producto.");
    }
  };

  const CleanForm = () => {
    form.setFieldsValue(initialValues);
    setCheckedSwitch(false);
  };

  const GetRestaurantStews = async () => {
    let restaurantStews = await GetRestaurantItems(parseInt(menuSelected));

    if (restaurantStews) {
      const dataStews = [];

      restaurantStews.forEach((item) => {
        let stew = {
          key: item.Id,
          name: item.Name,
          status: item.Status ? "Listo para vender" : "Agotado",
          price: item.Price,
          tags: [item.TimeItem === "3" ? "Tercer tiempo" : "Sin asignar"],
        };
        dataStews.push(stew);
      });

      setDataTable(dataStews);
    } else {
      setDataTable(null);
    }
  };

  const onChangeSwitch = () => {
    setCheckedSwitch(!checkedSwitch);
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Buscar
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Limpiar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.select(), 100);
      }
    },
    render: (text) => (searchedColumn === dataIndex ? text : null),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const columns = [
    {
      title: "Guisado",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
      sorter: (a, b) => a.name.length - b.name.length,
      render: (text) => <label>{text}</label>,
    },
    {
      title: "Estatus",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => a.status.length - b.status.length,
    },
    {
      title: "Costo",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Disponible en",
      key: "tags",
      dataIndex: "tags",
      render: (tags) => (
        <>
          {tags.map((tag) => {
            let color = tag.length > 5 ? "geekblue" : "green";
            if (tag === "loser") {
              color = "volcano";
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Acciones",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="primary"
            size="small"
            shape="circle"
            icon={<EditFilled />}
            onClick={() => {
              setIsEditForm(true);
              openModalEdit(record);
            }}
          />
          <Button
            type="primary"
            size="small"
            danger
            shape="circle"
            icon={<DeleteFilled />}
            onClick={async () => {
              await DeleteProduct(record);
            }}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="products-container">
      <div className="type-product-title">
        <h1>
          {menuSelected === "2"
            ? "Guisados del día"
            : menuSelected === "3"
            ? "Guisados a la carta"
            : menuSelected === "4"
            ? "Guisados especiales"
            : null}
        </h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setIsEditForm(false);
            setCheckedSwitch(false);
            openModal();
            CleanForm();
          }}
        >
          Añadir guisado
        </Button>
        <Modal
          visible={visibleModal}
          title={
            menuSelected === "2"
              ? `${
                  isEditForm
                    ? "Edita tu guisado del día"
                    : "Añade un guisado del día"
                }`
              : menuSelected === "3"
              ? `${
                  isEditForm
                    ? "Edita tu guisado a la carta"
                    : "Añade un guisado a la carta"
                }`
              : menuSelected === "4"
              ? `${
                  isEditForm
                    ? "Edita tu guisado especial"
                    : "Añade un guisado especial"
                }`
              : null
          }
          footer={null}
          onCancel={closeModal}
        >
          <Form
            layout="vertical"
            name="normal_login"
            className=""
            initialValues={initialValues}
            onFinish={onFinishForm}
            form={form}
          >
            <Form.Item
              label="Nombre del guisado"
              name="Name"
              rules={[
                {
                  required: true,
                  message: "Por favor ingresa el nombre de la sopa.",
                },
              ]}
            >
              <Input placeholder="Ingresa el nombre de la sopa" />
            </Form.Item>
            <Form.Item
              label="Costo"
              name="Price"
              rules={[
                { required: true, message: "Por favor ingresa tu contraseña." },
              ]}
            >
              <InputNumber
                placeholder="Costo"
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>

            <Form.Item
              label="Selecciona el tiempo al que pertenece"
              name="TimeItem"
              rules={[
                {
                  required: true,
                  message: "Por favor selecciona a que tiempo pertenece.",
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Selecciona una opción"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                <Option key="3" value="3">
                  Tercero
                </Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="¿El artículo esta disponible para la venta?"
              name="Status"
            >
              <Switch
                checked={checkedSwitch}
                checkedChildren="Sí"
                unCheckedChildren="No"
                onChange={onChangeSwitch}
                defaultChecked={false}
              />
            </Form.Item>

            <div className="footer-products-modal">
              <Form.Item>
                <Button key="back" onClick={closeModal}>
                  Cancelar
                </Button>
              </Form.Item>
              <Form.Item>
                <Button
                  key="saveproducts"
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="m-l-20"
                >
                  Guardar
                </Button>
              </Form.Item>
            </div>
          </Form>
        </Modal>
      </div>
      <Card>
        <Table columns={columns} dataSource={dataTable} />
      </Card>
    </div>
  );
};

Stews.propTypes = {
  menuSelected: PropTypes.string,
  restaurantUser: PropTypes.object,
  CreateRestaurantItem: PropTypes.func,
  GetRestaurantItems: PropTypes.func,
  UpdateRestaurantItem: PropTypes.func,
  DeleteRestaurantItem: PropTypes.func,
};

export default Stews;
