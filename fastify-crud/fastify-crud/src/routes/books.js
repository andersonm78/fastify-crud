export default async function booksRoutes(app) {
    // Schemas simples de validação (JSON Schema)

    const bookBodySchema = {
        type: 'object',
        required: ['title', 'author'],
        properties: {
            title: { type: 'string', minLength: 1 },
            author: { type: 'string', minLength: 1 }
        }
    };

    const idParamSchema = {
        type: 'object',
        required: ['id'],
        properties: {
            // Mantemos como string e convertemos manualmente
            id: { type: 'string', pattern: '^[0-9]+$' }
        }
    };

    // CREATE (POST)
    app.post('/books', { schema: { body: bookBodySchema } }, async (req, reply) => {
        const { title, author } = req.body;
        const book = await app.prisma.book.create({ data: { title, author } });
        return reply.code(201).send(book);
    });

    // READ (GET) (lista)
    app.get('/books', async (req, reply) => {
        const books = await app.prisma.book.findMany({
            orderBy: { id: 'asc' }
        });
        return reply.send(books);
    });

    // UPDATE (PUT)
    app.put('/books/:id', { schema: { params: idParamSchema, body: bookBodySchema } }, async (req, reply) => {
        const { id } = req.params;
        const { title, author } = req.body;

        try {
            const updatedBook = await app.prisma.book.update({
                where: { id: parseInt(id) },
                data: { title, author }
            });
            return reply.send(updatedBook);
        } catch (error) {
            return reply.code(404).send({ error: 'Livro não encontrado' });
        }
    });

    // DELETE (DELETE)
    app.delete('/books/:id', { schema: { params: idParamSchema } }, async (req, reply) => {
        const { id } = req.params;

        try {
            await app.prisma.book.delete({
                where: { id: parseInt(id) }
            });
            return reply.code(204).send(); // sem conteúdo
        } catch (error) {
            return reply.code(404).send({ error: 'Livro não encontrado' });
        }
    });
}