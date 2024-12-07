"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = exports.move = exports.remove = exports.create = void 0;
const catalogService_1 = require("../services/catalogService");
const service = new catalogService_1.CatalogService();
const create = (req, res) => {
    const { path } = req.body;
    service.create(path);
    res.status(201).json({ message: `Directory ${path} created.` });
};
exports.create = create;
const remove = (req, res) => {
    const { path } = req.body;
    if (service.delete(path)) {
        res.status(200).json({ message: `Directory ${path} deleted.` });
    }
    else {
        res.status(404).json({ error: `Directory ${path} not found.` });
    }
};
exports.remove = remove;
const move = (req, res) => {
    const { source, target } = req.body;
    if (service.move(source, target)) {
        res.status(200).json({ message: `Moved ${source} to ${target}.` });
    }
    else {
        res.status(400).json({ error: `Failed to move ${source}.` });
    }
};
exports.move = move;
const list = (_req, res) => {
    res.status(200).json(service.list());
};
exports.list = list;
