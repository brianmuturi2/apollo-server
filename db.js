const { DataSource } = require("apollo-datasource");
const sqlite = require("sqlite3");

const createDatabase = () => {
    return new Promise((resolve, reject) => {
        const db = new sqlite.Database('./storage.db', sqlite.OPEN_READWRITE, (err) => {
            if (err) {
                console.log('CREATE ERR ', err)
                return reject(err);
            }
            resolve(db);
        });
    });
};

class Db extends DataSource {
    async initialize() {
        this.db = await createDatabase();
        // do not change schema initialization it is here to provide an overview of data structures
        await this.executeCommand(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY, 
        deliveryAddress TEXT NOT NULL,
        total REAL NOT NULL,
        items TEXT NOT NULL,
        discountCode TEXT,
        comment TEXT,
        status STRING NOT NULL
        );`);

        await this.executeCommand(`INSERT or REPLACE INTO orders (
        id,
        deliveryAddress,
        total,
        items,
        discountCode,
        comment,
        status
        )
        VALUES
            (0, 'PO Box 66166', 83.55, '1,2', 'Visionary executive focus group', 'Proactive maximized standardization', 'Mr'),
            (1, 'Suite 47', 53.25, '3,4', 'Right-sized mission-critical firmware', 'Synchronised fresh-thinking solution', 'Mrs'),
            (2, 'Room 923', 78.35, '5,6', 'Customizable exuding challenge', 'Intuitive tertiary capacity', 'Dr'),
            (3, 'Apt 684', 50.25, '7,8', 'Quality-focused asynchronous ability', 'Adaptive object-oriented algorithm', 'Mrs'),
            (4, 'PO Box 89685', 40.10, '9,10', 'Inverse well-modulated policy', 'Organic context-sensitive projection', 'Mr');
        `)
    }

    close() {
        this.db.close();
    }

    executeQuery(query) {
        return new Promise((resolve, reject) => {
            this.db.all(query, (err, rows) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        });
    }

    executeCommand(command) {
        return new Promise((resolve, reject) => {
            this.db.run(command, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }

    getOrders() {
        return new Promise((resolve, reject) => {
            this.db.all("SELECT * FROM orders", (err, rows) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        });
    }

    getOrder(id) {
        return new Promise((resolve, reject) => {
            this.db.get(`SELECT * FROM orders WHERE id=${id}`, (err, rows) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        });
    }

    updateOrderStatus(id, status) {
        return this.executeCommand(
            `UPDATE orders SET status='${status}' WHERE id=${id}`
        );
    }
}

const db = new Db();

module.exports = db;
