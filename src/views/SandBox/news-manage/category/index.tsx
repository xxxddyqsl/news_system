import React, { useContext, useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from '../../../../assets/css/news-manage/category.module.scss'
import { useSelector, shallowEqual } from 'react-redux';
import { Button, Modal, Form, Input } from 'antd';
import WinResize from '../../../../components/winResize';
import MyTable from '../../../../components/table';
import {
  DeleteOutlined,
  ExclamationOutlined,
} from '@ant-design/icons';
import axios from 'axios'
import MyModal from '../../../../components/modal';
import MyForm from '../../../../components/form';
import type { InputRef } from 'antd';
import type { FormInstance } from 'antd/es/form';
import Item from 'antd/es/list/Item';
const { confirm } = Modal;

interface Item {
  id: string;
  title: string;
}

interface EditableRowProps {
  index: number;
}
// 通过React.createContext  创建上下文 context对象 （供应商）
const EditableContext = React.createContext<FormInstance<any> | null>(null);

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  // 创建 form 对象
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      {/* 将 form传入  EditableContext （供应商） 因此成为消费者 即可使用 */}
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };
  // {/*  input onBlur失去焦点 或 onPressEnter 回车 时 触发 save 函数 */}
  const save = async () => {
    try {
      // 获取 form 值
      const values = await form.validateFields();

      toggleEdit();
      // 调用 handleSave 函数
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;
  // 根据 editable 属性 渲染 input 或 渲染子组件
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        {/*  input onBlur失去焦点 或 onPressEnter 回车 时 触发 save 函数 */}
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
        {children}
      </div>
    );
  }
  // 不可编辑 按原来的显示
  return <td {...restProps}>{childNode}</td>;
};
// 定义 可编辑的行 和 单元格
const components = {
  body: {
    row: EditableRow,
    cell: EditableCell,
  },
};

