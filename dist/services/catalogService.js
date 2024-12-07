"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogService = void 0;
const catalogModel_1 = require("../models/catalogModel");
const fs_1 = __importDefault(require("fs"));
class CatalogService {
    constructor(stateFile = 'state.json') {
        this.stateFile = stateFile;
        this.root = new catalogModel_1.TreeModel('root');
        this.loadState();
    }
    loadState() {
        if (fs_1.default.existsSync(this.stateFile)) {
            const state = JSON.parse(fs_1.default.readFileSync(this.stateFile, 'utf-8'));
            this.root = this.restoreTree(state);
        }
    }
    saveState() {
        fs_1.default.writeFileSync(this.stateFile, JSON.stringify(this.root, null, 2));
    }
    restoreTree(data) {
        const node = new catalogModel_1.TreeModel(data.name);
        if (data.children) {
            for (const [key, child] of Object.entries(data.children)) {
                node.children.set(key, this.restoreTree(child));
            }
        }
        return node;
    }
    create(path) {
        const parts = path.split('/');
        let current = this.root;
        for (const part of parts) {
            if (!current.children.has(part)) {
                current.children.set(part, new catalogModel_1.TreeModel(part));
            }
            current = current.children.get(part);
        }
        this.saveState();
    }
    delete(path) {
        const parts = path.split('/');
        const nodeName = parts.pop();
        const parent = this.findNode(parts);
        if (parent && parent.children.has(nodeName)) {
            parent.children.delete(nodeName);
            this.saveState();
            return true;
        }
        return false;
    }
    move(source, target) {
        const sourceParts = source.split('/');
        const targetParts = target.split('/');
        const nodeName = sourceParts.pop();
        const sourceParent = this.findNode(sourceParts);
        const targetParent = this.findNode(targetParts);
        if (sourceParent && targetParent && sourceParent.children.has(nodeName)) {
            const node = sourceParent.children.get(nodeName);
            targetParent.children.set(nodeName, node);
            sourceParent.children.delete(nodeName);
            this.saveState();
            return true;
        }
        return false;
    }
    list() {
        return this.buildList(this.root);
    }
    buildList(node, prefix = '') {
        let result = [`${prefix}${node.name}`];
        for (const child of node.children.values()) {
            result = result.concat(this.buildList(child, `${prefix}${node.name}/`));
        }
        return result;
    }
    findNode(parts) {
        let current = this.root;
        for (const part of parts) {
            if (!current.children.has(part))
                return null;
            current = current.children.get(part);
        }
        return current;
    }
}
exports.CatalogService = CatalogService;
