import { createAction, createReducer, nanoid } from "@reduxjs/toolkit";
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

export const addPost = createAction(
  "blog/addPost",
  function (post: Omit<Post, "id">) {
    return {
      payload: {
        ...post,
        id: nanoid(),
      },
    };
  },
);

export const deletePost = createAction<string>("blog/deletePost");

export const startEditingPost = createAction<string>("blog/startEditingPost");

export const cancelEditingPost = createAction("blog/cancelEditingPost");

export const finishEditingPost = createAction<Post>("blog/finishEditingPost");

const blogReducer = createReducer(initialState, (builder) => {
  builder.addCase(addPost, (state, action) => {
    state.postList.push(action.payload);
  });
  builder.addCase(deletePost, (state, action) => {
    state.postList = state.postList.filter(
      (post) => post.id !== action.payload,
    );
  });
  builder.addCase(startEditingPost, (state, action) => {
    state.editingPost =
      state.postList.find((post) => post.id === action.payload) || null;
  });
  builder.addCase(cancelEditingPost, (state) => {
    state.editingPost = null;
  });
  builder.addCase(finishEditingPost, (state, action) => {
    state.postList = state.postList.map((post) =>
      post.id === action.payload.id ? action.payload : post,
    );
    state.editingPost = null;
  });
  builder.addMatcher(
    (action) => {
      return action.type.includes("cancel");
    },
    (state) => {
      state.editingPost = null;
      console.log("cancelEditingPost");
    },
  );
});

export default blogReducer;
