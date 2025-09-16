export default async function bibliotecarioRoutes(app) {
    // Schema de validação para corpo (body)
    const bibliotecarioBodySchema = {
        type: 'object',
        required: ['nome', 'email'],
        properties: {
            nome: { type: 'string', minLength: 1 },
            email: { type: 'string', minLength: 5 },
            endereco: { type: 'string' },
            nascimento: { type: 'string', format: 'date' }
        }
    };

    // Schema de validação para parâmetro de rota (id)
    const idParamSchema = {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'string', pattern: '^[0-9]+$' }
        }
    };

    // CREATE (POST)
    app.post('/bibliotecarios', { schema: { body: bibliotecarioBodySchema } }, async (req, reply) => {
        const { nome, email, endereco, nascimento } = req.body;

        const bibliotecario = await app.prisma.bibliotecario.create({
            data: { 
                nome, 
                email, 
                endereco, 
                nascimento: nascimento ? new Date(nascimento) : null
            }
        });

        return reply.code(201).send(bibliotecario);
    });

    // READ (GET) (lista)
    app.get('/bibliotecarios', async (req, reply) => {
        const bibliotecarios = await app.prisma.bibliotecario.findMany({
            orderBy: { id: 'asc' }
        });
        return reply.send(bibliotecarios);
    });

    // UPDATE (PUT)
    app.put('/bibliotecarios/:id', { schema: { params: idParamSchema, body: bibliotecarioBodySchema } }, async (req, reply) => {
        const { id } = req.params;
        const { nome, email, endereco, nascimento } = req.body;

        try {
            const updatedBibliotecario = await app.prisma.bibliotecario.update({
                where: { id: parseInt(id) },
                data: { 
                    nome, 
                    email, 
                    endereco, 
                    nascimento: nascimento ? new Date(nascimento) : null
                }
            });
            return reply.send(updatedBibliotecario);
        } catch (error) {
            return reply.code(404).send({ error: 'Bibliotecário não encontrado' });
        }
    });

    // DELETE (DELETE)
    app.delete('/bibliotecarios/:id', { schema: { params: idParamSchema } }, async (req, reply) => {
        const { id } = req.params;

        try {
            await app.prisma.bibliotecario.delete({
                where: { id: parseInt(id) }
            });
            return reply.code(204).send();
        } catch (error) {
            return reply.code(404).send({ error: 'Bibliotecário não encontrado' });
        }
    });
}