export const state = () => ({
  selected: 'FRESH',
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
      title: '主题色系',
      content: '请至少选择一项',
      key: 'selectedTheme'
    },
    {
      title: '网站模板',
      content: '手机端和PC端',
      key: 'selected'
    }
  ],
  templates: [
    {
      title: 'FRESH',
      showcase: 'https://images.b298100.com:42666/TCG_PROD_IMAGES/TEMPLATE/MOBILE/FRESH/01.jpg',
      images: {
        desktop: [
          'https://images.b298100.com:42666/TCG_PROD_IMAGES/TEMPLATE/WEB/TEST2/01.jpg',
          'https://images.b298100.com:42666/TCG_PROD_IMAGES/TEMPLATE/WEB/TEST1/01.jpg'
        ],
        mobile: [
          'https://images.b298100.com:42666/TCG_PROD_IMAGES/TEMPLATE/MOBILE/AUBO/01.jpg'
        ]
      }
    },
    {
      title: 'GOLD',
      showcase: 'https://images.b298100.com:42666/TCG_PROD_IMAGES/TEMPLATE/MOBILE/GOLD/01.jpg',
      images: {
        desktop: [
          'https://images.b298100.com:42666/TCG_PROD_IMAGES/TEMPLATE/WEB/TEST1/01.jpg'
        ],
        mobile: [
          'https://images.b298100.com:42666/TCG_PROD_IMAGES/TEMPLATE/MOBILE/GOLD/01.jpg'
        ]
      }
    }
  ]
});

export const mutations = {
  setTemplate(state, newTemplate) {
    state.selected = newTemplate;
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

export const getters = {
  getTemplate(state) {
    const { selected } = state;
    return state.templates.filter((template) => template.title === selected)[0];
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
