import sqlite3
import json
from app.models.Status import Status
from app.models.Tasks import Tasks
DB_NAME = "board.db"

class Database():
    def __init__(self):
        print("Ininit")
        self.conn = sqlite3.connect(DB_NAME)
        self.conn.row_factory = sqlite3.Row
        self.cursor = self.conn.cursor()
        self.create_table()

    def create_table(self):
        self.cursor.execute('''
        CREATE TABLE IF NOT EXISTS status (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        status_index INT,
        title TEXT
        )
        ''')
        self.conn.commit()

        self.cursor.execute('''
        CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        status_id INT,
        task_index INT,
        summary TEXT,
        description TEXT,
        assignee TEXT,
        FOREIGN KEY (status_id) REFERENCES status(id)
        )
        ''')
        self.conn.commit()
    
    def create_status(self, status : Status):
        index = len(self.cursor.execute(
            "SELECT * FROM status").fetchall())
        self.cursor.execute(
        "INSERT INTO status (status_index, title) VALUES (?, ?)", 
        (index, status.title)
        )
        self.conn.commit()

    def create_task(self, task: Tasks):
        try:
            index = len(self.cursor.execute(
                "SELECT * FROM tasks WHERE status_id = ?", (task.status_id,)).fetchall())

            self.cursor.execute(
                '''INSERT INTO tasks (
                status_id, 
                task_index, 
                summary, 
                description, 
                assignee) VALUES
                (?, ?, ?, ?, ?)''',
                (task.status_id, index, task.summary, task.description, task.assignee)
            )
            task_id = self.cursor.lastrowid
            self.conn.commit()
            return {"index": index, "id": task_id}
        except sqlite3.Error as e:
            print(f"Database error during create_task: {e}")
        except Exception as e:
            print(f"Unexpected error during create_task: {e}")

    def get(self):
        status = self.cursor.execute('''
                    SELECT * FROM status
                    ORDER BY status_index
                ''').fetchall()

        tasks = self.cursor.execute('''
            SELECT * FROM tasks
            ORDER BY status_id
        ''').fetchall()
        status_result = [dict(row) for row in status]
        tasks_result = [dict(row) for row in tasks]
        return {"data": {"status":status_result, "tasks" : tasks_result}}
        