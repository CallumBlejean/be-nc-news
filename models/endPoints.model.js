const fs = require("fs/promises")

exports.fetchEndPoints = () => {
    const filePath = `${__dirname}/../endpoints.json`
    return fs.readFile(filePath, "utf8")
    .then((endPoints) => {
       return JSON.parse(endPoints)
    })
    .catch((error) => {
        throw error;
      });
}