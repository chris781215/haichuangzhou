-- 海创周 H5 · D1 数据库初始化脚本
-- 运行一次即可（重复运行安全）

CREATE TABLE IF NOT EXISTS checkins (
  id     INTEGER PRIMARY KEY AUTOINCREMENT,
  name   TEXT NOT NULL,
  t      INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS messages (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  label TEXT    DEFAULT '🙂',
  name  TEXT    DEFAULT '',
  text  TEXT    NOT NULL,
  t     INTEGER NOT NULL
);
