async function validateRoleUser(role){
  if(role === undefined || role === null || role === ""){
    throw new Error('Please provide a role user');
  }
}

module.exports = { validateRoleUser }