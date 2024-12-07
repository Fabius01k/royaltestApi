import { Request, Response } from 'express';
import { CatalogService } from '../services/catalogService';

const service = new CatalogService();

export const create = (req: Request, res: Response): void => {
    const { path } = req.body;
    service.create(path);
    res.status(201).json({ message: `Directory ${path} created.` });
};

export const remove = (req: Request, res: Response): void => {
    const { path } = req.body;
    if (service.delete(path)) {
        res.status(200).json({ message: `Directory ${path} deleted.` });
    } else {
        res.status(404).json({ error: `Directory ${path} not found.` });
    }
};

export const move = (req: Request, res: Response): void => {
    const { source, target } = req.body;
    if (service.move(source, target)) {
        res.status(200).json({ message: `Moved ${source} to ${target}.` });
    } else {
        res.status(400).json({ error: `Failed to move ${source}.` });
    }
};

export const list = (_req: Request, res: Response): void => {
    res.status(200).json(service.list());
};
