const fsPromises = require('fs').promises;
const path = require('path');

// Define the path to your JSON file
const filePath = path.join(__dirname, "..", "model", 'data.json');

const data = {
    items: require('../model/data.json'),
    setItem: function (data) { this.items = data }
}

const readAllData = (req, res) => {
    res.json(data.items);
}

const createNewData = async (req, res) => {
    const newData = {
        id: data.items?.length ? data.items[data.items.length - 1].id + 1 : 1,
        checked: false,
        item: req.body.item
    }
    if (!newData.item) {
        return res.status(400).json({ 'message': 'Text is required.' });
    }

    // Write updated data back to file
    data.setItem([...data.items, newData])
    res.status(201).json(data.items); // Respond with updated data
    await fsPromises.writeFile(
        filePath,
        JSON.stringify(data.items)
    );
}

const updateData = async (req, res) => {
    try {
        const item = data.items.find(db => db.id === parseInt(req.params.id));
        if (!item) {
            return res.status(404).json({ "message": `Item ID ${req.params.id} not found` });
        }
        if (req.body.item) item.item = req.body.item;
        if (req.body.checked === true || req.body.checked === false) item.checked = req.body.checked;
        const filteredArray = data.items.filter(db => db.id !== parseInt(req.params.id));
        const unsortedArray = [...filteredArray, item];
        data.items = unsortedArray.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0);
        data.setItem(data.items);
        res.json(data.items);
        await fsPromises.writeFile(
            filePath,
            JSON.stringify(data.items)
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({ "message": "An error occurred while updating the item" });
    }
};

const deleteData = async (req, res) => {
    const item = data.items.find(db => db.id === parseInt(req.params.id));
    if (!item) {
        return res.status(400).json({ "message": `Data ID ${req.params.id} not found` });
    }
    const filteredArray = data.items.filter(db => db.id !== parseInt(req.params.id));
    data.setItem([...filteredArray]);
    await fsPromises.writeFile(
        filePath,
        JSON.stringify(data.items)
    );
    res.json(data.items);
}

const getData = (req, res) => {
    const item = data.items.find(db => db.id === parseInt(req.params.id));
    if (!item) {
        return res.status(400).json({ "message": `Data ID ${req.params.id} not found` });
    }
    res.json(item);
}

module.exports = {
    readAllData,
    createNewData,
    updateData,
    getData,
    deleteData
}