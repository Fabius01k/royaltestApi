import express from 'express';
import catalogRouter from './routes/catalogRouter';
import { Command } from 'commander';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/catalog', catalogRouter);

function startServer() {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

function startCLI() {
    const program = new Command();

    program
        .name('RoyalTest')
        .description('Приложение для управления древовидной структурой каталогов')
        .version('1.0.0');

    program
        .command('create')
        .description('Создать директорию')
        .argument('<path>', 'путь к директории')
        .action((path) => {
            console.log(`Создана директория: ${path}`);
        });

    program
        .command('move')
        .description('Переместить директорию')
        .argument('<source>', 'источник')
        .argument('<target>', 'цель')
        .action((source, target) => {
            console.log(`Перемещена директория из ${source} в ${target}`);
        });

    program
        .command('delete')
        .description('Удалить директорию')
        .argument('<path>', 'путь к директории')
        .action((path) => {
            console.log(`Удалена директория: ${path}`);
        });

    program
        .command('list')
        .description('Вывести список директорий')
        .action(() => {
            console.log('Список директорий:');
        });

    program.parse();
}
if (process.argv.length > 2) {
    startCLI();
} else {
    startServer();
}

