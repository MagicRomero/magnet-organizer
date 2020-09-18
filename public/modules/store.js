const Store = require("electron-store");
const shortid = require("shortid");
const countries = require("../data/countries.json");

const schema = {
  countries: {
    type: "array",
    items: {
      type: "object",
      properties: {
        iso_code: {
          type: "string",
          minLength: 2,
          maxLength: 4,
        },
        name: {
          type: "string",
        },
      },
      required: ["iso_code", "name"],
      additionalProperties: false,
    },
  },
  authors: {
    type: "array",
    items: {
      type: "object",
      properties: {
        id: {
          type: "string",
          default: shortid.generate(),
        },
        name: {
          type: "string",
          pattern: "([a-zA-Z]|\\s)+",
        },
        category: {
          type: "string",
          default: "friend",
        },
      },
      required: ["id", "name", "category"],
      additionalProperties: false,
    },
  },
  magnets: {
    type: "array",
    items: {
      type: "object",
      properties: {
        id: {
          type: "string",
          default: shortid.generate(),
        },
        name: {
          type: "string",
          pattern: "(\\w|\\s)+",
        },
        image: {
          type: ["string", "null"],
          pattern: "[\\/.](gif|jpg|jpeg|tiff|png)$",
        },
        date: {
          type: "string",
          format: "date-time",
          default: new Date().toJSON(),
        },
        author: {
          type: "string",
          default: "",
        },
        country: {
          type: "string",
        },
      },
      required: ["id", "name", "date", "country"],
      additionalProperties: true,
    },
    default: [],
  },
};

const store = new Store({
  migrations: {
    "0.1.1": (store) => {
      store.set("authors", [
        {
          id: shortid.generate(),
          name: "Adrian Romero Tapia",
          category: "family",
        },
        {
          id: shortid.generate(),
          name: "Daniel Romero Tapia",
          category: "family",
        },
      ]);

      store.set(
        "countries",
        Object.keys(countries).map((iso_code) => ({
          iso_code,
          name: countries[iso_code],
        }))
      );
    },
  },
  schema,
});

module.exports = store;
