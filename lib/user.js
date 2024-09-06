import db from "./db";
export function createUser(email, password) {
  const result = db
    .prepare("INSERT INTO users(email, password) VALUES(?,?)")
    .run(email, password);
  return result.lastInsertId;
}

export function getUserByEmail(email) {
  const stmt = db.prepare("SELECT * from users where email = ?");
  const result = stmt.get(email);
  return result;
}
