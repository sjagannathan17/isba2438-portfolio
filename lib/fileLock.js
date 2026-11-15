const locks = new Map();

export function withFileLock(filePath, task) {
  const previous = locks.get(filePath) ?? Promise.resolve();
  const next = previous.then(task, task);
  locks.set(filePath, next);
  return next;
}
