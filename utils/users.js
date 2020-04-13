const users = [];

function userJoin(id, username, room) {
  const user = { id, username, room };
  users.push(user);
  return user;
}

function getCurrentUser(id) {
  const user = users.find((user) => user.id === id);
  return user;
}

function userLeave(id) {
  const user = users.find((user) => user.id === id);
  const index = users.indexOf(user);
  users.splice(index, 1);
  return user;
}

function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
};
