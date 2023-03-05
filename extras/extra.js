const tagSchema = require("../database/schemas/tagSchema");

const iniTags = () => {
    tagSchema.find({})
        .then(data => {
            console.log(data);
            tagSchema.updateMany({},
                {
                    $set: {
                        tags: [...new Set(data[0]?.tags)]
                    }
                })
            console.log("tags updated");
        }).catch(err => { console.log(err); })
}

module.exports = iniTags;