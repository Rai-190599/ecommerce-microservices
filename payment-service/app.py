# pyrefly: ignore [missing-import]
from flask import Flask, jsonify
from flask_cors import CORS
import psycopg2

app = Flask(__name__)
CORS(app)

def get_db():
    return psycopg2.connect(host="postgresdb", database="ecommerce", user="admin", password="adminpassword")

@app.route('/payments', methods=['GET'])
def get_payments():
    try:
        conn = get_db()
        cur = conn.cursor()
        cur.execute('CREATE TABLE IF NOT EXISTS payments (id serial PRIMARY KEY, amount integer, status varchar(50));')
        cur.execute('SELECT COUNT(*) FROM payments')
        if cur.fetchone()[0] == 0:
            cur.execute("INSERT INTO payments (amount, status) VALUES (5000, 'Success')")
        conn.commit()
        cur.execute('SELECT * FROM payments')
        payments = [{"id": row[0], "amount": row[1], "status": row[2]} for row in cur.fetchall()]
        return jsonify(payments)
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3003)