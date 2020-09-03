export const state = () => ({
  currentRoute: '',
  appId: '',
  fileId: '',
  currentRole: ''
});

export const mutations = {
  changeRoute(state, route) {
    state.currentRoute = route;
  },
  changeAppId(state, appId) {
    state.appId = appId;
  },
  changeFileId(state, fileId) {
    state.fileId = fileId;
  },
  setCurrentRole(state, role) {
    state.currentRole = role;
  }
};

export const getters = {
  currentRoute(state) {
    return state.currentRoute;
  },
  currentAppId(state) {
    return state.appId;
  },
  currentFileId(state) {
    return state.fileId;
  },
  role(state) {
    return state.currentRole;
  }
}
