export const state = () => ({
  list: [],
  crudFile: {}
});

export const mutations = {
  add(state, file) {
    state.list.push(file);
  },
  setFile(state, file) {
    state.crudFile = file;
  }
};
