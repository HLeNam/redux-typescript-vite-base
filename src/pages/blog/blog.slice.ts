import {
  // createAction,
  // createReducer,
  nanoid,
  createSlice,
  PayloadAction,
  current,
} from "@reduxjs/toolkit";
import { Post } from "@/types/blog.type";
import { initialPostList } from "@/constants/blog";

interface BlogState {
  postList: Post[];
  editingPost: Post | null;
}

const initialState: BlogState = {
  postList: initialPostList,
  editingPost: null,
};

// export const addPost = createAction(
//   "blog/addPost",
//   function (post: Omit<Post, "id">) {
//     return {
//       payload: {
//         ...post,
//         id: nanoid(),
//       },
//     };
//   },
// );

// export const deletePost = createAction<string>("blog/deletePost");

// export const startEditingPost = createAction<string>("blog/startEditingPost");

// export const cancelEditingPost = createAction("blog/cancelEditingPost");

// export const finishEditingPost = createAction<Post>("blog/finishEditingPost");

const blogSlice = createSlice({
  name: "blog",
  initialState: initialState,
  reducers: {
    deletePost: (state, action: PayloadAction<string>) => {
      state.postList = state.postList.filter(
        (post) => post.id !== action.payload,
      );
    },
    startEditingPost: (state, action: PayloadAction<string>) => {
      state.editingPost =
        state.postList.find((post) => post.id === action.payload) || null;
    },
    cancelEditingPost: (state) => {
      state.editingPost = null;
    },
    finishEditingPost: (state, action: PayloadAction<Post>) => {
      state.postList = state.postList.map((post) =>
        post.id === action.payload.id ? action.payload : post,
      );
      state.editingPost = null;
    },
    addPost: {
      reducer: (state, action: PayloadAction<Post>) => {
        state.postList.push(action.payload);
      },
      prepare: (post: Omit<Post, "id">) => {
        return {
          payload: {
            ...post,
            id: nanoid(),
          },
        };
      },
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => {
          return action.type.includes("cancel");
        },
        (state) => {
          state.editingPost = null;
          console.log("cancelEditingPost");
        },
      )
      .addDefaultCase((state) => {
        console.log("default case: ", current(state));
      });
  },
});

export const {
  addPost,
  deletePost,
  startEditingPost,
  cancelEditingPost,
  finishEditingPost,
} = blogSlice.actions;

const blogReducer = blogSlice.reducer;

// const blogReducer = createReducer(initialState, (builder) => {
//   builder.addCase(addPost, (state, action) => {
//     state.postList.push(action.payload);
//   });
//   builder.addCase(deletePost, (state, action) => {
//     state.postList = state.postList.filter(
//       (post) => post.id !== action.payload,
//     );
//   });
//   builder.addCase(startEditingPost, (state, action) => {
//     state.editingPost =
//       state.postList.find((post) => post.id === action.payload) || null;
//   });
//   builder.addCase(cancelEditingPost, (state) => {
//     state.editingPost = null;
//   });
//   builder.addCase(finishEditingPost, (state, action) => {
//     state.postList = state.postList.map((post) =>
//       post.id === action.payload.id ? action.payload : post,
//     );
//     state.editingPost = null;
//   });
//   builder.addMatcher(
//     (action) => {
//       return action.type.includes("cancel");
//     },
//     (state) => {
//       state.editingPost = null;
//       console.log("cancelEditingPost");
//     },
//   );
// });

export default blogReducer;
