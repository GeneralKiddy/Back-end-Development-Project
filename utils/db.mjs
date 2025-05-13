import { Pool } from 'pg';

const connectionPool = new Pool({
    connectionString: "postgresql://postgres:Art123@localhost:5432/books"
});

export default connectionPool;