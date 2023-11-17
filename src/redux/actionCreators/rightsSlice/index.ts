// 使用 createSlice 方法 创建一个slice。每一个slice里面包含了reducer和actions，可以实现模块化的封装。所有的相关操作都独立在一个文件中完成。
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { $axios } from "../../../util/request";
import { AppDispatch } from "../../store";
// 定义 初始值 initialState 接口
interface initialStateType {
  rightsList:Array<object>,
// 剩下的属性可通过 任意属性 自定义键值类型（[name]） 和 自定义 键key (key值any任意类型) 如  [propName: string]: any;
  [propName: string]: any;
}
const initialState:initialStateType = {
  // 初始值
  rightsList: [],
};
export const rightsSlice = createSlice({
  // 命名空间，在调用action的时候会默认的设置为action的前缀 rightsSlice/changRightsList
  name: "rightsSlice",
  // 初始值
  initialState: initialState,
  // 这里的属性会自动的导出为 rightsSlice.actions，在组件中可以直接通过dispatch进行触发
  reducers: {
    //{ payload }解构出来的payload是dispatch传递的数据对象
    changRightsList(state, action) {
      // console.log(action)
      // let type= action.payload.type
      state.rightsList = action.payload.value;
      console.log("rightsSlice", state, action, [...action.payload.value]);
      // 内置了immutable不可变对象来管理state,不用再自己拷贝数据进行处理
    },
    // ... 可多个
  },
  extraReducers: (builder) => { // 处理 createAsyncThunk 异步设置状态
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchUserById.fulfilled, (state, action) => {
      // Add user to the state array
      console.log(state, action);
      // state.entities.push(action.payload)
    });
  },
});
// 导出actions
export const { changRightsList } = rightsSlice.actions;
// 使用redux-thunk方式处理异步 RTK集成了redux-thunk来处理异步事件，所以可以按照之前thunk的写法来写异步请求
export const getRightsList = (params: any) => {
  return (dispatch: AppDispatch) => {
    try {
      $axios({
        url: "/api/rights",
        method: "get",
        params: {
          id: params.id,
        },
      })
        .then((res) => {
          let data = res.data.Data;
          dispatch(changRightsList({ value: data, type: "rightsList" }));
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };
};

export const fetchUserById = createAsyncThunk(
  "rightsSlice/rightsList",
  async (params: any, thunkAPI) => {
    console.log(params, thunkAPI);
    try {
    const  res = await $axios({
      url: "/api/rights",
      method: "get",
      params: {
        id: params.id,
      },
    });
    return res.data.Data;
  } catch (err) {
    console.log(err);
  }
  }
);

// 导出reducer，在创建store时使用到
export default rightsSlice.reducer;
