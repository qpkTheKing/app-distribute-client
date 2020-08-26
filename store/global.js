export const state = () => ({
  currentRoute: '',
});

export const mutations = {
  changeRoute(state, route) {
    state.currentRoute = route;
  }
};

export const getters = {
  currentRoute(state) {
    return state.currentRoute;
  }
}
