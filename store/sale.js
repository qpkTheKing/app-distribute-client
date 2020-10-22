import _throttle from 'lodash/throttle';
import _groupBy from 'lodash/groupBy';

export const state = () => ({
  selected: '',
  selectedMarket: '',
  selectedProduct: '',
  selectedTheme: '',
  steps: [
    {
      title: '用户面向市场',
      content: '请至少选择一项',
      key: 'selectedMarket'
    },
    {
      title: '主推产品',
      content: '请至少选择一项',
      key: 'selectedProduct'
    },
    {
      title: '网站模板',
      content: '手机端和PC端',
      key: 'selected'
    }
  ],
  mobileTemplates: [],
  webTemplates: [],
  templates: {},
});

export const mutations = {
  setTemplate(state, newTemplate) {
    state.selected = newTemplate;
  },
  setMobileTemplates(state, template) {
    state.mobileTemplates = template;
  },
  setWebTemplates(state, template) {
    state.webTemplates = template;
  },
  setTemplates(state, { country, product }) {
    const webTemplates = state.webTemplates.map(template => {
      template.platform = 'W';
      return template;
    });
    const mobileTemplates = state.mobileTemplates.map(template => {
      template.platform = 'M'
      return template;
    });
    const allTemplates = webTemplates.concat(mobileTemplates);
    const patternGroupName = /(CN|TH|VN)_(LOTT|ELOTT|ENT)/;
    const neededTemplates = allTemplates.filter(template => template.groupName !== undefined && template.groupName !== null && patternGroupName.test(template.groupName));
    const formatted = neededTemplates.map(template => {
      const { bannerId, title, url, groupName, platform } = template;
      const category = groupName.split('_');
      const country = category[0];
      const product = category[1];
      const setNumber = category[2];
      return {
        id: bannerId,
        group: `${country}_${product}`,
        platform,
        country,
        product,
        setNumber: `${country}_${product}_${setNumber}`,
        title,
        image: url,
      };
    });
    const grouped = _groupBy(formatted, 'group');
    state.templates = _groupBy(grouped[`${country}_${product}`], 'setNumber');
    window.sessionStorage.setItem('TEMPLATES', JSON.stringify(state.templates));
  },
  setMarket(state, newMarket) {
    state.selectedMarket = newMarket;
  },
  setProduct(state, newProduct) {
    state.selectedProduct = newProduct;
  },
  setTheme(state, newTheme) {
    state.selectedTheme = newTheme;
  }
};

export const actions = {
  async getTemplates({ commit }, platform) {
    const url = `https://www.qpkdemo.com/wps/relay/MCSFE_getListAnnouncements?types=B&merchantCode=qpkdemo&platform=${platform}&token=`;
    const { value } = await this.$axios.$get(url, {
      headers: {
        'Authorization': '',
        'Merchant': 'qpkdemo'
      }
    });
    const { banners } = value;

    if (platform === 'W') {
      commit('setWebTemplates', banners);
      window.sessionStorage.setItem('WEB-TEMPLATES', JSON.stringify(banners));
    }
    if (platform === 'M') {
      commit('setMobileTemplates', banners);
      window.sessionStorage.setItem('MOBILE-TEMPLATES', JSON.stringify(banners));
    }
  },
  _throttleGetTemplates: _throttle(({ commit, dispatch }, platform) => {
    dispatch('getTemplates', platform);
  }, 2000)
};

export const getters = {
  getMobileTemplates(state) {
    return state.mobileTemplates;
  },
  getWebTemplates(state) {
    return state.webTemplates
  },
  getTemplate(state) {
    const template = state.templates;
    return {
      title: state.selected,
      template: template[state.selected]
    };
  },
  getAllTemplates(state) {
    return state.templates;
  },
  getSteps(state) {
    return state.steps;
  },
  getMarket(state) {
    return state.selectedMarket;
  },
  getProduct(state) {
    return state.selectedProduct;
  },
  getTheme(state) {
    return state.selectedTheme;
  }
};
