import { TreeModel } from '../models/catalogModel';
import fs from 'fs';

export class CatalogService {
    private root: TreeModel;
    private stateFile: string;

    constructor(stateFile = 'state.json') {
        this.stateFile = stateFile;
        this.root = new TreeModel('root');
        this.loadState();
    }

    private loadState(): void {
        if (fs.existsSync(this.stateFile)) {
            const state = JSON.parse(fs.readFileSync(this.stateFile, 'utf-8'));
            this.root = this.restoreTree(state);
        }
    }

    private saveState(): void {
        const state = this.convertToState(this.root);
        fs.writeFileSync(this.stateFile, JSON.stringify(state, null, 2));
    }

    private restoreTree(data: any): TreeModel {
        const node = new TreeModel(data.name);
        if (data.children) {
            for (const child of data.children) {
                node.children.set(child.name, this.restoreTree(child));
            }
        }
        return node;
    }

    private convertToState(node: TreeModel): any {
        const children = Array.from(node.children.values()).map(child => this.convertToState(child));
        return {
            name: node.name,
            children: children
        };
    }

    create(path: string): void {
        const parts = path.split('/');
        let current = this.root;

        for (const part of parts) {
            if (!current.children.has(part)) {
                current.children.set(part, new TreeModel(part));
            }
            current = current.children.get(part)!;
        }
        this.saveState();
    }

    delete(path: string): boolean {
        const parts = path.split('/');
        const nodeName = parts.pop()!;
        const parent = this.findNode(parts);

        if (parent && parent.children.has(nodeName)) {
            parent.children.delete(nodeName);
            this.saveState();
            return true;
        }
        return false;
    }

    move(source: string, target: string): boolean {
        const sourceParts = source.split('/');
        const targetParts = target.split('/');
        const nodeName = sourceParts.pop()!;
        const sourceParent = this.findNode(sourceParts);
        const targetParent = this.findNode(targetParts);

        if (sourceParent && targetParent && sourceParent.children.has(nodeName)) {
            const node = sourceParent.children.get(nodeName)!;
            targetParent.children.set(nodeName, node);
            sourceParent.children.delete(nodeName);
            this.saveState();
            return true;
        }
        return false;
    }

    list(): string[] {
        return this.buildList(this.root);
    }

    private buildList(node: TreeModel, prefix = ''): string[] {
        let result = [`${prefix}${node.name}`];
        for (const child of node.children.values()) {
            result = result.concat(this.buildList(child, `${prefix}${node.name}/`));
        }
        return result;
    }

    private findNode(parts: string[]): TreeModel | null {
        let current = this.root;
        for (const part of parts) {
            if (!current.children.has(part)) return null;
            current = current.children.get(part)!;
        }
        return current;
    }
}