interface DataType {
  id: React.Key;
  title: string;
  value: string;
}
// 新闻管理 -组件
export default function NewsCategory() {
  //根据store.js中设置的reducer名字，从 userSlice 空间获取state
  const { userInfo } = useSelector((state: any) => state.userSlice, shallowEqual);
  const navigate = useNavigate();
  // antd 内部封装的 获取form 表单函数 ， form 返回一个对象 内包含了 submit 提交 ，获取value 等等函数
  const [form] = Form.useForm();
  // 添加类别 - modal
  const [open, setOpen] = useState<boolean>(false)
  // 获取 div 元素 获取高 传入 table 设置table 设置属性  scroll={{y: 100}} 超出滚动
  const refElem = useRef<any>();
  const [warperRef, setWarperRef] = useState();
  const [categoryList, setCategoryList] = useState<Array<Object>>([]);
  const defaultColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id: any, record: any,) => {
        return <div>{id}</div>
      }
    },
    {
      title: '栏目名称',
      dataIndex: 'title',
      editable: true, // 声明为 可编辑项
      render: (title: any, record: any,) => {
        return <div >{title}</div>
      }
    },
    {
      title: '操作',
      render: (item: any,) => { // 此处 dataIndex 未和数据字段的 属性绑定 因此只有一个返回值 返回当前行的数据
        return <>
          <Button danger shape="circle" title='删除' icon={<DeleteOutlined />} onClick={() => {
            ConfirmMethod(item)
          }} style={{ marginRight: '16px' }} />

        </>
      }
    },
  ]
  // 遍历 editable 存在 为 true 时 渲染 可编辑 form input 组件 否则 渲染原组件
  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      // onCell 为 可编辑的 单元格 并且editable为 true 时触发
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,// 自定义 函数
      }),
    };
  });
  // table 可编辑 - 修改完成 - 失去焦点或 回车时 触发
  const handleSave = (row: DataType) => {
    console.log(row)
    let id = row.id;
    //  Reflect.deleteProperty 使用 ES6 中 Reflect 对象的 deleteProperty 静态方法 注意 该方法会改变原对象
    // 删除对象 中的 id 字段 + 新闻分类表的数据 category 已有新闻分类id （categoryId）
    Reflect.deleteProperty(row, 'id');
    // 获取新闻类别
    axios({
      url: `/api/newsCategories`,
      method: 'patch',
      data: {
        id: id,
        set: {
          title: row.title,
          value: row.title,
        }
      }
    }).then(res => {
      // 更新 状态 id 相同 返回一个 新的对象 否则 返回原对象 
      setCategoryList(categoryList.map((item: any) => item.id === id ? { ...item, id: id, title: row.title, value: row.title } : item))
      console.log(res)
    }).catch((err) => {
      console.log(err)
    });

  }
  useEffect(() => {
    // console.log(userInfo)
    // 获取新闻类别
    axios({
      url: `/api/newsCategories`,
      method: 'get',
    }).then(res => {
      let data = res.data.Data;
      setCategoryList(data)
      console.log(res)
    }).catch((err) => {
      console.log(err)
    });
  }, [])
  const ConfirmMethod = (item: any) => {
    confirm({
      title: '你确定要删除?',
      icon: <ExclamationOutlined></ExclamationOutlined>,
      // content:'2',
      onOk() {
        // 删除
        deleteMethod(item)
      },
      onCancel() {
        console.log('cancel')
      }
    })
  }
  // 删除 新闻类别 - 修改状态
  const deleteMethod = (data: any) => {
    axios({
      url: `/api/newsCategories`,
      method: 'delete',
      data: {
        id: data.id,
        set: {
          dele:1,
        },
      }
    }).then(res => {
     // 更新 状态 id 相同 返回一个 新的对象 否则 返回原对象 
     setCategoryList(categoryList.filter((item: any) => item.id !== data.id ))
    }).catch((err) => {
      console.log(err)
    });
  }
  // 添加新闻类别
  const handleAddForm = () => {
    form.validateFields().then((value: any) => {
      axios({
        url: `/api/newsCategories`,
        method: 'post',
        data: {
          title: value.categoryName,
          value: value.categoryName,
        }
      }).then(res => {
        console.log(res)
      }).catch((err) => {
        console.log(err)
      });
    }).catch(err => console.log(err))
  }
  // 自定义 table 配置
  const configurationTable = {
    components: components, // table - 可编辑单元格,配置
    columns: columns, // table 头
    pagination: {
      pageSize: 5,// 每页显示几条
    },
    dataSource: categoryList,// table 数据
  }
  return (
    <div style={{ height: '100%' }} className=' gg-flex-4 gg-flex-2'>
      {/* 超级管理员 可显示添加类别  */}
      {userInfo?.roleid === 1 && <Button style={{ marginBottom: 16 }} type={'primary'} onClick={() => setOpen(!open)}>添加类别</Button>}
      <div className={styles['news-manage-category-wrapper'] + ' gg-flex-4 gg-flex-2'} ref={refElem}>
        {/* 实时监听页面高度变化 - 获取 元素 获取高*/}
        <WinResize contentElem={refElem} callback={(size: any) => {
          // refElem 发送变化 重新获取 refElem高度 赋值触发更新 子组件MyTable内部重新获取 refElem
          setWarperRef(refElem.current.getBoundingClientRect())
        }}></WinResize>
        <MyTable id={'myCategoryListTable'} warperRefObj={warperRef} warperRef={refElem.current} rowKey={'id'} configurationTable={configurationTable} ></MyTable>
      </div>

      {/* 添加 */}
      <MyModal open={open} title={'添加类别'} okText={'确定'} cancelText={'取消'} onCreate={(values: any) => {
        console.log('Received values of form: ', values);
        setOpen(false)
      }} onOk={() => handleAddForm()} onCancel={() => {
        // 取消
        setOpen(false);
        // 清空 表单 数据
        form.resetFields();
      }} childrenArr={[
        // 通过 插槽渲染
        <MyForm layout={'vertical'} form={form}>
          <Form.Item
            name="categoryName"
            label="类别名"
            // rules为表单 校验的一些信息 如 正则表达式  required 表是否为必填项 true 必填  message 提示文字 等等
            rules={[{ required: true, message: 'Please input the categoryName of collection!' }]}
          >
            <Input />
          </Form.Item>
        </MyForm>,
      ]}></MyModal>
    </div>
  )
}
