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

const Soups = ({
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
      await GetRestaurantSoups();
    }
    GetData();
  }, []);

  const openModal = () => {
    setVisibleModal(true);
  };

  const openModalEdit = (item) => {
    //Metodos para poder obtener el valor del elemento a enviar utilizando firebase.
    // const soup = await store.collection('RestaurantItems').doc(itemEdit.key).get();
    //funcion que se utiliza para poder obtener la data obtenida del documento.
    // soup.data()

    CleanForm();
    setItemEdit(item);

    const setItemDataInForm = {
      Name: item.name,
      Price: item.price,
      TimeItem:
        item.tags[0].toLowerCase() === "primer tiempo"
          ? "1"
          : item.tags[0].toLowerCase() === "segundo tiempo"
          ? "2"
          : "",
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

  const onFinishForm = async (soupData) => {
    if (!isEditForm) SaveProduct(soupData);
    else EditProduct(soupData);
  };

  const SaveProduct = async (soupData) => {
    try {
      if (soupData && soupData.Status === undefined) soupData.Status = false;

      setLoating(true);

      const { RestaurantId } = restaurantUser;

      const newSoup = {
        RestaurantId: RestaurantId,
        Type: TypeItem.Soups,
        ...soupData,
      };

      const savingStatus = await CreateRestaurantItem(newSoup);

      if (savingStatus && savingStatus.id.length > 0) {
        message.success("Se ha guardado tu sopa de manera correcta");
        setLoating(false);
        setVisibleModal(false);
        CleanForm();
        await GetRestaurantSoups();
      } else {
        message.error(`Error al guardar la sopa ${soupData.Name}`);
      }
    } catch (error) {
      message.error(`Error al guardar la sopa ${soupData.Name}`);
    }
  };

  const EditProduct = async (soupData) => {
    try {
      setLoating(true);

      const { RestaurantId } = restaurantUser;

      const editSoup = {
        RestaurantId: RestaurantId,
        Type: TypeItem.Soups,
        ...soupData,
      };

      await UpdateRestaurantItem(itemEdit.key, editSoup);

      setIsEditForm(false);
      setLoating(false);
      setVisibleModal(false);
      CleanForm();
      await GetRestaurantSoups();
      message.success("Tu sopa ha sido actualizada");
    } catch (error) {
      message.error("Error al actualizar tu sopa");
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
          await GetRestaurantSoups();
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

  const GetRestaurantSoups = async () => {
    let restaurantSoups = await GetRestaurantItems(parseInt(menuSelected));

    if (restaurantSoups) {
      const dataSoups = [];

      restaurantSoups.forEach((item) => {
        let soup = {
          key: item.Id,
          name: item.Name,
          status: item.Status ? "Listo para vender" : "Agotado",
          price: item.Price,
          tags: [item.TimeItem === "1" ? "Primer tiempo" : "Segundo tiempo"],
        };
        dataSoups.push(soup);
      });

      setDataTable(dataSoups);
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
      title: "Sopa",
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
        <h1>Sopas</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setIsEditForm(false);
            openModal();
            CleanForm();
          }}
        >
          Añadir sopa
        </Button>
        <Modal
          visible={visibleModal}
          title={isEditForm ? "Edita tu sopa" : "Añade una sopa"}
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
              label="Nombre de la sopa"
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
                <Option key="1" value="1">
                  Primero
                </Option>
                <Option key="2" value="2">
                  Segundo
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

Soups.propTypes = {
  menuSelected: PropTypes.string,
  restaurantUser: PropTypes.object,
  CreateRestaurantItem: PropTypes.func,
  GetRestaurantItems: PropTypes.func,
  UpdateRestaurantItem: PropTypes.func,
  DeleteRestaurantItem: PropTypes.func,
};

export default Soups;
