import { CatalogService } from '../src/services/catalogService';

let service: CatalogService;

beforeEach(() => {
    service = new CatalogService();
});
describe('CatalogService', () => {
    test('CREATE and LIST directories', () => {
        service.create('fruits/apples/fuji');
        service.create('vegetables');

        const result = service.list();
        expect(result).toEqual([
            'root',
            'root/fruits',
            'root/fruits/apples',
            'root/fruits/apples/fuji',
            'root/vegetables',
        ]);
    });

    test('DELETE directory', () => {
        service.create('fruits/apples');
        service.delete('fruits/apples');

        expect(service.list()).toEqual(['root', 'root/fruits']);
    });

    test('MOVE directory', () => {
        service.create('fruits/apples');
        service.create('vegetables');

        service.move('fruits/apples', 'vegetables');

        expect(service.list()).toEqual([
            'root',
            'root/fruits',
            'root/vegetables',
            'root/vegetables/apples',
        ]);
    });
});
