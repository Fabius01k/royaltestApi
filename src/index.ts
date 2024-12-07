import express from 'express';
import catalogRouter from './routes/catalogRouter';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/catalog', catalogRouter);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
