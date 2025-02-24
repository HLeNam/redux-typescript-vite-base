import {
  createSlice,
  PayloadAction,
  current,
  createAsyncThunk,
  nanoid,
} from "@reduxjs/toolkit";
import { Post } from "@/types/blog.type";
import http from "@/utils/http";

interface BlogState {
  postList: Post[];
  editingPost: Post | null;
}

const initialState: BlogState = {
  postList: [],
  editingPost: null,
};

const blogSlice = createSlice({
  name: "blog",
  initialState: initialState,
  reducers: {
    startEditingPost: (state, action: PayloadAction<string>) => {
      state.editingPost =
        state.postList.find((post) => post.id === action.payload) || null;
    },
    cancelEditingPost: (state) => {
      state.editingPost = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPostList.pending, () => {
        console.log("getPostList pending");
      })
      .addCase(getPostList.fulfilled, (state, action) => {
        state.postList = action.payload;
      })
      .addCase(getPostList.rejected, (_, action) => {
        console.log("getPostList rejected: ", action.error.message);
      })
      .addCase(addPost.pending, () => {
        console.log("addPost pending");
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.postList.push(action.payload);
      })
      .addCase(addPost.rejected, (_, action) => {
        console.log("addPost rejected: ", action.error.message);
      })
      .addCase(updatePost.pending, () => {
        console.log("updatePost pending");
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.postList = state.postList.map((post) =>
          post.id === action.payload.id ? action.payload : post,
        );
      })
      .addCase(updatePost.rejected, (_, action) => {
        console.log("updatePost rejected: ", action.error.message);
      })
      .addCase(deletePost.pending, () => {
        console.log("deletePost pending");
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.postList = state.postList.filter(
          (post) => post.id !== action.payload,
        );
      })
      .addCase(deletePost.rejected, (_, action) => {
        console.log("deletePost rejected: ", action.error.message);
      })
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

export const getPostList = createAsyncThunk(
  "blog/getPostList",
  async (_, thunkAPI) => {
    const res = await http.get<Post[]>("/posts", {
      signal: thunkAPI.signal,
    });

    return res.data;
  },
);

export const addPost = createAsyncThunk(
  "blog/addPost",
  async (body: Omit<Post, "id">, thunkAPI) => {
    const newPost = {
      ...body,
      id: nanoid(),
    };

    const res = await http.post<Post>("/posts", newPost, {
      signal: thunkAPI.signal,
    });

    return res.data;
  },
);

export const updatePost = createAsyncThunk(
  "blog/updatePost",
  async (body: Post, thunkAPI) => {
    const res = await http.put<Post>(`/posts/${body.id}`, body, {
      signal: thunkAPI.signal,
    });

    return res.data;
  },
);

export const deletePost = createAsyncThunk(
  "blog/deletePost",
  async (postId: string, thunkAPI) => {
    await http.delete(`/posts/${postId}`, {
      signal: thunkAPI.signal,
    });

    return postId;
  },
);

export const { startEditingPost, cancelEditingPost } = blogSlice.actions;

const blogReducer = blogSlice.reducer;

export default blogReducer;
