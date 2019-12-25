const { Ipsums } = require("../models");

module.exports = {
  /**
   * @returns {Object[]} All Ipsums
   */
  findAll: () => {
    return new Promise((resolve, reject) => {
      Ipsums.find()
        .then(resolve)
        .catch(reject);
    });
  },

  /**
   * @returns {String[]} Unique characters Ipsums are saved for
   */
  findCharacters: () => {
    return new Promise((resolve, reject) => {
      Ipsums.find()
        .distinct("character")
        .then(resolve)
        .catch(reject);
    });
  },

  /**
   * @param {Object} conditions Conditions to find Ipsums on
   * @return {String[]} Random Ipsums matching conditions
   */
  findIpsums: conditions => {
    const { choosen, limit } = conditions;
    return new Promise((resolve, reject) => {
      Ipsums.find({ character: { $in: choosen } })
        .then(ipsums => {
          const randomized = ipsums
            .map(ip => ip.quote)
            .sort(() => 0.5 - Math.random());

          const combined = [];
          let i = 0;
          while (i < randomized.length) {
            let combinedIpsumStr = randomized[i];
            while (combinedIpsumStr.length < 500 && i < randomized.length) {
              i++;
              combinedIpsumStr += randomized[i];
            }
            combined.push(combinedIpsumStr);
          }

          const max = combined.length > limit ? limit : combined.length;
          resolve(combined.slice(0, max));
        })
        .catch(reject);
    });
  },

  /**
   * @param {Object} body Data to add to db
   * @return {Object} new Db item
   */
  create: body => {
    return new Promise((resolve, reject) => {
      Ipsums.create(body)
        .then(resolve)
        .catch(reject);
    });
  }
};
