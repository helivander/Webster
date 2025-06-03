import { createSlice, createSelector } from '@reduxjs/toolkit';
import { StageObject } from '~/types/stage-object';
import { RootState } from '../store';

export type IStageState = {
  id: string | null;
  name: string | null;
  description: string | null;
  content?: string | StageObject[] | null;
};

export type IFrameState = {
  stage: IStageState;
  width: number;
  height: number;
  scale: number;
};

const initialState: IFrameState = {
  stage: {
    id: null,
    name: null,
    description: null,
    content: null,
  },
  width: 1080,
  height: 1080,
  scale: 1,
};

const frameSlice = createSlice({
  name: 'frame',
  initialState,
  reducers: {
    setStage(state, { payload }) {
      state.stage.id = payload.id;
      state.stage.name = payload.name || null;
      state.stage.description = payload.description || null;
      state.stage.content = Array.isArray(payload.content) ? payload.content : [];
    },
    resetStage(state) {
      state.stage.id = null;
      state.stage.name = null;
      state.stage.description = null;
      state.stage.content = null;
    },
    setSize(state, { payload }) {
      state.width = payload.width;
      state.height = payload.height;
    },
    setScale(state, { payload }) {
      state.scale = payload.scale;
    },
  },
});

// Seletores memoizados
export const selectFrame = (state: RootState) => state.frame;

export const selectStage = createSelector(
  [selectFrame],
  (frame) => frame.stage
);

export const selectFrameDimensions = createSelector(
  [selectFrame],
  (frame) => ({
    width: frame.width,
    height: frame.height,
    scale: frame.scale,
  })
);

export const { setStage, resetStage, setSize, setScale } = frameSlice.actions;
export default frameSlice.reducer;
