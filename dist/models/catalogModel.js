"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeModel = void 0;
class TreeModel {
    constructor(name) {
        this.name = name;
        this.children = new Map();
    }
}
exports.TreeModel = TreeModel;
