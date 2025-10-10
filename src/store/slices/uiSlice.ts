// src/store/uiSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  vacancyModalOpen: boolean;
  selectedVacancyId: string | null;
  sidebarOpen: boolean;
  loading: boolean;
}

const initialState: UIState = {
  vacancyModalOpen: false,
  selectedVacancyId: null,
  sidebarOpen: false,
  loading: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openVacancyModal: (state, action: PayloadAction<string>) => {
      state.vacancyModalOpen = true;
      state.selectedVacancyId = action.payload;
    },
    closeVacancyModal: (state) => {
      state.vacancyModalOpen = false;
      state.selectedVacancyId = null;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    showLoader: (state) => {
      state.loading = true;
    },
    hideLoader: (state) => {
      state.loading = false;
    },
  },
});

export const { openVacancyModal, closeVacancyModal, toggleSidebar, showLoader, hideLoader } = uiSlice.actions;
export default uiSlice.reducer;
